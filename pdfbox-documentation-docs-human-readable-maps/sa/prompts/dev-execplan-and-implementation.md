# DEV Prompt: ExecPlan и старт реализации

Используй этот промпт внутри целевого implementation repository.

```text
Работаем в репозитории `<REPO_NAME>`.

Контекст задачи:
- Jira issue: <ISSUE_KEY>
- Jira-ready spec: <SPEC_PATH>
- feature spec: <REQ_PATH>
- criteria document: <путь к criteria>
- task breakdown: <TASK_PATH>

Что нужно сделать:
1. Изучи Jira-ready spec и связанные документы.
2. Исследуй текущую реализацию в репозитории и найди все затронутые модули.
3. Создай ExecPlan в `/.agent/plans/` по правилам репозитория.
4. В ExecPlan зафиксируй:
   - purpose
   - context and orientation
   - plan of work
   - concrete steps
   - validation and acceptance
   - risks, assumptions, dependencies
5. Если постановка достаточна для старта, приступай к реализации по ExecPlan.
6. Если найдешь противоречие между кодом и Jira spec, сначала явно зафиксируй его в плане.

Ограничения:
- не пропускай этап ExecPlan
- не реализуй неподтвержденные требования
- не меняй соседние подсистемы без необходимости
- перед кодом проверь локальные правила из `AGENTS.md` и `/.agent/PLANS.md`

Ожидаемый результат:
- созданный ExecPlan в `/.agent/plans/`
- начало реализации или четко сформулированный blocker
- список затронутых модулей и способ валидации результата
```
