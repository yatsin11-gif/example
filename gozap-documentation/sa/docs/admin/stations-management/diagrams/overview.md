## Управление станциями в админке — визуальный TL;DR

Источник: [../requirements/feature-spec.md](../requirements/feature-spec.md). Схема — краткая суть, детали в спеке.

### User flow (что видит пользователь)

```mermaid
flowchart TD
    A[Администратор с разделом «Станции»] --> LIST[Список станций]
    LIST --> CREATE[Создать станцию]
    CREATE --> NEW[Станция: статус «активна»]
    LIST --> ARCH{Архивировать станцию?}
    ARCH -->|да| ARCHIVED[Статус «архивирована»]
    ARCH -->|уже архивирована| BLOCK[Действие недоступно]
```

### Что внутри (pipeline)

```mermaid
flowchart LR
    REQ[Запрос на создание/архивирование] --> CHECK[Backend: раздел «Станции» назначен?]
    CHECK -->|нет| DENY[Отклонено]
    CHECK -->|да| OP{Операция}
    OP -->|создание| NEWST[(Станция: активна)]
    OP -->|архивирование| ARCHST[(Станция: архивирована,<br/>история сохранена)]
    ARCHST -.-> PP[Используется в<br/>partners/partner-program]
```

> Этап в конвейере: **Jira-ready** (2 issues) → **QA test cases** готовы. См. [../../../PROGRESS.md](../../../PROGRESS.md).
>
> Вне итерации: редактирование станции, удаление, разархивирование, привязка к партнёру (см. `partners/partner-program`).
