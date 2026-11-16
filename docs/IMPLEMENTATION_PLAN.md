# Implementation Plan
Stack: Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind v4 · GSAP + ScrollTrigger · Motion for React · lucide-react.

1. Analysis: reference `images/Badawy Productions_ design.png` (887×1774) is the blueprint; section order and proportions were measured from it (hero 245→400px at 1440 etc.).
2. Foundation: tokens in `globals.css`, fonts via `next/font` (Playfair Display, Inter, Great Vibes), `src/data/assets.ts` + `content.ts`.
3. Visual build: 10 sections + header/footer in `src/components`.
4. Motion: preloader, hero timeline, declarative `MotionProvider` (data attributes), counters, carousel, mobile menu.
5. QA: see `QA_REPORT.md`.

Run: `npm install && npm run dev` · build: `npm run build`.
