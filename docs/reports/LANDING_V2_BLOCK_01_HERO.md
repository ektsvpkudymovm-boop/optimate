# Landing V2 — Block 01 / Hero

## CREATED
- `src/app/landing-v2/page.tsx`
- `src/app/landing-v2/landing-v2.module.css`
- `src/components/landing-v2/landing-v2-header.tsx`
- `src/components/landing-v2/hero-section.tsx`
- `src/components/landing-v2/optimate-system-demo.tsx`
- `src/components/landing-v2/system-demo-data.ts`
- `src/components/public-chrome.tsx`
- `docs/references/system-ui/optimate-business-system-prototype.html`
- `src/components/landing-v2/hidden-cost-section.tsx`
- `src/components/landing-v2/hidden-cost-header.tsx`
- `src/components/landing-v2/hidden-cost-data.ts`
- `src/components/landing-v2/loss-register.tsx`
- `src/components/landing-v2/loss-row.tsx`
- `src/components/landing-v2/loss-process.tsx`

## MODIFIED
- `src/app/layout.tsx` — chrome selection only: legacy chrome is retained for every existing route and omitted for the isolated `/landing-v2` workbench.
- `site/src/app/landing-v2/page.tsx` — подключён новый Block 02 после Hero.
- `site/src/app/landing-v2/landing-v2.module.css` — добавлены стили для 12-col Grid, списка, mobile-аккордеона и процесс-панели.

## ROUTE
- `/landing-v2` — Hero Block 01 + Block 02.

## BLOCK 02 / HIDDEN COST

### DATA-FIRST IMPLEMENTATION
- New data file: `src/components/landing-v2/hidden-cost-data.ts`.
- Components:
  - `src/components/landing-v2/hidden-cost-section.tsx` (`HiddenCostSection`)
  - `src/components/landing-v2/hidden-cost-header.tsx` (`HiddenCostHeader`)
  - `src/components/landing-v2/loss-register.tsx` (`LossRegister`)
  - `src/components/landing-v2/loss-row.tsx` (`LossRow`)
  - `src/components/landing-v2/loss-process.tsx` (`LossProcess`)

### CONTENT AND COMPOSITION
- Block begins immediately after Hero in `/landing-v2`.
- Uses existing landing warm palette:
  - section background: `v2-subtle`
  - audit surface: `v2-surface`
- Editorial area (kicker, H2, intro) then one large surface split into 7-column register + 5-column process area.
- No six feature cards are used.

### INTERACTION
- 6 rows in register: `Информация`, `Руководители`, `Продажи`, `CRM`, `Обучение`, `Маркетинг`.
- First row is selected by default (`Информация`).
- Desktop: selecting a row updates the right process panel with `200–300ms` detail transition.
- Mobile (`<= 768px`): rows become accordion-style; only one row is opened at a time.
- Sequence data is fully data-driven from `hidden-cost-data.ts`; no repeated hardcode in layout.

### MOTION
- No autoplay.
- Hover and selected transitions only.
- `prefers-reduced-motion: reduce` removes transition animation and returns static layout.

### QA CHECKS REQUESTED
- Проверять: `1440`, `1024`, `768`, `390`.
- Проверять:
  - что Block 01 визуально не изменился,
  - spacing начала блока корректный,
  - selection и mobile-аккордеон работают,
  - не возникает horizontal overflow,
  - текст не мельче локальной дизайн-системной typographic шкалы,
  - console без новых ошибок.

## ROUTE UPDATED
- `/landing-v2` — Hero Block 01 + Block 02 (Hidden Cost).

## HERO STRUCTURE
- `LandingV2Page` → `LandingV2Header` + `HeroSection`.
- The approved eyebrow, headline, lead and two local CTA stubs remain HTML.
- The H1 uses normal wrapping, no forced word breaking or hyphenation.

## SYSTEM DEMO
- `OptiMateSystemDemo` is code-only, interactive and reusable.
- Implemented views: Overview, Communications, Knowledge, Sales, Processes and Analytics.
- Overview includes the selected event and inspector with what happened, what the system understood, actions and next step.
- Deterministic mock data lives in `system-demo-data.ts`.

## GUIDED DEMO
`Overview (2800ms) → Communications (2800ms) → Knowledge (3200ms) → Processes (2800ms) → Analytics (2800ms) → Overview (4000ms)`.

The controller has one timeout chain. It runs only when the demo is at least 45% visible. `prefers-reduced-motion` prevents autoplay and preserves the static Overview state.

## USER INTERACTION
- Clicking any navigation item immediately sets manual mode and stops autoplay for this page visit.
- Navigation changes the actual workspace content.

## MOBILE
- Copy comes before the demo.
- The desktop sidebar becomes an accessible horizontal tab rail.
- The inspector becomes a stacked panel and secondary content is reduced; no `transform: scale()` is used.

## MOBILE CORRECTION PASS

### Overflow cause and resolution
- **Root cause:** at narrow widths the H1 word `автоматизировать` retained its 42px mobile size and expanded `.copy` beyond its container. At 320px, `document.scrollWidth` was 362px against a 320px viewport. This was not caused by the System Demo.
- **Resolution:** the H1 now uses deliberate mobile type steps: 42px through 390px, 38px through 374px and 34px through 340px. No `word-break`, scale, zoom or page-level overflow masking was introduced.
- The System Demo, workspace and every mobile grid child now have explicit `width/max-width/min-width` constraints. The tab rail is the sole horizontal scroller, with its scrollbar hidden and 44px touch targets.

### Mobile presentation changes
- Desktop sidebar content is absent; `Обзор / Звонки / Знания / Продажи / Процессы / Аналитика` remains as a self-contained tab rail.
- Overview is a one-column flow: up to three events, followed by the selected event inspector in normal document flow.
- Communications, Knowledge, Sales and Analytics collapse to a single readable sequence. Processes changes from a horizontal workflow to a vertical flow.
- Normal UI text is now 13–16px; compact mono labels are limited to genuine metadata.

### CTA correction
- The primary action now uses `background: var(--color-accent-action)` and `color: var(--color-text-inverse)` in default, hover, active and focus-visible states. Computed default colour: `rgb(243, 240, 233)`.
- The arrow inherits the same `currentColor`.

### QA results
| Viewport | document scrollWidth / viewport | Result |
|---:|---:|---|
| 390px | 382 / 390 | Pass |
| 375px | 367 / 375 | Pass |
| 360px | 352 / 360 | Pass |
| 320px | 312 / 320 | Pass |
| 1440px | 1432 / 1440 | Pass; desktop demo remained intact |

- Guided demo was observed in its deterministic sequence before manual interaction.
- Tapping `Обзор`, then `Знания` changed real workspace content and stopped autoplay.
- With `prefers-reduced-motion: reduce`, the demo remained on `Обзор` after 3.5 seconds.
- Browser console: 0 errors and 0 warnings.
- Saved QA artifacts: [390px overview](landing-v2-block-01/mobile-390-overview.png) and [360px knowledge](landing-v2-block-01/mobile-360-knowledge.png).
- Legacy homepage and admin were not changed.

## DESIGN SYSTEM
Design System changes: none.

The active `site/` worktree does not include the Design System source files referenced by the brief. The approved v1.0 files in the adjacent worktree were inspected; their existing warm/graphite/oxide/olive values are used only in route-scoped styles.

## ADMIN
Admin integration was not performed.

## LEGACY
Legacy homepage was not modified. The legacy page module and legacy header/footer modules were not edited. `layout.tsx` now delegates to `PublicChrome`, which preserves the exact existing composition for all routes except `/landing-v2`.

## TESTS
| Command | Result |
|---|---|
| `npm.cmd run lint` | Not run (not requested in this pass). |
| `npm.cmd run build` | Not run (not requested in this pass). |
| Typecheck script | Not present in `package.json`. |

Known existing build checks were documented in the initial Block 01 report.

New errors from this task: not run checks in this pass.

## BROWSER QA
- Not executed in this task pass.

Planned checks (per request): `1440`, `1024`, `768`, `390`.

## BACKUP
`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-landing-v2-block-02-20260820-0841.zip`

## DEVIATIONS
- No asset production was required: the approved product proof is a code UI rather than a screenshot/video.
