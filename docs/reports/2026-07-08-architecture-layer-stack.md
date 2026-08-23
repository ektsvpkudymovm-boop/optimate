# Architecture Layer Stack

Дата: 2026-07-08

## Summary

Точечно переработан блок главной страницы `АРХИТЕКТУРА / Операционный контур держится на слоях...`.
Правая колонка заменена с текстового списка на визуальную схему из шести горизонтальных архитектурных слоёв.

## Backup

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-architecture-layer-stack-20260708-2217.zip`

## Changed Files

- `site/src/app/page.tsx`
- `site/src/app/globals.css`
- `site/docs/reports/2026-07-08-architecture-layer-stack.md`

## Routes

Changed:
- `/`

Preserved:
- первый hero;
- блок `НЕ ДЕМО`;
- блок `АВТОНОМНЫЙ БИЗНЕС-КОНТУР`;
- кейсы / доказательства;
- header;
- day mode;
- `/work`, `/cases`, `/capabilities`;
- admin, api, prisma, forms, legal.

## Implementation

- Добавлены микрометки для каждого слоя в локальный массив `ARCHITECTURE_LAYERS`.
- Правая колонка теперь использует `architecture-layer-stack` и строки `architecture-stack-row`.
- Добавлены тонкая вертикальная линия связи, маркеры слоёв, мягкие amber/cyan/violet акценты и компактные метки.
- Hover/focus/active подсвечивает выбранный слой и приглушает остальные при поддержке `:has`.
- Добавлены CSS-анимации раскрытия строк, проходящего сигнала по вертикальной линии и мягкого импульса слоя.
- `prefers-reduced-motion` отключает движение и оставляет статичную схему.

## Checks

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

## TODO

- Нет.

## Manual QA

- Визуально проверить блок `/` на desktop и mobile.
- Проверить hover/focus по слоям.
- Проверить режим `prefers-reduced-motion`.

