"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export function LeadForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Honeypot check
    if (fd.get("website")) {
      setState("success");
      return;
    }

    setState("loading");
    setErrors({});

    const data = {
      name: fd.get("name"),
      contact: fd.get("contact"),
      company: fd.get("company"),
      task: fd.get("task"),
      budget: fd.get("budget"),
      consentPd: fd.get("consentPd") === "on",
      consentContact: fd.get("consentContact") === "on",
      honeypot: "",
      pageUrl: window.location.href,
      referrer: document.referrer || null,
      utm: {
        source: new URLSearchParams(window.location.search).get("utm_source"),
        medium: new URLSearchParams(window.location.search).get("utm_medium"),
        campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
        content: new URLSearchParams(window.location.search).get("utm_content"),
        term: new URLSearchParams(window.location.search).get("utm_term"),
      },
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const err of json.errors) {
            fieldErrors[err.path?.[0] || "form"] = err.message;
          }
          setErrors(fieldErrors);
          setState("idle");
        } else {
          setState("error");
        }
        return;
      }

      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-3xl p-8 text-center"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <CheckCircle className="h-12 w-12" style={{ color: "var(--success)" }} />
        <h3 className="text-xl font-semibold" style={{ color: "var(--text)" }}>
          Спасибо! Заявка отправлена
        </h3>
        <p style={{ color: "var(--text-muted)" }}>
          Мы посмотрим задачу и предложим возможный сценарий автоматизации.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>
            Имя *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Как к вам обращаться?"
            className={`input ${errors.name ? "input-error" : ""}`}
          />
          {errors.name && <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="contact" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>
            Контакт *
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            required
            placeholder="Telegram, телефон или email"
            className={`input ${errors.contact ? "input-error" : ""}`}
          />
          {errors.contact && <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>{errors.contact}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>
          Компания / проект
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder="Чем занимается бизнес?"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="task" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>
          Что хотите автоматизировать *
        </label>
        <textarea
          id="task"
          name="task"
          required
          rows={5}
          placeholder="Например: заявки, CRM, контент, документы, публикации, отчёты..."
          className={`input resize-none ${errors.task ? "input-error" : ""}`}
        />
        {errors.task && <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>{errors.task}</p>}
      </div>

      <div>
        <label htmlFor="budget" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>
          Бюджет / формат
        </label>
        <select id="budget" name="budget" className="input">
          <option value="">Выберите формат</option>
          <option value="explore">Пока хочу понять возможности</option>
          <option value="mvp">Нужен быстрый MVP</option>
          <option value="production">Нужна production-система</option>
          <option value="tz">Есть конкретное ТЗ</option>
        </select>
      </div>

      {/* Consents */}
      <div className="flex flex-col gap-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consentPd"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
          />
          <span className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Я согласен(на) на обработку персональных данных в соответствии с{" "}
            <a href="/privacy" style={{ color: "var(--primary)" }} className="underline">
              Политикой обработки персональных данных
            </a>
            . *
          </span>
        </label>
        {errors.consentPd && <p className="text-xs" style={{ color: "var(--danger)" }}>{errors.consentPd}</p>}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consentContact"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
          />
          <span className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Я согласен(на), что со мной свяжутся по указанному контакту для обсуждения задачи. *
          </span>
        </label>
        {errors.consentContact && <p className="text-xs" style={{ color: "var(--danger)" }}>{errors.consentContact}</p>}
      </div>

      {state === "error" && (
        <div
          className="flex items-center gap-2 rounded-xl p-3 text-sm"
          style={{ background: "var(--danger)", color: "var(--on-danger)" }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          Не получилось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="btn-primary w-full"
      >
        {state === "loading" ? (
          "Отправляем заявку..."
        ) : (
          <>
            <Send className="h-4 w-4" />
            Отправить задачу
          </>
        )}
      </button>
    </form>
  );
}
