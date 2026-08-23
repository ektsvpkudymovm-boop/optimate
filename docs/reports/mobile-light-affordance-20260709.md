# Mobile Light Affordance Fix

Date: 2026-07-09

## Summary

Implemented a targeted mobile light-theme affordance pass for homepage clickable items:

- `Классы систем` cards now have explicit warm tap-card surfaces, borders, focus states, touch feedback and a `Подробнее` indicator.
- `Кейсы как паспорта рабочих систем` mobile case buttons now read as tap-cards with active/pinned state, violet glow, lift and an `Открыть` indicator.

Desktop layout, dark theme, hero, forms, admin, API, Prisma and legal pages were not intentionally changed.

## Backup

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-before-mobile-light-affordance-20260709-0233.zip`

## Changed Files

- `src/app/page.tsx`
- `src/components/public/system-passport-showreel.tsx`
- `src/app/globals.css`
- `PROJECT_MAP.md`
- `docs/reports/mobile-light-affordance-20260709.md`

## Routes

Changed/affected:

- `/`

Intentionally preserved:

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
- admin/API routes

## Checks

- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.

## Notes

- Browser visual QA was not run because the task instructions did not explicitly grant browser automation for this pass.
- Manual QA recommended on mobile light and dark themes for `/`, checking tap states, focus states and absence of horizontal scroll.
