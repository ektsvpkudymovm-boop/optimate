# Landing V2 — System Demo height stability

## Scope

Only Block 01 / Hero on `/landing-v2` was changed. Block 02, Block 03, the guided sequence, copy, navigation, mobile presentation, legacy routes and admin were not changed.

## Root cause

The desktop `.systemDemo` used `min-height` rather than a fixed presentation height. Its grid therefore adopted the natural height of the active workspace: the larger Overview increased the shell, while shorter views allowed it to collapse.

## Fix

`--system-demo-height` now sets the desktop/tablet shell height. The root demo, sidebar and workspace have an explicit full-height chain; the workspace is a two-row grid with a fixed header and a bounded content row. Only `.workspaceContent` can scroll vertically if a future presentation screen exceeds its allocated area.

## Desktop height rule

| Viewport range | `--system-demo-height` |
| --- | ---: |
| 1281px and wider (including 1440px) | 580px |
| 1025px–1280px (including 1280px) | 576px |
| 769px–1024px (including 1024px) | 584px |

At 768px and below the existing natural-height mobile presentation is intentionally restored.

## QA

- Static review confirms that view changes only replace `.workspaceContent`; no height or min-height transition is defined.
- All six views share the same root `--system-demo-height` on desktop/tablet, so the demo bottom edge and Block 02 position cannot follow active-view content height.
- Browser QA was not run because this pass did not grant browser automation under the repository policy. Manual owner QA remains: cycle all six tabs and autoplay at 1440px, 1280px and 1024px; confirm no important content is clipped and no unexpected workspace scrollbar appears.

## Files modified

- `src/app/landing-v2/landing-v2.module.css`
- `docs/reports/landing-v2-system-demo-height-stability-20260823.md`

## Checks

- `npm.cmd run lint` — passed.
