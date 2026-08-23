"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const NAV_ITEMS = [
  { label: "Кейсы", href: "/work" },
  { label: "Подход", href: "/approach" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const isSequenceSurface = pathname === "/" || pathname === "/sequence-lab/hero-night";
  const headerClassName = isSequenceSurface
    ? `lab-header lab-header--sequence ${pathname === "/" ? "lab-header--home-sequence" : "lab-header--night-sequence"}`
    : "lab-header";

  return (
    <header className={headerClassName}>
      <div className="container flex h-16 min-w-0 items-center justify-between lg:h-20">
        <Link href="/" className="lab-brand" aria-label="OptiMate — на главную">
          <span className="lab-brand__copy">
            <span className="lab-brand__name">OptiMate</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="lab-nav hidden min-w-0 items-center gap-1 lg:flex" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="lab-nav__link"
              data-active={isActive(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {/* Desktop-only CTA. Mobile CTA lives inside mobile menu. */}
          <div className="hidden lg:block">
            <Link href="/contacts" className="lab-header-cta">
              Разобрать процесс
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
          <ThemeToggle />

          {/* Mobile burger */}
          <span className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lab-menu-button"
              aria-controls="mobile-navigation"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </span>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="lab-mobile-menu lg:hidden"
        >
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="lab-mobile-link"
                data-active={isActive(item.href)}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contacts"
              className="lab-header-cta mt-3 justify-center text-center"
              onClick={() => setMobileOpen(false)}
            >
              Разобрать процесс
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
