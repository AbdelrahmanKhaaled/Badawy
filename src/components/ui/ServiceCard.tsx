import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { serviceIcons, type Service } from "@/data/services";
import { bookHref } from "@/lib/booking-presets";
import Icon from "@/components/ui/Icon";

/** Service card with two real actions: open the detail page, or open the booking form for this service. */
export default function ServiceCard({ s, priority }: { s: Service; priority?: boolean }) {
  const href = `/services/${s.slug}`;
  return (
    <article data-item className="svc-card">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-night" tabIndex={-1} aria-hidden="true">
        <Image src={s.image.src} alt="" fill priority={priority} sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw" className="object-cover" style={{ objectPosition: s.image.position ?? "50% 50%" }} />
        <span className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
        <span className="absolute bottom-4 left-4 grid h-11 w-11 place-items-center rounded-full border border-snow/30 bg-night/40 text-glow backdrop-blur">
          <Icon name={serviceIcons[s.slug as keyof typeof serviceIcons]} size={19} />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-[1.45rem] font-medium leading-tight">
          <Link href={href} className="transition-colors hover:text-accent">{s.title}</Link>
        </h3>
        <p className="mt-3 flex-1 text-[.88rem] leading-relaxed text-muted">{s.short}</p>
        <div className="mt-6 flex items-center justify-between gap-3 border-t hair pt-5">
          <Link href={href} className="group inline-flex items-center gap-2 text-[.68rem] font-semibold uppercase tracking-[.18em] text-accent">
            Details <ArrowRight size={13} aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a href={bookHref({ service: s.book[0] })} data-book="" className="inline-flex items-center gap-2 rounded-full border border-copper/50 px-4 py-2 text-[.66rem] font-semibold uppercase tracking-[.16em] text-cream transition hover:border-copper-hi hover:bg-copper hover:text-[var(--btn-solid-fg)]">
            <CalendarDays size={13} aria-hidden="true" /> Book
          </a>
        </div>
      </div>
    </article>
  );
}
