# Task Breakdown

## Источник

- Requirements document: `sa/docs/auth/sms-autofill/requirements/feature-spec.md`
- Criteria document: `sa/docs/auth/sms-autofill/requirements/feature-criteria.md`
- Approved by: SA review pending; decomposition prepared from current draft
- Date: 2026-06-30

## Принципы декомпозиции

- breakdown покрывает только frontend scope (см. примечание в criteria)
- foundation-задачи из `sa/docs/kiosk/terminal-rental-flow` считаются уже подготовленными и используются как dependency
- у задачи один owner
- repository ownership указан явно

## Список задач

### Task 1

- Title: FE. SMS Autofill. Автоподстановка кода на экране станции
- Repository: `gozap-kiosk-app`
- Owner role: Frontend engineer
- Зачем нужна задача: автоматическая подстановка кода ускоряет прохождение основного flow аренды и убирает ручной ввод.
- Scope:
  - перехват/чтение входящего SMS-кода на экране ввода кода (`sa/docs/kiosk/terminal-rental-flow`, Task 4)
  - автоматическая подстановка кода в поле ввода
  - сохранение возможности ручного ввода как резервного пути
- Out of scope:
  - backend-логика отправки и проверки кода (см. `sa/docs/kiosk/terminal-rental-flow`)
  - автоматическая отправка формы без действия пользователя (требует подтверждения, см. open question)
- Dependencies:
  - `sa/docs/kiosk/terminal-rental-flow` Task 1 (BE подтверждение номера)
  - `sa/docs/kiosk/terminal-rental-flow` Task 4 (FE экран ввода кода)
- Risks:
  - технический механизм получения SMS на стороне станции не подтверждён; задача может потребовать пересмотра scope после уточнения
- Definition of done:
  - код из входящего SMS подставляется в поле ввода без ручного набора
  - ручной ввод кода остаётся доступным как резервный путь

## Порядок поставки

1. Task 1 — после готовности базового экрана ввода кода в `terminal-rental-flow`.

## Cross-Repository Notes

- Полностью зависит от `gozap-kiosk-app` и backend-контракта `sa/docs/kiosk/terminal-rental-flow`; отдельного backend scope нет.

## Open Technical Questions

- На каком устройстве физически происходит автоподстановка кода?
- Должна ли успешная автоподстановка автоматически отправлять форму подтверждения?
