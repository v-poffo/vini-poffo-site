// Editor Visual Avançado - Tipo Figma/Wix
class AdvancedEditor {
  constructor() {
    this.isEditMode = false;
    this.selectedElement = null;
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;
    this.init();
  }

  init() {
    this.createEditorButton();
    this.setupEditMode();
  }

  createEditorButton() {
    const button = document.createElement('button');
    button.id = 'editor-toggle';
    button.textContent = '✏️ Design';
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
      button.textContent = '✏️ Design';
      button.style.background = '#718878';
      this.disableEditMode();
      this.saveChanges();
    }
  }

  enableEditMode() {
    // Criar overlay de edição
    this.createEditOverlay();

    // Tornar elementos editáveis
    const editableElements = document.querySelectorAll('img, h1, h2, h3, p, span, [class*="section"]');
    
    editableElements.forEach(el => {
      if (!el.closest('#editor-toggle') && !el.closest('.editor-panel')) {
        el.style.position = 'relative';
        el.style.cursor = 'grab';
        el.style.outline = '2px dashed #718878';
        el.style.outlineOffset = '4px';

        // Drag
        el.addEventListener('mousedown', (e) => this.startDrag(e, el));
        el.addEventListener('click', (e) => this.selectElement(e, el));
      }
    });

    // Criar painel de edição
    this.createEditorPanel();

    // Listener global para drag
    document.addEventListener('mousemove', (e) => this.drag(e));
    document.addEventListener('mouseup', () => this.stopDrag());
  }

  disableEditMode() {
    const editableElements = document.querySelectorAll('[style*="outline"]');
    
    editableElements.forEach(el => {
      el.style.outline = 'none';
      el.style.cursor = 'auto';
    });

    // Remover painel
    const panel = document.getElementById('editor-panel');
    if (panel) panel.remove();

    // Remover overlay
    const overlay = document.getElementById('editor-overlay');
    if (overlay) overlay.remove();

    document.removeEventListener('mousemove', (e) => this.drag(e));
    document.removeEventListener('mouseup', () => this.stopDrag());
  }

  createEditOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'editor-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      z-index: 9998;
      pointer-events: none;
    `;
    document.body.appendChild(overlay);
  }

  startDrag(e, element) {
    if (e.button !== 0) return; // Apenas clique esquerdo

    this.isDragging = true;
    this.selectedElement = element;
    
    const rect = element.getBoundingClientRect();
    this.dragOffsetX = e.clientX - rect.left;
    this.dragOffsetY = e.clientY - rect.top;

    element.style.cursor = 'grabbing';
    element.style.zIndex = '9999';
    element.style.boxShadow = '0 0 0 3px #3a7a9a, 0 10px 30px rgba(0,0,0,0.3)';

    e.preventDefault();
  }

  drag(e) {
    if (!this.isDragging || !this.selectedElement) return;

    const x = e.clientX - this.dragOffsetX;
    const y = e.clientY - this.dragOffsetY;

    this.selectedElement.style.position = 'fixed';
    this.selectedElement.style.left = x + 'px';
    this.selectedElement.style.top = y + 'px';
  }

  stopDrag() {
    if (this.selectedElement) {
      this.selectedElement.style.cursor = 'grab';
      this.selectedElement.style.zIndex = 'auto';
    }
    this.isDragging = false;
  }

  selectElement(e, element) {
    e.stopPropagation();

    if (this.selectedElement && this.selectedElement !== element) {
      this.selectedElement.style.boxShadow = 'none';
    }

    this.selectedElement = element;
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
      width: 320px;
      background: white;
      border: 2px solid #718878;
      border-radius: 8px;
      padding: 20px;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      max-height: 500px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
    `;

    panel.innerHTML = `
      <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #111A17; font-weight: bold;">Editar Elemento</h3>
      
      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 600;">Posição X (px)</label>
        <input type="number" id="pos-x" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 600;">Posição Y (px)</label>
        <input type="number" id="pos-y" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 600;">Largura (px)</label>
        <input type="number" id="width" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 600;">Altura (px)</label>
        <input type="number" id="height" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 600;">Cor do Texto</label>
        <input type="color" id="text-color" style="width: 100%; height: 40px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 600;">Cor de Fundo</label>
        <input type="color" id="bg-color" style="width: 100%; height: 40px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">
      </div>

      <div style="margin-bottom: 15px;">
        <label style="display: block; font-size: 12px; color: #666; margin-bottom: 5px; font-weight: 600;">Opacidade (%)</label>
        <input type="range" id="opacity" min="0" max="100" value="100" style="width: 100%; cursor: pointer;">
      </div>

      <button id="delete-element" style="width: 100%; padding: 10px; background: #ff6b6b; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; margin-bottom: 10px;">🗑️ Deletar</button>

      <button id="reset-styles" style="width: 100%; padding: 10px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold;">↺ Resetar</button>
    `;

    document.body.appendChild(panel);

    // Listeners
    document.getElementById('pos-x')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.left = e.target.value + 'px';
    });

    document.getElementById('pos-y')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.top = e.target.value + 'px';
    });

    document.getElementById('width')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.width = e.target.value + 'px';
    });

    document.getElementById('height')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.height = e.target.value + 'px';
    });

    document.getElementById('text-color')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.color = e.target.value;
    });

    document.getElementById('bg-color')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.backgroundColor = e.target.value;
    });

    document.getElementById('opacity')?.addEventListener('change', (e) => {
      if (this.selectedElement) this.selectedElement.style.opacity = e.target.value / 100;
    });

    document.getElementById('delete-element')?.addEventListener('click', () => {
      if (this.selectedElement && confirm('Tem certeza que quer deletar?')) {
        this.selectedElement.remove();
        this.selectedElement = null;
      }
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

    const rect = this.selectedElement.getBoundingClientRect();
    const styles = window.getComputedStyle(this.selectedElement);

    document.getElementById('pos-x').value = Math.round(rect.left);
    document.getElementById('pos-y').value = Math.round(rect.top);
    document.getElementById('width').value = Math.round(rect.width);
    document.getElementById('height').value = Math.round(rect.height);
    document.getElementById('text-color').value = this.rgbToHex(styles.color);
    document.getElementById('bg-color').value = this.rgbToHex(styles.backgroundColor);
    document.getElementById('opacity').value = Math.round(parseFloat(styles.opacity) * 100);
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

  saveChanges() {
    const html = document.documentElement.innerHTML;
    localStorage.setItem('site-design', html);
    
    alert('✅ Design salvo localmente!\n\nPara salvar permanentemente no GitHub, faça um screenshot e me mande a descrição das mudanças!');
  }
}

// Inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new AdvancedEditor();
  });
} else {
  new AdvancedEditor();
}
