# OptiMate Handoff Package - 2026-07-03

## ZIP

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\handoff\optimatesite-handoff-20260703-0149.zip`

## Test Unpack

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\handoff-test`

## Included

- `package.json`
- `package-lock.json`
- Next/TypeScript/ESLint/PostCSS/Prisma config files
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/**`
- `public/**`
- `reports/**`
- `README_HANDOFF.md`
- `PROJECT_MAP.md`
- `.env.example`
- `.env.local.example`
- `scripts/setup-local.mjs`

`site/docs/**` was not included because there is no `site/docs` directory in this project copy.

## Excluded

- `.git`
- `.env`
- `.env.local`
- `.env.production`
- `node_modules`
- `.next`
- `dist`
- `build`
- `dev.db`
- `prisma/dev.db`
- `*.db`
- `*.log`
- `*.zip`
- `backups`
- `_project_backups`
- `site-design-2030`

## Safe Local Env Placeholders

Created `.env.local.example` with local-only placeholders:

- `DATABASE_URL="file:./dev.db"`
- `APP_URL="http://localhost:3000"`
- `TRUST_PROXY="false"`
- `SESSION_SECRET="local-dev-session-secret-replace-before-production"`
- `MFA_SECRET_ENCRYPTION_KEY="local-dev-mfa-secret-32-plus-characters-only"`
- `ALLOW_DEV_ADMIN_PASSWORD="true"`
- `ADMIN_EMAIL="admin@optimatesite.ru"`
- `ADMIN_PASSWORD="admin123"`
- optional Telegram/SMTP/Yandex variables empty by default

The same SQLite URL was aligned in `.env.example`.

## Recipient Commands

```powershell
npm install
npm run setup:local
npm run dev
```

Open:

```text
http://localhost:3000
```

Local development admin only:

```text
admin@optimatesite.ru / admin123
```

## Checks In Source `site`

- `npm.cmd run lint` - passed
- `npm.cmd run build` - passed

## Checks In Test Unpack

- `npm.cmd install` - passed
- `npm.cmd run setup:local` - passed
- `npm.cmd run build` - passed

## ZIP Content Verification

ZIP entry scan result:

- entries: 108
- forbidden entries found: none
- confirmed absent: `.env`, `.env.local`, `prisma/dev.db`, `dev.db`, `node_modules`, `.next`, `.git`, nested `.zip`
- confirmed included: `reports/handoff/2026-07-03-handoff-package.md`

## Known Limitations

- `npm install` reports 5 moderate npm audit vulnerabilities in dependency tree. No dependency upgrades were made for this handoff package.
- In this Windows environment, `npx prisma db push` exits with an empty `Schema engine error`. `setup:local` still executes it first, then uses a Prisma-generated SQL fallback from `prisma migrate diff` to create the local SQLite schema before running the existing seed.
- Node emits `[DEP0190]` for child process shell usage during the fallback path. It does not fail setup.
