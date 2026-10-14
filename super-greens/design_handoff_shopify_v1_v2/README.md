# Handoff: Super Greens landing page (V1 Retro + V2 Clean) → Shopify

## Overview
Landing page for **Limitless X Super Greens** (Apple Cinnamon gummies, 60 per pouch). Two visual treatments of the **same content, section order and commerce logic**:
- **V1 Retro** (`Super Greens V1 Retro.dc.html`): neo-brutalist. 3px ink borders, hard offset shadows, rotated sticker tags, animated WebGL background that shifts colour with scroll, grain overlay, GSAP/ScrollTrigger + Locomotive Scroll.
- **V2 Clean** (`Super Greens V2 Clean.dc.html`): flat, rounded, soft shadows, light motion, Locomotive Scroll.

Pick one to ship (or A/B them). Copy, section order and offer maths are identical.

## About the Design Files
The HTML files are **design references**: prototypes showing intended look and behaviour, **not production code to copy**. Recreate them as a Shopify theme (Online Store 2.0 sections/blocks, Liquid + CSS + vanilla JS, or Hydrogen if you prefer headless) using the theme's own patterns. Do not ship the `.dc.html` files or `support.js`.
To view them: serve this folder (`python3 -m http.server`) and open a `.dc.html`. They need `support.js` and `assets/` alongside; do not open via `file://`.

## Fidelity
**High-fidelity.** Colours, type, spacing, copy and interactions are final, except the placeholders listed under "Open items".

## Page structure (same order in V1 and V2)
Each is a Shopify section (`data-section` name in the HTML).
1. **announcement-bar**: marquee, green. "✦ Join the Limitless Routine · Save 15%", "✦ 60-day satisfaction guarantee", "Free shipping on orders $70+".
2. **header**: sticky, logo (31px high) left, "Unlock My Offer" button right (opens quiz). Rating "5.0 · TOP RATED" sits under the hero CTA.
3. **hero**: left = image slider (swipe/drag, dots, autoplay, pause on hover; slide 7 = Supplement Facts panel); right = buy box: Subscribe/One-time toggle, quantity cards, price, CTA, subscription disclosure (always visible when Subscribe is selected).
4. **no-work** ("Greens shouldn't feel like work"): three cards, No scoop / No mixing / Just chew + go. Product cut-outs top-right of the first two.
5. **social-proof**, 6. **quiz-banner** ("Unlock your Limitless offer"), 7. **flavor-spotlight** (Apple Cinnamon only), 8. **benefits** ("One small habit. Five daily wins."), 9. **ingredients** ("Two gummies. Three power blends."), 10. **campaign-marquee**, 11. **how-it-works**, 12. **why-gummies**, 13. **lifestyle-anywhere** ("Built for your busiest days", 4 photo cards), 14. **comparison** (Scoop or pouch? Pouch wins.), 15. **lifestyle(-arc)** circular photo carousel, 16. **reviews**, 17. **bundle-builder**, 18. **membership-gifts** (rewards ladder), 19. **faq**, 20. **final-offer** (includes 60-day guarantee badge), 21. **sticky-cta** (mobile only, appears after hero).
Exact copy: read it from the HTML; do not retype.

## Commerce logic (must be reproduced in Shopify)
Source: `funnel-config.json` and the `calc()` method in the component script.
- Unit price $49.95; 30 servings per pouch; free shipping at $70.
- `total = retail − bundle% − (Subscribe 15% applied to the bundle price)`. Save %, per-day price and "UP TO X% OFF" are **computed from real prices**, never hard-coded.
- Bundle discount by pouches: 1→0%, 2→5%, 3→10%, 4→15%, 5→17%, 6→20%. **These are placeholders; confirm.**
- Subscribe options: 1, 3, 6 pouches. One-time options: 1, 2, 3, 6. Switching to Subscribe with 2 pouches moves to 3; 4/5 move to 6.
- Gifts: free shipping when total ≥ $70; **T-shirt at 6 pouches**; **hat at 6 pouches AND Subscribe**. Tee needs a size (chosen in cart).
- Default plan: Subscribe. Subscription cadence "30 days" is a placeholder.
- Bundle cards: Try it (1) / Stock up (3) / Go Limitless (6, "BEST VALUE", shows the haul: pouches, free shipping, tee, hat). Cards are top-to-middle aligned in a 1 : 1 : 1.32 grid.
- Shopify mapping: product + selling plans (Subscribe & Save), quantity-break pricing via discount functions or bundles app, gifts via cart-transform / automatic discounts / free-gift app. Cart hand-off in the prototype goes to `Post-Purchase Flow.dc.html?plan=&qty=`; replace with `/cart/add` + selling plan id.
- Do not ship the prototype's fake checkout/cart. Backend (cart, checkout, subscriptions, inventory, quiz lead capture, SMS opt-in) is not included.

## Quiz / lead capture
Modal from "Unlock My Offer": 5 steps (3 questions, email, optional phone with SMS opt-in), then a reveal ("Up to X% off + free shipping + free gifts") and **Claim my offer** which sets Subscribe + 6 pouches and scrolls to the offer. Submit email/phone to Klaviyo/Shopify Customer API; keep the SMS consent copy.

## Tracking events (data-track attributes)
QuizStart, QuizComplete, Lead / EmailCaptured (sms_optin), SelectBundle {plan, qty}, SelectSubscription, ViewOffer, AddToCart. Map to GA4/Meta/Klaviyo.

## Interactions & behaviour
- **Hero slider**: translateX track, dots below, ~5s autoplay, pause on hover/drag, pointer swipe.
- **Reveal-on-scroll** (`data-rv`): fade/translate-up 24px, 0.8s cubic-bezier(.2,.7,.2,1).
- **Card hover** (`.lx-lift`): lift + slight scale, 0.55s same easing; hover:hover and no reduced-motion only.
- **Header CTA**: gold animated border (V1), shine sweep every 2.8s, hover lift (V2 has glossy pop-out button).
- **Circular photo carousel**: cards on an arc, arrows + drag, auto-advance.
- **Kit card** (rewards ladder level 4): CSS keyframe slider, 3 photos, 12s infinite loop (`@keyframes lxkit`).
- **Locomotive Scroll v5** (Lenis under the hood): desktop only (`hover:hover`) and only if reduced motion is off; modal uses `data-lenis-prevent`.
- **V1 only**: WebGL background (three.js r128 shader) whose colours ease toward the section colour using scroll velocity; film grain at 5% opacity; GSAP 3.12.5 + ScrollTrigger; pointer sparkle trail; section angled clip-paths (2.6vw).
- `prefers-reduced-motion`: all CSS animations off; JS motion skipped.
- **Responsive**: fluid with `clamp()`; grids use `auto-fit minmax()`. Mobile: hero slider becomes static (min(520px,118vw) high), bundle grid stacks, sticky mobile CTA appears. Test at 390, 768, 1280, 1600+.

## State (prototype component)
`plan` ('sub'|'once'), `qty`, hero `img` index + `paused`, `faq` open index, review `filter`, quiz `quizOpen/quizStep/answers/email/phone/sms`, `scrolled` (sticky CTA). Prices derive from `calc(plan, qty)`.

## Design tokens
Colours (CSS vars): ink `#0C1A11`, forest `#0B4A2A`, yellow `#F4DC2A`, lime `#A6D62E`, red `#C8281F`, cream `#FBF3D6`; accents orange `#F28A2E`, blue `#2B6FE0`, pink `#F7838C`, light green `#DDF0A8`; body text `#3F4A42`, muted `#4A564E`.
(V1 also supports alternate palettes: Orchard, Ember, Gummy Lime via the theme-colour tweak.)
Type: **Boldonse** 400 uppercase for headlines (-webkit-text-stroke .028em for weight, line-height ~1.3, sizes clamp(28px,4.8vw,68px) hero/section scale; kicker 12–14px Poppins 700 .18em tracking uppercase); **Poppins** 400/500/600/700 for everything else (body 15–19px / 1.5–1.65). No mono fonts.
Radii: cards 24–32px (V2), 24px with 3px ink border (V1), pills 999px, buttons 12–18px (V1) / 999px (V2).
V1 shadows: `8px 8px 0 ink` cards, `3–5px` for small. V2: soft `0 10–26px … rgba(12,26,17,.35)`.
Spacing: section padding clamp(72px,9vw,128px) × clamp(16px,2.4vw,40px); gaps 16–28px; container max-widths 1240–1600px.
Motion easing: cubic-bezier(.2,.7,.2,1).

## Assets (`assets/`)
Pouch + product cut-outs (`pouch-apple-cinnamon.png`, `gummy-pile-new.png`, `supplement-facts.png`), lifestyle photos (`x-*.png`), gifts (`gift-tee.png`, `gift-hat.png`, `gift-box.png`), kit slider (`kit-box/model/pouch.png`), `no-scoop.png`, `no-mixing.png`, logo SVG, fonts (Boldonse TTF, Poppins WOFF2). Self-host fonts in the theme assets. Upload images to Shopify Files / theme assets and serve through `image_url` for responsive srcsets (current PNGs are large; convert to WebP/AVIF).
Unused: other flavour pouches (`pouch-citrus/mango/mixed-berry/watermelon`): only Apple Cinnamon is live.

## Open items (needs Limitless X)
Real bundle discount %, subscription cadence, tee/hat values and SKUs, standard shipping rate, legal sign-off on Subscribe-by-default and the disclosure, real review photos (placeholders marked "Imported review"), review app import (reviews are verbatim copies from the product page snapshot of 2026-08-31).
Compliance: keep the "*" structure/function disclaimer, subscription disclosure visible, and the 60-day guarantee wording as written.

## Files
- `Super Greens V1 Retro.dc.html`, `Super Greens V2 Clean.dc.html`: design references (open via local server).
- `support.js`, `image-slot.js`: prototype runtime only, not for production.
- `funnel-config.json`: pricing/offer rules; maps to Shopify metafields.
- `HANDOFF-original-funnel.md`: earlier handoff covering the post-purchase upsell flow and metafield mapping (still applicable for the cart/upsell; note its V3 page is superseded).
- `assets/`: all images and fonts.
