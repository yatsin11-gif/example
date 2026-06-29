# Постановочная документация

## Метаданные

- Инициатива: Image Enhancer
- Домен: editor
- Фича: Image Enhancer
- Запросил: SA
- Статус: Draft
- Дата: 2026-05-13
- Репозитории в скоупе: `pdf.box-app`, `pdfbox-backend`, `pdf.box-landing`
- Основной ответственный: SA

## Связанные артефакты

### Дизайн

- https://www.figma.com/design/Xjci4kI0I0WSpDy5jLeYCI/Milestone-4?node-id=27696-125508&t=uog6d0gIKu6lCLfa-4

### Обсуждения

- Входные SA-заметки от 2026-05-13.
- Уточнение SA от 2026-05-25 по режимам Standard/HD, 2x/4x resize, preview, watermark и download.

### Сопутствующие документы

- https://www.notion.so/pw-tech/Image-Enhancer-358598775bb6805a9b49ff70e327be24?source=copy_link
- https://docs.google.com/document/d/1EG6EXasUEWFgF3ALEh3-mVoQlgkdEsI5x6RlWMEgAB4/edit?usp=sharing

## Проблема

- Guest и authenticated user должны иметь возможность быстро улучшить изображение через Image Enhancer.
- Продукту нужен единый flow, который показывает результат до оплаты, но защищает enhanced image гостя на странице оплаты от screenshot-copy.
- Для Image Enhancer требуется явный контракт поведения для auto quality enhancement, 2x/4x output selection, preview, storage, скачивания и conversion.

## Цель

- Дать guest и authenticated user возможность загрузить поддерживаемое изображение, получить максимально доступное улучшение качества, выбрать 2x или 4x output и увидеть compare preview original/enhanced.
- Дать пользователю возможность скачать или конвертировать enhanced result в поддерживаемом формате после применения текущего output scale, а также сохранить original и enhanced result в системе.

## Не входит в текущую итерацию

- Экспорт в SVG.
- Работа с папками для images на dashboard.
- Действие `Move to` для images.
- Папка `Favorites` для images.
- Гарантия качества улучшения сверх возможностей выбранного external provider.

## Триггер и аудитория

- Точка входа / триггер: guest открывает Image Enhancer с лендинга; authenticated user запускает Image Enhancer из `Images Tools`, через кнопку `Enhance` на dashboard image или через иконку `Image Enhance` в preview изображения.
- Основная аудитория: пользователи, которым нужно быстро улучшить изображение и увидеть результат в product flow.
- Вторичная аудитория: пользователи, которым нужно скачать улучшенное изображение в нужном формате или хранить image files на dashboard.

## Целевое поведение продукта

### Сценарий

1. Guest или authenticated user открывает Image Enhancer и загружает изображение в одном из поддерживаемых входных форматов.
2. Продукт автоматически улучшает качество изображения в Standard или HD режиме по правилам аудитории и размера изображения.
3. После получения enhanced image пользователь видит tool panel с `originalImageId` / `outputImageId`, Preview mode overlay и output scale `2x` по умолчанию.
4. Продукт показывает compare preview original/enhanced и перед download или convert применяет к `enhancedImage` текущий output scale по правилам доступа.

### Правила результата

- Поддерживаемые входные форматы: JPEG, JPG, PNG, WebP, TIFF, HEIF, HEIC.
- Максимальный размер входного файла: 20 MB.
- Guest, пришедший с лендинга, должен иметь возможность улучшить изображение в HD качестве.
- Для authenticated user режим enhancement зависит от длинной стороны исходного изображения: `<= 512 px` обрабатывается в Standard режиме, `> 512 px` обрабатывается в HD режиме.
- Поддерживаемые output scale значения: `2x` и `4x`; переключение между ними не должно запускать повторный enhancement request, если enhanced image уже получено.

## Бизнес-правила

- Guest и authenticated user могут улучшить изображение через Image Enhancer.
- После получения enhanced image frontend самостоятельно выполняет resize результата в `2x` или `4x` относительно оригинального размера изображения пользователя.
- Для guest tool panel frontend должен проверить, соответствует ли полученное HD изображение `2x` относительно original image, и при необходимости resize до `2x`.
- В панели тулы original image должен быть слегка заблюрен, чтобы enhanced result визуально воспринимался качественнее.
- В панели тулы Preview mode overlay должен отображаться по центру поверх `ДО` и `ПОСЛЕ`.
- При переходе guest на страницу оплаты enhanced image в состоянии `ПОСЛЕ` должен иметь watermark, чтобы ограничить возможность использования screenshot вместо оплаты.
- Перед download или convert frontend должен перезаписать `enhancedImage` resize-результатом по текущему выбранному режиму `2x` или `4x`.

## Ограничения и известные лимитации

- Продукт / UX: compare preview должен показывать `ДО / ПОСЛЕ`; original image в editor preview слегка blur; watermark требуется для guest payment page на enhanced `ПОСЛЕ`.
- Биллинг / правовые ограничения: guest payment page должна защищать enhanced result watermark; точный subscription/paywall contract не определен в этом документе.
- Технические ограничения, уже подтвержденные на продуктовом уровне: backend должен поддержать guest и authenticated user entrypoints, валидировать формат и размер файла, запускать async enhancement request, хранить исходное и улучшенное изображение и возвращать frontend enhanced image без обязательной отдельной обработки под `2x` и `4x`.
- Технические ограничения, уже подтвержденные на продуктовом уровне: backend должен принимать `heif/heic` на входе, но перед отправкой в PicWish или другой provider, который не поддерживает `heif/heic` на входе, должен предварительно конвертировать такой файл в `png`.
- Технические ограничения, уже подтвержденные на продуктовом уровне: backend должен поддержать конвертацию переданного enhanced result в PNG, PDF, WebP, JPG, TIFF, HEIF и HEIC; PDF использует текущий алгоритм через Apryse, PNG/WebP/JPG/TIFF/HEIF/HEIC используют модуль `sharp`.
- Внешние зависимости: улучшение изображения зависит от PicWish или другого утвержденного external provider.

## Влияние на аналитику, CRM и коммуникации

- Аналитика: требуется сохранить консистентность с текущими событиями tools flow; новые события не определены.
- CRM / подписочные системы: затрагивается переход guest на страницу оплаты и проверка доступа перед выдачей финального файла; точный контракт не определен.
- Письма / уведомления: Не определено.

## Пограничные сценарии

- Пользователь загружает файл в неподдерживаемом формате.
- Пользователь загружает поддерживаемый файл больше 20 MB.
- Длинная сторона изображения равна `512 px`.
- Пользователь переключает output scale между `2x` и `4x` после получения enhanced image.
- External provider возвращает ошибку или один из этапов enhancement/conversion/download завершается с ошибкой.

## История изменений

### 2026-06-05

- Уточнено, что продукт принимает `heif/heic` как поддерживаемые входные форматы.
- Уточнено, что backend должен предварительно конвертировать `heif/heic` в `png` перед отправкой в PicWish, так как PicWish не принимает `heif/heic` на входе.
- Уточнено, что `heif/heic` поддерживаются как target format для conversion.
- Удален `gif` из поддерживаемых входных форматов.
- Удален `bmp` из поддерживаемых входных форматов.

### 2026-05-25

- Уточнены правила auto quality enhancement: HD для guest с лендинга, Standard/HD для authenticated user по длинной стороне изображения.
- Уточнено, что `2x` и `4x` применяются frontend resize к полученному enhanced image, а не являются отдельными provider enhancement requests.
- Уточнены правила preview: original image в editor preview слегка blur, enhanced image на guest payment page получает watermark.
- Уточнено, что перед download/convert frontend перезаписывает `enhancedImage` resize-результатом по текущему выбранному режиму `2x` или `4x`.
- Уточнено, что default download format равен формату полученного enhanced image, если это PNG или JPG.
- Уточнены guest tool panel criteria: `originalImageId` / `outputImageId`, Preview mode overlay, image dimensions, loader/blocking state при resize и header actions.
- Уточнены authenticated user entry points: `Images Tools`, dashboard `Enhance`, preview `Image Enhance`.

### 2026-05-13

- Создан первый draft feature spec на основе SA-заметок по Image Enhancer.
- Зафиксирован primary guest flow, стартовые форматы, 2x/4x upscale, watermarked preview и unwatermarked final file после registration/subscription gate.
- Уточнены входные форматы `jpeg/jpg/png/gif/webp/tiff/bmp`, backend contract с `requestId`, provider `PicWish`, conversion rules через `Apryse` и `sharp`, а также dashboard image storage scope.

## Открытые вопросы

- Как должен вести себя guest, который пришел не с лендинга: всегда HD, Standard/HD по размеру или отдельное правило?
- Какие правила доступа применяются к download/convert для authenticated user без подписки?
- Что считается форматом enhanced image для default download, если provider возвращает формат, отличный от PNG/JPG?
- Нужен ли для dashboard images отдельный пользовательский фильтр, таб или navigation entry, если images хранятся отдельно от documents?

## Допущения

- `2x` выбран как default output scale, пока не утверждено другое значение.
- PicWish остается утвержденным external provider для первого enhancement pipeline, пока не выбран другой provider.
- Actions для dashboard images в первой итерации ограничены `preview`, `convert`, `rename`, `print`, `download a copy`, `duplicate`, `delete`, `restore`.

## Связанные следующие артефакты

- Критерии: `sa/docs/editor/image-enhancer/requirements/feature-criteria.md`
- FE: Не создано
- BE: Не создано
- Admin: Не требуется
- Landing: В scope для entry в Image Enhancer flow
