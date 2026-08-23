# Sequence Hero Tuning Report

Date/time: 2026-07-08 17:17:40 +05:00

## Summary
- Tuned the existing WebP sequence hero for `/` and `/sequence-lab/hero-night`.
- Removed the stray `OM` from the public header.
- Enlarged hero typography, lead, CTA and scroll beats.
- Reduced scroll-linked sequence duration from `320vh`/`240vh` to `210vh`/`190vh`.
- Changed canvas fit to custom contain with right anchoring so the brain remains large and the right edge is not cropped.
- Left day theme as dark sequence surface for now.

## Backup
- `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-sequence-hero-tuning-20260708-1642.zip`

## Agents Used
- Agent 1 - Hero Composition Auditor: found small typography, `320vh` slow scrub, old `OM` mark, visual crop from scale/right offset, and weak lower beat placement.
- Agent 2 - Sequence Fit Auditor: confirmed 263 frames at `1264 x 720`; content touches the right edge, so desktop fit should crop only left padding and keep the right side visible.

## Changed Files
- `site/src/components/header.tsx`
- `site/src/components/public/scroll-sequence-hero.tsx`
- `site/src/app/globals.css`

## Created Files
- `.design-work/00-inputs.md`
- `.design-work/01-layout-decomposition.md`
- `.design-work/02-asset-manifest.md`
- `.design-work/03-design-system.md`
- `.design-work/04-asset-production-workflow.md`
- `.design-work/05-implementation-report.md`
- `.design-work/06-responsive-report.md`
- `.design-work/07-visual-review.md`
- `site/docs/reports/sequence-hero-tuning-report.md`
- `site/docs/reports/sequence-hero-tuning-browser-qa.json`
- `site/docs/reports/sequence-hero-qa-dev-server.log`

## Header
- Removed `<span className="lab-brand__mark">OM</span>`.
- Kept `OptiMate` wordmark and `AI Product Lab` sublabel.
- Slightly refined wordmark scale/weight.

## Typography
- H1 changed to a larger thin display scale.
- Lead text increased and brightened.
- Hero CTA increased in height, padding and font size.
- Negative letter spacing was not used because project UI rules require zero letter spacing.

## Canvas Fit
- Desktop uses custom contain with `desktopScale: 1.1`, right inset and slight upward offset.
- Tablet/mobile use contain behavior at the same breakpoint as CSS stacking: `900px`.
- No prepared frames were converted or replaced.

## Scroll Speed
- Desktop sequence section height reduced to `210vh`.
- Mobile sequence section height reduced to `190vh`.
- Browser QA shows canvas initialized and frames loaded to `100%` via `http://localhost:3000`.

## Beats
- Beat copy preserved from the task.
- Beat text enlarged to desktop `clamp(2rem, 2.55vw, 3rem)`.
- Beat placement raised to avoid sitting too low in the viewport.

## Not Touched
- Admin routes.
- Auth/session/login logic.
- API routes.
- Prisma schema and migrations.
- Legal pages.
- Forms, lead behavior and cookie consent.
- `/work`, `/capabilities`, `/cases` content models.

## Routes
- Changed/verified: `/`, `/sequence-lab/hero-night`.
- Preserved: `/work`, `/capabilities`, `/cases`, legal pages and admin routes.

## Assets Used
- Existing WebP sequence: `site/public/sequence/hero-night/frame_000.webp` through `frame_262.webp`.

## Screenshots
- `site/docs/reports/sequence-hero-tuning-screenshots/home-desktop-start.png`
- `site/docs/reports/sequence-hero-tuning-screenshots/home-desktop-mid.png`
- `site/docs/reports/sequence-hero-tuning-screenshots/home-desktop-end.png`
- `site/docs/reports/sequence-hero-tuning-screenshots/home-mobile-start.png`
- `site/docs/reports/sequence-hero-tuning-screenshots/home-mobile-mid.png`
- `site/docs/reports/sequence-hero-tuning-screenshots/sequence-lab-desktop-start.png`
- `site/docs/reports/sequence-hero-tuning-screenshots/sequence-lab-desktop-mid.png`

## Checks
| Command | Result |
|---|---|
| `npm.cmd run lint` | Passed |
| `npm.cmd run build` | Passed |
| `npm.cmd run typecheck` | Script absent |
| `npm.cmd run test` | Script absent |

## Browser QA
- Final QA used `http://localhost:3000`, not `http://127.0.0.1:3000`, because Next 16 dev server blocks dev resources from `127.0.0.1` as a cross-origin origin.
- Canvas initialized: desktop `628 x 736`, mobile `362 x 320`.
- Frames loaded to `100%`.
- Horizontal overflow: false at `1440 x 900` and `390 x 844`.
- Dev server was stopped after screenshots.

## Failed / Non-Required Checks
- A production preview attempt with `npm.cmd run start` returned HTTP 500 in this local environment after `next build`. Required `build` passed, and final browser QA was performed with the allowed dev server.

## TODO
- Для дневной темы нужна отдельная light sequence и отдельная palette под новый светлый visual asset.
- Manual QA after cookie consent is set, because the cookie banner covers the lower hero area in first-visit screenshots.

## Manual QA
- Open `/` at desktop width and verify CTA/beat placement after consent state is set.
- Scroll through the first hero once and confirm the sequence feels responsive.
- Open `/` at mobile width and verify text, CTA and visual stack without horizontal scroll.
- Open `/sequence-lab/hero-night` and confirm the isolated sequence matches the homepage hero.

