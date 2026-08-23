import type { Metadata } from "next";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(PAGE_SEO.about);

const VALUES = [
  "Понятная бизнес-логика вместо хаотичных фич.",
  "Рабочий MVP вместо бесконечного ТЗ.",
  "Честные ограничения AI вместо магических обещаний.",
  "Поддерживаемая архитектура вместо одноразового скрипта.",
  "Конверсия, аналитика и результат вместо сайта ради сайта.",
];

export default function AboutPage() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-3xl">
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--text)" }}
          >
            OptiMate — команда автоматизации бизнес-процессов
          </h1>
          <p
            className="mt-6 text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Мы проектируем и разрабатываем цифровые системы для бизнеса: AI-агентов, CRM,
            e-commerce, контент-конвейеры, внутренние панели и интеграции между сервисами.
          </p>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Наша сильная сторона — работа на стыке трёх областей: продуктового мышления, инженерной
            разработки и маркетинга. Поэтому мы смотрим не только на код и интерфейс, но и на то,
            какую задачу система решает для бизнеса.
          </p>

          <h2
            className="mt-12 mb-6 text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Что для нас важно
          </h2>
          <ul className="flex flex-col gap-4">
            {VALUES.map((v, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-base"
                style={{ color: "var(--text-muted)" }}
              >
                <span
                  className="mt-1 h-2 w-2 shrink-0 rounded-full"
                  style={{ background: "var(--primary)" }}
                />
                {v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
