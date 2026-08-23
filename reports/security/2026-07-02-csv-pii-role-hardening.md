# CSV PII Role Hardening

Date: 2026-07-02

## Task Goal

Harden admin lead CSV export and role checks: keep the seeded/default development admin as `OWNER`, make CSV export `OWNER`-only, preserve lead viewing for all admin roles, protect lead mutations from `VIEWER`, add CSV injection protection, and audit successful CSV exports without storing raw lead PII.

## Changed Files

- `src/lib/auth.ts`
- `src/app/api/admin/leads/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/api/admin/analytics/route.ts`
- `PROJECT_MAP.md`
- `reports/security/2026-07-02-csv-pii-role-hardening.md`

## Backup ZIP Paths

- Before ZIP: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-1940-before-csv-pii-role-hardening.zip`
- After ZIP: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-1943-after-csv-pii-role-hardening.zip`

## ZIP Exclusions

The backup command excluded `node_modules`, `.next`, `dist`, `build`, `.git`, `.env`, `.env.local`, `.env.production`, `dev.db`, nested `backup-optimatesite-*.zip` files, and `logs` paths.

## Inspected Files

- `docs/00_README.md`
- `docs/04_admin_panel_orders_analytics.md`
- `docs/07_seo_analytics_security_acceptance.md`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/auth.ts`
- `src/app/api/admin/leads/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/api/admin/analytics/route.ts`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/admin/leads/page.tsx`
- `src/app/admin/leads/[id]/page.tsx`
- `src/app/admin/analytics/page.tsx`
- `PROJECT_MAP.md`
- existing `reports/security/*`

## Role Policy Implemented

- `OWNER`: can view leads, export CSV, update lead status, add notes, and view analytics.
- `MANAGER`: can view leads, update lead status, add notes, and view analytics; cannot export CSV.
- `VIEWER`: can view leads and analytics; cannot export CSV, update lead status, or add notes.

Important owner access note: `prisma/seed.ts` already created or updated the default admin as `OWNER`. `src/lib/auth.ts` fallback `seedAdmin()` was also updated so an existing default admin is updated to `role: "OWNER"` instead of being left with an older role. This avoids downgrading or blocking the project owner from OWNER-only CSV export.

## Endpoints Protected By Role Checks

- `GET /api/admin/leads` JSON list: `OWNER`, `MANAGER`, `VIEWER`.
- `GET /api/admin/leads?export=csv`: `OWNER` only.
- `GET /api/admin/leads/[id]`: `OWNER`, `MANAGER`, `VIEWER`.
- `PATCH /api/admin/leads/[id]`: `OWNER`, `MANAGER`.
- `POST /api/admin/leads/[id]/notes`: `OWNER`, `MANAGER`.
- `GET /api/admin/analytics`: `OWNER`, `MANAGER`, `VIEWER`.

## CSV Export Columns

The CSV export remains limited to lead-handling fields:

`ID`, `Date`, `Name`, `Contact`, `Company`, `Task`, `Budget`, `Status`, `Source`, `utm_source`, `utm_medium`, `utm_campaign`, `pageUrl`, `referrer`, `consentPd`, `consentContact`.

No session tokens, admin ids, audit internals, raw analytics identifiers, password hashes, cookies, or unrelated internal metadata are exported.

## CSV Injection Protection Design

`src/app/api/admin/leads/route.ts` now uses a reusable local `escapeCsvCell()` helper for all exported values. The helper:

- converts nullish values to empty strings;
- serializes `Date` values as ISO strings;
- prefixes dangerous values with a single quote when they start with `=`, `+`, `-`, `@`, tab, or carriage return;
- escapes double quotes by doubling them;
- wraps every value in double quotes.

## CSV Export Audit Event Design

Successful CSV export creates an `AnalyticsEvent` with:

- `type: "lead_exported"`;
- `label: "admin_leads_csv_export"`;
- metadata containing `adminUserId`, `exportedRowCount`, and safe filters: `status`, `dateFrom`, `dateTo`, and `searchApplied`.

The audit metadata intentionally does not store raw lead names, contacts, task text, raw search text, or CSV content.

## Unauthorized And Forbidden Behavior

- Missing or invalid admin session still returns `401 { "error": "Unauthorized" }`.
- Valid session with insufficient role returns `403 { "error": "Forbidden" }`.
- Missing or invalid CSRF on mutation routes still returns `403 { "error": "Forbidden" }`.
- Route handlers continue to return generic errors without stack traces, DB details, role internals, or lead PII.

## Documentation Conflict

`docs/04_admin_panel_orders_analytics.md` still says `MANAGER` can export leads. The current security task explicitly required CSV export to be `OWNER`-only at `GET /api/admin/leads CSV export`, so implementation follows the security task. `PROJECT_MAP.md` now documents that this OWNER-only export rule intentionally supersedes the older admin docs line.

## Manual Verification Steps

1. Unauthenticated CSV export returns `401`.
2. Authenticated `VIEWER` CSV export returns `403`.
3. Authenticated `MANAGER` CSV export returns `403`.
4. Authenticated `OWNER` CSV export works.
5. CSV export creates a `lead_exported` audit event with row count and filters but no raw lead PII.
6. CSV cells starting with `=`, `+`, `-`, `@`, tab, or carriage return are prefixed with a single quote and quoted.
7. `VIEWER` cannot `PATCH` lead status.
8. `VIEWER` cannot `POST` lead note.
9. `MANAGER` can `PATCH` lead status.
10. `MANAGER` can `POST` lead note.
11. `GET` lead list/detail still works for `OWNER`, `MANAGER`, and `VIEWER`.
12. Existing CSRF behavior still works for mutations.
13. Existing rate limit behavior is not broken.
14. Security headers build behavior is not broken.

Browser automation and dev-server checks were not run because project instructions forbid automated browser opening and require asking before `npm run dev`.

## Commands Run And Results

- `git status --short` at repository root: failed because the workspace root is not the Git repository root.
- `git status --short` in `site`: succeeded; many files were already modified or untracked before this task.
- `npm.cmd run lint`: passed with 1 existing warning in `src/app/admin/leads/page.tsx` about a missing `loadLeads` dependency in `useEffect`, plus an ESLint `.eslintignore` deprecation warning.
- `npx.cmd tsc --noEmit`: passed.
- `npm.cmd run build`: passed.

## What Was Not Checked

- No browser, Playwright, Puppeteer, or headed browser verification was run.
- No dev server was started.
- No live role scenario was executed against a running server.
- No database seed command was run.

## What Was Not Done

- The admin UI export button was not hidden for non-OWNER roles. The server-side `403` is the security boundary, and this can be improved as a UI follow-up.
- The older admin docs were not rewritten; only `PROJECT_MAP.md` was updated to record the implemented security rule and the docs conflict.
- No broader RBAC system or new dependency was added.

## Risks And Doubts

- The admin docs currently conflict with the security task on whether `MANAGER` may export CSV.
- Existing admin audit events such as login/logout still store admin email in `label`; this task only added safe metadata for CSV export.
- Existing frontend files appear to have mojibake in Russian strings; this task did not change text encoding.

## Recommended Next Security Task

Add role-aware admin UI state from `/api/admin/auth` so non-OWNER users do not see or can clearly not use CSV export controls, and align `docs/04_admin_panel_orders_analytics.md` with the final OWNER-only export decision.

## Confirmations

- Secrets, tokens, passwords, password hashes, cookies, raw lead PII, and CSV contents were not intentionally printed in command output or included in audit metadata.
- Backup ZIP exclusions were applied for env files, local DB files, `.git`, build output, dependencies, logs, and nested backups.
- `PROJECT_MAP.md` was updated.
