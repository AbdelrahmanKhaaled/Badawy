"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { finePointer, prefersReducedMotion } from "@/lib/animations";

/** Desktop-only copper cursor follower. The native cursor stays visible; this only adds an accent. */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!finePointer() || prefersReducedMotion()) return;
    const d = dot.current!;
    const r = ring.current!;
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3.out" });
    const lab = label.current;
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.to([d, r], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const view = t?.closest("[data-cursor='view']");
      const interactive = t?.closest("a, button, [role='button'], input, textarea");
      gsap.to(r, { scale: view ? 2.4 : interactive ? 1.6 : 1, backgroundColor: view ? "rgba(217,140,79,.92)" : "rgba(217,140,79,0)", duration: 0.35, ease: "power3.out" });
      gsap.to(d, { scale: view ? 0 : 1, duration: 0.25 });
      gsap.to(lab, { opacity: view ? 1 : 0, duration: 0.25 });
    };
    const leave = () => {
      shown = false;
      gsap.to([d, r], { opacity: 0, duration: 0.25 });
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      gsap.killTweensOf([d, r, lab]);
    };
  }, []);

  return (
    <div className="cursor pointer-events-none fixed left-0 top-0 z-[95]" aria-hidden="true">
      <div ref={ring} className="absolute -left-[18px] -top-[18px] grid h-9 w-9 place-items-center rounded-full border border-copper-hi/70 opacity-0">
        <span ref={label} className="text-[5.5px] font-bold tracking-[.12em] text-[#120a04] opacity-0">
          VIEW
        </span>
      </div>
      <div ref={dot} className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-copper-hi opacity-0" />
    </div>
  );
}
