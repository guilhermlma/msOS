// ModularToolbar.js
// Toolbar de formatação para notas modulares

export default class ModularToolbar {
    constructor(parent, targetEditable) {
        this.parent = parent; // container da nota
        this.targetEditable = targetEditable; // div contenteditable
        this.toolbar = null;
        this.createToolbar();
    }

    createToolbar() {
        if (this.toolbar) return;
        const bar = document.createElement('div');
        bar.className = 'modular-toolbar';
        bar.style.position = 'absolute';
        bar.style.left = '50%';
        bar.style.transform = 'translateX(-50%)';
        bar.style.bottom = '0';
        bar.style.height = '40px';
        bar.style.minWidth = '270px';
        bar.style.width = '100%';
        bar.style.background = 'rgba(30,32,36,0.98)';
        bar.style.display = 'flex';
        bar.style.alignItems = 'center';
        bar.style.justifyContent = 'center';
        bar.style.flexWrap = 'nowrap';
        bar.style.overflow = 'hidden';
        bar.style.borderRadius = '0 0 10px 10px';
        bar.style.zIndex = '50';
        bar.style.boxShadow = '0 -2px 8px rgba(0,0,0,0.18)';
        bar.style.padding = '0 8px';
        bar.style.userSelect = 'none';
        // Botões na ordem e tipos pedidos (sem lista numerada)
        const buttons = [
            { cmd: 'bold', icon: '<img src="assets/msos/BoldIcon.png" width="20" height="20" draggable="false" style="pointer-events:none;user-select:none;image-rendering:crisp-edges;" alt="Negrito">', title: 'Negrito (Ctrl+B)' },
            { cmd: 'underline', icon: '<img src="assets/msos/UnderlineIcon.png" width="20" height="20" draggable="false" style="pointer-events:none;user-select:none;image-rendering:crisp-edges;" alt="Sublinhado">', title: 'Sublinhado (Ctrl+U)' },
            { cmd: 'strikeThrough', icon: '<img src="assets/msos/StrikethroughIcon.png" width="20" height="20" draggable="false" style="pointer-events:none;user-select:none;image-rendering:crisp-edges;" alt="Taxado">', title: 'Taxado' },
            { cmd: 'justifyLeft', icon: '<img src="assets/msos/JustifyLeftIcon.png" width="20" height="20" draggable="false" style="pointer-events:none;user-select:none;image-rendering:crisp-edges;" alt="Alinhar à esquerda">', title: 'Alinhar à esquerda' },
            { cmd: 'justifyCenter', icon: '<img src="assets/msos/JustifyCenterIcon.png" width="20" height="20" draggable="false" style="pointer-events:none;user-select:none;image-rendering:crisp-edges;" alt="Centralizar">', title: 'Centralizar' },
            { cmd: 'justifyRight', icon: '<img src="assets/msos/JustifyRightIcon.png" width="20" height="20" draggable="false" style="pointer-events:none;user-select:none;image-rendering:crisp-edges;" alt="Alinhar à direita">', title: 'Alinhar à direita' },
            { cmd: 'insertUnorderedList', icon: '<img src="assets/msos/UnorderedListIcon.png" width="20" height="20" draggable="false" style="pointer-events:none;user-select:none;image-rendering:crisp-edges;" alt="Lista com pontos">', title: 'Lista com pontos' },
            { cmd: 'insertCheckbox', icon: '<img src="assets/msos/CheckboxIcon.png" width="20" height="20" draggable="false" style="pointer-events:none;user-select:none;image-rendering:crisp-edges;" alt="Lista de verificação">', title: 'Lista de verificação' },
        ];
        bar.style.gap = '2px';
        bar.style.padding = '0 3px';
        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.innerHTML = btn.icon;
            b.title = btn.title;
            b.className = 'modular-toolbar-btn';
            b.style.background = 'none';
            b.style.border = 'none';
            b.style.color = '#f0f0f0';
            b.style.fontSize = '1.1rem';
            b.style.cursor = 'pointer';
            b.style.padding = '2px 6px';
            b.style.borderRadius = '6px';
            b.style.transition = 'background 0.2s';
            b.style.userSelect = 'none';
            b.setAttribute('unselectable', 'on');
            b.addEventListener('copy', e => e.preventDefault());
            b.addEventListener('selectstart', e => e.preventDefault());
            // Impede seleção nos SVGs/textos internos
            b.addEventListener('mouseenter', () => {
                const svgs = b.querySelectorAll('svg, text');
                svgs.forEach(el => {
                    el.style.userSelect = 'none';
                    el.setAttribute('unselectable', 'on');
                });
            });
            b.addEventListener('mousedown', e => {
                e.preventDefault();
                if (btn.cmd === 'formatBlock') {
                    document.execCommand('formatBlock', false, btn.block === 'DIV' ? 'DIV' : 'P');
                } else if (btn.cmd === 'insertCheckbox') {
                    // Insere um unicode de checkbox (☐) clicável antes do texto selecionado
                    const sel = window.getSelection();
                    if (sel.rangeCount > 0) {
                        const range = sel.getRangeAt(0);
                        // Cria um span clicável com o unicode
                        const checkboxSpan = document.createElement('span');
                        checkboxSpan.textContent = '\u2610';
                        checkboxSpan.contentEditable = 'false';
                        checkboxSpan.style.cursor = 'pointer';
                        checkboxSpan.style.userSelect = 'none';
                        checkboxSpan.style.marginRight = '4px';
                        checkboxSpan.addEventListener('click', function(e) {
                            e.stopPropagation();
                            const checked = this.textContent === '\u2610';
                            this.textContent = checked ? '\u2611' : '\u2610';
                            // Taxa ou destaxa o texto à direita
                            let next = this.nextSibling;
                            // Se já houver um <s>, alterna/remover
                            if (next && next.nodeType === 1 && next.tagName === 'S') {
                                if (!checked) {
                                    // Destaxa: remove o <s> mas mantém o texto
                                    const text = next.textContent;
                                    next.replaceWith(document.createTextNode(text));
                                }
                            } else if (checked) {
                                // Taxa: envolve o texto à direita em <s>
                                let textToStrike = '';
                                let nodesToRemove = [];
                                let node = this.nextSibling;
                                // Junta todos os nós de texto até o próximo checkbox ou fim
                                while (node && !(node.nodeType === 1 && node.textContent && (node.textContent === '\u2610' || node.textContent === '\u2611'))) {
                                    if (node.nodeType === 3) {
                                        textToStrike += node.textContent;
                                        nodesToRemove.push(node);
                                    } else if (node.nodeType === 1 && node.tagName !== 'S') {
                                        textToStrike += node.textContent;
                                        nodesToRemove.push(node);
                                    } else {
                                        break;
                                    }
                                    node = node.nextSibling;
                                }
                                if (textToStrike) {
                                    const s = document.createElement('s');
                                    s.textContent = textToStrike;
                                    this.parentNode.insertBefore(s, this.nextSibling);
                                    nodesToRemove.forEach(n => n.remove());
                                }
                            }
                        });
                        range.insertNode(checkboxSpan);
                        // Move o cursor após o checkbox
                        range.setStartAfter(checkboxSpan);
                        range.collapse(true);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                } else {
                    document.execCommand(btn.cmd, false, btn.value || null);
                }
                this.targetEditable.focus();
            });
            bar.appendChild(b);
        });
        this.toolbar = bar;
        this.parent.appendChild(bar);
        bar.style.display = 'none';
    }

    show() {
        if (this.toolbar) this.toolbar.style.display = 'flex';
    }
    hide() {
        if (this.toolbar) this.toolbar.style.display = 'none';
    }
    remove() {
        if (this.toolbar && this.toolbar.parentNode) this.toolbar.parentNode.removeChild(this.toolbar);
        this.toolbar = null;
    }
}
