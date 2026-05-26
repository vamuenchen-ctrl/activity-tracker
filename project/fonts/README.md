# Fonts

## ⚠️ Substitution flag — the real fonts are commercial

According to **[Fonts In Use](https://fontsinuse.com/uses/27087/ringana)**, RINGANA's identity (designed by moodley brand identity) uses:

| Slot | RINGANA's actual typeface | Foundry | License |
|---|---|---|---|
| Body, headlines, packaging | **Maax** | 205TF (Damien Gautier) | Commercial |
| Logo / wordmark | **Plaza** (ITC) | ITC | Commercial |

Neither is free or redistributable, so this kit ships **substitutes** loaded from Google Fonts:

| Slot | Substitute in this kit | Why this one |
|---|---|---|
| Body + headlines (`--font-sans`, `--font-display`) | **DM Sans** (300 / 400 / 500 / 600 / 700) | Closest open-source match to Maax — same low-contrast geometric humanist proportions, similar x-height, similar humanist warmth. Holds up at both 12 px UI and 56 px display sizes. |
| Wordmark | **DM Sans Medium, tracked 0.16em, all caps** | Not a true Plaza substitute (Plaza is a narrow Art Deco display, very specific). Use as a typographic placeholder only; drop the real logo SVG into `assets/logo.svg` as soon as it's available and stop relying on live text. |
| Optional editorial accent (`--font-editorial`) | **Instrument Serif** | Kept available for the rare slide/deck moment where a serif is wanted. The brand itself uses essentially zero serif type — leave this unused unless you need contrast. |
| Mono | system mono stack | Hex codes, prices, technical labels |

Both substitutes ship via the CDN `@import` in `colors_and_type.css`. No font files live in this folder.

## When you supply the real Maax + Plaza files

1. Drop the `.woff2` files into this folder (e.g. `fonts/Maax-Regular.woff2`, `fonts/Maax-Medium.woff2`, `fonts/Plaza.woff2`).
2. In `colors_and_type.css`, **remove** the Google Fonts `@import` line at the top.
3. **Add** `@font-face` blocks pointing at the local files.
4. **Update** the variables:
   ```css
   --font-sans:    'Maax', ui-sans-serif, system-ui, sans-serif;
   --font-display: 'Maax', ui-sans-serif, system-ui, sans-serif;
   ```
5. Replace the `.r-wordmark` spans (and any live-text wordmark in `ui_kits/web/`) with the real logo SVG — Plaza is a logo typeface, not a UI typeface.

Everything downstream (preview cards, UI kit, future slides) reads from these two CSS variables, so the swap is one edit.

## Why not pair a serif?

The uploaded analysis HTML paired Instrument Serif with Outfit — but that was the styling of the analysis document itself, not lifted from RINGANA's materials. moodley's design philosophy for the brand is *"reduced language of form"* — one sans, multiple weights and sizes. We mirror that: DM Sans does both display and body. `--font-editorial` exists for the rare exception (e.g. a quote slide), nothing more.
