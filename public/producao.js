/* Conteúdo legível e links funcionais mesmo sem bibliotecas de animação. */
(() => {
  'use strict';
  const navbar = document.querySelector('.navbar');
  const updateNav = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', updateNav, {passive:true}); updateNav();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hb = document.getElementById('hamburger');
  const nm = document.getElementById('navMenu');
  function closeMenu() {
    hb.classList.remove('active'); nm.classList.remove('active');
    hb.setAttribute('aria-expanded', 'false');
    hb.setAttribute('aria-label', 'Abrir menu');
  }
  hb.addEventListener('click', () => {
    const open = hb.getAttribute('aria-expanded') !== 'true';
    hb.classList.toggle('active', open); nm.classList.toggle('active', open);
    hb.setAttribute('aria-expanded', String(open));
    hb.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  document.addEventListener('click', e => {
    if (!hb.contains(e.target) && !nm.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hb.getAttribute('aria-expanded') === 'true') {
      closeMenu(); hb.focus();
    }
  });
  nm.addEventListener('click', closeMenu);
  const cc = document.getElementById('celCarousel');
  function scrollProject(dir) {
    const card = cc.querySelector('.cel');
    cc.scrollBy({left: dir * (card.offsetWidth + parseFloat(getComputedStyle(cc).gap || 16)), behavior: reduce.matches ? 'instant' : 'smooth'});
  }
  document.getElementById('celPrev').addEventListener('click', () => scrollProject(-1));
  document.getElementById('celNext').addEventListener('click', () => scrollProject(1));

  const dialog = document.getElementById('filmeDialog');
  const player = document.getElementById('filmePlayer');
  const videos = [...document.querySelectorAll('video[data-autoplay], .hero-bg video')];
  const inView = new Set();
  let opener;
  const saveData = navigator.connection && navigator.connection.saveData;
  function loadVideo(v) {
    if (v.dataset.src && !v.dataset.loaded) {
      v.src = v.dataset.src; v.dataset.loaded = '1'; v.load();
    }
  }
  function playPreview(v) {
    if (reduce.matches || saveData || document.hidden || dialog.open || v.dataset.failed) return;
    loadVideo(v);
    v.play().catch(() => { /* A capa continua visível se autoplay for bloqueado. */ });
  }
  videos.forEach(v => {
    v.removeAttribute('autoplay');
    v.preload = 'none';
    v.addEventListener('error', () => {
      v.dataset.failed = '1'; v.pause();
      /* Mantém a capa e o acesso manual ao arquivo quando a prévia falha. */
    });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(({target, isIntersecting}) => {
        if (isIntersecting) { inView.add(target); playPreview(target); }
        else { inView.delete(target); target.pause(); }
      });
    }, {threshold: .2});
    videos.forEach(v => observer.observe(v));
  }
  document.addEventListener('visibilitychange', () => {
    videos.forEach(v => v.pause());
    if (document.hidden) player.pause();
    else inView.forEach(playPreview);
  });
  reduce.addEventListener('change', () => {
    videos.forEach(v => v.pause()); inView.forEach(playPreview);
  });
  document.querySelectorAll('[data-watch]').forEach(link => {
    link.addEventListener('click', e => {
      if (!dialog.showModal || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      e.preventDefault(); opener = link;
      videos.forEach(v => v.pause());
      document.getElementById('filmeTitulo').textContent = link.dataset.title;
      document.getElementById('filmeCredito').textContent = link.dataset.credit;
      document.getElementById('filmeErro').hidden = true;
      document.getElementById('filmeDireto').href = link.href;
      player.src = link.href; player.muted = false;
      dialog.showModal(); player.play().catch(() => {});
    });
  });
  player.addEventListener('error', () => { document.getElementById('filmeErro').hidden = false; });
  document.getElementById('fecharFilme').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) {
    const b = dialog.getBoundingClientRect();
    if (e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) dialog.close();
  }});
  dialog.addEventListener('close', () => {
    player.pause(); player.removeAttribute('src'); player.load();
    if (opener) opener.focus(); inView.forEach(playPreview);
  });

  if (window.gsap && window.ScrollTrigger && !reduce.matches) {
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    gsap.to('#progresso', {scaleX:1, ease:'none', scrollTrigger:{trigger:document.body,start:'top top',end:'bottom bottom',scrub:.3}});
    gsap.from('.hero-frase', {opacity:0,y:20,duration:.85,ease:'power2.out'});
    gsap.from('.hero-sub', {opacity:0,y:20,duration:.8,delay:.2});
    document.querySelectorAll('[data-reveal], .case-conteudo [data-p]').forEach(el => {
      gsap.from(el, {opacity:0,y:22,duration:.65,scrollTrigger:{trigger:el,start:'top 94%',once:true}});
    });
  }
})();
