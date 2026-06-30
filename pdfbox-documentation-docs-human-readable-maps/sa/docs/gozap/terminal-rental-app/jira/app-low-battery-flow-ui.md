# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: APP - Терминал. Упрощённый поток для разряженного телефона
- Priority: Medium
- Labels: `ai-ready`, `frontend`, `terminal-rental-app`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: пользователь без рабочего телефона должен арендовать powerbank только через прямую оплату картой, без ввода номера и регистрации.
- Link to requirements: `sa/docs/gozap/terminal-rental-app/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/terminal-rental-app/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/terminal-rental-app/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-station-app`
- Related repositories: `gozap-backend`

## Problem Statement

Нет упрощённого UI-потока для пользователя с разряженным телефоном: подсказки приложить карту и оплаты без ввода номера и без регистрации.

## Scope

- кнопка альтернативного сценария на экране покоя
- экран подсказки "Приложите карту для аренды"
- обработка оплаты без ввода номера и без создания аккаунта
- экраны успеха и ошибки оплаты

## Out of Scope

- основной поток с созданием аккаунта (отдельная задача)
- привязка карты к аккаунту

## Implementation Notes

- affected modules: точная структура `gozap-station-app` не подтверждена в текущем workspace.
- constraints: этот поток никогда не создаёт аккаунт и не запрашивает номер телефона.
- known technical context: зависит от backend задачи обработки оплаты.

## Acceptance Criteria

1. При нажатии кнопки альтернативного сценария показывается подсказка "Приложите карту для аренды".
2. Оплата проходит без ввода номера телефона и без регистрации.
3. После успешной оплаты пользователь получает powerbank без создания аккаунта.

## Dependencies

- `sa/docs/gozap/terminal-rental-app/jira/backend-payment-and-powerbank-dispense.md`

## Risks

- открытый вопрос: привязывается ли карта из этого потока к аккаунту при последующей регистрации тем же номером

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
