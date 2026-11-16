import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Mail, MessageCircle, Phone } from "lucide-react";
import { assets } from "@/data/assets";
import { nav, site } from "@/data/content";
import { bookHref } from "@/lib/booking-presets";
import FooterSlate from "./FooterSlate";

const FbIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-1.56 19.88v-7.02H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.86h-2.33v7.02A10 10 0 0 0 12 2Z" /></svg>
);
const IgIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" /></svg>
);

/** WhatsApp is always available; Facebook/Instagram render only once verified URLs are configured (no dead icons). */
const socials = [
  { href: site.whatsappHref, label: "Badawy Productions on WhatsApp", icon: <MessageCircle size={16} aria-hidden="true" /> },
  { href: site.social.instagram, label: "Badawy Productions on Instagram", icon: <IgIcon /> },
  { href: site.social.facebook, label: "Badawy Productions on Facebook", icon: <FbIcon /> },
].filter((s): s is { href: string; label: string; icon: React.ReactElement } => !!s.href);

const iconBtn = "grid h-9 w-9 place-items-center rounded-full border border-copper/40 text-accent transition duration-300 hover:-translate-y-0.5 hover:border-copper-hi hover:bg-copper hover:text-[var(--btn-solid-fg)]";

/** One compact footer: brand · navigation · contact & social, with a slim meta line. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t hair bg-charcoal">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-copper/60 to-transparent" />
      <div className="wrap py-10 md:py-12">
        <div className="grid items-center gap-9 md:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-10">
          {/* brand */}
          <Link href="/" className="group flex items-center gap-4 justify-self-start" aria-label={`${site.name} — home`}>
            <Image src={assets.logo.src} alt="" width={assets.logo.width} height={assets.logo.height} sizes="60px" className="logo-mark h-auto w-[52px] transition duration-500 group-hover:scale-105" />
            <span className="leading-tight">
              <span className="block text-[15px] font-bold tracking-[.05em]">BADAWY PRODUCTIONS</span>
              <span className="mt-1 block text-[8px] tracking-[.3em] text-muted">PHOTOGRAPHY · MARKETING · EVENTS</span>
            </span>
          </Link>

          {/* nav */}
          <nav aria-label="Footer" className="md:order-last md:col-span-2 lg:order-none lg:col-span-1">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-1 text-[11px] font-medium uppercase tracking-[.16em] text-cream/80 lg:justify-center">
              {nav.map((n) => (
                <li key={n.href}><Link href={n.href} className="navlink inline-block hover:text-accent">{n.label}</Link></li>
              ))}
              <li>
                <a href={bookHref({ preset: "shoot" })} data-book="" className="inline-flex items-center gap-1.5 py-2 text-accent transition hover:text-copper-hi">
                  <CalendarDays size={13} aria-hidden="true" />Book
                </a>
              </li>
            </ul>
          </nav>

          {/* contact + social */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:justify-self-end">
            <div className="space-y-1.5 text-[13px] md:text-right">
              <a href={site.phoneHref} className="flex items-center gap-2.5 text-cream/85 transition hover:text-accent md:justify-end">
                <Phone size={14} className="text-accent" aria-hidden="true" />{site.phoneDisplay}
              </a>
              <a href={site.emailHref} className="flex items-center gap-2.5 break-all text-cream/85 transition hover:text-accent md:justify-end">
                <Mail size={14} className="shrink-0 text-accent" aria-hidden="true" />{site.email}
              </a>
            </div>
            <span aria-hidden="true" className="hidden h-10 w-px bg-copper/25 sm:block" />
            <ul className="flex gap-2.5" aria-label="Social and messaging">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={iconBtn}>{s.icon}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t hair pb-14 pt-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between sm:pb-0 sm:pr-16 md:pr-20">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="hidden tracking-[.12em] xl:block">Photography · Filming · Conferences · Venues · Locations</p>
          <FooterSlate />
        </div>
      </div>
    </footer>
  );
}
