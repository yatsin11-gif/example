# Постановочная документация

## Метаданные

- Инициатива: Background Remover
- Домен: editor
- Фича: Image Background Remover
- Запросил: SA
- Статус: Draft
- Дата: 2026-05-26
- Репозитории в скоупе: `pdf.box-app`, `pdfbox-backend`, `pdf.box-landing`
- Основной ответственный: SA

## Связанные артефакты

### Дизайн

- https://www.figma.com/design/Xjci4kI0I0WSpDy5jLeYCI/Milestone-4?node-id=28643-47772&t=cC1VSEJST3snTQ1C-4

### Обсуждения

- Входные SA-заметки от 2026-05-26.

### Сопутствующие документы

- https://www.notion.so/pw-tech/Background-Remover-359598775bb68099ad29f35825524d53?source=copy_link
- https://docs.google.com/document/d/1EG6EXasUEWFgF3ALEh3-mVoQlgkdEsI5x6RlWMEgAB4/edit?usp=sharing

## Проблема

- Guest и authenticated user должны иметь возможность быстро удалить фон с изображения через Background Remover.
- Продукту нужен единый flow для загрузки изображения, автоматического удаления фона, просмотра результата, отката и дальнейшего скачивания или конвертации.
- Для Background Remover требуется явный контракт хранения original и processed images, прозрачности результата и поведения форматов без прозрачности.

## Цель

- Дать guest и authenticated user возможность загрузить поддерживаемое изображение, автоматически удалить фон, увидеть результат на прозрачном фоне и переключаться между original и processed state.
- Дать пользователю возможность скачать, конвертировать или распечатать обработанное изображение с сохранением правил прозрачности и хранения в системе.

## Не входит в текущую итерацию

- Ручное выделение объекта или ручная маска удаления фона.
- Настройка цвета fallback background для форматов без прозрачности.
- Batch background removal.
- Редактирование результата после удаления фона, кроме restore/remove toggle.
- Административные настройки Background Remover.

## Триггер и аудитория

- Точка входа / триггер: guest открывает AI Background Remover landing или clone landing; authenticated user запускает Background Remover из dashboard `Tools` / `Images Tools` или из action-menu существующего изображения в системе.
- Основная аудитория: пользователи, которым нужно быстро получить изображение без фона.
- Вторичная аудитория: пользователи, которым нужно скачать, конвертировать или распечатать обработанное изображение в нужном формате.

## Целевое поведение продукта

### Сценарий

1. Guest или authenticated user открывает Background Remover из доступной точки входа и загружает изображение или выбирает существующее изображение в системе.
2. Продукт валидирует изображение, сохраняет original image и запускает автоматическое удаление фона.
3. Пока обработка выполняется, продукт показывает изображение пользователя, loader и заблокированные действия в tool panel.
4. После успешной обработки пользователь видит processed image с transparent background, может переключиться на original state, скачать, конвертировать или распечатать результат.

### Правила результата

- После успешного удаления фона продукт должен показывать toast `Background successfully removed`.
- Processed image должен отображаться с transparent background.
- Пользователь должен иметь возможность переключаться между removed background state и restored original state.
- Original image и processed image должны сохраняться в системе.
- Processed image должен иметь файловый префикс `removed_`.

## Бизнес-правила

- Guest и authenticated user могут использовать Background Remover.
- Удаление фона запускается автоматически после успешной загрузки изображения.
- Форматы PNG, GIF, WebP и TIFF должны сохранять прозрачность обработанного изображения.
- Форматы PDF и JPG должны получать белый фон вместо прозрачности.
- Для guest download, convert и print actions проходят через registration/subscription gate до выдачи финального файла.

## Ограничения и известные лимитации

- Продукт / UX: после загрузки изображения пользователь сразу попадает в editor, где выполняется background removal и отображается результат без фона; если обработка завершается ошибкой, пользователь должен иметь возможность запустить перегенерацию.
- Биллинг / правовые ограничения: guest должен пройти регистрацию и оплату перед финальным download/convert/print; точные правила доступа для authenticated user без подписки не определены.
- Технические ограничения, уже подтвержденные на продуктовом уровне: backend должен поддержать guest и authenticated user entrypoints для запуска background removal, async request status, storage original/processed paths и conversion flow; processed result из PicWish должен быть `PNG`, чтобы сохранить прозрачный фон.
- Технические ограничения, уже подтвержденные на продуктовом уровне: максимальный размер входного файла равен `20 MB`.
- Внешние зависимости: удаление фона зависит от PicWish.

## Влияние на аналитику, CRM и коммуникации

- Аналитика: frontend должен отправлять события в `Zaraz` и `GA` по текущим правилам tools flow.
- Аналитика: должен использоваться тот же базовый набор event parameters, что и в текущей системе; для Background Remover должен передаваться параметр `tool=background_remover`.
- CRM / подписочные системы: затрагивается registration/subscription gate для guest перед download/convert/print.
- Письма / уведомления: Не определено.

## Пограничные сценарии

- Пользователь загружает файл в неподдерживаемом формате.
- Пользователь загружает поддерживаемый файл больше `20 MB`.
- Background removal request остается в processing state дольше ожидаемого.
- PicWish или backend возвращает ошибку обработки, после чего пользователь запускает перегенерацию.
- Пользователь выбирает формат без прозрачности после успешного удаления фона.

## История изменений

### 2026-05-26

- Создан первый draft feature spec на основе SA-заметок по Background Remover.
- Зафиксированы primary guest и authenticated user flows, storage original/processed images, префикс `removed_`, прозрачность для PNG/GIF/WebP/TIFF и белый фон для PDF/JPG.
- Зафиксированы known backend entrypoints, async status flow, PicWish dependency и ограничение размера `20 MB`.
- Добавлена точка входа для authenticated user из action-menu существующего изображения в системе.
- Уточнен editor flow: обработка начинается после загрузки уже в editor, а при ошибке пользователь может запустить перегенерацию.
- Уточнено, что processed result из PicWish должен быть `PNG`, чтобы поддержать прозрачный фон.

## Открытые вопросы

- Какие image-входные форматы являются итогово поддерживаемыми: PNG/JPG/WebP/GIF или также JPEG/TIFF/BMP?
- Какие правила доступа применяются к download/convert/print для authenticated user без активной подписки?
- На странице Payment guest должен видеть свое изображение before/after, только processed image или другой preview?
- Какой формат должен быть выбран по умолчанию в format modal, кроме подтвержденного правила `PNG` для сохранения прозрачности?

## Допущения

- `jpeg` и `jpg` считаются одним продуктовым форматом, пока не утверждено отдельное правило.
- `Restore` в tool panel показывает original image без повторного backend request.
- `Remove` после `Restore` возвращает уже обработанное изображение без повторного background removal request.

## Связанные следующие артефакты

- Критерии: `sa/docs/editor/background-remover/requirements/feature-criteria.md`
- FE: Не создано
- BE: Не создано
- Admin: Не требуется
- Landing: В scope для entry в Background Remover flow
