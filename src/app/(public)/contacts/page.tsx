import type { Metadata } from "next";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";
import { LeadForm } from "@/components/forms/lead-form";

export const metadata: Metadata = buildMetadata(PAGE_SEO.contacts);

export default function ContactsPage() {
  return (
    <section className="contact-page py-20 lg:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "var(--text)" }}
          >
            Расскажите, какой процесс хотите автоматизировать
          </h1>
          <p
            className="mt-6 text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Опишите задачу своими словами. Не нужно готовить техническое задание — достаточно
            рассказать, где сейчас много ручной работы, какие сервисы уже используются и какой
            результат хочется получить.
          </p>

          <div
            className="contact-form-shell mt-10 rounded-3xl p-6 sm:p-8"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
            }}
          >
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  );
}
