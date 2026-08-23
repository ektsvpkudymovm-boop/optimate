# Admin env hardening report

Date: 2026-07-02

## Task goal

Document security stage 1 for OptiMate admin credentials hardening and create a safe ZIP backup of the current project state without secrets, local databases, build artifacts, dependency folders, or Git metadata.

## Changed files

Security stage 1 changed these files:

- `site/src/lib/admin-env.ts`
- `site/src/lib/password.ts`
- `site/src/lib/auth.ts`
- `site/src/app/api/admin/auth/route.ts`
- `site/src/instrumentation.ts`
- `site/prisma/seed.ts`
- `site/src/app/admin/settings/page.tsx`
- `site/.env.example`
- `site/.gitignore`

This documentation task additionally changed:

- `site/reports/security/2026-07-02-admin-env-hardening.md`
- `site/PROJECT_MAP.md`
- `site/.gitignore`

## Created ZIP path

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\backup-optimatesite-20260702-1806-after-admin-env-hardening.zip`

There is no before ZIP for this stage because the ZIP backup requirement was introduced after the hardening task had already been completed.

## Excluded backup files and folders

The ZIP backup excludes:

- `node_modules/`
- `.next/`
- `dist/`
- `build/`
- `.git/`
- `.env`
- `.env.local`
- `.env.production`
- other `.env.*` files except `.env.example`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`
- `prisma/dev.db`
- `prisma/dev.db-*`
- root `dev.db`
- root `dev.db-journal`
- `*.log`
- `logs/`
- `backups/`

The archive was created from the project workspace with explicit exclusion rules and was not built from a broad copy of the working directory.

## What was implemented

- The local development login `admin@optimatesite.ru` with the development password is allowed only when `NODE_ENV=development` and `ALLOW_DEV_ADMIN_PASSWORD=true`.
- Production rejects missing `ADMIN_EMAIL`.
- Production rejects missing `ADMIN_PASSWORD`.
- Production rejects the development password.
- Production rejects admin passwords shorter than 12 characters.
- The seed script stores only a bcrypt password hash in the database.
- `.env.example` uses placeholders instead of real credentials.
- `.gitignore` excludes env files, local SQLite database files, generated Prisma output, temporary checks, and local ZIP backups.

## How it works

`src/lib/admin-env.ts` centralizes admin credential validation. The seed script calls `validateAdminEnv()` before creating or updating the admin user. Runtime production checks call `assertSafeAdminRuntimeEnv()` from `src/instrumentation.ts` and the admin auth API.

`src/lib/password.ts` centralizes password hashing and verification with `bcryptjs`. Admin passwords are compared against `passwordHash`; plain text passwords are not stored in Prisma.

## Manual verification steps

From `site/`:

1. Development seed path:

   ```powershell
   $env:NODE_ENV='development'
   $env:ALLOW_DEV_ADMIN_PASSWORD='true'
   $env:ADMIN_EMAIL='admin@optimatesite.ru'
   $env:ADMIN_PASSWORD='<development password>'
   npm.cmd run db:seed
   ```

2. Production default password rejection:

   ```powershell
   $env:NODE_ENV='production'
   $env:ADMIN_EMAIL='admin@optimatesite.ru'
   $env:ADMIN_PASSWORD='<development password>'
   npx.cmd tsx prisma/seed.ts
   ```

3. Production empty password rejection:

   ```powershell
   $env:NODE_ENV='production'
   $env:ADMIN_EMAIL='admin@optimatesite.ru'
   $env:ADMIN_PASSWORD=''
   npx.cmd tsx prisma/seed.ts
   ```

4. Production short password rejection:

   ```powershell
   $env:NODE_ENV='production'
   $env:ADMIN_EMAIL='admin@optimatesite.ru'
   $env:ADMIN_PASSWORD='<short password>'
   npx.cmd tsx prisma/seed.ts
   ```

5. Production missing email rejection:

   ```powershell
   $env:NODE_ENV='production'
   $env:ADMIN_EMAIL=''
   $env:ADMIN_PASSWORD='<strong production password>'
   npx.cmd tsx prisma/seed.ts
   ```

6. Build and static checks:

   ```powershell
   npm.cmd run lint
   npx.cmd tsc --noEmit
   npm.cmd run build
   ```

## Commands run and results

Commands repeated for this documentation task:

- `Get-Content PROJECT_MAP.md` - read project map before documentation update.
- `Get-ChildItem -Force` - inspected project root without reading `.env`.
- `New-Item -ItemType Directory -Force reports\security, backups` - created documentation and backup directories.
- First ZIP creation attempt - failed because the local PowerShell/.NET runtime did not expose `System.IO.Compression.ZipArchiveMode` and `System.IO.Path.GetRelativePath`.
- Second ZIP creation command - created the safe backup archive with explicit exclusions using a temporary staging folder under `backups/`, then removed that staging folder.
- Initial ZIP inspection regex - produced a false positive for the allowed `.env.example` placeholder file.
- Exact ZIP inspection command - returned `No forbidden archive entries found.`
- `git check-ignore -v .env prisma/dev.db dev.db backups/backup-optimatesite-20260702-1806-after-admin-env-hardening.zip` - confirmed env files, local databases, and backup ZIP are ignored.

Quality commands from the hardening stage were not repeated for this documentation-only task. The previous hardening verification reported `npm.cmd run lint`, `npx.cmd tsc --noEmit`, and `npm.cmd run build` passing, with one existing lint warning in `src/app/admin/leads/page.tsx`.

## What was not done

- No application business logic was changed.
- No admin security logic was changed during this documentation task.
- No dev server or browser automation was started.
- No secrets, hashes, cookies, session tokens, raw local database content, or personal data were printed to this report.

## Risks and doubts

- The project has existing untracked and modified files outside this documentation task. This report documents the hardening stage but does not attempt to reconcile unrelated working tree state.
- The backup is a local archive. It should not be committed to Git or shared without a separate review.

## Backup privacy confirmation

The ZIP backup excludes known secret-bearing files, local SQLite databases, dependency/build output, Git metadata, and log files. Based on the explicit exclusion list, secrets and real personal data were not included in the ZIP.
