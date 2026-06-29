# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Generic image processing request foundation
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: enhancement и conversion должны использовать единый processing request contract, чтобы frontend мог polling-ить request и переоткрывать уже созданный результат.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Backend не имеет общего request lifecycle для image tools. Без generic processing request foundation придется дублировать request creation, polling, status updates и result storage отдельно для enhance и convert flows.

## Scope

- реализовать generic feature set для `workspace_image_processing_requests`
- поддержать creation, retrieval и status update для request entity
- зафиксировать contract для `params` и `result` по `tool=enhance` и `tool=convert`
- хранить `providerJobId`, `outputImageId`, output `fileKey`, `previewKey`, `upscale`, `format`, `errorMessage`
- подготовить client и guest query layers для request polling
- добавить endpoint `POST /clients/images/enhance`
- добавить endpoint `GET /clients/images/enhance/{requestId}`
- добавить endpoint `POST /clients/images/convert`
- добавить endpoint `GET /clients/images/convert/{requestId}`
- добавить endpoint `POST /guest/images/enhance`
- добавить endpoint `GET /guest/images/enhance/{requestId}`
- добавить endpoint `POST /guest/images/convert`
- добавить endpoint `GET /guest/images/convert/{requestId}`
- встроить rate limiting по аналогии с guest document mutations

## Out of Scope

- конкретная provider integration
- lambda image processing implementation

## Implementation Notes

- affected modules: `microservices/main/src/api/mutation/*`, `api/query/*`, `workspace/command/*`, `workspace/query/*`, `workspace/features/*`
- constraints: request retrieval route не несет `imageId`, поэтому access check должен надежно восстанавливаться через request ownership chain
- known technical context:
  - current guest convert request controller: `microservices/main/src/api/mutation/guest/create-document-convert-to-pdf-request/create-document-convert-to-pdf-request.mutation-controller.ts`
  - current guest request status controller: `microservices/main/src/api/query/guest/get-document-convert-to-pdf-request-status/get-document-convert-to-pdf-request-status.query-controller.ts`
  - current client download request controller: `microservices/main/src/api/mutation/document/create-document-download-request/create-document-download-request.mutation-controller.ts`

## Acceptance Criteria

1. Backend умеет создать image processing request и вернуть `requestId` для guest и client flows.
2. Backend умеет отдать processing request по `requestId`, включая `status`, `params`, `result` и `error`.
3. Generic request contract покрывает как минимум `tool=enhance` и `tool=convert`.
4. Access check для request retrieval надежно восстанавливается через request ownership chain без обязательного `imageId` в route.
5. Guest create endpoints защищены rate limiting по текущим backend patterns.

## Dependencies

- Image domain models

## Risks

- Слишком generic schema без tool-specific validation увеличит риск runtime ошибок
- Request-centric route требует надежного ownership/access check через `requestId -> image/workspace/client`

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
