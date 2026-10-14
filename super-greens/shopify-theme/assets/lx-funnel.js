/* Limitless X funnel: Shopify glue (cart, lead capture, UTM attributes).
   Reads window.LX_CFG, which the section prints from Liquid. */
(function () {
  'use strict';
  var cfg = window.LX_CFG || {};

  function utm() {
    try { return JSON.parse(sessionStorage.getItem('lx_utm') || '{}') || {}; } catch (e) { return {}; }
  }
  function post(url, body) {
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw j; return j; }); });
  }
  var root = (window.Shopify && Shopify.routes && Shopify.routes.root) || '/';

  function addToCart(plan, qty, el) {
    if (!cfg.variantId) { location.href = root + 'products/' + (cfg.handle || ''); return; }
    if (el) { el.style.opacity = '.6'; el.style.pointerEvents = 'none'; }
    var item = { id: cfg.variantId, quantity: qty };
    if (plan === 'sub') {
      if (cfg.sellingPlanId) item.selling_plan = cfg.sellingPlanId;
      else console.warn('LX: no Subscribe & Save selling plan found on the product; adding as one-time.');
    }
    var attrs = Object.assign({ lx_funnel: cfg.funnel || 'super-greens', lx_plan: plan, lx_qty: String(qty) }, utm());
    // Replace any Super Greens lines already in the cart so the chosen bundle is exact.
    fetch(root + 'cart.js', { credentials: 'same-origin' }).then(function (r) { return r.json(); })
      .then(function (cart) {
        var updates = {};
        (cart.items || []).forEach(function (l) { if (l.variant_id === cfg.variantId) updates[l.key] = 0; });
        return Object.keys(updates).length ? post(root + 'cart/update.js', { updates: updates }) : null;
      })
      .then(function () { return post(root + 'cart/add.js', { items: [item] }); })
      .then(function () { return post(root + 'cart/update.js', { attributes: attrs }); })
      .then(function () { location.href = cfg.afterAdd === 'checkout' ? root + 'checkout' : root + 'cart'; })
      .catch(function (err) {
        console.error('LX add to cart failed', err);
        if (el) { el.style.opacity = ''; el.style.pointerEvents = ''; }
        alert((err && (err.description || err.message)) || 'Sorry, something went wrong adding this to your cart. Please try again.');
      });
  }

  function e164(phone) {
    var d = String(phone || '').replace(/[^\d+]/g, '');
    if (!d) return '';
    if (d[0] === '+') return d;
    if (d.length === 10) return '+1' + d;
    if (d.length === 11 && d[0] === '1') return '+' + d;
    return '+' + d;
  }

  function lead(email, phone, sms, answers) {
    answers = answers || {};
    var props = { sg_goal: answers.goal || '', sg_consistency: answers.consistency || '', sg_priority: answers.priority || '', sg_source: cfg.funnel || 'super-greens' };
    var tel = sms ? e164(phone) : '';
    try { if (window.klaviyo && window.klaviyo.identify) window.klaviyo.identify(Object.assign({ email: email }, props)); } catch (e) {}
    if (cfg.klaviyoCompanyId && cfg.klaviyoListId) {
      var subs = { email: { marketing: { consent: 'SUBSCRIBED' } } };
      if (tel) subs.sms = { marketing: { consent: 'SUBSCRIBED' } };
      var attrs = { email: email, properties: props, subscriptions: subs };
      if (tel) attrs.phone_number = tel;
      fetch('https://a.klaviyo.com/client/subscriptions?company_id=' + encodeURIComponent(cfg.klaviyoCompanyId), {
        method: 'POST', headers: { 'Content-Type': 'application/vnd.api+json', revision: '2024-10-15' },
        body: JSON.stringify({ data: { type: 'subscription', attributes: { custom_source: 'Super Greens quiz', profile: { data: { type: 'profile', attributes: attrs } } }, relationships: { list: { data: { type: 'list', id: cfg.klaviyoListId } } } } })
      }).catch(function (e) { console.warn('LX klaviyo', e); });
      return;
    }
    // Fallback: Shopify customer (email marketing) via the native customer form.
    var f = new FormData();
    f.append('form_type', 'customer'); f.append('utf8', '✓');
    f.append('contact[email]', email);
    f.append('contact[tags]', ['sg-quiz', 'goal:' + props.sg_goal, 'consistency:' + props.sg_consistency, 'priority:' + props.sg_priority].join(','));
    fetch(root + 'contact', { method: 'POST', body: f, credentials: 'same-origin' }).catch(function (e) { console.warn('LX lead', e); });
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#lx-cart-"]') : null;
    if (!a) return;
    e.preventDefault();
    var m = a.getAttribute('href').match(/^#lx-cart-(sub|once)-(\d+)/);
    if (m) addToCart(m[1], parseInt(m[2], 10), a);
  }, true);

  window.LX = { cfg: cfg, addToCart: addToCart, lead: lead };
})();
