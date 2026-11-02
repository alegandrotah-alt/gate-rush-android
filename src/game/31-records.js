// ---------- records ----------
function renderRecords(){
  const r=META.rec;
  $('recStats').innerHTML=`<div><b>${META.best}</b>best run (forts)</div><div><b>${r.bestLvl}</b>highest level</div><div><b>${fmt(r.bestHit)}</b>biggest single hit</div><div><b>${fmt(r.kills)}</b>enemies crushed</div><div><b>${r.runs}</b>runs played</div><div><b>${Object.keys(r.biomes).length}/6</b>planets seen</div>`;
  const box=$('achList');box.innerHTML='';
  renderGuideList();
  for(const a of ACH){const d=document.createElement('div');d.className='ach'+(META.ach[a.id]?' got':'');d.innerHTML=`<b>${a.name}</b><small>${a.d}</small><em>${META.ach[a.id]?'Done':'+'+a.g+' gems'}</em>`;box.appendChild(d)}
}
