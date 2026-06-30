# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: FRONT - Admin Roles. Создание администратора и условная навигация
- Priority: Medium
- Labels: `ai-ready`, `frontend`, `admin`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: супер-админу нужен интерфейс создания администраторов, а администратору — навигация, ограниченная его уровнем доступа.
- Link to requirements: `sa/docs/admin/admin-roles/requirements/feature-spec.md`
- Link to criteria: `sa/docs/admin/admin-roles/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/admin/admin-roles/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-admin`
- Related repositories: `gozap-backend`

## Problem Statement

В `gozap-admin` отсутствует форма создания администратора с выбором уровня доступа и условная навигация, скрывающая недоступные разделы.

## Scope

- форма создания администратора с обязательным выбором уровня доступа (доступна только супер-админу)
- условное отображение пунктов навигации по уровню доступа текущего пользователя

## Out of Scope

- редактирование уровня доступа у уже созданного администратора (open question)

## Implementation Notes

- affected modules: раздел управления администраторами и навигация `gozap-admin`
- constraints: видимость разделов навигации должна совпадать с серверной проверкой доступа (backend — источник истины)
- known technical context: зависит от API из `backend-admin-roles-rbac.md`

## Acceptance Criteria

1. Супер-админ может создать администратора, указав уровень доступа.
2. Форма не позволяет сохранить администратора без выбранного уровня доступа.
3. Администратор видит в навигации только разделы, доступные его уровню доступа.

## Dependencies

- `sa/docs/admin/admin-roles/jira/backend-admin-roles-rbac.md`

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
