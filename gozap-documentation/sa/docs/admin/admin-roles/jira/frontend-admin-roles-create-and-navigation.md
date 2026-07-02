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

В `gozap-admin` отсутствует форма создания администратора и курьера с множественным выбором разделов и условная навигация, скрывающая неназначенные разделы.

## Scope

- форма создания администратора с множественным выбором разделов («Станции», «Пользователи», «Партнёры»), обязателен хотя бы один (доступна только супер-админу)
- та же форма используется для создания курьера (поля: логин, пароль, статус; статус по умолчанию «активен»)
- условное отображение пунктов навигации по набору разделов, назначенных текущему пользователю

## Out of Scope

- редактирование данных и набора разделов уже созданного администратора (подтверждено SA — функциональность не предусмотрена, UI не должен предоставлять такую форму/действие)

## Implementation Notes

- affected modules: раздел управления администраторами и навигация `gozap-admin`
- constraints: видимость разделов навигации должна совпадать с серверной проверкой доступа (backend — источник истины)
- known technical context: зависит от API из `backend-admin-roles-rbac.md`

## Acceptance Criteria

1. Супер-админ может создать администратора, отметив один или несколько разделов из списка.
2. Форма не позволяет сохранить администратора без хотя бы одного отмеченного раздела.
3. Супер-админ может создать курьера через ту же форму (поля: логин, пароль, статус).
4. Администратор видит в навигации только разделы, входящие в его назначенный набор; пункты меню недоступных разделов полностью отсутствуют в боковом меню (не отображаются заблокированными).

## Dependencies

- `sa/docs/admin/admin-roles/jira/backend-admin-roles-rbac.md`

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
