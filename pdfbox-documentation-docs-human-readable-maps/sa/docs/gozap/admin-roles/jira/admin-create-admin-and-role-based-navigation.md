# Jira Task Spec

## Jira Header

- Project: `GOZAP`
- Issue type: Task
- Summary: ADMIN - Создание админа и навигация по уровню доступа
- Priority: Medium
- Labels: `ai-ready`, `admin`, `admin-roles`
- Assignee suggestion: Frontend/Admin

## Business Context

- Почему существует эта задача: супер-админу нужен UI создания админа с выбором уровня доступа, а админу — навигация, ограниченная его уровнем.
- Link to requirements: `sa/docs/gozap/admin-roles/requirements/feature-spec.md`
- Link to criteria: `sa/docs/gozap/admin-roles/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/gozap/admin-roles/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `gozap-admin`
- Related repositories: `gozap-backend`

## Problem Statement

В админке нет формы создания админа с выбором уровня доступа и нет навигации, которая бы скрывала разделы, недоступные уровню текущего админа.

## Scope

- форма создания админа с выбором уровня доступа (видна только супер-админу)
- построение меню/навигации по уровню доступа текущего админа
- сообщение об отсутствии доступа при прямом переходе на запрещённый раздел

## Out of Scope

- гранулярные права на уровне отдельных действий

## Implementation Notes

- affected modules: точная структура `gozap-admin` не подтверждена в текущем workspace.
- constraints: UI должен скрывать недоступные разделы, а backend должен дополнительно проверять доступ на каждом запросе.
- known technical context: зависит от backend задачи модели уровней доступа.

## Acceptance Criteria

1. Только супер-админ видит форму создания админа с выбором уровня доступа.
2. После входа админ видит в навигации только разделы своего уровня доступа.
3. При прямом переходе на запрещённый раздел показывается сообщение об отсутствии доступа.

## Dependencies

- `sa/docs/gozap/admin-roles/jira/backend-access-levels-model.md`

## Risks

- нет

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
