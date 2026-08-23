# Case Client Titles, CTA and Filter Fix

Date: 2026-07-09 10:08 +05:00

## Problem

- `/work` case cards used internal or English project names as primary titles.
- A few `Открыть кейс` CTA labels could wrap to two lines in narrow card footers.
- The selected filter label in the light theme used a pale cyan accent that was weak on the warm light background.
- Filtered `/work?type=...#work-results` repeated the same title in the filter panel and results heading.

## Title Mapping

| Project name | Client-facing title |
| --- | --- |
| AI Organic Flow | Контент-конвейер для SEO и AI-поиска |
| CRM IMAGINE | CRM для клиентской работы и заказов |
| AI-WIKI B2B | AI-база знаний для B2B-продаж |
| IMAGINE 4.0 | Онлайн-продажи с AI-подбором |
| LawCheck | AI-анализ судебных документов |
| Telegram Post Creator | Планирование Telegram-контента |
| Local Secrets Manager | Локальное хранилище паролей и задач |
| Scent Signature v2 | CRM для подбора ароматов |
| AI Stratify | AI-совет экспертов для бизнес-решений |
| AI-TRIZ | AI-помощник для инженерных задач |
| AI Content Factory | AI-фабрика маркетингового контента |
| Alteco II Invest | AI-подбор инвестиционных решений |
| Aromatest | Онлайн-тестирование для аромапсихологов |
| База знаний по ароматерапии | AI-контент для блога по ароматерапии |
| IMAGINE Content Intelligence | Контент-разведка для новостей и дайджестов |
| EXTRA | Онлайн-витрина премиальной парфюмерии |
| ExtRA SALES | Закрытый магазин для VIP-клиентов |
| Система регистрации на мероприятия IMAGINE | Регистрация на мероприятия и уведомления |
| KY Design | Платформа брендового контента |
| LLM Wiki | AI-вики с источниками и цитатами |
| SongTeleprompter | Телесуфлёр для музыкантов |
| Voyagers Tracker | Интерактивный трекер NASA Voyager |

## Where Titles Are Used

- `/work`: card `h3` now uses `case.clientTitle`.
- Homepage proof/showreel: primary visible titles now use the shared `CASE_CLIENT_TITLES` mapping for the five featured cases.
- `/cases/[slug]`: detail page `h1` and metadata title now use `case.clientTitle`.
- Internal project names remain secondary as `Проект: ...` where shown.

## UI Changes

- Added `clientTitle` normalization and `CASE_CLIENT_TITLES` mapping in `src/content/cases.ts`.
- Added secondary project-name rows on `/work` cards and case detail pages.
- Added scoped `.work-passport-card__cta` styling with `display: inline-flex`, `gap`, `align-items: center` and `white-space: nowrap`.
- Added `.work-selected-filter-label` and light-theme violet override using `--color-accent-violet`.
- Changed the results heading below the filter panel to neutral `Подобранные кейсы` to avoid repeating `Кейсы по теме: ...`.

## Preserved Behavior

- Case slugs were not changed.
- `/cases/[slug]` URL structure was not changed.
- `generateStaticParams` was not changed.
- `/work?type=...#work-results` filter query params and anchor were not changed.
- Backend, admin, forms, legal pages, Prisma, cookie consent, analytics consent, `public/sequence/*`, `ScrollSequenceHero`, `RENDER_SETTINGS` and `.ops-bg*` were not changed.

## Changed Files

- `src/content/cases.ts`
- `src/app/(public)/work/page.tsx`
- `src/app/(public)/cases/[slug]/page.tsx`
- `src/components/public/system-passport-showreel.tsx`
- `src/app/globals.css`
- `src/lib/seo.ts`
- `README.md`
- `README_HANDOFF.md`
- `PROJECT_MAP.md`
- `docs/reports/case-client-titles-cta-filter-fix-20260709-1008.md`

## Checks

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.

Build summary:

- Next.js compiled successfully.
- TypeScript finished successfully.
- Static generation completed for 55 pages.
- `/cases/[slug]` remained SSG with `generateStaticParams`; build listed `/cases/ai-organic-flow`, `/cases/crm-imagine`, `/cases/ai-wiki-b2b` and 19 more paths.

## Dev Server / Route Check

Attempted to start one local dev server for public route smoke checks. It did not start because Windows `Start-Process` failed twice with:

```text
Элемент уже добавлен. Ключ в словаре: "Path"  Добавляемый ключ: 'PATH'
```

No server process was created, and port 3000 remained without a listener after the attempts. Browser visual QA was therefore not completed in this run.

## Backup

Created after changes and checks:

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-after-case-client-titles-cta-filter-fix-20260709-1008.zip`

Archive verification:

- Size is greater than 0 bytes.
- Checked archive entries for forbidden files and folders.
- No forbidden entries found.

## Manual QA

- Open `/work` and confirm card titles are Russian client-facing titles, not primary internal project names.
- Confirm secondary project names, where shown, are small and read as `Проект: ...`.
- Confirm every `Открыть кейс` CTA stays on one line on desktop and mobile.
- Open `/work?type=ecommerce-ai#work-results` and confirm the active filter works, selected label is readable violet on light theme, and the heading is not duplicated.
- Open `/work?type=ai-agents#work-results` and confirm filtered case titles are Russian.
- Open `/` and confirm homepage proof/showreel case titles are client-facing Russian names and links still open cases.
- Open `/cases/ai-organic-flow` and confirm the detail H1 is Russian, the project name is secondary, and the slug is unchanged.
