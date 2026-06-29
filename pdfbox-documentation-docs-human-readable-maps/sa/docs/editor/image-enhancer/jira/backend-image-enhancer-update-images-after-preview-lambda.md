# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Update images after preview lambda
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: preview lambda должна завершать backend image lifecycle через main service, обновляя `workspace_images` по async event.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Даже при готовой preview lambda backend не обновит image rows автоматически, если не будет message handler и update feature для `previewKey`, image metadata и processing errors.

## Scope

- реализовать message handler для image preview completion/failure event
- реализовать feature update для записи `previewKey`, `metadata`, `processingError` в `workspace_images`
- обновлять `width`, `height`, `fileSize` после preview pipeline
- корректно обрабатывать original image и enhanced image
- сохранять понятный error state при failure event

## Out of Scope

- реализация preview lambda
- frontend preview rendering

## Implementation Notes

- affected modules: `microservices/main/src/workspace/message/events/*`, `workspace/features/*`, `workspace/database/models/*`
- constraints: update flow должен быть idempotent и не ломаться на повторных событиях; image row должен искаться по `fileKey` или эквивалентному стабильному linkage key
- known technical context:
  - current document preview handler: `microservices/main/src/workspace/message/events/document/document-preview-updated/document-preview-updated.message-handler.ts`
  - current document preview update feature: `microservices/main/src/workspace/features/document/features/update-document-preview.feature.ts`

## Acceptance Criteria

1. Backend принимает image preview completion/failure event через message handler.
2. Success event обновляет image row с `previewKey` и metadata fields, включая `width`, `height`, `fileSize`.
3. Failure event не ломает image lifecycle и сохраняет понятный error state.
4. Handler корректно работает как для original image, так и для enhanced image artifacts.
5. Повторная обработка одного и того же preview event не приводит к неконсистентному состоянию.

## Dependencies

- Image domain models
- Image preview lambda и event contract

## Risks

- Одни и те же preview events могут повторно доставляться
- Ошибочный linkage key приведет к update неправильного image row

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
