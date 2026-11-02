// ---------- keep conditions: each keep rolls a layout plus one or two conditions that change how it plays ----------
const LAYN={intro:'Training Gate',choice:'Crossroads',movers:'Sliding Gates',gauntlet:'Gauntlet',zigzag:'Zigzag',gamble:'High Roller',fortified:'Fortified',scatter:'Scatterfield',stairs:'Grand Gatekeep'};
const MODS={
  wind:{n:'Crosswind',d:'Gusts shove you, your shots and the horde sideways. Watch for the arrows.',from:2,pl:['dune','void']},
  ice:{n:'Black Ice',d:'The causeway is frozen. Your ride slides and takes time to stop.',from:2,pl:['cryo']},
  rifts:{n:'Lava Rifts',d:'Cracks glow, then erupt across the road. Everything caught in them burns.',from:3,pl:['magmus']},
  mines:{n:'Minefield',d:'Enemy mines litter the field. Your shots set them off. Your hull should not.',from:2,pl:['verdant','dune']},
  blackout:{n:'Blackout',d:'The lights are out. You only see near your ride, but enemy fire still glows.',from:4,pl:['void','arcadia']},
  shifting:{n:'Shifting Gates',d:'Every 7 seconds the gates jump to new places.',from:2,pl:['arcadia']},
  barrier:{n:'Barrier Wall',d:'A sliding energy wall guards the keep and eats your shots. Fire through the gap.',from:3,pl:['arcadia','cryo']},
  meteors:{n:'Meteor Shower',d:'Rocks fall on marked spots. They crush minions too, so lure them in.',from:3,pl:['void','magmus','dune']},
  bounty:{n:'Bounty Courier',d:'A courier carrying coins runs the field for 25 seconds. Catch it for a payout.',from:2,pl:[]},
  twin:{n:'Twin Keeps',d:'The keep is split in two. Breach both halves. The gap between them eats shots.',from:3,pl:[],noboss:1},
  regen:{n:'Rebuilding Keep',d:'The keep repairs itself whenever you stop hitting it for 2 seconds.',from:4,pl:['verdant'],noboss:1},
};
const hasMod=id=>!!(S&&S.mods&&S.mods.includes(id));
function pickMods(L,lv,bm){
  if(L===1||!((META.rec&&META.rec.runs)>=1))return[];const n=lv.boss?(Math.random()<.5?1:0):L>=8&&Math.random()<.5?2:1,out=[],prev=R.lastMods||[];
  for(let k2=0;k2<n;k2++){
    const pool=Object.entries(MODS).filter(([id,m])=>L>=m.from&&!out.includes(id)&&!(lv.boss&&m.noboss)&&!(lv.wall&&(id==='barrier'||id==='twin'))&&!(out.includes('twin')&&id==='regen')&&!(out.includes('regen')&&id==='twin'));
    if(!pool.length)break;
    const w=pool.map(([id,m])=>(m.pl.includes(bm.id)?3:1)*(prev.includes(id)?.25:1));let r=Math.random()*w.reduce((a,b)=>a+b,0),i=0;while(i<w.length-1&&r>w[i]){r-=w[i];i++}out.push(pool[i][0])}
  R.lastMods=out;return out;
}
function newMine(){const c=S.cannon;let m;for(let i=0;i<8;i++){m={x:40+Math.random()*320,y:S.fy+110+Math.random()*Math.max(40,Y_MAX-S.fy-170),arm:.6};if(Math.hypot(m.x-c.x,m.y-c.y)>70)break}return m}
function modsInit(){
  const md=S.md={rifts:[],met:[]};
  if(hasMod('mines')){md.mines=[];md.mineN=10+Math.min(10,S.L);for(let i=0;i<md.mineN;i++)md.mines.push(newMine())}
  if(hasMod('twin'))S.twin={l:S.baseHP/2,r:S.baseHP/2};
  if(hasMod('barrier'))md.bar={w:150,ph:Math.random()*6,x:200,y:S.fy+75};
  if(hasMod('bounty'))md.bountyT=5;
}
function liveTur(){return S.twin?TUR.filter(x=>x<200?S.twin.l>0:S.twin.r>0):TUR}
function hitKeep(dmg,x){
  S.lastKeepHit=S.t;
  if(S.twin){if(Math.abs(x-200)<22)return 0;const s=x<200?'l':'r';if(!(S.twin[s]>0))return 0;S.twin[s]-=dmg;S.baseHP=Math.max(0,S.twin.l)+Math.max(0,S.twin.r);
    if(!(S.twin[s]>0)&&!S.twin[s+'D']){S.twin[s+'D']=1;sfxText(s==='l'?110:290,S.fy+30,'HALF DOWN!','#ffcf2e',1);S.shake=Math.max(S.shake||0,10)}return dmg}
  S.baseHP-=dmg;return dmg;
}
function modsTick(dt){
  if(!S.mods||!S.mods.length)return;const c=S.cannon,md=S.md,st=S.st;
  if(hasMod('wind')){md.wt=(md.wt??5)-dt;
    if(md.wt<=0){if(md.wp==='warn'){md.wp='gust';md.wt=2.6}else if(md.wp==='gust'){md.wp='';md.wt=5+Math.random()*3}else{md.wp='warn';md.wt=1.2;md.wdir=Math.random()<.5?-1:1;cue('charge')}}
    if(md.wp==='gust'){const v=md.wdir*dt;c.x=clamp(c.x+v*85,26,374);c.tx=clamp(c.tx+v*85,26,374);for(const u of S.players)u.x+=v*120;for(const e of S.enemies)if(!e.elite&&!e.pylon)e.x+=v*60;for(const b of S.bul)if(!b.hard)b.x+=v*70}}
  if(hasMod('rifts')){md.rt=(md.rt??3)-dt;
    if(md.rt<=0){md.rt=Math.max(3,5.5-.1*S.L);const y=clamp((Math.random()<.5?c.y:S.fy+100+Math.random()*(Y_MAX-S.fy-120))+(Math.random()-.5)*40,S.fy+70,Y_MAX-10);md.rifts.push({y,t:0,warn:1.3,dur:1.4})}
    for(const r of md.rifts){r.t+=dt;if(r.t>r.warn&&r.t<r.warn+r.dur){if(Math.abs(c.y-r.y)<12+st.V.hit*.5)hitPlayer(bulletDmg()*1.3,'rift');
      for(const u of S.players)if(!u.big&&Math.abs(u.y-r.y)<10)u.w=0;DTY='fire';WCL='';for(const e of S.enemies)if(e.w>0&&!e.elite&&!e.pylon&&Math.abs(e.y-r.y)<10)hurt(e,e.w*3,0)}}
    md.rifts=md.rifts.filter(r=>r.t<r.warn+r.dur)}
  if(md.mines){for(const m of md.mines){m.arm-=dt;if(m.arm>0)continue;
      if(Math.hypot(m.x-c.x,m.y-c.y)<10+st.V.hit){m.gone=1;hitPlayer(bulletDmg()*2,'mine');S.booms.push({x:m.x,y:m.y,r:36,life:.35});sfxText(m.x,m.y-10,'BOOM!','#ff6a3a',1);continue}
      for(const u of S.players){if((u.x-m.x)**2+(u.y-m.y)**2<144){m.gone=1;u.w=0;S.booms.push({x:m.x,y:m.y,r:30,life:.3});blip(70,.15,'sawtooth',.05);break}}}
    md.mines=md.mines.filter(m=>!m.gone);md.mt=(md.mt??6)-dt;if(md.mt<=0){md.mt=6;if(md.mines.length<md.mineN)md.mines.push(newMine())}}
  if(hasMod('shifting')){md.sh=(md.sh??7)-dt;
    if(md.sh<1&&!md.sw){md.sw=1;for(const g of S.lv.gates)if(!g.dead&&!g.follow)g.flash=Math.max(g.flash,.6)}
    if(md.sh<=0){md.sh=7;md.sw=0;for(const g of S.lv.gates){if(g.dead||g.follow)continue;const w=g.x2-g.x1,nx=30+Math.random()*Math.max(1,340-w);g.x1=nx;g.x2=nx+w}sfxText(200,S.fy+220,'SHIFT!','#ffb43a',1);cue('charge')}}
  if(md.bar){const b=md.bar;b.ph+=dt*(.7+.03*S.L);b.x=200+Math.sin(b.ph)*(174-b.w/2);b.y=S.fy+75;
    for(const u of S.players){if(!u.big&&u.w>0&&u.py>b.y&&u.y<=b.y&&Math.abs(u.x-b.x)<b.w/2){u.w=0;if(Math.random()<.15)spark(u.x,b.y,'#ff5a7a',1)}}}
  if(hasMod('meteors')){md.mt2=(md.mt2??3)-dt;
    if(md.mt2<=0){md.mt2=Math.max(1.6,3.4-.08*S.L);const near=Math.random()<.45,x=near?clamp(c.x+(Math.random()-.5)*80,36,364):36+Math.random()*328,y=near?clamp(c.y+(Math.random()-.5)*60,S.fy+60,Y_MAX):S.fy+70+Math.random()*(Y_MAX-S.fy-80);md.met.push({x,y,t:0,dur:1.6})}
    for(const m of md.met){m.t+=dt;if(m.t>=m.dur&&!m.done){m.done=1;S.booms.push({x:m.x,y:m.y,r:42,life:.4});S.shake=Math.max(S.shake||0,6);playS('crunch',.7)||blip(50,.3,'sawtooth',.07);sfxText(m.x,m.y-12,'KRAK!','#ffb43a');
      if(Math.hypot(c.x-m.x,c.y-m.y)<36+st.V.hit*.5)hitPlayer(bulletDmg()*1.8,'meteor');for(const u of S.players)if(!u.big&&(u.x-m.x)**2+(u.y-m.y)**2<36*36)u.w=0;
      DTY='exp';WCL='';for(const e of S.enemies)if(e.w>0&&!e.pylon&&(e.x-m.x)**2+(e.y-m.y)**2<(40+radius(e.w,e.brute))**2)hurt(e,e.elite?e.max*.15:e.w*3,0)}}
    md.met=md.met.filter(m=>!m.done)}
  if(md.bountyT!=null){md.bountyT-=dt;if(md.bountyT<=0){md.bountyT=null;const e=spawnEnemy(200,S.fy+30,waveB()*5,false,'');if(e){e.courier={t:25,tx:200,ty:S.fy+150,re:0};guide('courier');e.sp=95;toast('A bounty courier is running! Catch it!',2000,3);cue('newfoe')}}}
  if(hasMod('regen')){if(S.t-(S.lastKeepHit??-9)>2&&S.baseHP<S.baseMax&&S.baseHP>0){S.baseHP=Math.min(S.baseMax,S.baseHP+S.baseMax*.012*dt);S.regenOn=1}else S.regenOn=0}
}
function courierTick(e,dt){
  const C=e.courier,c=S.cannon;C.t-=dt;C.re-=dt;e.wob+=dt*8;
  if(C.re<=0){C.re=.8+Math.random();C.tx=36+Math.random()*328;C.ty=S.fy+70+Math.random()*Math.max(40,Y_MAX-S.fy-160);if(Math.hypot(C.tx-c.x,C.ty-c.y)<120)C.tx=400-C.tx}
  const slow=e.slowT>0?.6:1;if(e.slowT>0)e.slowT-=dt;
  const dx=C.tx-e.x,dy=C.ty-e.y,d=Math.hypot(dx,dy)||1,m=e.sp*dt*slow;if(d>m){e.x+=dx/d*m;e.y+=dy/d*m}
  e.x=clamp(e.x,30,370);if(C.t<=0&&!e.dead){e.w=0;e.dead=true;toast('The courier escaped',1400,1)}
}
function drawModsGround(K){
  if(!S.mods||!S.mods.length||!S.md)return;const md=S.md;
  for(const r of md.rifts){const on=r.t>r.warn,p=Math.min(1,r.t/r.warn),z=sc(r.y)*K;
    if(!on){ctx.strokeStyle=`rgba(255,120,40,${.3+.55*p*(.5+.5*Math.sin(S.t*20))})`;ctx.lineWidth=2.2*z;ctx.beginPath();for(let x=26,i=0;x<=374;x+=14,i++){const yy=r.y+(i%2?-3:3);i?ctx.lineTo(px(x,yy),py(yy)):ctx.moveTo(px(x,yy),py(yy))}ctx.stroke()}
    else{const gr=ctx.createLinearGradient(0,py(r.y-12),0,py(r.y+12));gr.addColorStop(0,'rgba(255,90,20,0)');gr.addColorStop(.5,'rgba(255,210,90,.95)');gr.addColorStop(1,'rgba(255,90,20,0)');quad(26,r.y-12,374,r.y+12,gr);if(Math.random()<.6)spark(30+Math.random()*340,r.y,'#ffb02e',1)}}
  if(md.mines)for(const m of md.mines){const z=sc(m.y)*K*1.7,x=px(m.x,m.y),y=py(m.y);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y+1*z,8*z,3*z,0,0,6.283);ctx.fill();
    ctx.strokeStyle='#18181e';ctx.lineWidth=1.8*z;ctx.beginPath();for(let i=0;i<6;i++){const a=i*1.047;ctx.moveTo(x+Math.cos(a)*5*z,y-2*z+Math.sin(a)*3*z);ctx.lineTo(x+Math.cos(a)*9*z,y-2*z+Math.sin(a)*5*z)}ctx.stroke();
    sph(ctx,x,y-2*z,6*z,'#3a3a40',4*z);if(m.arm<=0&&Math.sin(S.t*8+m.x)>0)glowDot(ctx,x,y-4*z,1.7*z,'#ff3030')}
  if(md.bar){const b=md.bar,z=sc(b.y)*K,y=py(b.y),x1=px(b.x-b.w/2,b.y),x2=px(b.x+b.w/2,b.y),h=24*z;
    ctx.fillStyle=`rgba(255,50,90,${.32+.1*Math.sin(S.t*10)})`;ctx.fillRect(x1,y-h,x2-x1,h);ctx.fillStyle='rgba(255,200,220,.28)';for(let i=0;i<5;i++)ctx.fillRect(x1,y-h+((S.t*30*z+i*h/5)%h),x2-x1,Math.max(1,z));
    ctx.strokeStyle='rgba(255,140,170,.95)';ctx.lineWidth=2;ctx.strokeRect(x1,y-h,x2-x1,h);for(const ex of [x1,x2])cylG(ctx,ex-3.5*z,y-h-6*z,7*z,h+7*z,'#4a3038')}
  for(const m of md.met){const p=m.t/m.dur,z=sc(m.y)*K,x=px(m.x,m.y),y=py(m.y);
    if(!dspr('xhair',null,x,y,72*z,28*z,0,.4+.6*p)){ctx.strokeStyle=`rgba(255,170,60,${.4+.6*p})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,36*z,13*z,0,0,6.283);ctx.stroke()}ctx.fillStyle=`rgba(255,120,40,${.1+.25*p})`;ctx.beginPath();ctx.ellipse(x,y,36*z*p,13*z*p,0,0,6.283);ctx.fill();
    const fy2=y-(1-p)*H*.6,fx=x+(1-p)*70;ctx.strokeStyle='rgba(255,170,80,.55)';ctx.lineWidth=6*z;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(fx+40,fy2-70);ctx.lineTo(fx,fy2);ctx.stroke();ctx.lineCap='butt';if(!(FXOK()&&dspr('fire_01','#ff7a2a',fx+8*z,fy2-12*z,22*z,30*z,-.5,.8,1)&&dspr(m.k||(m.k=rnd(['metB1','metB3','metG1','metG4'])),null,fx,fy2,22*z+4,22*z+4,S.t*3+m.x))){sph(ctx,fx,fy2,8*z+2,'#5a4030');glowDot(ctx,fx,fy2+3*z,4*z,'#ff8a3a')}}
  if(md.wp){const dir=md.wdir,gust=md.wp==='gust';ctx.save();
    if(gust){ctx.globalAlpha=.45;ctx.fillStyle='#e8dcc8';for(let i=0;i<34;i++){const yy=(i*67.3)%H,xx=(((i*131+S.t*900*dir)%(W+200))+W+200)%(W+200)-100;ctx.fillRect(xx,yy,40+(i%3)*24,1.5)}}
    else{ctx.globalAlpha=.4+.4*Math.sin(S.t*14);ctx.fillStyle='#ffb43a';ctx.font=`900 ${Math.min(44,W*.11)}px Orbitron,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=5;ctx.strokeStyle='#000';const t=dir>0?'>>>  WIND  >>>':'<<<  WIND  <<<';ctx.strokeText(t,W/2,H*.56);ctx.fillText(t,W/2,H*.56)}
    ctx.restore()}
}
function drawKeepOverlay(K){
  const fy=S.fy,z=sc(fy)*K,y0=py(fy),yT=py(-40);
  if(S.twin){const gx1=px(178,fy),gx2=px(222,fy);ctx.fillStyle='#030406';ctx.beginPath();ctx.moveTo(gx1,yT-50*z);for(let i=0;i<=6;i++){const yy=yT-50*z+(y0-yT+50*z)*i/6;ctx.lineTo(gx1+(i%2?4:-2)*z,yy)}ctx.lineTo(gx2+(2)*z,y0);for(let i=6;i>=0;i--){const yy=yT-50*z+(y0-yT+50*z)*i/6;ctx.lineTo(gx2+(i%2?-4:2)*z,yy)}ctx.closePath();ctx.fill();
    for(const s of ['l','r']){const xa=s==='l'?px(26,fy):gx2,xb=s==='l'?gx1:px(374,fy);
      if(!(S.twin[s]>0)){ctx.fillStyle='rgba(8,6,6,.62)';ctx.fillRect(xa,yT-40*z,xb-xa,y0-yT+40*z);if(Math.random()<.3&&S.sparks.length<240)S.sparks.push({x:unX((xa+xb)/2+(Math.random()-.5)*(xb-xa),fy),y:fy-4,vx:0,vy:-25,life:.9,c:'rgba(60,50,55,.55)',smoke:1})}
      const p=Math.max(0,S.twin[s])/(S.baseMax/2),bw=(xb-xa)*.7,bx=(xa+xb)/2-bw/2,by=yT-58*z;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(bx-1,by-1,bw+2,5*z+2);ctx.fillStyle='#ff3b4e';ctx.fillRect(bx,by,bw*p,5*z)}}
  if(S.regenOn){ctx.fillStyle=`rgba(80,255,140,${.1+.08*Math.sin(S.t*8)})`;ctx.fillRect(px(26,fy),yT,px(374,fy)-px(26,fy),y0-yT);ctx.font=`800 ${Math.max(10,11*z)}px Orbitron,sans-serif`;ctx.textAlign='center';ctx.textBaseline='bottom';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText('REBUILDING',px(200,fy),yT-4);ctx.fillStyle='#7dffb0';ctx.fillText('REBUILDING',px(200,fy),yT-4)}
}
let DARK=null;
function drawBlackout(){
  if(!hasMod('blackout')||S.over)return;const cw=Math.round(W*DPR),ch=Math.round(H*DPR);if(!DARK||DARK.width!==cw||DARK.height!==ch)DARK=mk(cw,ch);
  const g=DARK.getContext('2d');if(!g||!g.setTransform)return;g.setTransform(DPR,0,0,DPR,0,0);g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle='rgba(2,3,8,.9)';g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
  const hole=(x,y,r,a)=>{if(!(r>1))return;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(0,0,0,${a})`);gr.addColorStop(.6,`rgba(0,0,0,${a*.8})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)};
  const c=S.cannon,K=k();hole(px(c.x,c.y),py(c.y)-10,160*sc(c.y)*K,1);
  g.save();g.translate(px(200,S.fy),py(S.fy));g.rotate(Math.sin(S.t*.8)*.6);const sl=g.createLinearGradient(0,0,0,H);sl.addColorStop(0,'rgba(0,0,0,.85)');sl.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=sl;g.beginPath();g.moveTo(-8,0);g.lineTo(8,0);g.lineTo(95,H*.75);g.lineTo(-95,H*.75);g.closePath();g.fill();g.restore();
  for(const b of S.booms)hole(px(b.x,b.y),py(b.y),b.r*2.4*sc(b.y)*K,.9);
  for(const q of S.sent)hole(px(q.x,q.y),py(q.y),70*sc(q.y)*K,.6);
  hole(px(200,S.fy),py(S.fy)-10,gw*.45,.45);
  ctx.drawImage(DARK,0,0,W,H);
}
