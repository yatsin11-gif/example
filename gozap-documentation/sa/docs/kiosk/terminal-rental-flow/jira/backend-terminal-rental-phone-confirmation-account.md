# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Terminal Rental. Подтверждение номера через Twilio и создание аккаунта
- Priority: High
- Labels: `ai-ready`, `backend`, `kiosk`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: основной flow аренды требует подтверждённого номера телефона перед привязкой карты и созданием аккаунта.
- Link to requirements: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-spec.md`
- Link to criteria: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/kiosk/terminal-rental-flow/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-kiosk-app`

## Problem Statement

Нужен backend-контракт для приёма номера телефона со станции, отправки кода подтверждения через Twilio, проверки кода и создания аккаунта пользователя при успешной проверке.

## Scope

- приём номера телефона от станции и отправка SMS-кода через Twilio
- проверка введённого кода
- создание аккаунта пользователя по номеру телефона при успешной проверке

## Out of Scope

- обработка оплаты и выдача PowerBank
- упрощённый flow для разряженного телефона

## Implementation Notes

- affected modules: модуль аутентификации пользователей станции, интеграция с Twilio API
- constraints: поведение при истёкшем/неверном коде не детализировано во входных данных
- known technical context: foundation-задача домена `kiosk`, без внешних зависимостей

## Acceptance Criteria

1. Станция может инициировать отправку SMS-кода на введённый номер телефона через Twilio.
2. Backend проверяет введённый код перед созданием аккаунта.
3. Аккаунт создаётся только при успешной проверке кода.
4. Неверный/истёкший код отклоняется без создания аккаунта; аренда в этом случае не создаётся, пользователь видит ошибку на экране станции.

## Dependencies

- Нет

## Risks

- Поведение при истёкшем/неверном коде не детализировано во входных данных.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
