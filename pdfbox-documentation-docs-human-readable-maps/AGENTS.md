# AGENTS.md

Правила для AI-работы в `pdfbox-documentation`.

> 👤 **Человек, который зашёл впервые** — тебе сюда: [`sa/docs/README.md`](sa/docs/README.md)
> (что это, картинка процесса, карта фич). Этот файл — правила для AI-агентов.

## Назначение

Этот репозиторий является источником истины для бизнес-требований, документов по декомпозиции и артефактов передачи в разработку.

Агенты, работающие здесь, должны структурировать информацию явно и не должны молча додумывать недостающую бизнес-логику.

## Основной процесс

1. Преобразовать сырые заметки SA в постановочную документацию.
2. Выделить противоречия, assumptions и open questions.
3. После утверждения преобразовать требования в criteria.
4. После утверждения criteria декомпозировать их в implementation tasks.
5. Подготовить Jira-ready task specs.
6. Подготовить QA-owned test case drafts и coverage matrix.
7. Передать контекст на реализацию в целевой репозиторий.

Перед созданием новых артефактов прочитай `sa/process/ai-delivery-workflow.md`.

## Правила директорий

- бизнес-требования хранятся в `sa/docs/.../requirements/`
- документы с criteria хранятся в `sa/docs/.../requirements/`
- декомпозиция задач хранится в `sa/docs/.../tasks/`
- Jira-ready specs хранятся в `sa/docs/.../jira/`
- QA test case drafts и coverage matrix хранятся в `sa/docs/.../qa/`
- переиспользуемые шаблоны хранятся в `sa/templates/`

Если целевая папка еще не существует, создай ее по этой структуре.

## Правила написания

- пиши короткими и явными секциями
- отделяй факты, assumptions и open questions
- не смешивай бизнес-требования с implementation decisions
- используй имена репозиториев явно: `pdf.box-app`, `pdf.box-landing`, `pdf.box-admin`, `pdfbox-backend`
- если требование затрагивает несколько репозиториев, отмечай это явно

## Этап Feature Spec

При структурировании постановки:

- сохраняй бизнес-смысл
- убирай дублирование и неоднозначность
- преобразуй расплывчатые запросы в явные сценарии
- запрашивай уточнение, если отсутствуют бизнес-правила
- не придумывай продуктовые решения, которых нет во входных данных

Используй `sa/templates/feature-spec.md`.

## Этап Criteria

При преобразовании утвержденных требований в criteria:

- переписывай требования как явные и проверяемые product criteria
- сохраняй язык на уровне продукта
- разделяй functional и non-functional criteria
- фиксируй неизвестное в `Open Questions`, а не придумывай ответ

Используй `sa/templates/requirement-criteria.md`.

## Этап Decomposition

При декомпозиции в задачи:

- у каждой задачи должен быть явный owner и repository scope
- разделяй frontend, backend, admin и landing, если правка не совсем мелкая
- явно перечисляй blockers и dependencies
- держи задачи достаточно небольшими для сфокусированной поставки

Используй `sa/templates/task-breakdown.md`.

## Этап Jira-ready

При подготовке issue specs:

- summary должен быть коротким и ориентированным на реализацию
- добавляй ссылки на requirements и decomposition docs
- acceptance criteria должны описывать проверяемое поведение
- добавляй out-of-scope, чтобы задача не расползалась

Используй `sa/templates/jira-task-spec.md`.

## Этап QA Test Cases

При подготовке test case drafts:

- используй только approved feature spec, criteria и утвержденные границы scope
- связывай каждый test case с criteria или явно помечай coverage gap
- не создавай и не обновляй Qase cases без отдельного явного sync-этапа
- фиксируй неизвестное в `Open Questions`, а не придумывай business behavior
- сохраняй ownership за QA: generated test cases являются draft до ручного QA review

Используй `sa/templates/test-cases.md` и `sa/templates/test-matrix.yaml`.

## Передача в реализацию

Перед стартом реализации handoff должен включать:

- ссылку или путь к утвержденному feature spec
- ссылку или путь к утвержденному criteria document
- ссылку или путь к утвержденному task breakdown
- ссылку или путь к QA test cases, если они уже подготовлены
- Jira issue key или Jira-ready spec
- имя целевого репозитория

Планирование реализации происходит в целевом репозитории, а не здесь.
