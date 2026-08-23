# Global Theme Alignment Report

Date/time: 2026-07-09 07:25 +05:00

Backup: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-global-theme-alignment-20260709-0251.zip`

Original backup copy also remains at `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-before-global-theme-alignment-20260709-0251.zip`.

## Scope

System-wide visual color alignment for public pages, legal pages, contacts/form surfaces, shared header/footer/theme toggle, admin login and admin pages. This pass did not change routes, texts, form submit behavior, API handlers, auth/session logic, Prisma schema, migrations, lead data flow, cookie consent logic, case content model or sequence assets.

## Read-only Agent Findings

1. Token Auditor:
   - `src/app/globals.css` contains the effective theme system and many historical hardcoded colors.
   - The early token block and the later Visual V3 block conflicted; the later block is the active source of truth.
   - Stale SaaS blue remained in generic button shadows and light ops background variables.
   - Literal contrast colors existed in form/admin errors, case filters and case legal notes.

2. Public Pages Auditor:
   - `/`, `/work` and `/capabilities` were closest to the homepage system.
   - `/solutions`, `/approach`, `/cases`, `/cases/[slug]` and `/contacts` still used legacy cards/buttons/forms.
   - Legal pages were readable but visually plain and needed the shared palette.
   - Header light mode was aligned mostly on the homepage but not globally.

3. Admin Theme Auditor:
   - Admin pages inherited tokens but still looked like generic SaaS cards/tables.
   - Admin layout, login, tables and status pills needed scoped theme surfaces.
   - Auth, roles, API calls and data fetching should remain untouched.

4. Component Auditor:
   - There are no shared React Button/Card/Table/Badge components.
   - The practical edit point is `globals.css` plus minimal wrapper classes.
   - Existing primitives are `.card`, `.btn-primary`, `.btn-secondary`, `.input`, `lab-*` header/footer classes and admin inline `var(...)` styles.

5. Risk Auditor:
   - Minimal safe edit surface is `globals.css`, page wrappers/classes and contrast literals.
   - Safe checks are `npm.cmd run lint` and `npm.cmd run build`.
   - `typecheck` and `test` scripts are absent in `package.json`.
   - Avoid API, auth/session, Prisma, form submit logic, exports, cookie consent behavior and sequence assets.

## Tokens Introduced Or Normalized

- Global accents: `--color-accent-violet`, `--color-accent-amber`, `--color-accent-cyan`, `--color-success`, `--color-warning`, `--color-danger`.
- Semantic surfaces: `--page-bg`, `--surface-1`, `--surface-2`, `--surface-card`, `--surface-elevated`.
- Text and borders: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-soft`, `--border-soft`, `--border-strong`.
- Contrast states: `--on-primary`, `--on-danger`, `--on-warning`.
- Controls/tables: `--control-bg`, `--control-border`, `--control-focus`, `--table-head-bg`, `--table-row-border`.
- Compatibility aliases remain: `--bg`, `--bg-elevated`, `--bg-soft`, `--text`, `--border`, `--primary`, `--accent`, `--cyan`, `--warning`, `--danger`, `--success`.

## Pages And Zones Updated

- Public primitives: `.card`, `.btn-primary`, `.btn-secondary`, `.input`.
- Header/footer: light public header alignment and warm footer surface.
- Work/capabilities: scoped `work-page` and `capabilities-page` light-mode surfaces.
- Contacts: `contact-page` and `contact-form-shell` wrappers.
- Forms: input/focus/error contrast tokens; submit logic unchanged.
- Legal pages: `legal-page` and `legal-document` wrappers for `/privacy`, `/cookies`, `/consent`, `/terms`.
- Cases: active filter and legal-note contrast tokens.
- Admin: `admin-shell`, `admin-login-page`, `admin-login-card`, table head/border tokens, dark/light admin surfaces.

## Changed Files

- `site/src/app/globals.css`
- `site/src/app/admin/layout.tsx`
- `site/src/app/admin/login/page.tsx`
- `site/src/app/admin/analytics/page.tsx`
- `site/src/app/(public)/work/page.tsx`
- `site/src/app/(public)/capabilities/page.tsx`
- `site/src/app/(public)/contacts/page.tsx`
- `site/src/app/(public)/privacy/page.tsx`
- `site/src/app/(public)/cookies/page.tsx`
- `site/src/app/(public)/consent/page.tsx`
- `site/src/app/(public)/terms/page.tsx`
- `site/src/app/(public)/cases/page.tsx`
- `site/src/app/(public)/cases/[slug]/page.tsx`
- `site/src/components/forms/lead-form.tsx`
- `site/src/components/admin/mfa-settings.tsx`
- `site/PROJECT_MAP.md`
- `site/docs/reports/global-theme-alignment-report.md`

## Routes

- Changed visual styling only: `/`, `/work`, `/capabilities`, `/cases`, `/cases/[slug]`, `/contacts`, `/privacy`, `/consent`, `/cookies`, `/terms`, `/admin/login`, `/admin`, `/admin/leads`, `/admin/analytics`, `/admin/settings`.
- Routes intentionally preserved: all existing public routes and admin routes.
- No routes were added or removed.

## Assets

- Existing hero sequence and public assets were not changed.
- No new visual assets were added.

## Checks

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed after the final CSS/page changes. Next.js compiled successfully, TypeScript completed, and 55 static pages were generated.
- `npm.cmd run typecheck` was not run because the script is absent.
- `npm.cmd run test` was not run because the script is absent.

## Browser QA

Screenshots directory: `site/docs/reports/global-theme-alignment-screenshots/`.

Completed with one local server at a time. No forms were submitted, no credentials were entered, and no admin data-changing actions were taken.

Screenshots saved:

- `home-dark-desktop.png` (`/`, dark, 1440px)
- `home-light-desktop.png` (`/`, light, 1440px)
- `work-light-desktop.png` (`/work`, light, 1440px)
- `capabilities-light-desktop.png` (`/capabilities`, light, 1440px)
- `cases-light-desktop.png` (`/cases`, light, 1440px)
- `contacts-light-desktop.png` (`/contacts`, light, 1440px)
- `privacy-light-desktop.png` (`/privacy`, light, 1440px)
- `admin-login-light-desktop.png` (`/admin/login`, light, 1440px)
- `admin-login-dark-desktop.png` (`/admin/login`, dark, 1440px)
- `admin-root-light-desktop.png` (`/admin`, light, redirected to login without session)
- `admin-leads-light-desktop.png` (`/admin/leads`, light, redirected to login without session)
- `home-light-mobile.png` (`/`, light, 390px)
- `contacts-light-mobile.png` (`/contacts`, light, 390px)
- `admin-login-light-mobile.png` (`/admin/login`, light, 390px)

Visual QA notes:

- `/work` and `/capabilities` initially remained dark in light mode because their late editorial CSS overrode the semantic tokens. Added `work-page` and `capabilities-page` scopes plus light-mode overrides, then re-shot both pages.
- Dev CSS cache under `.next/dev` was stale and did not include the new selectors. Removed only generated `site/.next/dev`, restarted the local server, verified the served CSS contains `work-page` and `capabilities-page`, then re-shot.
- `next start` was attempted for clean production screenshots, but the local production server returned 500 because `ADMIN_EMAIL` is required by the instrumentation hook. No admin env values were injected and auth/DB initialization was not changed.
- Dev screenshots may include a small Next dev indicator on the left edge of `/work` and `/capabilities`; this is not site UI.

## TODO

- For cleaner public QA artifacts, run screenshots against a production server only after the owner provides the required local admin initialization env.
- Continue reducing hardcoded colors only in non-hero/non-sequence areas unless a separate task asks to retune hero visuals.
