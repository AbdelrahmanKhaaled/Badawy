"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Mail, Phone, X } from "lucide-react";
import BookingForm from "./BookingForm";
import { PRESETS, isPreset, presetFor, type PresetId } from "@/lib/booking-presets";
import { serviceById, type BookingData } from "@/lib/booking";
import { site } from "@/data/content";

type OpenOpts = { preset?: PresetId; service?: string };
const Ctx = createContext<{ open: (o?: OpenOpts) => void; close: () => void } | null>(null);
export const useBooking = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBooking must be used inside <BookingProvider>");
  return c;
};

/**
 * Global booking modal. Every booking CTA is a real link to /book?type=…&service=… (works without JS);
 * with JS, clicks on `a[data-book]` are intercepted here and open this modal instead.
 * The draft is kept between openings so an accidental close never loses what was typed.
 */
export default function BookingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ preset: PresetId; service?: string; n: number } | null>(null);
  const draft = useRef<BookingData | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const open = useCallback((o: OpenOpts = {}) => {
    trigger.current = document.activeElement as HTMLElement | null;
    const service = o.service && serviceById(o.service) ? o.service : undefined;
    setState((s) => ({ preset: o.preset ?? presetFor(service), service, n: (s?.n ?? 0) + 1 }));
  }, []);
  const close = useCallback(() => setState(null), []);
  const onDraft = useCallback((d: BookingData | null) => (draft.current = d), []);

  // Intercept booking links site-wide.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[data-book]") as HTMLAnchorElement | null;
      if (!a) return;
      e.preventDefault();
      const u = new URL(a.href, window.location.href);
      const t = u.searchParams.get("type");
      open({ preset: isPreset(t) ? t : undefined, service: u.searchParams.get("service") ?? undefined });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [open]);

  // Close on route change.
  useEffect(() => setState(null), [pathname]);

  // Scroll lock, Esc, focus trap, focus restore.
  const isOpen = !!state;
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), 80);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab" || !panel.current) return;
      const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([tabindex='-1']), select, textarea")).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const a = f[0];
      const z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => {
      html.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", key);
      trigger.current?.focus?.();
    };
  }, [isOpen, close]);

  const P = state ? PRESETS[state.preset] : null;

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      <AnimatePresence>
        {state && P && (
          <motion.div
            key="booking"
            className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
            transition={{ duration: 0.35 }}
          >
            <div className="absolute inset-0 bg-night/80 backdrop-blur-md" onClick={close} aria-hidden="true" />
            <motion.div
              ref={panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-title"
              className="relative flex max-h-[94svh] w-full max-w-[1080px] overflow-hidden rounded-t-xl border hair bg-ink shadow-[0_40px_120px_-30px_rgba(0,0,0,.8)] sm:max-h-[90svh] sm:rounded-lg"
              initial={{ opacity: 0, y: 60, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {/* cinematic side panel (lg+) */}
              <aside className="relative hidden w-[340px] shrink-0 overflow-hidden bg-night text-snow lg:block">
                <motion.div className="absolute inset-0" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: [0.2, 0.7, 0.2, 1] }}>
                  <Image src={P.image} alt="" fill sizes="340px" className="object-cover" style={{ objectPosition: P.imagePosition ?? "50% 50%" }} />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/20" />
                <i className="vf vf-tl !left-5 !top-5" /><i className="vf vf-tr !right-5 !top-5" />
                <div className="absolute inset-x-8 bottom-8">
                  <p className="text-[9px] font-semibold tracking-[.34em] text-glow">{P.kicker.toUpperCase()}</p>
                  <p className="mt-3 font-serif text-[1.35rem] italic leading-snug">{P.text}</p>
                  <div className="mt-7 space-y-2.5 border-t border-snow/15 pt-5 text-[.82rem] text-snow/80">
                    <p className="text-[9px] font-semibold tracking-[.3em] text-snow/50">PREFER TO TALK?</p>
                    <a href={site.phoneHref} className="flex items-center gap-2.5 hover:text-glow"><Phone size={14} className="text-glow" aria-hidden="true" />{site.phoneDisplay}</a>
                    <a href={site.emailHref} className="flex items-center gap-2.5 break-all hover:text-glow"><Mail size={14} className="shrink-0 text-glow" aria-hidden="true" />{site.email}</a>
                  </div>
                </div>
              </aside>

              <div ref={body} className="relative min-w-0 flex-1 overflow-y-auto overscroll-contain">
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b hair bg-ink/90 px-5 py-5 backdrop-blur sm:px-9">
                  <div>
                    <p className="eyebrow !text-[.6rem] !tracking-[.3em]">{P.kicker}</p>
                    <h2 id="booking-title" className="mt-2 font-serif text-[clamp(1.5rem,2.6vw,2.2rem)] font-medium leading-tight">{P.title}</h2>
                  </div>
                  <button type="button" data-autofocus onClick={close} aria-label="Close booking form" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-copper/50 text-accent transition hover:bg-copper hover:text-ink">
                    <X size={19} />
                  </button>
                </div>
                <div className="px-5 pb-8 pt-7 sm:px-9 sm:pb-10">
                  <BookingForm key={state.n} preset={state.preset} service={state.service} draft={draft.current ?? undefined} onDraft={onDraft} onClose={close} scrollRef={body} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
