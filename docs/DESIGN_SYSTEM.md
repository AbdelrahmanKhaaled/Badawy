# Design System
Colors (`globals.css @theme`): ink #0B0B0B, charcoal #151515, surface #1E1E1E, copper #C98A55, copper-hi #E29A63, cream #F5F0EA, muted #A7A29E; headline copper #D98C4F.
Type: Playfair Display (headings, uppercase, italic for highlights) · Inter (UI/body, wide tracking labels) · Great Vibes (signature accents only).
Buttons: `.btn-solid` / `.btn-outline` with light sweep + arrow shift + magnetic wrapper. Cards: `.card` (lift, copper border, sweep).
Layout: `.wrap` container, hairline copper section dividers (`.hair`), fluid `clamp()` type.

## Theming (v2)
- Tokens are CSS variables on `<html data-theme="dark|light">` (see top of `src/app/globals.css`). Tailwind colors `ink / charcoal / surface / raised / cream / muted / copper / copper-hi / accent` resolve to them, so components flip automatically.
- Fixed (non-themed) tokens for text that sits on photography: `snow`, `night`, `glow`. Hero, mosaic captions, Featured Works captions, the statistics band and the preloader stay dark in both themes on purpose.
- Boot script in `layout.tsx` sets `data-theme` before first paint (localStorage `badawy-theme`; dark default; set `NEXT_PUBLIC_THEME_FOLLOW_SYSTEM=true` to honour the OS preference when nothing is saved).
- `ThemeToggle` (header + mobile menu) writes the attribute and storage; icons crossfade/rotate via CSS only, so SSR and first paint always match.
- Logo (white on transparent) is darkened in light mode with `.logo-mark`; client logos use `--client-filter`.
- Spacing: `.sec` (80–170px), `.sec-sm`; editorial type: `.h-xl`, `.h-lg`, `.eyebrow`, `.body-copy`; ornaments: `.vf` viewfinder corners, `.ghost-num`, `.scroll-cue`.
