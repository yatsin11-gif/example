# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: FRONT - Terminal Rental. Упрощённый flow для разряженного телефона
- Priority: Medium
- Labels: `ai-ready`, `frontend`, `kiosk`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: нужен отдельный экран с подсказкой «Приложите карту для аренды» для пользователей без рабочего телефона.
- Link to requirements: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-spec.md`
- Link to criteria: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/kiosk/terminal-rental-flow/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-kiosk-app`
- Related repositories: `gozap-backend`

## Problem Statement

Нужна кнопка альтернативного сценария на экране покоя и отдельный экран с подсказкой «Приложите карту для аренды», ведущий к оплате без ввода номера телефона.

## Scope

- кнопка альтернативного сценария на экране покоя
- экран с подсказкой «Приложите карту для аренды» и оплатой без ввода номера

## Out of Scope

- основной flow с вводом номера и SMS-кодом

## Implementation Notes

- affected modules: UI-слой `gozap-kiosk-app`
- constraints: нет
- known technical context: зависит от API из `backend-terminal-rental-low-battery-flow.md`

## Acceptance Criteria

1. Пользователь может нажать кнопку альтернативного сценария на экране покоя.
2. Пользователь видит подсказку «Приложите карту для аренды» без поля ввода номера.
3. После успешной оплаты пользователь получает PowerBank без ввода номера и регистрации.

## Dependencies

- `sa/docs/kiosk/terminal-rental-flow/jira/backend-terminal-rental-low-battery-flow.md`

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
