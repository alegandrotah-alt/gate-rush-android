// ---------- input: drag anywhere to fly (relative on touch, direct with a mouse) ----------
let drag=null;
function toWorld(e){const r=cv.getBoundingClientRect();const y=unY(e.clientY-r.top);return{x:unX(e.clientX-r.left,y),y}}
cv.addEventListener('pointerdown',e=>{ensureAudio();if(!S.running)return;drag={id:e.pointerId,last:toWorld(e),mouse:e.pointerType==='mouse'};if(drag.mouse){const w=drag.last;S.cannon.tx=w.x;S.cannon.ty=w.y}try{cv.setPointerCapture(e.pointerId)}catch(_){}});
cv.addEventListener('pointermove',e=>{
  if(!S.running)return;const w=toWorld(e);
  if(e.pointerType==='mouse'){S.cannon.tx=w.x;S.cannon.ty=w.y;return}
  if(!drag||drag.id!==e.pointerId)return;
  S.cannon.tx+=(w.x-drag.last.x)*1.25;S.cannon.ty+=(w.y-drag.last.y)*1.25;drag.last=w;
});
const endDrag=()=>{drag=null};
cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
window.addEventListener('keydown',e=>{if(!S)return;if(e.key==='Escape'||e.key==='p'||e.key==='P'){togglePause();return}if((e.key==='e'||e.key==='E'||e.key==='Tab')&&S.running&&R.pendingPicks>0){e.preventDefault();openPick('Level up!');return}S.keys[e.key.toLowerCase()]=true;if(e.key===' '){fireBig();e.preventDefault()}});
window.addEventListener('keyup',e=>{if(!S)return;S.keys[e.key.toLowerCase()]=false});
$('big').addEventListener('pointerdown',e=>{e.stopPropagation();ensureAudio();fireBig()});
$('pauseBtn').addEventListener('click',()=>{ensureAudio();togglePause()});
function togglePause(force){
  if(!S||S.over||R.picking||!$('ovShop').hidden||!$('ovStart').hidden||!$('ovEnd').hidden)return;
  const on=force!=null?force:!S.paused;S.paused=on;S.running=!on;$('ovPause').hidden=!on;MUS.mode=on?'pause':'game';
  if(on){$('pauseInfo').textContent=`${biome().name} · ${fac().name} · Gatekeep ${S.L} · ${R.forts} breached so far`;$('ownedP').innerHTML=$('owned').innerHTML||'<span class="small">No upgrades yet</span>';$('pauseStats').textContent=`Power ×${S.st.weight.toFixed(1)} · Repair budget ${Math.round(S.healLeft/S.st.maxHp*100)}% · Coins ${R.coins} · Kills ${fmt(R.kills)}`;renderSettings($('settingsPause'));$('resume').focus()}
}
$('resume').addEventListener('click',()=>togglePause(false));
$('quit').addEventListener('click',()=>{const q=$('quit');if(!q.dataset.armed){q.dataset.armed='1';q.textContent='Tap again to end the run (you keep your gems)';setTimeout(()=>{q.dataset.armed='';q.textContent='End run and return to menu'},3000);return}
  q.dataset.armed='';q.textContent='End run and return to menu';$('ovPause').hidden=true;S.paused=false;runOver(true)});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&S&&S.running)togglePause(true)});
function fireBig(){
  if(!S.running||S.cannon.charge<1)return;S.cannon.charge=0;
  const st=S.st;let w=st.weight*st.shots/st.fireInt*4*(1+.4*lv_('charge'))*(has('singularity')===3?3:1);if(has('bigbang'))w=Math.max(w,S.firedW);spawnPlayer(S.cannon.x,S.cannon.y-16,w,0,true);if(!playS('big',.7))blip(140,.25,'sawtooth',.06);
}

