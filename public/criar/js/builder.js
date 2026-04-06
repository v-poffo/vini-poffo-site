/* ─── BUILDER.JS — Lógica principal do painel /criar ───────────────────────
   Gerencia UI: lista de projetos, formulário de edição, geração de HTML.
   ──────────────────────────────────────────────────────────────────────────── */
'use strict';

(function () {

  /* ─── state ─── */
  var state = {
    projects: [],
    currentId: null,
    tab: 'form',       /* 'form' | 'output' */
    dirty: false,
  };

  /* ─── DOM refs ─── */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); };

  /* ─── bootstrap ─── */
  document.addEventListener('DOMContentLoaded', function () {
    ProjectsAPI.getAll(function (err, projects) {
      state.projects = projects;
      renderSidebar();
      if (projects.length > 0) {
        selectProject(projects[0].id);
      } else {
        showEmptyState();
      }
    });

    /* tab buttons */
    $$('.tab-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.dataset.tab);
      });
    });

    /* top-level new project button */
    var btnNew = $('#btnNewProject');
    if (btnNew) btnNew.addEventListener('click', createNewProject);

    var btnExport = $('#btnExportJSON');
    if (btnExport) btnExport.addEventListener('click', exportJSON);
  });

  /* ─── sidebar ─── */
  function renderSidebar() {
    var list = $('#projectsList');
    if (!list) return;
    list.innerHTML = '';
    state.projects.forEach(function (p) {
      var item = document.createElement('div');
      item.className = 'proj-item' + (p.id === state.currentId ? ' active' : '');
      item.dataset.id = p.id;
      item.innerHTML = [
        '<div class="proj-dot ' + (p.enabled ? 'on' : '') + '"></div>',
        '<div class="proj-info">',
        '  <div class="proj-name">' + escHtml(p.title_pt) + '</div>',
        '  <div class="proj-year">' + escHtml(String(p.year || '')) + ' · ' + escHtml(p.type || '') + '</div>',
        '</div>',
      ].join('');
      item.addEventListener('click', function () { selectProject(p.id); });
      list.appendChild(item);
    });
  }

  function selectProject(id) {
    state.currentId = id;
    renderSidebar();
    var proj = state.projects.find(function (p) { return p.id === id; });
    if (proj) renderForm(proj);
  }

  /* ─── form rendering ─── */
  function renderForm(proj) {
    var container = $('#editorContent');
    if (!container) return;
    container.innerHTML = buildFormHTML(proj);
    wireForm(proj);

    /* update editor title */
    var title = $('#editorTitle');
    if (title) title.textContent = proj.title_pt;

    /* switch to form tab */
    switchTab('form');
  }

  function showEmptyState() {
    var container = $('#editorContent');
    if (container) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">🎬</div><div class="empty-text">Nenhum projeto. Crie um novo!</div></div>';
    }
  }

  /* ─── form HTML builder ─── */
  function buildFormHTML(proj) {
    var sec = proj.sections || {};
    return [
      buildInfoSection(proj),
      buildHeroSection(sec.hero || {}),
      buildSynopsisSection(sec.synopsis || {}),
      buildTrailerSection(sec.trailer || {}),
      buildGallerySection(sec.gallery || {}),
      buildDirectorNoteSection(sec.director_note || {}),
      buildDirectorSection(sec.director_section || {}),
      buildZenitalSection(sec.zenital || {}),
      buildPostersSection(sec.posters || {}),
      buildCastSection(sec.cast || {}),
      buildCrewSection(sec.crew || {}),
      buildSpecsSection(sec.specs || {}, proj),
    ].join('');
  }

  function makeSection(id, title, enabled, bodyHTML) {
    var isEnabled = enabled !== false;
    return [
      '<div class="form-section" id="fs-' + id + '">',
      '  <div class="form-section-header" data-section="' + id + '">',
      '    <span class="fs-icon">▶</span>',
      '    <span class="fs-title">' + title + '</span>',
      '    <label class="fs-toggle" onclick="event.stopPropagation()">',
      '      <div class="toggle-switch ' + (isEnabled ? 'on' : '') + '" data-toggle="' + id + '"></div>',
      '      <span>' + (isEnabled ? 'ON' : 'OFF') + '</span>',
      '    </label>',
      '  </div>',
      '  <div class="form-section-body">',
      bodyHTML,
      '  </div>',
      '</div>',
    ].join('');
  }

  function frow(label, inputHTML) {
    return '<div class="form-row"><label>' + label + '</label>' + inputHTML + '</div>';
  }

  function finput(name, value, type) {
    type = type || 'text';
    return '<input type="' + type + '" name="' + name + '" value="' + escAttr(value || '') + '">';
  }

  function ftextarea(name, value, rows) {
    return '<textarea name="' + name + '" rows="' + (rows || 4) + '">' + escHtml(value || '') + '</textarea>';
  }

  function fgrid() {
    var rows = Array.prototype.slice.call(arguments);
    return '<div class="form-grid">' + rows.join('') + '</div>';
  }

  /* ── info section ── */
  function buildInfoSection(proj) {
    return makeSection('info', 'Informações Gerais', true, [
      fgrid(
        frow('Título PT', finput('title_pt', proj.title_pt)),
        frow('Título EN', finput('title_en', proj.title_en))
      ),
      fgrid(
        frow('Slug / URL', finput('slug', proj.slug)),
        frow('Ano', finput('year', proj.year, 'number'))
      ),
      fgrid(
        frow('Duração', finput('duration', proj.duration)),
        frow('Tipo', finput('type', proj.type))
      ),
      fgrid(
        frow('País PT', finput('country', proj.country)),
        frow('País EN', finput('country_en', proj.country_en))
      ),
      fgrid(
        frow('Gênero PT', finput('genre', proj.genre)),
        frow('Gênero EN', finput('genre_en', proj.genre_en))
      ),
      fgrid(
        frow('Formato', finput('format', proj.format)),
        frow('Proporção', finput('aspect_ratio', proj.aspect_ratio))
      ),
      fgrid(
        frow('Direção', finput('director', proj.director)),
        frow('Contato / Email', finput('contact_email', proj.contact_email, 'email'))
      ),
      frow('OG Image URL', finput('og_image', proj.og_image, 'url')),
    ].join(''));
  }

  /* ── hero section ── */
  function buildHeroSection(s) {
    return makeSection('hero', 'Hero — Vídeo + Título', s.enabled, [
      frow('Arquivo de vídeo (hero)', finput('sections.hero.video', s.video)),
      fgrid(
        frow('Título PNG (PT)', finput('sections.hero.title_pt', s.title_pt)),
        frow('Título PNG (EN)', finput('sections.hero.title_en', s.title_en))
      ),
      fgrid(
        frow('Label PT', finput('sections.hero.label_pt', s.label_pt)),
        frow('Label EN', finput('sections.hero.label_en', s.label_en))
      ),
      frow('Ticker PT', finput('sections.hero.ticker_pt', s.ticker_pt)),
      frow('Ticker EN', finput('sections.hero.ticker_en', s.ticker_en)),
    ].join(''));
  }

  /* ── synopsis section ── */
  function buildSynopsisSection(s) {
    var linesPT = (s.lines_pt || []);
    var linesEN = (s.lines_en || []);
    var maxLen  = Math.max(linesPT.length, linesEN.length, 1);
    var rows = '';
    for (var i = 0; i < maxLen; i++) {
      rows += '<div class="array-item">';
      rows += '<div class="array-item-fields">';
      rows += '<div class="array-item-label">Linha ' + (i + 1) + '</div>';
      rows += fgrid(
        frow('PT', finput('syn_line_pt_' + i, linesPT[i] || '')),
        frow('EN', finput('syn_line_en_' + i, linesEN[i] || ''))
      );
      rows += '</div>';
      rows += '<button class="btn-remove btn-sm" data-remove-syn="' + i + '">✕</button>';
      rows += '</div>';
    }
    return makeSection('synopsis', 'Sinopse', s.enabled, [
      '<div id="synopsisLines">' + rows + '</div>',
      '<button class="btn-add" id="btnAddSynLine">+ Linha</button>',
    ].join(''));
  }

  /* ── trailer section ── */
  function buildTrailerSection(s) {
    return makeSection('trailer', 'Trailer (embed)', s.enabled, [
      frow('URL do embed (Vimeo / YouTube)', finput('sections.trailer.url', s.url, 'url')),
    ].join(''));
  }

  /* ── gallery section ── */
  function buildGallerySection(s) {
    var imgs = (s.images || []);
    var rows = imgs.map(function (img, i) {
      return [
        '<div class="array-item" data-img-idx="' + i + '">',
        '  <div class="array-item-fields">',
        '    <div class="array-item-label">Imagem ' + (i + 1) + '</div>',
        frow('Arquivo (src)', finput('gal_src_' + i, img.src || '')),
        fgrid(
          frow('Alt PT', finput('gal_alt_pt_' + i, img.alt_pt || '')),
          frow('Alt EN', finput('gal_alt_en_' + i, img.alt_en || ''))
        ),
        '  </div>',
        '  <button class="btn-remove btn-sm" data-remove-gal="' + i + '">✕</button>',
        '</div>',
      ].join('');
    }).join('');
    return makeSection('gallery', 'Galeria de Stills', s.enabled, [
      '<div id="galleryImages">' + rows + '</div>',
      '<button class="btn-add" id="btnAddGalImg">+ Imagem</button>',
    ].join(''));
  }

  /* ── director note section ── */
  function buildDirectorNoteSection(s) {
    return makeSection('director_note', 'Nota da Direção', s.enabled, [
      frow('Vídeo de fundo (nota)', finput('sections.director_note.video', s.video)),
      fgrid(
        frow('Citação linha 1 PT', finput('sections.director_note.quote_pt_0', (s.quote_pt || [])[0] || '')),
        frow('Citação linha 1 EN', finput('sections.director_note.quote_en_0', (s.quote_en || [])[0] || ''))
      ),
      fgrid(
        frow('Citação linha 2 PT', finput('sections.director_note.quote_pt_1', (s.quote_pt || [])[1] || '')),
        frow('Citação linha 2 EN', finput('sections.director_note.quote_en_1', (s.quote_en || [])[1] || ''))
      ),
      frow('Bio / Nota PT', ftextarea('sections.director_note.bio_pt', s.bio_pt, 5)),
      frow('Bio / Nota EN', ftextarea('sections.director_note.bio_en', s.bio_en, 5)),
      frow('Assinatura', finput('sections.director_note.signature', s.signature || '— Vini Poffo')),
    ].join(''));
  }

  /* ── director section ── */
  function buildDirectorSection(s) {
    return makeSection('director_section', 'Direção — Foto + Bio', s.enabled, [
      fgrid(
        frow('Foto base', finput('sections.director_section.image_base', s.image_base)),
        frow('Foto topo', finput('sections.director_section.image_top', s.image_top))
      ),
      frow('Bio PT', ftextarea('sections.director_section.bio_pt', s.bio_pt, 4)),
      frow('Bio EN', ftextarea('sections.director_section.bio_en', s.bio_en, 4)),
    ].join(''));
  }

  /* ── zenital section ── */
  function buildZenitalSection(s) {
    return makeSection('zenital', 'Foto Zenital (vídeo)', s.enabled, [
      frow('Arquivo de vídeo', finput('sections.zenital.video', s.video)),
      fgrid(
        frow('Label PT', finput('sections.zenital.label_pt', s.label_pt)),
        frow('Label EN', finput('sections.zenital.label_en', s.label_en))
      ),
    ].join(''));
  }

  /* ── posters section ── */
  function buildPostersSection(s) {
    var imgs = (s.images || []);
    var rows = imgs.map(function (img, i) {
      return [
        '<div class="array-item" data-poster-idx="' + i + '">',
        '  <div class="array-item-fields">',
        '    <div class="array-item-label">Pôster ' + (i + 1) + '</div>',
        fgrid(
          frow('Src PT', finput('pos_src_pt_' + i, img.src_pt || img.src || '')),
          frow('Src EN', finput('pos_src_en_' + i, img.src_en || img.src || ''))
        ),
        fgrid(
          frow('Alt PT', finput('pos_alt_pt_' + i, img.alt_pt || '')),
          frow('Alt EN', finput('pos_alt_en_' + i, img.alt_en || ''))
        ),
        '  </div>',
        '  <button class="btn-remove btn-sm" data-remove-pos="' + i + '">✕</button>',
        '</div>',
      ].join('');
    }).join('');
    return makeSection('posters', 'Pôsteres', s.enabled, [
      '<div id="postersImages">' + rows + '</div>',
      '<button class="btn-add" id="btnAddPoster">+ Pôster</button>',
    ].join(''));
  }

  /* ── cast section ── */
  function buildCastSection(s) {
    var members = (s.members || []);
    var rows = members.map(function (m, i) {
      return [
        '<div class="array-item" data-cast-idx="' + i + '">',
        '  <div class="array-item-fields">',
        '    <div class="array-item-label">Personagem ' + (i + 1) + '</div>',
        fgrid(
          frow('Papel PT', finput('cast_role_pt_' + i, m.role_pt || '')),
          frow('Papel EN', finput('cast_role_en_' + i, m.role_en || ''))
        ),
        frow('Nome do Ator/Atriz', finput('cast_name_' + i, m.name || '')),
        '  </div>',
        '  <button class="btn-remove btn-sm" data-remove-cast="' + i + '">✕</button>',
        '</div>',
      ].join('');
    }).join('');
    return makeSection('cast', 'Elenco', s.enabled, [
      '<div id="castMembers">' + rows + '</div>',
      '<button class="btn-add" id="btnAddCast">+ Elenco</button>',
    ].join(''));
  }

  /* ── crew section ── */
  function buildCrewSection(s) {
    var cols = s.columns || [[], []];
    var htmlCols = cols.map(function (col, ci) {
      var rows = col.map(function (m, mi) {
        return [
          '<div class="array-item" data-crew-col="' + ci + '" data-crew-idx="' + mi + '">',
          '  <div class="array-item-fields">',
          fgrid(
            frow('Função PT', finput('crew_' + ci + '_role_pt_' + mi, m.role_pt || '')),
            frow('Função EN', finput('crew_' + ci + '_role_en_' + mi, m.role_en || ''))
          ),
          frow('Nome', finput('crew_' + ci + '_name_' + mi, m.name || '')),
          '  </div>',
          '  <button class="btn-remove btn-sm" data-remove-crew-col="' + ci + '" data-remove-crew-idx="' + mi + '">✕</button>',
          '</div>',
        ].join('');
      }).join('');
      return [
        '<div class="form-row">',
        '<label>Coluna ' + (ci + 1) + '</label>',
        '<div id="crewCol' + ci + '">' + rows + '</div>',
        '<button class="btn-add" data-add-crew-col="' + ci + '">+ Função</button>',
        '</div>',
      ].join('');
    }).join('');
    return makeSection('crew', 'Equipe Técnica', s.enabled, htmlCols);
  }

  /* ── specs section ── */
  function buildSpecsSection(s, proj) {
    return makeSection('specs', 'Ficha Técnica', s.enabled, [
      fgrid(
        frow('Idioma PT', finput('sections.specs.language_pt', s.language_pt || 'Português Brasileiro')),
        frow('Idioma EN', finput('sections.specs.language_en', s.language_en || 'Brazilian Portuguese'))
      ),
      fgrid(
        frow('Legendas', finput('sections.specs.subtitles', s.subtitles)),
        frow('Classificação PT', finput('sections.specs.rating_pt', s.rating_pt))
      ),
      frow('Classificação EN', finput('sections.specs.rating_en', s.rating_en)),
    ].join(''));
  }

  /* ─── wire form interactions ─── */
  function wireForm(proj) {
    var container = $('#editorContent');
    if (!container) return;

    /* collapsible sections */
    $$('.form-section-header', container).forEach(function (hdr) {
      hdr.addEventListener('click', function () {
        var body = hdr.nextElementSibling;
        hdr.classList.toggle('open');
        body.classList.toggle('open');
      });
    });

    /* toggle switches */
    $$('.toggle-switch', container).forEach(function (sw) {
      sw.addEventListener('click', function (e) {
        e.stopPropagation();
        sw.classList.toggle('on');
        var lbl = sw.nextElementSibling;
        if (lbl) lbl.textContent = sw.classList.contains('on') ? 'ON' : 'OFF';
        markDirty();
      });
    });

    /* input changes */
    container.addEventListener('input', function () { markDirty(); });

    /* add syn line */
    var btnAddSyn = $('#btnAddSynLine', container);
    if (btnAddSyn) {
      btnAddSyn.addEventListener('click', function () {
        var synLines = $('#synopsisLines', container);
        var count = $$('.array-item', synLines).length;
        var item = document.createElement('div');
        item.className = 'array-item';
        item.innerHTML = [
          '<div class="array-item-fields">',
          '<div class="array-item-label">Linha ' + (count + 1) + '</div>',
          fgrid(
            frow('PT', finput('syn_line_pt_' + count, '')),
            frow('EN', finput('syn_line_en_' + count, ''))
          ),
          '</div>',
          '<button class="btn-remove btn-sm" data-remove-syn="' + count + '">✕</button>',
        ].join('');
        synLines.appendChild(item);
        markDirty();
      });
    }

    /* add gallery image */
    var btnAddGal = $('#btnAddGalImg', container);
    if (btnAddGal) {
      btnAddGal.addEventListener('click', function () {
        var galImages = $('#galleryImages', container);
        var count = $$('.array-item', galImages).length;
        var item = document.createElement('div');
        item.className = 'array-item';
        item.setAttribute('data-img-idx', count);
        item.innerHTML = [
          '<div class="array-item-fields">',
          '<div class="array-item-label">Imagem ' + (count + 1) + '</div>',
          frow('Arquivo (src)', finput('gal_src_' + count, '')),
          fgrid(
            frow('Alt PT', finput('gal_alt_pt_' + count, '')),
            frow('Alt EN', finput('gal_alt_en_' + count, ''))
          ),
          '</div>',
          '<button class="btn-remove btn-sm" data-remove-gal="' + count + '">✕</button>',
        ].join('');
        galImages.appendChild(item);
        markDirty();
      });
    }

    /* add poster */
    var btnAddPoster = $('#btnAddPoster', container);
    if (btnAddPoster) {
      btnAddPoster.addEventListener('click', function () {
        var posImages = $('#postersImages', container);
        var count = $$('.array-item', posImages).length;
        var item = document.createElement('div');
        item.className = 'array-item';
        item.setAttribute('data-poster-idx', count);
        item.innerHTML = [
          '<div class="array-item-fields">',
          '<div class="array-item-label">Pôster ' + (count + 1) + '</div>',
          fgrid(
            frow('Src PT', finput('pos_src_pt_' + count, '')),
            frow('Src EN', finput('pos_src_en_' + count, ''))
          ),
          fgrid(
            frow('Alt PT', finput('pos_alt_pt_' + count, '')),
            frow('Alt EN', finput('pos_alt_en_' + count, ''))
          ),
          '</div>',
          '<button class="btn-remove btn-sm" data-remove-pos="' + count + '">✕</button>',
        ].join('');
        posImages.appendChild(item);
        markDirty();
      });
    }

    /* add cast member */
    var btnAddCast = $('#btnAddCast', container);
    if (btnAddCast) {
      btnAddCast.addEventListener('click', function () {
        var castList = $('#castMembers', container);
        var count = $$('.array-item', castList).length;
        var item = document.createElement('div');
        item.className = 'array-item';
        item.setAttribute('data-cast-idx', count);
        item.innerHTML = [
          '<div class="array-item-fields">',
          '<div class="array-item-label">Personagem ' + (count + 1) + '</div>',
          fgrid(
            frow('Papel PT', finput('cast_role_pt_' + count, '')),
            frow('Papel EN', finput('cast_role_en_' + count, ''))
          ),
          frow('Nome do Ator/Atriz', finput('cast_name_' + count, '')),
          '</div>',
          '<button class="btn-remove btn-sm" data-remove-cast="' + count + '">✕</button>',
        ].join('');
        castList.appendChild(item);
        markDirty();
      });
    }

    /* add crew function buttons */
    $$('[data-add-crew-col]', container).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ci = parseInt(btn.dataset.addCrewCol, 10);
        var crewCol = $('#crewCol' + ci, container);
        var count = $$('.array-item', crewCol).length;
        var item = document.createElement('div');
        item.className = 'array-item';
        item.setAttribute('data-crew-col', ci);
        item.setAttribute('data-crew-idx', count);
        item.innerHTML = [
          '<div class="array-item-fields">',
          fgrid(
            frow('Função PT', finput('crew_' + ci + '_role_pt_' + count, '')),
            frow('Função EN', finput('crew_' + ci + '_role_en_' + count, ''))
          ),
          frow('Nome', finput('crew_' + ci + '_name_' + count, '')),
          '</div>',
          '<button class="btn-remove btn-sm" data-remove-crew-col="' + ci + '" data-remove-crew-idx="' + count + '">✕</button>',
        ].join('');
        crewCol.insertBefore(item, btn);
        markDirty();
      });
    });

    /* remove buttons (delegated) */
    container.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove-syn]');
      if (btn) { btn.closest('.array-item').remove(); markDirty(); return; }
      btn = e.target.closest('[data-remove-gal]');
      if (btn) { btn.closest('.array-item').remove(); markDirty(); return; }
      btn = e.target.closest('[data-remove-pos]');
      if (btn) { btn.closest('.array-item').remove(); markDirty(); return; }
      btn = e.target.closest('[data-remove-cast]');
      if (btn) { btn.closest('.array-item').remove(); markDirty(); return; }
      btn = e.target.closest('[data-remove-crew-idx]');
      if (btn) { btn.closest('.array-item').remove(); markDirty(); return; }
    });

    /* action bar buttons */
    wireActionBar(proj);
  }

  function wireActionBar(proj) {
    var btnSave    = $('#btnSave');
    var btnPreview = $('#btnPreview');
    var btnGenHTML = $('#btnGenHTML');
    var btnDelete  = $('#btnDelete');

    if (btnSave) {
      btnSave.onclick = function () { saveCurrentProject(); };
    }
    if (btnPreview) {
      btnPreview.onclick = function () {
        var p = collectFormData(proj);
        switchTab('output');
        generateAndShowHTML(p);
      };
    }
    if (btnGenHTML) {
      btnGenHTML.onclick = function () {
        var p = collectFormData(proj);
        switchTab('output');
        generateAndShowHTML(p);
      };
    }
    if (btnDelete) {
      btnDelete.onclick = function () { confirmDelete(proj); };
    }
  }

  /* ─── collect form data ─── */
  function collectFormData(origProj) {
    var container = $('#editorContent');
    if (!container) return origProj;

    var proj = JSON.parse(JSON.stringify(origProj));

    /* helper: get field value */
    function val(name) {
      var el = container.querySelector('[name="' + name + '"]');
      return el ? el.value.trim() : '';
    }

    /* top-level fields */
    proj.title_pt    = val('title_pt');
    proj.title_en    = val('title_en');
    proj.slug        = val('slug') || ProjectsAPI.toSlug(proj.title_pt);
    proj.id          = proj.slug;
    proj.year        = parseInt(val('year'), 10) || proj.year;
    proj.duration    = val('duration');
    proj.type        = val('type');
    proj.country     = val('country');
    proj.country_en  = val('country_en');
    proj.genre       = val('genre');
    proj.genre_en    = val('genre_en');
    proj.format      = val('format');
    proj.aspect_ratio = val('aspect_ratio');
    proj.director    = val('director');
    proj.contact_email = val('contact_email');
    proj.og_image    = val('og_image');

    var sec = proj.sections;

    /* toggle states */
    function isOn(sectionId) {
      var sw = container.querySelector('[data-toggle="' + sectionId + '"]');
      return sw ? sw.classList.contains('on') : false;
    }
    ['hero','synopsis','trailer','gallery','director_note','director_section','zenital','posters','cast','crew','specs'].forEach(function (id) {
      if (sec[id]) sec[id].enabled = isOn(id);
    });

    /* simple section fields */
    sec.hero.video     = val('sections.hero.video');
    sec.hero.title_pt  = val('sections.hero.title_pt');
    sec.hero.title_en  = val('sections.hero.title_en');
    sec.hero.label_pt  = val('sections.hero.label_pt');
    sec.hero.label_en  = val('sections.hero.label_en');
    sec.hero.ticker_pt = val('sections.hero.ticker_pt');
    sec.hero.ticker_en = val('sections.hero.ticker_en');

    sec.trailer.url = val('sections.trailer.url');

    sec.director_note.video     = val('sections.director_note.video');
    sec.director_note.quote_pt  = [val('sections.director_note.quote_pt_0'), val('sections.director_note.quote_pt_1')].filter(Boolean);
    sec.director_note.quote_en  = [val('sections.director_note.quote_en_0'), val('sections.director_note.quote_en_1')].filter(Boolean);
    sec.director_note.bio_pt    = val('sections.director_note.bio_pt');
    sec.director_note.bio_en    = val('sections.director_note.bio_en');
    sec.director_note.signature = val('sections.director_note.signature');

    sec.director_section.image_base = val('sections.director_section.image_base');
    sec.director_section.image_top  = val('sections.director_section.image_top');
    sec.director_section.bio_pt     = val('sections.director_section.bio_pt');
    sec.director_section.bio_en     = val('sections.director_section.bio_en');

    sec.zenital.video    = val('sections.zenital.video');
    sec.zenital.label_pt = val('sections.zenital.label_pt');
    sec.zenital.label_en = val('sections.zenital.label_en');

    sec.specs.language_pt = val('sections.specs.language_pt');
    sec.specs.language_en = val('sections.specs.language_en');
    sec.specs.subtitles   = val('sections.specs.subtitles');
    sec.specs.rating_pt   = val('sections.specs.rating_pt');
    sec.specs.rating_en   = val('sections.specs.rating_en');

    /* synopsis lines */
    var synItems = $$('#synopsisLines .array-item', container);
    sec.synopsis.lines_pt = [];
    sec.synopsis.lines_en = [];
    synItems.forEach(function (item, i) {
      var pt = item.querySelector('[name^="syn_line_pt"]');
      var en = item.querySelector('[name^="syn_line_en"]');
      sec.synopsis.lines_pt.push(pt ? pt.value : '');
      sec.synopsis.lines_en.push(en ? en.value : '');
    });

    /* gallery images */
    var galItems = $$('#galleryImages .array-item', container);
    sec.gallery.images = galItems.map(function (item, i) {
      var src    = item.querySelector('[name^="gal_src"]');
      var altPT  = item.querySelector('[name^="gal_alt_pt"]');
      var altEN  = item.querySelector('[name^="gal_alt_en"]');
      return { src: src ? src.value : '', alt_pt: altPT ? altPT.value : '', alt_en: altEN ? altEN.value : '' };
    });

    /* posters */
    var posItems = $$('#postersImages .array-item', container);
    sec.posters.images = posItems.map(function (item, i) {
      var srcPT  = item.querySelector('[name^="pos_src_pt"]');
      var srcEN  = item.querySelector('[name^="pos_src_en"]');
      var altPT  = item.querySelector('[name^="pos_alt_pt"]');
      var altEN  = item.querySelector('[name^="pos_alt_en"]');
      return { src_pt: srcPT ? srcPT.value : '', src_en: srcEN ? srcEN.value : '', alt_pt: altPT ? altPT.value : '', alt_en: altEN ? altEN.value : '' };
    });

    /* cast */
    var castItems = $$('#castMembers .array-item', container);
    sec.cast.members = castItems.map(function (item, i) {
      var rolePT = item.querySelector('[name^="cast_role_pt"]');
      var roleEN = item.querySelector('[name^="cast_role_en"]');
      var name   = item.querySelector('[name^="cast_name"]');
      return { role_pt: rolePT ? rolePT.value : '', role_en: roleEN ? roleEN.value : '', name: name ? name.value : '' };
    });

    /* crew */
    var numCols = (sec.crew.columns || [[], []]).length;
    sec.crew.columns = [];
    for (var ci = 0; ci < numCols; ci++) {
      var colItems = $$('#crewCol' + ci + ' .array-item', container);
      sec.crew.columns.push(colItems.map(function (item) {
        var rolePT = item.querySelector('[name*="_role_pt_"]');
        var roleEN = item.querySelector('[name*="_role_en_"]');
        var name   = item.querySelector('[name*="_name_"]');
        return { role_pt: rolePT ? rolePT.value : '', role_en: roleEN ? roleEN.value : '', name: name ? name.value : '' };
      }));
    }

    return proj;
  }

  /* ─── save current project ─── */
  function saveCurrentProject() {
    var origProj = state.projects.find(function (p) { return p.id === state.currentId; });
    if (!origProj) return;
    var proj = collectFormData(origProj);
    ProjectsAPI.save(proj, function (err) {
      if (err) { toast('Erro ao salvar', 'error'); return; }
      /* update state */
      var idx = state.projects.findIndex(function (p) { return p.id === state.currentId; });
      if (idx >= 0) state.projects[idx] = proj;
      else state.projects.push(proj);
      state.currentId = proj.id;
      state.dirty = false;
      renderSidebar();
      toast('Projeto salvo!');
    });
  }

  /* ─── generate HTML output ─── */
  function generateAndShowHTML(proj) {
    if (!window.ProjectBuilder) {
      toast('Builder JS não carregado', 'error');
      return;
    }
    var html = window.ProjectBuilder.generate(proj, {
      rootPath: '../../',
      fontsPath: 'fonts/',
      cssPath: '../../assets/styles/template.css',
      jsPath: '../../assets/js/template.js',
      logoPath: '../../assets/logo/logo.svg',
      siteUrl: 'https://www.vinipoffo.com',
    });

    var outputContainer = $('#outputContent');
    if (!outputContainer) return;

    outputContainer.innerHTML = [
      '<div class="code-output">',
      '  <div class="code-output-header">',
      '    <span class="code-output-title">HTML Gerado — public/projetos/' + escHtml(proj.slug) + '/index.html</span>',
      '    <div style="display:flex;gap:.5rem">',
      '      <button class="btn btn-secondary btn-sm" id="btnCopyHTML">Copiar</button>',
      '      <button class="btn btn-primary btn-sm" id="btnDownloadHTML">Download</button>',
      '    </div>',
      '  </div>',
      '  <pre class="code-pre" id="htmlOutput">' + escHtml(html) + '</pre>',
      '</div>',
      '<div class="code-output">',
      '  <div class="code-output-header">',
      '    <span class="code-output-title">Preview</span>',
      '    <button class="btn btn-outline btn-sm" id="btnOpenPreview">Abrir</button>',
      '  </div>',
      '  <iframe id="previewFrame" style="width:100%;height:500px;border:none;background:#050d0f"></iframe>',
      '</div>',
    ].join('');

    /* preview */
    var frame = document.getElementById('previewFrame');
    if (frame) frame.srcdoc = html;

    /* copy */
    var btnCopy = document.getElementById('btnCopyHTML');
    if (btnCopy) {
      btnCopy.onclick = function () {
        navigator.clipboard.writeText(html).then(function () {
          toast('HTML copiado!');
        }).catch(function () {
          /* fallback */
          var ta = document.createElement('textarea');
          ta.value = html;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          toast('HTML copiado!');
        });
      };
    }

    /* download */
    var btnDl = document.getElementById('btnDownloadHTML');
    if (btnDl) {
      btnDl.onclick = function () {
        var blob = new Blob([html], { type: 'text/html' });
        var url  = URL.createObjectURL(blob);
        var a    = document.createElement('a');
        a.href   = url;
        a.download = proj.slug + '_index.html';
        a.click();
        URL.revokeObjectURL(url);
        toast('Download iniciado!');
      };
    }

    /* open preview in new tab */
    var btnOpen = document.getElementById('btnOpenPreview');
    if (btnOpen) {
      btnOpen.onclick = function () {
        var w = window.open('', '_blank');
        w.document.write(html);
        w.document.close();
      };
    }
  }

  /* ─── new project ─── */
  function createNewProject() {
    var title = prompt('Título do novo projeto (PT):');
    if (!title) return;
    var proj = ProjectsAPI.emptyProject(title);
    /* check slug uniqueness */
    var existingSlugs = state.projects.map(function (p) { return p.slug; });
    var slug = proj.slug;
    var counter = 1;
    while (existingSlugs.indexOf(slug) >= 0) {
      slug = proj.slug + '-' + (++counter);
    }
    proj.slug = slug;
    proj.id   = slug;

    ProjectsAPI.save(proj, function (err) {
      if (err) { toast('Erro ao criar projeto', 'error'); return; }
      state.projects.push(proj);
      renderSidebar();
      selectProject(proj.id);
      toast('Projeto criado!');
    });
  }

  /* ─── delete project ─── */
  function confirmDelete(proj) {
    var modal = document.getElementById('deleteModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.getElementById('deleteModalTitle').textContent = 'Deletar "' + proj.title_pt + '"?';
      document.getElementById('btnConfirmDelete').onclick = function () {
        modal.classList.add('hidden');
        doDelete(proj.id);
      };
      document.getElementById('btnCancelDelete').onclick = function () {
        modal.classList.add('hidden');
      };
    } else {
      if (confirm('Deletar "' + proj.title_pt + '"? Esta ação não pode ser desfeita.')) {
        doDelete(proj.id);
      }
    }
  }

  function doDelete(id) {
    ProjectsAPI.remove(id, function (err) {
      if (err) { toast('Erro ao deletar', 'error'); return; }
      state.projects = state.projects.filter(function (p) { return p.id !== id; });
      state.currentId = null;
      renderSidebar();
      if (state.projects.length > 0) {
        selectProject(state.projects[0].id);
      } else {
        showEmptyState();
      }
      toast('Projeto deletado');
    });
  }

  /* ─── export JSON ─── */
  function exportJSON() {
    ProjectsAPI.exportJSON(function (err, json) {
      if (err) { toast('Erro', 'error'); return; }
      var blob = new Blob([json], { type: 'application/json' });
      var url  = URL.createObjectURL(blob);
      var a    = document.createElement('a');
      a.href   = url;
      a.download = 'projects.json';
      a.click();
      URL.revokeObjectURL(url);
      toast('JSON exportado!');
    });
  }

  /* ─── tab switching ─── */
  function switchTab(tab) {
    state.tab = tab;
    $$('.tab-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    var formContent   = $('#editorContent');
    var outputContent = $('#outputContent');
    if (formContent)   formContent.classList.toggle('hidden', tab !== 'form');
    if (outputContent) outputContent.classList.toggle('hidden', tab !== 'output');
  }

  /* ─── dirty state ─── */
  function markDirty() {
    state.dirty = true;
    var btnSave = $('#btnSave');
    if (btnSave) btnSave.style.opacity = '1';
  }

  /* ─── toast notifications ─── */
  function toast(msg, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast' + (type ? ' ' + type : '');
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(function () { el.remove(); }, 3000);
  }

  /* ─── util ─── */
  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escAttr(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
  }

})();
