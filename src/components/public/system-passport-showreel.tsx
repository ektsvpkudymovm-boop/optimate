"use client";

import { Fragment, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CASE_CLIENT_TITLES } from "@/content/cases";

type ProofCase = {
  title: string;
  projectTitle: string;
  slug: string;
  type: string;
  what: string;
  situation: string;
  flow: string[];
  stack: string[];
  control: string;
};

const PROOF_CASES: ProofCase[] = [
  {
    title: CASE_CLIENT_TITLES["ai-organic-flow"],
    projectTitle: "AI Organic Flow",
    slug: "ai-organic-flow",
    type: "контентный AI-конвейер",
    what: "Путь от поиска тем и анализа SERP до черновиков, проверки и публикации SEO/GEO-статей.",
    situation: "Нужно регулярно выпускать контент без ручного хаоса и потери контроля качества.",
    flow: ["темы", "AI", "проверка", "SEO/GEO", "публикация"],
    stack: ["AI", "n8n", "SEO"],
    control: "человек проверяет материал перед публикацией",
  },
  {
    title: CASE_CLIENT_TITLES["crm-imagine"],
    projectTitle: "CRM IMAGINE",
    slug: "crm-imagine",
    type: "CRM / операционная система",
    what: "Единый контур клиентов, подборов, коммуникаций, закупок и заказов.",
    situation: "Команда ведёт продажи, заказы и коммуникации в разрозненных инструментах.",
    flow: ["клиент", "CRM", "заказ", "1C/API", "уведомления"],
    stack: ["CRM", "1C", "API"],
    control: "менеджер видит статус, историю и следующий шаг",
  },
  {
    title: CASE_CLIENT_TITLES["ai-wiki-b2b"],
    projectTitle: "AI-WIKI B2B",
    slug: "ai-wiki-b2b",
    type: "AI-база знаний",
    what: "Система отвечает на вопросы с опорой на документы, нормы и базу товаров.",
    situation: "Экспертные знания разбросаны по документам, каталогам и внутренним материалам.",
    flow: ["документы", "RAG", "ответ", "проверка", "контент"],
    stack: ["AI", "RAG", "база знаний"],
    control: "ответ строится на источниках и может проверяться специалистом",
  },
  {
    title: CASE_CLIENT_TITLES["imagine-4-0"],
    projectTitle: "IMAGINE 4.0",
    slug: "imagine-4-0",
    type: "e-commerce с AI-персонализацией",
    what: "Страницы и сценарии магазина подстраиваются под посетителя и упрощают путь к заказу.",
    situation: "Магазину нужен управляемый путь от интереса посетителя до заказа и CRM-контакта.",
    flow: ["посетитель", "подбор", "карточка", "checkout", "CRM"],
    stack: ["e-commerce", "AI", "персонализация"],
    control: "бизнес управляет сценариями и логикой подбора",
  },
  {
    title: CASE_CLIENT_TITLES.lawcheck,
    projectTitle: "LawCheck",
    slug: "lawcheck",
    type: "AI-ассистент для анализа документов",
    what: "Инструмент предварительного разбора документов и подготовки черновиков.",
    situation: "Юридической команде нужно быстрее находить риски и готовить материалы к проверке.",
    flow: ["документ", "анализ", "замечания", "черновик", "специалист"],
    stack: ["AI", "документы", "юристы"],
    control: "финальное решение принимает человек",
  },
];

export function SystemPassportShowreel() {
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const displayedIndex = previewIndex ?? selectedIndex;
  const displayedCase = PROOF_CASES[displayedIndex];

  function handleCaseSelect(index: number) {
    setSelectedIndex(index);
    setPreviewIndex(index);

    if (typeof window === "undefined" || !window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
      itemRefs.current[index]?.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }

  return (
    <section
      className="lab-section lab-section--void proof-showreel ops-bg ops-bg--clean"
      aria-labelledby="proof-showreel-title"
    >
      <div className="container proof-showreel__inner">
        <div className="proof-showreel__head proof-reveal">
          <p className="lab-kicker">ПРИМЕРЫ ВНЕДРЕНИЙ</p>
          <h2 id="proof-showreel-title" className="lab-section__title">
            Посмотрите, как устроены рабочие AI-системы
          </h2>
          <p className="lab-section__lead">
            Показываем не макеты, а логику работы: задачу, данные, интеграции, AI-слои и контроль
            специалиста.
          </p>
        </div>

        <div className="proof-showreel__stage" onMouseLeave={() => setPreviewIndex(null)}>
          <nav
            className="proof-showreel__nav proof-reveal"
            aria-label="Избранные кейсы"
          >
            {PROOF_CASES.map((item, index) => (
              <div
                key={item.slug}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                className="proof-showreel__item"
              >
                <button
                  type="button"
                  className="proof-showreel__tab"
                  data-active={index === displayedIndex}
                  data-pinned={index === selectedIndex}
                  aria-expanded={index === selectedIndex}
                  aria-controls={`proof-mobile-passport-${item.slug}`}
                  onClick={() => handleCaseSelect(index)}
                  onFocus={() => setPreviewIndex(index)}
                  onMouseEnter={() => setPreviewIndex(index)}
                >
                  <span className="proof-showreel__tab-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="proof-showreel__tab-copy">
                    <strong>{item.title}</strong>
                    <em>{item.type}</em>
                  </span>
                  <span className="proof-showreel__tab-action" aria-hidden="true">
                    Открыть
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </button>

                <div
                  id={`proof-mobile-passport-${item.slug}`}
                  className="proof-showreel__mobile-passport"
                  data-open={index === selectedIndex}
                >
                  {index === selectedIndex ? <SystemPassport item={item} index={index} mode="mobile" /> : null}
                </div>
              </div>
            ))}
          </nav>

          <div className="proof-showreel__desktop-passport" aria-live="polite">
            <SystemPassport key={displayedCase.slug} item={displayedCase} index={displayedIndex} mode="desktop" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemPassport({ item, index, mode }: { item: ProofCase; index: number; mode: "desktop" | "mobile" }) {
  return (
    <article className="system-passport proof-reveal" data-mode={mode}>
      <div className="system-passport__topline">
        <span>Устройство системы</span>
        <strong>{String(index + 1).padStart(2, "0")} / 05</strong>
      </div>

      <div className="system-passport__header">
        <div className="system-passport__identity">
          <h3>{item.title}</h3>
          <p>{item.type}</p>
          <p>Проект: {item.projectTitle}</p>
        </div>
        <Link href={`/cases/${item.slug}`} className="system-passport__cta system-passport__cta--header">
          Открыть кейс
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="system-passport__summary">
        <section className="system-passport__panel">
          <span>Что собрали</span>
          <p>{item.what}</p>
        </section>
        <section className="system-passport__panel">
          <span>Бизнес-ситуация</span>
          <p>{item.situation}</p>
        </section>
      </div>

      <section className="system-passport__flow-block" aria-label={`Контур ${item.title}`}>
        <h4>Контур</h4>
        <div className="system-passport__flow">
          {item.flow.map((node, flowIndex) => (
            <Fragment key={`${item.slug}-${node}`}>
              <div className="system-passport__flow-node">
                <span>{String(flowIndex + 1).padStart(2, "0")}</span>
                <strong>{node}</strong>
              </div>
              {flowIndex < item.flow.length - 1 ? (
                <div className="system-passport__flow-arrow" aria-hidden="true">
                  <span className="system-passport__flow-arrow-desktop">{"\u2192"}</span>
                  <span className="system-passport__flow-arrow-mobile">{"\u2193"}</span>
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </section>

      <div className="system-passport__meta">
        <section className="system-passport__panel">
          <h4>Интеграции / стек</h4>
          <div className="system-passport__chips">
            {item.stack.map((stackItem) => (
              <span key={stackItem}>{stackItem}</span>
            ))}
          </div>
        </section>
        <section className="system-passport__panel">
          <h4>Контроль</h4>
          <p>{item.control}</p>
        </section>
      </div>

      <div className="system-passport__mobile-cta">
        <Link href={`/cases/${item.slug}`} className="system-passport__cta system-passport__cta--mobile">
          Открыть кейс
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
