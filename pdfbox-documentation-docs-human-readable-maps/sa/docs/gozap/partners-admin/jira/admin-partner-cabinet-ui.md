# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: ADMIN - Кабинет партнёра: станции, сводка, выплаты, CSV
- Priority: Medium
- Labels: `ai-ready`, `admin`, `partners-admin`
- Assignee suggestion: Frontend/Admin

## Business Context

- Почему существует эта задача: партнёру нужен личный кабинет, чтобы видеть свои станции, сводку, баланс, историю выплат и выгружать CSV без доступа к чужим данным.
- Link to requirements: `sa/docs/gozap/partners-admin/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/partners-admin/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/partners-admin/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-admin`
- Related repositories: `gozap-backend`

## Problem Statement

У партнёра нет личного кабинета: нет списка станций, сводки за период, деталей аренд, настройки счёта и истории выплат.

## Scope

- список станций партнёра (код, название, адрес, статус, аренды и вознаграждение за период)
- сводка за период (баланс, ближайшая выплата, число аренд, сумма вознаграждения, разбивка по станциям)
- детали станции: список аренд (дата, стоимость, вознаграждение) и итог
- настройка банковского счёта/карты (создание и редактирование)
- история выплат
- CSV-выгрузка по заработку и выплатам за выбранный период
- сброс пароля через SMS-код (использует общий компонент из `sa/docs/gozap/auth`)

## Out of Scope

- ручной запрос выплаты
- admin-зеркало (отдельная задача)

## Implementation Notes

- affected modules: точная структура `gozap-admin` не подтверждена в текущем workspace.
- constraints: данные должны строго фильтроваться по партнёру, выполняющему запрос.
- known technical context: зависит от backend задач расчёта баланса и Stripe payout.

## Acceptance Criteria

1. Партнёр видит только свои станции и данные.
2. Сводка и список станций корректно фильтруются по выбранному периоду.
3. Партнёр может указать/отредактировать банковский счёт/карту.
4. Партнёр видит историю выплат и может выгрузить CSV за период.
5. Партнёр может сбросить пароль через SMS-код.

## Dependencies

- `sa/docs/gozap/partners-admin/jira/backend-partners-model-and-station-binding.md`
- `sa/docs/gozap/partners-admin/jira/backend-partner-balance-calculation.md`
- `sa/docs/gozap/partners-admin/jira/backend-stripe-monthly-payout.md`
- `sa/docs/gozap/auth/tasks/task-breakdown.md`

## Risks

- нет

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
