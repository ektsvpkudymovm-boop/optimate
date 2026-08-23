# Visual V4 Browser Report

Дата и время: 2026-07-07 21:31:34 +05:00

Backup zip: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-visual-v4-browser-20260707-211452.zip`

## Прочитанные reference-файлы

- `AGENTS.md`
- `site/docs/design-references/dala/DESIGN.md`
- `site/docs/design-references/dala/theme.css`
- `site/docs/design-references/dala/variables.css`
- `site/docs/design-references/dala/tokens.json`
- `site/docs/reports/visual-v3-reference-report.md`
- `C:\Users\user\.codex\attachments\d30248ab-7579-426c-9c49-d04a31bca9e4\pasted-text-1.txt`

## Read-only агенты

Agent 1, Reference Screenshot Critic:
- Reference требует asymmetric two-column hero, огромную лёгкую типографику, один violet CTA и плотную organic brain/cloud particle shape справа.
- Ключевой запрет: не превращать visual в dashboard/process map, boxed nodes, grid или обычный AI scatter.

Agent 2, Current Screenshot Critic:
- Текущая `/` до V4 имела частицы за текстом, случайные переносы, labels в particle layer, crowded header и cookie banner, который ломал первый экран.
- Ordinary AI-generated look создавали: uniform scatter, tech labels, glow без композиции, crowded controls и отсутствие отдельного hero object.

Agent 3, Implementation Planner:
- Рекомендовал изолированный route `/visual-lab/dala-hero`, новый scoped V4 component/CSS, затем перенос на `/`.
- Подтвердил запрет на admin/auth/API/Prisma/legal/forms.

## Baseline build

Команда:

```text
npm.cmd run build
```

Статус: прошла. Ошибка `hero-bg.tsx canvas/context null` из Visual V3 report больше не воспроизводится.

## Visual iterations

Сделано 3 visual iterations:

1. Prototype route создан и снят в desktop. Вывод: текстовая колонка стала чище, но particle field был низким прямоугольным шумом.
2. Добавлен отдельный rim-layer частиц, увеличена плотность и убраны labels/nodes/grid. Вывод: форма стала читатьcя как organic cloud.
3. Исправлен desktop hamburger через mobile wrapper; desktop header стал минимальным.

Cookie banner для screenshots был закрыт через вариант `Только необходимые`, analytics cookies не включались.

## Что исправлено

- Добавлен новый canvas component `ParticleConstellation` без внешних библиотек.
- Добавлен общий hero component `VisualV4Hero` для prototype и `/`.
- Создан route `/visual-lab/dala-hero`, не добавлен в меню.
- Главная `/` переведена на V4 hero.
- Header сокращён до 4 nav links + one violet CTA + compact theme toggle.
- Theme toggle теперь показывает:
  - Night / Autonomous
  - Day / Human-in-control
- Dark mode получил black void, лёгкий H1, один filled violet CTA и отдельную right-side particle constellation.
- Day mode использует ту же композицию: warm bone background, graphite text, violet CTA, soft particle palette.
- Mobile stack перестал накладывать particles на H1.

## Screenshots

Сохранены в `site/docs/reports/visual-v4-screenshots/`:

- `reference-desktop.png`
- `baseline-home-desktop.png`
- `baseline-home-mobile.png`
- `prototype-cookie-state.png`
- `prototype-iteration-1-desktop.png`
- `prototype-iteration-2-desktop.png`
- `prototype-iteration-3-desktop.png`
- `optimate-v4-desktop.png`
- `optimate-v4-mobile.png`
- `optimate-v4-day-desktop.png`
- `optimate-v4-day-mobile.png`

Примечание: screenshots сняты с локального Next dev-server, поэтому в левом нижнем углу виден dev indicator Next.js. В production build его не будет.

## Затронутые файлы

- `site/src/components/public/particle-constellation.tsx`
- `site/src/components/public/visual-v4-hero.tsx`
- `site/src/app/visual-lab/dala-hero/page.tsx`
- `site/src/app/page.tsx`
- `site/src/app/globals.css`
- `site/src/components/header.tsx`
- `site/src/components/theme-toggle.tsx`
- `site/docs/reports/visual-v4-browser-report.md`

## Изменённые маршруты

- `/`
- `/visual-lab/dala-hero`

## Сохранённые маршруты

- `/work`
- `/capabilities`
- `/solutions`
- `/cases`
- `/cases/[slug]`
- `/approach`
- `/about`
- `/contacts`
- `/privacy`
- `/consent`
- `/cookies`
- `/terms`
- `/admin/*`
- `/api/*`

Admin/auth/API/Prisma/legal pages и формы заявок не изменялись.

## Проверки

Запущены:

```text
npm.cmd run lint
npm.cmd run build
```

Результат:

- `npm.cmd run lint` — прошла.
- `npm.cmd run build` — прошла.

Не запускались, потому что отсутствуют scripts в `package.json`:

- `npm.cmd run typecheck`
- `npm.cmd run test`

## TODO

- Вручную проверить первый визит с cookie banner: баннер юридически нужен, но визуально перекрывает hero до выбора cookie.
- Вручную проверить `/work` и `/capabilities` после visual pivot в реальном браузере.
- Перед production проверить light/dark theme persistence после очистки localStorage.

## Что владельцу проверить вручную

- `/` desktop 1440x900: black void, H1 слева, organic particle constellation справа.
- `/` mobile 390x844: H1 читается, particles не перекрывают текст.
- Day mode: не возвращается старый SaaS/dashboard look.
- `/visual-lab/dala-hero`: доступен, но не присутствует в основном меню.
- Cookie banner: аналитика не включается до согласия.
