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

**Итог:** 3 фичи доведены до Jira и ждут QA · 1 фича только на уровне схем · QA test cases нигде ещё не сделаны.

## Сквозные пункты (актуальны всегда)

- **QA-трек отстаёт.** Ни у одной editor-фичи нет `qa/test-cases.md` + `qa/test-matrix.yaml`.
  Это ближайший общий шаг.
- **billing/biling-kit без постановки.** Есть визуал, но нет feature-spec → criteria. Нельзя
  декомпозировать и публиковать в Jira, пока не пройдены этапы 1–2.
- **Qase sync ещё не запускался** — нет reviewed QA artifacts на вход.
- **Реализация** идёт в целевых репозиториях (`pdf.box-app`, `pdf.box-landing`,
  `pdf.box-admin`, `pdfbox-backend`); их прогресс сюда не подтягивается автоматически.

## Update log

- 2026-06-08 — файл создан. Снимок состояния: 3 editor-фичи на этапе Jira-ready, billing/biling-kit — только схемы. Введены SYSTEM-MAP.md и шаблон визуала фичи.

---

> Правила ведения: после закрытия этапа обнови строку в ростере, синхронизируй
> [SYSTEM-MAP.md](./SYSTEM-MAP.md) и добавь запись в update log с датой и сутью изменения.
