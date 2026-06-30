# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: FRONT - SMS Autofill. Автоподстановка кода на экране станции
- Priority: Low
- Labels: `ai-ready`, `frontend`, `auth`, `kiosk`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: автоматическая подстановка кода ускоряет прохождение основного flow аренды и убирает ручной ввод.
- Link to requirements: `sa/docs/auth/sms-autofill/requirements/feature-spec.md`
- Link to criteria: `sa/docs/auth/sms-autofill/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/auth/sms-autofill/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-kiosk-app`
- Related repositories: нет

## Problem Statement

На экране ввода SMS-кода (`sa/docs/kiosk/terminal-rental-flow`) пользователь сейчас должен вводить код вручную. Нужна автоподстановка кода из входящего SMS с сохранением ручного ввода как резервного пути.

## Scope

- перехват/чтение входящего SMS-кода на экране ввода кода
- автоматическая подстановка кода в поле ввода
- сохранение возможности ручного ввода как резервного пути

## Out of Scope

- backend-логика отправки и проверки кода
- автоматическая отправка формы без действия пользователя (требует подтверждения)

## Implementation Notes

- affected modules: экран ввода SMS-кода в `gozap-kiosk-app`
- constraints: технический механизм получения SMS на стороне станции не подтверждён — уточнить перед реализацией
- known technical context: зависит от экрана ввода кода из `sa/docs/kiosk/terminal-rental-flow/jira/frontend-terminal-rental-main-flow-screens.md`

## Acceptance Criteria

1. Код из входящего SMS автоматически подставляется в поле ввода на экране станции.
2. Ручной ввод кода остаётся доступным, если автоподстановка не сработала.
3. Автоподстановка применяется только к коду текущей сессии аренды на этой станции.

## Dependencies

- `sa/docs/kiosk/terminal-rental-flow/jira/frontend-terminal-rental-main-flow-screens.md`

## Risks

- Технический механизм получения SMS на стороне станции не подтверждён; задача может потребовать пересмотра scope после уточнения.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
