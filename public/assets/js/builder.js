/* ─── BUILDER.JS — Gerador de páginas de projeto ────────────────────────────
   Gera o HTML completo de uma página de projeto a partir de um objeto de dados.
   ──────────────────────────────────────────────────────────────────────────── */

window.ProjectBuilder = (function () {
  'use strict';

  /* ── helpers ── */
  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* keep pre-escaped entities like &amp; &lt; intact — use only for trusted/controlled content
     (e.g. values from projects.json where & was intentionally written as &amp;) */
  function safe(str) {
    return str ? String(str) : '';
  }

  /* base path from slug (relative to /projetos/[slug]/) */
  function assetBase() { return ''; }

  /* ── font declarations (uses local fonts relative to page) ── */
  function buildFonts(fontsPath) {
    var fp = fontsPath || 'fonts/';
    return [
      "@font-face { font-family: 'noka'; src: url('" + fp + "fonnts.com-Noka_Light.otf') format('opentype'); font-weight: 300; font-style: normal; font-display: swap; }",
      "@font-face { font-family: 'noka'; src: url('" + fp + "fonnts.com-Noka_Medium.otf') format('opentype'); font-weight: 400; font-style: normal; font-display: swap; }",
      "@font-face { font-family: 'noka'; src: url('" + fp + "fonnts.com-Noka_Medium.otf') format('opentype'); font-weight: 500; font-style: normal; font-display: swap; }",
      "@font-face { font-family: 'noka'; src: url('" + fp + "fonnts.com-Noka_Bold.otf') format('opentype'); font-weight: 700; font-style: normal; font-display: swap; }",
      "@font-face { font-family: 'aktiv-grotesk'; src: url('" + fp + "AktivGrotesk-Light.ttf') format('truetype'); font-weight: 300; font-style: normal; font-display: swap; }",
      "@font-face { font-family: 'aktiv-grotesk'; src: url('" + fp + "AktivGrotesk-Regular.ttf') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }",
      "@font-face { font-family: 'aktiv-grotesk'; src: url('" + fp + "AktivGrotesk-Medium.ttf') format('truetype'); font-weight: 500; font-style: normal; font-display: swap; }",
      "@font-face { font-family: 'aktiv-grotesk'; src: url('" + fp + "AktivGrotesk-Bold.ttf') format('truetype'); font-weight: 700; font-style: normal; font-display: swap; }",
      "@font-face { font-family: 'aktiv-grotesk'; src: url('" + fp + "AktivGrotesk-Italic.ttf') format('truetype'); font-weight: 400; font-style: italic; font-display: swap; }",
      "@font-face { font-family: 'aktiv-grotesk'; src: url('" + fp + "AktivGrotesk-LightItalic.ttf') format('truetype'); font-weight: 300; font-style: italic; font-display: swap; }",
    ].join('\n');
  }

  /* ── section builders ── */

  function buildHero(s, proj) {
    if (!s || !s.enabled) return '';
    var year = proj.year || '';
    var dur  = proj.duration || '';
    var country = proj.country || '';
    var fmt  = proj.format || '';
    var ar   = proj.aspect_ratio || '';
    return [
      '<!-- FIXED VIDEO HERO -->',
      '<div class="hero-vid" aria-hidden="true">',
      '  <video autoplay muted loop playsinline preload="auto">',
      '    <source src="' + safe(s.video) + '" type="video/mp4">',
      '  </video>',
      '</div>',
      '',
      '<!-- HERO OVERLAY -->',
      '<div class="hero-ov" id="heroOv" aria-hidden="true">',
      '  <div class="hero-center" id="heroCenter">',
      '    <p class="hero-label" data-pt="' + esc(s.label_pt) + '" data-en="' + esc(s.label_en) + '">' + esc(s.label_pt) + '</p>',
      '    <img class="hero-title-img lang-pt" src="' + safe(s.title_pt) + '" alt="' + esc(proj.title_pt) + '">',
      '    <img class="hero-title-img lang-en hidden" src="' + safe(s.title_en) + '" alt="' + esc(proj.title_en) + '">',
      '    <div class="hero-meta">',
      '      <span>' + esc(String(year)) + '</span><span class="s">·</span>',
      '      <span>' + esc(dur) + '</span><span class="s">·</span>',
      '      <span>' + esc(country) + '</span><span class="s">·</span>',
      '      <span>' + safe(fmt) + '</span><span class="s">·</span>',
      '      <span>' + esc(ar) + '</span>',
      '    </div>',
      '  </div>',
      '  <div class="ticker-bar">',
      '    <div class="ticker-track lang-pt" id="tickerPT">',
      '      <span>' + esc(s.ticker_pt) + '</span>',
      '      <span aria-hidden="true">' + esc(s.ticker_pt) + '</span>',
      '    </div>',
      '    <div class="ticker-track lang-en hidden" id="tickerEN">',
      '      <span>' + esc(s.ticker_en) + '</span>',
      '      <span aria-hidden="true">' + esc(s.ticker_en) + '</span>',
      '    </div>',
      '  </div>',
      '</div>',
    ].join('\n');
  }

  function buildSynopsisTrailer(syn, trl) {
    if (!syn || !syn.enabled) return '';
    var linesPT = syn.lines_pt || [];
    var linesEN = syn.lines_en || [];
    var maxLines = Math.max(linesPT.length, linesEN.length);
    var linesHtml = '';
    for (var i = 0; i < maxLines; i++) {
      var pt = linesPT[i] || '';
      var en = linesEN[i] || '';
      linesHtml += '          <span class="sin-line" data-pt="' + esc(pt) + '" data-en="' + esc(en) + '">' + esc(pt) + '</span>\n';
    }
    var trlHtml = '';
    if (trl && trl.enabled && trl.url) {
      trlHtml = [
        '      <div class="trl-ov">',
        '        <div class="trl-box" id="trlBox">',
        '          <iframe id="trlFrame" src="" data-src="' + esc(trl.url) + '"',
        '            frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen',
        '            title="Trailer"></iframe>',
        '        </div>',
        '      </div>',
      ].join('\n');
    }
    return [
      '  <!-- SINOPSE + TRAILER ─────────────────────────────────────────── -->',
      '  <div class="st-zone" id="stZone">',
      '    <div class="st-sticky" id="stSticky">',
      '      <div class="sin-ov" id="sinOv">',
      '        <div class="sin-inner">',
      '          <p class="sin-lbl" data-pt="Sinopse" data-en="Synopsis">Sinopse</p>',
      linesHtml.trimEnd(),
      '        </div>',
      '      </div>',
      trlHtml,
      '    </div>',
      '  </div>',
    ].join('\n');
  }

  function buildGallery(s) {
    if (!s || !s.enabled) return '';
    var imgs = (s.images || []).map(function (img) {
      return '        <div class="gi"><img src="' + safe(img.src) + '" alt="' + esc(img.alt_pt || '') + '"></div>';
    }).join('\n');
    return [
      '  <!-- GALERIA DE STILLS ──────────────────────────────────────────── -->',
      '  <section class="sec-gallery">',
      '    <p class="label gal-label fade" data-pt="Foto Stills" data-en="Film Stills">Foto Stills</p>',
      '    <div class="gal-scroll" id="gScroll">',
      '      <div class="gal-track" id="gTrack">',
      imgs,
      '      </div>',
      '    </div>',
      '    <div class="gal-arrows">',
      '      <button class="garr" id="gLeft"><svg viewBox="0 0 24 24"><polyline points="15,18 9,12 15,6"/></svg></button>',
      '      <button class="garr" id="gRight"><svg viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6"/></svg></button>',
      '    </div>',
      '  </section>',
    ].join('\n');
  }

  function buildDirectorNote(s) {
    if (!s || !s.enabled) return '';
    var q = s.quote_pt || [];
    var qEn = s.quote_en || [];
    var bio = s.bio_pt || '';
    var bioEn = s.bio_en || '';
    var bioParts = bio.split('\n\n');
    var bioEnParts = bioEn.split('\n\n');
    var p0pt = bioParts[0] || '';
    var p1pt = bioParts[1] || '';
    var p0en = bioEnParts[0] || '';
    var p1en = bioEnParts[1] || '';
    var videoHtml = s.video
      ? ['      <div class="note-vid" aria-hidden="true">',
         '        <video autoplay muted loop playsinline preload="none">',
         '          <source src="' + safe(s.video) + '" type="video/mp4">',
         '        </video>',
         '      </div>'].join('\n')
      : '';
    return [
      '  <!-- NOTA DA DIREÇÃO ────────────────────────────────────────────── -->',
      '  <div class="note-zone" id="noteZone" aria-label="Nota da Direção">',
      '    <div class="note-sticky">',
      videoHtml,
      '      <div class="note-inner">',
      '        <blockquote class="note-quote">',
      '          <span class="nq-l0" data-pt="' + esc(q[0] || '') + '" data-en="' + esc(qEn[0] || '') + '">' + esc(q[0] || '') + '</span>',
      '          <span class="nq-l1" data-pt="' + esc(q[1] || '') + '" data-en="' + esc(qEn[1] || '') + '">' + esc(q[1] || '') + '</span>',
      '        </blockquote>',
      '        <p id="noteLbl" data-pt="Nota da Direção" data-en="Director\'s Note">Nota da Direção</p>',
      '        <div class="note-text">',
      '          <p class="np-0" data-pt="' + esc(p0pt) + '" data-en="' + esc(p0en) + '">' + esc(p0pt) + '</p>',
      (p1pt ? '          <p class="np-1" data-pt="' + esc(p1pt) + '" data-en="' + esc(p1en) + '">' + esc(p1pt) + '</p>' : ''),
      '          <p class="np-2">' + esc(s.signature || '— Vini Poffo') + '</p>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </div>',
    ].join('\n');
  }

  function buildDirectorSection(s) {
    if (!s || !s.enabled) return '';
    return [
      '  <!-- dir-scroll-zone dá o espaço de rolagem -->',
      '  <div class="dir-scroll-zone" id="dirZone">',
      '    <section class="sec-dir" aria-label="Sobre a Direção">',
      '      <div class="dir-wrap">',
      '        <div class="dir-imgs">',
      '          <img class="dir-img-base" src="' + safe(s.image_base) + '" alt="Vini Poffo">',
      (s.image_top ? '          <img class="dir-img-top" src="' + safe(s.image_top) + '" alt="" aria-hidden="true">' : ''),
      '        </div>',
      '        <div class="dir-bio-col">',
      '          <p class="dir-bio"',
      '             data-pt="' + esc(s.bio_pt || '') + '"',
      '             data-en="' + esc(s.bio_en || '') + '">',
      '            ' + esc(s.bio_pt || ''),
      '          </p>',
      '        </div>',
      '      </div>',
      '    </section>',
      '  </div>',
    ].join('\n');
  }

  function buildZenital(s, proj) {
    if (!s || !s.enabled) return '';
    var lbl = s.label_pt || (proj.genre + ' · ' + proj.country + ' · ' + proj.year);
    var lblEn = s.label_en || (proj.genre_en + ' · ' + (proj.country_en || proj.country) + ' · ' + proj.year);
    return [
      '  <!-- FOTO ZENITAL ─────────────────────────────────────────────── -->',
      '  <section class="sec-zenital" aria-hidden="true">',
      '    <div class="zen-bg">',
      '      <video autoplay muted loop playsinline preload="none">',
      '        <source src="' + safe(s.video) + '" type="video/mp4">',
      '      </video>',
      '    </div>',
      '    <p class="zen-txt fade" data-pt="' + esc(lbl) + '" data-en="' + esc(lblEn) + '">' + esc(lbl) + '</p>',
      '  </section>',
    ].join('\n');
  }

  function buildPosters(s) {
    if (!s || !s.enabled) return '';
    var imgs = (s.images || []).map(function (img, i) {
      if (img.src_pt) {
        return [
          '          <div>',
          '            <img class="lang-pt" src="' + safe(img.src_pt) + '" alt="' + esc(img.alt_pt || '') + '">',
          '            <img class="lang-en hidden" src="' + safe(img.src_en || img.src_pt) + '" alt="' + esc(img.alt_en || '') + '">',
          '          </div>',
        ].join('\n');
      }
      return '          <div><img src="' + safe(img.src) + '" alt="' + esc(img.alt_pt || '') + '"></div>';
    }).join('\n');
    return [
      '    <!-- PÔSTERES -->',
      '    <section class="sec-posters" aria-label="Pôsteres">',
      '      <div class="wrap">',
      '        <p class="label fade" data-pt="Pôsteres" data-en="Posters">Pôsteres</p>',
      '        <div class="posters-grid fade d1">',
      imgs,
      '        </div>',
      '      </div>',
      '    </section>',
    ].join('\n');
  }

  function buildCast(s) {
    if (!s || !s.enabled) return '';
    var cards = (s.members || []).map(function (m, i) {
      var delay = ['', ' d1', ' d2', ' d3'][Math.min(i, 3)];
      return [
        '          <div class="cast-card fade' + delay + '">',
        '            <span class="c-role" data-pt="' + esc(m.role_pt) + '" data-en="' + esc(m.role_en) + '">' + esc(m.role_pt) + '</span>',
        '            <span class="c-name">' + esc(m.name) + '</span>',
        '          </div>',
      ].join('\n');
    }).join('\n');
    return [
      '    <!-- ELENCO -->',
      '    <section class="sec-cast" aria-label="Elenco">',
      '      <div class="wrap">',
      '        <p class="label fade" data-pt="Elenco" data-en="Cast">Elenco</p>',
      '        <div class="cast-grid">',
      cards,
      '        </div>',
      '      </div>',
      '    </section>',
    ].join('\n');
  }

  function buildCrew(s) {
    if (!s || !s.enabled) return '';
    var columns = s.columns || [];
    /* support both columns array and flat members array */
    if (!Array.isArray(columns[0])) {
      columns = [columns];
    }
    var colHtmls = columns.map(function (col, ci) {
      var delay = ci === 0 ? ' d1' : ' d2';
      var items = col.map(function (m) {
        return [
          '            <div class="crew-item">',
          '              <span class="cr-role" data-pt="' + esc(m.role_pt) + '" data-en="' + esc(m.role_en) + '">' + esc(m.role_pt) + '</span>',
          '              <span class="cr-name">' + esc(m.name) + '</span>',
          '            </div>',
        ].join('\n');
      }).join('\n');
      return '          <div class="fade' + delay + '">\n' + items + '\n          </div>';
    });

    var inner = colHtmls.length > 1
      ? colHtmls[0] + '\n          <div class="crew-div"></div>\n' + colHtmls.slice(1).join('\n          <div class="crew-div"></div>\n')
      : colHtmls[0];

    return [
      '    <!-- EQUIPE TÉCNICA -->',
      '    <section class="sec-crew" aria-label="Equipe Técnica">',
      '      <div class="wrap">',
      '        <p class="label fade" data-pt="Equipe Técnica" data-en="Crew">Equipe Técnica</p>',
      '        <div class="crew-grid">',
      inner,
      '        </div>',
      '      </div>',
      '    </section>',
    ].join('\n');
  }

  function buildSpecs(s, proj) {
    if (!s || !s.enabled) return '';
    var titlePT = proj.title_pt || '';
    var titleEN = proj.title_en || '';
    var dur    = proj.duration || '';
    var fmt    = proj.format || '';
    var ar     = proj.aspect_ratio || '';
    var langPT = s.language_pt || '';
    var langEN = s.language_en || '';
    var subs   = s.subtitles || '';
    var country = proj.country || '';
    var countryEn = proj.country_en || proj.country || '';
    var ratingPT = s.rating_pt || '';
    var ratingEN = s.rating_en || '';
    return [
      '  <!-- FICHA TÉCNICA ──────────────────────────────────────────────── -->',
      '  <section class="sec-specs">',
      '    <div class="wrap">',
      '      <p class="label fade" data-pt="Ficha Técnica" data-en="Technical Info">Ficha Técnica</p>',
      '      <div class="specs-grid fade d1">',
      '        <div>',
      '          <div class="spec-item"><span class="sp-lbl" data-pt="Título" data-en="Title">Título</span><span class="sp-val" data-pt="' + esc(titlePT) + '" data-en="' + esc(titleEN) + '">' + esc(titlePT) + '</span></div>',
      '          <div class="spec-item"><span class="sp-lbl" data-pt="Duração" data-en="Runtime">Duração</span><span class="sp-val">' + esc(dur) + '</span></div>',
      '          <div class="spec-item"><span class="sp-lbl" data-pt="Formato" data-en="Format">Formato</span><span class="sp-val">' + safe(fmt) + '</span></div>',
      '          <div class="spec-item"><span class="sp-lbl" data-pt="Proporção" data-en="Aspect Ratio">Proporção</span><span class="sp-val">' + esc(ar) + '</span></div>',
      '        </div>',
      '        <div>',
      '          <div class="spec-item"><span class="sp-lbl" data-pt="Idioma" data-en="Language">Idioma</span><span class="sp-val" data-pt="' + esc(langPT) + '" data-en="' + esc(langEN) + '">' + esc(langPT) + '</span></div>',
      '          <div class="spec-item"><span class="sp-lbl" data-pt="Legendas" data-en="Subtitles">Legendas</span><span class="sp-val">' + esc(subs) + '</span></div>',
      '          <div class="spec-item"><span class="sp-lbl" data-pt="País" data-en="Country">País</span><span class="sp-val" data-pt="' + esc(country) + '" data-en="' + esc(countryEn) + '">' + esc(country) + '</span></div>',
      '          <div class="spec-item"><span class="sp-lbl" data-pt="Classificação" data-en="Rating">Classificação</span><span class="sp-val" data-pt="' + esc(ratingPT) + '" data-en="' + esc(ratingEN) + '">' + esc(ratingPT) + '</span></div>',
      '        </div>',
      '      </div>',
      '    </div>',
      '  </section>',
    ].join('\n');
  }

  /* ── main generate function ── */
  function generate(proj, opts) {
    opts = opts || {};
    var rootPath   = opts.rootPath   || '../../';   /* path from page to /public/ root */
    var fontsPath  = opts.fontsPath  || 'fonts/';
    var cssPath    = opts.cssPath    || rootPath + 'assets/styles/template.css';
    var jsPath     = opts.jsPath     || rootPath + 'assets/js/template.js';
    var logoPath   = opts.logoPath   || rootPath + 'assets/logo/logo.svg';
    var siteUrl    = opts.siteUrl    || 'https://www.vinipoffo.com';

    var sec = proj.sections || {};

    /* ── head ── */
    var head = [
      '<!DOCTYPE html>',
      '<html lang="pt-BR">',
      '<head>',
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<title>' + esc(proj.title_pt) + ' — Press Kit</title>',
      '<meta name="description" content="Press kit de ' + esc(proj.title_pt) + ', direção ' + esc(proj.director) + '.">',
      '<meta property="og:title" content="' + esc(proj.title_pt) + ' — ' + esc(proj.title_en) + '">',
      proj.og_image ? '<meta property="og:image" content="' + esc(proj.og_image) + '">' : '',
      '<style>',
      buildFonts(fontsPath),
      '</style>',
      '<link rel="stylesheet" href="' + cssPath + '">',
      '</head>',
      '<body>',
    ].join('\n');

    /* ── nav ── */
    var langBtnHtml = proj.bilingual === true
      ? [
          '  <button class="lang-btn" id="langBtn" aria-label="Trocar idioma">',
          '    <span class="lopt on" id="lPT">PT</span>',
          '    <span class="lsep">|</span>',
          '    <span class="lopt" id="lEN">EN</span>',
          '  </button>',
        ].join('\n')
      : '';
    var nav = [
      '<!-- GRAIN -->',
      '<div class="grain" aria-hidden="true"></div>',
      '',
      '<!-- NAV -->',
      '<nav class="nav">',
      '  <a href="' + siteUrl + '" class="nav-logo-link" target="_blank" rel="noopener noreferrer">',
      '    <img src="' + logoPath + '" alt="Vini Poffo" class="nav-logo-img">',
      '  </a>',
      langBtnHtml,
      '</nav>',
      '',
    ].join('\n');

    /* ── hero ── */
    var hero = buildHero(sec.hero, proj);

    /* ── main ── */
    var mainParts = [
      '<!-- ════════════════════ MAIN CONTENT ════════════════════ -->',
      '<main id="content">',
      '',
      buildSynopsisTrailer(sec.synopsis, sec.trailer),
      '',
      buildGallery(sec.gallery),
      '',
      buildDirectorNote(sec.director_note),
      '',
    ];

    /* director section + zenital wrapped if either enabled */
    var hasDir = sec.director_section && sec.director_section.enabled;
    var hasZen = sec.zenital && sec.zenital.enabled;
    if (hasDir || hasZen) {
      mainParts.push('  <!-- ZONA: DIREÇÃO + ZENITAL ───────────────────────────────────────── -->');
      mainParts.push('  <div class="dir-zen-zone">');
      if (hasDir) mainParts.push(buildDirectorSection(sec.director_section));
      if (hasZen) mainParts.push(buildZenital(sec.zenital, proj));
      mainParts.push('  </div><!-- /dir-zen-zone -->');
    }

    /* posters, cast, crew wrapped */
    var hasPost = sec.posters && sec.posters.enabled;
    var hasCast = sec.cast    && sec.cast.enabled;
    var hasCrew = sec.crew    && sec.crew.enabled;
    if (hasPost || hasCast || hasCrew) {
      mainParts.push('  <!-- ZONA: PÔSTERES + ELENCO + EQUIPE ─────────────────────────────── -->');
      mainParts.push('  <div class="post-lift-zone">');
      if (hasPost) mainParts.push(buildPosters(sec.posters));
      if (hasCast) mainParts.push(buildCast(sec.cast));
      if (hasCrew) mainParts.push(buildCrew(sec.crew));
      mainParts.push('  </div><!-- /post-lift-zone -->');
    }

    if (sec.specs && sec.specs.enabled) mainParts.push(buildSpecs(sec.specs, proj));

    /* contact */
    var email = proj.contact_email || 'projetos@vinipoffo.com';
    mainParts.push([
      '  <!-- CONTATO ────────────────────────────────────────────────────── -->',
      '  <section class="sec-contact">',
      '    <div class="wrap">',
      '      <p class="contact-lbl fade" data-pt="Contato &amp; Imprensa" data-en="Contact &amp; Press">Contato &amp; Imprensa</p>',
      '      <a href="mailto:' + esc(email) + '" class="contact-email fade d1">' + esc(email) + '</a>',
      '    </div>',
      '  </section>',
    ].join('\n'));

    mainParts.push('</main>');

    /* ── footer ── */
    var footer = [
      '',
      '<footer class="footer">',
      '  <span>© ' + esc(String(proj.year || new Date().getFullYear())) + ' Vini Poffo</span>',
      '  <span class="footer-title" data-pt="' + esc(proj.title_pt) + '" data-en="' + esc(proj.title_en) + '">' + esc(proj.title_pt) + '</span>',
      '</footer>',
      '',
      '<script src="' + jsPath + '"></script>',
      '</body>',
      '</html>',
    ].join('\n');

    return [head, nav, hero, '', mainParts.join('\n'), footer].join('\n');
  }

  return { generate: generate };
})();
