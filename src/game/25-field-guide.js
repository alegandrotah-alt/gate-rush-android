// ---------- field guide: a card the first time you meet each enemy or mechanic, collected in Records ----------
const GUIDE={
  gate:{n:'Gates',d:'Steer so your shots fly through gates. × multiplies them, + adds more, − takes some away.'},
  keep:{n:'The keep',d:'Shots that reach the wall damage the keep. Break it before the timer reaches zero.'},
  bullets:{n:'Enemy fire',d:'Glowing bullets hurt your ride. Keep moving and slide out of their path.'},
  hard:{n:'Ringed bullets',d:'Bullets with a dark ring cut straight through your shots. Always dodge these.'},
  runner:{n:'Runners',d:'Fast minions that rush straight at you.'},
  gunner:{n:'Gunners',d:'They stop partway down the road and open fire.'},
  splitter:{n:'Splitters',d:'Crush one and it splits into three smaller ones.'},
  armored:{n:'Armored',d:'Your shots barely dent them. Use your weapons.'},
  bomber:{n:'Bombers',d:'They explode on contact, wiping out shots and hurting you.'},
  saboteur:{n:'Saboteurs',d:'They park on your gates and hack them over to the keep.'},
  phantom:{n:'Phantoms',d:'While they flicker your shots pass straight through them.'},
  totem:{n:'Totems',d:'They plant themselves and heal the horde around them. Take them out first.'},
  brute:{n:'Brutes',d:'Big units with a number tag. That many shots are needed to crush one.'},
  elite:{n:'Elite challengers',d:'Rival machines with a health bar. Beat them for coins and treasure.'},
  courier:{n:'Bounty couriers',d:'Gold runners carrying coins. Catch them before they escape.'},
  pylon:{n:'Shield pylons',d:'The keep is shielded while its pylons stand. Destroy the pylons first.'},
  held:{n:'Captured gates',d:'Red gates belong to the keep and give you nothing. Shoot through them to win them back.'},
  zones:{n:'Range zones',d:'Near the keep is close range, far away is long range. Matching weapons hit harder in their zone.'},
  weak:{n:'Weak spots',d:'Each faction is weak to one damage type and resists another. The chip at the top shows the weakness.'},
  mods:{n:'Keep conditions',d:'Some keeps roll special conditions that change how they play. They are listed at the top of the screen.'},
  siege:{n:'Siege',d:'If the timer runs out the keep marches on you. Breach it fast or the run ends.'},
  lvl:{n:'Level-ups',d:'Crushing enemies earns XP. Level-ups wait behind the +LVL button until you want them.'},
};
const GUIDE_ORDER=Object.keys(GUIDE);
function guideSeen(id){return !!(META.guide&&META.guide[id])}
function guide(id,force){if(!GUIDE[id]||typeof document==='undefined')return false;META.guide=META.guide||{};if(META.guide[id]&&!force)return false;META.guide[id]=1;saveMeta();
  if(TUT&&TUT.busy&&!force)return true;toast(GUIDE[id].n,5200,2.5,id);return true}
function guideFid(){return S&&S.L?fac().id:'robot'}
function drawGuideIcon(cv,id){
  const g=cv.getContext('2d');if(!g||!g.clearRect)return;const W2=cv.width,H2=cv.height;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W2,H2);
  const fid=guideFid(),f=FACTIONS[fid],bg=g.createRadialGradient(W2/2,H2*.55,4,W2/2,H2*.55,W2*.6);bg.addColorStop(0,hexA(f.glow,.28));bg.addColorStop(1,hexA(f.glow,0));g.fillStyle=bg;g.fillRect(0,0,W2,H2);
  const put=(im,sx,sy,sw,sh,s)=>{s=s||W2*.92;if(sw)g.drawImage(im,sx,sy,sw,sh,(W2-s*sw/sh)/2,(H2-s)/2,s*sw/sh,s);else g.drawImage(im,(W2-s)/2,(H2-s)/2,s,s)};
  const txt=(t,col,fs)=>{g.font=`900 ${fs}px Orbitron,sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;g.fillText(t,W2/2,H2/2)};
  if(FOES[id]||id==='brute'||id==='courier'){const im=foe3D(fid,id==='brute'?'':id==='courier'?'runner':id,0,W2);if(im)put(im);else g.drawImage(foeSprite(f,FOES[id]?id:'',0,1,0),W2*.1,H2*.05,W2*.8,H2*.88);
    if(id==='brute'||id==='courier'){g.fillStyle='#ffcf2e';const w=W2*.06,cy=H2*.18,x=W2/2;g.beginPath();g.moveTo(x-w*2,cy+w);g.lineTo(x-w*2,cy-w*.6);g.lineTo(x-w,cy+w*.1);g.lineTo(x,cy-w*1.2);g.lineTo(x+w,cy+w*.1);g.lineTo(x+w*2,cy-w*.6);g.lineTo(x+w*2,cy+w);g.closePath();g.fill()}return}
  if(id==='elite'){const c=g3cell('e_'+fid,320,1,G3RIDES.indexOf('hive'),W2);if(c)put(c);else txt('!',f.glow,W2*.5);return}
  if(id==='pylon'){const p=g3('pylon');if(p)put(p);else txt('◆','#7fe0ff',W2*.5);return}
  if(id==='keep'){const k=g3('k_'+fid);if(k)put(k,0,40,640,360,W2*.62);else txt('▲',f.glow,W2*.5);return}
  if(id==='gate'||id==='held'){const col=id==='held'?'#ff6a3a':'#7fd0ff',bw=W2*.7,bh=H2*.26,x=(W2-bw)/2,y=(H2-bh)/2;g.fillStyle=hexA(col,.35);g.fillRect(x,y,bw,bh);g.fillStyle=col;g.fillRect(x,y,bw,2);g.fillRect(x,y+bh-2,bw,2);g.fillRect(x-4,y-8,6,bh+12);g.fillRect(x+bw-2,y-8,6,bh+12);txt(id==='held'?'−40':'×2','#fff',bh*.8);return}
  if(id==='bullets'||id==='hard'){for(const [dx,dy,r] of [[-.18,-.12,.1],[.16,.05,.12],[-.04,.2,.09]]){const x=W2*(.5+dx),y=H2*(.5+dy),rr=W2*r;g.drawImage(coreSprite(BCOL[0][0],BCOL[0][1]),x-rr,y-rr,rr*2,rr*2);if(id==='hard'){g.strokeStyle='#14101e';g.lineWidth=3;g.beginPath();g.arc(x,y,rr*1.15,0,6.283);g.stroke()}}return}
  if(id==='zones'){g.fillStyle='rgba(255,140,40,.35)';g.fillRect(0,H2*.2,W2,H2*.25);g.fillStyle='rgba(95,225,255,.3)';g.fillRect(0,H2*.58,W2,H2*.25);g.font=`800 ${W2*.11}px Orbitron,sans-serif`;g.textAlign='center';g.fillStyle='#ffd0a0';g.fillText('CLOSE',W2/2,H2*.33);g.fillStyle='#c8f4ff';g.fillText('LONG',W2/2,H2*.71);return}
  if(id==='weak'){const w=FWEAK[fid][0];txt(DTN[w].toUpperCase(),DTC[w],W2*.16);return}
  if(id==='mods'){g.strokeStyle='#ffb43a';g.lineWidth=4;g.beginPath();for(let i=0;i<6;i++){const a=i/6*6.283-Math.PI/2;g.lineTo(W2/2+Math.cos(a)*W2*.3,H2/2+Math.sin(a)*W2*.3)}g.closePath();g.stroke();txt('!','#ffb43a',W2*.32);return}
  if(id==='siege'){g.fillStyle='#ff3b4e';g.beginPath();g.moveTo(W2/2,H2*.18);g.lineTo(W2*.84,H2*.8);g.lineTo(W2*.16,H2*.8);g.closePath();g.fill();g.fillStyle='#fff';g.font=`900 ${W2*.32}px Orbitron,sans-serif`;g.textAlign='center';g.textBaseline='middle';g.fillText('!',W2/2,H2*.58);return}
  if(id==='lvl'){g.fillStyle='#2ab8e0';g.beginPath();g.roundRect(W2*.15,H2*.36,W2*.7,H2*.28,H2*.14);g.fill();txt('+1 LVL','#041018',W2*.15);return}
}
function showCard(m){const el=$('guide'),G=GUIDE[m.card],bq=el&&el.querySelector&&el.querySelector('b');if(!el||!G||!bq){MSGON=null;return}
  el.querySelector('b').textContent=G.n;el.querySelector('p').textContent=G.d;drawGuideIcon(el.querySelector('canvas'),m.card);
  el.hidden=false;void el.offsetWidth;el.classList.add('on');CARDON=true;MSGON=m;clearTimeout(toastT);toastT=setTimeout(hideCard,m.ms)}
let CARDON=false;
function hideCard(){const el=$('guide');CARDON=false;if(el){el.classList.remove('on');setTimeout(()=>{if(!CARDON)el.hidden=true},260)}MSGON=null}
function renderGuideList(){const box=$('guideList');if(!box)return;box.innerHTML='';const n=GUIDE_ORDER.filter(guideSeen).length;$('guideCount').textContent=`${n}/${GUIDE_ORDER.length} discovered`;
  for(const id of GUIDE_ORDER){const d=document.createElement('div'),got=guideSeen(id);d.className='gitem'+(got?' got':'');const cv=document.createElement('canvas');cv.width=96;cv.height=96;d.appendChild(cv);
    const t=document.createElement('div');t.innerHTML=got?`<b>${GUIDE[id].n}</b><small>${GUIDE[id].d}</small>`:'<b>???</b><small>Not met yet.</small>';d.appendChild(t);box.appendChild(d);if(got)drawGuideIcon(cv,id)}}

