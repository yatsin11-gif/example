# Progress — pdfbox-documentation

Единый трекер прогресса по фичам конвейера. Источник правды о том, что в работе, что
готово и что заблокировано — **без захода в Jira**. Детали этапов: [SYSTEM-MAP.md](./SYSTEM-MAP.md).

## Легенда статуса

- 🟢 **done** — этап пройден / артефакт утверждён
- 🟡 **in-progress** — в работе
- 🔴 **blocked** — ждёт ответа на open questions
- ⚪ **not-started** — ещё не начато

## Ростер фич

| Домен | Фича | Статус | Текущий этап | Что дальше | Open questions |
|---|---|---|---|---|---|
| editor | image-enhancer | 🟡 | Jira-ready (11 issues) | QA test cases (этап 5) | — |
| editor | ocr-editable-documents | 🟡 | Jira-ready (3 issues) | QA test cases (этап 5) | — |
| editor | background-remover | 🟡 | Jira-ready (1 issue) | QA test cases (этап 5) | — |
| billing | biling-kit | ⚪ | Только схемы (flow/action) | feature-spec (этап 1) | постановка не оформлена |
| gozap | partners-admin | 🟡 | QA test cases готовы (6 TC) | Qase sync (этап 5.5, ручной QA review) | бизнес-логика балансов при отсутствии банк. реквизитов на момент выплаты |
| gozap | terminal-rental-app | 🟡 | QA test cases готовы (5 TC) | Qase sync (этап 5.5, ручной QA review) | сценарий "оплата прошла, но powerbank не выдан" (coverage gap, TC-005) |
| gozap | admin-roles | 🟡 | QA test cases готовы (3 TC) | Qase sync (этап 5.5, ручной QA review) | количество уровней доступа; может ли быть >1 супер-админа |
| gozap | auth | 🟡 | QA test cases готовы (3 TC) | Qase sync (этап 5.5, ручной QA review) | срок жизни кода и лимит попыток; поддержка нативного autofill на платформе |

**Итог:** 3 editor-фичи доведены до Jira и ждут QA · 4 gozap-фичи доведены до QA test cases и ждут Qase sync · 1 фича (billing) только на уровне схем.

## Сквозные пункты (актуальны всегда)

- **QA-трек по editor отстаёт.** Ни у одной editor-фичи нет `qa/test-cases.md` + `qa/test-matrix.yaml`.
  Это ближайший общий шаг для editor.
- **billing/biling-kit без постановки.** Есть визуал, но нет feature-spec → criteria. Нельзя
  декомпозировать и публиковать в Jira, пока не пройдены этапы 1–2.
- **Qase sync ещё не запускался** — нет reviewed QA artifacts на вход. Для домена `gozap`
  Qase-проект пока не определён (`qase.project` не заполнен в test-matrix.yaml всех 4 фич) —
  блокер для синка.
- **gozap — новый домен**, документация сгенерирована из сырых заметок SA (CSV) без
  предварительного feature-spec. Используются placeholder-имена репозиториев
  (`gozap-admin`, `gozap-station-app`, `gozap-backend`) — ждут подтверждения SA/Team Lead.
- **Реализация** идёт в целевых репозиториях (`pdf.box-app`, `pdf.box-landing`,
  `pdf.box-admin`, `pdfbox-backend` для editor/billing; репозитории gozap ещё не подтверждены);
  их прогресс сюда не подтягивается автоматически.

## Update log

- 2026-06-08 — файл создан. Снимок состояния: 3 editor-фичи на этапе Jira-ready, billing/biling-kit — только схемы. Введены SYSTEM-MAP.md и шаблон визуала фичи.
- 2026-06-30 — добавлен домен `gozap` (4 фичи: partners-admin, terminal-rental-app, admin-roles, auth), сгенерирован из сырых SA-заметок (CSV) по тому же конвейеру (этапы 1–5: spec → criteria → tasks → jira → QA test cases + matrix + diagrams). Stripe (выплаты) и Twilio (SMS) отражены в criteria/jira/QA. Все 4 фичи ждут Qase sync (этап 5.5) и ручного QA review.

---

> Правила ведения: после закрытия этапа обнови строку в ростере, синхронизируй
> [SYSTEM-MAP.md](./SYSTEM-MAP.md) и добавь запись в update log с датой и сутью изменения.
