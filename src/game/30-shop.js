// ---------- fort clear → shop ----------
function fortDown(){
  msgFlushBattle();
  S.shake=14;for(let i=0;i<40;i++)S.sparks.push({x:40+Math.random()*320,y:S.fy-Math.random()*30,vx:(Math.random()-.5)*240,vy:-Math.random()*200,life:.7,c:Math.random()<.5?'#ffb02e':'#8e2236'});
  S.over=true;S.running=false;R.forts++;S.breachT=0;S.cannon.inv=99;vfx({k:'circle_02',x:200,y:S.fy+12,s0:40,s1:460,dur:.7,col:'#ffcf2e',add:1});vfx({k:'circle_02',x:200,y:S.fy+12,s0:20,s1:260,dur:.45,col:'#ffffff',add:1});buzz([60,40,140]);shout('BREACHED!','#ffcf2e',1.6,{sub:`GATEKEEP ${S.L} FELL IN ${Math.ceil(S.t)}S`});
  for(const e of S.enemies){spark(e.x,e.y,e.brute?'#ffcf2e':'#ff7a7a',2);e.w=0}
  S.enemies=[];S.bul=[];S.lasers=[];S.emit=[];S.arts=[];
  const left=Math.max(0,S.lv.T-S.t);
  const base=3+Math.floor(S.L/4),speed=Math.floor(left/8),interest=Math.min(5+2*rank('interestcap'),Math.floor(R.coins/5)),greed=rank('greed');
  R.coins+=base+speed+interest+greed;
  R.lastPay={base,speed,interest,greed,time:S.t};
  if(has('interest')){const n=Math.min(5,Math.floor(R.coins/5));if(has('interest')===3)R.interestMult*=1+.05*n;else R.interestMult+=val('interest')*n}
  cue('fort');checkAch('fort');
  setTimeout(()=>{R.pendingPicks++;S.afterPick=()=>openShop(true);openPick('Keep reward')},1900);
}
let SH=null;
function rollRelics(){
  const out=[];
  for(let i=0;i<3;i++){
    const roll=Math.random()*(1-.1*rank('rarity'));
    let want=S.L>=(rank('lens')?2:4)&&roll<(rank('lens')?.09:.05)?4:roll<.17?3:roll<.5?2:1;
    let cand=RELICS.filter(r=>want===4?r.x&&!has(r.id):!r.x&&has(r.id)<want);
    cand=cand.filter(r=>!out.some(o=>o.id===r.id));
    if(!cand.length){want=1;cand=RELICS.filter(r=>!r.x&&!has(r.id)&&!out.some(o=>o.id===r.id))}
    if(!cand.length)break;
    const r=rnd(cand);out.push({id:r.id,t:r.x?1:want});
  }
  return out;
}
const TPRICE=[0,4,7,11,18];
function relicPrice(c){return TPRICE[relicTierOf(c.id,c.t)]+Math.floor(S.L/4)}
function sellPrice(id){return Math.floor(TPRICE[relicTierOf(id,has(id))]/2)}
function buyRelic(c){
  const own=has(c.id);
  if(!own)R.relics.push(c.id);
  R.rt[c.id]=c.t;restat();
}
function openShop(fresh){
  if(fresh)SH={cards:rollRelics(),sold:[],reroll:2,pack:5};
  $('ovShop').hidden=false;drawShop();
}
function drawShop(){
  const p=R.lastPay;
  $('shopTitle').textContent=`Gatekeep ${S.L} breached`;
  $('shopPay').textContent=`Paid ${p.base} + ${p.speed} speed bonus + ${p.interest} interest${p.greed?' + '+p.greed+' greed':''}. Interest: 1 per 5 coins held, max 5.`;
  $('shopCoins').textContent=R.coins+' coins';
  const box=$('relicCards');box.innerHTML='';if(!SH.drawn&&box.classList){SH.drawn=1;box.classList.add('enter');setTimeout(()=>box.classList.remove('enter'),900)}
  SH.cards.forEach((c,i)=>{
    const b=document.createElement('button');b.type='button';b.className='relic';
    const own=has(c.id),up=own>0,sold=SH.sold.includes(i),price=up?Math.max(1,relicPrice(c)-sellPrice(c.id)):relicPrice(c),full=!up&&R.relics.length>=R.slots,tt=relicTierOf(c.id,c.t);
    b.disabled=sold||R.coins<price||full||(up&&own>=c.t);
    b.style.setProperty('--rc',TIERC[tt]);
    b.innerHTML=`<img class="ric" src="${iconFor(c.id,'relic',c.t)}" alt=""><span class="rar">${TIERN[tt]}${up?` · upgrade from ${ROMAN[own]}, pay the difference`:''}</span><b>${relicName(c.id,c.t)}</b><span>${relicDesc(c.id,c.t)}</span><em>${sold?'Bought':full?'Slots full':price+' coins'}</em>`;
    b.addEventListener('click',()=>{if(b.disabled)return;R.coins-=price;buyRelic(c);R.relicsBought=(R.relicsBought||0)+1;checkAch('buy');SH.sold.push(i);(playS('shop',.55)||blip(700,.08,'triangle',.05));renderOwned();drawShop()});
    box.appendChild(b);
  });
  const pk=$('packBtn');pk.textContent=`Upgrade pack: pick 1 of 3 (${SH.pack} coins)`;pk.disabled=R.coins<SH.pack;
  const rr=$('shopReroll');rr.textContent=`Reroll relics (${SH.reroll} coins)`;rr.disabled=R.coins<SH.reroll;
  const own=$('ownRelics');own.innerHTML='';
  $('slotTxt').textContent=`Your relics ${R.relics.length}/${R.slots}`;
  R.relics.forEach(id=>{const t=has(id),tt=relicTierOf(id,t);const row=document.createElement('div');row.className='ownrow';
    const sell=sellPrice(id);
    row.innerHTML=`<img src="${iconFor(id,'relic',t)}" alt=""><span><b>${relicName(id,t)}</b><small>${relicDesc(id,t)}</small></span>`;
    const sb=document.createElement('button');sb.type='button';sb.textContent=`Sell ${sell}`;sb.addEventListener('click',()=>{R.relics=R.relics.filter(x=>x!==id);delete R.rt[id];R.coins+=sell;restat();renderOwned();drawShop()});
    row.appendChild(sb);own.appendChild(row)});
  if(!R.relics.length)own.innerHTML='<p class="small">No relics yet. Buy a higher tier of one you own to upgrade it in place.</p>';
  const nk=fortKind(S.L+1);
  $('nextFort').textContent=`Rush ${nk==='stairs'?'the Grand Gatekeep':'Gatekeep'} ${S.L+1} · ${LAYN[nk]} →`;
  const foes=Object.values(FOES).filter(f=>S.L+1>=f.from).map(f=>f.n.toLowerCase());
  $('nextInfo').textContent=`Fort attacks: ${attackNames(S.L+1)}. Enemies: grunts, brutes${foes.length?', '+foes.join(', '):''}.`;
}
function attackNames(L){const n={aimed:'aimed shots',mortar:'mortar',spread:'spread',ring:'rings',rain:'rain',spiral:'spirals',laser:'lasers',homing:'homing missiles',wall:'bullet walls'};const p=['aimed','mortar','spread'];if(L>=2)p.push('ring');if(L>=3)p.push('rain');if(L>=4)p.push('spiral');if(L>=5)p.push('laser');if(L>=6)p.push('homing');if(L>=8)p.push('wall');return p.map(x=>n[x]).join(', ')}
$('shopReroll').addEventListener('click',()=>{if(R.coins<SH.reroll)return;R.coins-=SH.reroll;SH.reroll++;SH.cards=rollRelics();SH.sold=[];drawShop()});
$('packBtn').addEventListener('click',()=>{if(R.coins<SH.pack)return;R.coins-=SH.pack;SH.pack+=2;$('ovShop').hidden=true;R.pendingPicks++;S.afterPick=()=>openShop(false);openPick('Upgrade pack')});
$('nextFort').addEventListener('click',nextFort);
function nextFort(){
  $('ovShop').hidden=true;startFort(S.L+1,false);S.running=true;
  if(S.lv.boss)cue('boss');
}
// counts every [data-n] number in a panel up from zero, ticking softly as it goes
function countUp(root){if(!root||!root.querySelectorAll)return;const els=[...root.querySelectorAll('[data-n]')];if(!els.length)return;const t0=performance.now(),dur=900;let tick=0;
  const step=()=>{const p=Math.min(1,(performance.now()-t0)/dur),e=1-Math.pow(1-p,3);for(const el of els){const v=Math.round(+el.dataset.n*e);el.textContent=el.dataset.f?fmt(v):String(v)}
    if(p<1){if(++tick%4===0)blip(900+600*e,.025,'triangle',.018);requestAnimationFrame(step)}else playS('coin',.45)};requestAnimationFrame(step)}
function runOver(quit){
  msgFlushBattle();
  clearRun();
  S.over=true;S.running=false;MUS.mode='menu';
  const gems=R.forts*R.forts+R.forts*4;
  checkAch('end');const rec=META.rec;rec.runs++;rec.kills+=Math.round(R.kills);rec.forts+=R.forts;rec.bestLvl=Math.max(rec.bestLvl,R.lvl);rec.levels=(rec.levels||0)+R.lvl-1;rec.bigs=(rec.bigs||0)+(R.bigHits||0);rec.relicsB=(rec.relicsB||0)+(R.relicsBought||0);rec.gates=(rec.gates||0)+(R.gateN||0);
  META.gems+=gems;META.best=Math.max(META.best,R.forts);R.banked=true;saveMeta();mileCheck();
  $('endTitle').textContent=quit?`Retreated at gatekeep ${S.L}`:S.siege?`Overrun in the siege of gatekeep ${S.L}`:`Fallen at gatekeep ${S.L}`;
  const m=Math.floor(R.time/60),s=Math.floor(R.time%60);
  $('endStats').innerHTML=`<div><b data-n="${R.forts}">${R.forts}</b>forts destroyed</div><div><b data-n="${R.lvl}">${R.lvl}</b>level reached</div><div><b data-n="${Math.round(R.kills)}" data-f="1">${fmt(R.kills)}</b>enemies crushed</div><div><b>${m}:${String(s).padStart(2,'0')}</b>run time</div>`;
  const bl=$('endBuild');bl.innerHTML='';
  const vs=document.createElement('span');vs.style.background='#fff';vs.textContent=VEH[R.veh].name;bl.appendChild(vs);
  for(const id of R.relics){const sp=document.createElement('span');sp.style.background=TIERC[relicTierOf(id,has(id))];sp.textContent=relicName(id,has(id));bl.appendChild(sp)}
  for(const [id,l] of Object.entries(R.ups)){const u=UPNAME[id];const sp=document.createElement('span');sp.style.background=CATC[u.cat];sp.textContent=u.cat==='evo'||u.cat==='lim'?u.name:`${u.name} ${l}`;bl.appendChild(sp)}
  {const hl=Object.entries(R.hitLog||{}).sort((a,b)=>b[1]-a[1]).slice(0,3);const el=$('endHits');if(el){el.hidden=!hl.length;el.innerHTML=hl.length?'<b>Most hits from</b> '+hl.map(([k,n])=>`${(HITN[k]||k).toLowerCase()} ×${n}`).join(' · '):''}}
  $('endCoins').innerHTML=`+<b data-n="${gems}">${gems}</b> gems`;
  blip(110,.4,'sawtooth',.07);
  if(!quit){playS('lose',.8);S.deadT=0;shout(S.overrun?'OVERRUN!':'DEFEATED','#ff3b4e',1.8,{sub:S.overrun?'THE KEEP ROLLED OVER YOU':'YOUR RIDE IS DOWN'});S.booms.push({x:S.cannon.x,y:S.cannon.y,r:60,life:.5})}
  setTimeout(()=>{$('ovEnd').hidden=false;$('again').focus();countUp($('ovEnd'))},quit?400:1800);
}

