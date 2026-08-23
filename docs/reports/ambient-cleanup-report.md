# Ambient cleanup report

Дата/время: 2026-07-08 23:45:35 +05:00

## Backup

Создан до правок:

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-before-ambient-cleanup-20260708-2341.zip`

Из архива исключались: `node_modules`, `.next`, `dist`, `coverage`, `.env*`, `*.pem`, файлы с `token`/`secret`/`key` в названии и сама папка `site/backups`.

## Выводы read-only агентов

### Agent 1 - Ambient CSS Finder

Найдена целевая CSS-система в `site/src/app/globals.css`:

- `.section-ambient`;
- `.section-ambient > *`;
- `.section-ambient::before`;
- `.section-ambient::after`;
- `.section-ambient--right`;
- `.section-ambient--left`;
- `.section-ambient--center`;
- `.section-ambient--soft`;
- `.section-ambient--none`;
- секционные overrides: `.live-system-section.section-ambient`, `.proof-showreel.section-ambient`, `.architecture-section.section-ambient`, `.production-manifest-section.section-ambient`, `.operations-section.section-ambient`, `.final-cta-section.section-ambient`, `.faq-section.section-ambient`;
- переменные `--ambient-*`;
- `@keyframes sectionAmbientDrift`;
- media rules для mobile и `prefers-reduced-motion`, относящиеся только к `.section-ambient`.

Отдельно отмечено, что `.proof-showreel::before`, `.proof-showreel::after`, canvas-glow в hero/particle components и component-specific grid/mask rules не относятся к удаляемой ambient-системе.

### Agent 2 - JSX Usage Finder

Найдено 7 runtime-использований `section-ambient*`:

- `site/src/app/page.tsx` - секция What we build / live system;
- `site/src/components/public/system-passport-showreel.tsx` - proof showreel;
- `site/src/app/page.tsx` - architecture section;
- `site/src/app/page.tsx` - production manifest / NOT A DEMO;
- `site/src/app/page.tsx` - operations section;
- `site/src/app/page.tsx` - final CTA;
- `site/src/app/page.tsx` - FAQ.

### Agent 3 - Cleanup Risk Auditor

Агент подтвердил риски широкого удаления старых CSS-блоков и отдельно перечислил зоны, которые нельзя затрагивать: hero sequence, architecture stack, proof showreel, production telemetry / NOT A DEMO, CTA/FAQ, header и shared globals.

В части JSX агент дал более осторожную рекомендацию не удалять активные классы, но это противоречило явному критерию текущей задачи: `section-ambient*` не должны оставаться в runtime JSX/CSS. Реализация выполнена строго по целевому scope: удалены только ambient-классы, обычные layout-классы и контент сохранены.

## Найденные ambient-классы

- `section-ambient`;
- `section-ambient--right`;
- `section-ambient--left`;
- `section-ambient--center`;
- `section-ambient--soft`;
- `section-ambient--none`.

## Измененные файлы

- `site/src/app/page.tsx`;
- `site/src/components/public/system-passport-showreel.tsx`;
- `site/src/app/globals.css`;
- `site/docs/reports/ambient-cleanup-report.md`.

## Что удалено из JSX

Из `className` удалены только ambient-классы:

- `section-ambient`;
- `section-ambient--right`;
- `section-ambient--left`;
- `section-ambient--center`;
- `section-ambient--soft`.

Оставлены обычные классы секций:

- `lab-section`;
- `lab-section--void`;
- `live-system-section`;
- `proof-showreel`;
- `architecture-section`;
- `production-manifest-section`;
- `operations-section`;
- `final-cta-section`;
- `faq-section`.

Сами секции, компоненты и текстовый контент не менялись.

## Что удалено из CSS

Из `site/src/app/globals.css` удален целевой блок ambient background system:

- базовое правило `.section-ambient`;
- правила `.section-ambient > *`, `.section-ambient::before`, `.section-ambient::after`;
- modifier rules `.section-ambient--right`, `.section-ambient--left`, `.section-ambient--center`, `.section-ambient--soft`, `.section-ambient--none`;
- section-specific overrides для live/proof/architecture/production/operations/final CTA/FAQ;
- CSS variables `--ambient-*`, которые жили внутри этой системы;
- `@keyframes sectionAmbientDrift`;
- media rules, относящиеся только к `.section-ambient`.

## Поиск после очистки

Команда:

```powershell
rg -n "section-ambient|sectionAmbientDrift|--ambient-|ambient|grid glow" site\src -g '!**/.next/**' -g '!**/node_modules/**'
```

Результат: совпадений нет.

Дополнительные поиски:

```powershell
rg -n "grid glow" site\src site\docs -g '!**/.next/**' -g '!**/node_modules/**'
rg -n "section-ambient" site -g '!**/.next/**' -g '!**/node_modules/**' -g '!backups/**'
```

Результат до создания этого отчета: совпадений нет.

Case-insensitive поиск по `ambient` после правки:

```powershell
rg -ni "section-ambient|sectionambientdrift|--ambient-|ambient|grid glow" site\src -g '!**/.next/**' -g '!**/node_modules/**'
```

Результат: найдены только поля `isAmbient` в `site/src/components/public/particle-constellation.tsx`. Это локальное имя внутри отдельного canvas-компонента и не относится к удаленной `.section-ambient` системе секционных backgrounds.

## Проверки

`npm.cmd run lint`

Результат: успешно.

`npm.cmd run build`

Результат: успешно. Next.js 16.2.9 compiled successfully, TypeScript passed, generated 55 static pages.

`npm.cmd run typecheck`

Не запускался: script отсутствует в `package.json`.

`npm.cmd run test`

Не запускался: script отсутствует в `package.json`.

## Что не трогалось

- hero sequence и `.scroll-sequence-hero*`;
- header/navigation;
- admin routes, auth/session/admin API;
- lead API;
- Prisma schema/migrations;
- legal pages;
- cookie/consent logic;
- public content/copy;
- architecture stack;
- proof showreel functionality and passport cards;
- production telemetry / NOT A DEMO dashboard;
- autonomous process rail;
- CTA/FAQ content;
- component-specific grids/glows not tied to `.section-ambient`;
- `.env*` and secrets.

## TODO / manual QA

- Browser visual QA не запускался, потому что текущие инструкции разрешают браузер только при явном разрешении владельца на эту задачу.
- Владельцу стоит визуально проверить главную страницу после первого hero на desktop/mobile, чтобы утвердить пустое состояние фона перед отдельной задачей по новому фону.
