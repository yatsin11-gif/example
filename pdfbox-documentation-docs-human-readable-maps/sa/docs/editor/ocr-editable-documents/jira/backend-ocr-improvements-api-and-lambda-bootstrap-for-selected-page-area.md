# Jira Task Spec

## Jira Header

- Project: `TBD`
- Issue type: Task
- Summary: BACK - OCR improvements. API and OCR lambda bootstrap for selected page area
- Priority: High
- Labels: `ai-ready`, `backend`, `editor`, `ocr`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: editor flow должен уметь запускать отдельный edit OCR сценарий по выделенной области страницы, а текущий backend поддерживает только document OCR flow.
- Link to requirements: `sa/docs/editor/ocr-editable-documents/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/ocr-editable-documents/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/ocr-editable-documents/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

Текущий backend имеет orchestration для общего OCR документа через `document-perform-ocr`, но не имеет отдельного request flow для area-based edit OCR, где фронт передает страницу и координаты области и ожидает server-side подготовленный результат для editor integration.

## Scope

- добавить endpoint `POST /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr`
- добавить endpoint статуса `GET /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr/{requestId}/status`
- добавить guest endpoint `POST /guest/documents/perform-edit-ocr`
- добавить guest endpoint статуса `GET /guest/documents/perform-edit-ocr/{requestId}/status`
- добавить request/response DTO для `pageNumber`, area coordinates и `ocrLanguage`
- добавить создание request и статусы по паттерну current OCR flows
- добавить CQRS orchestration через command/handler/feature
- упаковать и задеплоить новую OCR Lambda
- проверить Python runtime
- запускать OCR по вырезанной области с учетом `ocrLanguage`
- обработать success/failure и вернуть результат обратно в backend contract

## Out of Scope

- Gemini analysis
- frontend selection UI

## Implementation Notes

- affected modules: `microservices/main/src/api/mutation/document/*`, `workspace/command/document/*`, `workspace/features/document/*`
- constraints: следовать существующему `document-perform-ocr` паттерну и CQRS wiring
- known technical context:
  - current OCR controller: `microservices/main/src/api/mutation/document/document-perform-ocr/document-perform-ocr.mutation-controller.ts`
  - current guest OCR controller: `microservices/main/src/api/mutation/guest/guest-document-perform-ocr/guest-document-perform-ocr.mutation-controller.ts`
  - current command handler: `microservices/main/src/workspace/command/document/document-perform-ocr/document-perform-ocr.command-handler.ts`
  - current feature invoker: `microservices/main/src/workspace/features/document/features/document-perform-ocr.feature.ts`

## Acceptance Criteria

1. Backend принимает edit OCR request на `POST /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr` с номером страницы, координатами выделенной области и выбранным `ocrLanguage`.
2. Backend принимает guest edit OCR request на `POST /guest/documents/perform-edit-ocr` с эквивалентным payload для guest document context.
3. Backend отдает статус обработки через `GET /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr/{requestId}/status` и guest status через `GET /guest/documents/perform-edit-ocr/{requestId}/status`.
4. Backend создает request lifecycle для edit OCR, запускает новую Lambda и корректно обрабатывает success/failure для workspace и guest flows.
5. Новая Lambda упакована, деплоится и работает на подтвержденном Python runtime.
6. OCR по вырезанной области работает в минимальном bootstrap режиме и снимает основные архитектурные риски.

## Dependencies

- Уточненный минимальный response contract для frontend integration
- Доступность deploy wiring для новой Lambda

## Risks

- Payload shape может измениться на следующем этапе после добавления background cleaning и Gemini analysis
- Python runtime или packaging новой Lambda может потребовать дополнительной infra настройки

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
