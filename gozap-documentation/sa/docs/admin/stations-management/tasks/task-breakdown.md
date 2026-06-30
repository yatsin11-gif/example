# Task Breakdown

## Источник

- Requirements document: `sa/docs/admin/stations-management/requirements/feature-spec.md`
- Criteria document: `sa/docs/admin/stations-management/requirements/feature-criteria.md`
- Approved by: SA review pending; decomposition prepared from current draft
- Date: 2026-06-30

## Принципы декомпозиции

- у каждой задачи один owner
- repository ownership указан явно
- backend и frontend разделены
- blockers и dependencies видны сразу

## Список задач

### Task 1

- Title: BE. Stations Management. Сущность станции, создание и архивирование
- Repository: `gozap-backend`
- Owner role: Backend engineer
- Зачем нужна задача: нужна централизованная сущность «станция» со статусом активна/архивирована, управляемая через раздел «Станции».
- Scope:
  - создание станции со статусом «активна» по умолчанию
  - перевод станции в статус «архивирована» без удаления исторических данных
  - проверка доступа: только администратор с разделом «Станции» или супер-админ
- Out of scope:
  - редактирование станции
  - удаление станции
  - привязка станции к партнёру (`sa/docs/partners/partner-program`)
- Dependencies:
  - `sa/docs/admin/admin-roles` (модель доступа по разделам)
- Risks:
  - набор полей станции не зафиксирован во входных данных
- Definition of done:
  - администратор с доступом к разделу «Станции» может создать и архивировать станцию через API

### Task 2

- Title: FE. Stations Management. Список станций, создание и архивирование
- Repository: `gozap-admin`
- Owner role: Frontend engineer
- Зачем нужна задача: администратору нужен интерфейс раздела «Станции» — список, форма создания, действие архивирования.
- Scope:
  - список станций с отображением статуса (активна/архивирована)
  - форма создания станции
  - действие архивирования станции из списка/карточки
- Out of scope:
  - редактирование станции
  - разархивирование станции
- Dependencies:
  - Task 1
- Risks:
  - нет
- Definition of done:
  - администратор с доступом к разделу «Станции» может увидеть список, создать и архивировать станцию

## Порядок поставки

1. Task 1 — backend сущность станции и API.
2. Task 2 — FE раздел «Станции».

## Cross-Repository Notes

- Task 2 (`gozap-admin`) зависит от контракта Task 1 (`gozap-backend`).
- Видимость раздела «Станции» регулируется ролевой моделью `sa/docs/admin/admin-roles`.
- Сущность «станция» переиспользуется в `sa/docs/partners/partner-program` для привязки к партнёрам.

## Open Technical Questions

- Какой набор полей должен быть у станции при создании?
- Что должно происходить при попытке архивировать станцию, привязанную к партнёру с активными арендами?
