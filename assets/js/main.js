// 7AM & Realtime CFO™ — shared site behavior

// Shared lead-capture endpoint (Google Apps Script Web App -> Google Sheet)
var LEAD_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwe6hNIr2JUrzan62xpZzp01CAyzzg6oyzyPOI2tjXMxg7Kn2HMYw6CNNP7o1bBpUld/exec';
function submitLead(type, fields) {
  var payload = Object.assign({ type: type }, fields);
  return fetch(LEAD_SHEET_ENDPOINT, {
    method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  }).catch(function () {});
}

// Google Analytics (GA4) loader — only fires after cookie consent is accepted.
// Property: "7AM & Realtime CFO" (GA4), stream: https://7amandrealtimecfo.com
var GA_MEASUREMENT_ID = 'G-DD86X4H0B6';
function loadGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return;
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

document.addEventListener('DOMContentLoaded', function () {

  // Cookie consent banner — sitewide, injected on every page
  (function () {
    var CONSENT_KEY = '7amCookieConsent';
    var consent = null;
    try { consent = localStorage.getItem(CONSENT_KEY); } catch (e) {}
    if (consent === 'accepted') { loadGoogleAnalytics(); return; }
    if (consent === 'declined') return;

    var banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = '<p>We use cookies for basic analytics to understand how visitors use this site. No personal data is sold or shared. See our <a href="privacy-policy.html">Privacy Policy</a>.</p>' +
      '<div class="cookie-actions">' +
      '<button class="cb-decline" type="button">Decline</button>' +
      '<button class="cb-accept" type="button">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);
    banner.querySelector('.cb-accept').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
      loadGoogleAnalytics();
      banner.remove();
    });
    banner.querySelector('.cb-decline').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch (e) {}
      banner.remove();
    });
  })();

  // FAQ page search + category filter (only runs if #faqSearch exists on the page)
  (function () {
    var searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq-item'));
    var categories = Array.prototype.slice.call(document.querySelectorAll('.faq-category'));
    var noResults = document.getElementById('faqNoResults');
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      var anyVisible = false;
      categories.forEach(function (cat) {
        var catHasVisible = false;
        cat.querySelectorAll('.faq-item').forEach(function (item) {
          var text = item.textContent.toLowerCase();
          var match = q === '' || text.indexOf(q) !== -1;
          item.classList.toggle('faq-hidden', !match);
          if (match) { catHasVisible = true; anyVisible = true; }
          if (match && q !== '') item.setAttribute('open', '');
          else if (q === '') item.removeAttribute('open');
        });
        cat.style.display = catHasVisible ? '' : 'none';
      });
      if (noResults) noResults.style.display = anyVisible ? 'none' : 'block';
    });
  })();

  // Floating WhatsApp button — sitewide, injected on every page (no HTML edits needed per-page)
  (function () {
    var wa = document.createElement('a');
    wa.href = 'https://wa.me/917011283542?text=' + encodeURIComponent('Hi, I want to know more about 7AM & Realtime CFO™.');
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.className = 'wa-float';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z"/></svg><span>WhatsApp Us</span>';
    document.body.appendChild(wa);
  })();

  // Sticky mobile CTA bar — sitewide (visible on mobile only, via CSS), injected on every page
  // Skipped on the diagnostic pages themselves, where this CTA would just point back at the same page.
  (function () {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var skipOn = ['diagnostic.html', 'gap-diagnostic.html', 'manufacturing-risk-assessment.html'];
    if (skipOn.indexOf(path) !== -1) return;
    var bar = document.createElement('div');
    bar.className = 'sticky-cta-bar';
    bar.innerHTML = '<a href="diagnostic.html" class="btn btn-primary">Get Your Free Diagnostic →</a>';
    document.body.appendChild(bar);
  })();

  // ================= Ask7AM guided chat widget — sitewide, injected on every page =================
  (function () {
    var FRIENDLY_CATS = [
      { label: '🧭 What is 7AM & Realtime CFO?', cats: ['Products & Services'] },
      { label: '💰 Pricing & Engagement', cats: ['Pricing & Engagement'] },
      { label: '🏭 Industries We Serve', cats: ['Industries'] },
      { label: '🌍 Country Compliance (7 Countries)', cats: ['Country Compliance'] },
      { label: '📊 Finance Concepts Explained', cats: ['Finance Domain', 'Finance Glossary'] },
      { label: '🙋 About Suraj & Shikha', cats: ['Suraj Kumar Lohani (Founder)', 'Shikha Kutariyar Lohani (Partner)', 'Suraj & Shikha (Team)'] },
      { label: '📚 Our Books', cats: ['Books (Deep Dive)'] },
      { label: '🔒 Onboarding & Data Security', cats: ['Onboarding & Implementation', 'Data Security & Confidentiality'] },
      { label: '🏆 Case Studies & Trust', cats: ['Case Studies & Results', 'Trust & Comparison'] },
      { label: '🧩 Common Business Scenarios', cats: ['Common Scenarios', 'Cross-Border Scenarios'] }
    ];
    var GREETING = "Namaste! I'm Ask7AM 🕐 — pick a topic below, or type your question about 7AM & Realtime CFO™, our services, industries, country compliance, or finance concepts.";
    var STOPWORDS = { 'the':1,'a':1,'an':1,'is':1,'are':1,'of':1,'to':1,'for':1,'in':1,'and':1,'or':1,'do':1,'does':1,'how':1,'what':1,'why':1,'can':1,'i':1,'my':1,'your':1,'you':1,'it':1,'on':1,'with':1,'this':1,'that':1,'be':1 };

    var fab = document.createElement('button');
    fab.className = 'ask7am-float';
    fab.setAttribute('aria-label', 'Ask7AM — chat with our FAQ assistant');
    fab.innerHTML = '<img src="assets/img/ask7am-badge.png" alt="Ask7AM"><span>Ask7AM</span>';
    document.body.appendChild(fab);

    var panel = document.createElement('div');
    panel.className = 'ask7am-panel';
    panel.innerHTML =
      '<div class="ask7am-header">' +
        '<img src="assets/img/ask7am-badge.png" alt="">' +
        '<div class="ask7am-header-text"><strong>Ask7AM</strong><span>Your FAQ Assistant</span></div>' +
        '<button class="ask7am-close" aria-label="Close">&times;</button>' +
      '</div>' +
      '<div class="ask7am-body"></div>' +
      '<div class="ask7am-inputrow">' +
        '<input type="text" class="ask7am-input" placeholder="Type your question…" maxlength="200">' +
        '<button class="ask7am-send" aria-label="Send">➤</button>' +
      '</div>';
    document.body.appendChild(panel);

    var body = panel.querySelector('.ask7am-body');
    var input = panel.querySelector('.ask7am-input');

    function esc(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    function addBotMsg(html) {
      var m = document.createElement('div');
      m.className = 'ask7am-msg ask7am-bot';
      m.innerHTML = html;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
    }
    function addUserMsg(text) {
      var m = document.createElement('div');
      m.className = 'ask7am-msg ask7am-user';
      m.textContent = text;
      body.appendChild(m);
      body.scrollTop = body.scrollHeight;
    }
    function addChips(items, onPick) {
      var wrap = document.createElement('div');
      wrap.className = 'ask7am-chips';
      items.forEach(function (label) {
        var chip = document.createElement('button');
        chip.className = 'ask7am-chip';
        chip.textContent = label;
        chip.addEventListener('click', function () { onPick(label); });
        wrap.appendChild(chip);
      });
      body.appendChild(wrap);
      body.scrollTop = body.scrollHeight;
    }

    function showTopics() {
      addChips(FRIENDLY_CATS.map(function (c) { return c.label; }).concat(['📖 See all 1000 FAQs', '💬 Talk to Suraj on WhatsApp']), function (label) {
        if (label === '📖 See all 1000 FAQs') {
          addUserMsg(label);
          window.open('faq.html', '_blank');
          addBotMsg('Opened the full FAQ page in a new tab. Anything else I can help with?');
          showTopics();
          return;
        }
        if (label === '💬 Talk to Suraj on WhatsApp') {
          addUserMsg(label);
          window.open('https://wa.me/917011283542?text=' + encodeURIComponent('Hi, I have a question about 7AM & Realtime CFO™.'), '_blank');
          addBotMsg('Great — I\'ve opened WhatsApp for you. Anything else?');
          showTopics();
          return;
        }
        var found = FRIENDLY_CATS.filter(function (c) { return c.label === label; })[0];
        if (!found || typeof ASK7AM_FAQ === 'undefined') return;
        addUserMsg(label);
        var matches = ASK7AM_FAQ.filter(function (row) { return found.cats.indexOf(row.c) !== -1; });
        var top = matches.slice(0, 8).map(function (row) { return row.q; });
        addBotMsg('Here are common questions on <strong>' + esc(label.replace(/^[^\s]+\s/, '')) + '</strong>:');
        addChips(top.concat(['⬅ Back to topics']), function (q2) {
          if (q2 === '⬅ Back to topics') { addUserMsg(q2); addBotMsg('Sure — pick another topic:'); showTopics(); return; }
          addUserMsg(q2);
          var row = matches.filter(function (r) { return r.q === q2; })[0];
          if (row) {
            addBotMsg(esc(row.a));
            addChips(['⬅ Back to topics'], function () { addUserMsg('⬅ Back to topics'); addBotMsg('Sure — pick another topic:'); showTopics(); });
          }
        });
      });
    }

    function searchFAQ(query) {
      if (typeof ASK7AM_FAQ === 'undefined') return [];
      var words = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(function (w) { return w && !STOPWORDS[w]; });
      if (!words.length) return [];
      var scored = ASK7AM_FAQ.map(function (row) {
        var qLower = row.q.toLowerCase();
        var score = 0;
        words.forEach(function (w) { if (qLower.indexOf(w) !== -1) score += 2; });
        var aLower = row.a.toLowerCase();
        words.forEach(function (w) { if (aLower.indexOf(w) !== -1) score += 1; });
        return { row: row, score: score };
      }).filter(function (s) { return s.score > 0; });
      scored.sort(function (a, b) { return b.score - a.score; });
      return scored.slice(0, 5).map(function (s) { return s.row; });
    }

    function handleQuery(text) {
      addUserMsg(text);
      var results = searchFAQ(text);
      if (!results.length) {
        addBotMsg("I couldn't find an exact match for that in our FAQ bank. You can browse all 1000 questions or message Suraj directly on WhatsApp for a personal answer.");
        addChips(['📖 See all 1000 FAQs', '💬 Talk to Suraj on WhatsApp', '⬅ Back to topics'], function (label) {
          if (label === '📖 See all 1000 FAQs') { addUserMsg(label); window.open('faq.html', '_blank'); addBotMsg('Opened in a new tab. Anything else?'); return; }
          if (label === '💬 Talk to Suraj on WhatsApp') { addUserMsg(label); window.open('https://wa.me/917011283542?text=' + encodeURIComponent('Hi, I have a question about 7AM & Realtime CFO™.'), '_blank'); addBotMsg('Opened WhatsApp for you. Anything else?'); return; }
          addUserMsg(label); addBotMsg('Sure — pick a topic:'); showTopics();
        });
        return;
      }
      addBotMsg('Here\'s what I found:');
      addChips(results.map(function (r) { return r.q; }).concat(['⬅ Back to topics']), function (q2) {
        if (q2 === '⬅ Back to topics') { addUserMsg(q2); addBotMsg('Sure — pick another topic:'); showTopics(); return; }
        addUserMsg(q2);
        var row = results.filter(function (r) { return r.q === q2; })[0];
        if (row) {
          addBotMsg(esc(row.a));
          addChips(['⬅ Back to topics'], function () { addUserMsg('⬅ Back to topics'); addBotMsg('Sure — pick another topic:'); showTopics(); });
        }
      });
    }

    var initialized = false;
    function openPanel() {
      panel.classList.add('open');
      fab.classList.add('active');
      if (!initialized) {
        initialized = true;
        addBotMsg(GREETING);
        showTopics();
      }
    }
    function closePanel() {
      panel.classList.remove('open');
      fab.classList.remove('active');
    }

    fab.addEventListener('click', function () {
      if (panel.classList.contains('open')) closePanel(); else openPanel();
    });
    panel.querySelector('.ask7am-close').addEventListener('click', closePanel);
    panel.querySelector('.ask7am-send').addEventListener('click', function () {
      var v = input.value.trim();
      if (!v) return;
      input.value = '';
      handleQuery(v);
    });
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') {
        var v = input.value.trim();
        if (!v) return;
        input.value = '';
        handleQuery(v);
      }
    });

    // Lazy-load the 1000-question FAQ data bank only when the widget is first opened
    var faqDataLoaded = false;
    fab.addEventListener('click', function loadData() {
      if (faqDataLoaded) return;
      faqDataLoaded = true;
      var s = document.createElement('script');
      s.src = 'assets/js/faq-data.js';
      document.head.appendChild(s);
    });
  })();

  // Quick Contact strip — sitewide, before footer on every page
  var qcForm = document.querySelector('.quick-contact-form');
  if (qcForm) {
    qcForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var fields = {
        name: qcForm.querySelector('[name="qcName"]').value,
        email: qcForm.querySelector('[name="qcEmail"]').value,
        phone: qcForm.querySelector('[name="qcPhone"]').value,
        page: window.location.pathname
      };
      submitLead('QuickContact', fields);
      qcForm.querySelectorAll('input,button').forEach(function (el) { el.disabled = true; });
      qcForm.querySelector('button').textContent = 'Sent ✓';
      var note = qcForm.parentElement.querySelector('.quick-contact-note');
      if (note) note.textContent = '✅ Got it — we reply within one business day. Prefer WhatsApp? DM "MORNING" to +91-7011283542.';
    });
  }
  // Header scroll state
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Animated counters
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1400;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var val = target * eased;
          el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // Animated confidence bar (hero mock)
  var confBar = document.querySelector('.opn-conf-bar span');
  if (confBar && 'IntersectionObserver' in window) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          confBar.style.width = confBar.getAttribute('data-width') || '84%';
          bio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    bio.observe(confBar);
  }
});
