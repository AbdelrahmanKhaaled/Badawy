"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { assets } from "@/data/assets";
import { projects } from "@/data/content";
import { bookHref } from "@/lib/booking-presets";

/** Preview lightbox. Uses only supplied imagery and labels — no invented footage, links or descriptions. */
export default function ProjectModal({ index, onClose, onChange }: { index: number | null; onClose: () => void; onChange: (i: number) => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const n = projects.length;

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onChange((index! + 1) % n);
      else if (e.key === "ArrowLeft") onChange((index! - 1 + n) % n);
      else if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("a, button");
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      document.documentElement.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open, index, n, onClose, onChange]);

  const p = open ? projects[index!] : null;
  const img = open ? assets.works[index!] : null;

  return (
    <AnimatePresence>
      {open && p && img && (
        <motion.div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`${p.title} preview`}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink/92 p-4 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <button ref={closeBtn} type="button" onClick={onClose} aria-label="Close preview" className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-copper/60 text-copper-hi transition hover:bg-copper hover:text-ink sm:right-8 sm:top-8">
            <X size={20} />
          </button>
          <div className="flex w-full max-w-[1100px] items-center gap-3">
            <button type="button" aria-label="Previous project" onClick={() => onChange((index! - 1 + n) % n)} className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-copper/50 text-copper-hi transition hover:bg-copper/20 sm:grid">
              <ChevronLeft size={20} />
            </button>
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
              className="min-w-0 flex-1 overflow-hidden rounded-lg border border-copper/30 bg-charcoal shadow-[0_30px_90px_-20px_rgba(226,154,99,.25)]"
            >
              <div className="relative h-[52vh] w-full sm:h-[62vh]">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width:1100px) 1000px, 92vw" className="object-contain" />
              </div>
              <div className="flex flex-col gap-4 border-t hair p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="label text-[.6rem] text-copper-hi">{p.category}</p>
                  <h3 className="mt-1.5 font-serif text-2xl font-semibold uppercase tracking-wide">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.sub}</p>
                </div>
                <div className="flex flex-wrap gap-2.5 self-start sm:self-auto">
                  <Link href={`/services/${p.service}`} onClick={onClose} className="btn btn-outline">
                    <span>View service</span>
                  </Link>
                  <a href={bookHref({ service: p.book })} data-book="" onClick={onClose} className="btn btn-solid">
                    <span>Book a project like this</span>
                    <ArrowRight size={15} className="arr" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.div>
            <button type="button" aria-label="Next project" onClick={() => onChange((index! + 1) % n)} className="hidden h-11 w-11 shrink-0 place-items-center rounded-full border border-copper/50 text-copper-hi transition hover:bg-copper/20 sm:grid">
              <ChevronRight size={20} />
            </button>
          </div>
          <p className="mt-4 text-xs tracking-[.2em] text-muted" aria-live="polite">{index! + 1} / {n}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
