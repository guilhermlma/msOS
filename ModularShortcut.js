// ModularShortcut.js
// Cria um botão de atalho modular na posição 80,130 de 20x20 ao clicar no botão de atalho do menu

export default class ModularShortcut {
    constructor(containerSelector = '.container') {
        this.container = document.querySelector(containerSelector);
        this.createShortcutButton();
    }

    createShortcutButton() {
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let startLeft = 80;
        let startTop = 130;
        let isResizing = false;
        let resizeStartX = 0;
        let resizeStartY = 0;
        let startWidth = 40;
        let startHeight = 40;
        let pressTimer = null;
        let movedOrResized = false;
        const btn = document.createElement('button');
        btn.className = 'modular-btn';
        btn.style.position = 'absolute';
        btn.style.left = '80px';
        btn.style.top = '130px';
        btn.style.width = '40px';
        btn.style.height = '40px';
        btn.style.padding = '0';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'flex-start';
        btn.style.background = '#23272b';
        btn.title = 'Atalho';
        let link = null;
        let configured = false;
        let img = document.createElement('img');
        img.src = 'assets/msos/ImagePlaceholderIcon.png';
        img.alt = 'Imagem do Atalho';
        img.style.display = 'block';
        img.style.marginTop = 'calc((40px - 24px) / 2)';
        img.style.marginBottom = 'auto';
        img.style.marginLeft = 'auto';
        img.style.marginRight = 'auto';
        img.style.width = '24px';
        img.style.height = '24px';
        img.setAttribute('draggable', 'false');
        btn.appendChild(img);
        const moveGrab = document.createElement('div');
        moveGrab.style.position = 'absolute';
        moveGrab.style.left = '0';
        moveGrab.style.top = '0';
        moveGrab.style.width = '40px';
        moveGrab.style.height = '10px';
        moveGrab.style.zIndex = '2';
        moveGrab.style.background = 'transparent';
        moveGrab.style.cursor = 'default';
        btn.appendChild(moveGrab);
        // Função para mostrar aviso de sobreposição

        // Função para verificar sobreposição de atalhos configurados
        function checkShortcutOverlap() {
            const allBtns = Array.from(document.querySelectorAll('.modular-btn'));
            const posMap = {};
            allBtns.forEach(b => {
                if (b._shortcutConfigured) {
                    const left = b.style.left;
                    const top = b.style.top;
                    const pos = left + ',' + top;
                    if (!posMap[pos]) posMap[pos] = [];
                    posMap[pos].push(b);
                }
            });
            // Para cada posição com mais de um atalho, cria gaveta
            Object.entries(posMap).forEach(([pos, btns]) => {
                // Verifica se já existe gaveta na posição
                const [left, top] = pos.split(',');
                const existingDrawer = Array.from(document.querySelectorAll('.modular-drawer-btn')).find(d => d.style.left === left && d.style.top === top);
                if (btns.length > 1 && !existingDrawer) {
                    // Não cria gaveta se algum atalho está sendo arrastado
                    const dragging = btns.some(b => b.classList.contains('dragging-shortcut'));
                    if (isDragging || dragging) return;
                    // Guarda informações dos atalhos removidos
                    const shortcutsInfo = btns.map(b => {
                        let link = b.title;
                        let img = b.querySelector('img')?.src || '';
                        return { link, img };
                    });
                    btns.forEach(b => b.remove());
                    // Cria botão gaveta na mesma posição
                    const drawerBtn = document.createElement('button');
                    drawerBtn.className = 'modular-drawer-btn';
                    // Estilo igual ao atalho
                    drawerBtn.style.position = 'absolute';
                    drawerBtn.style.left = left;
                    drawerBtn.style.top = top;
                    drawerBtn.style.width = '40px';
                    drawerBtn.style.height = '40px';
                    drawerBtn.style.padding = '0';
                    drawerBtn.style.display = 'flex';
                    drawerBtn.style.flexDirection = 'column';
                    drawerBtn.style.alignItems = 'center';
                    drawerBtn.style.justifyContent = 'flex-start';
                    drawerBtn.style.background = '#23272b';
                    drawerBtn.style.borderRadius = '8px';
                    drawerBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
                    drawerBtn.style.outline = 'none';
                    drawerBtn.style.border = 'none';
                    drawerBtn.title = 'Gaveta de atalhos';
                    // Ícone da gaveta
                    const icon = document.createElement('img');
                    icon.src = 'assets/msos/DrawerIcon.png';
                    icon.alt = 'Gaveta de atalhos';
                    icon.style.display = 'block';
                    icon.style.marginTop = 'calc((40px - 24px) / 2)';
                    icon.style.marginBottom = 'auto';
                    icon.style.marginLeft = 'auto';
                    icon.style.marginRight = 'auto';
                    icon.style.width = '24px';
                    icon.style.height = '24px';
                    icon.style.userSelect = 'none';
                    icon.setAttribute('draggable', 'false');
                    drawerBtn.appendChild(icon);
                    drawerBtn.style.cursor = 'pointer';
                    drawerBtn.style.zIndex = '9';

                    // Dropdown dos atalhos
                    const dropdown = document.createElement('div');
                    dropdown.style.position = 'absolute';
                    dropdown.style.top = '50px'; // 40px gaveta + 10px gap
                    dropdown.style.left = '0';
                    dropdown.style.opacity = '0';
                    dropdown.style.transform = 'translateY(-10px)';
                    dropdown.style.transition = 'opacity 0.3s, transform 0.3s';
                    dropdown.style.display = 'flex';
                    dropdown.style.flexDirection = 'column';
                    dropdown.style.gap = '10px';
                    dropdown.style.zIndex = '9999';
                    dropdown.style.width = '40px';
                    drawerBtn.appendChild(dropdown);

                    // Salva shortcutsInfo na gaveta
                    drawerBtn._drawerShortcuts = shortcutsInfo;

                    shortcutsInfo.forEach((shortcut, idx) => {
                        const shortcutBtn = document.createElement('button');
                        shortcutBtn.className = 'modular-drawer-shortcut';
                        shortcutBtn.style.position = 'relative';
                        shortcutBtn.style.width = '40px';
                        shortcutBtn.style.height = '40px';
                        shortcutBtn.style.minWidth = '40px';
                        shortcutBtn.style.minHeight = '40px';
                        shortcutBtn.style.maxWidth = '40px';
                        shortcutBtn.style.maxHeight = '40px';
                        shortcutBtn.style.margin = '0';
                        shortcutBtn.style.padding = '0';
                        shortcutBtn.style.display = 'flex';
                        shortcutBtn.style.flexDirection = 'column';
                        shortcutBtn.style.alignItems = 'center';
                        shortcutBtn.style.justifyContent = 'flex-start';
                        shortcutBtn.style.background = '#23272b';
                        shortcutBtn.style.borderRadius = '10px';
                        shortcutBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
                        shortcutBtn.style.outline = 'none';
                        shortcutBtn.style.border = 'none';
                        shortcutBtn.style.color = '#f0f0f0';
                        shortcutBtn.style.fontSize = '1.2rem';
                        shortcutBtn.style.cursor = 'pointer';
                        shortcutBtn.title = shortcut.link;
                        // Imagem personalizada
                        const shortcutImg = document.createElement('img');
                        shortcutImg.src = shortcut.img;
                        shortcutImg.alt = 'Atalho';
                        shortcutImg.style.display = 'block';
                        shortcutImg.style.marginTop = 'calc((40px - 24px) / 2)';
                        shortcutImg.style.marginBottom = 'auto';
                        shortcutImg.style.marginLeft = 'auto';
                        shortcutImg.style.marginRight = 'auto';
                        shortcutImg.width = 24;
                        shortcutImg.height = 24;
                        shortcutImg.style.width = '24px';
                        shortcutImg.style.height = '24px';
                        shortcutImg.style.userSelect = 'none';
                        shortcutImg.setAttribute('draggable', 'false');
                        shortcutBtn.appendChild(shortcutImg);
                        // Clique redireciona
                        shortcutBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            let url = shortcut.link;
                            if (!/^https?:\/\//i.test(url)) {
                                url = 'https://' + url;
                            }
                            window.open(url, '_blank');
                        });
                        // Clique e segure para remover
                        let holdRemoveTimer = null;
                        shortcutBtn.addEventListener('mousedown', (e) => {
                            holdRemoveTimer = setTimeout(() => {
                                // Remove da lista da gaveta
                                const idxInList = drawerBtn._drawerShortcuts.findIndex(s => s.link === shortcut.link && s.img === shortcut.img);
                                if (idxInList !== -1) {
                                    drawerBtn._drawerShortcuts.splice(idxInList, 1);
                                }
                                // Remove do dropdown
                                shortcutBtn.remove();
                                // Se não há mais atalhos, remove gaveta
                                if (drawerBtn._drawerShortcuts.length === 0) {
                                    drawerBtn.remove();
                                }
                            }, 1200); // 1.2s para segurar
                        });
                        shortcutBtn.addEventListener('mouseup', (e) => {
                            if (holdRemoveTimer) {
                                clearTimeout(holdRemoveTimer);
                                holdRemoveTimer = null;
                            }
                        });
                        shortcutBtn.addEventListener('mouseleave', (e) => {
                            if (holdRemoveTimer) {
                                clearTimeout(holdRemoveTimer);
                                holdRemoveTimer = null;
                            }
                        });
                        dropdown.appendChild(shortcutBtn);
                    });

                    // Exibe/oculta dropdown ao clicar na gaveta
                    let dropdownVisible = false;
                    let holdTimerDrawer = null;
                    drawerBtn.addEventListener('mousedown', (e) => {
                        // Não abre/fecha dropdown se clicar no moveGrab
                        if (e.target === moveGrab) return;
                        // Só permite editar tooltip se dropdown estiver fechado
                        if (dropdownVisible) return;
                        // Clique e segure para editar tooltip
                        holdTimerDrawer = setTimeout(() => {
                            drawerBtn._drawerHoldActive = true;
                            const newTooltip = prompt('Digite o texto da tooltip da gaveta:', drawerBtn.title);
                            if (newTooltip !== null && newTooltip.trim() !== '') {
                                drawerBtn.title = newTooltip.trim();
                            }
                        }, 1200); // 1.2s para segurar
                    });
                    drawerBtn.addEventListener('mouseup', (e) => {
                        if (holdTimerDrawer) {
                            clearTimeout(holdTimerDrawer);
                            holdTimerDrawer = null;
                        }
                        // Libera flag de hold
                        setTimeout(() => { drawerBtn._drawerHoldActive = false; }, 50);
                    });
                    drawerBtn.addEventListener('mouseleave', (e) => {
                        if (holdTimerDrawer) {
                            clearTimeout(holdTimerDrawer);
                            holdTimerDrawer = null;
                        }
                        drawerBtn._drawerHoldActive = false;
                    });
                    drawerBtn.addEventListener('click', (e) => {
                        // Não abre/fecha dropdown se clicar no moveGrab
                        if (e.target === moveGrab) return;
                        // Não abre dropdown se o hold foi ativado
                        if (drawerBtn._drawerHoldActive) return;
                        e.stopPropagation();
                        dropdownVisible = !dropdownVisible;
                        if (dropdownVisible) {
                            dropdown.style.opacity = '1';
                            dropdown.style.transform = 'translateY(0)';
                        } else {
                            dropdown.style.opacity = '0';
                            dropdown.style.transform = 'translateY(-10px)';
                        }
                    });
                    // Fecha dropdown ao clicar fora
                    document.addEventListener('mousedown', (e) => {
                        if (dropdownVisible && !drawerBtn.contains(e.target)) {
                            dropdown.style.opacity = '0';
                            dropdown.style.transform = 'translateY(-10px)';
                            dropdownVisible = false;
                        }
                    });
                    // Adiciona área de arrasto igual ao atalho
                    const moveGrab = document.createElement('div');
                    moveGrab.style.position = 'absolute';
                    moveGrab.style.left = '0';
                    moveGrab.style.top = '0';
                    moveGrab.style.width = '40px';
                    moveGrab.style.height = '10px';
                    moveGrab.style.zIndex = '2';
                    moveGrab.style.background = 'transparent';
                    moveGrab.style.cursor = 'move';
                    drawerBtn.appendChild(moveGrab);
                    // Ambiente preparado para configuração futura
                    drawerBtn._drawerPrepared = true;
                    // Adiciona na mesma área do btn original
                    if (btns[0].parentNode) {
                        btns[0].parentNode.insertBefore(drawerBtn, btns[0].parentNode.firstChild);
                    } else if (typeof this !== 'undefined' && this.container) {
                        this.container.insertBefore(drawerBtn, this.container.firstChild);
                    } else {
                        document.body.insertBefore(drawerBtn, document.body.firstChild);
                    }
                    // Arrastabilidade igual ao atalho
                    let isDraggingDrawer = false;
                    let dragOffsetXDrawer = 0;
                    let dragOffsetYDrawer = 0;
                    moveGrab.addEventListener('mousedown', (e) => {
                        isDraggingDrawer = true;
                        drawerBtn.style.zIndex = String(1000);
                        dragOffsetXDrawer = e.clientX - drawerBtn.offsetLeft;
                        dragOffsetYDrawer = e.clientY - drawerBtn.offsetTop;
                        document.body.style.userSelect = 'none';
                    });
                    document.addEventListener('mousemove', (e) => {
                        if (isDraggingDrawer) {
                            let newLeft = e.clientX - dragOffsetXDrawer;
                            let newTop = e.clientY - dragOffsetYDrawer;
                            newLeft = Math.round(newLeft / 10) * 10;
                            newTop = Math.round(newTop / 10) * 10;
                            drawerBtn.style.left = newLeft + 'px';
                            drawerBtn.style.top = newTop + 'px';
                        }
                    });
                    document.addEventListener('mouseup', (e) => {
                        if (isDraggingDrawer) {
                            isDraggingDrawer = false;
                            document.body.style.userSelect = '';
                        }
                    });
                    // ...label removida...
                }
                // Se já existe gaveta e há atalhos configurados na mesma posição, adiciona à gaveta
                if (existingDrawer && btns.length > 0) {
                    // Só adiciona se nenhum atalho está sendo movido
                    const dragging = btns.some(b => b.classList.contains('dragging-shortcut'));
                    if (isDragging || dragging) return;
                    // Remove atalhos configurados e adiciona à lista da gaveta
                    btns.forEach(b => {
                        let link = b.title;
                        let img = b.querySelector('img')?.src || '';
                        b.remove();
                        // Adiciona à lista da gaveta
                        if (!existingDrawer._drawerShortcuts) existingDrawer._drawerShortcuts = [];
                        existingDrawer._drawerShortcuts.push({ link, img });
                        // Adiciona botão ao dropdown
                        const dropdown = existingDrawer.querySelector('div');
                        const shortcutBtn = document.createElement('button');
                        shortcutBtn.className = 'modular-drawer-shortcut';
                        shortcutBtn.style.position = 'relative';
                        shortcutBtn.style.width = '40px';
                        shortcutBtn.style.height = '40px';
                        shortcutBtn.style.minWidth = '40px';
                        shortcutBtn.style.minHeight = '40px';
                        shortcutBtn.style.maxWidth = '40px';
                        shortcutBtn.style.maxHeight = '40px';
                        shortcutBtn.style.margin = '0';
                        shortcutBtn.style.padding = '0';
                        shortcutBtn.style.display = 'flex';
                        shortcutBtn.style.flexDirection = 'column';
                        shortcutBtn.style.alignItems = 'center';
                        shortcutBtn.style.justifyContent = 'flex-start';
                        shortcutBtn.style.background = '#23272b';
                        shortcutBtn.style.borderRadius = '10px';
                        shortcutBtn.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4)';
                        shortcutBtn.style.outline = 'none';
                        shortcutBtn.style.border = 'none';
                        shortcutBtn.style.color = '#f0f0f0';
                        shortcutBtn.style.fontSize = '1.2rem';
                        shortcutBtn.style.cursor = 'pointer';
                        shortcutBtn.title = link;
                        // Imagem personalizada
                        const shortcutImg = document.createElement('img');
                        shortcutImg.src = img;
                        shortcutImg.alt = 'Atalho';
                        shortcutImg.style.display = 'block';
                        shortcutImg.style.marginTop = 'calc((40px - 24px) / 2)';
                        shortcutImg.style.marginBottom = 'auto';
                        shortcutImg.style.marginLeft = 'auto';
                        shortcutImg.style.marginRight = 'auto';
                        shortcutImg.width = 24;
                        shortcutImg.height = 24;
                        shortcutImg.style.width = '24px';
                        shortcutImg.style.height = '24px';
                        shortcutImg.style.userSelect = 'none';
                        shortcutImg.setAttribute('draggable', 'false');
                        shortcutBtn.appendChild(shortcutImg);
                        shortcutBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            let url = link;
                            if (!/^https?:\/\//i.test(url)) {
                                url = 'https://' + url;
                            }
                            window.open(url, '_blank');
                        });
                        // Clique e segure para remover
                        let holdRemoveTimer = null;
                        shortcutBtn.addEventListener('mousedown', (e) => {
                            holdRemoveTimer = setTimeout(() => {
                                // Remove da lista da gaveta
                                const idxInList = existingDrawer._drawerShortcuts.findIndex(s => s.link === link && s.img === img);
                                if (idxInList !== -1) {
                                    existingDrawer._drawerShortcuts.splice(idxInList, 1);
                                }
                                // Remove do dropdown
                                shortcutBtn.remove();
                                // Se não há mais atalhos, remove gaveta
                                if (existingDrawer._drawerShortcuts.length === 0) {
                                    existingDrawer.remove();
                                }
                            }, 1200); // 1.2s para segurar
                        });
                        shortcutBtn.addEventListener('mouseup', (e) => {
                            if (holdRemoveTimer) {
                                clearTimeout(holdRemoveTimer);
                                holdRemoveTimer = null;
                            }
                        });
                        shortcutBtn.addEventListener('mouseleave', (e) => {
                            if (holdRemoveTimer) {
                                clearTimeout(holdRemoveTimer);
                                holdRemoveTimer = null;
                            }
                        });
                        dropdown.appendChild(shortcutBtn);
                    });
                }
            });
        }
        function handleShortcutClick(e) {
            const rect = btn.getBoundingClientRect();
            const y = e.clientY - rect.top;
            if (y < 10) return;
            if (isDragging || btn._justDragged) {
                btn._justDragged = false;
                return;
            }
            if (!link) {
                const userLink = prompt('Insira o link do atalho:');
                if (userLink && userLink.trim()) {
                    link = userLink.trim();
                    btn.title = 'Clique para escolher uma imagem para o atalho';
                    handleImagePrompt(e);
                }
                return;
            }
            if (!configured) {
                handleImagePrompt(e);
                return;
            }
            let url = link;
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            window.open(url, '_blank');
        }
        btn.addEventListener('click', handleShortcutClick);
        function handleImagePrompt(e) {
            if (isDragging || btn._justDragged) {
                btn._justDragged = false;
                return;
            }
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.style.display = 'none';
            document.body.appendChild(input);
            input.click();
            input.onchange = function(ev) {
                const file = input.files[0];
                if (!file) {
                    document.body.removeChild(input);
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(evt) {
                    const tempImg = new window.Image();
                    tempImg.onload = function() {
                        if (tempImg.width !== tempImg.height) {
                            alert('A imagem deve ser quadrada (proporção 1:1).');
                        } else {
                            let newImg = document.createElement('img');
                            newImg.src = evt.target.result;
                            newImg.alt = 'Atalho';
                            newImg.width = 24;
                            newImg.height = 24;
                            newImg.style.display = 'block';
                            newImg.style.marginTop = 'calc((40px - 24px) / 2)';
                            newImg.style.marginBottom = 'auto';
                            newImg.style.marginLeft = 'auto';
                            newImg.style.marginRight = 'auto';
                            newImg.style.userSelect = 'none';
                            newImg.setAttribute('draggable', 'false');
                            newImg.onmousedown = e => e.preventDefault();
                            btn.replaceChild(newImg, img);
                            img = newImg;
                            configured = true;
                            btn.title = link;
                            btn._shortcutConfigured = true;
                            enableMoveCursor();
                        }
                        document.body.removeChild(input);
                    };
                    tempImg.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            };
        }
        this.container.appendChild(btn);
        moveGrab.addEventListener('mousedown', (e) => {
            if (!configured) return;
            isDragging = true;
            btn.style.zIndex = String(getMaxZIndex() + 1);
            movedOrResized = false;
            dragOffsetX = e.clientX - btn.offsetLeft;
            dragOffsetY = e.clientY - btn.offsetTop;
            startLeft = btn.offsetLeft;
            startTop = btn.offsetTop;
            document.body.style.userSelect = 'none';
            function getMaxZIndex() {
                const elements = document.querySelectorAll('.modular-note, .modular-btn');
                let maxZ = 10;
                elements.forEach(el => {
                    const z = parseInt(window.getComputedStyle(el).zIndex) || 0;
                    if (z > maxZ) maxZ = z;
                });
                return maxZ;
            }
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newLeft = e.clientX - dragOffsetX;
                let newTop = e.clientY - dragOffsetY;
                newLeft = Math.round(newLeft / 10) * 10;
                newTop = Math.round(newTop / 10) * 10;
                btn.style.left = newLeft + 'px';
                btn.style.top = newTop + 'px';
                movedOrResized = true;
                // Verifica sobreposição durante o arrasto
                if (configured) checkShortcutOverlap();
            }
        });
        document.addEventListener('mouseup', (e) => {
            if (isDragging) {
                isDragging = false;
                document.body.style.userSelect = '';
                btn._justDragged = true;
                setTimeout(() => { btn._justDragged = false; }, 10);
                // Verifica sobreposição ao soltar
                if (configured) checkShortcutOverlap();
            }
        });
        let holdTimer = null;
        btn.addEventListener('mousedown', (e) => {
            if (!configured || isDragging) return;
            const rect = btn.getBoundingClientRect();
            const y = e.clientY - rect.top;
            if (y < 10) return;
            holdTimer = setTimeout(() => {
                btn.remove();
            }, 2000);
        });
        btn.addEventListener('mouseup', (e) => {
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }
        });
        btn.addEventListener('mouseleave', (e) => {
            if (holdTimer) {
                clearTimeout(holdTimer);
                holdTimer = null;
            }
        });
        function enableMoveCursor() {
            moveGrab.style.cursor = 'move';
        }
    }
}
