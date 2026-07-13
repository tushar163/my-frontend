"use client";

import { getTheme, setTheme } from "@/lib/cookies";
import { useState } from "react";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState(() => getTheme() || "light");

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    setTheme(next);
    document.documentElement.setAttribute(
      "data-theme",
      next === "dark" ? "dark" : ""
    );
    if (next === "light") {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 rounded-md border border-border bg-surface-raised px-3 py-1.5 text-sm text-ink-secondary transition hover:bg-surface-sunken"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
