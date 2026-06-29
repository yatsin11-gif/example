#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import yaml from "js-yaml";

const DEFAULT_API_BASE = "https://api.qase.io/v1";
const MATRIX_FILE_NAME = "test-matrix.yaml";
const TEST_CASES_FILE_NAME = "test-cases.md";
const SKIP_DIRS = new Set([".git", "node_modules", ".codex/plugins/cache"]);

const FIELD_MAPS = {
  status: {
    actual: 0,
    active: 0,
    draft: 1,
    deprecated: 2
  },
  priority: {
    high: 1,
    medium: 2,
    low: 3
  },
  severity: {
    blocker: 1,
    critical: 2,
    major: 3,
    normal: 4,
    minor: 5,
    trivial: 6
  },
  behavior: {
    positive: 2,
    negative: 3,
    destructive: 4
  },
  type: {
    other: 1,
    functional: 8,
    smoke: 2,
    regression: 3,
    security: 4,
    usability: 5,
    performance: 6,
    acceptance: 7,
    compatibility: 9,
    integration: 10,
    exploratory: 11
  },
  layer: {
    e2e: 1,
    api: 2,
    unit: 3
  },
  automation: {
    manual: 0,
    is_not_automated: 0,
    not_automated: 0,
    to_be_automated: 1,
    automated: 2
  }
};

const SYNC_ACTIONS = new Set(["create", "update", "none", "skip"]);

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const matrixFiles = options.matrixFiles.length > 0
    ? options.matrixFiles.map((file) => path.resolve(file))
    : await findMatrixFiles(process.cwd());

  if (matrixFiles.length === 0) {
    throw new Error("No qa/test-matrix.yaml files were found.");
  }

  const qase = options.write || options.checkRemote
    ? new QaseClient({
        apiBase: options.apiBase,
        token: requireToken()
      })
    : null;

  let hasErrors = false;

  for (const matrixFile of matrixFiles) {
    try {
      await syncMatrixFile(matrixFile, options, qase);
    } catch (error) {
      hasErrors = true;
      console.error(`\n[qase-sync] ${path.relative(process.cwd(), matrixFile)} failed`);
      console.error(error.message);
    }
  }

  if (hasErrors) {
    process.exitCode = 1;
  }
}

function parseArgs(args) {
  const options = {
    write: false,
    dryRun: true,
    checkRemote: false,
    apiBase: process.env.QASE_API_BASE || DEFAULT_API_BASE,
    matrixFiles: []
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--write") {
      options.write = true;
      options.dryRun = false;
      continue;
    }

    if (arg === "--dry-run") {
      options.dryRun = true;
      options.write = false;
      continue;
    }

    if (arg === "--check-remote") {
      options.checkRemote = true;
      continue;
    }

    if (arg === "--matrix") {
      const file = args[index + 1];
      if (!file) {
        throw new Error("--matrix requires a file path.");
      }
      options.matrixFiles.push(file);
      index += 1;
      continue;
    }

    if (arg.startsWith("--matrix=")) {
      options.matrixFiles.push(arg.slice("--matrix=".length));
      continue;
    }

    if (arg.startsWith("--api-base=")) {
      options.apiBase = arg.slice("--api-base=".length);
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function printHelp() {
  console.log(`Usage:
  node scripts/qase-sync.js --dry-run
  node scripts/qase-sync.js --write
  node scripts/qase-sync.js --write --matrix sa/docs/editor/ocr-editable-documents/qa/test-matrix.yaml

Options:
  --dry-run        Parse local QA artifacts and print the planned Qase changes.
  --write          Create/update Qase suites and cases, then update test-matrix.yaml IDs/statuses.
  --check-remote   In dry-run mode, use Qase API to validate suite mapping.
  --matrix <path>  Sync only the given matrix file. Can be repeated.
  --api-base=<url> Override Qase API base URL. Defaults to ${DEFAULT_API_BASE}.

Environment:
  QASE_API_TOKEN   Required for --write and --check-remote.
  QASE_API_BASE    Optional Qase API base URL override.
`);
}

async function syncMatrixFile(matrixFile, options, qase) {
  const relativeMatrixFile = path.relative(process.cwd(), matrixFile);
  const matrixDir = path.dirname(matrixFile);
  const casesMarkdownFile = path.join(matrixDir, TEST_CASES_FILE_NAME);
  const matrix = await readYamlFile(matrixFile);
  const casesMarkdown = await readTextFile(casesMarkdownFile);
  const markdownCases = parseTestCasesMarkdown(casesMarkdown);
  const cases = mergeCases(matrix, markdownCases);
  const actionableCases = cases.filter((testCase) => testCase.sync_action === "create" || testCase.sync_action === "update");
  const validation = validateMatrix(matrix, cases, relativeMatrixFile);

  if (validation.errors.length > 0) {
    throw new Error(validation.errors.map((error) => `- ${error}`).join("\n"));
  }

  console.log(`\n[qase-sync] ${relativeMatrixFile}`);
  console.log(`mode: ${options.write ? "write" : "dry-run"}`);
  console.log(`feature: ${matrix.feature?.id || "(missing feature id)"}`);
  console.log(`project: ${matrix.qase?.project}`);
  console.log(`suite: ${matrix.qase?.suite}`);

  if (validation.warnings.length > 0) {
    console.log("warnings:");
    for (const warning of validation.warnings) {
      console.log(`- ${warning}`);
    }
  }

  let suiteId = normalizeOptionalNumber(matrix.qase?.suite_id);

  if (qase) {
    if (options.write && actionableCases.length === 0) {
      console.log("sync: no actionable cases, skipping remote write");
    } else {
      suiteId = await ensureSuite(qase, matrix, options);
    }
  } else {
    console.log("remote: skipped (no --write or --check-remote)");
  }

  if (!suiteId && options.write && actionableCases.length > 0) {
    throw new Error("Could not resolve or create Qase suite.");
  }

  const plannedActions = cases.map((testCase) => ({
    localId: testCase.local_id,
    action: testCase.sync_action,
    qaseCase: testCase.qase_case_id || null,
    title: testCase.title
  }));

  for (const action of plannedActions) {
    const target = action.qaseCase ? ` ${action.qaseCase}` : "";
    console.log(`${action.action}:${target} ${action.localId} ${action.title}`);
  }

  if (!options.write) {
    return;
  }

  const syncedAt = new Date().toISOString();
  const syncedCaseIds = new Map();
  matrix.qase.suite_id = suiteId;
  matrix.qase.sync_blockers = removeBlocker(matrix.qase.sync_blockers, "qase_suite_not_created");

  for (const testCase of actionableCases) {
    const existingCaseId = parseQaseCaseNumber(matrix.qase.project, testCase.qase_case_id);
    const payload = buildQaseCasePayload(matrix, testCase, {
      suiteId,
      includeSuiteId: !existingCaseId
    }, relativeMatrixFile);
    const result = existingCaseId
      ? await qase.updateCase(matrix.qase.project, existingCaseId, payload)
      : await qase.createCase(matrix.qase.project, payload);
    const qaseCaseId = normalizeCreatedCaseId(matrix.qase.project, result, existingCaseId);

    updateCaseMapping(matrix, testCase.local_id, {
      qaseCaseId,
      syncStatus: "synced",
      syncAction: "none",
      syncedAt
    });
    syncedCaseIds.set(testCase.local_id, qaseCaseId);
    console.log(`synced: ${testCase.local_id} -> ${qaseCaseId}`);
  }

  matrix.qase.sync_status = "synced";
  matrix.qase.last_synced_at = syncedAt;
  matrix.qase.sync_blockers = normalizeBlockers(matrix.qase.sync_blockers);

  await writeYamlFile(matrixFile, matrix);
  await fs.writeFile(casesMarkdownFile, updateMarkdownQaseCaseIds(casesMarkdown, syncedCaseIds), "utf8");
  console.log(`updated: ${relativeMatrixFile}`);
}

async function ensureSuite(qase, matrix, options) {
  const projectCode = matrix.qase.project;
  const suitePath = splitSuitePath(matrix.qase.suite);
  const leafTitle = suitePath.at(-1);
  let suiteId = normalizeOptionalNumber(matrix.qase.suite_id);

  if (suiteId) {
    console.log(`suite: using existing id ${suiteId}`);
    return suiteId;
  }

  const parentSuiteId = await resolveParentSuiteId(qase, matrix, options);
  const suites = await qase.listSuites(projectCode, leafTitle);
  const matchedSuite = suites.find((suite) => {
    if (suite.title !== leafTitle) {
      return false;
    }

    if (parentSuiteId) {
      return Number(suite.parent_id || 0) === parentSuiteId;
    }

    return true;
  });

  if (matchedSuite) {
    console.log(`suite: found ${matchedSuite.id} ${leafTitle}`);
    return Number(matchedSuite.id);
  }

  if (!options.write) {
    console.log(`suite: would create ${leafTitle}${parentSuiteId ? ` under ${parentSuiteId}` : ""}`);
    return null;
  }

  const result = await qase.createSuite(projectCode, {
    title: leafTitle,
    parent_id: parentSuiteId || null,
    description: buildSuiteDescription(matrix)
  });

  suiteId = normalizeCreatedSuiteId(result);
  console.log(`suite: created ${suiteId} ${leafTitle}`);
  return suiteId;
}

async function resolveParentSuiteId(qase, matrix, options) {
  const explicitParentSuiteId = normalizeOptionalNumber(matrix.qase.parent_suite_id);
  if (explicitParentSuiteId) {
    return explicitParentSuiteId;
  }

  const parentSuiteTitle = normalizeOptionalString(matrix.qase.parent_suite);
  if (!parentSuiteTitle) {
    return null;
  }

  const parentSuites = await qase.listSuites(matrix.qase.project, parentSuiteTitle);
  const matchedParentSuite = parentSuites.find((suite) => suite.title === parentSuiteTitle);

  if (matchedParentSuite) {
    console.log(`parent suite: found ${matchedParentSuite.id} ${parentSuiteTitle}`);
    return Number(matchedParentSuite.id);
  }

  if (!options.write) {
    console.log(`parent suite: ${parentSuiteTitle} not found`);
    return null;
  }

  throw new Error(`Parent suite not found: ${parentSuiteTitle}. Set qase.parent_suite_id or create the suite in Qase first.`);
}

function buildQaseCasePayload(matrix, testCase, { suiteId, includeSuiteId }, relativeMatrixFile) {
  return dropUndefined({
    title: testCase.title,
    suite_id: includeSuiteId ? suiteId : undefined,
    status: mapEnum("status", testCase.status, FIELD_MAPS.status.draft),
    priority: mapEnum("priority", testCase.priority),
    severity: mapEnum("severity", testCase.severity),
    behavior: mapEnum("behavior", testCase.behavior),
    type: mapEnum("type", testCase.type),
    layer: mapEnum("layer", testCase.layer),
    automation: mapEnum("automation", testCase.automation_status),
    is_flaky: testCase.is_flaky ? 1 : 0,
    description: buildCaseDescription(matrix, testCase, relativeMatrixFile),
    preconditions: formatList(testCase.preconditions),
    postconditions: formatList(testCase.postconditions),
    steps_type: "classic",
    steps: testCase.steps.map((step) => dropUndefined({
      action: step.action,
      data: step.data || formatList(testCase.test_data),
      expected_result: step.expected_result
    })),
    tags: normalizeStringArray(testCase.tags)
  });
}

function buildCaseDescription(matrix, testCase, relativeMatrixFile) {
  const lines = [
    `Generated from pdfbox-documentation.`,
    ``,
    `Feature: ${matrix.feature?.id || ""} - ${matrix.feature?.name || ""}`.trim(),
    `Local test case: ${testCase.local_id}`,
    `Source matrix: ${relativeMatrixFile}`,
    `Source test cases: ${path.posix.join(path.posix.dirname(relativeMatrixFile), TEST_CASES_FILE_NAME)}`,
    ``,
    `Related criteria:`,
    ...normalizeStringArray(testCase.related_criteria).map((item) => `- ${item}`),
    ``,
    `Related Jira:`,
    ...normalizeStringArray(testCase.related_jira).map((item) => `- ${item}`),
    ``,
    `Notes:`,
    ...formatBlockAsList(testCase.notes)
  ];

  return lines.join("\n").trim();
}

function buildSuiteDescription(matrix) {
  const sources = matrix.sources || {};
  const sourceLines = [
    sources.feature_spec ? `- Feature spec: ${sources.feature_spec}` : null,
    sources.criteria ? `- Criteria: ${sources.criteria}` : null,
    sources.task_breakdown ? `- Task breakdown: ${sources.task_breakdown}` : null
  ].filter(Boolean);

  return [
    `Synced from pdfbox-documentation.`,
    ``,
    `Feature: ${matrix.feature?.id || ""} - ${matrix.feature?.name || ""}`.trim(),
    ``,
    `Sources:`,
    ...sourceLines
  ].join("\n").trim();
}

function parseTestCasesMarkdown(markdown) {
  const headingRegex = /^### (TC-\d+):\s+(.+)$/gm;
  const matches = [...markdown.matchAll(headingRegex)];
  const cases = new Map();

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const nextMatch = matches[index + 1];
    const localId = match[1];
    const title = match[2].trim();
    const bodyStart = match.index + match[0].length;
    const bodyEnd = nextMatch ? nextMatch.index : markdown.length;
    const body = markdown.slice(bodyStart, bodyEnd);
    const sections = parseCaseSections(body);
    const fields = parseCaseFields(body);

    cases.set(localId, {
      local_id: localId,
      title,
      status: fields.get("Status"),
      type: fields.get("Type"),
      priority: fields.get("Priority"),
      severity: fields.get("Severity"),
      behavior: fields.get("Behavior"),
      layer: fields.get("Layer"),
      suite: stripBackticks(fields.get("Suite")),
      qase_case_id: stripBackticks(fields.get("Qase case")),
      tags: parseInlineTags(fields.get("Tags")),
      automation_status: normalizeToken(fields.get("Automation status")),
      preconditions: parseListSection(sections.get("Preconditions")),
      test_data: parseListSection(sections.get("Test Data")),
      postconditions: parseListSection(sections.get("Postconditions")),
      steps: parseStepsSection(sections.get("Steps")),
      notes: parseListSection(sections.get("Notes"))
    });
  }

  return cases;
}

function updateMarkdownQaseCaseIds(markdown, syncedCaseIds) {
  const headingRegex = /^### (TC-\d+):\s+.+$/gm;
  const matches = [...markdown.matchAll(headingRegex)];

  if (matches.length === 0) {
    return markdown;
  }

  let output = "";
  let cursor = 0;

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const nextMatch = matches[index + 1];
    const localId = match[1];
    const start = match.index;
    const end = nextMatch ? nextMatch.index : markdown.length;
    let block = markdown.slice(start, end);
    const qaseCaseId = syncedCaseIds.get(localId);

    output += markdown.slice(cursor, start);

    if (!qaseCaseId) {
      output += block;
      cursor = end;
      continue;
    }

    if (/^- Qase case:.*$/m.test(block)) {
      block = block.replace(/^- Qase case:.*$/m, `- Qase case: \`${qaseCaseId}\``);
    } else {
      block = block.replace(/^(- Tags:.*)$/m, `- Qase case: \`${qaseCaseId}\`\n$1`);
    }

    output += block;
    cursor = end;
  }

  return output + markdown.slice(cursor);
}

function parseCaseSections(body) {
  const headingRegex = /^#### (.+)$/gm;
  const matches = [...body.matchAll(headingRegex)];
  const sections = new Map();

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const nextMatch = matches[index + 1];
    const name = match[1].trim();
    const start = match.index + match[0].length;
    const end = nextMatch ? nextMatch.index : body.length;
    sections.set(name, body.slice(start, end).trim());
  }

  return sections;
}

function parseCaseFields(body) {
  const beforeSections = body.split(/^#### /m)[0];
  const fields = new Map();
  const fieldRegex = /^- ([^:\n]+):[ \t]*(.*)$/gm;

  for (const match of beforeSections.matchAll(fieldRegex)) {
    fields.set(match[1].trim(), match[2].trim());
  }

  return fields;
}

function parseStepsSection(section) {
  if (!section) {
    return [];
  }

  const lines = section.split(/\r?\n/);
  const steps = [];
  let currentStep = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const actionMatch = line.match(/^\d+\.\s+Action:\s*(.+)$/);
    const expectedMatch = line.match(/^\s*Expected result:\s*(.+)$/);

    if (actionMatch) {
      currentStep = {
        action: actionMatch[1].trim(),
        expected_result: ""
      };
      steps.push(currentStep);
      continue;
    }

    if (expectedMatch && currentStep) {
      currentStep.expected_result = expectedMatch[1].trim();
    }
  }

  return steps.filter((step) => step.action && step.expected_result);
}

function parseListSection(section) {
  if (!section) {
    return [];
  }

  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter((line) => line && line !== "-");
}

function mergeCases(matrix, markdownCases) {
  const cases = [];

  for (const matrixCase of matrix.test_cases || []) {
    const markdownCase = markdownCases.get(matrixCase.local_id) || {};
    cases.push({
      ...markdownCase,
      ...matrixCase,
      title: matrixCase.title || markdownCase.title,
      status: matrixCase.status || markdownCase.status,
      type: matrixCase.type || markdownCase.type,
      priority: matrixCase.priority || markdownCase.priority,
      severity: matrixCase.severity || markdownCase.severity,
      behavior: matrixCase.behavior || markdownCase.behavior,
      layer: matrixCase.layer || markdownCase.layer,
      suite: matrixCase.suite || markdownCase.suite,
      qase_case_id: matrixCase.qase_case_id || markdownCase.qase_case_id,
      sync_action: normalizeSyncAction(matrixCase.sync_action),
      tags: normalizeStringArray(matrixCase.tags).length > 0 ? matrixCase.tags : markdownCase.tags,
      automation_status: matrixCase.automation_status || markdownCase.automation_status,
      preconditions: matrixCase.preconditions || markdownCase.preconditions || [],
      test_data: matrixCase.test_data || markdownCase.test_data || [],
      postconditions: matrixCase.postconditions || markdownCase.postconditions || [],
      steps: matrixCase.steps || markdownCase.steps || [],
      notes: matrixCase.notes || markdownCase.notes || [],
      related_criteria: matrixCase.related_criteria || [],
      related_jira: matrixCase.related_jira || []
    });
  }

  return cases;
}

function validateMatrix(matrix, cases, relativeMatrixFile) {
  const errors = [];
  const warnings = [];
  const localIds = new Set();

  if (!matrix.feature?.id) {
    warnings.push("feature.id is empty.");
  }

  if (!matrix.qase?.project) {
    errors.push("qase.project is required.");
  }

  if (!matrix.qase?.suite) {
    errors.push("qase.suite is required.");
  }

  if (matrix.qase?.parent_suite && matrix.qase?.parent_suite_id) {
    warnings.push("qase.parent_suite and qase.parent_suite_id are both set. parent_suite_id will be used.");
  }

  if (!Array.isArray(matrix.test_cases) || matrix.test_cases.length === 0) {
    errors.push("test_cases must contain at least one test case.");
  }

  for (const testCase of cases) {
    if (!testCase.local_id) {
      errors.push("Each test case must have local_id.");
      continue;
    }

    if (localIds.has(testCase.local_id)) {
      errors.push(`Duplicate local_id: ${testCase.local_id}.`);
    }
    localIds.add(testCase.local_id);

    if (!testCase.title) {
      errors.push(`${testCase.local_id}: title is required.`);
    }

    if (!SYNC_ACTIONS.has(testCase.sync_action)) {
      warnings.push(`${testCase.local_id}: sync_action is missing or invalid; defaulting to none.`);
    }

    if (testCase.sync_action === "create" && parseQaseCaseNumber(matrix.qase.project, testCase.qase_case_id)) {
      errors.push(`${testCase.local_id}: sync_action=create requires empty qase_case_id.`);
    }

    if (testCase.sync_action === "update" && !parseQaseCaseNumber(matrix.qase.project, testCase.qase_case_id)) {
      errors.push(`${testCase.local_id}: sync_action=update requires qase_case_id.`);
    }

    if (!Array.isArray(testCase.steps) || testCase.steps.length === 0) {
      errors.push(`${testCase.local_id}: steps were not found. Check ${path.posix.join(path.posix.dirname(relativeMatrixFile), TEST_CASES_FILE_NAME)}.`);
    }

    if (!Array.isArray(testCase.related_criteria) || testCase.related_criteria.length === 0) {
      warnings.push(`${testCase.local_id}: related_criteria is empty.`);
    }

    if (normalizeStringArray(testCase.tags).includes("blocked-by-open-question")) {
      warnings.push(`${testCase.local_id}: contains blocked-by-open-question tag and will still sync as draft.`);
    }
  }

  return { errors, warnings };
}

function updateCaseMapping(matrix, localId, { qaseCaseId, syncStatus, syncAction, syncedAt }) {
  for (const testCase of matrix.test_cases || []) {
    if (testCase.local_id === localId) {
      testCase.qase_case_id = qaseCaseId;
      testCase.sync_status = syncStatus;
      testCase.sync_action = syncAction;
      testCase.last_synced_at = syncedAt;
    }
  }

  for (const criterion of matrix.criteria || []) {
    for (const testCase of criterion.test_cases || []) {
      if (testCase.local_id === localId) {
        testCase.qase_case_id = qaseCaseId;
        testCase.sync_status = syncStatus;
        testCase.sync_action = syncAction;
        testCase.last_synced_at = syncedAt;
      }
    }
  }
}

class QaseClient {
  constructor({ apiBase, token }) {
    this.apiBase = apiBase.replace(/\/$/, "");
    this.token = token;
  }

  async listSuites(projectCode, search) {
    const suites = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset)
      });

      if (search) {
        params.set("search", search);
      }

      const data = await this.request("GET", `/suite/${encodeURIComponent(projectCode)}?${params.toString()}`);
      const entities = getEntities(data);
      suites.push(...entities);

      if (entities.length < limit) {
        break;
      }
      offset += limit;
    }

    return suites;
  }

  async createSuite(projectCode, payload) {
    return this.request("POST", `/suite/${encodeURIComponent(projectCode)}`, payload);
  }

  async createCase(projectCode, payload) {
    return this.request("POST", `/case/${encodeURIComponent(projectCode)}`, payload);
  }

  async updateCase(projectCode, caseId, payload) {
    return this.request("PATCH", `/case/${encodeURIComponent(projectCode)}/${caseId}`, payload);
  }

  async request(method, apiPath, body) {
    const response = await fetch(`${this.apiBase}${apiPath}`, {
      method,
      headers: dropUndefined({
        Accept: "application/json",
        "Content-Type": body ? "application/json" : undefined,
        Token: this.token
      }),
      body: body ? JSON.stringify(body) : undefined
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    if (!response.ok) {
      const message = data?.errorMessage || data?.message || text || response.statusText;
      throw new Error(`${method} ${apiPath} failed with ${response.status}: ${message}`);
    }

    return data;
  }
}

function requireToken() {
  const token = process.env.QASE_API_TOKEN;
  if (!token) {
    throw new Error("QASE_API_TOKEN is required for Qase API calls.");
  }
  return token;
}

async function findMatrixFiles(rootDir) {
  const files = [];

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);

      if (entry.isDirectory()) {
        if (!shouldSkipDirectory(relativePath)) {
          await walk(fullPath);
        }
        continue;
      }

      if (entry.isFile() && entry.name === MATRIX_FILE_NAME && path.basename(path.dirname(fullPath)) === "qa") {
        files.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  files.sort();
  return files;
}

function shouldSkipDirectory(relativePath) {
  if (!relativePath) {
    return false;
  }

  return [...SKIP_DIRS].some((skipDir) => relativePath === skipDir || relativePath.startsWith(`${skipDir}${path.sep}`));
}

async function readYamlFile(file) {
  const text = await readTextFile(file);
  return yaml.load(text);
}

async function readTextFile(file) {
  try {
    return await fs.readFile(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`Required file is missing: ${path.relative(process.cwd(), file)}`);
    }
    throw error;
  }
}

async function writeYamlFile(file, data) {
  const content = yaml.dump(data, {
    lineWidth: 100,
    noRefs: true,
    sortKeys: false,
    quotingType: "\""
  });
  await fs.writeFile(file, content, "utf8");
}

function splitSuitePath(suitePath) {
  return String(suitePath || "")
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseQaseCaseNumber(projectCode, qaseCaseId) {
  if (!qaseCaseId) {
    return null;
  }

  if (typeof qaseCaseId === "number") {
    return qaseCaseId;
  }

  const value = String(qaseCaseId).trim();
  const prefixed = value.match(new RegExp(`^${escapeRegExp(projectCode)}-(\\d+)$`, "i"));
  if (prefixed) {
    return Number(prefixed[1]);
  }

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  return null;
}

function normalizeCreatedCaseId(projectCode, result, fallbackId) {
  const unwrapped = unwrapQaseResult(result);
  const id = unwrapped?.id || unwrapped?.case_id || fallbackId;

  if (!id) {
    throw new Error(`Qase response does not contain created case id: ${JSON.stringify(result)}`);
  }

  return `${projectCode}-${id}`;
}

function normalizeCreatedSuiteId(result) {
  const unwrapped = unwrapQaseResult(result);
  const id = unwrapped?.id || unwrapped?.suite_id;

  if (!id) {
    throw new Error(`Qase response does not contain suite id: ${JSON.stringify(result)}`);
  }

  return Number(id);
}

function normalizeOptionalString(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeSyncAction(value) {
  const token = normalizeToken(value || "none");
  return SYNC_ACTIONS.has(token) ? token : "none";
}

function unwrapQaseResult(data) {
  return data?.result || data;
}

function getEntities(data) {
  const result = unwrapQaseResult(data);
  if (Array.isArray(result)) {
    return result;
  }
  return result?.entities || [];
}

function mapEnum(kind, value, fallback) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (typeof value === "number") {
    return value;
  }

  const token = normalizeToken(value);
  return FIELD_MAPS[kind]?.[token] ?? fallback;
}

function normalizeToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");
}

function stripBackticks(value) {
  if (!value) {
    return value;
  }
  return String(value).replace(/^`|`$/g, "").trim();
}

function parseInlineTags(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((tag) => stripBackticks(tag.trim()))
    .filter(Boolean);
}

function formatList(value) {
  const items = normalizeStringArray(value);
  if (items.length === 0) {
    return undefined;
  }
  return items.map((item) => `- ${item}`).join("\n");
}

function formatBlockAsList(value) {
  const items = normalizeStringArray(value);
  return items.length > 0 ? items.map((item) => `- ${item}`) : ["-"];
}

function normalizeStringArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return [String(value).trim()].filter(Boolean);
}

function normalizeOptionalNumber(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function removeBlocker(blockers, blocker) {
  return normalizeStringArray(blockers).filter((item) => item !== blocker);
}

function normalizeBlockers(blockers) {
  const normalized = normalizeStringArray(blockers);
  return normalized.length > 0 ? normalized : [];
}

function dropUndefined(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined)
  );
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main();
