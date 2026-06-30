# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: ADMIN - Раздел "Партнёры": список, создание, привязка станций
- Priority: Medium
- Labels: `ai-ready`, `admin`, `partners-admin`
- Assignee suggestion: Frontend/Admin

## Business Context

- Почему существует эта задача: администратору нужен UI для создания партнёра, поиска/фильтрации и управления привязкой станций с индивидуальным процентом.
- Link to requirements: `sa/docs/gozap/partners-admin/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/partners-admin/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/partners-admin/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-admin`
- Related repositories: `gozap-backend`

## Problem Statement

В админке нет раздела для управления партнёрами: нет формы создания, списка с поиском/фильтрацией и UI для привязки/отвязки станций с процентом.

## Scope

- форма создания партнёра (логин, пароль, имя, телефон)
- список партнёров с поиском и фильтрацией
- UI привязки и отвязки станции к партнёру с указанием процента (включая 0%)
- admin-зеркало данных кабинета партнёра (станции, сводка, история)

## Out of Scope

- кабинет партнёра (отдельная задача)
- ограничение видимости раздела по уровню доступа (см. `sa/docs/gozap/admin-roles`, если подтвердится)

## Implementation Notes

- affected modules: точная структура `gozap-admin` не подтверждена в текущем workspace.
- constraints: UI должен использовать endpoints из задачи "Модель партнёра, станций и привязки".
- known technical context: нет.

## Acceptance Criteria

1. Администратор может создать партнёра через форму.
2. Администратор может найти и отфильтровать партнёра в списке.
3. Администратор может привязать/отвязать станцию к партнёру с заданным процентом.
4. Администратор видит те же данные, что видит партнёр в своём кабинете.

## Dependencies

- `sa/docs/gozap/partners-admin/jira/backend-partners-model-and-station-binding.md`

## Risks

- нет

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
