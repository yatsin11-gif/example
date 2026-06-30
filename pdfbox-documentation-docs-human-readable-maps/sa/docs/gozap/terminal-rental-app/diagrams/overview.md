## Приложение станций для оплаты через терминал — визуальный TL;DR

Источник: [../requirements/feature-spec.md](../requirements/feature-spec.md). Схема — краткая суть, детали в спеке.

### User flow (что видит пользователь)

```mermaid
flowchart TD
    A[Точка входа: экран станции] --> B{Телефон заряжен?}
    B -->|да| C[Ввод номера телефона]
    B -->|нет, разряжен| LB[Упрощённый поток<br/>без приложения]
    C --> D[SMS-код приходит]
    D --> E{Код верный?}
    E -->|нет| ERR[Ошибка, повтор ввода<br/>лимит попыток]
    E -->|да| F[Оплата картой]
    F --> G{Оплата прошла?}
    G -->|нет| ERR2[Отказ, powerbank не выдаётся]
    G -->|да| H[Станция выдаёт powerbank]
    LB --> H2[Станция выдаёт powerbank<br/>по упрощённому сценарию]
```

### Что внутри (pipeline)

```mermaid
flowchart LR
    PH[Номер телефона] --> TWILIO[Twilio: отправка SMS-кода]
    TWILIO --> VER[Верификация кода]
    VER --> ST1[(Account создан/найден)]
    ST1 --> CARD[Привязка карты]
    CARD --> STRIPE[Stripe: списание оплаты]
    STRIPE --> CHK{Оплата подтверждена?}
    CHK -->|да| DISP[Команда станции: выдать powerbank]
    CHK -->|нет| STOP[Powerbank не выдаётся]
    DISP --> OUT[(Лог аренды)]
```

> Этап в конвейере: **QA test cases готовы**, ожидает ручного QA review и Qase sync. См. [../../../PROGRESS.md](../../../PROGRESS.md).
>
> Coverage gap: сценарий "оплата прошла, но станция не выдала powerbank" — поведение не подтверждено SA (см. feature-criteria.md#open-questions).
