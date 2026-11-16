import Image from "next/image";
import Link from "next/link";
import { Aperture } from "lucide-react";
import { assets } from "@/data/assets";
import { benefits } from "@/data/content";
import AnimatedHeading from "@/components/animations/AnimatedHeading";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";

/**
 * "Behind the lens": a framed, portrait crop of the camera image (instead of a full-bleed backdrop),
 * a rotating seal, and an open 2×2 feature grid drawn with hairlines rather than boxed cards.
 */
export default function WhyChooseUs() {
  return (
    <section id="why" aria-labelledby="why-title" className="relative isolate overflow-hidden border-y hair bg-charcoal sec">
      <span aria-hidden="true" className="ghost-num pointer-events-none absolute -left-4 bottom-4 text-[clamp(8rem,20vw,22rem)]">05</span>
      <div aria-hidden="true" className="glow-anim pointer-events-none absolute left-[6%] top-[20%] h-[50%] w-[30%] rounded-full bg-glow/10 blur-[120px]" />

      <div className="wrap relative grid items-center gap-x-[clamp(40px,6vw,104px)] gap-y-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Visual */}
        <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-4 md:-inset-5">
            <i className="vf vf-tl" /><i className="vf vf-tr" /><i className="vf vf-bl" /><i className="vf vf-br" />
          </div>
          <div data-reveal="mask" className="relative aspect-[4/5] overflow-hidden bg-night">
            <div data-parallax="0.06" className="absolute inset-0 scale-[1.14]">
              <Image src={assets.whyChoose.src} alt={assets.whyChoose.alt} fill sizes="(min-width:768px) 2200px, 1800px" className="object-cover object-[9%_50%]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-transparent to-night/30" />
            {/* camera HUD (decorative) */}
            <div aria-hidden="true" className="absolute inset-x-5 top-5 flex items-center justify-between text-[9px] font-semibold tracking-[.3em] text-snow/85">
              <span className="flex items-center gap-2"><span className="blink h-2 w-2 rounded-full bg-red-500" />REC</span>
              <span>4K · 25FPS</span>
            </div>
            <div className="absolute inset-x-6 bottom-6">
              <p className="text-[9px] font-semibold tracking-[.34em] text-glow">BEHIND THE PRODUCTION</p>
              <p className="mt-2 max-w-[22ch] font-serif text-[clamp(1.15rem,1.6vw,1.5rem)] italic leading-snug text-snow">Crews, venues &amp; logistics — in one frame.</p>
            </div>
          </div>
          {/* rotating seal */}
          <div data-reveal="scale" data-delay="0.5" className="absolute -bottom-12 right-2 grid h-[116px] w-[116px] place-items-center rounded-full border hair bg-ink shadow-[0_20px_50px_-24px_rgba(0,0,0,.6)] md:-right-10 md:h-[140px] md:w-[140px]">
            <svg viewBox="0 0 100 100" aria-hidden="true" className="spin-slow absolute inset-0 h-full w-full text-accent">
              <defs><path id="seal-why" d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" /></defs>
              <text fontSize="7.2" fontWeight="600" fill="currentColor" letterSpacing="1.2">
                <textPath href="#seal-why" textLength="243" lengthAdjust="spacing">CREATE • HOST • COORDINATE • PRODUCE •</textPath>
              </text>
            </svg>
            <Aperture size={30} strokeWidth={1.4} className="text-accent" aria-hidden="true" />
          </div>
        </div>

        {/* Content */}
        <div>
          <div data-reveal="fade" className="eyebrow"><b>05</b><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />The Difference</div>
          <AnimatedHeading id="why-title" className="h-lg mt-7" lines={["Why brands choose", <em key="u">one agency.</em>]} />
          <p data-reveal="up" data-delay="0.1" className="body-copy mt-7">
            Creative production and event logistics usually mean five different suppliers. With us it is one brief, one plan and one team accountable for the result.
          </p>
          <ul data-stagger="up" data-gap="0.12" className="mt-12 grid border-t hair sm:grid-cols-2">
            {benefits.map((b, i) => (
              <li key={b.title} data-item className={`feat border-b hair py-8 ${i % 2 === 0 ? "sm:border-r sm:pr-8" : "sm:pl-8"}`}>
                <div className="flex items-center justify-between">
                  <span className="feat-n font-serif text-sm italic text-accent">0{i + 1}</span>
                  <Icon name={b.icon} size={28} className="feat-i text-accent" />
                </div>
                <h3 className="mt-6 font-serif text-[clamp(1.2rem,1.5vw,1.5rem)] font-medium text-cream">{b.title}</h3>
                <p className="mt-2 max-w-[32ch] text-[.86rem] leading-relaxed text-muted">{b.text}</p>
              </li>
            ))}
          </ul>
          <div data-reveal="up" data-delay="0.2" className="mt-12 flex flex-wrap items-center gap-6">
            <Button book={{ preset: "project" }}>Let&rsquo;s Plan Your Project</Button>
            <Link href="/services" className="text-[.7rem] font-semibold uppercase tracking-[.2em] text-accent underline-offset-8 hover:underline">See every service</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
