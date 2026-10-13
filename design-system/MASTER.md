# IdeaBurst Flowers — Design System (Master)

**Direction:** Luxury editorial florist. Cream paper, deep-moss ink, rose and antique-gold accents. Spacious layouts, large serif headlines with italic accents, photography-led.

The source of truth for tokens is `src/app/globals.css` (`:root`). This file explains the reasoning.

## Color

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#F6F1E9` | Page background |
| `--paper` | `#FBF8F3` | Alternate sections, cards, drawer |
| `--ink` | `#1D2620` | Body text, headings (≈15:1 on cream) |
| `--ink-2` | `#4B564E` | Secondary text (≈6.7:1 on cream) |
| `--moss` / `--moss-deep` | `#2E4636` / `#1F3127` | Primary buttons, dark bands, announcement bar |
| `--rose` | `#8E3B46` | Italic accents, sale price, "Add to bag" CTA (≈7:1 on cream) |
| `--gold` / `--gold-ink` | `#B08345` / `#7E5524` | Decorative rules, stars / eyebrow text (gold-ink ≥ 4.5:1) |
| `--blush`, `--sage` | `#EDD9D0`, `#DCE3D6` | Soft tints, image placeholders |

Rules: never put body text in `--gold`; use `--gold-ink`. Light mode only — a florist's product photography is tuned for light surfaces.

## Typography

- **Display / headings:** Cormorant Garamond 400–600 (italic for emphasis in `<em>`), sizes via `clamp()` (`.display`, `.h1`–`.h4`).
- **Body / UI:** Inter, 16px base, line-height 1.6. Buttons and eyebrows are uppercase with 0.14–0.2em tracking.
- Loaded with `next/font` (self-hosted at build, no layout shift).

## Spacing & layout

Spacious density: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px. Section padding `clamp(72px, 10vw, 136px)`. Container max 1360px with a 16–48px gutter. Breakpoints: 640 / 768 / 900 / 1000 / 1080 / 1440.

## Components

Buttons (`.btn`, `-rose`, `-outline`, `-light`, `-ghost-light`; 52px min height), product card (4:5 image, badge, quick-add on hover devices only), category tiles (3×3 with a 2×2 feature on desktop), arch-framed hero image, accordion (`<details>`), cart drawer (focus-trapped dialog), forms (visible labels, inline errors, 52px inputs).

## Motion

- Scroll reveal: 700ms `cubic-bezier(0.22,1,0.36,1)`, 60–80ms stagger. Content stays visible without JS.
- Hover: 160–280ms. Image zoom 1–1.2s.
- `prefers-reduced-motion` disables all animation, including the marquee and badge spin.

## Accessibility checklist

- Text contrast ≥ 4.5:1, visible focus ring (2px moss), skip link.
- Touch targets ≥ 44px; no hover-only actions (quick-add is hidden on touch, the product page always has the full CTA).
- Icon-only buttons have `aria-label`; decorative SVGs are `aria-hidden`.
- Dialogs (menu, bag) use `aria-modal`, `inert` when closed, Escape to close.
- Forms: labels, `aria-invalid`, errors next to fields, live regions for results.

## Avoid

Emoji icons, neon/vibrant palettes, glassmorphism, more than one accent per component, body text under 14px.
