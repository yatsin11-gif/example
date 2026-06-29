# QA Prompt: Test Cases

Используй этот промпт после того, как feature spec и criteria document утверждены SA.

```text
Работаем в репозитории `pdfbox-documentation`.

Use $qa-test-cases.

Нужно подготовить QA-owned test case drafts и coverage matrix.

Вход:
- feature spec: <REQ_PATH>
- criteria document: <CRITERIA_PATH>
- task breakdown: <TASK_PATH, если есть>
- Jira specs: <JIRA_FOLDER, если есть>
- Qase project: <QASE_PROJECT, если нужно сопоставить с существующими suites>

Что нужно сделать:
1. Прочитай feature spec и criteria.
2. Создай или обнови `qa/test-cases.md`.
3. Создай или обнови `qa/test-matrix.yaml`.
4. Для каждого criteria зафиксируй покрытие: covered, partial, missing или blocked.
5. Для каждого test case укажи Qase-compatible fields.
6. Для каждого test case в `qa/test-matrix.yaml` выставь `sync_action`:
   - `create` для новых cases без `qase_case_id`
   - `update` для existing cases с `qase_case_id`, если case изменился
   - `none` для unchanged cases
7. Отдельно пометь smoke candidates и automation candidates.
8. Если бизнес-правило неизвестно, не придумывай его, а добавь open question.

Ограничения:
- не создавай и не обновляй Qase cases
- не добавляй новую продуктовую логику
- не удаляй существующие local test case IDs
- не записывай absolute local filesystem paths

Ожидаемый результат:
- `qa/test-cases.md`
- `qa/test-matrix.yaml`
- краткий список coverage gaps и вопросов для QA
```
