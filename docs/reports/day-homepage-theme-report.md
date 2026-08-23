# Day Homepage Theme Report

Date/time: 2026-07-09 01:34 +05:00

## Summary

Implemented a light/day theme for the homepage `/` without changing backend, forms, leads, admin, API, Prisma, legal pages, consent logic, hero copy, CTA copy, or main homepage structure.

## Backup

- Backup path: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-before-day-homepage-theme-20260709-0124.zip`
- Backup size: 54.64 MiB
- Exclusions used: `node_modules`, `.next`, `dist`, `coverage`, `.env`, `.env.*`, `*.pem`, filenames containing `token`, `secret`, `key`, and `site/backups`.

## Read-Only Agent Findings

1. Day Video Asset Auditor
   - Source exists: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\assets\media\светлая.mp4`
   - Video: H.264, `2528x1440`, 60 fps, stream duration `10.016667s`, container duration `10.030998s`, 601 frames.
   - Recommended limiting output frames because 30 fps would create about 301 frames.

2. Hero Sequence Integration Auditor
   - `scroll-sequence-hero.tsx` was hardcoded to `/sequence/hero-night-hq/`.
   - Existing theme mechanism is `<html data-theme>` controlled by `ThemeToggle`.
   - Recommended a day/night sequence config and reloading canvas frames when theme changes.

3. Light Theme Visual Auditor
   - Homepage light mode still inherited many hardcoded dark styles.
   - Recommended scoped light overrides for hero, header, post-hero sections, cards, ops background, CTA and FAQ.

4. Risk Auditor
   - Safe change scope: `scroll-sequence-hero.tsx`, homepage styles, generated day sequence, homepage wrapper/config, project docs/report.
   - Confirmed forms/leads/admin/API/Prisma/legal pages do not need changes.
   - Main risks: React hook dependencies, asset frame count mismatch, CSS leaking beyond `/`.

## Source Video

- Source path: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\assets\media\светлая.mp4`
- Resolution: `2528x1440`
- Duration: `10.030998s` container, `10.016667s` video stream
- FPS: 60
- Frames: 601
- Source size: 75,484,414 bytes

## Day Sequence

- Target folder: `site/public/sequence/hero-day-hq/`
- Public URL pattern: `/sequence/hero-day-hq/frame_000.webp`
- Files: `frame_000.webp` through `frame_149.webp`
- WebP frame count: 150
- Dimensions: `1896x1080`
- Total folder size: 22,298,254 bytes / 21.27 MiB
- WebP quality: 90

Command used:

```powershell
ffmpeg -y -i "assets\media\светлая.mp4" -vf "fps=15,scale=-2:1080:flags=lanczos" -c:v libwebp -quality 90 -compression_level 6 -start_number 0 "site\public\sequence\hero-day-hq\frame_%03d.webp"
```

Reasoning: the source is about 10 seconds at 60 fps. `fps=15` keeps the output near the requested 120-160 frame range while preserving 1080 height and matching the night HQ dimensions.

## Implementation

Changed files:

- `site/src/components/public/scroll-sequence-hero.tsx`
- `site/src/app/page.tsx`
- `site/src/components/header.tsx`
- `site/src/app/globals.css`
- `site/PROJECT_MAP.md`

Created files/directories:

- `site/public/sequence/hero-day-hq/`
- `site/docs/reports/day-homepage-theme-report.md`
- `site/docs/reports/day-homepage-theme-screenshots/home-dark-desktop.png`
- `site/docs/reports/day-homepage-theme-screenshots/home-light-desktop.png`
- `site/docs/reports/day-homepage-theme-screenshots/home-dark-mobile.png`
- `site/docs/reports/day-homepage-theme-screenshots/home-light-mobile.png`
- `site/docs/reports/day-homepage-theme-dev.out.log`
- `site/docs/reports/day-homepage-theme-dev.err.log`

Day sequence connection:

- `ScrollSequenceHero` now has dark and light sequence configs.
- `/` passes `sequenceMode="theme"`, so the hero follows existing `<html data-theme>`.
- `/sequence-lab/hero-night` does not pass the prop and remains night-only by default.
- Theme changes are read with `useSyncExternalStore` plus a `MutationObserver` for `data-theme`.
- Reduced-motion/static playback still uses the active sequence's first frame.

Light theme changes:

- Added `.home-page` wrapper to scope homepage-only light overrides.
- Added light hero styles through `.scroll-sequence-hero[data-sequence-theme="light"]`.
- Added `lab-header--home-sequence` and `lab-header--night-sequence` to keep `/` light-capable without changing the night lab route.
- Added warm ivory/parchment background, graphite text, light surfaces, violet CTA/accent states, and quieter `.ops-bg` variables.
- Left existing homepage structure and text intact.

## PROJECT_MAP

Updated `site/PROJECT_MAP.md` with:

- `hero-day-hq` as the active light/day homepage sequence.
- Path `/sequence/hero-day-hq/frame_000.webp`.
- Frame count, dimensions, source video and quality.
- Confirmation that dark hero sequence remains `hero-night-hq`.
- Code location for day/night sequence selection.
- Scoped light theme overrides.
- Confirmation that forms/leads/admin/API/Prisma/legal were not touched.

## Checks

- `ffmpeg -version`: passed, `8.1-full_build-www.gyan.dev`.
- `ffprobe -version`: passed, `8.1-full_build-www.gyan.dev`.
- Asset verification: passed, 150 frames, first `frame_000.webp`, last `frame_149.webp`, both `1896x1080`.
- `npm.cmd run lint`: first run failed on `react-hooks/set-state-in-effect` in `scroll-sequence-hero.tsx`; fixed by using `useSyncExternalStore`. Final run passed.
- `npm.cmd run build`: passed.
- `npm.cmd run typecheck`: script absent from `package.json`.
- `npm.cmd run test`: script absent from `package.json`.

Build result:

```text
✓ Compiled successfully
✓ Generating static pages using 23 workers (55/55)
```

## Browser QA

Allowed route: `/` only.

Screenshots saved:

- `site/docs/reports/day-homepage-theme-screenshots/home-dark-desktop.png`
- `site/docs/reports/day-homepage-theme-screenshots/home-light-desktop.png`
- `site/docs/reports/day-homepage-theme-screenshots/home-dark-mobile.png`
- `site/docs/reports/day-homepage-theme-screenshots/home-light-mobile.png`

Playwright DOM checks:

- dark desktop: `data-theme="dark"`, `data-sequence-theme="dark"`, no horizontal overflow.
- light desktop: `data-theme="light"`, `data-sequence-theme="light"`, no horizontal overflow.
- dark mobile: `data-theme="dark"`, `data-sequence-theme="dark"`, no horizontal overflow.
- light mobile: `data-theme="light"`, `data-sequence-theme="light"`, no horizontal overflow.

Dev server note:

- A Next dev server for this `site` was already running on `http://localhost:3000` with PID `75236`.
- I did not stop PID `75236` because it was not started by this task.
- Attempts to start another server exited after reporting the existing server; logs were saved in `day-homepage-theme-dev.out.log` and `day-homepage-theme-dev.err.log`.

## TODO / Manual QA

- Review `/` in the browser with the real cookie-consent state the owner wants to test, because the cookie banner covers part of the first viewport in screenshots.
- Review the homepage below the first viewport in light mode for subjective visual polish after the owner accepts the direction.
- Consider a cache/versioning strategy for `/public/sequence/*` before production because frame names are not content-hashed.
