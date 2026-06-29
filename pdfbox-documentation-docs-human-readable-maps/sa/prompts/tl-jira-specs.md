# TL Prompt: Jira-Ready Specs

Используй этот промпт после того, как task breakdown проверен и утвержден.

```text
Работаем в репозитории `pdfbox-documentation`.

Нужно подготовить Jira-ready task specs по шаблону `sa/templates/jira-task-spec.md`.

Вход:
- feature spec: <REQ_PATH>
- criteria document: <путь к criteria>
- task breakdown: <TASK_PATH>
- целевая папка для Jira specs: <путь к папке>

Что нужно сделать:
1. Возьми утвержденный task breakdown.
2. Создай отдельный markdown-файл для каждой задачи.
3. Для каждой задачи подготовь:
   - короткий implementation-oriented summary
   - business context
   - repository scope
   - problem statement
   - scope / out of scope
   - implementation notes
   - acceptance criteria
   - dependencies
   - risks
4. В каждом spec добавь ссылки на feature spec, criteria document и task breakdown.
5. Если формулировка задачи слишком широкая для Jira issue, сузь ее и явно отметь это.

Ограничения:
- не создавай issue в Jira автоматически
- не добавляй неподтвержденные продуктовые решения
- acceptance criteria должны быть проверяемыми

Ожидаемый результат:
- набор Jira-ready markdown specs
- краткий список issue titles
- замечания по задачам, которые лучше дополнительно разделить до создания в Jira
```
