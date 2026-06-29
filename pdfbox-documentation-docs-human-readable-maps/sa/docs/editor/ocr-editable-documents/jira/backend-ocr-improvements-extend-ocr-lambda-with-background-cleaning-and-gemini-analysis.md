# Jira Task Spec

## Jira Header

- Project: `TBD`
- Issue type: Task
- Summary: BACK - OCR improvements. Extend OCR lambda with background cleaning and Gemini analysis
- Priority: High
- Labels: `ai-ready`, `backend`, `lambda`, `editor`, `ocr`
- Assignee suggestion: Backend

## Business Context

- Почему существует эта задача: editor flow должен получать server-side подготовленный результат для подмены страницы и font metadata, а не только raw OCR output или client-side processing burden.
- Link to requirements: `sa/docs/editor/ocr-editable-documents/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/ocr-editable-documents/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/ocr-editable-documents/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdfbox-backend`
- Related repositories: `pdf.box-app`

## Problem Statement

После запуска минимального OCR bootstrap flow Lambda все еще не готовит итоговую очищенную страницу и не возвращает font-related enrichment, поэтому фронт не может просто подменить страницу server-side результатом.

## Scope

- расширить input/output контракт Lambda при необходимости
- сохранить совместимость с `ocrLanguage`, переданным в bootstrap request flow
- добавить логику очистки или подмены фона с дефолтным алгоритмом и дефолтной конфигурацией
- формировать итоговую обработанную страницу и загружать ее в `TempBucket`
- отправлять вырезанный image block в Gemini
- при необходимости передавать в Gemini не только картинку, но и OCR result для более точного анализа
- возвращать объединенный result payload из Lambda
- параллелить независимые части внутри Lambda там, где это уменьшает latency и не усложняет flow
- сохранить совместимость с backend flow:
  - `POST /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr`
  - `GET /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr/{requestId}/status`
  - `POST /guest/documents/perform-edit-ocr`
  - `GET /guest/documents/perform-edit-ocr/{requestId}/status`
- обновить deployment wiring и `docs/lambda-flows-map.md`, если контракт новой Lambda зафиксирован

## Out of Scope

- универсальная реконструкция всех страниц и документов
- вынесение Gemini integration в отдельный jobs module
- поддержка всех document classes и языков без ограничений первой итерации

## Implementation Notes

- affected modules: `cloudformation/lambda/*`, `cloudformation/environments/*`, возможный backend lambda invoker wiring
- constraints: follow current lambda deployment and failure-routing conventions from `cloudformation/README.md`
- known technical context:
  - existing lambda contracts tracked in `docs/lambda-flows-map.md`
  - current OCR flow publishes `ocr_chunk_processed_event` and `ocr_performed_event`
  - new lambda may require matching update to flow map and deployment scripts/templates

## Acceptance Criteria

1. Lambda расширяет bootstrap flow из первой backend задачи без смены пользовательского сценария и request lifecycle для workspace и guest flows.
2. Lambda подготавливает cleaned/replaced page result и загружает итоговый asset в `TempBucket`.
3. Lambda отправляет вырезанный block в Gemini и возвращает font-related metadata в объединенном result payload.
4. Если это улучшает latency без усложнения flow, независимые части внутри Lambda выполняются параллельно.
5. Backend status/result contract и lambda flow documentation обновлены под расширенный payload для workspace и guest flows.

## Dependencies

- Backend bootstrap task with confirmed request/status contract
- Доступность OCR dependencies, `TempBucket` и Gemini credentials/config

## Risks

- Качество background replacement может быть нестабильным на сложных документах
- Gemini metadata может быть неполной или неточной
- Расширение Lambda contract может потребовать синхронных правок backend response model

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
