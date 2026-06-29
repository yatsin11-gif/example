# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Update requests after convert lambda
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: convert worker должен завершать backend request lifecycle через main service и оставлять консистентный request result для frontend polling.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Даже при готовом convert worker backend не будет завершать convert flow корректно без API для create/retrieve request, subscription-gated orchestration и message handler, который переводит request в `completed` или `failed` и записывает итоговый result contract.

## Scope

- реализовать create/retrieve API для `tool=convert` поверх generic request foundation
- использовать subscription access guards перед выдачей final downloadable artifact
- реализовать message handler, который обновляет request status/result после convert event
- определить, создается ли convert result как отдельная `workspace_images` row или как временный downloadable artifact
- если отдельная image row не создается, явно зафиксировать это в request result contract
- при необходимости обновлять связанные image rows или metadata после convert completion
- сохранять error state для failed convert requests

## Out of Scope

- реализация image conversion lambda
- frontend download UX

## Implementation Notes

- affected modules: `microservices/main/src/api/mutation/*`, `api/query/*`, `workspace/message/events/*`, `workspace/features/*`, processing request repositories/models
- constraints: request update и image update должны быть согласованы; completed request не должен оставаться без консистентного `result`
- known technical context:
  - current convert event handler pattern: `microservices/main/src/workspace/message/events/document/document-converted-to-pdf/document-converted-to-pdf.message-handler.ts`
  - current request status update features в document domain

## Acceptance Criteria

1. Backend принимает convert request и возвращает `requestId`.
2. Backend отдает convert processing request по `requestId`, включая как минимум `status`, `result` и `error`.
3. Convert completion/failure event обрабатывается через main backend message handler.
4. Success event переводит request в `completed` и записывает консистентный `result` contract.
5. Failure event переводит request в `failed` и сохраняет понятный error state.
6. Если convert result требует update image row или metadata, backend делает это согласованно с request update.

## Dependencies

- Generic processing request foundation
- Convert worker и event payload

## Risks

- Неподтвержденный convert result contract приведет к повторным правкам request schema
- Несогласованный request/image update может оставить `completed` request без usable artifact

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
