# Landing V2 — Horizontal Product Chapter 04–06

## Scope

- Route: `/landing-v2`.
- Changed: Block 03 outro handoff, Blocks 04–06, and the release into the existing Block 07.
- Preserved: Hero, Hidden Cost, Mini Audit, FAQ, Final CTA, Blocks 08–12, legacy routes, admin, API and Prisma.

## Product chapter architecture

- `ProductStoryChapter` owns scenes 04 / Knowledge, 05 / Conversation and 06 / Market Intelligence.
- At `min-width: 1025px` one GSAP master timeline pins only `ProductChapterSticky` and translates only `ProductChapterTrack` across the real three-scene track.
- Native vertical scrolling remains in control; there is no wheel/touch interception and no hard snapping.
- A 3.1 viewport-height ScrollTrigger distance provides entry, reading and transition holds.
- The chapter wrapper enters from the right after Block 03. Its post-transition `ScrollTrigger.refresh()` avoids stale pin geometry.
- The final track position holds, then the pin releases into the unchanged vertical Block 07.

## Scene design

- **04 — Knowledge:** asymmetric statement plus visible question/answer workbench; CRM, 1С, catalog and documents converge as source traces; the existing manual knowledge mode rail remains available.
- **04 → 05:** the question moves out with the scene and the customer’s line becomes the primary semantic object.
- **05 — Conversation:** one large quote transitions to a staged focus plane and a restrained action rail, with `Задача создана` as the payoff. The capability rail remains manual.
- **05 → 06:** a single conversation recedes into several customer phrases.
- **06 — Market:** warm graphite field, editorial customer fragments and a selected management interpretation; the procurement / assortment / marketing selector remains manual.

## Responsive and reduced-motion behavior

- 1024px and below intentionally use the vertical product-story flow, rather than compressing the pinned presentation.
- At 390px, 360px and 320px the scenes retain readable vertical order without page horizontal overflow.
- `prefers-reduced-motion: reduce` disables the horizontal pin and shows all staged content in normal document flow. Manual selectors are still functional.

## Assets

- Reused the existing `public/landing-v2/assets/block-04/knowledge-catalog.png` as the material surface within Scene 04.
- No generated visual asset was needed. All important product UI and copy remain HTML.

## Interaction QA

- Knowledge mode: selected `ИИ-наставник`; description updates.
- Conversation capability: selected `Автоматическая CRM`; description updates.
- Market view: selected `Ассортимент`; interpretation updates.

## Screenshots

| View | File |
|---|---|
| 03 → 04 entry, 1440 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/03-to-04-entry-1440.png` |
| 04 Knowledge, 1440 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/04-knowledge-1440.png` |
| 04 → 05, 1440 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/04-to-05-transition-1440.png` |
| 05 Conversation, 1440 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/05-conversation-1440.png` |
| 05 → 06, 1440 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/05-to-06-transition-1440.png` |
| 06 Market, 1440 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/06-market-1440.png` |
| 06 → 07 release, 1440 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/06-to-07-release-1440.png` |
| 04 mobile, 390 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/04-mobile-390.png` |
| 05 mobile, 390 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/05-mobile-390.png` |
| 06 mobile, 390 | `LANDING_V2_HORIZONTAL_PRODUCT_CHAPTER_04_06/06-mobile-390.png` |

## Checks

| Check | Result |
|---|---|
| Browser progression at 1440×900 | Entry, three scenes, release; no blank frames or page-level horizontal overflow |
| Browser widths | 1280×800 pinned; 1024×768, 390×844, 360×800 and 320×568 vertical/no overflow |
| Reduced motion | Vertical/no pin, all content present |
| `npm.cmd run lint` | Passed |
| `npm.cmd run build` | Passed |

## Known limits / manual review

- Tablet intentionally changes to the vertical chapter at 1024px for readability.
- The next pass may redesign Block 07, but this task intentionally leaves its inner system-flow composition intact.

## Git handoff

- Branch: `landing-v2-design`.
- Commit and push result: recorded in the final task handoff after the approved repository write.
