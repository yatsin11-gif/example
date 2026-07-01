# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Partner Program. Автоматические ежемесячные выплаты через Stripe
- Priority: High
- Labels: `ai-ready`, `backend`, `partners`, `payments`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: сумма вознаграждения за предыдущий месяц должна автоматически выплачиваться 7-го числа каждого месяца без ручного запроса, через Stripe.
- Link to requirements: `sa/docs/partners/partner-program/requirements/feature-spec.md`
- Link to criteria: `sa/docs/partners/partner-program/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/partners/partner-program/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Партнёру нужно один раз указать банковский счёт/карту и далее получать сумму вознаграждения за предыдущий месяц автоматически 7-го числа каждого месяца через Stripe, без ручного запроса выплаты. Сейчас интеграция со Stripe и scheduled-выплата не реализованы.

## Scope

- генерация Stripe-редиректа (ссылки) для регистрации/авторизации партнёра на стороне Stripe и указания им банковского счёта/карты; backend хранит только идентификатор аккаунта/клиента Stripe, не данные карты
- scheduled job запуска 7-го числа каждого месяца для инициации выплаты суммы вознаграждения за предыдущий месяц через Stripe
- обработка успешного/неуспешного результата выплаты и соответствующее обновление баланса
- отложенная выплата при отсутствии счёта/карты к 7-му числу: накопленный баланс выплачивается сразу после того, как партнёр указывает счёт/карту через Stripe-редирект, далее выплаты продолжаются по расписанию (7-го числа каждого месяца)
- генерация Stripe-редиректа для просмотра партнёром истории начислений и истории выплат в его профиле Stripe

## Out of Scope

- выбор конкретного продукта линейки Stripe Connect (Standard/Express/Custom) — требует подтверждения
- объём KYC/верификации партнёра — выполняется полностью на стороне Stripe
- собственная форма ввода/хранения данных карты и собственная страница истории начислений/выплат в продукте

## Implementation Notes

- affected modules: модуль партнёров (расширение), интеграция с Stripe API (hosted-редирект для регистрации/авторизации и для просмотра истории), scheduled job/cron
- constraints: точный продукт линейки Stripe Connect не подтверждён продуктом; данные карты не должны храниться в `gozap-backend`
- known technical context: зависит от готового баланса партнёра из задачи `backend-partner-program-accounts-stations-balance.md`

## Acceptance Criteria

1. Партнёр может по кнопке перейти на сторону Stripe, зарегистрироваться или авторизоваться там и указать банковский счёт/карту; backend не хранит данные карты.
2. 7-го числа каждого месяца backend автоматически инициирует выплату суммы вознаграждения за предыдущий месяц через Stripe.
3. После успешной выплаты баланс партнёра уменьшается на выплаченную сумму, и создаётся запись в истории выплат.
4. При ошибке выплаты через Stripe накопленный баланс партнёра не теряется, и сохраняется статус ошибки.
5. Если на момент плановой выплаты 7-го числа у партнёра не указан банковский счёт/карта, выплата откладывается без потери баланса; как только партнёр указывает счёт/карту через Stripe, накопленный баланс выплачивается немедленно, и далее выплаты продолжаются по расписанию (7-го числа каждого месяца).
6. Партнёр может перейти (редирект) в Stripe для просмотра истории начислений и истории выплат.

## Dependencies

- `sa/docs/partners/partner-program/jira/backend-partner-program-accounts-stations-balance.md`

## Risks

- Точный продукт линейки Stripe Connect и объём верификации (KYC) партнёра на стороне Stripe не подтверждены.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
