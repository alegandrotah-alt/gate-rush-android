// ---------- damage over time: toxin ----------
// Toxin stacks on enemies (and on the keep), ticks every frame, and hits harder the longer it has been ticking (Patience,
// up to +60% after 4s). Stacks wear off unless they are topped up. Toxic damage is never resisted.
const TOXCAP=10,KTOXCAP=30;
let TOXHIT=0;
const toxCap=()=>TOXCAP+4*S.st.virulence+(has('pandemic')?10:0);
const ktoxCap=()=>KTOXCAP+10*S.st.virulence;
const patience=a=>1+.15*Math.min(4,a);
function afflict(e,n,m){
  if(!(e.w>0)||!(n>0)||e.dead)return;const st=S.st;
  if(!(e.tox>0)){e.tox=0;e.toxA=0;e.tpot=1}
  e.tox=Math.min(toxCap(),e.tox+n);e.toxT=4+st.virulence;if(m>1)e.tpot=Math.max(e.tpot||1,m);
  if(!R.toxSeen&&S.running!==false){R.toxSeen=1;guide('toxin')}
}
function afflictKeep(n,perm,m){
  if(!(n>0)||S.baseHP<=0)return;
  if(!(S.ktox>0)){S.ktox=0;S.ktoxA=0;S.kpot=1}
  S.ktox=Math.min(ktoxCap(),S.ktox+n);if(m>1)S.kpot=Math.max(S.kpot||1,m);S.ktoxT=Math.max(S.ktoxT||0,5+S.st.virulence);if(perm)S.kgoo=1;
  if(S.ktox>=50)award('ktox50');
}
// a poisoned enemy died: nanites jump, Contagion spreads, Plague Engine bursts
function toxDeath(e){
  R.toxKills=(R.toxKills||0)+1;if(R.toxKills>=1000)award('tox1k');
  const st=S.st,pan=has('pandemic'),n0=e.tox;
  if(e.nano){let best=null,bd=160*160;for(const f of S.enemies){if(f===e||f.w<=0||f.dead)continue;const d=(f.x-e.x)**2+(f.y-e.y)**2;if(d<bd){bd=d;best=f}}
    if(best){afflict(best,Math.max(3,n0*.8),e.tpot);best.nano=1;toxLink(e,best,1)}}
  if(st.contagion||pan){const k=pan?1:[0,.5,.75,1][st.contagion],cnt=pan?99:st.contagion+1,R2=pan?95:75,near=[];
    for(const f of S.enemies){if(f===e||f.w<=0||f.dead)continue;const d=(f.x-e.x)**2+(f.y-e.y)**2;if(d<R2*R2)near.push([d,f])}
    near.sort((a,b)=>a[0]-b[0]);const pick=near.slice(0,cnt);
    for(const [,f] of pick){afflict(f,Math.max(1,n0*k),(e.tpot||1)*k);toxLink(e,f,0)}
    R.spreads=(R.spreads||0)+pick.length;if(R.spreads>=150)award('spread')}
  if(st.plague&&S.clouds.length<18&&Math.random()<.5)S.clouds.push({x:e.x,y:e.y,r:24,t:1.5,T0:1.5,tick:0,n:1,mult:Math.min(e.tpot||1,8),mask:0});
  if(pan&&e.y<S.fy+140)afflictKeep(n0*.5,0,e.tpot);
  if(FXOK()&&Math.random()<.4)spark(e.x,e.y,'#a6ff4a',3);
}
function toxLink(a,b,nano){if(S.toxLinks.length<40)S.toxLinks.push({x1:a.x,y1:a.y,x2:b.x,y2:b.y,life:.3,nano})}
function hiss(v,d,cut){if(!AC||!SET.sfx)return;const now=AC.currentTime;if(now-(hiss.t||0)<.08)return;hiss.t=now;noise(v*SET.sfx,d,cut)}
// damage per stack per second: scales with raw firepower and the best toxin weapon you own
function toxK(W){const st=S.st,l=Math.max(st.venom,st.spores,st.nanite,1);
  return (.14+.05*l)*W.P*W.HT*[1,1.3,1.6,2][st.virulence]*((st.plague||st.bloom||st.greygoo)?1.25*W.E:1)}
// fired from weaponsTick for you and each wingman
function toxWeapons(o,W,P,tm){
  const st=S.st,dt=W.dt;
  DTY='tox';WCL='dot';// Venom Sprayer / Plague Engine: toxic mist puffs that ride your × gates
  if(st.venom){const pl=!!st.plague;
    if(cd(tm,'venom',dt,Math.max(.08,.24-.03*st.venom)*W.CD))fireEv(()=>{if(S.mist.length>=(LQ()?90:170))return;
      const a=-Math.PI/2+(Math.random()-.5)*(pl?.24:.75),sp=pl?320:250;
      S.mist.push({x:o.x+(Math.random()-.5)*8,y:o.y-16,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:pl?3:(.5+.06*st.venom)*(o.main?1:.7),r:6,mult:1,mask:0,hit:new Set(),n:pl?2:1,pl})});
    if(o.main&&cd(tm,'venomS',dt,.36))hiss(.016,.2,2200+Math.random()*900)}
  if(st.spores&&cd(tm,'spores',dt,Math.max(1.5,3.6-.35*st.spores)*W.CD))fireEv(()=>{// Spore Pods / Bloom
    for(let i=0;i<(st.bloom?2:1)&&S.pods.length<10;i++){const d=densest()||{x:110+Math.random()*180,y:S.fy+70+Math.random()*120};
      S.pods.push({x0:o.x,y0:o.y-16,x:clamp(d.x+(i?(Math.random()-.5)*110:0),40,360),y:clamp(d.y+(i?(Math.random()-.5)*60:0),S.fy+30,Math.max(S.fy+40,o.y-40)),t:0,dur:.6})}
    blip(190,.09,'sine',.045)});
  if(st.nanite&&cd(tm,'nanite',dt,Math.max(.6,1.7-.2*st.nanite)*W.CD))fireEv(()=>{// Nanite Darts / Grey Goo
    tm.nanN=(tm.nanN||0)+1;const n=3+st.nanite;
    if(st.greygoo&&tm.nanN%2===0){S.darts.push({x:o.x,y:o.y-16,vx:0,vy:-640,goo:1,mult:1,mask:0,n,life:2});blip(2100,.04,'triangle',.025);return}
    let best=null,bw=-1;for(const e of S.enemies){if(e.w<=0||e.dead||e.y>o.y+10)continue;const s=e.w*(e.elite?4:e.brute?2:1)*(e.nano?.4:1)/(1+Math.abs(e.x-o.x)/180);if(s>bw){bw=s;best=e}}
    if(best){S.darts.push({x:o.x,y:o.y-16,vx:0,vy:-420,tg:best,n,dmg:(.5+.25*st.nanite)*P,life:1.6});blip(1700,.03,'triangle',.02)}});
}
function toxTick(dt,W){
  const st=S.st,TK=toxK(W);
  DTY='tox';WCL='dot';
  // mist puffs: grow as they drift, poison everything they touch once, multiply at × gates
  for(const p of S.mist){const y0=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.98;p.life-=dt;p.r=Math.min(p.pl?18:22,p.r+34*dt);gatePass(p,y0,p.y);
    for(const e of S.enemies){if(e.w<=0||p.hit.has(e))continue;const rr=p.r+radius(e.w,e.brute);if((e.x-p.x)**2+(e.y-p.y)**2<rr*rr){p.hit.add(e);afflict(e,p.n*Math.min(p.mult,4),p.mult)}}
    if(p.y<=S.fy+6){if(p.pl)afflictKeep(p.n*.5,0,p.mult);else if(p.mult>1)afflictKeep(.25,0,p.mult);p.life=0}}
  S.mist=S.mist.filter(p=>p.life>0&&p.x>16&&p.x<384);
  // spore pods land and burst into clouds
  for(const s2 of S.pods){s2.t+=dt;if(s2.t>=s2.dur&&!s2.done){s2.done=1;const bl=!!st.bloom,r=(30+5*st.spores)*(bl?1.5:1),T=2.6+.4*st.spores+(bl?2:0);
    if(S.clouds.length<18)S.clouds.push({x:s2.x,y:s2.y,r,t:T,T0:T,tick:0,n:bl?2:1,bloom:bl,mult:1,mask:0});hiss(.03,.35,1600);vfx({k:'circle_02',x:s2.x,y:s2.y-4,s0:10,s1:r*2.2,dur:.3,col:'#a6ff4a',add:1})}}
  S.pods=S.pods.filter(s2=>!s2.done);
  for(const c of S.clouds){c.t-=dt;c.tick-=dt;
    if(c.bloom&&!c.cling){const y0=c.y;c.y-=26*dt;gatePass(c,y0,c.y);if(c.y-c.r*.45<=S.fy+6){c.cling=1;c.y=S.fy+6+c.r*.45}}
    if(c.tick<=0){c.tick=.4;for(const e of S.enemies){if(e.w<=0)continue;const dx=e.x-c.x,dy=(e.y-c.y)*1.6,rr=c.r+radius(e.w,e.brute);if(dx*dx+dy*dy<rr*rr)afflict(e,c.n,c.mult)}
      if(c.y-c.r*.5<S.fy+8)afflictKeep(c.cling?3:1,0,c.mult)}}
  S.clouds=S.clouds.filter(c=>c.t>0);
  // nanite darts home in on their host; Grey Goo darts ride your gates into the keep
  for(const d of S.darts){d.life-=dt;const y0=d.y;
    if(d.goo){d.y+=d.vy*dt;gatePass(d,y0,d.y);if(d.y<=S.fy){afflictKeep(d.n,1,d.mult);if(d.mult>1)popup(d.x,S.fy+10,'×'+fmt(d.mult),'#d0e8ff');spark(d.x,S.fy,'#c8d0dc',4);d.life=0}continue}
    if(!d.tg||d.tg.w<=0||d.tg.dead){let best=null,bd=200*200;for(const e of S.enemies){if(e.w<=0||e.dead)continue;const q=(e.x-d.x)**2+(e.y-d.y)**2;if(q<bd){bd=q;best=e}}d.tg=best;if(!best){d.life=0;continue}}
    const e=d.tg,dx=e.x-d.x,dy=e.y-d.y,dd=Math.hypot(dx,dy)||1,sp=Math.min(760,Math.hypot(d.vx,d.vy)+900*dt);
    d.vx+=(dx/dd*sp-d.vx)*Math.min(1,dt*12);d.vy+=(dy/dd*sp-d.vy)*Math.min(1,dt*12);d.x+=d.vx*dt;d.y+=d.vy*dt;
    if(dd<8+radius(e.w,e.brute)){afflict(e,d.n);e.nano=1;hurt(e,d.dmg,2);spark(e.x,e.y,'#d8ff7a',3);d.life=0}}
  S.darts=S.darts.filter(d=>d.life>0);
  for(const l of S.toxLinks)l.life-=dt;S.toxLinks=S.toxLinks.filter(l=>l.life>0);
  // poisoned enemies tick
  DTY='tox';WCL='dot';
  for(const e of S.enemies){if(!(e.tox>0)||e.w<=0)continue;
    e.toxA+=dt;e.toxT-=dt;if(e.toxT<=0){e.tox=0;e.nano=0;continue}
    hurt(e,e.tox*TK*patience(e.toxA)*(e.tpot||1)*dt,2)}
  // the poisoned keep
  if(S.ktox>0&&S.baseHP>0){S.ktoxA+=dt;
    if(!S.kgoo&&!has('pandemic')){S.ktoxT-=dt;if(S.ktoxT<=0){S.ktox=0;S.ktoxA=0;S.kpot=1}}
    if(S.ktox>0){const d=S.ktox*TK*.6*patience(S.ktoxA)*(S.kpot||1)*dt*clsMul(),dmg=d*fortMult();S.ktoxAcc=(S.ktoxAcc||0)+dmg;TOXHIT=1;
      if(S.twin){hitKeep(dmg/2,110);hitKeep(dmg/2,290)}else hitKeep(dmg,200);TOXHIT=0;
      S.ktoxPT=(S.ktoxPT??1)-dt;if(S.ktoxPT<=0){S.ktoxPT=1;S.ktoxDps=S.ktoxAcc;S.ktoxAcc=0;hiss(.02,.4,1300)}}}
}
// ---------- toxin rendering ----------
function toxAura(e,x,y,r){if(LQ())return;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(.55,.18+e.tox*.03);ctx.drawImage(glowSprite('rgb(130,255,60)'),x-r*1.7,y-r*2.8,r*3.4,r*3.4);ctx.globalCompositeOperation='source-over'}
function toxBubbles(list,R_){
  ctx.strokeStyle='rgba(14,32,8,.75)';ctx.lineWidth=.8;
  for(const e of list){if(!(e.tox>0)||e.w<=0)continue;const r=R_(e)*(e.elite?1.8:1),x=px(e.x,e.y),y=py(e.y),n=LQ()?1:e.tox>6?3:2;
    for(let i=0;i<n;i++){const ph=(S.t*1.4+e.wob*.37+i*.37)%1,bx=x+Math.sin(e.wob*2+i*2.1)*r*.7,by=y-r*(1.5+ph*2.2);
      ctx.globalAlpha=1-ph;ctx.fillStyle=e.nano&&i===0?'#dfe6ee':'#b6ff5a';ctx.beginPath();ctx.arc(bx,by,Math.max(1.2,r*.17*(1-ph*.4)),0,6.283);ctx.fill();ctx.stroke()}}
  ctx.globalAlpha=1}
function drawTox(K){
  const any=S.mist.length||S.clouds.length||S.pods.length||S.darts.length||S.toxLinks.length||S.ktox>0;if(!any&&!S.enemies.some(e=>e.tox>0&&(e.brute||e.elite)))return;
  // clouds on the ground
  for(const c of S.clouds){const z=sc(c.y)*K,x=px(c.x,c.y),y=py(c.y),fade=Math.max(0,Math.min(1,c.t/.5,(c.T0-c.t)/.25+.2)),rx=c.r*z,ry=rx*.5;
    ctx.globalAlpha=.75*fade;const g=ctx.createRadialGradient(x,y-ry*.3,rx*.1,x,y,rx);g.addColorStop(0,'rgba(170,255,90,.5)');g.addColorStop(.6,'rgba(70,160,40,.32)');g.addColorStop(1,'rgba(40,90,20,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.283);ctx.fill();
    ctx.fillStyle='rgba(196,255,128,.32)';for(let i=0;i<(LQ()?3:5);i++){const a=S.t*.8+i*1.256+c.x*.1,rise=((S.t*14+i*7)%16)*z;ctx.beginPath();ctx.arc(x+Math.cos(a)*rx*.55,y-ry*.2+Math.sin(a)*ry*.45-rise,rx*.2*(1-rise/(20*z)),0,6.283);ctx.fill()}
    ctx.strokeStyle='rgba(166,255,74,.7)';ctx.lineWidth=1.4;ctx.setLineDash([5,5]);ctx.lineDashOffset=-S.t*12;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.283);ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0}
  ctx.globalAlpha=1;
  // mist puffs: a dark core for contrast on bright ground, then an additive glow
  for(const p of S.mist){const z=sc(p.y)*K,x=px(p.x,p.y),y=py(p.y)-8*z,r=p.r*z*(p.mult>1?1.3:1);ctx.globalAlpha=Math.min(1,p.life*3)*.32;ctx.fillStyle='#2f6a12';ctx.beginPath();ctx.ellipse(x,y,r*.8,r*.6,0,0,6.283);ctx.fill()}
  ctx.globalCompositeOperation='lighter';
  for(const p of S.mist){const z=sc(p.y)*K,x=px(p.x,p.y),y=py(p.y)-8*z,r=p.r*z*1.6*(p.mult>1?1.3:1);ctx.globalAlpha=Math.min(1,p.life*3)*(p.pl?.6:.8);ctx.drawImage(glowSprite(p.mult>1?'rgb(225,255,90)':'rgb(110,255,60)'),x-r,y-r*.8,r*2,r*1.6)}
  ctx.globalAlpha=1;
  // links: contagion (green) and nanite jumps (silver)
  ctx.lineWidth=2;for(const l of S.toxLinks){const a=l.life/.3,mx=(l.x1+l.x2)/2,my=Math.min(l.y1,l.y2)-24;ctx.strokeStyle=l.nano?`rgba(220,232,245,${a})`:`rgba(160,255,80,${a})`;ctx.beginPath();ctx.moveTo(px(l.x1,l.y1),py(l.y1)-8);ctx.quadraticCurveTo(px(mx,my),py(my),px(l.x2,l.y2),py(l.y2)-8);ctx.stroke()}
  // darts
  for(const d of S.darts){const z=sc(d.y)*K,x=px(d.x,d.y),y=py(d.y)-8*z,a=Math.atan2(d.vy,d.vx),col=d.goo?'rgb(210,225,240)':'rgb(190,255,90)';
    ctx.drawImage(glowSprite(col),x-9*z,y-9*z,18*z,18*z);ctx.strokeStyle=d.goo?'#eef4ff':'#e8ffb0';ctx.lineWidth=2.4*z;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-Math.cos(a)*14*z,y-Math.sin(a)*14*z);ctx.stroke()}
  ctx.globalCompositeOperation='source-over';
  // pods in flight
  for(const s2 of S.pods){const t=s2.t/s2.dur,x=s2.x0+(s2.x-s2.x0)*t,y=s2.y0+(s2.y-s2.y0)*t,z=sc(y)*K,arc=Math.sin(t*Math.PI)*70*K;
    ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(px(x,y),py(y),5*z,2*z,0,0,6.283);ctx.fill();ctx.drawImage(coreSprite('#3f8a14','#e2ff8a'),px(x,y)-6*z,py(y)-arc-6*z,12*z,12*z)}
  // the poisoned keep: fumes along the wall and a stack counter
  if(S.ktox>0){const k=Math.min(1,S.ktox/30),z=sc(S.fy)*K;ctx.globalCompositeOperation='lighter';
    for(let i=0;i<(LQ()?4:9);i++){const ph=(S.t*.45+i*.113)%1,cyc=Math.floor(S.t*.45+i*.113),xx=50+((i*97+cyc*53)%300),r=(10+ph*20)*z;ctx.globalAlpha=(1-ph)*.5*(.35+.65*k);ctx.drawImage(glowSprite('rgb(120,255,60)'),px(xx,S.fy)-r,py(S.fy)-ph*70*z-r,r*2,r*2)}
    ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
    const t=`☣ ${Math.round(S.ktox)}${S.kpot>1?' ×'+fmt(S.kpot):''}${S.kgoo||has('pandemic')?' ∞':''}${S.ktoxDps>0?'  '+fmt(S.ktoxDps)+'/s':''}`,fs=Math.max(11,12*z),ly=py(S.fy)+30*z;ctx.font=`800 ${fs}px Orbitron,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.strokeStyle='rgba(4,10,2,.9)';
    ctx.strokeText(t,px(200,S.fy),ly);ctx.fillStyle='#b6ff5a';ctx.fillText(t,px(200,S.fy),ly)}
  // stack count on brutes and elites
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(const e of S.enemies){if(!(e.tox>0)||!(e.brute||e.elite)||e.w<=0)continue;const z=sc(e.y)*K,r=radius(e.w,e.brute)*z,x=px(e.x,e.y)+r*1.6,y=py(e.y)-r*(e.elite?4.6:2.6),fs=Math.max(9,10*z),t='☣'+Math.round(e.tox);
    ctx.font=`800 ${fs}px "Barlow Condensed",sans-serif`;ctx.lineWidth=3;ctx.strokeStyle='rgba(4,10,2,.9)';ctx.strokeText(t,x,y);ctx.fillStyle='#b6ff5a';ctx.fillText(t,x,y)}
}
