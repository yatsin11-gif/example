# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Admin Roles. Модель ролей/уровней доступа и серверная авторизация
- Priority: High
- Labels: `ai-ready`, `backend`, `admin`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: без серверной модели ролей и проверки доступа нельзя гарантировать, что администратор не получит данные недоступных ему разделов даже при обходе FE.
- Link to requirements: `sa/docs/admin/admin-roles/requirements/feature-spec.md`
- Link to criteria: `sa/docs/admin/admin-roles/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/admin/admin-roles/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Сейчас нет модели ролей администраторов и серверной проверки доступа по разделам. Нужна модель «супер-админ» (полный доступ) и «админ» (набор явно назначенных разделов), назначаемая при создании администратора.

## Scope

- модель ролей: супер-админ (полный доступ), админ (набор разделов из списка: «Станции», «Пользователи», «Партнёры»)
- создание администратора только от имени супер-админа с обязательным множественным выбором хотя бы одного раздела
- серверная проверка принадлежности раздела/эндпоинта набору, назначенному администратору

## Out of Scope

- гранулярные права на уровне отдельных действий внутри раздела
- аудит-лог действий администраторов
- CRUD-логика внутри разделов «Станции», «Пользователи», «Партнёры» (отдельные фичи: `admin/stations-management`, `admin/user-management`, `partners/partner-program`)

## Implementation Notes

- affected modules: модуль аутентификации/авторизации администраторов `gozap-backend`
- constraints: нет
- known technical context: нет связанных foundation-задач, это базовая задача домена `admin`

## Acceptance Criteria

1. Только супер-админ может создать новую учётную запись администратора.
2. Создание администратора без хотя бы одного указанного раздела отклоняется.
3. Запросы администратора к разделам/эндпоинтам, не входящим в его назначенный набор, отклоняются на backend.
4. Супер-админ имеет доступ ко всем разделам без дополнительной проверки набора.

## Dependencies

- Нет

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
