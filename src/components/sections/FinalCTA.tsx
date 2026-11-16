"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { bookHref } from "@/lib/booking-presets";
import { assets } from "@/data/assets";
import { site } from "@/data/content";
import { prefersReducedMotion, registerGsap } from "@/lib/animations";
import AnimatedHeading from "@/components/animations/AnimatedHeading";
import MagneticButton from "@/components/animations/MagneticButton";

const fmt = (f: number) =>
  [Math.floor(f / 90000), Math.floor(f / 1500) % 60, Math.floor(f / 25) % 60, f % 25].map((v) => String(v).padStart(2, "0")).join(":");

/**
 * A cinema frame: letterbox bars that settle as the section scrolls in, a running timecode,
 * a large headline over the sunset image and a rotating "orb" CTA. Dark in both themes (it is a film frame).
 */
export default function FinalCTA() {
  const root = useRef<HTMLElement>(null);
  const tc = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    let raf = 0;
    let frames = 0;
    let last = 0;
    const tick = (t: number) => {
      if (t - last >= 40) {
        frames += Math.max(1, Math.round((t - last) / 40));
        last = t;
        if (tc.current) tc.current.textContent = fmt(frames);
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      if (reduced) return;
      if (e.isIntersecting && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(el);

    let ctx: gsap.Context | undefined;
    if (!reduced) {
      registerGsap();
      ctx = gsap.context(() => {
        gsap.fromTo("[data-bar]", { scaleY: 2.2 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: true } });
        gsap.fromTo("[data-cta-img]", { scale: 1.2 }, { scale: 1.04, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      }, el);
    }
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, []);

  const bar = "h-[clamp(40px,4.6vw,64px)]";

  return (
    <section ref={root} aria-labelledby="cta-title" className="relative isolate overflow-hidden bg-night text-snow">
      <div data-cta-img className="absolute inset-0">
        <Image src={assets.story.src} alt={assets.story.alt} fill sizes="100vw" className="object-cover object-[16%_55%]" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-night/30 via-night/55 to-night/90 md:from-night/5 md:via-night/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-night/40" />
      <div aria-hidden="true" className="glow-anim pointer-events-none absolute left-[10%] top-[38%] h-48 w-80 rounded-full bg-glow/25 blur-[90px]" />

      {/* letterbox bars + slate / timecode */}
      <div data-bar aria-hidden="true" className={`absolute inset-x-0 top-0 z-10 origin-top bg-night ${bar}`} />
      <div data-bar aria-hidden="true" className={`absolute inset-x-0 bottom-0 z-10 origin-bottom bg-night ${bar}`} />
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 z-20 ${bar}`}>
        <div className="wrap flex h-full items-center justify-between text-[9px] font-medium tracking-[.34em] text-snow/55">
          <span>SCENE 07 — YOUR PRODUCTION</span>
          <span className="flex items-center gap-2"><span className="blink h-1.5 w-1.5 rounded-full bg-red-500" />REC</span>
        </div>
      </div>
      <div aria-hidden="true" className={`absolute inset-x-0 bottom-0 z-20 ${bar}`}>
        <div className="wrap flex h-full items-center justify-between text-[9px] font-medium tracking-[.34em] text-snow/55">
          <span>TC <span ref={tc} className="tabular-nums text-snow/80">00:00:00:00</span></span>
          <span className="hidden sm:inline">2.39 : 1 · 4K · LOG</span>
        </div>
      </div>

      <div className="wrap relative z-10 grid min-h-[680px] items-center py-[clamp(110px,11vw,160px)] md:min-h-[clamp(680px,58vw,880px)] lg:grid-cols-12">
        <div className="lg:col-span-7 lg:col-start-6">
          <div data-reveal="fade" className="eyebrow !text-glow"><span data-draw aria-hidden="true" className="h-px w-14 bg-glow/60" />Let&rsquo;s plan your project</div>
          <AnimatedHeading
            id="cta-title"
            className="mt-7 font-serif text-[clamp(3rem,7.2vw,7.4rem)] font-medium leading-[.98] tracking-[-.015em] text-snow"
            lines={["Your story,", "produced", <em key="s" className="text-glow">end to end.</em>]}
          />
          <div className="mt-12 flex flex-wrap items-center gap-x-12 gap-y-10">
            <div data-reveal="scale" data-delay="0.35">
              <MagneticButton strength={0.35}>
                <a href={bookHref({ preset: "project" })} data-book="" className="cta-orb" aria-label="Let’s create — plan your project">
                  <svg viewBox="0 0 100 100" aria-hidden="true" className="orb-ring h-full w-full">
                    <defs><path id="seal-cta" d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" /></defs>
                    <text fontSize="7.6" fontWeight="600" fill="currentColor" letterSpacing="1.4">
                      <textPath href="#seal-cta" textLength="262" lengthAdjust="spacing">LET&rsquo;S CREATE • PLAN YOUR PROJECT • LET&rsquo;S CREATE •</textPath>
                    </text>
                  </svg>
                  <span className="core"><ArrowUpRight size={26} aria-hidden="true" /></span>
                </a>
              </MagneticButton>
            </div>
            <div data-reveal="up" data-delay="0.5" className="space-y-3">
              <p className="text-[9px] font-semibold tracking-[.34em] text-snow/55">OR REACH US DIRECTLY</p>
              <a href={site.phoneHref} className="group flex items-center gap-3 text-[15px] text-snow/90 transition hover:text-glow">
                <Phone size={15} className="text-glow transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />{site.phoneDisplay}
              </a>
              <a href={site.emailHref} className="group flex items-center gap-3 break-all text-[15px] text-snow/90 transition hover:text-glow">
                <Mail size={15} className="shrink-0 text-glow transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />{site.email}
              </a>
            </div>
          </div>
          <div data-reveal="up" data-delay="0.6" className="mt-14 flex flex-wrap gap-3 border-t border-snow/15 pt-8">
            <a href={bookHref({ preset: "event" })} data-book="" className="btn border border-snow/35 text-snow hover:border-glow hover:bg-glow/10"><CalendarDays size={14} aria-hidden="true" /><span>Book an Event</span></a>
            <a href={bookHref({ preset: "location" })} data-book="" className="btn border border-snow/35 text-snow hover:border-glow hover:bg-glow/10"><MapPin size={14} aria-hidden="true" /><span>Find Your Location</span></a>
            <Link href="/services" className="btn text-snow/85 hover:text-glow"><span>Explore Our Services</span><ArrowUpRight size={14} aria-hidden="true" /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
