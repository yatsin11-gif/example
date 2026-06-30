# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: APP - Терминал. Экран покоя и основной поток аренды (номер, SMS, карта)
- Priority: High
- Labels: `ai-ready`, `frontend`, `terminal-rental-app`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: пользователю нужен UI основного потока аренды на терминале — от экрана покоя до получения powerbank.
- Link to requirements: `sa/docs/gozap/terminal-rental-app/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/terminal-rental-app/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/terminal-rental-app/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-station-app`
- Related repositories: `gozap-backend`

## Problem Statement

Нет UI основного потока аренды на терминале: экрана покоя, ввода номера и SMS-кода, привязки карты, обработки оплаты и экранов результата.

## Scope

- экран покоя с полем ввода номера и менее акцентной кнопкой альтернативного сценария
- экран ввода номера телефона
- экран ввода кода из SMS с автозаполнением (использует `sa/docs/gozap/auth`)
- экран привязки карты с инструкцией по карте
- экран обработки оплаты
- экраны успеха и ошибки

## Out of Scope

- упрощённый поток для разряженного телефона (отдельная задача)

## Implementation Notes

- affected modules: точная структура `gozap-station-app` не подтверждена в текущем workspace.
- constraints: powerbank не должен предлагаться к выдаче до подтверждения успешной оплаты с backend.
- known technical context: зависит от backend задач создания аккаунта и обработки оплаты.

## Acceptance Criteria

1. Экран покоя показывает поле ввода номера и менее акцентную кнопку альтернативного сценария.
2. Пользователь может ввести номер и подтвердить код из SMS, с попыткой автозаполнения.
3. Пользователь может привязать карту и пройти оплату.
4. После успешной оплаты показывается экран успеха; при ошибке — экран ошибки с возможностью повтора.

## Dependencies

- `sa/docs/gozap/terminal-rental-app/jira/backend-account-creation-and-card-binding.md`
- `sa/docs/gozap/terminal-rental-app/jira/backend-payment-and-powerbank-dispense.md`
- `sa/docs/gozap/auth/tasks/task-breakdown.md`

## Risks

- нет

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
