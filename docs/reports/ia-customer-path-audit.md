# IA / Customer Path Audit

Дата аудита: 09.07.2026  
Режим: read-only аудит. Runtime-код, стили, маршруты, данные, header/footer и формы не менялись.  
Dev-server использовался только для public screenshots. Формы не отправлялись, admin не открывался.

## 1. Executive summary

Сайт уже содержит рабочую публичную структуру: главная, proof-раздел, классы систем, подход, контакты, legal-страницы и 22 детальных кейса. Главная хорошо задаёт позиционирование: OptiMate строит AI-системы и операционные контуры, а не просто сайты, чат-боты или набор automation-услуг.

Главная проблема сейчас не в отсутствии страниц, а в пересечении смыслов. Пользователь видит несколько похожих входов:

- `Системы` ведёт на `/work`;
- `Кейсы` ведёт на `/cases`;
- `Возможности` ведёт на `/capabilities`;
- `Решения` есть в footer и ведёт на `/solutions`;
- главная дополнительно ведёт блок "Классы систем" на `/capabilities#...`;
- `/solutions` дальше ведёт в фильтры `/work?type=...`.

Главные дубли:

- `/work` и `/cases`: оба показывают один набор кейсов и ведут в `/cases/[slug]`; `/work` сильнее и уже описан как новая витрина систем.
- `/solutions` и `/capabilities`: обе страницы объясняют классы работ/систем; `/capabilities` точнее соответствует позиционированию "классы систем, а не услуги".
- `/solutions` и `/work?type=...`: карточки `/solutions` в основном работают как промежуточные ссылки в фильтрованный proof-раздел.
- `/capabilities` и блок "Классы систем" на главной: не вредный дубль, если главная остаётся тизером, а `/capabilities` - полной картой классов систем.

Рекомендуемый путь клиента:

`Главная -> /work как proof-раздел -> /cases/[slug] -> /contacts -> заявка`

Для готового клиента путь должен оставаться ещё короче:

`Главная -> Разобрать процесс -> /contacts -> заявка`

## 2. Current route map

### Public and legal routes

| URL | Название | Смысл | В меню? | CTA | Куда ведёт | Дублирует | Рекомендация |
|---|---|---|---|---|---|---|---|
| `/` | AI-системы для бизнеса, который вырос из ручного управления | Главный вход: позиционирование, proof, архитектура, production-readiness, FAQ | Brand в header/footer | `Разобрать процесс`, `Смотреть системы`, финальный CTA | `/contacts`, `/work`, `/capabilities#...`, `/cases/[slug]` | Кратко резюмирует `/work`, `/capabilities`, `/approach` | Оставить главным входом |
| `/work` | Портфолио систем | Главный proof-хаб: системные паспорта, фильтры, архитектура, стек, статус | Header: `Системы`; footer: `Системы` | `Разобрать процесс`, карточки систем | `/work?type=...`, `/cases/[slug]`, `/contacts` | `/cases` | Сделать единственным видимым proof-разделом |
| `/capabilities` | Возможности как строительные блоки AI-инфраструктуры | Полная карта классов систем: AI Agents, RAG, CRM, Content, E-commerce, Automation, GEO, Web | Header: `Возможности`; footer: `Возможности` | `Смотреть работы этого типа`, `Разобрать процесс` | `#slug`, `/work?type=...`, `/contacts` | `/solutions`, частично главная | Оставить, лучше переименовать в `Что делаем` или `Классы систем` |
| `/solutions` | Решения OptiMate | Более старый service-style каталог решений | Footer only | `Обсудить задачу`, CTA в фильтры | `/contacts`, `/work?type=...` | `/capabilities`, `/work?type=...` | Убрать из видимой навигации, позже объединить с `/capabilities` или редиректить |
| `/cases` | Кейсы OptiMate | Legacy case grid по категориям | Header: `Кейсы`; footer: `Кейсы` | `Новая витрина систем`, `Обсудить похожий проект` | `/work`, `/cases?category=...`, `/cases/[slug]`, `/contacts` | `/work` | Скрыть из header/footer primary, оставить пока для совместимости/SEO |
| `/cases/[slug]` | Детальная страница кейса | Реальное доказательство: задача, решение, как работает, автоматизация, технологии, бизнес-ценность | Не в меню напрямую | `Хочу похожую систему` | `/cases`, `/contacts` | Не дубль | Оставить и усиливать как главный proof destination |
| `/approach` | Наш подход | Метод работы: процесс, MVP, AI-control, поддержка, аналитика | Header/footer | `Обсудить внедрение` | `/contacts` | Частично пересекается с главной | Оставить в header как trust/risk-раздел |
| `/about` | OptiMate - команда автоматизации бизнес-процессов | Короткая страница о команде и ценностях | Footer only | Нет page-level CTA | Только global header/footer | Частично главная и `/approach` | Оставить footer-only, переписать позже при наличии сильного team proof |
| `/contacts` | Расскажите, какой процесс хотите автоматизировать | Финальная точка конверсии с формой | Header CTA, footer | Submit form | `/api/leads`, `/privacy` | Нет | Оставить главным CTA |
| `/privacy` | Политика обработки персональных данных | Legal: обработка ПДн | Footer legal | Email в тексте | `info@optimatesite.ru` | Связана с `/consent` | Оставить |
| `/cookies` | Политика cookie | Legal: cookie и аналитика | Footer legal, cookie banner | Управление через banner | Yandex legal URL текстом, email | Связана с cookie banner | Оставить |
| `/consent` | Согласие на обработку персональных данных | Legal: согласие для формы | Footer legal, form consent reference | Ссылка на privacy | `/privacy` | Связана с `/privacy` | Оставить |
| `/terms` | Пользовательское соглашение | Legal: условия сайта, не оферта, нет гарантии аналогичного результата | Footer legal | Нет | Только global header/footer | Нет | Оставить |

### Other route inventory

Public lab routes exist but are not exposed in header/footer/homepage:

- `/sequence-lab/hero-night`;
- `/visual-lab/dala-hero`.

Admin routes exist and were not opened in browser:

- `/admin`;
- `/admin/login`;
- `/admin/leads`;
- `/admin/leads/[id]`;
- `/admin/cases`;
- `/admin/analytics`;
- `/admin/settings`.

API routes exist and were not exercised manually:

- `/api/leads`;
- `/api/events`;
- `/api/admin/auth`;
- `/api/admin/logout`;
- `/api/admin/analytics`;
- `/api/admin/leads`;
- `/api/admin/leads/[id]`;
- `/api/admin/leads/[id]/notes`;
- `/api/admin/mfa/setup`;
- `/api/admin/mfa/status`;
- `/api/admin/mfa/enable`;
- `/api/admin/mfa/verify`.

Dynamic case inventory: `/cases/[slug]` is generated from 22 slugs:

`ai-organic-flow`, `crm-imagine`, `ai-wiki-b2b`, `imagine-4-0`, `lawcheck`, `telegram-post-creator`, `local-secrets-manager`, `scent-signature-v2`, `ai-stratify`, `ai-triz`, `ai-content-factory`, `alteco-ii-invest`, `aromatest`, `aromatherapy-content-ai`, `imagine-content-intelligence`, `extra-imagine`, `extra-sales`, `imagine-event-forms`, `ky-design`, `llm-wiki`, `songteleprompter`, `voyagers-tracker`.

## 3. Header / footer analysis

### Current header

Current header links:

| Label | Route | Role |
|---|---|---|
| OptiMate | `/` | Возврат на главную |
| Системы | `/work` | Proof / portfolio |
| Возможности | `/capabilities` | What we build |
| Кейсы | `/cases` | Legacy proof grid |
| Подход | `/approach` | Trust / method |
| Разобрать процесс | `/contacts` | Primary conversion CTA |

Проблема header: одновременно есть `Системы -> /work` и `Кейсы -> /cases`. Для клиента это выглядит как два разных proof-раздела, хотя оба в итоге ведут к одному набору кейсов и к `/cases/[slug]`.

Что оставить:

- `/work` как единственный видимый proof-раздел;
- `/capabilities` как "что делаем";
- `/approach`;
- `/contacts`;
- CTA `Разобрать процесс`.

Что убрать:

- `/cases` из header, потому что `/work` сильнее и уже выполняет роль новой витрины систем.

Что переименовать:

- `Системы` можно переименовать в `Кейсы` или `Работы`, если route остаётся `/work`.
- `Возможности` лучше переименовать в `Что делаем` или `Классы систем`, чтобы не звучать как абстрактный SaaS-раздел.

### Current footer

Current footer public links:

- `/work`;
- `/capabilities`;
- `/solutions`;
- `/cases`;
- `/approach`;
- `/about`;
- `/contacts`.

Legal links:

- `/privacy`;
- `/consent`;
- `/cookies`;
- `/terms`.

Contact links:

- `info@optimatesite.ru`;
- `https://t.me/optimate`.

Footer сейчас шире header и добавляет два вторичных входа: `/solutions` и `/about`. `/about` допустим как footer-only trust route. `/solutions` сбивает сильнее, потому что выглядит как ещё один раздел "что делаем" и ведёт дальше в `/work?type=...`.

Footer лучше привести к структуре:

- `Что делаем -> /capabilities`;
- `Кейсы -> /work`;
- `Подход -> /approach`;
- `Контакты -> /contacts`;
- Email / Telegram;
- Legal: `/privacy`, `/consent`, `/cookies`, `/terms`.

## 4. Homepage blocks analysis

| Блок | Зачем нужен | Куда ведёт | Дублирует ли страницу | Что должен делать дальше |
|---|---|---|---|---|
| Hero | Главный positioning: AI-системы для бизнеса вне ручного управления | `/contacts`, `/work` | Резюмирует весь сайт | Оставить два пути: быстрый contact и proof |
| Классы систем | Быстро показать, какие классы систем строит OptiMate | Сейчас `/capabilities#slug` | Да, тизер `/capabilities` | Либо вести сразу на `/work?type=...`, либо добавить рядом быстрый contact/proof путь |
| Кейсы как паспорта систем | Доказать компетенцию через конкретные системы | `/cases/[slug]` для 5 featured кейсов | Частично `/work` и `/cases` | Оставить как proof-preview; можно вести на `/work` как полный список |
| Архитектура | Объяснить, что AI-система - это слои: интерфейс, агенты, знания, интеграции, аналитика, контроль | Нет ссылок | Частично `/approach` | Оставить как trust-блок, не превращать в отдельный путь |
| НЕ ДЕМО | Снять страх "одноразового скрипта": логи, права, контроль, fallback, мониторинг | Нет ссылок | Частично `/approach` | Оставить; после блока можно усиливать CTA на contacts |
| Автономный бизнес-контур | Раскрыть метафору day/night: команда управляет, система продолжает процесс | Нет ссылок | Частично hero | Оставить как смысловую опору главной |
| CTA | Дать понятный следующий шаг без ТЗ | `/contacts` | Не дубль | Оставить как главный conversion block |
| FAQ | Закрыть базовые возражения: не только AI, можно начать мало, интеграции, контроль AI, legal | Нет ссылок | Частично `/approach` | Оставить; можно добавить contact CTA ниже, если нужна более сильная конверсия |

Главная в целом работает как hub. Проблема возникает не в блоках сами по себе, а в том, что после блока "Классы систем" пользователь уходит в длинную цепочку:

`Главная -> Классы систем -> /capabilities#... -> /work?type=... -> /cases/[slug] -> /contacts`

Этот путь логичен для изучающего пользователя, но слишком длинный для тёплого клиента. Нужно сохранить прямой путь:

`Главная -> Разобрать процесс -> /contacts`

И proof-first путь:

`Главная -> Смотреть системы -> /work -> /cases/[slug] -> /contacts`

## 5. Duplication analysis

### `/work`

Что это сейчас: главная витрина систем. Страница показывает проекты как "system passports": тип системы, бизнес-ситуация, что собрано, архитектура, стек, интеграции, статус и связанные capability tags.

Отличается ли от `/cases`: да, отличается качеством упаковки. Данные те же, но `/work` лучше соответствует новой стратегии: не "карточки кейсов", а proof-системы и архитектурный сигнал.

Нужен ли в меню: да. Это главный proof-раздел.

Рекомендация: оставить в header/footer, но label можно сделать `Кейсы` или `Работы`, чтобы пользователь не видел одновременно `Системы` и `Кейсы`.

### `/capabilities`

Что это сейчас: полная карта классов систем, которые OptiMate умеет проектировать. У каждого класса есть summary, "когда нужно", "что отдаём", контроль, типы работ и link на фильтрованный `/work`.

Отличается ли от блока "Классы систем": да. Главная - teaser, `/capabilities` - полная карта.

Нужен ли в меню: да, если нужно сохранить раздел "что делаем". Лучше назвать не `Возможности`, а `Что делаем` или `Классы систем`.

Рекомендация: оставить; позже добавить более короткий conversion path внутри каждого класса.

### `/solutions`

Что это сейчас: service-style listing: AI-агенты, CRM, content, e-commerce, integrations, internal tools. Карточки дают "когда подходит" и ведут в `/work?type=...`.

Отличается ли от `/capabilities`: слабо. `/capabilities` точнее, глубже и лучше соответствует "классы систем, а не услуги".

Отличается ли от `/cases`/`/work`: частично. `/solutions` не даёт proof, а служит промежуточным каталогом перед proof.

Нужен ли вообще: как visible route - нет. Как SEO/legacy route - можно оставить временно.

Рекомендация: убрать из footer primary; позже перенести полезные "when fits" bullets в `/capabilities` и сделать redirect `/solutions -> /capabilities` или оставить hidden для SEO.

### `/cases`

Что это сейчас: legacy-compatible case listing by category. Страница сама предлагает `Новая витрина систем -> /work`.

Можно ли сделать главным proof-разделом: технически можно, но не нужно. `/work` уже сильнее как proof-хаб.

Рекомендация: оставить route и `/cases/[slug]`, но убрать `/cases` из primary navigation. Детальные кейсы пока остаются на `/cases/[slug]`.

## 6. Recommended simplified navigation

### Вариант А - максимально простой

`Кейсы / Подход / Контакты / Разобрать процесс`

Mapping:

- `Кейсы -> /work`;
- `Подход -> /approach`;
- `Контакты -> /contacts`;
- `Разобрать процесс -> /contacts`.

Плюс: самый короткий путь к proof и заявке.  
Минус: пользователь, который сначала хочет понять "что именно вы делаете", должен получить это с главной или из блоков `/work`.

### Вариант Б - если нужно сохранить "что делаем"

`Что делаем / Кейсы / Подход / Контакты / Разобрать процесс`

Mapping:

- `Что делаем -> /capabilities`;
- `Кейсы -> /work`;
- `Подход -> /approach`;
- `Контакты -> /contacts`;
- `Разобрать процесс -> /contacts`.

Плюс: сохраняет отдельный "what we build" route.  
Минус: важно не возвращать `/cases` в header как второй proof-раздел.

Рекомендуемый вариант для ближайшей итерации: вариант Б. Он не режет полезный раздел `/capabilities`, но убирает главный дубль `/cases` из header.

## 7. Recommended customer paths

### Пользователь хочет понять, что вы делаете

Текущий путь:

`Главная -> Классы систем -> /capabilities#slug -> /work?type=... -> кейс -> /contacts`

Рекомендуемый короткий путь:

`Главная -> Классы систем -> /work?type=нужный-класс -> кейс -> /contacts`

Альтернатива, если нужен explanation-first:

`Главная -> Что делаем (/capabilities) -> нужный класс -> Разобрать похожий процесс -> /contacts`

### Пользователь хочет увидеть доказательства

Текущий сильный путь:

`Главная -> Смотреть системы -> /work -> /cases/[slug] -> Хочу похожую систему -> /contacts`

Рекомендация: сделать этот путь основным proof path и убрать конкурирующий вход `/cases` из header.

### Пользователь пришёл из поиска по AI/RAG/CRM

Текущий путь:

`/capabilities#ai-agents или #rag-knowledge-systems или #crm-automation -> Смотреть работы этого типа -> /work?type=... -> /cases/[slug] -> /contacts`

Рекомендуемый путь:

`SEO landing / capability anchor -> proof-preview по этому классу -> /work?type=... или /contacts`

На `/capabilities` стоит дать не только "Смотреть работы этого типа", но и прямой CTA `Разобрать похожий процесс`.

### Пользователь готов оставить заявку

Текущий и рекомендуемый путь:

`Любая страница -> Разобрать процесс / Обсудить внедрение / Хочу похожую систему -> /contacts -> форма`

Этот путь уже есть. Важно не прятать его за изучением `/solutions`, `/capabilities` и `/cases`.

## 8. What to keep / hide / merge / redirect

| Страница | Решение | Почему | Риск | Как лучше сделать |
|---|---|---|---|---|
| `/` | Оставить | Главный positioning и conversion hub | Нет | Сохранять два пути: contact-first и proof-first |
| `/work` | Оставить в меню | Лучший proof-раздел, системные паспорта | Название `Системы` может быть неочевидным | Label в nav сделать `Кейсы` или `Работы`, route оставить `/work` |
| `/cases` | Оставить скрытой для SEO/compatibility | Дублирует `/work`, но route нужен для старых ссылок и case details | Удаление/редирект может сломать legacy links | Сначала убрать из header/footer primary; позже решить redirect |
| `/cases/[slug]` | Не трогать пока | Это реальные proof-detail pages | Back-link сейчас ведёт на `/cases`, не `/work` | Позже можно пересмотреть back-link и структуру detail route |
| `/capabilities` | Оставить в меню | Лучший раздел "что делаем" | Может удлинять путь до proof | Переименовать в `Что делаем`; добавить прямые CTA в каждом классе |
| `/solutions` | Объединить / скрыть / позже redirect | Дублирует `/capabilities`, ведёт в `/work?type=...` | Может быть SEO entry; резкий redirect без анализа нежелателен | Убрать из footer primary, перенести полезный текст в `/capabilities`, затем решить SEO/redirect |
| `/approach` | Оставить в меню | Снимает риск, объясняет метод и контроль AI | Частичный повтор homepage blocks | Оставить как trust page |
| `/about` | Не трогать пока, footer-only | Не вредная, но слабая conversion page | В header будет отвлекать | Держать footer-only; позже усилить team proof или объединить с approach |
| `/contacts` | Оставить | Главная conversion endpoint | Нет | Держать как primary CTA |
| Legal pages | Оставить | Нужны для формы, cookie, legal trust | Нет | Не использовать как marketing path |
| Lab routes | Не трогать | Экспериментальные поверхности | Индексация/случайное раскрытие | Не добавлять в navigation |

## 9. Recommended next implementation tasks

Для следующего Codex prompt:

1. Убрать `/cases` из header.
2. Сделать один visible proof пункт: label `Кейсы` или `Работы`, route `/work`.
3. Переименовать `Возможности` в `Что делаем` или `Классы систем`, route `/capabilities`.
4. Убрать `/solutions` из primary footer links или перенести в legacy/SEO-only зону.
5. Оставить `/about` footer-only, не добавлять в header.
6. Решить, куда ведут карточки "Классы систем" на главной:
   - conversion-first: `/work?type=...`;
   - explanation-first: `/capabilities#slug` плюс прямой CTA на `/contacts`.
7. На `/capabilities` добавить быстрый CTA в каждом классе: `Разобрать похожий процесс`.
8. На `/capabilities` добавить proof-preview или 2-3 ссылки на релевантные кейсы по классу, чтобы не заставлять пользователя проходить весь путь вручную.
9. Позже решить стратегию `/solutions`:
   - merge content into `/capabilities`;
   - keep hidden for SEO;
   - redirect to `/capabilities` после проверки SEO/индексации.
10. Позже решить стратегию `/cases`:
    - keep for legacy;
    - redirect `/cases -> /work`;
    - или оставить listing, но не держать в primary navigation.
11. Не трогать admin, auth, lead API, Prisma, legal pages и consent/cookie logic в рамках навигационной итерации.
12. Визуально подтянуть в первую очередь `/solutions`, если она остаётся доступной: сейчас она выглядит более старой service-card страницей на фоне `/work` и `/capabilities`.

## 10. Screenshots

Screenshots сохранены в:

`site/docs/reports/ia-customer-path-screenshots/`

Файлы:

- `home-light.png` - `/`, light theme;
- `home-dark.png` - `/`, dark theme;
- `work.png` - `/work`;
- `capabilities.png` - `/capabilities`;
- `solutions.png` - `/solutions`;
- `cases.png` - `/cases`;
- `contacts.png` - `/contacts`.

Browser QA условия:

- использован один local dev-server на `http://127.0.0.1:3000`;
- admin routes не открывались;
- формы не отправлялись;
- delete/export не использовались;
- для screenshots в localStorage выставлялись только `theme` и `cookie_consent=necessary`, чтобы cookie banner не перекрывал кадры и чтобы не отправлять consent events через UI.

Проверки:

- `npm.cmd run lint` не запускался по условиям задачи.
- `npm.cmd run build` не запускался по условиям задачи.
- `npm.cmd run typecheck` script отсутствует в `package.json`.
- `npm.cmd run test` script отсутствует в `package.json`.

Ошибки/заметки:

- Первый запуск dev-server через `Start-Process` завершился ошибкой PowerShell: `Элемент уже добавлен. Ключ в словаре: "Path" Добавляемый ключ: 'PATH'`. После этого server был запущен через `cmd.exe` wrapper.
- Playwright package был доступен в Codex runtime, но bundled Chromium отсутствовал. Для screenshots использован локальный `C:\Program Files\Google\Chrome\Application\chrome.exe`, без скачивания браузеров и без установки зависимостей.

