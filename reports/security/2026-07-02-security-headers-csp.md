# Security headers and CSP

Date: 2026-07-02

## Task goal

Add safe global HTTP security headers and a practical baseline Content Security Policy for public pages, admin pages, and API routes without changing admin auth/session/CSRF/rate-limit behavior, public forms, analytics events, or local development flows.

## Changed files

- `next.config.ts`
- `PROJECT_MAP.md`
- `reports/security/2026-07-02-security-headers-csp.md`

## Backup ZIP paths

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-1923-before-security-headers-csp.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-1925-after-security-headers-csp.zip`

## ZIP exclusions

Excluded from backup archives:

- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `.git/`
- `backups/`
- `_project_backups/`
- `.env`
- `.env.local`
- `.env.production`
- `dev.db`
- nested `*.zip` archives

`prisma/dev.db` exists in this project state and is excluded by policy. No logs, tokens, cookies, password hashes, lead emails, lead phones, or other personal data were included intentionally.

Archive audit note: the first archive-content check detected `prisma/dev.db` in the generated ZIPs. That entry was removed from both before/after ZIP archives, and a follow-up ZIP scan reported no forbidden entries.

## Inspected files and areas

- `..\docs\00_README.md`
- `..\docs\03_tech_stack_and_architecture.md`
- `..\docs\07_seo_analytics_security_acceptance.md`
- `node_modules\next\dist\docs\01-app\03-api-reference\05-config\01-next-config-js\headers.md`
- `node_modules\next\dist\docs\01-app\02-guides\content-security-policy.md`
- `next.config.ts`
- `src\proxy.ts`
- `src\app\layout.tsx`
- `src\app\globals.css`
- `PROJECT_MAP.md`
- External resource/script search across `src/`, `public/`, and `next.config.ts`

## Headers added

Configured globally in `next.config.ts` through `headers()` with `source: "/:path*"`.

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()`
- `X-Frame-Options: DENY`
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`
- `X-DNS-Prefetch-Control: off`
- Production only: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## CSP policy added

Production baseline:

```text
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests
```

Development baseline:

```text
default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'
```

## Development vs production differences

- Development does not send HSTS.
- Development does not include `upgrade-insecure-requests`.
- Development allows localhost HTTP and WebSocket connections for Next dev tooling.
- Development allows `script-src 'unsafe-eval'` because Next development tooling can require it.
- Production adds HSTS and `upgrade-insecure-requests`.

## Intentionally not added

- HSTS `preload` was not added because final HTTPS-only deployment and subdomain readiness are not confirmed.
- Permissive CORS headers were not added. Existing same-origin API behavior remains unchanged.
- `X-XSS-Protection` was not added because it is obsolete.
- A complex nonce architecture was not added in this stage because `src/app/layout.tsx` currently contains a small inline theme bootstrap script. Production CSP temporarily allows `script-src 'unsafe-inline'` to avoid breaking theme initialization. Follow-up: move to a nonce-based CSP or an external same-origin theme bootstrap script, then remove production inline script allowance.

## Manual verification steps

Run only after the project owner starts a local server manually.

```powershell
$home = Invoke-WebRequest -Uri http://localhost:3000/ -Method GET
$home.Headers["Content-Security-Policy"]
$home.Headers["X-Content-Type-Options"]
$home.Headers["Referrer-Policy"]
$home.Headers["Permissions-Policy"]
$home.Headers["X-Frame-Options"]

$login = Invoke-WebRequest -Uri http://localhost:3000/admin/login -Method GET
$login.Headers["Content-Security-Policy"]
$login.Headers["X-Content-Type-Options"]

$events = Invoke-WebRequest -Uri http://localhost:3000/api/events -Method OPTIONS
$events.Headers["Content-Security-Policy"]
```

Manual scenarios to verify:

1. Home page response includes security headers.
2. Admin login page response includes security headers.
3. Public pages still build and render.
4. Admin pages still build and render.
5. API routes still build and JSON responses still work.
6. CSP does not block theme toggle, cookie banner, lead form, admin login, lead status update, note creation, or analytics events in expected production usage.
7. No permissive CORS was introduced.
8. HSTS is present only in production and remains without `preload`.

## Commands run and results

```powershell
npm.cmd run lint
```

Result: passed with 1 existing warning:

```text
src\app\admin\leads\page.tsx
  64:6  warning  React Hook useEffect has a missing dependency: 'loadLeads'
```

ESLint also printed the existing `.eslintignore` deprecation warning.

```powershell
npx.cmd tsc --noEmit
```

Result: passed.

```powershell
npm.cmd run build
```

Result: passed. Next.js 16.2.9 production build compiled successfully, TypeScript passed, and 47 static pages were generated. Public pages, admin pages, API routes, and Proxy were included in the route output.

```powershell
# ZIP content audit for forbidden entries
```

Result: initial audit found `prisma/dev.db` in the archives. It was removed from both ZIP files using the standard .NET ZIP APIs in PowerShell. A follow-up audit reported `No forbidden entries matched` for both the before and after archives.

## What was not checked

- No dev server was started, per project runtime guardrails.
- No browser, Playwright, Puppeteer, or browser automation was used.
- Live HTTP response headers were not fetched because no local server was started.
- Runtime CSP console violations were not checked in a browser.
- HSTS was not verified over a real HTTPS production deployment.

## Risks and doubts

- Production CSP still allows inline scripts because of the current inline theme bootstrap in `src/app/layout.tsx`.
- Production `style-src 'unsafe-inline'` remains because the app uses inline React `style` attributes and Tailwind/Next style behavior has not been migrated to a nonce/hash-only policy.
- `Cross-Origin-Resource-Policy: same-origin` is appropriate for this same-origin MVP, but should be revisited before embedding public assets cross-origin.

## Recommended next security task

Implement a CSP nonce or external same-origin theme bootstrap so production can remove `script-src 'unsafe-inline'`, then run a browser-side CSP violation audit in a manually started local server or staging environment.

## Confirmations

- Secrets, cookies, session tokens, CSRF tokens, password hashes, lead emails, lead phones, and other personal data were not printed in command output or intentionally included in backup ZIPs.
- `PROJECT_MAP.md` was updated with the security header configuration, CSP baseline, development/production differences, and known CSP follow-up.
