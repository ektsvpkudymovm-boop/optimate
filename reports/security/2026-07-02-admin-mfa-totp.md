# Admin MFA TOTP security stage

Date: 2026-07-02

## Task goal

Add standard TOTP MFA for the admin area with one-time recovery codes, without breaking existing admin auth/session/CSRF/rate-limit/role flows, public pages, lead form, CSV export, or security headers.

## Changed files

- `prisma/schema.prisma`
- `.env.example`
- `PROJECT_MAP.md`
- `src/lib/mfa.ts`
- `src/lib/rate-limit.ts`
- `src/proxy.ts`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/mfa/status/route.ts`
- `src/app/api/admin/mfa/setup/route.ts`
- `src/app/api/admin/mfa/enable/route.ts`
- `src/app/api/admin/mfa/verify/route.ts`
- `src/app/admin/login/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/components/admin/mfa-settings.tsx`
- `src/generated/prisma/`

## Backup ZIP paths

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-1950-before-admin-mfa-totp.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-1959-after-admin-mfa-totp.zip`

Note: an earlier timed-out archive attempt produced `backup-optimatesite-20260702-1948-before-admin-mfa-totp.zip`; it is not the referenced task backup.

## ZIP exclusions

Used tar exclusions for `node_modules`, `.next`, `dist`, `build`, `.git`, `.env`, `.env.local`, `.env.production`, nested env files, `prisma/dev.db`, root `dev.db`, nested `dev.db`, existing backup ZIPs, ZIPs under `backups`, `.mimocode/node_modules`, and `.playwright-cli`.

The final after ZIP was checked with `tar -tf ... | Select-String` for forbidden path patterns and returned no matches.

## Inspected files

- `docs/00_README.md`
- `docs/03_tech_stack_and_architecture.md`
- `docs/04_admin_panel_orders_analytics.md`
- `package.json`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/auth.ts`
- `src/lib/password.ts`
- `src/lib/rate-limit.ts`
- `src/lib/db.ts`
- `src/lib/admin-client.ts`
- `src/lib/admin-env.ts`
- `src/proxy.ts`
- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/app/admin/settings/page.tsx`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/leads/route.ts`
- `PROJECT_MAP.md`

## MFA design implemented

- Standard TOTP, not Google-only MFA.
- TOTP is compatible with apps that support otpauth/TOTP, including Aegis, 2FAS, Яндекс Ключ/ID, Microsoft Authenticator, Google Authenticator, Bitwarden Authenticator, Ente Auth, Proton Authenticator, and similar apps.
- TOTP uses HMAC-SHA1, 6 digits, 30-second period, and +/- 1 time-step validation window.
- TOTP setup is staged: start setup, show manual Base32 secret and `otpauth://` URL, verify first code, then enable MFA.
- TOTP secret is encrypted before database storage with AES-256-GCM and `MFA_SECRET_ENCRYPTION_KEY`.
- Recovery codes are generated only after first TOTP verification succeeds, shown only once in the UI response, and stored only as bcrypt hashes.
- Login is staged for MFA-enabled admins: password success creates an MFA challenge, not a full session. Full session and CSRF cookie are created only after TOTP or recovery code verification.

## Prisma/schema changes and migration notes

- Added `AdminUser.mfaEnabled`, `AdminUser.mfaSecretEncrypted`, and `AdminUser.mfaEnabledAt`.
- Added `AdminMfaSetup` for temporary encrypted setup secrets with 10-minute expiry.
- Added `AdminMfaChallenge` for login challenges with hashed challenge tokens, expiry, attempts, and consumed marker.
- Added `AdminRecoveryCode` with bcrypt `codeHash` and `usedAt`.
- Ran `npx.cmd prisma db push` against local SQLite `prisma/dev.db`; it completed successfully.
- Ran `npx.cmd prisma generate`; it completed successfully and updated `src/generated/prisma/`.
- No named Prisma migration folder was created in this stage; the project currently uses SQLite local dev with `db push`.

## New env variables

- `MFA_SECRET_ENCRYPTION_KEY`

The value must be high entropy. Accepted forms: 64-character hex, 32-byte base64, or any 32+ character string that is SHA-256 derived before AES-256-GCM use. MFA setup returns `500` if the key is missing or too weak.

## Login flow changes

- Admin without MFA: existing email/password flow still creates `admin_session` and `admin_csrf`.
- Admin with MFA: valid email/password creates `AdminMfaChallenge` and returns `mfaRequired`, `challengeId`, and `challengeToken`.
- The login page switches to a second step for TOTP or recovery code.
- `POST /api/admin/mfa/verify` checks challenge id/token, challenge expiry, attempts, TOTP/recovery code, then creates the session and CSRF cookie.
- `/api/admin/mfa/verify` is the only new admin API path allowed through the early proxy without an existing session cookie.

## Setup/enable/recovery code flow

- `POST /api/admin/mfa/setup`: OWNER-only, requires current admin session, CSRF, and authenticated mutation rate limit. Creates encrypted temporary setup secret and returns manual secret plus `otpauth://` URL once for setup.
- `POST /api/admin/mfa/enable`: OWNER-only, requires session, CSRF, mutation rate limit, setup id, and first TOTP code. Wrong code does not enable MFA. Correct code enables MFA and returns 10 recovery codes once.
- `POST /api/admin/mfa/verify`: accepts either a current TOTP code or one unused recovery code. Recovery code success marks that code used and logs `mfa_recovery_code_used`.

## Rate limits and attempt limits

- Password login keeps existing request and failure rate limits.
- MFA setup/enable uses the existing authenticated admin mutation limiter.
- MFA verify uses `adminMfaVerifyRateLimit`: 20 requests per IP per 15 minutes and 7 requests per challenge id per 15 minutes.
- Each persisted challenge allows 5 failed code attempts before it is rejected.
- Challenges expire after 10 minutes.
- Setup secrets expire after 10 minutes.

## Audit event design

Events written to `AnalyticsEvent`:

- `mfa_setup_started`
- `mfa_enabled`
- `mfa_failed`
- `mfa_success`
- `mfa_recovery_code_used`
- Existing `admin_login` is still written after successful full login.

Audit metadata stores only admin user id, setup id, stage/reason/method, or recovery code count. It does not store TOTP secrets, raw recovery codes, challenge tokens, CSRF tokens, session cookies, password hashes, raw IP, or lead PII.

`mfa_disabled` was not implemented in this stage.

## Manual verification steps

1. Admin without MFA can still login as before.
2. OWNER can start MFA setup from admin settings.
3. TOTP secret/otpauth URL is shown only during setup.
4. Wrong first TOTP code does not enable MFA.
5. Correct first TOTP code enables MFA and generates recovery codes.
6. Recovery codes are shown only once and stored only as hashes.
7. Admin with MFA enabled enters password and receives MFA challenge, not full session.
8. Wrong TOTP during login fails and increments attempts.
9. Expired MFA challenge fails.
10. Correct TOTP creates `admin_session` and `admin_csrf` cookies.
11. Used recovery code cannot be reused.
12. Existing admin CSRF/role/rate-limit behavior remains working.
13. CSV export still works for OWNER after MFA login.
14. VIEWER/MANAGER role restrictions remain intact.

Browser/manual verification was not run because project runtime guardrails prohibit automatic browser/Playwright checks.

## Commands run and results

- `npx.cmd prisma db push` - passed.
- `npx.cmd prisma generate` - passed.
- `npm.cmd run lint` - passed with one warning in pre-existing `src/app/admin/leads/page.tsx`: `React Hook useEffect has a missing dependency: 'loadLeads'`; also ESLint warned that `.eslintignore` is no longer supported.
- `npx.cmd tsc --noEmit` - passed.
- `npm.cmd run build` - passed.
- `tar -tf backup-optimatesite-20260702-1959-after-admin-mfa-totp.zip | Select-String ...` - no forbidden path matches.

## What was not checked

- No browser UI walkthrough was performed.
- No live TOTP app scan/manual code verification was performed.
- No CSV export manual flow after MFA login was performed.
- No multi-instance/serverless rate-limit behavior was checked.

## What was not done

- MFA disable flow was not implemented. It should require password plus current TOTP or recovery code.
- Recovery code regeneration after setup was not implemented.
- QR bitmap generation was not added; the UI provides manual secret and `otpauth://` URL.
- No named Prisma migration folder was created; local schema was applied with `db push`.
- In-memory rate limits were not moved to Redis/database-backed storage.

## Risks/doubts

- `MFA_SECRET_ENCRYPTION_KEY` must be backed up securely. If it is lost, existing encrypted TOTP secrets cannot be decrypted.
- Existing project files contain mojibake text in several UI strings; this task did not repair encoding globally.
- In-memory rate limiting remains process-local and is not enough for multi-instance production.
- Recovery codes are intentionally shown once; losing both TOTP access and recovery codes can lock out an MFA-enabled owner until database/operator recovery.

## Recommended next security task

Implement MFA disable and recovery-code regeneration with password plus TOTP/recovery confirmation, then move admin/login/MFA rate limits to shared Redis or database-backed counters for production.

## Secret and PII confirmation

I did not print TOTP secrets, recovery codes, session tokens, CSRF tokens, password hashes, cookies, lead PII, or passwords in console output, final report contents, or ZIP verification output. The only secret-like values in files are safe placeholders in `.env.example`. Backup ZIP exclusions omit env files, local DB files, build caches, dependencies, `.git`, and nested backup ZIPs.

## PROJECT_MAP.md confirmation

`PROJECT_MAP.md` was updated with the new MFA schema fields/models, helper file, API routes, login flow, recovery-code storage rule, `MFA_SECRET_ENCRYPTION_KEY`, audit event design, challenge limits, and known limitations.
