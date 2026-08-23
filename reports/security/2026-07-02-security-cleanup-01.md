# Security cleanup 01

Date: 2026-07-02

## Task goal

Close small and medium findings from checkpoint audit 02 without changing the architecture: bounded JSON body parsing, lint cleanup, docs cleanup, and safer admin audit labels.

## Changed files

- `src/lib/request-body.ts`
- `src/app/api/leads/route.ts`
- `src/app/api/events/route.ts`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/mfa/verify/route.ts`
- `src/app/api/admin/mfa/enable/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/admin/leads/page.tsx`
- `eslint.config.mjs`
- `.eslintignore` removed
- `../docs/04_admin_panel_orders_analytics.md`
- `PROJECT_MAP.md`
- `reports/security/2026-07-02-security-cleanup-01.md`

## Backup ZIP paths

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-2226-before-security-cleanup-01.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-2235-after-security-cleanup-01.zip`

## ZIP exclusions

The backup commands excluded `node_modules`, `.next`, `dist`, `build`, `.git`, `.env`, `.env.local`, `.env.production`, `prisma/dev.db`, `dev.db`, `*.zip`, `*.log`, and `tsconfig.tsbuildinfo`.

## Bounded JSON helper design

Added `src/lib/request-body.ts` with `readBoundedJson(request, { maxBytes, requireObject })`.

The helper:

- checks declared `Content-Length` as a fast reject;
- reads the actual `ReadableStream` body and counts `Uint8Array.byteLength` before `JSON.parse`;
- returns 413 when the actual streamed body exceeds the configured cap, including when no `Content-Length` is present;
- returns 400 for invalid JSON;
- returns 400 for non-object JSON roots when `requireObject` is enabled;
- does not log raw request bodies.

## Endpoints updated with actual byte caps

- `POST /api/leads`: 16 KB
- `POST /api/events`: 8 KB
- `POST /api/admin/auth`: 4 KB
- `POST /api/admin/mfa/verify`: 4 KB
- `POST /api/admin/mfa/enable`: 4 KB, included because it also parsed JSON
- `PATCH /api/admin/leads/[id]`: 4 KB
- `POST /api/admin/leads/[id]/notes`: 16 KB

No remaining `request.json()` usage was found under `src/app/api` after the change.

## Response behavior for 400/413

- Oversized JSON bodies return `413` with `{ "error": "Request body too large" }`.
- Invalid JSON and non-object roots for object endpoints return `400` with `{ "error": "Invalid JSON body" }`.
- Existing Zod validation remains in place after bounded parsing.
- The `/api/events` non-object-root error now uses the generic invalid JSON body response instead of the older `type required` response.

## Lint cleanup performed

- Fixed the React Hook dependency warning in `src/app/admin/leads/page.tsx` with `useCallback` and a separate `submittedSearch` state so typing in the search field does not trigger automatic reloads.
- Removed `.eslintignore`.
- Kept the ignore pattern in `eslint.config.mjs` flat config via `globalIgnores`.
- `npm.cmd run lint` no longer prints the `.eslintignore` deprecation warning.

## Docs cleanup performed

Updated `../docs/04_admin_panel_orders_analytics.md` so CSV export policy matches implementation:

- OWNER can export CSV.
- MANAGER cannot export CSV.
- VIEWER cannot export CSV.

## Audit label cleanup performed

Updated admin audit writes so labels no longer store admin email addresses:

- `admin_login` label is now `admin_login`; admin id is stored in metadata.
- MFA-completed `admin_login` label is now `admin_login`; admin id and MFA marker are stored in metadata.
- `admin_logout` label is now `admin_logout`; admin id is stored in metadata.
- lead note audit label is now `lead_note_created`; admin id is stored in metadata.
- lead status audit metadata now includes `adminUserId`.

No admin email audit labels were intentionally left unchanged.

## PROJECT_MAP.md

Updated `PROJECT_MAP.md` to mention:

- `src/lib/request-body.ts`;
- actual byte caps before JSON parsing;
- ESLint ignore migration to flat config;
- admin audit labels avoiding email addresses.

## Manual verification scenarios

Manual scenarios to run with a local server and valid test data:

1. Oversized `/api/leads` body returns 413 even without `Content-Length`.
2. Invalid JSON `/api/leads` returns 400.
3. Normal valid `/api/leads` request still works.
4. Oversized `/api/events` body returns 413 even without `Content-Length`.
5. Normal `/api/events` request still works.
6. Oversized `/api/admin/auth` body returns 413.
7. Normal admin login still works.
8. MFA verify still works for a valid challenge/code.
9. Lead status and note endpoints still preserve 401/403/429 behavior from auth, CSRF, and rate limit.
10. `npm.cmd run lint` has no React Hook dependency warning and no `.eslintignore` deprecation warning.
11. Docs now say CSV export is OWNER-only.

## Commands run and results

- `npm.cmd run lint`: passed.
- `npx.cmd tsc --noEmit`: first run failed before build because stale `.next/types/validator.ts` referenced missing `./routes.js`.
- `npm.cmd run build`: passed and regenerated `.next` types.
- `npx.cmd tsc --noEmit`: passed after build.
- `npx.cmd prisma validate`: passed.

## What was not checked

- Manual HTTP scenarios were not executed because local rules prohibit browser automation and dev-server/browser verification without owner approval.
- No `npm run dev` server was started.
- No browser, Playwright, Puppeteer, or headed browser automation was used.

## What was not done

- No new features were added.
- No auth/session/CSRF/rate-limit/MFA/roles/CSV/security-header architecture was rewritten.
- No external auth, analytics, tracking, or infrastructure dependency was added.

## Risks and doubts

- The bounded JSON helper concatenates decoded text after enforcing byte caps, which is acceptable for the small caps used here.
- In-memory rate limits remain process-local; this was pre-existing and outside this cleanup pass.
- The first `tsc` failure appears generated-state related because `npm.cmd run build` and the repeated `tsc` passed without code changes after build.

## Recommended next task

Add focused integration tests or scripted `Invoke-WebRequest` checks for the bounded JSON 400/413 behavior and admin mutation 401/403/429 preservation.

## Secret and PII handling confirmation

Secrets, cookies, session tokens, password hashes, CSRF tokens, TOTP secrets, recovery codes, MFA challenge tokens, lead emails, phones, comments, and other lead PII were not printed in this report. Backup ZIP exclusions were configured to avoid local secret env files, local databases, logs, nested ZIPs, and generated cache/build folders. `.env.example` is intentionally allowed because it contains safe placeholders.

PROJECT_MAP.md was updated.
