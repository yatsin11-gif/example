# Task Breakdown

## Источник

- Requirements document: `sa/docs/editor/background-remover/requirements/feature-spec.md`
- Criteria document: `sa/docs/editor/background-remover/requirements/feature-criteria.md`
- Approved by: SA review pending; decomposition prepared from current draft and repo context
- Date: 2026-05-28

## Принципы декомпозиции

- breakdown покрывает только backend scope
- foundation-задачи из `sa/docs/editor/image-enhancer` считаются уже подготовленными и используются как dependencies, а не дублируются здесь
- у задачи один owner
- repository ownership указан явно
- blockers и dependencies видны сразу
- backend детали опираются на текущий image domain в `pdfbox-backend`: `workspace_images`, `workspace_image_processing_requests`, guest/client image CRUD, `cloudformation/lambda/create-preview-image`, `cloudformation/lambda/convert-image`

## Список задач

### Task 1

- Title: BE. Background Remover. Сквозной PicWish pipeline для request и completion flow
- Repository: `pdfbox-backend`
- Owner role: Backend engineer
- Зачем нужна задача: background remover требует одного связанного backend flow: создать `background_remove` request, провалидировать входное изображение, отправить запрос в PicWish, принять completion callback, создать processed image artifact и вернуть frontend полный request/result contract для restore/remove, download и convert сценариев.
- Scope:
  - расширить `libs/common-shared-lib/src/libs/types/models/workspace/image-processing-request.ts` явными `WorkspaceImageBackgroundRemoveRequestParams` и `WorkspaceImageBackgroundRemoveRequestResult`
  - убрать зависимость от `Record<string, any>` для product-critical полей background-remover request/result
  - добавить create/status flow поверх generic processing request foundation из `image-enhancer`
  - добавить client endpoints:
  - `POST /clients/images/background-remove` с array payload
  - `GET /clients/images/background-remove/status/batch`
  - добавить guest endpoints:
  - `POST /guest/images/background-remove`
  - `GET /guest/images/background-remove/status/batch`
  - добавить DTO, commands, queries и features для create background-remover requests
  - валидировать ownership/access через `requestId -> imageId -> guest/workspace owner`
  - валидировать поддерживаемые входные форматы по текущему image domain `WorkspaceImageExtensions`
  - валидировать лимит входного файла `20 MB` и не отправлять oversized image в provider
  - при создании request сохранять `tool=background_remove`, `provider=picwish`, `status=processing`
  - проверить auth transition flow после `sign-up`, `sign-in`, `sign-in-with-social-provider` для guest background-remover scenario
  - обеспечить, что после auth transition flow сохраняется как original image, так и результат background-remover
  - реализовать provider integration layer для PicWish background-removal request, включая создание request, mapping provider statuses и typed callback/result contract
  - при успешном completion скачать provider PNG result, сохранить его по текущим image storage patterns и создать новую `workspace_images` row
  - создавать derived image со значениями `source=background_remove`, `originImageId=<original image id>`, `mimeType=image/png`, `extension=png`
  - формировать title/result file naming с обязательным префиксом `removed_`
  - обновлять `workspace_image_processing_requests.result` полями `outputImageId`, `fileKey`, `previewKey`, `outputFormat=png`, `providerMeta`
  - переводить request в `failed` и сохранять `errorMessage`, если provider call, callback parsing или result persistence завершаются ошибкой
  - обеспечить идемпотентный completion по `providerJobId` / `requestId`, чтобы повторный webhook не создавал duplicate image rows
- Out of scope:
  - подстановка fallback background для итогового `pdf/jpg` conversion output
  - frontend restore/remove toggle
  - payment/subscription gate
  - ручное редактирование mask или batch background removal
- Dependencies:
  - `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-generic-processing-request-foundation.md`
  - `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-client-workspace-image-crud-and-list-contract.md`
  - `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-guest-image-cru-and-transfer-to-workspace.md`
  - `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-picwish-enhancement-pipeline.md`
  - `sa/docs/editor/image-enhancer/jira/backend-image-enhancer-update-images-after-preview-lambda.md`
- Risks:
  - по продукту все еще открыт вопрос по финальному списку поддерживаемых входных форматов; backend validation не должен молча расширять support beyond confirmed image enums
  - точный public webhook path для PicWish нельзя уверенно вывести из текущего repo context
  - в текущем workspace отсутствует локальный repo context для `picwish-service`, поэтому provider integration details нужно проверить перед реализацией
  - если webhook будет делать download/upload PNG синхронно без internal handoff, возможны timeout и retry problems
- Definition of done:
  - guest и client flows могут создать `background_remove` request и получить `requestId`
  - guest и client flows могут получать request status через batch status endpoints
  - backend отклоняет неподдерживаемые форматы и файлы больше `20 MB` до provider call
  - после `sign-up` / `sign-in` / `sign-in-with-social-provider` guest background-remover flow не теряет original image и removed image
  - успешный provider completion создает derived removed image row с `originImageId`, `source=background_remove` и `removed_` prefix
  - request `result` содержит ссылку на processed PNG artifact
  - duplicate webhook не создает duplicate rows и не ломает final request status

## Порядок поставки

1. Поднять `background_remove` request contract и API поверх готового image-enhancer foundation.
2. Подключить PicWish background-removal integration и webhook branch.
3. Завершить completion flow через derived image creation и request result update.

## Cross-Repository Notes

- Эта декомпозиция предполагает, что backend foundation из `sa/docs/editor/image-enhancer` уже будет готова или реализуется раньше.
- Для final download/convert transparency rules background remover опирается на уже подготовленный image conversion flow в `cloudformation/lambda/convert-image` и соответствующие image-enhancer tasks, а не вводит отдельный conversion pipeline.
- В текущем workspace доступен только `pdfbox-backend`; локальный репозиторий `picwish-service` не найден, поэтому точные provider module paths и API adapter details требуют отдельной проверки в момент реализации.

## Open Technical Questions

- Какой точный webhook route должен использоваться для PicWish background-remover callbacks в `pdfbox-backend`?
- Должен ли backend принимать `bmp` и `tiff` как входные background-remover formats, если product criteria пока не закрыли open question по финальному supported formats set?
