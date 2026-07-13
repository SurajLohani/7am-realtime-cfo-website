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

document.addEventListener('DOMContentLoaded', function () {

  // Floating WhatsApp button — sitewide, injected on every page (no HTML edits needed per-page)
  (function () {
    var wa = document.createElement('a');
    wa.href = 'https://wa.me/917011283542?text=' + encodeURIComponent('Hi, I want to know more about 7AM & Realtime CFO™.');
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.className = 'wa-float';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = '<svg viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z"/></svg>';
    document.body.appendChild(wa);
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
