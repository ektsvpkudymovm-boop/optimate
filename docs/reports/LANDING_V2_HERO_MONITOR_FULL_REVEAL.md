# Landing V2 — Hero Monitor Full Reveal

## What was wrong

The preceding desktop Hero moved the business environment and System Demo into view, but its lower boundary remained outside the viewport. The user could not stop on a complete, readable view of the system.

## Solution

The existing pinned Hero master timeline was extended rather than rebuilt. The product UI now sits in a CSS-built neutral professional monitor: a graphite bezel, screen viewport, restrained lower edge, stand and base place the live OptiMate UI into the working environment.

The correction changes scene geometry and scroll timing, not the Demo data or inner behaviour. The final monitor is constrained by viewport height and its 16:10 screen geometry, so the full hardware and complete external System Demo shell fit in the reveal state.

## Monitor

- Implementation: HTML/CSS shell around the existing live `OptiMateSystemDemo`.
- Screen ratio: 16:10 via a monitor width derived from the available screen height.
- Hardware: warm graphite metal, thin bezel, lower edge, short stand/base, contact shadow and a restrained metallic highlight.
- Pointer events: hardware has no overlay above the screen; the System Demo remains clickable.

## Hero timeline

| Phase | Scroll progress | Behaviour |
|---|---:|---|
| Entry / copy | 0–20% | H1, lead and CTA remain the main view; monitor is below the fold. |
| Approach | 20–50% | Copy leaves; environment and monitor rise into the stage. |
| Reveal | 50–70% | Complete monitor, whole screen viewport and surrounding desk appear together. |
| Full reveal hold | 70–88% | Monitor stays effectively fixed for inspection; only ambient scene movement remains. |
| Release | 88–100% | Scene moves slightly upward before normal handoff to unchanged Hidden Cost. |

## Asset

- Retained: `public/landing-v2/assets/hero/hero-operational-desk.png`.
- The existing material desk asset provides sufficient negative space and remains visibly present around the monitor.

## Viewport QA

The Chrome viewport-control target sizes below were exercised. The browser reports a slightly smaller CSS client area because of its native chrome; the full-reveal checks use that effective visual viewport.

| Target | Result |
|---|---|
| 1440×1000 | Full monitor visible at Hero hold; no horizontal overflow. |
| 1440×900 | Full monitor visible at Hero hold; screenshot saved. |
| 1280×900 | Full monitor visible at Hero hold; no horizontal overflow. |
| 1280×800 | **Primary acceptance passed** — monitor top/left/right/bottom, entire screen shell, stand/base and desk environment are visible in one viewport. |
| 1024×768 | Full monitor visible at the simplified desktop hold. |
| 768 | Natural mobile/tablet flow; no horizontal overflow. |
| 390 | Natural mobile flow with a simplified framed display; no horizontal overflow. |
| 360 | Natural mobile flow; no horizontal overflow. |

## Screenshots

- `docs/reports/landing-v2-scroll-art-direction-01-02/hero-monitor-entry-1440x900.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/hero-monitor-full-reveal-1440x900.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/hero-monitor-full-reveal-1280x800.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/hero-monitor-release-1440x900.png`
- `docs/reports/landing-v2-scroll-art-direction-01-02/hero-monitor-mobile-390.png`

## Interaction QA

- Guided autoplay progressed while the full reveal was visible.
- Manual clicks for Communications, Knowledge and Processes all worked.
- A manual Processes selection remained active after the autoplay interval, confirming the existing interruption behaviour.
- The monitor outer height was unchanged across selections; only its scroll-timeline position changed during scrub settling.

## Reduced motion

With `prefers-reduced-motion: reduce` emulated, the Hero stage was normal document flow (not pinned), the monitor was statically present, and the live System Demo retained its normal interaction.

## Performance

- Reused existing GSAP and its single Hero master timeline.
- Animated only transforms and opacity.
- No extra scroll engine, video, canvas or 3D dependency was added.

## Lint and build

- `npm.cmd run lint` — passed.
- `npm.cmd run build` — passed; TypeScript and all 56 static pages completed.

## Untouched in this correction

- Hidden Cost and its animation.
- 02 → 03 reveal and Block 03 internals.
- Blocks 04–12, legacy `/`, admin, backend, API and Prisma.

## Git / remote sync

- Branch: `landing-v2-design`.
- Commit SHA: recorded after the feature commit.
- Commit message: `feat(landing-v2): complete hero monitor full reveal`.
- Push result: recorded after the verified push to `origin landing-v2-design`.
