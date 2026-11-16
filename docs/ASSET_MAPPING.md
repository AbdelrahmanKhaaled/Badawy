# Asset Mapping (originals in `/images` are untouched; copies in `/public/images`)
| Section | File |
|---|---|
| Logo (white on transparent) | `logo.png` ← badawy-logo-transparent-4200.png (`logo-dark.png` copied, unused: the site is dark-only) |
| Hero | `hero.png` ← Hero_section_bg.png — **already contains viewfinder corners + REC/4K/25FPS/CINE/LOG HUD; not duplicated** |
| Capturing Moments | `capture-1..4.png` (wedding, watch, portrait, event) |
| About | `about-us.png` |
| Featured Works | `work-1..4.png` (wedding, commercial, portraits, events) |
| Why Choose Us | `why-choose-us.png` ← why-choose-us_bg.png |
| Statistics | `figures.png` |
| Final CTA | `your-story.png` |
| Clients | `client-*.webp` (Coca-Cola, Samsung, Emirates, Vodafone, Uber; rendered white via CSS filter) |
All mappings live in `src/data/assets.ts`.
