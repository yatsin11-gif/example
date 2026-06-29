# Jira Task Spec

## Jira Header

- Project: `PDF`
- Issue type: Task
- Summary: BACK - Image Enhancer. Models init for images and processing requests
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `image-enhancer`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: Image Enhancer требует отдельную image domain в backend, чтобы хранить original image, enhanced image и async processing requests отдельно от documents.
- Link to requirements: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/image-enhancer/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Текущий backend опирается на document и guest-document модели, но не имеет отдельной storage и request модели для image artifacts и image processing lifecycle, из-за чего Image Enhancer нельзя реализовать без смешивания image behavior с documents.

## Scope

- создать migrations для `workspace_images`
- создать migrations для `workspace_image_processing_requests`
- добавить self-reference `origin_image_id -> workspace_images.id`
- добавить индексы для `workspace_id`, `origin_image_id`, `author_id`, `processing_status`, `provider_job_id`
- добавить shared types для image entity и image processing request entity
- добавить enum `WorkspaceImageSource`
- добавить ORM models для `workspace_images` и `workspace_image_processing_requests`
- добавить repositories по паттерну current document repositories
- зафиксировать tool-aware request model для `enhance` и `convert`

## Out of Scope

- HTTP controllers
- lambda handlers
- PicWish integration

## Implementation Notes

- affected modules: `microservices/main/src/workspace/database/models/*`, shared types/enums в backend domain
- constraints: не смешивать image storage schema с existing document tables; request schema должна поддерживать как минимум `tool`, `params`, `result`, `status`, `error`
- known technical context:
  - current document repository pattern: `microservices/main/src/workspace/database/models/document/*`
  - current guest document repository pattern: `microservices/main/src/workspace/database/models/guest-document/*`
  - current async request repository patterns: `microservices/main/src/workspace/database/models/document-download-request/*`, `document-convert-to-pdf-request/*`

## Acceptance Criteria

1. Backend содержит отдельные persistent models для `workspace_images` и `workspace_image_processing_requests`.
2. `workspace_images` поддерживает связь `origin_image_id` для derived artifacts.
3. `workspace_image_processing_requests` поддерживает хранение `tool`, `params`, `result`, `status`, `error` и provider linkage.
4. Для новых таблиц добавлены согласованные индексы для workspace, origin image и processing access patterns.
5. ORM models, shared types и repositories позволяют создать original image, derived image и processing request без использования document tables.

## Dependencies

- Утвержденные requirements и criteria

## Risks

- Слишком узкая request schema приведет к повторным миграциям при добавлении новых image tools
- Если image entity будет повторять document entity без image-specific полей, усложнится preview/enhance contract

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
