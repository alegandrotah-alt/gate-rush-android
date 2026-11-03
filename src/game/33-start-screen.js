// ---------- start screen ----------
function renderShop(){
  mileCheck();sovereignCheck();
  $('bank').textContent=META.gems+' gems';
  const box=$('shop');box.innerHTML='';
  for(const br of ['Offense','Defense','Economy','Arsenal']){
    const col=document.createElement('div');col.className='branch';col.innerHTML=`<h4>${br}</h4>`;
    for(const it of RES.filter(r=>r.b===br)){
      const r=rank(it.id),maxed=r>=it.max,cost=shopCost(it.id),open=resOpen(it);
      const b=document.createElement('button');b.type='button';b.disabled=maxed||!open||META.gems<cost;b.className='node'+(it.req?' sub':'')+(maxed?' max':'');
      b.innerHTML=`<b>${it.name}</b><small>${it.desc}</small><span class="pips">${Array.from({length:it.max},(_,i)=>`<i class="${i<r?'on':''}"></i>`).join('')}</span><small>${maxed?'Maxed':!open?`Needs ${RESN[it.req[0]].name} ${it.req[1]}`:cost+' gems'}</small>`;
      b.addEventListener('click',()=>{if(b.disabled)return;META.gems-=cost;META.shop[it.id]=r+1;saveMeta();achMeta();blip(700,.08,'triangle',.05);renderShop()});
      col.appendChild(b);
    }
    box.appendChild(col);
  }
  $('best').textContent=META.best?`Best run: ${META.best} fort${META.best>1?'s':''} destroyed`:'';
  const vb=$('vehicles');vb.innerHTML='';
  for(const [id,v] of Object.entries(VEH)){
    const b=document.createElement('button');b.type='button';b.className='veh'+(META.veh===id?' on':'');b.setAttribute('aria-pressed',META.veh===id);
    const sw=UPNAME[v.start];
    b.innerHTML=`<canvas width="144" height="112" data-v="${id}"></canvas><b>${v.name}</b><small>${sw.name}</small>`;
    b.addEventListener('click',()=>{META.veh=id;saveMeta();renderShop();if(S&&!S.running){newRun()}});
    vb.appendChild(b);
  }
  vb.querySelectorAll('canvas').forEach(cn=>{const g=cn.getContext('2d');if(!g)return;g.setTransform(2,0,0,2,0,0);drawVehIcon(g,cn.dataset.v,36,36,1.25)});
  const v=VEH[META.veh];$('vehDesc').textContent=`${v.name}: ${v.desc} ${v.hp} HP, ${v.speed>250?'fast':v.speed<200?'slow':'medium'} speed.`;
}

