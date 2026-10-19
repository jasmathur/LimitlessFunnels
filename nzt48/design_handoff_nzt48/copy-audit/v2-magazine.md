# V2 – Magazine: Phase 1 audit (no edits made)

File: `NZT48 V2 - Magazine.dc.html` (630 lines). Analytics `version: 'v2-magazine'`.
Source key: **HC** = hardcoded in the HTML · **D** = `D.*` / `vals()` in `nzt48-shared.js`.

## 0. Blocking findings (the master copy can't fix these)

1. **Product photos show a "60 CAPS" bottle with printed claims beyond the matrix.** `assets/photos/size-30.webp` (the 30-capsule bundle card) and `hero-a.webp` (first hero slide) both show a label that reads "60 CAPS · Optimize mental agility · Increase cognitive power · Sharpen focus & memory · Elevate mood & positivity". The 30-count bottle is shown as a 60. The printed memory, cognitive-power and mood claims are not in the claim matrix: the matrix says "no memory claim" for Bacopa and gives no mood claim. The side panel also appears to list Vinpocetine, which is not in `D.blend`. Check every bottle render in `assets/` (hero-b/c/d, bottle-motion, size-60/90, final, step-*) against the real 30-count label. These are shared assets, so the coordinator owns them.
2. **Scenario photos are hotlinked Unsplash placeholders** (`SCN` array, line 602, comment "replace with own shoot"). They don't show the product, and they depend on a third-party CDN.
3. **The hero photo `alt` texts describe a bottle "of NZT48 Original"** that may be a different label (see 1).

## 1. Section inventory (top to bottom)

| # | Section (selector / screen-label) | Copy (source) | Claims / numbers / prices / competitors | Conflicts or flags |
|---|---|---|---|---|
| 1 | Announcement bar (first `div.wrap.lab`) | "Free US shipping on $70+" · "30-day money-back guarantee" · "Subscribe & save up to 20%" (HC) | $70 · 30 days · 20% | 30-day vs 90-day badge conflict is still open (LAUNCH-NOTES #5) |
| 2 | Header (`header`) | Nav "Formula / Label / FAQ" (≥820px only) · logo · "Shop NZT48" (HC) | — | No nav at all below 820px (fine for a funnel) |
| 3 | Hero (`#buy`, label "Hero") | H1 "The Limitless Pill. *Focus support* in a single daily capsule.*" (HC). Sub "NZT48 Original is a once-daily nootropic dietary supplement with the 750mg NZT-48™ Blend: caffeine for alertness, plus Alpha GPC, L-Theanine, Bacopaside and 19 more ingredients chosen for focus and mental clarity support.*" (HC, duplicated as `.desk-only` + `.mob-only`). Rating "4.9 from 5,100+ reviews" (D.reviews). Plan toggle "Subscribe & Save / One-Time". Size rows: caps, tag "Start Here / Stay Ready / Best Value", supply, $/capsule, total, strike (D.V + calc). "Deliver every" 30/45/60/90 + % off (D.PLANS). Price line, CTA `{{cta}}` = "Get The Limitless Pill" (prop default). Disclosure (D `disclosure`). Ship bar "This order ships free in the US." / "$X away from free US shipping." (HC). Footnote "A dietary supplement, not a drug. It contains caffeine. Results vary, and it isn't a guaranteed cognitive enhancer." (HC) | 750mg · 23 ingredients ("19 more") · $59.95/$79.95/$94.95 · sub 20%/15% · strike = $59.95 × bottles · 4.9 / 5,100+ | **"mental clarity support"** is not in the claim matrix. "Best Value" is accurate (lowest $/capsule) but check it against the "no unverified labels" rule. **The page sells 30/60/90**, while the command says "30-count funnels; don't add 50/90 unless approved". 60/90 already exist here, so the coordinator needs to confirm they stay. |
| 4 | Trust marquee (`.tm`, label "Trust") | "Made in the USA · GMP-certified facility · 30-day money-back guarantee · Free US shipping on $70+ · One capsule a day" (HC, ×2 for the loop) | — | **Made in USA + GMP are undocumented** (LAUNCH-NOTES #7) |
| 5 | Benefits (label "Benefits") | Eyebrow "What it supports" · H2 "Built for *four jobs*" · "Every ingredient in the blend is there for one of these reasons. Here's what each group is included to support.*" (HC). 4 cards (D.benefits): Alertness / Focus & Attention / Mental Energy / Everyday Stress | Ingredients named per card | **"Mental Energy" (B-Complex, Benfotiamine, ALCAR)** and **NALT for focus** are not in the matrix. "Every ingredient… is there for one of these reasons" is too broad (5HTP, Mucuna and Rauwolcine don't fit the four). The tile images have empty `alt` (decorative, OK). |
| 6 | One capsule (label "Nootropics + One Capsule") | H2 "One capsule is *the whole serving*" · "'Nootropic' is a general term for ingredients people take to support focus, attention and mental energy. Many nootropic stacks ask for several capsules a day, or a handful of separate bottles." · "NZT48 Original puts its 23-ingredient blend into one capsule. You take it once, with water and a meal, and that's your serving for the day. Nothing to measure, mix or count out." (HC) | 23 ingredients · 1 capsule | Strong section. "With water and a meal" should read "preferably with a meal" to match the directions. |
| 7 | Ingredients (`#formula`) | Eyebrow "Ingredient index" · H2 "What's inside, and *what the research says*" · intro on the 750mg blend and study doses (HC). 8 accordions with name/what/research/say (D.ingredients). "Also in the blend: {alsoIn} Ingredient research is not a study of NZT48 Original as a finished product. Ingredient photos are illustrative." | 750mg · 23 | Matches the matrix. Good model for the master copy. |
| 8 | Daily routine (label "Daily Routine") | H2 "Your *daily routine*" · "Three steps · one capsule" · Step 1 "Take one capsule / With 8oz of water, preferably with a meal…" · Step 2 "Skip the extra caffeine / …The label says to avoid other caffeinated products, including coffee and energy drinks." · Step 3 "Take it earlier in the day / Most people take it in the morning or with lunch…" (HC) | 8oz | "Most people take it…" is an unverified behavioral claim. Softer: "Many people prefer…". Step 1 image alt says "Taking one capsule" but the image is pill-shadow. |
| 9 | Who it fits (label "Who It Fits") | H2 "Made for *demanding days*" · "For adults 18+. Everyone responds differently, and NZT48 is one part of a routine that also includes sleep, food and movement." (HC). 8 cards (D.scenarios) | 18+ | Unsplash placeholder photos (see §0). "Gamers, 18+" is fine. |
| 10 | Comparison (label "Comparison") | Eyebrow "Capsules per labeled serving" · H2 "Fewer capsules *to take*" · convenience disclaimer (HC). Cards (D.compare): NZT48 ×1 · Alpha BRAIN® ×2 "Caffeine-free" · Qualia Mind® ×6 "label suggests 3–6". Footnote dated Oct 8 2026 (HC) | **Onnit 2, Qualia 6** | The command proposes Qualia **four**. The page says 6 (3–6). Hold until the coordinator re-verifies SKUs. "Caffeine-free" for Alpha BRAIN is also a competitor fact that needs verifying. Only one pill icon renders for every brand (`r.pills.0`), so "×6" shows one pill. |
| 11 | Supplement Facts (`#facts`) | Panel: "Serving Size 1 Capsule / Servings Per Container 30 / NZT-48™ Blend 750 mg †" + `blendText` (D.blend) + other ingredients + allergy (HC). Eyebrow "Full transparency" · H2 "The label, *in full*" · "The complete Supplement Facts panel… The 60 and 90 options are two and three of this same bottle." · How to use (HC) · Warning (D.warning) | 1 cap · 30 servings · 750mg | **The formula is unresolved** (LAUNCH-NOTES #2). The bottle photos may show a third version (Vinpocetine, see §0). |
| 12 | Reviews (`#reviews`) | "Customer rating" · big "4.9 / 5" · "Average rating from 5,100+ reviews of NZT48 Original on limitlessx.com" · "Read all reviews →" (D.reviews + HC). Internal placeholders hidden unless `showInternal` | 4.9 · 5,100+ (5,148 verified Aug 31) | OK. Re-verify the count at launch. No individual reviews yet. |
| 13 | Bundles (label "Bundles") | Eyebrow "Pick your supply" · H2 "Same capsule, *three sizes*" · tier cards: tag, % off, photo, caps, total, title·supply, $/cap, strike, ship line, "Add to cart" (D) · "Savings are compared with buying single 30-capsule bottles at $59.95 each." + disclosure · Sub block "Save up to 20% *on every order*" · "Every 30 days 20% off / Every 45, 60 or 90 days 15% off" · ARL text · One-time block "Buy once, *no commitment*" · "Pay $59.95, $79.95 or $94.95…" · "Both options are covered by the same 30-day money-back guarantee." (HC) | All prices are hardcoded in HC copy here | **"Save up to 20% on every order" is wrong for 45/60/90 plans (15%)**. Prices hardcoded in HC copy will drift from D.V. The size-30 photo shows "60 CAPS" (§0). |
| 14 | Guarantee (label "Guarantee") | Seal "Money-back guarantee" + "30" · H2 "30 days to *decide.*" · "If NZT48 Original isn't right for you, contact our support team within 30 days for a refund under our Returns Policy." · CTA (HC) | 30 days | Guarantee window conflict (#5). The Returns link `../../pages/returns-exchanges/index.html` is relative and only works inside the old site tree. |
| 15 | FAQ (`#faq`) | "Questions" · H2 "Questions, *answered*" · "For questions about your own health, please talk with your doctor or pharmacist." (HC) + 16 Q&As (D.faq) | Qualia 6, Alpha BRAIN 2, $2.00/$1.33/$1.06 | Q&As come from D, so they'll follow the master copy. The comparison FAQ has the same Qualia 4-vs-6 question. |
| 16 | Final CTA (label "Final CTA") | H2 "Start with *one capsule.*" · "NZT48 Original, The Limitless Pill. One capsule a day, a fully listed blend, and a 30-day money-back guarantee." · CTA + "Read the FAQ" (HC) | 30 days | **"a fully listed blend"** can read as fully disclosed. Amounts aren't listed. Suggest "every ingredient listed". |
| 17 | Footer (`footer.ft`) | "The Limitless Pill. *One capsule a day.*" · "Shop NZT48" · link columns · trust row (Made in USA, GMP…) · `fda` (D) · campaign/non-affiliation disclaimer · "© 2026 Limitless X" (HC) | — | Made in USA + GMP (#7). The policy links are root-relative (`/policies/...`), so they break in the static preview but should work on Shopify. |
| 18 | Sticky CTA (<900px, after 900px of scroll) | "{caps} · {total}" / "{perCap} per capsule" / "Add to cart" (D + HC) | — | See the presentation section |
| 19 | Cart drawer (`aside[role=dialog]`) | "Your *cart*" · line item · upsell "Switch to 60 capsules: $X per capsule" · Subtotal/Shipping/Tax · disclosure · "Secure checkout" · preview notice (D + HC) | — | The upsell offers a 60/90 switch. If the funnel becomes 30-only, it goes. |

**Movie references:** none found. Only the non-affiliation disclaimers mention "film/studio/actor". **Fake scarcity / countdowns:** none. **Placeholder copy:** the internal review slots (hidden), the Unsplash scenario photos, and the comment on line 601.
**Typography note:** README says V2 uses Newsreader, but the page loads Instrument Serif + Inter. The HTML wins per the README, but README should be corrected.

## 2. Strongest V2 lines (candidates for the master copy)

- H1: "The Limitless Pill. *Focus support* in a single daily capsule.*"
- "One capsule is the whole serving." + "Nothing to measure, mix or count out."
- "NZT48 Original puts its 23-ingredient blend into one capsule."
- The research / "What we can say" split on ingredient cards (honest framing, reads well).
- "Published studies usually test a single ingredient at larger amounts than a blend this size can hold."
- "This compares convenience only. Different formulas aren't interchangeable, and fewer capsules doesn't mean better results."
- "Skip the extra caffeine" (routine step 2)
- "A dietary supplement, not a drug. It contains caffeine. Results vary, and it isn't a guaranteed cognitive enhancer."
- "30 days to decide."
- "Same capsule, three sizes." (only if 60/90 stay)
- "NZT48 won't raise your IQ, replace sleep, or guarantee results at work or school." (FAQ, D)
- "Made for demanding days" + "one part of a routine that also includes sleep, food and movement."

## 3. Presentation baseline

Method: `resize_window` at 320, 360, 375, 390, 414, 430, 768 and 1440 (desktop) in the built-in Chromium. A JS probe measured document scrollWidth, elements past the viewport, sub-44px tap targets and WCAG contrast. Screenshots were taken at 320.

**Horizontal overflow:** none at any width (`scrollWidth == innerWidth` everywhere).

| Issue | Selector | Widths | Detail |
|---|---|---|---|
| Hero slider arrows clipped | `#hs .hs-nav` / `.hs-arrows` | 320, 360 (anything under ~371) | 5 dots (188px) + gap + 2×44px arrows need ~297px. At 320 the "next" arrow ends at x=334 inside a slider that ends at 304, so `.hs` `overflow:hidden` cuts it in half. |
| Sticky CTA covers the end of the page | sticky `div[style*="position:fixed"][style*="bottom:0"]` (69px tall) | all <900 | No `padding-bottom` on the page, so "© 2026 Limitless X" and the end of the disclaimer sit under the bar at full scroll. |
| Sticky bar doesn't hide near the in-page buy box | same | <900 | It shows after 900px of scroll, including over the Bundles section, which has its own Add buttons (minor duplication). |
| Contrast: size tags | hero `[role=radio] .lab` ("Start Here/Stay Ready/Best Value"), gold #A9832A, 10.5px | all | 2.99–3.26:1 on paper/tint (needs 4.5) |
| Contrast: frequency "% off" | freq button inner span (gold, 11px) | all | 2.99–3.26:1 |
| Contrast: competitor cards | `.cmp-grid > div` (non-us) text `rgba(28,28,33,.5)` on #F2ECE0: maker, note, ® | all | 2.18:1 (13px / 11px). Muted on purpose, but it fails AA. |
| Tap targets: slider dots | `.hs-dots button` | all | 28×3 / 44×3 px hit area |
| Tap target: rating link | hero `a[href="#reviews"]` | all | 13px tall (stretches full width) |
| Tap target: header nav | `header nav a.lab` | ≥820 | 13px tall |
| Tap targets: footer links | `.ft-col a` | all | 20px tall, gap 13px (below 44px, but spaced). |
| Tap target: Returns link in text | Guarantee `a` "Returns Policy" | all | 18px inline (acceptable inline-text exception) |
| Header CTA wraps | `header .btn-line` "Shop NZT48" | 320 | Wraps onto 2 lines. Fits on one at 360+. |
| Bundle meta wrapping | Bundles tier meta row (`s.title · s.supply` / ship) | 320–360 | "1 Bottle · 30-day / supply" and "Free shipping at / $70+" break awkwardly. Readable. |
| Size-row meta wrapping | hero `[role=radio]` supply line | 320 | "30-day supply · $1.60 / capsule" wraps to 2 lines. Readable. |
| Cart dialog a11y | `aside[role=dialog]` | all | No `aria-modal`, no focus move or trap, no Escape-to-close. |
| Comparison icon count | `.cmp-grid` pill span uses `r.pills.0` only | all | "×6" shows one pill. Fine as a design choice, but the `aria-label` is on a div with no role. |
| Reduced motion | global `@media (prefers-reduced-motion)` kills every animation/transition | — | Slider autoplay is correctly skipped. The guarantee seal stops spinning (good). The marquee `.tm-track` freezes, so at ≤430 only the first 1–2 trust items are visible and the rest are masked or cut off. Not emulated in-browser: there's no reduced-motion emulation tool, so this was checked by reading the code. |
| Focus indicators | `button/a/summary:focus-visible` outline | — | Present. Not keyboard-walked. |

**Not verified:** real iOS Safari or Android Chrome, notch/safe-area (sticky uses `env(safe-area-inset-bottom)`, good), landscape, keyboard overlap (no text inputs on the page), real reduced-motion emulation, and live checkout (disabled in the preview).

---

# Phase 2 (Oct 18): master copy applied + presentation fixes

**File edited:** `NZT48 V2 - Magazine.dc.html` only. Pre-edit copy saved in the session scratchpad.

**Copy:** loads `nzt48-shared.js?v=master1`. Every customer-facing section now reads `copy.*` / `D.*`: announce, hero (eyebrow, h1, support, body, note, buy labels, ship lines), trust, benefits, one capsule (+ the `stats` row, new on V2), ingredients, routine, uses, compare (+ foot dated Oct 18), facts panel, reviews (`D.reviewsUrl`), bundles (+ lede), plans (prices come from code via `onceBody`), guarantee (seal = `badge`, h, body, link → `D.returnsUrl`), FAQ (lede + health), final, footer (blurb, legal; the Made in USA/GMP trust row is removed), sticky and cart CTAs. Italics are spans around the same words (`it.*` splits in `renderVals`).

**Still hardcoded (structural labels, no D.copy key):** Supplement Facts scaffolding ("Supplement Facts", "Amount Per Capsule", "% Daily Value**", "Serving Size", "Servings Per Container", "Ingredients:", "Allergy Information:"), "How to use" / "Warning" labels, header nav (Formula/Label/FAQ), footer column and link labels, "Step 1–3", cart row labels (Your cart, Subtotal, Shipping, Tax), "per capsule", "© 2026 Limitless X", **"Ingredient photos are illustrative."** (V2-specific disclosure, kept), and image alt texts.

**Presentation fixes:** slider dots are 24px targets with the bar in a pseudo-element, and the nav insets shrink ≤420px, so the arrows sit inside at 320. Rating link and header nav are 44px tall. Footer links are 44px tall. The footer reserves the sticky bar's height + safe area below 900px. `--gold-ink #7D5E18` on the size tags and "% off" (5.1–5.6:1). Competitor cards use #2A2A30 (5.3:1 after .72 opacity). Header CTA nowrap; logo 15px ≤399px. Announcement bar tightened ≤600px (3 lines at 320). The cart dialog has `aria-modal`, focus moves to Close, Tab is trapped, Escape closes, and focus returns to the opener. Plan toggles have `aria-pressed`. Comparison icon row has `role=img`. Reduced motion: marquee is static, wrapped, duplicates hidden. Seal ring text is set in JS, because template holes render as `<span>` inside SVG.

**QA run (built-in Chromium):** 320/360/375/390/414/430/768/1440: no document overflow (only the spinning seal's bbox at mobile, clipped by the root), no sub-24px targets, no text under AA (shared V-switcher excluded). Purchase: 60 → Subscribe → 45 days → Add to Cart → `/cart/45002639802670:1?selling_plan=689969758510&utm_source=qa&utm_campaign=v2test`. One-time → 90 (Bundles "Add to Cart") → `/cart/45002639835438:1?utm_…` (no selling_plan), shipping "Free". Sticky bar shows the selected size/price, and the © line ends above it. Console clean. D.copy reverse check: all strings render (except partOf, which has no V2 equivalent, and the conditional/templated ones).

**Shared-file bug (not fixed, not mine):** `variant_label`/`version` are `''` on every event after PageView. `nzt48-shared.js` executes twice on this page (the runtime re-runs helmet scripts), and the second run resets the closure `VERSION`. `window.NZT48.track('X')` now returns `version:''`. Suggested fix in the shared file: guard with `if (window.NZT48) return;` at the top, or keep `VERSION` on `window`. Probably affects V1/V3 too.

**Not verified:** real iOS Safari / Android Chrome, real `prefers-reduced-motion` (simulated by injecting the rule), landscape, screen reader pass, live Shopify checkout.

**Assets (launch blockers, not swapped):** the "60 CAPS" old-label bottle in `size-30.webp`, `hero-a.webp` and the other bottle shots (also `assets/bottle.png` in the cart). The Unsplash hotlinks in "Who It Fits" (`SCN`).
