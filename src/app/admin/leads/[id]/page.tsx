"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { adminMutationFetch } from "@/lib/admin-client";

type LeadDetail = {
  id: string;
  name: string;
  contact: string;
  company: string | null;
  task: string;
  budget: string | null;
  status: string;
  createdAt: string;
  consentPd: boolean;
  consentContact: boolean;
  consentAt: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  pageUrl: string | null;
  referrer: string | null;
  userAgent: string | null;
  notes: { id: string; text: string; createdAt: string; author: { email: string } | null }[];
  events: { type: string; label: string | null; createdAt: string }[];
};

const STATUS_OPTIONS = [
  "NEW", "IN_PROGRESS", "NEED_REPLY", "CONSULTATION_SCHEDULED",
  "PROPOSAL_SENT", "CLOSED_WON", "CLOSED_LOST", "SPAM",
];

const STATUS_LABELS: Record<string, string> = {
  NEW: "Новая", IN_PROGRESS: "В работе", NEED_REPLY: "Требует ответа",
  CONSULTATION_SCHEDULED: "Консультация", PROPOSAL_SENT: "Предложение",
  CLOSED_WON: "Закрыта (успех)", CLOSED_LOST: "Закрыта (нет)", SPAM: "Спам",
};

export default function AdminLeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [noteText, setNoteText] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadLead() {
    try {
      const res = await fetch(`/api/admin/leads/${params.id}`);
      if (!res.ok) { router.push("/admin/leads"); return; }
      const data = await res.json();
      setLead(data.lead);
    } catch {
      router.push("/admin/leads");
    }
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadLead(); }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function changeStatus(newStatus: string) {
    await adminMutationFetch(`/api/admin/leads/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    loadLead();
  }

  async function addNote() {
    if (!noteText.trim()) return;
    await adminMutationFetch(`/api/admin/leads/${params.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: noteText }),
    });
    setNoteText("");
    loadLead();
  }

  if (loading) return <p style={{ color: "var(--text-muted)" }}>Загрузка...</p>;
  if (!lead) return null;

  return (
    <div>
      <button
        onClick={() => router.push("/admin/leads")}
        className="mb-6 flex items-center gap-2 text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Все заявки
      </button>

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            {lead.name}
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            {lead.contact}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={lead.status}
            onChange={(e) => changeStatus(e.target.value)}
            className="input max-w-[200px] text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--text)" }}>
              Задача клиента
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {lead.task}
            </p>
          </div>

          {/* UTM / technical */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <h2 className="mb-3 text-lg font-semibold" style={{ color: "var(--text)" }}>
              UTM и технические данные
            </h2>
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {[
                ["utm_source", lead.utmSource],
                ["utm_medium", lead.utmMedium],
                ["utm_campaign", lead.utmCampaign],
                ["pageUrl", lead.pageUrl],
                ["referrer", lead.referrer],
                ["consentPd", String(lead.consentPd)],
                ["consentContact", String(lead.consentContact)],
                ["Создан", new Date(lead.createdAt).toLocaleString("ru-RU")],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-2">
                  <dt className="font-medium" style={{ color: "var(--text-soft)" }}>{k}:</dt>
                  <dd style={{ color: "var(--text-muted)" }}>{v || "—"}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Notes */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
              Заметки
            </h2>
            {lead.notes.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>Заметок пока нет.</p>
            ) : (
              <div className="mb-4 flex flex-col gap-3">
                {lead.notes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl p-3 text-sm"
                    style={{ background: "var(--bg-soft)" }}
                  >
                    <p style={{ color: "var(--text-muted)" }}>{n.text}</p>
                    <p className="mt-1 text-xs" style={{ color: "var(--text-soft)" }}>
                      {n.author?.email} · {new Date(n.createdAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Добавить заметку..."
                className="input flex-1 text-sm"
                onKeyDown={(e) => e.key === "Enter" && addNote()}
              />
              <button onClick={addNote} className="btn-primary text-sm px-4">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: events */}
        <div>
          <div
            className="rounded-2xl p-6"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
              История событий
            </h2>
            {lead.events.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--text-soft)" }}>Событий пока нет.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {lead.events.map((e, i) => (
                  <div key={i} className="text-sm">
                    <p className="font-medium" style={{ color: "var(--text)" }}>{e.type}</p>
                    {e.label && <p style={{ color: "var(--text-soft)" }}>{e.label}</p>}
                    <p className="text-xs" style={{ color: "var(--text-soft)" }}>
                      {new Date(e.createdAt).toLocaleString("ru-RU")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
