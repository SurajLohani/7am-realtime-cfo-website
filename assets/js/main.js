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
