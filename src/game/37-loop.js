// ---------- loop ----------
let last=performance.now(),acc=0,FRAME_DT=1/60;const STEP=1/60;let LASTMENU=null,LASTPB=null,FPSA=60,FPSW=16.7;
function frame(now){
  const dt=Math.min(.1,(now-last)/1000);last=now;FRAME_DT=dt||STEP;musicTick();pollPad();perfTick(dt);
  {const inMenu=!$('ovStart').hidden,pb=inMenu||!!(S&&S.over);if(inMenu!==LASTMENU){LASTMENU=inMenu;document.querySelectorAll('.hud,.hudb').forEach(h=>h.hidden=inMenu);$('big').hidden=inMenu}if(pb!==LASTPB){LASTPB=pb;$('pauseBtn').hidden=pb}}
  fxTick(dt);
  if(S.running&&!(S.introT>0)&&!(S.hitStop>0)){acc+=dt;let n=0;while(acc>=STEP&&n<6&&S.running){update(STEP);acc-=STEP;n++}if(n>=6)acc=0}else acc=0;
  const tw=performance.now();render();updateHud(false);
  if(SET.fps){const wk=performance.now()-tw;FPSA+=((dt>0?1/dt:60)-FPSA)*.05;FPSW+=(wk-FPSW)*.05;ctx.save();ctx.font='700 11px Orbitron,monospace';ctx.textAlign='left';ctx.textBaseline='top';const tx=`${Math.round(FPSA)} FPS  ${FPSW.toFixed(1)} ms`;ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(6,H-128,ctx.measureText(tx).width+10,17);ctx.fillStyle=FPSA>=50?'#7dffb0':FPSA>=30?'#ffcf2e':'#ff5a5a';ctx.fillText(tx,11,H-125);ctx.restore()}
  requestAnimationFrame(frame);
}
function saveRun(){if(!R||!R.live||!S)return;try{localStorage.setItem('gaterush-run',JSON.stringify({R:Object.assign({},R,{picking:false}),L:S.L,hp:S.cannon.hp}))}catch(e){}}
function loadRun(){try{const d=JSON.parse(localStorage.getItem('gaterush-run')||'null');return d&&d.R&&d.L?d:null}catch(e){return null}}
function clearRun(){try{localStorage.removeItem('gaterush-run')}catch(e){}}
function refreshCont(){const d=loadRun(),b=$('contBtn');if(!b)return;b.hidden=!d;if(d)b.textContent=`Continue run · Gatekeep ${d.L} · ${(VEH[d.R.veh]||VEH.cannon).name} Lv ${d.R.lvl}`}
function continueRun(){const d=loadRun();if(!d)return;ensureAudio();$('ovStart').hidden=true;$('ovEnd').hidden=true;$('ovShop').hidden=true;$('ovPause').hidden=true;
  R=d.R;R.picking=false;R.live=true;S=null;startFort(d.L,true);S.cannon.hp=Math.max(1,Math.min(S.st.maxHp,d.hp||S.st.maxHp));S.running=true;MUS.mode='game';renderOwned()}
function begin(){msgClear();ensureAudio();$('ovStart').hidden=true;$('ovEnd').hidden=true;$('ovShop').hidden=true;$('ovPause').hidden=true;newRun();R.live=true;R.tips=META.rec.runs<2;saveRun();S.running=true;MUS.mode='game'}
$('play').addEventListener('click',begin);
$('coachSkip').addEventListener('click',e=>{e.stopPropagation();tutSkip()});$('coachSkip').addEventListener('pointerdown',e=>e.stopPropagation());
$('guide').addEventListener('pointerdown',e=>{e.stopPropagation();clearTimeout(toastT);hideCard()});
document.addEventListener('click',e=>{const t=e.target&&e.target.closest&&e.target.closest('button');if(t)playS(t.classList.contains('pick')||t.classList.contains('relic')?'pick':'click',.45)});
$('contBtn').addEventListener('click',continueRun);
setTimeout(refreshCont,0);
$('again').addEventListener('click',()=>{$('ovEnd').hidden=true;renderShop();showTab('Play');$('ovStart').hidden=false;msgClear();newRun();refreshCont();$('play').focus()});
document.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{ensureAudio();showTab(b.dataset.tab)}));
function showTab(t){document.querySelectorAll('.tabs button').forEach(b=>{b.classList.toggle('on',b.dataset.tab===t);b.setAttribute('aria-selected',b.dataset.tab===t)});for(const n of ['Play','Garage','Research','Records','Settings'])$('tab'+n).hidden=n!==t;if(t==='Records')renderRecords();if(t==='Settings')renderSettings($('settingsMenu'));if(t==='Garage')renderGarage()}

resize();newRun();renderShop();showTab('Play');
for(let i=0;i<40;i++)spawnPlayer(230+Math.random()*120,300+Math.random()*320,1+Math.random()*30,0);
document.addEventListener('pointerdown',e=>{const b=e.target&&e.target.closest&&e.target.closest('button');if(b&&!b.disabled){ensureAudio();playS('click',.28,.95+Math.random()*.1)}},true);
// ?debug in the address exposes a few hooks for the automated browser checks
if(typeof location!=='undefined'&&/[?&]debug\b/.test(location.search))window.__GR={get S(){return S},get R(){return R},startFort,spawnElite,restat,secretUnlock};
requestAnimationFrame(frame);
})();
