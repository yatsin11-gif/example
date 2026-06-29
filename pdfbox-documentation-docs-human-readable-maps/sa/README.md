# SA Workflow

В этой директории хранятся бизнес-требования, артефакты декомпозиции и документы для передачи в реализацию.

## Рекомендуемый поток

1. SA пишет или вставляет сырое описание фичи по шаблону `templates/feature-spec.md`.
2. Codex преобразует его в валидируемую постановочную документацию в `docs/...`.
3. SA проверяет документ и исправляет бизнес-пробелы.
4. Codex преобразует утвержденные требования в explicit criteria.
5. Team Lead или senior DEV декомпозирует criteria в задачи.
6. Team Lead и DEV валидируют границы задач, зависимости и риски.
7. Codex подготавливает Jira-ready task specs по `templates/jira-task-spec.md`.
8. Codex подготавливает QA-owned test case drafts, coverage matrix и sync intent для будущего Qase sync.
9. QA проверяет test cases и решает, готовы ли они к будущему Qase sync.
10. Для каждой утвержденной implementation task Codex подготавливает ExecPlan в целевом репозитории в `/.agent/plans/`.
11. DEV реализует задачу, используя ExecPlan как источник истины.

## Типы документов

- `docs/.../requirements/*.md`: утвержденные feature specs и criteria documents
- `docs/.../tasks/*.md`: декомпозиция и список задач
- `docs/.../jira/*.md`: Jira-ready task specs
- `docs/.../qa/*.md|*.yaml`: test case drafts, coverage matrix и sync intent для QA review
- `prompts/*.md`: готовые промпты для SA, TL и DEV
- target repository `/.agent/plans/*.md`: implementation plan для DEV

Перед стартом новой инициативы прочитай [process/ai-delivery-workflow.md](./process/ai-delivery-workflow.md).
Чтобы выбрать правильный промпт для роли, используй [prompts/README.md](./prompts/README.md).
Skill map:
- [sa-workflow](./../.codex/skills/sa-workflow/SKILL.md): навигатор по этапам процесса
- [sa-feature-spec](./../.codex/skills/sa-feature-spec/SKILL.md): свободный текст SA -> feature spec
- [sa-requirements-criteria](./../.codex/skills/sa-requirements-criteria/SKILL.md): feature spec -> criteria
- [sa-jira-decomposition](./../.codex/skills/sa-jira-decomposition/SKILL.md): criteria -> task breakdown + Jira-ready specs
- [qa-test-cases](./../.codex/skills/qa-test-cases/SKILL.md): criteria -> QA test case drafts + coverage matrix
- [dev-jira-plan](./../.codex/skills/dev-jira-plan/SKILL.md): Jira-ready spec -> ExecPlan
- [sa-cartographer](./../.codex/skills/sa-cartographer/SKILL.md): держит SYSTEM-MAP.md, PROGRESS.md и SVG-схемы в актуальном состоянии

Человеческий вход в документацию: [docs/README.md](./docs/README.md) (картинка процесса + карта фич).
