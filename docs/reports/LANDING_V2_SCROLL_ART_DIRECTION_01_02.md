# Landing V2 — Scroll Art Direction 01–02

## Scope

- Route: `/landing-v2` only.
- Changed: Hero, Hidden Cost and the technical reveal into the existing Block 03.
- Preserved: legacy `/`, admin, APIs, Prisma, Blocks 04–12, Mini Audit logic and all existing System Demo views.

## Backup

- `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-landing-v2-scroll-01-02-20260823-2251.zip`

The worktree already contained user-owned untracked files, so no experimental Git branch was created.

## Art direction and motion

| Scene | User understanding | Implementation |
|---|---|---|
| Hero | OptiMate connects a real working business with an operating system. | One GSAP/ScrollTrigger pinned stage on desktop. Copy yields slightly upward while the material business environment and real HTML System Demo become the primary object. |
| Hidden Cost | Losses are a set of familiar, repeated manual operations. | A single entrance reveal introduces the six rows; the selected row receives a calm oxide marker. The inspector remains a functional manual control. |
| 02 → 03 | The page moves from separate losses to one shared business context. | On desktop, the unchanged Block 03 surface is revealed from right to left as vertical scroll continues. |

The recurring `OXIDE SIGNAL` is the small 5px oxide rail in Hero and the active row marker in the loss register.

## Assets

- Reused `public/landing-v2/assets/hero/hero-operational-desk.png`.
- The existing image was suitable for the new composition and no new raster asset was generated.
- The System Demo remains real, interactive HTML; no product UI was rasterized.

## Dependencies

- Added `gsap@^3.15.0` for the desktop scroll timelines.

## Responsive and accessibility strategy

- Desktop `>=769px`: Hero uses one pinned master timeline; Block 03 has one scrubbed directional reveal.
- Mobile/tablet `<=768px`: Hero is natural document flow; Hidden Cost keeps its accordion process view; no forced horizontal movement is used.
- `prefers-reduced-motion: reduce`: GSAP choreography is not created, Hero/Hidden Cost return to clean normal flow and Block 03 has no directional clip/translate.
- No horizontal page overflow was found at 1440, 1280, 1024, 768, 390 or 360 viewport widths.

## Files changed

| File | Purpose |
|---|---|
| `src/components/landing-v2/hero-section.tsx` | Hero stage, material composition and cleaned-up GSAP lifecycle. |
| `src/components/landing-v2/hidden-cost-section.tsx` | Row entrance reveal and principle emphasis. |
| `src/components/landing-v2/loss-row.tsx` | Active oxide signal element. |
| `src/components/landing-v2/company-context-section.tsx` | Technical 02 → 03 reveal and hydration-safe reduced-motion state. |
| `src/app/landing-v2/landing-v2.module.css` | Scoped scene styling, responsive fallbacks and warm graphite surface. |
| `package.json`, `package-lock.json` | GSAP dependency. |

## Browser QA

| Check | Result |
|---|---|
| 1440, 1280, 1024 desktop | Hero pin, handoff, no horizontal overflow — passed. |
| 768 tablet | Natural vertical Hero fallback, no overflow — passed. |
| 390, 360 mobile | Natural vertical layout and loss accordion — passed. |
| System Demo manual controls | Preserved; no implementation changes inside the demo. |
| Hidden Cost manual selection | `Продажи` scenario selected successfully on desktop and mobile. |
| Back/forward route navigation | Exercised for `/landing-v2`; no stale layout/overflow observed. |
| Reduced motion | Emulated: Hero became normal flow, Block 03 transform was `none`. |
| Console | Fresh post-fix page load: no error-level messages. |

Screenshots:

- `docs/reports/landing-v2-scroll-art-direction-01-02/hero-entry-1440.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/hero-mid-1440.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/hero-final-1440.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/hidden-cost-1440.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/transition-02-03-1440.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/context-final-1440.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/mobile-390.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/mobile-hidden-cost-390.png`

No screen recording was made: the approved in-app browser tooling exposed screenshot control but not recording.

## Checks

| Command | Result |
|---|---|
| `npm.cmd run lint` | Passed. |
| `npm.cmd run build` | Passed; TypeScript and all 56 static pages completed. |

## Known notes

- `npm install` reports 14 transitive audit findings (4 moderate, 10 high). No automatic audit fix was applied because it is outside this scoped visual change.
- The retained hero PNG is about 1.8 MB. A WebP/AVIF derivative remains an optional future performance pass; the source asset was deliberately not replaced during this experiment.
