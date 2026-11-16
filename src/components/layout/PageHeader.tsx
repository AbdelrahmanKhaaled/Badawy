import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import AnimatedHeading from "@/components/animations/AnimatedHeading";

type Crumb = { label: string; href?: string };

/**
 * Inner-page cinematic banner: full-bleed image (slow zoom-in + scroll parallax), directional shade,
 * viewfinder corners and a slate label. Always dark — `.banner` re-scopes the dark theme tokens locally,
 * exactly like the homepage hero, so it looks identical in dark and light mode.
 */
export default function PageHeader({
  crumbs,
  eyebrow,
  title,
  intro,
  actions,
  image,
  slate,
  id = "page-title",
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: ReactNode[];
  intro?: ReactNode;
  actions?: ReactNode;
  image: { src: string; alt: string; position?: string; mirror?: boolean };
  /** Small HUD label, e.g. "SCENE 02 — ABOUT". */
  slate?: string;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} className="banner relative isolate flex min-h-[clamp(520px,72svh,700px)] overflow-hidden border-b hair bg-night text-snow md:min-h-[clamp(500px,66svh,700px)]">
      {/* image */}
      <div data-parallax="0.05" className="absolute inset-0 -z-20 scale-[1.12]">
        <div className="banner-zoom absolute inset-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className={`object-cover ${image.mirror ? "-scale-x-100" : ""}`}
            style={{ objectPosition: image.position ?? "50% 50%" }}
          />
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/90 via-night/55 to-transparent max-md:via-night/70 max-md:to-night/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/75 via-transparent to-night/35" />
      <div aria-hidden="true" className="glow-anim pointer-events-none absolute -left-24 bottom-0 -z-10 h-80 w-[28rem] rounded-full bg-glow/15 blur-[120px]" />

      {/* frame + HUD */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-4 md:inset-6">
        <i className="vf vf-tl" /><i className="vf vf-tr" /><i className="vf vf-bl" /><i className="vf vf-br" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute right-8 top-8 hidden items-center gap-5 text-[9px] font-semibold tracking-[.3em] text-snow/70 sm:flex md:right-12 md:top-10">
        <span className="flex items-center gap-2"><span className="blink h-1.5 w-1.5 rounded-full bg-red-500" />REC</span>
        <span>4K · 25FPS</span>
      </div>
      {slate && (
        <p aria-hidden="true" className="pointer-events-none absolute bottom-8 right-8 hidden text-[9px] font-medium tracking-[.34em] text-snow/50 md:block md:bottom-10 md:right-12">{slate}</p>
      )}

      {/* content */}
      <div className="wrap relative flex flex-col justify-between gap-12 py-[clamp(36px,4.5vw,64px)]">
        <nav aria-label="Breadcrumb" data-reveal="fade">
          <ol className="flex flex-wrap items-center gap-1.5 text-[.64rem] uppercase tracking-[.2em] text-snow/60">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} aria-hidden="true" className="text-glow" />}
                {c.href ? <Link href={c.href} className="transition-colors hover:text-glow">{c.label}</Link> : <span aria-current="page" className="text-snow">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-[760px]">
          <div data-reveal="fade" className="eyebrow !text-glow"><span data-draw aria-hidden="true" className="h-px w-14 bg-glow/70" />{eyebrow}</div>
          <AnimatedHeading as="h1" id={id} className="h-xl mt-6 text-snow [&_em]:!text-glow" lines={title} />
          {intro && <p data-reveal="up" data-delay="0.15" className="mt-7 max-w-[52ch] text-[clamp(.95rem,1.1vw,1.1rem)] leading-relaxed text-snow/80">{intro}</p>}
          {actions && <div data-reveal="up" data-delay="0.25" className="mt-9 flex flex-wrap gap-3">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
