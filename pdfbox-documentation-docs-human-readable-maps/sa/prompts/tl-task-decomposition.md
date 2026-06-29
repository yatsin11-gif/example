# TL Prompt: Декомпозиция задач

Используй этот промпт после того, как feature spec и criteria document утверждены SA.

```text
Работаем в репозитории `pdfbox-documentation`.

Нужно декомпозировать утвержденные feature spec и criteria в задачи по шаблону `sa/templates/task-breakdown.md`.

Вход:
- feature spec: <REQ_PATH>
- criteria document: <путь к criteria>
- целевой путь decomposition-файла: <TASK_PATH>
- при необходимости возьми контекст из репозиториев:
  - `pdf.box-app`
  - `pdf.box-landing`
  - `pdf.box-admin`
  - `pdfbox-backend`

Что нужно сделать:
1. Прочитай feature spec и criteria document.
2. Разбей реализацию на задачи с явным owner и repository scope.
3. Для каждой задачи укажи:
   - зачем задача нужна
   - что входит в scope
   - что вне scope
   - dependencies
   - risks
   - definition of done
4. Отдельно опиши delivery order.
5. Если задача пересекает несколько репозиториев, либо раздели ее, либо явно объясни почему этого не делать.

Правила декомпозиции:
- не смешивай product постановку и техническую реализацию
- не делай задачи слишком крупными
- research/spike задачи выноси отдельно
- backend/frontend/admin/landing разделяй, если это не совсем мелкая правка
- явно помечай blockers и внешние зависимости

Ожидаемый результат:
- готовый markdown task breakdown
- короткий список спорных мест, которые должен подтвердить Team Lead
```
