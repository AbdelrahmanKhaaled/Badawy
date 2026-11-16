"use client";
import { useCallback, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { assets } from "@/data/assets";
import { projects } from "@/data/content";
import ProjectModal from "@/components/ui/ProjectModal";

/** Portfolio page grid — every card opens the preview modal (with links to the service and booking). */
export default function PortfolioGrid() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      <div data-stagger="scale" data-gap="0.14" className="grid gap-5 md:grid-cols-2">
        {projects.map((p, i) => {
          const img = assets.works[i];
          return (
            <button
              key={p.title}
              type="button"
              data-item
              data-cursor="view"
              onClick={() => setOpen(i)}
              aria-label={`Open ${p.title} — ${p.sub}`}
              className={`work aspect-[4/3] w-full ${i === 0 || i === 3 ? "md:aspect-[16/11]" : ""}`}
            >
              <div data-zoom className="absolute inset-0">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" style={{ objectPosition: img.position }} />
              </div>
              <div className="shade absolute inset-0" />
              <span className="absolute left-5 top-5 font-serif text-sm italic text-glow">0{i + 1}</span>
              <div className="wtext absolute bottom-0 left-0 flex items-center gap-4 p-6 md:p-8">
                <span className="play grid h-11 w-11 shrink-0 place-items-center rounded-full border border-snow/80 text-snow">
                  <Play size={13} fill="currentColor" aria-hidden="true" className="translate-x-px" />
                </span>
                <span>
                  <span className="block text-[.62rem] uppercase tracking-[.26em] text-glow">{p.category}</span>
                  <span className="mt-1.5 block font-serif text-[clamp(1.3rem,2vw,1.9rem)] font-medium text-snow">{p.title}</span>
                  <span className="wsub mt-1 block text-[.78rem] text-snow/80">{p.sub}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <ProjectModal index={open} onClose={close} onChange={setOpen} />
    </>
  );
}
