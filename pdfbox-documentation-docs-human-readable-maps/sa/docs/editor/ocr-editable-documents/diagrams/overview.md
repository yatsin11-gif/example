## Editable OCR Documents — визуальный TL;DR

Источник: [../requirements/feature-spec.md](../requirements/feature-spec.md). Схема — краткая суть, детали в спеке.

### User flow (что видит пользователь)

```mermaid
flowchart TD
    A[Editor flow:<br/>пользователь открыл страницу документа] --> B[Выделяет область<br/>+ выбирает язык OCR]
    B --> C[Фронт шлёт: № страницы,<br/>координаты области, OCR language]
    C --> D{Область в editable scope?}
    D -->|да| E[Результат для подмены страницы<br/>+ редактируемый распознанный текст]
    D -->|нет| F[Явный fallback]
```

### Что внутри (pipeline)

```mermaid
flowchart LR
    REQ[Edit OCR request<br/>page + area + language] --> BOOT[Lambda bootstrap<br/>выбранная область]
    BOOT --> OCR[OCR распознавание]
    OCR --> BG[Background cleaning<br/>подготовка фона]
    BG --> GM[Gemini analysis<br/>доп. данные о шрифте]
    GM --> RES[Артефакты для подмены страницы<br/>без локальной обработки на фронте]
```

> Этап в конвейере: **Jira-ready** (2 backend + 1 frontend issue). Дальше — QA test cases. См. [../../../PROGRESS.md](../../../PROGRESS.md).
>
> Вне итерации: 1:1 совпадение с оригиналом, превращение всех элементов в редактируемые, вынос Gemini в отдельный jobs module.
