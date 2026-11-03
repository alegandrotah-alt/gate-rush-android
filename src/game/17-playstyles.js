// ---------- playstyles: close range, long range, engineer ----------
// Close range = within 150 of the keep's wall (the orange band). Long range = behind the cyan line, 290+ from the wall.
const CLOSE_D=190,LONG_D=330;
let WCL='';
const WCLS={orbit:'close',flame:'close',shield:'close',tesla:'close',boomer:'close',zap:'long',bomb:'long',missile:'long',laser:'long',rail:'long',drones:'eng',mines:'eng',sentry:'eng',vortex:'long',prism:'long',blade:'close'};
const PCLS={gravity:'close',absorb:'close',burn:'close',channel:'long',ricochet:'long',echo:'long',kami:'eng',wing:'eng',hair:'',volatile:'',cryo:'',overdrive:'',phase:'',gatelord:''};
const CLN={close:'Close range',long:'Long range',eng:'Engineer'},CLC={close:'#ffa050',long:'#5fe1ff',eng:'#7dffb0'};
function clsMul(){let m=1;
  if(WCL==='close'){if(S.zone==='close')m*=1.35}
  else if(WCL==='long'){if(S.zone==='long')m*=1.25*(has('scope')?val('scope'):1);if(DTY==='exp'&&has('artillery'))m*=val('artillery')}
  else if(WCL==='eng'){if(has('servos'))m*=val('servos')}
  if(S.swT>0&&has('switch'))m*=1+val('switch');
  return m}
// close-range lifesteal ignores the repair budget, but is capped per second
function leech(a){const c=S.cannon,h=Math.min(a,S.leechB||0,S.st.maxHp-c.hp);if(h>0){c.hp+=h;S.leechB-=h;R.leeched=(R.leeched||0)+h;if(R.leeched>=500)award('leech')}}
function sentryTick(dt,W){
  const st=S.st,c=S.cannon,P=W.P,E=W.E;DTY='kin';WCL='eng';
  for(const q of S.sent){q.t-=dt;q.cd-=dt;
    if(q.cd<=0){let best=null,bd=230*230;for(const e of S.enemies){if(e.w<=0)continue;const d=(e.x-q.x)**2+(e.y-q.y)**2;if(d<bd){bd=d;best=e}}
      const dmg=(.45+.25*st.sentry)*P*(st.fortress?E:1);
      if(best){q.cd=(st.fortress?.18:.38)*W.CD;for(let i=0;i<(st.fortress?2:1);i++)hurt(best,dmg,2);S.tracers.push({x1:q.x,y1:q.y-10,x2:best.x,y2:best.y,life:.08});q.aim=Math.atan2(best.y-q.y,best.x-q.x)}
      else if(q.y-S.fy<240){q.cd=.4*W.CD;fortMelee(dmg*.6);S.tracers.push({x1:q.x,y1:q.y-10,x2:q.x+(Math.random()-.5)*40,y2:S.fy,life:.08});q.aim=-Math.PI/2}
      else q.cd=.2}
    for(const b of S.bul){if(b.life>0&&!b.hard&&(b.x-q.x)**2+(b.y-q.y)**2<(13+b.r)**2){killBullet(b);spark(b.x,b.y,'#7dffb0',2);if(--q.hp<=0){q.t=0;break}}}
    if(q.t<=0&&q.re){q.re=0;q.t=12;q.hp=6;sfxText(q.x,q.y-20,'REBUILD!','#7dffb0')}}
  S.sent=S.sent.filter(q=>q.t>0);
  for(const t of S.tracers)t.life-=dt;S.tracers=S.tracers.filter(t=>t.life>0);
  if(has('rally')&&S.sent.some(q=>(q.x-c.x)**2+(q.y-c.y)**2<70*70))heal(val('rally')*st.maxHp*dt);
  if(has('orbital')){S.orbT=(S.orbT??4)-dt;if(S.orbT<=0){S.orbT=9;const d=densest(),x=d?d.x:200,y=d?d.y:S.fy+20;S.orbs.push({x,y,life:.7});DTY='nrg';WCL='long';
    for(const e of S.enemies){if(e.w>0&&(e.x-x)**2+(e.y-y)**2<(70+radius(e.w,e.brute))**2)hurt(e,P*30,2)}fortMelee(P*40);S.shake=Math.max(S.shake||0,8);sfxText(x,y-20,'ORBITAL!','#5fe1ff',1);blip(60,.4,'sawtooth',.07)}}
  for(const o of S.orbs)o.life-=dt;S.orbs=S.orbs.filter(o=>o.life>0);
}
function drawZones(K){
  const y0=S.fy+40,y1=Math.min(Y_MAX,S.fy+CLOSE_D),y2=S.fy+LONG_D,inC=S.zone==='close',inL=S.zone==='long';
  const gr=ctx.createLinearGradient(0,py(y0),0,py(y1));gr.addColorStop(0,`rgba(255,120,40,${inC?.2:.1})`);gr.addColorStop(1,'rgba(255,120,40,0)');quad(26,y0,374,y1,gr);
  ctx.fillStyle=`rgba(255,150,60,${inC?.65:.32})`;
  for(let i=0;i<4;i++){const yy=y0+22+i*34;if(yy>y1-10)break;for(const ex of [42,358]){const z=sc(yy)*K,x=px(ex,yy),y=py(yy);ctx.beginPath();ctx.moveTo(x-6*z,y+3*z);ctx.lineTo(x,y-3*z);ctx.lineTo(x+6*z,y+3*z);ctx.lineTo(x+6*z,y+6*z);ctx.lineTo(x,y);ctx.lineTo(x-6*z,y+6*z);ctx.closePath();ctx.fill()}}
  ctx.setLineDash([8,6]);ctx.lineWidth=1.8;ctx.strokeStyle=`rgba(255,140,50,${inC?.95:.55})`;ctx.beginPath();ctx.moveTo(px(26,y1),py(y1));ctx.lineTo(px(374,y1),py(y1));ctx.stroke();
  if(y2<Y_MAX-10){ctx.strokeStyle=`rgba(95,225,255,${inL?.9:.4})`;ctx.beginPath();ctx.moveTo(px(26,y2),py(y2));ctx.lineTo(px(374,y2),py(y2));ctx.stroke()}ctx.setLineDash([]);
  const fs=Math.max(9,10*sc(y1)*K);ctx.font=`800 ${fs}px Orbitron,sans-serif`;ctx.textAlign='right';ctx.textBaseline='bottom';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.7)';
  ctx.strokeText('CLOSE RANGE ▲',px(370,y1),py(y1)-3);ctx.fillStyle=`rgba(255,170,90,${inC?1:.7})`;ctx.fillText('CLOSE RANGE ▲',px(370,y1),py(y1)-3);
  if(y2<Y_MAX-10){ctx.textBaseline='top';ctx.strokeText('LONG RANGE ▼',px(370,y2),py(y2)+3);ctx.fillStyle=`rgba(95,225,255,${inL?1:.65})`;ctx.fillText('LONG RANGE ▼',px(370,y2),py(y2)+3)}
}
function drawEngineer(K){
  ctx.strokeStyle='rgba(180,255,200,.9)';ctx.lineWidth=2;ctx.beginPath();for(const t of S.tracers){ctx.moveTo(px(t.x1,t.y1),py(t.y1));ctx.lineTo(px(t.x2,t.y2),py(t.y2))}ctx.stroke();
  for(const q of S.sent){const z=sc(q.y)*K*1.7,x=px(q.x,q.y),y=py(q.y),fade=q.t<2&&!S.st.fortress?.5+.5*Math.sin(S.t*20):1;ctx.globalAlpha=fade;
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y,12*z,4*z,0,0,6.283);ctx.fill();
    if(turret3D(x,y-2*z,30*z,q.aim??-Math.PI/2)){}else{ctx.strokeStyle='#1a2a22';ctx.lineWidth=2.4*z;ctx.beginPath();for(const a of [-2.4,-.7,1.57]){ctx.moveTo(x,y-6*z);ctx.lineTo(x+Math.cos(a)*10*z,y+Math.sin(a)*3*z+1*z)}ctx.stroke();
    cylG(ctx,x-5*z,y-12*z,10*z,7*z,'#3a5a48');
    if(!dspr('turret',null,x,y-14*z,18*z,18*z,(q.aim??-Math.PI/2)+Math.PI/2)){sph(ctx,x,y-13*z,6.5*z,'#7dffb0',5.5*z);ctx.save();ctx.translate(x,y-13*z);ctx.rotate((q.aim??-Math.PI/2)+Math.PI/2);cylG(ctx,-1.6*z,-12*z,3.2*z,10*z,'#2a3a32');ctx.restore()}
    glowDot(ctx,x,y-13*z,1.4*z,'#eafff0')}
    ctx.fillStyle='#7dffb0';for(let i=0;i<q.hp;i++)ctx.fillRect(x-7*z+i*2.4*z,y+4*z,1.8*z,1.6*z);ctx.globalAlpha=1}
  if(S.orbs.length){ctx.globalCompositeOperation='lighter';for(const o of S.orbs){const a=o.life/.7,z=sc(o.y)*K,x=px(o.x,o.y),w=(18+30*(1-a))*z;const g2=ctx.createLinearGradient(x-w,0,x+w,0);g2.addColorStop(0,'rgba(95,225,255,0)');g2.addColorStop(.5,`rgba(220,250,255,${a})`);g2.addColorStop(1,'rgba(95,225,255,0)');ctx.fillStyle=g2;ctx.fillRect(x-w,0,w*2,py(o.y));ctx.drawImage(glowSprite('rgb(95,225,255)'),x-70*z,py(o.y)-30*z,140*z,60*z)}ctx.globalCompositeOperation='source-over'}
}
function eliteEyes(x,y,s,col){animeEye(ctx,x-4.4*s,y,3*s,3.6*s,col,1,-1);animeEye(ctx,x+4.4*s,y,3*s,3.6*s,col,1,1)}
