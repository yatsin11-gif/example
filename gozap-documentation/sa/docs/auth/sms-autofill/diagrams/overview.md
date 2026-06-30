## Автоподстановка SMS-кода — визуальный TL;DR

Источник: [../requirements/feature-spec.md](../requirements/feature-spec.md). Схема — краткая суть, детали в спеке.

### User flow (что видит пользователь)

```mermaid
flowchart TD
    SMS[Входящее SMS с кодом] --> AUTO{Автоподстановка сработала?}
    AUTO -->|да| FILL[Код подставлен в поле]
    AUTO -->|нет| MANUAL[Ручной ввод доступен]
    FILL --> CONFIRM[Пользователь подтверждает<br/>не авто-сабмит]
    MANUAL --> CONFIRM
```

### Что внутри (pipeline)

```mermaid
flowchart LR
    SESSION[Текущая сессия аренды на станции] --> READ[Чтение/перехват входящего SMS]
    READ --> SCOPE{Код принадлежит<br/>этой сессии?}
    SCOPE -->|да| FILL[Подставить в поле ввода]
    SCOPE -->|нет| IGNORE[Игнорировать]
```

> Этап в конвейере: **Jira-ready** (1 issue) → **QA test cases** готовы. См. [../../../PROGRESS.md](../../../PROGRESS.md).
>
> Вне итерации: backend-логика отправки/проверки кода (см. `terminal-rental-flow`), автоподстановка на других поверхностях. Технический механизм автоподстановки на станции не подтверждён.
