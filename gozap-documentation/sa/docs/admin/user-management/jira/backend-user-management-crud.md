# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - User Management. Создание пользователя, промоаккаунт, блокировка, карточка
- Priority: Medium
- Labels: `ai-ready`, `backend`, `admin`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: администратору с доступом к разделу «Пользователи» нужен backend-контракт для управления пользователями — той же сущностью аккаунта, что создаётся автоматически через станцию.
- Link to requirements: `sa/docs/admin/user-management/requirements/feature-spec.md`
- Link to criteria: `sa/docs/admin/user-management/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/admin/user-management/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`, `gozap-kiosk-app`

## Problem Statement

Нужен backend-контракт для создания пользователя администратором, выдачи/снятия промоаккаунта, блокировки пользователя и получения карточки пользователя (имя, телефон, почта, текущая аренда, история аренд), с проверкой доступа по разделу «Пользователи».

## Scope

- создание пользователя администратором (та же сущность аккаунта, что и в `sa/docs/kiosk/terminal-rental-flow`)
- выдача и снятие статуса промоаккаунта
- блокировка пользователя (запрет новых аренд через станцию)
- получение карточки пользователя: имя, телефон, почта, текущая аренда (при наличии), история аренд
- проверка доступа: только администратор с разделом «Пользователи» в наборе или супер-админ

## Out of Scope

- редактирование данных пользователя после создания
- удаление пользователя
- разблокировка пользователя

## Implementation Notes

- affected modules: модуль пользователей `gozap-backend`, интеграция с проверкой доступа из `sa/docs/admin/admin-roles`, общая сущность аккаунта с `sa/docs/kiosk/terminal-rental-flow`
- constraints: эффект промоаккаунта и поведение блокировки при активной аренде не зафиксированы во входных данных
- known technical context: зависит от модели доступа по разделам (`backend-admin-roles-rbac.md`) и от сущности аккаунта/аренды из terminal-rental-flow

## Acceptance Criteria

1. Администратор с разделом «Пользователи» (или супер-админ) может создать пользователя.
2. Администратор с разделом «Пользователи» (или супер-админ) может выдать и снять статус промоаккаунта пользователю.
3. Администратор с разделом «Пользователи» (или супер-админ) может заблокировать пользователя; заблокированный пользователь не может начать новую аренду через станцию.
4. Администратор с разделом «Пользователи» (или супер-админ) может получить карточку пользователя: имя, телефон, почта, текущая аренда (при наличии), история аренд.
5. Запрос на любую из операций от администратора без раздела «Пользователи» отклоняется.

## Dependencies

- `sa/docs/admin/admin-roles/jira/backend-admin-roles-rbac.md`
- `sa/docs/kiosk/terminal-rental-flow/jira/backend-terminal-rental-phone-confirmation-account.md`

## Risks

- Эффект промоаккаунта не зафиксирован во входных данных.
- Поведение блокировки пользователя с активной арендой не зафиксировано.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
