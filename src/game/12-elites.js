// ---------- elites: enemy champions that fly the same rides you do ----------
const ELK={cannon:{n:'Gunship',sp:105,from:1},jet:{n:'Interceptor',sp:185,from:2},robot:{n:'Sawmech',sp:72,from:2},tank:{n:'Siege Tank',sp:55,from:3},saucer:{n:'Lancer',sp:115,from:4},hive:{n:'Broodcarrier',sp:80,from:4}};
function waveB(){return 12*Math.pow(2.15,S.L-1)*(1+S.t/35)}
function turX(x){return 200+(x-200)*(S.fw||174)/174}
function shieldMul(){return S.shieldUp?.15:1}
function spawnElite(kind,mult){if(S&&S.running!==false)guide('elite');
  const L=S.L;if(!kind){const pool=Object.keys(ELK).filter(k=>L>=ELK[k].from);kind=rnd(pool)}
  const hp=waveB()*(L===1?5:L===2?8:11)*(mult||1);
  const e=spawnEnemy(60+Math.random()*280,S.fy+16,hp,true,'');if(!e||e.max!==hp)return;
  e.elite={k:kind,name:fac().short+' '+ELK[kind].n,tx:e.x,ty:S.fy+120,re:0,t:0,hold:0,saw:0};
  e.sp=ELK[kind].sp*(1+.02*L);
  cutIn({small:1,y:.205,title:e.elite.name.toUpperCase(),sub:'Elite challenger',col:fac().glow,portrait:portraitVeh(kind,fac().pal,fac().glow,1),dur:1.3});hitStop(.08);cue('newfoe');S.shake=Math.max(S.shake||0,5);
}
function eliteSpawnTick(dt){
  if(S.lv.boss)return;
  S.eliteT-=dt;if(S.eliteT>0)return;
  S.eliteT=Math.max(13,27-S.L)*(.8+Math.random()*.4);
  const alive=S.enemies.filter(e=>e.elite&&e.w>0).length;
  if(alive<1+Math.floor(S.L/5))spawnElite();
}
function eliteTick(e,dt){
  const E=e.elite,c=S.cannon,L=S.L,st=S.st,r=radius(e.w,true),bd=bulletDmg();
  E.t+=dt;E.re-=dt;e.wob+=dt*6;
  const slow=e.slowT>0?1-[0,.3,.45,.6][st.cryo]:1;if(e.slowT>0)e.slowT-=dt;
  const yLo=S.fy+60,yHi=Math.max(yLo+40,Math.min(Y_MAX-150,c.y-110));
  if(E.re<=0){
    E.re=(E.k==='jet'?.8:1.3)+Math.random()*1.4;
    E.tx=E.k==='saucer'||E.k==='robot'?clamp(c.x+(Math.random()-.5)*90,36,364):36+Math.random()*328;
    E.ty=yLo+Math.random()*(yHi-yLo);
    if(E.k==='jet'&&Math.random()<.35)E.ty=Math.min(Y_MAX-60,c.y-30);   // strafing dive
    if(E.k==='robot')E.ty=Math.min(Y_MAX-80,c.y-70);                       // brawler: it comes for you
  }
  const ox=e.x;
  if(E.hold>0)E.hold-=dt;else{const dx=E.tx-e.x,dy=E.ty-e.y,d=Math.hypot(dx,dy),m=e.sp*dt*slow;if(d>m){e.x+=dx/d*m;e.y+=dy/d*m}else{e.x=E.tx;e.y=E.ty}}
  e.x=clamp(e.x,30,370);e.y=clamp(e.y,S.fy+40,Y_MAX-50);E.vx=(e.x-ox)/dt;
  E.cd=(E.cd??1.4)-dt;
  if(E.k==='cannon'){if(E.cd<=0){const nb=L<=2?4:L<=4?6:9,sp=Math.min(210,150+12*L);E.burst=(E.burst||0)+1;E.cd=E.burst%nb?.12:1.8;const a=aimAt(e.x,e.y)+(Math.random()-.5)*.1;addBullet(e.x,e.y+8,Math.cos(a)*sp,Math.sin(a)*sp,{col:0,r:4,dmg:bd*(L<=2?.6:.8)})}}
  else if(E.k==='jet'){if(E.cd<=0){E.cd=Math.max(1.4,2.4-.05*L);for(const s of[-1,1])addBullet(e.x+s*12,e.y,s*80,40,{r:6,home:2.6,life:5,col:4,hp:2})}}
  else if(E.k==='robot'){E.saw+=dt*4;
    for(let i=0;i<3;i++){const a=E.saw+i*2.094,sx=e.x+Math.cos(a)*30,sy=e.y+Math.sin(a)*24;
      if(c.inv<=0&&Math.hypot(sx-c.x,sy-c.y)<9+st.V.hit)hitPlayer(bd*1.3);
      for(const u of S.players)if(!u.big&&u.w>0&&(u.x-sx)**2+(u.y-sy)**2<121)u.w=0}
    if(E.cd<=0){E.cd=2.6;const a0=aimAt(e.x,e.y);for(let i=-2;i<=2;i++){const a=a0+i*.22;addBullet(e.x,e.y,Math.cos(a)*140,Math.sin(a)*140,{col:1})}}}
  else if(E.k==='tank'){if(E.cd<=0){E.cd=Math.max(1.7,2.7-.05*L);for(let i=0;i<2;i++){const tx=clamp(c.x+(i?(Math.random()-.5)*100:0),36,364),ty=clamp(c.y+(Math.random()-.5)*40,S.fy+60,Y_MAX);S.arts.push({x0:e.x,y0:e.y,x:tx,y:ty,t:0,dur:1.2})}}}
  else if(E.k==='saucer'){if(E.cd<=0){E.cd=Math.max(2,3.2-.06*L);E.hold=1.4;cue('laser');S.lasers.push({x:e.x,y0:e.y+10,t:0,warn:.85,dur:.5,w:14+L*.5})}}
  else if(E.k==='hive'){if(E.cd<=0){E.cd=3.4;for(let i=0;i<3;i++)spawnEnemy(e.x+(i-1)*14,e.y+12,waveB()*.3,false,'runner');
    const off=Math.random();for(let i=0;i<10;i++){const a=(i+off)/10*6.283;addBullet(e.x,e.y,Math.cos(a)*100,Math.sin(a)*100+30,{col:2,hard:1,r:4})}}}
  if(Math.hypot(e.x-c.x,e.y-c.y)<r+st.V.hit+2)hitPlayer(bd*1.5);
}
// carrier boss drones: they drop down the side lanes, then sweep across at your height
function droneTick(e,dt){
  const D=e.dr,c=S.cannon;e.wob+=dt*6;
  if(D.ph===0){e.y+=160*dt;e.x+=((D.side<0?34:366)-e.x)*4*dt;if(e.y>=D.ty)D.ph=1}
  else{e.x-=D.side*125*dt;e.y+=Math.sin(e.wob*.5)*25*dt;D.cd-=dt;
    if(D.cd<=0){D.cd=1.1;const a=aimAt(e.x,e.y);addBullet(e.x,e.y,Math.cos(a)*170,Math.sin(a)*170,{col:5,r:4})}
    if((D.side<0&&e.x>372)||(D.side>0&&e.x<28)){e.w=0;e.dead=true}}
  if(Math.hypot(e.x-c.x,e.y-c.y)<8+S.st.V.hit){hitPlayer(bulletDmg()*.8);e.w=0;e.dead=true;spark(e.x,e.y,'#ff5050',6)}
}
// shield boss pylons: while either stands, the keep shrugs off 85% of damage
function spawnPylons(){for(const x of [64,336]){const e=spawnEnemy(x,S.fy+110,waveB()*12,true,'');if(e)e.pylon={x,off:110,cd:2+Math.random()}}}
function pylonTick(e,dt){
  const P=e.pylon;e.wob+=dt*2;e.x=P.x;e.y=Math.min(S.fy+P.off,Y_MAX-40);P.cd-=dt;
  if(P.cd<=0){P.cd=3.2;const off=Math.random();for(let i=0;i<9;i++){const a=(i+off)/9*6.283;if(Math.sin(a)<-.3)continue;addBullet(e.x,e.y,Math.cos(a)*90,Math.abs(Math.sin(a))*90+20,{col:2,r:4})}}
}
const MECH={pulse:{n:'Pulse Citadel',short:'It shrinks and swells. Aim for the middle!',tip:'It shrinks and swells as it creeps. Blobs that miss it are wasted, so aim for the middle.'},
  carrier:{n:'Carrier Citadel',short:'Its drones sweep both side lanes!',tip:'It launches drones down both side lanes that sweep across at your height.'},
  shield:{n:'Aegis Citadel',short:'Break both shield pylons first!',tip:'Two shield pylons cut its damage by 85%. Destroy them first, and they rebuild.'}};
function bossTick(dt){
  if(!S.lv.boss){S.fw=174;S.shieldUp=false;return}
  const L=S.L,c=S.cannon;
  if(S.mech==='pulse'){const P=8,p=(S.t%P)/P;let f=p<.5?1:p<.6?1-(p-.5)/.1:p<.88?0:(p-.88)/.12;f=f*f*(3-2*f);S.fw=72+102*f;
    if(p>=.88&&!S.grew){S.grew=1;S.shake=Math.max(S.shake||0,8);blip(70,.3,'sawtooth',.07);
      const gap=60+Math.random()*280;for(let i=0;i<24;i++){const x=36+i*14;if(Math.abs(x-gap)<32)continue;addBullet(x,S.fy+10,(x-200)*.22,95+L*2,{col:2,hard:i%3===0,r:4})}}
    if(p<.88)S.grew=0;
  }else S.fw=174;
  if(S.mech==='carrier'){S.dronT=(S.dronT??2)-dt;if(S.dronT<=0){S.dronT=Math.max(2.4,4.6-.08*L);
    for(const side of[-1,1])for(let i=0;i<2;i++){const e=spawnEnemy(side<0?34:366,S.fy+10-i*18,waveB()*.7,false,'');if(e)e.dr={side,ph:0,ty:clamp(c.y-30+(Math.random()-.5)*120,S.fy+90,Y_MAX-40),cd:.5+i*.35}}}}
  if(S.mech==='shield'){const up=S.enemies.some(e=>e.pylon&&e.w>0);
    if(S.shieldUp&&!up){toast('Shield down! Hit the keep now',2000,3);cue('taken')}
    S.shieldUp=up;if(!up){S.pylonT=(S.pylonT||0)+dt;if(S.pylonT>18){S.pylonT=0;spawnPylons();toast('The keep rebuilds its shield pylons',1800,2)}}}
  if(!S.summoned&&S.baseHP/S.baseMax<.5){S.summoned=1;spawnElite(null,1.5);toast('The Grand Gatekeep calls a champion!',1800,2)}
}
