# Jira Task Spec

## Jira Header

- Project: `TBD`
- Issue type: Task
- Summary: FE - OCR improvements. Integrate edit OCR selected-area flow in editor
- Priority: High
- Labels: `ai-ready`, `frontend`, `editor`, `ocr`
- Assignee suggestion: Frontend

## Business Context

- Почему существует эта задача: пользователь должен иметь editor flow для выбора области и запуска edit OCR без локальной очистки страницы и без привязки к общему document OCR flow.
- Link to requirements: `sa/docs/editor/ocr-editable-documents/requirements/feature-spec.md`
- Link to criteria: `sa/docs/editor/ocr-editable-documents/requirements/feature-criteria.md`
- Link to decomposition: `sa/docs/editor/ocr-editable-documents/tasks/task-breakdown.md`

## Repository Scope

- Target repository: `pdf.box-app`
- Related repositories: `pdfbox-backend`

## Problem Statement

Текущий frontend умеет запускать только общий OCR flow и уже содержит механики RTK Query для OCR и coordinate mapping для crop-like selection, но не имеет editor flow, который отправляет page number и selected area в backend и применяет server-side результат как замену страницы.

## Scope

- добавить endpoint `POST /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr` в `src/shared/constants/api-url.ts`
- добавить endpoint `GET /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr/{requestId}/status` в `src/shared/constants/api-url.ts`
- добавить guest endpoint `POST /guest/documents/perform-edit-ocr` в `src/shared/constants/api-url.ts`
- добавить guest endpoint `GET /guest/documents/perform-edit-ocr/{requestId}/status` в `src/shared/constants/api-url.ts`
- добавить RTK Query mutation рядом с OCR methods в `src/entities/documents/model/api/documents-api.ts`
- добавить RTK Query query или polling flow для статуса edit OCR рядом с existing OCR status methods
- добавить editor flow выбора страницы и выделения области
- добавить выбор OCR language в editor flow
- выбирать workspace или guest edit OCR endpoint в зависимости от document context
- переиспользовать page coordinate mapping pattern, близкий к `crop-pages-tool`
- отправлять в backend page number, selected area coordinates и выбранный `ocrLanguage`
- применить success result в editor flow без локальной cleanup logic
- обработать fallback state
- добавить product analytics для запуска и исхода edit OCR

## Out of Scope

- OCR или background processing на клиенте
- admin и landing surfaces
- изменение общего document OCR flow

## Implementation Notes

- affected modules: `src/shared/constants/api-url.ts`, `src/entities/documents/model/api/documents-api.ts`, `src/widgets/documents/document-editor/*`, `src/features/*`
- constraints: follow FSD, use RTK Query, no ad-hoc fetches
- known technical context:
  - existing OCR transport lives in `src/entities/documents/model/api/documents-api.ts`
  - existing OCR endpoints live in `src/shared/constants/api-url.ts` as `/perform-ocr`, `/perform-ocr/{requestId}/status`, `/perform-ocr/{requestId}/cancel`
  - existing guest OCR transport should be used as reference for guest edit OCR routing if guest document context already lives in the same app
  - existing OCR editor hook lives in `src/widgets/documents/document-editor/lib/hooks/use-handle-ocr.ts`
  - existing coordinate conversion reference lives in `src/features/tools/crop-pages-tool/model/hooks/use-crop-pages-tool.tsx`

## Acceptance Criteria

1. Пользователь может выбрать страницу и выделить область в editor flow.
2. Frontend отправляет request на workspace или guest edit OCR endpoint в зависимости от document context, с `pageNumber`, `selectedAreaCoordinates` и выбранным `ocrLanguage` в согласованном contract.
3. Frontend получает status через соответствующий workspace или guest status endpoint и использует его для success/failure flow.
4. Frontend применяет success result без локальной очистки фона или client-side reconstruction.
5. Fallback state не ломает editor flow и поддержан аналитикой.

## Dependencies

- Backend orchestration contract
- Processing Lambda success/fallback behavior

## Risks

- Coordinate mapping между viewer selection и page coordinates может потребовать дополнительной калибровки
- Fallback UX может потребовать дополнительной полировки после backend integration

## Handoff to DEV

- Создай ExecPlan в target repository.
- Сошлись на этот spec и requirements/criteria documents.
- Перед реализацией проверь edge cases.
