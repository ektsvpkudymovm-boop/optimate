# Home / Work Client Copy And Light Fix

Date: 2026-07-09 09:51 +05:00

## Problem

The marked screenshots showed several public UI issues after the homepage and `/work` redesign:

- homepage task-selection block read like an internal system taxonomy;
- visible labels mixed client language with internal metaphors;
- the `Автоматизация` task card could overflow in light theme;
- proof/showreel heading used the unclear `паспорта` metaphor;
- `/work` hero had an extra `Смотреть кейсы` button;
- `/work` had a separate featured block that made three cases look more important than the rest;
- `/work` cards had uneven hierarchy because featured and regular cards differed;
- light theme had weak contrast in case cards, proof/showreel, telemetry and architecture panels.

## Homepage Text Replacements

- `Что можно автоматизировать` -> `КУДА ВНЕДРИТЬ AI`
- `Выберите участок процесса, где нужна AI-система` -> `Выберите участок бизнеса, где нужна система`
- Lead copy now explains that selecting a task shows similar cases: linked data, automation scope and where human control remains.

## Homepage Card Labels

- `AI Agents` / previous agent label -> `AI-агенты`
- `RAG` / `Базы знаний / RAG` as card title -> `Базы знаний`
- `CRM / Business OS` / long CRM label -> `CRM и процессы`
- `Content Factories` -> `Контент-процессы`
- `E-commerce AI` / long online-sales label -> `Онлайн-продажи`
- `Automation` / `Автоматизация процессов` -> `Автоматизация`
- `GEO / AI Search` -> `Видимость в AI-поиске`

The existing ids, slugs, order and href pattern were preserved:

```text
/work?type={capability.id}#work-results
```

## Removed Internal Terms

Visible public UI in the touched home and `/work` areas no longer uses:

- `WHAT WE BUILD`
- `Классы систем, а не витрина услуг`
- `Кейсы как паспорта рабочих систем`
- `Паспорт системы`
- `System passport`
- `Featured systems`
- `Featured passport`
- `All systems`
- `HITL`
- visible `Production` / `MVP` statuses on `/work`

Status source values in case data were not changed; `/work` still maps them for public display:

- `Production` -> `В работе`
- `MVP` -> `Первая версия`
- `MVP → Production` -> `Первая версия → внедрение`

## Proof / Showreel

- Kicker changed to `ПРИМЕРЫ ВНЕДРЕНИЙ`.
- Heading changed to `Посмотрите, как устроены рабочие AI-системы`.
- Lead now describes task, data, integrations, AI layers and specialist control.
- Visible card label changed from `Паспорт системы` to `Устройство системы`.
- Showreel mechanics, links and layout were preserved.

## `/work` Hero

- Removed the secondary hero button `Смотреть кейсы`.
- Kept only `Разобрать процесс` -> `/contacts`.

## `/work` Featured Block

- Removed the separate block with `Три рабочих системы с самым ясным архитектурным сигналом`.
- Removed featured-card rendering from `/work`.
- All cases now render through the same case-card grid.

## `/work?type=...#work-results`

- Filter links keep the anchor:
  - `Все` -> `/work#work-results`
  - other filters -> `/work?type={capability.id}#work-results`
- Results section now owns `id="work-results"`.
- Desktop scroll margin: 96px.
- Mobile scroll margin: 80px.
- Active filters remain visible via existing active chip styling.

## Light Theme Fixes

Scoped CSS only:

- `[data-theme="light"] .home-page ...`
- `[data-theme="light"] .work-page ...`

Adjusted contrast for:

- homepage proof/showreel system card;
- homepage architecture layer cards;
- homepage telemetry/status panels;
- `/work` case card titles, descriptions, matrix labels and chips;
- `/work` status chips and CTA chips.

Global tokens, `.ops-bg*`, sequence assets and hero sequence canvas logic were not changed.

## Changed Files

- `src/app/page.tsx`
- `src/app/(public)/work/page.tsx`
- `src/components/public/system-passport-showreel.tsx`
- `src/content/capabilities.ts`
- `src/app/globals.css`
- `README.md`
- `README_HANDOFF.md`
- `PROJECT_MAP.md`
- `.design-work/00-inputs.md`
- `.design-work/05-implementation-report.md`
- `.design-work/07-visual-review.md`
- `docs/reports/home-work-client-copy-and-light-fix-20260709-0951.md`

## Routes Changed / Added

- Changed public route content: `/`
- Changed public route content: `/work`
- No new public routes were added.

## Routes Preserved

- `/`
- `/solutions`
- `/cases`
- `/cases/[slug]`
- `/work`
- `/capabilities`
- `/approach`
- `/about`
- `/contacts`
- `/privacy`
- `/consent`
- `/cookies`
- `/terms`

## Assets Used

- Screenshot reference zip was unpacked to `.design-work/refs/visual-fix-20260709/`.
- No production visual assets were added or replaced.
- `public/sequence/*` was not changed.

## Safety Confirmations

- Capability ids were not changed.
- Case slugs were not changed.
- Query params were not changed.
- `/cases/[slug]` URL structure was preserved.
- Backend, admin, forms, legal pages, Prisma, cookie consent and analytics consent were not changed.
- `ScrollSequenceHero`, `RENDER_SETTINGS`, hero WebP sequence, `.ops-bg*`, `ProductionTelemetryBoard` logic and `OperationsProcessRail` logic were not changed.

## Checks

```text
npm.cmd run lint
Result: passed
```

```text
npm.cmd run build
Result: passed
```

Browser visual QA was not run because repository instructions require explicit current-task browser permission.

## Backup

Post-change backup path:

```text
C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-after-home-work-client-copy-and-light-fix-20260709-0951.zip
```

Backup was created after code changes, documentation/report updates and checks.

Archive verification:

- Size: greater than 0 bytes
- Entry count: 841
- Forbidden entries found: 0

## Manual QA

- Open `/` and verify there is no `WHAT WE BUILD` / old class-system heading.
- Verify task block says `КУДА ВНЕДРИТЬ AI` and `Выберите участок бизнеса, где нужна система`.
- Verify homepage cards use Russian client-facing labels and `Автоматизация` fits.
- Verify proof/showreel no longer says `паспорта`.
- Click `AI-агенты` on homepage and confirm `/work?type=ai-agents#work-results`.
- On `/work`, verify only `Разобрать процесс` remains in hero.
- Verify featured block is gone and all cases use one grid.
- Verify visible UI does not show `HITL`, `System passport`, `Featured systems`, `All systems` or public `Production`.
- Verify light theme readability on homepage proof/showreel, telemetry, architecture and `/work` cards.
- Open `/cases/ai-organic-flow` and confirm the detailed case still works.
