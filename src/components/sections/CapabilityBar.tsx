import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Icon, { type IconName } from "@/components/ui/Icon";

/** Directly under the hero: the five things the agency coordinates, each a real link. Answers "what do they do?" in seconds. */
const items: { label: string; sub: string; href: string; icon: IconName }[] = [
  { label: "Photography", sub: "Commercial · Portrait · Wedding", href: "/services/commercial-photography", icon: "camera" },
  { label: "Filming", sub: "Brand films · Events · Social", href: "/services/videography-filmmaking", icon: "clapper" },
  { label: "Conferences & Events", sub: "Booking · Production · Coverage", href: "/services/conference-booking", icon: "presentation" },
  { label: "Event Halls", sub: "Weddings · Galas · Launches", href: "/services/event-hall-booking", icon: "building" },
  { label: "Studios & Locations", sub: "Indoor · Outdoor · Studio", href: "/services/shooting-locations", icon: "map" },
];

export default function CapabilityBar() {
  return (
    <section aria-label="What we coordinate" className="relative border-b hair bg-charcoal">
      <div className="wrap">
        <ul data-stagger="up" data-gap="0.08" className="-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
          {items.map((it, i) => (
            <li key={it.label} data-item className={`min-w-[62%] shrink-0 snap-start sm:min-w-[40%] md:min-w-0 ${i > 0 ? "border-l hair" : ""}`}>
              <Link href={it.href} className="group flex h-full flex-col gap-3 px-5 py-7 transition-colors duration-500 hover:bg-[color-mix(in_srgb,var(--c-copper)_7%,transparent)] md:px-6 lg:py-8">
                <span className="flex items-center justify-between">
                  <Icon name={it.icon} size={24} className="text-accent transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]" />
                  <ArrowUpRight size={15} aria-hidden="true" className="text-accent opacity-0 transition duration-500 group-hover:opacity-100" />
                </span>
                <span className="text-[.74rem] font-semibold uppercase tracking-[.18em] text-cream">{it.label}</span>
                <span className="text-[.74rem] text-muted">{it.sub}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
