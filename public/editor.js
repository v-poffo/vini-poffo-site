// Editor Visual Simples para Vini Poffo Site
class SimpleEditor {
  constructor() {
    this.isEditMode = false;
    this.selectedElement = null;
    this.init();
  }

  init() {
    // Criar botão de edição
    this.createEditorButton();
    
    // Adicionar listener para modo edição
    this.setupEditMode();
  }

  createEditorButton() {
    const button = document.createElement('button');
    button.id = 'editor-toggle';
    button.textContent = '✏️ Editar';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 10000;
      padding: 12px 20px;
      background: #718878;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      transition: all 0.3s ease;
    `;

    button.addEventListener('mouseover', () => {
      button.style.background = '#5a6b62';
      button.style.transform = 'scale(1.05)';
    });

    button.addEventListener('mouseout', () => {
      button.style.background = '#718878';
      button.style.transform = 'scale(1)';
    });

    button.addEventListener('click', () => this.toggleEditMode());
    document.body.appendChild(button);
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    const button = document.getElementById('editor-toggle');

    if (this.isEditMode) {
      button.textContent = '💾 Salvar';
      button.style.background = '#3a7a9a';
      this.enableEditMode();
    } else {
      button.textContent = '✏️ Editar';
      button.style.background = '#718878';
      this.disableEditMode();
      this.saveChanges();
    }
  }

  enableEditMode() {
    // Tornar elementos editáveis
    const editableElements = document.querySelectorAll('h1, h2, h3, p, span, a');
    
    editableElements.forEach(el => {
      if (!el.closest('#editor-toggle') && !el.closest('.editor-panel')) {
        el.contentEditable = true;
        el.style.outline = '2px dashed #718878';
        el.style.outlineOffset = '4px';
        el.style.cursor = 'text';
        el.style.backgroundColor = 'rgba(113, 136, 120, 0.1)';

        el.addEventListener('click', (e) => this.selectElement(e));
        el.addEventListener('input', () => this.updatePreview());
      }
    });

    // Criar painel de edição
    this.createEditorPanel();
  }

  disableEditMode() {
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    
    editableElements.forEach(el => {
      el.contentEditable = false;
      el.style.outline = 'none';
      el.style.backgroundColor = 'transparent';
      el.style.cursor = 'auto';
    });

    // Remover painel
    const panel = document.getElementById('editor-panel');
    if (panel) panel.remove();
  }

  selectElement(e) {
    e.stopPropagation();
    
    if (this.selectedElement) {
      this.selectedElement.style.boxShadow = 'none';
    }

    this.selectedElement = e.target;
    this.selectedElement.style.boxShadow = '0 0 0 3px #3a7a9a';
    
    this.updateEditorPanel();
  }

  createEditorPanel() {
    const panel = document.createElement('div');
    panel.id = 'editor-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 300px;
      background: white;
      border: 2px solid #718878;
      border-radius: 8px;
      padding: 20px;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      max-height: 400px;
      overflow-y: auto;
    `;

    panel.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #111A17;">Editar Elemento</h3>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Cor do Texto</label>
        <input type="color" id="text-color" style="width: 100%; height: 40px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Cor de Fundo</label>
        <input type="color" id="bg-color" style="width: 100%; height: 40px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Tamanho da Fonte (px)</label>
        <input type="number" id="font-size" min="8" max="72" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px;">Peso da Fonte</label>
        <select id="font-weight" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="900">Extra Bold</option>
        </select>
      </div>

      <button id="reset-styles" style="width: 100%; padding: 10px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px;">Resetar Estilos</button>
    `;

    document.body.appendChild(panel);

    // Adicionar listeners
    document.getElementById('text-color')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.color = e.target.value;
    });

    document.getElementById('bg-color')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.backgroundColor = e.target.value;
    });

    document.getElementById('font-size')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.fontSize = e.target.value + 'px';
    });

    document.getElementById('font-weight')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.fontWeight = e.target.value;
    });

    document.getElementById('reset-styles')?.addEventListener('click', () => {
      if (this.selectedElement) {
        this.selectedElement.style.cssText = '';
        this.updateEditorPanel();
      }
    });
  }

  updateEditorPanel() {
    if (!this.selectedElement) return;

    const styles = window.getComputedStyle(this.selectedElement);
    
    const textColorInput = document.getElementById('text-color');
    const bgColorInput = document.getElementById('bg-color');
    const fontSizeInput = document.getElementById('font-size');
    const fontWeightInput = document.getElementById('font-weight');

    if (textColorInput) textColorInput.value = this.rgbToHex(styles.color);
    if (bgColorInput) bgColorInput.value = this.rgbToHex(styles.backgroundColor);
    if (fontSizeInput) fontSizeInput.value = parseInt(styles.fontSize);
    if (fontWeightInput) fontWeightInput.value = styles.fontWeight;
  }

  rgbToHex(rgb) {
    if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return '#000000';
    
    const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return '#000000';

    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`.toUpperCase();
  }

  updatePreview() {
    // Atualizar preview em tempo real
  }

  saveChanges() {
    // Salvar mudanças no localStorage
    const html = document.documentElement.innerHTML;
    localStorage.setItem('site-backup', html);
    
    alert('✅ Mudanças salvas localmente!\n\nPara salvar no GitHub, você precisa fazer commit manual ou usar Git.');
  }
}

// Inicializar editor quando página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new SimpleEditor();
  });
} else {
  new SimpleEditor();
}
