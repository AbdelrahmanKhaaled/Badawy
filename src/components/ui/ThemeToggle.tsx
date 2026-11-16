"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const KEY = "badawy-theme";

/** Sun/Moon switch. Visuals are driven by CSS off <html data-theme>, so SSR and first paint always match. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const flip = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    const d = document.documentElement;
    d.classList.add("theme-anim");
    d.dataset.theme = next;
    d.style.colorScheme = next;
    try { localStorage.setItem(KEY, next); } catch { /* storage unavailable */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#f4f0e9" : "#0b0b0b");
    setTheme(next);
    window.setTimeout(() => d.classList.remove("theme-anim"), 650);
  };

  return (
    <button
      type="button"
      onClick={flip}
      className={`theme-toggle ${className}`}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={theme === null ? undefined : theme === "light"}
      suppressHydrationWarning
    >
      <Sun className="t-sun" size={18} aria-hidden="true" />
      <Moon className="t-moon" size={18} aria-hidden="true" />
    </button>
  );
}
