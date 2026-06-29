# Task Breakdown

## Источник

- Requirements document: `sa/docs/editor/ocr-editable-documents/requirements/feature-spec.md`
- Criteria document: `sa/docs/editor/ocr-editable-documents/requirements/feature-criteria.md`
- Approved by: Team Lead / SA
- Date: 2026-05-05

## Принципы декомпозиции

- у каждой задачи один owner
- repository ownership указан явно
- blockers и dependencies видны сразу

## Список задач

### Task 1

- Title: BACK - OCR improvements. API and OCR lambda bootstrap for selected page area
- Repository: `pdfbox-backend`
- Owner role: Backend
- Зачем нужна задача: реализовать первый минимально рабочий backend flow для OCR по выделенной области страницы и снять основные архитектурные риски.
- Scope:
  - добавить endpoint `POST /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr`
  - добавить endpoint статуса `GET /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr/{requestId}/status`
  - добавить guest endpoint `POST /guest/documents/perform-edit-ocr`
  - добавить guest endpoint статуса `GET /guest/documents/perform-edit-ocr/{requestId}/status`
  - добавить request/response DTO рядом с existing `document-perform-ocr` API
  - создать request lifecycle и статусы по паттерну current OCR processing flows
  - создать CQRS orchestration по паттерну `DocumentPerformOcrCommand` и `DocumentPerformOcrFeature`
  - принимать от фронта номер страницы, координаты выделенной области и выбранный OCR language
  - упаковать и задеплоить новую OCR Lambda
  - проверить Python runtime для новой Lambda
  - запустить OCR по вырезанной области с учетом выбранного OCR language
  - обработать success/failure и вернуть результат обратно в backend status/response contract
- Out of scope:
  - background cleaning или background replacement
  - Gemini analysis
  - локальная обработка страницы на фронте
- Dependencies:
  - requirements/criteria по edit OCR
  - согласование response contract с frontend task
  - решение по минимальному payload для bootstrap версии
- Risks:
  - reuse существующего OCR request/status model может оказаться частично несовместимым с area-based flow
  - Python runtime или packaging новой Lambda может потребовать дополнительной infra настройки
  - форма response payload может измениться после следующего этапа с background cleaning
- Definition of done:
  - backend принимает request на `POST /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr`
  - backend отдает статус через `GET /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr/{requestId}/status`
  - backend принимает guest request на `POST /guest/documents/perform-edit-ocr`
  - backend отдает guest status через `GET /guest/documents/perform-edit-ocr/{requestId}/status`
  - backend orchestration встроен в существующую CQRS/API структуру `microservices/main/src`
  - новая Lambda упакована, деплоится и вызывается backend flow
  - OCR по вырезанной области работает в minimal bootstrap режиме
  - success/failure состояния корректно сохраняются и доступны для observability

### Task 2

- Title: BACK - OCR improvements. Extend OCR lambda with background cleaning and Gemini analysis
- Repository: `pdfbox-backend`
- Owner role: Backend
- Зачем нужна задача: расширить OCR Lambda так, чтобы после базового OCR она готовила итоговую очищенную страницу и возвращала расширенный result payload для editor integration.
- Scope:
  - расширить input/output контракт Lambda при необходимости
  - добавить логику очистки или подмены фона с дефолтным алгоритмом и дефолтной конфигурацией
  - формировать итоговую обработанную страницу и загружать ее в `TempBucket`
  - отправлять вырезанный image block в Gemini
  - при необходимости передавать в Gemini не только картинку, но и OCR result для более точного анализа
  - возвращать объединенный result payload из Lambda
  - параллелить независимые части внутри Lambda там, где это уменьшает latency и не усложняет flow
  - сохранить совместимость с endpoint flow:
    - `POST /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr`
    - `GET /clients/workspaces/{workspaceId}/documents/{documentId}/perform-edit-ocr/{requestId}/status`
    - `POST /guest/documents/perform-edit-ocr`
    - `GET /guest/documents/perform-edit-ocr/{requestId}/status`
  - обновить CloudFormation/deploy wiring и `docs/lambda-flows-map.md`, если контракт новой Lambda будет зафиксирован
- Out of scope:
  - универсальная full-document reconstruction
  - вынесение Gemini integration в отдельный jobs module
  - поддержка всех document classes, языков и размеров области без ограничений первой итерации
- Dependencies:
  - Task 1 contract for request/response orchestration
  - доступность `TempBucket`
  - доступность внешних зависимостей OCR и Gemini
- Risks:
  - качество background replacement может быть недостаточным для части документов
  - Gemini может возвращать неполные или неточные font metadata
  - latency может выйти за приемлемые границы для editor flow
  - потребуется отдельная инфраструктурная обвязка для deploy/failure routing новой Lambda
- Definition of done:
  - Lambda расширяет bootstrap flow из Task 1 без смены пользовательского сценария
  - Lambda формирует cleaned/replaced page result и загружает его в `TempBucket`
  - Lambda получает из Gemini дополнительные font-related данные и возвращает объединенный payload
  - backend status/result contract обновлен под расширенный payload без поломки request lifecycle
  - deployment wiring и contract документация для новой Lambda обновлены

### Task 3

- Title: Integrate edit OCR area flow in editor
- Repository: `pdf.box-app`
- Owner role: Frontend
- Зачем нужна задача: дать пользователю editor flow, в котором выделенная область отправляется в backend и результат применяется как server-side подготовленная замена страницы.
- Scope:
  - добавить новый editor flow в FSD-структуре `features/...` или `widgets/documents/document-editor/...` без ad-hoc запросов
  - добавить новый endpoint в `src/shared/constants/api-url.ts` и RTK Query mutation рядом с existing OCR methods в `src/entities/documents/model/api/documents-api.ts`
  - поддержать выбор workspace или guest edit OCR endpoint в зависимости от document context
  - переиспользовать current page/coordinate mapping подход, близкий к `crop-pages-tool`, чтобы передавать backend page number и область в page coordinates
  - добавить user flow выбора страницы и выделения области
  - добавить user flow выбора OCR language
  - отправлять в backend page number, selected area coordinates и выбранный OCR language
  - обработать success response и применить результат в editor flow
  - обработать fallback state без локальной реконструкции страницы
  - подключить product analytics для запуска edit OCR и использования success/fallback результата
- Out of scope:
  - OCR или background cleanup на клиенте
  - admin или landing surfaces
  - изменение общего document OCR flow
- Dependencies:
  - Task 1 response contract
  - Task 2 processing readiness для реального success path
  - product decision по fallback UX, если он потребуется для финальной полировки
- Risks:
  - незавершенный fallback UX может задержать финальную интеграцию
  - если backend result нефиксирован по формату страницы, возможны доработки интеграции
  - coordinate mapping между viewer selection и backend page coordinates может потребовать дополнительной калибровки
- Definition of done:
  - пользователь может выбрать страницу и выделить область в editor flow
  - frontend отправляет в backend корректный request
  - frontend применяет success result без локальной очистки фона
  - fallback-сценарий не ломает editor flow и не требует client-side reconstruction
  - аналитика по запуску и исходу edit OCR доступна

## Порядок поставки

1. Task 1: собрать минимальный backend contour с API, request lifecycle и bootstrap Lambda OCR.
2. Task 2: расширить Lambda background cleaning и Gemini analysis без смены базового flow.
3. Task 3: подключить editor integration после стабилизации backend success/fallback response.

## Cross-Repository Notes

- В `pdf.box-app` уже есть RTK Query слой для OCR в `../pdf.box-app/src/entities/documents/model/api/documents-api.ts` и editor OCR hook в `../pdf.box-app/src/widgets/documents/document-editor/lib/hooks/use-handle-ocr.ts`; новую интеграцию стоит строить рядом с ними, а не отдельным ad-hoc transport.
- В `pdf.box-app` уже есть преобразование crop selection в координаты страницы в `../pdf.box-app/src/features/tools/crop-pages-tool/model/hooks/use-crop-pages-tool.tsx`, и этот паттерн можно использовать как reference для area request payload.
- В `pdfbox-backend` текущий OCR flow проходит через `../pdfbox-backend/microservices/main/src/api/mutation/document/document-perform-ocr/document-perform-ocr.mutation-controller.ts`, `../pdfbox-backend/microservices/main/src/workspace/command/document/document-perform-ocr/document-perform-ocr.command-handler.ts` и `../pdfbox-backend/microservices/main/src/workspace/features/document/features/document-perform-ocr.feature.ts`; новый edit OCR flow стоит выстраивать по той же CQRS/invocation модели.
- Для status API reference в `pdfbox-backend` уже есть `../pdfbox-backend/microservices/main/src/api/query/document/document-get-ocr-status/document-get-ocr-status.query-controller.ts`; новый edit OCR status endpoint стоит повторять по тому же паттерну.
- Для guest OCR reference в `pdfbox-backend` уже есть `../pdfbox-backend/microservices/main/src/api/mutation/guest/guest-document-perform-ocr/guest-document-perform-ocr.mutation-controller.ts` и `../pdfbox-backend/microservices/main/src/api/query/guest/get-guest-document-ocr-status/get-guest-document-ocr-status.query-controller.ts`; guest edit OCR стоит повторять по тому же паттерну.

## Open Technical Questions
- Какие именно font-related поля Gemini должен вернуть в первой итерации, чтобы этого хватило для editor integration?
- Какой список OCR languages должен быть доступен пользователю в первой итерации и как он должен маппиться в backend contract?
- Какие лимиты по размеру области, количеству страниц и допустимым типам документов должны быть enforced в backend contract?
