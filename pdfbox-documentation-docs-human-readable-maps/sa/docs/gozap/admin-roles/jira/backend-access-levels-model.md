# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: BACK - Роли. Модель уровней доступа и проверка доступа к разделам
- Priority: Medium
- Labels: `ai-ready`, `backend`, `admin-roles`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: нужна модель ролей и серверная проверка доступа, чтобы только супер-админ мог создавать админов и назначать им уровень доступа к разделам.
- Link to requirements: `sa/docs/gozap/admin-roles/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/admin-roles/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/admin-roles/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-backend`
- Related repositories: `gozap-admin`

## Problem Statement

Нет модели роли/уровня доступа для админа и нет серверной проверки доступа к разделам, кроме сокрытия на UI.

## Scope

- модель роли/уровня доступа для админа (супер-админ, админ)
- endpoint создания админа с уровнем доступа, доступный только запросу от супер-админа
- middleware проверки доступа к разделам по уровню роли запрашивающего админа

## Out of Scope

- гранулярные права на уровне отдельных действий
- аудит-лог действий админов

## Implementation Notes

- affected modules: точная структура `gozap-backend` не подтверждена в текущем workspace.
- constraints: проверка доступа должна выполняться на backend независимо от UI.
- known technical context: точный список разделов и их сопоставление уровням доступа не подтверждён.

## Acceptance Criteria

1. Только супер-админ может создать нового админа и назначить ему уровень доступа.
2. Backend отклоняет запросы к разделам, не входящим в уровень доступа запрашивающего админа.
3. Backend логирует попытки доступа к запрещённым разделам.

## Dependencies

- нет

## Risks

- точный список разделов и уровней доступа не подтверждён

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
