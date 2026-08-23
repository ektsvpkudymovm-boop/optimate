import type { Metadata } from "next";
import { buildMetadata, PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(PAGE_SEO.terms);

export default function TermsPage() {
  return (
    <section className="legal-page py-20 lg:py-28">
      <div className="container">
        <div className="legal-document mx-auto max-w-3xl" style={{ color: "var(--text)" }}>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--text)" }}>
            Пользовательское соглашение
          </h1>
          <p className="mt-4 text-sm" style={{ color: "var(--text-soft)" }}>
            Дата последнего обновления: 02.07.2026
          </p>

          <div className="mt-8 space-y-6 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>1. Общие условия</h2>
              <p>
                Использование сайта OptiMate означает согласие с настоящим пользовательским
                соглашением. Если вы не согласны с условиями, прекратите использование сайта.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>2. Использование сайта</h2>
              <p>
                Сайт предоставляет информацию об услугах по автоматизации бизнес-процессов.
                Информация на сайте носит информационный характер и не является публичной офертой.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>3. Интеллектуальная собственность</h2>
              <p>
                Все материалы сайта (тексты, графика, код) являются собственностью OptiMate и
                защищены законодательством об интеллектуальной собственности. Копирование и
                использование без разрешения запрещены.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>4. Ответственность</h2>
              <p>
                OptiMate не несёт ответственности за решения, принятые на основе информации,
                размещённой на сайте. Информация о кейсах и результатах проектов не является
                гарантией аналогичного результата.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3" style={{ color: "var(--text)" }}>5. Изменения</h2>
              <p>
                OptiMate оставляет за собой право изменять настоящее соглашение. Актуальная версия
                всегда доступна на этой странице.
              </p>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
