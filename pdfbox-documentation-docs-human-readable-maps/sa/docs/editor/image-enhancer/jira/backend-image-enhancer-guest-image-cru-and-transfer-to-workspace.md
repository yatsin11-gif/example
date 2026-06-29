# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Guest image CRU and transfer to workspace
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: guest flow является primary entry для Image Enhancer и должен сохранить original/enhanced image artifacts до auth/payment шага, а затем перенести их в workspace.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Текущий backend умеет создавать и переносить guest documents, но не имеет guest image domain и transfer flow для original/enhanced image artifacts, что блокирует guest upload и возврат пользователя к результату после auth/subscription steps.

## Scope

- реализовать guest image create/get/update family по паттерну `guest/documents`
- проверить текущий `POST /storage/get-presigned-post-url-batch` и подтвердить, что он покрывает guest image upload contract
- если текущего контракта недостаточно, расширить `get-presigned-post-url-batch` для guest image prefixes, image MIME validation и guest upload rules
- добавить endpoint `POST /guest/images`
- добавить endpoint `GET /guest/images/{id}`
- добавить endpoint `PATCH /guest/images/{imageId}`
- использовать presigned-upload contract без конвертации upload в PDF
- реализовать transfer feature для guest original image и guest enhanced image после `sign-up`, `sign-in`, `sign-in-with-social-provider`
- при переносе сохранять `originImageId`, metadata, preview key и derived-image linkage
- переиспользовать current guest-to-workspace materialization pattern там, где он подходит

## Out of Scope

- frontend redirect обратно в editor
- paywall UI
- auth UX

## Implementation Notes

- affected modules: `microservices/main/src/api/mutation/guest/*`, `api/query/guest/*`, `workspace/command/guest-*`, `workspace/features/guest-*`
- constraints: guest upload flow должен сохранять image behavior без document conversion; transfer original/enhanced pair должен быть согласованным
- known technical context:
  - current guest create controller: `microservices/main/src/api/mutation/guest/create-guest-documents/create-guest-documents.mutation-controller.ts`
  - current guest get controller: `microservices/main/src/api/query/guest/get-guest-document-by-id/get-guest-document-by-id.query-controller.ts`
  - current guest-to-workspace feature: `microservices/main/src/workspace/features/document/features/create-document-from-guest-document.feature.ts`

## Acceptance Criteria

1. Backend поддерживает `POST /guest/images`, `GET /guest/images/{id}` и `PATCH /guest/images/{imageId}` для guest image lifecycle.
2. Guest image upload использует общий или расширенный presigned-upload contract без document conversion в PDF.
3. Backend умеет переносить guest original image и guest enhanced image в workspace после подтвержденных auth transitions.
4. После transfer сохраняется связь `originImageId` и доступность preview/result files из постоянного storage.
5. Transfer flow не теряет derived-image linkage между original и enhanced artifacts.

## Dependencies

- Модели image domain
- Preview preservation
- Enhancement artifacts flow

## Risks

- Current guest transfer pattern может предполагать `guestDocument.id === document.id`
- Current presigned upload flow может не различать guest image uploads и guest document uploads
- Неатомарный transfer может привести к потере связи между original и enhanced image

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
