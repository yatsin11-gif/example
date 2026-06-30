## Приложение станций: основной flow аренды — визуальный TL;DR

Источник: [../requirements/feature-spec.md](../requirements/feature-spec.md). Схема — краткая суть, детали в спеке.

### User flow (что видит пользователь)

```mermaid
flowchart TD
    IDLE[Экран покоя:<br/>номер телефона / альт. кнопка] --> PHONE[Ввод номера]
    IDLE -->|разряженный телефон| ALT[Подсказка:<br/>«Приложите карту для аренды»]
    PHONE --> SMS[Ввод SMS-кода]
    SMS -->|неверный код| ERR1[Ошибка, повтор]
    SMS -->|верный код| ACC[Аккаунт создан]
    ACC --> CARD[Привязка карты + инструкция]
    CARD --> PAY{Оплата успешна?}
    ALT --> PAY
    PAY -->|нет| ERR2[Экран ошибки]
    PAY -->|да| OK[PowerBank выдан<br/>SMS-уведомление]
```

### Что внутри (pipeline)

```mermaid
flowchart LR
    NUM[Номер телефона] --> TWILIO[Twilio: отправка кода]
    TWILIO --> VER[Проверка кода]
    VER -->|успех| ACC[(Создать аккаунт)]
    CARD[Данные карты] --> PROV[Платёжный провайдер<br/>не подтверждён]
    PROV -->|успех| DISP[Команда станции: выдать PowerBank]
    DISP --> NOTIFY[Twilio: SMS о начале аренды]
    ALT[Упрощённый flow: карта без номера] --> PROV
```

> Этап в конвейере: **Jira-ready** (5 issues) → **QA test cases** готовы. См. [../../../PROGRESS.md](../../../PROGRESS.md).
>
> Вне итерации: окончание аренды и возврат powerbank, альтернативные способы оплаты.
