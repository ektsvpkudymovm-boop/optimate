import { MfaSettings } from "@/components/admin/mfa-settings";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: "var(--text)" }}>
        Настройки
      </h1>

      <div className="space-y-6">
        <MfaSettings />

        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
            Уведомления
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Telegram-уведомления и email настраиваются через переменные окружения:
          </p>
          <ul className="mt-3 space-y-1 font-mono text-sm" style={{ color: "var(--text-soft)" }}>
            <li>TELEGRAM_BOT_TOKEN</li>
            <li>TELEGRAM_CHAT_ID</li>
            <li>SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASSWORD</li>
          </ul>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
            Аналитика
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Яндекс Метрика настраивается через переменную NEXT_PUBLIC_YANDEX_METRIKA_ID.
            Подключается только после согласия пользователя на аналитические cookie.
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
            Контент
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Кейсы и решения редактируются в файлах:
          </p>
          <ul className="mt-3 space-y-1 font-mono text-sm" style={{ color: "var(--text-soft)" }}>
            <li>src/content/cases.ts</li>
            <li>src/content/solutions.ts</li>
          </ul>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
        >
          <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--text)" }}>
            Пользователи админки
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Пользователи создаются через seed: задайте ADMIN_EMAIL и ADMIN_PASSWORD
            в .env и перезапустите приложение. Пароли хранятся в bcrypt-хеше.
          </p>
        </div>
      </div>
    </div>
  );
}
