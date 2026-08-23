# Landing V2 — Brand Expression + Asset Production Pass

## Result

`/landing-v2` сохранил утверждённую логику и тексты, но получил живой слой бренда: материальные editorial-сцены связывают HTML-продукт, knowledge-workbench, кейсы и финальный CTA в одну систему. Это не редизайн страницы и не замена UX-механик.

## 1. What was weak before

- Hero и финальный CTA существовали как чистые layout-блоки: product/UI были аккуратны, но не ощущались частью реального рабочего мира.
- ИИ-Википедия показывала логику, но не передавала материальность и ценность корпоративного знания.
- Три кейса использовали одинаковые серые visual-панели и не создавали отдельных контекстов бизнеса.

## 2. Brand expression decisions

- **Operational Editorial:** система показана через реальные бизнес-материалы — документы, металл, стекло, текстиль, точный свет и рабочую поверхность.
- **Palette discipline:** cream / dark ink / oxide остаются связующим языком; нет фиолетовых градиентов, неона, cyberpunk, glassmorphism или абстрактной «нейросети».
- **HTML remains primary:** визуалы — фон и framing. Заголовки, смысл, CTA, форма и product demo остаются настоящим доступным HTML.
- **One world per case:** у каждого кейса есть собственный узнаваемый материал, без фальшивых KPI и без generic stock сцены.

## 3. Sections touched

| Block | Change |
| --- | --- |
| 01 Hero | Сгенерированный operational-desk образует physical frame вокруг существующей product demo. |
| 04 ИИ-Википедия | Документный/каталожный фрагмент встроен в question-side workbench с лёгким cream overlay. |
| 09 Кейсы | Все три placeholder-панели заменены на индивидуальные editorial material scenes. |
| 12 Final CTA | Ночная operational-сцена встроена как сдержанный full-bleed background под HTML copy и форму. |

## 4. Generated assets and use

All assets were generated with the built-in image generation workflow and selected for a common art direction. The detailed plan, prompt intent, responsive crops and final file names live in [`LANDING_V2_BRAND_EXPRESSION_AND_ASSETS.md`](../LANDING_V2_BRAND_EXPRESSION_AND_ASSETS.md).

| Asset | Saved path | Used in |
| --- | --- | --- |
| `hero-operational-desk.png` | `public/landing-v2/assets/hero/` | Hero demo frame |
| `knowledge-catalog.png` | `public/landing-v2/assets/block-04/` | ИИ-Википедия question surface |
| `case-precious-metal.png` | `public/landing-v2/assets/block-09/` | Case 01: монеты и слитки |
| `case-perfume-intelligence.png` | `public/landing-v2/assets/block-09/` | Case 02: премиальная парфюмерия |
| `case-textile-operations.png` | `public/landing-v2/assets/block-09/` | Case 03: одежда, звонки и встречи |
| `cta-operations-night.png` | `public/landing-v2/assets/block-12/` | Final CTA |

## 5. Quality gate

- Removing any of the three case assets removes its concrete business world and returns the block to a generic passport layout; therefore all three are retained.
- Hero framing makes the demo read as a physical operating system rather than a detached UI image.
- The knowledge asset adds a quiet catalogue/material cue while the product logic remains primary.
- The final asset adds depth and a remembered end state without competing with the form.

## 6. Responsive QA

Browser QA on `/landing-v2` verified these viewport widths. At each width all three case panels were rendered and `scrollWidth` equalled `clientWidth` (no horizontal overflow).

| Viewport width | Result | Screenshot |
| ---: | --- | --- |
| 1440 | Passed | `docs/reports/landing-v2-brand-expression/landing-v2-1440.png` |
| 1280 | Passed | `docs/reports/landing-v2-brand-expression/landing-v2-1280.png` |
| 1024 | Passed | `docs/reports/landing-v2-brand-expression/landing-v2-1024.png` |
| 768 | Passed | `docs/reports/landing-v2-brand-expression/landing-v2-768.png` |
| 390 | Passed | `docs/reports/landing-v2-brand-expression/landing-v2-390.png` |
| 360 | Passed | `docs/reports/landing-v2-brand-expression/landing-v2-360.png` |

Key section captures are in the same directory. On mobile the case panels become vertical, preserve their subjects through `background-position: center`, and the Hero/product frame reduces to an 8px material edge so it never causes overflow.

## 7. Checks

| Check | Result |
| --- | --- |
| `npx.cmd eslint src/components/landing-v2/cases-section.tsx src/components/landing-v2/landing-v2-data.ts` | Passed — 0 errors |
| Browser console (errors) | Passed — 0 errors |
| Runtime background-image checks | Passed — hero, knowledge, all 3 cases, and CTA reference local assets |
| `npm.cmd run build` | Passed |

## 8. Explicitly not changed

- The legacy `/` route and all other public routes.
- Admin routes, auth, API, Prisma, CMS, consent/cookies and analytics.
- Mini-audit questions, recommendations and its logic.
- Form behaviour: it remains the existing local submit state; no real submission or backend integration was added.
- Existing section hierarchy and landing copy.

## 9. Backup

`C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-landing-v2-brand-expression-20260823-170118.zip`

## 10. Manual QA for owner

- Review the amount of darkness behind the CTA copy on the target production display; it is intentionally restrained so the form remains first.
- Confirm that the generated case worlds match the real visual language of each client category before any public campaign is launched.
- If assets are converted to WebP/AVIF in a later performance pass, preserve their current filenames/paths through matching references or update the four CSS/data consumers together.
