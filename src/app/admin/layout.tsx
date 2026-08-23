"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, BarChart3, FolderOpen, Settings, LogOut,
  ChevronLeft
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminMutationFetch } from "@/lib/admin-client";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Заявки", href: "/admin/leads", icon: FileText },
  { label: "Аналитика", href: "/admin/analytics", icon: BarChart3 },
  { label: "Кейсы", href: "/admin/cases", icon: FolderOpen },
  { label: "Настройки", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChecking(false);
      return;
    }

    fetch("/api/admin/auth")
      .then((r) => {
        if (r.status === 401) {
          router.push("/admin/login");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        setChecking(false);
      });
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p style={{ color: "var(--text-muted)" }}>Загрузка...</p>
      </div>
    );
  }

  async function handleLogout() {
    await adminMutationFetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <div className="admin-shell flex min-h-[calc(100vh-80px)]">
      {/* Sidebar */}
      <aside
        className="admin-sidebar hidden w-64 shrink-0 border-r lg:block"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-elevated)",
        }}
      >
        <div className="flex flex-col gap-1 p-4">
          <Link
            href="/"
            className="mb-4 flex items-center gap-2 text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronLeft className="h-4 w-4" />
            На сайт
          </Link>
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  background: active ? "var(--primary-soft)" : "transparent",
                  color: active ? "var(--primary)" : "var(--text-muted)",
                }}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
            style={{ color: "var(--danger)" }}
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t lg:hidden" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
        <nav className="flex justify-around py-2">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-1 text-xs"
                style={{ color: active ? "var(--primary)" : "var(--text-soft)" }}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <main className="admin-main flex-1 overflow-x-hidden p-6 pb-24 lg:p-8 lg:pb-8">
        {children}
      </main>
    </div>
  );
}
