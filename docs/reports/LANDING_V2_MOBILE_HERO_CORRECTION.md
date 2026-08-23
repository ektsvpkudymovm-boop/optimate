# Landing V2 — mobile hero monitor correction

## Итог

На `/landing-v2` Hero monitor на ширинах до 768px теперь остаётся горизонтальным desktop display. Внутри него используется отдельный HTML-режим `compact-landscape`: верхняя прокручиваемая локально rail-навигация и две компактные рабочие панели. Высота физического монитора и ScreenViewport не меняется при смене раздела.

Desktop Hero и GSAP full reveal сохранены: на desktop отображается исходный полный System Demo с sidebar.

## Изменённые файлы

- `src/components/landing-v2/hero-section.tsx` — передача presentation mode в Hero System Demo; также удалён ранее согласованный служебный лейбл над монитором.
- `src/components/landing-v2/optimate-system-demo.tsx` — режим `compact-landscape`, адаптивная подписка на breakpoint и компактные данные шести разделов.
- `src/app/landing-v2/landing-v2.module.css` — landscape geometry, минимальный hardware, fixed ScreenViewport, compact UI и mobile handoff spacing.

## QA и артефакты

- [390px: полный landscape monitor](landing-v2-mobile-hero/hero-monitor-mobile-landscape-390.png)
- [390px: handoff к Hidden Cost](landing-v2-mobile-hero/hero-monitor-mobile-handoff-390.png)
- [360px: compact landscape](landing-v2-mobile-hero/hero-monitor-mobile-landscape-360.png)
- [320px: проверка H1](landing-v2-mobile-hero/hero-mobile-320.png)
- [Desktop 1280×800](landing-v2-mobile-hero/hero-monitor-desktop-1280x800.png)
- [Desktop 1440×900](landing-v2-mobile-hero/hero-monitor-desktop-1440x900.png)

Browser QA:

- 390×844: monitor 347×224px, compact demo 205px, horizontal overflow отсутствует; handoff до kicker Hidden Cost — 73px.
- 360×800: monitor 319×206px, compact demo помещается в bezel, horizontal overflow отсутствует.
- 320×568, 375×812, 430×932 и tablet breakpoint: H1 не расширяет страницу; mobile presentation включается до 768px.
- Desktop 1280×800 и 1440×900: compact mode выключен, сохранены исходные sidebar и полный System Demo.
- Вкладки «Обзор», «Звонки», «Знания», «Продажи», «Процессы», «Аналитика» присутствуют в rail и используют существующий `onClick`/active-state. Chrome QA не смог инжектировать native mouse-event из-за тайм-аута транспорта `Input.dispatchMouseEvent`; ручной tap в обычном Chrome остаётся финальной быстрой проверкой владельца.

## Проверки

- `npm.cmd run lint` — успешно.
- `npm.cmd run build` — успешно.

## Git / remote

- Branch: `landing-v2-design`
- Feature commit: `a1d33f2894642a067ad904cd7c214cee45e5c4b3`
- Message: `fix(landing-v2): use landscape hero monitor on mobile`
- Push: успешно в `origin/landing-v2-design`; `git ls-remote` подтвердил этот commit на remote branch.

## Backup

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-mobile-hero-landscape-20260823-2356.zip`

## TODO для владельца

В Chrome на телефоне или в DevTools вручную нажать все шесть пунктов rail-навигации. Это закрывает единственную часть QA, которую текущий Chrome transport не позволил выполнить программно.
