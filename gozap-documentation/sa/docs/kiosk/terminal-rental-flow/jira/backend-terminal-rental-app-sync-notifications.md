# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Terminal Rental. Синхронизация аренды с `gozap-app` и push/SMS-уведомления
- Priority: Medium
- Labels: `ai-ready`, `backend`, `kiosk`, `notifications`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: аренда, начатая через станцию, должна быть видна пользователю в `gozap-app` и сопровождаться уведомлениями (push + SMS) на старте и завершении.
- Link to requirements: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-spec.md`
- Link to criteria: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/kiosk/terminal-rental-flow/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-app`, `gozap-kiosk-app`

## Problem Statement

Нужен backend-контракт, который синхронизирует аренду, созданную на станции, с аккаунтом пользователя в `gozap-app` (по совпадению номера телефона) и отправляет push (если приложение установлено) и SMS-уведомления о начале и завершении аренды.

## Scope

- синхронизация созданной аренды в `gozap-app` при совпадении номера телефона аккаунта станции и аккаунта приложения
- отправка push-уведомления (если `gozap-app` установлено) и SMS через Twilio о начале аренды
- повторное использование той же логики уведомлений (push + SMS) для момента завершения аренды
- защита от синхронизации аренды в чужой аккаунт при несовпадении номера телефона

## Out of Scope

- экраны и UI самого `gozap-app` (вне scope этой фичи)
- flow окончания аренды и возврата powerbank (не описан во входных данных)
- выбор push-провайдера (не подтверждён)

## Implementation Notes

- affected modules: модуль аренды (rental), модуль уведомлений, интеграция с Twilio API, интеграция с push-провайдером `gozap-app` (не подтверждён)
- constraints: push-провайдер `gozap-app` не подтверждён; неизвестно, существует ли `gozap-app` уже как продукт
- known technical context: зависит от сущности «аренда», создаваемой в `backend-terminal-rental-payment-and-dispense.md`

## Acceptance Criteria

1. Аренда, созданная через станцию, доступна пользователю в `gozap-app`, если он авторизован тем же номером телефона.
2. Пользователь получает push-уведомление (если `gozap-app` установлено) и SMS через Twilio о начале аренды.
3. Та же логика уведомлений (push + SMS) применяется к моменту завершения аренды.
4. Если у пользователя не установлено `gozap-app`, отправляется только SMS, без push.
5. Если номер телефона аккаунта станции не совпадает с аккаунтом в `gozap-app`, аренда не синхронизируется в чужой аккаунт.

## Dependencies

- `sa/docs/kiosk/terminal-rental-flow/jira/backend-terminal-rental-payment-and-dispense.md`

## Risks

- Push-провайдер `gozap-app` не подтверждён.
- Неизвестно, существует ли `gozap-app` уже как продукт или backend-контракт готовится заранее для будущей реализации.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
