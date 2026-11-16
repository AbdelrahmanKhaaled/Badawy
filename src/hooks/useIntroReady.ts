"use client";
import { useEffect, useRef } from "react";
import { INTRO_EVENT } from "@/lib/animations";

/** Calls `cb` once the preloader begins revealing the page (or immediately if it already played). */
export function useIntroReady(cb: () => void) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    const root = document.documentElement;
    let fired = false;
    const go = () => {
      if (fired) return;
      fired = true;
      ref.current();
    };
    if (root.classList.contains("intro-done") || root.dataset.intro === "reveal") {
      go();
      return;
    }
    window.addEventListener(INTRO_EVENT, go, { once: true });
    return () => window.removeEventListener(INTRO_EVENT, go);
  }, []);
}
