# Home / Work Client Language Fix

Дата: 2026-07-09 09:29 +05:00

## 1. Что было проблемой

Блок на главной выглядел как внутренняя классификация разработки: `What we build`, "Классы систем, а не витрина услуг", англоязычные названия карточек и технические подписи. На `/work` часть фильтров и служебных подписей также оставалась на английском или в формате внутренних терминов.

## 2. Какие visible англицизмы убраны

- `What we build`
- `AI Agents`
- `CRM / Business OS`
- `Content Factories`
- `E-commerce AI`
- `Automation Pipelines`
- `GEO / AI Search`
- `Web / Interfaces`
- `System passports`
- `System passport`
- `Featured systems`
- `Featured passport`
- `Filtered passports`
- `All systems`
- `HITL`
- `Production`
- `MVP`
- `Stack / integrations`

## 3. Новые labels на главной

- Блок: `ЧТО МОЖНО АВТОМАТИЗИРОВАТЬ`
- Заголовок: `Выберите участок процесса, где нужна AI-система`
- Пояснение: `Нажмите на тип задачи — покажем кейсы с похожими контурами: заявки, база знаний, CRM, контент, продажи, интеграции или AI-поиск.`
- Карточки:
  - `AI-агенты`
  - `Базы знаний / RAG`
  - `CRM и управление процессами`
  - `Контент-процессы`
  - `AI для онлайн-продаж`
  - `Автоматизация процессов`
  - `Видимость в AI-поиске`
- Действие в карточках: `Смотреть кейсы`

## 4. Labels фильтров `/work`

- `Все`
- `AI-агенты`
- `Базы знаний / RAG`
- `CRM и процессы`
- `Контент-процессы`
- `Онлайн-продажи`
- `Автоматизация`
- `AI-поиск / GEO`
- `Интерфейсы`

## 5. Переход `/work?type=...#work-results`

Карточки главной теперь ведут в формат:

```text
/work?type={capability.id}#work-results
```

На `/work` добавлен якорь `#work-results` перед блоком фильтра и результатов. Старый `#work-passports` оставлен на секции результатов для обратной совместимости старых ссылок.

## 6. Изменённые файлы

- `src/app/page.tsx`
- `src/app/(public)/work/page.tsx`
- `src/content/capabilities.ts`
- `src/app/globals.css`
- `src/lib/seo.ts`
- `PROJECT_MAP.md`
- `README.md`
- `README_HANDOFF.md`
- `docs/reports/home-work-client-language-fix-20260709-0929.md`

## 7. Визуал главной

Визуальная структура главной не перестраивалась. Сетка блока, hero, WebP sequence, `ScrollSequenceHero`, `.home-page`, `.ops-bg*`, `ProductionTelemetryBoard` и `OperationsProcessRail` не менялись.

## 8. ids / slugs / query params

Capability ids, slugs, case slugs и query params не менялись. Изменены только visible labels, copy и целевой hash-якорь карточек на новый `#work-results`; старый `#work-passports` сохранён.

## 9. `npm.cmd run lint`

Результат: passed.

```text
> site@0.1.0 lint
> eslint
```

## 10. `npm.cmd run build`

Результат: passed.

```text
✓ Compiled successfully
✓ Generating static pages using 23 workers (55/55)
```

## 11. Backup

- Pre-change backup: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-before-home-work-client-language-fix-20260709-0923.zip`
- Post-change backup: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\backups\site-after-home-work-client-language-fix-20260709-0929.zip`
- Verification: archive size is greater than `0`, `838` entries, forbidden files count `0`.

## 12. Browser QA

Не выполнена: запуск hidden dev-server через `Start-Process` был заблокирован Windows access control / Codex sandbox (`CreateProcessAsUserW failed: 5`, затем `orchestrator_helper_launch_failed ... Отказано в доступе`). Формы и admin не открывались.

## 13. Что проверить вручную

- `/`: нет `WHAT WE BUILD` и "Классы систем, а не витрина услуг".
- `/`: блок звучит как `Что можно автоматизировать`, карточки на русском, действие `Смотреть кейсы`.
- Клик по `AI-агенты` ведёт на `/work?type=ai-agents#work-results`.
- `/work?type=ai-agents#work-results`: активен фильтр `AI-агенты`, пользователь попадает к фильтру и кейсам.
- `/work`: фильтры на русском; нет `HITL`, `Featured systems`, `System passports`, `All systems`.
- `/cases/ai-organic-flow`: детальный кейс открывается.
- `/contacts`: CTA выглядит корректно, форму не отправлять при ручной визуальной проверке.
