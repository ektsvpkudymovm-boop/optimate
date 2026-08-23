import Link from "next/link";
import { cases, CASE_CATEGORIES } from "@/content/cases";
import { ExternalLink } from "lucide-react";

export default function AdminCasesPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: "var(--text)" }}>
        Кейсы
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        Кейсы хранятся в <code className="font-mono">content/cases.ts</code>. Редактируйте файл
        напрямую.
      </p>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background: "var(--bg-soft)" }}>
              <tr style={{ color: "var(--text-soft)" }}>
                <th className="p-3 text-left font-medium">Название</th>
                <th className="p-3 text-left font-medium">Slug</th>
                <th className="p-3 text-left font-medium">Категория</th>
                <th className="p-3 text-left font-medium">Статус</th>
                <th className="p-3 text-left font-medium">Featured</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr
                  key={c.slug}
                  className="border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="p-3 font-medium" style={{ color: "var(--text)" }}>
                    {c.title}
                  </td>
                  <td className="p-3 font-mono text-xs" style={{ color: "var(--text-soft)" }}>
                    {c.slug}
                  </td>
                  <td className="p-3" style={{ color: "var(--text-muted)" }}>
                    {CASE_CATEGORIES[c.category]}
                  </td>
                  <td className="p-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3" style={{ color: "var(--text-muted)" }}>
                    {c.featured ? "Да" : "Нет"}
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/cases/${c.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-medium"
                      style={{ color: "var(--primary)" }}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Просмотр
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
