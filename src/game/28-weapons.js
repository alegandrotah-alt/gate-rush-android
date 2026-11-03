function weaponsTick(o,W){
  const st=S.st,c=S.cannon,k=o.k,P=W.P*k,E=W.E,dt=W.dt,tm=o.tm,RM=W.RM,MM=W.MM;
  DTY='kin';WCL='close';// Spinning Saws (+ Saw Storm launches)
  if(st.orbit){
    const n=st.orbit+(st.sawstorm?2:0),R0=38*RM*(o.main?1:.7),hitR=10*RM,dps=(1.4+1*st.orbit)*P*MM*W.GV*W.HT;
    for(let i=0;i<n;i++){const a=S.t*3.2+i*6.283/n,ox=o.x+Math.cos(a)*R0,oy=o.y-8+Math.sin(a)*R0*.8;
      if(oy-hitR<S.fy)fortMelee(dps*dt*2);
      for(const b of S.bul){if(b.life>0&&!b.hard&&(b.x-ox)**2+(b.y-oy)**2<(hitR+b.r)**2){killBullet(b);spark(b.x,b.y,'#ffe27a',1)}}
      for(const e of S.enemies){if(e.w<=0)continue;const dx=e.x-ox,dy=e.y-oy,rr=hitR+radius(e.w,e.brute);if(dx*dx+dy*dy<rr*rr){hurt(e,dps*dt,1);if(Math.random()<.1)spark(e.x,e.y,'#ffe27a',1)}}}
    if(st.sawstorm&&cd(tm,'saw',dt,.3)){for(let i=0;i<3;i++){const a=-Math.PI/2+(i-1)*.22;S.sawp.push({x:o.x,y:o.y-14,vx:Math.cos(a)*300,vy:Math.sin(a)*300,dmg:(1+.6*st.orbit)*P*MM*E,mult:1,mask:0,hit:new Set(),life:2})}}
  }
  DTY='nrg';WCL='long';// Storm Rod / Thunder Gate
  if(st.zap&&cd(tm,'zap',dt,Math.max(.5,1.5-.2*st.zap)*W.CD))fireEv(()=>{
    const alive=S.enemies.filter(e=>e.w>0).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y));
    let from={x:o.x,y:o.y-20};const chain=1+Math.floor(st.zap/2)+(st.thunder?3:0),dmg=(.5+.35*st.zap)*P;
    for(let i=0;i<Math.min(chain,alive.length);i++){const e=alive[i];S.bolts.push({x1:from.x,y1:from.y,x2:e.x,y2:e.y,life:.14});hurt(e,dmg,2);from=e}
    if(st.thunder){const gs=S.lv.gates.filter(g=>g.t==='mul'&&!g.dead&&g.own>0).sort((a,b)=>gateMul(b)-gateMul(a)).slice(0,3);let m=1,f={x:o.x,y:o.y-20};
      for(const g of gs){const gx_=(g.x1+g.x2)/2+gateX(g);S.bolts.push({x1:f.x,y1:f.y,x2:gx_,y2:g.y,life:.2});f={x:gx_,y:g.y};m*=gateMul(g);g.flash=.3}
      S.bolts.push({x1:f.x,y1:f.y,x2:f.x,y2:S.fy,life:.2});fortMelee(dmg*m*E*2)}
    if(o.main&&has('conductor')&&Math.random()<val('conductor')[0]){const gs=S.lv.gates.filter(g=>g.t==='mul'&&!g.dead&&!g.follow);if(gs.length){const g=rnd(gs);g.bonus=(g.bonus||0)+val('conductor')[1];g.flash=.4;const gx_=(g.x1+g.x2)/2+gateX(g);S.bolts.push({x1:o.x,y1:o.y-20,x2:gx_,y2:g.y,life:.2});popup(gx_,g.y-14,'+1','#d9f4ff')}}
    if(Math.random()<.15)sfxText(o.x,o.y-40,'ZZT!','#5fe1ff');(playS('zap',.28,.85+Math.random()*.3)||blip(900,.05,'square',.025))});
  DTY='exp';WCL='long';// Mortar / Carpet Bomb
  if(st.bomb&&cd(tm,'bomb',dt,Math.max(1.2,3.8-.5*st.bomb)*W.CD))fireEv(()=>{for(let b=0;b<(st.carpet?4:1);b++){const d=densest();if(!d)break;S.shells.push({x0:o.x,y0:o.y-20,x:d.x,y:d.y,t:0,dur:.55,r:30+6*st.bomb,dmg:(1.2+.9*st.bomb)*P*(st.carpet?E:1),carpet:!!st.carpet})}});
  DTY='exp';WCL='long';// Homing Missiles / Missile Swarm
  if(st.missile&&cd(tm,'miss',dt,Math.max(.5,1.6-.18*st.missile)*W.CD))fireEv(()=>{const n=(1+st.missile)*(st.swarm?3:1);
    for(let i=0;i<n&&S.miss.length<160;i++){const a=-Math.PI/2+(Math.random()-.5)*1.6,fort=st.swarm&&i%2===0;S.miss.push({x:o.x,y:o.y-10,vx:Math.cos(a)*160,vy:Math.sin(a)*160,life:3,dmg:(.45+.25*st.missile)*P*(st.swarm?E:1),r:15,tg:null,fort,mult:1,mask:0})}});
  DTY='nrg';WCL='long';// Laser / Death Ray
  if(st.laser){
    const w=(5+1.5*st.laser)*(st.deathray?3:1)*(o.main?1:.6),gp=gateProduct(o.x,S.fy,o.y),gm=st.deathray?gp:Math.pow(gp,W.CH),dps=(.5+.35*st.laser)*P*(st.deathray?2*E:1)*W.HT;
    S.beams.push({x:o.x,y:o.y-16,w,dr:!!st.deathray});
    for(const e of S.enemies){if(e.w>0&&e.y<o.y&&Math.abs(e.x-o.x)<w/2+radius(e.w,e.brute))hurt(e,dps*dt*gm,2)}
    if(st.deathray){for(const b of S.bul)if(b.life>0&&b.y<o.y&&Math.abs(b.x-o.x)<w/2+b.r)killBullet(b);fortMelee(dps*dt*gm)}
    else if(st.cryo)for(const b of S.bul)if(b.life>0&&!b.hard&&b.y<o.y&&Math.abs(b.x-o.x)<w/2+b.r)b.frz=1;
    if(W.CH&&!st.deathray)fortMelee(dps*dt*gm*.25);
  }
  DTY='fire';WCL='close';// Flamethrower / Inferno
  if(st.flame){
    const reach=(60+8*st.flame)*(st.inferno?2:1)*RM*(o.main?1:.7),dps=(2.6+1.4*st.flame)*P*(st.inferno?2*E:1)*MM*W.GV*W.HT;
    S.cones.push({x:o.x,y:o.y-12,reach});
    if(o.y-12-reach<S.fy)fortMelee(dps*dt*2*(st.inferno?3:1)*clamp((S.fy-(o.y-12-reach))/40,.25,1));
    for(const e of S.enemies){if(e.w<=0)continue;const dx=e.x-o.x,dy=o.y-12-e.y;if(dy>0&&dy<reach&&Math.abs(dx)<dy*.5+8)hurt(e,dps*dt,1)}
    if(st.inferno)for(const b of S.bul){const dx=b.x-o.x,dy=o.y-12-b.y;if(b.life>0&&dy>0&&dy<reach&&Math.abs(dx)<dy*.5+8)killBullet(b)}
  }
  DTY='nrg';WCL='close';// Guardian Orbs / Aegis
  if(st.shield){
    const odps=(.8+.5*st.shield)*P*(st.aegis?2*E:1)*MM*W.HT,orr=(st.aegis?16:8);
    for(const q of orbPos(o)){
      if(q.y-10*RM<S.fy)fortMelee(odps*dt*2);
      for(const e of S.enemies){if(e.w>0&&(e.x-q.x)**2+(e.y-q.y)**2<(10*RM+radius(e.w,e.brute))**2)hurt(e,odps*dt,1)}
      for(const b of S.bul){if(b.life<=0)continue;const d2=(b.x-q.x)**2+(b.y-q.y)**2;
        if(st.cryo&&!b.hard&&d2<(b.r+orr+22)**2)b.frz=1;
        if(b.hard&&!st.aegis)continue;
        if(d2<(b.r+orr)**2){killBullet(b);spark(b.x,b.y,'#9df0bf',2);if(st.aegis){spawnPlayer(b.x,b.y-4,st.weight*4*E,0);S.caught++;if(S.caught%10===0&&S.pips<st.pips+1)S.pips++}}}}
  }
  DTY='kin';WCL='eng';// Drones / Hivemind
  if(st.drones&&cd(tm,'drone',dt,Math.max(.1,.32-.03*st.drones))){for(const d of dronePos(o))spawnPlayer(d.x,d.y-6,st.weight*.45*k,0)}
  DTY='kin';WCL='close';// Boomerang
  if(st.boomer&&cd(tm,'boom',dt,Math.max(.8,1.8-.15*st.boomer)*W.CD))fireEv(()=>{const n=(st.boomer>=4?3:st.boomer>=2?2:1)+st.ricochet;
    for(let i=0;i<n;i++){const a=-Math.PI/2+(i-(n-1)/2)*.45;S.boomr.push({x:o.x,y:o.y-10,vx:Math.cos(a)*300,vy:Math.sin(a)*300,t:0,dmg:(1.3+.65*st.boomer)*P,hit:new Set(),src:o,mult:1,mask:0})}});
  DTY='exp';WCL='eng';// Mine Layer / Minefield
  if(st.mines&&cd(tm,'mine',dt,Math.max(.5,2.2-.25*st.mines)/(st.minefield?2:1)*W.CD))fireEv(()=>{const cap=6+2*st.mines+(st.minefield?20:0);
    const drop=st.minefield?[{x:40+Math.random()*320,y:S.fy+60+Math.random()*(Y_MAX-S.fy-80)},{x:o.x,y:o.y}]:[{x:o.x,y:o.y}];
    for(const p of drop)if(S.mine.length<cap+8)S.mine.push({x:p.x,y:p.y,arm:.5,dmg:(1.6+.8*st.mines)*P*(st.minefield?E:1)})});
  DTY='kin';WCL='long';// Railgun / Mass Driver
  if(st.rail&&cd(tm,'rail',dt,(st.massdriver?1.2:Math.max(1.2,3-.3*st.rail))*W.CD))fireEv(()=>{
    const dmg=(1.5+.9*st.rail)*P*(st.massdriver?E:1);
    const shots=[0];for(let i=1;i<=st.ricochet;i++)shots.push(i%2?.12*Math.ceil(i/2):-.12*Math.ceil(i/2));
    for(const ang of shots){const x1=o.x+Math.tan(ang)*(o.y-S.fy);const gp=ang===0?gateProduct(o.x,S.fy,o.y):1,gm=st.massdriver?gp:Math.pow(gp,W.CH);
      for(const e of S.enemies){if(e.w<=0||e.y>o.y)continue;const lx=o.x+(x1-o.x)*((o.y-e.y)/Math.max(1,o.y-S.fy));if(Math.abs(e.x-lx)<8+radius(e.w,e.brute))hurt(e,dmg*gm,2)}
      fortMelee(dmg*(st.massdriver?gm*3:.15*gm));S.rails.push({x:o.x,x1,y0:o.y-16,life:.3,big:!!st.massdriver})}
    (playS('rail',.4,.95+Math.random()*.1)||blip(1200,.08,'sawtooth',.04))});
  DTY='kin';WCL='eng';// Sentry Turret / Fortress Protocol
  if(st.sentry&&o.main&&cd(tm,'sentry',dt,(st.fortress?3:Math.max(3.4,6.5-.6*st.sentry))*W.CD)){const cap=st.fortress?8:1+st.sentry+(has('vonneumann')?2:0);if(S.sent.length<cap){S.sent.push({x:o.x,y:o.y-12,t:st.fortress?999:12,cd:.2,hp:st.fortress?12:6,re:has('vonneumann')?1:0});blip(500,.06,'square',.03);if(S.sent.length>=6)award('eng6')}}
  DTY='kin';WCL='close';// Phase Blade / Riftcutter: a sweeping arc that cuts enemies and plain bullets
  if(st.blade&&cd(tm,'blade',dt,Math.max(.4,1.05-.12*st.blade)*W.CD/(st.riftcut?1.6:1)))fireEv(()=>{
    const R0=(48+7*st.blade)*RM*(st.riftcut?1.4:1)*(o.main?1:.7),dmg=(2+1.3*st.blade)*P*MM*W.GV*(st.riftcut?2*E:1),side=(tm.bladeSide=-(tm.bladeSide||1)),cy=o.y-10;
    S.slashes.push({x:o.x,y:cy,r:R0,life:.2,side,rift:!!st.riftcut});
    for(const e of S.enemies){if(e.w<=0)continue;const dx=e.x-o.x,dy=cy-e.y;if(dy>-12&&dx*dx+dy*dy<(R0+radius(e.w,e.brute))**2)hurt(e,dmg,1)}
    for(const b of S.bul){if(b.life<=0||(b.hard&&!st.riftcut))continue;const dx=b.x-o.x,dy=cy-b.y;if(dy>-12&&dx*dx+dy*dy<R0*R0){killBullet(b);spark(b.x,b.y,'#bfe8ff',1)}}
    if(cy-R0<S.fy)fortMelee(dmg*1.5);
    if(st.riftcut&&S.waves.length<40)S.waves.push({x:o.x,y:cy-14,w:R0*1.1,dmg:dmg*.8,mult:1,mask:0,hit:new Set()});
    blip(1400,.05,'triangle',.03)});
  DTY='nrg';WCL='long';// Singularity / Event Horizon
  if(st.vortex&&cd(tm,'vortex',dt,Math.max(2.4,5.2-.5*st.vortex)*W.CD))fireEv(()=>{const n=st.horizon?2:1;
    for(let i=0;i<n&&S.voids.length<6;i++){const d=densest()||{x:200,y:S.fy+120},tx=clamp(d.x+(i?(Math.random()<.5?-80:80):0),40,360),ty=clamp(d.y,S.fy+30,Math.max(S.fy+40,o.y-60));
      S.voids.push({x0:o.x,y0:o.y-14,x:tx,y:ty,t:0,fly:.45,hold:2.2+.25*st.vortex,R:(62+9*st.vortex)*(st.horizon?1.5:1)*(o.main?1:.75),dps:(.9+.55*st.vortex)*P*(st.horizon?2*E:1),blast:(2.4+1.4*st.vortex)*P*(st.horizon?E:1),horizon:!!st.horizon})}
    blip(120,.2,'sine',.05)});
  DTY='nrg';WCL='long';// Prism Lance / Spectrum
  if(st.prism&&cd(tm,'prism',dt,Math.max(.8,2.2-.25*st.prism)*W.CD))fireEv(()=>{if(S.prisms.length<120)S.prisms.push({x:o.x,y:o.y-16,vx:0,vy:-560,dmg:(1.1+.7*st.prism)*P*(st.spectrum?E:1),mult:1,mask:0,hit:new Set(),gen:0,hue:Math.random()*360,spec:!!st.spectrum,life:2});blip(1800,.05,'triangle',.03)});
  DTY='nrg';WCL='close';// Tesla Coil / Arc Reactor
  if(st.tesla&&cd(tm,'tesla',dt,Math.max(.3,1.4-.15*st.tesla)/(st.reactor?2:1)*W.CD))fireEv(()=>{
    const r=(60+8*st.tesla)*(st.reactor?2:1)*(o.main?1:.7),dmg=(.6+.3*st.tesla)*P*(st.reactor?E:1);
    for(const e of S.enemies){if(e.w>0&&(e.x-o.x)**2+(e.y-o.y)**2<(r+radius(e.w,e.brute))**2)hurt(e,dmg,2)}
    const br=st.reactor?r:r*.6;for(const b of S.bul){if(b.life<=0)continue;const d2=(b.x-o.x)**2+(b.y-o.y)**2;if((st.reactor||!b.hard)&&d2<br*br)killBullet(b);else if(st.cryo&&!b.hard&&d2<r*r)b.frz=1}
    S.pulses.push({x:o.x,y:o.y,r,life:.3});(playS('zap',.18,1.3+Math.random()*.3)||blip(1500,.04,'square',.02))});
}

function densest(){const alive=S.enemies.filter(e=>e.w>0);if(!alive.length)return null;let best=null,bs=-1;for(let i=0;i<12;i++){const e=rnd(alive);let s2=0;for(const f of alive){const dx=f.x-e.x,dy=f.y-e.y;if(dx*dx+dy*dy<1600)s2+=f.w}if(s2>bs){bs=s2;best=e}}return best}
function gateProduct(x,yTop,yBot){let m=1;for(const g of S.lv.gates){if(g.dead||g.t!=='mul'||g.own<0||g.y<yTop||g.y>yBot)continue;const o=gateX(g);if(x>=g.x1+o&&x<=g.x2+o){m*=gateMul(g);g.flash=Math.max(g.flash,.05)}}return m}
function gatePass(p,y0,y1){for(const g of S.lv.gates){if(g.dead||g.t!=='mul'||g.own<0||(p.mask>>g.id)&1)continue;if(y0>g.y&&y1<=g.y){const o=gateX(g);if(p.x>=g.x1+o&&p.x<=g.x2+o){p.mask|=1<<g.id;p.mult*=gateMul(g);g.flash=.12}}}}
function glaivePos(){const out=[];for(let i=0;i<3;i++){const a=S.t*1.6+i*2.094;out.push({x:200+Math.cos(a)*140,y:S.fy+30+Math.sin(a)*22})}return out}
function blowMine(m,chain){
  if(m.gone)return;m.gone=1;DTY='exp';const st=S.st,r=40,dmg=m.dmg*(st.minefield?Math.pow(1.25,Math.min(chain,30)):1);
  S.booms.push({x:m.x,y:m.y,r,life:.25});playS('mine',.32,.9+Math.random()*.2)||blip(70,.15,'sawtooth',.04);
  for(const e of S.enemies){if(e.w>0&&(e.x-m.x)**2+(e.y-m.y)**2<(r+radius(e.w,e.brute))**2)hurt(e,dmg)}
  if(st.minefield){S.traps.push({x:m.x,y:m.y,t:2.5,r:18,dps:dmg*.3});for(const o of S.mine)if(!o.gone&&(o.x-m.x)**2+(o.y-m.y)**2<80*80)blowMine(o,chain+1)}
}
function dronePos(c){c=c||S.cannon;n=(S.st.drones||0)+(S.st.hivemind?3:0),out=[];for(let i=0;i<n;i++){const side=i%2?1:-1,row=Math.floor(i/2);out.push({x:c.x+side*(26+row*14),y:c.y+6+row*10+Math.sin(S.t*4+i)*3})}return out}
function orbPos(c){c=c||S.cannon;n=(S.st.shield||0)+(S.st.aegis?3:0),rm=(lim('pointblank')?1.5:1)*(S.st.aegis?1.4:1),out=[];for(let i=0;i<n;i++){const a=S.t*2.6+i*6.283/n;out.push({x:c.x+Math.cos(a)*28*rm,y:c.y-4+Math.sin(a)*24*rm})}return out}

