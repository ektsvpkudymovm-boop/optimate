# Rate limit hardening - 2026-07-02

## Task goal

Add or strengthen rate limiting and brute-force protection for admin login, public lead submission, public analytics events, and light authenticated admin mutations without changing the existing auth architecture or breaking public/admin flows.

## Changed files

- `src/lib/rate-limit.ts`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/leads/route.ts`
- `src/app/api/events/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `PROJECT_MAP.md`
- `reports/security/2026-07-02-rate-limit-hardening.md`

## Created backup ZIP paths

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\_project_backups\backup-optimatesite-20260702-1837-before-rate-limit-hardening.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\_project_backups\backup-optimatesite-20260702-1842-after-rate-limit-hardening.zip`

## Backup exclusions

Excluded from ZIPs:

- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `.git/`
- `_project_backups/`
- `backups/`
- `.env`
- `.env.local`
- `.env.production`
- `dev.db`
- `*.zip`

Confirmation: secrets, tokens, passwords, session cookies, password hashes, CSRF tokens, and real personal data were not intentionally read, printed, or included in the backup ZIPs. Local Prisma `dev.db` was excluded because it may contain real lead data.

## Inspected endpoints

- `POST /api/admin/auth`
- `GET /api/admin/auth`
- `POST /api/leads`
- `POST /api/events`
- `POST /api/admin/logout`
- `GET /api/admin/leads`
- `GET /api/admin/leads/[id]`
- `PATCH /api/admin/leads/[id]`
- `POST /api/admin/leads/[id]/notes`
- Existing imports of `src/lib/rate-limit.ts`

## Implemented helpers

`src/lib/rate-limit.ts` now includes:

- `getClientIp(request)`: parses the first `x-forwarded-for` value, then `x-real-ip`, then `cf-connecting-ip`, then falls back to `unknown`.
- `rateLimit()` and `rateLimitDetailed()`: generic in-memory fixed-window counters.
- `adminLoginRateLimit()`: request-based guard for admin login.
- `adminLoginFailureRateLimit()`: failed-attempt lockout check without incrementing request counters again.
- `recordAdminLoginFailure()`: increments failed login counters after invalid credentials.
- `publicLeadRateLimit()`: public lead form limiter.
- `analyticsEventRateLimit()`: public event limiter by IP and optional client identifier.
- `mutationRateLimit()`: light authenticated admin mutation limiter.

## Implemented rate limits and thresholds

- Admin login request limiter: 30 POST requests per IP per 15 minutes.
- Admin login failed attempts by IP: 10 failed attempts per 15 minutes.
- Admin login failed attempts by email/login identifier: 5 failed attempts per 15 minutes.
- Public lead submissions: 5 submissions per IP per 10 minutes.
- Public analytics events: 60 events per IP per minute.
- Public analytics events by `sessionId` or `visitorId`: 120 events per minute.
- Authenticated admin mutations: 120 mutations per IP per minute and 120 mutations per admin user per minute.

All counters are in-memory process state.

## Admin login brute-force behavior

`POST /api/admin/auth` checks an IP request limiter before parsing the body. After parsing valid credentials shape, it checks failed-attempt counters by IP and normalized email identifier. Invalid email and invalid password both return the same neutral `401` response and then increment failed-attempt counters. The response does not reveal whether an email exists.

Safe response shapes:

- Invalid JSON: `400 { "error": "Invalid JSON body" }`
- Invalid body shape: `400 { "error": "Provide email and password as strings" }`
- Invalid credentials: `401 { "error": "Invalid email or password" }`
- Rate limited: `429 { "error": "Too many requests" }`
- Internal error: `500 { "error": "Internal error" }`

## Public lead form rate limit behavior

`POST /api/leads` now checks a `Content-Length` cap of 16 KB before body parsing and applies the IP limiter before Zod validation and database writes. Existing Zod validation and honeypot behavior remain intact. Honeypot submissions still return success without storing a lead.

Safe response shapes:

- Body too large: `413 { "error": "Request body too large" }`
- Validation error: `400 { "errors": [...] }`
- Rate limited: `429 { "error": "Too many requests" }`
- Success: `201 { "success": true, "id": "..." }`
- Honeypot: `200 { "success": true }`
- Internal error: `500 { "error": "Internal server error" }`

## Analytics event rate limit behavior

`POST /api/events` now checks a `Content-Length` cap of 8 KB, validates that the JSON body is an object with non-empty string `type`, then applies the analytics limiter. It limits by IP and also by `sessionId` or `visitorId` when either exists, reducing the endpoint's value as a database spam target.

Safe response shapes:

- Body too large: `413 { "error": "Request body too large" }`
- Missing/invalid type: `400 { "error": "type required" }`
- Rate limited: `429 { "error": "Too many requests" }`
- Success: `200 { "success": true }`
- Internal error: `500 { "error": "Internal error" }`

## Admin mutations

Implemented light authenticated mutation rate limiting for:

- `POST /api/admin/logout`
- `PATCH /api/admin/leads/[id]`
- `POST /api/admin/leads/[id]/notes`

The limiter runs only after session and CSRF checks pass, so existing security semantics remain:

- Missing/invalid session: `401 { "error": "Unauthorized" }`
- Missing/wrong CSRF on mutation: `403 { "error": "Forbidden" }`
- Rate limited authenticated mutation: `429 { "error": "Too many requests" }`

Also corrected the lead detail route guard alignment:

- `GET /api/admin/leads/[id]` now requires a valid admin session.
- `PATCH /api/admin/leads/[id]` now requires valid admin session plus valid CSRF token.

## Manual verification scenarios

1. Send repeated invalid `POST /api/admin/auth` requests with the same IP and email; after 5 failures for that email or 10 failures for the IP, requests should return `429`.
2. Send valid development login with `admin@optimatesite.ru` / `admin123` before hitting the limiter; response should be `200`, set `admin_session` and `admin_csrf`, and the UI should navigate to `/admin`.
3. Try a non-existent email and an existing email with wrong password; both should return the same `401 { "error": "Invalid email or password" }`.
4. Send repeated valid-shaped `POST /api/leads` requests from the same IP; after 5 requests within 10 minutes, requests should return `429`.
5. Send one valid `POST /api/leads` request with both consents checked; it should still return `201`.
6. Send repeated `POST /api/events` requests; after 60 per IP within one minute, requests should return `429`.
7. Send one normal analytics event with `type`; it should still return `200`.
8. Existing admin CSRF behavior:
   - Missing session on admin API returns `401`.
   - Missing/wrong CSRF on mutation returns `403`.
   - Valid session plus valid `X-CSRF-Token` allows the mutation unless rate-limited.

## Commands run and results

- `npm.cmd run lint` - passed with 0 errors. Existing warnings: React hook dependency warning in `src/app/admin/leads/page.tsx`, and ESLint warning that `.eslintignore` is no longer supported.
- `npx.cmd tsc --noEmit` - passed.
- `npm.cmd run build` - passed. Next.js generated all public/admin/API routes successfully.
- ZIP cleanup attempt using `System.IO.Compression.ZipArchiveMode` before loading `System.IO.Compression` - failed with missing enum type; no archive entries were modified by that failed attempt.
- ZIP cleanup retry after loading `System.IO.Compression` and `System.IO.Compression.FileSystem` - passed; nested backup ZIP entries under `backups/` were removed from both archives.
- ZIP exclusion verification for before/after archives - passed; no `node_modules`, `.next`, `dist`, `build`, `.git`, `_project_backups`, `backups`, `.env`, `.env.local`, `.env.production`, `dev.db`, or nested `.zip` entries were found.

## What was not done

- Did not add external dependencies.
- Did not add Redis/Upstash/database-backed distributed counters.
- Did not open a browser or run browser automation, per Windows runtime guardrails.
- Did not run `npm run dev`, because dev server startup requires owner confirmation.
- Did not perform live HTTP manual verification against a running server.

## Risks and doubts

- P1/P2 production risk: the current limiter is in-memory. It is acceptable for local development and simple single-instance deployments, but not sufficient for serverless or multi-instance production because counters are not shared and reset on process restart.
- IP extraction from forwarded headers assumes a trusted reverse proxy. Production deployment should ensure only the proxy can set `x-forwarded-for` or move canonical client IP handling to the proxy layer.
- `setInterval` cleanup is fine for the current Node runtime, but a production distributed limiter should replace process-local cleanup.

## Recommended next security task

Replace in-memory rate limits with a Redis, Upstash, or DB-backed limiter and add integration tests for login lockout, lead throttling, analytics throttling, and admin mutation CSRF/rate-limit order.

## Project map confirmation

`PROJECT_MAP.md` was updated to mention the rate-limit helpers, rate-limited endpoints, admin mutation rate limiting, and the in-memory production limitation with Redis/Upstash/DB-backed limiter as a follow-up.
