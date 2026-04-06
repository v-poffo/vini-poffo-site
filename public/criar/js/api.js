/* ─── API.JS — CRUD de projetos via localStorage ────────────────────────────
   Armazena os projetos em localStorage['vp_projects'].
   Na primeira visita, tenta carregar /src/projects.json como seed.
   ──────────────────────────────────────────────────────────────────────────── */
'use strict';

var ProjectsAPI = (function () {

  var STORAGE_KEY = 'vp_projects';

  /* ── seed from projects.json ── */
  function seed(callback) {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        var data = JSON.parse(raw);
        if (data && Array.isArray(data.projects)) {
          return callback(null, data.projects);
        }
      } catch (e) { /* fall through */ }
    }
    /* try to fetch the seed */
    var attempt = function (url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          try {
            var json = JSON.parse(xhr.responseText);
            if (json && Array.isArray(json.projects)) {
              localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects: json.projects }));
              return callback(null, json.projects);
            }
          } catch (e) { /* ignore */ }
        }
        callback(null, []);
      };
      xhr.onerror = function () { callback(null, []); };
      xhr.send();
    };

    /* try relative path from /criar/ first, then absolute */
    attempt('../../src/projects.json');
  }

  /* ── getAll ── */
  function getAll(callback) {
    seed(function (err, projects) {
      callback(err, projects || []);
    });
  }

  /* ── getById ── */
  function getById(id, callback) {
    getAll(function (err, projects) {
      if (err) return callback(err);
      var found = projects.find(function (p) { return p.id === id || p.slug === id; });
      callback(null, found || null);
    });
  }

  /* ── save (create or update) ── */
  function save(project, callback) {
    getAll(function (err, projects) {
      if (err) return callback(err);
      var idx = projects.findIndex(function (p) { return p.id === project.id; });
      if (idx >= 0) {
        projects[idx] = project;
      } else {
        projects.push(project);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects: projects }));
      callback(null, project);
    });
  }

  /* ── remove ── */
  function remove(id, callback) {
    getAll(function (err, projects) {
      if (err) return callback(err);
      var filtered = projects.filter(function (p) { return p.id !== id; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ projects: filtered }));
      callback(null);
    });
  }

  /* ── export raw JSON ── */
  function exportJSON(callback) {
    getAll(function (err, projects) {
      if (err) return callback(err);
      callback(null, JSON.stringify({ projects: projects }, null, 2));
    });
  }

  /* ── reset to seed ── */
  function reset(callback) {
    localStorage.removeItem(STORAGE_KEY);
    seed(callback);
  }

  /* ── generate slug from title ── */
  function toSlug(title) {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  /* ── empty project template ── */
  function emptyProject(titlePT) {
    var slug = toSlug(titlePT || 'novo-projeto');
    return {
      id: slug,
      slug: slug,
      title_pt: titlePT || 'Novo Projeto',
      title_en: '',
      year: new Date().getFullYear(),
      duration: '',
      country: 'Brasil',
      country_en: 'Brazil',
      format: '',
      aspect_ratio: '',
      genre: '',
      genre_en: '',
      director: 'Vini Poffo',
      type: 'curta-metragem',
      enabled: true,
      bilingual: false,
      contact_email: 'projetos@vinipoffo.com',
      og_image: '',
      sections: {
        hero: { enabled: true, video: '', title_pt: '', title_en: '', label_pt: 'Um filme de Vini Poffo', label_en: 'A film by Vini Poffo', ticker_pt: '', ticker_en: '' },
        synopsis: { enabled: true, lines_pt: [], lines_en: [] },
        trailer: { enabled: true, url: '' },
        gallery: { enabled: true, images: [] },
        director_note: { enabled: true, quote_pt: ['', ''], quote_en: ['', ''], bio_pt: '', bio_en: '', signature: '— Vini Poffo', video: '' },
        director_section: { enabled: false, image_base: '', image_top: '', bio_pt: '', bio_en: '' },
        zenital: { enabled: true, video: '', label_pt: '', label_en: '' },
        posters: { enabled: true, images: [] },
        cast: { enabled: true, members: [] },
        crew: { enabled: false, columns: [[], []] },
        specs: { enabled: true, language_pt: 'Português Brasileiro', language_en: 'Brazilian Portuguese', subtitles: '', rating_pt: '', rating_en: '' }
      }
    };
  }

  return { getAll: getAll, getById: getById, save: save, remove: remove, exportJSON: exportJSON, reset: reset, toSlug: toSlug, emptyProject: emptyProject };
})();
