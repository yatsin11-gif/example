# Task Breakdown

## Источник

- Requirements document: `sa/docs/gozap/auth/requirements/feature-spec.md`
- Criteria document: `sa/docs/gozap/auth/requirements/feature-criteria.md`
- Approved by: SA review pending; decomposition prepared from current draft
- Date: 2026-06-30

## Принципы декомпозиции

- у задачи один owner
- repository ownership указан явно
- эта декомпозиция — общая зависимость для `terminal-rental-app` и `partners-admin`, а не дублирование их задач

## Список задач

### Task 1

- Title: BE. SMS-код. Генерация, отправка через Twilio и верификация
- Repository: `gozap-backend`
- Owner role: Backend engineer
- Зачем нужна задача: нужен единый сервис генерации, отправки и верификации одноразового SMS-кода, используемый и в основном потоке аренды, и при сбросе пароля партнёра.
- Scope:
  - генерация одноразового кода с ограниченным сроком жизни
  - отправка кода через Twilio
  - ограничение частоты повторной отправки на номер
  - верификация кода с ограничением числа попыток
- Out of scope: бизнес-логика, что происходит после успешной верификации (создание аккаунта, сброс пароля — описаны в соответствующих фичах)
- Dependencies: нет
- Risks: точный срок жизни кода и число попыток не подтверждены
- Definition of done: код отправляется через Twilio, верифицируется с учётом срока жизни и лимита попыток, повторная отправка ограничена по частоте

### Task 2

- Title: APP. Поле ввода кода с автозаполнением и fallback на ручной ввод
- Repository: `gozap-station-app`
- Owner role: Frontend engineer
- Зачем нужна задача: пользователю терминала нужно автоматическое заполнение кода из SMS там, где это технически доступно, и ручной ввод как fallback.
- Scope:
  - попытка автозаполнения кода из SMS на экране ввода кода терминала
  - fallback на ручной ввод, если автозаполнение не сработало
  - UI повторного запроса кода
- Out of scope: backend-логика генерации и верификации (Task 1)
- Dependencies: Task 1

## Порядок поставки

1. Task 1 — backend-сервис SMS-кода.
2. Task 2 — UI автозаполнения на терминале.

## Cross-Repository Notes

- `sa/docs/gozap/terminal-rental-app` и `sa/docs/gozap/partners-admin` используют Task 1 как готовую зависимость для верификации номера/сброса пароля, а не реализуют свой SMS-сервис.
- Поле ввода кода при сбросе пароля партнёра в `gozap-admin` может переиспользовать тот же UI-паттерн, что и Task 2, если платформенно применимо.

## Open Technical Questions

- Каков точный срок жизни кода и максимальное число попыток ввода?
- Поддерживает ли платформа терминала нативный SMS autofill?
