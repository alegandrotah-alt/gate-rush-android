// ---------- records ----------
function renderRecords(){
  const r=META.rec;
  $('recStats').innerHTML=`<div><b>${META.best}</b>best run (forts)</div><div><b>${r.bestLvl}</b>highest level</div><div><b>${fmt(r.bestHit)}</b>biggest single hit</div><div><b>${fmt(r.kills)}</b>enemies crushed</div><div><b>${r.runs}</b>runs played</div><div><b>${Object.keys(r.biomes).length}/6</b>planets seen</div>`;
  const box=$('achList');box.innerHTML='';
  renderGuideList();renderSecrets();
  {const box=$('mileList');if(box){box.innerHTML='';let done=0,all=0;
    for(const m of MILE){const lv=META.mile[m.id]||0,v=m.v(),max=lv>=m.t.length,next=m.t[Math.min(lv,m.t.length-1)],prev=lv?m.t[lv-1]:0,p=max?1:Math.max(0,Math.min(1,(v-prev)/(next-prev)));done+=lv;all+=m.t.length;
      const d=document.createElement('div');d.className='mile'+(max?' max':'');
      d.innerHTML=`<div class="mh"><b>${m.name}${lv?' '+MROMAN[lv-1]:''}</b><span class="pips">${m.t.map((_,i)=>`<i class="${i<lv?'on':''}"></i>`).join('')}</span></div><div class="mbar"><i style="width:${(p*100).toFixed(1)}%"></i></div><small>${max?`${fmt(v)} ${m.u} · maxed`:`${fmt(v)} / ${fmt(next)} ${m.u}`}</small><em>${max?'Complete':'+'+m.g[lv]+' gems'}</em>`;box.appendChild(d)}
    $('mileCount').textContent=`${done}/${all} levels`}
   const ac=$('achCount');if(ac)ac.textContent=`${ACH.filter(a=>META.ach[a.id]).length}/${ACH.length}`}
  for(const a of ACH){const d=document.createElement('div');d.className='ach'+(META.ach[a.id]?' got':'');d.innerHTML=`<b>${a.name}</b><small>${a.d}</small><em>${META.ach[a.id]?'Done':'+'+a.g+' gems'}</em>`;box.appendChild(d)}
}
