"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [themeReady, setThemeReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const resolvedTheme: Theme = stored ?? "dark";

    document.documentElement.setAttribute("data-theme", resolvedTheme);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(resolvedTheme);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (!themeReady) return;

    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme, themeReady]);

  const toggle = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggle}
      aria-label={
        theme === "light" ? "Переключить на тёмную тему" : "Переключить на светлую тему"
      }
      title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
      className="theme-switch"
      type="button"
      data-mode={theme}
    >
      <span className="theme-switch__icon" aria-hidden="true">
        {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </span>
      <span className="theme-switch__text">
        <span className="theme-switch__mode">{theme === "light" ? "День" : "Ночь"}</span>
      </span>
    </button>
  );
}
