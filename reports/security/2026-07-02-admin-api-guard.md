# Admin API guard hardening report

Date: 2026-07-02

## Task goal

Audit and harden all `src/app/api/admin/**/route.ts` handlers so admin API data and mutation endpoints enforce admin session verification server-side, not only through `src/proxy.ts`, admin layout checks, or client UI.

## Changed files

- `src/lib/auth.ts`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/leads/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/api/admin/analytics/route.ts`
- `PROJECT_MAP.md`
- `reports/security/2026-07-02-admin-api-guard.md`

## Created backup ZIP paths

- Before changes: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-1812-before-admin-api-guard.zip`
- After changes: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-1815-after-admin-api-guard.zip`

## Backup exclusions

The backup command excluded:

- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `.git/`
- `backups/`
- `.env`
- `.env.local`
- `.env.production`
- `*.zip`
- `*.db`
- `*.log`

This intentionally excludes existing backup archives, local SQLite databases such as `dev.db` and `prisma/dev.db`, logs, generated build output, and env files.

## Inspected admin API routes

- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/leads/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/api/admin/analytics/route.ts`

## Already protected before this task

These routes already had direct server-side `getSessionUser()` checks returning `401` when there was no valid session:

- `GET /api/admin/auth`
- `GET /api/admin/leads`
- `GET /api/admin/leads/[id]`
- `PATCH /api/admin/leads/[id]`
- `POST /api/admin/leads/[id]/notes`
- `GET /api/admin/analytics`

`POST /api/admin/logout` checked the current user for audit logging but returned success even without a valid session, so it was not consistently protected.

## Routes changed

- `GET /api/admin/auth` now uses the shared `requireAdmin()` guard for session-check behavior.
- `POST /api/admin/logout` now requires a valid admin session before writing `admin_logout` and destroying the session.
- `GET /api/admin/leads` now uses `requireAdmin()`.
- `GET /api/admin/leads/[id]` now uses `requireAdmin()`.
- `PATCH /api/admin/leads/[id]` now uses `requireAdmin()`.
- `POST /api/admin/leads/[id]/notes` now uses `requireAdmin()` and continues to use the authenticated admin as note author.
- `GET /api/admin/analytics` now uses `requireAdmin()`.

`POST /api/admin/auth` remains accessible without an existing session so password login is not broken.

## Reusable guard

The reusable server-side guard is in `src/lib/auth.ts`:

- `getCurrentAdmin()` reads the `admin_session` cookie server-side, hashes the raw cookie value with SHA-256, looks up `AdminSession.tokenHash`, verifies expiration, verifies the linked admin user is present, deletes expired sessions, and returns the admin user or `null`.
- `unauthorizedAdminResponse()` returns a neutral response: `{ "error": "Unauthorized" }` with status `401`.
- `requireAdmin()` wraps `getCurrentAdmin()` and returns either `{ ok: true, user }` or `{ ok: false, response }`.

The guard does not log raw session tokens.

## Unauthorized behavior

Protected admin endpoints now consistently return:

```json
{ "error": "Unauthorized" }
```

with HTTP status `401` when no valid admin session is present. The response does not include stack traces, cookie values, session tokens, database details, or whether a matching admin user exists.

## Login flow

- `POST /api/admin/auth` still parses email/password and can create a session without an existing session.
- Invalid body still returns `400`.
- Invalid credentials still return `401`.
- Successful login still sets the `admin_session` httpOnly cookie through `createSession()`.
- `GET /api/admin/auth` is the session-check path and now uses the shared server-side guard.

## Client and proxy checks

`src/proxy.ts` and `src/app/admin/layout.tsx` remain useful as early routing and UX checks. They are not the final security boundary. The final boundary for admin API data is now the server-side guard inside each protected route handler.

## Commands run and results

- `npm run lint`
  - Result: failed to start in PowerShell because `npm.ps1` execution is disabled by local execution policy.
- `npx tsc --noEmit`
  - Result: failed to start in PowerShell because `npx.ps1` execution is disabled by local execution policy.
- `npm.cmd run lint`
  - Result: passed with 1 existing warning in `src/app/admin/leads/page.tsx` about `React Hook useEffect` missing dependency `loadLeads`, plus an ESLint notice that `.eslintignore` is no longer supported. These are not caused by this guard change.
- `npx.cmd tsc --noEmit`
  - Result: passed.
- `npm.cmd run build`
  - Result: passed. Next.js built all public, admin, and API routes successfully.

No `npm run test` command exists in `package.json`, so no test command was run.

## Manual verification steps

Do not open a browser automatically. If a dev server is running manually, use PowerShell commands like these:

1. Unauthenticated leads list:
   `Invoke-WebRequest -Uri http://localhost:3000/api/admin/leads -Method GET -SkipHttpErrorCheck`
   Expected: `401` with `{ "error": "Unauthorized" }`.
2. Unauthenticated analytics:
   `Invoke-WebRequest -Uri http://localhost:3000/api/admin/analytics -Method GET -SkipHttpErrorCheck`
   Expected: `401` with `{ "error": "Unauthorized" }`.
3. Unauthenticated lead detail:
   `Invoke-WebRequest -Uri http://localhost:3000/api/admin/leads/test-id -Method GET -SkipHttpErrorCheck`
   Expected: `401` with `{ "error": "Unauthorized" }`.
4. Unauthenticated note creation:
   `Invoke-WebRequest -Uri http://localhost:3000/api/admin/leads/test-id/notes -Method POST -ContentType 'application/json' -Body '{"text":"test"}' -SkipHttpErrorCheck`
   Expected: `401` with `{ "error": "Unauthorized" }`.
5. Development login:
   `Invoke-WebRequest -Uri http://localhost:3000/api/admin/auth -Method POST -ContentType 'application/json' -Body '{"email":"admin@optimatesite.ru","password":"admin123"}' -SessionVariable s`
   Expected: `200`, response with `success: true`, and an httpOnly session cookie.
6. Authenticated protected request:
   `Invoke-WebRequest -Uri http://localhost:3000/api/admin/leads -Method GET -WebSession $s -SkipHttpErrorCheck`
   Expected: `200` with leads payload.
7. Logout:
   `Invoke-WebRequest -Uri http://localhost:3000/api/admin/logout -Method POST -WebSession $s -SkipHttpErrorCheck`
   Expected: `200` with `{ "success": true }`, session removed in DB and cookie cleared by response.

## What was not done

- No full auth architecture rewrite.
- No browser automation, Playwright, Puppeteer, or automatic localhost browser opening.
- No dev server was started.
- No new test framework was added because the project does not currently define a test setup.
- No role-based authorization changes were made; this task only enforces authenticated admin session presence.

## Risks and doubts

- The route handlers still use the current role model as-is. They verify that a valid admin exists, but do not distinguish `OWNER`, `MANAGER`, and `VIEWER` permissions per endpoint.
- Admin mutation routes do not yet show explicit CSRF protection beyond same-site cookie settings and existing route checks.
- Audit events store admin email in `label` for login/logout/note events. This existed before this task; avoid exposing audit tables publicly.
- `src/app/admin/layout.tsx` remains a client component and its check is UX-only.

## Session token storage

`prisma/schema.prisma` defines `AdminSession.tokenHash String @unique`, and `createSession()` stores `hashToken(token)` rather than the raw token. A raw-session-token-at-rest defect was not found in this audit.

## Recommended next security task

Add CSRF protection for admin mutation endpoints (`POST /api/admin/logout`, `PATCH /api/admin/leads/[id]`, `POST /api/admin/leads/[id]/notes`) and define role-based authorization rules for `OWNER`, `MANAGER`, and `VIEWER`.

## Confirmation

- Secrets, raw cookies, session tokens, password hashes, and real personal data were not printed in this report.
- Backup ZIPs were created with exclusions for env files, local databases, logs, `.git`, build output, dependencies, and existing ZIPs.
- `PROJECT_MAP.md` was updated to mention the reusable server-side admin guard, server-side protection for `/api/admin/*`, and the hashed session-token storage note.
