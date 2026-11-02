// ---------- anime layer: cut-ins, shouts, impact frames, speed lines, sound-effect text ----------
let CUT=null;const CUTQ=[];
function cutIn(o){if(o.small&&!SET.banners)return;o.t=0;o.dur=o.dur||1.6;if(CUT&&CUT.t<CUT.dur*.75)CUTQ.push(o);else CUT=o}
function shout(title,col,dur,o){cutIn(Object.assign({kind:'shout',title,col:col||'#ffffff',dur:dur||1},o||{}))}
const TAUNT={robot:['Resistance is a rounding error.','Target acquired. Deleting.','Your gates are already ours.'],
  bug:['The swarm hungers.','We are many. You are one.','Skitter, skitter... surrender.'],
  beast:['I can smell your fear from here!','The pack never stops running.','Fresh meat on the causeway!'],
  demon:['Burn, little rider!','Your soul will fuel my furnace.','Hell has a gate with your name on it.'],
  angel:['Kneel before the light.','Your rush ends in judgment.','We sing. You fall.'],
  knight:['Hold the line, Templars!','None shall breach these walls.','Face me with honour!']};
function sfxText(x,y,t,col,force){if(!SET.fxtext)return;if(S.t-(S.sfxT||-9)<(force?.45:1.6))return;S.sfxT=S.t;if(S.popups.length<10)S.popups.push({x,y,t,c:col,life:.9,sfx:1,rot:(Math.random()-.5)*.5})}
function hitStop(s){S.hitStop=Math.max(S.hitStop||0,s)}
function portraitFoe(f){return(g,x,y,s)=>{{const m3=foe3D(f.id,'',0,s*1.5);if(m3){g.drawImage(m3,x-s*.55,y-s*.66,s*1.1,s*1.1);return}}const sp=foeSprite(f,'',0,1,0);g.drawImage(sp,x-s*.5,y-s*.62,s,s*1.1)}}
function portraitVeh(k,pal,glow){return(g,x,y,s)=>{{const c3=S&&g3cell('e_'+fac().id,320,1,G3RIDES.indexOf(k),s*1.5);if(c3){g.drawImage(c3,x-s*.6,y-s*.6,s*1.2,s*1.2);return}}const sp=vehSprite(k,pal,glow,1,shade(pal[0],-.6)),q=s/120;g.save();g.translate(x,y+10*q);drawVehSpr(g,sp,q*2.4);g.restore()}}
function drawSpeedLines(a,col,fx,fy){
  if(a<=0||LQ())return;fx=fx??W/2;fy=fy??H*.38;const n=46,R2=Math.hypot(W,H);ctx.save();ctx.globalAlpha=a;ctx.fillStyle=col;
  const t=(performance.now()/1000);
  for(let i=0;i<n;i++){const ang=i/n*6.283+Math.sin(i*12.9)*.05,w=.006+.01*((i*7)%3),r0=R2*(.42+.12*Math.abs(Math.sin(i*3.1+t*9)));ctx.beginPath();
    ctx.moveTo(fx+Math.cos(ang)*R2,fy+Math.sin(ang)*R2);ctx.lineTo(fx+Math.cos(ang-w)*r0,fy+Math.sin(ang-w)*r0);ctx.lineTo(fx+Math.cos(ang+w)*R2,fy+Math.sin(ang+w)*R2);ctx.fill()}
  ctx.restore();
}
function drawCut(){
  if(!CUT||!$('ovStart').hidden)return;const C=CUT,t=C.t,d=C.dur;
  if(C.kind==='shout'){
    const p=Math.min(1,t/.18),out=Math.max(0,(t-(d-.25))/.25),sc2=(1.8-.8*(1-Math.pow(1-p,3)))*(1+out*.3);
    if(t<.12&&SET.flash){ctx.fillStyle=`rgba(255,255,255,${.55*(1-t/.12)})`;ctx.fillRect(0,0,W,H)}
    drawSpeedLines(.16*(1-out),hexA(C.col,1));
    const fs=Math.min(56,W*.13);ctx.save();ctx.globalAlpha=1-out;ctx.translate(W/2,H*(C.y||.5));
    {const bw2=W*1.3*Math.min(1,p*1.4),bh2=fs*(C.sub?1.75:1.3);ctx.fillStyle='rgba(4,8,16,.55)';ctx.fillRect(-bw2/2,-bh2/2,bw2,bh2);ctx.fillStyle=hexA(C.col,.85);ctx.fillRect(-bw2/2,-bh2/2,bw2,1.6);ctx.fillRect(-bw2/2,bh2/2-1.6,bw2,1.6)}
    ctx.scale(sc2,sc2);ctx.font=`900 ${fs}px Orbitron,"Barlow Condensed",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';if('letterSpacing' in ctx)ctx.letterSpacing=Math.round(fs*.06)+'px';
    const ty2=C.sub?-fs*.18:0;if(!LQ()){ctx.shadowColor=C.col;ctx.shadowBlur=fs*.45}ctx.fillStyle='#ffffff';ctx.fillText(C.title,0,ty2);ctx.shadowBlur=0;ctx.lineWidth=Math.max(1,fs*.035);ctx.strokeStyle=C.col;ctx.strokeText(C.title,0,ty2);
    if(C.sub){ctx.font=`700 ${fs*.26}px Orbitron,sans-serif`;if('letterSpacing' in ctx)ctx.letterSpacing=Math.round(fs*.04)+'px';ctx.fillStyle=C.col;ctx.fillText(C.sub.toUpperCase(),0,fs*.5)}
    if('letterSpacing' in ctx)ctx.letterSpacing='0px';
    ctx.restore();return}
  const inT=.22,outT=.22,pin=Math.min(1,t/inT),pout=Math.max(0,(t-(d-outT))/outT);
  const bh=C.small?Math.min(62,H*.08):Math.min(190,H*.24),cy=H*(C.y||.42),sk=bh*.05;
  const off=-(1-(1-Math.pow(1-pin,3)))*W*1.25+pout*pout*W*1.25;
  ctx.save();ctx.translate(off,0);
  const band=()=>{ctx.beginPath();ctx.moveTo(-30,cy-bh/2+sk);ctx.lineTo(W+30,cy-bh/2-sk);ctx.lineTo(W+30,cy+bh/2-sk);ctx.lineTo(-30,cy+bh/2+sk);ctx.closePath()};
  ctx.save();ctx.translate(10,10);band();ctx.fillStyle=hexA(C.col,.55);ctx.fill();ctx.restore();
  band();const bg=ctx.createLinearGradient(0,cy-bh,0,cy+bh);bg.addColorStop(0,'rgba(12,16,28,.96)');bg.addColorStop(1,'rgba(4,6,12,.96)');ctx.fillStyle=bg;ctx.fill();
  ctx.save();band();ctx.clip();
  for(let i=0;i<30;i++){const yy=cy-bh/2-sk+((i*37.3)%(bh+2*sk)),len=40+((i*53)%160),xx=((i*97+t*1600)%(W+260))-130;ctx.fillStyle=hexA(C.col,.08+(i%3)*.06);ctx.fillRect(W-xx,yy,len,1.4+(i%2)*1.4)}
  if(C.portrait){const ps=bh*(C.small?1.15:1.3),pxp=C.small?W*.13:W*.19;const pg=ctx.createRadialGradient(pxp,cy,0,pxp,cy,ps*.7);pg.addColorStop(0,hexA(C.col,.45));pg.addColorStop(1,hexA(C.col,0));ctx.fillStyle=pg;ctx.fillRect(pxp-ps,cy-ps,ps*2,ps*2);C.portrait(ctx,pxp+(1-pin)*-40,cy+bh*.12,ps)}
  ctx.restore();
  ctx.lineWidth=4;ctx.strokeStyle=C.col;ctx.beginPath();ctx.moveTo(-30,cy-bh/2+sk);ctx.lineTo(W+30,cy-bh/2-sk);ctx.moveTo(-30,cy+bh/2+sk);ctx.lineTo(W+30,cy+bh/2-sk);ctx.stroke();
  ctx.lineWidth=1;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.beginPath();ctx.moveTo(-30,cy-bh/2+sk+6);ctx.lineTo(W+30,cy-bh/2-sk+6);ctx.stroke();
  const tx=C.portrait?W*(C.small?.27:.37):W*.08,lx=x=>x;ctx.textAlign='left';ctx.textBaseline='middle';ctx.lineJoin='round';
  const tf=C.small?Math.min(22,W*.055):Math.min(38,W*.085),skx=y=>-(y-cy)*0;
  ctx.save();ctx.translate(tx,cy-(C.weak?bh*.08:0));
  if(C.sub){ctx.font=`800 ${tf*.42}px Orbitron,sans-serif`;ctx.fillStyle=C.col;ctx.fillText(C.sub.toUpperCase(),0,-tf*(C.small?.78:.95))}
  ctx.font=`900 ${tf}px Orbitron,sans-serif`;if(!LQ()){ctx.shadowColor=C.col;ctx.shadowBlur=tf*.35}ctx.fillStyle='#fff';ctx.fillText(C.title,0,0);ctx.shadowBlur=0;
  if(C.line){const lf=Math.max(11,tf*.42);ctx.font=`600 ${lf}px Barlow,sans-serif`;ctx.fillStyle='rgba(235,245,255,.92)';const maxw=W-tx-16,words=C.line.split(' '),ls=[''];for(const w of words){const t=(ls[ls.length-1]+' '+w).trim();if(ctx.measureText(t).width>maxw&&ls[ls.length-1])ls.push(w);else ls[ls.length-1]=t}ls.slice(0,2).forEach((l,i)=>ctx.fillText(l,2,tf*(C.small?.78:.9)+i*lf*1.15))}
  if(C.weak){const [w,r]=C.weak;ctx.font=`800 ${tf*.34}px "Barlow Condensed",sans-serif`;let x=2;const y=tf*1.45;
    ctx.fillStyle='#9fb0c0';ctx.fillText('WEAK TO',x,y);x+=ctx.measureText('WEAK TO ').width;ctx.fillStyle=DTC[w];ctx.fillText(DTN[w].toUpperCase(),x,y);x+=ctx.measureText(DTN[w].toUpperCase()+'   ').width;
    ctx.fillStyle='#9fb0c0';ctx.fillText('RESISTS',x,y);x+=ctx.measureText('RESISTS ').width;ctx.fillStyle=DTC[r];ctx.fillText(DTN[r].toUpperCase(),x,y)}
  ctx.restore();ctx.restore();
}
// visual-only clock: cut-ins, intro fly-in, hit-stop, and the breach / defeat outros keep animating while play is paused
function fxTick(dt){
  msgTick();if(TUT&&S){if(TUT.step===4&&R.picking)tutEnd();else if(!S.running||S.over)$('coach').classList.add('wait')}
  if(!S)return;
  if(CUT){CUT.t+=dt;if(CUT.t>CUT.dur)CUT=CUTQ.shift()||null}
  if(S.hitStop>0)S.hitStop-=dt;
  if(S.introT>0){S.introT-=dt;const p=clamp(1-S.introT/S.introD,0,1),c=S.cannon;c.y=610+240*Math.pow(1-Math.min(1,p*1.5),3);c.ty=c.y;c.tx=c.x;if(S.introT<=0){c.y=610;c.ty=610}}
  if(!S.running&&S.over){
    S.t+=dt;
    for(const p of S.sparks){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}S.sparks=S.sparks.filter(p=>p.life>0);
    for(const b of S.booms)b.life-=dt;S.booms=S.booms.filter(b=>b.life>0);
    for(const p of S.popups){p.life-=dt;p.y-=30*dt}S.popups=S.popups.filter(p=>p.life>0);
    if(S.breachT!=null&&S.breachT<1.7){S.breachT+=dt;S.shake=Math.max(S.shake||0,6);if(Math.random()<.5){const x=40+Math.random()*320;S.booms.push({x,y:S.fy-Math.random()*20,r:22+Math.random()*26,life:.35});spark(x,S.fy,Math.random()<.5?'#ffb02e':'#ffffff',4);S.sparks.push({x,y:S.fy,vx:(Math.random()-.5)*30,vy:-20-Math.random()*30,life:1.1,c:'rgba(70,60,70,.6)',smoke:1})}}
    if(S.deadT!=null&&S.deadT<1.6){S.deadT+=dt;const c=S.cannon;if(Math.random()<.35){S.booms.push({x:c.x+(Math.random()-.5)*40,y:c.y+(Math.random()-.5)*30,r:18+Math.random()*24,life:.35});spark(c.x,c.y,'#ffb02e',5)}}
  }
}
function drawShutters(){
  if(!(S.introT>0)||!$('ovStart').hidden)return;const e=S.introD-S.introT;if(e>.45)return;const p=Math.pow(e/.45,2),sk=H*.25;
  ctx.fillStyle='#04060c';
  ctx.beginPath();ctx.moveTo(-10,-10);ctx.lineTo(W*.55+sk-p*W*1.1,-10);ctx.lineTo(W*.55-sk-p*W*1.1,H+10);ctx.lineTo(-10,H+10);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(W+10,-10);ctx.lineTo(W*.55+sk+p*W*1.1,-10);ctx.lineTo(W*.55-sk+p*W*1.1,H+10);ctx.lineTo(W+10,H+10);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#5fe1ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(W*.55+sk-p*W*1.1,-10);ctx.lineTo(W*.55-sk-p*W*1.1,H+10);ctx.moveTo(W*.55+sk+p*W*1.1,-10);ctx.lineTo(W*.55-sk+p*W*1.1,H+10);ctx.stroke();
}
function eatGates(msg){for(const g of S.lv.gates){if(!g.dead&&!g.follow&&g.y<S.fy+12){g.dead=true;S.ate++;spark((g.x1+g.x2)/2,g.y,'#c37cff',16);blip(70,.2,'sawtooth',.05);sfxText((g.x1+g.x2)/2,g.y,'CRUNCH!','#ff6a7a');if(S.ate===1)toast(msg)}}}
