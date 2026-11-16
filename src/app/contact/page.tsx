import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Clapperboard, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/data/content";
import { bookHref } from "@/lib/booking-presets";
import PageHeader from "@/components/layout/PageHeader";
import BookingForm from "@/components/booking/BookingForm";
import LocationMap from "@/components/sections/LocationMap";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, email or WhatsApp Badawy Productions, send a structured project request, or find us on the map.",
};

const channels = [
  { icon: Phone, label: "Call us", value: site.phoneDisplay, href: site.phoneHref },
  { icon: MessageCircle, label: "WhatsApp", value: site.phoneDisplay, href: site.whatsappHref, external: true },
  { icon: Mail, label: "Email", value: site.email, href: site.emailHref },
];

const quick = [
  { icon: Clapperboard, label: "Book a shoot", href: bookHref({ preset: "shoot" }) },
  { icon: CalendarDays, label: "Book an event", href: bookHref({ preset: "event" }) },
  { icon: MapPin, label: "Find your location", href: bookHref({ preset: "location" }) },
];

export default function ContactPage() {
  return (
    <main id="main" className="pt-[84px]">
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        eyebrow="Contact"
        title={["Let’s plan your", <em key="p">next production.</em>]}
        intro="Reach the team directly, send a project request, or find us on the map below."
        image={{ src: "/images/figures.png", alt: "Sunset over layered mountain silhouettes", position: "50% 60%" }}
        slate="SCENE 05 — CONTACT"
        actions={
          <>
            <a href="#request" className="btn btn-solid"><span>Send a Request</span></a>
            <a href="#location" className="btn border border-snow/35 text-snow hover:border-glow hover:bg-glow/10"><MapPin size={14} aria-hidden="true" /><span>View Map</span></a>
          </>
        }
      />

      <section aria-label="Contact options and project request" className="sec-sm bg-ink">
        <div className="wrap grid gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-4">
            {/* image card */}
            <div data-reveal="mask" className="force-dark relative aspect-[4/3] overflow-hidden rounded-md bg-night text-snow">
              <div data-parallax="0.05" className="absolute inset-0 scale-[1.12]">
                <Image src="/images/about-us.png" alt="A Badawy Productions crew member on set beside a studio light" fill sizes="(min-width:1024px) 400px, 100vw" className="object-cover object-[50%_20%]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
              <div className="absolute inset-x-5 bottom-5">
                <p className="text-[9px] font-semibold tracking-[.34em] text-glow">TALK TO THE TEAM</p>
                <p className="mt-2 font-serif text-[1.3rem] italic leading-snug">One conversation for the shoot, the venue and the schedule.</p>
              </div>
            </div>

            <ul data-stagger="up" data-gap="0.1" className="border-t hair">
              {channels.map((c) => (
                <li key={c.label} data-item>
                  <a href={c.href} {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-5 border-b hair py-5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-copper/50 text-accent transition group-hover:bg-copper group-hover:text-[var(--btn-solid-fg)]">
                      <c.icon size={18} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="field-label block">{c.label}</span>
                      <span className="mt-1 block break-all text-[1rem] text-cream transition group-hover:text-accent">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div data-reveal="up">
              <p className="field-label">Know what you need?</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {quick.map((q) => (
                  <a key={q.label} href={q.href} data-book="" className="chip"><q.icon size={14} aria-hidden="true" />{q.label}</a>
                ))}
              </div>
            </div>
          </div>

          <div id="request" data-reveal="up" className="scroll-mt-28 border hair bg-charcoal p-6 sm:p-9 lg:col-span-8">
            <p className="eyebrow !text-[.6rem]">Project request</p>
            <h2 className="mt-3 font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium">Tell us about your project</h2>
            <div className="mt-8">
              <BookingForm preset="project" source="/contact" />
            </div>
          </div>
        </div>
      </section>

      <LocationMap />
    </main>
  );
}
