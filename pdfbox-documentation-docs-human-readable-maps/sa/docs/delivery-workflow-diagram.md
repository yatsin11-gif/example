## Delivery Workflow Diagram

Схема процесса поставки фич в `pdfbox-documentation`: от сырых заметок SA до реализации
в целевых репозиториях. Каждый этап = Codex-скилл + human checkpoint. Между этапами
передаётся только handoff-контракт (ссылки на артефакты), а не вся история обсуждений.

Источники: `AGENTS.md`, `sa/README.md`, `sa/process/ai-delivery-workflow.md`,
`sa/process/qase-sync.md`, `.codex/skills/*`.

```mermaid
flowchart TD
    IN["Сырые заметки SA<br/><i>notes · ссылки · скриншоты · тикеты</i>"]

    S1["1. Feature Spec<br/><b>skill: sa-feature-spec</b><br/>→ requirements/feature-spec.md"]
    C1{{"checkpoint: SA утверждает"}}

    S2["2. Criteria<br/><b>skill: sa-requirements-criteria</b><br/>→ requirements/feature-criteria.md"]
    C2{{"checkpoint: SA валидирует"}}

    S3["3. Decomposition<br/><b>skill: sa-jira-decomposition</b><br/>→ tasks/task-breakdown.md<br/>→ jira/*.md (repo scope, deps)"]
    C3{{"checkpoint: Team Lead / DEV"}}

    S4["4. Jira Publish<br/><b>skill: sa-jira-publisher</b><br/>jira/*.md → Jira issue"]
    C4{{"checkpoint: TL / DEV"}}

    S5["5. QA Test Cases<br/><b>skill: qa-test-cases</b><br/>→ qa/test-cases.md<br/>→ qa/test-matrix.yaml"]
    C5{{"checkpoint: QA валидирует"}}

    S55["5.5 Qase Sync (CI)<br/><i>scripts/qase-sync.js</i><br/>manual job sync_qase @ main<br/>create/update Qase suites + cases"]

    S6["6. ExecPlan + Implementation<br/><b>skill: dev-jira-plan</b><br/>→ &lt;target-repo&gt;/.agent/plans/*.md → код"]
    C6{{"checkpoint: DEV ведёт план"}}

    OUT["Целевые репозитории<br/>pdf.box-app · pdf.box-landing<br/>pdf.box-admin · pdfbox-backend"]

    IN --> S1 --> C1 --> S2 --> C2
    C2 -->|трек разработки| S3 --> C3 --> S4 --> C4
    C2 -->|трек QA, параллельно| S5 --> C5 --> S55
    C4 --> S6
    C5 --> S6
    S6 --> C6 --> OUT
```

### Вспомогательный конвейер схем

Mermaid-исходники из `sa/diagrams/` конвертируются в рендеримые `.md` и индекс `SUMMARY.md`.

```mermaid
flowchart LR
    M["sa/diagrams/**/*.mmd<br/>исходные схемы"] --> CV["convert_mmd_to_md.sh"]
    CV --> D["sa/docs/**/*.md<br/>+ SUMMARY.md (рендер в GitLab)"]
```

### Handoff-контракт между этапами

Передаются только ссылки: путь к feature spec, к criteria, к task breakdown,
к QA test cases (если есть), Jira issue key / путь к Jira-ready spec, имя целевого репозитория.

Ключевые правила: агент не создаёт Jira-задачи из сырых заметок, не публикует Qase без
ручного QA-review, не смешивает бизнес-требования с implementation-решениями и не
додумывает недостающую бизнес-логику.
