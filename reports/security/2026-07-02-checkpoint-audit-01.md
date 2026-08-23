# OptiMate checkpoint security audit 01

Date: 2026-07-02

## Audit scope

Checkpoint audit after the first security hardening stages for admin credential safety, admin API server-side guards, CSRF protection, rate limiting, report hygiene, backup hygiene, and `PROJECT_MAP.md` consistency.

No new features were added and no security logic was changed. The only project file change outside this report was a small `PROJECT_MAP.md` clarification for before/after backup ZIP naming and recursive backup exclusions.

## Files inspected

- `PROJECT_MAP.md`
- `.env.example`
- `.gitignore`
- `package.json`
- `src/instrumentation.ts`
- `src/proxy.ts`
- `src/lib/admin-env.ts`
- `src/lib/password.ts`
- `src/lib/auth.ts`
- `src/lib/admin-client.ts`
- `src/lib/rate-limit.ts`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/leads/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/api/admin/analytics/route.ts`
- `src/app/api/leads/route.ts`
- `src/app/api/events/route.ts`
- `src/app/admin/layout.tsx`
- `src/app/admin/leads/[id]/page.tsx`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `reports/security/*.md`
- Backup directory file names and ZIP entry names only

## Backup ZIP paths

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-1852-before-checkpoint-audit-01.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-1854-after-checkpoint-audit-01.zip`

Note: an initial before-ZIP attempt was detected as non-compliant because the path-name check showed `prisma/dev.db` inside it. That archive was removed and replaced with the compliant before ZIP listed above.

## ZIP exclusions

The checkpoint backup command excluded:

- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `.git/`
- `backups/`
- `_project_backups/`
- `.env`, `.env.local`, `.env.production`, and other `.env*` files except `.env.example`
- `dev.db`, `dev.db-*`, `prisma/dev.db`, `prisma/dev.db-*`
- `*.log`
- `*.zip`
- `*.tsbuildinfo`
- generated Prisma client under `src/generated/`

The before and after ZIPs were checked by entry path/name after creation. No blocked entries were found. `.env.example` is intentionally allowed as a placeholder file.

## Commands run and results

- `npm.cmd run lint`: passed with 0 errors. Existing warnings: one `react-hooks/exhaustive-deps` warning in `src/app/admin/leads/page.tsx`, plus ESLint's `.eslintignore` deprecation warning.
- `npx.cmd tsc --noEmit`: passed.
- `npm.cmd run build`: passed. Next.js build completed successfully.

No dev server was started. No browser automation was used.

## Confirmed protections

### Admin auth and env

- Production admin initialization calls `validateAdminEnv()` through `src/instrumentation.ts` and `src/app/api/admin/auth/route.ts`.
- Production requires non-empty `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- Production rejects the development default password and passwords shorter than 12 characters.
- Development default admin credentials require `ALLOW_DEV_ADMIN_PASSWORD=true`.
- `prisma/seed.ts` stores `passwordHash` only and uses the shared password helper.

### Session security

- `admin_session` is set as `httpOnly`, `sameSite=lax`, `path=/`, 7-day max age, and `secure` in production.
- `AdminSession.tokenHash` is stored instead of raw session token.
- Expired sessions are rejected and deleted during current-admin lookup.

### Admin API guard

- `GET /api/admin/auth` uses `requireAdmin()`.
- `POST /api/admin/auth` remains public for login and is intentionally excluded from CSRF.
- `GET /api/admin/leads`, `GET /api/admin/leads/[id]`, and `GET /api/admin/analytics` use server-side `requireAdmin()`.
- `POST /api/admin/logout`, `PATCH /api/admin/leads/[id]`, and `POST /api/admin/leads/[id]/notes` use `requireAdminMutation()`.
- Unauthorized admin responses are neutral `401`; CSRF failures are neutral `403`.

### CSRF

- Double-submit CSRF is implemented with readable `admin_csrf` cookie and `X-CSRF-Token` header.
- CSRF verification includes an Origin check against request origin and optional `APP_URL`.
- Logout clears both session and CSRF cookies.
- Admin client mutations use `adminMutationFetch()` instead of hardcoded token values.

### Rate limiting

- Admin login has request throttling and failed-attempt throttling.
- Invalid admin email and wrong password produce the same neutral `401` message.
- Public lead submission has an IP rate limit and a declared 16 KB body cap.
- Public analytics events have IP/client rate limits and a declared 8 KB body cap.
- Authenticated admin mutations have a light IP/user mutation limiter after session and CSRF checks.
- The in-memory limiter limitation is documented in `PROJECT_MAP.md` and the rate-limit report.

## Findings by priority

### P0 critical

None found.

### P1 high

None found.

### P2 medium

1. Body-size caps rely only on `Content-Length`.
   - Evidence: `src/app/api/leads/route.ts:9-15` and `src/app/api/events/route.ts:8-14` return false when the header is absent, then `request.json()` reads the body.
   - Risk: a client that omits or manipulates `Content-Length` can bypass the intended cap and increase memory/CPU pressure.
   - Recommended next task: add a shared bounded JSON reader for public endpoints that enforces actual bytes read, not only the declared header.

2. CSV export of lead PII is protected by admin auth but is not audit-logged.
   - Evidence: CSV branch in `src/app/api/admin/leads/route.ts:39-76` returns exported lead data but does not create a `lead_exported` event.
   - Risk: PII export accountability is incomplete; this matters because the export contains lead contact and task data.
   - Recommended next task: add `lead_exported` audit event with admin id, filters, count, timestamp, and no raw lead PII in metadata.

3. Role names exist but route handlers do not enforce role-based permissions.
   - Evidence: `prisma/schema.prisma:10-18` stores `AdminUser.role`, while protected routes only check for any valid admin session through `requireAdmin()` / `requireAdminMutation()`.
   - Risk: a `VIEWER` or lower-privilege account would be able to access lead PII, export CSV, change status, and add notes if such users are created later.
   - Recommended next task: add small role guards for export and mutations before adding more admin users.

4. Rate limiting trusts forwarded IP headers without an enforced trusted-proxy boundary.
   - Evidence: `src/lib/rate-limit.ts` reads `x-forwarded-for`, `x-real-ip`, and `cf-connecting-ip` directly.
   - Risk: if the app is exposed directly or through a proxy that forwards user-supplied headers, attackers can rotate spoofed IP values and bypass IP-based limits.
   - Recommended next task: make client IP extraction deployment-aware and document the exact reverse proxy contract.

### P3 low

1. `PROJECT_MAP.md` backup convention was too narrow.
   - Evidence: it previously documented only `after-<stage>` naming.
   - Status: fixed in this audit by documenting both `before-<stage>` and `after-<stage>` and explicit recursive exclusions for local DBs and nested backup ZIPs.

2. Quality-command warnings remain.
   - Evidence: `npm.cmd run lint` passed with one `react-hooks/exhaustive-deps` warning and one `.eslintignore` deprecation warning.
   - Risk: not a direct security issue, but cleanup will reduce noise during later security changes.

## PROJECT_MAP.md consistency result

Consistent after the small documentation update.

Confirmed mentions:

- admin-env helper
- password helper
- server-side admin guard
- CSRF helper and admin-client helper
- rate-limit helper and affected endpoints
- `reports/security/` convention
- backup ZIP convention
- env/database/archive safety warnings
- no incorrect statement that default production login uses the development password

Updated section: `Backup ZIP convention`.

## Backup/report hygiene result

- Security reports exist for completed hardening stages: admin env hardening, admin API guard, admin CSRF, and rate-limit hardening.
- Reports were reviewed by keyword search and manual inspection for secret/token hygiene. No raw cookies, raw session tokens, CSRF token values, password hashes, lead emails, lead phones, or local database contents were intentionally printed.
- Backup entry names were checked without printing or reading database contents.
- The final before and after ZIP paths passed the blocked-entry path/name check.

## What was not checked

- No `.env` contents were read.
- No local database rows were read.
- No raw cookies, sessions, CSRF tokens, password hashes, or lead personal data were printed.
- No manual browser login/API flow was executed.
- No runtime test was performed for real 401/403/429 responses because the dev server was not started.
- ZIP contents were not printed beyond file names needed for path-based exclusion verification.

## Risks and doubts

- The current database provider is SQLite in `prisma/schema.prisma`; project docs recommend PostgreSQL for production. This audit treated that as a known MVP/local setup issue, not as a hardening regression.
- In-memory rate limiting remains a single-process/single-instance control and should not be relied on for multi-instance or serverless production.
- Admin audit logging is implemented through `AnalyticsEvent`, which is acceptable for MVP but will need stronger structure before production operations.

## Recommended next 3 security tasks

1. Add security headers and CSP.
2. Harden CSV export and PII handling, including `lead_exported` audit event and role checks.
3. Replace or augment in-memory rate limiting with a Redis/DB-backed distributed limiter and trusted-proxy-aware IP extraction.

## Secret and personal-data confirmation

Secrets, raw cookies, session tokens, CSRF token values, password hashes, local database contents, and lead personal data were not intentionally printed in this report or included in the compliant before/after ZIPs.
