// ---------- Kenney CC0 assets (kenney.nl, public domain): particle textures, meteors, missiles, decals and sound effects ----------
const AT={};var ATOK=0;
(function atlasInit(){if(typeof Image==='undefined')return;for(const k of ['fx','obj']){const im=new Image();im.onload=()=>{AT[k]=im;ATOK++};im.src=ATLIMG[k]}})();
const TCACHE={};
function tinted(name,col){
  const key=name+(col||'');if(TCACHE[key]!==undefined)return TCACHE[key];
  const sheet=ATLAS.fx[name]?'fx':'obj',r=ATLAS[sheet][name];if(!r||!AT[sheet])return null;
  const [x,y,w,h]=r,c=mk(w,h),g=c.getContext('2d');if(!g||!g.drawImage)return TCACHE[key]=null;
  g.drawImage(AT[sheet],x,y,w,h,0,0,w,h);
  if(col){g.globalCompositeOperation='multiply';g.fillStyle=col;g.fillRect(0,0,w,h);g.globalCompositeOperation='destination-in';g.drawImage(AT[sheet],x,y,w,h,0,0,w,h)}
  return TCACHE[key]=c;
}
function dspr(name,col,x,y,w,h,rot,alpha,add){const c=tinted(name,col);if(!c)return false;
  const ga=ctx.globalAlpha,go=ctx.globalCompositeOperation;if(add)ctx.globalCompositeOperation='lighter';if(alpha!=null)ctx.globalAlpha=alpha;
  if(rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(c,-w/2,-h/2,w,h);ctx.restore()}else ctx.drawImage(c,x-w/2,y-h/2,w,h);
  ctx.globalAlpha=ga;ctx.globalCompositeOperation=go;return true}
const FXOK=()=>ATOK>=2;
// visual effects live in screen-independent world space and are advanced by the render clock
function vfx(o){if(!S.vfx)S.vfx=[];if(S.vfx.length>(LQ()?50:150))return;o.t=0;S.vfx.push(o)}
function boomFx(b){
  const r=b.r||24,big=r>=34;
  vfx({k:'flare_01',x:b.x,y:b.y,s0:r*2.4,s1:r*3.2,dur:.22,col:'#ffd8a0',add:1});
  vfx({k:'fire_01',x:b.x,y:b.y,s0:r*1.4,s1:r*2.4,dur:.38,col:'#ff8a2a',add:1,rot:Math.random()*6});
  vfx({k:'circle_02',x:b.x,y:b.y,s0:r*.8,s1:r*3,dur:.32,col:'#ffe8c0',add:1,flat:1});
  if(!LQ()){for(let i=0;i<(big?3:2);i++)vfx({k:rnd(['smoke_01','smoke_04','smoke_07']),x:b.x+(Math.random()-.5)*r*.6,y:b.y+(Math.random()-.5)*r*.3,s0:r*1.2,s1:r*2.6,dur:1.1+Math.random()*.6,col:'#4a403a',a0:.75,rot:Math.random()*6,vr:(Math.random()-.5)*.8,rise:22+Math.random()*16});
    vfx({k:'dirt_02',x:b.x,y:b.y,s0:r*1.2,s1:r*2.2,dur:.45,col:'#5a4a3a',a0:.8,rot:Math.random()*6})}
  if(r>=24&&S.decals&&S.decals.length<40)S.decals.push({k:rnd(['scorch_01','scorch_02','scorch_03']),x:b.x,y:b.y,s:r*2.2,a:.55,rot:Math.random()*6,t:9});
  if(S.t-(S.boomSfx||-9)>.07){S.boomSfx=S.t;playS(big?'boomBig':'boom',big?.7:.45,.85+Math.random()*.3)}
}
function drawVfx(dtR,K){
  if(!S.vfx||!S.vfx.length||!FXOK())return;
  for(const v of S.vfx){v.t+=dtR;const p=Math.min(1,v.t/v.dur),z=sc(v.y)*K,x=px(v.x,v.y),y=py(v.y)-(v.rise||0)*p*z-4*z,s=(v.s0+(v.s1-v.s0)*(1-Math.pow(1-p,2)))*z;
    const a=(v.a0??1)*(1-p)*(v.add?1:Math.min(1,v.t/.12));if(v.vr)v.rot+=v.vr*dtR;
    dspr(v.k,v.col,x,y,s,v.flat?s*.45:s,v.rot||0,Math.max(0,a),v.add)}
  S.vfx=S.vfx.filter(v=>v.t<v.dur);
}
function drawDecals(K){
  if(!S.decals||!S.decals.length||!FXOK())return;
  for(const d of S.decals){const z=sc(d.y)*K;if(d.t!=null){d.t-=FRAME_DT;if(d.t<=0)continue}const a=d.a*(d.t!=null?Math.min(1,d.t/3):1);dspr(d.k,d.col||null,px(d.x,d.y),py(d.y),d.s*z,d.s*z*.45,d.rot,a,0)}
  S.decals=S.decals.filter(d=>d.t==null||d.t>0);
}
function seedDecals(){
  S.decals=[];S.vfx=[];S.props=[];seed3DProps();
  for(let i=0;i<3+((Math.random()*4)|0);i++)S.decals.push({k:rnd(['oilL','oilS','scorch_02','scorch_03','tracks']),x:40+Math.random()*320,y:S.fy+120+Math.random()*(Y_MAX-S.fy-140),s:30+Math.random()*30,a:.4,rot:Math.random()*6});
  for(const x of [52,92,308,348])if(Math.random()<.7)S.props.push({k:Math.random()<.6?'barricade':'crate',x:x+(Math.random()-.5)*14,dy:14+Math.random()*10,rot:(Math.random()-.5)*.4});
}
function drawProps(K){if(!S.props||!FXOK())return;for(const p of S.props){const y=S.fy+p.dy,z=sc(y)*K;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(px(p.x,y),py(y)+2*z,13*z,4*z,0,0,6.283);ctx.fill();dspr(p.k,null,px(p.x,y),py(y)-6*z,22*z,22*z,p.rot)}}
function drawSparksFx(K){
  for(const p of S.sparks){const z=sc(p.y)*K,x=px(p.x,p.y),y=py(p.y);
    if(p.smoke){if(!dspr('smoke_04','#3a3438',x,y,(14-p.life*7)*z,(14-p.life*7)*z,p.x,Math.max(0,p.life)*.7)){ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(x,y,(9-p.life*5)*z,0,6.283);ctx.fill();ctx.globalAlpha=1}continue}
    const a=Math.max(0,Math.min(1,p.life/.35));
    if(p.c&&p.c[0]==='#'&&!LQ()&&dspr('star_08',p.c,x,y,9*z,9*z,p.life*8,a,1))continue;
    ctx.globalAlpha=a;ctx.fillStyle=p.c;ctx.fillRect(x-1.6*z,y-1.6*z,3.2*z,3.2*z)}
  ctx.globalAlpha=1;
}
