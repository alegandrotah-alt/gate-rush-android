// ---------- update ----------
function gateX(g){return g.follow?S.cannon.x-200:g.amp?Math.sin(S.t*g.spd+g.ph)*g.amp:0}
function gateMul(g){const v=g.follow?g.v+(has('hydra')?val('hydra')[0]:0):g.v+S.st.amp+(g.bonus||0)+(has('gateeng')&&g.own>0&&!g.follow&&g.t==='mul'?val('gateeng')[0]:0);return has('infmirror')?v*v:v}
function sendWave(secs,brutes){
  const lv=S.lv;
  let B=12*Math.pow(2.15,S.L-1)*(1+S.t/35);
  if(S.siege)B*=Math.pow(1.5,(S.t-lv.T)/2);
  const total=B*secs;
  const crowded=S.enemies.length>450;
  const n=Math.max(1,Math.min(crowded?25:90,Math.round((6+2*S.L)*(1+S.t/45)*secs/1.8)));
  const w=total/n;S.uw=S.uw*.7+w*.3;
  const lane=rnd(lv.spawnLanes),cx=lane[0]+Math.random()*(lane[1]-lane[0]);
  for(let i=0;i<n;i++){
    const ln=rnd(lv.spawnLanes);const x=Math.random()<.65?ln[0]+Math.random()*(ln[1]-ln[0]):cx+(Math.random()-.5)*(60+n);
    const ft=pickFoe();spawnEnemy(clamp(x,ln[0],ln[1]),S.fy+4+Math.random()*40,w*(ft?FOES[ft].w:1),false,ft);
  }
  for(let b=0;b<brutes;b++){const bx=lane[0]+12+Math.random()*(lane[1]-lane[0]-24);spawnEnemy(bx,S.fy+12,B*4.5,true)}
}
