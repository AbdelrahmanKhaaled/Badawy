# QA Report
Verified with real Chrome (playwright-core) against `next start`:
- `tsc`, `eslint`, `next build`: pass.
- Desktop 1440 full-page screenshot compared with the reference: section order/proportions/typography match closely. Mobile 390, tablet 768 and 1024 screenshots reviewed: no horizontal overflow (scrollWidth == viewport at 390/768/1024/1440).
- Preloader frames captured from a fresh session (aperture/logo/wordmark/iris → hero); scroll locked during preload and restored; reload in same session skips it.
- Functional: lightbox (open, arrows, Esc), testimonial carousel, anchors + active nav, mobile menu open/close, reduced-motion fallback (all content visible, preloader off). No console errors.

Not done / limits: 1920/1280/430/375 widths and Lighthouse were not measured; touch behavior not tested on a real device; hero REC pulse is aligned only at md+ (native image aspect).

## Content needing client sign-off
Stats (500+/200+/15+/50M+), testimonials (Ahmed Fathy + 2 placeholders), client logos, "Why choose us" copy, and the founder name/title (taken from the mockup) are flagged as demo/unverified in `src/data/content.ts`; on-page "demo" tags disappear with `NEXT_PUBLIC_SHOW_DEMO_LABELS=false`. Facebook/Instagram URLs are `null` (icons are non-interactive until real URLs are added). Phone shown as +20 111 966 6345 = 01119666345.
"More about us" scrolls to Why Choose Us and "View all projects" opens the lightbox because no extra pages exist.

## v2 — creative redesign + dark/light theme (verified vs not)
Verified in real Chrome (Playwright, production build): full-page screenshots in both themes at 1440 and 390; no horizontal overflow at 1440/390; zero console errors; default theme = dark; toggle switches theme, writes localStorage and body background; theme survives reload (`data-theme` already correct at DOMContentLoaded); `tsc`, `eslint`, `next build` pass.
NOT verified: widths 1920/1280/430/375/768/1024 after the redesign; frame-by-frame proof that no flash occurs (only the attribute timing was checked); measured WCAG contrast ratios (colours follow the supplied palette but were judged by eye); hover states and scroll-animation timing after the redesign; the preloader in light mode (it is intentionally always dark); Lighthouse; real touch devices.
Known compromises: Testimonial/stat/client/founder content is still demo (see earlier list). "More About Us" still scrolls to Why Choose Us.

## v3 — container system, hero height, redesigned Why / Testimonials / Final CTA
- Global container: `.site-container` / `.wrap` = `calc(100% - 40px)` (<768), `calc(100% - 64px)` (768–1279), `calc(100% - 48px)` (≥1280), max 1280px. Measured: every `.wrap` on the page shares one left edge at 1440 (80px), 1280 (24px), 1024/768 (32px), 430/375 (20px).
- Hero: 850px at ≥1024; `max(700px, 100svh-84px)` on tablet; `max(600px, 100svh-84px)` on mobile. Image is right-anchored on md+ so the baked-in HUD stays in frame; the REC pulse is positioned in container-query units.
- Why Choose Us: framed 4:5 crop of the camera photo (served at full resolution via `sizes`), decorative REC/4K HUD, rotating seal, hairline 2×2 feature grid with hover line-draw.
- Testimonials: header with counter + arrows, speaker panel (monogram with rotating dashed ring) + large serif quote, index tabs with an 8s autoplay progress bar (pauses on hover/focus; off with reduced motion; aria-live only while paused).
- Final CTA: letterbox bars that settle on scroll (GSAP scrub), running timecode (rAF, only while in view, off with reduced motion), image zoom-out, rotating orb CTA (magnetic) + direct phone/email. Intentionally dark in both themes.
- Verified (production build, real Chrome): both themes at 1440/1280/1024/768/430/375 — no horizontal scroll, no console errors; section screenshots of the 3 redesigned sections reviewed at 1440, 1024, 375. Fixed during QA: blurry Why image (wrong `sizes`), `.ring` class colliding with Tailwind's `ring` utility, clipped quote glyph.
- Not verified: the final seal nudge at 375 (class-only change, rebuilt but not re-screenshotted); hover states by eye; Lighthouse; real devices.

## v4 — agency repositioning, Hero restore, booking system
**Hero restore.** The project is not a git repository and VS Code/Cursor local history held no copies of these files, so the approved Hero was recovered from the Next.js webpack cache (`.next/cache/webpack`, packs built before Hero.tsx was rewritten at 16:47). The last pre-rewrite build (theme-aware v2: `md:aspect-[2023/777]`, image centered, REC pulse at 94.4%/13.8%, content inset 8.4%, h1 `clamp(2.7rem,4.5vw,5.6rem)`, scroll cue, original GSAP timeline) was transcribed 1:1. An automated diff of the new production chunk against the recovered chunk shows every class/style string and GSAP value identical; the only differences are the eyebrow, the description and the CTA target (`/portfolio`). The new copy was chosen to wrap exactly like the approved copy at every width (measured at 390–1920). Backups: `docs/backups/`. The v3-only `.hero-stage` CSS was removed.
**Agency positioning.** Copy across Hero (minimal), new capability bar, About, Services (two families with distinct layouts), Featured Works, Why Choose Us, Testimonials, Final CTA, header/footer and metadata.
**Pages.** `/about`, `/services`, `/services/[slug]` (11, static), `/portfolio`, `/contact`, `/book`, custom 404. Chrome (header/footer/cursor/motion/booking) moved to the root layout; the preloader runs on the homepage only; MotionProvider re-scans on route change.
**Booking.** Shared schema/validation in `src/lib/booking.ts`; 3-step form (`BookingForm`) in a global modal (`BookingProvider`) and inline on `/book` and `/contact`. Every booking CTA is a real `/book?type=…&service=…` link (works without JS). `/api/booking` validates server-side, dedupes by idempotency key, rate-limits, has a honeypot, and delivers to `BOOKING_WEBHOOK_URL` and/or Resend email (see `.env.example`). It answers 503 `not_configured` when nothing is configured; the form never shows success unless a handler accepted the request, and always offers email/WhatsApp/phone fallbacks with the data kept.
**Verified:** `tsc`, `eslint`, `next build` pass; 84/84 browser checks pass (see `INTERACTION_AUDIT.md`), including both themes at 390/768/1024/1440 with no horizontal overflow and zero console errors.
**Not verified:** real devices, Lighthouse, screen readers, live Resend sending.

## v5 — inner-page banners, contact map, compact footer
- `PageHeader` is now a full-bleed cinematic banner (always dark via the `.banner` token scope, slow zoom-in + scroll parallax, viewfinder/REC HUD, slate label). Images: About = camera-on-slider (mirrored), Services = conference stage, Portfolio = wedding, Contact = mountain sunset; service detail pages use their own image.
- Supporting imagery: About (image capability cards, framed image beside "Who we work with", cinematic "How we work" band), Services (framed image beside "How booking works"), Portfolio (image CTA band), Contact (crew image card).
- Contact map section (`LocationMap`): configurable via `NEXT_PUBLIC_MAP_EMBED_URL` / `NEXT_PUBLIC_MAP_LAT`+`LNG` / `NEXT_PUBLIC_MAP_QUERY`, plus `NEXT_PUBLIC_LOCATION_LABEL` / `NEXT_PUBLIC_LOCATION_ADDRESS`. No address was supplied, so it defaults to a country-level map of Egypt and shows no street address. Theme-tinted map (filters per theme).
- Footer: one compact block (brand · nav · contact + WhatsApp/social) with a slim meta line. Heights: 217px @1440, 302px @768, 484px @390. Facebook/Instagram icons appear only when their env URLs are set.
- Verified: tsc, eslint, build; 94/94 browser checks (both themes, 390/768/1024/1440, no overflow, no console errors); banner/map/footer screenshots reviewed in both themes.
