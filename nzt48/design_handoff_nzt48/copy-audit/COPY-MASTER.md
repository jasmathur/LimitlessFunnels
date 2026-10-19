# NZT48 Original: approved master copy (Oct 18, 2026)

**The words live in `nzt48-shared.js` → `D.copy`, `D.benefits`, `D.ingredients`, `D.notes`, `D.scenarios`, `D.compare`, `D.faq`, `D.fda`, `D.warning`.** Pages read them from there; they do not retype them. This file records the decisions and what still needs approval.

Inputs: `facts-verified.md` (live site, Oct 18), `competitors.md`, and the three page audits `v1-3d.md`, `v2-magazine.md`, `v3-cinematic.md`.

## Rules for every page
1. Equivalent sections use the same `D.copy` strings. The only allowed differences are line breaks, CSS `text-transform`, italic or emphasis spans that wrap existing words, and container sizing.
2. Headings and buttons are Title Case as written in `D.copy`. Body copy and disclosures are sentence case.
3. Every structure/function line keeps its `*`, and `D.fda` appears on the page.
4. The renewal disclosure (`disclosure` from `vals()`) sits next to every subscription CTA.
5. No Made in USA or GMP claims anywhere (unverified; withheld). No "money-back guarantee" wording (see decision 1).
6. Keep 30/60/90. These sizes are already live in these routes and on limitlessx.com, which the command allows. Nothing new is added.

## Decisions
| # | Decision | Why |
|---|---|---|
| 1 | "30-day money-back guarantee" → **"30-day returns"**, with the condition stated in the Guarantee section and FAQ | The Returns Policy is 30 days from the order date and requires the bottle back at least 90% full (27+ capsules). A bare "money-back guarantee" would overstate it. |
| 2 | Hero leads with **"The Limitless Pill."** + "Focus support in a single daily capsule.*" | The command requires the campaign line to lead. V2's H1 was the strongest version. |
| 3 | Benefits are now Alertness / **Calm Focus** / **Cognitive Support** / Everyday Stress | The old "Mental Energy" (B-Complex, Benfotiamine, ALCAR) and NALT-for-focus claims weren't in the claim matrix, and "every ingredient is there for one of these reasons" was false. |
| 4 | Competitor counts stay at Alpha BRAIN® 2 and Qualia Mind® 6, checked Oct 18 | Verified on the brands' own labels. The command's "Qualia 4" is wrong (4 is Alpha BRAIN Black Label, a different product). |
| 5 | "a fully listed blend" → "every ingredient listed on the label" | It's a proprietary blend; amounts aren't listed. |
| 6 | "Most people take it in the morning…" → "A morning or lunchtime capsule keeps the caffeine away from bedtime." | "Most people" was an unsupported usage claim. |
| 7 | "Save up to 20% on every order" → "Subscribe & Save up to 20%" + "20% off every 30 days · 15% off every 45, 60 or 90 days" | The 45/60/90-day plans are 15%. |
| 8 | Mucuna/Rauwolcine notes drop "L-DOPA" / "related to yohimbine" | Identity only; avoids drug-adjacent wording on a consumer page. |
| 9 | Analytics: every event now carries `version`, `theme` and `variant_label` (e.g. `v3-cinematic-light`) | Command §10: Cinematic Light/Dark must be measurable separately. |
| 10 | Returns links → `https://www.limitlessx.com/policies/refund-policy` (`D.returnsUrl`) | The old relative link 404s. |

## Claim matrix (approved wording)
Amounts are undisclosed inside the 750mg blend, so there are no dose-dependent claims and no finished-product clinical claims.

| Ingredient | Evidence (healthy adults) | Approved claim |
|---|---|---|
| Caffeine HCL + Guarana | Strong for alertness | Helps you feel more awake and alert.* |
| L-Theanine (with caffeine) | Moderate, mixed | Paired with the caffeine for focus support.* |
| Alpha GPC | Choline source; most studies use larger doses | Provides choline.* |
| Bacopaside, Ginkgo, Phosphatidylserine | Mixed to moderate, at larger doses | Cognitive support.* No memory claim. |
| Huperzine A | Mostly clinical populations | No benefit claim. |
| Ashwagandha + Rhodiola | Moderate for occasional stress | Support your response to everyday stress.* |
| The other 13 | Not reviewed | Identity notes only (`D.notes`). |

Never: guaranteed focus, instant/fast-acting, IQ, memory improvement, mood, energy "with no crash", neuroprotection, anti-aging, or ADHD/dementia/depression or any condition.

## Blocks launch: needs business, compliance or counsel
1. **Product art shows the wrong label.** The 3D bottle texture (`3d/label-v2/source-label.png`), `assets/bottle.png` and several `assets/photos/*` shots show "60 CAPS", an older formula (Synephrine, Vinpocetine), and claims beyond the matrix ("Increase cognitive power", "Sharpen focus & memory", "Elevate mood"). New label art is needed from the current 30-count shipping label. This can't be fixed in copy.
2. Returns condition (27+ capsules) vs the expectation set by "30-day returns": confirm the wording with counsel, or change the policy to a true satisfaction guarantee.
3. Subscription shipping: the live PDP shows "Free Shipping" on the $47.96 subscription, but the pages use the $70 threshold.
4. Made in USA / GMP: withheld until documented.
5. "The Limitless Pill" trademark clearance; the non-affiliation footer line stays pending counsel.
6. Caffeine mg is undisclosed (the live comparison image says 200mg, which isn't on the label).
7. The live PDP images carry non-compliant claims (ADHD testimonial, "proven", "all-natural", "fast-acting"). Out of scope for these pages; flag for the Limitless X team.
8. V2 scenario photos are Unsplash hotlinks, and its hero and routine slots need real photography.
