# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: FRONT - Partner Program. Кабинет партнёра
- Priority: High
- Labels: `ai-ready`, `frontend`, `partners`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: партнёру нужен личный кабинет со статистикой по станциям, балансом, выплатами и CSV-экспортом.
- Link to requirements: `sa/docs/partners/partner-program/requirements/feature-spec.md`
- Link to criteria: `sa/docs/partners/partner-program/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/partners/partner-program/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-admin`
- Related repositories: `gozap-backend`

## Problem Statement

В `gozap-admin` отсутствует кабинет партнёра: логин, статистика по станциям, сводка за период, детализация по станции, управление реквизитами выплат и история выплат.

## Scope

- логин и сброс пароля партнёра
- список станций партнёра (код, название, адрес, статус, аренды и вознаграждение за период)
- сводка за период (баланс, ближайшая выплата, завершённые аренды, вознаграждение, разбивка по станциям)
- детализация по станции (список аренд: дата, стоимость, вознаграждение + итог)
- форма указания/редактирования банковского счёта/карты
- история выплат
- кнопка выгрузки CSV по заработку и выплатам

## Out of Scope

- ручной запрос выплаты (не входит в продукт)

## Implementation Notes

- affected modules: раздел партнёра `gozap-admin`
- constraints: партнёр должен видеть только свои данные
- known technical context: зависит от API из `backend-partner-program-accounts-stations-balance.md`, `backend-partner-program-stripe-payouts.md`, `backend-partner-program-sms-password-reset.md`

## Acceptance Criteria

1. Партнёр может залогиниться и сбросить пароль через SMS.
2. Партнёр видит список своих станций с кодом, названием, адресом, статусом, числом аренд и вознаграждением за период.
3. Партнёр видит сводку за период: баланс, ближайшая выплата, завершённые аренды, вознаграждение, разбивка по станциям.
4. Партнёр может открыть станцию и увидеть список аренд (дата, стоимость, вознаграждение) с итогом.
5. Партнёр может указать/отредактировать банковский счёт/карту.
6. Партнёр видит историю выплат и может выгрузить CSV.

## Dependencies

- `sa/docs/partners/partner-program/jira/backend-partner-program-accounts-stations-balance.md`
- `sa/docs/partners/partner-program/jira/backend-partner-program-stripe-payouts.md`
- `sa/docs/partners/partner-program/jira/backend-partner-program-sms-password-reset.md`

## Risks

- Нет.

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
