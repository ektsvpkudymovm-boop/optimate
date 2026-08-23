# OptiMate Project Map

Checkpoint: 2026-07-09 10:22 +05:00

Final handoff backup preparation:

- This checkpoint documents the final portable handoff state of `site/`.
- The backup is created after current documentation updates and project checks.
- The archive root must be one folder: `optimate-site-latest/`.
- `README.md`, `README_HANDOFF.md` and `PROJECT_MAP.md` were synchronized for the handoff package.
- `.env.local.example` exists and is included as the safe local template.
- `setup:local` exists in `package.json` and points to `node scripts/setup-local.mjs`.
- `scripts/setup-local.mjs` creates `.env.local` from `.env.local.example` when needed, runs Prisma generate/db push and runs the local seed.
- No design, route, source content, admin, API, form, legal, Prisma schema, consent or analytics behavior was intentionally changed for this handoff task.
- Final report: `docs/reports/final-handoff-backup-20260709-1022.md`.
- Backup path: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\optimate-site-latest-handoff-20260709-1022.zip`.
- Backup size: `108666087` bytes.
- Backup SHA256: `094125354929E24A04DE44362C4D0772BA79553CBCC0C0564F2FB5CE966F58FB`.

## Current Stack

- Next.js App Router.
- React and TypeScript.
- Tailwind CSS 4 / CSS variables.
- Prisma with local SQLite development database.
- Zod validation.
- Custom session auth for admin.
- Internal analytics and public lead storage through the app/database.

## Important Files

- `package.json` - scripts and dependencies.
- `scripts/setup-local.mjs` - local setup script.
- `.env.local.example` - safe local template.
- `next.config.ts` - Next.js configuration and headers.
- `eslint.config.mjs` - ESLint configuration.
- `tsconfig.json` - TypeScript configuration.
- `postcss.config.mjs` - PostCSS/Tailwind pipeline.
- `prisma/schema.prisma` - database schema.
- `prisma/seed.ts` - local seed script.
- `src/app/globals.css` - global visual system and page styles.
- `src/app/layout.tsx` - root layout, metadata, theme bootstrapping and global shell.

## Public Routes

- `/` - `src/app/page.tsx`.
- `/work` - `src/app/(public)/work/page.tsx`.
- `/work?type=...#work-results` - filtered work/case path from homepage cards.
- `/cases/[slug]` - `src/app/(public)/cases/[slug]/page.tsx`.
- `/approach` - `src/app/(public)/approach/page.tsx`.
- `/about` - `src/app/(public)/about/page.tsx`.
- `/contacts` - `src/app/(public)/contacts/page.tsx`.
- `/privacy` - `src/app/(public)/privacy/page.tsx`.
- `/consent` - `src/app/(public)/consent/page.tsx`.
- `/cookies` - `src/app/(public)/cookies/page.tsx`.
- `/terms` - `src/app/(public)/terms/page.tsx`.

Legacy public routes preserved as redirects:

- `/cases` -> `/work`.
- `/solutions` -> `/work`.
- `/capabilities` -> `/work`.

Experimental routes preserved but not added to main navigation:

- `/sequence-lab/hero-night`.
- `/visual-lab/dala-hero`.

## Admin And API

Admin routes are present and intentionally preserved:

- `/admin`
- `/admin/login`
- `/admin/leads`
- `/admin/leads/[id]`
- `/admin/analytics`
- `/admin/cases`
- `/admin/settings`

API routes are present and intentionally preserved:

- `src/app/api/leads/route.ts`
- `src/app/api/events/route.ts`
- `src/app/api/admin/auth/route.ts`
- `src/app/api/admin/logout/route.ts`
- `src/app/api/admin/analytics/route.ts`
- `src/app/api/admin/leads/route.ts`
- `src/app/api/admin/leads/[id]/route.ts`
- `src/app/api/admin/leads/[id]/notes/route.ts`
- `src/app/api/admin/mfa/*`

## Content Sources

- Cases: `src/content/cases.ts`.
- Capabilities: `src/content/capabilities.ts`.
- Legacy solutions: `src/content/solutions.ts`.

Current public IA:

- `/work` is the main case/work showcase.
- `/work?type=...#work-results` is the filtered path from homepage cards.
- `/cases/[slug]` remains the detailed case page structure.
- Capabilities are not duplicated as a separate public proof page; legacy capability entry redirects to `/work`.

## Hero And Sequence Assets

The active homepage hero is asset-first and uses WebP sequences from `public/sequence/`.

- Dark/night mode: `public/sequence/hero-night-hq/`.
- Dark/night public URL pattern: `/sequence/hero-night-hq/frame_000.webp`.
- Dark/night frame count at this checkpoint: 121 WebP frames.
- Light/day mode: `public/sequence/hero-day-hq/`.
- Light/day public URL pattern: `/sequence/hero-day-hq/frame_000.webp`.
- Light/day frame count at this checkpoint: 150 WebP frames.
- Legacy night sequence: `public/sequence/hero-night/`.
- Legacy night frame count at this checkpoint: 263 WebP frames.

The sequence renderer is `src/components/public/scroll-sequence-hero.tsx`. Important text remains HTML.

## Backup Inclusion Rules

Included in the handoff archive:

- `package.json`
- `package-lock.json`
- `README.md`
- `README_HANDOFF.md`
- `PROJECT_MAP.md`
- `.env.local.example`
- `src/`
- `public/`
- `prisma/`
- `docs/`
- `scripts/`
- `next.config.ts`
- `tsconfig.json`
- `eslint.config.mjs`
- `postcss.config.mjs`
- other non-secret project files needed to run the app

Excluded from the handoff archive:

- `node_modules`
- `.next`
- `dist`
- `coverage`
- `.git`
- `backups`
- `.env`
- `.env.*`, except `.env.local.example`
- `*.pem`
- `*.key`
- `*token*`
- `*secret*`
- `*.db`
- `*.sqlite`
- `*.zip`
- `logs`
- `tsconfig.tsbuildinfo`
- `.DS_Store`
- `Thumbs.db`

Specific backup requirements:

- `public/sequence/hero-night-hq/frame_000.webp` is included.
- `public/sequence/hero-day-hq/frame_000.webp` is included.
- `node_modules`, `.next`, `.git`, `.env`, `.env.local`, `dev.db` and `prisma/dev.db` are excluded.

## Checks For This Handoff

Required before backup:

- `npm run lint`
- `npm run build`

Optional unpack smoke test:

- Create a temporary folder outside the project.
- Unpack the zip.
- Check that `optimate-site-latest/package.json` is readable.
- Full `npm install -> npm run setup:local -> npm run build` can be run if time and network/dependency access allow it.

## Manual QA After Unpack

After running:

```powershell
npm install
npm run setup:local
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/work`
- `http://localhost:3000/work?type=ai-agents#work-results`
- `http://localhost:3000/cases/ai-organic-flow`
- `http://localhost:3000/contacts`

Do not submit the contact form unless lead creation is intentionally being tested.
