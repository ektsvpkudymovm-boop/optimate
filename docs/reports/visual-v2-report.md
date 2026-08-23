# Visual V2 Report

Дата и время: 2026-07-07 16:28:47 +05:00

Backup zip: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-visual-v2-20260707-1612.zip`

## Использованные read-only агенты

1. Visual Direction Auditor
   - Текущий вид всё ещё читался как SaaS: split-layout hero, dashboard-card справа, стандартные карточки, blue/cyan CTA, обычный header.
   - Рекомендовал превратить hero в операционный центр, усилить day/night, убрать ощущение карточки-диаграммы, меньше полагаться на типовые pills/cards.

2. IA / Content Dedup Auditor
   - Нашёл дублирование `/capabilities` и `/work`: capabilities подтягивал мини-кейсы и становился второй витриной.
   - Нашёл дефект фильтра: `geo-ai-search` был в capabilities, но отсутствовал в `WORK_FILTERS`.
   - Рекомендовал `/capabilities` как классы систем, `/work` как системные паспорта, `/cases` как legacy/совместимый маршрут.

3. Implementation Risk Auditor
   - Рекомендовал менять только публичный слой и не трогать `admin`, `api`, `prisma`, auth/session/db.
   - Отметил риск глобального CSS: базовые `.btn`, `.card`, `.input` могут затронуть админку, поэтому Visual V2 лучше делать scoped-классами.
   - Подтвердил, что в `package.json` есть `lint` и `build`; `typecheck` и `test` scripts отсутствуют.

## Что изменено

- Главная переработана в Visual V2:
  - hero стал operation-core сценой, а не блоком “текст + карточка”;
  - добавлены статус day/night, telemetry nodes, proof strip;
  - добавлены `Architecture Stack`, `Proof Console`, `Не no-code-демо`, day/night operations timeline.
- `HeroBg` заменён на canvas-сцену `AI Operations Core` с дорожками данных, узлами `Leads`, `CRM`, `AI Agents`, `RAG`, `n8n/API`, `Analytics`, `Telegram`, `WordPress`, `1C / ERP`, `Human Review`.
- Theme toggle стал режимным контролом `Day ops / Night run`, а не одиночной иконкой.
- Header получил lab/product-сигнатуру, active states и более сдержанный CTA.
- `/capabilities` переработан как страница классов систем: `when needed`, `output`, `control`, `related case types`.
- `/work` переработан как портфолио систем: фильтры по capability, featured systems, system passport cards.
- `geo-ai-search` добавлен в `WORK_FILTERS`.
- `/cases` сохранён и получил недостающий фильтр `web-apps`.
- Footer получил явную подпись `AI Product & Automation Lab`.

## Затронутые файлы

- `site/src/app/page.tsx`
- `site/src/app/globals.css`
- `site/src/components/public/hero-bg.tsx`
- `site/src/components/header.tsx`
- `site/src/components/theme-toggle.tsx`
- `site/src/components/footer.tsx`
- `site/src/content/capabilities.ts`
- `site/src/app/(public)/capabilities/page.tsx`
- `site/src/app/(public)/work/page.tsx`
- `site/src/app/(public)/cases/page.tsx`
- `site/docs/reports/visual-v2-report.md`

## Изменённые страницы

- `/`
- `/capabilities`
- `/work`
- `/cases` только совместимый фильтр и legacy-подача

## Сохранённые старые маршруты

- `/cases`
- `/cases/[slug]`
- `/solutions`
- Юридические маршруты не менялись.

## Проверки

- `npm.cmd run lint` — прошло.
- `npm.cmd run build` — запускался 2 раза и оба раза упал на TypeScript narrowing в `HeroBg`.
- `npm.cmd run typecheck` — не запускался, script отсутствует в `package.json`.
- `npm.cmd run test` — не запускался, script отсутствует в `package.json`.

## Ошибки build

1. Первый запуск `npm.cmd run build`:

```text
./src/components/public/hero-bg.tsx:249:20
Type error: 'canvas' is possibly 'null'.
```

Исправлено через стабильную локальную ссылку `canvasElement`.

2. Второй запуск `npm.cmd run build`:

```text
./src/components/public/hero-bg.tsx:256:7
Type error: 'ctx' is possibly 'null'.
```

Исправлено через стабильную локальную ссылку `context`.

По runtime guardrail команда `npm.cmd run build` не повторялась третий раз. Владельцу нужно вручную повторить `npm.cmd run build`.

## TODO

- Владельцу вручную запустить `npm.cmd run build` после последних TypeScript-исправлений.
- Вручную открыть сайт в браузере и проверить визуал в светлой/тёмной теме.
- После ручной проверки при необходимости точечно подстроить spacing/canvas framing на реальных viewport.

## Что проверить владельцу вручную в браузере

- Главная: hero должен выглядеть как полноценная сцена AI Operations Core, не как правая карточка-диаграмма.
- Theme toggle: в light виден режим `Human-in-control`, в dark — `Autonomous mode`; canvas меняет настроение.
- `/capabilities`: страница должна объяснять классы систем, а не повторять портфолио.
- `/work`: фильтры, включая `GEO / AI Search`, должны показывать релевантные системные паспорта.
- `/cases` и `/cases/[slug]`: старый маршрут должен оставаться рабочим.
- Mobile: hero, cards, filters и proof-console не должны перекрывать текст.
