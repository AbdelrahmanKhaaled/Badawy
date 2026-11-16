"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, Phone, Mail, CalendarDays, ArrowUpRight } from "lucide-react";
import { nav, site } from "@/data/content";
import { bookHref } from "@/lib/booking-presets";
import ThemeToggle from "@/components/ui/ThemeToggle";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export default function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const first = useRef<HTMLAnchorElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const t = window.setTimeout(() => first.current?.focus(), 350);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a, button");
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.documentElement.style.overflow = prev;
      window.clearTimeout(t);
      window.removeEventListener("keydown", key);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-ink px-7 pb-10 pt-6"
          initial={{ clipPath: "circle(0% at calc(100% - 44px) 40px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 44px) 40px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 44px) 40px)", transition: { duration: 0.5, ease: [0.7, 0, 0.3, 1] } }}
          transition={{ duration: 0.75, ease: [0.7, 0, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-copper/20 blur-[90px]" />
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <button type="button" onClick={onClose} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full border border-copper/50 text-copper-hi transition hover:bg-copper hover:text-ink">
              <X size={20} />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 py-8">
            {nav.map((n, i) => (
              <motion.div
                key={n.href}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.07, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } }}
                exit={{ opacity: 0 }}
              >
                <Link
                  ref={i === 0 ? first : undefined}
                  href={n.href}
                  onClick={onClose}
                  aria-current={isActive(pathname, n.href) ? "page" : undefined}
                  className="group flex items-baseline gap-4 border-b border-copper/20 py-4 font-serif text-4xl font-semibold uppercase tracking-wide text-cream aria-[current=page]:text-copper-hi"
                >
                  <span className="font-sans text-xs tracking-[.3em] text-copper">0{i + 1}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-2">{n.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.7 } }} className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <a href={bookHref({ preset: "shoot" })} data-book="" onClick={onClose} className="btn btn-solid justify-center !px-3">
                <CalendarDays size={14} aria-hidden="true" /><span>Book a Shoot</span>
              </a>
              <a href={bookHref({ preset: "event" })} data-book="" onClick={onClose} className="btn btn-outline justify-center !px-3">
                <span>Book an Event</span><ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
            <div className="space-y-3 text-sm text-muted">
              <a href={site.phoneHref} className="flex items-center gap-3 hover:text-cream"><Phone size={15} className="text-copper-hi" /> {site.phoneDisplay}</a>
              <a href={site.emailHref} className="flex items-center gap-3 break-all hover:text-cream"><Mail size={15} className="text-copper-hi" /> {site.email}</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
