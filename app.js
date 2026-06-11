/* ============================================================
   2ª JORNADA SINTER — interações da LP
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Header scroll state + sticky CTA ---------- */
  var header = document.querySelector('.site-header');
  var sticky = document.querySelector('.sticky-cta');
  var hero = document.querySelector('.hero');
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 30);
    if (sticky && hero) {
      var heroBottom = hero.offsetTop + hero.offsetHeight;
      sticky.classList.toggle('show', y > heroBottom);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    function checkReveal() {
      var h = window.innerHeight;
      revealEls.forEach(function (el) {
        if (!el.classList.contains('in') && el.getBoundingClientRect().top < h * 0.92) {
          el.classList.add('in');
        }
      });
    }
    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal();
  }

  /* ---------- Sibling stagger (overrides CSS delay classes with inline delays) ---------- */
  function applyStagger(parentSel, itemSel, step) {
    document.querySelectorAll(parentSel).forEach(function (parent) {
      parent.querySelectorAll(itemSel).forEach(function (el, i) {
        el.style.transitionDelay = (i * step) + 's';
      });
    });
  }
  applyStagger('.speakers',  '.speaker.reveal',  0.08);
  applyStagger('.benefits',  '.benefit.reveal',  0.08);
  applyStagger('.problems',  '.problem.reveal',  0.08);
  applyStagger('.diffs',     '.diff.reveal',     0.08);
  applyStagger('.aud-list',  '.aud-item.reveal', 0.08);


  /* ---------- Gallery carousel ---------- */
  (function () {
    var track = document.querySelector('.gallery__track');
    var prevBtn = document.querySelector('.gallery__arrow--prev');
    var nextBtn = document.querySelector('.gallery__arrow--next');
    if (!track || !prevBtn || !nextBtn) return;
    var photos = Array.prototype.slice.call(track.querySelectorAll('.gphoto'));
    var gap = 14;
    var idx = 0;

    function offsetAt(i) {
      var o = 0;
      for (var j = 0; j < i; j++) o += photos[j].offsetWidth + gap;
      return o;
    }

    function trackWidth() {
      return offsetAt(photos.length) - gap;
    }

    function canGoNext() {
      return offsetAt(idx) + track.parentElement.offsetWidth < trackWidth();
    }

    function update() {
      track.style.transform = 'translateX(' + (-offsetAt(idx)) + 'px)';
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = !canGoNext();
    }

    prevBtn.addEventListener('click', function () { if (idx > 0) { idx--; update(); } });
    nextBtn.addEventListener('click', function () { if (canGoNext()) { idx++; update(); } });
    window.addEventListener('resize', function () { idx = 0; update(); });
    update();
  }());

  /* ---------- Countdown ---------- */
  var target = new Date('2026-09-12T08:00:00-04:00').getTime();
  var cd = {
    d: document.getElementById('cd-days'),
    h: document.getElementById('cd-hours'),
    m: document.getElementById('cd-mins'),
    s: document.getElementById('cd-secs')
  };
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function tick() {
    if (!cd.d) return;
    var diff = target - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    cd.d.textContent = pad(d);
    cd.h.textContent = pad(h);
    cd.m.textContent = pad(m);
    cd.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var ans = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      // fecha todos
      document.querySelectorAll('.faq-item.open').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Carrossel de depoimentos (removido) ---------- */

  /* ---------- VSL modal ---------- */
  var modal = document.getElementById('vsl-modal');
  var vslIframe = document.getElementById('vsl-iframe');
  var VSL_SRC = 'https://www.youtube.com/embed/LpDqe-wfgpA?autoplay=1&rel=0';

  function openVsl() {
    if (!modal) return;
    modal.classList.add('open');
    if (vslIframe) vslIframe.src = VSL_SRC;
  }
  function closeVsl() {
    if (!modal) return;
    modal.classList.remove('open');
    if (vslIframe) vslIframe.src = '';
  }

  document.querySelectorAll('[data-open-vsl]').forEach(function (b) {
    b.addEventListener('click', openVsl);
  });
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.modal__close')) closeVsl();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeVsl(); });
  }

  /* ---------- Smooth anchor offset for fixed header ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
