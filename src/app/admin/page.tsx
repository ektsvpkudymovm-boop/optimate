"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText, BarChart3, Clock, AlertTriangle } from "lucide-react";

type DashboardData = {
  summary: {
    totalLeads: number;
    newLeads: number;
    ctaClicks: number;
    formStarts: number;
    formSubmits: number;
  };
  leadsByStatus: { status: string; count: number }[];
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "Новые",
  IN_PROGRESS: "В работе",
  NEED_REPLY: "Требует ответа",
  CONSULTATION_SCHEDULED: "Консультация",
  PROPOSAL_SENT: "Предложение",
  CLOSED_WON: "Закрыта (успех)",
  CLOSED_LOST: "Закрыта (нет)",
  SPAM: "Спам",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [leads, setLeads] = useState<unknown[]>([]);

  useEffect(() => {
    fetch("/api/admin/analytics?days=30")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});

    fetch("/api/admin/leads")
      .then((r) => r.json())
      .then((d) => setLeads(d.leads?.slice(0, 5) || []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold" style={{ color: "var(--text)" }}>
        Dashboard
      </h1>

      {/* KPI cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Заявок за 30 дней", value: data?.summary.totalLeads ?? "—", icon: FileText },
          { label: "Новые заявки", value: data?.summary.newLeads ?? "—", icon: AlertTriangle },
          { label: "CTA клики", value: data?.summary.ctaClicks ?? "—", icon: BarChart3 },
          { label: "Отправлено форм", value: data?.summary.formSubmits ?? "—", icon: Clock },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl p-5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3">
              <kpi.icon className="h-5 w-5" style={{ color: "var(--primary)" }} />
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                {kpi.label}
              </span>
            </div>
            <p className="mt-2 text-3xl font-bold" style={{ color: "var(--text)" }}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Leads by status */}
      {data?.leadsByStatus && data.leadsByStatus.length > 0 && (
        <div
          className="mb-8 rounded-2xl p-6"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
            Заявки по статусам
          </h2>
          <div className="flex flex-wrap gap-3">
            {data.leadsByStatus.map((s) => (
              <div
                key={s.status}
                className="rounded-xl px-4 py-2 text-sm"
                style={{ background: "var(--bg-soft)", color: "var(--text-muted)" }}
              >
                {STATUS_LABELS[s.status] || s.status}: <strong>{s.count}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent leads */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
            Последние заявки
          </h2>
          <Link
            href="/admin/leads"
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            Все заявки →
          </Link>
        </div>
        {leads.length === 0 ? (
          <p style={{ color: "var(--text-soft)" }}>Пока нет заявок.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--text-soft)" }}>
                  <th className="pb-3 text-left font-medium">Имя</th>
                  <th className="pb-3 text-left font-medium">Контакт</th>
                  <th className="pb-3 text-left font-medium">Статус</th>
                  <th className="pb-3 text-left font-medium">Дата</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => {
                  const lead = l as Record<string, unknown>;
                  return (
                    <tr
                      key={lead.id as string}
                      className="border-t"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <td className="py-3" style={{ color: "var(--text)" }}>
                        {lead.name as string}
                      </td>
                      <td className="py-3" style={{ color: "var(--text-muted)" }}>
                        {lead.contact as string}
                      </td>
                      <td className="py-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            background: lead.status === "NEW" ? "var(--primary-soft)" : "var(--bg-soft)",
                            color: lead.status === "NEW" ? "var(--primary)" : "var(--text-soft)",
                          }}
                        >
                          {STATUS_LABELS[lead.status as string] || (lead.status as string)}
                        </span>
                      </td>
                      <td className="py-3" style={{ color: "var(--text-soft)" }}>
                        {new Date(lead.createdAt as string).toLocaleDateString("ru-RU")}
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          className="font-medium"
                          style={{ color: "var(--primary)" }}
                        >
                          Открыть
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
