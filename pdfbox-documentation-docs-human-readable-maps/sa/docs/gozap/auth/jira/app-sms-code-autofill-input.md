# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: APP - Поле ввода SMS-кода с автозаполнением и fallback на ручной ввод
- Priority: Medium
- Labels: `ai-ready`, `frontend`, `auth`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: пользователю терминала нужно автоматическое заполнение кода из SMS там, где это технически доступно, чтобы ускорить аренду, с ручным вводом как fallback.
- Link to requirements: `sa/docs/gozap/auth/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/auth/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/auth/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-station-app`
- Related repositories: `gozap-backend`

## Problem Statement

Поле ввода кода требует ручного набора, что замедляет основной поток аренды; нужна попытка автозаполнения с fallback на ручной ввод.

## Scope

- попытка автозаполнения кода из SMS на экране ввода кода терминала
- fallback на ручной ввод, если автозаполнение не сработало
- UI повторного запроса кода

## Out of Scope

- backend-генерация и верификация кода (см. отдельную backend-задачу)

## Implementation Notes

- affected modules: точная структура `gozap-station-app` не подтверждена в текущем workspace.
- constraints: автозаполнение зависит от платформы терминала; точный технический механизм не подтверждён.
- known technical context: зависит от backend-сервиса SMS-кода.

## Acceptance Criteria

1. При получении SMS-кода поле заполняется автоматически, если платформа это поддерживает.
2. Если автозаполнение не сработало, пользователь может ввести код вручную.
3. Пользователь может запросить повторную отправку кода.

## Dependencies

- `sa/docs/gozap/auth/jira/backend-sms-otp-service.md`

## Risks

- поддержка нативного SMS autofill на платформе терминала не подтверждена

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
