# Критерии

## Источник

- Feature spec: `sa/docs/editor/background-remover/requirements/feature-spec.md`
- Утвердил: Не утверждено; draft подготовлен по запросу SA
- Дата: 2026-05-26
- Репозитории в скоупе: `pdf.box-app`, `pdfbox-backend`, `pdf.box-landing`

## Цель

- Guest и authenticated user должны иметь возможность быстро удалить фон с изображения через Background Remover.
- Поставка считается корректной, если продукт валидирует изображение, автоматически удаляет фон, сохраняет original и processed image.
- Download, convert и print должны использовать обработанное изображение и соблюдать правила прозрачности: PNG/GIF/WebP/TIFF сохраняют прозрачность, PDF/JPG получают белый фон.

## FE Criteria

### Затронутые поверхности

- `pdf.box-app`: guest upload flow, Background Remover modal, editor tool panel, restore/remove state, format selection modal, guest registration/payment gate, dashboard Tools / Images Tools entry, dashboard image action-menu entry.
- `pdf.box-admin`: `N/A`
- `pdf.box-landing`: AI Background Remover landing, clone landing, header image tools entry, tools block entry, reliable editing tools block.

### Пользовательские сценарии и состояния

#### Landing and guest entry points

- Guest должен иметь возможность открыть AI Background Remover landing или clone landing.
- При переходе из landing surfaces продукт должен сохранять намерение пользователя открыть Background Remover, а не сбрасывать его в общий upload или generic tools flow.
- В guest flow пользователь должен иметь возможность загрузить изображение drag-and-drop или через file picker.
- После успешной загрузки frontend должен перевести guest в flow обработки изображения без ручного переключения на другой продуктовый сценарий.

#### Guest image upload

- Guest должен иметь возможность загрузить изображение в окне Background Remover.
- Frontend должен валидировать входной файл до запуска background removal.
- Frontend validation должна проверять максимальный размер файла `20 MB`.
- Frontend validation должна проверять поддерживаемый формат файла.
- Если файл не проходит validation, frontend должен показать ошибку и не запускать background removal request.
- Пока файл загружается в систему, frontend должен показывать loader.
- После успешной загрузки frontend должен отправить запрос на backend для запуска background removal и открыть editor tool page.

#### Tool panel processing state

- Пока background removal request находится в processing state, frontend должен показывать изображение пользователя.
- Пока request находится в processing state, frontend должен показывать overlay loader `Erasing background...`.
- Пока request находится в processing state, правый sidebar должен быть открыт.
- Пока request находится в processing state, действия в tool panel должны быть disabled.
- Frontend должен poll status request до получения terminal state.
- Если request завершается failed state, frontend должен показать ошибку и не предлагать скачать или конвертировать битый result.
- Если request завершается failed state, пользователь должен иметь возможность запустить перегенерацию background removal для того же изображения.

#### Tool panel completed state

- После успешного background removal frontend должен показать toast `Background successfully removed`.
- После успешного background removal пользователь должен видеть processed image с transparent background.
- После успешного background removal в правом sidebar должна быть активна кнопка `Remove`.
- Пользователь должен иметь возможность переключиться с `Remove` на `Restore`.
- В состоянии `Restore` frontend должен показывать original image пользователя.
- Пользователь должен иметь возможность вернуться из `Restore` в removed background state без повторной загрузки файла.
- Пользователь должен иметь возможность скачать изображение через кнопку `Download image`.

#### Guest download, convert and print gate

- Для действий `Download a copy`, `Download image`, `Convert` и `Print` guest должен пройти activation subscription flow до получения финального результата.
- При выборе формата для финального результата frontend должен показывать формат `png` по умолчанию.
- Guest должен иметь возможность выбрать другой поддерживаемый формат.
- Форматы, которые поддерживают прозрачность фона, должны отображаться с бейджем `Transparent`.
- После успешной activation subscription flow frontend должен вернуть guest к тому же processed image и выбранному действию.

#### Authenticated dashboard entry

- Authenticated user должен иметь возможность запустить Background Remover из dashboard `Tools` / `Images Tools`.
- Authenticated user должен иметь возможность запустить Background Remover из action-menu существующего изображения в системе.
- При запуске из action-menu существующего изображения frontend должен использовать выбранное изображение как входной файл без повторной ручной загрузки.

#### Authenticated final actions

- Authenticated user должен иметь возможность нажать `Print`, `Download a copy`, `Convert` и `Download image`.
- Если выбрано `Download a copy` или `Download image`, frontend должен показать modal `Download a copy`.
- Если выбрано `Convert`, frontend должен показать modal `Convert Image`.
- Если выбрано `Print`, frontend должен открыть native print window для изображения.

#### FE analytics events

- Для Background Remover frontend должен отправлять события в `Zaraz` и `GA`.
- События для новых image tools должны отправляться по тем же правилам, что уже используются в системе для существующих tools flows.
- В scope этой итерации frontend должен поддержать события `select_tool`, `upload_doc`, `sign_up`.
- Для этих событий должны использоваться те же базовые event parameters, что и в текущей системе.
- Для Background Remover frontend должен дополнительно передавать параметр `tool=background_remover`.
- Для guest upload flow frontend должен дополнительно передавать параметр `format` со значением формата загруженного изображения.

### Правила пользовательского поведения

- Background Remover должен быть доступен guest и authenticated user.
- Background removal запускается автоматически после успешной загрузки изображения.
- Пока result не готов, пользователь не должен иметь возможность скачать, конвертировать, распечатать или принять битый result.
- Restore/remove toggle не должен запускать повторный background removal request, если processed image уже получено.
- Flow после registration/subscription/payment gate должен возвращать guest к тому же processed image и выбранному action.
- При выборе формата для финального файла продукт должен соблюдать правила прозрачности для output format.

### Ограничения и исключения на FE

- Критерии не фиксируют точный visual design landing, clone landing, modals, editor panel, payment page или tooltips.
- Критерии не требуют ручной маски, ручного выделения объекта или дополнительных editing controls.
- Критерии не требуют batch background removal.
- Критерии не требуют настройки цвета fallback background для PDF/JPG.
- Критерии не фиксируют поведение unsupported image formats beyond validation error.

## BE Criteria

### Затронутые backend области

- `pdfbox-backend`: guest-scoped and client-scoped background removal requests, request validation, request lifecycle, original/processed image storage, request status retrieval, conversion and final file delivery.
- Внешние интеграции: PicWish.

### Правила бизнес-логики и обработки

#### Background removal request bootstrap

- Backend должен поддерживать запуск background removal для guest и authenticated user.
- Backend должен принимать входное изображение из guest upload flow, dashboard upload flow или существующего изображения в системе.
- Backend должен валидировать входной файл по поддерживаемому формату и максимальному размеру `20 MB`.
- Если request не проходит validation, backend не должен запускать обработку и должен вернуть ошибку, достаточную для frontend failure state.

#### Request lifecycle

- После успешной validation backend должен создать processing request и вернуть frontend данные, достаточные для polling и открытия результата.
- Backend должен запускать background removal через PicWish.
- При интеграции с PicWish backend должен запрашивать или сохранять processed result в формате `PNG`, чтобы поддержать прозрачный фон.
- Если PicWish возвращает ошибку на этапе запуска или выполнения request, backend должен перевести request в failed state.
- Failed state должен быть доступен frontend для показа ошибки и перегенерации.

#### Request status retrieval

- Backend должен поддерживать status retrieval для guest и authenticated user.
- Status response должен позволять frontend отличить processing, successful completion и failed state.
- При successful completion backend должен вернуть references на original image и processed image.

#### Original and processed image storage

- Backend должен сохранять original image в системе.
- Backend должен сохранять processed image в системе.
- Processed image должен иметь файловый префикс `removed_`.
- Backend не должен перезаписывать original image processed result.
- Backend должен сохранять paths или references так, чтобы frontend мог показать original и processed states.

#### Transparency and output format rules

- Processed image должен сохранять прозрачность для output formats `PNG`, `GIF`, `WebP` и `TIFF`.
- Для output formats `PDF` и `JPG` backend должен подставлять белый фон вместо прозрачности.
- Backend conversion/download flow должен использовать processed image как source для финального файла.
- Если selected output format не поддерживает прозрачность, backend не должен возвращать файл с неконтролируемым transparent/black background.

#### Conversion and final file delivery

- Backend должен поддерживать conversion request для processed image с выбранным output format.
- Backend должен поддерживать polling conversion result для операций, которые не завершаются синхронно.
- После successful completion frontend должен иметь возможность скачать готовый файл.
- Backend должен сохранять selected output format для conversion/download request.
- Backend должен возвращать failed state, если conversion не может быть выполнена.

### Побочные эффекты и интеграционные результаты

- Платежи: guest проходит registration/subscription/payment gate перед финальной выдачей файла; точный payment provider contract не определяется этим документом.
- Подписка / доступ: правила доступа для authenticated user без активной подписки не подтверждены.
- Аналитика: `N/A`
- Email / CRM / webhooks: backend может использовать provider callback/webhook flow для получения результата; дополнительные CRM и email criteria не подтверждены.

### Ограничения и исключения на BE

- Критерии не фиксируют точные URL paths, точные названия таблиц, точные payload names или внутреннюю схему storage keys beyond подтвержденного продуктового поведения.
- Критерии не фиксируют точные internal storage keys beyond обязательного префикса `removed_` для processed image.
- Критерии не требуют ручного редактирования background mask.
- Критерии не требуют batch background removal.
- Критерии не требуют настройки fallback background color для PDF/JPG.

## Нефункциональные критерии

### FE

- Производительность: пользователь должен видеть processing states во время upload, background removal и conversion/download polling.
- Доступность: frontend должен показывать понятные состояния validation error, processing, completed, failed, cancel и payment/subscription required.
- Консистентность UX: Background Remover entry, upload modal, tool panel, format selection и dashboard actions должны использовать существующие паттерны image tools flow.

### BE

- Надежность: backend должен возвращать terminal status для successful и failed processing, чтобы frontend не оставался в бесконечном polling без fallback.
- Наблюдаемость: backend должен различать validation errors, provider failures, status retrieval failures и conversion failures.
- Безопасность: backend не должен выдавать финальный файл пользователю без подтвержденного доступа, если доступ требуется текущими subscription rules.

## Вне scope

- Ручное выделение объекта или ручная маска удаления фона.
- Batch background removal.
- Настройка цвета fallback background для PDF/JPG.
- Административные настройки Background Remover.
- Создание или изменение Qase test cases.

## Открытые вопросы

- Какие входные форматы являются итогово поддерживаемыми: только PNG/JPG/WebP/GIF на backend или также JPEG/TIFF/BMP из frontend validation?
- Какие правила доступа применяются к download/convert/print для authenticated user без активной подписки?
- Должен ли print для guest после оплаты скачивать файл, открывать native print window или использовать отдельный print flow?
- На странице Payment guest должен видеть свое изображение before/after, только processed image или другой preview?

## Примечания

- Критерии подготовлены на основе draft feature spec и входных SA-заметок по Background Remover.
- FE отвечает за entry points, upload validation, modal/tool panel states, restore/remove toggle, guest gate и analytics.
- Backend отвечает за request lifecycle, PicWish integration, storage original/processed images, status retrieval, conversion and transparency rules.
- `pdf.box-landing` отвечает за entry в Background Remover guest flow и landing-specific blocks.
