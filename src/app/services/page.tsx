import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { categories, servicesIn, type CategoryId } from "@/data/services";
import { workflow } from "@/data/content";
import { bookHref } from "@/lib/booking-presets";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import ServiceCard from "@/components/ui/ServiceCard";

export const metadata: Metadata = {
  title: "Services",
  description: "Photography, filming, brand content, event coverage, conference and event hall booking, studios, shooting locations and event production coordination.",
};

const order: { id: CategoryId; letter: string; cta: React.ReactNode }[] = [
  { id: "production", letter: "A.", cta: <Button book={{ preset: "shoot" }} icon={<CalendarDays size={14} />} arrow={false}>Book a Shoot</Button> },
  {
    id: "events",
    letter: "B.",
    cta: (
      <>
        <Button book={{ preset: "event" }} icon={<CalendarDays size={14} />} arrow={false}>Book an Event</Button>
        <a href={bookHref({ preset: "location" })} data-book="" className="btn btn-outline"><MapPin size={14} aria-hidden="true" /><span>Find Your Location</span></a>
      </>
    ),
  },
];

export default function ServicesPage() {
  return (
    <main id="main" className="pt-[84px]">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        eyebrow="Our Services"
        title={["Everything your", <span key="p"><em>production</em> needs.</span>]}
        intro="Two families of services, one coordinating team. Book a single shoot or venue, or combine them into one complete production."
        actions={
          <>
            <Button book={{ preset: "project" }}>Let&rsquo;s Plan Your Project</Button>
            <a href="#events" className="btn border border-snow/35 text-snow hover:border-glow hover:bg-glow/10"><span>Events &amp; Venues</span></a>
          </>
        }
        image={{ src: "/images/work-4.png", alt: "Conference stage with blue spotlights and audience", position: "60% 50%" }}
        slate="SCENE 03 — SERVICES"
      />

      {order.map(({ id, letter, cta }, k) => (
        <section key={id} id={id} aria-labelledby={`${id}-title`} className={`sec ${k % 2 ? "border-y hair bg-charcoal" : "bg-ink"}`}>
          <div className="wrap">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p data-reveal="fade" className="font-serif text-[2.6rem] italic leading-none text-accent">{letter}</p>
                <p data-reveal="fade" className="eyebrow mt-5">{categories[id].eyebrow}</p>
                <h2 id={`${id}-title`} data-reveal="up" className="h-lg mt-4">{categories[id].title}</h2>
                <p data-reveal="up" data-delay="0.1" className="body-copy mt-5">{categories[id].short}</p>
              </div>
              <div data-reveal="up" data-delay="0.15" className="flex flex-wrap gap-3">{cta}</div>
            </div>
            <div data-stagger="up" data-gap="0.1" className="mt-[clamp(40px,5vw,72px)] grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {servicesIn(id).map((s, i) => <ServiceCard key={s.slug} s={s} priority={k === 0 && i < 3} />)}
            </div>
          </div>
        </section>
      ))}

      <section aria-labelledby="how-title" className="sec bg-ink">
        <div className="wrap grid items-center gap-14 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div aria-hidden="true" className="pointer-events-none absolute -inset-4">
              <i className="vf vf-tl" /><i className="vf vf-tr" /><i className="vf vf-bl" /><i className="vf vf-br" />
            </div>
            <div data-reveal="mask" className="force-dark relative aspect-[4/5] overflow-hidden bg-night text-snow">
              <div data-parallax="0.06" className="absolute inset-0 scale-[1.14]">
                <Image src="/images/about-us.png" alt="A Badawy Productions crew member on set beside a studio light" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover object-[50%_18%]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-transparent to-transparent" />
              <div className="absolute inset-x-6 bottom-6">
                <p className="text-[9px] font-semibold tracking-[.34em] text-glow">ONE POINT OF CONTACT</p>
                <p className="mt-2 max-w-[24ch] font-serif text-[1.35rem] italic leading-snug">Your request goes to the team that plans and runs it.</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
          <div data-reveal="fade" className="eyebrow"><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />How booking works</div>
          <h2 id="how-title" data-reveal="up" className="h-lg mt-6">From request to <em>final delivery.</em></h2>
          <ol data-stagger="up" data-gap="0.12" className="mt-10 border-t hair">
            {workflow.map((w) => (
              <li key={w.n} data-item className="feat grid grid-cols-[3rem_1fr] gap-4 border-b hair py-6">
                <span className="feat-n font-serif text-lg italic text-accent">{w.n}</span>
                <span>
                  <h3 className="font-serif text-[1.3rem] font-medium">{w.title}</h3>
                  <p className="mt-1.5 text-[.88rem] leading-relaxed text-muted">{w.text}</p>
                </span>
              </li>
            ))}
          </ol>
          <p data-reveal="up" className="mt-8 text-[.9rem] text-muted">
            Not sure which service fits? <a href={bookHref({ preset: "project" })} data-book="" className="text-accent underline-offset-4 hover:underline">Describe your project</a> or <Link href="/contact" className="text-accent underline-offset-4 hover:underline">contact us</Link>.
          </p>
          </div>
        </div>
      </section>
    </main>
  );
}
