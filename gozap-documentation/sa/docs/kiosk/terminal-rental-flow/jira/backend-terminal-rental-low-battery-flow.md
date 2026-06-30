# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Terminal Rental. Упрощённый flow оплаты для разряженного телефона
- Priority: Medium
- Labels: `ai-ready`, `backend`, `kiosk`, `payments`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: пользователь без рабочего телефона должен получить PowerBank только по карте, без ввода номера и регистрации.
- Link to requirements: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-spec.md`
- Link to criteria: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/kiosk/terminal-rental-flow/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-kiosk-app`

## Problem Statement

Нужен отдельный backend endpoint для оплаты картой без номера телефона и без создания полноценного аккаунта, с выдачей команды станции на PowerBank после подтверждённой оплаты.

## Scope

- backend endpoint оплаты картой без номера телефона и без создания полноценного аккаунта
- команда станции на выдачу PowerBank после подтверждения оплаты в упрощённом flow

## Out of Scope

- основной flow с SMS-подтверждением

## Implementation Notes

- affected modules: модуль оплаты (переиспользует обработку оплаты картой из основного flow)
- constraints: нет
- known technical context: переиспользует платёжную интеграцию из `backend-terminal-rental-payment-and-dispense.md`

## Acceptance Criteria

1. Пользователь может оплатить картой без ввода номера телефона и без регистрации.
2. PowerBank выдаётся только после подтверждённой успешной оплаты.

## Dependencies

- `sa/docs/kiosk/terminal-rental-flow/jira/backend-terminal-rental-payment-and-dispense.md`

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
