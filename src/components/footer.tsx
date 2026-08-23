import Link from "next/link";

const NAV_COLUMNS = [
  {
    title: "Разделы",
    links: [
      { label: "Кейсы", href: "/work" },
      { label: "Подход", href: "/approach" },
      { label: "Контакты", href: "/contacts" },
      { label: "О нас", href: "/about" },
    ],
  },
  {
    title: "Документы",
    links: [
      { label: "Политика обработки ПДн", href: "/privacy" },
      { label: "Согласие на обработку ПДн", href: "/consent" },
      { label: "Политика cookie", href: "/cookies" },
      { label: "Пользовательское соглашение", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="lab-footer mt-auto border-t">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="lab-footer-brand"
            >
              OptiMate
            </Link>
            <p className="lab-footer__tagline mt-2 font-mono text-[11px] uppercase tracking-[0.18em]">
              AI Product & Automation Lab
            </p>
            <p className="lab-footer__description mt-3 max-w-xs text-sm leading-relaxed">
              AI Product & Automation Lab: AI-агенты, RAG, CRM, интеграции,
              контентные фабрики и внутренние платформы.
            </p>
          </div>

          {/* Nav columns */}
          {NAV_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="lab-footer__heading mb-4 text-sm font-semibold uppercase tracking-wider">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="lab-footer__link text-sm transition-colors hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contacts */}
          <div>
            <h3 className="lab-footer__heading mb-4 text-sm font-semibold uppercase tracking-wider">
              Контакты
            </h3>
            <ul className="lab-footer__contacts flex flex-col gap-2 text-sm">
              <li>
                Email:{" "}
                <a href="mailto:info@optimatesite.ru" className="lab-footer__link hover:underline">
                  info@optimatesite.ru
                </a>
              </li>
              <li>
                Telegram:{" "}
                <a href="https://t.me/optimate" className="lab-footer__link hover:underline" target="_blank" rel="noopener noreferrer">
                  @optimate
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="lab-footer__bottom mt-10 border-t pt-6 text-center text-sm">
          &copy; {new Date().getFullYear()} OptiMate. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
