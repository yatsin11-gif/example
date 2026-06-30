# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: FRONT - User Management. Список пользователей, создание, карточка, промоаккаунт и блокировка
- Priority: Medium
- Labels: `ai-ready`, `frontend`, `admin`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: администратору с доступом к разделу «Пользователи» нужен интерфейс для просмотра списка пользователей, создания пользователя, просмотра карточки пользователя и управления промоаккаунтом/блокировкой.
- Link to requirements: `sa/docs/admin/user-management/requirements/feature-spec.md`
- Link to criteria: `sa/docs/admin/user-management/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/admin/user-management/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-admin`
- Related repositories: `gozap-backend`

## Problem Statement

В `gozap-admin` отсутствует раздел «Пользователи» со списком пользователей, формой создания, карточкой пользователя и действиями выдачи/снятия промоаккаунта и блокировки.

## Scope

- список пользователей (включая созданных вручную и через станцию)
- форма создания пользователя
- карточка пользователя: имя, телефон, почта, текущая аренда (при наличии), история аренд
- действия выдачи/снятия промоаккаунта и блокировки из карточки пользователя

## Out of Scope

- редактирование данных пользователя
- удаление пользователя
- разблокировка пользователя

## Implementation Notes

- affected modules: раздел «Пользователи» в `gozap-admin`
- constraints: раздел должен быть скрыт/недоступен администратору без назначенного раздела «Пользователи» (см. `sa/docs/admin/admin-roles`)
- known technical context: зависит от API из `backend-user-management-crud.md`

## Acceptance Criteria

1. Администратор с доступом к разделу «Пользователи» видит список пользователей.
2. Администратор может создать нового пользователя через форму; он появляется в списке.
3. Администратор может открыть карточку пользователя и увидеть имя, телефон, почту, текущую аренду (при наличии) и историю аренд.
4. Администратор может выдать и снять промоаккаунт пользователю из карточки.
5. Администратор может заблокировать пользователя из карточки.

## Dependencies

- `sa/docs/admin/user-management/jira/backend-user-management-crud.md`

## Risks

- Точный набор полей формы создания пользователя не зафиксирован во входных данных.
- Точное визуальное представление эффекта промоаккаунта не зафиксировано.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
