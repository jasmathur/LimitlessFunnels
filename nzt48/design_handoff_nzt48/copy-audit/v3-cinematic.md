# V3 Cinematic audit (Phase 1, no edits)

File: `NZT48 V3 - Cinematic.html` (983 lines). Two rendered experiences: **Cinematic Dark** (default) and **Cinematic Light** (`html[data-theme="light"]`, set by version-switch.js / localStorage `nzt-theme`). Tracking: `PageView version:'v3-cinematic'`, and it does **not** distinguish light from dark (command §10 wants separate IDs).

Legend: **[H]** = hardcoded in the V3 HTML, **[D]** = from `D.*` / `NZT48.vals` in nzt48-shared.js, **[3D]** = text baked into WebGL textures in the V3 module script.

---

## 1. Section inventory (top to bottom)

### Announcement bar `.bar` [H]
"Free US shipping on $70+ · 30-day money-back guarantee · Subscribe & save up to 20%"
- Claims: $70 free-ship threshold, 30-day guarantee (LAUNCH-NOTES #5: 30 vs 90 conflict still open), "up to 20%" (true: 30-day plan only).

### Header `#hdr` [H]
Nav: Shop · What's inside · How to take it · Made for · FAQ. CTA "Shop NZT48" ("Shop" < 900px). Cart icon badge.

### Hero `.hero` (section `hero`)
- Film: `assets/nzt48-film-{landscape|portrait}[-white].mp4`, `aria-label="NZT48 Original brand film"` [H].
- H1 [H]: "NZT48 Original"
- Rating [D]: stars + "4.9" + "5,100+ reviews" (`D.reviews`, source Judge.me 5,148 / 4.92; OK, not fabricated).
- Sub [H]: "The Limitless Pill. A once-daily nootropic capsule with the 750mg NZT-48™ Blend.*"
- Price [D-calc]: "From $47.96" (30 caps, 30-day sub, 20% off).
- CTA [H]: "Build your supply"
- ⚠ Command §6: hero should explain within 3 seconds WHAT it is, WHY you'd want it and WHAT TO DO. The "why" (benefit) is missing; there's no benefit line. "The Limitless Pill" is in body text, not featured as the headline (§MISSION: "Lead with THE LIMITLESS PILL").
- ⚠ The "*" asterisk on the sub has no structure/function claim attached; it hangs on "750mg NZT-48™ Blend".

### Mega logo strip `.mega` [H, decorative, aria-hidden]

### Configurator `#shop` (section `sizes`)
- H2 [H]: "Build your supply"
- Lede [H]: "Same capsule in every size. Bigger packages lower the price per capsule."
- Size seg [D]: 30 "Start Here" / 60 "Stay Ready" / 90 "Best Value" (Best Value is supported by the per-capsule math).
- Sub row [H+D]: "Subscribe & Save 20%" (`V.subLabel`) / "Subscribe & save up to 20%" when off; small "Skip, reschedule or cancel anytime" [H].
- Freq pills [D]: "Every 30 days · 20% off", "Every 45/60/90 days · 15% off".
- Price [D]: total, strike singles, "$1.60 per capsule · 1 Bottle, 30-day supply", badge "Save $11.99 · 20%".
- Ship meter [H template]: "$X away from free US shipping" / "Free US shipping unlocked".
- CTA [H]: "Add to cart". Disclosure [D]: `V.disclosure` (auto-renew wording per README).
- Stage hint [H]: "Drag to turn".
- ⚠ **Command §8: "NZT48 ORIGINAL 30-COUNT funnels. Do not automatically add 50/90-count purchase choices unless already approved."** V3 sells 30/60/90 (inherited from shared data / LAUNCH-NOTES #1). Coordinator decision needed: keep the approved 30/60/90 setup, or move to 30-only.
- ⚠ "30-day supply" is correct only because the directions say 1 capsule daily. OK as long as the label is confirmed.

### Capsule podium `#capsule` (section `capsule`)
- H2 [H]: "One capsule is the whole serving."
- CTA [H]: "Pick your size"
- 3D ribbon tags [3D, `TAGS` line ~872]: "750mg blend", "23 ingredients", "Caffeine", "One a day", "Made in USA".
- `aria-label` [H]: "…750mg NZT-48 Blend, 23 ingredients, contains caffeine, one capsule a day, 30 servings per bottle, made in the USA, GMP-certified facility".
- ⚠ "Made in USA" and "GMP-certified facility" are unverified (LAUNCH-NOTES #7: "Confirm … with documentation").

### Prism `#spectrum` (section `spectrum`)
- H2 [H]: "One capsule. The full spectrum."
- Lede [H]: "Every part of the NZT-48™ Blend, gathered into a single gold capsule."
- Visual only. No claims.

### Ingredients `#inside` (section `inside`)
- H2 [H]: "23 ingredients. One capsule."
- Lede [H]: "The full NZT-48™ Blend is listed on the label. Point at any ingredient to see what it is. The gold ones include a short note on what the research looks at."
- Fine [H]: "It's a proprietary blend, so the label lists the 750mg total, not each amount. Research summaries describe each ingredient on its own, usually at larger amounts."
- Tokens [D]: `D.blend` (23 names). Gold "key" cards [D]: `D.ingredients[].what/research/say` (matches the LAUNCH-NOTES claim matrix).
- Non-key cards [H, `WHAT` map ~line 710]: identity-only notes for EGCG, 5HTP, Theobromine, Benfotiamine, DL Phenylalanine, ALCAR, NALT, NADH, Uridine, B-Complex, Mucuna ("a natural source of L-DOPA"), Rauwolcine ("related to yohimbine"), Piperine. These have no benefit claims. ⚠ They are V3-only copy that isn't in `D`, so they should move to the master copy if they're kept. ⚠ The "L-DOPA" and "related to yohimbine" lines are accurate, but counsel may want them off a consumer page.
- ⚠ Benefit territories (`D.benefits`: Alertness, Focus & Attention, Mental Energy, Everyday Stress) are **not shown anywhere on V3**. No benefits section exists.
- ⚠ **No Supplement Facts panel on V3.** The footer "Supplement facts" link goes to the V2 page (`NZT48%20V2%20-%20Magazine.dc.html#facts`). Command §8/§11 need Supplement Facts on every funnel.

### How to take it `#routine` (section `routine`) [H]
1. "Take one capsule": "With 8oz of water, preferably with a meal, or as directed by a healthcare professional." (matches label)
2. "Skip the extra caffeine": "NZT48 Original already contains caffeine. The label says to avoid other caffeinated products, including coffee and energy drinks." (matches label)
3. "Take it earlier in the day": "Most people take it in the morning or with lunch, so the caffeine fits their day and their sleep." ⚠ "Most people" is an unsupported usage claim. Suggest "Take it in the morning or with lunch…".
- Photos: p-capsules, p-topdown, r-sunlit (alt text OK).

### Made for `#uses` (section `uses`)
- H2 [H]: "Made for demanding days"
- Cards and lightbox [D]: `D.scenarios` (8: Deep Work, Back-to-Back Calendars, Presentations, Creative Projects, Study Sessions, Competitive Play "Gamers, 18+", Busy Households, Active Mornings). Images map [H] `PICS`.
- Fine [H]: "For adults 18+. Everyone responds differently, and NZT48 is one part of a routine that also includes sleep, food and movement."
- Lightbox CTA [H]: "Build your supply". Image alt "{t} with NZT48 Original".
- Fits §6 (multiple life contexts). "Mature professionals / 30–75" isn't explicitly covered (no older-adult scenario).

### Standards bento `#standards` (section `standards`) [H]
- H2: "Made to a standard"
- "Made in the USA" / "Produced in the United States." ⚠ unverified (#7)
- "GMP-certified facility" / "Made in a facility that follows Good Manufacturing Practices." ⚠ unverified (#7)
- "Fully listed blend" / "All 23 ingredients are printed on the label." OK
- "One capsule a day" / "The labeled serving is a single capsule." OK
- "30-day guarantee" / "Covered by our Returns Policy." ⚠ 30 vs 90 open (#5)

### FAQ `#faq` (section `faq`)
- H2 [H]: "Questions, answered". Lede [H]: "Straight answers on ingredients, caffeine, sizes and subscriptions." CTA [H] "Build your supply".
- Q&A [D]: all 16 `D.faq` items. ⚠ The comparison item ("…Alpha BRAIN® … 2 capsules, and Qualia Mind® lists a 6-capsule serving with a suggested 3 to 6…") names competitors with counts. The command's brief says "Onnit two and Qualia four", and shared data says Qualia **6**. Do not publish until §3 re-verifies. (V3 has no compare table; this FAQ is its only competitor reference.)
- FAQ "What's the difference between 30, 60 and 90?" includes prices ($2.00/$1.33/$1.06). OK if prices are confirmed.

### Final `.final` (section `final`)
- Video `assets/nzt48-floating-alpha.webm` (`aria-label="NZT48 bottle floating"`). ⚠ The bottle art reads "60 CAPS", which doesn't match a 30-count-led funnel.
- H2 [H]: "Start with one capsule."
- CTAs [H]: "Shop now", "Read the FAQ".

### Footer [H + D]
- Blurb [H]: "NZT48 Original, The Limitless Pill. A once-daily nootropic dietary supplement."
- Links: 30/60/90 capsules → #shop; Ingredients; **Supplement facts → V2 page** ⚠; FAQ; Returns policy → `../../pages/returns-exchanges/index.html` ⚠ (relative path outside this folder, broken in preview); Privacy `/policies/privacy-policy` and Terms `/policies/terms-of-service` (fine on Shopify, 404 in preview).
- `#fda` [D] FDA disclaimer ✓. `#warn` [D] "Warning: …" ✓.
- Legal [H]: "“The Limitless Pill” is a Limitless X campaign name for NZT48 Original. NZT48 is not affiliated with, sponsored by or endorsed by any film, television production, studio or actor. Individual results vary. © 2026 Limitless X". This does no movie name-drop ✓, but the phrase still needs a trademark/counsel flag (§MISSION).

### Cart drawer `#cart`, toast `#toast` [H + D]
- "Your cart", "Subscribe & save" (sentence case) next to `csubsmall` "Subscribe & Save 20% · cancel anytime" (title case). ⚠ Inconsistent casing.
- Size rows [D] "30 Capsules · 30-day supply $47.96"; line [D template] "{caps} · {perCap} per capsule · Shipping: {ship}"; total; disclosure [D]; "Secure checkout" [H].
- Preview note [H]: "Preview build: checkout is turned off…" (preview-only, OK).
- Toast [H template]: "Added to cart" + "{caps} · {plan} · {total}", "View cart".
- ⚠ No upsell row ("Switch to 60 capsules: $X per capsule") as the README describes for V1/V2. Check this against the master spec.

### Compliance scan summary
| Item | Status |
|---|---|
| Movie / actor / studio references | None ✓ (disclaimer only) |
| Fake countdown / scarcity | None ✓ |
| "Best seller" label | None ✓ ("Best Value" is math-backed) |
| Review count | 5,100+ / 4.9 from Judge.me ✓ (no individual reviews shown) |
| Placeholder copy | None visible ✓ (`#cnote` is preview-only) |
| Claims beyond matrix | None in V3 copy. Unverified: Made in USA, GMP (×2 places + 3D tag), "Most people take it…" |
| Competitor counts | FAQ only (Qualia 6 vs brief's 4). Hold until verified |
| Supplement Facts on page | **Missing** (links to V2) |
| Benefits section | **Missing** (D.benefits unused) |
| Hero "why" | **Missing** |
| Light/Dark analytics split | **Missing** (`v3-cinematic` only) |

---

## 2. Strongest V3 lines (master-copy candidates)
1. "One capsule is the whole serving." The one-capsule differentiator in six words, and label-true.
2. "23 ingredients. One capsule." Short, factual and ingredient-led.
3. "Start with one capsule." A good final-CTA headline that is also low-pressure.
4. "Same capsule in every size. Bigger packages lower the price per capsule." Clear purchase explainer.
5. "Skip the extra caffeine" plus its body. An honest, label-derived usage step that builds trust.
6. "For adults 18+. Everyone responds differently, and NZT48 is one part of a routine that also includes sleep, food and movement." A good expectations line.
7. "It's a proprietary blend, so the label lists the 750mg total, not each amount. Research summaries describe each ingredient on its own, usually at larger amounts." A plain-English substantiation caveat.
8. "Made for demanding days." Scenario headline that doesn't promise outcomes.
9. "Straight answers on ingredients, caffeine, sizes and subscriptions." FAQ lede.
10. `WHAT` identity notes (non-key ingredients), if counsel clears them.

---

## 3. Presentation baseline

Tested with resize_window in the built-in Chromium at 320×640, 360×740, 375×812, 390×844, 414×896, 430×932, 768×1024 and 1440×900, in Dark and Light, plus a JS sweep for document overflow, element overflow, text clipping, tap targets < 44px and token contrast. **Not tested:** real iOS Safari or Android Chrome, landscape phones, the notch/safe area on a device, keyboard overlap, and emulated `prefers-reduced-motion` (only reviewed in code).

No horizontal page scroll at any width (`html,body{overflow-x:clip}` hides the cases below instead of preventing them).

### Overflow / clipping
| # | Width / theme | Selector | Issue |
|---|---|---|---|
| P1 | 320, both | `#inside .inside` → `.intro`, `.lede`, `.fine`, `#tokens`, `.tok` | Column is 13px wider than the viewport (right edge 333px). Text and right-column tokens are cut off at the right edge ("…on the labe"). Cause: `.inside{grid-template-columns:1fr}` at ≤900 with min-content from "N-acetyl-L-tyrosine (NALT)" in the `.tokens` 2-col grid. Fix: `minmax(0,1fr)` on both grids. |
| P2 | 320, both | `#standards .tile b` ("GMP-certified facility", "30-day guarantee"), `.tile span` | Text overflows the 92px tile content box. "GUARANTEE" is clipped at the tile edge. Also at 360 ("30-day guarantee", 121/112px). Fix: smaller `.tile b` clamp or `overflow-wrap:anywhere` at ≤400, or 1-col tiles at ≤360. |
| P3 | 320–430, both | `.hero .card .btn.pri` | Hero CTA bottom is 657px on a 640px viewport at 320: the CTA starts below the fold because `.bar` (2–3 lines on phones) pushes the 100svh hero down. Same pattern at 390×844 (button bottom about at the fold edge). |
| P4 | 320–430, both | `.bar` | Announcement wraps to 3 lines at 320 and 2 lines up to 430 (11px uppercase, .14em tracking). Shorten it on mobile or reduce the tracking. |
| P5 | 320–430, both | `.day .cap` (carousel) | The first card sits partly off-screen left, so its caption is cut ("EVELOPERS…", "EEP WORK"). Drift start position; consider starting at `x = pad`. |
| P6 | 320, both | `#cart .sizes button` | "30-day supply$47.96": no gap between the label and the price (`justify-content:space-between` with no `gap`). |
| P7 | 320, both | `#cart .btn.pri#ccheckout` | Flex column shrinks the 60px button to **36px** tall. The aside scrolls (865/563), so "Secure checkout" sits below the fold. Fix: `flex:none` on the button and a sticky footer for total + CTA. |
| — | all | `#routine .step .ico` | Flagged by the sweep but clipped by `.icl{overflow:hidden}` on purpose. Not an issue. |

### Tap targets (< 44px)
- `#subswitch`, `#csub` (role=switch): 56×32.
- `#freq button`, `#cfreqs button`: ~175×38.
- `#ccheckout` at 320: 272×36 (see P7).
- `footer a` (all 9 links): 21px tall, 0 spacing beyond a 9px margin.
- `#hdr nav a` (desktop): 34px tall. Desktop only, so lower priority.
- `#lx-theme-switch`: 40×40. This lives in version-switch.js (shared, coordinator-owned).

### Floating theme switch (shared file, flag only)
`#lx-theme-switch` (fixed, bottom-right, from version-switch.js) overlaps page content on phones: frequency pills, ingredient tokens ("DL Phenylalanine"), bento text, the FAQ "+" icons, and **sits above the open cart drawer**. Preview-only UI, but it hides content during QA. Coordinator's call.

### Contrast (WCAG AA, 4.5:1 for normal text)
| Theme | Selector | Ratio | Note |
|---|---|---|---|
| Light | `.row .t small` ("Skip, reschedule or cancel anytime"), and any `--mute` text on `--panel` | **4.27** | `--mute:#6B6F7B` on `#F2ECE0`. Darken `--mute` in light (e.g. #5A5E69). |
| Light | `--mute` on `--bg` (`.fine`, `#pdisc` disclosure, `.stage .hint`, footer) | 4.66 | Passes, but only just. The auto-renew disclosure is legally required text at 12px. |
| Both | `.step:not([aria-selected=true]) b` | Dark 2.31, Light 1.90 | Inactive step titles are intentionally dimmed, but they're real tab labels. Raise them to about .55 opacity. |
| Light, hero | `header .logo` (blue) over the white-cut film at 320–430 | low | The portrait-white film is a dark bottle close-up behind the blue logo, so the logo nearly disappears. `film-dark` is false for white cuts, so the white-logo override doesn't apply. |
| Dark | `.seg button span` (.75 opacity), `.rating .r2` (.75) | OK | Checked visually. |
Dark theme otherwise passes (`--mute` 5.59 on bg, 5.25 on panel; gold buttons 10.66).

### Sticky CTA
**V3 has no mobile sticky CTA at all.** The hero card is in-flow, so once you scroll past it the only purchase entry points are the header "Shop" pill (fixed, ✓) and section CTAs. The README specifies a mobile sticky bar for V1/V2 at < 900px. Recommend adding a V3-styled sticky bar (price + "Add to cart") that hides while `#shop` or the cart is in view.

### Reduced motion (code review, not emulated)
- CSS `@media (prefers-reduced-motion: reduce){*{animation:none;transition:none}}` ✓. JS gates Lenis, carousel drift, 3D spin and prism pointer ✓.
- ⚠ `#herofilm` (autoplay loop mp4) and `.final video` (autoplay loop webm) **keep playing** under reduced motion, with no pause control. Pause them or swap in a poster frame when `reduce` is set.
- ⚠ `.hero .card` uses `animation:heroCard … forwards` from `opacity:0`. With `animation:none` the card should stay at the base `opacity:0`, so **the hero card would be invisible under reduced motion.** Needs device or emulation confirmation; fix with `@media (prefers-reduced-motion){.hero .card{opacity:1;transform:none}}`.

### Other
- `.final video` crops to "60 CAPS" bottle art (copy/asset mismatch, see the inventory).
- Light theme reads well overall: navy CTAs, cream panels, and the navy prism block keeps the dark drama. The 3D ribbon tags stay dark gold-on-black in light (intentional).
- Desktop 1440 (both themes): no overflow or clipping. Layout is balanced.

---

# Phase 2: applied (Oct 18, 2026)

Only `NZT48 V3 - Cinematic.html` was edited (pre-edit copy: scratchpad `v3-before-phase2.html`). Script tag is `nzt48-shared.js?v=master1`.

**Copy:** every customer-facing string is now filled at runtime from `D.copy` through `data-c="path"` (and `data-c-label` for aria-labels). The HTML holds no marketing copy. Ingredient cards use `D.notes` plus the `ingredients.researchLabel/sayLabel/partOf` labels. The 3D orbit tags come from `copy.trust[1]` and the standards tile titles (Made in USA removed). The podium aria-label is built from `oneCapsule.h/stats`. Returns links point at `D.returnsUrl`, and the rating links to `D.reviewsUrl`.

**New sections:** `#benefits` (copy.benefits + D.benefits), `#compare` (copy.compare + D.compare), `#facts` (black-on-white label + directions/warning/FDA, which the footer links to), and the mobile sticky bar `#sticky` (< 900px; hidden over the hero, `#shop` and the open cart). The standards bento is now 4 tiles from `copy.v3.standards`, with `guarantee.body` under it.

**Fixes:** P1 minmax grids · P2 tiles go 1-col under 560px · P3 hero height = 100svh minus the bar (`--barh`), so the CTA sits above the fold at 320–430 · the bar shows 2 items on phones and the header sits below it · P5 no idle drift under 900px · P6/P7 cart gap, the button no longer shrinks, and a sticky cart footer (total + disclosure + checkout) · 44px targets (switch hit area, freq pills, footer links, nav) · light `--mute` #5C606C · inactive steps at .6 · light-theme frosted header over the white film under 760px · reduced motion: no film autoplay, no entrance tweens, hero card forced visible.

**Copy gaps (no D.copy string, kept as UI microcopy):** "From", "reviews", "Drag to turn", "per capsule", "Save", "Your cart", "Added to cart", "View cart", "Shipping:", footer headings Shop/Learn/Support, "Privacy", "Terms", the label nomenclature (Supplement Facts, Serving Size, Servings Per Container, Amount Per Capsule, % Daily Value**, Other Ingredients:, Allergy Information:, Directions, Warning), and the preview-only checkout note. Nav labels reuse section eyebrows (benefits/routine/uses/faq) plus facts.h. The header CTA shows only the first word of `cta.shop` under 900px.
**D.copy strings not used on V3** (no equivalent V3 section): hero.eyebrow/body/note, trust (except [1]), oneCapsule.eyebrow/p1/p2, ingredients.eyebrow/h/lede/alsoLabel (V3 uses v3.inside), bundles.eyebrow/h, plans.subBody/onceH/onceBody/both, guarantee.badge/h, reviews.eyebrow, cta.reviews.
**For the coordinator:** a one-time checkoutUrl ends with a trailing `?` when there are no UTMs (`/cart/45002639769902:1?`). That's harmless, but it lives in the shared `checkoutUrl`.
