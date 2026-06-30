# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Stations Management. Сущность станции, создание и архивирование
- Priority: Medium
- Labels: `ai-ready`, `backend`, `admin`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: нужна централизованная сущность «станция» со статусом активна/архивирована, управляемая через раздел «Станции» в админке.
- Link to requirements: `sa/docs/admin/stations-management/requirements/feature-spec.md`
- Link to criteria: `sa/docs/admin/stations-management/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/admin/stations-management/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Нужен backend-контракт для создания станции, перевода станции в статус «архивирована» и проверки, что эти операции выполняет администратор с доступом к разделу «Станции» (или супер-админ).

## Scope

- создание станции со статусом «активна» по умолчанию
- перевод станции в статус «архивирована» без удаления исторических данных (привязки к партнёрам, аренды)
- проверка доступа: только администратор с разделом «Станции» в наборе или супер-админ

## Out of Scope

- редактирование станции
- удаление станции
- привязка станции к партнёру и процент вознаграждения (`sa/docs/partners/partner-program`)

## Implementation Notes

- affected modules: модуль станций `gozap-backend`, интеграция с проверкой доступа из `sa/docs/admin/admin-roles`
- constraints: точный набор полей станции не зафиксирован во входных данных
- known technical context: зависит от модели доступа по разделам (`backend-admin-roles-rbac.md`)

## Acceptance Criteria

1. Администратор с разделом «Станции» (или супер-админ) может создать станцию; она получает статус «активна» по умолчанию.
2. Администратор с разделом «Станции» (или супер-админ) может перевести станцию в статус «архивирована».
3. Архивирование станции не удаляет исторические данные станции (привязки к партнёрам, аренды).
4. Запрос на создание/архивирование станции от администратора без раздела «Станции» отклоняется.

## Dependencies

- `sa/docs/admin/admin-roles/jira/backend-admin-roles-rbac.md`

## Risks

- Набор полей станции не зафиксирован во входных данных.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
