# IA navigation simplification — 2026-07-09 08:46 +05:00

## Цель

Упростить клиентский путь OptiMate перед сдачей: главная -> релевантные кейсы -> конкретный кейс -> заявка.

Публичная логика после изменения:

- `/work` — единственная видимая витрина кейсов/систем.
- `/cases/[slug]` — детальные страницы кейсов, URL сохранены.
- `/cases`, `/solutions`, `/capabilities` — legacy-входы с редиректом на `/work`.

## Почему убраны `/capabilities`, `/solutions`, `/cases` listing

Эти страницы дублировали пользовательский выбор и размывали путь. Теперь посетитель с главной сразу попадает в витрину систем `/work`, может отфильтровать класс системы через `?type=...`, открыть конкретный кейс `/cases/[slug]` и перейти к заявке `/contacts`.

## Изменённые файлы

- `src/components/header.tsx`
- `src/components/footer.tsx`
- `src/app/page.tsx`
- `src/app/(public)/cases/page.tsx`
- `src/app/(public)/solutions/page.tsx`
- `src/app/(public)/capabilities/page.tsx`
- `src/app/not-found.tsx`
- `src/lib/seo.ts`
- `README.md`
- `README_HANDOFF.md`
- `PROJECT_MAP.md`
- `docs/reports/ia-navigation-simplification-20260709-0846.md`

## Header / footer

Header:

- `Кейсы` -> `/work`
- `Подход` -> `/approach`
- CTA `Разобрать процесс` -> `/contacts`

Footer, раздел `Разделы`:

- `Кейсы` -> `/work`
- `Подход` -> `/approach`
- `Контакты` -> `/contacts`
- `О нас` -> `/about`

Legal links, email and Telegram links were not changed.

## Homepage links

Карточки блока `Классы систем` ведут в:

```text
/work?type={capability.id}
```

Visible action text inside the cards is now `Смотреть кейсы`.

## Redirects

Page-level redirects were added:

- `/cases` -> `/work`
- `/solutions` -> `/work`
- `/capabilities` -> `/work`

The `/cases/[slug]` route was not moved or redirected.

## Visual safety

Homepage visual logic was not changed. These areas were intentionally not touched:

- `src/app/globals.css`
- `public/sequence/*`
- ScrollSequenceHero canvas/render/settings logic
- `.home-page`
- `.ops-bg*`
- `ProductionTelemetryBoard`
- `OperationsProcessRail`
- `SystemPassportShowreel` visual classes

## Checks

- `npm.cmd run lint` — passed.
- `npm.cmd run build` — passed.

Build output summary:

- Next.js compiled successfully.
- TypeScript step completed.
- Static generation completed for 55 pages.
- `/cases/[slug]` still generated with `/cases/ai-organic-flow` and 22 additional paths.

No `typecheck` or `test` scripts were run because they are absent from `package.json`.

## Backup

Backup created after successful checks:

```text
C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-after-ia-navigation-simplification-20260709-0846.zip
```

Verification:

- Exists: yes.
- Size: greater than `0` bytes.
- Entry count: `836` at verification.
- Forbidden entry count: `0`.
- Includes this report: yes.

The first backup attempt failed because Windows PowerShell in this environment did not support `[System.IO.Path]::GetRelativePath`. The backup was rerun with a Windows PowerShell 5-compatible path calculation and completed successfully.

## Manual QA

Check these URLs manually without admin credentials:

- `/` — dark/light, hero, system class cards, CTA.
- `/work` — case showcase, filters, cards.
- `/work?type=ai-agents` — filtered list.
- `/cases/ai-organic-flow` — detailed case and `Все кейсы` backlink to `/work`.
- `/contacts` — visual check of the form.
- `/approach` — approach page.
- `/cases` — redirects to `/work`.
- `/solutions` — redirects to `/work`.
- `/capabilities` — redirects to `/work`.
