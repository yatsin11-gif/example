# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Partner Program. Сброс пароля партнёра через Twilio SMS
- Priority: Medium
- Labels: `ai-ready`, `backend`, `partners`, `auth`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: партнёр должен иметь возможность восстановить доступ к кабинету самостоятельно, без участия администратора.
- Link to requirements: `sa/docs/partners/partner-program/requirements/feature-spec.md`
- Link to criteria: `sa/docs/partners/partner-program/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/partners/partner-program/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Партнёр не может восстановить доступ к кабинету самостоятельно. Нужен сброс пароля по коду, отправленному через Twilio SMS на номер телефона партнёра.

## Scope

- генерация и отправка кода сброса пароля через Twilio на номер телефона партнёра
- проверка кода и установка нового пароля

## Out of Scope

- сброс пароля для роли администратора (см. `sa/docs/admin/admin-roles`)

## Implementation Notes

- affected modules: модуль аутентификации партнёра, интеграция с Twilio API
- constraints: нет
- known technical context: зависит от существующей учётки партнёра (`backend-partner-program-accounts-stations-balance.md`)

## Acceptance Criteria

1. Партнёр может запросить код сброса пароля на свой номер телефона через Twilio.
2. Партнёр может ввести полученный код и установить новый пароль.
3. Неверный или истёкший код отклоняется без смены пароля.

## Dependencies

- `sa/docs/partners/partner-program/jira/backend-partner-program-accounts-stations-balance.md`

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
