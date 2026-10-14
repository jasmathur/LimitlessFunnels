/* Limitless X funnel runtime.
   Renders a funnel page template + logic class (exported from the Claude Design prototypes)
   with a tiny virtual DOM. Supports {{ expr }}, <sc-if>, <sc-for>, style objects, on* events,
   style-hover / style-active pseudo classes, and hydration of server-rendered HTML. */
(function () {
  'use strict';

  /* ---------- expressions (same rules as the prototype) ---------- */
  var IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*/, NUMBER_RE = /^-?\d+(\.\d+)?$/;
  function resolve(vals, src) {
    var expr = String(src).trim();
    if (!expr) return undefined;
    if (expr[0] === '(' && expr[expr.length - 1] === ')' && wrapsWhole(expr)) return resolve(vals, expr.slice(1, -1));
    var eq = topEquality(expr);
    if (eq) {
      var l = resolve(vals, expr.slice(0, eq.i)), r = resolve(vals, expr.slice(eq.i + eq.op.length));
      return eq.op === '===' ? l === r : eq.op === '!==' ? l !== r : eq.op === '==' ? l == r : l != r;
    }
    if (expr[0] === '!') return !resolve(vals, expr.slice(1));
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null') return null;
    if (expr === 'undefined') return undefined;
    if (NUMBER_RE.test(expr)) return Number(expr);
    if (expr.length >= 2 && (expr[0] === '"' || expr[0] === "'") && expr[expr.length - 1] === expr[0]) return expr.slice(1, -1);
    return resolvePath(vals, expr);
  }
  function wrapsWhole(e) {
    var d = 0;
    for (var i = 0; i < e.length - 1; i++) { if (e[i] === '(') d++; else if (e[i] === ')') { d--; if (d === 0) return false; } }
    return true;
  }
  function topEquality(e) {
    var d = 0;
    for (var i = 0; i < e.length; i++) {
      var c = e[i];
      if (c === '[' || c === '(') d++;
      else if (c === ']' || c === ')') d--;
      else if (d === 0 && (c === '=' || c === '!') && e[i + 1] === '=') {
        if (i > 0 && (e[i - 1] === '=' || e[i - 1] === '!')) continue;
        if (!e.slice(0, i).trim()) continue;
        return { i: i, op: e[i + 2] === '=' ? c + '==' : c + '=' };
      }
    }
    return null;
  }
  function resolvePath(vals, e) {
    var head = e.match(IDENT_RE); if (!head) return undefined;
    var cur = vals == null ? undefined : vals[head[0]], i = head[0].length;
    while (i < e.length) {
      if (e[i] === '.') {
        var m = e.slice(i + 1).match(IDENT_RE) || e.slice(i + 1).match(/^\d+/);
        if (!m) return undefined;
        cur = cur == null ? undefined : cur[m[0]]; i += 1 + m[0].length;
      } else if (e[i] === '[') {
        var depth = 1, j = i + 1;
        while (j < e.length && depth > 0) { if (e[j] === '[') depth++; else if (e[j] === ']') { depth--; if (!depth) break; } j++; }
        if (depth) return undefined;
        var k = resolve(vals, e.slice(i + 1, j));
        cur = cur == null ? undefined : cur[k]; i = j + 1;
      } else return undefined;
    }
    return cur;
  }
  function compileAttr(raw) {
    var whole = raw.match(/^\s*\{\{([\s\S]+?)\}\}\s*$/);
    if (whole) return function (v) { return resolve(v, whole[1]); };
    if (raw.indexOf('{{') > -1) {
      var parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
      return function (v) { return parts.map(function (s, i) { if (!(i & 1)) return s; var r = resolve(v, s); return r == null ? '' : r; }).join(''); };
    }
    return function () { return raw; };
  }

  /* ---------- styles ---------- */
  var UNITLESS = /^(opacity|zIndex|flex|flexGrow|flexShrink|order|fontWeight|lineHeight|zoom|gridRow|gridColumn|aspectRatio|scale|animationIterationCount|fillOpacity|strokeOpacity|strokeDashoffset|strokeWidth|columnCount|tabSize|orphans|widows)$/;
  function cssToObj(css) {
    var o = {};
    String(css).split(';').forEach(function (decl) {
      var i = decl.indexOf(':'); if (i < 0) return;
      var p = decl.slice(0, i).trim(); if (!p) return;
      o[p.indexOf('--') === 0 ? p : p.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); })] = decl.slice(i + 1).trim();
    });
    return o;
  }
  function kebab(k) {
    if (k.indexOf('--') === 0) return k;
    var s = k.replace(/[A-Z]/g, function (c) { return '-' + c.toLowerCase(); });
    return s.indexOf('ms-') === 0 ? '-' + s : s;
  }
  function cssVal(k, v) {
    if (v == null || v === false || v === '') return null;
    if (typeof v === 'number') return (v === 0 || UNITLESS.test(k) || k.indexOf('--') === 0) ? String(v) : v + 'px';
    return String(v);
  }
  function setStyle(st, k, v) {
    var name = kebab(k), val = cssVal(k, v);
    if (val == null) { st.removeProperty(name); return; }
    var imp = /\s*!\s*important\s*$/i;
    if (imp.test(val)) st.setProperty(name, val.replace(imp, ''), 'important');
    else st.setProperty(name, val);
  }
  function styleText(obj) {
    var out = [];
    for (var k in obj) { var v = cssVal(k, obj[k]); if (v != null) out.push(kebab(k) + ':' + v); }
    return out.join(';');
  }

  var pseudoSheet = null, pseudoCache = {}, pseudoN = 0;
  function importantify(css) {
    return String(css).split(/;(?![^(]*\))/).map(function (d) { return d.trim(); }).filter(Boolean)
      .map(function (d) { return /!\s*important$/i.test(d) ? d : d + ' !important'; }).join(';');
  }
  function pseudoClass(pseudo, css) {
    var key = pseudo + '|' + css;
    if (pseudoCache[key]) return pseudoCache[key];
    var cls = 'lxp' + (pseudoN++).toString(36);
    if (typeof document !== 'undefined') {
      if (!pseudoSheet) { pseudoSheet = document.createElement('style'); document.head.appendChild(pseudoSheet); }
      var el = pseudo === 'before' || pseudo === 'after';
      try { pseudoSheet.sheet.insertRule('.' + cls + (el ? '::' : ':') + pseudo + '{' + (el ? css : importantify(css)) + '}', pseudoSheet.sheet.cssRules.length); } catch (e) {}
    }
    LXDC.pseudoCss.push({ cls: cls, pseudo: pseudo, css: css });
    pseudoCache[key] = cls;
    return cls;
  }

  /* ---------- compile template -> builders ---------- */
  var RAW = { select: 'sc-raw-select', table: 'sc-raw-table', tbody: 'sc-raw-tbody', thead: 'sc-raw-thead', tfoot: 'sc-raw-tfoot', tr: 'sc-raw-tr', td: 'sc-raw-td', th: 'sc-raw-th', caption: 'sc-raw-caption' };
  var UNRAW = {}; Object.keys(RAW).forEach(function (k) { UNRAW[RAW[k]] = k; });
  var EVT = { onclick: 'click', onchange: 'change', oninput: 'input', onsubmit: 'submit', onkeydown: 'keydown', onkeyup: 'keyup', onmouseenter: 'mouseenter', onmouseleave: 'mouseleave', onmousedown: 'mousedown', onmouseup: 'mouseup', onmousemove: 'mousemove', onpointerdown: 'pointerdown', onpointerup: 'pointerup', onpointermove: 'pointermove', onpointercancel: 'pointercancel', onpointerenter: 'pointerenter', onpointerleave: 'pointerleave', onfocus: 'focus', onblur: 'blur', ontouchstart: 'touchstart', ontouchend: 'touchend', ontouchmove: 'touchmove', onanimationend: 'animationend', onanimationstart: 'animationstart', ontransitionend: 'transitionend', onscroll: 'scroll' };

  function compile(html, doc) {
    html = html.replace(/<(x-import|dc-import)((?:[^>"']|"[^"]*"|'[^']*')*)\/>/gi, '<$1$2></$1>');
    Object.keys(RAW).forEach(function (real) { html = html.replace(new RegExp('(</?)' + real + '(?=[\\s>])', 'gi'), '$1' + RAW[real]); });
    var tpl = doc.createElement('template');
    tpl.innerHTML = html;
    var builders = kidsOf(tpl.content);
    return function (vals) { return builders.map(function (b) { return b(vals); }); };
  }
  function kidsOf(node) {
    var out = [];
    for (var c = node.firstChild; c; c = c.nextSibling) { var b = walk(c); if (b) out.push(b); }
    return out;
  }
  function walk(node) {
    if (node.nodeType === 3) return walkText(node);
    if (node.nodeType !== 1) return null;
    var tag = node.localName;
    if (tag === 'sc-for') return walkFor(node);
    if (tag === 'sc-if') return walkIf(node);
    if (tag === 'sc-helmet' || tag === 'helmet' || tag === 'script') return null;
    if (tag === 'x-import') return walkImageSlot(node);
    return walkEl(node);
  }
  function walkText(node) {
    var txt = node.nodeValue || '';
    if (txt.indexOf('{{') < 0) {
      if (!txt.trim() && txt.indexOf(' ') < 0) return null;
      return function () { return { t: 3, v: txt }; };
    }
    var parts = txt.split(/\{\{([\s\S]+?)\}\}/g);
    return function (vals) {
      var kids = parts.map(function (p, i) {
        if (!(i & 1)) return p ? { t: 3, v: p } : null;
        var v = resolve(vals, p);
        if (v == null || typeof v === 'boolean') return null;
        return { t: 1, tag: 'span', ns: null, a: { 'class': 'sc-interp' }, s: null, ev: null, k: [{ t: 3, v: String(v) }] };
      });
      return { t: 0, k: kids };
    };
  }
  function walkFor(el) {
    var get = compileAttr(el.getAttribute('list') || ''), as = el.getAttribute('as') || 'item', kids = kidsOf(el);
    return function (vals) {
      var list = get(vals); if (!Array.isArray(list)) list = [];
      return { t: 0, k: list.map(function (item, i) {
        var sub = Object.create(vals); sub[as] = item; sub.$index = i;
        return { t: 0, k: kids.map(function (b) { return b(sub); }) };
      }) };
    };
  }
  function walkIf(el) {
    var get = compileAttr(el.getAttribute('value') || ''), kids = kidsOf(el);
    return function (vals) { return get(vals) ? { t: 0, k: kids.map(function (b) { return b(vals); }) } : null; };
  }
  function walkImageSlot(el) {
    var src = compileAttr(el.getAttribute('src') || ''), alt = el.getAttribute('placeholder') || '', r = el.getAttribute('radius') || '0';
    var style = cssToObj(el.getAttribute('style') || '');
    return function (vals) {
      var s = Object.assign({ display: 'block', width: '100%', height: '100%', objectFit: 'cover', borderRadius: r + 'px' }, style);
      return { t: 1, tag: 'img', ns: null, a: { src: src(vals), alt: '', loading: 'lazy', decoding: 'async', 'data-slot': alt }, s: s, ev: null, k: [] };
    };
  }
  function walkEl(el) {
    var tag = UNRAW[el.localName] || el.localName, ns = el.namespaceURI === 'http://www.w3.org/2000/svg' ? 'svg' : null;
    if (ns) tag = el.tagName; // keep SVG case (linearGradient, foreignObject…)
    var attrs = [], evs = [], pseudo = [], styleGet = null;
    for (var i = 0; i < el.attributes.length; i++) {
      var at = el.attributes[i], n = at.name, v = at.value;
      if (n === 'data-dc-tpl' || n === 'sc-name' || n.indexOf('hint-') === 0) continue;
      if (n.indexOf('style-') === 0) { pseudo.push([n.slice(6), compileAttr(v)]); continue; }
      if (n === 'style') { styleGet = compileAttr(v); continue; }
      if (/^on[a-z]+$/.test(n) && v.indexOf('{{') > -1) { evs.push([EVT[n] || n.slice(2), compileAttr(v)]); continue; }
      attrs.push([n, compileAttr(v)]);
    }
    var kids = kidsOf(el.localName === 'template' ? el.content : el);
    return function (vals) {
      var a = {}, ev = null, s = null;
      for (var i = 0; i < attrs.length; i++) a[attrs[i][0]] = attrs[i][1](vals);
      if (pseudo.length) a['class'] = [a['class']].concat(pseudo.map(function (p) { return pseudoClass(p[0], p[1](vals)); })).filter(Boolean).join(' ');
      if (styleGet) { s = styleGet(vals); if (typeof s === 'string') s = cssToObj(s); else if (!s || typeof s !== 'object') s = null; }
      if (evs.length) { ev = {}; for (var j = 0; j < evs.length; j++) { var f = evs[j][1](vals); if (typeof f === 'function') ev[evs[j][0]] = f; } }
      if (tag === 'input' || tag === 'textarea') {
        if ('value' in a && a.value === undefined) a.value = '';
        if ('checked' in a && a.checked === undefined) a.checked = false;
      }
      return { t: 1, tag: tag, ns: ns, a: a, s: s, ev: ev, k: kids.map(function (b) { return b(vals); }) };
    };
  }

  /* ---------- DOM patching (React-like: only touches what changed between renders) ---------- */
  var PROPS = { value: 1, checked: 1, selected: 1 };
  function attrStr(n, v) {
    if (typeof v === 'function') return undefined;
    if (v == null) return undefined;
    if (v === false) return /^(aria|data)-/.test(n) ? 'false' : undefined;
    if (v === true) return /^(aria|data)-/.test(n) ? 'true' : '';
    return String(v);
  }
  function setAttr(dom, n, v) {
    if (PROPS[n] && n in dom) {
      if (n === 'value') { var sv = v == null ? '' : String(v); if (dom.value !== sv) dom.value = sv; }
      else dom[n] = !!v;
      return;
    }
    var s = attrStr(n, v);
    if (s === undefined) dom.removeAttribute(n); else if (dom.getAttribute(n) !== s) dom.setAttribute(n, s);
  }
  function bindEvents(dom, ev) {
    dom.__lxh = ev || {};
    if (!ev) return;
    var on = dom.__lxon || (dom.__lxon = {});
    Object.keys(ev).forEach(function (type) {
      if (on[type]) return;
      on[type] = true;
      var real = type;
      if (type === 'change' && dom.localName === 'input' && !/^(checkbox|radio|file)$/i.test(dom.type)) real = 'input';
      dom.addEventListener(real, function (e) { var f = dom.__lxh && dom.__lxh[type]; if (f) f(e); }, /^(touch|wheel|scroll)/.test(real) ? { passive: true } : false);
    });
  }
  function create(vn) {
    if (!vn) return vn;
    if (vn.t === 3) { vn.d = document.createTextNode(vn.v); return vn; }
    if (vn.t === 0) { vn.k = vn.k.map(create); return vn; }
    var d = vn.ns ? document.createElementNS('http://www.w3.org/2000/svg', vn.tag) : document.createElement(vn.tag);
    vn.d = d;
    for (var n in vn.a) if (!PROPS[n]) setAttr(d, n, vn.a[n]);
    if (vn.s) for (var k in vn.s) setStyle(d.style, k, vn.s[k]);
    bindEvents(d, vn.ev);
    vn.k = vn.k.map(create);
    nodes(vn.k).forEach(function (c) { d.appendChild(c); });
    for (var p in vn.a) if (PROPS[p]) setAttr(d, p, vn.a[p]);
    return vn;
  }
  function nodes(list, out) {
    out = out || [];
    for (var i = 0; i < list.length; i++) {
      var v = list[i]; if (!v) continue;
      if (v.t === 0) nodes(v.k, out); else out.push(v.d);
    }
    return out;
  }
  function same(o, n) { return o && n && o.t === n.t && (o.t !== 1 || (o.tag === n.tag && o.ns === n.ns)); }
  function patchList(olds, news, gone) {
    var len = Math.max(olds.length, news.length), out = [];
    for (var i = 0; i < len; i++) {
      var o = olds[i], n = news[i];
      if (i >= news.length) { if (o) gone.push.apply(gone, nodes([o])); continue; }
      if (!n) { if (o) gone.push.apply(gone, nodes([o])); out.push(n); continue; }
      if (same(o, n)) out.push(patch(o, n, gone));
      else { if (o) gone.push.apply(gone, nodes([o])); out.push(create(n)); }
    }
    return out;
  }
  function patch(o, n, gone) {
    if (n.t === 3) { n.d = o.d; if (o.v !== n.v) n.d.data = n.v; return n; }
    if (n.t === 0) { n.k = patchList(o.k, n.k, gone); return n; }
    var d = n.d = o.d, k;
    for (k in o.a) if (!(k in n.a)) d.removeAttribute(k);
    for (k in n.a) if (PROPS[k] ? true : o.a[k] !== n.a[k]) setAttr(d, k, n.a[k]);
    var os = o.s || {}, ns = n.s || {};
    for (k in os) if (!(k in ns)) setStyle(d.style, k, null);
    for (k in ns) if (os[k] !== ns[k]) setStyle(d.style, k, ns[k]);
    bindEvents(d, n.ev);
    patchKids(d, o.k, n.k);
    return n;
  }
  function patchKids(parent, olds, news) {
    var gone = [], out = patchList(olds, news, gone);
    news.length = 0; Array.prototype.push.apply(news, out);
    var want = nodes(out), keep = new Set(want);
    gone.forEach(function (g) { if (!keep.has(g) && g.parentNode === parent) parent.removeChild(g); });
    var prev = null;
    for (var i = 0; i < want.length; i++) {
      var at = prev ? prev.nextSibling : parent.firstChild;
      if (at !== want[i]) parent.insertBefore(want[i], at);
      prev = want[i];
    }
  }

  /* ---------- hydrate server-rendered HTML ---------- */
  function hydrateKids(parent, list) {
    var dom = [];
    for (var c = parent.firstChild; c; c = c.nextSibling) if (c.nodeType === 1 || c.nodeType === 3) dom.push(c);
    var idx = { i: 0 };
    hydList(list, dom, idx);
    if (idx.i !== dom.length) throw new Error('extra nodes');
  }
  function hydList(list, dom, idx) {
    for (var i = 0; i < list.length; i++) {
      var v = list[i]; if (!v) continue;
      if (v.t === 0) { hydList(v.k, dom, idx); continue; }
      var d = dom[idx.i];
      if (v.t === 3) {
        // The HTML parser merges adjacent text nodes and may drop whitespace: split / re-create as needed.
        if (d && d.nodeType === 3 && d.data !== v.v && v.v && d.data.indexOf(v.v) === 0) dom.splice(idx.i + 1, 0, d.splitText(v.v.length));
        else if (!v.v.trim() && (!d || d.nodeType !== 3)) {
          var t = document.createTextNode(v.v);
          if (d) d.parentNode.insertBefore(t, d); else if (dom.length) dom[dom.length - 1].parentNode.appendChild(t); else throw new Error('missing node');
          dom.splice(idx.i, 0, t); d = t;
        }
      }
      idx.i++;
      if (!d) throw new Error('missing node');
      if (v.t === 3) { if (d.nodeType !== 3 || d.data !== v.v) throw new Error('text mismatch ' + JSON.stringify(String(v.v).slice(0, 40)) + ' vs ' + JSON.stringify(d.nodeType === 3 ? d.data.slice(0, 40) : d.nodeName)); v.d = d; continue; }
      if (d.nodeType !== 1 || (v.ns ? d.tagName !== v.tag : d.localName !== v.tag)) throw new Error('tag mismatch ' + v.tag + ' vs ' + d.nodeName + ' ' + JSON.stringify(d.nodeType === 3 ? d.data.slice(0, 40) : ''));
      v.d = d;
      for (var p in v.a) if (PROPS[p]) setAttr(d, p, v.a[p]);
      bindEvents(d, v.ev);
      hydrateKids(d, v.k);
    }
  }

  /* ---------- server-side HTML (used by the build to pre-render) ---------- */
  var VOID = /^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/;
  function esc(s, q) { s = String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); return q ? s.replace(/"/g, '&quot;') : s; }
  function toHTML(list, rawText) {
    var out = '';
    for (var i = 0; i < list.length; i++) {
      var v = list[i]; if (!v) continue;
      if (v.t === 0) { out += toHTML(v.k, rawText); continue; }
      if (v.t === 3) { out += rawText ? v.v : esc(v.v); continue; }
      out += '<' + v.tag;
      for (var n in v.a) {
        var s = (n === 'checked' || n === 'selected') ? (v.a[n] ? '' : undefined) : attrStr(n, v.a[n]);
        if (s !== undefined) out += ' ' + n + (s === '' && n !== 'value' ? '' : '="' + esc(s, 1) + '"');
      }
      if (v.s) { var st = styleText(v.s); if (st) out += ' style="' + esc(st, 1) + '"'; }
      out += '>';
      if (!VOID.test(v.tag) || v.ns) out += toHTML(v.k, v.tag === 'style' || v.tag === 'script') + '</' + v.tag + '>';
    }
    return out;
  }

  /* ---------- component host ---------- */
  function Base(props) { this.props = props || {}; this.state = {}; }
  Base.prototype.setState = function (u, cb) { this.__host && this.__host.set(u, cb); };
  Base.prototype.forceUpdate = function () { this.__host && this.__host.set(null); };
  Base.prototype.componentDidMount = function () {};
  Base.prototype.componentDidUpdate = function () {};
  Base.prototype.componentWillUnmount = function () {};
  Base.prototype.renderVals = function () { return {}; };

  var defs = {};
  var LXDC = window.LXDC = {
    pseudoCss: [],
    resolve: resolve,
    register: function (name, def) { defs[name] = def; },
    // Pre-render for the build (no lifecycle, no events)
    renderHTML: function (name, doc) {
      var def = defs[name], Logic = def.logic(Base), inst = new Logic(def.props);
      inst.props = def.props;
      var tree = compile(def.tpl, doc)(Object.assign({}, def.props, inst.renderVals()));
      return toHTML(tree);
    },
    mount: function (name, root, extraProps) {
      var d0 = defs[name]; if (!d0) throw new Error('LXDC: unknown page ' + name);
      var def = { tpl: d0.tpl, logic: d0.logic, props: Object.assign({}, d0.props, extraProps || {}) };
      var render = compile(def.tpl, document), Logic = def.logic(Base), inst = new Logic(def.props);
      inst.props = def.props;
      var tree = null, queue = [], cbs = [], scheduled = false;
      function vals() { return Object.assign({}, def.props, inst.renderVals()); }
      function flush() {
        scheduled = false;
        var prev = inst.state, next = Object.assign({}, prev);
        queue.splice(0).forEach(function (u) { if (u) Object.assign(next, typeof u === 'function' ? u(next, inst.props) : u); });
        inst.state = next;
        var nt; try { nt = render(vals()); } catch (e) { console.error('LXDC render', e); return; }
        patchKids(root, tree, nt);
        tree = nt;
        try { inst.componentDidUpdate(inst.props, prev); } catch (e) { console.error(e); }
        cbs.splice(0).forEach(function (f) { try { f(); } catch (e) { console.error(e); } });
      }
      inst.__host = {
        set: function (u, cb) {
          queue.push(u); if (cb) cbs.push(cb);
          if (!scheduled) { scheduled = true; (window.queueMicrotask || function (f) { Promise.resolve().then(f); })(flush); }
        }
      };
      tree = render(vals());
      var hydrated = false;
      if (root.hasAttribute('data-ssr')) {
        try { hydrateKids(root, tree); hydrated = true; } catch (e) { LXDC.hydrateError = e.message; console.info('LXDC: re-rendering (' + e.message + ')'); tree = render(vals()); }
      }
      if (!hydrated) { root.textContent = ''; tree = tree.map(create); nodes(tree).forEach(function (n) { root.appendChild(n); }); }
      LXDC.hydrated = hydrated;
      root.removeAttribute('data-ssr');
      try { inst.componentDidMount(); } catch (e) { console.error('LXDC mount', e); }
      return inst;
    }
  };
})();
