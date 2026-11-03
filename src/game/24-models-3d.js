// ---------- 3D-rendered models: CC0 Kenney Space Kit, Kenney Tower Defense Kit, KayKit Space Base and KayKit Combat Mech,
// re-skinned in sleek gunmetal with glowing trim and pre-rendered to sprite sheets (gfx3d/). Sheets load on demand,
// each frame is cached once at the size it is drawn so a big source image is never scaled per frame.
const G3RIDES=['cannon','jet','tank','saucer','hive','robot'];
const G3PAINTS=['ocean','crimson','jade','royal','sunset','sakura','toxic','midnight','arctic','inferno','void','gold'];
const G3FOES=['base','runner','gunner','splitter','armored','bomber','saboteur','phantom','totem'];
const G3D={base:'gfx3d/',img:{},st:{},mip:{},n:0};
function g3(name){
  const s=G3D.st[name];if(s===1)return G3D.img[name];if(s!==undefined)return null;
  if(typeof Image==='undefined'||typeof document==='undefined'){G3D.st[name]=-1;return null}
  G3D.st[name]=0;const im=new Image();im.decoding='async';
  im.onload=()=>{G3D.st[name]=1;if(name==='r_icons')g3refresh()};im.onerror=()=>{G3D.st[name]=-1};
  im.src=G3D.base+name+'.png';G3D.img[name]=im;return null}
function g3refresh(){try{if(!$('ovStart').hidden){renderShop();renderGarage()}}catch(e){}}
const G3B=[24,32,48,64,96,128,160,192,256,320,384];
function g3cell(name,cell,col,row,want){
  const im=g3(name);if(!im||col<0||row<0)return null;
  let b=G3B[G3B.length-1];for(const v of G3B)if(v>=want){b=v;break}b=Math.min(b,cell);
  const key=name+'|'+col+'|'+row+'|'+b;let c=G3D.mip[key];if(c)return c;
  let src=im,sx=col*cell,sy=row*cell,sw=cell;
  while(sw/2>=b*1.25){const h=Math.round(sw/2),t=mk(h,h),tg=t.getContext('2d');if(!tg||!tg.drawImage)return null;tg.imageSmoothingQuality='high';tg.drawImage(src,sx,sy,sw,sw,0,0,h,h);src=t;sx=0;sy=0;sw=h}
  c=mk(b,b);const g=c.getContext('2d');if(!g||!g.drawImage)return null;g.imageSmoothingQuality='high';g.drawImage(src,sx,sy,sw,sw,0,0,b,b);
  if(++G3D.n>700){G3D.mip={};G3D.n=0}G3D.mip[key]=c;return c}
const G3DPR=()=>(typeof DPR==='number'?DPR:1);
function g3paint(){const p=cosSel('paint');return p&&G3PAINTS.includes(p.id)?p.id:'ocean'}
// the player's ride, seen from behind; tilt picks one of five banked frames
function drawRide3D(g,type,paint,tilt,z,fin){
  const S3=84*z,i=Math.max(0,Math.min(4,Math.round(2-(tilt||0)/.3*2)));
  const c=g3cell('r_'+type+'_'+paint,384,i,0,S3*G3DPR());if(!c)return false;
  drawFinished(g,c,-S3/2,-S3*.66,S3,S3,fin,S&&S.t);return true}
function drawRideIcon(g,type,paint,x,y,z,fin){
  const cv=g.canvas,W=cv.width,H=cv.height,S3=Math.min(W*1.3,H*1.3),c=g3cell('r_icons',160,G3PAINTS.indexOf(paint),G3RIDES.indexOf(type),S3);if(!c)return false;
  g.save();g.setTransform(1,0,0,1,0,0);drawFinished(g,c,(W-S3)/2,(H-S3)/2+H*.02,S3,S3,fin,1.3);g.restore();return true}
// elite challengers fly the same machines, turned to face you, in their faction's colours
function drawElite3D(k,fid,vx,x,y,zz){
  const S3=74*zz,i=vx>90?2:vx<-90?0:1,c=g3cell('e_'+fid,320,i,G3RIDES.indexOf(k),S3*G3DPR());if(!c)return false;
  ctx.drawImage(c,x-S3/2,y-S3*.6,S3,S3);return true}
function foe3D(fid,t,fr,want){return g3cell('m_'+fid,256,fr&1,Math.max(0,G3FOES.indexOf(t||'base')),want)}
function bruteMark(x,y,S3,bob){
  if(!LQ()){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55;ctx.drawImage(glowSprite('rgb(255,190,40)'),x-S3*.55,y-S3*.3-bob,S3*1.1,S3*.55);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  const cy=y-S3*.8-bob,w=S3*.09;ctx.fillStyle='#ffcf2e';ctx.strokeStyle='rgba(0,0,0,.85)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(x-w*2,cy+w);ctx.lineTo(x-w*2,cy-w*.6);ctx.lineTo(x-w,cy+w*.1);ctx.lineTo(x,cy-w*1.2);ctx.lineTo(x+w,cy+w*.1);ctx.lineTo(x+w*2,cy-w*.6);ctx.lineTo(x+w*2,cy+w);ctx.closePath();ctx.fill();ctx.stroke()}
// engineer sentry: 16 pre-rendered headings
function turret3D(x,y,s,aim){
  const i=((Math.round((Math.PI/2-aim)/(Math.PI*2)*16)%16)+16)%16,c=g3cell('turret',192,i,0,s*G3DPR());if(!c)return false;
  ctx.drawImage(c,x-s/2,y-s*.62,s,s);return true}
// set dressing beside the keep
function seed3DProps(){S.props3=[];const L=S.L||1;
  const pick=[[3,7,6],[4,8,5],[8,14,9],[13,4,6],[7,3,12],[14,5,3]][(L*7)%6];
  const spots=[[-20,6,1.2],[420,10,1.15],[-14,60,.9],[414,70,.95]];
  spots.forEach((sp,i)=>{if(i>=2&&Math.random()<.4)return;S.props3.push({i:pick[i%3],x:sp[0]+(Math.random()-.5)*8,dy:sp[1],s:sp[2]})})}
function drawProps3D(K){if(!S.props3)return;for(const p of S.props3){const y=S.fy+p.dy,z=sc(y)*K,S3=58*z*p.s,c=g3cell('props',256,p.i,0,S3*G3DPR());if(!c)continue;
  ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.ellipse(px(p.x,y),py(y),S3*.36,S3*.11,0,0,6.283);ctx.fill();ctx.drawImage(c,px(p.x,y)-S3/2,py(y)-S3*.72,S3,S3)}}
function g3pre(fid){g3('e_'+fid);g3('m_'+fid);g3('props')}
// your shots ("blobs"): one 3D projectile per ride, in every blob colour; spinning ones have four frames
const G3PC=['#2fc4e8','#7ad63a','#ff7ac2','#9b6bff','#ff9a3c','#e6eeff','#ffd76a','#ffffff'];
const G3SPIN={robot:1,saucer:1,hive:1};
function proj3D(veh,col,want){const ci=G3PC.indexOf(col);if(ci<0)return null;const fr=G3SPIN[veh]?((performance.now()/55)|0)%4:0;
  return g3cell('q_'+veh,160,fr,ci,want)}
function missile3D(kind,x,y,s,rot){const c=g3cell('q_missile',160,kind,0,s*G3DPR());if(!c)return false;
  ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(c,-s/2,-s/2,s,s);ctx.restore();return true}
function pylon3D(x,y,z){const s=52*z,c=g3cell('pylon',256,0,0,s*G3DPR());if(!c)return false;ctx.drawImage(c,x-s/2,y-s*.86,s,s);return true}
