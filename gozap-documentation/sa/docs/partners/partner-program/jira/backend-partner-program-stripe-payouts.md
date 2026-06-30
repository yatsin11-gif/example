# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Partner Program. Автоматические ежемесячные выплаты через Stripe
- Priority: High
- Labels: `ai-ready`, `backend`, `partners`, `payments`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: накопленный баланс партнёра должен автоматически выплачиваться раз в месяц без ручного запроса, через Stripe.
- Link to requirements: `sa/docs/partners/partner-program/requirements/feature-spec.md`
- Link to criteria: `sa/docs/partners/partner-program/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/partners/partner-program/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Партнёру нужно один раз указать банковский счёт/карту и далее получать накопленный баланс автоматически раз в месяц через Stripe, без ручного запроса выплаты. Сейчас интеграция со Stripe и scheduled-выплата не реализованы.

## Scope

- сохранение и редактирование банковского счёта/карты партнёра
- ежемесячный scheduled job инициации выплаты накопленного баланса через Stripe
- обработка успешного/неуспешного результата выплаты и соответствующее обновление баланса
- отложенная выплата при отсутствии счёта/карты на момент планового запуска: накопленный баланс выплачивается сразу после того, как партнёр указывает счёт/карту, далее выплаты продолжаются по обычному ежемесячному расписанию
- история выплат (суммы, даты, статус)
- CSV-экспорт по заработку и выплатам за период

## Out of Scope

- выбор конкретного Stripe-продукта (Connect/Payouts) — требует подтверждения
- KYC/верификация партнёра, если потребуется

## Implementation Notes

- affected modules: модуль партнёров (расширение), интеграция с Stripe API, scheduled job/cron
- constraints: точный Stripe-продукт для выплат не подтверждён продуктом
- known technical context: зависит от готового баланса партнёра из задачи `backend-partner-program-accounts-stations-balance.md`

## Acceptance Criteria

1. Партнёр может один раз указать банковский счёт/карту и отредактировать их при необходимости.
2. Раз в месяц backend автоматически инициирует выплату накопленного баланса партнёра через Stripe.
3. После успешной выплаты баланс партнёра уменьшается на выплаченную сумму, и создаётся запись в истории выплат.
4. При ошибке выплаты через Stripe накопленный баланс партнёра не теряется, и сохраняется статус ошибки.
5. Если на момент планового запуска у партнёра не указан банковский счёт/карта, выплата откладывается без потери баланса; как только партнёр указывает счёт/карту, накопленный баланс выплачивается немедленно, и далее выплаты продолжаются по обычному ежемесячному расписанию.
6. Партнёр может выгрузить CSV по заработку и выплатам за выбранный период.

## Dependencies

- `sa/docs/partners/partner-program/jira/backend-partner-program-accounts-stations-balance.md`

## Risks

- Точный Stripe-продукт для выплат и необходимость верификации партнёра не подтверждены.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
