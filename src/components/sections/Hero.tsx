"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { assets } from "@/data/assets";
import { registerGsap, prefersReducedMotion } from "@/lib/animations";
import { useIntroReady } from "@/hooks/useIntroReady";
import AnimatedHeading from "@/components/animations/AnimatedHeading";
import Button from "@/components/ui/Button";

/**
 * APPROVED HERO (v2) — restored. Reconstructed 1:1 from the last build made before the v3 "850px / right-anchored"
 * rewrite (recovered from the webpack cache; see docs/backups). Composition, image framing, typography scale,
 * REC pulse, scroll cue and GSAP timeline are unchanged. Only the eyebrow/description copy (agency positioning)
 * and the CTA destination (/portfolio) differ from the approved build.
 *
 * NOTE: the supplied hero image already contains the viewfinder corners and the REC/4K/25FPS/CINE/LOG HUD,
 * so no duplicate HUD is drawn — only a soft pulse on top of the image's own REC dot.
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = section.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    const q = <T extends Element = HTMLElement>(s: string) => gsap.utils.toArray<T>(s, el);
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      t.fromTo("[data-zoom-layer]", { scale: 1.22, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.4, ease: "expo.out" }, 0)
        .fromTo(q("[data-eyebrow]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9 }, 0.45)
        .fromTo("[data-eyebrow-line]", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, 0.5)
        .fromTo(q(".line-in"), { yPercent: 112, y: 0 }, { yPercent: 0, y: 0, duration: 1.15, ease: "power4.out", stagger: 0.16 }, 0.65)
        .fromTo(q("[data-desc]"), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.9 }, 1.3)
        .fromTo(q("[data-cta]"), { opacity: 0, y: 34, scale: 0.88 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.9)" }, 1.5);
      tl.current = t;

      gsap.fromTo("[data-parallax-layer]", { yPercent: -0.8 }, { yPercent: 0.8, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
      gsap.to("[data-content]", { y: -70, opacity: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "70% top", scrub: true } });
      gsap.to("[data-fade]", { opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "40% top", end: "bottom top", scrub: true } });
    }, el);
    return () => {
      tl.current = null;
      ctx.revert();
    };
  }, []);

  useIntroReady(() => tl.current?.play());

  return (
    <section ref={section} id="home" aria-labelledby="hero-title" className="relative isolate min-h-[640px] overflow-hidden border-b hair md:aspect-[2023/777] md:min-h-0">
      {/* Background: parallax → intro zoom → slow drift */}
      <div data-parallax-layer className="absolute inset-0 scale-[1.015]">
        <div data-zoom-layer data-hero className="absolute inset-0">
          <div className="drift absolute inset-0">
            <Image src={assets.hero.src} alt={assets.hero.alt} fill priority sizes="100vw" className="object-cover object-[78%_50%] md:object-center" />
            <span
              aria-hidden="true"
              className="rec-pulse absolute hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500 shadow-[0_0_14px_6px_rgba(239,68,68,.55)] md:block"
              style={{ left: "94.4%", top: "13.8%" }}
            />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-night/70 via-night/20 to-transparent md:from-night/45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 to-transparent" />
      <div aria-hidden="true" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-snow/70 md:flex">
        <span className="text-[8px] tracking-[.4em]">SCROLL</span>
        <span className="block h-12 w-px overflow-hidden bg-snow/20"><span className="scroll-cue block h-full w-full bg-glow" /></span>
      </div>
      <div data-fade aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink opacity-0" />

      <div data-content className="relative z-10 flex h-full items-center px-[6%] pb-12 pt-16 md:absolute md:inset-0 md:px-[8.4%] md:py-0">
        <div className="w-full max-w-[640px] md:max-w-[44%]">
          <div data-hero data-eyebrow className="inline-block pb-3">
            <p className="text-[clamp(.55rem,.72vw,.72rem)] font-medium tracking-[.26em] text-snow/90">BADAWY PRODUCTIONS — PHOTO, FILM &amp; EVENTS</p>
            <span data-eyebrow-line aria-hidden="true" className="mt-3 block h-px w-full origin-left bg-gradient-to-r from-glow/70 to-transparent" />
          </div>
          <AnimatedHeading
            as="h1"
            id="hero-title"
            manual
            className="serif-h mt-2 text-[clamp(2.7rem,4.5vw,5.6rem)] text-snow"
            lines={["WE FRAME", <span key="s" className="sweep italic">STORIES</span>, "THAT LAST."]}
          />
          <p data-hero data-desc className="mt-5 max-w-[36ch] text-[clamp(.85rem,1.02vw,1.05rem)] leading-relaxed text-snow/90">
            Photography, film, events and venues — one agency turning your vision into a visual story.
          </p>
          <div data-hero data-cta className="mt-6">
            <Button href="/portfolio">View Our Work</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
