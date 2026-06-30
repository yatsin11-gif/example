# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: FRONT - Partner Program. Админ-раздел управления партнёрами
- Priority: High
- Labels: `ai-ready`, `frontend`, `partners`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: администратору нужен интерфейс для создания партнёров, привязки станций и просмотра представления «как у партнёра».
- Link to requirements: `sa/docs/partners/partner-program/requirements/feature-spec.md`
- Link to criteria: `sa/docs/partners/partner-program/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/partners/partner-program/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-admin`
- Related repositories: `gozap-backend`

## Problem Statement

В `gozap-admin` отсутствует раздел для создания партнёров, привязки станций и просмотра партнёрской статистики глазами администратора.

## Scope

- форма создания партнёра (логин, пароль, имя, телефон)
- форма редактирования данных уже созданного партнёра (логин, имя, телефон)
- список партнёров с поиском по логину (частичное совпадение) и сортировкой (по умолчанию по дате добавления от новых к старым; также по логину и по дате добавления по возрастанию/убыванию)
- интерфейс привязки/отвязки станций с указанием процента вознаграждения (включая 0%)
- переход в представление, идентичное кабинету партнёра, для выбранного партнёра/станции

## Out of Scope

- сам кабинет партнёра (отдельная задача, переиспользует то же представление)

## Implementation Notes

- affected modules: раздел администратора `gozap-admin`
- constraints: представление «как у партнёра» должно быть идентично кабинету партнёра, а не отдельным дублирующим экраном
- known technical context: зависит от API из `backend-partner-program-accounts-stations-balance.md`

## Acceptance Criteria

1. Администратор может создать партнёра с логином, паролем, именем и телефоном.
2. Администратор может отредактировать данные уже созданного партнёра (логин, имя, телефон).
3. Администратор может искать партнёров по логину (частичное совпадение) и сортировать список (по умолчанию по дате добавления от новых к старым; также по логину и по дате добавления по возрастанию/убыванию).
4. Администратор может привязать/отвязать станции к партнёру и задать процент по каждой.
5. Администратор может открыть представление, идентичное кабинету партнёра, для любого партнёра.

## Dependencies

- `sa/docs/partners/partner-program/jira/backend-partner-program-accounts-stations-balance.md`

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
