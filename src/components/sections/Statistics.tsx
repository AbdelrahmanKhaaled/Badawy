"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { assets } from "@/data/assets";
import { SHOW_DEMO_LABELS, stats } from "@/data/content";
import { prefersReducedMotion, registerGsap } from "@/lib/animations";
import Icon from "@/components/ui/Icon";

export default function Statistics() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((node) => {
        const target = Number(node.dataset.count);
        const o = { v: 0 };
        node.textContent = "0";
        gsap.to(o, {
          v: target,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => (node.textContent = String(Math.round(o.v))),
          scrollTrigger: { trigger: el, start: "top 75%", once: true },
        });
      });
      gsap.fromTo("[data-stat-icon]", { y: 0 }, { y: -4, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.35 });
    }, el);
    return () => ctx.revert();
  }, []);

  // The photographic band stays dark in both themes (text sits on the image), framed by theme-coloured fades.
  return (
    <section ref={root} aria-label="Agency statistics" className="relative isolate overflow-hidden bg-ink">
      <div data-parallax="0.08" className="absolute inset-0 scale-[1.18]">
        <Image src={assets.figures.src} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-night/45" />
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-ink to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      <div className="wrap relative">
        <ul data-reveal="up" className="grid grid-cols-2 py-[clamp(80px,9vw,160px)] md:grid-cols-4">
          {stats.map((s, i) => (
            <li key={s.label} className="relative flex flex-col items-center justify-center gap-3 px-3 py-6 text-center md:py-2">
              {i > 0 && <span data-draw-y data-delay={0.2 + i * 0.15} aria-hidden="true" className="absolute inset-y-3 left-0 hidden w-px bg-glow/40 md:block" />}
              <span data-stat-icon className="text-glow"><Icon name={s.icon} size={30} /></span>
              <span className="font-serif text-[clamp(2.4rem,4.2vw,5rem)] font-medium leading-none text-snow">
                <span data-count={s.value}>{s.value}</span>
                {s.suffix}
              </span>
              <span className="text-[.72rem] uppercase tracking-[.22em] text-snow/85">{s.label}</span>
            </li>
          ))}
        </ul>
        {SHOW_DEMO_LABELS && (
          <p className="pb-10 text-center text-[9px] uppercase tracking-[.3em] text-glow/80">Demo figures — pending client verification</p>
        )}
      </div>
    </section>
  );
}
