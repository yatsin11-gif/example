# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. PicWish enhancement pipeline
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: enhancement через PicWish является основным backend flow фичи и должен создавать enhanced image, который возвращается вместе с original image для compare preview.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Backend должен запускать async enhancement requests, хранить provider linkage, обрабатывать provider completion и создавать новый enhanced image artifact для guest и authorized flows. Сейчас такого image-specific provider pipeline нет.

## Scope

- автоматически стартовать enhancement `2x` после guest upload или оставить явный orchestration hook, который делает это в confirmed guest flow
- реализовать create/retrieve API для `tool=enhance` поверх generic request foundation
- валидировать input format, file size, upscale `2x|4x` и enhancement limits
- использовать default upscale `2x`, если параметр не передан
- отправлять request в PicWish async API и сохранять `providerJobId`
- реализовать webhook endpoint от PicWish
- обновлять request status по provider callback
- по завершении создавать новую `workspace_images` запись для enhanced image и сохранять `originImageId`
- сохранять `outputImageId` и при необходимости `previewKey` в request `result`
- блокировать повторный enhancement для already enhanced image
- при `4x` отправлять в provider исходное изображение, а не `2x` result
- поддержать и guest flow, и authorized workspace flow

## Out of Scope

- frontend compare slider
- frontend watermark overlay

## Implementation Notes

- affected modules: image processing controllers/features, provider integration layer, webhook handling, image repositories
- constraints: provider webhook должен быть idempotent и безопасный; animated GIF behavior не должен silently вводиться без подтверждения
- known technical context:
  - current backend provider/webhook patterns в billing/webhook flows
  - generic request foundation и guest/workspace image flows из предыдущих tasks

## Acceptance Criteria

1. Backend принимает enhancement request для guest и authorized image flows и возвращает `requestId`.
2. Default upscale равен `2x`, если пользователь не передал значение явно.
3. Backend отправляет enhancement request в PicWish, сохраняет `providerJobId` и обновляет request status по provider callback.
4. Successful enhancement создает новую image row для enhanced artifact и сохраняет `originImageId`.
5. Request `result` содержит ссылку на enhanced output artifact, а при необходимости и `previewKey`.
6. Для `4x` backend повторно отправляет в provider исходное изображение, а не уже enhanced `2x` result.
7. Backend блокирует повторный enhancement для already enhanced image artifact.

## Dependencies

- Guest image flow
- Preview pipeline
- Generic processing request foundation

## Risks

- Provider webhook security и idempotency могут потребовать отдельной hardening работы
- Неподтвержденное animated GIF behavior не должно попасть в реализацию по умолчанию

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
