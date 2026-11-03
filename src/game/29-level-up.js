// ---------- level-up picks ----------
function slotsInfo(){
  const W=UP.filter(u=>u.kind==='w'),Pk=UP.filter(u=>u.kind==='p');
  return{w:W.filter(u=>lv_(u.id)>0).length,p:Pk.filter(u=>lv_(u.id)>0).length,wMax:4+rank('arsenal'),pMax:4+rank('satchel')};
}
function evoReady(e){return !lv_(e.id)&&lv_(e.w)>=5&&e.ps.some(p=>lv_(p)>=UPNAME[p].max)}
function choices(n){
  const evo=EVO.filter(evoReady).map(e=>({...UPNAME[e.id],evo:true}));
  const powMax=lim('overkill')?20:10,si=slotsInfo();
  const pool=UP.filter(u=>{if(u.secret&&!secretOwn(u.secret))return false;const l=lv_(u.id);if(l>=(u.id==='power'?powMax:u.max))return false;if(l>0||u.kind==='b')return true;return u.kind==='w'?si.w<si.wMax:si.p<si.pMax});
  const out=evo.slice(0,n);
  const unlocked=R.lvl>=16||EVO.some(e=>lv_(e.id));
  const limits=unlocked?LIM.filter(l=>!lv_(l.id)).map(l=>UPNAME[l.id]):[];
  if(limits.length&&out.length<n&&Math.random()<.3)out.push(rnd(limits));
  // weapons and perks you own (or could add) come first; at most one boost per hand unless nothing else is left
  const main=pool.filter(u=>u.kind!=='b'),boosts=pool.filter(u=>u.kind==='b');
  const bag=[];for(const u of main){const w=lv_(u.id)?3:2;for(let i=0;i<w;i++)bag.push(u)}
  while(out.length<n-1&&bag.length){const u=rnd(bag);if(!out.some(o=>o.id===u.id))out.push(u);else bag.splice(bag.indexOf(u),1)}
  const bb=boosts.slice();while(out.length<n&&bb.length){const u=bb.splice((Math.random()*bb.length)|0,1)[0];out.push(u);if(main.some(m=>!out.includes(m))&&out.length<n){const m=main.filter(m=>!out.some(o=>o.id===m.id));if(m.length)out.push(rnd(m))}}
  if(!out.length)out.push({id:'_heal',name:'Patch Job',ic:'+',cat:'def',d:()=>'Repair 30% HP'},{id:'_gold',name:'Coin Bag',ic:'¢',cat:'wpn',d:()=>'+5 coins'});
  return out.slice(0,n);
}
function synLine(u){
  const tick=id=>lv_(id)?'✓ ':'';
  if(u.evo)return `Evolves ${UPNAME[u.w].name} with ${u.ps.filter(p=>lv_(p)>=UPNAME[p].max).map(p=>UPNAME[p].name).join(' / ')}`;
  if(u.kind==='w')return `Synergy: ${u.syn.map(p=>tick(p)+UPNAME[p].name).join(', ')}. Max this + either one to evolve.`;
  if(u.kind==='p'){const ws=UP.filter(w=>w.kind==='w'&&w.syn.includes(u.id)&&(!w.secret||secretOwn(w.secret)));return ws.length?`Synergy: ${ws.map(w=>tick(w.id)+w.name).join(', ')}`:'Works with every build'}
  if(u.kind==='b')return 'Boost, takes no slot';
  return '';
}
let pickSet=[];
function pickScore(u){let s2=Math.random();const l=lv_(u.id);
  if(u.evo)s2+=100;if(u.cat==='lim')s2+=60;if((u.kind==='w'||u.kind==='p')&&l>0)s2+=30+l*3;
  if(u.kind==='p')for(const [id,lv] of Object.entries(R.ups)){const w=UPNAME[id];if(w&&w.syn&&w.syn.includes(u.id)&&lv>0)s2+=25+lv*4}
  if(u.kind==='w'&&u.syn&&u.syn.some(p=>lv_(p)>0))s2+=20;
  const ty=WTYPE[u.id];if(ty&&S&&FWEAK[fac().id][0]===ty)s2+=6;
  if(u.kind==='b')s2+=10+(['power','might','rapid'].includes(u.id)?8:0);
  return s2}
function bestPick(set){return set.reduce((a,b)=>pickScore(b)>pickScore(a)?b:a,set[0])}
function autoPick(){const set=choices(3+rank('choice4'));if(!set.length){R.pendingPicks=0;return}const u=bestPick(set);applyUp(u);R.pendingPicks--;renderOwned();toast(`Auto level-up: ${u.name}`,1200,0);checkAch('pick')}
let pickTitleBase='';
function pickHead(){$('pickTitle').textContent=pickTitleBase+(R.pendingPicks>1?` · ${R.pendingPicks} left`:'');$('pickLater').hidden=!!(S.over||S.afterPick)}
function openPick(title){
  if(R.picking)return;R.picking=true;S.running=false;cue('level');
  pickTitleBase=title;
  pickSet=choices(3+rank('choice4'));drawPicks();pickHead();
  $('ovPick').hidden=false;
}
function drawPicks(){
  const box=$('picks');box.innerHTML='';
  for(const u of pickSet){
    const l=lv_(u.id),b=document.createElement('button');b.type='button';const sec=u.secret||(u.evo&&UPNAME[u.w].secret);b.className='pick'+(u.evo?' evo':u.cat==='lim'?' lim':'')+(sec?' secret':'');
    const kindTxt=u.kind==='w'?'Weapon':u.kind==='p'?'Perk':u.kind==='b'?'Boost':'';
    const lvlTxt=(sec?'◆ SECRET · ':'')+(u.evo?'EVOLUTION':u.cat==='lim'?'LIMIT BREAK':u.max?`${kindTxt} · ${l?`Lv ${l}→${l+1}`:'NEW'}`:'');
    const ty=WTYPE[u.id]||(u.evo?WTYPE[u.w]:null),cl=WCLS[u.id]||(u.evo?WCLS[u.w]:PCLS[u.id])||(u.id==='siphon'||u.id==='guard'?'close':'');
    const sl=synLine(u),desc=typeof u.d==='function'?u.d(l):u.d;
    const tags=[ty?`<i style="font-style:normal;color:${DTC[ty]}">${DTN[ty]}</i>`:'',cl?`<i style="font-style:normal;color:${CLC[cl]}">${CLN[cl]}</i>`:''].filter(Boolean).join(' · ');
    b.innerHTML=`<img src="${iconFor(u.id)}" alt=""><b>${u.name}<small>${lvlTxt}</small></b><span class="pd">${desc}</span>${tags?`<em class="syn">${tags}${ty&&FWEAK[fac().id][0]===ty?' · keep is weak!':''}</em>`:''}${sl?`<em class="syn">${sl}</em>`:''}`;
    b.title=desc;b.addEventListener('click',()=>takePick(u));box.appendChild(b);
  }
  {const best=bestPick(pickSet),i=pickSet.indexOf(best),el=box.children[i];if(el){el.classList.add('rec');el.insertAdjacentHTML('afterbegin','<span class="recb">★ SUGGESTED</span>')}}
  {const si=slotsInfo();$('pickSlots').textContent=`Weapons ${si.w}/${si.wMax} · Perks ${si.p}/${si.pMax}${si.w>=si.wMax&&si.p>=si.pMax?' · slots full':''}`}
  $('reroll').textContent=`Reroll (${R.rerolls} left)`;$('reroll').disabled=R.rerolls<=0;
  setTimeout(()=>box.firstChild&&box.firstChild.focus(),30);
}
$('pickLater').addEventListener('click',()=>{if(S.over||S.afterPick)return;$('ovPick').hidden=true;R.picking=false;S.running=true});
$('lvlBtn').addEventListener('click',e=>{e.stopPropagation();ensureAudio();if(S&&!S.over&&!S.paused&&R.pendingPicks>0)openPick('Level up!')});
$('lvlBtn').addEventListener('pointerdown',e=>e.stopPropagation());
$('reroll').addEventListener('click',()=>{if(R.rerolls<=0)return;R.rerolls--;pickSet=choices(3+rank('choice4'));drawPicks()});
function applyUp(u){
  if(u.id==='_heal'){S.cannon.hp=Math.min(S.st.maxHp,S.cannon.hp+S.st.maxHp*.3);return}
  if(u.id==='_gold'){R.coins+=5;return}
  R.ups[u.id]=(R.ups[u.id]||0)+1;restat();
  if(u.id==='armor'||u.id==='aegis')S.pips=S.st.pips;
  if(u.id==='mirror')syncMirror();
}
function takePick(u){
  applyUp(u);checkAch('pick');blip(u.evo?300:660,.15,'triangle',.06);
  R.pendingPicks=Math.max(0,R.pendingPicks-1);renderOwned();
  if(R.pendingPicks>0){pickSet=choices(3+rank('choice4'));drawPicks();pickHead();return}
  $('ovPick').hidden=true;R.picking=false;
  if(S.afterPick){const f=S.afterPick;S.afterPick=null;f();return}
  S.running=true;
}
function treasure(){
  const c=choices(3);const u=c.find(x=>x.evo)||rnd(c);applyUp(u);renderOwned();
  toast(`Treasure! ${u.name}${u.evo||!u.max||u.cat==='lim'?'':' Lv '+lv_(u.id)}`);
}
let toastT=0;
const MSGQ=[];let MSGON=null;
function cutBig(){return CUT&&$('ovStart').hidden}
function toast(t,ms,pri,card){pri=pri??1;const m={t,ms:ms||1800,pri,at:performance.now(),card};
  if(MSGON&&MSGON.t===t)return;
  if(MSGON&&pri>MSGON.pri&&pri>=2){showMsg(m);return}
  if(MSGON||cutBig()){if(MSGQ.some(q=>q.t===t))return;MSGQ.push(m);MSGQ.sort((a,b)=>b.pri-a.pri||a.at-b.at);if(MSGQ.length>4)MSGQ.length=4;return}
  showMsg(m)}
function showMsg(m){if(m.card){showCard(m);return}const el=$('toast');el.textContent=m.t;el.classList.remove('p0','p1','p2','p3');el.classList.add('on','p'+m.pri);MSGON=m;clearTimeout(toastT);toastT=setTimeout(()=>{el.classList.remove('on');MSGON=null},m.ms)}
function msgTick(){if(MSGON||!MSGQ.length||cutBig())return;const now=performance.now();while(MSGQ.length&&MSGQ[0].pri<3&&now-MSGQ[0].at>7000)MSGQ.shift();if(MSGQ.length)setTimeout(()=>{if(!MSGON&&MSGQ.length&&!cutBig())showMsg(MSGQ.shift())},200)}
function msgFlushBattle(){MSGQ.length=0;if(MSGON&&!MSGON.card&&!MSGON.keep){clearTimeout(toastT);$('toast').classList.remove('on');MSGON=null}}
function msgClear(){MSGQ.length=0;MSGON=null;clearTimeout(toastT);$('toast').classList.remove('on');hideCard();if(TUT){TUT=null;$('coach').hidden=true}}
function renderOwned(){
  const parts=[];
  for(const id of R.relics)parts.push(`<span title="${relicName(id,has(id))}"><img src="${iconFor(id,'relic',has(id))}" alt="${relicName(id,has(id))}"></span>`);
  for(const [id,l] of Object.entries(R.ups)){const u=UPNAME[id];if(!u)continue;parts.push(`<span title="${u.name}"><img src="${iconFor(id)}" alt="${u.name}">${u.cat==='evo'||u.cat==='lim'?'':`<i>${l}</i>`}</span>`)}
  $('owned').innerHTML=parts.join('');
}

