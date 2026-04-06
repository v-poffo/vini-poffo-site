/* ─── TEMPLATE.JS — JavaScript compartilhado para páginas de projetos ──────
   Inclua este arquivo após o HTML da página.
   Espera que os IDs / classes definidos no template HTML existam.
   ──────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── HERO ENTRANCE ──────────────────────────────────────────────── */
  window.addEventListener('load', function () {
    var heroCenter = document.getElementById('heroCenter');
    if (heroCenter) {
      setTimeout(function () {
        heroCenter.classList.add('in');
      }, 350);
    }
  });

  /* ── HERO FADE ON SCROLL ────────────────────────────────────────── */
  var heroOv = document.getElementById('heroOv');
  if (heroOv) {
    window.addEventListener('scroll', function () {
      var p = Math.min(window.scrollY / (window.innerHeight * 0.6), 1);
      heroOv.style.opacity = 1 - p;
      heroOv.style.transform = 'translateY(' + (-window.scrollY * 0.14) + 'px)';
      heroOv.style.pointerEvents = p > 0.5 ? 'none' : '';
    }, { passive: true });
  }

  /* ── PT / EN TOGGLE ─────────────────────────────────────────────── */
  var lang = 'pt';

  function applyLang(newLang) {
    lang = newLang;
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    var lPT = document.getElementById('lPT');
    var lEN = document.getElementById('lEN');
    if (lPT) lPT.classList.toggle('on', lang === 'pt');
    if (lEN) lEN.classList.toggle('on', lang === 'en');

    document.querySelectorAll('[data-pt]').forEach(function (el) {
      var v = lang === 'pt' ? el.dataset.pt : el.dataset.en;
      if (v !== undefined) el.textContent = v;
    });

    document.querySelectorAll('.lang-pt').forEach(function (el) {
      el.classList.toggle('hidden', lang !== 'pt');
    });
    document.querySelectorAll('.lang-en').forEach(function (el) {
      el.classList.toggle('hidden', lang !== 'en');
    });

    var tickerPT = document.getElementById('tickerPT');
    var tickerEN = document.getElementById('tickerEN');
    if (tickerPT) tickerPT.classList.toggle('hidden', lang !== 'pt');
    if (tickerEN) tickerEN.classList.toggle('hidden', lang !== 'en');
  }

  /* auto-detect from URL hash or query */
  (function () {
    if (window.location.hash === '#en' || window.location.search === '?lang=en') {
      applyLang('en');
    }
  })();

  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(lang === 'pt' ? 'en' : 'pt');
    });
  }

  /* ── INTERSECTION OBSERVER (one-shot para .fade) ──────────────── */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade').forEach(function (el) { io.observe(el); });

  /* ── DIREÇÃO: scroll-reveal sequencial ──────────────────────────── */
  var dirZone    = document.getElementById('dirZone');
  var dirImgBase = document.querySelector('.dir-img-base');
  var dirImgTop  = document.querySelector('.dir-img-top');
  var dirBioCol  = document.querySelector('.dir-bio-col');

  if (dirZone && dirImgBase) {
    var dirSteps = [
      { el: dirImgBase, t: 0.05 },
      { el: dirImgTop,  t: 0.35 },
      { el: dirBioCol,  t: 0.62 },
    ].filter(function (s) { return s.el; });

    function updateDir() {
      var rect  = dirZone.getBoundingClientRect();
      var total = dirZone.offsetHeight - window.innerHeight;
      var p = Math.max(0, Math.min(1, -rect.top / total));
      dirSteps.forEach(function (s) {
        if (p >= s.t) { s.el.classList.add('show'); }
        else          { s.el.classList.remove('show'); }
      });
    }
    window.addEventListener('scroll', updateDir, { passive: true });
    updateDir();
  }

  /* ── SINOPSE + TRAILER SCROLL ───────────────────────────────────── */
  var stZone   = document.getElementById('stZone');
  var sinOv    = document.getElementById('sinOv');
  var trlBox   = document.getElementById('trlBox');
  var trlFrame = document.getElementById('trlFrame');

  if (stZone && sinOv) {
    var sinLines = sinOv.querySelectorAll('.sin-line');
    var tLoaded  = false;

    function updateST() {
      var rect  = stZone.getBoundingClientRect();
      var total = stZone.offsetHeight - window.innerHeight;
      var p     = Math.max(0, Math.min(1, -rect.top / total));

      var sP = Math.min(1, p / 0.45);
      sinOv.style.opacity = 1 - sP;

      var colorP = Math.max(0, Math.min(1, (sP - 0.5) / 0.5));
      var r = Math.round(240 * (1 - colorP));
      var g = Math.round(240 + colorP * 15);
      var b = Math.round(240 - colorP * 146);
      var col = 'rgb(' + r + ',' + g + ',' + b + ')';

      sinLines.forEach(function (line, i) {
        var dir = i % 2 === 0 ? -1 : 1;
        line.style.transform = 'translateX(' + (sP * 100 * dir) + 'px)';
        line.style.color = col;
      });

      if (trlBox && trlFrame) {
        var tP    = Math.max(0, Math.min(1, (p - 0.3) / 0.65));
        var scale = 0.22 + tP * 0.8;
        trlBox.style.transform = 'scale(' + scale + ')';
        trlBox.style.opacity   = Math.min(1, tP * 3);

        if (!tLoaded && p > 0.18) {
          trlFrame.src = trlFrame.dataset.src;
          tLoaded = true;
        }
      }
    }
    window.addEventListener('scroll', updateST, { passive: true });
    updateST();
  }

  /* ── NOTA DA DIREÇÃO — TEXTO REVELA NO SCROLL ───────────────────── */
  var noteZone = document.getElementById('noteZone');

  if (noteZone) {
    var nqL0 = noteZone.querySelector('.nq-l0');
    var nqL1 = noteZone.querySelector('.nq-l1');
    var nLbl = document.getElementById('noteLbl');
    var nP0  = noteZone.querySelector('.np-0');
    var nP1  = noteZone.querySelector('.np-1');
    var nP2  = noteZone.querySelector('.np-2');

    var nSteps = [
      { el: nqL0, t: 0.04 },
      { el: nqL1, t: 0.17 },
      { el: nLbl, t: 0.31 },
      { el: nP0,  t: 0.42 },
      { el: nP1,  t: 0.60 },
      { el: nP2,  t: 0.76 },
    ].filter(function (s) { return s.el; });

    function updateNote() {
      var rect  = noteZone.getBoundingClientRect();
      var total = noteZone.offsetHeight - window.innerHeight;
      var p = Math.max(0, Math.min(1, -rect.top / total));
      nSteps.forEach(function (s) {
        if (p >= s.t) { s.el.classList.add('show'); }
        else          { s.el.classList.remove('show'); }
      });
    }
    window.addEventListener('scroll', updateNote, { passive: true });
    updateNote();
  }

  /* ── GALLERY DRAG + SCROLL ──────────────────────────────────────── */
  var gs = document.getElementById('gScroll');
  if (gs) {
    var isDragging = false, startX = 0, scrollStart = 0, velX = 0, lastX = 0, lastT = 0, raf;

    gs.addEventListener('pointerdown', function (e) {
      isDragging = true;
      startX = e.clientX; scrollStart = gs.scrollLeft;
      velX = 0; lastX = e.clientX; lastT = Date.now();
      gs.setPointerCapture(e.pointerId);
      gs.classList.add('drag');
      cancelAnimationFrame(raf);
    });
    gs.addEventListener('pointermove', function (e) {
      if (!isDragging) return;
      var now = Date.now();
      gs.scrollLeft = scrollStart - (e.clientX - startX);
      velX = (e.clientX - lastX) / Math.max(now - lastT, 1) * 16;
      lastX = e.clientX; lastT = now;
    });
    function endDrag() {
      if (!isDragging) return;
      isDragging = false; gs.classList.remove('drag');
      (function mom() {
        if (Math.abs(velX) < 0.5) return;
        gs.scrollLeft -= velX; velX *= 0.91;
        raf = requestAnimationFrame(mom);
      })();
    }
    gs.addEventListener('pointerup',     endDrag);
    gs.addEventListener('pointercancel', endDrag);

    gs.addEventListener('wheel', function (e) {
      var delta    = e.deltaY !== 0 ? e.deltaY : e.deltaX;
      var atEnd    = gs.scrollLeft >= gs.scrollWidth - gs.clientWidth - 4;
      var atStart  = gs.scrollLeft <= 4;
      var goingFwd = delta > 0;
      if ((goingFwd && atEnd) || (!goingFwd && atStart)) return;
      e.preventDefault();
      gs.scrollLeft += delta;
    }, { passive: false });

    var gLeft  = document.getElementById('gLeft');
    var gRight = document.getElementById('gRight');
    if (gLeft)  gLeft.addEventListener('click',  function () { gs.scrollBy({ left: -400, behavior: 'smooth' }); });
    if (gRight) gRight.addEventListener('click', function () { gs.scrollBy({ left:  400, behavior: 'smooth' }); });
  }

})();
