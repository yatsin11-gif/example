# 📘 Документация GoZap — начни отсюда

Это **человеческий вход** в репозиторий документации GoZap. Если ты тут впервые — прочитай
эту страницу, она займёт минуту. Процесс и роли агентов повторяют конвейер из
`pdfbox-documentation` (`AGENTS.md`, `sa/process/ai-delivery-workflow.md`, `sa/prompts/*`,
`sa/templates/*`) — эти файлы не дублируются и не изменяются в этом репозитории, только
используются как образец структуры.

## Что это за репозиторий

`gozap-documentation` — единый источник правды для **бизнес-требований** и **передачи фич в
разработку** продукта GoZap (аренда powerbank через станции). Здесь не пишут код. Здесь сырые
заметки SA (`gozap_story.csv`) превращаются в проверяемую постановку, разбиваются на задачи,
доводятся до Jira и QA, и только потом уходят в целевые репозитории (`gozap-admin`,
`gozap-kiosk-app`, `gozap-backend`).

## Как устроен процесс

Конвейер этапов: `1 Spec → 2 Criteria → 3 Tasks → 4 Jira → 5 QA → (5.5 Qase) → 6 Impl`.
Каждый этап делает свой агент, между этапами — человеческий checkpoint (в этом прогоне
зафиксирован как draft, ожидающий ревью SA/TL/QA). Подробности роли агентов: см. `AGENTS.md`
и `sa/process/ai-delivery-workflow.md` в `pdfbox-documentation-docs-human-readable-maps`.

## Где сейчас все фичи

Живой статус — в [SYSTEM-MAP.md](./SYSTEM-MAP.md) и [PROGRESS.md](./PROGRESS.md).

## Куда дальше

| Хочу… | Открой |
|---|---|
| Увидеть все фичи и их этап | [SYSTEM-MAP.md](./SYSTEM-MAP.md) |
| Узнать, что в работе / заблокировано | [PROGRESS.md](./PROGRESS.md) |
| Прочитать постановку конкретной фичи | `<domain>/<feature>/requirements/feature-spec.md` |
| Увидеть визуальный TL;DR фичи | `<domain>/<feature>/diagrams/overview.md` |

## Структура папки фичи

```
sa/docs/<domain>/<feature>/
├── requirements/   feature-spec.md · feature-criteria.md
├── tasks/          task-breakdown.md
├── jira/           *.md  (Jira-ready issue specs)
├── qa/             test-cases.md · test-matrix.yaml
└── diagrams/       overview.md (визуальный TL;DR фичи)
```

## Текущие фичи

- **partners / partner-program** — управление партнёрами и станциями, расчёт баланса, выплаты через Stripe, сброс пароля через Twilio. [Схема](./partners/partner-program/diagrams/overview.md) · [Spec](./partners/partner-program/requirements/feature-spec.md)
- **admin / admin-roles** — роли в админке: супер-админ создаёт администраторов с уровнем доступа. [Схема](./admin/admin-roles/diagrams/overview.md) · [Spec](./admin/admin-roles/requirements/feature-spec.md)
- **kiosk / terminal-rental-flow** — основной flow аренды на станции (номер, SMS-код, карта, PowerBank) и упрощённый flow для разряженного телефона. [Схема](./kiosk/terminal-rental-flow/diagrams/overview.md) · [Spec](./kiosk/terminal-rental-flow/requirements/feature-spec.md)
- **auth / sms-autofill** — автоподстановка SMS-кода на экране станции. [Схема](./auth/sms-autofill/diagrams/overview.md) · [Spec](./auth/sms-autofill/requirements/feature-spec.md)

## Внешние интеграции (зафиксировано SA)

- **Stripe** — выплаты партнёрам (раз в месяц, накопленный баланс). Платёжный провайдер для оплаты картой на станции **не подтверждён** — отдельный от Stripe (открытый вопрос).
- **Twilio** — все SMS-сценарии: подтверждение номера при аренде, сброс пароля партнёра, уведомление о начале аренды.

---

> Источник входных данных: `gozap_story.csv` (SA user stories, 4 эпика). Документация подготовлена
> тем же конвейером агентов, что и `pdfbox-documentation`, без изменения файлов агентов.
