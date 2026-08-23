# Production readiness 01

Date: 2026-07-02

## Task goal

Prepare production-readiness fixes and plans for infrastructure P2 findings from checkpoint audit 02 without blindly adding external services or changing the local SQLite development workflow.

## Changed files

- `src/lib/rate-limit.ts`
- `.env.example`
- `PROJECT_MAP.md`
- `../docs/00_README.md`
- `../docs/08_production_deployment.md`
- `reports/security/2026-07-02-production-readiness-01.md`

## Backup ZIP paths

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-2247-before-production-readiness-01.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-2250-after-production-readiness-01.zip`

## ZIP exclusions

The backup commands excluded `node_modules`, `.next`, `dist`, `build`, `.git`, `.env`, `.env.local`, `.env.production`, `prisma/dev.db`, `dev.db`, `*.zip`, `*.log`, and `tsconfig.tsbuildinfo`.

## Trusted proxy/IP extraction behavior

`src/lib/rate-limit.ts` now uses `TRUST_PROXY`:

- default behavior is `TRUST_PROXY=false`;
- when false, the app ignores `x-forwarded-for`, `x-real-ip`, and `cf-connecting-ip`;
- when false, rate-limit keys use the conservative shared identity `direct`;
- when true, the app reads the first `x-forwarded-for` value, then `x-real-ip`, then `cf-connecting-ip`, falling back to `direct`;
- production may set `TRUST_PROXY=true` only when the reverse proxy strips incoming client-supplied forwarded headers and overwrites them with the real client address.

No raw IP values were printed in this report.

## Rate limiter store/plan

Added a small `RateLimitStore` interface and current `MemoryRateLimitStore` implementation. Existing behavior remains process-local in memory.

No Redis, Upstash, or DB rate-limit dependency was added because production hosting has not been selected.

Shared counters are required before real multi-instance/serverless production for:

- `POST /api/admin/auth`
- `POST /api/admin/mfa/verify`
- `POST /api/leads`
- `POST /api/events`
- admin mutations: logout, MFA setup/enable, lead status changes, notes, and CSV export

The production replacement point is the `RateLimitStore` abstraction in `src/lib/rate-limit.ts`.

## PostgreSQL production plan

Added `../docs/08_production_deployment.md`.

The doc states:

- current SQLite is local/dev/MVP only;
- production DB should be PostgreSQL;
- production requires `DATABASE_URL`;
- production schema changes should use Prisma migrations, tested against staging, then deployed with `prisma migrate deploy`;
- `dev.db` and `prisma/dev.db` must not be committed or archived;
- PostgreSQL backup/restore is required before launch;
- secrets must stay outside Git, reports, logs, and backup ZIPs;
- production must run behind HTTPS.

## CSP follow-up plan

No CSP runtime behavior was changed in this pass.

Documented follow-up paths:

- remove production `script-src 'unsafe-inline'` by moving the theme bootstrap to an external same-origin script, or by implementing nonce-based CSP;
- reduce `style-src 'unsafe-inline'` later by moving repeated inline styles into classes/CSS variables, auditing component style props, and validating a stricter style policy in staging.

The theme toggle and inline bootstrap were intentionally left unchanged.

## Env variables added/updated

Updated `.env.example` with:

- `TRUST_PROXY="false"`
- comments clarifying local SQLite vs production PostgreSQL `DATABASE_URL`;
- comment reminding that production `APP_URL` should be the public HTTPS origin.

No real env values were printed.

## Commands run and results

- `npm.cmd run lint`: passed.
- `npx.cmd tsc --noEmit`: passed.
- `npm.cmd run build`: passed.
- `npx.cmd prisma validate`: passed.

## What was not checked

- No live reverse proxy behavior was tested because production hosting/proxy is not selected.
- No PostgreSQL migration was generated or applied.
- No Redis/Upstash/database-backed rate-limit store was tested.
- No browser, Playwright, Puppeteer, or dev-server verification was run.

## What was not done

- Did not change Prisma provider from SQLite to PostgreSQL.
- Did not add external services or dependencies.
- Did not implement nonce-based CSP.
- Did not change admin auth/session/CSRF/MFA/roles/CSV behavior.
- Did not start `npm run dev`.

## Risks/doubts

- With `TRUST_PROXY=false`, IP-based limits intentionally collapse to `direct`; this is safer than trusting spoofable headers, but weaker for public direct exposure.
- Current memory rate limiting remains insufficient for multi-instance/serverless production.
- PostgreSQL migration planning still needs a chosen production/staging database and deployment target.
- CSP still allows inline scripts/styles until a dedicated CSP hardening pass.

## Recommended next task

Choose the production hosting shape and implement a staging-backed deployment profile: PostgreSQL migrations, reverse proxy header contract, and a shared rate-limit store.

## Secret and PII handling confirmation

Secrets, cookies, session tokens, password hashes, CSRF tokens, TOTP secrets, recovery codes, MFA challenge tokens, lead emails, phones, comments, and other lead PII were not printed in this report. Backup ZIP exclusions were configured to avoid local secret env files, local databases, logs, nested ZIPs, and generated cache/build folders. `.env.example` is intentionally allowed because it contains safe placeholders.

PROJECT_MAP.md was updated.
