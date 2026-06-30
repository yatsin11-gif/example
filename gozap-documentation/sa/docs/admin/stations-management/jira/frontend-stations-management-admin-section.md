# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: FRONT - Stations Management. Список станций, создание и архивирование
- Priority: Medium
- Labels: `ai-ready`, `frontend`, `admin`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: администратору с доступом к разделу «Станции» нужен интерфейс для просмотра списка станций, создания новой станции и архивирования существующей.
- Link to requirements: `sa/docs/admin/stations-management/requirements/feature-spec.md`
- Link to criteria: `sa/docs/admin/stations-management/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/admin/stations-management/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-admin`
- Related repositories: `gozap-backend`

## Problem Statement

В `gozap-admin` отсутствует раздел «Станции» со списком станций, формой создания и действием архивирования.

## Scope

- список станций с отображением статуса (активна/архивирована)
- форма создания станции
- действие архивирования станции из списка/карточки

## Out of Scope

- редактирование станции
- разархивирование станции

## Implementation Notes

- affected modules: раздел «Станции» в `gozap-admin`
- constraints: раздел должен быть скрыт/недоступен администратору без назначенного раздела «Станции» (см. `sa/docs/admin/admin-roles`)
- known technical context: зависит от API из `backend-stations-management-crud.md`

## Acceptance Criteria

1. Администратор с доступом к разделу «Станции» видит список станций со статусом.
2. Администратор может создать новую станцию через форму, она появляется в списке.
3. Администратор может архивировать станцию; статус в списке меняется на «архивирована».
4. Архивированную станцию нельзя архивировать повторно.

## Dependencies

- `sa/docs/admin/stations-management/jira/backend-stations-management-crud.md`

## Risks

- Точный набор полей формы создания станции не зафиксирован во входных данных.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
