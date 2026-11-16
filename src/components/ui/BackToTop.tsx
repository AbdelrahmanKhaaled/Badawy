"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      className={`group fixed bottom-5 right-5 z-[60] grid h-12 w-12 place-items-center rounded-full border border-copper/60 bg-ink/80 text-copper-hi backdrop-blur transition-all duration-500 hover:-translate-y-1 hover:bg-copper hover:text-ink md:bottom-8 md:right-8 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <ArrowUp size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}
