import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cases, CASE_CATEGORIES, getCaseBySlug } from "@/content/cases";
import { buildMetadata } from "@/lib/seo";
import { Check, ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) return {};
  return buildMetadata({
    title: `${c.clientTitle} — кейс автоматизации`,
    description: c.excerpt,
    path: `/cases/${c.slug}`,
  });
}

export default async function CaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const c = getCaseBySlug(slug);
  if (!c) notFound();

  return (
    <>
      <section className="py-12 lg:py-20">
        <div className="container">
          <Link
            href="/work"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="h-4 w-4" />
            Все кейсы
          </Link>

          {/* Header */}
          <div className="mb-8 flex flex-wrap gap-2">
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
            >
              {CASE_CATEGORIES[c.category]}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
            >
              {c.status}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-medium"
              style={{ background: "var(--bg-soft)", color: "var(--text-soft)" }}
            >
              {c.type}
            </span>
          </div>

          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--text)" }}
          >
            {c.clientTitle}
          </h1>
          {c.clientTitle !== c.title ? (
            <p
              className="mt-3 text-sm font-medium"
              style={{ color: "var(--text-soft)" }}
            >
              Проект: {c.title}
            </p>
          ) : null}
          <p
            className="mt-4 max-w-3xl text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {c.excerpt}
          </p>

          {/* Meta */}
          <div
            className="mt-6 flex flex-wrap gap-4 text-sm"
            style={{ color: "var(--text-soft)" }}
          >
            <span>Период: {c.period}</span>
            <span>·</span>
            <span>{c.technologies.join(", ")}</span>
          </div>

          <div className="mt-8">
            <Link href="/contacts" className="btn-primary">
              Хочу похожую систему
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 lg:pb-28">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-12">
            {/* Task */}
            <div>
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Задача
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {c.task}
              </p>
            </div>

            {/* Solution */}
            <div>
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Решение
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {c.solution}
              </p>
            </div>

            {/* How it works */}
            <div>
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Как работает система
              </h2>
              <ol className="space-y-3">
                {c.howItWorks.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background: "var(--primary-soft)",
                        color: "var(--primary)",
                      }}
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {/* Automation */}
            <div>
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Что автоматизировано
              </h2>
              <ul className="space-y-2">
                {c.automation.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3"
                  >
                    <Check
                      className="mt-0.5 h-5 w-5 shrink-0"
                      style={{ color: "var(--accent)" }}
                    />
                    <span
                      className="text-base"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Технологии
              </h2>
              <div className="flex flex-wrap gap-2">
                {c.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg px-3 py-1.5 font-mono text-sm"
                    style={{
                      background: "var(--bg-soft)",
                      color: "var(--text-soft)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Business value */}
            <div>
              <h2
                className="mb-4 text-2xl font-bold"
                style={{ color: "var(--text)" }}
              >
                Бизнес-ценность
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {c.businessValue}
              </p>
            </div>

            {/* Legal note */}
            {c.legalNote && (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--warning)",
                  color: "var(--on-warning)",
                }}
              >
                <p className="text-sm leading-relaxed font-medium">
                  {c.legalNote}
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Link href="/contacts" className="btn-primary">
              Хочу похожую систему
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
