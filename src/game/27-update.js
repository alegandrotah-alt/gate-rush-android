function update(dt){
  S.t+=dt;R.time+=dt;
  const c=S.cannon,lv=S.lv,st=S.st,V=st.V,K_=S.keys;
  // movement
  const kx=(K_.arrowright||K_.d?1:0)-(K_.arrowleft||K_.a?1:0),ky=(K_.arrowdown||K_.s?1:0)-(K_.arrowup||K_.w?1:0);
  if(kx||ky){c.tx=c.x+kx*60;c.ty=c.y+ky*60}
  const yMin=S.fy+40;
  c.tx=clamp(c.tx,26,374);c.ty=clamp(c.ty,yMin,Y_MAX);
  if(hasMod('ice')){const dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy),sp=Math.min(st.speed,d*6),k2=Math.min(1,2.4*dt);c.vx=(c.vx||0)+((d>1?dx/d*sp:0)-(c.vx||0))*k2;c.vy=(c.vy||0)+((d>1?dy/d*sp:0)-(c.vy||0))*k2;c.x=clamp(c.x+c.vx*dt,26,374);c.y=Math.min(Y_MAX,c.y+c.vy*dt)}
  else{const dx=c.tx-c.x,dy=c.ty-c.y,d=Math.hypot(dx,dy),m=st.speed*dt;if(d>m){c.x+=dx/d*m;c.y+=dy/d*m}else{c.x=c.tx;c.y=c.ty}}
  c.y=Math.max(c.y,yMin);
  {const dz=c.y-S.fy,z0=S.zone;S.zone=dz<=CLOSE_D?'close':dz>=LONG_D?'long':'mid';if(S.zone==='close'){S.closeTime=(S.closeTime||0)+dt;S.wasClose=1}
   if(z0&&z0!==S.zone&&S.zone!=='mid')S.swT=3;S.swT=Math.max(0,(S.swT||0)-dt);
   const mv=Math.hypot(c.x-(S.lx??c.x),c.y-(S.ly??c.y));S.lx=c.x;S.ly=c.y;S.still=mv<.6?(S.still||0)+dt:0;
   const lc=st.leechCap*st.maxHp;S.leechB=Math.min(lc,(S.leechB||0)+lc*dt);if(S.undyT>0)S.undyT-=dt}
  c.inv=Math.max(0,c.inv-dt);S.gz=Math.max(0,S.gz-.4*dt);S.hurtBuff=Math.max(0,S.hurtBuff-.25*dt);
  // auto-fire
  c.cool-=dt;S.bl=Math.max(0,S.bl-.3*dt);
  if(c.cool<=0){
    c.cool=st.fireInt/(1+S.bl)/(S.still>.6&&has('overwatch')?1+val('overwatch'):1);
    const sp=V.shots>1?14:9;
    for(let i=0;i<st.shots;i++)spawnPlayer(c.x+(i-(st.shots-1)/2)*sp+(Math.random()-.5)*4,c.y-14,st.weight,0);
    if(st.hivemind)for(const d of dronePos(c))for(let i=0;i<st.shots;i++)spawnPlayer(d.x+(i-(st.shots-1)/2)*5,d.y-6,st.weight*E0(),0);
    S.firedW+=st.weight*st.shots;
    c.charge=Math.min(1,c.charge+st.charge/45);
  }
  if(st.regen&&S.t-S.lastHit>5)heal(st.regen*st.maxHp*dt);
  if(S.pips<st.pips){S.pipT+=dt;if(S.pipT>=12){S.pipT=0;S.pips++}}else S.pipT=0;
  for(const g of lv.gates){g.flash=Math.max(0,g.flash-dt);if(g.follow)g.y=c.y-60}

  // players
  const wall=lv.wall,sing=has('singularity')>=2,ud=dmgMult();
  for(const u of S.players){
    u.py=u.y;u.y-=(u.big?150:280)*dt;u.x+=u.vx*dt;u.vx*=Math.pow(.2,dt);
    const r=radius(u.w);
    if(wall&&u.y<wall.y2+r&&u.y>wall.y1-r){if(!u.side)u.side=u.x<wall.x?-1:1;if(u.side<0)u.x=Math.min(u.x,wall.x-3-r);else u.x=Math.max(u.x,wall.x+3+r)}
    u.x=clamp(u.x,26+r,374-r);
    if(u.big&&sing){for(const o of S.players){if(o===u||o.big||o.w<=0)continue;const dx=o.x-u.x,dy=o.y-u.y;if(dx*dx+dy*dy<900){u.w+=o.w;o.w=0}}}
    for(const g of lv.gates){
      if(g.dead||(u.mask>>g.id)&1)continue;
      if(u.py>g.y&&u.y<=g.y){
        const o=gateX(g);if(u.x<g.x1+o||u.x>g.x2+o)continue;
        u.mask|=1<<g.id;g.flash=.12;
        if(isHeld(g)&&g.own<0){
          // a fort-held gate gives you nothing but takes a push back toward you; the Big One retakes it outright
          gateCtl(g,u.big?2:.012*(1+Math.min(3,Math.log10(1+u.w/S.st.weight))),u.x);spark(u.x,g.y,'#8fe7ff',1);continue}
        if(isHeld(g))gateCtl(g,.004);
        if(!g.follow){u.gates++;R.gateN=(R.gateN||0)+1;if(TUT)TUT.gate=1}
        if(g.t==='mul'){
          if(st.gatelord&&!g.follow){g.lordN=(g.lordN||0)+1;if(g.lordN>=[0,60,45,30][st.gatelord]&&(g.lord||0)<st.gatelord){g.lordN=0;g.lord=(g.lord||0)+1;g.bonus=(g.bonus||0)+1;g.flash=.6;popup((g.x1+g.x2)/2+gateX(g),g.y-16,'GATE +1','#ffd76a')}}
          let v=gateMul(g);
          if(has('lucky')){const lv2=val('lucky');if(Math.random()<1/lv2[0]){v=Math.max(v,lv2[1]);popup(u.x,g.y,'LUCKY ×'+lv2[1],'#ffcf2e')}}
          const total=u.w*v;
          if(u.big)u.w=total;else{
            const cap=has('hydra')&&val('hydra')[1]?7:4,tight=lv.kind==='stairs';
            const free=P_CAP-S.players.length;const n=Math.max(1,Math.min(v,cap,free+1));u.w=total/n;
            for(let j=1;j<n;j++){const cl=spawnPlayer(u.x+(j-(n-1)/2)*(tight?2:6)+(Math.random()-.5)*(tight?2:4),u.y+Math.random()*10,u.w,u.mask);if(cl){cl.side=u.side;cl.gates=u.gates;cl.vx=tight?0:(j-(n-1)/2)*18}}
          }
          blip(420+v*30,.04,'triangle',.03);
        }else if(g.t==='add'){
          u.w+=g.v*st.weight;
          if(!u.big&&S.players.length<P_CAP){u.w/=2;const cl=spawnPlayer(u.x+5,u.y+5,u.w,u.mask);if(cl){cl.side=u.side;cl.gates=u.gates}}
          blip(520,.04,'triangle',.03);
        }else{
          const d=Math.min(u.w*st.breaker,g.pool);u.w-=d/st.breaker;g.pool-=d;spark(u.x,g.y,'#ff8a8a',1);
          if(g.pool<=0){g.dead=true;spark((g.x1+g.x2)/2+o,g.y,'#ff8a8a',14);blip(90,.2,'sawtooth',.05)}
        }
      }
    }
    if(u.w>0&&u.y<S.fy&&Math.abs(u.x-200)>S.fw+6){u.w=0;if(Math.random()<.25)spark(u.x,S.fy,'#8fe7ff',1)}
    else if(u.w>0&&u.y<S.fy){const d=fortHit(u);if(has('ouroboros')&&!u.loop&&S.players.length<P_CAP){const nb=spawnPlayer(S.cannon.x+(Math.random()-.5)*10,S.cannon.y-14,u.w,0,u.big);if(nb){nb.loop=1;nb.gates=0}}S.baseShake=.15;spark(u.x,S.fy,'#ffd27a',2);blip(180,.03,'square',.02);if(u.big){buzz(25);R.bigHits=(R.bigHits||0)+1;if(R.bigHits>=10)award('big10');sfxText(u.x,S.fy+34,'CRASH!!','#5fe1ff',1);hitStop(.07);popup(u.x,S.fy+18,fmt(d),'#fff');S.shake=Math.max(S.shake||0,9);S.fortFlash=.25}u.w=0}
  }

  // boss advance / siege: when the timer runs out the keep marches on you
  if(lv.advance){
    S.fy=Math.min(Y_MAX-60,BASE_Y+(Y_MAX-60-BASE_Y)*(S.t/lv.T));
    eatGates('The Grand Gatekeep is crushing your gates!');
    if(S.fy>=Y_MAX-60&&!S.over){c.hp=0;R.windUsed=true;S.overrun=1}
  }else{
    if(!S.siege&&!S.warned&&lv.T-S.t<10){S.warned=1;toast('Siege in 10 seconds! Breach the keep!',2200,3);cue('charge')}
    if(!S.siege&&S.t>lv.T){S.siege=true;guide('siege');S.sgT=0;S.waveT=0;cue('siege');S.shake=12;hitStop(.12);shout('SIEGE!','#ff3b4e',1.5,{sub:'THE KEEP MARCHES ON YOU'});spawnElite()}
    if(S.siege){const SG=30;S.sgT+=dt;S.fy=BASE_Y+(Y_MAX-60-BASE_Y)*Math.min(1,S.sgT/SG);
      if(lv.wall&&S.fy>lv.wall.y1-30)lv.wall=null;
      eatGates('The keep is crushing your gates!');
      S.alarmT=(S.alarmT||0)-dt;if(S.alarmT<=0){S.alarmT=2;cue('charge')}
      if(S.sgT>=SG&&!S.over){c.hp=0;R.windUsed=true;S.overrun=1}}
  }
  bossTick(dt);eliteSpawnTick(dt);modsTick(dt);
  tutTick(dt);
  if(!TUT){if(S.L===1&&S.t>24)guide('zones');if(R.pendingPicks>0)guide('lvl')}
  // hordes: steady stream, bigger waves, and surges as the fort weakens
  S.streamT-=dt;
  if(S.streamT<=0){S.streamT=S.siege?.18:.3;sendWave(.3,0)}
  S.waveT-=dt;
  if(S.waveT<=0){S.waveT=Math.max(4,8-S.L*.25);S.waveN++;sendWave(2.5,1+Math.floor(S.L/6))}
  const pct=S.baseHP/S.baseMax;
  if(S.surge===0&&pct<.66){S.surge=1;sendWave(5,1);toast('The fort sends a horde!',1600,2)}
  if(S.surge===1&&pct<.33){S.surge=2;sendWave(7,2);toast('Last stand! Big horde incoming',2000,3)}

  // fort attacks
  S.atkT-=dt;
  if(S.atkT<=0){
    const L=S.L;S.atkT=Math.max(.45,2.5*Math.pow(.9,L-1))*(S.siege?.5:1)*(lv.boss?.75:1);
    const pool=attackPool(),n=1+(L>=8?1:0)+(L>=15?1:0)+(S.siege?1:0);
    // turrets visibly and audibly charge before firing, so nothing comes out of nowhere
    for(let i=0;i<n;i++)S.pend.push({t:Math.max(.3,.6-.015*L)+i*.08,k:rnd(pool)});
    S.charge=1;cue('charge');
  }
  for(const p of S.pend)p.t-=dt;{const go=S.pend.filter(p=>p.t<=0);S.pend=S.pend.filter(p=>p.t>0);for(const p of go)fortAttack(p.k)}
  S.charge=Math.max(0,(S.charge||0)-dt*1.6);
  for(const em of S.emit){em.t-=dt;em.acc+=dt;em.ang+=em.spin*dt;while(em.acc>=em.rate){em.acc-=em.rate;for(let a=0;a<em.arms;a++){const ang=em.ang+a*6.283/em.arms;const vy=Math.sin(ang);addBullet(em.x,em.y,Math.cos(ang)*em.sp,(Math.abs(vy)*.8+.2)*em.sp,{col:5,r:4,hard:1})}}}
  S.emit=S.emit.filter(e=>e.t>0);

  // enemy bullets
  const hit=V.hit,bslow=lim('btime')?.7:1;
  for(const b of S.bul){
    if(b.home){const a=Math.atan2(c.y-b.y,c.x-b.x),cur=Math.atan2(b.vy,b.vx);let da=a-cur;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;const na=cur+clamp(da,-b.home*dt,b.home*dt),spd=Math.min(150,Math.hypot(b.vx,b.vy)+40*dt);b.vx=Math.cos(na)*spd;b.vy=Math.sin(na)*spd}
    if(b.frz>0){b.frz-=dt;b.life-=dt}else{b.x+=b.vx*dt*bslow;b.y+=b.vy*dt*bslow;b.life-=dt}
    const dx=b.x-c.x,dy=b.y-c.y,d2=dx*dx+dy*dy,rr=b.r+hit;
    if(b.vy>0&&!b.home)for(const g of S.lv.gates){if(g.dead||!isHeld(g)||g.own<0)continue;const gy=g.y-13;if(b.y-b.vy*dt*bslow<gy&&b.y>=gy){const o=gateX(g);if(b.x>=g.x1+o&&b.x<=g.x2+o){b.life=0;gateCtl(g,-(b.hard?.024:.012)*(1+.03*S.L),b.x);g.flash=Math.max(g.flash,.08);break}}}
    if(b.life<=0)continue;
    if(d2<rr*rr&&c.inv<=0){hitPlayer(b.dmg,b.home?'missile':b.hard?'ringed':'bullet');b.life=0;continue}
    if(lim('graze')&&!b.gz&&d2<(rr+18)*(rr+18)){b.gz=1;S.gz=Math.min(1.2,S.gz+.03);c.charge=Math.min(1,c.charge+.012)}
  }
  // blobs block soft bullets one for one; outlined (hard) bullets pass straight through your stream
  {const BC=20,bg=new Map();for(const b of S.bul){if(b.life<=0)continue;const k2=((b.x/BC)|0)*100+((b.y/BC)|0);let a=bg.get(k2);if(!a)bg.set(k2,a=[]);a.push(b)}
   if(bg.size)for(const u of S.players){if(u.w<=0)continue;const ur=radius(u.w)*(u.big?2.2:1),cx=(u.x/BC)|0,cy=(u.y/BC)|0;
    for(let ix=cx-1;ix<=cx+1&&u.w>0;ix++)for(let iy=cy-1;iy<=cy+1&&u.w>0;iy++){const a=bg.get(ix*100+iy);if(!a)continue;
      for(const b of a){if(b.life<=0||b.hard)continue;const dx=u.x-b.x,dy=u.y-b.y,rr=ur+b.r;if(dx*dx+dy*dy<rr*rr){
        // one blob for one bullet, however heavy the blob is; the Big One just shrugs it off
        S.blk=(S.blk||0)+1;if(b.hp>1){b.hp--;}else{b.life=0;if(Math.random()<.4)spark(b.x,b.y,'#8fe7ff',2)}
        if(u.big)u.w*=.97;else{u.w=0;break}}}}}}
  // lasers
  for(const l of S.lasers){l.t+=dt;if(l.t>l.warn&&l.t<l.warn+l.dur&&Math.abs(c.x-l.x)<l.w/2+hit&&c.y>(l.y0??S.fy))hitPlayer(bulletDmg()*1.8,'laser')}
  S.lasers=S.lasers.filter(l=>l.t<l.warn+l.dur);
  // mortar shells
  for(const a of S.arts){a.t+=dt;if(a.t>=a.dur&&!a.done){a.done=true;S.booms.push({x:a.x,y:a.y,r:34,life:.35});blip(55,.25,'sawtooth',.07);
    if(Math.hypot(c.x-a.x,c.y-a.y)<30+hit*.5)hitPlayer(bulletDmg()*1.6,'mortar');
    for(const u of S.players)if(Math.hypot(u.x-a.x,u.y-a.y)<34)u.w=0}}
  S.arts=S.arts.filter(a=>!a.done);

  // enemies move; near you they home in
  for(const e of S.enemies){
    if(e.elite){eliteTick(e,dt);continue}if(e.dr){droneTick(e,dt);continue}if(e.pylon){pylonTick(e,dt);continue}if(e.courier){courierTick(e,dt);continue}
    const r=radius(e.w,e.brute);e.wob+=dt*6;
    const slow=(e.slowT>0?1-[0,.3,.45,.6][st.cryo]:1)*(e.tox>0&&has('necrosis')?1-val('necrosis'):1);if(e.slowT>0)e.slowT-=dt;
    let vx=Math.sin(e.wob)*6,vy=e.sp;
    if(!wall||e.y>wall.y2){const dx=c.x-e.x,dy=c.y-e.y,d=Math.hypot(dx,dy),pull=e.t==='runner'?260:170;if(d<pull&&dy>-20){vx+=dx/d*e.sp*.7;vy=vy*.5+dy/d*e.sp*.6}else vx+=dx*(e.brute?.3:.06)}
    if(e.stopY!=null&&e.y>=e.stopY){vy=0;vx=Math.sin(e.wob*.3)*14}
    if(e.t==='saboteur'){
      if(!e.g||e.g.dead||e.g.own<0){const gs=lv.gates.filter(g=>!g.dead&&isHeld(g)&&g.own>0&&g.y>e.y-20);e.g=gs.length?gs.reduce((a,b)=>Math.abs(b.y-e.y)<Math.abs(a.y-e.y)?b:a):null}
      if(e.g){const g=e.g,gx2=(g.x1+g.x2)/2+gateX(g),dx=gx2-e.x,dy=g.y-6-e.y,d=Math.hypot(dx,dy);
        if(d>8){vx=dx/d*e.sp;vy=dy/d*e.sp}else{vx=vy=0;e.chew=(e.chew||0)+dt;if(g.own>0)gateCtl(g,-.45*dt,gx2);else e.g=null}}
    }
    if(e.t==='phantom'){e.phT-=dt;if(e.phT<=0){e.phase=!e.phase;e.phT=e.phase?.9:1.3}}
    if(e.t==='totem'&&e.y>=e.stopY){for(const f of S.enemies){if(f!==e&&f.w>0&&f.w<f.max&&(f.x-e.x)**2+(f.y-e.y)**2<70*70)f.w=Math.min(f.max,f.w+f.max*.12*dt)}}
    if(e.t==='gunner'&&e.y>=e.stopY){e.shotT-=dt;if(e.shotT<=0){e.shotT=Math.max(1.1,2.4-.05*S.L);const a=aimAt(e.x,e.y);addBullet(e.x,e.y,Math.cos(a)*150,Math.sin(a)*150,{col:1,r:4})}}
    if(st.gravity&&!e.brute){const dx=c.x-e.x,dy=c.y-e.y,d=Math.hypot(dx,dy),R2=110+30*(st.gravity-1);if(d<R2&&d>6){vx+=dx/d*(50+20*st.gravity);vy+=dy/d*(50+20*st.gravity)}}
    const ey0=e.y;
    e.x+=vx*dt*slow;e.y+=vy*dt*slow;
    if(e.y>ey0&&!e.child2)for(const g of lv.gates){if(g.dead||!isHeld(g)||(e.gm>>g.id)&1)continue;if(ey0<g.y&&e.y>=g.y){const o=gateX(g);if(e.x<g.x1+o||e.x>g.x2+o)continue;e.gm=(e.gm|0)|(1<<g.id);
      if(g.own>0)gateCtl(g,-.05*Math.min(4,e.w/Math.max(1e-9,S.uw))*(e.brute?3:1),e.x);
      else if(g.t==='mul'&&!e.brute){const v=Math.min(gateMul(g),6),n=Math.min(v,3);e.w=e.w*v/n;e.max=Math.max(e.max,e.w);for(let j=1;j<n&&S.enemies.length<E_CAP;j++){const c2=spawnEnemy(e.x+(j-1)*8,e.y+4,e.w,false,'');if(c2){c2.gm=e.gm;c2.child=1}}g.flash=.15}}}
    if(wall&&e.y<wall.y2+r&&e.y>wall.y1-r){if(e.x<wall.x)e.x=Math.min(e.x,wall.x-3-r);else e.x=Math.max(e.x,wall.x+3+r)}
    e.x=clamp(e.x,26+r,374-r);
    if(Math.hypot(e.x-c.x,e.y-c.y)<r+hit+2){hitPlayer(bulletDmg()*(e.brute?2:e.t==='runner'?.8:.6),e.brute?'brute':'crash');if(!e.brute){spark(e.x,e.y,'#ff5050',5);if(e.t==='bomber')foeDies(e);e.w=0}}
    if(e.y>DEF_Y){hitPlayer(bulletDmg()*.5,'leak');e.w=0}
    if(e.brute&&S.L>=5&&e.w>0){e.shotT-=dt;if(e.shotT<=0){e.shotT=2.4;const a=aimAt(e.x,e.y);addBullet(e.x,e.y,Math.cos(a)*150,Math.sin(a)*150,{col:1})}}
  }

  // blob vs enemy collisions
  const CELL=24,grid=new Map();
  for(const e of S.enemies){if(e.w<=0)continue;const key=((e.x/CELL)|0)*100+((e.y/CELL)|0);let a=grid.get(key);if(!a)grid.set(key,a=[]);a.push(e)}
  const hitM=st.tough*ud;
  for(const u of S.players){
    if(u.w<=0)continue;const ur=radius(u.w)+(u.big?6:0);const cx=(u.x/CELL)|0,cy=(u.y/CELL)|0;
    outer:for(let ix=cx-1;ix<=cx+1;ix++)for(let iy=cy-1;iy<=cy+1;iy++){
      const a=grid.get(ix*100+iy);if(!a)continue;
      for(const e of a){
        if(e.w<=0||e.phase)continue;const rr=ur+radius(e.w,e.brute),dx=e.x-u.x,dy=e.y-u.y;
        if(dx*dx+dy*dy<rr*rr){const hm=e.t==='armored'?hitM*.3:hitM;const d=hurt(e,u.w*hm);u.w-=d/hm;if(e.w<=0&&has('frenzy')&&u.w>0)u.w+=e.max*.5;if(Math.random()<.3)spark(e.x,e.y,e.brute?'#ffcf2e':'#ff7a7a',1);if(u.w<=1e-6)break outer}
      }
    }
  }
  DTY='exp';WCL='';if(S.bursts.length){const list=S.bursts;S.bursts=[];for(const b of list.slice(0,80)){S.booms.push({x:b.x,y:b.y,r:b.r*.7,life:.18});for(const e of S.enemies){if(e.w<=0)continue;const dx=e.x-b.x,dy=e.y-b.y;if(dx*dx+dy*dy<b.r*b.r)hurt(e,b.dmg*ud,b.wpn?2:0)}}}

  {const hp=S.cannon.hp/Math.max(1,st.maxHp);if(hp<.3&&hp>0&&!S.over){S.hbT=(S.hbT??0)-dt;if(S.hbT<=0){S.hbT=.55+.5*(hp/.3);blip(96,.08,'triangle',.085);setTimeout(()=>blip(78,.1,'triangle',.07),140)}}else S.hbT=0}
  // ---------- weapons (scale with raw firepower) ----------
  const P=st.weight*st.shots/st.fireInt*ud,E=st.evoM;
  if(!st.inferno)S.rage=Math.max(0,S.rage-S.rage*.12*dt);if(S.moonDirty){S.moonDirty=0;restat()}
  const PB=lim('pointblank');
  if(st.overdrive){S.odT=(S.odT||0)+dt;const was=S.odOn;S.odOn=S.odT%10<[0,3,4,5][st.overdrive];if(S.odOn&&!was){popup(S.cannon.x,S.cannon.y-50,'OVERDRIVE','#ffb43a');blip(220,.25,'sawtooth',.05)}}else S.odOn=false;
  const OD=S.odOn?1+[0,.4,.6,.8][st.overdrive]:1;
  const W={P:P*OD,E,dt,CD:(S.odOn?.5:1)/(1+.2*st.hair)/(S.still>.6&&has('overwatch')?1+val('overwatch'):1),HT:1+.15*st.hair,MM:(1+.025*S.rage)*(has('brawler')?val('brawler'):1)*(PB?3:1),RM:PB?1.5:1,
    CH:[0,.5,.75,1][st.channel],GV:1+.2*st.gravity};
  S.beams=[];S.cones=[];
  for(const src of srcList())weaponsTick(src,W);
  sentryTick(dt,W);
  toxTick(dt,W);
  // echoes
  for(const q of S.echoQ)q.t-=dt;const due=S.echoQ.filter(q=>q.t<=0);S.echoQ=S.echoQ.filter(q=>q.t>0);for(const q of due)q.fn();
  DTY='kin';WCL='close';// launched saws (Saw Storm)
  for(const p of S.sawp){
    const y0=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;gatePass(p,y0,p.y);
    for(const e of S.enemies){if(e.w<=0||p.hit.has(e))continue;if((e.x-p.x)**2+(e.y-p.y)**2<(9+radius(e.w,e.brute))**2){p.hit.add(e);hurt(e,p.dmg*p.mult,1)}}
    for(const b of S.bul){if(b.life>0&&!b.hard&&(b.x-p.x)**2+(b.y-p.y)**2<(9+b.r)**2)killBullet(b)}
    if(p.y<S.fy){fortMelee(p.dmg*p.mult*3);p.life=0}
  }
  S.sawp=S.sawp.filter(p=>p.life>0&&p.x>20&&p.x<380);
  for(const sl of S.slashes)sl.life-=dt;S.slashes=S.slashes.filter(sl=>sl.life>0);
  DTY='kin';WCL='close';// Riftcutter waves ride your × gates up to the keep
  for(const w of S.waves){const y0=w.y;w.y-=460*dt;gatePass(w,y0,w.y);
    for(const e of S.enemies){if(e.w<=0||w.hit.has(e))continue;if(Math.abs(e.x-w.x)<w.w/2+radius(e.w,e.brute)&&Math.abs(e.y-w.y)<14){w.hit.add(e);hurt(e,w.dmg*w.mult,2)}}
    for(const b of S.bul)if(b.life>0&&Math.abs(b.x-w.x)<w.w/2&&Math.abs(b.y-w.y)<12)killBullet(b);
    if(w.y<=S.fy){fortMelee(w.dmg*w.mult*3);w.done=1;S.booms.push({x:w.x,y:S.fy,r:26,life:.2})}}
  S.waves=S.waves.filter(w=>!w.done);
  DTY='nrg';WCL='long';// singularities: fly in, pull and grind, then collapse
  for(const v of S.voids){v.t+=dt;if(v.t<v.fly)continue;const R2=v.R;
    if(v.t<v.fly+v.hold){
      for(const e of S.enemies){if(e.w<=0)continue;const dx=v.x-e.x,dy=v.y-e.y,d=Math.hypot(dx,dy),rr=R2+radius(e.w,e.brute);if(d<rr){const pull=(e.brute?55:150)*dt*Math.max(.2,1-d/rr);if(d>4){e.x+=dx/d*pull;e.y+=dy/d*pull}hurt(e,v.dps*dt*(d<R2*.35?2:1),2)}}
      for(const b of S.bul){if(b.life<=0||(b.hard&&!v.horizon))continue;const dx=v.x-b.x,dy=v.y-b.y,d=Math.hypot(dx,dy);if(d<R2){if(d<14)killBullet(b);else{b.x+=dx/d*170*dt;b.y+=dy/d*170*dt}}}}
    else if(!v.done){v.done=1;S.booms.push({x:v.x,y:v.y,r:R2*.8,life:.35});S.shake=Math.max(S.shake||0,5);playS('boomBig',.5)||blip(60,.25,'sawtooth',.06);let crushed=0;
      for(const e of S.enemies){if(e.w<=0)continue;const dx=e.x-v.x,dy=e.y-v.y;if(dx*dx+dy*dy<(R2*.8+radius(e.w,e.brute))**2){hurt(e,v.blast,2);if(e.w<=0)crushed+=e.max}}
      if(v.horizon&&crushed>0)spawnPlayer(v.x,v.y,crushed*.6*E,0)}}
  S.voids=S.voids.filter(v=>!v.done);
  DTY='nrg';WCL='long';// prism lances: pierce, and split at every × gate they cross
  {const born=[];for(const p of S.prisms){const y0=p.y,m0=p.mult;p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;gatePass(p,y0,p.y);
    if(p.mult>m0&&p.gen<(p.spec?3:2)&&S.prisms.length+born.length<120)for(const s2 of [-1,1]){const a=s2*(p.spec?.2:.28)*(1+p.gen*.3);born.push({x:p.x,y:p.y,vx:Math.sin(a)*560,vy:-Math.cos(a)*560,dmg:p.dmg,mult:p.spec?p.mult:p.mult*.6,mask:p.mask,hit:new Set(p.hit),gen:p.gen+1,hue:p.hue+60*s2,spec:p.spec,life:p.life})}
    for(const e of S.enemies){if(e.w<=0||p.hit.has(e))continue;if((e.x-p.x)**2+(e.y-p.y)**2<(8+radius(e.w,e.brute))**2){p.hit.add(e);hurt(e,p.dmg*p.mult,2)}}
    if(p.spec)for(const b of S.bul){if(b.life>0&&!b.hard&&(b.x-p.x)**2+(b.y-p.y)**2<(8+b.r)**2)killBullet(b)}
    if(p.y<S.fy){fortMelee(p.dmg*p.mult*2);spark(p.x,S.fy,'#ffffff',2);p.life=0}}
   S.prisms=S.prisms.concat(born).filter(p=>p.life>0&&p.x>20&&p.x<380)}
  DTY='kin';WCL='eng';// saw traps (Minefield)
  for(const tr of S.traps){tr.t-=dt;for(const e of S.enemies){if(e.w>0&&(e.x-tr.x)**2+(e.y-tr.y)**2<(tr.r+radius(e.w,e.brute))**2)hurt(e,tr.dps*dt,1)}for(const b of S.bul){if(b.life>0&&!b.hard&&(b.x-tr.x)**2+(b.y-tr.y)**2<tr.r*tr.r)killBullet(b)}}
  S.traps=S.traps.filter(t=>t.t>0);
  DTY='exp';WCL='long';// mortar shells
  for(const s2 of S.shells){s2.t+=dt;if(s2.t>=s2.dur&&!s2.done){s2.done=true;S.booms.push({x:s2.x,y:s2.y,r:s2.r,life:.3});if(Math.random()<.4)sfxText(s2.x,s2.y-10,'BOOM!','#ffb43a');(playS('boom',.38,.85+Math.random()*.3)||blip(80,.18,'sawtooth',.05));let killed=0;
    for(const e of S.enemies){const dx=e.x-s2.x,dy=e.y-s2.y;if(e.w>0&&dx*dx+dy*dy<(s2.r+radius(e.w,e.brute))**2){hurt(e,s2.dmg,2);if(e.w<=0)killed+=e.max}}
    if(s2.carpet&&killed>0)spawnPlayer(s2.x,s2.y,killed*.5*E,0)}}
  S.shells=S.shells.filter(s2=>!s2.done);
  DTY='exp';WCL='long';// missiles
  for(const m of S.miss){
    const y0=m.y;
    if(m.fort){m.vx+=(200-m.x)*.2*dt;m.vy=-240}
    else{
      if(!m.tg||m.tg.w<=0){let best=null,bd=1e9;for(const e of S.enemies){if(e.w<=0||e===m.skip)continue;const d=(e.x-m.x)**2+(e.y-m.y)**2;if(d<bd){bd=d;best=e}}m.tg=best;if(!best&&!m.fort){m.vy=-240}}
      if(m.tg){const a=Math.atan2(m.tg.y-m.y,m.tg.x-m.x),cur=Math.atan2(m.vy,m.vx);let da=a-cur;while(da>Math.PI)da-=6.283;while(da<-Math.PI)da+=6.283;const na=cur+clamp(da,-6*dt,6*dt);m.vx=Math.cos(na)*260;m.vy=Math.sin(na)*260}
    }
    m.x+=m.vx*dt;m.y+=m.vy*dt;m.life-=dt;
    if(m.fort||W.CH)gatePass(m,y0,m.y);
    const gm=m.fort?m.mult:Math.pow(m.mult,W.CH);
    if(m.y<S.fy){if(m.fort)fortMelee(m.dmg*gm*2);S.booms.push({x:m.x,y:S.fy,r:18,life:.2});m.life=0}
    else if(!m.fort&&m.tg&&Math.hypot(m.tg.x-m.x,m.tg.y-m.y)<8+radius(m.tg.w,m.tg.brute)){m.life=0;S.booms.push({x:m.x,y:m.y,r:m.r,life:.2});
      for(const e of S.enemies){if(e.w>0&&Math.hypot(e.x-m.x,e.y-m.y)<m.r+radius(e.w,e.brute))hurt(e,m.dmg*gm,2)}
      if(st.ricochet&&!m.child&&S.miss.length<160)for(let i=0;i<=st.ricochet;i++){const a=Math.random()*6.283;S.miss.push({x:m.x,y:m.y,vx:Math.cos(a)*200,vy:Math.sin(a)*200,life:1.5,dmg:m.dmg*.5,r:10,tg:null,mult:m.mult,mask:m.mask,child:1,skip:m.tg})}}
  }
  S.miss=S.miss.filter(m=>m.life>0&&m.y>-20&&m.y<720);
  DTY='kin';WCL='close';// boomerangs
  for(const b of S.boomr){const o=b.src;b.t+=dt;const y0=b.y;if(b.t>.55){const dx=o.x-b.x,dy=o.y-b.y,d=Math.hypot(dx,dy)||1;if(!b.ret){b.ret=1;b.hit.clear()}b.vx=dx/d*340;b.vy=dy/d*340;if(d<14)b.t=99}
    b.x+=b.vx*dt;b.y+=b.vy*dt;if(W.CH&&!b.ret)gatePass(b,y0,b.y);
    const gm=Math.pow(b.mult,W.CH);
    for(const e of S.enemies){if(e.w<=0||b.hit.has(e))continue;if((e.x-b.x)**2+(e.y-b.y)**2<(12+radius(e.w,e.brute))**2){b.hit.add(e);hurt(e,b.dmg*gm,2)}}
    for(const bb of S.bul){if(bb.life>0&&!bb.hard&&(bb.x-b.x)**2+(bb.y-b.y)**2<(10+bb.r)**2)killBullet(bb)}}
  S.boomr=S.boomr.filter(b=>b.t<99&&b.t<4);
  if(st.glaive){const gd=(2+st.boomer)*P*E;for(const g of glaivePos()){if(g.y<S.fy+26)fortMelee(gd*dt);for(const e of S.enemies){if(e.w>0&&(e.x-g.x)**2+(e.y-g.y)**2<(24+radius(e.w,e.brute))**2)hurt(e,gd*dt,2)}}}
  DTY='exp';WCL='eng';// mines
  if(st.mines){for(const m of S.mine){m.arm-=dt;if(m.arm>0||m.gone)continue;if(S.enemies.some(e=>e.w>0&&(e.x-m.x)**2+(e.y-m.y)**2<(16+radius(e.w,e.brute))**2))blowMine(m,1)}S.mine=S.mine.filter(m=>!m.gone)}
  DTY='exp';WCL='eng';// kamikaze drones
  if(st.kami){S.kamiT-=dt;if(S.kamiT<=0){S.kamiT=[6,4.5,3][st.kami-1];const nW=UP.filter(u=>u.kind==='w'&&lv_(u.id)>0).length;
    const from=srcList();const o=from[from.length-1];S.kamis.push({x:o.x,y:o.y,vx:0,vy:-120,dmg:P*(3+2*st.kami)*(1+.5*nW),life:4})}}
  for(const k2 of S.kamis){const d=densest(),tx=d?d.x:200,ty=d?d.y:S.fy-10;const dx=tx-k2.x,dy=ty-k2.y,dd=Math.hypot(dx,dy)||1;k2.vx+=dx/dd*900*dt;k2.vy+=dy/dd*900*dt;const sp=Math.hypot(k2.vx,k2.vy);if(sp>320){k2.vx*=320/sp;k2.vy*=320/sp}
    k2.x+=k2.vx*dt;k2.y+=k2.vy*dt;k2.life-=dt;
    if(dd<14||k2.y<S.fy||k2.life<=0){k2.life=-1;S.booms.push({x:k2.x,y:k2.y,r:50,life:.3});sfxText(k2.x,k2.y-10,'KA-BOOM!','#ff6a3a');blip(65,.2,'sawtooth',.05);
      if(k2.y<S.fy+10)fortMelee(k2.dmg);for(const e of S.enemies){if(e.w>0&&(e.x-k2.x)**2+(e.y-k2.y)**2<(50+radius(e.w,e.brute))**2)hurt(e,k2.dmg,2)}}}
  S.kamis=S.kamis.filter(k2=>k2.life>0);
  DTY='fire';WCL='close';// afterburn trail
  if(st.burn){const last=S.trail[S.trail.length-1];if(!last||Math.hypot(last.x-c.x,last.y-c.y)>10)S.trail.push({x:c.x,y:c.y,t:[1.5,2,2.5][st.burn-1]});
    const bd=(.4+.3*st.burn)*P*W.HT;
    for(const p of S.trail){p.t-=dt;for(const e of S.enemies){if(e.w>0&&(e.x-p.x)**2+(e.y-p.y)**2<(12+radius(e.w,e.brute))**2)hurt(e,bd*dt,1)}for(const b of S.bul){if(b.life>0&&!b.hard&&(b.x-p.x)**2+(b.y-p.y)**2<(10+b.r)**2)killBullet(b)}}
    S.trail=S.trail.filter(p=>p.t>0);if(S.trail.length>140)S.trail.splice(0,S.trail.length-140);
    if(st.mines){S.burnMineT-=dt;if(S.burnMineT<=0&&S.trail.length){S.burnMineT=.9*W.CD;const p=rnd(S.trail);if(S.mine.length<40)S.mine.push({x:p.x,y:p.y,arm:.4,dmg:(1.6+.8*st.mines)*P*(st.minefield?E:1)})}}}
  for(const r of S.rails)r.life-=dt;S.rails=S.rails.filter(r=>r.life>0);
  for(const p of S.pulses)p.life-=dt;S.pulses=S.pulses.filter(p=>p.life>0);
  S.bul=S.bul.filter(b=>b.life>0&&b.y<720&&b.y>-40&&b.x>-20&&b.x<420);

  for(const b of S.bolts)b.life-=dt;S.bolts=S.bolts.filter(b=>b.life>0);
  for(const b of S.booms)b.life-=dt;S.booms=S.booms.filter(b=>b.life>0);
  for(const p of S.popups){p.life-=dt;p.y-=30*dt}S.popups=S.popups.filter(p=>p.life>0);
  S.players=S.players.filter(u=>u.w>1e-6&&u.y>-10);
  S.enemies=S.enemies.filter(e=>e.w>1e-6);
  for(const p of S.sparks){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}
  S.sparks=S.sparks.filter(p=>p.life>0);
  S.baseShake=Math.max(0,S.baseShake-dt);

  while(R.xp>=R.need){R.xp-=R.need;R.lvl++;R.need=xpNeed(R.lvl);R.pendingPicks++;popup(S.cannon.x,S.cannon.y-44,'LEVEL UP +','#9ff0ff');vfx({k:'magic_03',x:S.cannon.x,y:S.cannon.y-6,s0:20,s1:90,dur:.5,col:'#9ff0ff',add:1,rot:0,vr:3});if(!playS('level',.5)&&!playS('ready',.45)){blip(880,.08,'triangle',.04);blip(1320,.1,'triangle',.03)}}
  if(!(S.baseHP>0)&&!S.over)fortDown();
  else if(c.hp<=0&&!S.over)runOver();
  else if(R.pendingPicks>0&&!R.picking&&SET.autolvl)autoPick();
}
function E0(){return S.st.evoM}
// gate control: +1 fully yours, -1 fully the fort's. Crossing zero flips the gate.
const isHeld=g=>g.t!=='sub'&&!g.follow;
function gateCtl(g,d,x){
  if(!isHeld(g)||g.dead)return;const before=g.own;g.ctl=clamp(g.ctl+(d<0&&has('gateeng')&&val('gateeng')[1]?d*.5:d),-1,1);
  if(g.ctl<0&&g.own>0){g.own=-1;S.gatesLost=(S.gatesLost||0)+1;g.flash=.5;S.shake=Math.max(S.shake||0,4);popup(x??(g.x1+g.x2)/2,g.y-16,'GATE LOST','#ff5050');cue('lost');guide('held')}
  else if(g.ctl>0&&g.own<0){g.own=1;g.flash=.5;popup(x??(g.x1+g.x2)/2,g.y-16,'GATE TAKEN','#8fe7ff');cue('taken')}
}
function killBullet(b){if(b.life<=0)return;b.life=0;const st=S.st;if(st.absorb){S.cannon.charge=Math.min(1,S.cannon.charge+.004*st.absorb);S.rage=Math.min(40+40*lv_('berserk'),S.rage+st.absorb*.5)}}
function srcList(){const c=S.cannon,st=S.st,out=[{x:c.x,y:c.y,k:1,tm:c.tm,main:1}];
  if(st.wing){const n=st.wing+1,k=.3+.1*st.wing;for(let i=0;i<n;i++){const w=S.wings[i]||(S.wings[i]={tm:{}}),side=i%2?1:-1,row=i>>1;w.x=clamp(c.x+side*(36+row*18),36,364);w.y=c.y+16+row*12+Math.sin(S.t*3+i)*3;out.push({x:w.x,y:w.y,k,tm:w.tm})}}
  return out}
function fireEv(fn){const ty=DTY,cl=WCL,f=()=>{const p=DTY,q=WCL;DTY=ty;WCL=cl;fn();DTY=p;WCL=q};f();const st=S.st;if(st.echo&&Math.random()<[0,.25,.4,.55][st.echo])S.echoQ.push({t:.15,fn:f})}
function cd(tm,key,dt,period){tm[key]=(tm[key]??Math.random()*period)-dt;if(tm[key]<=0){tm[key]=period;return true}return false}
