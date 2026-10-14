# Super Greens Gummies Funnel: Handoff

Owner: Limitless X · Status: **Design v1, ready for review** · Last updated: 2026-09-29

This folder is the complete design package for the Super Greens paid-traffic funnel. Design files are interactive, so open them in Claude Design or a browser (served from the project root).

| File | What it is | Who uses it |
|---|---|---|
| `Super Greens V1 Retro.dc.html` | **V1 — Retro 3D.** Shader background, grain, 3D gummies, arc carousel | Design, Shopify dev |
| `Super Greens V2 Clean.dc.html` | **V2 — Clean.** Flat, light version of the same funnel | Design, Shopify dev |
| `Super Greens V3 Original.dc.html` | **V3 — Legacy.** Original 18-section build | Reference |
| `Super Greens Landing Page - Versions.dc.html` | Version switcher (also opened by `index.html`) | Design review |
| `CREATIVE-DIRECTION.md` | Super Greens visual system, photo/render briefs, paid-social map | Design, creative, photo |
| `backup/` | Older versions (v1, v2, v3, clean master). Not deployed. | Reference |
| `Post-Purchase Flow.dc.html` | Cart drawer → 4 one-click upsells → thank-you page, with a scenario switcher showing the conditional logic | Shopify dev, upsell app setup |
| `funnel-config.json` | Pricing, discounts, gift thresholds, upsell rules. **Single source of truth.** | Dev, marketing, finance |
| `assets/` | Cropped product + lifestyle images pulled from limitlessx.com | Dev, creative |
| `HANDOFF.md` | This spec | Everyone |

**Tweaks panel (landing page):** hero variant, CTA copy, bundle set (1/3/6, 1/2/4, 1/3/5), default plan, and every placeholder discount. Changing a discount recalculates every price, savings %, the "UP TO X%" claim and the quiz reveal math.

---

## 1. Workflow

1. **Review** in Claude Design. Comment directly on elements.
2. **Confirm open items** (section 9). Update `funnel-config.json`, then mirror the values in the landing page's Tweaks.
3. **Build** in Shopify as a custom page template (`page.super-greens.json`) using OS 2.0 sections (section 3). Copy is final unless marked PLACEHOLDER.
4. **QA** at 390px and 1440px against the design files, plus the compliance checklist (section 8).
5. **Launch** with A/B tests (section 7).

New funnels follow the same pattern: `funnel/<product-handle>/` with the same five items.

---

## 2. Facts used (from limitlessx.com snapshot, Aug 31 2026)

- Price **$49.95** / pouch · Subscribe & Save **15%** · Free shipping **$70+**
- **60 gummies / 30 servings** per pouch · 2 gummies daily · **0g sugar, 16 calories**
- Blends: Super Greens 2g · Super Reds 1g · Super Gut 500mg (ingredients as listed on PDP)
- Flavors: **Apple Cinnamon available**; Watermelon, Citrus Blaze, Mixed Berry, Tropical Mango "coming soon"
- Reviews: **5.0 / 210** (100% 5-star) · 60-day satisfaction guarantee · GMP-certified, third-party tested facility · Pouch states Made in USA, Non-GMO, Sugar free, Gluten free
- 3 real reviews reused verbatim (Casey Edwards, Abigail Richardson, Zoe Wood)

---

## 3. Shopify build map

| # | Section (Shopify section file) | Key settings / data source |
|---|---|---|
| 01 | `lx-announcement-bar` | 3 text blocks |
| 02 | `lx-sg-hero` | Product (handle `superfoods-super-greens-blend-gummies`), gallery = product media, offer selector block (see 3.1), sticky right column ≥900px |
| 03 | `lx-proof-strip` | 4 stat blocks |
| — | `lx-quiz-banner` | Opens quiz drawer |
| 04 | `lx-split-media-text` | Why Super Greens + 3 stat tiles |
| 05 | `lx-benefit-cards` | 5 blocks: icon, title, text |
| 06 | `lx-ingredient-blends` | 3 blocks: name, dose, colour, bullets + Supplement Facts link |
| 07 | `lx-steps` | 3 blocks |
| 08 | `lx-split-media-text` (reversed) | Why gummies + checklist |
| 09 | `lx-comparison-table` | Rows: label, ours, theirs |
| 10 | `lx-lifestyle-grid` | 3 image blocks with captions |
| 11 | `lx-reviews` | Review app widget (Judge.me / Okendo / Yotpo: whichever is live). Summary + filters + swipeable cards |
| 12 | `lx-bundle-builder` | Tiers from metafield `lx.bundle_set`; plan toggle shared with hero |
| 13 | `lx-subscribe-benefits` | 4 blocks, cadence from selling plan |
| 14 | `lx-gift-ladder` | Reads gift rules from metafields |
| 15 | `lx-faq` | Accordion blocks; FAQPage JSON-LD |
| 16 | `lx-guarantee` | Links to /pages/returns-exchanges |
| 17 | `lx-final-offer` | Anchors to #offer |
| 18 | `lx-sticky-cta` | Mobile only (<900px), appears after scrolling past hero, hidden while quiz is open |

### 3.1 Offer selector logic
- **Variants:** one variant per flavor. Quantity = line item quantity (1/2/3/6), *not* separate variants, so inventory stays in one place.
- **Bundle discount:** an automatic discount via Shopify Functions (Product Discount), tiered by quantity of this product. Tiers come from `funnel-config.json → pricing.bundleDiscountPct`.
- **Subscribe & Save:** a selling plan group on the existing subscription app, 15% off, cadence from config. Stacking order: **bundle % first, then 15%** on the reduced price. Confirm the subscription app supports stacking with Functions discounts; if not, create a selling plan per tier.
- **Subscribe options:** 1/3/6 only. One-time: 1/2/3/6. Switching to subscribe from qty 2 moves to 3 (visible to the user, not silent at checkout).
- **Default plan:** subscribe is pre-selected, with the recurring-billing disclosure visible directly under the CTA. Legal to confirm; the Tweaks switch makes one-time the default for an A/B test.
- **"UP TO X% OFF":** computed = max real savings across purchasable options. With placeholder discounts this is **32%** (6 pouches: 20% bundle, then 15% S&S). **Do not show 65%** unless config math reaches it.

### 3.2 Gifts
| Gift | Rule | Implementation |
|---|---|---|
| Free shipping | Cart total ≥ $70 | Existing shipping rate |
| Limitless X T-shirt | Qty ≥ 6 | Gift-with-purchase app or Cart Transform Function adds a $0 gift SKU; size selector shown in cart; gift removed if qty drops |
| Limitless X Hat | Qty ≥ 6 **and** subscription | Same, $0 SKU |

Gift SKUs must be tracked inventory. If out of stock, hide the gift line and the ladder copy ("while supplies last").

### 3.3 Cart drawer
Shows: line item, gift lines, progress messages (free shipping / T-shirt / hat), savings breakdown (retail, bundle discount, subscription savings, gifts, shipping, **total savings**), "YOU'RE SAVING $XX TODAY" banner, express checkout buttons (Shop Pay / Apple Pay / Google Pay via Shopify dynamic checkout).

### 3.4 Post-purchase (existing one-click upsell app)
| Order | Offer | Show when | Skip when |
|---|---|---|---|
| 1 | Stock Up: +2 pouches (if bought 1) / +3 (if bought 2–3) | qty < 6 | qty ≥ 6 |
| 2 | Complete Your Daily Stack: NZT-48 | always | customer already bought NZT-48 |
| 3 | Performance Stack: OneShot Nootropic Pre-Workout | always | already bought OneShot |
| 4 | Lock In Savings: convert to Subscribe & Save | one-time order | subscription order |

Every offer has a visible "No thanks". The subscription upsell repeats the full recurring-billing disclosure. Prices: PLACEHOLDER in config.

### 3.5 Thank-you page
Checkout extensibility (Thank-you / Order status page blocks): welcome header, how to use, what to expect, subscription management link (subscribers only), referral block (if a referral program exists), UGC/social ask, cross-sell (NZT-48, OneShot), FDA disclaimer.

---

## 4. Quiz / lead capture
- Opens as a bottom sheet from the header, banner, or a URL param (`?quiz=1`, add for ads).
- 3 questions (goal, consistency, priority) → email (required) → phone (optional) → SMS consent checkbox (**unchecked by default**, full TCPA language) → reveal.
- Reveal shows the savings math line by line: 6 pouches retail, bundle discount, S&S, shipping, gift values, final price.
- Answers push to Klaviyo as profile properties: `sg_goal`, `sg_consistency`, `sg_priority`; list `SG Quiz Leads`. SMS consent via Klaviyo SMS consent API only when checked.
- Offer code: PLACEHOLDER. If the offer is simply the bundle + S&S pricing, no code is needed.

---

## 5. Analytics
Design already pushes these to `window.dataLayer`. Dev wires them to GTM → Meta Pixel + CAPI, GA4, Google Ads, TikTok.

| Event | Fired on | Params |
|---|---|---|
| PageView / ViewContent | page load | product handle |
| QuizStart | any "Unlock my offer" | — |
| QuizComplete | email submitted | answers |
| Lead / EmailCaptured | email submitted | sms_optin |
| ViewOffer | quiz reveal / "claim" / final-offer CTA | plan, qty |
| SelectBundle | quantity chip / tier card | plan, qty |
| SelectSubscription | subscribe card / tab | — |
| AddToCart | main CTA | plan, qty, value |
| InitiateCheckout | cart checkout | value |
| Purchase | order status page | value, order_id, plan |
| UpsellViewed / UpsellAccepted / UpsellDeclined | upsell app | offer_id |
| SubscriptionStarted | subscription purchase or upsell #4 accept | — |

**UTM persistence:** landing page stores `utm_*`, `fbclid`, `gclid`, `ttclid` in `sessionStorage.lx_utm` (implemented in the design logic). Dev also writes them to cart attributes (`/cart/update.js` → `attributes[utm_source]` etc.) so they reach the order and Klaviyo.

**Performance budget:** LCP < 2.5s on 4G, hero image ≤ 120KB WebP, everything below the hero lazy-loaded, no third-party JS above the fold except the review stars, quiz code loaded on first interaction.

---

## 6. Email / SMS (Klaviyo)
**Quiz lead, no purchase:** E1 immediately "Your Limitless offer is ready" (deep link to `#offer` with quiz answers) → E2 +1 day "Why gummies" → E3 +2 days reviews → E4 +4 days offer reminder → E5 +6 days final reminder, **only if the offer genuinely ends**. SMS mirrors E1 and E4 for consented profiles.

**New customer:** Welcome → How to use (day 2) → Consistency (day 7) → Complementary products (day 12) → S&S education for one-time buyers (day 18) → Replenishment reminder at **day 25 × pouches bought** (30 servings/pouch).

**Subscriber ("The Limitless Routine"):** Welcome to membership → pre-ship reminder 3 days before each charge (with skip/pause links) → member offers (only if real).

---

## 7. CRO roadmap
| Test | Variants | Where to switch |
|---|---|---|
| Hero | product-first / benefit-first / offer-first | Tweaks → heroVariant |
| CTA | GET MY OFFER / TRY SUPER GREENS / START MY LIMITLESS ROUTINE / UNLOCK MY SAVINGS | Tweaks → ctaLabel |
| Bundle set | 1/3/6 · 1/2/4 · 1/3/5 | Tweaks → bundleSet |
| Default plan | subscribe / one-time | Tweaks → defaultPlan |
| Savings framing | % vs $ vs gift-led | Section setting in Shopify build |

Use Shopify theme A/B (Intelligems / Shoplift / Convert) on the page template. Primary metric: conversion rate × AOV (revenue per visitor). Secondary: subscription take rate.

---

## 8. Compliance checklist
- [x] FDA disclaimer in footer and thank-you page; asterisks on structure/function claims
- [x] No disease, weight-loss, clinical, doctor or FDA-approval claims
- [x] Reviews are real (3) or clearly labelled PLACEHOLDER
- [x] No countdown timers, stock counters or fake scarcity
- [x] Crossed-out price = real regular price × qty
- [x] Subscription disclosure beside every subscribe CTA; SMS checkbox unchecked
- [ ] Legal review: default-selected subscription, gift terms, guarantee wording
- [ ] Remove "Weight management" quiz option if legal prefers (it only segments; no claim is made)

---

## 9. Open items: confirm before launch
1. **Bundle discount %** for 2/3/4/5/6 pouches (design uses 5/10/15/17/20).
2. **Subscription cadence** (design: every 30 days) and whether the subscription app can stack with bundle discounts.
3. **Gift values + SKUs** for T-shirt and hat, and sizes available.
4. **Upsell prices** for upsells 1–3.
5. **Format wording:** the brief says "bottles"; the product is a **pouch**. The design uses "pouch".
6. **Flavor copy:** the site FAQ calls it a "watermelon gummy" but only Apple Cinnamon is purchasable. The design FAQ removes "watermelon".
7. **Referral program**: does one exist? If not, remove the block from thank-you.
8. **Member extras** (early access / member bundles): keep only what will actually be offered.
9. Standard shipping rate below $70.

---

## 10. Asset checklist
| Asset | Size | Desktop | Mobile | Overlay copy | Status |
|---|---|---|---|---|---|
| Hero pouch render (per flavor) | 1600×1600 transparent PNG/WebP | Hero left, 50% | Hero top, full width | "0G SUGAR" / "16 CALORIES" badges | ✅ Reused (cropped PDP renders, `assets/pouch-*.png`) |
| Gummies close-up | 1600×1200 | Gallery, Why gummies | Gallery | "Your daily ritual" | ✅ Reused `daily-ritual.png` |
| Lifestyle: desk | 1600×1200 | Why Super Greens | Stacked | — | ✅ Reused |
| Lifestyle: morning / apples | 1080×1350 | Lifestyle grid | Swipe | "With your morning routine" | ✅ Reused |
| Lifestyle: travel / carry-on | 1080×1350 | Lifestyle grid | Swipe | "On the go" | ❌ **Shoot needed** |
| Hand holding gummies | 1080×1350 | Ads, reviews | Ads | — | ❌ Shoot needed |
| Ingredient flat-lay (greens / reds / gut) | 1200×900 ×3 | Ingredient cards bg | Cards | Blend name + dose | ❌ Optional shoot |
| Benefit icons | 160×160 | Benefit cards | Cards | — | ✅ Reused (site icons) |
| Supplement Facts | 2068×1600 | Link / lightbox | Link | — | ✅ Reused |
| T-shirt render | 1200×750 | Gift ladder, cart | Same | "$XX VALUE — FREE" | ❌ Needed |
| Hat render | 1200×750 | Gift ladder, cart | Same | "$XX VALUE — FREE" | ❌ Needed |
| UGC photos (5–10) | 1080×1080 | Review cards | Swipe | Reviewer name | ❌ Import from review app |
| NZT-48 / OneShot packshots | 1200×1200 | Upsells, thank-you | Same | — | ✅ Reused |
| Paid social creative | 1080×1920, 1080×1350, 1080×1080 | — | — | Hero headline + offer | ❌ Creative team |
| Retargeting creative | 1080×1080, 1200×628 | — | — | "Your offer is still waiting" | ❌ Creative team |
