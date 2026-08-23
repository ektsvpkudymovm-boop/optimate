# /work passport cards and filter anchor

Timestamp: 2026-07-09 09:06 +05:00

## Problem

- `/work` looked too much like a raw text/listing page instead of the main B2B showcase of system passports.
- The filter sat as a separate chip row and did not feel like part of a system-passport control panel.
- Homepage links such as `/work?type=ai-agents` opened the top of `/work`, not the filtered result block.
- Case cards did not quickly explain the system, business situation, build scope, architecture/integrations and next action.

## Changed

- Rebuilt `/work` as a compact system-passport showcase:
  - compact hero with required copy;
  - three signal cards;
  - `#work-passports` anchor before filter and results;
  - filter/control panel with active class, result count and linked chips;
  - featured systems only when no filter is active;
  - two-column passport grid on desktop and one-column grid on mobile;
  - final CTA panel.
- Updated homepage class-card hrefs to `/work?type={capabilityId}#work-passports`.
- Updated docs to describe `/work` as the main passport showcase and the filtered anchor path.

## Filter Behavior

- `Все` links to `/work#work-passports`.
- Each class links to `/work?type={capabilityId}#work-passports`.
- Active chip is determined by `searchParams.type`.
- With an active type, featured cards are not shown before results; the filtered cards appear immediately after the filter summary.
- Without an active type, `/work` shows featured systems first, then the full passport grid.

## Files Changed

- `src/app/(public)/work/page.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `README.md`
- `README_HANDOFF.md`
- `PROJECT_MAP.md`
- `docs/reports/work-page-passport-cards-and-filter-anchor-20260709-0906.md`

## Preserved

- Homepage visual classes and layout logic were not changed; only the class-card href changed.
- `ScrollSequenceHero`, sequence assets, `.home-page`, `.ops-bg*`, `ProductionTelemetryBoard`, `OperationsProcessRail` and `SystemPassportShowreel` visual logic were not changed.
- Admin, API, Prisma, forms, legal pages, consent/cookies and analytics behavior were not touched.
- `/cases/[slug]` remains the detailed passport URL structure.

## Checks

- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.

Build summary:

- Next.js 16.2.9 production build compiled successfully.
- TypeScript finished successfully.
- Static generation completed for 55 pages.
- `/work` remains dynamic because it uses search params.

## Backups

- Pre-change backup: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-work-passport-cards-and-filter-anchor-20260709-0900.zip`
- Post-change backup: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-after-work-passport-cards-and-filter-anchor-20260709-0907.zip`

Post-change backup verification:

- Archive created.
- Size: `108911464` bytes.
- Forbidden files found: `0`.

## TODO / Manual QA

- Browser visual QA was not run because the task forbids dev-server/browser automation without separate owner permission.
- Manually open `/` and confirm the homepage visual did not change.
- From `/`, click the AI Agents class card and confirm it opens `/work?type=ai-agents#work-passports` at the filtered passport block.
- Open `/work` and review the full showcase.
- Open `/work?type=ai-agents#work-passports` and confirm AI Agents passports appear immediately after the filter.
- Open `/work?type=crm-automation#work-passports` and confirm the CRM filter works.
- Open `/cases/ai-organic-flow` from a card.
- Open `/contacts` from the final CTA.
