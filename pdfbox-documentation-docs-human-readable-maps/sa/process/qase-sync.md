# Qase Sync

Этот документ описывает CI sync из QA artifacts в Qase.

## Source artifacts

Для каждой feature sync читает:

- `qa/test-matrix.yaml` как источник mapping, Qase suite, local IDs и traceability
- `qa/test-cases.md` как источник preconditions, test data, steps, expected results и notes

`test-matrix.yaml` остается главным файлом для связи:

- local test case ID
- Qase case ID
- criteria section
- Jira-ready spec
- sync status
- sync action

Sync action rules:

- `sync_action: create` — создать новый кейс в Qase
- `sync_action: update` — обновить существующий кейс в Qase
- `sync_action: none` — не выполнять sync для этого кейса
- `sync_action: skip` — явно пропустить кейс при sync

`qase-sync` проходит по всем кейсам в matrix, но отправляет в Qase только кейсы с `sync_action: create` или `sync_action: update`.

Suite placement rules:

- `qase.suite` задает suite, который sync найдет или создаст для feature
- `qase.parent_suite_id` можно задать явно, если suite должен создаваться под конкретным parent
- `qase.parent_suite` можно задать по имени, если parent suite уже существует в Qase
- новые test cases создаются в `qase.suite`
- существующие test cases обновляются по `qase_case_id` без принудительного перемещения обратно в `qase.suite`

## Local commands

Dry-run без обращения к Qase:

```bash
npm run qase:sync:dry-run
```

Dry-run с проверкой Qase suite через API:

```bash
QASE_API_TOKEN=<token> npm run qase:sync -- --dry-run --check-remote
```

Реальный sync:

```bash
QASE_API_TOKEN=<token> npm run qase:sync -- --write
```

Sync одного feature:

```bash
QASE_API_TOKEN=<token> npm run qase:sync -- --write --matrix sa/docs/editor/ocr-editable-documents/qa/test-matrix.yaml
```

## GitLab CI

`.gitlab-ci.yml` содержит два job:

- `qase_sync_dry_run` запускается на merge request и `main`, проверяет локальные QA artifacts
- `sync_qase` запускается вручную только на `main`, создает или обновляет Qase suites/cases

Для `sync_qase` нужна GitLab CI/CD variable:

- `QASE_API_TOKEN`

## What gets updated

При `--write` скрипт:

1. находит или создает Qase suite
2. создает новые Qase cases для local cases с `sync_action: create`
3. обновляет существующие Qase cases для local cases с `sync_action: update`
4. записывает Qase IDs, `sync_status`, `sync_action: none` и `last_synced_at` в `qa/test-matrix.yaml`
5. записывает Qase IDs в `qa/test-cases.md`

CI job сохраняет обновленные QA artifacts как artifacts. Если нужно автоматически сохранять Qase IDs обратно в Git, следующим этапом нужно добавить отдельный bot commit или bot merge request.
