#!/usr/bin/env python3
"""NZT48 staging build: design_handoff_nzt48/ -> shopify-theme/ (hidden templates for a preview theme).

Shopify theme assets live in one flat folder, so every file gets a flat, prefixed name
(assets/photos/x.webp -> lx-nzt-photos-x.webp, 3d/vendor/y.js -> lx-nzt-3d-vendor-y.js) and every
reference in the pages and the 3D modules is rewritten to match. The layout sets <base href> to the
theme's asset folder, so relative names (including ones built at runtime) resolve to the CDN.

Run:  python3 build_nzt.py      (stdlib only)
"""
import json, os, posixpath, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'design_handoff_nzt48')
OUT = os.path.join(HERE, '..', 'shopify-theme')
HOST = '/pages/returns-exchanges'  # existing page that hosts the alternate templates (?view=...)
PAGES = {'nzt48-v1': 'NZT48 V1 - 3D.dc.html', 'nzt48-v2': 'NZT48 V2 - Magazine.dc.html', 'nzt48-v3': 'NZT48 V3 - Cinematic.html'}
THEMED = {'nzt48-v1', 'nzt48-v3'}  # pages that carry the Dark/Light toggle
SKIP_DIRS = {'archive', '3d/label-v2', '3d/look-ref'}
SKIP_FILES = {'assets/nzt48-float.webm'}


def flat(path):
    """'assets/photos/a.webp' -> 'lx-nzt-photos-a.webp'; '3d/x/y.js' -> 'lx-nzt-3d-x-y.js'; 'support.js' -> 'lx-nzt-support.js'."""
    p = path[len('assets/'):] if path.startswith('assets/') else path
    return 'lx-nzt-' + p.replace('/', '-')


PATH_RE = re.compile(r"(?<![\w/.:-])(\./)?((?:assets|3d)/[\w\-./%]*)")
ROOT_RE = re.compile(r"\./(support\.js|version-switch\.js|nzt48-shared\.js)")


def rewrite_refs(text):
    text = ROOT_RE.sub(lambda m: './' + flat(m.group(1)), text)
    text = PATH_RE.sub(lambda m: (m.group(1) or '') + flat(m.group(2)), text)  # keep './' so module imports stay relative
    for view, name in PAGES.items():  # cross-version links
        text = text.replace(name.replace(' ', '%20'), f'{HOST}?view={view}').replace(name, f'{HOST}?view={view}')
    return text.replace('../../pages/returns-exchanges/index.html', HOST)


def rewrite_module(text, rel):
    """Resolve relative import specifiers of a 3D module against its own folder, then flatten."""
    here = posixpath.dirname(rel)
    def fix(m):
        spec, q = m.group(2), ''
        if '?' in spec: spec, q = spec.split('?', 1); q = '?' + q
        return m.group(1) + './' + flat(posixpath.normpath(posixpath.join(here, spec))) + q + m.group(3)
    return re.sub(r"""((?:from|import)\s*\(?\s*['"])(\.{1,2}/[^'"]+)(['"])""", fix, text)


def switcher(text):
    text = text.replace("file: 'NZT48 V1 - 3D.dc.html'", "file: 'nzt48-v1'").replace("file: 'NZT48 V2 - Magazine.dc.html'", "file: 'nzt48-v2'").replace("file: 'NZT48 V3 - Cinematic.html'", "file: 'nzt48-v3'")
    text = text.replace("var path = decodeURIComponent(location.pathname);\n  var cur = VERSIONS.findIndex(function (x) { return path.endsWith('/' + x.file); });",
                        "var view = new URLSearchParams(location.search).get('view');\n  var cur = VERSIONS.findIndex(function (x) { return x.file === view; });")
    text = text.replace("location.href = encodeURI(x.file) + (id ? '#v=' + id : '');",
                        "var q = new URLSearchParams(location.search); q.set('view', x.file); location.href = location.pathname + '?' + q.toString() + (id ? '#v=' + id : '');")
    assert "nzt48-v1" in text and "URLSearchParams(location.search).get('view')" in text, 'switcher patch failed'
    return text


def split_doc(html):
    head = re.search(r'<head>(.*?)</head>', html, re.S).group(1)
    body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)
    head = re.sub(r'<meta charset[^>]*>|<meta name="viewport"[^>]*>', '', head)
    return head, body


def main():
    if os.path.isdir(OUT): shutil.rmtree(OUT, ignore_errors=True)  # macOS ._ files on external drives vanish mid-walk
    for d in ('assets', 'layout', 'sections', 'templates', 'config', 'locales', 'snippets'):
        os.makedirs(os.path.join(OUT, d))
    # 1. assets (binary copy) + JS modules (rewritten)
    n = 0
    for root, dirs, files in os.walk(SRC):
        rel_root = os.path.relpath(root, SRC).replace(os.sep, '/')
        if rel_root == '.': rel_root = ''
        if any(rel_root == s or rel_root.startswith(s + '/') for s in SKIP_DIRS): continue
        for f in files:
            rel = (rel_root + '/' + f).lstrip('/')
            if f.startswith('._') or f.endswith(('.md', '.html')) or rel in SKIP_FILES: continue
            if not (rel.startswith(('assets/', '3d/')) or f in ('support.js', 'nzt48-shared.js', 'version-switch.js')): continue
            dst = os.path.join(OUT, 'assets', flat(rel))
            if rel.startswith('3d/') and f.endswith('.js'):
                open(dst, 'w').write(rewrite_module(open(os.path.join(root, f)).read(), rel))
            elif f == 'version-switch.js':
                open(dst, 'w').write(switcher(open(os.path.join(root, f)).read()))
            elif f == 'nzt48-shared.js':
                open(dst, 'w').write(rewrite_refs(open(os.path.join(root, f)).read()))
            else:
                shutil.copyfile(os.path.join(root, f), dst)
            n += 1
    # 2. layout: bare document, <base> at the theme asset folder, in-page links kept working
    open(os.path.join(OUT, 'layout', 'lx-nzt.liquid'), 'w').write("""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{%- assign lxa = 'lx-nzt-support.js' | asset_url | split: 'lx-nzt-support.js' | first -%}
<base href="{{ lxa }}">
<title>NZT48 Original · The Limitless Pill · Limitless X</title>
<meta name="robots" content="noindex,nofollow">
{{ content_for_header }}
<script>
/* With <base> pointing at the asset folder, plain #anchors and version links would leave the page: route them here instead. */
addEventListener('click', function (e) {
  if (e.defaultPrevented) return;
  var a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
  var h = a.getAttribute('href');
  if (h.charAt(0) === '#') { e.preventDefault(); var el = h.length > 1 && document.querySelector(h); if (el) el.scrollIntoView({ behavior: 'smooth' }); return; }
  if (h.indexOf('view=nzt48') > -1) { e.preventDefault(); var u = new URL(h, location.origin), pt = new URLSearchParams(location.search).get('preview_theme_id'); if (pt) u.searchParams.set('preview_theme_id', pt); location.href = u.pathname + u.search + u.hash; }
});
</script>
</head>
<body>
{{ content_for_layout }}
</body>
</html>
""")
    # 3. one section + one template per version
    for view, name in PAGES.items():
        head, body = split_doc(rewrite_refs(open(os.path.join(SRC, name)).read()))
        pre = "<script>document.documentElement.setAttribute('data-themeable','')</script>\n" if view in THEMED else ''
        sec = f"{{% raw %}}\n{pre}{head}\n{body}\n{{% endraw %}}\n{{% schema %}}\n{json.dumps({'name': name.split('.')[0], 'settings': []})}\n{{% endschema %}}\n"
        open(os.path.join(OUT, 'sections', f'lx-{view}.liquid'), 'w').write(sec)
        json.dump({'layout': 'lx-nzt', 'sections': {'main': {'type': f'lx-{view}', 'settings': {}}}, 'order': ['main']},
                  open(os.path.join(OUT, 'templates', f'page.{view}.json'), 'w'), indent=2)
    # 4. sanity: every flat name referenced in sections/assets exists
    names = set(os.listdir(os.path.join(OUT, 'assets')))
    missing = set()
    for d in ('sections', 'assets'):
        for f in os.listdir(os.path.join(OUT, d)):
            if not f.endswith(('.liquid', '.js')): continue
            for ref in re.findall(r"lx-nzt-[\w\-.%]+\.(?:webp|png|jpg|svg|mp4|webm|glb|js|ttf|woff2?)", open(os.path.join(OUT, d, f), errors='ignore').read()):
                if ref not in names: missing.add(ref)
    print(f'{n} assets, {len(PAGES)} pages ->', os.path.relpath(OUT))
    if missing: print('MISSING:', sorted(missing))


if __name__ == '__main__':
    main()
