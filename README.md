# OptiMate - AI Product & Automation Lab

OptiMate is a public website and local admin MVP for an AI Product & Automation Lab. The site presents serious AI and digital systems for businesses that have outgrown manual management: AI agents, RAG and knowledge systems, CRM and process management, automation pipelines, content factories, e-commerce personalization, internal tools and AI/GEO-ready site architecture.

The main visitor path is:

```text
Homepage -> choose a business area -> /work?type=...#work-results -> /cases/[slug] -> /contacts
```

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4 / CSS variables
- Prisma + SQLite for local development
- Zod validation
- Custom admin session auth
- Lucide React icons

## Quick Start

Run from the `site/` project root:

```powershell
npm install
npm run setup:local
npm run dev
```

Local URLs:

- Public site: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`

`npm run setup:local` creates `.env.local` from `.env.local.example` when needed, generates Prisma client files, applies the local database schema and runs the development seed.

Local development admin:

- Email: `admin@optimatesite.ru`
- Password: `admin123`

Do not use the local admin password or placeholder secrets in production.

## Commands

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run setup:local` | Prepare local env, Prisma client, SQLite database and seed data |
| `npm run dev` | Start the development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Build for production |
| `npm run start` | Start the production server after build |

## Public Routes

- `/` - homepage.
- `/work` - main showcase of working AI/digital system cases.
- `/work?type=...#work-results` - targeted path from homepage task cards into the filtered case block.
- `/cases/[slug]` - detailed case pages.
- `/approach` - approach page.
- `/about` - about page.
- `/contacts` - contact page and lead form.
- `/privacy`, `/consent`, `/cookies`, `/terms` - legal pages.

Legacy redirects:

- `/cases` -> `/work`.
- `/solutions` -> `/work`.
- `/capabilities` -> `/work`.

Experimental routes are not part of the main navigation:

- `/sequence-lab/hero-night`
- `/visual-lab/dala-hero`

## Data Sources

- Cases: `src/content/cases.ts`.
- Capabilities: `src/content/capabilities.ts`.
- Legacy solutions: `src/content/solutions.ts`.
- Leads and internal analytics: SQLite through Prisma in local development.

## Work Showcase

`/work` is the visible proof section for working-system cases. Homepage task cards link to `/work?type={capabilityId}#work-results`, so visitors land on the filter/control panel and the relevant case cards instead of the top of the page. All cases use one unified results grid.

Case cards and detail H1s use Russian client-facing case titles from `clientTitle`; internal project names remain secondary identifiers. `/cases/[slug]` remains the detailed case URL structure.

## Hero Assets

The homepage hero uses WebP image sequences from `public/sequence/`:

- Dark/night mode: `public/sequence/hero-night-hq/`, public URL pattern `/sequence/hero-night-hq/frame_000.webp`.
- Light/day mode: `public/sequence/hero-day-hq/`, public URL pattern `/sequence/hero-day-hq/frame_000.webp`.
- Legacy night sequence: `public/sequence/hero-night/`.

Important copy remains HTML, not baked into images.

## Project Structure

```text
site/
|-- src/
|   |-- app/
|   |   |-- page.tsx
|   |   |-- (public)/
|   |   |-- admin/
|   |   `-- api/
|   |-- components/
|   |-- content/
|   `-- lib/
|-- prisma/
|-- public/
|-- scripts/
`-- docs/
```

## Environment

Use `.env.local.example` as the safe local template. The setup script creates `.env.local` from it if `.env.local` is missing.

Never commit production secrets, `.env`, `.env.local`, private keys, local databases, `.next` or `node_modules`.
