# Project Map And Backup Report

Date/time: 2026-07-09 00:08 +05:00

## Summary

Documentation checkpoint created after the recent visual work. Runtime website code was not changed.

## Backup

Created backup:

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-checkpoint-20260709-0006.zip`

Backup verification:

- ZIP exists.
- Size: 32,887,763 bytes.
- Entry count: 447.
- Checked archive entries for forbidden names/paths.
- No forbidden entries were found for: `node_modules`, `.next`, `dist`, `coverage`, `backups`, `.git`, `.env*`, `*.pem`, `*.db`, `token`, `secret`, `key`.

Notes:

- The first `Compress-Archive` attempt was replaced because top-level compression does not reliably exclude nested `token` filenames such as design `tokens.json`.
- Two direct .NET ZIP attempts failed on this Windows/.NET runtime because `System.IO.Path.GetRelativePath` and `System.IO.Compression.ZipArchiveMode` were unavailable.
- Final backup was created through a temporary filtered staging copy and then compressed.

## PROJECT_MAP

Updated:

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\PROJECT_MAP.md`

The project map now documents:

- current stack;
- public, lab, legal, admin and API routes;
- homepage sections;
- key hero/sequence/proof/architecture/not-demo/autonomous/CTA/FAQ components;
- active WebP sequence assets;
- areas not to touch without a separate task;
- current stable state;
- current TODOs;
- separate background-system TODO for `Operational Signal Map / blueprint / process routes`.

## Files Changed

- `site/PROJECT_MAP.md`
- `site/docs/reports/project-map-and-backup-report.md`
- `site/backups/site-checkpoint-20260709-0006.zip`

## What Was Not Changed

- Runtime code.
- Public visual implementation.
- Styles.
- Components.
- Admin routes.
- Auth/session/login logic.
- Admin API.
- Lead API.
- Prisma schema and migrations.
- Forms.
- Legal pages.
- Cookie consent / analytics consent behavior.
- Case content model.
- `.env*` and secrets.

## Checks

Heavy checks were not run because only documentation and backup artifacts were changed.

Not run:

- `npm.cmd run lint`
- `npm.cmd run build`

## Remaining TODO

- Manually verify `/` on desktop/mobile after cookie consent state is set.
- Manually verify `/sequence-lab/hero-night` sequence behavior.
- Manually verify `/work` and `/capabilities` after the visual pivot.
- Design a separate light/day hero asset sequence if full day mode is required.
- Add cache/versioning strategy for `/public/sequence` before production.
- Investigate the previously reported local `npm.cmd run start` HTTP 500 after successful build.
- Verify Russian text encoding/content in browser/source editor; PowerShell output showed mojibake during read-only inspection.
- Keep old ambient/grid/glow backgrounds removed. Design the next background as a separate `Operational Signal Map / blueprint / process routes` task, not as a generic grid.
