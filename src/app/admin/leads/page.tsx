"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Download, Search } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  contact: string;
  company: string | null;
  task: string;
  status: string;
  createdAt: string;
  notes: { text: string }[];
};

const STATUS_OPTIONS = [
  { value: "", label: "Все статусы" },
  { value: "NEW", label: "Новые" },
  { value: "IN_PROGRESS", label: "В работе" },
  { value: "NEED_REPLY", label: "Требует ответа" },
  { value: "CONSULTATION_SCHEDULED", label: "Консультация" },
  { value: "PROPOSAL_SENT", label: "Предложение" },
  { value: "CLOSED_WON", label: "Закрыта" },
  { value: "SPAM", label: "Спам" },
];

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

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const loadLeads = useCallback(async (searchValue: string, statusValue: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchValue) params.set("search", searchValue);
    if (statusValue) params.set("status", statusValue);

    try {
      const res = await fetch(`/api/admin/leads?${params}`);
      const data = await res.json();
      setLeads(data.leads || []);
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLeads(submittedSearch, status); // eslint-disable-line react-hooks/set-state-in-effect
  }, [loadLeads, submittedSearch, status]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSubmittedSearch(search);
  }

  function exportCsv() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    params.set("export", "csv");
    window.open(`/api/admin/leads?${params}`, "_blank");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          Заявки
        </h1>
        <button onClick={exportCsv} className="btn-secondary text-sm">
          <Download className="h-4 w-4" />
          Экспорт CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени, контакту, задаче..."
            className="input max-w-xs"
          />
          <button type="submit" className="btn-secondary text-sm">
            <Search className="h-4 w-4" />
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="input max-w-[200px]"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Загрузка...</p>
      ) : leads.length === 0 ? (
        <p style={{ color: "var(--text-soft)" }}>Пока нет заявок.</p>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead style={{ background: "var(--bg-soft)" }}>
                <tr style={{ color: "var(--text-soft)" }}>
                  <th className="p-3 text-left font-medium">Дата</th>
                  <th className="p-3 text-left font-medium">Имя</th>
                  <th className="p-3 text-left font-medium">Контакт</th>
                  <th className="p-3 text-left font-medium">Задача</th>
                  <th className="p-3 text-left font-medium">Статус</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <td className="p-3" style={{ color: "var(--text-soft)" }}>
                      {new Date(l.createdAt).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="p-3 font-medium" style={{ color: "var(--text)" }}>
                      {l.name}
                    </td>
                    <td className="p-3" style={{ color: "var(--text-muted)" }}>
                      {l.contact}
                    </td>
                    <td className="p-3 max-w-[300px] truncate" style={{ color: "var(--text-muted)" }}>
                      {l.task}
                    </td>
                    <td className="p-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          background: l.status === "NEW" ? "var(--primary-soft)" : "var(--bg-soft)",
                          color: l.status === "NEW" ? "var(--primary)" : "var(--text-soft)",
                        }}
                      >
                        {STATUS_LABELS[l.status] || l.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/leads/${l.id}`}
                        className="font-medium"
                        style={{ color: "var(--primary)" }}
                      >
                        Открыть
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
