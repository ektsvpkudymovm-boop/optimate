# OptiMate checkpoint security audit 02

Date: 2026-07-02

## Audit scope

Checkpoint audit after admin MFA/TOTP and the previous hardening stages: admin env/password hardening, server-side admin API guards, CSRF, rate limiting, checkpoint audit 01, security headers/CSP, CSV/PII/role hardening, and admin MFA/TOTP with recovery codes.

No new features were added. No business logic or security logic was changed. This report is the only file added by this audit.

## Files inspected

- `PROJECT_MAP.md`
- `reports/security/*.md`
- `.env.example`
- `.gitignore`
- `next.config.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/instrumentation.ts`
- `src/proxy.ts`
- `src/lib/admin-env.ts`
- `src/lib/password.ts`
- `src/lib/auth.ts`
- `src/lib/admin-client.ts`
- `src/lib/rate-limit.ts`
- `src/lib/mfa.ts`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/leads/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/api/admin/analytics/route.ts`
- `src/app/api/admin/mfa/status/route.ts`
- `src/app/api/admin/mfa/setup/route.ts`
- `src/app/api/admin/mfa/enable/route.ts`
- `src/app/api/admin/mfa/verify/route.ts`
- `src/app/api/leads/route.ts`
- `src/app/api/events/route.ts`
- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/components/admin/mfa-settings.tsx`
- Backup folders and ZIP entry names only

## Backup ZIP paths

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-2215-before-checkpoint-audit-02.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-2220-after-checkpoint-audit-02.zip`

## ZIP exclusions

The checkpoint ZIP command excluded:

- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `.git/`
- `backups/`
- `_project_backups/`
- `.playwright-cli/`
- `.mimocode/`
- `.env`, `.env.local`, `.env.production`
- `dev.db`, `prisma/dev.db`
- `*.log`
- nested `*.zip`
- `tsconfig.tsbuildinfo`

`.env.example` was intentionally allowed because it contains placeholders only.

The before and after ZIP entry-name checks found no forbidden entries after excluding the allowed `.env.example` placeholder.

## Commands run and results

- `git status --short` from workspace root: failed because the Git repository is `site/`, not the workspace root.
- `git status --short` in `site/`: succeeded; many files were already modified or untracked before this audit.
- `npm.cmd run lint`: passed with 0 errors. Warnings remain: `react-hooks/exhaustive-deps` in `src/app/admin/leads/page.tsx:64`, plus ESLint's `.eslintignore` deprecation warning.
- `npx.cmd tsc --noEmit`: passed.
- `npm.cmd run build`: passed.
- `npx.cmd prisma validate`: passed.

No dev server was started. No browser automation was used.

## Confirmed protections

### Admin env and password

- Production admin runtime validation is present in `src/instrumentation.ts` and `src/app/api/admin/auth/route.ts`.
- Production requires `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Production rejects the development default password and passwords shorter than 12 characters.
- Development use of the default local admin password requires `ALLOW_DEV_ADMIN_PASSWORD=true`.
- `prisma/seed.ts` and `src/lib/auth.ts` store only password hashes and seed/update the default admin as `OWNER`.

### Sessions and cookies

- `admin_session` is `httpOnly`, `sameSite=lax`, `secure` in production, `path=/`, and has a 7-day max age.
- `AdminSession.tokenHash` stores a SHA-256 token hash, not the raw session token.
- Expired sessions are rejected and deleted during current-admin lookup.
- `admin_csrf` is intentionally readable by client code for the double-submit pattern, has `sameSite=lax`, `secure` in production, `path=/`, and the same max age as the session.
- Logout clears both session and CSRF cookies.

### Admin API guard and roles

- Protected admin routes use server-side guards in route handlers, not only the client admin layout or `src/proxy.ts`.
- `POST /api/admin/auth` remains public for password login.
- `GET /api/admin/auth` uses the admin session guard.
- Missing session returns `401`; insufficient role returns `403`.
- Implemented role policy:
  - `OWNER` can view leads/analytics, mutate leads, configure MFA, and export CSV.
  - `MANAGER` can view leads/analytics and mutate leads, but cannot export CSV.
  - `VIEWER` can view leads/analytics, but cannot mutate or export.
- CSV export is `OWNER`-only.
- Admin analytics is available to `OWNER`, `MANAGER`, and `VIEWER`.

### CSRF

- Admin mutations use `requireAdminMutation()` or `requireAdminMutationRole()` and require `X-CSRF-Token`.
- Missing session returns `401`; valid session with missing/wrong CSRF returns `403`.
- `POST /api/admin/auth` is intentionally excluded because no admin CSRF token exists before login.
- `POST /api/admin/mfa/setup` and `POST /api/admin/mfa/enable` require existing session, role, CSRF, and mutation rate limit.
- `POST /api/admin/mfa/verify` is challenge-based and intentionally does not require full session/CSRF.
- Origin checking is present in `src/lib/auth.ts`; `PROJECT_MAP.md` documents the `APP_URL` expectation.

### Rate limiting

- `POST /api/admin/auth` has request throttling and failed-attempt throttling by IP and email identifier.
- `POST /api/admin/mfa/verify` has IP and challenge-id throttling plus persisted challenge attempt limits.
- `POST /api/leads` has an IP rate limit and a declared 16 KB body cap.
- `POST /api/events` has IP/client rate limits and a declared 8 KB body cap.
- Admin mutations have a light authenticated mutation rate limit after session/CSRF.
- The in-memory limitation remains documented.

### MFA/TOTP

- TOTP is standard HMAC-SHA1 TOTP with 6 digits, 30-second period, and +/-1 step tolerance; it is not Google-only.
- TOTP secrets are encrypted with AES-256-GCM using `MFA_SECRET_ENCRYPTION_KEY` before DB storage.
- Temporary MFA setup secrets expire after 10 minutes.
- MFA challenge tokens are hashed before DB storage.
- MFA challenges expire, have a consumed marker, and have a 5-attempt limit.
- A full admin session is created only after successful MFA verification for MFA-enabled users.
- Recovery codes are generated once at enable time, returned once, stored only as bcrypt hashes, and marked used on successful recovery login.
- Used recovery codes cannot be reused because verification only loads `usedAt: null` codes.
- MFA audit metadata stores admin ids, method/stage/reason/setup id/recovery-code count only. It does not store TOTP secrets, recovery codes, challenge tokens, cookies, password hashes, raw IP, or lead PII.
- MFA disable and recovery-code regeneration are not implemented and are documented as limitations.
- Owner access is not accidentally downgraded: seed/update logic keeps the seeded admin as `OWNER`.

### CSV and PII

- CSV export quotes all cells and prefixes formula-like cells starting with `=`, `+`, `-`, `@`, tab, or carriage return.
- CSV export is limited to lead-handling fields and does not include sessions, admin internals, password hashes, cookies, raw analytics identifiers, or MFA data.
- CSV export creates `lead_exported` with row count and safe filters; raw search text, CSV content, lead names, lead contacts, and lead task text are not stored in audit metadata.
- Reports inspected did not intentionally print lead PII.
- Backup ZIPs were checked by entry names and do not include local DBs, env files, nested ZIPs, dependency/build/cache directories, or logs.

### Security headers and CSP

- `next.config.ts` configures global security headers for `/:path*`.
- HSTS is production-only.
- No permissive CORS headers are configured.
- CSP limitations are documented, especially production `script-src 'unsafe-inline'` and `style-src 'unsafe-inline'`.

## Findings by priority

### P0 critical

None found.

### P1 high

None found.

### P2 medium

1. Body-size caps still rely on `Content-Length`, and several JSON endpoints have no actual read cap.
   - Evidence: `src/app/api/leads/route.ts:10`, `src/app/api/leads/route.ts:28`, `src/app/api/events/route.ts:9`, `src/app/api/events/route.ts:32`; admin JSON reads also appear at `src/app/api/admin/auth/route.ts:56`, `src/app/api/admin/mfa/verify/route.ts:46`, `src/app/api/admin/leads/[id]/route.ts:49`, and `src/app/api/admin/leads/[id]/notes/route.ts:21`.
   - Risk: clients that omit or spoof `Content-Length` can bypass intended caps and force larger JSON parsing work.
   - Recommended next task: add a shared bounded JSON reader that enforces actual bytes read before parsing.

2. Client IP extraction trusts forwarded headers without an enforced trusted-proxy boundary.
   - Evidence: `src/lib/rate-limit.ts:23-31`.
   - Risk: direct exposure or proxy misconfiguration can let attackers rotate spoofed IP headers and bypass IP-keyed limits.
   - Recommended next task: make IP extraction deployment-aware and accept forwarded headers only from a documented trusted proxy path.

3. Rate limiting remains process-local in memory.
   - Evidence: `src/lib/rate-limit.ts:14`, `src/lib/rate-limit.ts:49-52`, `src/lib/rate-limit.ts:170-172`; documented in `PROJECT_MAP.md`.
   - Risk: counters reset on restart and are not shared across multi-instance/serverless deployments.
   - Recommended next task: move login, MFA, public form, event, and admin mutation counters to Redis, Upstash, or DB-backed storage before production exposure.

4. The app schema remains SQLite while the project documentation requires PostgreSQL for production.
   - Evidence: `prisma/schema.prisma:6`; project docs recommend PostgreSQL for production.
   - Risk: SQLite is acceptable for local MVP work, but is not aligned with production durability, backup, concurrency, and scaling expectations for lead/admin/audit data.
   - Recommended next task: create a production deployment plan that migrates Prisma to PostgreSQL with migrations, backups, and restore testing.

5. Production CSP still allows inline scripts and styles.
   - Evidence: `next.config.ts:16-17`; limitation documented in `PROJECT_MAP.md:25`.
   - Risk: inline allowances reduce CSP effectiveness against XSS.
   - Recommended next task: move theme bootstrap to a nonce-based or same-origin external script strategy, then remove production `unsafe-inline` where feasible.

### P3 low

1. Admin role documentation still conflicts with implemented CSV export policy.
   - Evidence: `../docs/04_admin_panel_orders_analytics.md:22-29` gives `MANAGER` export ability, while `PROJECT_MAP.md:116` and `src/app/api/admin/leads/route.ts:21-23` enforce `OWNER`-only CSV export.
   - Risk: future implementation work may reintroduce wider export access by following the older docs.
   - Recommended next task: update the admin docs to make `OWNER`-only export the source of truth, or explicitly document an approved policy change.

2. Quality-command warnings remain.
   - Evidence: `npm.cmd run lint` reported `src/app/admin/leads/page.tsx:64` missing `loadLeads` dependency and `.eslintignore` deprecation.
   - Risk: not a direct security issue, but warnings create noise during later hardening.
   - Recommended next task: resolve the hook dependency warning and move ignores into `eslint.config.mjs`.

3. Some admin audit event labels still store admin email addresses.
   - Evidence: `src/app/api/admin/auth/route.ts:117`, `src/app/api/admin/mfa/verify/route.ts:139`, `src/app/api/admin/logout/route.ts:19`, `src/app/api/admin/leads/[id]/notes/route.ts:44`.
   - Risk: these are not lead PII and do not include tokens/secrets, but using admin ids consistently would reduce personal-data exposure in audit rows.
   - Recommended next task: standardize admin audit labels/metadata on admin ids and non-PII event labels.

## Status of previous P2/P3 findings

- Body-size caps relying only on `Content-Length`: still remains, P2.
- Trusted-proxy/IP extraction concern: still remains, P2.
- In-memory rate limiter: still remains, P2.
- SQLite local DB provider: still remains for current schema, P2 for production readiness.
- Lint warnings: still remain, P3.
- Docs conflict about `MANAGER` CSV export: still remains in `docs/04_admin_panel_orders_analytics.md`; `PROJECT_MAP.md` and code document/enforce `OWNER`-only export.
- Previous CSV export audit/role finding: fixed by `src/app/api/admin/leads/route.ts`.
- Previous security headers/CSP missing stage: fixed by `next.config.ts`; inline CSP allowance remains a documented P2 limitation.

## PROJECT_MAP.md consistency result

`PROJECT_MAP.md` is consistent with the inspected implementation and remains concise enough for a project map.

Confirmed mentions:

- admin-env/password helpers
- server-side admin guard
- CSRF helper and admin-client helper
- rate-limit helper and in-memory limitation
- security headers/CSP location and limitations
- CSV export `OWNER`-only, CSV injection protection, and export audit
- MFA schema/models, helper, API routes, challenge flow, recovery code storage, `MFA_SECRET_ENCRYPTION_KEY`, and limitations
- `reports/security/` convention
- backup ZIP convention and exclusions
- no statement that production default login is the development password

Updated `PROJECT_MAP.md` sections in this audit: none.

## Backup/report hygiene result

- Security reports exist for the hardening stages listed in scope.
- Backup folders and ZIPs were inspected by names/entry names only.
- The before and after ZIPs passed blocked-entry name checks after allowing `.env.example`.
- This report does not include raw secrets, cookies, session tokens, password hashes, CSRF tokens, TOTP secrets, recovery codes, MFA challenge tokens, lead emails/phones, or lead personal data.

## What was not checked

- `.env` contents were not read.
- Local database rows were not read.
- Runtime 401/403/429 behavior was not tested against a running server.
- Browser/manual login/MFA/TOTP app verification was not performed.
- ZIP file contents were not read beyond entry names for exclusion checks.
- No external deployment/proxy configuration was inspected.

## Risks and doubts

- `MFA_SECRET_ENCRYPTION_KEY` must be backed up securely. Losing it prevents decrypting existing TOTP secrets.
- Recovery-code regeneration and MFA disable are missing operational flows; losing both TOTP access and recovery codes can require operator/database recovery.
- The current CSP is a useful baseline but is not yet a strong XSS mitigation while production inline script/style allowances remain.
- Rate limiting and IP extraction are suitable only for local/single-instance use until a trusted proxy contract and shared counter store are implemented.

## Recommended next 3 practical tasks

1. Implement MFA recovery-code regeneration and MFA disable with password plus current TOTP or recovery-code confirmation.
2. Add a shared bounded JSON reader for public/admin JSON endpoints so actual request bytes are capped before parsing.
3. Replace in-memory rate limits with Redis/DB-backed counters and harden trusted-proxy-aware IP extraction.

## Secret and personal-data confirmation

Secrets, raw cookies, session tokens, password hashes, CSRF tokens, TOTP secrets, recovery codes, MFA challenge tokens, local database contents, lead emails/phones, and lead personal data were not intentionally printed, written into this report, or included in the checkpoint ZIPs.
