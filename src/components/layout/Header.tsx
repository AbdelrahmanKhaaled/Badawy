"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { CalendarDays, Menu } from "lucide-react";
import { assets } from "@/data/assets";
import { nav, site } from "@/data/content";
import { useIntroReady } from "@/hooks/useIntroReady";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MobileMenu from "./MobileMenu";

export const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export default function Header() {
  const ref = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Entrance — starts as the preloader's iris opens (immediately on inner pages).
  useIntroReady(() => {
    const el = ref.current;
    if (!el || document.documentElement.classList.contains("no-anim")) return;
    const q = (s: string) => el.querySelectorAll(s);
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(q("[data-h-logo]"), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.9 })
      .fromTo(q("[data-h-link]"), { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.15)
      .fromTo(q("[data-h-cta]"), { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: "back.out(1.4)" }, 0.55);
  });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggle.current?.focus();
  }, []);

  return (
    <>
      <header
        ref={ref}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,backdrop-filter,border-color] duration-500 ${
          scrolled ? "border-copper/25 bg-ink/65 backdrop-blur-xl" : "hair bg-ink"
        }`}
      >
        <div className={`wrap flex items-center justify-between gap-6 transition-[height] duration-500 ${scrolled ? "h-[66px]" : "h-[84px]"}`}>
          <Link href="/" data-h-logo data-hero className="group flex items-center gap-3.5" aria-label={`${site.name} — home`}>
            <Image
              src={assets.logo.src}
              alt=""
              width={assets.logo.width}
              height={assets.logo.height}
              sizes="64px"
              className={`logo-mark h-auto transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_10px_rgba(226,154,99,.5)] ${scrolled ? "w-[46px]" : "w-[58px]"}`}
            />
            <span className="leading-none">
              <span className="block font-sans text-[15px] font-bold tracking-[.06em] text-cream">BADAWY</span>
              <span className="mt-0.5 block font-sans text-[15px] font-bold tracking-[.06em] text-cream">PRODUCTIONS</span>
              <span className="mt-1.5 block font-sans text-[7px] tracking-[.34em] text-muted">PHOTO · FILM · EVENTS</span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} data-h-link data-hero aria-current={isActive(pathname, n.href) ? "page" : undefined} className="navlink text-[11.5px] font-medium uppercase tracking-[.1em] text-cream/85">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <span aria-hidden="true" className="hidden h-9 w-px bg-copper/50 lg:block" />
            <div data-h-cta data-hero className="flex items-center gap-4">
              <ThemeToggle />
              <div className="hidden sm:block">
                <Button book={{ preset: "shoot" }} icon={<CalendarDays size={14} />} arrow={false} className="!px-5 !py-3">
                  Book a Shoot
                </Button>
              </div>
            </div>
            <button
              ref={toggle}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-11 w-11 place-items-center rounded-full border border-copper/50 text-copper-hi transition hover:bg-copper/15 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={close} pathname={pathname} />
    </>
  );
}
