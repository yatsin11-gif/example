# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Terminal Rental. Оплата картой и выдача команды на PowerBank
- Priority: High
- Labels: `ai-ready`, `backend`, `kiosk`, `payments`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: после подтверждения номера система должна обработать оплату картой и выдать команду станции на выдачу PowerBank только при успешной оплате.
- Link to requirements: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-spec.md`
- Link to criteria: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/kiosk/terminal-rental-flow/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-kiosk-app`, `gozap-app`

## Problem Statement

Нужен backend-контракт приёма данных карты, обработки оплаты, сохранения карты в аккаунте и выдачи команды станции на выдачу PowerBank только после подтверждённой успешной оплаты, плюс SMS-уведомление о начале аренды.

## Scope

- приём данных карты для обработки оплаты и сохранение карты в аккаунте для будущих списаний
- создание сущности «аренда» только после подтверждённого номера телефона и успешной оплаты
- подтверждение успешной оплаты перед командой станции на выдачу PowerBank
- отправка SMS-уведомления о создании аккаунта/начале аренды через Twilio

## Out of Scope

- выбор и интеграция конкретного платёжного провайдера терминала (требует подтверждения)
- окончание аренды и возврат powerbank

## Implementation Notes

- affected modules: модуль оплаты, модуль управления станцией (команда выдачи), интеграция с Twilio API
- constraints: платёжный провайдер для приёма карты на терминале не подтверждён (отдельно от Stripe, используемого для партнёрских выплат)
- known technical context: зависит от аккаунта, созданного в `backend-terminal-rental-phone-confirmation-account.md`

## Acceptance Criteria

1. Backend принимает данные карты и сохраняет её в аккаунте пользователя для будущих списаний.
2. Сущность «аренда» создаётся только после подтверждённого номера телефона и успешной оплаты.
3. Команда станции на выдачу PowerBank отправляется только после подтверждённой успешной оплаты и создания аренды.
4. После успешной оплаты пользователь получает SMS о создании аккаунта/начале аренды через Twilio.
5. Отклонённая оплата не приводит к созданию аренды и не приводит к выдаче PowerBank; пользователь видит ошибку на экране станции.

## Dependencies

- `sa/docs/kiosk/terminal-rental-flow/jira/backend-terminal-rental-phone-confirmation-account.md`

## Risks

- Платёжный провайдер для приёма карты на терминале не подтверждён.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
