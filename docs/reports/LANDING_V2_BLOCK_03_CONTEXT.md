# Landing V2 — Block 03 / Company Context

## CREATED
- `site/src/components/landing-v2/company-context-data.ts`
- `site/src/components/landing-v2/company-context-section.tsx`
- `site/src/app/landing-v2/page.tsx` (`CompanyContextSection` import and render)
- `site/src/app/landing-v2/landing-v2.module.css` (new block section styles/variables/motion states/desktop-mobile transitions)
- `site/docs/LANDING_VISUAL_STORYBOARD.md` (storyboard entry update)

## MODIFIED
- `site/docs/LANDING_V2_BLOCK_03_CONTEXT.md` (initial report)

## BLOCK 03 STRUCTURE
- `CompanyContextSection` added after `HiddenCostSection`.
- Data-first architecture through `company-context-data.ts`:
  - 5 areas with exact source phrasing:
    - Сотрудники
    - Клиенты
    - Продажи
    - Товары
    - Маркетинг
  - Unified context facts.
  - outcome chips.
- Desktop: single conceptual dark graph with 5 area modules + central `Единый контекст компании` field and outcome panel.
- Mobile: dedicated vertical narrative flow with the same areas and outputs.

## MOTION SEQUENCE
- One-shot reveal triggered once on first intersection entry (`threshold: 0.25`) and guarded by `hasRevealed`.
- Timed states:
  0. Baseline: base structure + labels.
  1. Area fragments appear with staggered delays.
  2. Connections become visible.
  3. Context facts appear.
  4. Final statement appears.
  5. Outcomes appear.
- No looping.
- `prefers-reduced-motion: reduce` shows final state immediately.

## MOBILE DIFFERENCE
- Mobile uses a separate vertical flow.
- Simpler one-shot order:
  - areas
  - core story
  - final statement
  - outcomes

## DESIGN SYSTEM
Design System changes: none.

## ADMIN
Admin integration was not performed.

## LEGACY
Legacy homepage was not modified.

## TESTS
- `npm.cmd run lint` — not run (not requested in this pass).
- `npm.cmd run build` — not run (not requested in this pass).
- `npm.cmd run typecheck` — script not present in `package.json`.
- Manual / runtime checks were not executed per request.

## KNOWN BUILD ISSUE
No new build results were executed in this pass; if a pre-existing unresolved landing build failure exists in repo, it was not retested here.

## DEVIATIONS
- To keep reveal deterministic in both viewport modes, transitions were implemented via scoped reveal state classes plus shared final-state selectors.
- Block uses existing warm-mode route tokens with explicit dark-mode aliases scoped in `landing-v2.module.css`.

