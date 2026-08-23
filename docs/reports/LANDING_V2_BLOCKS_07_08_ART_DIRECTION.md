# Landing V2 — Blocks 07–08 Art Direction

Date: 2026-08-24

## Scope and starting point

The working tree was preserved. Before this pass, Block 07 was a static four-column pipeline (`Данные → ИИ → Действие → Аналитика`) and Block 08 was a full-width four-row timeline. Block 04–06 remained the existing horizontal chapter and Block 09 was not redesigned.

Backup created before implementation:

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-landing-v2-blocks-07-08-motion-20260824-0439.zip`

## Block 07 — business-system assembly

Desktop now uses a native vertical scroll story with one GSAP/ScrollTrigger master. A CSS-sticky viewport avoids an additional nested GSAP pin, which was visually conflicting with the preceding horizontal chapter.

The spatial sequence is:

1. The existing statement enters as the primary reading surface.
2. Six neutral working sources assemble one by one: CRM, 1С, звонки, документы, сайт and базы.
3. The world pulls back, revealing the source field and `01 / Данные` boundary.
4. A restrained central interpretation field introduces `02 / ИИ`.
5. One oxide signal moves once to `03 / Действие`; resulting operations are shown as working outcomes, not a dashboard.
6. `04 / Аналитика` and its one-time feedback loop complete the architecture.
7. The final composition holds with minimal motion for inspection.

No Remotion or generated image asset was used. The scene is DOM, CSS perspective, transforms and opacity only. There are no glowing cores, neon beams, glass panels, Three.js, or perpetual animations.

The final scale was tuned for the 1280×800 hold-frame. At that size, CRM, 1С, сайт, звонки, документы and базы remain distinct from `Данные → ИИ → Действие → Аналитика`.

## Transitions

- **06 → 07:** the horizontal chapter releases into a vertical, warm operational plane. Block 07 changes the motion axis from lateral movement to depth/pullback.
- **07 → 08:** the final oxide coordinate line becomes the visual handoff to the quiet vertical progress line in Block 08.
- **08 → 09:** no new effect was introduced; the process ends at implementation and leaves breathing room before the unchanged cases section.

## Block 08 — calm business process

Block 08 is now a two-column editorial composition on desktop:

- a sticky left statement, limited to the original business promise;
- four ordinary-scroll process stages at right, each with a divider, number, small meta mark, title and preserved description;
- one thin vertical line instead of cards, dashboards or a second large motion event.

On mobile it becomes a normal vertical sequence with the same line and no sticky column.

## Mobile and accessibility

- Block 07 does not pin on mobile. It becomes a compact source field followed by an ordered `Данные → ИИ → Действие → Аналитика` flow and a feedback arrow.
- Block 08 becomes a normal, touch-friendly ordered process.
- Under `prefers-reduced-motion`, desktop Block 07 is not sticky and presents the whole static architecture; mobile remains static.
- The heading and the ordered mobile architecture remain semantic HTML. The desktop spatial layer is decorative (`aria-hidden`) so assistive technology does not read duplicate labels.

## Performance

- One GSAP timeline and one ScrollTrigger master for Block 07.
- Scroll updates are batched with `requestAnimationFrame` and animate transforms/opacity only.
- No continuous animation, blur animation, heavy canvas, video or image sequence was added.

## QA artifacts

Captured desktop screenshots:

- `docs/reports/landing-v2-blocks-07-08-screenshots/07-entry-1440x900.png`
- `docs/reports/landing-v2-blocks-07-08-screenshots/07-systems-1440x900.png`
- `docs/reports/landing-v2-blocks-07-08-screenshots/07-pullback-1440x900.png`
- `docs/reports/landing-v2-blocks-07-08-screenshots/07-final-system-1440x900.png`
- `docs/reports/landing-v2-blocks-07-08-screenshots/07-final-system-1280x800.png`
- `docs/reports/landing-v2-blocks-07-08-screenshots/08-desktop-1440x900.png`

The in-app browser allowed the desktop passes. Its URL policy blocked the attempted mobile viewport change before `08-mobile-390.png` could be captured. This was not bypassed. The mobile implementation was checked from source/CSS, but still requires owner visual QA at 430×932, 390×844, 375×812, 360×800 and 320×568 once local browser access is available again.

## Checks

| Command | Result |
| --- | --- |
| `npm.cmd run lint` | Passed |
| `npm.cmd run build` | Passed; TypeScript and static generation succeeded |

## Changed files

- `src/components/landing-v2/automation-architecture-section.tsx`
- `src/components/landing-v2/how-we-work-section.tsx`
- `src/app/landing-v2/landing-v2.module.css`
- `docs/reports/LANDING_V2_BLOCKS_07_08_ART_DIRECTION.md`

## Intentionally preserved

- Hero, Hidden Cost and Block 03
- the internal mechanics and business copy of Blocks 04–06
- Block 09 cases and all later public sections
- admin, auth, API, Prisma, legal and consent areas

## Git handoff

Branch: `landing-v2-design`.

Implementation commit: `d3984ee4f9b2b859804ef9f2bc08e849d384d093` (`feat(landing-v2): add business system assembly story`).

Push is intentionally not performed because the repository safety policy prohibits `git push` from this environment.
