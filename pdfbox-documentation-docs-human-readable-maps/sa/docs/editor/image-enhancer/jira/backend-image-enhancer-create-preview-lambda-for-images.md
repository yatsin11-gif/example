# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Create preview lambda for images
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: image dashboard и editor preview требуют lightweight preview artifact и image metadata сразу после upload или после создания derived image.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Сейчас backend имеет document preview pipeline через S3-triggered lambda, но не имеет аналогичного preview generation flow для image files, из-за чего image list и preview sidebar не получают preview artifact и image metadata автоматически.

## Scope

- создать image preview lambda по аналогии с `create-preview-document-v2`
- запускать lambda по S3 notifications для guest/tmp и persistent workspace image prefixes
- делать `headObject` и пропускать preview generation для файлов больше `20 MB`, сохраняя лог и failure/success event
- определить preview output format для image previews
- публиковать rabbit event completion/failure с payload уровня `{ imageFileKey, previewFileKey, metadata, isGuestImage, status, errorMessage }`
- сделать event contract достаточным для последующего backend update image row

## Out of Scope

- BE message handler
- update `workspace_images` after event
- frontend watermark overlay
- final downloadable artifact generation

## Implementation Notes

- affected modules: `cloudformation/lambda/*`, lambda build/deploy wiring
- constraints: lambda должна работать и для guest storage, и для persistent workspace image storage; preview generation не должна silently ломаться на oversized files
- known technical context:
  - current document preview lambda: `cloudformation/lambda/create-preview-document-v2/index.ts`
  - current preview failure routing: `cloudformation/lambda/lambda-failure-handler/index.ts`

## Acceptance Criteria

1. Upload нового image file в подтвержденные guest/workspace prefixes запускает отдельную image preview lambda.
2. Lambda проверяет размер файла и не генерирует preview для image files больше `20 MB`.
3. Lambda генерирует preview artifact в согласованном output format и публикует completion event с metadata.
4. Lambda публикует failure event с понятным error payload, если preview generation не удалась.
5. Event contract достаточен для обновления image row на стороне main backend без дополнительных синхронных вызовов.

## Dependencies

- Image domain models
- Решение по preview output format

## Risks

- Неподтвержденный preview format может привести к несовместимости с client rendering assumptions
- Event payload должен быть достаточно стабильным для дальнейшего message handling

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
