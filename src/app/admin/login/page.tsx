"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, ShieldCheck } from "lucide-react";

type MfaChallenge = {
  challengeId: string;
  challengeToken: string;
};

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState<MfaChallenge | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    try {
      const email = String(fd.get("email") || "");
      const password = String(fd.get("password") || "");

      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Ошибка авторизации");
        setLoading(false);
        return;
      }

      if (json.mfaRequired && json.challengeId && json.challengeToken) {
        setMfaChallenge({
          challengeId: json.challengeId,
          challengeToken: json.challengeToken,
        });
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Ошибка соединения");
      setLoading(false);
    }
  }

  async function handleMfaSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!mfaChallenge) return;

    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const code = String(fd.get("code") || "");

    try {
      const res = await fetch("/api/admin/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: mfaChallenge.challengeId,
          challengeToken: mfaChallenge.challengeToken,
          code,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Invalid MFA code");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("РћС€РёР±РєР° СЃРѕРµРґРёРЅРµРЅРёСЏ");
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-page flex min-h-[60vh] items-center justify-center py-12">
      <div
        className="admin-login-card w-full max-w-sm rounded-3xl p-8"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="mb-6 text-center">
          <Lock
            className="mx-auto mb-3 h-10 w-10"
            style={{ color: "var(--primary)" }}
          />
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            Вход в админку
          </h1>
        </div>

        {mfaChallenge ? (
          <form onSubmit={handleMfaSubmit} className="flex flex-col gap-4">
            <div className="text-center">
              <ShieldCheck
                className="mx-auto mb-3 h-8 w-8"
                style={{ color: "var(--primary)" }}
              />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Enter a TOTP code or one unused recovery code.
              </p>
            </div>

            <div>
              <label
                htmlFor="code"
                className="mb-1.5 block text-sm font-medium"
                style={{ color: "var(--text)" }}
              >
                MFA code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                className="input"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 rounded-xl p-3 text-sm"
                style={{ background: "var(--danger)", color: "var(--on-danger)" }}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Verifying..." : "Continue"}
            </button>
            <button
              type="button"
              className="btn-secondary w-full"
              onClick={() => {
                setMfaChallenge(null);
                setError("");
              }}
            >
              Back to password
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Пароль
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              className="flex items-center gap-2 rounded-xl p-3 text-sm"
              style={{ background: "var(--danger)", color: "var(--on-danger)" }}
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Входим..." : "Войти"}
          </button>
          </form>
        )}
      </div>
    </div>
  );
}
