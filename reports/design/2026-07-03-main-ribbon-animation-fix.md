# Main Ribbon Animation Fix

Дата: 2026-07-03

## Рабочая директория

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site`

## Подтверждения

- Изменялся только основной проект `site`.
- Дубль `site-design-2030` не изменялся.
- Admin/API/Prisma/auth/security/src/lib не изменялись.
- Dev-сервер и браузерная проверка не запускались.

## Изменённые файлы

- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/public/hero-bg.tsx`
- `reports/design/2026-07-03-main-ribbon-animation-fix.md`

## Анимация связей

- Замедлено движение точек по связям в hero canvas: шаг `pulseOffset` уменьшен с `0.004` до `0.0018`, то есть примерно в 2.2 раза.
- Добавлен мягкий breathing-эффект через плавное изменение радиуса и прозрачности точек.
- `prefers-reduced-motion` сохранён: при reduced motion canvas-пульсация не запускается.

## Process ribbon

- Лента вынесена из маленькой капсулы в левой колонке hero в отдельный full-width band внутри hero-секции.
- Desktop: лента идёт на всю ширину секции, визуально шире контейнера с текстом, с повтором маршрута для непрерывного движения.
- Tablet: уменьшены отступы и длительность сохранена спокойной, лента остаётся компактной.
- Mobile 320/390/430px: уменьшены padding, gap, размер стрелок и шрифт; контейнер `overflow: hidden` и `max-width: 100vw` защищают от horizontal overflow.
- Текст ленты: `Новая заявка -> Проверка -> CRM -> Задача -> n8n -> Уведомление -> Статус -> Аналитика`.

## Backup

- Before ZIP: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backup-optimatesite-20260703-0101-before-main-ribbon-animation-fix.zip`
- After ZIP: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backup-optimatesite-20260703-0104-after-main-ribbon-animation-fix.zip`

Исключения для ZIP: `node_modules`, `.next`, `dist`, `build`, `.git`, `.env*`, `prisma/dev.db`, `dev.db`, `logs`, backup ZIPs.

## Проверки

- `npm.cmd run lint` — passed.
- `npm.cmd run build` — passed.

## Что не проверялось

- Браузерная проверка и Playwright не запускались по runtime guardrails.
- Dev-сервер `npm run dev` не запускался.
