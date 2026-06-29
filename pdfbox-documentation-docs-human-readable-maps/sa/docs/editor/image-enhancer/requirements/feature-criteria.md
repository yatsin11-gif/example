# Критерии

## Источник

- Feature spec: `sa/docs/editor/image-enhancer/requirements/feature-spec.md`
- Утвердил: SA
- Дата: 2026-05-14
- Репозитории в скоупе: `pdf.box-app`, `pdfbox-backend`, `pdf.box-landing`

## Цель

- Пользователь и guest должны иметь возможность быстро улучшить изображение через Image Enhancer, увидеть compare preview `ДО / ПОСЛЕ` и выбрать output scale `2x` или `4x`.
- Поставка считается корректной, если enhancement mode выбирается по подтвержденным правилам, переключение `2x`/`4x` не запускает лишний enhancement request, а download/convert используют последнюю выбранную версию результата.
- `pdf.box-landing` должен вести guest в Image Enhancer flow с возможностью HD enhancement.

## FE Criteria

### Затронутые поверхности

- `pdf.box-app`: guest entry surfaces, Image Enhancer panel, quality/result state, compare preview, original blur, guest payment page watermark, output scale selector, download and convert flows, dashboard images list, dashboard preview sidebar, dashboard actions, multi-select.
- `pdf.box-admin`: `N/A`
- `pdf.box-landing`: новая страница лендинга Image Enhancer, клон лендинга и entry links в Image Enhancer flow.

### Пользовательские сценарии и состояния

#### Guest enters Image Enhancer from landing

- Guest должен иметь возможность открыть Image Enhancer из `pdf.box-landing`.
- При переходе из landing surfaces продукт должен сохранять намерение пользователя открыть Image Enhancer, а не сбрасывать его в общий upload или generic tools flow.
- Guest, пришедший с лендинга, должен иметь возможность запустить enhancement в HD качестве.
- В guest flow пользователь должен иметь возможность загрузить изображение drag-and-drop или через file picker.
- После успешной загрузки frontend должен перевести guest в flow обработки изображения без ручного переключения на другой продуктовый сценарий.

#### Image upload validation

- Guest и authenticated user могут загрузить изображение, если входной файл соответствует ограничениям: поддерживаемые форматы `jpeg`, `jpg`, `png`, `webp`, `tiff`, `heif`, `heic`; максимальный размер файла `20 MB`.
- Frontend должен валидировать входной файл по формату и размеру до запуска обработки.
- Если файл не проходит frontend validation, frontend должен показать пользователю ошибку и не запускать enhancement request.

#### Auto quality enhancement

- Image Enhancer должен запускать автоматическое улучшение качества без требования от пользователя выбирать quality mode вручную.
- Для guest, пришедшего с лендинга, frontend должен инициировать HD enhancement flow.
- Для authenticated user frontend должен инициировать enhancement по правилу длинной стороны исходного изображения: `<= 512 px` в Standard режиме, `> 512 px` в HD режиме.
- Пока enhancement не завершен, пользователь должен видеть понятное processing state.
- Если enhancement завершается ошибкой, пользователь должен видеть failed state без возможности скачать битый результат.

#### Output scale selection

- Пользователь должен иметь возможность выбрать output scale `2x` или `4x` после получения enhanced image.
- Если пользователь не выбирает output scale явно, frontend должен использовать `2x` как default output scale.
- Frontend должен самостоятельно формировать `2x` и `4x` версии через resize enhanced image относительно оригинального размера изображения пользователя.
- Переключение между `2x` и `4x` не должно запускать повторный enhancement request, если enhanced image уже получено.
- При переключении `2x`/`4x` frontend должен обновлять текущую выбранную версию результата для последующих download и convert действий.

#### Compare preview

- После завершения enhancement пользователь должен видеть compare preview `ДО / ПОСЛЕ` в панели тулы.
- `ДО` должно показывать original image пользователя.
- Original image в панели тулы должен быть слегка заблюрен.
- `ПОСЛЕ` должно показывать enhanced image с примененной выбранной output scale версией, если scale уже выбран.
- Frontend не должен ожидать от backend отдельный preview artifact для `2x` и `4x`, если enhanced image уже получено.

#### Guest payment page watermark

- Guest не должен иметь возможности использовать enhanced `ПОСЛЕ` на странице оплаты как чистое изображение без защиты.
- При переходе guest на страницу оплаты enhanced image в состоянии `ПОСЛЕ` должно иметь watermark.
- Watermark на guest payment page должен быть frontend/UI защитой preview, а не обязательным отдельным backend artifact.
- Watermark на guest payment page не должен попадать в final downloadable artifact после выполнения условий доступа.

#### Download and convert

- Пользователь должен иметь возможность скачать enhanced image в разных форматах по правилам доступа.
- По умолчанию frontend должен предлагать скачать изображение в формате, который получен как enhanced image, если это `png` или `jpg`.
- Для download и convert пользователь должен иметь возможность выбрать целевой формат из поддержанных форматов, включая `heif` и `heic`.
- Перед download или convert frontend должен использовать последнюю выбранную пользователем версию результата: `2x` или `4x`.
- Если последняя выбранная версия результата еще не сформирована, frontend должен показать processing state, а не начинать broken download или convert flow.

#### Authenticated tool panel actions

- Subscribed user должен иметь возможность из панели тулы выполнить действия `download image`, `download a copy`, `convert`, `print`.
- `download image` и `download a copy` не отличаются по продуктовому поведению: оба означают скачивание enhanced image.
- Финальный скачиваемый файл должен быть без watermark.
- Если enhancement или conversion для выбранного действия еще не готовы, frontend должен показывать processing state.

#### Dashboard images listing and actions

- Пользователь должен видеть свои images на dashboard как отдельную сущность, а не как documents.
- Dashboard images должны поддерживать те же базовые паттерны списка, поиска, сортировки, фильтрации, пагинации и preview sidebar, что и documents, если это не противоречит image-specific ограничениям этой итерации.
- Если у пользователя нет images, frontend должен показывать empty state для images.
- В списке dashboard для image item должен отображаться image preview вместо file-format icon.
- Для single image в первой итерации доступны только действия `preview`, `convert`, `rename`, `print`, `download a copy`, `duplicate`, `delete`, `restore`.
- Frontend не должен показывать для images действия `Move to`, `Favorites` и работу с folders.

#### Dashboard image persistence and multi-select

- После создания image artifact через Image Enhancer tool flow original image и enhanced result должны сохраняться в системе.
- После создания image artifact через Image Enhancer tool flow он должен появляться в image list в image-представлении.
- Пользователь должен иметь возможность выбрать несколько images на dashboard одновременно.
- В первой итерации multi-select должен поддерживать не более 10 images одновременно.
- Для multi-select должны быть доступны только подтвержденные bulk actions этой итерации.

#### FE analytics events

- Для Image Enhancer frontend должен отправлять события в `Zaraz` и `GA`.
- События для новых image tools должны отправляться по тем же правилам, что уже используются в системе для существующих tools flows.
- В scope этой итерации frontend должен поддержать события `select_tool`, `upload_doc`, `sign_up`.
- Для этих событий должны использоваться те же базовые event parameters, что и в текущей системе.
- Для Image Enhancer frontend должен дополнительно передавать параметр `tool=image_enhancer`.
- Для guest upload flow frontend должен дополнительно передавать параметр `format` со значением формата загруженного изображения.

#### Страница лендинга и клон лендинга

- `pdf.box-landing` должен содержать новую страницу лендинга Image Enhancer.
- `pdf.box-landing` должен содержать клон лендинга для Image Enhancer.
- Новая страница лендинга и клон лендинга должны вести пользователя в Image Enhancer flow в `pdf.box-app`.
- Landing surfaces должны поддерживать guest path, в котором пользователю доступно HD enhancement.
- Landing surfaces не должны обещать неподтвержденные возможности: SVG export, free unwatermarked download без подтвержденного доступа, folders, `Move to`, `Favorites` или unsupported image actions.

### Правила пользовательского поведения

- Image Enhancer должен быть доступен и для guest, и для authenticated user.
- Enhancement quality mode не выбирается пользователем вручную.
- Output scale `2x`/`4x` выбирается пользователем после получения enhanced image и применяется frontend resize относительно оригинального размера изображения.
- Compare preview должен строиться из original image и enhanced image.
- Download, convert и print final artifact должны использовать последнюю выбранную версию результата: `2x` или `4x`.
- Пользовательский flow после registration/subscription/payment gate должен возвращать пользователя к выбранному image result, а не сбрасывать его в начальную точку.
- FE analytics для Image Enhancer должны оставаться консистентными с текущими системными правилами отправки событий в `Zaraz` и `GA`.

### Ограничения и исключения на FE

- Первая итерация не требует frontend support для SVG.
- Первая итерация не требует frontend support для folders, `Move to` и `Favorites` в dashboard images.
- Критерии не фиксируют конкретный визуальный дизайн landing block, tool modal, watermark, compare slider, toasts или paywall screens beyond подтвержденного поведения.
- Критерии не фиксируют slug, исходный лендинг для клона, точный контент, SEO metadata или landing analytics до отдельного подтверждения.
- Критерии не требуют guest download without subscription/payment.

## BE Criteria

### Затронутые backend области

- `pdfbox-backend`: guest-scoped and workspace-scoped image enhancement requests, request status retrieval, original/enhanced image storage, selected-result delivery support, dashboard image lifecycle, conversion and download flows.
- Внешние интеграции: PicWish, Apryse и `sharp`.

### Правила бизнес-логики и обработки

#### Image enhancement request bootstrap

- Backend должен поддерживать запуск image enhancement как минимум через guest-scoped и workspace-scoped API entrypoints.
- Guest flow должен поддерживать запуск enhancement по загруженному file reference.
- Workspace flow должен поддерживать запуск enhancement по `documentId` или `fileKey`, если изображение уже существует в пользовательском контексте.
- Backend должен валидировать входной файл по поддерживаемым форматам `jpeg`, `jpg`, `png`, `webp`, `tiff`, `heif`, `heic` и ограничению размера файла `20 MB`.
- Backend должен определять длинную сторону исходного изображения или принимать уже определенное frontend значение, если это нужно для выбора mode.

#### Enhancement quality mode

- Backend должен поддерживать Standard и HD режимы enhancement, если external provider contract разделяет эти режимы.
- Для guest, пришедшего с лендинга, backend должен выполнять или принимать HD enhancement request.
- Для authenticated user backend должен применять правило длинной стороны исходного изображения: `<= 512 px` в Standard режиме, `> 512 px` в HD режиме.
- Backend не должен требовать от пользователя ручного выбора Standard или HD mode.
- Если пользователь загрузил `heif` или `heic`, backend должен предварительно конвертировать файл в `png` перед отправкой в PicWish, так как PicWish не принимает `heif/heic` на входе.
- Если mode не может быть определен из входных данных, backend должен вернуть понятную ошибку или использовать подтвержденный fallback только после отдельного продуктового решения.

#### Enhancement request lifecycle

- После успешной валидации backend должен создать request на enhancement со статусом processing и вернуть frontend идентификатор запроса, достаточный для дальнейшего polling и повторного открытия результата.
- Backend должен отправлять enhancement request во внешний provider и сохранять связь между внутренним request и provider job.
- Если provider принимает задачу, backend должен сохранить provider-related metadata без изменения пользовательского сценария.
- Если provider возвращает ошибку на этапе создания или выполнения задачи, backend должен перевести request в failed state и сохранить понятную причину ошибки.

#### Enhancement result completion

- После успешного завершения provider job backend должен сохранить enhanced image в своем storage.
- Backend должен сохранять исходное изображение пользователя и enhanced image как отдельные артефакты.
- Backend должен возвращать frontend original image и enhanced image без backend watermarking.
- Backend должен поддерживать status retrieval для processing, completed и failed scenarios.
- Backend должен сохранять результат так, чтобы frontend мог сформировать `2x` и `4x` output versions без повторного enhancement request.

#### Output scale behavior

- Backend не должен запускать отдельный enhancement request только из-за переключения пользователя между `2x` и `4x`, если enhanced image уже получено.
- Backend должен позволять frontend использовать уже готовый enhanced image для формирования `2x` и `4x` версий.
- Если backend участвует в хранении или выдаче выбранной `2x`/`4x` версии, он должен использовать последнюю выбранную пользователем версию для download и convert.
- Критерии не требуют отправлять в provider отдельные задачи для `2x` и `4x`.

#### Conversion and final file delivery

- Backend должен поддерживать conversion выбранной версии enhanced image в `png`, `pdf`, `webp`, `jpg`, `tiff`, `heif`, `heic`.
- По умолчанию backend должен быть способен вернуть enhanced image в формате, который получен как enhanced result, если это `png` или `jpg`.
- `download image` и `download a copy` должны использовать одно и то же download behavior и не должны требовать разных backend flows.
- Для `pdf` backend должен использовать текущий алгоритм через Apryse.
- Для `png`, `webp`, `jpg`, `tiff`, `heif`, `heic` backend должен использовать `sharp`.
- Backend должен выдавать final file без watermark только пользователю с подтвержденным доступом.
- Backend должен поддерживать asynchronous conversion/download flow с request tracking и status polling для операций, которые не отдаются синхронно.

#### Dashboard images lifecycle

- Backend должен хранить dashboard images отдельно от documents.
- Backend должен сохранять original image и enhanced result в системе.
- Backend должен поддерживать получение списка images пользователя с теми же базовыми возможностями списка, что и у documents, включая сортировку, фильтрацию по дате обновления и работу с trash state, если это применимо к текущему dashboard contract.
- Backend должен поддерживать сохранение image artifacts, созданных через Image Enhancer tool flow, на dashboard как image files без конвертации в PDF и без изменения исходного image-type поведения.
- Backend должен поддерживать image lifecycle actions `preview`, `convert`, `rename`, `print`, `download a copy`, `duplicate`, `delete`, `restore`.
- Backend не должен реализовывать в этой итерации folders, `Move to` и `Favorites` для images.
- Backend должен поддерживать permanent delete для images из trash, если это уже является частью общего dashboard delete lifecycle.

#### Batch and bulk behavior

- Backend должен поддерживать bulk download flow для выбранных dashboard images в рамках подтвержденного лимита multi-select на frontend.
- Критерии не требуют bulk support для неподтвержденных image actions.

#### Error handling

- Backend должен возвращать понятные error responses на этапах validation, enhancement request creation, provider processing, status retrieval, conversion, download и dashboard image lifecycle operations.
- Error response должен позволять frontend отличить invalid input, processing failure, unavailable result и access restriction.

### Побочные эффекты и интеграционные результаты

- Платежи: guest payment page должна показывать protected/watermarked enhanced preview; точный payment provider contract не определяется этим документом.
- Подписка / доступ: backend должен проверять access перед выдачей final downloadable artifact без watermark.
- Аналитика: `N/A`
- Email / CRM / webhooks: backend может использовать provider callback/webhook flow для получения результата; дополнительные CRM и email criteria не подтверждены.

### Ограничения и исключения на BE

- Критерии не фиксируют точные URL paths, точные названия таблиц, точные payload names или внутреннюю схему storage keys beyond подтвержденного продуктового поведения.
- Критерии не требуют backend watermark generation или отдельного watermarked preview artifact.
- Критерии не требуют отдельных provider enhancement requests для `2x` и `4x`.
- Критерии не требуют поддержки SVG export.
- Критерии не вводят backend-specific бизнес-логику для `pdf.box-landing` beyond необходимости отличить guest landing flow для HD mode, если это нужно backend.

## Нефункциональные критерии

### FE

- Производительность: пользователь не должен ждать повторной provider-обработки при переключении `2x`/`4x`, если enhanced image уже получено.
- Доступность: пользователь должен получать явные и различимые состояния `processing`, `completed`, `failed`, `payment/subscription required`.
- Консистентность UX: tool panel, compare preview, output scale selector, format selection и dashboard actions должны использовать единый ожидаемый паттерн поведения для image flows.

### BE

- Надежность: backend должен стабильно возвращать либо готовый image result, либо понятную error response без битых или частично сформированных downloadable artifacts.
- Наблюдаемость: backend должен различать ошибки validation, provider processing, conversion, download и dashboard image operations.
- Безопасность: backend не должен выдавать final downloadable artifact без watermark пользователю без подтвержденного доступа.

## Вне scope

- Экспорт в SVG.
- Прямой upload изображений на dashboard.
- Folders для dashboard images.
- Действие `Move to` для dashboard images.
- Папка `Favorites` для dashboard images.
- Отдельные provider enhancement requests для `2x` и `4x`.
- Поддержка неподтвержденных image actions beyond `preview`, `convert`, `rename`, `print`, `download a copy`, `duplicate`, `delete`, `restore`.

## Открытые вопросы

- Как должен вести себя guest, который пришел не с лендинга: всегда HD, Standard/HD по размеру или отдельное правило?
- Какие правила доступа применяются к download/convert для authenticated user без подписки?
- Что считать default download format, если external provider возвращает enhanced image не в `png` или `jpg`?
- Какие именно bulk actions, кроме download и delete, должны поддерживаться для multi-select images в первой итерации?
- Нужен ли для dashboard images отдельный пользовательский фильтр, таб или navigation entry?
- Какие slug, исходный лендинг для клона, контент, SEO-требования и analytics-требования должны быть применены к новой странице лендинга и клону лендинга в `pdf.box-landing`?

## Примечания

- Критерии обновлены по уточнению SA от 2026-05-25.
- FE отвечает за tool entry, preview, original blur, payment-page watermark, output scale resize, dashboard states и gating flows.
- Backend отвечает за enhancement, Standard/HD mode support, storage, conversion, download access и image lifecycle.
- `pdf.box-landing` отвечает за entry в Image Enhancer flow и guest path с HD enhancement.
