# Light Theme Polish Report

Date/time: 2026-07-09 01:58 +05:00

Backup path: `backups/site-before-light-theme-polish-20260709-0150.zip`

## Scope

- Task: focused LIGHT/DAY theme polish for the homepage and footer.
- Routes changed/added: none.
- Public routes intentionally preserved: `/`, `/solutions`, `/cases`, `/cases/[slug]`, `/work`, `/capabilities`, `/approach`, `/about`, `/contacts`, `/privacy`, `/consent`, `/cookies`, `/terms`.
- Assets used: existing hero sequences only; no sequence files were edited.
- Not touched: dark theme tokens, night hero sequence, day hero sequence files, forms/leads/backend, admin/auth/API/Prisma, legal content, route structure and visible section text.

## Read-Only Agent Findings

- Light Theme Contrast Auditor:
  - `--text-soft` was too pale for small homepage labels.
  - Small violet accent text needed a darker light-mode text accent while keeping the branded violet CTA fill.
  - Production marquee was too low contrast in light mode.
  - Live system cards became too faded during hover comparison states.
  - Footer small secondary text needed warmer/darker light values.
- Token System Auditor:
  - `globals.css` had an effective later Visual V3 token layer; the later `[data-theme="light"]` block controlled the real global light variables.
  - Homepage light styling existed but did not fully cover dark-first component internals.
  - Architecture, telemetry, proof/passport and sequence load-note styles still had hardcoded dark constants in their base rules, requiring light-only overrides.
- Footer Auditor:
  - Footer is outside `.home-page`, so it did not inherit the homepage warm light variables.
  - Footer used inline generic `var(--bg-elevated)` / text styles and therefore resolved to the colder global light palette.
  - Recommended fix: explicit footer class plus `[data-theme="light"] .lab-footer` variable overrides.

## Implemented

- Added warm global light tokens in `src/app/globals.css`:
  - background `#f6f1e8`;
  - elevated/card surface `#fffaf0`;
  - soft surface `#f1eadf`;
  - graphite text `#191715`;
  - warm secondary text `#5f5a52`;
  - small-label text `#6f665a`;
  - violet CTA `#8052ff`;
  - light text violet `#6740da`;
  - muted amber `#b98200`;
  - restrained cyan/green `#4c7f78`.
- Strengthened homepage light overrides for:
  - hero readability mask and copy colors;
  - live system cards;
  - proof showreel tabs and system passport surface;
  - architecture layer stack, markers, tags and hover states;
  - production telemetry board internals and marquee;
  - autonomous business process rail;
  - final CTA panel;
  - FAQ rows and active states;
  - `.ops-bg*` light signal-map variables.
- Refactored footer styling from inline styles to explicit classes:
  - `lab-footer`;
  - `lab-footer__tagline`;
  - `lab-footer__description`;
  - `lab-footer__heading`;
  - `lab-footer__link`;
  - `lab-footer__contacts`;
  - `lab-footer__bottom`.
- Added light-only footer variables and warm background/border/link hover states.
- Updated `site/PROJECT_MAP.md` with the light token layer, affected homepage sections, footer light styling and untouched areas.

## Changed Files

- `src/app/globals.css`
- `src/components/footer.tsx`
- `PROJECT_MAP.md`
- `docs/reports/light-theme-polish-report.md`

## Checks

- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed.
- `npm.cmd run typecheck`: absent from `package.json`.
- `npm.cmd run test`: absent from `package.json`.

## Browser QA

Allowed scope: one dev server and screenshots for `/` in light/dark only.

Server note:

- Reused the already-running local OptiMate app on `http://localhost:3000/` (node pid `16432`) instead of starting a second server.
- Two `Start-Process` launch attempts failed before startup with Windows `Path`/`PATH` duplication; no extra server was kept.
- One stray `cmd.exe` from a failed launch attempt was stopped.

Screenshots saved:

- `site/docs/reports/light-theme-polish-screenshots/home-light-hero.png`
- `site/docs/reports/light-theme-polish-screenshots/home-light-sections.png`
- `site/docs/reports/light-theme-polish-screenshots/home-light-footer.png`
- `site/docs/reports/light-theme-polish-screenshots/home-dark-check.png`

Visual QA result:

- Light hero: readable graphite copy, visible CTA, day sequence does not obscure text.
- Light sections: proof/passport block has visible warm surfaces, borders and active states.
- Light footer: warm footer background, readable links/text and violet hover/focus system.
- Dark check: dark hero still renders with the night sequence and dark header controls.

## TODO / Manual QA

- Review saved screenshots after browser QA and confirm the light theme reads as a warm day version, not a cold recolor.
- Confirm footer still looks coherent on non-home public routes in light mode because the footer is global.
- If exact visual preference changes, tune only the light variables and light-only overrides; do not change sequence assets or dark theme.
