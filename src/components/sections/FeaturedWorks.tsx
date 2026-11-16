"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { assets } from "@/data/assets";
import { projects } from "@/data/content";
import ProjectModal from "@/components/ui/ProjectModal";

const place = [
  "col-span-2 h-[380px] md:col-span-1 md:col-start-1 md:row-span-2 md:row-start-1 md:h-auto",
  "h-[230px] md:col-start-2 md:row-start-1 md:h-auto",
  "h-[230px] md:col-start-3 md:row-start-1 md:h-auto",
  "col-span-2 h-[220px] md:col-span-2 md:col-start-2 md:row-start-2 md:h-auto",
];

export default function FeaturedWorks() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="works" aria-labelledby="works-title" className="bg-ink sec">
      <div className="wrap">
        <div className="mb-[clamp(40px,5vw,80px)] flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div data-reveal="fade" className="eyebrow"><b>04</b><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />Featured Works</div>
            <h2 id="works-title" data-lines="" className="h-lg mt-7"><span className="line"><span className="line-in">Selected</span></span><span className="line"><span className="line-in"><em>work.</em></span></span></h2>
          </div>
          <Link href="/portfolio" className="group flex items-center gap-3 self-start border-b border-copper/50 pb-2 text-[.68rem] font-semibold uppercase tracking-[.22em] text-accent transition hover:border-copper-hi hover:text-cream md:self-auto">
            View all projects <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        <div data-stagger="scale" data-gap="0.18" className="grid grid-cols-2 gap-4 md:grid-cols-[1.65fr_1.08fr_1fr] md:gap-[clamp(12px,1.4vw,24px)] md:auto-rows-[clamp(220px,19vw,380px)]">
          {projects.map((p, i) => {
            const img = assets.works[i];
            const big = i === 0;
            return (
              <button key={p.title} type="button" data-item data-cursor="view" onClick={() => setOpen(i)} aria-label={`Preview ${p.title} — ${p.sub}`} className={`work ${place[i]}`}>
                <div data-zoom className="absolute inset-0">
                  <Image src={img.src} alt={img.alt} fill sizes={big ? "(min-width:768px) 40vw, 100vw" : "(min-width:768px) 28vw, 50vw"} className="object-cover" style={{ objectPosition: img.position }} />
                </div>
                <div className="shade absolute inset-0" />
                <div className={`wtext absolute bottom-0 left-0 flex items-center gap-3 p-4 ${big ? "md:p-7" : "md:p-5"}`}>
                  <span className={`play grid shrink-0 place-items-center rounded-full border border-snow/80 text-snow ${big ? "h-10 w-10" : "h-8 w-8"}`}>
                    <Play size={big ? 13 : 11} fill="currentColor" aria-hidden="true" className="translate-x-px" />
                  </span>
                  <span>
                    <span className="block text-[.68rem] font-bold uppercase tracking-[.2em] text-snow">{p.title}</span>
                    <span className="wsub mt-1 block text-[.68rem] text-snow/80">{p.sub}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <ProjectModal index={open} onClose={close} onChange={setOpen} />
    </section>
  );
}
