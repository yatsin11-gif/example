## Background Remover — визуальный TL;DR

Источник: [../requirements/feature-spec.md](../requirements/feature-spec.md). Схема — краткая суть, детали в спеке.

### User flow (что видит пользователь)

```mermaid
flowchart TD
    A[Точка входа<br/>лендинг / Tools / action-menu изображения] --> B[Загрузка или выбор<br/>существующего изображения]
    B --> V{Валидно?}
    V -->|нет| ERR[Ошибка валидации]
    V -->|да| L[Loader + заблокированные действия<br/>показываем изображение]
    L --> OK[Toast: Background successfully removed<br/>processed на прозрачном фоне]
    OK --> T{Toggle}
    T -->|restore| ORIG[Original state]
    T -->|remove| OK
    OK --> DL[Download / Convert / Print<br/>правила прозрачности]
```

### Что внутри (pipeline)

```mermaid
flowchart LR
    UP[Upload / select image] --> VAL[Валидация]
    VAL --> ST1[(Сохранить original)]
    VAL --> RM[Авто-удаление фона]
    RM --> ST2[(Сохранить processed<br/>префикс removed_)]
    ST2 --> OUT[Transparent result<br/>download / convert / print]
```

> Этап в конвейере: **Jira-ready** (1 issue — end-to-end pipeline). Дальше — QA test cases. См. [../../../PROGRESS.md](../../../PROGRESS.md).
>
> Вне итерации: ручная маска, настройка fallback-цвета фона, batch, редактирование результата.
