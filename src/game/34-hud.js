// ---------- HUD ----------
let hudT=0;const HUDV={};
function hudTxt(id,v){if(HUDV[id]!==v){HUDV[id]=v;$(id).textContent=v}}
function hudW(id,v){v=Math.round(v*10)/10;if(HUDV[id+'w']!==v){HUDV[id+'w']=v;$(id).style.width=v+'%'}}
function updateHud(force){
  hudT-=1;if(!force&&hudT>0)return;hudT=6;
  hudW('hpFill',Math.max(0,S.baseHP/S.baseMax*100));hudTxt('hpTxt',fmt(Math.max(0,S.baseHP)));
  const w=S.st.weight;hudTxt('army','×'+(w>=100?fmt(w):w.toFixed(1)));
  hudTxt('chpLbl',VEH[R.veh].name);
  {const hg=S.lv.gates.filter(g=>!g.dead&&isHeld(g));hudTxt('gates',hg.filter(g=>g.own>0).length+'/'+hg.length)}
  {const hp=Math.max(0,S.cannon.hp/S.st.maxHp);hudW('chpFill',hp*100);$('hullbar').classList.toggle('low',hp<.3)}
  hudTxt('chp',Math.max(0,Math.ceil(S.cannon.hp))+'/'+S.st.maxHp+(S.st.pips?' '+'◆'.repeat(S.pips)+'◇'.repeat(S.st.pips-S.pips):''));hudTxt('rep',Math.round(S.healLeft/S.st.maxHp*100)+'%');
  hudTxt('lvl','LV '+R.lvl);hudW('xpFill',Math.min(100,R.xp/R.need*100));
  hudTxt('runCoins',String(R.coins));
  const left=Math.max(0,Math.ceil(S.lv.T-S.t));
  {const zz=$('zone');if(zz&&S.zone!==S._zh){S._zh=S.zone;zz.innerHTML=S.zone==='close'?'<span style="color:#ffa050">CLOSE +35%</span>':S.zone==='long'?'<span style="color:#5fe1ff">LONG +25%</span>':'Mid'}}
  hudTxt('fort',(S.lv.boss?'GRAND ':'KEEP ')+S.L+' · '+(S.siege?`OVERRUN ${Math.max(0,Math.ceil(30-(S.sgT||0)))}s`:S.lv.advance?`ARRIVES ${left}s`:`${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`));
  $('fort').classList.toggle('siege',S.siege||left<=10);
  {const lb=$('lvlBtn'),n=R.pendingPicks;lb.hidden=!(n>0)||S.over||!$('ovStart').hidden;if(n>0)lb.innerHTML=`+${n}<small>LVL</small>`;document.querySelector('.xpline').classList.toggle('ready',n>0)}
  const b=$('big');b.style.setProperty('--p',(S.cannon.charge*100)+'%');b.disabled=S.cannon.charge<1;
}

