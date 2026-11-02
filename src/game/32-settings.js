// ---------- settings ----------
function renderSettings(box){
  box.innerHTML='';
  const row=(label,ctl)=>{const d=document.createElement('div');d.className='set';d.innerHTML=`<b>${label}</b>`;d.appendChild(ctl);box.appendChild(d)};
  const slider=(key,id)=>{const i=document.createElement('input');i.type='range';i.min=0;i.max=1;i.step=.05;i.value=SET[key];i.id=id+box.id;i.setAttribute('aria-label',key);i.addEventListener('input',()=>{SET[key]=+i.value;saveSet();if(key==='sfx')blip(660,.06,'triangle',.05)});return i};
  const seg=(key,opts)=>{const d=document.createElement('div');d.className='seg';for(const [v,l] of opts){const b=document.createElement('button');b.type='button';b.textContent=l;b.className=SET[key]===v?'on':'';b.addEventListener('click',()=>{SET[key]=v;saveSet();renderSettings(box);if(key==='quality'){AUTOLOW=false;resize()}});d.appendChild(b)}return d};
  row('Music',slider('music','m'));row('Sound effects',slider('sfx','s'));
  row('Screen shake',seg('shake',[[1,'On'],[.4,'Low'],[0,'Off']]));
  row('Damage numbers',seg('nums',[[1,'On'],[0,'Off']]));
  row('Hitbox ring',seg('hitbox',[[1,'Show'],[0,'Hide']]));
  row('Graphics',seg('quality',[['auto','Auto'],['high','High'],['low','Low']]));
  row('Level-ups',seg('autolvl',[[0,'When I choose'],[1,'Auto-pick']]));
  row('Vibration',seg('vib',[[1,'On'],[0,'Off']]));
  row('Comic text',seg('fxtext',[[1,'On'],[0,'Off']]));
  row('Pop-up banners',seg('banners',[[1,'On'],[0,'Off']]));
  row('Bullet colors',seg('contrast',[[0,'Standard'],[1,'High contrast']]));
  row('Flashes',seg('flash',[[1,'Normal'],[0,'Reduced']]));
  row('Show FPS',seg('fps',[[0,'Off'],[1,'On']]));
}
function cosPreview(cn,kind,item){const g=cn.getContext('2d');if(!g||!g.clearRect)return;g.setTransform(2,0,0,2,0,0);g.clearRect(0,0,cn.width,cn.height);
  if(kind==='paint')drawVehIcon(g,META.veh,32,30,.95,item);
  else if(kind==='blob'){const p3=proj3D(META.veh,item.c,80);if(p3){g.drawImage(p3,4,2,32,32);g.drawImage(p3,32,10,24,24)}else{if(!G3D.st['q_'+META.veh])setTimeout(()=>{try{renderGarage()}catch(e){}},700);g.drawImage(projSprite(META.veh,item.c),10,6,22,25);g.drawImage(projSprite(META.veh,item.c),34,13,16,18)}}
  else{for(let i=0;i<14;i++){g.fillStyle=item.c[i%item.c.length];g.globalAlpha=1-i/14;g.beginPath();g.arc(32+Math.sin(i*.7)*6,6+i*2.6,3.5-i*.18,0,6.283);g.fill()}g.globalAlpha=1}}
function renderGarage(){
  $('bankG').textContent=META.gems+' gems';
  const box=$('garage');box.innerHTML='';
  for(const [kind,label] of [['paint','Vehicle paint'],['blob','Shot colour'],['trail','Thruster trail']]){
    const sec=document.createElement('div');sec.className='cos';sec.innerHTML=`<h4>${label.toUpperCase()}</h4>`;const grid=document.createElement('div');grid.className='swatches';
    for(const it of COS[kind]){const own=META.cos[kind].includes(it.id),on=META.sel[kind]===it.id;
      const b=document.createElement('button');b.type='button';b.className='sw'+(on?' on':'')+(own?'':' locked');b.disabled=!own&&META.gems<it.cost;
      b.innerHTML=`<canvas width="128" height="88"></canvas><b>${it.name}</b><small>${on?'Equipped':own?'Owned':it.cost+' gems'}</small>`;
      b.addEventListener('click',()=>{if(!own){if(META.gems<it.cost)return;META.gems-=it.cost;META.cos[kind].push(it.id);blip(700,.08,'triangle',.05)}META.sel[kind]=it.id;saveMeta();renderGarage();renderShop()});
      grid.appendChild(b);cosPreview(b.querySelector('canvas'),kind,it)}
    sec.appendChild(grid);box.appendChild(sec)}
}

