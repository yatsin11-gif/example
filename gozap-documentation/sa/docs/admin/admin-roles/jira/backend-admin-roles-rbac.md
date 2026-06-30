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

Сейчас нет модели ролей администраторов и серверной проверки доступа по уровню. Нужна модель «супер-админ» (полный доступ) и «админ» (ограниченный уровень доступа), назначаемая при создании администратора.

## Scope

- модель ролей: супер-админ (полный доступ), админ (уровень доступа)
- создание администратора только от имени супер-админа с обязательным указанием уровня доступа
- серверная проверка уровня доступа при обращении к ограниченным разделам/эндпоинтам

## Out of Scope

- гранулярные права на уровне отдельных действий внутри раздела
- аудит-лог действий администраторов

## Implementation Notes

- affected modules: модуль аутентификации/авторизации администраторов `gozap-backend`
- constraints: точный список разделов и уровней доступа не подтверждён продуктом
- known technical context: нет связанных foundation-задач, это базовая задача домена `admin`

## Acceptance Criteria

1. Только супер-админ может создать новую учётную запись администратора.
2. Создание администратора без указанного уровня доступа отклоняется.
3. Запросы администратора к разделам/эндпоинтам, не входящим в его уровень доступа, отклоняются на backend.
4. Супер-админ имеет доступ ко всем разделам без дополнительной проверки уровня.

## Dependencies

- Нет

## Risks

- Точный список уровней доступа и разделов не подтверждён (open question).

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
