"use client";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { SHOW_DEMO_LABELS, testimonials } from "@/data/content";
import AnimatedHeading from "@/components/animations/AnimatedHeading";

/** Seconds each testimonial stays on screen. Autoplay is driven by the CSS progress bar (none with reduced motion). */
const DURATION = 8;
const ease = [0.2, 0.7, 0.2, 1] as const;
const pad = (v: number) => String(v).padStart(2, "0");

export default function Testimonials() {
  const [[i, dir], set] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  const go = useCallback((d: number) => set(([c]) => [(c + d + n) % n, d]), [n]);
  const pick = (k: number) => set(([c]) => [k, k >= c ? 1 : -1]);
  const t = testimonials[i];
  const initials = t.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  return (
    <section aria-labelledby="trust-title" className="relative overflow-hidden bg-ink sec">
      <div className="wrap">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div data-reveal="fade" className="eyebrow"><b>06</b><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />Client Voices</div>
            <AnimatedHeading id="trust-title" className="h-lg mt-7" lines={["Trusted on set", <em key="t">and on stage.</em>]} />
          </div>
          <div data-reveal="fade" data-delay="0.2" className="flex items-center gap-5">
            <span className="font-serif text-[clamp(1.6rem,2.2vw,2.2rem)] italic leading-none text-cream">
              {pad(i + 1)}<span className="mx-2 text-muted">/</span><span className="text-muted">{pad(n)}</span>
            </span>
            <span aria-hidden="true" className="h-10 w-px bg-copper/30" />
            <div className="flex gap-2.5">
              <motion.button type="button" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => go(-1)} aria-label="Previous testimonial" className="grid h-12 w-12 place-items-center rounded-full border border-copper/50 text-accent transition-colors hover:border-copper hover:bg-copper hover:text-ink">
                <ChevronLeft size={18} />
              </motion.button>
              <motion.button type="button" whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => go(1)} aria-label="Next testimonial" className="grid h-12 w-12 place-items-center rounded-full border border-copper/50 text-accent transition-colors hover:border-copper hover:bg-copper hover:text-ink">
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>

        <div
          data-reveal="up"
          data-delay="0.1"
          role="group"
          aria-roledescription="carousel"
          aria-label="Client testimonials"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="mt-[clamp(40px,5vw,72px)]"
        >
          <div className="grid overflow-hidden border hair lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
            {/* speaker panel */}
            <div className="relative overflow-hidden border-b hair bg-charcoal p-8 md:p-10 lg:border-b-0 lg:border-r">
              <span aria-hidden="true" className="pointer-events-none absolute right-6 top-2 select-none font-serif text-[11rem] leading-[.9] text-accent/10">&ldquo;</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={i} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease }} className="relative flex h-full flex-col justify-between gap-10">
                  <div className="relative grid h-24 w-24 place-items-center">
                    <svg viewBox="0 0 100 100" aria-hidden="true" className="spin-slow absolute inset-0 h-full w-full text-copper">
                      <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 5" />
                    </svg>
                    <span aria-hidden="true" className="grid h-[76px] w-[76px] place-items-center rounded-full border border-copper/50 bg-ink font-serif text-xl italic text-accent">{initials}</span>
                  </div>
                  <div>
                    <p className="font-serif text-[clamp(1.4rem,1.9vw,1.9rem)] font-medium leading-tight text-cream">{t.name}</p>
                    <p className="mt-2 text-[.78rem] tracking-wide text-accent">{t.role}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <span className="flex gap-1 text-accent" role="img" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
                      </span>
                      {SHOW_DEMO_LABELS && t.demo && <span className="rounded border border-copper/40 px-2 py-0.5 text-[8px] uppercase tracking-[.25em] text-muted">Demo content</span>}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* quote */}
            <div className="relative flex min-h-[300px] items-center bg-ink p-8 md:min-h-[340px] md:p-12 lg:p-16">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.blockquote
                  key={i}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: 40 * d, filter: "blur(6px)" }),
                    center: { opacity: 1, x: 0, filter: "blur(0px)" },
                    exit: (d: number) => ({ opacity: 0, x: -40 * d, filter: "blur(6px)" }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.6, ease }}
                  aria-live={paused ? "polite" : "off"}
                  className="max-w-[34ch] font-serif text-[clamp(1.45rem,2.5vw,2.6rem)] italic leading-[1.3] text-cream"
                >
                  &ldquo;{t.quote}&rdquo;
                </motion.blockquote>
              </AnimatePresence>
            </div>
          </div>

          {/* index tabs with autoplay progress */}
          <div className="mt-2 grid gap-x-6 sm:grid-cols-3">
            {testimonials.map((x, k) => (
              <button
                key={x.name + k}
                type="button"
                onClick={() => pick(k)}
                aria-current={k === i ? "true" : undefined}
                aria-label={`Show testimonial ${k + 1}: ${x.name}`}
                className="t-tab relative border-t hair pb-2 pt-5 text-left"
              >
                {k === i && (
                  <span
                    key={`p${i}`}
                    aria-hidden="true"
                    className="t-prog"
                    style={{ animationDuration: `${DURATION}s`, animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={() => go(1)}
                  />
                )}
                <span className="font-serif text-sm italic text-accent">{pad(k + 1)}</span>
                <span className="ml-3 text-[.82rem] font-semibold text-cream">{x.name}</span>
                <span className="mt-1 block truncate text-[.72rem] text-muted">{x.role}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
