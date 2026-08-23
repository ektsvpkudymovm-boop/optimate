# Unified signal background report

Дата/время: 2026-07-09 00:38:03 +05:00

## Что было нелогично

- Фон `.ops-bg` был привязан к локальным `origin` / `mask` точкам, поэтому линии, узлы и glow выглядели как отдельные пятна под блоками.
- В `final-cta-section` оставался отдельный локальный glow через section pseudo-element.
- В `Классах систем` отдельные radial glow-подложки на плитках усиливали ощущение, что фон включён только под карточками.

## Как теперь устроен фон

- `.ops-bg::before` стал единым full-width слоем секции на `100vw`: тонкие маршруты, мягкие дуги и редкие узлы распределены по всей ширине.
- `.ops-bg::after` стал слабым распределённым glow/signal слоем без резких radial-пятен.
- Варианты `.ops-bg--center`, `.ops-bg--left`, `.ops-bg--right`, `.ops-bg--soft`, `.ops-bg--clean` теперь меняют только интенсивность, а не положение локального пятна.
- Для mobile фон упрощён: ниже opacity, шире background scale, мягче glow.

## Читаемость

- Контент остаётся выше фона через `z-index: 1`.
- Прямые `.container` внутри `.ops-bg` получили subtle shielding overlay через `::before`, чтобы фон ослаблялся под текстом и карточками без дыр и резких обрывов.
- Radial glow на `.system-line--live` заменён на спокойную прозрачную подложку.

## Изменённые файлы

- `site/src/app/globals.css`
- `site/PROJECT_MAP.md`
- `site/docs/reports/unified-signal-background-report.md`

## PROJECT_MAP

Обновлён `site/PROJECT_MAP.md`: описан unified full-width section background, shielding overlay, mobile simplification и переписанные локальные эффекты.

## Backup

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-after-unified-signal-background-20260709-0038.zip`

## Проверки

- `npm.cmd run lint` — успешно.
- `npm.cmd run build` — успешно. Next.js 16.2.9 compiled successfully, TypeScript passed, generated 55 static pages.

## Что не трогалось

- Первый hero / WebP sequence.
- Тексты секций.
- Header.
- Формы и заявки.
- Admin/auth/API/Prisma/legal/consent.
