"use client";

import { useEffect, useState } from "react";

type AnalyticsData = {
  summary: {
    totalLeads: number;
    newLeads: number;
    ctaClicks: number;
    formStarts: number;
    formSubmits: number;
    conversionCtaToLead: string;
    conversionFormToLead: string;
  };
  eventsByType: { type: string; count: number }[];
  leadsByStatus: { status: string; count: number }[];
  days: number;
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "Новые", IN_PROGRESS: "В работе", NEED_REPLY: "Требует ответа",
  CONSULTATION_SCHEDULED: "Консультация", PROPOSAL_SENT: "Предложение",
  CLOSED_WON: "Закрыта", CLOSED_LOST: "Закрыта", SPAM: "Спам",
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [days]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Аналитика
        </h1>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
              style={{
                background: days === d ? "var(--primary)" : "var(--bg-elevated)",
                color: days === d ? "var(--on-primary)" : "var(--text-muted)",
                border: `1px solid ${days === d ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {d} дн.
            </button>
          ))}
        </div>
      </div>

      {!data ? (
        <p style={{ color: "var(--text-muted)" }}>Загрузка...</p>
      ) : (
        <>
          {/* KPI */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Всего заявок", value: data.summary.totalLeads },
              { label: "Новые", value: data.summary.newLeads },
              { label: "CTA клики", value: data.summary.ctaClicks },
              { label: "Конверсия CTA → Заявка", value: `${data.summary.conversionCtaToLead}%` },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-2xl p-5"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
              >
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>{kpi.label}</span>
                <p className="mt-2 text-3xl font-bold" style={{ color: "var(--text)" }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Events by type */}
          {data.eventsByType.length > 0 && (
            <div
              className="mb-8 rounded-2xl p-6"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            >
              <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
                События
              </h2>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {data.eventsByType.map((e) => (
                  <div
                    key={e.type}
                    className="flex items-center justify-between rounded-xl px-4 py-2"
                    style={{ background: "var(--bg-soft)" }}
                  >
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>{e.type}</span>
                    <span className="font-bold" style={{ color: "var(--text)" }}>{e.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads by status */}
          {data.leadsByStatus.length > 0 && (
            <div
              className="rounded-2xl p-6"
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
        </>
      )}
    </div>
  );
}
