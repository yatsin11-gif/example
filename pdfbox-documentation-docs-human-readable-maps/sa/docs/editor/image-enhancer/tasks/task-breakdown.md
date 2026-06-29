# Task Breakdown

## Источник

- Requirements document: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Criteria document: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- Approved by: SA
- Date: 2026-05-14

## Принципы декомпозиции

- breakdown покрывает только `pdfbox-backend`
- у каждой задачи один owner
- repository ownership указан явно
- blockers и dependencies видны сразу
- backend задачи опираются на существующие document и guest-document patterns в `pdfbox-backend`

## Список задач

### Task 1

- Title: BE. Models init for workspace images and image processing requests
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: без отдельной image domain backend не сможет хранить original image, enhanced image, convert results и статусы async-операций отдельно от documents.
- Scope:
  - создать migrations для `workspace_images` и `workspace_image_processing_requests`
  - добавить self-reference `origin_image_id -> workspace_images.id`
  - добавить индексы для `workspace_id`, `origin_image_id`, `author_id`, `processing_status`, `provider_job_id`
  - добавить shared types, enums и ORM models для image entity и processing request entity
  - добавить repositories по паттерну `document.repository.ts`, `guest-document.repository.ts`, `document-download-request.repository.ts`
  - зафиксировать `WorkspaceImageSource` и tool-aware request type для `enhance` и `convert`
- Out of scope:
  - HTTP controllers
  - lambda handlers
  - PicWish integration
- Dependencies:
  - approved requirements and criteria
- Risks:
  - если generic request schema будет спроектирована слишком узко, позже придется мигрировать данные для новых tools
  - если image entity будет слишком похожа на document entity без выделения image-only полей, усложнится preview/enhance contract
- Definition of done:
  - schema и repositories позволяют создать original image, derived image и processing request без использования document tables
  - есть явная связь `origin_image_id` для enhanced и converted artifacts
  - backend может хранить request-level `params`, `result`, `status`, `error`

### Task 2

- Title: BE. Client workspace image CRUD and dashboard list contract
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: dashboard images должны стать отдельной backend-сущностью с базовыми CRUD и list actions, чтобы `pdf.box-app` мог показывать images отдельно от documents.
- Scope:
  - реализовать client-scoped controllers, commands, queries и features для image CRUD
  - проверить текущий `POST /storage/get-presigned-post-url-batch` и подтвердить, покрывает ли он workspace image upload contract без document-specific assumptions
  - если текущего контракта недостаточно, расширить `get-presigned-post-url-batch` для image prefixes, image MIME validation и workspace image upload rules
  - по repo context использовать отдельную image family, зеркальную document family:
  - `POST /clients/workspaces/:workspaceId/images/batch`
  - `GET /clients/workspaces/:workspaceId/images/batch`
  - `GET /clients/images` (coursor paginated)
  - `GET /clients/images/:imageId`
  - `PATCH /clients/images/:imageId` ( `rename`, `description` )
  - `POST /clients/images/restore` (batch)
  - `DELETE /clients/images` (batch)
  - `DELETE /clients/images/immediately` (batch)
  - для duplicate использовать controller family, зеркальную текущему document copy pattern:
  - `POST /clients/image/:imageId/copy`
  - поддержать фильтрацию и пагинацию по `title`, `fromTrash`, `afterUpdatedAt`, `beforeUpdatedAt`, `folderId` с учетом текущих criteria
  - включить в response поля, достаточные для image list и preview sidebar: file key/url, preview key/url, metadata, originImageId, source, isEnhanced
  - поддержать `rename`, `description`, `delete`, `restore`, `duplicate`
- Out of scope:
  - folders, `Move to`, `Favorites`
  - bulk actions beyond confirmed image use cases
  - frontend wiring in `pdf.box-app`
- Dependencies:
  - Task 1
  - agreement on image response DTO fields
- Risks:
  - document list contract может содержать implicit assumptions о PDF-specific metadata
  - текущий presigned upload flow может оказаться завязанным на document file naming или document storage prefixes
  - copy path в current backend использует singular `/document/:documentId/copy`; зеркалирование этого pattern для images нужно сохранить консистентным
- Definition of done:
  - client workspace image endpoints доступны и покрывают create/get/list/update/delete/restore/copy
  - images возвращаются отдельным list contract, не используя document query handlers
  - image responses содержат признак already enhanced для editor/dashboard use cases

### Task 3

- Title: BE. Guest image CRU flow and guest-to-workspace transfer
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: guest flow является primary entry для Image Enhancer и должен сохранять original/enhanced images до auth/payment шага, а затем переносить их в workspace.
- Scope:
  - реализовать guest image create/get/update family по паттерну `guest/documents`
  - проверить текущий `POST /storage/get-presigned-post-url-batch` и подтвердить, покрывает ли он guest image upload contract
  - если текущего контракта недостаточно, расширить `get-presigned-post-url-batch` для guest image prefixes, image MIME validation и guest upload rules
  - предлагаемые endpoints:
  - `POST /guest/images`
  - `GET /guest/images/:id`
  - `PATCH /guest/images/:imageId` (rename)
  - использовать общий storage presigned-upload contract, без конвертации upload в PDF
  - реализовать feature переноса guest original image и guest enhanced image в workspace после sign-up / sign-in / sign-in-with-social-provider 
  - при переносе сохранить `originImageId`, metadata, preview key и derived-image linkage
  - учесть reuse существующего pattern из `create-document-from-guest-document.feature.ts`
- Out of scope:
  - frontend redirect обратно в editor
  - paywall UI и auth UX
- Dependencies:
  - Task 1
  - Task 4 для preview preservation
  - Task 9 для enhancement artifacts
- Risks:
  - текущий backend flow переноса guest documents привязан к `guestDocument.id === document.id`; для images нужно заранее решить, допустимо ли то же правило
  - текущий presigned upload flow может не различать guest image uploads и guest document uploads на уровне storage rules
  - если перенос не будет атомарным для original и enhanced image, можно потерять связь между артефактами
- Definition of done:
  - guest image можно создать и получить по id без document conversion
  - original и enhanced guest artifacts можно перевести в workspace image records
  - после переноса сохраняется связь `originImageId` и доступность preview/result files из постоянного storage

### Task 4

- Title: BE. Create preview lambda for images
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: dashboard list и editor preview требуют lightweight preview artifact и image metadata сразу после upload или после появления derived image.
- Scope:
  - создать image preview lambda по аналогии с `cloudformation/lambda/create-preview-document-v2`
  - запускать ее по S3 notifications для новых файлов в guest/tmp и persistent workspace image prefixes
  - делать `headObject` и пропускать preview generation для файлов больше `20 MB`, оставляя только лог и status event
  - определить preview output format на backend уровне и привести его к одному contract с existing document preview behavior
  - публиковать rabbit event для image preview completion/failure с payload уровня:
  - `{ imageFileKey, previewFileKey, metadata, isGuestImage, status, errorMessage }`
- Out of scope:
  - BE message handler
  - update `workspace_images` after preview event
  - frontend watermark overlay
  - final downloadable artifact generation
- Dependencies:
  - Task 1
- Risks:
  - без явного решения по preview format можно получить несовместимость с client rendering assumptions
  - одно и то же событие может приходить как для original, так и для enhanced image; handler должен обновлять правильную запись по `fileKey`
- Definition of done:
  - upload нового image file запускает preview lambda
  - lambda публикует success/failure event
  - event contract достаточен для последующего обновления image row на стороне main backend

### Task 5

- Title: BE. Update images after preview lambda
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: preview lambda сама не завершает backend flow; image rows должны получать `previewKey`, metadata и processing errors из async event processing.
- Scope:
  - реализовать message handler для image preview completion/failure event
  - реализовать feature update для записи `previewKey`, `metadata`, `processingError` в `workspace_images`
  - обновлять width, height, fileSize после preview pipeline
  - обеспечить корректное обновление и для original image, и для enhanced image
- Out of scope:
  - реализация preview lambda
  - frontend preview rendering
- Dependencies:
  - Task 1
  - Task 4
- Risks:
  - одно и то же событие может приходить как для original, так и для enhanced image; handler должен обновлять правильную запись по `fileKey`
  - retry/idempotency для preview events нужно сохранить на уровне current message processing patterns
- Definition of done:
  - backend обновляет image row preview metadata по event без ручного вмешательства
  - failure event не ломает image lifecycle и оставляет понятный error state

### Task 6

- Title: BE. Generic image processing request foundation
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: enhancement и conversion должны использовать единый processing request contract, чтобы frontend мог polling-ить и переоткрывать уже созданный результат.
- Scope:
  - реализовать generic feature set для `workspace_image_processing_requests`
  - поддержать creation, retrieval и status update для request entity
  - зафиксировать contract для `params` и `result` отдельно по `tool=enhance` и `tool=convert`
  - хранить `providerJobId`, `outputImageId`, output `fileKey`, `previewKey`, `upscale`, `format`, `errorMessage`
  - подготовить client и guest query layers для request polling
  - предложить endpoint family по аналогии с current document tool routes:
  - `POST /clients/images/enhance`
  - `GET /clients/images/enhance/:requestId`
  - `POST /clients/images/convert`
  - `GET /clients/images/convert/:requestId`
  - `POST /guest/images/enhance`
  - `GET /guest/images/enhance/:requestId`
  - `POST /guest/images/convert`
  - `GET /guest/images/convert/:requestId`
  - встроить rate limiting по аналогии с guest document mutations
- Out of scope:
  - конкретная provider integration
  - lambda image processing implementation
- Dependencies:
  - Task 1
- Risks:
  - нужно сохранить надежный ownership/access check через `requestId -> image/workspace/client`, раз request path не несет `imageId`
  - слишком generic `params/result` schema без tool-specific validation увеличит риск runtime ошибок
- Definition of done:
  - backend умеет создать processing request и вернуть `requestId`
  - backend умеет читать processing request с `status` и `result` по request id
  - generic request contract подходит и для enhance, и для convert

### Task 7

- Title: BE. Create image convert lambda
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: subscribed user должен получать enhanced image в исходном формате или в поддерживаемых output formats через async conversion flow.
- Scope:
  - валидировать allowed input/output formats для image-to-image и image-to-pdf conversion
  - для `pdf` использовать current PDF conversion dependency agreed in requirements
  - для `png`, `webp`, `jpg`, `gif`, `tiff` использовать image conversion lambda c `sharp`
  - сохранять convert result в temporary storage и публиковать rabbit event с payload уровня:
  - `{ requestId, imageId, fileKey, status, metadata, errorMessage }`
- Out of scope:
  - create/status API для `tool=convert`
  - BE message handler после convert event
  - update request/result rows after convert completion
  - guards уровня subscription access перед выдачей final downloadable artifact
  - UI download modal
  - batch zip orchestration для multi-select beyond confirmed scope
- Dependencies:
  - Task 1
  - Task 6
- Risks:
  - convert result contract зависит от решения, нужен ли отдельный image row для result
  - reuse document `convert-from-pdf` naming будет вводить в заблуждение для image domain, поэтому image routes должны быть отдельными
- Definition of done:
  - async worker публикует convert completion/failure event с согласованным payload
  - lambda покрывает поддерживаемые image output formats и agreed PDF output path

### Task 8

- Title: BE. Update requests after convert lambda
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: convert worker должен завершать backend request lifecycle через main service, а не оставлять статус и result только внутри lambda pipeline.
- Scope:
  - реализовать create/status API для `tool=convert` поверх generic request foundation
  - использовать guards уровня subscription access перед выдачей final downloadable artifact
  - реализовать message handler, который обновляет request status/result после convert event
  - определить, создается ли convert result как отдельная `workspace_images` row или как временный downloadable artifact; если row не создается, зафиксировать это явно в request result contract
  - при необходимости обновлять связанные image rows или metadata после convert completion
  - сохранять error state для failed convert requests
- Out of scope:
  - реализация image conversion lambda
  - frontend download UX
- Dependencies:
  - Task 1
  - Task 6
  - Task 7
- Risks:
  - convert result contract зависит от решения, нужен ли отдельный image row для result
  - если request update и image update не будут согласованы транзакционно, можно получить completed request без консистентного result payload
- Definition of done:
  - backend умеет принять convert request и вернуть `requestId`
  - backend умеет отдать convert processing request по `requestId`
  - convert event переводит request в `completed` или `failed`
  - request `result` содержит консистентную ссылку на итоговый artifact

### Task 9

- Title: BE. PicWish enhancement pipeline for guest and authorized flows
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: это основная бизнес-функция фичи, которая создает enhanced image и возвращает original/enhanced pair для compare preview.
- Scope:
  - автоматически стартовать enhancement `2x` после guest upload или сохранить явный hook для следующей enhancement task
  - реализовать create/status API для `tool=enhance` поверх generic request foundation
  - валидировать input format, file size, upscale `2x|4x` и лимиты для enhancement
  - делать default upscale `2x`, если параметр не передан
  - отправлять request в PicWish async API и сохранять `providerJobId`
  - реализовать webhook endpoint от PicWish и обновление request status по provider callback
  - по завершении создавать новую `workspace_images` запись для enhanced image и сохранять `originImageId`
  - сохранять `outputImageId` и при необходимости `previewKey` в request `result`
  - блокировать повторный enhancement для already enhanced image, если source image уже является derived enhanced artifact
  - поддержать и guest flow, и authorized workspace flow
  - при `4x` повторно отправлять в provider исходное изображение, а не `2x` result
- Out of scope:
  - frontend compare slider
  - frontend watermark overlay
- Dependencies:
  - Task 1
  - Task 3
  - Task 4
  - Task 5
  - Task 6
- Risks:
  - provider webhook security и idempotency нужно продумать до реализации публичного callback endpoint
  - animated GIF behavior не подтвержден продуктово и не должен быть silently implemented beyond validated provider capability
- Definition of done:
  - enhancement request создается и хранит provider linkage
  - provider completion обновляет request status
  - successful enhancement создает derived image row и возвращаемый original/enhanced contract

### Task 10

- Title: BE. Cleanup, retention and operational jobs for guest images and processing requests
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: image enhancer создает временные файлы, guest artifacts и async requests, которые без retention policy приведут к storage growth и устаревшим dangling rows.
- Scope:
  - добавить cleanup jobs для outdated guest images
  - добавить cleanup jobs для outdated image processing requests
  - удалять guest original/enhanced images и их preview/result files по retention policy
  - удалять convert result files, если они хранятся отдельно от permanent image rows
  - использовать существующий operational pattern из `delete-outdated-guest-documents-and-requests` и document trash cleanup
  - добавить logging и safe behavior для частично уже удаленных файлов
- Out of scope:
  - изменение продуктовых retention windows без отдельного подтверждения
  - cleanup для documents domain
- Dependencies:
  - Task 1
  - Task 3
  - Task 6
  - Task 7
  - Task 8
  - Task 9
- Risks:
  - если retention windows для guest images и requests не согласованы, cleanup может удалить еще нужный asset
  - cleanup должен учитывать связку original/enhanced/result, чтобы не сломать возврат пользователя после payment/auth flow
- Definition of done:
  - есть отдельные backend jobs для image guest cleanup и request cleanup
  - jobs безопасно обрабатывают missing files и не падают на уже удаленных объектах
  - cleanup policy документирована на уровне task scope и зависит от подтвержденных config values

### Task 11

- Title: BE. Additional alignment of image enhancer contracts with updated requirements
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: после завершения базового image enhancer scope в requirements появились дополнительные правила по `heif/heic`, quality mode selection, selected-result conversion/download и bulk image download, которые не покрыты исходными задачами и должны идти отдельным follow-up.
- Scope:
  - доработать существующие image enhancer endpoints и features без пересмотра уже выполненного foundation scope:
  - `POST /guest/images/enhance`
  - `GET /guest/images/enhance/:requestId`
  - `POST /clients/images/enhance`
  - `GET /clients/images/enhance/:requestId`
  - `POST /clients/images/convert`
  - `GET /clients/images/convert/:requestId`
  - `cloudformation/lambda/create-preview-image`
  - `cloudformation/lambda/convert-image`
  - привести enhancement contract к актуальному правилу: backend выбирает quality mode по подтвержденным условиям, а `2x/4x` не создают отдельные provider requests
  - поддержать `heif/heic` как input formats для image enhancer flow и выполнить backend normalization в provider-supported format перед PicWish, если это требуется текущей реализацией provider
  - привести convert pipeline к актуальному output matrix: `png`, `pdf`, `webp`, `jpg`, `tiff`, `heif`, `heic`
  - убрать из image enhancer follow-up неподтвержденные format assumptions, которые расходятся с текущими requirements
  - определить и реализовать backend contract для download/convert по последней выбранной пользователем версии результата
  - добавить image-specific single download и bulk download request flow для confirmed dashboard scope, если текущий image contract этого еще не покрывает
  - сохранить существующий polling/status contract или явно расширить его без ломки completed image CRUD foundation
- Out of scope:
  - переписывание уже выполненных foundation задач
  - frontend compare slider и watermark UI
  - новые image actions beyond подтвержденных download/convert flows
- Dependencies:
  - completed Tasks 1-10
  - agreement on landing/guest signal for HD mode, если backend не может вывести его из текущего context
- Risks:
  - follow-up contract может затронуть текущую интеграцию `pdf.box-app`, если DTOs уже используются в production
  - `heif/heic` support зависит от runtime/library support в действующих lambda environments
  - selected-result delivery contract нужно описать явно, иначе download/convert останутся неоднозначными
- Definition of done:
  - backend покрывает новые requirements без изменения смысла уже выполненных базовых задач
  - enhancement flow не использует отдельные provider requests для `2x/4x`
  - `heif/heic` проходят через agreed enhancement/preview/convert path
  - download/convert используют последнюю выбранную версию результата по явному backend contract
  - bulk image download доступен для confirmed dashboard scope или явно зафиксирован blocker, если нужен отдельный infra step

## Порядок поставки

1. Task 1 как foundation для image entities и processing requests.
2. Task 2 и Task 3 для CRUD/storage contract в client и guest flows.
3. Task 4, затем Task 5 для preview lambda и backend event handling.
4. Task 6 как общий request/status слой.
5. Task 7, затем Task 8 для convert pipeline и backend request/result updates.
6. Task 9 для enhancement pipeline.
7. Task 10 после стабилизации storage and request lifecycle.
8. Task 11 как отдельный follow-up на изменения requirements после завершения базового backend scope.

## Cross-Repository Notes

- `pdf.box-app` уже использует document transport families `clients/workspaces/{workspaceId}/documents`, `guest/documents`, `storage/get-presigned-post-url-batch` и async request polling; image API стоит проектировать максимально близко к этим паттернам.
- `storage/get-presigned-post-url-batch` пока рассматривается как общий upload entrypoint, но в backend scope нужно явно подтвердить или доработать его под image-specific prefixes и validation rules.
- Landing-specific work для `pdf.box-landing` не входит в этот BE breakdown.
- FE возврат пользователя в editor после payment success/fail/close зависит от backend guest-to-workspace transfer contract, но реализуется вне `pdfbox-backend`.
- Task 11 является дополнительной задачей на актуализацию already delivered scope под обновленные requirements и не отменяет completed Tasks 1-10.

## Open Technical Questions

- Нужно ли хранить convert result как отдельную `workspace_images` запись, или достаточно временного downloadable artifact в request `result`?
- Какой preview output format должен быть стандартом для image previews: PNG, WebP или тот же формат, что у исходного файла?
- Должен ли client image list endpoint всегда требовать `workspaceId`, или для personal dashboard нужен отдельный aggregate path?
- Какая retention policy должна применяться к guest original image, guest enhanced image, convert result и processing request rows?
- Как именно должен обрабатываться animated GIF на этапах preview, enhancement, conversion и final download?
- Какой backend signal считается подтвержденным для правила landing guest -> HD mode?
- Какой exact contract должен использоваться для selected `2x/4x` result в download/convert: uploaded artifact, derived file key или другой stable reference?
