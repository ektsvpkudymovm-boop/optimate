"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Copy, ShieldCheck } from "lucide-react";
import { adminMutationFetch } from "@/lib/admin-client";

type MfaStatus = {
  mfaEnabled: boolean;
  mfaEnabledAt: string | null;
  recoveryRemaining: number;
};

type SetupState = {
  setupId: string;
  secret: string;
  otpauthUrl: string;
};

export function MfaSettings() {
  const [status, setStatus] = useState<MfaStatus | null>(null);
  const [setup, setSetup] = useState<SetupState | null>(null);
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/mfa/status")
      .then((response) => response.json())
      .then((json: MfaStatus) => setStatus(json))
      .catch(() => setError("Could not load MFA status."));
  }, []);

  async function startSetup() {
    setError("");
    setLoading(true);
    setRecoveryCodes([]);

    try {
      const response = await adminMutationFetch("/api/admin/mfa/setup", {
        method: "POST",
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error || "Could not start MFA setup.");
        return;
      }
      setSetup({
        setupId: json.setupId,
        secret: json.secret,
        otpauthUrl: json.otpauthUrl,
      });
    } catch {
      setError("Could not start MFA setup.");
    } finally {
      setLoading(false);
    }
  }

  async function enableMfa() {
    if (!setup) return;
    setError("");
    setLoading(true);

    try {
      const response = await adminMutationFetch("/api/admin/mfa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ setupId: setup.setupId, code }),
      });
      const json = await response.json();
      if (!response.ok) {
        setError(json.error || "Could not enable MFA.");
        return;
      }

      setRecoveryCodes(json.recoveryCodes || []);
      setSetup(null);
      setCode("");
      setStatus({
        mfaEnabled: true,
        mfaEnabledAt: new Date().toISOString(),
        recoveryRemaining: json.recoveryCodes?.length ?? 0,
      });
    } catch {
      setError("Could not enable MFA.");
    } finally {
      setLoading(false);
    }
  }

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <div className="mb-4 flex items-center gap-3">
        <ShieldCheck className="h-5 w-5" style={{ color: "var(--primary)" }} />
        <h2 className="text-lg font-semibold" style={{ color: "var(--text)" }}>
          MFA security
        </h2>
      </div>

      <p className="text-sm" style={{ color: "var(--text-muted)" }}>
        Use any TOTP app: Aegis, 2FAS, Яндекс Ключ/ID, Microsoft Authenticator,
        Google Authenticator, Bitwarden Authenticator, Ente Auth, Proton Authenticator,
        or another app that supports TOTP.
      </p>

      {status?.mfaEnabled ? (
        <div className="mt-4 rounded-xl p-4 text-sm" style={{ background: "var(--primary-soft)" }}>
          <p className="font-medium" style={{ color: "var(--text)" }}>
            MFA is enabled for this admin account.
          </p>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            Unused recovery codes: {status.recoveryRemaining}. Generate new recovery codes after
            using one.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={startSetup}
          disabled={loading}
          className="btn-primary mt-5"
        >
          {loading ? "Starting..." : "Enable TOTP MFA"}
        </button>
      )}

      {setup && (
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>
              Manual secret
            </label>
            <div className="flex gap-2">
              <input className="input font-mono" value={setup.secret} readOnly />
              <button
                type="button"
                aria-label="Copy MFA secret"
                onClick={() => copyText(setup.secret)}
                className="btn-secondary px-3"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>
              otpauth URL
            </label>
            <textarea className="input min-h-24 font-mono text-xs" value={setup.otpauthUrl} readOnly />
          </div>

          <div>
            <label htmlFor="mfa-code" className="mb-1.5 block text-sm font-medium" style={{ color: "var(--text)" }}>
              First 6-digit code
            </label>
            <input
              id="mfa-code"
              className="input"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
            />
          </div>

          <button type="button" onClick={enableMfa} disabled={loading} className="btn-primary">
            {loading ? "Verifying..." : "Verify and enable"}
          </button>
        </div>
      )}

      {recoveryCodes.length > 0 && (
        <div className="mt-5 rounded-xl p-4" style={{ border: "1px solid var(--border)" }}>
          <h3 className="font-semibold" style={{ color: "var(--text)" }}>
            Recovery codes
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            These codes are shown once. Store them before leaving this page.
          </p>
          <div className="mt-3 grid gap-2 font-mono text-sm sm:grid-cols-2">
            {recoveryCodes.map((recoveryCode) => (
              <span key={recoveryCode} style={{ color: "var(--text)" }}>
                {recoveryCode}
              </span>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div
          className="mt-4 flex items-center gap-2 rounded-xl p-3 text-sm"
          style={{ background: "var(--danger)", color: "var(--on-danger)" }}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
