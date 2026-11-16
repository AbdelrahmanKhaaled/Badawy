"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerGsap, prefersReducedMotion, revealLines, ease } from "@/lib/animations";

type From = gsap.TweenVars;
const FROM: Record<string, From> = {
  up: { y: 54 },
  down: { y: -40 },
  left: { x: -90 },
  right: { x: 90 },
  scale: { scale: 0.9 },
  fade: {},
};
const MASK: Record<string, string> = {
  mask: "inset(0% 100% 0% 0%)", // wipes left→right
  "mask-up": "inset(100% 0% 0% 0%)",
};
const REST = { x: 0, y: 0, scale: 1, opacity: 1 };

/**
 * Declarative scroll-motion layer. Components only add data attributes:
 *   data-reveal="up|down|left|right|scale|fade|mask|mask-up" [data-delay]
 *   data-stagger="up|left|right|scale"  → animates its [data-item] children (+ [data-zoom] inside)
 *   data-lines     → masked line reveal for .line-in children
 *   data-draw / data-draw-y → line drawing
 *   data-parallax="0.1" → subtle scrubbed parallax
 * Any failure (or reduced motion) falls back to fully visible content via `.no-anim` on <html>.
 */
export default function MotionProvider() {
  // Lives in the root layout: re-scan the DOM whenever the route changes (client-side navigation).
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.add("no-anim");
      return;
    }
    registerGsap();
    let ctx: gsap.Context | undefined;
    try {
      ctx = gsap.context(() => {
        const trig = (el: Element, start = "top 88%") => ({ trigger: el, start, once: true });

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const kind = el.dataset.reveal ?? "up";
          const delay = Number(el.dataset.delay ?? 0);
          if (MASK[kind]) {
            gsap.fromTo(
              el,
              { opacity: 1, clipPath: MASK[kind] },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut", delay, scrollTrigger: trig(el, "top 85%") },
            );
          } else {
            gsap.fromTo(
              el,
              { opacity: 0, x: 0, y: 0, scale: 1, ...FROM[kind] },
              { ...REST, duration: 1.1, ease: ease.out, delay, scrollTrigger: trig(el) },
            );
          }
        });

        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((wrap) => {
          const kind = wrap.dataset.stagger || "up";
          const items = wrap.querySelectorAll("[data-item]");
          if (!items.length) return;
          gsap.fromTo(
            items,
            { opacity: 0, x: 0, y: 0, scale: 1, ...FROM[kind] },
            { ...REST, duration: 1, ease: ease.out, stagger: Number(wrap.dataset.gap ?? 0.14), scrollTrigger: trig(wrap, "top 86%") },
          );
          const zooms = wrap.querySelectorAll("[data-zoom]");
          if (zooms.length)
            gsap.fromTo(zooms, { scale: 1.22 }, { scale: 1, duration: 1.8, ease: ease.out, stagger: Number(wrap.dataset.gap ?? 0.14), scrollTrigger: trig(wrap, "top 86%") });
        });

        gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
          revealLines(el.querySelectorAll(".line-in"), { scrollTrigger: trig(el, "top 88%"), delay: Number(el.dataset.delay ?? 0) });
        });

        gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((el) => {
          gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: "power3.inOut", delay: Number(el.dataset.delay ?? 0.2), scrollTrigger: trig(el, "top 92%") });
        });
        gsap.utils.toArray<HTMLElement>("[data-draw-y]").forEach((el) => {
          gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, duration: 1.2, ease: "power3.inOut", delay: Number(el.dataset.delay ?? 0.2), scrollTrigger: trig(el, "top 92%") });
        });

        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amt = Number(el.dataset.parallax) * 100;
          gsap.fromTo(
            el,
            { yPercent: -amt },
            { yPercent: amt, ease: "none", scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        });
      });
    } catch (err) {
      console.warn("Motion layer failed, showing static content", err);
      root.classList.add("no-anim");
    }

    // Images/fonts can shift layout after first paint; recompute trigger positions.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const late = window.setTimeout(refresh, 400);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(late);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
