// ---------- render ----------
// ---------- render: cached backdrop, sprites, glow ----------
const specks=[];for(let i=0;i<320;i++)specks.push({x:-240+Math.random()*880,y:-40+Math.random()*760,s:Math.random(),k:Math.random()<.14?'bush':Math.random()<.12?'rock':'dot'});
const mk=(w,h)=>{const c2=document.createElement('canvas');c2.width=w;c2.height=h;return c2};
let BG=null,GRAIN=null;
function quad(x1,y1,x2,y2,fill,g){g=g||ctx;g.beginPath();g.moveTo(px(x1,y1),py(y1));g.lineTo(px(x2,y1),py(y1));g.lineTo(px(x2,y2),py(y2));g.lineTo(px(x1,y2),py(y2));g.closePath();g.fillStyle=fill;g.fill()}
// shading helpers shared by every model: a lit cylinder, a lit sphere, a vertical gradient, a glowing light
function cylG(g,x,y,w,h,col){const gr=g.createLinearGradient(x,0,x+w,0);gr.addColorStop(0,shade(col,-.55));gr.addColorStop(.16,shade(col,-.55));gr.addColorStop(.17,shade(col,.5));gr.addColorStop(.3,shade(col,.5));gr.addColorStop(.31,col);gr.addColorStop(.7,col);gr.addColorStop(.71,shade(col,-.4));gr.addColorStop(1,shade(col,-.5));g.fillStyle=gr;g.fillRect(x,y,w,h)}
function sph(g,x,y,r,col,ry){ry=ry||r;const gr=g.createRadialGradient(x-r*.35,y-ry*.4,0,x-r*.12,y-ry*.12,r*1.15);gr.addColorStop(0,shade(col,.75));gr.addColorStop(.14,shade(col,.75));gr.addColorStop(.15,shade(col,.18));gr.addColorStop(.6,shade(col,.08));gr.addColorStop(.61,shade(col,-.35));gr.addColorStop(1,shade(col,-.45));g.fillStyle=gr;g.beginPath();g.ellipse(x,y,r,ry,0,0,6.283);g.fill()}
function vgrad(g,y0,y1,c0,c1){const gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,c0);gr.addColorStop(1,c1);return gr}
function glowDot(g,x,y,r,col){const gr=g.createRadialGradient(x,y,0,x,y,r*2.4);gr.addColorStop(0,'#ffffff');gr.addColorStop(.28,col);gr.addColorStop(1,hexA(col,0));g.fillStyle=gr;g.beginPath();g.arc(x,y,r*2.4,0,6.283);g.fill()}
function buildBG(){
  if(!W||!H)return;const B=biome();BG=mk(Math.round(W*DPR),Math.round(H*DPR));const g=BG.getContext('2d');if(!g||!g.setTransform)return;g.setTransform(DPR,0,0,DPR,0,0);
  let seed=B.id.length*97+B.id.charCodeAt(0)*13+3;const rr=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
  const hy=gy+30;
  // deep-space sky
  const sk=g.createLinearGradient(0,0,0,hy);sk.addColorStop(0,B.sky[0]);sk.addColorStop(.6,B.sky[1]);sk.addColorStop(1,B.sky[2]);g.fillStyle=sk;g.fillRect(0,0,W,hy+10);
  for(let i=0;i<6;i++){const nx=rr()*W,ny=rr()*gy*.9,nr=gy*(.35+rr()*.7),c=B.neb[i%2];const ng=g.createRadialGradient(nx,ny,0,nx,ny,nr);ng.addColorStop(0,`rgba(${c},.26)`);ng.addColorStop(1,`rgba(${c},0)`);g.fillStyle=ng;g.fillRect(nx-nr,ny-nr,nr*2,nr*2)}
  for(let i=0;i<(LQ()?90:240);i++){const a=.2+rr()*.8;g.fillStyle=`rgba(255,255,255,${a*(1-.5*(i%3===0))})`;const s=rr()<.07?1.8:1;g.fillRect(rr()*W,rr()*gy,s,s)}
  for(let i=0;i<5;i++){const x=rr()*W,y=rr()*gy*.8;g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=1;g.beginPath();g.moveTo(x-5,y);g.lineTo(x+5,y);g.moveTo(x,y-5);g.lineTo(x,y+5);g.stroke();g.fillStyle='#fff';g.fillRect(x-1,y-1,2,2)}
  const sx=W*.86,sy=gy*.22,sun=g.createRadialGradient(sx,sy,0,sx,sy,gy*.7);sun.addColorStop(0,`rgba(${B.sun},1)`);sun.addColorStop(.08,`rgba(${B.sun},.8)`);sun.addColorStop(1,`rgba(${B.sun},0)`);g.fillStyle=sun;g.fillRect(0,0,W,hy);
  // the planet hanging over the battlefield
  const P=B.planet,pr=Math.max(30,gy*P.r),cx=W*P.x,cy=gy*P.y;
  const ring=(front)=>{if(!P.ring)return;g.save();g.translate(cx,cy);g.rotate(-.32);for(let i=0;i<4;i++){g.strokeStyle=`rgba(${i%2?'230,210,180':'190,170,150'},${front?.55:.35})`;g.lineWidth=pr*(.07-.012*i);g.beginPath();g.ellipse(0,0,pr*(1.55+i*.13),pr*(.33+i*.03),0,front?0:Math.PI,front?Math.PI:6.283);g.stroke()}g.restore()};
  ring(0);
  {const pg=g.createRadialGradient(cx-pr*.45,cy-pr*.45,pr*.05,cx,cy,pr);pg.addColorStop(0,P.c[0]);pg.addColorStop(.5,P.c[1]);pg.addColorStop(1,P.c[2]);g.fillStyle=pg;g.beginPath();g.arc(cx,cy,pr,0,6.283);g.fill();
   g.save();g.beginPath();g.arc(cx,cy,pr,0,6.283);g.clip();
   if(P.ring||B.id==='magmus'){for(let i=0;i<9;i++){const by=cy-pr+rr()*pr*2;g.fillStyle=`rgba(${rr()<.5?'0,0,0':'255,255,255'},${.05+rr()*.1})`;g.fillRect(cx-pr,by,pr*2,pr*(.04+rr()*.12))}}
   if(P.earth){for(let i=0;i<7;i++){g.fillStyle=rr()<.5?'rgba(70,140,70,.8)':'rgba(170,140,90,.75)';g.beginPath();g.ellipse(cx-pr*.6+rr()*pr*1.2,cy-pr*.6+rr()*pr*1.2,pr*(.12+rr()*.22),pr*(.08+rr()*.14),rr()*3,0,6.283);g.fill()}
     for(let i=0;i<9;i++){g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(cx-pr+rr()*pr*2,cy-pr+rr()*pr*2,pr*(.1+rr()*.25),pr*.04,rr()*.6-.3,0,6.283);g.fill()}}
   if(!P.ring&&!P.earth&&B.id!=='magmus')for(let i=0;i<10;i++){g.fillStyle='rgba(0,0,0,.14)';g.beginPath();g.arc(cx-pr+rr()*pr*2,cy-pr+rr()*pr*2,pr*(.04+rr()*.1),0,6.283);g.fill()}
   if(B.id==='magmus'){g.strokeStyle='rgba(255,230,120,.7)';g.lineWidth=1.5;for(let i=0;i<6;i++){g.beginPath();let x=cx-pr+rr()*pr*2,y=cy-pr+rr()*pr*2;g.moveTo(x,y);for(let j=0;j<4;j++){x+=(rr()-.5)*pr*.4;y+=(rr()-.5)*pr*.4;g.lineTo(x,y)}g.stroke()}}
   const term=g.createRadialGradient(cx+pr*.55,cy+pr*.5,pr*.2,cx+pr*.3,cy+pr*.3,pr*1.4);term.addColorStop(0,'rgba(0,0,0,.72)');term.addColorStop(.52,'rgba(0,0,0,.72)');term.addColorStop(.54,'rgba(0,0,0,.28)');term.addColorStop(.8,'rgba(0,0,0,.28)');term.addColorStop(.82,'rgba(0,0,0,0)');g.fillStyle=term;g.fillRect(cx-pr,cy-pr,pr*2,pr*2);
   g.restore();
   g.strokeStyle=`rgba(${B.sun},.45)`;g.lineWidth=2;g.beginPath();g.arc(cx,cy,pr+1,Math.PI*.95,Math.PI*1.75);g.stroke()}
  ring(1);
  if(P.moon){const mx=cx+pr*1.5,my=cy-pr*.7,mr=pr*.18;sph(g,mx,my,mr,'#b8b4c0')}
  // alien skyline in two layers
  B.hills.forEach((col,li)=>{const base=li?hy-2:hy-gy*.04,amp=li?gy*.2:gy*.34;g.fillStyle=col;g.beginPath();g.moveTo(0,hy+4);
    const K2=B.hillKind;let x=-4;
    if(K2==='city'){while(x<W){const bw=8+rr()*22,bh=(li?.22:.5)*gy*(.3+rr());g.lineTo(x,base-bh);if(rr()<.25&&!li){g.lineTo(x+bw/2,base-bh-gy*.12);}g.lineTo(x+bw,base-bh);x+=bw}}
    else if(K2==='crystal'){while(x<W){const w=10+rr()*26,h=amp*(.3+rr()*.9);g.lineTo(x+w*.4,base-h);g.lineTo(x+w*.55,base-h*.6);g.lineTo(x+w,base-h*.2);x+=w}}
    else if(K2==='mesa'){while(x<W){const w=14+rr()*40,h=amp*(.2+rr()*.8);if(rr()<.4){g.lineTo(x,base-h);g.lineTo(x+w*.3,base-h);g.lineTo(x+w*.36,base-h*.3);x+=w*.4}else{g.lineTo(x+w*.5,base-h*.35);x+=w}}}
    else if(K2==='flora'){while(x<W){const w=12+rr()*30,h=amp*(.3+rr()*.8);g.lineTo(x+w*.45,base-h*.5);g.lineTo(x+w*.45,base-h);g.quadraticCurveTo(x+w*.5,base-h*1.25,x+w*.9,base-h*.95);g.lineTo(x+w*.55,base-h);g.lineTo(x+w*.55,base-h*.4);x+=w}}
    else if(K2==='volcano'){while(x<=W){const d=Math.abs(x-W*.38)/(W*.22);const n=li?Math.sin(x*.03)*.25+.3:Math.max(.15,1.25-d*1.2)+Math.sin(x*.05)*.05;g.lineTo(x,base-n*amp);x+=6}}
    else{while(x<=W){const n=.25+Math.abs(Math.sin(x*.012+li*2))*.35+Math.sin(x*.05)*.05;g.lineTo(x,base-n*amp*(li?.6:.5));x+=6}}
    g.lineTo(W+4,hy+4);g.closePath();g.fill();
    if(!li){g.fillStyle=`rgba(${B.haze},.18)`;g.fill()}
    if(K2==='city'&&!li)for(let i=0;i<180;i++){g.fillStyle=rr()<.5?'rgba(255,61,240,.75)':'rgba(54,241,255,.75)';g.fillRect(rr()*W,base-rr()*gy*.42,1.6,1.6)}
    if(K2==='flora'&&!li)for(let i=0;i<40;i++){const x2=rr()*W,y2=base-amp*(.3+rr()*.8);const gl=g.createRadialGradient(x2,y2,0,x2,y2,5);gl.addColorStop(0,'rgba(140,255,200,.8)');gl.addColorStop(1,'rgba(140,255,200,0)');g.fillStyle=gl;g.fillRect(x2-5,y2-5,10,10)}
    if(K2==='volcano'&&!li){const vx=W*.38,vy=base-1.25*amp;const lg=g.createRadialGradient(vx,vy,0,vx,vy,gy*.35);lg.addColorStop(0,'rgba(255,150,40,.95)');lg.addColorStop(1,'rgba(255,60,20,0)');g.fillStyle=lg;g.fillRect(vx-gy*.35,vy-gy*.35,gy*.7,gy*.7)}
    if(K2==='crater'&&li){for(let i=0;i<3;i++){const dx=W*(.15+.3*i+rr()*.1),dy=base-gy*.02;sph(g,dx,dy,gy*.05,'#9aa6c0',gy*.035);g.fillStyle='rgba(120,200,255,.8)';g.fillRect(dx-1,dy-gy*.07,2,gy*.03)}}
  });
  // ground
  const sd=g.createLinearGradient(0,gy,0,H);sd.addColorStop(0,B.ground[0]);sd.addColorStop(1,B.ground[1]);g.fillStyle=sd;g.fillRect(0,gy+4,W,H-gy);
  const K=k();
  if(B.deco==='neon'){g.strokeStyle='rgba(255,61,240,.22)';g.lineWidth=1;for(let wy=0;wy<WH;wy+=40){g.beginPath();g.moveTo(px(-240,wy),py(wy));g.lineTo(px(640,wy),py(wy));g.stroke()}for(let wx=-240;wx<=640;wx+=40){if(wx>14&&wx<386)continue;g.beginPath();g.moveTo(px(wx,0),py(0));g.lineTo(px(wx,WH),py(WH));g.stroke()}}
  for(const s2 of specks){const x=px(s2.x,s2.y),y=py(s2.y),z=sc(s2.y)*K;if(s2.x>10&&s2.x<390)continue;
    if(s2.k==='dot'){g.fillStyle=s2.s>.5?'rgba(0,0,0,.14)':'rgba(255,255,255,.18)';g.fillRect(x,y,2*z,1.3*z);continue}
    decoDraw(g,B.deco,s2,x,y,z)}
  // armoured causeway: dark bevelled panels with glowing guide rails
  quad(12,-30,388,WH+20,'rgba(0,0,0,.55)',g);
  quad(18,-30,382,WH+20,shade(B.road[0],-.2),g);
  quad(26,-30,374,WH+20,B.road[1],g);
  g.save();g.beginPath();g.moveTo(px(26,-30),py(-30));g.lineTo(px(374,-30),py(-30));g.lineTo(px(374,WH+20),py(WH+20));g.lineTo(px(26,WH+20),py(WH+20));g.closePath();g.clip();
  const rd=g.createLinearGradient(px(26,WH),0,px(374,WH),0);rd.addColorStop(0,'rgba(0,0,0,.3)');rd.addColorStop(.5,'rgba(255,255,255,.06)');rd.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=rd;g.fillRect(0,0,W,H);
  for(let i=0;i<(LQ()?250:800);i++){const wx=26+rr()*348,wy=rr()*WH,z=sc(wy)*K;g.fillStyle=rr()<.5?'rgba(0,0,0,.12)':'rgba(255,255,255,.05)';g.fillRect(px(wx,wy),py(wy),1.6*z,1.2*z)}
  for(let wy=-20;wy<WH;wy+=48){const z=sc(wy)*K;g.fillStyle='rgba(0,0,0,.45)';g.fillRect(px(26,wy),py(wy),px(374,wy)-px(26,wy),1.4*z);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(px(26,wy),py(wy)+1.4*z,px(374,wy)-px(26,wy),1*z)}
  g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;for(const lx of [113,287]){g.beginPath();g.moveTo(px(lx,-30),py(-30));g.lineTo(px(lx,WH),py(WH));g.stroke()}
  for(let wy=-10;wy<WH;wy+=96)for(const lx of [60,340]){const z=sc(wy)*K;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(px(lx-8,wy),py(wy),16*z,6*z);g.fillStyle='rgba(255,255,255,.06)';for(let j=0;j<3;j++)g.fillRect(px(lx-7,wy),py(wy)+(1+j*1.8)*z,14*z,.8*z)}
  if(B.id==='magmus')for(let i=0;i<12;i++){const wx=40+rr()*320,wy=rr()*WH;g.strokeStyle='rgba(255,110,40,.5)';g.lineWidth=1.4;g.beginPath();g.moveTo(px(wx,wy),py(wy));for(let j=0;j<4;j++)g.lineTo(px(wx+(rr()-.5)*30,wy+j*8),py(wy+j*8));g.stroke()}
  if(B.id==='dune')for(let i=0;i<26;i++){const wx=30+rr()*340,wy=rr()*WH,z=sc(wy)*K;g.fillStyle='rgba(230,150,90,.16)';g.beginPath();g.ellipse(px(wx,wy),py(wy),(14+rr()*20)*z,3*z,0,0,6.283);g.fill()}
  if(B.id==='verdant')for(let i=0;i<18;i++){const wx=30+rr()*340,wy=rr()*WH,z=sc(wy)*K;g.fillStyle='rgba(70,190,110,.2)';g.beginPath();g.ellipse(px(wx,wy),py(wy),(8+rr()*14)*z,4*z,0,0,6.283);g.fill();g.strokeStyle='rgba(90,220,140,.3)';g.lineWidth=1.2*z;g.beginPath();g.moveTo(px(wx,wy),py(wy));g.quadraticCurveTo(px(wx+10,wy+6),py(wy+6),px(wx+4,wy+14),py(wy+14));g.stroke()}
  if(B.id==='arcadia')for(let wy=-20;wy<WH;wy+=96){const z=sc(wy)*K;g.fillStyle='rgba(255,61,240,.35)';g.fillRect(px(26,wy),py(wy),px(374,wy)-px(26,wy),.9*z)}
  if(B.id==='void')for(let i=0;i<22;i++){const wx=34+rr()*332,wy=rr()*WH,z=sc(wy)*K,r=(3+rr()*7)*z;g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(px(wx,wy),py(wy),r,r*.4,0,0,6.283);g.fill();g.strokeStyle='rgba(200,210,255,.14)';g.lineWidth=1;g.beginPath();g.ellipse(px(wx,wy),py(wy),r,r*.4,0,0,Math.PI);g.stroke()}
  if(B.id==='cryo')for(let i=0;i<30;i++){const wx=30+rr()*340,wy=rr()*WH,z=sc(wy)*K;g.fillStyle='rgba(220,240,255,.22)';g.beginPath();g.ellipse(px(wx,wy),py(wy),10*z,3*z,0,0,6.283);g.fill()}
  g.restore();
  // side rails: metal lip, then a glowing guide strip with lights
  for(const [a,b] of [[18,26],[374,382]]){quad(a,-30,b,WH+20,shade(B.road[1],.25),g);
    for(let y=-20;y<WH;y+=26){const z=sc(y)*K;g.fillStyle='rgba(0,0,0,.35)';g.fillRect(px(a,y),py(y),px(b,y)-px(a,y),1.2*z)}}
  for(const ex of [26,374]){g.strokeStyle=`rgba(${B.rail},.25)`;g.lineWidth=5;g.beginPath();g.moveTo(px(ex,-30),py(-30));g.lineTo(px(ex,WH),py(WH));g.stroke();g.strokeStyle=`rgba(${B.rail},.9)`;g.lineWidth=1.4;g.stroke()}
  for(let wy=0;wy<WH;wy+=48)for(const ex of [22,378]){const z=sc(wy)*K;const gl=g.createRadialGradient(px(ex,wy),py(wy),0,px(ex,wy),py(wy),5*z);gl.addColorStop(0,'#fff');gl.addColorStop(.3,`rgba(${B.rail},.9)`);gl.addColorStop(1,`rgba(${B.rail},0)`);g.fillStyle=gl;g.fillRect(px(ex,wy)-5*z,py(wy)-5*z,10*z,10*z)}
  const hz=g.createLinearGradient(0,gy,0,gy+gh*.22);hz.addColorStop(0,`rgba(${B.haze},.45)`);hz.addColorStop(1,`rgba(${B.haze},0)`);g.fillStyle=hz;g.fillRect(0,gy-4,W,gh*.22);
  // colour grade baked in once: slightly desaturated, cool-dark
  g.globalCompositeOperation='saturation';g.fillStyle='rgba(128,128,128,.22)';g.fillRect(0,0,W,H);g.globalCompositeOperation='multiply';g.fillStyle='rgb(222,226,236)';g.fillRect(0,0,W,H);g.globalCompositeOperation='source-over';
}
function decoDraw(g,kind,s2,x,y,z){
  const v=s2.s;
  g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x,y,8*z,2.4*z,0,0,6.283);g.fill();
  if(kind==='spire'){
    if(s2.k==='bush'){const h=(16+v*22)*z;g.fillStyle=vgrad(g,y-h,y,'#d88a5a','#6a2c1c');g.beginPath();g.moveTo(x-6*z,y);g.lineTo(x-3*z,y-h*.6);g.lineTo(x-4*z,y-h);g.lineTo(x+2*z,y-h*.95);g.lineTo(x+3*z,y-h*.5);g.lineTo(x+6*z,y);g.closePath();g.fill();g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+1*z,y-h*.9,3*z,h*.9);return}
    sph(g,x,y-2*z,4.5*z,'#a85a34',3*z);return}
  if(kind==='crystal'){
    if(s2.k==='bush'){for(let i=-1;i<=1;i++){const h=(12+v*14-Math.abs(i)*5)*z,bx=x+i*4*z;g.fillStyle=vgrad(g,y-h,y,'#e8f8ff','#5a8ac0');g.beginPath();g.moveTo(bx-2.5*z,y);g.lineTo(bx+i*2*z,y-h);g.lineTo(bx+2.5*z,y);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.moveTo(bx-1*z,y-2*z);g.lineTo(bx+i*2*z,y-h);g.lineTo(bx,y-2*z);g.fill()}
      glowDot(g,x,y-8*z,3*z,'#7fe0ff');return}
    g.fillStyle='rgba(255,255,255,.75)';g.beginPath();g.ellipse(x,y,6*z,2.4*z,0,0,6.283);g.fill();return}
  if(kind==='flora'){
    if(s2.k==='bush'){const h=(14+v*16)*z;g.strokeStyle='#d8e8c0';g.lineWidth=2.4*z;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+3*z,y-h*.5,x,y-h);g.stroke();
      g.fillStyle=vgrad(g,y-h-6*z,y-h+3*z,v>.5?'#5affc0':'#ff7ad8',v>.5?'#1a7a5a':'#7a1a6a');g.beginPath();g.ellipse(x,y-h,9*z,5*z,0,Math.PI,0);g.fill();
      for(let i=-2;i<=2;i++){g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(x+i*3*z,y-h-2*z,.9*z,0,6.283);g.fill()}glowDot(g,x,y-h,3*z,v>.5?'#5affc0':'#ff7ad8');return}
    g.fillStyle=v>.5?'#2f8a52':'#1e6a3c';for(let i=0;i<4;i++){g.beginPath();g.ellipse(x+(i-1.5)*3*z,y-3*z,1.6*z,5*z,(i-1.5)*.3,0,6.283);g.fill()}return}
  if(kind==='lava'){
    if(s2.k==='bush'){g.fillStyle=vgrad(g,y-14*z,y,'#3a2a2e','#120b0e');g.beginPath();g.moveTo(x-7*z,y);g.lineTo(x-2*z,y-14*z);g.lineTo(x+3*z,y-10*z);g.lineTo(x+7*z,y);g.closePath();g.fill();g.strokeStyle='rgba(255,120,40,.85)';g.lineWidth=1*z;g.beginPath();g.moveTo(x-2*z,y-12*z);g.lineTo(x,y-5*z);g.lineTo(x+2*z,y-2*z);g.stroke();return}
    const lg=g.createRadialGradient(x,y,0,x,y,9*z);lg.addColorStop(0,'rgba(255,190,80,.95)');lg.addColorStop(1,'rgba(255,60,20,0)');g.fillStyle=lg;g.beginPath();g.ellipse(x,y,9*z,3.5*z,0,0,6.283);g.fill();return}
  if(kind==='neon'){
    if(s2.k==='bush'){cylG(g,x-1.5*z,y-26*z,3*z,26*z,'#3a3a5a');const c=v>.5?'#ff3df0':'#36f1ff';g.fillStyle=hexA(c,.25);g.fillRect(x-10*z,y-30*z,20*z,9*z);g.strokeStyle=c;g.lineWidth=1.2*z;g.strokeRect(x-10*z,y-30*z,20*z,9*z);g.fillStyle=c;for(let i=0;i<3;i++)g.fillRect(x-7*z+i*5*z,y-27*z,3*z,3*z);return}
    g.fillStyle=v>.5?'rgba(255,61,240,.5)':'rgba(54,241,255,.5)';g.fillRect(x-3*z,y-1*z,6*z,2*z);return}
  if(kind==='crater'){
    if(s2.k==='bush'){if(v>.6){cylG(g,x-1*z,y-16*z,2*z,16*z,'#8a8a9a');g.fillStyle='#c8ccd8';g.beginPath();g.ellipse(x,y-17*z,7*z,3*z,-.4,0,6.283);g.fill();glowDot(g,x,y-17*z,1.5*z,'#ff5050');return}
      g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(x,y,9*z,3.5*z,0,0,6.283);g.fill();g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1.2*z;g.beginPath();g.ellipse(x,y,9*z,3.5*z,0,Math.PI*.1,Math.PI*.9);g.stroke();return}
    sph(g,x,y-1.5*z,3.5*z,'#8a8a96',2.5*z);return}
}
// weather, drawn in screen space
let weather=[];
function drawWeather(dtR){
  const B=biome(),kind=B.weather,n=LQ()?0:kind==='motes'?40:kind==='rain'?70:kind==='snow'?60:kind==='dust'?26:kind==='spores'?34:36;
  while(weather.length<n)weather.push({x:Math.random()*W,y:Math.random()*H,s:.5+Math.random(),p:Math.random()*6.28});
  if(weather.length>n)weather.length=n;
  for(const w of weather){
    if(kind==='snow'){w.y+=(30+40*w.s)*dtR;w.x+=Math.sin(S.t+w.p)*12*dtR;ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.arc(w.x,w.y,1.4*w.s+.6,0,6.283);ctx.fill()}
    else if(kind==='rain'){w.y+=520*w.s*dtR;w.x-=90*dtR;ctx.strokeStyle='rgba(150,220,255,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(w.x,w.y);ctx.lineTo(w.x+4,w.y-14*w.s);ctx.stroke()}
    else if(kind==='embers'){w.y-=(25+30*w.s)*dtR;w.x+=Math.sin(S.t*2+w.p)*16*dtR;ctx.fillStyle=`rgba(255,${120+Math.floor(80*w.s)},40,${.5+.4*Math.sin(S.t*6+w.p)})`;ctx.fillRect(w.x,w.y,2*w.s,2*w.s)}
    else if(kind==='spores'){w.y-=(8+10*w.s)*dtR;w.x+=Math.sin(S.t*.8+w.p)*14*dtR;ctx.fillStyle=`rgba(140,255,200,${.35+.35*Math.sin(S.t*3+w.p)})`;ctx.beginPath();ctx.arc(w.x,w.y,1.2+w.s,0,6.283);ctx.fill()}
    else if(kind==='motes'){w.x+=4*w.s*dtR;w.y+=2*dtR;ctx.fillStyle=`rgba(200,210,255,${.25+.3*Math.sin(S.t*2+w.p)})`;ctx.fillRect(w.x,w.y,1.4*w.s,1.4*w.s);
      if(w.p<.05){w.sx=(w.sx??-50)+700*dtR;ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(w.sx,w.y*.2);ctx.lineTo(w.sx-30,w.y*.2-10);ctx.stroke();if(w.sx>W+60)w.sx=-400-Math.random()*800}}
    else{w.x+=(8+10*w.s)*dtR;w.y+=4*dtR;ctx.fillStyle='rgba(255,220,180,.35)';ctx.fillRect(w.x,w.y,2*w.s,2*w.s)}
    if(w.y>H+20){w.y=-10;w.x=Math.random()*W}if(w.y<-20){w.y=H+10;w.x=Math.random()*W}if(w.x>W+120)w.x=-100;if(w.x<-120)w.x=W+100;
  }
}
// sprite cache: your troopers, faction minions, glows
const SPR={};
function ballSprite(col,horns,eyes){
  const key=col+horns+eyes;if(SPR[key])return SPR[key];
  const c2=mk(64,72),g=c2.getContext('2d');SPR[key]=c2;if(!g||!g.createRadialGradient)return c2;
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(32,66,20,5,0,0,6.283);g.fill();
  g.fillStyle=shade(col,-.4);g.beginPath();g.arc(32,40,27,0,6.283);g.fill();
  g.fillStyle=col;g.beginPath();g.arc(29.5,37.5,23.5,0,6.283);g.fill();
  g.fillStyle=shade(col,.45);g.beginPath();g.ellipse(22,26,10,6,-.6,0,6.283);g.fill();
  g.fillStyle='#ffffff';g.beginPath();g.ellipse(19,23.5,3.6,2,-.6,0,6.283);g.fill();
  g.strokeStyle='rgba(200,245,255,.85)';g.lineWidth=2;g.beginPath();g.arc(32,40,24.5,.25,1.25);g.stroke();
  g.fillStyle='#f8e8dc';g.beginPath();g.ellipse(32,45,17,12,0,0,6.283);g.fill();
  g.fillStyle='rgba(120,60,60,.14)';g.beginPath();g.ellipse(32,50,16,6,0,0,Math.PI);g.fill();
  for(const s2 of [-1,1]){const ex=32+s2*7.5,ey=44.5;
    g.fillStyle='#ffffff';g.beginPath();g.ellipse(ex,ey,5,6.4,0,0,6.283);g.fill();
    const ir=g.createLinearGradient(0,ey-6,0,ey+6);ir.addColorStop(0,'#0a2a5a');ir.addColorStop(.55,'#1aa8e0');ir.addColorStop(1,'#9ff4ff');g.fillStyle=ir;g.beginPath();g.ellipse(ex+s2*.4,ey+.7,4,5.5,0,0,6.283);g.fill();
    g.fillStyle='#05101c';g.beginPath();g.ellipse(ex+s2*.4,ey+1.2,1.9,2.9,0,0,6.283);g.fill();
    g.fillStyle='#ffffff';g.beginPath();g.arc(ex-1.5,ey-2.2,1.7,0,6.283);g.fill();g.beginPath();g.arc(ex+1.6,ey+2.6,.8,0,6.283);g.fill();
    g.strokeStyle='#121218';g.lineWidth=1.8;g.beginPath();g.ellipse(ex,ey,5,6.4,0,Math.PI*1.08,Math.PI*1.92);g.stroke()}
  g.fillStyle='rgba(255,110,140,.5)';g.beginPath();g.ellipse(20.5,51.5,3,1.6,0,0,6.283);g.ellipse(43.5,51.5,3,1.6,0,0,6.283);g.fill();
  g.strokeStyle=shade(col,-.55);g.lineWidth=2.4;g.beginPath();g.ellipse(32,45,17,12,0,0,6.283);g.stroke();
  g.strokeStyle=shade(col,-.45);g.lineWidth=2;g.beginPath();g.moveTo(42,16);g.lineTo(46,7);g.stroke();g.fillStyle='#ffcf2e';g.beginPath();g.arc(46,7,2.6,0,6.283);g.fill();
  g.strokeStyle='rgba(4,8,16,.95)';g.lineWidth=2.8;g.beginPath();g.arc(32,40,27,0,6.283);g.stroke();
  return c2;
}
function glowSprite(col){
  const key='g'+col;if(SPR[key])return SPR[key];
  const c2=mk(64,64),g=c2.getContext('2d');SPR[key]=c2;if(!g||!g.createRadialGradient)return c2;
  const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,col);gr.addColorStop(.35,col.replace('rgb','rgba').replace(')',',.45)'));gr.addColorStop(1,'rgba(0,0,0,0)');
  g.fillStyle=gr;g.fillRect(0,0,64,64);return c2;
}
function coreSprite(col,inner){
  const key='c'+col+inner;if(SPR[key])return SPR[key];
  const c2=mk(32,32),g=c2.getContext('2d');SPR[key]=c2;if(!g||!g.createRadialGradient)return c2;
  const gr=g.createRadialGradient(13,13,1,16,16,15);gr.addColorStop(0,'#fff');gr.addColorStop(.35,inner);gr.addColorStop(.75,col);gr.addColorStop(1,shade(col,-.3));
  g.fillStyle=gr;g.beginPath();g.arc(16,16,15,0,6.283);g.fill();return c2;
}
function shade(hex,amt){let h=hex.replace('#','');if(h.length===3)h=h.split('').map(c3=>c3+c3).join('');let r=parseInt(h.slice(0,2),16),g2=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  const t=amt<0?0:255,p=Math.abs(amt);r=Math.round((t-r)*p+r);g2=Math.round((t-g2)*p+g2);b=Math.round((t-b)*p+b);return '#'+[r,g2,b].map(v=>v.toString(16).padStart(2,'0')).join('')}
const hexRgb=hex=>{const h=hex.replace('#','');return `rgb(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)})`};
const dust=[];for(let i=0;i<26;i++)dust.push({x:Math.random(),y:Math.random(),s:.4+Math.random(),v:.01+Math.random()*.02});
