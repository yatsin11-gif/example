## Image Enhancer — визуальный TL;DR

Источник: [../requirements/feature-spec.md](../requirements/feature-spec.md). Схема — краткая суть, детали в спеке.

### User flow (что видит пользователь)

```mermaid
flowchart TD
    A[Точка входа<br/>лендинг / Images Tools / Enhance на dashboard] --> B[Загрузка изображения<br/>JPEG/PNG/WebP/TIFF/HEIF/HEIC, ≤20 MB]
    B --> C{Кто и какой размер?}
    C -->|guest с лендинга| HD[HD enhancement]
    C -->|auth, длинная сторона ≤512px| STD[Standard]
    C -->|auth, >512px| HD
    HD --> P[Tool panel: compare ДО/ПОСЛЕ<br/>output scale 2x по умолчанию]
    STD --> P
    P --> SCALE{2x или 4x}
    SCALE -->|переключение| P
    P --> DL[Download / Convert<br/>frontend применяет текущий scale]
    P -. guest на оплате .-> WM[ПОСЛЕ с watermark<br/>защита от screenshot]
```

### Что внутри (pipeline)

```mermaid
flowchart LR
    UP[Upload image] --> BE[Backend: processing request]
    BE --> EXT[External provider<br/>PicWish enhancement]
    EXT --> PV[Preview lambda]
    PV --> CV[Convert lambda]
    BE --> ST[(Хранилище:<br/>original + enhanced)]
    CV --> OUT[Enhanced result<br/>download / convert]
```

> Этап в конвейере: **Jira-ready** (11 issues). Дальше — QA test cases. См. [../../../PROGRESS.md](../../../PROGRESS.md).
