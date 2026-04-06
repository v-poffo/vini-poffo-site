/* ─── PREVIEW.JS — Preview em tempo real do projeto ─────────────────────────
   Renderiza o HTML gerado num iframe dentro do painel.
   ──────────────────────────────────────────────────────────────────────────── */
'use strict';

var ProjectPreview = (function () {

  var _frame = null;
  var _debounceTimer = null;

  function init(iframeEl) {
    _frame = iframeEl;
  }

  /* render HTML in iframe via srcdoc */
  function render(html) {
    if (!_frame) return;
    /* srcdoc for isolation; base tag to resolve relative URLs */
    _frame.srcdoc = html;
  }

  /* debounced render to avoid thrashing */
  function debouncedRender(html, delay) {
    clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(function () { render(html); }, delay || 600);
  }

  /* generate a simplified preview HTML (no heavy assets, just structure + styles) */
  function buildPreviewHTML(project) {
    if (!window.ProjectBuilder) return '<p style="color:#555;font-family:sans-serif;padding:2rem">Builder not loaded</p>';

    /* generate full HTML */
    var html = window.ProjectBuilder.generate(project, {
      rootPath:  '/assets/',
      cssPath:   '/assets/styles/template.css',
      jsPath:    '/assets/js/template.js',
      logoPath:  '/assets/logo/logo.svg',
      siteUrl:   'https://www.vinipoffo.com',
    });
    return html;
  }

  function update(project) {
    var html = buildPreviewHTML(project);
    debouncedRender(html, 400);
  }

  function updateNow(project) {
    var html = buildPreviewHTML(project);
    render(html);
  }

  return { init: init, render: render, update: update, updateNow: updateNow, buildPreviewHTML: buildPreviewHTML };
})();
