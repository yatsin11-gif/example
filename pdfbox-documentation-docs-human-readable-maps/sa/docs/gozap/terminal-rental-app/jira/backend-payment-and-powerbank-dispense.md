# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Аренда. Оплата на терминале и инициирование выдачи powerbank
- Priority: High
- Labels: `ai-ready`, `backend`, `terminal-rental-app`, `stripe`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: оплата картой должна обрабатываться через Stripe для обоих потоков аренды, а выдача powerbank должна начинаться только после подтверждения успешной оплаты.
- Link to requirements: `sa/docs/gozap/terminal-rental-app/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/terminal-rental-app/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/terminal-rental-app/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-station-app`

## Problem Statement

Нет единого backend-flow обработки оплаты через Stripe для основного и упрощённого потока, и нет связки результата оплаты с командой выдачи powerbank станцией.

## Scope

- создание платежа через Stripe для основного потока (с привязанным аккаунтом) и упрощённого потока (разовая оплата)
- обработка Stripe webhook о результате оплаты
- инициирование команды выдачи powerbank станцией после подтверждения успешной оплаты
- обработка отклонённой оплаты с понятным статусом для frontend

## Out of Scope

- создание аккаунта и привязка карты (см. отдельную задачу для основного потока)
- сам механический протокол станции, если он выходит за рамки команды backend

## Implementation Notes

- affected modules: точная структура `gozap-backend` не подтверждена в текущем workspace.
- constraints: выдача powerbank не должна инициироваться до подтверждения успешной оплаты.
- known technical context: сценарий "оплата прошла, но станция не выдала powerbank" не описан в исходных заметках и требует уточнения.

## Acceptance Criteria

1. Оплата картой обрабатывается через Stripe в обоих потоках.
2. Выдача powerbank инициируется только после подтверждения успешной оплаты.
3. Отклонённая оплата возвращает понятный статус ошибки без выдачи powerbank.

## Dependencies

- `sa/docs/gozap/terminal-rental-app/jira/backend-account-creation-and-card-binding.md` (для основного потока)

## Risks

- сценарий "оплата успешна, но powerbank не выдан физически" не описан и требует уточнения у SA

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
