// ---------- secrets: hidden, extremely hard achievements that unlock gear you can't get any other way ----------
// Each one shows only a cryptic hint until it's earned. Rewards are permanent: secret weapons and perks join
// the level-up pool, secret cosmetics appear in the Garage, plus a pile of gems.
const SECRETS=[
  {id:'ghost',name:'Ghost Protocol',hint:'A ghost leaves no marks. Ten keeps running.',d:'Breach 10 keeps in a row in one run without taking a single hit',g:300,rw:{perk:'phase',cos:[['finish','spectral']]}},
  {id:'abyss',name:'Abyss Walker',hint:'The deepest gate is the thirtieth.',d:'Reach gatekeep 30',g:400,rw:{wpn:'vortex',cos:[['blob','starlight']]}},
  {id:'prism',name:'Prismatic Mind',hint:'Four legends, all at once.',d:'Own 4 evolved weapons at the same time',g:300,rw:{wpn:'prism',cos:[['finish','prismatic']]}},
  {id:'speed',name:'Lightspeed',hint:'Ten keeps before the clock reads six.',d:'Breach 10 keeps within 6 minutes of fighting time',g:250,rw:{perk:'overdrive',cos:[['trail','starfall']]}},
  {id:'ascetic',name:'The Ascetic',hint:'Take nothing. Keep only what you came with. Twelve times.',d:'Breach 12 keeps in one run with no relics and no weapon except your starting one',g:400,rw:{perk:'gatelord',cos:[['trail','rift']]}},
  {id:'edge',name:"Knife's Edge",hint:'Win on the edge of death, three times over.',d:'Breach 3 keeps in one run, each with less than 5% hull left',g:250,rw:{wpn:'blade',cos:[['finish','molten'],['trail','glitch']]}},
  {id:'sovereign',name:'Sovereign',hint:'Everything else comes first.',d:'Earn every regular achievement',g:1000,rw:{cos:[['finish','crowned'],['blob','sovereign']]}},
];
if(!META.secret)META.secret={};
const secretOwn=id=>!!(META.secret&&META.secret[id]);
function cosItem(kind,id){return (COS[kind]||[]).find(x=>x.id===id)}
const COSKIND={paint:'paint',blob:'shot colour',trail:'trail',finish:'ride finish'};
function secretRewards(s,vague){
  const out=[];
  if(s.rw.wpn)out.push(vague?'secret weapon':`Weapon: ${UPNAME[s.rw.wpn].name}`);
  if(s.rw.perk)out.push(vague?'secret perk':`Perk: ${UPNAME[s.rw.perk].name}`);
  for(const [k,id] of s.rw.cos||[])out.push(vague?COSKIND[k]:`${cosItem(k,id).name} ${COSKIND[k]}`);
  out.push(`${s.g} gems`);return out}
function secretUnlock(id){
  const s=SECRETS.find(x=>x.id===id);if(!s||secretOwn(id))return;
  META.secret[id]=1;META.gems+=s.g;
  for(const [k,cid] of s.rw.cos||[]){META.cos[k]=META.cos[k]||[];if(!META.cos[k].includes(cid))META.cos[k].push(cid)}
  saveMeta();
  const line=secretRewards(s).join(' · ');
  if(S&&$('ovStart').hidden)cutIn({title:'SECRET UNLOCKED',sub:s.name,line,col:'#ffcf2e',dur:3.4});
  toast(`Secret unlocked: ${s.name}. ${line}`,4200,2);cue('ach');buzz([40,60,40,60,120]);
}
// checked whenever achievements are checked; 'fort' fires right after a keep falls
function secretCheck(ev){
  if(!R||!S)return;
  if(ev==='fort'){
    if((R.clean||0)>=10)secretUnlock('ghost');
    if(R.forts>=10&&R.time<=360)secretUnlock('speed');
    if(R.forts>=12&&!R.relics.length&&!(R.relicsBought>0)&&UP.every(u=>u.kind!=='w'||!lv_(u.id)||u.id===VEH[R.veh].start))secretUnlock('ascetic');
    if(S.cannon.hp>0&&S.cannon.hp/S.st.maxHp<.05){R.edge=(R.edge||0)+1;if(R.edge>=3)secretUnlock('edge')}
  }
  if(S.L>=30)secretUnlock('abyss');
  if(EVO.filter(e=>lv_(e.id)).length>=4)secretUnlock('prism');
  sovereignCheck();
}
function sovereignCheck(){if(!secretOwn('sovereign')&&ACH.every(a=>META.ach[a.id]))secretUnlock('sovereign')}
function renderSecrets(){
  const box=$('secList');if(!box||!box.appendChild)return;box.innerHTML='';
  for(const s of SECRETS){const got=secretOwn(s.id),d=document.createElement('div');d.className='secret'+(got?' got':'');
    d.innerHTML=got?`<b>◆ ${s.name}</b><small>${s.d}</small><em>${secretRewards(s).join(' · ')}</em>`
      :`<b>◆ ???</b><small class="hint">“${s.hint}”</small><em>Unlocks: ${secretRewards(s,true).join(' · ')}</em>`;
    box.appendChild(d)}
  const c=$('secCount');if(c)c.textContent=`${SECRETS.filter(s=>secretOwn(s.id)).length}/${SECRETS.length}`;
}

// ---------- ride finishes: animated effects layered around the 3D ride ----------
const SIL=new WeakMap();
function silhouette(img,col){let m=SIL.get(img);if(!m){m={};SIL.set(img,m)}if(m[col])return m[col];
  const c2=mk(img.width,img.height),g2=c2.getContext('2d');if(!g2||!g2.drawImage)return null;g2.drawImage(img,0,0);g2.globalCompositeOperation='source-in';g2.fillStyle=col;g2.fillRect(0,0,c2.width,c2.height);return m[col]=c2}
// draws img at (dx,dy,dw,dh) with the finish's effects behind and in front of it
function drawFinished(g,img,dx,dy,dw,dh,fin,t){
  if(!fin||fin==='none'||LQ()&&g===ctx){g.drawImage(img,dx,dy,dw,dh);return}
  t=t??performance.now()/1000;const k=dw/84,ba=g.globalAlpha,pulse=.5+.5*Math.sin(t*4),glowRing=(col,a,off)=>{const s2=silhouette(img,col);if(!s2)return;g.save();g.globalCompositeOperation='lighter';g.globalAlpha=ba*a;for(const [ox,oy] of [[-1,0],[1,0],[0,-1],[0,1]])g.drawImage(s2,dx+ox*off,dy+oy*off,dw,dh);g.restore()};
  if(fin==='spectral'){const s2=silhouette(img,'#7fe8ff');if(s2){g.save();g.globalCompositeOperation='lighter';g.globalAlpha=ba*.4;g.drawImage(s2,dx+Math.sin(t*5)*2*k,dy+dh*.08,dw,dh);g.globalAlpha=ba*.2;g.drawImage(s2,dx-Math.sin(t*5)*2*k,dy+dh*.16,dw,dh);g.restore()}
    glowRing('#7fe8ff',.35+.2*pulse,2*k);g.save();g.globalAlpha*=.72+.28*Math.abs(Math.sin(t*6.5));g.drawImage(img,dx,dy,dw,dh);g.restore();return}
  if(fin==='prismatic'){const sh=(2+1.5*Math.sin(t*3))*k,r=silhouette(img,'#ff2e63'),b=silhouette(img,'#2ee8ff');
    if(g.createConicGradient){g.save();const cx=dx+dw/2,cy=dy+dh*.86,rg=g.createConicGradient(t*2,cx,cy);for(let i=0;i<=6;i++)rg.addColorStop(i/6,`hsla(${i*60},100%,62%,.85)`);g.strokeStyle=rg;g.lineWidth=2.4*k;g.globalAlpha=ba*.8;g.beginPath();g.ellipse(cx,cy,dw*.34,dw*.11,0,0,6.283);g.stroke();g.restore()}
    glowRing(`hsl(${(t*90)%360|0},100%,62%)`,.3,1.8*k);if(r&&b){g.save();g.globalCompositeOperation='lighter';g.globalAlpha=ba*.45;g.drawImage(r,dx-sh,dy,dw,dh);g.drawImage(b,dx+sh,dy,dw,dh);g.restore()}
    g.drawImage(img,dx,dy,dw,dh);return}
  if(fin==='molten'){glowRing('#ff6a1a',.45+.3*pulse,2.2*k);g.drawImage(img,dx,dy,dw,dh);const s2=silhouette(img,'#ff8a2a');if(s2){g.save();g.globalCompositeOperation='lighter';g.globalAlpha=ba*(.1+.14*pulse);g.drawImage(s2,dx,dy,dw,dh);g.restore()}return}
  if(fin==='crowned'){glowRing('#ffcf2e',.4,1.8*k);g.drawImage(img,dx,dy,dw,dh);
    const cx=dx+dw/2,cy=dy+dh*.05+Math.sin(t*2.2)*1.5*k,rx=dw*.21,ry=rx*.3;g.save();g.globalCompositeOperation='lighter';g.globalAlpha=ba*.7;g.drawImage(glowSprite('rgb(255,207,46)'),cx-rx*1.8,cy-rx*.9,rx*3.6,rx*1.8);g.restore();
    const hg=g.createLinearGradient(cx-rx,0,cx+rx,0);hg.addColorStop(0,'#a8780c');hg.addColorStop(.5,'#fff0a8');hg.addColorStop(1,'#a8780c');g.strokeStyle=hg;g.lineWidth=Math.max(2,3.6*k);g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,6.283);g.stroke();
    for(let i=0;i<3;i++){const a=t*1.8+i*2.094,sx=cx+Math.cos(a)*rx,sy=cy+Math.sin(a)*ry;glowDot(g,sx,sy,1.6*k,'#fff6c8')}return}
  g.drawImage(img,dx,dy,dw,dh)}
// in-game extras: embers and sparkles fly off some finishes
function finishSparks(c){const f=cosSel('finish').id;if(!S.running||LQ()||S.sparks.length>=250)return;
  if(f==='molten'&&Math.random()<.35)S.sparks.push({x:c.x+(Math.random()-.5)*22,y:c.y-4,vx:(Math.random()-.5)*20,vy:-40-Math.random()*40,life:.6,c:Math.random()<.5?'#ff6a1a':'#ffcf2e'});
  else if(f==='crowned'&&Math.random()<.15)S.sparks.push({x:c.x+(Math.random()-.5)*26,y:c.y-30,vx:(Math.random()-.5)*16,vy:-20,life:.5,c:'#fff0a8'});
  else if(f==='spectral'&&Math.random()<.2)S.sparks.push({x:c.x+(Math.random()-.5)*20,y:c.y+4,vx:0,vy:40,life:.4,c:'#7fe8ff'});
}

// ---------- secret weapon effects ----------
function drawSecretFx(K){
  if(S.slashes.length||S.waves.length){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(const sl of S.slashes){const z=sc(sl.y)*K,x=px(sl.x,sl.y),y=py(sl.y)-8*z,r=sl.r*z,a=sl.life/.2,from=sl.side>0?-Math.PI+.2:-.2,to=sl.side>0?-.2:-Math.PI+.2,mid=from+(to-from)*Math.min(1,(1-a)*1.6);
      ctx.strokeStyle=sl.rift?`rgba(255,120,240,${.9*a})`:`rgba(200,245,255,${.9*a})`;ctx.lineWidth=Math.max(2,5*z*a+1);ctx.beginPath();if(sl.side>0)ctx.ellipse(x,y,r,r*.7,0,from,mid);else ctx.ellipse(x,y,r,r*.7,0,mid,from);ctx.stroke();ctx.lineWidth=Math.max(1,1.6*z);ctx.strokeStyle=`rgba(255,255,255,${a})`;ctx.stroke()}
    for(const w of S.waves){const z=sc(w.y)*K,x=px(w.x,w.y),y=py(w.y)-6*z,hw=w.w/2*z;ctx.strokeStyle='rgba(255,110,240,.85)';ctx.lineWidth=Math.max(2,3.5*z);ctx.beginPath();ctx.ellipse(x,y+hw*.25,hw,hw*.32,0,Math.PI+.25,-.25);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.2;ctx.stroke()}
    ctx.restore()}
  for(const v of S.voids){const fl=Math.min(1,v.t/v.fly),x0=v.x0+(v.x-v.x0)*fl,y0=v.y0+(v.y-v.y0)*fl,z=sc(y0)*K,x=px(x0,y0),y=py(y0)-10*z,live=v.t>=v.fly,grow=live?Math.min(1,(v.t-v.fly)/.25):.4,core=(9+v.R*.06)*z*grow*(v.horizon?1.3:1);
    if(live){ctx.strokeStyle=`rgba(155,90,255,${.18+.1*Math.sin(S.t*8)})`;ctx.lineWidth=1.2;ctx.setLineDash([4,6]);ctx.beginPath();ctx.ellipse(x,py(y0),v.R*z,v.R*z*.38,0,0,6.283);ctx.stroke();ctx.setLineDash([])}
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.drawImage(glowSprite(v.horizon?'rgb(255,120,240)':'rgb(150,90,255)'),x-core*3.2,y-core*3.2,core*6.4,core*6.4);
    for(let i=0;i<3;i++){ctx.strokeStyle=`rgba(${i?'120,210,255':'210,140,255'},${.55-i*.14})`;ctx.lineWidth=(2.4-i*.5)*z;ctx.beginPath();ctx.ellipse(x,y,core*(1.7+i*.45),core*(.55+i*.15),S.t*(1.5+i*.7)*(i%2?-1:1)*.15,0,6.283);ctx.stroke()}
    ctx.restore();ctx.fillStyle='#020104';ctx.beginPath();ctx.arc(x,y,core,0,6.283);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,core,0,6.283);ctx.stroke()}
  if(S.prisms.length){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(const p of S.prisms){const z=sc(p.y)*K,x1=px(p.x,p.y),y1=py(p.y)-10*z,tx=p.x-p.vx*.032,ty=p.y-p.vy*.032,x2=px(tx,ty),y2=py(ty)-10*sc(ty)*K,h=(p.hue+S.t*240)%360;
      ctx.strokeStyle=`hsla(${h|0},100%,60%,.8)`;ctx.lineWidth=(p.spec?8:6.5)*z;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
      ctx.strokeStyle=`hsla(${h|0},100%,88%,.95)`;ctx.lineWidth=1.3*z;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.fillStyle=`hsl(${h|0},100%,86%)`;ctx.beginPath();ctx.arc(x1,y1,2.6*z,0,6.283);ctx.fill()}
    ctx.restore()}
}
