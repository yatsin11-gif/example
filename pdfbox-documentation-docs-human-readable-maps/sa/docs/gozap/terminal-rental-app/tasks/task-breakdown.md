# Task Breakdown

## Источник

- Requirements document: `sa/docs/gozap/terminal-rental-app/requirements/feature-spec.md`
- Criteria document: `sa/docs/gozap/terminal-rental-app/requirements/feature-criteria.md`
- Approved by: SA review pending; decomposition prepared from current draft
- Date: 2026-06-30

## Принципы декомпозиции

- у каждой задачи один owner
- repository ownership указан явно
- blockers и dependencies видны сразу
- SMS-верификация выносится как отдельная зависимость в `sa/docs/gozap/auth`, а не дублируется здесь

## Список задач

### Task 1

- Title: BE. Аренда. Создание аккаунта по номеру телефона и привязка карты
- Repository: `gozap-backend`
- Owner role: Backend engineer
- Зачем нужна задача: основной поток аренды должен создавать аккаунт по номеру телефона после верификации SMS-кода и сохранять карту для будущих аренд.
- Scope:
  - поиск/создание аккаунта по номеру телефона после успешной верификации (зависит от `sa/docs/gozap/auth`)
  - сохранение карты в аккаунте через Stripe
  - SMS-уведомление о создании аккаунта/начале аренды через Twilio
- Out of scope: сама верификация SMS-кода (см. `sa/docs/gozap/auth`), выдача powerbank
- Dependencies: `sa/docs/gozap/auth`
- Risks: точная Stripe-схема сохранения карты (Customer/PaymentMethod/SetupIntent) не подтверждена
- Definition of done: после верификации номера аккаунт создаётся/находится, карта сохраняется, уведомление отправляется

### Task 2

- Title: BE. Аренда. Оплата на терминале и инициирование выдачи powerbank
- Repository: `gozap-backend`
- Owner role: Backend engineer
- Зачем нужна задача: оплата картой должна обрабатываться через Stripe для обоих потоков, а выдача powerbank должна запускаться только после подтверждения успешной оплаты.
- Scope:
  - создание платежа через Stripe для основного и упрощённого потока
  - обработка Stripe webhook о результате оплаты
  - инициирование команды выдачи powerbank станцией после успешной оплаты
  - обработка отклонённой оплаты
- Out of scope: физический протокол выдачи powerbank станцией (если отличается от команды backend)
- Dependencies: Task 1 (для основного потока)
- Risks: сценарий "оплата прошла, но станция не выдала powerbank" не описан в исходных заметках

### Task 3

- Title: APP. Терминал. Экран покоя и основной поток (номер, SMS, карта)
- Repository: `gozap-station-app`
- Owner role: Frontend engineer
- Зачем нужна задача: нужен UI основного потока аренды на терминале от экрана покоя до выдачи powerbank.
- Scope:
  - экран покоя с полем номера и кнопкой альтернативного сценария
  - экран ввода номера и ввода кода из SMS (с учётом автозаполнения из `sa/docs/gozap/auth`)
  - экран привязки карты и инструкция по карте
  - экран обработки оплаты и экран успеха/ошибки
- Out of scope: упрощённый поток
- Dependencies: Task 1, Task 2, `sa/docs/gozap/auth`

### Task 4

- Title: APP. Терминал. Упрощённый поток для разряженного телефона
- Repository: `gozap-station-app`
- Owner role: Frontend engineer
- Зачем нужна задача: пользователь без рабочего телефона должен арендовать powerbank только через оплату картой.
- Scope:
  - кнопка альтернативного сценария на экране покоя
  - экран подсказки "Приложите карту для аренды"
  - обработка оплаты без ввода номера и без регистрации
- Out of scope: основной поток, сохранение карты в аккаунт
- Dependencies: Task 2

## Порядок поставки

1. Task 1 — аккаунт и карта (зависит от `sa/docs/gozap/auth`).
2. Task 2 — оплата и выдача powerbank.
3. Task 3 — основной UI терминала.
4. Task 4 — упрощённый UI терминала (может идти параллельно с Task 3 после готовности Task 2).

## Cross-Repository Notes

- Верификация SMS-кода и автозаполнение реализуются один раз в `sa/docs/gozap/auth` и используются здесь, а не дублируются.

## Open Technical Questions

- Что происходит, если оплата прошла, но станция не выдала powerbank механически?
- Привязывается ли карта из упрощённого потока к аккаунту при последующей регистрации тем же номером?
