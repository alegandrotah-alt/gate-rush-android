// ---------- run state ----------
let R=null,S=null;
function newRun(){
  const veh=VEH[META.veh]?META.veh:'cannon';
  R={veh,fort:1,lvl:1,xp:0,need:xpNeed(1),ups:{},relics:[],rt:{},slots:5+rank('slots'),rerolls:2+rank('luck'),coins:4+3*rank('startcoins'),seen:{},
     kills:0,forts:0,time:0,pendingPicks:0,picking:false,snowHits:0,interestMult:1,moon:1,midasN:0,phoenixN:0,windUsed:false};
  R.ups[VEH[veh].start]=1+rank('veteran');if(rank('ocstart'))R.ups.power=1;if(rank('kit'))R.ups.wind=1;
  startFort(1,true);
}
function xpNeed(n){return Math.round(8+6*(n-1)+.7*(n-1)*(n-1))}
function lv_(id){return R.ups[id]||0}
function stats(){
  const V=VEH[R.veh];
  const pow=(1+.15*lv_('power'))*Math.pow(1+val('collector'),R.relics.length)*(has('blackcard')?Math.pow(1.5,R.forts):1)*R.moon;
  const sn=Math.floor(R.snowHits/150),snow=has('snowball')===3?Math.pow(1.03,Math.floor(R.snowHits/300)):1+val('snowball')*sn;
  return{
    pow,snow,V,
    fireInt:V.fireInt/(1+.15*lv_('rapid'))*Math.pow(.94,rank('haste')),speed:V.speed*(1+.12*lv_('thrust')),
    shots:V.shots+lv_('twin'),
    weight:V.weight*(1+.25*lv_('might'))*(1+.1*rank('might'))*pow*(has('glass')?val('glass')[0]:1)*snow*R.interestMult,
    amp:lv_('amp')+rank('gatetune')+(has('hydra')?val('hydra')[0]:0)+(lim('gatekeeper')?2:0),breaker:Math.pow(2,lv_('breaker')),
    tough:1+.25*lv_('tough'),
    maxHp:Math.round((V.hp+30*rank('armor')+15*lv_('armor'))*(has('glass')?val('glass')[1]:1)),pips:lv_('armor')+rank('plating'),
    regen:.012*lv_('regen'),vamp:.001*lv_('vamp'),
    charge:(1+.4*lv_('charge'))*(has('singularity')?val('singularity'):1),
    evoM:lim('doubleevo')?2:1,
    orbit:lv_('orbit'),sawstorm:lv_('sawstorm'),zap:lv_('zap'),thunder:lv_('thunder'),bomb:lv_('bomb'),carpet:lv_('carpet'),mirror:lv_('mirror'),
    missile:lv_('missile'),swarm:lv_('swarm'),laser:lv_('laser'),deathray:lv_('deathray'),flame:lv_('flame'),inferno:lv_('inferno'),
    shield:lv_('shield'),aegis:lv_('aegis'),drones:lv_('drones'),hivemind:lv_('hivemind'),
    boomer:lv_('boomer'),glaive:lv_('glaive'),mines:lv_('mines'),minefield:lv_('minefield'),rail:lv_('rail'),massdriver:lv_('massdriver'),tesla:lv_('tesla'),reactor:lv_('reactor'),sentry:lv_('sentry'),fortress:lv_('fortress'),siphon:lv_('siphon'),guard:lv_('guard'),leechCap:(has('vampeng')?val('vampeng')[1]:0)+.02*lv_('siphon'),
    wing:lv_('wing'),kami:lv_('kami'),echo:lv_('echo'),hair:lv_('hair'),ricochet:lv_('ricochet'),channel:lv_('channel'),gravity:lv_('gravity'),absorb:lv_('absorb'),volatile:lv_('volatile'),cryo:lv_('cryo'),burn:lv_('burn'),
  };
}
function restat(){const before=S.st.maxHp;S.st=stats();S.cannon.hp=Math.min(S.st.maxHp,S.cannon.hp+Math.max(0,S.st.maxHp-before))}
function startFort(L,fresh){
  const prevHp=S&&!fresh?S.cannon.hp:null;
  const lv=makeLevel(L);
  const prevB=S&&S.biome;let bm=rnd(BIOMES);if(prevB&&BIOMES.length>1)while(bm===prevB)bm=rnd(BIOMES);
  const prevF=S&&S.fac;let fc=rnd(FACL);while(fc===prevF)fc=rnd(FACL);
  if(has('alchemy'))for(const g of lv.gates)if(g.t==='add'){const t=has('alchemy');if(t===1)g.v*=2;else{g.t='mul';g.v=t===2?Math.ceil(g.v/2)+1:g.v}}
  S={L,lv,t:0,running:false,over:false,players:[],enemies:[],sparks:[],bolts:[],booms:[],shells:[],bursts:[],
     bul:[],lasers:[],emit:[],decals:[],vfx:[],props:[],sent:[],tracers:[],orbs:[],arts:[],miss:[],pend:[],charge:0,hitsThisFort:0,sawp:[],traps:[],boomr:[],mine:[],rails:[],pulses:[],kamis:[],trail:[],echoQ:[],beams:[],cones:[],wings:[],caught:0,kamiT:3,trailT:0,burnMineT:0,firedW:0,lastHit:-9,rage:0,pips:0,pipT:0,healLeft:0,
     baseHP:lv.baseHP,baseMax:lv.baseHP,baseShake:0,fy:BASE_Y,ate:0,streamT:.5,atkT:1.8,
     cannon:{x:200,y:610,tx:200,ty:610,hp:0,cool:0,charge:0,inv:0,tm:{}},
     biome:bm,fac:fc,fw:174,mech:lv.mech||'',eliteT:L===1?15:9+Math.random()*6,shieldUp:false,waveT:5,waveN:0,keys:{},zapT:1,bombT:2,st:stats(),uw:lv.unitW,surge:0,siege:false,bl:0,gz:0,hurtBuff:0,popups:[]};
  S.cannon.hp=prevHp==null?S.st.maxHp:Math.min(S.st.maxHp,prevHp+S.st.maxHp*.3);
  S.healLeft=S.st.maxHp*(.12+.04*rank('repairs'));if(rank('salvo'))S.cannon.charge=1;S.pips=S.st.pips;
  for(const e of lv.initial)spawnEnemy(e.x,e.y,e.w,e.brute);
  if(lv.mech==='shield'){spawnPylons();S.shieldUp=true}
  S.mods=pickMods(L,lv,bm);modsInit();seedDecals();
  if(R.live)saveRun();
  syncMirror();buildBG();weather=[];
  updateHud(true);renderOwned();
  CUT=null;CUTQ.length=0;S.introD=S.introT=fresh?2.6:2.2;
  g3pre(fc.id);g3('k_'+fc.id);g3('gpost');g3('q_'+R.veh);g3('q_missile');g3('pylon');
  cutIn({title:lv.boss?MECH[lv.mech].n.toUpperCase():'GATEKEEP '+L,sub:`${bm.name} · ${fc.name}`,line:lv.boss?MECH[lv.mech].short:`"${rnd(TAUNT[fc.id])}"`,col:fc.glow,portrait:portraitFoe(fc),weak:(META.rec.runs||0)>=1?FWEAK[fc.id]:null,dur:S.introD-.3});
  shout(fresh?'RUSH!':lv.boss?'BREAK IT!':'GO!',fc.glow,.8);
  for(const m of S.mods)cutIn({small:1,y:.205,title:MODS[m].n.toUpperCase(),sub:'Keep condition',line:MODS[m].d,col:'#ffb43a',dur:2.6});
  {const el=$('mods');if(el)el.textContent=[LAYN[lv.kind]].concat(S.mods.map(m=>MODS[m].n)).join(' · ')}
  {const w=FWEAK[fc.id][0],el=$('weak');if(el){el.innerHTML=`<span style="color:${DTC[w]}">${DTN[w]}</span>`;if(el.parentElement)el.parentElement.hidden=!((META.rec.runs||0)>=1)}}
  if(S.shieldUp)guide('pylon');if(S.mods.length)guide('mods');if((META.rec.runs||0)>=1)guide('weak');if(L===1&&!META.tut&&!((META.rec.runs||0)>0))tutStart();
}
function syncMirror(){
  const m=S.st.mirror;S.lv.gates=S.lv.gates.filter(g=>!g.follow);
  if(m>0){const hw=22+5*m;S.lv.gates.push({id:29,x1:200-hw,x2:200+hw,y:S.cannon.y-60,t:'mul',v:m>=4?3:2,follow:true,amp:0,spd:1,ph:0,flash:0,dead:false,bonus:0})}
}
function radius(w,brute){const u=S?S.uw:1;const r=w/u;return brute?13+Math.min(6,Math.log10(Math.max(1,r))*2):3.6+Math.min(5,Math.log10(r+1)*1.5)}
function spawnPlayer(x,y,w,mask,big){
  if(S.players.length>=P_CAP)return null;
  const u={x,y,py:y,w,mask:mask|0,vx:(Math.random()-.5)*14,big:!!big,side:0,gates:0};S.players.push(u);return u;
}
const bulletDmg=()=>S.st.V.hp*(.085+.005*S.L)*(S.siege?1.5:1);
function heal(a){if(!(a>0)||S.healLeft<=0)return;const c=S.cannon,h=Math.min(a,S.healLeft,S.st.maxHp-c.hp);if(h>0){c.hp+=h;S.healLeft-=h}}
// enemy roster: [type, first fort, weight ×, speed ×]
const FOES={
  runner:{n:'Runners',from:1,w:.5,sp:2.2,col:'#ff9f1a',tip:'fast, they rush you'},
  gunner:{n:'Gunners',from:2,w:2.5,sp:1,col:'#8b5cf6',tip:'they stop and shoot'},
  splitter:{n:'Splitters',from:3,w:1.5,sp:.9,col:'#22c55e',tip:'they split in three when crushed'},
  armored:{n:'Armored',from:4,w:1.5,sp:.75,col:'#64748b',tip:'blobs barely dent them, use weapons'},
  bomber:{n:'Bombers',from:5,w:.8,sp:1.35,col:'#2b2b33',tip:'they explode, wiping blobs and hurting you'},
  saboteur:{n:'Saboteurs',from:3,w:1.2,sp:.9,col:'#f472b6',tip:'they sit on your gates and capture them'},
  phantom:{n:'Phantoms',from:7,w:1,sp:1,col:'#a78bfa',tip:'blobs pass through them while they flicker'},
  totem:{n:'Totems',from:8,w:3,sp:.8,col:'#14b8a6',tip:'they plant themselves and heal the horde'},
};
const FOE_CAP={gunner:L=>3+Math.floor(L/3),saboteur:L=>2+Math.floor(L/5),totem:L=>1+Math.floor(L/8)};
function spawnEnemy(x,y,w,brute,t){
  if(S.enemies.length>=E_CAP){const e=S.enemies[(Math.random()*S.enemies.length)|0];e.w+=w;e.max+=w;return}
  const L=S?S.L:1,F=t?FOES[t]:null;
  const e={x,y,w,max:w,brute:!!brute,t:t||'',sp:(brute?24:38+Math.random()*16)*Math.min(1.6,1+.035*(L-1))*(F?F.sp:1),wob:Math.random()*6.28,shotT:1+Math.random()*2};
  if(t==='gunner')e.stopY=S.fy+110+Math.random()*180;
  if(t==='totem')e.stopY=S.fy+70+Math.random()*120;
  if(t==='phantom')e.phT=Math.random()*1.2;
  S.enemies.push(e);
  if(t&&R&&!R.seen[t]&&S.running!==false){R.seen[t]=1;if(guide(t))cue('newfoe')}
  if(brute&&S.running!==false&&!guideSeen('brute'))guide('brute');
  return e;
}
function pickFoe(){
  const L=S.L,pool=Object.entries(FOES).filter(([k,f])=>L>=f.from);
  if(!pool.length||Math.random()>Math.min(.55,.2+.03*L))return '';
  const bias=fac().bias.filter(b=>FOES[b]&&L>=FOES[b].from);
  const k=bias.length&&Math.random()<.45?rnd(bias):rnd(pool)[0];
  if(FOE_CAP[k]&&S.enemies.filter(e=>e.t===k).length>=FOE_CAP[k](L))return '';
  return k;
}
function foeDies(e){
  if(e.t==='splitter'&&!e.child){for(let i=0;i<3;i++){const c2=spawnEnemy(e.x+(i-1)*10,e.y+4,e.max*.35,false,'');if(c2)c2.child=1}}
  if(e.t==='bomber'){
    S.booms.push({x:e.x,y:e.y,r:44,life:.35});blip(60,.2,'sawtooth',.06);
    for(const u of S.players)if(!u.big&&(u.x-e.x)**2+(u.y-e.y)**2<44*44)u.w=0;
    if(Math.hypot(S.cannon.x-e.x,S.cannon.y-e.y)<44+S.st.V.hit)hitPlayer(bulletDmg()*1.2);
  }
}
function spark(x,y,c,n=3){const cap=LQ()?110:260;for(let i=0;i<n&&S.sparks.length<cap;i++)S.sparks.push({x,y,vx:(Math.random()-.5)*120,vy:(Math.random()-.5)*120,life:.35,c})}
function popup(x,y,t,c){if(/^[+-]?\d/.test(t)&&S.popups.filter(p=>!p.sfx&&/^[+-]?\d/.test(p.t)).length>=5)return;if(S.popups.length<10)S.popups.push({x,y,t,c,life:.9})}
const underdog=()=>has('underdog')&&S.cannon.hp<S.st.maxHp*.5?val('underdog'):1;
function dmgMult(){return underdog()*(1+S.gz)*(1+S.hurtBuff)*(1+.0125*S.rage)}
function hurt(e,amt,melee){
  const wpn=!!melee;
  if(wpn&&S.st.cryo&&e.w>0)e.slowT=2;
  if(e.w<=0)return 0;const dm=dmod(e,!wpn);amt*=dm;if(wpn)amt*=clsMul();
  if(wpn&&dm>1.3&&S.t-(S.weakT??-9)>.45){S.weakT=S.t;sfxText(e.x,e.y-12,'WEAK!',DTC[DTY],1)}else if(wpn&&dm<.7&&S.t-(S.resT??-9)>1.4){S.resT=S.t;popup(e.x,e.y-12,'resisted','#8a98a8')}
  const d=Math.min(e.w,amt);e.w-=d;
  if(has('mirrorfort'))hitKeep(d*val('mirrorfort'),e.x);
  const units=d/e.max*(e.elite?25:e.pylon?15:e.brute?10:1);
  if(wpn&&WCL==='close'&&S.zone==='close'){const k=(has('vampeng')?val('vampeng')[0]:0)+.006*S.st.siphon;if(k)leech(units*k*S.st.maxHp);fortMelee(d*.15)}
  R.xp+=units*(1+.1*rank('xp'));
  if(S.st.vamp)heal(units*S.st.vamp*S.st.maxHp);
  if(e.w<=1e-6&&!e.dead){
    e.dead=true;R.kills+=e.brute?10:1;if(e.courier&&e.courier.t>0){const n=3+Math.floor(S.L/3);R.coins+=n;sfxText(e.x,e.y-12,'+'+n+' COINS!','#ffcf2e',1);playS('coin',.8)||cue('taken');award('bounty')}if(wpn&&dm>1.3){R.weakKills=(R.weakKills||0)+1;if(R.weakKills>=300)award('weak300')}if(e.elite){R.elites=(R.elites||0)+1;META.rec.elites=(META.rec.elites||0)+1;award('elite1');if(META.rec.elites>=10)award('elite10');sfxText(e.x,e.y-20,'K.O.!','#ffcf2e',1);hitStop(.12);S.booms.push({x:e.x,y:e.y,r:60,life:.5});S.shake=Math.max(S.shake||0,10);cue('taken')}
    if(melee===1){S.rage=Math.min(S.rage+(e.brute?5:1),40+40*lv_('berserk'));if(has('bloodmoon')){R.moon*=e.brute?1.01:1.002;S.moonDirty=1}}
    if(has('bloodlust')){const v=val('bloodlust');S.bl=Math.min(v[1],S.bl+v[0])}
    if(has('shrapnel')&&S.bursts.length<80)S.bursts.push({x:e.x,y:e.y,dmg:e.max*val('shrapnel'),r:e.brute?45:24});
    if(has('midas')){const q=val('midas');R.midasN+=e.brute?q:1;while(R.midasN>=q){R.midasN-=q;R.coins++;popup(e.x,e.y,'+1¢','#ffcf2e')}}
    if(has('phoenix')){R.phoenixN+=e.brute?10:1;if(R.phoenixN>=100){R.phoenixN-=100;heal(S.st.maxHp*val('phoenix'))}}
    if(e.t)foeDies(e);
    if(wpn&&S.st.volatile&&S.bursts.length<120)S.bursts.push({x:e.x,y:e.y,dmg:e.max*[.25,.4,.6][S.st.volatile-1],r:e.brute?50:30,wpn:1});
    if(e.brute){spark(e.x,e.y,'#ffcf2e',24);blip(110,.25,'sawtooth',.06)}
  }
  return d/dm;
}
function popcount(m){let c=0;while(m){c+=m&1;m>>>=1}return c}
function fortMult(){
  let m=has('ram')?val('ram'):1;
  if(has('executioner'))m*=1+val('executioner')*clamp(1-S.baseHP/S.baseMax,0,1);
  if(has('daredevil'))m*=1+val('daredevil')*clamp(1-(S.cannon.y-S.fy-50)/(Y_MAX-200),0,1);
  if(has('polychrome'))m*=Math.pow(1.5,R.relics.length);
  return m*dmgMult()*shieldMul();
}
function fortMelee(d){const dmg=d*fortMult();hitKeep(dmg,S.cannon.x);if(!(dmg<Infinity)&&!S.twin)S.baseHP=-Infinity;S.baseShake=.08;if(Math.random()<.05)spark(S.cannon.x+(Math.random()-.5)*40,S.fy,'#ffb02e',3)}
function fortHit(u){
  let m=has('ram')?val('ram'):1;
  if(has('echo')){const v=val('echo'),n=u.gates;if(v[0])m*=n>=v[0]?v[1]:1;else m*=Math.pow(v[1],n)}
  if(has('crowd'))m*=1+val('crowd')*S.players.length;
  if(has('executioner'))m*=1+val('executioner')*clamp(1-S.baseHP/S.baseMax,0,1);
  if(has('daredevil'))m*=1+val('daredevil')*clamp(1-(S.cannon.y-S.fy-50)/(Y_MAX-200),0,1);
  if(has('polychrome'))m*=Math.pow(1.5,R.relics.length);
  m*=dmgMult()*shieldMul();
  const dmg=u.w*m;hitKeep(dmg,u.x);if(!(dmg<Infinity)&&!S.twin)S.baseHP=-Infinity;
  if(dmg>META.rec.bestHit){META.rec.bestHit=dmg;if(dmg>=1e6)award('mil')}
  if(has('snowball')){const before=Math.floor(R.snowHits/150);R.snowHits++;if(Math.floor(R.snowHits/150)>before){restat();popup(200,S.fy+20,'Snowball!','#8fe7ff')}}
  return dmg;
}
function buzz(p){if(SET.vib&&navigator.vibrate)try{navigator.vibrate(p)}catch(e){}}
function hitPlayer(d,src){
  const c=S.cannon;if(c.inv>0||S.over)return;
  S.lastHit=S.t;
  if(S.pips>0){S.pips--;c.inv=.35+.08*rank('reflex');popup(c.x,c.y-30,'BLOCKED','#9df0bf');vfx({k:'circle_02',x:c.x,y:c.y-4,s0:30,s1:56,dur:.35,col:'#9df0bf',add:1});if(!playS('block',.6))blip(900,.08,'triangle',.05);return}
  if(S.zone==='close'){d*=(1-(has('thorns')?val('thorns'):0))*(1-.12*S.st.guard);
    if(has('riot')&&!(S.riotT>S.t)){S.riotT=S.t+3;const r=val('riot');for(const b of S.bul)if(b.life>0&&!b.hard&&(b.x-c.x)**2+(b.y-c.y)**2<r*r)killBullet(b);S.pulses.push({x:c.x,y:c.y,r,life:.3});sfxText(c.x,c.y-30,'RIOT!','#ffb43a',1)}
    if(has('undying')&&c.hp-d*(lim('hull')?.65:1)<=0&&!(S.undyT>0)){d=Math.max(0,c.hp-1);S.undyT=20;S.undyNow=1;sfxText(c.x,c.y-36,'UNDYING!','#ff3b4e',1);award('undying');hitStop(.15)}}
  d*=lim('hull')?.65:1;S.hits=(S.hits||0)+1;S.hitsThisFort++;
  buzz(35);playS('hit',.7,.9+Math.random()*.2);if(TUT)d*=.35;c.hp-=d;c.inv=S.undyNow?1.5:.35+.08*rank('reflex');S.undyNow=0;S.shake=Math.max(S.shake||0,7);S.hurtFx=1;S.baseShake=.15;popup(c.x,c.y-30,'-'+Math.round(d),'#ff5050');blip(60,.12,'sawtooth',.06);
  if(has('phoenix'))S.hurtBuff=Math.min(1,S.hurtBuff+val('phoenix'));
  if(c.hp<=0&&lim('wind')&&!R.windUsed){R.windUsed=true;c.hp=S.st.maxHp*.4;c.inv=2;toast('Second Wind!',1500,2);S.bul=[]}
}

