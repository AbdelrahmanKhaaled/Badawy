import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/assets";
import PageHeader from "@/components/layout/PageHeader";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected wedding, commercial, portrait and event productions by Badawy Productions.",
};

const moments = ["/services/wedding-photography", "/services/commercial-photography", "/services/portrait-photography", "/services/event-coverage"];

export default function PortfolioPage() {
  return (
    <main id="main" className="pt-[84px]">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
        eyebrow="Featured Works"
        title={["Selected", <em key="w">productions.</em>]}
        intro="Weddings, brand shoots, portraits and live events. Open a project to preview it, see the service behind it, or book something similar."
        image={{ src: "/images/work-1.png", alt: "Bride and groom embracing in golden light", position: "62% 40%" }}
        slate="SCENE 04 — PORTFOLIO"
        actions={<a href="#projects" className="btn btn-solid"><span>View Projects</span></a>}
      />

      <section id="projects" aria-label="Projects" className="sec-sm scroll-mt-20 bg-ink">
        <div className="wrap">
          <PortfolioGrid />
        </div>
      </section>

      <section aria-labelledby="moments-title" className="sec border-y hair bg-charcoal">
        <div className="wrap">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div data-reveal="fade" className="eyebrow"><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />From our sets</div>
              <h2 id="moments-title" data-reveal="up" className="h-lg mt-6">Moments by <em>discipline.</em></h2>
            </div>
            <div data-reveal="up"><Button href="/services" variant="outline">Explore Our Services</Button></div>
          </div>
          <ul data-stagger="up" data-gap="0.1" className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {assets.capture.map((c, i) => (
              <li key={c.src} data-item>
                <Link href={moments[i]} className="work block aspect-[3/4]" aria-label={`${c.label} — explore the service`}>
                  <Image src={c.src} alt={c.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" style={{ objectPosition: c.position }} />
                  <span className="shade absolute inset-0" />
                  <span className="wtext absolute bottom-0 left-0 p-5 text-[.66rem] font-semibold uppercase tracking-[.24em] text-snow">{c.label} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="pf-cta" className="force-dark relative isolate overflow-hidden bg-night text-snow">
        <div data-parallax="0.07" className="absolute inset-0 -z-10 scale-[1.16]">
          <Image src="/images/why-choose-us.png" alt="" aria-hidden="true" fill sizes="100vw" className="object-cover object-[9%_50%]" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/30 via-night/75 to-night/95" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-4 md:inset-6">
          <i className="vf vf-tl" /><i className="vf vf-tr" /><i className="vf vf-bl" /><i className="vf vf-br" />
        </div>
        <div className="wrap py-[clamp(90px,10vw,150px)]">
          <div className="lg:ml-auto lg:w-[52%]">
            <div data-reveal="fade" className="eyebrow !text-glow"><span data-draw aria-hidden="true" className="h-px w-14 bg-glow/60" />Your production next</div>
            <h2 id="pf-cta" data-reveal="up" className="h-lg mt-6 [&_em]:!text-glow">Have a project in <em>mind?</em></h2>
            <p data-reveal="up" data-delay="0.1" className="mt-5 max-w-[44ch] text-[.95rem] leading-relaxed text-snow/75">Tell us what you want to create — we’ll plan the crew, the location and the schedule around it.</p>
            <div data-reveal="up" data-delay="0.2" className="mt-9 flex flex-wrap gap-3">
              <Button book={{ preset: "project" }}>Let&rsquo;s Plan Your Project</Button>
              <Button href="/contact" variant="outline">Contact Us</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
