# AI Delivery Workflow

Этот документ определяет практический процесс поставки фич с Codex-агентами для `pdfbox-documentation`, `pdf.box-app`, `pdf.box-landing`, `pdf.box-admin` и `pdfbox-backend`.

## Цель

Процесс должен производить 5 стабильных артефактов:

1. утвержденный feature spec
2. утвержденные criteria
3. утвержденные task breakdown и Jira-ready task specifications
4. QA-owned test case drafts и coverage matrix
5. repository-specific ExecPlans для реализации

У каждого этапа есть human owner и агентская ответственность. Агент подготавливает структуру и детализацию. Человек валидирует намерение и решения.

## Роли

### SA

- владеет бизнес-замыслом
- дает сырое описание фичи, бизнес-правила и ограничения
- валидирует feature spec и acceptance logic

### Decomposition Agent

- преобразует утвержденный feature spec и criteria в implementation tasks
- определяет repository ownership
- определяет open questions, dependencies и risks

### Team Lead / DEV

- валидирует техническую реализуемость
- корректирует границы задач
- утверждает порядок реализации

### Jira Agent

- преобразует утвержденные задачи в Jira-ready issue specs
- следит, чтобы у каждой задачи были summary, description, acceptance criteria, dependencies и repository scope

### QA Agent

- преобразует approved criteria в test case drafts
- строит coverage matrix по criteria
- готовит Qase-compatible поля без публикации в Qase
- фиксирует coverage gaps и open questions для QA

### QA

- валидирует test cases
- владеет решением о готовности test cases к Qase sync
- утверждает smoke candidates и automation candidates

### Implementation Agent

- читает Jira-ready task spec
- исследует целевой репозиторий
- пишет ExecPlan в `/.agent/plans/`
- реализует код после утверждения плана или сразу, если команда работает в режиме plan-first execution

## Рекомендуемая структура директорий

Для каждой инициативы создавай одну директорию:

`sa/docs/<domain>/<feature>/`

Внутри храни:

- `requirements/feature-spec.md`
- `requirements/feature-criteria.md`
- `tasks/task-breakdown.md`
- `jira/`
- `qa/test-cases.md`
- `qa/test-matrix.yaml`
- опционально `diagrams/`

Пример:

`sa/docs/billing/subscription-upgrade/requirements/feature-spec.md`

## Этап 1. Подготовка постановочной документации

Вход:

- свободные заметки SA
- ссылки на существующие flows
- скриншоты, ссылки, тикеты, примеры конкурентов

Результат агента:

- нормализованный feature spec по `templates/feature-spec.md`
- явные assumptions
- open questions для SA
- linked artifacts, business rules и known constraints

Критерии выхода:

- нет неразрешенных противоречий
- границы scope описаны явно
- зафиксированы product behavior, success intent и non-goals

Human checkpoint:

- SA утверждает feature spec

## Этап 2. Выделение criteria

Вход:

- утвержденный feature spec

Результат агента:

- criteria document по `templates/requirement-criteria.md`
- functional criteria
- non-functional criteria
- acceptance scenarios
- open questions, которые еще блокируют декомпозицию

Правила:

- criteria должны быть проверяемыми
- criteria не должны добавлять новое поведение продукта
- язык должен оставаться продуктовым, а не техническим

Human checkpoint:

- SA валидирует criteria document

## Этап 3. Декомпозиция задач

Вход:

- утвержденный feature spec
- утвержденный criteria document
- при необходимости контекст из app/backend/admin/landing репозиториев

Результат агента:

- task breakdown по `templates/task-breakdown.md`
- repository mapping для каждой задачи
- dependency chain
- definition of done для каждой задачи

Правила декомпозиции:

- у задачи должен быть один явный owner
- не смешивай frontend и backend, если изменение не тривиально
- исследовательские задачи и spikes выноси отдельно от delivery tasks
- явно помечай blockers
- держи задачи достаточно маленькими для одного сфокусированного delivery cycle

Human checkpoint:

- Team Lead или senior DEV валидирует границы задач

## Этап 4. Jira-ready спецификации

Вход:

- утвержденный task breakdown

Результат агента:

- один Jira-ready document на issue по `templates/jira-task-spec.md`
- короткий title
- problem statement
- scope
- implementation notes
- acceptance criteria
- dependencies

Рекомендуемые labels:

- `ai-ready`
- repository label, например `frontend`, `backend`, `landing`, `admin`
- domain label, например `billing`, `auth`, `editor`

Human checkpoint:

- Team Lead / DEV валидирует формулировки перед созданием issue

## Этап 5. QA test cases

Вход:

- утвержденный feature spec
- утвержденный criteria document
- при необходимости task breakdown и Jira-ready specs
- при необходимости read-only контекст из Qase

Результат агента:

- `qa/test-cases.md` по `templates/test-cases.md`
- `qa/test-matrix.yaml` по `templates/test-matrix.yaml`
- coverage status для каждого criteria
- smoke candidates
- automation candidates
- open questions для QA

Правила:

- test cases должны покрывать approved criteria, а не придумывать новый product behavior
- каждый test case должен ссылаться на criteria или явно показывать coverage gap
- Qase-compatible поля готовятся заранее, но Qase entities не создаются без отдельного sync-этапа
- ручной QA review обязателен перед запуском публикации в Qase

Human checkpoint:

- QA валидирует test cases и coverage matrix

## Этап 5.5. Qase sync

Вход:

- reviewed `qa/test-cases.md`
- reviewed `qa/test-matrix.yaml`
- GitLab CI/CD variable `QASE_API_TOKEN`

Результат sync job:

- Qase suite найден или создан
- Qase test cases созданы или обновлены
- `qa/test-matrix.yaml` обновлен Qase IDs, `sync_status`, `sync_action` и `last_synced_at`
- `qa/test-cases.md` обновлен Qase IDs

Правила:

- sync запускается отдельным ручным job `sync_qase` на `main`
- скрипт sync не генерирует новые product expectations, а только публикует reviewed QA artifacts
- sync публикует только кейсы, явно помеченные в matrix через `sync_action: create` или `sync_action: update`
- подробности процесса описаны в `sa/process/qase-sync.md`

## Этап 6. ExecPlan и реализация

Вход:

- Jira issue
- Jira-ready task spec
- target repository

Результат агента:

- repository-specific ExecPlan в:
  - `pdf.box-app/.agent/plans/`
  - `pdf.box-landing/.agent/plans/`
  - `pdf.box-admin/.agent/plans/`
  - при желании добавьте ту же конвенцию и в backend

Правила:

- реализация стартует с repository planning standard
- план должен ссылаться на Jira issue и путь к feature spec
- если одна Jira issue затрагивает несколько репозиториев, создавай отдельный ExecPlan на каждый репозиторий

Human checkpoint:

- DEV следует ExecPlan и обновляет его по ходу реализации

## Handoff contract между этапами

Каждый этап должен передавать следующему агенту только эти ссылки:

- путь к feature spec
- путь к criteria document
- путь к task breakdown
- путь к QA test cases, если они подготовлены
- Jira issue key или путь к Jira-ready spec
- путь к target repository

Так процесс остается детерминированным. Не нужно каждый раз вставлять всю историю обсуждений.

## Минимальная рабочая модель для команды

Используйте такой паттерн на практике:

1. SA открывает `pdfbox-documentation` и пишет сырой запрос по шаблону.
2. SA просит Codex: "Собери постановочную документацию по шаблону, задай open questions, не придумывай бизнес-логику".
3. После утверждения SA просит Codex: "Собери feature spec в explicit criteria без добавления новой логики".
4. После утверждения criteria Team Lead просит Codex: "Декомпозируй criteria на задачи с привязкой к репозиториям и зависимостям".
5. Team Lead проверяет breakdown.
6. Team Lead просит Codex: "Подготовь Jira-ready спецификации по каждой задаче".
7. QA просит Codex: "Подготовь test case drafts и coverage matrix по утвержденным criteria".
8. QA проверяет `qa/test-cases.md` и `qa/test-matrix.yaml`.
9. После утверждения задач DEV открывает целевой репозиторий и просит Codex: "По задаче <KEY> и этому spec создай ExecPlan в `/.agent/plans/` и начни реализацию".

## Рекомендуемые следующие технические шаги

Чтобы это было операционно, а не вручную, добавьте дальше:

1. Единый repo-local skill для `pdfbox-documentation`.
2. Такой же `ExecPlan` standard в `pdfbox-backend`, чтобы backend жил в той же модели handoff.
3. Небольшой script или prompt library, который умеет генерировать:
   - feature spec
   - criteria document
   - task breakdown
   - Jira body / JSON
   - QA test cases
   - coverage matrix
   - ExecPlan starter
4. При необходимости подключите Jira через MCP, чтобы Codex мог создавать issues после ручного checkpoint.
5. При необходимости подключите Qase через MCP, чтобы отдельный sync-этап мог создавать или обновлять QA-reviewed test cases.

## Чего не делать

- не позволяйте агенту создавать Jira tasks из сырых заметок SA
- не позволяйте агенту публиковать Qase cases без ручного QA review
- не смешивайте утвержденный feature spec с implementation assumptions
- не начинайте писать код по decomposition document без repository plan
- не создавайте задачи на несколько репозиториев без явного ownership
