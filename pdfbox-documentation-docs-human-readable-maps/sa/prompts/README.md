# Prompt Library

В этой папке лежат готовые промпты для основных ролей в delivery flow.

## Как использовать

1. Открой соответствующий документ в `sa/docs/...`.
2. Скопируй промпт для своей роли.
3. Замени placeholders в угловых скобках.
4. Отправь этот текст в Codex в том репозитории, где должна происходить работа.

## Карта промптов

- `sa-requirements-structuring.md`: SA превращает сырые заметки в approved feature spec
- `tl-task-decomposition.md`: Team Lead или senior DEV декомпозирует утвержденные feature spec и criteria в задачи
- `tl-jira-specs.md`: Team Lead готовит Jira-ready issue specs по утвержденным задачам
- `qa-test-cases.md`: QA готовит test case drafts, coverage matrix и `sync_action` mapping по утвержденным criteria
- `dev-execplan-and-implementation.md`: DEV стартует delivery по Jira-ready spec

## Placeholders

- `<REQ_PATH>`: путь к feature spec
- `<TASK_PATH>`: путь к task breakdown
- `<CRITERIA_PATH>`: путь к criteria document
- `<SPEC_PATH>`: путь к Jira-ready spec
- `<JIRA_FOLDER>`: путь к папке с Jira-ready specs
- `<QASE_PROJECT>`: Qase project code, например `PDF`
- `<REPO_NAME>`: один из `pdf.box-app`, `pdf.box-landing`, `pdf.box-admin`, `pdfbox-backend`
- `<ISSUE_KEY>`: Jira issue key, если он уже существует
