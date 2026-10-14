# Super Greens funnel: Shopify build handoff

Two landing pages for Limitless X Super Greens Gummies (V1 Retro and V2 Clean), built from the Claude Design files and installed on a hidden preview theme. Nothing is live yet.

Open this folder in Claude Code and say: "Read README-START-HERE.md and continue the Super Greens funnel."

## Store
- Store: `thelimitlesspill.myshopify.com` (limitlessx.com)
- Live theme: `limitlessX/main`, id `169709207854`. Push to it only when the owner says "go live".
- Preview theme (unpublished): "LX Funnel Preview - Super Greens", id `190316445998`. It's a full copy of live plus the funnel files.
- Product: `superfoods-super-greens-blend-gummies`, variant Apple Cinnamon `51105801797934`, $49.95.

## Preview links (shareable, not live)
- V1: https://thelimitlesspill.myshopify.com/pages/returns-exchanges?view=super-greens-v1&preview_theme_id=190316445998
- V2: https://thelimitlesspill.myshopify.com/pages/returns-exchanges?view=super-greens-v2&preview_theme_id=190316445998
(`returns-exchanges` is only a host page. `?view=` swaps in the funnel template.)

## Folder layout
| Path | What |
|---|---|
| `design_handoff_shopify_v1_v2/` | Source designs (`.dc.html`), `funnel-config.json`, original assets. The designs are the source of truth. |
| `shopify-build/build.mjs` | Generator: designs → Shopify theme files. Run `npm install` once, then `node build.mjs` (`--no-img` skips image conversion). Needs macOS `sips` + `cwebp` (brew install webp) for images. |
| `shopify-theme/` | Generated output: **only these files get pushed.** |
| `preview/` | (Created by the build.) Local, Shopify-free preview pages (serve the `super-greens` folder with `python3 -m http.server`, open `/preview/super-greens-v1.html`). |

### Files in `shopify-theme/`
- `layout/lx-funnel.liquid`: bare layout (no store header/footer). Holds the **SEO** per page (title, description, keywords, OG) from "seo greens.docx", keyed on `template.suffix`.
- `sections/lx-sg-v1.liquid`, `sections/lx-sg-v2.liquid`: one section per page. Server-rendered HTML (fast first paint), inline CSS, and section settings (product, selling plan id, cadence, bundle %, tee/hat value, CTA text, Klaviyo ids, cart vs checkout).
- `templates/page.super-greens-v1.json`, `templates/page.super-greens-v2.json`
- `assets/lx-dc.js`: small runtime that renders the design template + logic (`{{ }}`, `sc-if`, `sc-for`, events, hydration). It replaces the prototype's `support.js`/React.
- `assets/lx-funnel.js`: Shopify glue: add to cart (`#lx-cart-<plan>-<qty>` links → `/cart/add.js` with selling plan, replaces existing SG lines, writes UTM cart attributes), quiz lead capture (Klaviyo client API if ids set, else a Shopify customer tagged `sg-quiz`).
- `assets/lx-sg-v1.js`, `assets/lx-sg-v2.js`: generated page template + logic.
- `assets/lx-sg-*`: WebP images and fonts. Everything is prefixed `lx-` so nothing collides with live theme files.

**Don't hand-edit generated files.** Change the design or `build.mjs`, then rebuild.

## How to push
Shopify CLI must be logged in (`shopify theme list --store thelimitlesspill.myshopify.com` opens a browser login).
Push from a pulled copy of the theme so the CLI has a full theme folder:
```bash
shopify theme pull --store thelimitlesspill.myshopify.com --theme 190316445998 --path ./preview-theme
rsync -a --exclude '._*' shopify-theme/ ./preview-theme/
cd preview-theme && shopify theme push --store thelimitlesspill.myshopify.com --theme 190316445998 \
  --only 'layout/lx-funnel.liquid' --only 'sections/lx-sg-*' --only 'templates/page.super-greens-*' --only 'assets/lx-*'
```
Going live means the same `--only` push with `--theme 169709207854 --allow-live`. That adds new files only and touches nothing existing. Then create 2 pages in Admin → Online Store → Pages and pick templates `super-greens-v1` / `super-greens-v2`.

## Verified
- Both pages render and match the designs section by section (heights compared against the originals at the same width). The V1 WebGL background works.
- Plan toggle, quantity, tiers, FAQ, quiz (all 5 steps, reveal, "Claim my offer" → Subscribe 6), dataLayer events.
- Add to cart on the store puts the correct variant and quantity in the cart.
- SEO title, description and keywords render per page.

## Open items (must fix before launch)
1. **No selling plan on the product.** Subscribe currently adds a one-time line at full price. Attach the product to the SKIO Subscribe & Save plan, and the section picks up the first selling plan automatically (or set its id in the section setting).
2. **Bundle discounts are display only** (5/10/15/17/20% placeholders). Create matching automatic quantity discounts so checkout matches the page.
3. **Free tee/hat gifts** need a gift app or an automatic discount. Not implemented.
4. Cart attributes (`lx_funnel`, UTMs) did not show up in `/cart.js` in one test. Check whether another app overwrites attributes.
5. Placeholders still to confirm (from the design handoff): discount %, cadence, tee/hat value + SKUs, shipping rate, legal sign-off on Subscribe-by-default, review photos.
6. Klaviyo: put the public key + list id in the section settings to send quiz leads (with SMS consent) to Klaviyo.
