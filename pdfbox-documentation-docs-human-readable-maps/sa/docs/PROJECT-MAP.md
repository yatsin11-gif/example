# PDF.box — карта проекта

Большой обзор всего продукта: поверхности (репозитории), домены, фичи и стадия каждой
в конвейере поставки. Это «зашёл и увидел, где что и на каком этапе».

![Карта проекта](./project-map.svg)

> ⚠️ **Что реально, а что пример.** Этот репозиторий (`pdfbox-documentation`) знает только про
> свои домены — **editor**, **billing** и теперь **gozap** помечены «реальные данные». Остальные
> иллюстративные домены показаны как **пример** структуры, чтобы карта выглядела как карта
> всего продукта. Реальный статус по ним появится, когда их фичи заведут в конвейер здесь.
>
> ⚠️ **gozap — отдельный продукт.** В отличие от editor/billing (продукт PDF.box), `gozap` —
> станции аренды powerbank с собственными поверхностями (admin, station-app, backend). Имена
> репозиториев (`gozap-admin`, `gozap-station-app`, `gozap-backend`) — placeholder, ждут
> подтверждения SA. SVG `project-map.svg` ниже **не перегенерирован** для gozap (нет SVG-тулинга
> в этой среде) — актуальный статус gozap смотри в SYSTEM-MAP.md/PROGRESS.md, не на картинке.

## Как читать

- **Поверхности** сверху — четыре продукта на одном бэкенде + этот репозиторий документации.
- **Полоса прогресса** у каждой фичи — 7 сегментов = этапы: `Spec · Crit · Task · Jira · QA · Impl · Live`.
  Закрашено столько, до какого этапа доведена фича. Цвет = статус (зелёный готово, оранжевый в работе, серый план).
- **Теги репозиториев** (`app · back · land · admin`) — каких поверхностей касается фича.

## Реальное состояние (из этого репозитория)

- **editor / Image Enhancer** — 4/7, доведён до Jira (11 issue), ждёт QA test cases.
- **editor / OCR editable docs** — 4/7, Jira (3 issue), ждёт QA.
- **editor / Background Remover** — 4/7, Jira (1 issue), ждёт QA.
- **billing / Billing kit** — 0/7, есть только схемы, постановки (feature-spec) ещё нет.
- **gozap / Partners Admin** — 5/7, Jira (5 issue) + QA test cases (6 TC), ждёт Qase sync.
- **gozap / Terminal Rental App** — 5/7, Jira (4 issue) + QA test cases (5 TC, 1 coverage gap), ждёт Qase sync.
- **gozap / Admin Roles** — 5/7, Jira (2 issue) + QA test cases (3 TC), ждёт Qase sync.
- **gozap / Auth (SMS autofill)** — 5/7, Jira (2 issue) + QA test cases (3 TC), ждёт Qase sync.

Детальный статус — в [SYSTEM-MAP.md](./SYSTEM-MAP.md) и [PROGRESS.md](./PROGRESS.md).
Как устроен сам конвейер — в [delivery-workflow-diagram.md](./delivery-workflow-diagram.md).

## Как обновлять

Карта — статический SVG, собранный из данных о фичах. Когда фича двигается по этапам:
поменяй её строку в [SYSTEM-MAP.md](./SYSTEM-MAP.md), затем перегенерируй `project-map.svg`
(тем же способом, что и остальные SVG — см. [шаблон визуала](../templates/feature-diagram.md)).
Это зона ответственности скилла-картографа `sa-cartographer`.
