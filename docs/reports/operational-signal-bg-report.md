# Operational Signal Map background report

Дата/время: 2026-07-09 00:28:03 +05:00

## Backup

Создан до правок:

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-before-operational-signal-bg-20260709-0024.zip`

Исключались: `node_modules`, `.next`, `dist`, `coverage`, `.env*`, `*.pem`, файлы с `token` / `secret` / `key` в названии и сама папка `site/backups`.

Примечание: стандартный `Compress-Archive` сначала получил ошибку доступа к занятому `site\prisma\dev.db`. До правок backup был повторно создан через .NET zip stream с read-sharing, с теми же исключениями.

## Выводы read-only агентов

### Agent 1 - Background Cleanup Finder

- Прямых runtime-совпадений `section-ambient*`, `signal-bg*` и `blueprint` в проверенных файлах главной не найдено.
- `ambient` остался только как локальное имя в старом canvas-компоненте `particle-constellation.tsx`, не в runtime JSX главной.
- Важный конфликт: все post-hero секции используют `lab-section lab-section--void`, поэтому общий родительский фон был бы скрыт. Фон нужно применять на уровне секций.
- Найдены локальные pseudo-element/gradient эффекты, которые нельзя ломать: `system-line--live`, `architecture-layer-stack`, `production-telemetry`, `ops-process-rail`, `final-cta-section`, `system-passport`.

### Agent 2 - Section Rhythm Planner

- `live-system-section`: фон заметнее, первый сигнал после hero.
- `proof-showreel`: максимально чисто, чтобы не спорить с паспортом кейса.
- `architecture-section`: фон заметный, но привязан к архитектурной логике и левой части.
- `production-manifest-section`: фон слабее, чтобы не конфликтовать с telemetry board.
- `operations-section`: тематически сильное место, но без давления на process rail.
- `final-cta-section`: почти trace-level, с мягким glow.
- `faq-section`: чисто или почти без фона ради чтения.

### Agent 3 - Implementation Risk Auditor

- Минимальный scope: `site/src/app/page.tsx`, `site/src/components/public/system-passport-showreel.tsx`, `site/src/app/globals.css`, `site/PROJECT_MAP.md`, новый report.
- Не трогать `scroll-sequence-hero.tsx`, WebP sequence assets, header, layout, forms, API, admin, Prisma, legal pages.
- Не оборачивать `<ScrollSequenceHero />`; добавлять фон только после hero.
- Любое движение должно быть scoped и выключаться через `prefers-reduced-motion`.

## Что найдено по старому фону

- `.section-ambient*` и `.signal-bg*` в runtime JSX/CSS главной не найдены.
- Старая ambient/grid/glow система не возвращалась.
- Локальные декоративные pseudo-elements внутри карточек, telemetry, process rail и CTA сохранены.

## Добавленные классы

- `.ops-bg`
- `.ops-bg--soft`
- `.ops-bg--right`
- `.ops-bg--left`
- `.ops-bg--center`
- `.ops-bg--clean`

Система использует:

- `.ops-bg::before` для тонких маршрутов, редких узлов и blueprint-линий;
- `.ops-bg::after` для мягкого glow и signal pulse;
- CSS variables для dark/light адаптации и секционной настройки;
- `opsSignalDrift` и `opsSignalPulse` для медленной динамики.

## Секции с фоном

- `Классы систем`: `.ops-bg ops-bg--center`.
- `Доказательства / Кейсы`: `.ops-bg ops-bg--clean`.
- `Архитектура`: `.ops-bg ops-bg--left`.
- `НЕ ДЕМО`: `.ops-bg ops-bg--right`.
- `Автономный бизнес-контур`: `.ops-bg ops-bg--soft`.
- Финальный CTA: `.ops-bg ops-bg--center`.
- FAQ: `.ops-bg ops-bg--clean`.

Первый hero / WebP sequence не трогался.

## PROJECT_MAP

В `site/PROJECT_MAP.md` обновлены:

- homepage positioning;
- раздел `Operational Signal Map Background`;
- список классов `.ops-bg*`;
- список секций, использующих фон;
- правило не возвращать `.section-ambient*` / `.signal-bg*`;
- dark/light поведение;
- `prefers-reduced-motion`;
- TODO про секционную настройку opacity/origin после visual QA.

## Защита читаемости

- Фон расположен в pseudo-elements с `z-index: 0`, контент секций поднят на `z-index: 1`.
- Opacity низкая и настраивается по секциям через CSS variables.
- Используется radial mask, чтобы линии не становились равномерной сеткой на весь экран.
- Для proof и FAQ применён `ops-bg--clean` с почти незаметными значениями.
- Для `production-manifest-section` фон мягче, чтобы не спорить с telemetry board.

## Dark / light

- Dark defaults: низко-контрастные white/cyan/violet/amber линии, узлы и glow.
- `[data-theme="light"] .ops-bg`: muted dark/blue/violet/amber variables.
- Light mode не превращался в финальный отдельный дизайн, но variables не ломают фон.

## Motion

- `opsSignalDrift`: медленное смещение route map, 42s.
- `opsSignalPulse`: мягкий pulse/glow, 36s.
- `prefers-reduced-motion: reduce` отключает animation для `.ops-bg::before` и `.ops-bg::after`.

## Изменённые файлы

- `site/src/app/page.tsx`
- `site/src/components/public/system-passport-showreel.tsx`
- `site/src/app/globals.css`
- `site/PROJECT_MAP.md`
- `site/docs/reports/operational-signal-bg-report.md`

## Что НЕ трогалось

- первый hero / `ScrollSequenceHero`;
- `site/public/sequence/hero-night/*.webp`;
- header/navigation;
- формы и заявки;
- admin;
- auth/session;
- API;
- Prisma schema/migrations/seed;
- legal pages;
- cookie/consent logic;
- тексты секций;
- карточки и интерактивная логика.

## Проверки

`npm.cmd run lint`

Результат: успешно. `eslint` завершился без ошибок.

`npm.cmd run build`

Результат: успешно. Next.js 16.2.9 compiled successfully, TypeScript passed, generated 55 static pages.

`rg -n "section-ambient|signal-bg" site\src`

Результат: runtime-совпадений в `site\src` нет.

`npm.cmd run typecheck` и `npm.cmd run test` не запускались: scripts отсутствуют в `package.json`.

## TODO / manual QA

- Browser visual QA не запускался: текущие инструкции разрешают браузер только при явном разрешении владельца.
- Владельцу стоит проверить `/` на desktop/mobile в dark и light mode.
- Если фон окажется слишком заметным или слишком слабым, настраивать per-section variables, а не глобальную систему.
