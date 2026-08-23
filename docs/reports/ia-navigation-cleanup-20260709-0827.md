# IA Navigation Cleanup

Date: 2026-07-09 08:27 +05:00

## Goal

Simplify the visible client path on the OptiMate public site without redesigning the homepage or changing the homepage visual system.

Target path:

```text
Главная -> Что делаем / Кейсы -> /work -> /cases/[slug] -> /contacts
```

## Changed Files

- `src/components/header.tsx`
- `src/components/footer.tsx`
- `src/app/page.tsx`
- `src/components/public/scroll-sequence-hero.tsx`
- `src/app/(public)/work/page.tsx`
- `src/app/(public)/cases/[slug]/page.tsx`
- `src/app/(public)/capabilities/page.tsx`
- `src/lib/seo.ts`
- `README.md`
- `README_HANDOFF.md`
- `PROJECT_MAP.md`
- `docs/reports/ia-navigation-cleanup-20260709-0827.md`

## Header / Footer

Header now shows:

- `Что делаем` -> `/capabilities`
- `Кейсы` -> `/work`
- `Подход` -> `/approach`
- CTA `Разобрать процесс` -> `/contacts`

Footer "Разделы" now shows:

- `Что делаем` -> `/capabilities`
- `Кейсы` -> `/work`
- `Подход` -> `/approach`
- `Контакты` -> `/contacts`
- `О нас` -> `/about`

Footer legal links remain unchanged:

- `/privacy`
- `/consent`
- `/cookies`
- `/terms`

Email and Telegram links remain unchanged.

## Homepage Links

Homepage "Классы систем" cards now point directly to the relevant work filter:

```text
/work?type={capability.id}
```

The JSX structure, class names, section order, `.home-page` wrapper and `.ops-bg*` classes were not changed.

## Routes Preserved

- `/cases` remains present as a hidden/legacy listing.
- `/solutions` remains present as a hidden/legacy route.
- `/cases/[slug]` remains the detailed case route.
- No redirects were added in `next.config.ts`, proxy or middleware.

## Visual Safety

The homepage visual logic was not changed:

- no CSS edits;
- no `public/sequence/**` edits;
- no ScrollSequenceHero sequence config, `RENDER_SETTINGS`, canvas, observer or theme-switching logic edits;
- no `.ops-bg` background system edits;
- no `ProductionTelemetryBoard`, `OperationsProcessRail` or `SystemPassportShowreel` logic edits.

Only the ScrollSequenceHero secondary CTA visible label changed from `Смотреть системы` to `Смотреть кейсы`; its href remains `/work`.

## Checks

```text
npm.cmd run lint
```

Result: passed.

```text
npm.cmd run build
```

Result: passed. Build generated 55 app routes, including `/solutions`, `/cases`, `/cases/[slug]`, `/work`, `/capabilities`, `/contacts` and legal routes.

## Backup

Backup path:

```text
C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-after-ia-navigation-cleanup-20260709-0827.zip
```

Backup verification:

- File existence: verified.
- Size greater than 0: verified, `108950804` bytes.
- Archive entries: `841`.
- Forbidden files/paths excluded: verified, `0` forbidden entries found.

Backup creation note:

- First attempt failed because the PowerShell session had not loaded `System.IO.Compression`.
- Second attempt failed because this PowerShell/.NET runtime does not expose `[System.IO.Path]::GetRelativePath`.
- Final backup command used a runtime-compatible relative path calculation and completed successfully.

## Manual QA For Owner

- `/` - check dark/light, hero, system class cards and CTAs.
- `/work` - check filters and cards.
- `/work?type=ai-agents` - check filtered list.
- `/capabilities` - check new text and `Смотреть работы этого типа` links.
- `/cases/ai-organic-flow` - check backlink `Все кейсы` -> `/work`.
- `/contacts` - check form visually, do not submit unless needed.
- `/solutions` - should still work, but be hidden from navigation.
- `/cases` - should still work, but be hidden from navigation.

## Not Touched

- `src/app/globals.css`
- `public/sequence/**`
- admin routes
- API routes
- auth/session/security logic
- Prisma schema and seed
- public lead submit logic
- cookie consent and analytics consent
- legal page content
- `src/content/cases.ts`
- `src/content/solutions.ts`
