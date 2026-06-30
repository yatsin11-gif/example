# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Партнёры. Ежемесячный Stripe payout и история выплат
- Priority: High
- Labels: `ai-ready`, `backend`, `partners-admin`, `billing`, `stripe`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: накопленный баланс партнёра должен автоматически выплачиваться один раз в месяц через Stripe, с сохранением истории для отображения партнёру.
- Link to requirements: `sa/docs/gozap/partners-admin/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/partners-admin/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/partners-admin/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Нет автоматизированного процесса ежемесячной выплаты накопленного баланса партнёру через Stripe и нет истории выплат, доступной партнёру.

## Scope

- хранение банковского счёта/карты партнёра через Stripe
- ежемесячный scheduled job, выплачивающий накопленный баланс партнёрам с указанными реквизитами
- обработка случая отсутствия реквизитов на момент плановой выплаты (без перевода, с сохранением причины)
- обработка Stripe webhook о результате выплаты
- история выплат (сумма, дата, статус)

## Out of Scope

- ручной запрос выплаты партнёром
- frontend настройки счёта (см. `gozap-admin` задачу кабинета партнёра)

## Implementation Notes

- affected modules: точные пути модулей не подтверждены в текущем workspace.
- constraints: точная Stripe-сущность для перевода (Connect account / transfer) не подтверждена и требует уточнения перед реализацией.
- known technical context: зависит от баланса, рассчитанного в задаче "Расчёт баланса по завершённым арендам".

## Acceptance Criteria

1. Раз в месяц партнёрам с указанными реквизитами автоматически выплачивается накопленный баланс через Stripe.
2. Партнёрам без указанных реквизитов выплата не выполняется, причина сохраняется.
3. История выплат содержит сумму, дату и статус и обновляется по результату Stripe webhook.

## Dependencies

- `sa/docs/gozap/partners-admin/jira/backend-partners-model-and-station-binding.md`
- `sa/docs/gozap/partners-admin/jira/backend-partner-balance-calculation.md`

## Risks

- точная Stripe-сущность для выплат не подтверждена
- открытый вопрос: что происходит с балансом, если реквизиты не указаны на момент выплаты — перенос или блокировка

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
