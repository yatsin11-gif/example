# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Additional alignment with updated requirements
- Priority: Medium
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: после завершения исходного backend scope по Image Enhancer в requirements появились дополнительные правила по `heif/heic`, quality mode selection, selected-result convert/download и bulk image download. Эти изменения нельзя раскладывать в уже выполненные задачи и нужно вынести в отдельный follow-up.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`, `pdf.box-landing`

## Problem Statement

Текущий `pdfbox-backend` уже содержит image domain, guest/client image endpoints, PicWish webhook flow, preview lambda, convert lambda и processing request lifecycle. Но обновленные requirements добавили follow-up behavior, который не был частью исходных задач: quality mode rules вместо provider-level `2x/4x`, поддержка `heif/heic`, convert/download по последней выбранной версии результата и bulk image download. Это требует отдельной задачи поверх уже выполненного scope.

## Scope

- доработать существующие backend contracts и pipelines без переписывания completed foundation scope
- затронутые endpoint families и flows:
  - `POST /guest/images/enhance`
  - `GET /guest/images/enhance/:requestId`
  - `POST /clients/images/enhance`
  - `GET /clients/images/enhance/:requestId`
  - `POST /clients/images/convert`
  - `GET /clients/images/convert/:requestId`
  - `cloudformation/lambda/create-preview-image`
  - `cloudformation/lambda/convert-image`
- привести enhancement contract к актуальным правилам:
  - backend выбирает quality mode по подтвержденным условиям
  - `2x/4x` не создают отдельные provider requests
- поддержать `heif/heic` как input formats для image enhancer flow
- выполнить backend normalization в provider-supported format перед PicWish, если текущий provider path этого требует
- привести convert pipeline к актуальному output matrix:
  - `png`
  - `webp`
  - `jpg`
  - `tiff`
  - `heif/heic`
- убрать неподтвержденные image-enhancer format assumptions, которые расходятся с текущими requirements
- определить и реализовать backend contract для download/convert по последней выбранной пользователем версии результата
- добавить image-specific single download и bulk download request flow для confirmed dashboard scope, если текущий image contract этого еще не покрывает
- сохранить текущий polling/status behavior или расширить его согласованно с уже существующим image processing request contract

## Out of Scope

- изменение смысла или переписывание уже выполненных Tasks 1-10
- frontend compare slider
- frontend watermark UI
- новые image actions beyond подтвержденных download/convert flows

## Implementation Notes

- affected modules:
  - `microservices/main/src/api/mutation/image/create-image-enhancement-request/*`
  - `microservices/main/src/api/mutation/guest/create-guest-image-enhancement-request/*`
  - `microservices/main/src/api/mutation/image/create-image-convert-request/*`
  - `microservices/main/src/workspace/command/image/*`
  - `microservices/main/src/workspace/query/image/*`
  - `microservices/main/src/workspace/features/image/*`
  - `cloudformation/lambda/create-preview-image/*`
  - `cloudformation/lambda/convert-image/*`
- constraints:
  - follow-up must not invalidate the completed base scope
  - FE/BE integration changes must remain explicit and backward-compatibility risks must be surfaced
  - selected-result contract must be ownership-safe and stable for polling/download
- known technical context:
  - current enhancement DTO still exposes provider-facing `scale`: `microservices/main/src/api/mutation/image/create-image-enhancement-request/dto/request/create-image-enhancement-request.request.dto.ts`
  - current enhancement validation still contains outdated format assumptions: `microservices/main/src/workspace/features/image/features/validate-image-enhancement-request.feature.ts`
  - current preview lambda does not yet cover full updated input matrix: `cloudformation/lambda/create-preview-image/index.ts`
  - current convert lambda still contains outdated format logic: `cloudformation/lambda/convert-image/index.ts`
  - image domain currently has no explicit completed single/bulk image download request family matching document download lifecycle

## Acceptance Criteria

1. Backend supports updated Image Enhancer requirements as a follow-up without redefining already completed base tasks.
2. Enhancement flow follows confirmed quality mode rules and does not create separate provider requests for `2x` and `4x`.
3. `heif/heic` are supported through the agreed enhancement, preview and convert path.
4. Download and convert use the latest user-selected result version through an explicit backend contract.
5. Backend supports confirmed single and bulk image download scope, or explicitly documents the remaining technical blocker if an infra dependency is required.

## Dependencies

- Completed Tasks 1-10
- Agreement on landing guest signal for HD mode, if current backend context is insufficient
- Agreement on selected-result reference contract for download/convert

## Risks

- Contract changes may require coordinated FE rollout
- `heif/heic` support depends on runtime/library support in deployed lambdas
- Bulk image download may require extra infra or cleanup handling beyond the current image request lifecycle

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
