# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Cleanup and retention jobs
- Priority: Medium
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: Image Enhancer создает guest artifacts, temporary convert results и async request rows, которые без cleanup policy будут накапливаться в storage и базе.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Без retention и cleanup jobs image enhancer оставит outdated guest images, stale processing requests и dangling temporary files, что увеличит storage cost и операционные риски.

## Scope

- добавить cleanup jobs для outdated guest images
- добавить cleanup jobs для outdated image processing requests
- удалять guest original/enhanced images и связанные preview/result files по retention policy
- удалять convert result files, если они не хранятся как permanent image rows
- использовать existing operational patterns из guest document cleanup и document trash cleanup
- добавить logging и safe behavior для частично уже удаленных файлов

## Out of Scope

- изменение продуктовых retention windows без отдельного подтверждения
- cleanup для existing documents domain

## Implementation Notes

- affected modules: cleanup mutations/commands/features, storage cleanup logic, scheduled operational jobs
- constraints: cleanup не должен ломать paywall return flows и не должен падать на missing files
- known technical context:
  - current guest cleanup controller: `microservices/main/src/api/mutation/guest/delete-outdated-guest-documents-and-requests/delete-outdated-guest-documents-and-requests.mutation-controller.ts`
  - current guest cleanup commands/features в `workspace/command/guest-document/*`

## Acceptance Criteria

1. Backend содержит отдельные cleanup jobs для outdated guest images и outdated image processing requests.
2. Cleanup jobs удаляют guest original/enhanced image artifacts и связанные preview/result files по подтвержденной retention policy.
3. Cleanup jobs удаляют stale convert results, если они не являются permanent image rows.
4. Cleanup безопасно обрабатывает уже удаленные файлы и не падает на partial state.
5. Logging позволяет отличить штатный cleanup от cleanup с операционными ошибками.

## Dependencies

- Guest image flow
- Generic processing request foundation
- Convert and enhancement pipelines

## Risks

- Несогласованная retention policy может удалить еще нужные artifacts
- Cleanup должен учитывать связку original/enhanced/result, чтобы не сломать возврат пользователя после auth/payment flow

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
