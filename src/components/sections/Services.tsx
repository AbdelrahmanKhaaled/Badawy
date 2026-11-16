import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { categories, serviceIcons, servicesIn } from "@/data/services";
import { bookHref } from "@/lib/booking-presets";
import AnimatedHeading from "@/components/animations/AnimatedHeading";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

/**
 * Two service families, two different layouts:
 *  A. Photography & Creative Production — editorial index rows (theme-aware).
 *  B. Events, Venues & Locations — a dark "booking board" over the conference image, with booking CTAs.
 */
export default function Services() {
  const production = servicesIn("production");
  const events = servicesIn("events");

  return (
    <section id="services" aria-labelledby="services-title" className="relative bg-ink sec">
      <div className="wrap">
        {/* header */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-reveal="fade" className="eyebrow"><b>03</b><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />Our Services</div>
            <AnimatedHeading id="services-title" className="h-lg mt-7" lines={["We create it, host it", <span key="t">and <em>coordinate it.</em></span>]} />
          </div>
          <div data-reveal="up" data-delay="0.15" className="max-w-[40ch] lg:pb-2">
            <p className="body-copy">Creative production and event logistics under one roof &mdash; book a single service or let us run the whole production.</p>
            <div className="mt-7"><Button href="/services" variant="outline">Explore Our Services</Button></div>
          </div>
        </div>

        {/* A — creative production */}
        <div className="mt-[clamp(64px,7vw,120px)] grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p data-reveal="fade" className="font-serif text-[2.6rem] italic leading-none text-accent">A.</p>
              <h3 data-reveal="up" className="mt-4 font-serif text-[clamp(1.6rem,2.3vw,2.4rem)] font-medium leading-tight">{categories.production.title}</h3>
              <p data-reveal="up" data-delay="0.1" className="mt-4 max-w-[34ch] text-[.9rem] leading-relaxed text-muted">{categories.production.short}</p>
              <div data-reveal="up" data-delay="0.2" className="mt-8">
                <Button book={{ preset: "shoot" }} icon={<CalendarDays size={14} />} arrow={false}>Book a Shoot</Button>
              </div>
            </div>
          </div>
          <div data-stagger="up" data-gap="0.1" className="lg:col-span-8">
            {production.map((s, i) => (
              <div key={s.slug} data-item>
                <Link href={`/services/${s.slug}`} className={`srow group ${i === production.length - 1 ? "srow-last" : ""}`} aria-label={`${s.title} — service details`}>
                  <span className="font-serif text-[clamp(1.2rem,1.6vw,1.8rem)] italic leading-none text-accent">0{i + 1}</span>
                  <div>
                    <h4 className="srow-t font-serif text-[clamp(1.35rem,2vw,2.2rem)] font-medium leading-tight">{s.title}</h4>
                    <p className="mt-2 max-w-[48ch] text-[.86rem] leading-relaxed text-muted">{s.short}</p>
                  </div>
                  <span className="flex items-center gap-6">
                    <Icon name={serviceIcons[s.slug as keyof typeof serviceIcons]} size={30} className="srow-i hidden text-accent md:block" />
                    <ArrowUpRight size={20} aria-hidden="true" className="-translate-x-2 translate-y-2 text-accent opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* B — events, venues & locations (dark booking board in both themes) */}
      <div className="wrap mt-[clamp(72px,8vw,140px)]">
        <div className="relative isolate overflow-hidden rounded-md bg-night text-snow">
          <div data-parallax="0.06" className="absolute inset-0 -z-10 scale-[1.14]">
            <Image src="/images/work-4.png" alt="" aria-hidden="true" fill sizes="(min-width:1280px) 1280px, 100vw" className="object-cover object-center" />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/55" />
          <div aria-hidden="true" className="glow-anim pointer-events-none absolute -left-20 top-1/3 -z-10 h-72 w-72 rounded-full bg-glow/20 blur-[100px]" />
          <i className="vf vf-tl !left-5 !top-5" /><i className="vf vf-tr !right-5 !top-5" /><i className="vf vf-bl !bottom-5 !left-5" /><i className="vf vf-br !bottom-5 !right-5" />

          <div className="grid gap-12 px-6 py-14 sm:px-10 md:py-16 lg:grid-cols-12 lg:gap-10 lg:px-14 lg:py-20">
            <div className="lg:col-span-5">
              <p data-reveal="fade" className="font-serif text-[2.6rem] italic leading-none text-glow">B.</p>
              <h3 data-reveal="up" className="mt-4 font-serif text-[clamp(1.8rem,2.8vw,3rem)] font-medium leading-[1.08]">{categories.events.title}</h3>
              <p data-reveal="up" data-delay="0.1" className="mt-5 max-w-[38ch] text-[.95rem] leading-relaxed text-snow/80">
                Tell us the date, the guest count and the look you want. We find the space, book it, coordinate it &mdash; and capture it.
              </p>
              <div data-reveal="up" data-delay="0.2" className="mt-9 flex flex-wrap gap-3">
                <Button book={{ preset: "event" }} icon={<CalendarDays size={14} />} arrow={false}>Book an Event</Button>
                <a href={bookHref({ preset: "location" })} data-book="" className="btn border border-snow/40 text-snow hover:border-glow hover:bg-glow/10">
                  <MapPin size={14} aria-hidden="true" /><span>Find Your Location</span>
                </a>
              </div>
            </div>
            <ul data-stagger="up" data-gap="0.1" className="border-b border-snow/15 lg:col-span-7">
              {events.map((s) => (
                <li key={s.slug} data-item>
                  <Link href={`/services/${s.slug}`} className="loc-row group" aria-label={`${s.title} — service details`}>
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-snow/20 text-glow">
                      <Icon name={serviceIcons[s.slug as keyof typeof serviceIcons]} size={19} />
                    </span>
                    <span>
                      <span className="block font-serif text-[clamp(1.15rem,1.6vw,1.55rem)] font-medium leading-tight transition-colors group-hover:text-glow">{s.title}</span>
                      <span className="mt-1 block text-[.8rem] text-snow/65">{s.short}</span>
                    </span>
                    <span className="loc-go grid h-9 w-9 place-items-center rounded-full border border-glow/50 text-glow" aria-hidden="true">
                      <ArrowUpRight size={16} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
