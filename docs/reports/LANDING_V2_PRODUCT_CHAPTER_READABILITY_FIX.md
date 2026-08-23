# Landing V2 — Product Chapter Readability Fix

## Actual local architecture found

- Branch: `landing-v2-design`, local feature commit present and preserved; no checkout, reset or remote restore was used.
- `/landing-v2` uses `src/components/landing-v2/product-story-chapter.tsx`.
- Desktop is one native-scroll GSAP/ScrollTrigger timeline: it pins `productStorySticky` and translates only `productStoryTrack` across scenes 04–06.
- At 1024px and below, and for reduced motion, the chapter is ordinary vertical document flow.

## Changed files

| File | Change |
|---|---|
| `src/components/landing-v2/product-story-chapter.tsx` | Added semantic `productSceneSafeArea` wrappers and promoted product identities to visible secondary headings. |
| `src/app/landing-v2/landing-v2.module.css` | Rebuilt scene compositions, added safe-area / height-aware desktop rules and explicit mobile document-flow layouts. |

## Scene corrections

### 04 — ИИ-Википедия компании

- Before: the statement consumed the frame and the proof started below it.
- After: 34/66 landscape split. The left column holds identity, promise and compact mode selector; the right proof holds question, explainable answer, four sources and next action inside the viewport.

### 05 — Анализ разговоров

- Before: heading, quote, focus grid, action rail and capability rail competed vertically.
- After: the promise and quote occupy the left reading path; the 2×2 extracted-meaning field is on the right; action and capability rails are compact bottom layers. `Задача создана` stays visually emphasised.

### 06 — Данные о рынке

- Before: absolute quotes competed with a low, partly hidden conclusion.
- After: the left column identifies the product and promise; the right column reads top-to-bottom as three communications → oxide signal → conclusion → management selector.

## Viewport-height handling

- A single desktop safe area uses the pinned `100svh` stage with 52–76px inset padding.
- `max-height: 820px` reduces title scale, proof height and internal padding.
- `max-height: 740px` further compacts the layouts and suppresses only secondary explanatory leads; identity, promise, proof/result and selectors remain visible.
- 1280×720 DOM checks confirmed all critical 04 and 05 elements remain inside the viewport; market hold is captured before release.

## Mobile strategy

- No pin at 430/390/375/360/320px.
- 04: identity → promise → question / answer → sources + action.
- 05: identity → promise → quote → four extracted rows → action rail → capabilities.
- 06: identity → promise → normal-flow communication fragments → signal → conclusion → selector.

## Interaction and motion QA

- `ИИ-наставник`, `Автоматическая CRM` and `Ассортимент` selectors each update their existing interpretation copy.
- Reduced motion: no pin, all staged elements visible, no horizontal overflow.
- 06 reaches full track position and releases to unchanged vertical Block 07.

## Screenshots

| View | File |
|---|---|
| 04 hold, 1440×900 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/04-hold-1440x900.png` |
| 05 hold, 1440×900 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/05-hold-1440x900.png` |
| 06 hold, 1440×900 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/06-hold-1440x900.png` |
| 04 hold, 1280×800 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/04-hold-1280x800.png` |
| 05 hold, 1280×800 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/05-hold-1280x800.png` |
| 06 hold, 1280×800 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/06-hold-1280x800.png` |
| 04 → 05 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/04-to-05.png` |
| 05 → 06 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/05-to-06.png` |
| 06 → 07 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/06-to-07.png` |
| Mobile 04 / 05 / 06 | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/04-mobile-390.png`, `05-mobile-390.png`, `06-mobile-390.png` |
| Full mobile flow | `LANDING_V2_PRODUCT_CHAPTER_READABILITY_FIX/chapter-mobile-390-full-flow.png` |

## Checks

| Check | Result |
|---|---|
| Desktop | 1440×900, 1280×800, 1280×720 inspected |
| Mobile | 430×932, 390×844, 375×812, 360×800, 320×568; no document overflow |
| `prefers-reduced-motion` | no pin; all staged contents visible |
| `npm.cmd run lint` | passed |
| `npm.cmd run build` | passed |

## Git handoff

- Branch: `landing-v2-design`.
- Commit SHA and push result: recorded in the final task handoff after the local commit is created.
