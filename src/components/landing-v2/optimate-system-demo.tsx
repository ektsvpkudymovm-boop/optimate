"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronRight, Database, FileText, Search } from "lucide-react";
import { demoNavigation, detailFacts, guidedSequence, overviewEvents, type DemoView } from "./system-demo-data";
import styles from "@/app/landing-v2/landing-v2.module.css";

const labels: Record<DemoView, string> = { overview: "Компания сегодня", communications: "Коммуникации", knowledge: "Корпоративные знания", sales: "Рабочий контекст продаж", processes: "Автоматизация", analytics: "Управленческие выводы" };

type Presentation = "standard" | "compact-landscape";

export function OptiMateSystemDemo({ presentation = "standard" }: { presentation?: Presentation }) {
  const [view, setView] = useState<DemoView>("overview");
  const [manual, setManual] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(false);
  const stepRef = useRef(0);

  const selectView = useCallback((next: DemoView, byUser = false) => {
    if (byUser) setManual(true);
    setView(next);
  }, []);

  const subscribeToPresentation = useCallback((onStoreChange: () => void) => {
    if (presentation !== "compact-landscape") return () => {};
    const media = window.matchMedia("(max-width: 768px)");
    media.addEventListener("change", onStoreChange);
    return () => media.removeEventListener("change", onStoreChange);
  }, [presentation]);

  const getPresentationSnapshot = useCallback(
    () => presentation === "compact-landscape" && window.matchMedia("(max-width: 768px)").matches,
    [presentation],
  );
  const isCompactLandscape = useSyncExternalStore(subscribeToPresentation, getPresentationSnapshot, () => false);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { isVisible.current = entry.isIntersecting && entry.intersectionRatio >= 0.45; }, { threshold: [0, 0.45] });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => {
      if (manual || motion.matches) return;
      const step = guidedSequence[stepRef.current];
      timer = setTimeout(() => {
        if (!isVisible.current) { schedule(); return; }
        stepRef.current = (stepRef.current + 1) % guidedSequence.length;
        setView(guidedSequence[stepRef.current].view);
        schedule();
      }, step.duration);
    };
    schedule();
    return () => { if (timer) clearTimeout(timer); };
  }, [manual]);

  return (
    <div ref={hostRef} className={`${styles.systemDemo} ${isCompactLandscape ? styles.compactLandscape : ""}`} aria-label="Интерактивная демонстрация интерфейса OptiMate">
      <aside className={styles.sidebar}>
        <div className={styles.systemBrand}><span>O</span><b>OptiMate</b></div>
        <span className={styles.sidebarCaption}>Рабочее пространство</span>
        <nav aria-label="Разделы системы" className={styles.systemNav}>
          {demoNavigation.map(({ id, label, icon: Icon }) => <button type="button" onClick={() => selectView(id, true)} data-active={view === id} key={id}><Icon size={17} /><span className={styles.desktopTabLabel}>{label}</span><span className={styles.mobileTabLabel}>{id === "communications" ? "Звонки" : label}</span>{id === "communications" && <i>5</i>}</button>)}
        </nav>
        <div className={styles.sidebarStatus}><span /> Система синхронизирована</div>
      </aside>
      <section className={styles.workspace}>
        <div className={styles.workspaceTop}><span className={styles.breadcrumb}>OptiMate <b>/</b> {labels[view]}</span><span>ОБНОВЛЕНО 10:47</span></div>
        <div className={styles.workspaceContent} key={view}>
          {isCompactLandscape ? <CompactLandscapeView view={view} /> : <>
            {view === "overview" && <Overview />}
            {view === "communications" && <Communications />}
            {view === "knowledge" && <Knowledge />}
            {view === "sales" && <Sales />}
            {view === "processes" && <Processes />}
            {view === "analytics" && <Analytics />}
          </>}
        </div>
      </section>
    </div>
  );
}

const compactViewContent: Record<DemoView, { eyebrow: string; title: string; summary: string; detail: string; actionLabel: string; action: string; status: string }> = {
  overview: { eyebrow: "ОПЕРАЦИОННАЯ СИСТЕМА", title: "Компания сегодня", summary: "Утренний контекст собран", detail: "Новые коммуникации собраны в один рабочий контекст.", actionLabel: "СОБЫТИЕ · 10:42", action: "Разговор обработан", status: "CRM обновлена · задача создана" },
  communications: { eyebrow: "КОММУНИКАЦИИ", title: "Запрос на аналог", summary: "Короткий итог звонка", detail: "Нужен совместимый аналог с понятным сроком поставки.", actionLabel: "СЛЕДУЩИЙ ШАГ", action: "Проверить вариант", status: "Сегодня · 13:00" },
  knowledge: { eyebrow: "КОРПОРАТИВНЫЕ ЗНАНИЯ", title: "Какой аналог предложить?", summary: "Рекомендация собрана", detail: "Каталог, 1С и знания подтверждают совместимый вариант.", actionLabel: "ИСТОЧНИКИ", action: "1С · Каталог", status: "Корпоративные знания" },
  sales: { eyebrow: "ПРОДАЖИ", title: "Запрос на замену", summary: "Контекст обращения", detail: "Разговор, каталог и задача связаны в одном следующем шаге.", actionLabel: "СЛЕДУЩИЙ ШАГ", action: "Подтвердить замену", status: "Ответственный: менеджер" },
  processes: { eyebrow: "АВТОМАТИЗАЦИЯ", title: "После разговора", summary: "Процесс запущен", detail: "Summary готов, карточка обращения обновлена.", actionLabel: "СТАТУС", action: "Задача создана", status: "Последний запуск завершён" },
  analytics: { eyebrow: "УПРАВЛЕНЧЕСКИЕ ВЫВОДЫ", title: "Повторяющийся сигнал", summary: "Запрос на категорию", detail: "Тема повторяется в разговорах и заявках.", actionLabel: "ВОПРОС ДЛЯ ПРОВЕРКИ", action: "Проверить ассортимент", status: "Доказательства собраны" },
};

function CompactLandscapeView({ view }: { view: DemoView }) {
  const content = compactViewContent[view];

  return <div className={styles.compactDemo}>
    <article className={styles.compactPrimaryPanel}>
      <small>{content.eyebrow}</small>
      <h2>{content.title}</h2>
      <div><b>{content.summary}</b><span>{content.detail}</span></div>
    </article>
    <aside className={styles.compactActionPanel}>
      <small>{content.actionLabel}</small>
      <b>{content.action}</b>
      <span>{content.status}</span>
    </aside>
  </div>;
}

function Overview() { return <><DemoHeading eyebrow="ОПЕРАЦИОННАЯ СИСТЕМА" title="Компания сегодня" text="Не показатели ради показателей, а события, решения и действия, которые уже произошли в работе." /><div className={styles.context}>✦ <span><b>Утренний контекст собран</b><small>Система обработала новые коммуникации и выделила одно решение для проверки.</small></span></div><div className={styles.overviewGrid}><div className={styles.eventList}><div className={styles.panelTitle}>Интеллектуальные события <em>6</em></div>{overviewEvents.map((event) => <article className={event.selected ? styles.selectedEvent : ""} key={event.time}><time>{event.time}</time><div><b>{event.title}</b><p>{event.description}</p><small>● {event.status}</small></div><ChevronRight size={16} /></article>)}</div><Inspector /></div></> }
function Communications() { return <><DemoHeading eyebrow="КОММУНИКАЦИИ" title="Запрос на аналог отсутствующего товара" text="Звонок становится рабочим контекстом: смысл, договорённость и следующий шаг остаются в системе." /><div className={styles.splitPanel}><div className={styles.record}><span className={styles.iconCircle}>⌕</span><small>ВХОДЯЩИЙ РАЗГОВОР · 10:42</small><h3>Короткий итог</h3><p>Клиенту нужен совместимый аналог отсутствующей позиции с понятным сроком поставки.</p><div className={styles.factGrid}>{detailFacts.slice(0, 2).map(([title, text]) => <div key={title}><b>{title}</b><span>{text}</span></div>)}</div><div className={styles.mobileOnly}><b>Договорённость</b><span>Вернуться с проверенным предложением после сверки каталога и остатков.</span></div></div><div className={styles.inspector}><p className={styles.mono}>СИСТЕМА СДЕЛАЛА</p><CheckList items={["Сформирована запись разговора", "Обновлена карточка обращения в CRM", "Создана задача менеджеру"]} /><div className={styles.nextStep}><small>СЛЕДУЮЩИЙ ШАГ</small><b>Проверить подготовленный вариант</b><span>Срок: сегодня, 13:00</span></div></div></div></> }
function Knowledge() { return <><DemoHeading eyebrow="КОРПОРАТИВНЫЕ ЗНАНИЯ" title="Какой аналог предложить вместо отсутствующего товара?" text="Ответ собран из рабочего каталога, 1С и корпоративных знаний — с понятной причиной рекомендации." /><div className={styles.knowledgePanel}><div className={styles.question}><Search size={18} /><span>Какой аналог предложить вместо отсутствующего товара?</span></div><div className={styles.answer}><div><small>РЕКОМЕНДАЦИЯ</small><h3>Подготовить вариант с полной функциональной совместимостью</h3><p>Система нашла позицию со сходными характеристиками и доступностью, достаточной для согласованного срока.</p></div><aside><small>ИСТОЧНИКИ</small><span><Database size={15} /> 1С</span><span><FileText size={15} /> Каталог</span><span><FileText size={15} /> Корпоративные знания</span></aside></div><div className={styles.nextStep}><small>СЛЕДУЮЩИЙ ШАГ</small><b>Передать предложение менеджеру для проверки</b></div></div></> }
function Sales() { return <><DemoHeading eyebrow="ПРОДАЖИ" title="Запрос на замену позиции" text="Контекст обращения объединяет коммуникации, знания и задачи в один следующий понятный шаг." /><div className={styles.salesPanel}><div><span className={styles.statusTag}>В РАБОТЕ</span><h3>Подобрать и подтвердить замену</h3><p>Менеджер ждёт проверенный аналог, который можно предложить клиенту без повторного ручного поиска.</p><div className={styles.dataTags}><span>CRM</span><span>Разговор</span><span>Каталог</span></div></div><div className={styles.nextStep}><small>СЛЕДУЮЩИЙ ШАГ</small><b>Проверить подготовленный вариант</b><span>Ответственный: менеджер</span></div></div></> }
function Processes() { return <><DemoHeading eyebrow="АВТОМАТИЗАЦИЯ" title="После разговора с клиентом" text="Понятная бизнес-логика: система выполняет рутинные действия и оставляет человеку только решение." /><div className={styles.processPanel}><div className={styles.flow}>{["Разговор завершён", "Сделать summary", "Обновить CRM", "Создать задачу"].map((item, index) => <div key={item}><span>{index === 0 ? "ТРИГГЕР" : `ДЕЙСТВИЕ 0${index}`}</span><b>{item}</b>{index < 3 && <i>→</i>}</div>)}</div><div className={styles.processNote}><Check size={17} /> Последний запуск завершён: карточка обращения обновлена, задача создана.</div></div></> }
function Analytics() { return <><DemoHeading eyebrow="УПРАВЛЕНЧЕСКИЕ ВЫВОДЫ" title="Повторяется запрос на отсутствующую категорию" text="Система показывает тему, доказательства и вопрос, который стоит проверить, а не набор графиков." /><div className={styles.analyticsPanel}><div><small>ВЫВОД · ПОСЛЕДНИЕ 14 ДНЕЙ</small><h3>Запрос на отсутствующую категорию стал повторяющимся</h3><p>Тема встречается в нескольких разговорах и заявках. Это повод проверить ассортимент и логику подбора аналогов.</p></div><div className={styles.evidence}><small>ДОКАЗАТЕЛЬСТВА</small><span>10:42 · Запрос на аналог товара</span><span>09:36 · Похожая формулировка в обращении</span><span>Вчера · Менеджер отметил отсутствие позиции</span></div></div></> }
function DemoHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <header className={styles.demoHeading}><small>{eyebrow}</small><h2>{title}</h2><p>{text}</p></header> }
function Inspector() { return <aside className={styles.inspector}><p className={styles.mono}>СОБЫТИЕ · 10:42</p><h3>Разговор обработан</h3><section><small>ЧТО ПРОИЗОШЛО</small><p>Завершён входящий разговор с клиентом. Обсуждались аналог товара и срок поставки.</p></section><section><small>ЧТО СИСТЕМА ПОНЯЛА</small>{detailFacts.map(([title, text]) => <p key={title}><b>{title}. </b>{text}</p>)}</section><section><small>ЧТО СИСТЕМА СДЕЛАЛА</small><CheckList items={["CRM обновлена", "Задача создана"]} /></section><div className={styles.nextStep}><small>СЛЕДУЮЩИЙ ШАГ</small><b>Проверить подготовленный вариант</b><span>Срок: сегодня, 13:00</span></div></aside> }
function CheckList({ items }: { items: string[] }) { return <ul className={styles.checkList}>{items.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul> }
