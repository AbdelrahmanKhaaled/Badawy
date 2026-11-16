"use client";
import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/animations";

const fmt = (f: number) =>
  [Math.floor(f / 90000), Math.floor(f / 1500) % 60, Math.floor(f / 25) % 60, f % 25].map((v) => String(v).padStart(2, "0")).join(":");

/** Camera slate for the footer: blinking red REC dot + 25fps timecode. Runs only while visible; static with reduced motion. */
export default function FooterSlate() {
  const root = useRef<HTMLDivElement>(null);
  const tc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0, frames = 0, last = 0;
    const tick = (t: number) => {
      if (t - last >= 40) {
        frames += Math.max(1, Math.round((t - last) / 40));
        last = t;
        if (tc.current) tc.current.textContent = fmt(frames);
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="flex items-center gap-3 text-[10px] font-semibold tracking-[.26em] text-muted">
      <span className="flex items-center gap-2 text-cream/85">
        <span className="relative grid h-2.5 w-2.5 place-items-center">
          <span className="blink absolute inset-0 rounded-full bg-red-500 shadow-[0_0_10px_3px_rgba(239,68,68,.55)]" />
        </span>
        REC
      </span>
      <span className="h-3 w-px bg-copper/30" />
      <span>TC <span ref={tc} className="tabular-nums text-cream/80">00:00:00:00</span></span>
      <span className="hidden h-3 w-px bg-copper/30 sm:block" />
      <span className="hidden sm:inline">4K · 25FPS</span>
    </div>
  );
}
