# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Аренда. Создание аккаунта по номеру телефона и привязка карты
- Priority: High
- Labels: `ai-ready`, `backend`, `terminal-rental-app`, `stripe`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: основной поток аренды должен создавать или находить аккаунт по номеру телефона после верификации SMS-кода и сохранять карту для будущих аренд.
- Link to requirements: `sa/docs/gozap/terminal-rental-app/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/terminal-rental-app/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/terminal-rental-app/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-station-app`

## Problem Statement

После верификации номера телефона нет логики создания/поиска аккаунта и сохранения карты, привязанной к этому аккаунту, для будущих списаний.

## Scope

- поиск аккаунта по номеру телефона; создание нового, если не найден, после успешной верификации SMS-кода (использует `sa/docs/gozap/auth`)
- сохранение карты в аккаунте через Stripe
- отправка SMS-уведомления о создании аккаунта/начале аренды через Twilio

## Out of Scope

- верификация SMS-кода (см. `sa/docs/gozap/auth`)
- инициирование выдачи powerbank (отдельная задача)

## Implementation Notes

- affected modules: точная структура `gozap-backend` не подтверждена в текущем workspace.
- constraints: один номер телефона соответствует одному аккаунту.
- known technical context: точная Stripe-схема сохранения карты (Customer/PaymentMethod/SetupIntent) не подтверждена.

## Acceptance Criteria

1. После успешной верификации номера аккаунт создаётся, если его не было, или используется существующий.
2. Карта сохраняется в аккаунте и доступна для последующих аренд.
3. После создания аккаунта/начала аренды отправляется SMS-уведомление через Twilio.

## Dependencies

- `sa/docs/gozap/auth/tasks/task-breakdown.md`

## Risks

- точная Stripe-схема сохранения карты не подтверждена

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
