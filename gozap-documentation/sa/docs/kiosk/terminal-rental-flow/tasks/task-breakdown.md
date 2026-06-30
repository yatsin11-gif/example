# Task Breakdown

## Источник

- Requirements document: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-spec.md`
- Criteria document: `sa/docs/kiosk/terminal-rental-flow/requirements/feature-criteria.md`
- Approved by: SA review pending; decomposition prepared from current draft
- Date: 2026-06-30

## Принципы декомпозиции

- у каждой задачи один owner
- repository ownership указан явно
- backend и frontend разделены
- blockers и dependencies видны сразу

## Список задач

### Task 1

- Title: BE. Terminal Rental. Подтверждение номера через Twilio и создание аккаунта
- Repository: `gozap-backend`
- Owner role: Backend engineer
- Зачем нужна задача: основной flow аренды требует подтверждённого номера телефона перед привязкой карты и созданием аккаунта.
- Scope:
  - приём номера телефона от станции и отправка SMS-кода через Twilio
  - проверка введённого кода
  - создание аккаунта пользователя по номеру телефона при успешной проверке
- Out of scope:
  - обработка оплаты и выдача PowerBank (Task 2)
  - упрощённый flow для разряженного телефона (Task 3)
- Dependencies:
  - нет (foundation-задача)
- Risks:
  - поведение при истёкшем/неверном коде не детализировано во входных данных
- Definition of done:
  - станция может инициировать отправку SMS-кода и получить подтверждение
  - аккаунт создаётся только после успешной проверки кода

### Task 2

- Title: BE. Terminal Rental. Оплата картой и выдача команды на PowerBank
- Repository: `gozap-backend`
- Owner role: Backend engineer
- Зачем нужна задача: после подтверждения номера система должна обработать оплату картой и выдать PowerBank только при успешной оплате.
- Scope:
  - приём данных карты для обработки оплаты и сохранение карты в аккаунте для будущих списаний
  - подтверждение успешной оплаты перед командой станции на выдачу PowerBank
  - отправка SMS-уведомления о создании аккаунта/начале аренды через Twilio
- Out of scope:
  - выбор и интеграция конкретного платёжного провайдера терминала (требует подтверждения, см. open question)
  - окончание аренды и возврат powerbank
- Dependencies:
  - Task 1
- Risks:
  - платёжный провайдер для приёма карты на терминале не подтверждён
- Definition of done:
  - оплата картой обрабатывается, и PowerBank выдаётся только при успешной оплате
  - пользователь получает SMS о начале аренды

### Task 3

- Title: BE/FE. Terminal Rental. Упрощённый flow для разряженного телефона
- Repository: `gozap-backend`
- Owner role: Backend engineer
- Зачем нужна задача: пользователь без рабочего телефона должен получить PowerBank только по карте, без номера и регистрации.
- Scope:
  - backend endpoint оплаты картой без номера телефона и без создания полноценного аккаунта
  - команда станции на выдачу PowerBank после подтверждения оплаты в упрощённом flow
- Out of scope:
  - основной flow с SMS-подтверждением (Task 1, Task 2)
- Dependencies:
  - Task 2 (переиспользует обработку оплаты картой)
- Risks:
  - нет
- Definition of done:
  - PowerBank выдаётся по упрощённому flow только после успешной оплаты, без ввода номера

### Task 4

- Title: FE. Terminal Rental. Экраны станции: покой, ввод номера, код, карта, успех/ошибка
- Repository: `gozap-kiosk-app`
- Owner role: Frontend engineer
- Зачем нужна задача: пользователю нужен полный визуальный flow на экране станции от состояния покоя до выдачи PowerBank.
- Scope:
  - экран покоя с полем ввода номера и кнопкой альтернативного сценария
  - экран ввода номера телефона
  - экран ввода SMS-кода
  - экран привязки карты с инструкцией
  - экран успеха/ошибки
- Out of scope:
  - упрощённый flow для разряженного телефона (Task 5)
- Dependencies:
  - Task 1, Task 2
- Risks:
  - нет
- Definition of done:
  - пользователь может пройти полный flow от экрана покоя до получения PowerBank

### Task 5

- Title: FE. Terminal Rental. Упрощённый flow для разряженного телефона
- Repository: `gozap-kiosk-app`
- Owner role: Frontend engineer
- Зачем нужна задача: нужен отдельный экран с подсказкой «Приложите карту для аренды» для пользователей без рабочего телефона.
- Scope:
  - кнопка альтернативного сценария на экране покоя
  - экран с подсказкой «Приложите карту для аренды» и оплатой без ввода номера
- Out of scope:
  - основной flow (Task 4)
- Dependencies:
  - Task 3
- Risks:
  - нет
- Definition of done:
  - пользователь может получить PowerBank по упрощённому flow без ввода номера

## Порядок поставки

1. Task 1 — подтверждение номера и создание аккаунта.
2. Task 2 — оплата картой и выдача PowerBank в основном flow.
3. Task 4 — FE основной flow.
4. Task 3 — backend для упрощённого flow.
5. Task 5 — FE упрощённый flow.

## Cross-Repository Notes

- Task 4/5 (`gozap-kiosk-app`) зависят от контрактов Task 1/2/3 (`gozap-backend`).
- Автоподстановка SMS-кода (`sa/docs/auth/sms-autofill`) встраивается в экран Task 4 после готовности базового flow ввода кода.

## Open Technical Questions

- Какой платёжный провайдер используется для обработки карты на терминале станции?
- Как должен выглядеть flow окончания аренды и возврата powerbank?
