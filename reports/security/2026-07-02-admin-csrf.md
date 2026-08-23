# Admin CSRF Protection Report

## Task goal

Add minimal CSRF protection for authenticated admin mutation API routes that use the cookie-based admin session, without changing the login flow or public pages.

## Changed files

- `src/lib/auth.ts`
- `src/lib/admin-client.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/admin/layout.tsx`
- `src/app/admin/leads/[id]/page.tsx`
- `PROJECT_MAP.md`
- `reports/security/2026-07-02-admin-csrf.md`

## Created backup ZIP paths

- Before changes: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\backup-optimatesite-20260702-1833-before-admin-csrf.zip`
- After changes: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\backup-optimatesite-20260702-1834-after-admin-csrf.zip`

The sanitized before archive was rebuilt from the ZIP created before code changes, with service/dependency folders removed from the archive.

## Excluded backup files and folders

- `.git/`
- `.mimocode/`
- `.playwright-cli/`
- `backups/`
- `site/.git/`
- `site/node_modules/`
- `site/.next/`
- `site/backups/`
- `site/dist/`
- `site/build/`
- `site/.env`
- `site/.env.local`
- `site/.env.production`
- `site/dev.db`
- `site/prisma/dev.db`
- `backup-optimatesite-*.zip`

## Inspected admin mutation routes

- `POST /api/admin/auth`
- `POST /api/admin/logout`
- `PATCH /api/admin/leads/[id]`
- `POST /api/admin/leads/[id]/notes`

No other `POST`, `PATCH`, `PUT`, or `DELETE` route handlers were found under `src/app/api/admin/**/route.ts`.

## Routes protected by CSRF

- `POST /api/admin/logout`
- `PATCH /api/admin/leads/[id]`
- `POST /api/admin/leads/[id]/notes`

## Routes intentionally excluded

- `POST /api/admin/auth` is the password login endpoint. It remains accessible without CSRF because there is no authenticated admin session or CSRF cookie before login.
- Admin `GET` routes remain protected by session authentication only because they do not mutate server state.

## CSRF design chosen

Implemented a double-submit CSRF token pattern:

- `createCsrfToken()` creates a cryptographically random token with Node `crypto.randomBytes`.
- `setAdminCsrfCookie()` sets the readable CSRF cookie after successful admin login.
- `clearAdminCsrfCookie()` clears the CSRF cookie during logout/session destruction.
- `verifyAdminCsrf()` compares the `admin_csrf` cookie with the `X-CSRF-Token` header using `crypto.timingSafeEqual` when lengths match.
- `requireAdminMutation()` first verifies the admin session, then verifies CSRF.

A lightweight Origin check was added for protected admin mutations. If an `Origin` header is present, it must match the request origin or `APP_URL` origin when configured.

## Cookie names and security flags

- `admin_session`: existing httpOnly admin session cookie, `sameSite=lax`, `secure` in production, `path=/`, 7-day max age.
- `admin_csrf`: readable admin CSRF cookie, `httpOnly=false`, `sameSite=lax`, `secure` in production, `path=/`, 7-day max age.

`admin_csrf` uses `path=/` because admin pages live under `/admin/*` but admin API handlers live under `/api/admin/*`; a narrower `/admin` path would not be sent to the API route.

## Client-side fetch changes

Added `src/lib/admin-client.ts` with `adminMutationFetch()`. It reads `admin_csrf` from `document.cookie` and attaches it as `X-CSRF-Token` for admin mutation requests.

Updated admin client calls:

- Logout in `src/app/admin/layout.tsx`
- Lead status update in `src/app/admin/leads/[id]/page.tsx`
- Lead note creation in `src/app/admin/leads/[id]/page.tsx`

## Unauthorized vs forbidden behavior

- Missing or invalid admin session returns `{ "error": "Unauthorized" }` with HTTP 401.
- Valid admin session with missing, mismatched, or invalid-origin CSRF data returns `{ "error": "Forbidden" }` with HTTP 403.
- Internal details and token values are not exposed.

## Manual verification steps

Use the browser manually or PowerShell `Invoke-WebRequest` against a running local app. Do not print cookies or token values in shared logs.

1. Unauthenticated `PATCH /api/admin/leads/[id]` returns 401.
2. Authenticated `PATCH /api/admin/leads/[id]` without `X-CSRF-Token` returns 403.
3. Authenticated `PATCH /api/admin/leads/[id]` with wrong `X-CSRF-Token` returns 403.
4. Authenticated `PATCH /api/admin/leads/[id]` with correct `X-CSRF-Token` works.
5. Authenticated `POST /api/admin/leads/[id]/notes` without `X-CSRF-Token` returns 403.
6. Authenticated `POST /api/admin/leads/[id]/notes` with correct `X-CSRF-Token` works.
7. Authenticated `POST /api/admin/logout` without `X-CSRF-Token` returns 403.
8. Authenticated `POST /api/admin/logout` with correct `X-CSRF-Token` clears both session and CSRF cookies.
9. `POST /api/admin/auth` login still works without CSRF token.
10. After login, the admin client can still update lead status and create notes normally.

## Commands run and results

- `npm.cmd run lint`: passed with one warning in `src/app/admin/leads/page.tsx` about a missing `useEffect` dependency and one ESLint notice about `.eslintignore`.
- `npx.cmd tsc --noEmit`: passed.
- `npm.cmd run build`: passed.

## What was not done

- No browser automation or Playwright verification was run, per project runtime guardrails.
- No dev server was started.
- No database migration was needed.
- CSRF tokens are not stored server-side; the chosen design is double-submit cookie.

## Risks and doubts

- The readable CSRF cookie is intentionally accessible to admin client JavaScript; this is expected for double-submit CSRF and does not replace XSS prevention.
- `admin_csrf` must use `path=/` for compatibility with both `/admin/*` pages and `/api/admin/*` handlers.
- The Origin check allows the request origin and `APP_URL` when configured; production deployment should set `APP_URL` correctly.

## Recommended next security task

Add or tighten security headers, especially CSP, `X-Frame-Options` or `frame-ancestors`, and `Referrer-Policy`, then verify they do not break public pages or admin pages.

## Confirmations

- Secrets, CSRF tokens, session cookies, password hashes, and real personal data were not printed in this report.
- Backup ZIP commands exclude env files, local databases, generated build output, dependency folders, Git metadata, and backup ZIPs.
- `PROJECT_MAP.md` was updated with the CSRF helper/client helper, `admin_csrf` cookie, `X-CSRF-Token` requirement, and `POST /api/admin/auth` exclusion.
