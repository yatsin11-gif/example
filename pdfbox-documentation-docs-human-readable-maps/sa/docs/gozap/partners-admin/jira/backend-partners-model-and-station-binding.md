# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Партнёры. Модель партнёра, станций и привязки с историей периодов
- Priority: High
- Labels: `ai-ready`, `backend`, `partners-admin`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: нужна основа данных для управления партнёрами и привязкой станций с процентом, на которой строится расчёт баланса и автоматические выплаты.
- Link to requirements: `sa/docs/gozap/partners-admin/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/partners-admin/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/partners-admin/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Сейчас нет модели партнёра и привязки станций с историей периодов и процентом отчисления, поэтому невозможно ни управлять партнёрской программой, ни корректно считать баланс по периоду владения станцией.

## Scope

- модель партнёра: логин, хэш пароля, имя, телефон
- модель привязки станции к партнёру: процент (включая 0%), дата начала, дата конца периода
- endpoint создания партнёра
- endpoint списка партнёров с поиском и фильтрацией
- endpoint привязки станции к партнёру с процентом
- endpoint отвязки станции от партнёра (закрытие текущего периода без удаления истории)

## Out of Scope

- расчёт баланса по аренде
- Stripe payout
- frontend

## Implementation Notes

- affected modules: точные пути модулей `gozap-backend` не подтверждены в текущем workspace, нужна сверка с реальной структурой репозитория перед реализацией.
- constraints: одна станция может быть привязана только к одному партнёру в один момент времени; отвязка не удаляет историю периода.
- known technical context: явная схема таблиц станций/партнёров отсутствует в текущем repo context.

## Acceptance Criteria

1. Можно создать партнёра с логином, паролем, именем, телефоном.
2. Можно найти и отфильтровать партнёра в списке.
3. Можно привязать станцию к партнёру с процентом, включая 0%.
4. Можно отвязать станцию от партнёра без удаления истории периодов.
5. Одна станция не может быть одновременно привязана к двум партнёрам.

## Dependencies

- нет

## Risks

- точная схема станций в `gozap-backend` не подтверждена

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
