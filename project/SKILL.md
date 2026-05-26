---
name: ringana-design
description: Use this skill to generate well-branded interfaces and assets for RINGANA — the Austrian fresh-cosmetics and supplements brand — either for production or throwaway prototypes / mocks / decks. Contains essential design guidelines, color tokens, typography (with substitution notes for the real Maax + Plaza fonts), the FRESH product line vocabulary, voice & tone rules, iconography guidance, and a complete web UI kit (header, hero, product grid, product detail, philosophy band, newsletter, footer, cart drawer, email-newsletter mock).
user-invocable: true
---

# RINGANA design skill

Read `README.md` first — it contains the company overview, the source-material caveats, full **content fundamentals** (voice, casing, vocabulary, example copy), **visual foundations** (colors, type, spacing, motion, hover/press, shadows, radii, imagery), and **iconography** notes.

Then explore the other files:

| File / folder | What it gives you |
|---|---|
| `colors_and_type.css` | All CSS custom properties — color tokens, type stack, spacing, radii, shadows, motion. Import this at the top of any new HTML/CSS file. |
| `preview/` | One-concept-per-card mini HTML files: every color group, type recipe, spacing/radii/shadow scale, all component states. Lift styles or just look. |
| `ui_kits/web/` | Working interactive recreation of `ringana.com` + a newsletter mock. JSX components for `Header`, `Hero`, `StoryStrip`, `FeaturedGrid`, `Philosophy`, `NewsletterBand`, `Footer`, `ProductDetail`, `CartDrawer`, `EmailScreen`. Import patterns from here when building new RINGANA surfaces. |
| `fonts/README.md` | Substitution recipe for the real Maax + Plaza fonts (commercial). DM Sans is the current free stand-in for Maax. |
| `assets/README.md` | What real brand assets to drop in (logo SVG, certification marks, photography). |

## When the user asks you to make something

If you are creating **visual artifacts** (slides, mocks, throwaway prototypes, newsletters, posters):
1. Copy `colors_and_type.css` and the relevant icons / placeholder assets out of this skill.
2. Build a static HTML file the user can open in a browser.
3. Reuse component patterns from `ui_kits/web/` rather than reinventing them.

If you are working on **production code**:
1. Lift the CSS custom properties into the project's design tokens.
2. Quote the relevant rule from `README.md` (voice, layout, motion) when proposing copy or interaction.
3. Flag the font/logo substitutions so the team knows what to swap once Maax + Plaza files arrive.

If the user invokes this skill with **no other guidance**, ask:
- What surface are we designing? (web hero, product page, newsletter, slide deck, social post?)
- German or English copy?
- Which campaign / product line? (FRESH cosmetics, FRESH baby, CAPS, PACKS, DRINKS) — this dictates the accent color.
- Single option or several variations to compare?

Then act as an expert RINGANA designer: minimal, photo-typographic, off-black CTAs, one accent per moment, calm voice, no emoji, no exclamation marks.

## Non-negotiables

- **Off-black `#1A1A1A` is the primary CTA color**, not green. Green is a *story* color.
- **Product line names are ALL CAPS** (`RINGANA`, `FRESH`, `CAPS`, `PACKS`, `DRINKS`); product names within them are lower-case (`FRESH eye serum`). Never title-case.
- **No emoji in customer-facing copy. No exclamation marks** (one per long newsletter at most).
- **Sentence-case headlines, German formal Sie-form** by default.
- **One accent color per moment** — never mix two campaign palettes on the same surface.
- **Hairline borders (`#E8E7E3`) before drop shadows.** Cards lift with `shadow-md` only on hover.
