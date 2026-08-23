# Mobile header real fix

## Цель

Исправить фактическую видимость верхней CTA "Разобрать процесс" на мобильных ширинах и устранить hydration mismatch по `data-theme` без редизайна и без изменений admin/API/Prisma/auth/security/`src/lib/*`.

## Почему предыдущий фикс не сработал

В `src/components/header.tsx` desktop CTA уже была переведена на `lg:inline-flex`, но сама ссылка также имела класс `btn-primary`.

В `src/app/globals.css` у `.btn-primary` задано:

```css
display: inline-flex;
```

Этот кастомный display визуально перебивал `hidden` на самой ссылке, поэтому ручная проверка показывала CTA в верхней строке на mobile.

## Найденные CTA в header

1. Desktop CTA:
   - location: `site/src/components/header.tsx`
   - wrapper class: `hidden lg:block`
   - link class: `btn-primary text-sm`
   - comment: `Desktop-only CTA. Mobile CTA lives inside mobile menu.`

2. Mobile-menu CTA:
   - location: внутри раскрытого блока `id="mobile-navigation"`
   - link class: `btn-primary mt-3 text-center text-sm`

## Что исправлено в header

- Desktop CTA обёрнута в parent wrapper `hidden lg:block`.
- На самой CTA оставлен `btn-primary text-sm`; теперь глобальный `display: inline-flex` у `.btn-primary` не может показать кнопку на mobile, потому что скрыт родитель.
- Mobile CTA осталась внутри раскрытого mobile menu.
- Сохранены `shrink-0` для brand/right controls и `min-w-0` для container/nav.
- Burger сохраняет `type="button"`, `aria-controls="mobile-navigation"`, `aria-expanded={mobileOpen}` и `aria-label`.

## Hydration mismatch

- В `site/src/app/layout.tsx` добавлен `suppressHydrationWarning` на `<html>`, потому что inline bootstrap меняет `data-theme` до React hydration на основе `localStorage`/`prefers-color-scheme`.
- В `site/src/components/theme-toggle.tsx` добавлен флаг `themeReady`, чтобы первый effect не затирал сохранённую тему дефолтным `light` перед применением resolved theme.
- Поддержка `[data-theme="dark"]` сохранена.
- Light/dark toggle сохранён.
- CSP/nonce/security headers не трогались.

## Изменённые файлы

- `site/src/components/header.tsx`
- `site/src/app/layout.tsx`
- `site/src/components/theme-toggle.tsx`
- `site/reports/design/2026-07-02-mobile-header-real-fix.md`

## ZIP-бэкапы

- Before: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-2339-before-mobile-header-real-fix.zip`
- After: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backup-optimatesite-20260702-2342-after-mobile-header-real-fix.zip`

## Проверки

- `npm.cmd run lint` — passed.
- `npm.cmd run build` — passed.

## Что не проверялось

- Browser preview/manual viewport не запускался.
- Browser automation, Playwright, Puppeteer не запускались по runtime-правилам проекта.
- Console после ручной загрузки браузера не проверялась автоматически.

## Manual verification checklist для владельца

1. 320px: верхняя CTA не видна.
2. 390px: верхняя CTA не видна.
3. 430px: верхняя CTA не видна.
4. 640px: верхняя CTA не видна.
5. 768px: верхняя CTA не видна.
6. 1023px: верхняя CTA не видна.
7. 1024px: desktop CTA видна.
8. В открытом mobile menu CTA "Разобрать процесс" есть.
9. В console больше нет hydration mismatch по `data-theme`.

## Scope confirmation

Admin, API, Prisma, auth, MFA, CSRF, rate-limit, security headers, CSP и `src/lib/*` не трогались.
