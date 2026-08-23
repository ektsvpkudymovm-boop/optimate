# Mobile header fix

## Цель задачи

Точечно исправить мобильную шапку OptiMate: убрать верхний CTA "Разобрать процесс" из диапазона 320-1023px, сохранить CTA внутри раскрытого мобильного меню и не менять дизайн, админку, API, Prisma, auth/security и `src/lib/*`.

## Изменённые файлы

- `site/src/components/header.tsx`
- `site/reports/design/2026-07-02-mobile-header-fix.md`

## ZIP-бэкапы

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-2328-before-mobile-header-fix.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-2332-after-mobile-header-fix.zip`

## Что исправлено в header

- Верхний CTA в header изменён с `sm:inline-flex` на `lg:inline-flex`, поэтому он скрыт на 320-1023px и появляется с desktop breakpoint 1024px.
- CTA "Разобрать процесс" оставлен в раскрытом mobile menu.
- Brand link получил `shrink-0`.
- Правый блок с CTA/theme-toggle/burger получил `shrink-0`.
- Header container и desktop nav получили `min-w-0`.
- Burger получил `type="button"`, `aria-controls="mobile-navigation"` и `aria-expanded={mobileOpen}`.
- Контейнер mobile menu получил `id="mobile-navigation"`.

## Breakpoint'ы

Проверялись по классам Tailwind и структуре JSX:

- 320px: верхний CTA скрыт, доступны brand/theme-toggle/burger.
- 360px: верхний CTA скрыт, доступны brand/theme-toggle/burger.
- 390px: верхний CTA скрыт, доступны brand/theme-toggle/burger.
- 430px: верхний CTA скрыт, доступны brand/theme-toggle/burger.
- 640px: верхний CTA скрыт, несмотря на `sm`.
- 768px: верхний CTA скрыт.
- 1024px: desktop CTA включается через `lg:inline-flex`, burger скрывается через `lg:hidden`, desktop nav включается через `lg:flex`.

## Результаты проверок

- `npm.cmd run lint` — passed.
- `npm.cmd run build` — passed.

## Что не проверялось

- Browser preview/manual viewport не запускался.
- Playwright/Puppeteer/browser automation не запускались из-за runtime-правил проекта.
- Фактический horizontal overflow в браузере не измерялся автоматически; риск снижен статической проверкой responsive-классов и `shrink-0`/`min-w-0`.

## Риски/сомнения

- Визуальная проверка на реальных viewport'ах 320/360/390/430/640/768/1024px остаётся ручной проверкой владельца проекта.

## Подтверждение scope

Security/auth/API/admin/Prisma не трогались. Файлы `src/lib/*` не трогались.
