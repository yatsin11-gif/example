## Роли в админке для партнёров — визуальный TL;DR

Источник: [../requirements/feature-spec.md](../requirements/feature-spec.md). Схема — краткая суть, детали в спеке.

### User flow (что видит пользователь)

```mermaid
flowchart TD
    A[Супер-админ: раздел Партнёры] --> B[Создать партнёра]
    B --> C[Привязать станции<br/>+ % комиссии]
    C --> D[Партнёр получает доступ<br/>в свой кабинет]
    D --> E[Кабинет партнёра:<br/>баланс / статистика станций]
    E --> F{Запросить выплату?}
    F -->|да| G[Заявка на выплату<br/>Stripe payout]
    F -->|нет| E
    D --> H[Забыл пароль]
    H --> I[SMS-код для сброса пароля]
    I --> E
```

### Что внутри (pipeline)

```mermaid
flowchart LR
    REG[Супер-админ создаёт партнёра] --> ST1[(Partner record)]
    ST1 --> BIND[Привязка станций + commission %]
    BIND --> ST2[(Station-Partner binding)]
    EARN[Доход со станций] --> CALC[Расчёт баланса партнёра<br/>по % комиссии]
    CALC --> ST3[(Partner balance)]
    ST3 --> PAYOUT[Запрос выплаты]
    PAYOUT --> STRIPE[Stripe payout API]
    RESET[Забыл пароль] --> TWILIO[Twilio SMS-код]
    TWILIO --> ST1
```

> Этап в конвейере: **QA test cases готовы**, ожидает ручного QA review и Qase sync. См. [../../../PROGRESS.md](../../../PROGRESS.md).
>
> Открытые вопросы: что происходит с балансом партнёра при отсутствии банковских реквизитов на момент выплаты; точная периодичность выплат (см. feature-criteria.md).
