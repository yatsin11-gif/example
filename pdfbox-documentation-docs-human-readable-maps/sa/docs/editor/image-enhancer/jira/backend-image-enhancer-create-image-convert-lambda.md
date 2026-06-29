# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Create image convert lambda
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: subscribed user должен иметь возможность получить enhanced image в исходном или supported output format через async conversion flow.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

После enhancement backend должен уметь асинхронно конвертировать image artifact в supported formats через отдельный worker. Сейчас такой image-specific convert lambda отсутствует.

## Scope

- валидировать allowed input/output formats для image-to-image и image-to-pdf conversion
- использовать согласованную PDF conversion dependency для `pdf`
- использовать image conversion lambda c `sharp` для `png`, `webp`, `jpg`, `gif`, `tiff`
- сохранять convert result в temporary storage
- публиковать convert completion/failure event с payload `{ requestId, imageId, fileKey, status, metadata, errorMessage }`

## Out of Scope

- create/retrieve API для `tool=convert`
- BE message handler после convert event
- update request/result rows after convert completion
- subscription access guards перед выдачей final downloadable artifact
- UI download modal
- batch zip orchestration для multi-select beyond confirmed scope

## Implementation Notes

- affected modules: lambda implementation for image conversion plus related invocation/event contract wiring
- constraints: image routes не должны reuse misleading `convert-from-pdf` naming; output format validation должна быть явной
- known technical context:
  - current document conversion lambda pattern: `cloudformation/lambda/convert-from-pdf-v2/index.ts`, `convert-to-pdf-v2/index.ts`
  - current client download command handler: `microservices/main/src/workspace/command/document/create-document-download-request/create-document-download-request.command-handler.ts`

## Acceptance Criteria

1. Convert lambda валидирует supported input/output formats для image conversion.
2. Convert lambda поддерживает agreed PDF output path и image output paths для `png`, `webp`, `jpg`, `gif`, `tiff`.
3. Async worker сохраняет convert result в temporary storage и публикует completion/failure event.
4. Event payload достаточен для последующего backend update request/result lifecycle.
5. Реализация lambda не включает create/retrieve API и не включает message handler logic.

## Dependencies

- Generic processing request foundation
- Решение по convert result contract

## Risks

- Convert result contract зависит от решения, нужен ли отдельный image row для result
- Naming и reuse current document conversion patterns могут привести к смешению image и document semantics

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
