# Landing V2 — Mobile storytelling and architecture cleanup

## Scope

- Route: `/landing-v2`; Blocks 01–08 only.
- Block 09 Cases, Mini Audit, FAQ, final CTA, admin and backend were preserved.

## Desktop Block 07

- Removed the standalone `architectureSection::after` vertical and its mobile override.
- Removed the non-semantic perspective coordinate field.
- Shortened the AI → Action oxide connector to `left: 66%; width: 2.6%`; it ends before Action content.
- Delayed architecture-world entry until after the intro headline clears its field.
- Action copy remains fully sharp: no blur, backdrop filter, or opacity concealment was introduced.

## Mobile storytelling

| Block | One-shot motion idea |
|---|---|
| 01 | Copy → environment → landscape monitor |
| 02 | Header → staggered loss rows |
| 03 | Fragments progress through the source rail into unified context |
| 04 | Question → visible sources → oxide convergence → answer → next action |
| 05 | Quote recedes into extracted focus rows → action rail |
| 06 | Phrases → oxide convergence marker → repeated signal |
| 07 | Sources → growing signal/progress line → active data, AI, action, analytics → feedback payoff |
| 08 | Deliberately calm statement, progressive line and sequential steps |

Motion is enabled only under `prefers-reduced-motion: no-preference`; reduced motion retains readable static content.

## QA artifacts

- `docs/reports/landing-v2-mobile-storytelling-and-architecture-cleanup-screenshots/`
- Mobile real-scroll check: 390×844, `scrollWidth === innerWidth` (390).
- Browser console contained environment-originated Google Fonts CSP and Next dev HMR websocket messages; no new application error was identified.

## Checks

- `npm.cmd run lint` — passed.
- `npm.cmd run build` — passed.

## Backup

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-mobile-storytelling-and-architecture-cleanup-20260824-2345.zip`
