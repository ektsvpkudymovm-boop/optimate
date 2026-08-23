"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
    }
  }, []);

  const accept = (level: "all" | "necessary") => {
    localStorage.setItem("cookie_consent", level);
    setVisible(false);
    // Track consent event
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: level === "all" ? "cookie_accepted" : "cookie_rejected",
        path: window.location.pathname,
      }),
    }).catch(() => {});
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t p-4 sm:p-6"
      style={{
        background: "var(--bg-elevated)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div className="container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          Мы используем необходимые cookie для работы сайта и аналитические cookie для улучшения
          интерфейса и оценки эффективности страниц. Аналитические cookie включаются только после
          вашего согласия.{" "}
          <Link href="/cookies" className="underline" style={{ color: "var(--primary)" }}>
            Политика cookie
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => accept("necessary")}
            className="btn-secondary text-sm"
          >
            Только необходимые
          </button>
          <button
            onClick={() => accept("all")}
            className="btn-primary text-sm"
          >
            Принять все
          </button>
        </div>
      </div>
    </div>
  );
}
