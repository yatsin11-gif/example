# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Партнёры. Расчёт баланса по завершённым арендам
- Priority: High
- Labels: `ai-ready`, `backend`, `partners-admin`, `billing`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: при завершении аренды система должна начислить долю активного на тот момент партнёра, не искажая историю при последующей отвязке/привязке станции.
- Link to requirements: `sa/docs/gozap/partners-admin/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/partners-admin/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/partners-admin/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Нет логики, которая при завершении аренды определяла бы активного на станции партнёра и начисляла бы ему долю в баланс с учётом истории периодов привязки.

## Scope

- обработчик события завершения аренды, определяющий партнёра, активного на станции на момент завершения
- начисление доли вознаграждения в баланс партнёра по проценту станции
- агрегация начислений по периоду и по станции для сводки
- запрет пересчёта прошлых начислений при последующей отвязке/привязке станции

## Out of Scope

- Stripe payout
- frontend

## Implementation Notes

- affected modules: точные пути модулей не подтверждены в текущем workspace.
- constraints: расчёт должен опираться на дату завершения аренды и историю периодов из задачи "Модель партнёра, станций и привязки".
- known technical context: контракт события "аренда завершена" не подтверждён в текущем repo context.

## Acceptance Criteria

1. При завершении аренды начисляется доля партнёра, активного на станции в этот момент.
2. Отвязка станции от партнёра не меняет уже сделанные начисления за прошлый период.
3. Сводка по периоду и станции корректно агрегирует число аренд и сумму вознаграждения.

## Dependencies

- `sa/docs/gozap/partners-admin/jira/backend-partners-model-and-station-binding.md`

## Risks

- нет точного контракта события завершения аренды в текущем repo context

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
