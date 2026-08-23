# Home Sequence Hero Report

Дата/время: 2026-07-08 16:19:36 +05:00

## Backup

- Backup zip: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-home-sequence-hero-20260708-1555.zip`
- Содержимое: zip-бэкап папки `site` перед правками.
- Исключения: `node_modules`, `.next`, `dist`, `coverage`, `.env`, `.env.*`, `*.pem`, файлы с `token`, `secret`, `key` в имени.

## WebP Sequence

- Папка кадров: `site/public/sequence/hero-night`
- Public URL pattern: `/sequence/hero-night/frame_000.webp`
- Найдено кадров: 263
- Диапазон: `frame_000.webp` ... `frame_262.webp`
- Naming pattern: `frame_000.webp`, три цифры, без пропусков.
- Размеры кадров:
  - `frame_000.webp`: 1264x720, 70,084 bytes
  - `frame_131.webp`: 1264x720, 89,148 bytes
  - `frame_262.webp`: 1264x720, 91,796 bytes
- Все проверенные кадры: 1264x720 VP8 WebP
- Общий размер папки: 22,530,696 bytes / 21.49 MiB

## Read-Only Agents

- Sequence Verifier: подтвердил 263 WebP-файла, корректный naming pattern, отсутствие пропусков, единый размер 1264x720, общий вес 21.49 MiB.
- Homepage Integration Auditor: подтвердил безопасную замену только первого рендера в `src/app/page.tsx`, сохранив остальные секции главной; старый `VisualV4Hero` оставлен в проекте как fallback-артефакт.
- Performance Planner: рекомендовал не блокировать hero полной загрузкой 263 кадров; использовать poster first frame, batch preload, nearest-loaded fallback, reduced-motion static mode и низкую конкуррентность загрузки.

## Created

- `site/src/components/public/scroll-sequence-hero.tsx`
- `site/src/app/sequence-lab/hero-night/page.tsx`
- `site/docs/reports/home-sequence-screenshots/`
- `site/docs/reports/home-sequence-hero-report.md`

## Modified

- `site/src/app/page.tsx`
- `site/src/app/globals.css`
- `site/src/components/header.tsx`

Не тронуты: admin, auth, API, Prisma, legal pages, lead forms, cookie consent.

## Routes

- Добавлен isolated route: `/sequence-lab/hero-night`
- Главная `/`: первый экран заменён на `ScrollSequenceHero`
- Сохранены старые routes: `/cases`, `/cases/[slug]`, `/solutions`, `/work`, `/capabilities`, `/visual-lab/dala-hero`

## Hero Behavior

- Текст hero остаётся HTML, не частью изображения.
- Canvas использует кадры из `/sequence/hero-night/frame_000.webp` ... `/frame_262.webp`.
- Scroll progress внутри 320vh desktop / 240vh mobile секции мапится на индекс кадра `0..262`.
- Sticky viewport: `position: sticky; top: 0; min-height: 100svh`.
- Desktop: текст слева, WebP sequence справа, CTA виден в первом viewport.
- Mobile: текст, CTA и status идут выше визуала; sequence отображается ниже и не перекрывает H1.
- Header на `/` и `/sequence-lab/hero-night` получает scoped dark variant `lab-header--sequence`.

## Preload

- `frame_000.webp` используется как poster через `next/image` с `priority` и `unoptimized`.
- Первый кадр загружается сразу и рисуется как fallback.
- Остальные кадры догружаются после попадания hero в viewport: сначала текущий и соседние кадры, затем sparse anchors и progressive fill.
- Конкуррентность загрузки: 4 desktop, 2 mobile.
- Если точный кадр ещё не загружен, canvas рисует ближайший загруженный кадр.
- Cache ограничен: 96 кадров desktop, 48 mobile.

## Reduced Motion

- При `prefers-reduced-motion: reduce`, `saveData` или слабом соединении scroll scrub отключается.
- Показывается static poster/первый кадр.
- Остальная sequence не догружается.

## Screenshots

Папка: `site/docs/reports/home-sequence-screenshots/`

- `sequence-lab-desktop-start.png`
- `sequence-lab-desktop-mid.png`
- `sequence-lab-desktop-end.png`
- `home-sequence-desktop-start.png`
- `home-sequence-desktop-mid.png`
- `home-sequence-mobile-start.png`
- `home-sequence-mobile-mid.png`

Visual QA выполнялась только для `/` и `/sequence-lab/hero-night`. В админку не заходил, формы не отправлял, логины/пароли не вводил, внешние сайты не открывал.

## Checks

- `npm.cmd run lint`: passed
- `npm.cmd run build`: passed
- `npm.cmd run typecheck`: script отсутствует в `package.json`
- `npm.cmd run test`: script отсутствует в `package.json`

## Notes

- В dev-server screenshots виден круглый Next.js dev indicator внизу слева; в production build он не является частью сайта.
- Light theme временно использует тот же dark-first night hero.

## TODO

- Нужна отдельная day WebP sequence для полноценного дневного режима первого экрана.
- Перед production стоит добавить cache/versioning strategy для `/public/sequence`, так как имена кадров не content-hashed.
