# Visual V3 Reference Report

Дата и время: 2026-07-07 17:11:44 +05:00

Backup zip: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-visual-v3-reference-20260707-1659.zip`

## Прочитанные reference-файлы

- `AGENTS.md`
- `site/docs/design-references/dala/DESIGN.md`
- `site/docs/design-references/dala/theme.css`
- `site/docs/design-references/dala/variables.css`
- `site/docs/design-references/dala/tokens.json`

## Выводы read-only агентов

Agent 1, Reference Translator:
- Reference требует pure black canvas, не dark gray SaaS panels.
- Иерархия должна строиться масштабом, whitespace и weight 400, а не жирным H1.
- Один saturated violet CTA, amber только для label/highlight.
- Hero visual должен быть procedural intelligence field / constellation, без screenshots, robots, dashboard mockups.
- Карточные grids, тени, borders и blur должны перестать быть основным языком публичной части.

Agent 2, Current UI Demolition Planner:
- SaaS-look создавали `lab-hero__stage`, `lab-stage__canvas`, `lab-stage__nodes`, `drawNode`, `drawGrid`, `drawLane`.
- Header выглядел как pill/glass SaaS chrome из-за `lab-nav`, `lab-header-cta`, `theme-switch`.
- Главная повторяла card-grid язык через `capability-module-card`, `proof-passport`, `production-node`, `final-lab-cta`.
- Безопасные targets: `page.tsx`, `globals.css`, `hero-bg.tsx`, `header.tsx`, `theme-toggle.tsx`.
- Не трогать admin, auth, API, Prisma, legal pages, forms, consent.

Agent 3, Build Risk Auditor:
- Baseline `npm.cmd run build` до visual rewrite проходил.
- В `package.json` есть `lint` и `build`; нет `typecheck` и `test`.
- Безопасный набор visual rewrite: публичные страницы/компоненты и `globals.css` только по `lab-*`/public classes.
- Не трогать admin, API, auth, Prisma, legal pages, contacts form, cookie consent.

## Что изменено

- Главная `/` переведена в dark-first first viewport с full-bleed canvas.
- Старый boxed process map/dashboard-card hero заменён на `HeroBg` particle constellation.
- В hero оставлен один filled violet CTA; вторичный action стал ghost-link.
- H1 стал huge regular-weight display; жирные hero/section headings переопределены в public layer.
- Header стал минимальным dark header: transparent/black surface, muted uppercase nav, violet CTA, micro-label `AI Product Lab`.
- Theme default изменён на dark, ручной выбор через `localStorage` сохранён.
- Ниже hero главная перестроена как typographic scenes: `What we build`, `Proof systems`, `Architecture`, `Not a demo`, autonomous operations, final CTA, FAQ.
- FAQ убран из rounded card containers и переведён в disclosure rows.
- `/work` и `/capabilities` получили dark list/module styling через public CSS overrides; текст `/work` больше не называет элементы карточками.

## Затронутые файлы

- `site/src/app/page.tsx`
- `site/src/components/public/hero-bg.tsx`
- `site/src/app/globals.css`
- `site/src/components/header.tsx`
- `site/src/components/theme-toggle.tsx`
- `site/src/app/layout.tsx`
- `site/src/components/public/faq.tsx`
- `site/src/app/(public)/work/page.tsx`
- `site/src/app/(public)/capabilities/page.tsx`
- `site/docs/reports/visual-v3-reference-report.md`

## Изменённые страницы

- `/`
- `/work`
- `/capabilities`

## Сохранённые маршруты

- `/`
- `/work`
- `/capabilities`
- `/solutions`
- `/cases`
- `/cases/[slug]`
- `/approach`
- `/about`
- `/contacts`
- `/privacy`
- `/consent`
- `/cookies`
- `/terms`
- `/admin/*`
- `/api/*`

## Проверки

Запущены:
- `npm.cmd run lint`
- `npm.cmd run build`

Прошли:
- `npm.cmd run lint`

Не запускались, потому что нет script в `package.json`:
- `npm.cmd run typecheck`
- `npm.cmd run test`

Упали:
- `npm.cmd run build`

Build attempt 1:
```text
./src/components/public/hero-bg.tsx:156:20
Type error: 'canvas' is possibly 'null'.
```

После этого `canvas` был закреплён как `canvasElement`.

Build attempt 2:
```text
./src/components/public/hero-bg.tsx:163:7
Type error: 'context' is possibly 'null'.
```

После второго падения `context` был закреплён как `canvasContext`. По runtime guardrails проекта одна и та же упавшая команда не повторялась третий раз.

## Что проверить владельцу вручную

- Запустить `npm.cmd run build` после последней правки `canvasContext`.
- Открыть `/` вручную в браузере: первый экран должен быть black void + particle constellation, без dashboard-card и boxed nodes.
- Проверить `/work` и `/capabilities` вручную: страницы должны читаться как system list / typographic modules, а не одинаковые card grids.
- Проверить light theme вручную: она сохранена как secondary/inverted режим, но hero должен сохранять dark identity.
- Проверить мобильный first viewport вручную, особенно длину hero H1 и CTA.

Скриншот не делался. Браузер, Playwright, Puppeteer, dev-server и `start/explorer http://...` не запускались.
