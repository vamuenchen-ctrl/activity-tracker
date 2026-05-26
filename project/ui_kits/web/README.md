# RINGANA Web UI Kit

A high-fidelity, interactive recreation of the RINGANA marketing surface (ringana.com + email newsletters), built from the brand colors and visual language captured in `../../README.md` and `../../colors_and_type.css`.

This kit treats the website and the newsletter as a single surface — they share the same color system, type, voice, and component vocabulary. Pieces here can be lifted straight into prototypes that should "feel like" RINGANA.

## Files

| File | What it is |
|---|---|
| `index.html` | Entry point. Loads React + Babel + Lucide and the JSX files in order. **Open this.** |
| `kit.css`    | Local stylesheet on top of `colors_and_type.css` — buttons, cards, layout, drawer, etc. |
| `components.jsx` | Tiny primitives: `Icon`, `Wordmark`, `Button`, `Pill`, `SectionHead`, `ProductImage`. |
| `sections.jsx`   | Marketing sections: `Header`, `Hero`, `StoryStrip`, `FeaturedGrid` (+ `FEATURED` product list), `Philosophy`, `NewsletterBand`, `Footer`. |
| `screens.jsx`    | Full screens: `HomeScreen`, `ProductDetail`, `CartDrawer`, `EmailScreen` (newsletter mock). |
| `app.jsx`        | `<App />` with in-memory routing and cart state. |

## Interactive demo flow

`index.html` boots into the home screen and supports a real click-through:

1. **Home** — sticky nav, full-bleed beige hero ("Wach werden, ohne Worte."), 4-up story strip in palette colors, 8-up product grid, philosophy section, newsletter signup, full footer.
2. **Click any product** → routes to a **Product Detail** screen with gallery thumbs, qty stepper, ingredients/usage/sustainability accordion, certifications. "In den Warenkorb" adds to the drawer.
3. **Cart drawer** slides in from the right, shows line items with remove + subtotal in €.
4. **Click "Über uns"** in the nav → opens the **Email Newsletter** mock screen — same type & palette as the site, in a 600px-wide email canvas.
5. **Submit the newsletter form** → confirms inline.

## What's faithful, what's substituted

✅ **Faithful** (lifted from the analysis doc + observed brand language)
- All 13 brand hexes and where they apply (beige hero, rose lip-care moments, navy night-care, soft-mint info blocks, etc.)
- Off-black `#1A1A1A` as the primary CTA color (not green — green is a story color)
- "One accent per moment" rule on the story strip and email blocks
- Generous whitespace, hairline borders, tiny shadows, low corner radii
- German voice, all-caps product line names ("FRESH", "CAPS"), lowercase product names ("FRESH eye serum")
- Soft Y-translate + shadow lift on cards; no bouncy springs

⚠️ **Substituted, flagged in the parent README**
- **Fonts:** Instrument Serif + Outfit (Google Fonts) — stand-ins for the unsupplied real fonts.
- **Logo:** Live-text wordmark (`<Wordmark />`) — drop a real SVG into `assets/logo.svg` and swap.
- **Icons:** Lucide via CDN — closest open-source match to the live-site icons.
- **Photography:** Placeholder rectangles tinted in palette colors. No real product shots, model imagery, or botanical stills.

## Out of scope (no source data)

- Account / login / order-history screens
- Filtering, search, faceted browse
- The "store finder / partner" map
- Recipe/blog editorial templates
- Mobile-app surfaces (Ringana has no public app in the source materials)

These would be straightforward to add once real screenshots or code references are available.
