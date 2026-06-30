# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: FRONT - Terminal Rental. Экраны станции: покой, номер, код, карта, успех/ошибка
- Priority: High
- Labels: `ai-ready`, `frontend`, `kiosk`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: пользователю нужен полный визуальный flow на экране станции от состояния покоя до выдачи PowerBank.
- Link to requirements: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-spec.md`
- Link to criteria: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/kiosk/terminal-rental-flow/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-kiosk-app`
- Related repositories: `gozap-backend`

## Problem Statement

Нужны экраны станции: покой (с полем ввода номера и кнопкой альтернативного сценария), ввод номера, ввод SMS-кода, привязка карты с инструкцией, успех/ошибка.

## Scope

- экран покоя с полем ввода номера и кнопкой альтернативного сценария
- экран ввода номера телефона
- экран ввода SMS-кода
- экран привязки карты с инструкцией
- экран успеха/ошибки

## Out of Scope

- упрощённый flow для разряженного телефона (отдельная задача)

## Implementation Notes

- affected modules: UI-слой `gozap-kiosk-app`
- constraints: нет
- known technical context: зависит от API из `backend-terminal-rental-phone-confirmation-account.md` и `backend-terminal-rental-payment-and-dispense.md`

## Acceptance Criteria

1. Пользователь видит экран покоя с полем ввода номера и менее акцентной кнопкой альтернативного сценария.
2. Пользователь может ввести номер телефона и получить экран ввода SMS-кода.
3. После подтверждения кода пользователь видит экран привязки карты с инструкцией.
4. После успешной оплаты пользователь видит экран успеха и получает PowerBank.
5. При ошибке на любом этапе пользователь видит понятный экран ошибки.

## Dependencies

- `sa/docs/kiosk/terminal-rental-flow/jira/backend-terminal-rental-phone-confirmation-account.md`
- `sa/docs/kiosk/terminal-rental-flow/jira/backend-terminal-rental-payment-and-dispense.md`

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
