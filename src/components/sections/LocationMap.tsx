import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { location, site } from "@/data/content";
import { bookHref } from "@/lib/booking-presets";

/**
 * Contact-page location section. The map source is configured in content.ts / env (see .env.example).
 * Until a verified address is configured it shows the country and no street address — nothing is invented.
 */
export default function LocationMap() {
  const details = [
    { icon: MapPin, label: location.address ? "Address" : "Based in", value: location.address ?? location.label, href: location.mapsLink, external: true },
    { icon: Phone, label: "Phone", value: site.phoneDisplay, href: site.phoneHref },
    { icon: MessageCircle, label: "WhatsApp", value: "Message us", href: site.whatsappHref, external: true },
    { icon: Mail, label: "Email", value: site.email, href: site.emailHref },
  ];

  return (
    <section id="location" aria-labelledby="location-title" className="sec border-t hair bg-charcoal">
      <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
        {/* text + details */}
        <div className="flex flex-col lg:col-span-4">
          <div data-reveal="fade" className="eyebrow"><span data-draw aria-hidden="true" className="h-px w-14 bg-copper/60" />Find us</div>
          <h2 id="location-title" data-reveal="up" className="h-lg mt-6">Where we <em>work.</em></h2>
          <p data-reveal="up" data-delay="0.1" className="body-copy mt-5">
            {location.precise
              ? "Visit us, or let us come to you — we also coordinate shoots, studios and venues on location."
              : "We coordinate shoots, studios and event venues on location. Share your city in your request and we’ll plan the production around it."}
          </p>
          <ul data-stagger="up" data-gap="0.08" className="mt-9 border-t hair">
            {details.map((d) => (
              <li key={d.label} data-item>
                <a href={d.href} {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-4 border-b hair py-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-copper/45 text-accent transition group-hover:bg-copper group-hover:text-[var(--btn-solid-fg)]">
                    <d.icon size={16} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="field-label block !text-[.58rem]">{d.label}</span>
                    <span className="mt-0.5 block break-all text-[.95rem] text-cream transition group-hover:text-accent">{d.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div data-reveal="up" className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-8">
            <a href={location.mapsLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><span>Open in Google Maps</span><ArrowUpRight size={14} aria-hidden="true" /></a>
            <a href={bookHref({ preset: "location" })} data-book="" className="btn btn-solid"><span>Find Your Location</span></a>
          </div>
        </div>

        {/* map */}
        <div data-reveal="mask" className="relative lg:col-span-8">
          <div className="map-frame aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[520px]">
            <iframe
              src={location.embedUrl}
              title={`Map — ${site.name}, ${location.label}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-3">
            <i className="vf vf-tl" /><i className="vf vf-tr" /><i className="vf vf-bl" /><i className="vf vf-br" />
          </div>
          {/* location card */}
          <div className="force-dark absolute bottom-5 left-5 right-5 flex items-center gap-4 border hair bg-night/85 p-4 text-snow backdrop-blur-md sm:right-auto sm:max-w-[340px]">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center">
              <span aria-hidden="true" className="pin-pulse absolute inset-0 rounded-full bg-glow/40" />
              <span className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-[#e9a46d] to-[#c58a58] text-[#1a0f07]"><MapPin size={16} aria-hidden="true" /></span>
            </span>
            <span className="min-w-0">
              <span className="block text-[.66rem] font-semibold uppercase tracking-[.22em] text-glow">{site.name}</span>
              <span className="mt-1 block truncate text-[.85rem] text-snow/85">{location.address ?? location.label}</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
