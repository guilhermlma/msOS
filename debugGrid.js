// debugGrid.js - Funções de debug de grid modular
(function(){
    // Adiciona elementos do debug ao DOM se não existirem
    if(!document.getElementById('coord-indicator')){
        const indicator = document.createElement('div');
        indicator.id = 'coord-indicator';
        indicator.style.position = 'fixed';
        indicator.style.top = '10px';
        indicator.style.right = '10px';
        indicator.style.background = '#222a';
        indicator.style.color = '#fff';
        indicator.style.padding = '4px 8px';
        indicator.style.borderRadius = '4px';
        indicator.style.font = '14px monospace';
        indicator.style.zIndex = '1000';
        indicator.style.pointerEvents = 'none';
        indicator.textContent = 'x:0,y:0';
        document.body.appendChild(indicator);
    }
    if(!document.getElementById('selection-rect')){
        const rect = document.createElement('div');
        rect.id = 'selection-rect';
        rect.style.display = 'none';
        rect.style.position = 'fixed';
        rect.style.border = '1px dashed #0ff';
        rect.style.background = 'rgba(0,255,255,0.07)';
        rect.style.zIndex = '999';
        document.body.appendChild(rect);
    }
    const indicator = document.getElementById('coord-indicator');
    const rect = document.getElementById('selection-rect');
    let sel = false, sx = 0, sy = 0, ex = 0, ey = 0;
    document.addEventListener('mousemove', e => {
        let x = Math.floor(e.clientX/10), y = Math.floor(e.clientY/10);
        if(sel){
            ex=x; ey=y;
            let l=Math.min(sx,ex)*10, t=Math.min(sy,ey)*10, w=(Math.abs(ex-sx)+1)*10, h=(Math.abs(ey-sy)+1)*10;
            rect.style.display='block';rect.style.left=l+'px';rect.style.top=t+'px';rect.style.width=w+'px';rect.style.height=h+'px';
            indicator.textContent = `(${sx},${sy})→(${ex},${ey}) | ${w}px × ${h}px`;
        }else if(rect.style.display !== 'block'){
            indicator.textContent = `x:${x},y:${y}`;
        }
    });
    document.addEventListener('mousedown',e=>{
        const isBtn = e.target.closest('.modular-btn') || e.target.closest('#dropdown');
        if(isBtn) return;
        if(e.button!==0)return;
        sel=true;sx=Math.floor(e.clientX/10);sy=Math.floor(e.clientY/10);ex=sx;ey=sy;
        rect.style.display='block';rect.style.left=(sx*10)+'px';rect.style.top=(sy*10)+'px';rect.style.width='10px';rect.style.height='10px';
        indicator.textContent=`(${sx},${sy})→(${ex},${ey}) | 10px × 10px`;
    });
    document.addEventListener('mouseup',e=>{
        if(!sel)return;
        sel=false;
        // Keep selection rectangle visible after mouseup
        let l=Math.min(sx,ex)*10, t=Math.min(sy,ey)*10, w=(Math.abs(ex-sx)+1)*10, h=(Math.abs(ey-sy)+1)*10;
        rect.style.display='block';
        rect.style.left=l+'px';
        rect.style.top=t+'px';
        rect.style.width=w+'px';
        rect.style.height=h+'px';
        indicator.textContent=`(${sx},${sy})→(${ex},${ey}) | ${w}px × ${h}px`;
    });
    // Linhas guia importantes
    const gridWidth = 1280, gridHeight = 720;
    const cellSize = 10;
    const xMax = 127, yMax = 71;
    const guideX = [64, 32, 96, 42, 85]; // meio, quartos, terços
    const guideY = [35, 17, 53, 23, 47];
    function addGuideLine(x, y, vertical=true) {
        const line = document.createElement('div');
        line.style.position = 'fixed';
        line.style.zIndex = '998';
        line.style.pointerEvents = 'none';
        if(vertical){
            line.style.left = (x*cellSize)+ 'px';
            line.style.top = '0';
            line.style.width = '2px';
            line.style.height = gridHeight + 'px';
            line.style.background = 'rgba(255,255,255,0.25)';
        }else{
            line.style.left = '0';
            line.style.top = (y*cellSize)+ 'px';
            line.style.width = gridWidth + 'px';
            line.style.height = '2px';
            line.style.background = 'rgba(255,255,255,0.25)';
        }
        document.body.appendChild(line);
    }
    guideX.forEach(x => addGuideLine(x, 0, true));
    guideY.forEach(y => addGuideLine(0, y, false));
})();
