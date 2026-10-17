# NZT48 on Shopify (staging)

The three NZT48 versions run as hidden templates on the unpublished preview theme
**"LX Funnel Preview - Super Greens" (#190316445998)**. Nothing is on the live theme.

## Share links
- V1 · 3D: https://www.limitlessx.com/pages/returns-exchanges?view=nzt48-v1&preview_theme_id=190316445998
- V2 · Magazine: https://www.limitlessx.com/pages/returns-exchanges?view=nzt48-v2&preview_theme_id=190316445998
- V3 · Cinematic: https://www.limitlessx.com/pages/returns-exchanges?view=nzt48-v3&preview_theme_id=190316445998

`returns-exchanges` is only a host page; `?view=` swaps in the NZT48 template. The links work for anyone
while the preview theme exists. Checkout is switched off in these builds.

## Update after design changes
```bash
python3 build_nzt.py            # design_handoff_nzt48/ -> ../shopify-theme/
cd ../shopify-theme && find . -name '._*' -delete
shopify theme push --store thelimitlesspill.myshopify.com --theme 190316445998 --path . \
  --only 'layout/lx-nzt.liquid' --only 'sections/lx-nzt48-*' --only 'templates/page.nzt48-*' --only 'assets/lx-nzt-*' --nodelete
```

## How it works
Theme assets are one flat folder, so the build renames every file (`assets/photos/x.webp` → `lx-nzt-photos-x.webp`,
`3d/vendor/y.js` → `lx-nzt-3d-vendor-y.js`) and rewrites every reference, including the 3D module imports.
The layout (`lx-nzt.liquid`) sets `<base href>` to the theme's asset folder so names built at runtime still resolve,
and routes `#anchor` and version-switch links so they stay on the page. Page markup is wrapped in `{% raw %}`
because the designs use `{{ }}` templates. Don't hand-edit `shopify-theme/`; change the design and rebuild.

This is a staging build (the designs' own runtime, unchanged). A production build should render server-side
and wire real cart/checkout like the Super Greens build.
