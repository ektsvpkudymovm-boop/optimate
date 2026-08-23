import type { Metadata } from "next";

const SITE_NAME = "OptiMate";
const SITE_URL = process.env.APP_URL || "http://localhost:3000";

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "ru_RU",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export const PAGE_SEO = {
  home: {
    title: "OptiMate — AI-системы для бизнеса, который вырос из ручного управления",
    description:
      "OptiMate проектирует AI-агентов, RAG-базы знаний, CRM, n8n-пайплайны, контентные фабрики, e-commerce AI и внутренние digital-системы.",
    path: "/",
  },
  work: {
    title: "Кейсы OptiMate — рабочие AI-системы для бизнеса",
    description:
      "Кейсы OptiMate: AI-агенты, базы знаний, CRM, автоматизация, интеграции, контент-процессы, онлайн-продажи и внутренние инструменты с контролем человека.",
    path: "/work",
  },
  capabilities: {
    title: "Что делаем — классы AI-систем OptiMate",
    description:
      "Классы AI-систем, которые OptiMate проектирует для бизнеса: AI-агенты, RAG, CRM, автоматизации, content factories, e-commerce AI и GEO-ready структура.",
    path: "/capabilities",
  },
  solutions: {
    title: "Решения OptiMate для AI-систем и automation-инфраструктуры",
    description:
      "AI-агенты, RAG-базы знаний, CRM, контентные фабрики, e-commerce AI, n8n-интеграции и self-hosted инструменты для бизнес-систем.",
    path: "/solutions",
  },
  cases: {
    title: "Кейсы автоматизации бизнес-процессов",
    description:
      "Портфолио OptiMate: AI-агенты, CRM, e-commerce, контент-конвейеры, внутренние платформы, интеграции и self-hosted решения.",
    path: "/cases",
  },
  approach: {
    title: "Подход OptiMate — проектирование и внедрение автоматизации",
    description:
      "Как OptiMate разбирает процессы, проектирует MVP, внедряет AI, CRM, интеграции и развивает системы по метрикам.",
    path: "/approach",
  },
  about: {
    title: "О команде OptiMate",
    description:
      "OptiMate — команда автоматизации бизнес-процессов: AI-агенты, CRM, e-commerce, контент-конвейеры и интеграции.",
    path: "/about",
  },
  contacts: {
    title: "Обсудить автоматизацию бизнес-процесса",
    description:
      "Опишите процесс, который хотите автоматизировать. OptiMate предложит сценарий MVP или production-системы.",
    path: "/contacts",
  },
  privacy: {
    title: "Политика обработки персональных данных",
    description: "Политика обработки персональных данных сайта OptiMate.",
    path: "/privacy",
  },
  consent: {
    title: "Согласие на обработку персональных данных",
    description: "Согласие на обработку персональных данных сайта OptiMate.",
    path: "/consent",
  },
  cookies: {
    title: "Политика cookie",
    description: "Политика использования cookie на сайте OptiMate.",
    path: "/cookies",
  },
  terms: {
    title: "Пользовательское соглашение",
    description: "Условия использования сайта OptiMate.",
    path: "/terms",
  },
} as const;
