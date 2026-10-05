/* CAD Touch Lite website: cookie notice and advertising tags.
   Nothing below loads, stores or sends anything unless (1) at least one tag id is filled in here
   and (2) the visitor chooses Accept. With all ids empty this file only keeps the "no cookies"
   texts on the pages visible. */
(function () {
  'use strict';

  var TAGS = {
    microsoftUet: '', // Microsoft Advertising: Conversions > UET tag > Tag ID (digits). Keep "Enable Microsoft Clarity" off.
    reddit: '',       // Reddit Ads: Events Manager > Pixel ID
    meta: '',         // Meta Events Manager: Pixel (dataset) ID (digits)
    google: ''        // Google Ads: Google tag ID (AW-...)
  };
  var NOTICE_VERSION = 1; // raise when purposes or recipients change: everyone is then asked again
  var KEEP_DAYS = 183;    // a choice (Accept or Decline) is remembered for about six months
  var KEY = 'ctl-consent';

  var active = [], k;
  for (k in TAGS) if (TAGS.hasOwnProperty(k) && TAGS[k]) active.push(k);

  // Page texts: [data-tags="on"] is shown only when tags are configured, [data-tags="off"] only when none are,
  // [data-tag="<name>"] only when that tag is configured.
  function each(sel, fn) { var n = document.querySelectorAll(sel), i; for (i = 0; i < n.length; i++) fn(n[i]); }
  function applyTexts() {
    each('[data-tags="on"]', function (e) { e.hidden = !active.length; });
    each('[data-tags="off"]', function (e) { e.hidden = !!active.length; });
    each('[data-tag]', function (e) { e.hidden = active.indexOf(e.getAttribute('data-tag')) < 0; });
  }
  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(applyTexts);
  if (!active.length) return;

  // ---- the stored choice (strictly necessary; no consent needed for it) ----
  function readChoice() {
    try {
      var o = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!o || o.v !== NOTICE_VERSION || !o.t || Date.now() - o.t > KEEP_DAYS * 864e5) return null;
      return o.c === 'yes' ? 'yes' : o.c === 'no' ? 'no' : null;
    } catch (e) { return null; }
  }
  function saveChoice(c) {
    try { localStorage.setItem(KEY, JSON.stringify({ c: c, t: Date.now(), v: NOTICE_VERSION })); } catch (e) { }
  }

  // ---- tags: each is loaded only after Accept ----
  var loaded = false;
  function loadTags() {
    if (loaded) return;
    loaded = true;
    var id;
    if ((id = TAGS.microsoftUet)) {
      window.uetq = window.uetq || [];
      window.uetq.push('consent', 'update', { 'ad_storage': 'granted' });
      (function (w, d, t, r, u) { var f, n, i; w[u] = w[u] || [], f = function () { var o = { ti: id, enableAutoSpaTracking: true }; o.q = w[u], w[u] = new UET(o), w[u].push('pageLoad'); }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function () { var s = this.readyState; s && s !== 'loaded' && s !== 'complete' || (f(), n.onload = n.onreadystatechange = null); }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i); })(window, document, 'script', 'https://bat.bing.com/bat.js', 'uetq');
    }
    if ((id = TAGS.reddit)) {
      !function (w, d) { if (!w.rdt) { var p = w.rdt = function () { p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments); }; p.callQueue = []; var t = d.createElement('script'); t.src = 'https://www.redditstatic.com/ads/pixel.js?pixel_id=' + encodeURIComponent(id); t.async = !0; var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(t, s); } }(window, document);
      window.rdt('init', id);
      window.rdt('track', 'PageVisit');
    }
    if ((id = TAGS.meta)) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', id);
      window.fbq('track', 'PageView');
    }
    if ((id = TAGS.google)) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('consent', 'default', { 'ad_user_data': 'denied', 'ad_personalization': 'denied', 'ad_storage': 'denied', 'analytics_storage': 'denied' });
      window.gtag('consent', 'update', { 'ad_user_data': 'granted', 'ad_personalization': 'granted', 'ad_storage': 'granted', 'analytics_storage': 'granted' });
      window.gtag('js', new Date());
      window.gtag('config', id);
      var g = document.createElement('script');
      g.async = true;
      g.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      var first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(g, first);
    }
  }

  // A click on a "Get it from Microsoft" button is the only action that matters on this site.
  function storeClick(label) {
    if (!loaded) return;
    try {
      if (TAGS.microsoftUet && window.uetq) window.uetq.push('event', 'store_click', { 'event_category': 'outbound', 'event_label': label });
      if (TAGS.reddit && window.rdt) window.rdt('track', 'Custom', { customEventName: 'store_click' });
      if (TAGS.meta && window.fbq) window.fbq('trackCustom', 'store_click', { label: label });
      if (TAGS.google && window.gtag) window.gtag('event', 'store_click', { 'event_label': label, 'send_to': TAGS.google });
    } catch (e) { }
  }
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href*="apps.microsoft.com/detail/"]') : null;
    if (!a) return;
    var m = /[?&]cid=([^&#]*)/.exec(a.href);
    storeClick(m ? decodeURIComponent(m[1]) : '');
  }, true);

  // Withdrawing: delete what the tags stored on this website, then reload so that nothing keeps running.
  function forget() {
    var names = ['_uetsid', '_uetvid', '_uetmsclkid', '_uetsid_exp', '_uetvid_exp', '_uetuid', '_rdt_uuid', '_rdt_cid', '_rdt_em', '_fbp', '_fbc', '_gcl_au', '_gcl_aw', '_gcl_dc', '_gcl_gs'];
    var host = location.hostname.split('.'), domains = [''], i, j;
    for (i = 0; i < host.length - 1; i++) domains.push('; domain=.' + host.slice(i).join('.'));
    for (i = 0; i < names.length; i++) {
      for (j = 0; j < domains.length; j++) document.cookie = names[i] + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + domains[j];
      try { localStorage.removeItem(names[i]); sessionStorage.removeItem(names[i]); } catch (e) { }
    }
  }

  // ---- the notice ----
  var box = null;
  function closeNotice() { if (box) { box.parentNode.removeChild(box); box = null; } }
  function choose(c) {
    var before = readChoice();
    saveChoice(c);
    closeNotice();
    if (c === 'yes') loadTags();
    else if (before === 'yes' || loaded) { forget(); location.reload(); }
  }
  function showNotice() {
    if (box) return;
    if (!document.getElementById('ctl-consent-css')) {
      var st = document.createElement('style');
      st.id = 'ctl-consent-css';
      st.textContent =
        '#ctl-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:100;max-width:720px;margin:0 auto;padding:18px 20px;border-radius:14px;' +
        'background:#101a2c;color:#e8eef8;border:1px solid rgba(140,190,255,.3);box-shadow:0 20px 60px -15px rgba(0,0,0,.7);font-size:15px;line-height:1.5}' +
        '#ctl-consent p{margin:0 0 14px}#ctl-consent a{color:#5cc6ff}' +
        '#ctl-consent div{display:flex;gap:12px;flex-wrap:wrap}' +
        '#ctl-consent button{flex:1 1 140px;padding:11px 18px;border-radius:10px;border:1px solid rgba(232,238,248,.55);background:transparent;color:#e8eef8;font:inherit;font-weight:600;cursor:pointer}' +
        '#ctl-consent button:hover,#ctl-consent button:focus-visible{background:rgba(232,238,248,.12)}';
      document.head.appendChild(st);
    }
    box = document.createElement('div');
    box.id = 'ctl-consent';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Cookie notice');
    var p = document.createElement('p');
    p.appendChild(document.createTextNode('We would like to use cookies and similar technologies to measure our advertising and to show you our ads on other sites. This shares data about your visit with the advertising companies named in our '));
    var a = document.createElement('a');
    a.href = 'privacy.html#website';
    a.textContent = 'privacy policy';
    p.appendChild(a);
    p.appendChild(document.createTextNode('. Nothing is loaded unless you choose Accept. You can change your choice at any time under "Cookie settings" at the bottom of the page.'));
    var row = document.createElement('div');
    var no = document.createElement('button'), yes = document.createElement('button');
    no.type = yes.type = 'button';
    no.textContent = 'Decline';
    yes.textContent = 'Accept';
    no.addEventListener('click', function () { choose('no'); });
    yes.addEventListener('click', function () { choose('yes'); });
    row.appendChild(no);
    row.appendChild(yes);
    box.appendChild(p);
    box.appendChild(row);
    document.body.appendChild(box);
  }

  ready(function () {
    each('[data-cookie-settings]', function (e) {
      e.addEventListener('click', function (ev) { ev.preventDefault(); showNotice(); });
    });
    var c = readChoice();
    if (c === 'yes') loadTags();
    else if (c === null && navigator.globalPrivacyControl !== true) showNotice();
    // A Global Privacy Control signal counts as Decline; the footer link still lets the visitor opt in.
  });
})();
