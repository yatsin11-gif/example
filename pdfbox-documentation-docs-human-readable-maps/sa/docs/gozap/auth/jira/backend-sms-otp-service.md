# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - SMS-код. Генерация, отправка через Twilio и верификация
- Priority: High
- Labels: `ai-ready`, `backend`, `auth`, `twilio`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: нужен единый сервис одноразового SMS-кода, используемый и в основном потоке аренды на терминале, и при сбросе пароля партнёра.
- Link to requirements: `sa/docs/gozap/auth/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/auth/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/auth/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-station-app`, `gozap-admin`

## Problem Statement

Нет общего сервиса генерации, отправки через Twilio и верификации одноразового SMS-кода с ограничением срока жизни, частоты отправки и числа попыток.

## Scope

- генерация одноразового кода с ограниченным сроком жизни
- отправка кода через Twilio на указанный номер телефона
- ограничение частоты повторной отправки кода на один номер
- верификация кода с ограничением числа попыток
- инвалидация кода после истечения срока жизни или превышения числа попыток

## Out of Scope

- бизнес-логика после успешной верификации (создание аккаунта, сброс пароля — реализуются в соответствующих фичах)

## Implementation Notes

- affected modules: точная структура `gozap-backend` не подтверждена в текущем workspace.
- constraints: сервис должен быть переиспользуемым между потоками аренды и сброса пароля партнёра.
- known technical context: точный срок жизни кода и число попыток не подтверждены.

## Acceptance Criteria

1. Код отправляется через Twilio на указанный номер.
2. Повторная отправка кода на один номер ограничена по частоте.
3. Код верифицируется только в течение срока жизни и ограниченного числа попыток.
4. После истечения срока жизни или превышения попыток требуется новый код.

## Dependencies

- нет

## Risks

- точный срок жизни кода и число попыток не подтверждены

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
