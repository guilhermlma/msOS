// ModularNotes.js
// Funções e classe para gerenciar notas do sistema modular

class ModularNotes {
    constructor(containerSelector = '.container') {
        this.container = document.querySelector(containerSelector);
        this.notes = [];
        this.notesArea = null;
        this.notePositions = [
            {x:80, y:80},
            {x:160, y:160},
            {x:240, y:240},
            {x:320, y:320},
            {x:400, y:400},
            {x:480, y:480}
        ];
        this.nextNotePosIndex = 0;
    }

    showNotesArea() {
        // Mantém para compatibilidade, mas não usado para notas visuais
    }

    createNote({x, y, title = 'nova_nota', content = ''} = {}) {
        // Posição cíclica entre posições predefinidas
        if (typeof x !== 'number' || typeof y !== 'number') {
            const pos = this.notePositions[this.nextNotePosIndex];
            x = pos.x;
            y = pos.y;
            this.nextNotePosIndex = (this.nextNotePosIndex + 1) % this.notePositions.length;
        }
        // Cria uma nota visual 270x190
        const note = document.createElement('div');
        note.className = 'modular-note';
        note.style.position = 'absolute';
        note.style.left = `${x}px`;
        note.style.top = `${y}px`;
        note.style.width = '270px';
        note.style.height = '190px';
        note.style.background = '#23272b';
        note.style.borderRadius = '10px';
        note.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
        note.style.display = 'flex';
        note.style.flexDirection = 'column';
        note.style.overflow = 'hidden';
        note.style.zIndex = '30';
        // Titlebar
        const titlebar = document.createElement('div');
        titlebar.className = 'modular-note-titlebar';
        titlebar.style.height = '40px';
        // Cor igual aos botões
        titlebar.style.background = '#23272b';
        titlebar.style.color = '#f0f0f0';
        titlebar.style.display = 'flex';
        titlebar.style.alignItems = 'center';
        titlebar.style.justifyContent = 'space-between';
        titlebar.style.padding = '0 12px';
        titlebar.style.fontWeight = 'normal';
        titlebar.style.fontSize = '1rem';
        titlebar.style.fontFamily = 'monospace';
        // Título editável
        const titleSpan = document.createElement('span');
        titleSpan.textContent = (title || 'nota_nota') + '.txt';
        titleSpan.style.cursor = 'pointer';
        titleSpan.title = 'Clique para editar o título';
        titleSpan.style.userSelect = 'none';
        titlebar.appendChild(titleSpan);
        // Editar título ao clicar
        titleSpan.addEventListener('click', () => {
            // Placeholder para o input
            // Cria input temporário
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 15;
            input.value = titleSpan.textContent.replace(/\.txt$/, '');
            input.placeholder = 'nova_nota';
            input.style.fontFamily = 'monospace';
            input.style.fontSize = '1rem';
            input.style.background = 'transparent';
            input.style.color = '#f0f0f0';
            input.style.border = 'none';
            input.style.borderRadius = '0';
            input.style.width = 'auto';
            input.style.margin = '0';
            input.style.padding = '0';
            input.style.outline = 'none';
            input.style.height = 'auto';
            input.style.boxSizing = 'border-box';
            titlebar.replaceChild(input, titleSpan);
            input.focus();
            input.select();
            // Impede movimentação enquanto edita
            let editingTitle = true;
            // Ao sair do input ou pressionar Enter, salva
            function saveTitle() {
                let val = input.value.trim().slice(0, 15) || 'nota_nota';
                titleSpan.textContent = val + '.txt';
                titlebar.replaceChild(titleSpan, input);
                editingTitle = false;
            }
            input.addEventListener('blur', saveTitle);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    saveTitle();
                }
            });
            // Bloqueia drag enquanto editando
            titlebar.addEventListener('mousedown', blockDrag, true);
            function blockDrag(e) {
                if (editingTitle) {
                    e.stopImmediatePropagation();
                }
            }
            // Remove bloqueio ao terminar edição
            input.addEventListener('blur', () => {
                editingTitle = false;
                titlebar.removeEventListener('mousedown', blockDrag, true);
            });
        });

        // Botão fechar
        const closeBtn = document.createElement('button');
        const closeImg = document.createElement('img');
        closeImg.src = 'assets/msos/CloseIcon.png';
        closeImg.alt = 'Fechar';
        closeImg.width = 15;
        closeImg.height = 15;
        closeImg.setAttribute('draggable', 'false');
        closeBtn.appendChild(closeImg);
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#f0f0f0';
        closeBtn.style.width = '24px';
        closeBtn.style.height = '24px';
        closeBtn.style.display = 'flex';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.justifyContent = 'center';
        closeBtn.style.padding = '0';
        closeBtn.style.margin = '0 2px 0 0';
        closeBtn.style.fontSize = '1.2rem';
        closeBtn.style.cursor = 'pointer';
        let closeTimeout = null;
        closeBtn.addEventListener('mousedown', () => {
            closeTimeout = setTimeout(() => {
                note.remove();
            }, 500);
        });
        closeBtn.addEventListener('mouseup', () => {
            if (closeTimeout) clearTimeout(closeTimeout);
        });
        closeBtn.addEventListener('mouseleave', () => {
            if (closeTimeout) clearTimeout(closeTimeout);
        });

        // Botão minimizar (sem funcionalidade)
        const minimizeBtn = document.createElement('button');
        const minimizeImg = document.createElement('img');
        minimizeImg.src = 'assets/msos/MinimizeIcon.png';
        minimizeImg.alt = 'Minimizar';
        minimizeImg.width = 15;
        minimizeImg.height = 15;
        minimizeImg.setAttribute('draggable', 'false');
        minimizeBtn.appendChild(minimizeImg);
        minimizeBtn.style.background = 'none';
        minimizeBtn.style.border = 'none';
        minimizeBtn.style.color = '#f0f0f0';
        minimizeBtn.style.width = '24px';
        minimizeBtn.style.height = '24px';
        minimizeBtn.style.display = 'flex';
        minimizeBtn.style.alignItems = 'center';
        minimizeBtn.style.justifyContent = 'center';
        minimizeBtn.style.padding = '0';
        minimizeBtn.style.margin = '0 2px 0 0';
        minimizeBtn.style.fontSize = '1.2rem';
        minimizeBtn.style.cursor = 'pointer';
        minimizeBtn.title = 'Minimizar';

        // SVGs para minimizar e maximizar
        const minimizeIconPath = 'assets/msos/MinimizeIcon.png';
        const maximizeIconPath = 'assets/msos/MaximizeIcon.png';

        // Funcionalidade de minimizar
        let minimized = false;
        let lastMaximizedHeight = null;
        minimizeBtn.addEventListener('click', () => {
            minimized = !minimized;
            if (minimized) {
                minimizeBtn.innerHTML = '';
                const maximizeImg = document.createElement('img');
                maximizeImg.src = maximizeIconPath;
                maximizeImg.alt = 'Maximizar';
                maximizeImg.width = 15;
                maximizeImg.height = 15;
                maximizeImg.setAttribute('draggable', 'false');
                minimizeBtn.appendChild(maximizeImg);
                fullscreenBtn.style.display = 'none';
                // Salva altura antes de minimizar
                lastMaximizedHeight = note.offsetHeight;
                textarea.style.display = 'none';
                if (typeof richText !== 'undefined') richText.style.display = 'none';
                note.style.height = titlebar.offsetHeight + 'px';
                // Desabilita resize ao minimizar
                resizeHandle.style.display = 'none';
                // Remove arredondamento dos cantos inferiores
                note.style.borderRadius = '10px 10px 0 0';
                // Se a base da nota estava encostando no limite inferior, mantém encostada
                const rect = note.getBoundingClientRect();
                const prevBase = rect.top + lastMaximizedHeight;
                const minimizedBase = rect.top + titlebar.offsetHeight;
                const pageBottom = window.innerHeight;
                if (Math.abs(prevBase - pageBottom) < 2) { // tolerância de 2px
                    // Move a nota para baixo para encostar a base minimizada
                    const delta = pageBottom - minimizedBase;
                    note.style.top = (rect.top + delta) + 'px';
                }
            } else {
                minimizeBtn.innerHTML = '';
                const minimizeImg2 = document.createElement('img');
                minimizeImg2.src = minimizeIconPath;
                minimizeImg2.alt = 'Minimizar';
                minimizeImg2.width = 15;
                minimizeImg2.height = 15;
                minimizeImg2.setAttribute('draggable', 'false');
                minimizeBtn.appendChild(minimizeImg2);
                fullscreenBtn.style.display = '';
                textarea.style.display = '';
                if (typeof richText !== 'undefined') richText.style.display = '';
                // Restaura altura anterior
                if (lastMaximizedHeight && lastMaximizedHeight > titlebar.offsetHeight) {
                    note.style.height = lastMaximizedHeight + 'px';
                } else {
                    note.style.height = '';
                }
                // Restaura altura mínima
                if (note.offsetHeight < minH) note.style.height = minH + 'px';
                resizeHandle.style.display = '';
                // Restaura arredondamento completo
                note.style.borderRadius = '10px';
                // Garante que a nota não fique para fora da tela ao maximizar
                const rect = note.getBoundingClientRect();
                const noteH = note.offsetHeight;
                let newTop = rect.top;
                const maxTop = window.innerHeight - noteH;
                if (newTop > maxTop) {
                    // Move a nota para cima se necessário
                    note.style.top = Math.max(0, maxTop) + 'px';
                }
            }
        });

        // Botão fullscreen (sem funcionalidade)
        const fullscreenBtn = document.createElement('button');
        const enterFullscreenImg = document.createElement('img');
        enterFullscreenImg.src = 'assets/msos/EnterFullscreenIcon.png';
        enterFullscreenImg.alt = 'Fullscreen';
        enterFullscreenImg.width = 15;
        enterFullscreenImg.height = 15;
        enterFullscreenImg.setAttribute('draggable', 'false');
        fullscreenBtn.appendChild(enterFullscreenImg);
        fullscreenBtn.style.background = 'none';
        fullscreenBtn.style.border = 'none';
        fullscreenBtn.style.color = '#f0f0f0';
        fullscreenBtn.style.width = '24px';
        fullscreenBtn.style.height = '24px';
        fullscreenBtn.style.display = 'flex';
        fullscreenBtn.style.alignItems = 'center';
        fullscreenBtn.style.justifyContent = 'center';
        fullscreenBtn.style.padding = '0';
        fullscreenBtn.style.margin = '0 2px 0 0';
        fullscreenBtn.style.fontSize = '1.2rem';
        fullscreenBtn.style.cursor = 'pointer';
        fullscreenBtn.title = 'Fullscreen';

        // Fullscreen logic
        let isFullscreen = false;
        let prevState = null;
        fullscreenBtn.addEventListener('click', () => {
            if (!isFullscreen) {
                prevState = {
                    left: note.style.left,
                    top: note.style.top,
                    width: note.style.width,
                    height: note.style.height,
                    zIndex: note.style.zIndex,
                    position: note.style.position,
                    borderRadius: note.style.borderRadius
                };
                note.style.position = 'fixed';
                note.style.left = '0';
                note.style.top = '0';
                note.style.width = '100vw';
                note.style.height = '100vh';
                note.style.zIndex = '9999';
                note.style.borderRadius = '0';
                fullscreenBtn.innerHTML = '';
                const exitFullscreenImg = document.createElement('img');
                exitFullscreenImg.src = 'assets/msos/ExitFullscreenIcon.png';
                exitFullscreenImg.alt = 'Sair do fullscreen';
                exitFullscreenImg.width = 15;
                exitFullscreenImg.height = 15;
                exitFullscreenImg.setAttribute('draggable', 'false');
                fullscreenBtn.appendChild(exitFullscreenImg);
                isFullscreen = true;
                titlebar.style.cursor = 'default';
                resizeHandle.style.display = 'none';
                minimizeBtn.style.display = 'none';
            } else {
                if (prevState) {
                    note.style.position = prevState.position;
                    note.style.left = prevState.left;
                    note.style.top = prevState.top;
                    note.style.width = prevState.width;
                    note.style.height = prevState.height;
                    note.style.zIndex = prevState.zIndex;
                    note.style.borderRadius = prevState.borderRadius;
                }
                fullscreenBtn.innerHTML = '';
                const enterFullscreenImg2 = document.createElement('img');
                enterFullscreenImg2.src = 'assets/msos/EnterFullscreenIcon.png';
                enterFullscreenImg2.alt = 'Fullscreen';
                enterFullscreenImg2.width = 15;
                enterFullscreenImg2.height = 15;
                enterFullscreenImg2.setAttribute('draggable', 'false');
                fullscreenBtn.appendChild(enterFullscreenImg2);
                isFullscreen = false;
                titlebar.style.cursor = 'move';
                resizeHandle.style.display = '';
                minimizeBtn.style.display = '';
            }
        });

        // Adiciona os botões na ordem: minimizar, fullscreen, fechar
        // Wrapper para alinhar os botões à direita
        const btnWrapper = document.createElement('div');
        btnWrapper.style.display = 'flex';
        btnWrapper.style.alignItems = 'center';
        btnWrapper.appendChild(minimizeBtn);
        btnWrapper.appendChild(fullscreenBtn);
        btnWrapper.appendChild(closeBtn);
        titlebar.appendChild(btnWrapper);
        // Drag functionality
        let isDragging = false;
        let offsetX = 0;
        let offsetY = 0;
        titlebar.style.cursor = 'move';
        titlebar.addEventListener('mousedown', (e) => {
            isDragging = true;
            // Sempre traz a nota para frente
            note.style.zIndex = String(getMaxZIndex() + 1);
            // Calcula o deslocamento do mouse em relação ao canto da nota
            const rect = note.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            // Evita seleção de texto
            document.body.style.userSelect = 'none';
        });
        // Função utilitária para pegar o maior z-index entre notas, atalhos e pastas
        function getMaxZIndex() {
            const elements = document.querySelectorAll('.modular-note, .modular-btn');
            let maxZ = 10;
            elements.forEach(el => {
                const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
                if (z > maxZ) maxZ = z;
            });
            return maxZ;
        }
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                // Calcula a nova posição
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;
                // Ajusta para o grid de 10px
                newLeft = Math.round(newLeft / 10) * 10;
                newTop = Math.round(newTop / 10) * 10;

                // Limites para não sair da tela
                const noteW = note.offsetWidth;
                const noteH = note.offsetHeight;
                const minLeft = 0;
                const minTop = 0;
                const maxLeft = window.innerWidth - noteW;
                const maxTop = window.innerHeight - noteH;
                newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
                newTop = Math.max(minTop, Math.min(newTop, maxTop));

                note.style.left = `${newLeft}px`;
                note.style.top = `${newTop}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
            }
        });
        // Textarea
        const textarea = document.createElement('textarea');
        textarea.className = 'modular-note-textarea';
        textarea.style.width = '100%';
        textarea.style.height = '100%';
        textarea.style.flex = '1 1 0';
        textarea.style.resize = 'none';
        textarea.style.border = 'none';
        // Área de texto mais clara
        textarea.style.background = '#353a40';
        // Área de texto rica (contenteditable)
        const richText = document.createElement('div');
        richText.className = 'modular-note-textarea';
        richText.contentEditable = 'true';
        richText.setAttribute('spellcheck', 'false');
        richText.style.width = '100%';
        richText.style.height = '100%';
        richText.style.flex = '1 1 0';
        richText.style.border = 'none';
        richText.style.background = '#353a40';
        richText.style.color = '#f0f0f0';
        richText.style.fontSize = '1rem';
        richText.style.fontFamily = 'monospace';
        richText.style.padding = '8px';
        richText.style.boxSizing = 'border-box';
        richText.style.outline = 'none';
        richText.style.overflowY = 'auto';
        richText.style.whiteSpace = 'pre-wrap';
        richText.style.wordBreak = 'break-word';
        // Permite colar texto puro (sem formatação externa)
        richText.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand('insertText', false, text);
        });
        if (content) {
            // Se vier HTML, insere como HTML, senão como texto
            if (/<[a-z][\s\S]*>/i.test(content)) {
                richText.innerHTML = content;
            } else {
                richText.innerText = content;
            }
        }

        // Toolbar de formatação
        let toolbar = null;
        import('./ModularToolbar.js').then(mod => {
            toolbar = new mod.default(note, richText);
            // Função para mostrar/ocultar toolbar
            function updateToolbarVisibility() {
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0 && sel.toString().length > 0 && richText.contains(sel.anchorNode)) {
                    toolbar.show();
                } else {
                    toolbar.hide();
                }
            }
            // Mostra/oculta ao selecionar texto
            richText.addEventListener('mouseup', updateToolbarVisibility);
            richText.addEventListener('keyup', updateToolbarVisibility);
            richText.addEventListener('blur', updateToolbarVisibility);
            document.addEventListener('selectionchange', updateToolbarVisibility);
            // Inicializa visibilidade
            updateToolbarVisibility();
        });

        // Exibe toolbar ao selecionar texto (mouse ou teclado)
        // Toolbar sempre visível para facilitar ajustes visuais temporariamente
        // Monta nota
        note.appendChild(titlebar);
        note.appendChild(richText);
        this.container.appendChild(note);
        this.notes.push(note);
        const resizeHandle = document.createElement('div');
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.right = '0';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.width = '18px';
        resizeHandle.style.height = '18px';
        resizeHandle.style.cursor = 'nwse-resize';
        resizeHandle.style.background = 'none';
        resizeHandle.style.zIndex = '40';
        resizeHandle.style.userSelect = 'none';
        resizeHandle.style.opacity = '0'; // handle invisível
        resizeHandle.innerHTML = '';
        note.appendChild(resizeHandle);

        let resizing = false;
        let startX, startY, startW, startH;
        const minW = 270;
        const minH = 190;
        resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            resizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startW = note.offsetWidth;
            startH = note.offsetHeight;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (resizing) {
                // Só aumenta de 10 em 10
                let rawW = startW + (e.clientX - startX);
                let rawH = startH + (e.clientY - startY);
                // Limite máximo para não sair da tela
                const rect = note.getBoundingClientRect();
                const left = rect.left;
                const top = rect.top;
                let maxW = window.innerWidth - left;
                let maxH = window.innerHeight - top;
                let newW = Math.max(minW, Math.min(Math.round(rawW / 10) * 10, maxW));
                let newH = Math.max(minH, Math.min(Math.round(rawH / 10) * 10, maxH));
                note.style.width = newW + 'px';
                note.style.height = newH + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            if (resizing) {
                resizing = false;
                document.body.style.userSelect = '';
            }
        });
        return note;
    }

    closeNotesArea() {
        if(this.notesArea) {
            this.notesArea.remove();
            this.notesArea = null;
        }
    }
}

export default ModularNotes;
