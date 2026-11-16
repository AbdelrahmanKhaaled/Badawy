import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { benefits, workflow } from "@/data/content";
import PageHeader from "@/components/layout/PageHeader";
import FinalCTA from "@/components/sections/FinalCTA";
import Button from "@/components/ui/Button";
import Icon, { type IconName } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "About",
  description: "Badawy Productions is a photography, marketing and event production agency coordinating shoots, films, conferences, venues, studios and shooting locations.",
};

const pillars: { k: string; icon: IconName; title: string; text: string; img: { src: string; alt: string; pos?: string }; links: { label: string; href: string }[] }[] = [
  {
    k: "01", icon: "camera", title: "Create",
    text: "Photography, filmmaking and brand content produced by our crews, from creative direction to the final edit.",
    img: { src: "/images/work-3.png", alt: "Cinematic portrait of a young man", pos: "50% 30%" },
    links: [{ label: "Commercial", href: "/services/commercial-photography" }, { label: "Videography", href: "/services/videography-filmmaking" }, { label: "Brand content", href: "/services/advertising-brand-content" }],
  },
  {
    k: "02", icon: "building", title: "Host",
    text: "Conference spaces, event halls, studios and indoor or outdoor shooting locations, sourced and booked to your brief.",
    img: { src: "/images/work-4.png", alt: "Conference stage with blue spotlights and audience", pos: "50% 50%" },
    links: [{ label: "Conferences", href: "/services/conference-booking" }, { label: "Event halls", href: "/services/event-hall-booking" }, { label: "Locations", href: "/services/shooting-locations" }],
  },
  {
    k: "03", icon: "calendar", title: "Coordinate",
    text: "Schedules, suppliers and on-site production handled by one team, so the venue, the crew and the plan work together.",
    img: { src: "/images/hero.png", alt: "Cinematographer operating a cinema camera under warm studio light", pos: "68% 50%" },
    links: [{ label: "Event production", href: "/services/event-production-coordination" }, { label: "Event coverage", href: "/services/event-coverage" }],
  },
];

const audiences = [
  { title: "Individuals & families", text: "Weddings, portraits and private celebrations — with the venue and the coverage arranged together.", href: "/services/wedding-photography" },
  { title: "Brands & businesses", text: "Campaigns, product shoots, brand films and social content built around marketing goals.", href: "/services/advertising-brand-content" },
  { title: "Organisations & institutions", text: "Conferences, launches and corporate events — booked, produced and documented end to end.", href: "/services/conference-booking" },
];

export default function AboutPage() {
  return (
    <main id="main" className="pt-[84px]">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        eyebrow="About the agency"
        title={["One agency.", <em key="e">Every production.</em>]}
        intro="Badawy Productions is a photography, marketing and event production agency. We combine creative crews with venue, studio and location booking — and coordinate everything in between."
        actions={
          <>
            <Button href="/services">Explore Our Services</Button>
            <Button book={{ preset: "project" }} variant="outline">Plan a Project</Button>
          </>
        }
        image={{ src: "/images/why-choose-us.png", alt: "Cinema camera on a slider under warm light", position: "8% 50%", mirror: true }}
        slate="SCENE 02 — THE AGENCY"
      />

      {/* what we do — image cards */}
      <section aria-labelledby="pillars-title" className="sec bg-ink">
        <div className="wrap">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div data-reveal="fade" className="eyebrow"><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />What we do</div>
              <h2 id="pillars-title" data-reveal="up" className="h-lg mt-6 max-w-[18ch]">Three capabilities, <em>one team.</em></h2>
            </div>
            <p data-reveal="up" data-delay="0.1" className="body-copy md:max-w-[38ch]">Book one of them, or let us combine all three into a single, fully coordinated production.</p>
          </div>
          <div data-stagger="up" data-gap="0.12" className="mt-14 grid gap-5 md:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.k} data-item className="svc-card">
                <div className="force-dark relative aspect-[4/3] overflow-hidden bg-night text-snow">
                  <Image src={p.img.src} alt={p.img.alt} fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" style={{ objectPosition: p.img.pos }} />
                  <span className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
                  <span className="absolute left-5 top-5 font-serif text-sm italic text-glow">{p.k}</span>
                  <span className="absolute bottom-5 left-5 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-snow/30 bg-night/40 text-glow backdrop-blur"><Icon name={p.icon} size={19} /></span>
                    <span className="font-serif text-[1.9rem] font-medium leading-none">{p.title}</span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-[.92rem] leading-relaxed text-muted">{p.text}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {p.links.map((l) => (
                      <li key={l.href}><Link href={l.href} className="chip !py-1.5 !text-[.74rem]">{l.label}<ArrowUpRight size={12} aria-hidden="true" /></Link></li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* who we work with — with image */}
      <section aria-labelledby="who-title" className="sec border-y hair bg-charcoal">
        <div className="wrap grid items-center gap-14 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-4">
              <i className="vf vf-tl" /><i className="vf vf-tr" /><i className="vf vf-bl" /><i className="vf vf-br" />
            </div>
            <div data-reveal="mask" className="relative aspect-[4/5] overflow-hidden bg-night">
              <div data-parallax="0.06" className="absolute inset-0 scale-[1.14]">
                <Image src="/images/capture-1.png" alt="Wedding couple portrait" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-[50%_35%]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-5 text-[9px] font-semibold tracking-[.34em] text-glow">PEOPLE · BRANDS · ORGANISATIONS</p>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div data-reveal="fade" className="eyebrow"><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />Who we work with</div>
            <h2 id="who-title" data-reveal="up" className="h-lg mt-6">For people, brands <em>and organisations.</em></h2>
            <ul data-stagger="up" data-gap="0.12" className="mt-10">
              {audiences.map((a, i) => (
                <li key={a.title} data-item>
                  <Link href={a.href} className={`srow group ${i === audiences.length - 1 ? "srow-last" : ""}`}>
                    <span className="font-serif text-xl italic text-accent">0{i + 1}</span>
                    <span>
                      <span className="srow-t block font-serif text-[clamp(1.25rem,1.7vw,1.8rem)] font-medium">{a.title}</span>
                      <span className="mt-2 block max-w-[46ch] text-[.88rem] leading-relaxed text-muted">{a.text}</span>
                    </span>
                    <ArrowUpRight size={20} aria-hidden="true" className="text-accent opacity-60 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* how we work — cinematic image band (dark in both themes) */}
      <section aria-labelledby="process-title" className="force-dark relative isolate overflow-hidden bg-night text-snow">
        <div data-parallax="0.07" className="absolute inset-0 -z-10 scale-[1.16]">
          <Image src="/images/your-story.png" alt="" aria-hidden="true" fill sizes="100vw" className="object-cover object-[16%_55%]" />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/40 via-night/75 to-night/95" />
        <div className="wrap py-[clamp(90px,10vw,160px)]">
          <div className="lg:ml-auto lg:w-[62%]">
            <div data-reveal="fade" className="eyebrow !text-glow"><span data-draw aria-hidden="true" className="h-px w-14 bg-glow/60" />How we work</div>
            <h2 id="process-title" data-reveal="up" className="h-lg mt-6 [&_em]:!text-glow">From brief to <em>delivery.</em></h2>
            <ol data-stagger="up" data-gap="0.12" className="mt-12 grid border-t border-snow/15 sm:grid-cols-2">
              {workflow.map((w, i) => (
                <li key={w.n} data-item className={`feat border-b border-snow/15 py-7 ${i % 2 === 0 ? "sm:border-r sm:pr-8" : "sm:pl-8"}`}>
                  <span className="feat-n font-serif text-sm italic text-glow">{w.n}</span>
                  <h3 className="mt-4 font-serif text-[1.35rem] font-medium">{w.title}</h3>
                  <p className="mt-2 text-[.88rem] leading-relaxed text-snow/70">{w.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* why */}
      <section aria-labelledby="why-about-title" className="sec bg-ink">
        <div className="wrap">
          <h2 id="why-about-title" data-reveal="up" className="h-lg">Why work with <em>us.</em></h2>
          <ul data-stagger="up" data-gap="0.1" className="mt-10 grid border-t hair sm:grid-cols-2">
            {benefits.map((b, i) => (
              <li key={b.title} data-item className={`feat border-b hair py-8 ${i % 2 === 0 ? "sm:border-r sm:pr-8" : "sm:pl-8"}`}>
                <Icon name={b.icon} size={26} className="feat-i text-accent" />
                <h3 className="mt-5 font-serif text-[1.3rem] font-medium">{b.title}</h3>
                <p className="mt-2 max-w-[40ch] text-[.88rem] leading-relaxed text-muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </main>
  );
}
