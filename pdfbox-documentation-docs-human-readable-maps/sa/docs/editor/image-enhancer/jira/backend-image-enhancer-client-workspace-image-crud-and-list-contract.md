# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Client workspace image CRUD and list contract
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: dashboard images должны стать отдельной backend-сущностью, чтобы `pdf.box-app` мог отображать и управлять image artifacts отдельно от documents.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Сейчас backend имеет только document-oriented client CRUD, list и copy flows. Для Image Enhancer нужен отдельный image contract для dashboard, preview sidebar и image lifecycle actions, не завязанный на PDF-specific assumptions documents domain.

## Scope

- реализовать client-scoped controllers, commands, queries и features для image CRUD
- проверить текущий `POST /storage/get-presigned-post-url-batch` и подтвердить, что он покрывает workspace image upload contract без document-specific assumptions
- если текущего контракта недостаточно, расширить `get-presigned-post-url-batch` для image prefixes, image MIME validation и workspace image upload rules
- добавить endpoint `POST /clients/workspaces/{workspaceId}/images/batch`
- добавить endpoint `GET /clients/workspaces/{workspaceId}/images/batch`
- добавить endpoint `GET /clients/images`
- добавить endpoint `GET /clients/images/{imageId}`
- добавить endpoint `PATCH /clients/images/{imageId}`
- добавить endpoint `POST /clients/images/restore`
- добавить endpoint `DELETE /clients/images`
- добавить endpoint `DELETE /clients/images/immediately`
- добавить endpoint `POST /clients/image/{imageId}/copy`
- поддержать list filtering и cursor pagination по `title`, `fromTrash`, `afterUpdatedAt`, `beforeUpdatedAt`, `folderId`
- включить в response поля для image list и preview sidebar: file key/url, preview key/url, metadata, `originImageId`, `source`, `isEnhanced`

## Out of Scope

- folders
- `Move to`
- `Favorites`
- frontend wiring в `pdf.box-app`

## Implementation Notes

- affected modules: `microservices/main/src/api/mutation/*`, `api/query/*`, `workspace/command/*`, `workspace/query/*`, `workspace/features/*` for new image domain
- constraints: image list contract не должен использовать document query handlers; copy route должен сохранить текущий singular copy pattern family
- known technical context:
  - current batch create controller: `microservices/main/src/api/mutation/document/create-documents/create-documents.mutation-controller.ts`
  - current batch get controller: `microservices/main/src/api/query/document/get-documents-by-ids/get-documents-by-ids.query-controller.ts`
  - current paginated list controller: `microservices/main/src/api/query/document/get-paginated-documents/get-paginated-documents.query-controller.ts`
  - current copy controller: `microservices/main/src/api/mutation/document/copy-document/copy-document.mutation-controller.ts`
  - current storage presign controller: `microservices/main/src/api/query/guest/signed-post-url-batch/signed-post-url-batch.query-controller.ts`

## Acceptance Criteria

1. Backend поддерживает отдельные client image CRUD endpoints для create/get/list/update/restore/delete/immediate delete/copy.
2. `GET /clients/images` возвращает cursor-paginated image list с поддержкой подтвержденных filters и без использования document response contract как единственной модели.
3. Image response содержит поля, достаточные для dashboard image card и preview sidebar, включая `previewKey` или `previewUrl`, metadata и `isEnhanced`.
4. `POST /storage/get-presigned-post-url-batch` либо подтвержден как достаточный для workspace image uploads, либо расширен под image-specific prefixes и validation rules.
5. Image copy flow работает в отдельной image family и не требует использования document entity.

## Dependencies

- Модели и repositories из image domain foundation
- Уточнение response DTO fields, если потребуется синхронизация с frontend

## Risks

- Current list contract может содержать PDF-specific assumptions
- Current presigned upload flow может оказаться завязанным на document naming и document prefixes
- Copy path family должна остаться консистентной с текущей backend routing convention

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
