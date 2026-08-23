import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";
import { Target, Zap, Eye, Settings, BarChart3 } from "lucide-react";

export const metadata: Metadata = buildMetadata(PAGE_SEO.approach);

const PRINCIPLES = [
  {
    icon: Target,
    num: "1",
    title: "Не автоматизировать хаос",
    text: "Если процесс не описан, автоматизация только ускорит ошибки. Поэтому сначала фиксируем сценарии, роли, статусы и точки контроля.",
  },
  {
    icon: Zap,
    num: "2",
    title: "Делать MVP, который можно использовать",
    text: "Первая версия должна решать реальную задачу, а не быть презентационной декорацией.",
  },
  {
    icon: Eye,
    num: "3",
    title: "Держать AI под контролем",
    text: "AI должен работать внутри понятного процесса: с ограничениями, логами, проверкой качества и ручным подтверждением там, где это важно.",
  },
  {
    icon: Settings,
    num: "4",
    title: "Проектировать поддержку",
    text: "Админка, настройки, логи, доступы, резервные копии и документация — часть продукта, а не «когда-нибудь потом».",
  },
  {
    icon: BarChart3,
    num: "5",
    title: "Измерять действия",
    text: "У каждой важной кнопки, формы и статуса должно быть событие. Без аналитики невозможно понять, что улучшать.",
  },
];

export default function ApproachPage() {
  return (
    <>
      <section className="py-20 lg:py-28">
        <div className="container">
          <h1
            className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--text)" }}
          >
            Наш подход: автоматизация начинается с проектирования процесса
          </h1>
          <p
            className="mt-6 max-w-3xl text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Мы не начинаем с вопроса «какой фреймворк взять?». Сначала разбираем бизнес-логику:
            кто участвует в процессе, где возникают ручные операции, какие данные нужны, где
            появляется риск ошибки и какие действия должны стать быстрее.
          </p>
        </div>
      </section>

      <section className="pb-20 lg:pb-28">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-8">
            {PRINCIPLES.map((p) => (
              <div key={p.num} className="card p-8">
                <div className="flex items-start gap-6">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold"
                    style={{
                      background: "var(--primary-soft)",
                      color: "var(--primary)",
                    }}
                  >
                    {p.num}
                  </span>
                  <div>
                    <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--text)" }}>
                      {p.title}
                    </h2>
                    <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {p.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/contacts" className="btn-primary">
              Обсудить внедрение
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
