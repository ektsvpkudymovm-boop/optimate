# Light Not Demo Fix Report

Date: 2026-07-09

## Scope

Focused light-theme readability fix for the homepage `НЕ ДЕМО / ПАНЕЛЬ КОНТРОЛЯ СИСТЕМЫ` production telemetry section.

## Backup

- `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-before-light-not-demo-fix-20260709-0220.zip`

## Changed Files

- `src/app/globals.css`
- `PROJECT_MAP.md`
- `docs/reports/light-not-demo-fix-report.md`

## What Changed

- Added scoped `[data-theme="light"] .home-page` overrides for the production telemetry board.
- Improved light-mode contrast for telemetry cards, headings, statuses, task flow labels, retry labels, human-review flow, audit journal rows, SVG charts, pulses, donut and marquee.
- Added light-only animation keyframes so animated labels do not revert to dark-theme white text during playback.
- Updated `PROJECT_MAP.md` with the focused light pass location and constraints.

## Intentionally Preserved

- Dark theme styles and keyframes remain unchanged.
- First hero and day/night sequence assets remain unchanged.
- Header, footer, forms/leads, admin/auth/API/Prisma/legal pages remain untouched.
- Public text in the block was not edited.

## Browser QA

- Route: `/`
- Theme: light
- Screenshot: `docs/reports/light-not-demo-fix-screenshots/not-demo-light.png`
- Status: passed. The production telemetry cards, status pills, flow labels, retry widget and audit rows are readable in light theme.

## Checks

- `npm.cmd run lint`: passed
- `npm.cmd run build`: passed

## TODO

- None at implementation stage.

## Manual QA

- Review the `НЕ ДЕМО` block on desktop in light theme.
- Check mobile light theme for the same section if the owner wants a second viewport pass.
- Quickly toggle to dark theme and confirm the production telemetry board keeps the previous dark visual style.
