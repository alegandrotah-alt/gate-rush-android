// ---------- fort attacks: the pool widens and speeds up fort by fort ----------
function addBullet(x,y,vx,vy,o={}){if(S.bul.length>=B_CAP)return;S.bul.push({x,y,vx,vy,r:o.r||5,dmg:o.dmg||bulletDmg(),home:o.home||0,life:o.life||9,col:o.col||0,hard:!!o.hard,hp:o.hp||0});if(S.running){if(o.hard){if(!guideSeen('hard'))guide('hard')}else if(!guideSeen('bullets')&&!TUT)guide('bullets')}}
function aimAt(x,y){const c=S.cannon;return Math.atan2(c.y-y,c.x-x)}
const TUR=[70,150,250,330];
function attackPool(){
  const L=S.L+(S.lv.boss?2:0);const p=['aimed','mortar'];
  p.push('spread');if(L>=2)p.push('ring');if(L>=3)p.push('rain');if(L>=4)p.push('spiral');if(L>=5)p.push('laser');if(L>=6)p.push('homing');if(L>=8)p.push('wall');
  return p;
}
function fortAttack(kind){
  const L=S.L,c=S.cannon,y0=S.fy+8,sp=(1+.05*(L-1))*(lim('btime')?.7:1);
  if(kind==='aimed'){const n=1+Math.floor(L/3);for(let i=0;i<n;i++){const x=turX(rnd(liveTur())),a=aimAt(x,y0)+(Math.random()-.5)*.12;addBullet(x,y0,Math.cos(a)*170*sp,Math.sin(a)*170*sp)}}
  else if(kind==='spread'){const x=turX(rnd(liveTur())),n=Math.min(15,5+Math.floor(L/2)),a0=aimAt(x,y0),arc=.9;for(let i=0;i<n;i++){const a=a0-arc/2+arc*i/(n-1);addBullet(x,y0,Math.cos(a)*140*sp,Math.sin(a)*140*sp,{col:1})}}
  else if(kind==='ring'){const x=60+Math.random()*280,n=Math.min(40,12+2*L),off=Math.random();for(let i=0;i<n;i++){const a=(i+off)/n*6.283;if(Math.sin(a)<-.2)continue;addBullet(x,y0,Math.cos(a)*115*sp,Math.abs(Math.sin(a))*115*sp+20,{col:2,hard:1})}}
  else if(kind==='rain'){const n=Math.min(45,10+2*L);for(let i=0;i<n;i++){const x=40+Math.random()*320;addBullet(x,y0-Math.random()*60,(Math.random()-.5)*30,(90+Math.random()*90)*sp,{r:4,col:3})}}
  else if(kind==='spiral'){S.emit.push({x:120+Math.random()*160,y:y0,ang:Math.random()*6.28,spin:(Math.random()<.5?-1:1)*(2.4+.1*L),arms:Math.min(5,2+Math.floor(L/5)),rate:Math.max(.05,.11-.003*L),acc:0,t:2.6+.1*L,sp:120*sp})}
  else if(kind==='laser'){cue('laser');const n=L>=12?2:1;guide('laser');for(let i=0;i<n;i++)S.lasers.push({x:i?clamp(c.x+(Math.random()<.5?-90:90),40,360):c.x,t:0,warn:1.05,dur:.55,w:16+L*.6})}
  else if(kind==='homing'){const n=1+Math.floor(L/5);for(let i=0;i<n;i++)addBullet(turX(rnd(liveTur())),y0,(Math.random()-.5)*60,60,{r:7,home:2.2,life:6,col:4,hp:3})}
  else if(kind==='wall'){const gap=60+Math.random()*280,n=26;for(let i=0;i<n;i++){const x=30+i*13.4;if(Math.abs(x-gap)<34)continue;addBullet(x,y0,0,100*sp,{r:5,col:2,hard:1})}}
  else if(kind==='mortar'){const n=L>=8?2:1;for(let i=0;i<n;i++){const tx=clamp(c.x+(i?(Math.random()<.5?-60:60):0),45,355),ty=clamp(c.y+(Math.random()-.5)*30,Y_MIN,Y_MAX);guide('mortar');S.mortarN=(S.mortarN||0)+1;S.arts.push({x0:200+(Math.random()-.5)*200,y0:S.fy,x:tx,y:ty,t:0,dur:1.35})}}
}

