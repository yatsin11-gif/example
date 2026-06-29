# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Background Remover. Сквозной PicWish pipeline
- Priority: Medium
- Labels: `ai-ready`, `backend`, `editor`, `background-remover`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: backend должен дать единый lifecycle для background remover от request creation до processed result persistence, чтобы frontend мог автоматически запускать removal, poll-ить статус, показывать processed image и использовать его в download/convert flow.
- Link to requirements: `sa/docs/editor/background-remover/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/background-remover/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/background-remover/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`, `picwish-service`

## Problem Statement

Текущий repo context уже содержит image CRUD, `workspace_image_processing_requests`, preview и convert lambdas, а также `background_remove` enum values. Не хватает единого end-to-end backend pipeline для background removal: typed request/result contract, request API, provider integration, webhook completion, обработки guest-to-client auth transition и создания derived removed image.

## Scope

- расширить `libs/common-shared-lib/src/libs/types/models/workspace/image-processing-request.ts` явными background-remover params/result types
- зафиксировать в result как минимум `outputImageId`, `fileKey`, `previewKey`, `outputFormat`, `providerMeta`
- добавить endpoint `POST /clients/images/background-remove` с array payload
- добавить endpoint `GET /clients/images/background-remove/status/batch`
- добавить endpoint `POST /guest/images/background-remove`
- добавить endpoint `GET /guest/images/background-remove/status/batch`
- добавить DTO, commands, queries и features для create background-remover requests
- валидировать ownership/access через request ownership chain
- валидировать поддерживаемые входные форматы against current image domain enums
- валидировать max input size `20 MB` before provider call
- сохранять created request with `tool=background_remove`, `provider=picwish`, `status=processing`
- проверить auth transition flow после `sign-up`, `sign-in`, `sign-in-with-social-provider` для guest background-remover requests
- обеспечить, что после auth transition flow сохраняется как original image, так и результат background-remover
- реализовать PicWish background-removal integration layer: create request, status mapping, typed callback/result parsing
- доработать webhook handling и добавить ветку для `BACKGROUND_REMOVE`
- скачать provider PNG result, сохранить его по текущим image storage patterns и создать derived `workspace_images` row
- выставлять `source=background_remove`, `originImageId`, `mimeType=image/png`, `extension=png`
- формировать title/file naming с обязательным префиксом `removed_`
- обновлять request `result` и terminal status on completion/failure
- обеспечить идемпотентный completion for duplicate callbacks by `providerJobId` or `requestId`

## Out of Scope

- подстановка fallback background для итогового `pdf/jpg` conversion output
- frontend restore/remove UI
- payment/subscription gate
- manual mask editing
- batch background removal

## Implementation Notes

- affected modules:
  - `libs/common-shared-lib/src/libs/types/models/workspace/image-processing-request.ts`
  - `microservices/main/src/api/mutation/*`
  - `microservices/main/src/api/query/*`
  - `microservices/main/src/api/mutation/webhooks/*`
  - `microservices/main/src/workspace/command/*`
  - `microservices/main/src/workspace/query/*`
  - `microservices/main/src/workspace/features/*`
  - `microservices/main/src/workspace/message/events/*`
  - `microservices/main/src/workspace/message/jobs/index.ts`
- constraints:
  - request retrieval route does not include `imageId`, so access check must be reconstructed from request ownership
  - processed artifact must remain PNG-capable to preserve transparency
  - webhook route name cannot be confidently inferred from current repo context and should be confirmed before implementation
- known technical context:
  - image CRUD already exists in `microservices/main/src/api/mutation/image/*`, `api/mutation/guest/*`, `api/query/image/*`, `api/query/guest/*`
  - current image file-key patterns are `guest-images/{imageId}/...` and `workspaces/{workspaceId}/images/{imageId}/...`
  - preview and convert follow dedicated lambda/event flows in `cloudformation/lambda/create-preview-image` and `cloudformation/lambda/convert-image`
  - guest image transfer pattern is already called out in `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-guest-image-cru-and-transfer-to-workspace.md` and should be extended to cover background-remover request linkage, not only image files
  - local repo context for `picwish-service` was not available in the current workspace, so exact provider module paths must be confirmed before implementation

## Acceptance Criteria

1. Backend поддерживает create и get-status endpoints для guest и client background-remover requests.
2. Background-remover params/result contract является явным и не опирается на `Record<string, any>` для product-critical полей.
3. Backend отклоняет неподдерживаемые форматы и input files больше `20 MB` до отправки запроса в provider.
4. Created requests persist `tool=background_remove`, `provider=picwish` и initial processing status.
5. После `sign-up` / `sign-in` / `sign-in-with-social-provider` guest background-remover flow сохраняет original image и removed image в workspace context.
6. PicWish completion callback for background removal обрабатывается через выделенную backend branch.
7. Successful completion создает derived removed image artifact с `source=background_remove`, `originImageId` и `removed_` prefix.
8. Request status переходит в terminal `completed` или `failed`, а `result` содержит processed artifact references для successful requests.
9. Duplicate webhook deliveries не создают duplicate image rows и не ломают final request state.

## Dependencies

- `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-generic-processing-request-foundation.md`
- `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-client-workspace-image-crud-and-list-contract.md`
- `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-guest-image-cru-and-transfer-to-workspace.md`
- `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-picwish-enhancement-pipeline.md`
- `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-update-images-after-preview-lambda.md`

## Risks

- Финальный список поддерживаемых входных форматов все еще остается открытым продуктовым вопросом
- Exact PicWish webhook route и provider integration details все еще требуют подтверждения
- Готовность preview для processed image зависит от доступности текущего image preview pipeline

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
