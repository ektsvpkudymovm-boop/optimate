# OptiMate - handoff package

## What Is Inside

This is a portable version of the OptiMate website and local admin MVP.

OptiMate is an AI Product & Automation Lab. The public website shows working AI/digital systems and guides a visitor through:

```text
Homepage -> choose a business area -> /work?type=...#work-results -> /cases/[slug] -> /contacts
```

## Requirements

- Node.js 20+ or 22+
- npm

## Start On A New Computer

Run from the unpacked `optimate-site-latest/` folder:

```powershell
npm install
npm run setup:local
npm run dev
```

Then open:

```text
http://localhost:3000
```

Admin login:

```text
http://localhost:3000/admin/login
```

Local development admin:

```text
email: admin@optimatesite.ru
password: admin123
```

These credentials are local-development placeholders only.

## What `setup:local` Does

- Creates `.env.local` from `.env.local.example` if `.env.local` does not exist.
- Runs `npx prisma generate`.
- Runs `npx prisma db push`.
- Runs the local seed command for the development admin.
- Does not print `.env.local` contents.
- Does not use production secrets.

## Important

- `node_modules` is not included in the archive.
- `.next` is not included in the archive.
- `.env.local` and `.env` are not included in the archive.
- Local SQLite databases are not included in the archive.
- `npm run setup:local` creates the local `.env.local` from `.env.local.example`.
- SQLite `dev.db` is created locally through Prisma.
- `public/sequence` is included because the hero uses WebP sequence assets.

## Main Routes

- `/`
- `/work`
- `/work?type=ai-agents#work-results`
- `/cases/ai-organic-flow`
- `/approach`
- `/contacts`
- `/privacy`
- `/consent`
- `/cookies`
- `/terms`

Legacy redirects:

- `/cases` -> `/work`
- `/solutions` -> `/work`
- `/capabilities` -> `/work`

## Manual Check After Start

Open:

- `http://localhost:3000`
- `http://localhost:3000/work`
- `http://localhost:3000/work?type=ai-agents#work-results`
- `http://localhost:3000/cases/ai-organic-flow`
- `http://localhost:3000/contacts`

Do not submit the contact form unless you intentionally want to test lead creation.

## Do Not Touch Without A Separate Task

- `admin/*`
- `api/*`
- `prisma/schema.prisma`
- legal pages
- forms and lead submission
- auth/session/security
- cookie consent
- analytics consent
- `public/sequence/*`
- hero WebP sequence behavior

## Useful Checks

```powershell
npm run lint
npm run build
npm run start
```
