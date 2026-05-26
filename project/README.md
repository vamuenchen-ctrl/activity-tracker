# RINGANA Design System

A reusable design kit for prototyping and producing branded interfaces, slides, and marketing material that look and feel like **RINGANA** — the Austrian fresh-cosmetics and supplements brand.

> ⚠️ **About the source material.** This system was built from one uploaded artefact (`uploads/ringana-komplette-farbpalette.html` — a pixel analysis of RINGANA's website + 2 newsletters, dated 12.02.2026) plus public sources for the typography and brand identity (Fonts In Use, moodley's case study, press coverage). Typography is now anchored to the *real* brand fonts (Maax + Plaza per Fonts In Use) using free substitutes; iconography, photography, and the wordmark are still placeholders. All substitutions are flagged inline.

---

## Company at a glance

**RINGANA** (founded 1996 in St. Johann in der Haide, Austria) produces *fresh* cosmetics, supplements, and energy drinks. The proposition is in the name: products are made in small batches, contain no synthetic preservatives, microplastics, mineral oils or nanoparticles, and carry a real expiry date because the active ingredients lose efficacy quickly. The brand was repositioned by agency **moodley** (Graz) starting 2013 around the word **FRESH** — staged at every touchpoint (campaigns, photography, storytelling, packaging, even a custom "Sound of Freshness"). Visual language is reductionist, white-dominant, with a confident off-black for type and CTAs, and a *thematic* accent palette that swaps by product line.

### Products represented in this kit

This kit treats **the marketing website (ringana.com)** + **email newsletters** as a single surface (they share a color/type system), and ships one UI kit covering it. There is no app, no docs site, no design system file to mirror.

- `ui_kits/web/` — homepage hero, product card, product detail, FRESH-philosophy section, newsletter signup, email-newsletter layout.

### Sources

| Source | Path / link | What we got |
|---|---|---|
| Color analysis (uploaded) | `uploads/ringana-komplette-farbpalette.html` | 13 hex colors with usage notes from web + newsletter |
| Brand strategy | https://moodley.com/en/work/ringana-branding | Brand positioning, "reduced language of form" |
| Live site | https://www.ringana.com/ | (JS-rendered; not directly inspectable from automation) |
| Press / reviews | tracykiss.com, ankhamagazine.com, packthepjs.com | Product naming, tone, claims, FRESH terminology |

> If you have access to the actual RINGANA brand book, font files, logo SVG, or Figma library, drop them into this project and most of the flagged substitutions in this kit can be tightened up significantly.

---

## CONTENT FUNDAMENTALS

The brand voice is **calm, factual, sensorial and quietly confident** — never breathless, never salesy, never cute. Closer to a high-end German pharmacy or a Scandinavian sustainability report than to a typical beauty brand. It earns trust by *under-claiming* and letting ingredient names and certifications do the talking.

### Tone

- **Sober, declarative, slightly clinical.** Headlines read like statements of fact, not exclamations. "Schlaf dich schön." "Spot the difference." (Newsletter banner). No exclamation marks in product copy; rarely more than one short sentence in a hero.
- **Bilingual-native.** German is primary (Austrian standard), English is fully supported with a `?lang=en` switch. Both languages carry the same restrained tone.
- **Sensorial > technical when describing products** ("frisch", "samtig", "leicht", "kühlend") but **scientific when describing efficacy** ("hochkonzentrierte Antioxidantien", "dermatologisch getestet", "COSMOS-zertifiziert").

### Person & address

- **You-form, formal.** German copy uses the polite **Sie** ("Ihre Haut", "schenken Sie"). English uses an implied "you" that mirrors the formality.
- The brand speaks in **first-person plural** ("wir", "we") when telling its own story, especially around sustainability decisions ("Wir verzichten auf…").

### Casing

- **Product line names are all-caps**: `RINGANA`, `FRESH`, `FRESH baby`, `CAPS`, `PACKS`, `DRINKS`. Always.
- **Product names themselves are lowercase** following the line name: `FRESH tonic pure`, `FRESH hydro pure`, `FRESH cleansing water`, `FRESH scrub`. The mixed casing *is* the brand mark — never title-case it.
- **Sentence-case** for headlines and body. Title Case is not used.
- **Section labels in UI use uppercase + tracking** ("KOLLEKTION", "ZUTATEN", "NACHHALTIGKEIT").

### Vocabulary

| ✅ Use | ❌ Avoid |
|---|---|
| frisch, Frische, fresh | "new", "innovative", "cutting-edge" |
| Wirkstoff(e), active ingredients | "magic", "miracle", "secret" |
| nachhaltig, verantwortungsvoll | "eco-friendly" (too generic) |
| vegan, mikroplastikfrei, parabenfrei | vague "natural" |
| Konzentrat, Serum, Pflege | "treatment", "formula", "elixir" |
| handgefertigt in Österreich | "luxury", "exclusive", "premium" (let the design carry these) |

### Examples (paraphrased from observed materials)

> **Hero — Valentine's Day banner**
> *Valentine's friends set.* — Short, no verb, no period. The set name *is* the headline.

> **Hero — sleep / night care**
> *Schlaf dich schön.* — Three words. Imperative. Lower-case sentence-case.

> **Product card**
> *FRESH hydro pure* / Feuchtigkeitsserum / 30 ml / 49,90 €
> One line per piece of information. No marketing line on the card itself.

> **Sustainability**
> *Made in Austria mit 100 % erneuerbarer Energie. Verpackt in 100 % recyclebarem Glas.*
> Numbers carry the weight; no adjective inflation.

### Emoji & exclamation policy

- **No emoji in customer-facing copy.** Newsletters and product pages do not use them. (The internal analysis document we were given uses them as section icons — that is *not* a brand pattern; do not mirror it.)
- **Exclamation marks are rare** — at most one per long-form newsletter, never in product copy.
- **Em-dashes and decorative typographic flourishes** (· bullets, soft hyphens) are welcome and feel "European editorial".

---

## VISUAL FOUNDATIONS

### Core motifs

1. **White-dominant canvas.** The page is mostly `#FFFFFF`. Color is rationed and earns its keep.
2. **One accent per moment.** Each campaign / product line gets a *single* thematic background color (rose for lip care, navy for night care, peach for skin perfection). They do not mix on the same surface.
3. **Off-black, not pure black.** Body text and CTAs are `#1A1A1A`, never `#000`. This keeps the page warm against the off-white.
4. **Hairline borders > drop shadows.** Cards and inputs separate from the page with a 1px `#E8E7E3` line first; shadow is reserved for hover lift.
5. **Quiet typography.** Large serif for moments of stillness; clean sans for everything else. No display fonts, no swashes, no condensed sans, no script.

### Color

- **13 brand hexes** captured in `colors_and_type.css` and previewed in `preview/colors-*.html`. Grouped:
  - *Neutrals* (5) — the foundation: `#FFFFFF`, `#F5F5F3`, `#EEEEEE`, `#F4EFEE`, `#1A1A1A`.
  - *Green family* (3) — the brand color: olive `#677E3D` (website), strong mint `#6ACCB2` (newsletter), soft mint `#D2F0E8` (info boxes). The website and newsletter use *different greens* on purpose.
  - *Rose / berry* (4) — beauty, Valentine's, lip care.
  - *Warm earth* (2) — beige `#E5DAD1`, peach `#FEE8C4` for skincare bodies.
  - *Navy* (1) — night care only.
- **Primary CTA color is the off-black.** Green is not the action color; it is a *story* color.
- All colors are gently desaturated and warm; no neon, no pure jewel tones, no fluorescents.

### Typography

Per **[Fonts In Use](https://fontsinuse.com/uses/27087/ringana)** (moodley brand identity), RINGANA's real type system is:

- **Body + headlines + packaging:** **Maax** (Damien Gautier, 205TF) — a low-contrast geometric humanist sans, similar in proportion to Inter / DM Sans but with a quieter, more European personality.
- **Logo / wordmark:** **Plaza** (ITC) — a narrow Art Deco display, used ONLY for the wordmark.
- **No paired serif.** The "reduced language of form" moodley defined for the brand uses *one* sans across everything, differentiating display from body only through size and weight. Resist the urge to bolt on a serif unless a specific editorial moment demands it.

**Substitutions in this kit** (both real fonts are licensed and can't ship here):

- `--font-sans` and `--font-display` → **DM Sans** (300 / 400 / 500 / 600 / 700) via Google Fonts. Closest free match to Maax — same low-contrast geometric humanist sans, similar x-height, similar warmth. Holds up at 12px UI and 56px display.
- `--font-editorial` → **Instrument Serif** (kept available but unused by default — the brand doesn't pair a serif).
- The wordmark uses **DM Sans Medium**, all caps, tracked `0.16em`, as a typographic placeholder for Plaza. Replace with the real `assets/logo.svg` as soon as it's available — Plaza is a *logo* typeface, not a UI one.

When the real Maax + Plaza files arrive, swap them in `colors_and_type.css` (one edit, two variables) and the whole system updates. See `fonts/README.md` for the swap recipe.

### Spacing & rhythm

- 4px base unit; primary spacing scale `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 96`.
- Generous outer padding on sections (`64–96px` desktop top/bottom).
- Card padding `24–32px`. Form fields `12–16px` vertical.
- Body content max-width ~`720px` for reading, `1120px` for product grids, `1440px` for full-bleed marketing.

### Backgrounds

- **Mostly flat white**, with occasional full-bleed color sections (`#F5F5F3`, `#E5DAD1`, etc.).
- **Product photography is heavily art-directed**: a single SKU on a flat color ground (one of the palette colors), shot from slightly above, with a soft shadow.
- **No gradients** in the brand. The one exception is *protection gradients* under text on a photographic hero — a top-down soft black `rgba(0,0,0,0.15→0)` to keep type legible.
- **No repeating patterns / textures / hand-drawn illustrations.** The brand is photographic + typographic.

### Animation

- **Subtle and quick.** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint) for entrances, `220ms` default.
- **Fades and small Y-translations only.** No bounces, no springs, no rotates.
- **Image hover:** slow `400ms` scale to `1.03`, no overlay change.
- **No looping background animation, no parallax, no autoplay video** at high volume.

### Hover / press states

- **Buttons (primary):** background `#1A1A1A → #000000`, no scale change.
- **Buttons (secondary, outline):** border + text invert to fill on hover (`bg: #1A1A1A`, `color: #FFF`).
- **Links:** `#1A1A1A`, gain a 1px underline on hover; no color change.
- **Cards:** lift `translateY(-3px)` + shadow `--shadow-sm → --shadow-md`. Inner contents do not move.
- **Press:** scale `0.98`, `100ms`. Used on primary buttons only; secondary buttons just darken.

### Borders

- Default `1px solid #E8E7E3` for cards, inputs, dividers.
- `1px solid #D6D5D1` for emphasis (table headers, focused fields outside their ring).
- Inverted surfaces use `1px solid rgba(255,255,255,0.18)`.

### Shadows

- 4 levels, all warm-grey, low spread:
  - `xs` for chips/badges: `0 1px 2px rgba(26,26,26,0.04)`
  - `sm` for resting cards: `0 1px 8px rgba(26,26,26,0.04)`
  - `md` for hover lift: `0 6px 20px rgba(26,26,26,0.06)`
  - `lg` for floating popovers: `0 18px 48px rgba(26,26,26,0.10)`
- *No* inner shadows, *no* colored shadows, *no* glow.

### Corner radii

- Small and considered:
  - Inputs / buttons: **8 px** (`--radius-md`)
  - Cards / images: **12 px** (`--radius-lg`)
  - Pills (filters, tags): **999 px** (`--radius-pill`)
- Never use radii larger than `16px` except for pills.

### Transparency & blur

- **Sparingly.** The hex pill on a color swatch uses `rgba(255,255,255,0.8)` + `backdrop-filter: blur(4px)` — that pattern is the *only* place blur appears in observed materials.
- Sticky navigation when scrolled uses `rgba(255,255,255,0.92)` + a 16px backdrop blur and a hairline bottom border.

### Imagery character

- **Warm, naturally lit, low-contrast.** No b&w, no heavy grain, no filters.
- **Color-tinted backgrounds**, but the *product itself* is shot true-to-life.
- Models are shown in candid skincare moments — never posed-glossy.
- Botanical / ingredient still lifes (single sprig of green, droplet of serum) appear as supporting imagery.

### Layout rules

- **Sticky top nav**, ~72px tall, flush left-right, logo centered or far-left.
- **Generous vertical rhythm** between sections (`80–120px`).
- **Strict 12-column grid** at desktop, 4-column at tablet, 1-column mobile.
- **Full-bleed color blocks** are common for "moments" (one campaign, one story per block).
- **One CTA per section** — the brand resists CTA pile-ups.

---

## ICONOGRAPHY

RINGANA is a *low-iconography* brand. Reviews of `ringana.com` show a small, utilitarian set:

- **Top nav:** search (magnifier), account (person), shopping bag (bag), language switch (globe or two-letter code).
- **Trust badges:** vegan leaf, COSMOS organic mark, climate-neutral mark, "made in Austria" mark — these are *certification logos*, not icons we control.
- **Product list filters:** plain checkboxes + caret chevrons. No fancy icons.
- **Hero / section illustrations:** none. The brand uses *photography* where most brands would reach for an icon set.

### Our approach in this kit

- **Stroke icon set, ~1.5 px stroke, rounded line caps, 24px nominal grid.** This matches the feel of the live site.
- **Substitution flagged:** because we do not have access to RINGANA's actual icon SVGs, this kit uses **[Lucide](https://lucide.dev/) icons** via CDN. Lucide's geometry (1.5 px stroke, round caps, geometric proportions) is the closest open-source match to the icons observed on `ringana.com`. If/when you supply the real icon set, swap the `<i data-lucide=…>` calls for inline SVG from the brand kit.
- **No emoji**, no Unicode-character icons (✦, ✓ etc.) outside of the certification marks listed above.
- **No icon font** — Lucide is loaded as inline SVG.

### Logo

- **Wordmark only.** "RINGANA" set in a clean medium-weight sans, all caps, generous letter-spacing. No mark, no monogram.
- **Color:** `#1A1A1A` on light backgrounds, `#FFFFFF` on dark/color backgrounds. Never tinted, never gradient.
- We **do not have the official RINGANA wordmark SVG**. The kit renders the wordmark as live text styled with `.r-wordmark` so it can be globally retypeset when the real logo arrives.

---

## INDEX (manifest)

### Root

- `README.md` — this file.
- `colors_and_type.css` — all CSS custom properties + type recipes. Import this anywhere.
- `SKILL.md` — Claude Skill / Agent Skill front-matter; this whole folder is portable.

### Folders

- `assets/` — logos, certification badges, photography. Currently a placeholder folder; see `assets/README.md` for what to drop in.
- `fonts/` — webfont sources. Currently using **DM Sans** + Instrument Serif (fallback) via Google Fonts CDN. See `fonts/README.md` for the swap recipe to the real Maax + Plaza.
- `preview/` — 24 small HTML cards that populate the project's Design System tab. Grouped:
  - **Colors:** `colors-palette-bar`, `colors-neutrals`, `colors-green-family`, `colors-rose-family`, `colors-warm`, `colors-navy`, `colors-semantic`
  - **Type:** `type-display`, `type-body`, `type-labels`, `voice-tone`
  - **Spacing:** `spacing-scale`, `radii`, `shadows`, `motion`
  - **Components:** `buttons-primary`, `buttons-secondary`, `form-inputs`, `product-card`, `badges`, `newsletter-signup`, `hero-composition`
  - **Brand:** `wordmark`, `icons`
- `ui_kits/web/` — the single product surface (marketing site + newsletter), recreated as a clickable React prototype. See `ui_kits/web/README.md`.

### Uploads (reference only — do not edit)

- `uploads/ringana-komplette-farbpalette.html` — the original color analysis document.

---

## CAVEATS (real talk)

1. **No real font files.** RINGANA uses **Maax** (Damien Gautier, 205TF) for everything and **Plaza** (ITC) for the wordmark — both commercial. DM Sans is the closest free substitute for Maax and is what the kit uses today; the wordmark is live text styled as tracked DM Sans Medium until a real `assets/logo.svg` lands.
2. **No real logo.** The wordmark is live text. Drop `assets/logo.svg` and replace `.r-wordmark` spans + the `<Wordmark />` component.
3. **No icon set.** Lucide via CDN is the substitute — visually close to the live site, but not authentic.
4. **No app / no codebase.** Only the marketing surface is represented.
5. **Copywriting is inferred,** not lifted verbatim. The voice notes above are based on observed patterns in newsletters + press; the actual brand may have a stricter internal guide.
