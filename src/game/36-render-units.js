// ---- faction minions: front-facing, lit, two walk frames, then outlined so they read at small sizes ----
function rrect(g,x,y,w,h,r){g.beginPath();g.roundRect(x,y,w,h,r)}
const FDRAW={
  robot(g,f,T,lo){
    for(const s of[-1,1]){const dy=s<0?lo:-lo;cylG(g,40+s*9-3.5,60,7,17+dy,f.dark);g.fillStyle=shade(f.dark,-.35);rrect(g,40+s*9-5.5,76+dy,11,5,2);g.fill();sph(g,40+s*9,63,3.4,f.body)}
    for(const s of[-1,1]){cylG(g,40+s*21-3.5,40,7,19,f.dark);sph(g,40+s*21,60+(s<0?-lo:lo)*.5,4.2,f.body)}
    g.fillStyle=vgrad(g,34,64,shade(f.body,.45),shade(f.body,-.5));g.beginPath();g.moveTo(24,36);g.lineTo(56,36);g.lineTo(52,62);g.lineTo(28,62);g.closePath();g.fill();
    g.fillStyle=shade(f.body,-.45);g.fillRect(29,53,22,3);g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;g.beginPath();g.moveTo(40,37);g.lineTo(40,52);g.moveTo(28,44);g.lineTo(52,44);g.stroke();
    g.fillStyle='#0b0d12';g.beginPath();g.arc(40,46,5,0,6.283);g.fill();glowDot(g,40,46,3.2,T);
    for(const s of[-1,1])sph(g,40+s*20,38,7.5,f.body,6.5);
    g.fillStyle=vgrad(g,14,34,shade(f.body,.5),shade(f.body,-.35));rrect(g,30,15,20,19,5);g.fill();
    g.fillStyle='#07080c';rrect(g,32,21,16,7,3);g.fill();glowDot(g,40+lo*.6,24.5,3,f.eye);
    g.strokeStyle=f.dark;g.lineWidth=1.6;g.beginPath();g.moveTo(46,16);g.lineTo(49,7);g.stroke();glowDot(g,49,7,1.8,T);
  },
  bug(g,f,T,lo){
    g.strokeStyle=f.dark;g.lineWidth=3.2;
    for(let i=0;i<3;i++)for(const s of[-1,1]){const ph=(i%2?lo:-lo)*s,y0=48+i*7;g.beginPath();g.moveTo(40+s*12,y0);g.lineTo(40+s*(25+i*2),y0-7+ph);g.lineTo(40+s*(30+i*2),y0+13+ph*.6+i*3);g.stroke()}
    g.strokeStyle=f.dark;g.lineWidth=1.6;for(const s of[-1,1]){g.beginPath();g.moveTo(40+s*5,58);g.quadraticCurveTo(40+s*20,40,40+s*24,26+lo*.4);g.stroke();glowDot(g,40+s*24,26+lo*.4,1.6,T)}
    sph(g,40,43,21,f.body,19);
    g.strokeStyle=shade(f.body,-.55);g.lineWidth=1.6;g.beginPath();g.moveTo(40,25);g.lineTo(40,62);g.stroke();
    g.strokeStyle=hexA(T,.9);g.lineWidth=2.2;g.beginPath();g.ellipse(40,44,14,13,0,Math.PI*1.12,Math.PI*1.42);g.stroke();g.beginPath();g.ellipse(40,44,14,13,0,Math.PI*1.58,Math.PI*1.88);g.stroke();
    glowDot(g,31,40,2.4,T);glowDot(g,49,40,2.4,T);
    g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(32,32,6,3,-.6,0,6.283);g.fill();
    sph(g,40,63,11.5,shade(f.body,-.3),9);
    for(const s of[-1,1]){sph(g,40+s*6.5,61,4.2,f.eye);g.fillStyle='rgba(0,0,0,.35)';for(let j=0;j<3;j++)g.fillRect(40+s*6.5-2+j*1.6,59,.6,4)}
    g.fillStyle=shade(f.dark,-.2);for(const s of[-1,1]){g.beginPath();g.moveTo(40+s*4,68);g.quadraticCurveTo(40+s*(9+Math.abs(lo)),76,40+s*2,80);g.lineTo(40+s*3.5,74);g.closePath();g.fill()}
  },
  beast(g,f,T,lo){
    sph(g,25,62,9,shade(f.body,-.3));sph(g,55,62,9,shade(f.body,-.3));
    for(const s of[-1,1]){const dy=s<0?lo:-lo;cylG(g,40+s*10-4,60,8,17+dy,shade(f.body,-.15));g.fillStyle=f.dark;g.beginPath();g.ellipse(40+s*10,78+dy,6,3,0,0,6.283);g.fill();
      g.fillStyle='#f4ead8';for(let j=-1;j<=1;j++){g.beginPath();g.moveTo(40+s*10+j*3-1.2,79+dy);g.lineTo(40+s*10+j*3,83.5+dy);g.lineTo(40+s*10+j*3+1.2,79+dy);g.fill()}}
    for(let i=-2;i<=2;i++){g.fillStyle=vgrad(g,18,38,'#ffffff',T);g.beginPath();g.moveTo(40+i*7-3,38);g.lineTo(40+i*8,22+Math.abs(i)*3);g.lineTo(40+i*7+3,38);g.fill()}
    sph(g,40,52,17,f.body,15);
    g.strokeStyle=shade(f.body,-.4);g.lineWidth=1.2;for(let i=0;i<16;i++){const a=i/16*Math.PI*1.1-.05,x=40+Math.cos(a)*14,y=51+Math.sin(a)*12;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*3,y+Math.sin(a)*4+1);g.stroke()}
    g.fillStyle=hexA(f.lite,.55);g.beginPath();g.ellipse(40,57,8,8,0,0,6.283);g.fill();
    for(const s of[-1,1]){g.fillStyle=f.dark;g.beginPath();g.moveTo(40+s*5,26);g.lineTo(40+s*14,10);g.lineTo(40+s*13,28);g.closePath();g.fill();g.fillStyle='#c87a7a';g.beginPath();g.moveTo(40+s*8,25);g.lineTo(40+s*13,14);g.lineTo(40+s*12,26);g.closePath();g.fill()}
    sph(g,40,32,13.5,f.body,11.5);
    sph(g,40,40,7.5,f.lite,5.5);g.fillStyle='#1a0e08';g.beginPath();g.ellipse(40,37.5,3.2,2,0,0,6.283);g.fill();
    g.fillStyle='#fff';for(const s of[-1,1]){g.beginPath();g.moveTo(40+s*5,43);g.lineTo(40+s*4,48);g.lineTo(40+s*3,43);g.fill()}
    for(const s of[-1,1]){g.fillStyle='#000';g.beginPath();g.moveTo(40+s*3,30);g.lineTo(40+s*10,27);g.lineTo(40+s*9,32);g.closePath();g.fill();glowDot(g,40+s*7,30,1.8,f.eye)}
  },
  demon(g,f,T,lo){
    for(const s of[-1,1]){const fl=lo*1.2;g.fillStyle=vgrad(g,12,56,shade(f.dark,.25),shade(f.dark,-.3));g.beginPath();g.moveTo(40+s*9,42);g.lineTo(40+s*35,14+fl);g.lineTo(40+s*38,44);g.lineTo(40+s*31,38);g.lineTo(40+s*28,51);g.lineTo(40+s*21,44);g.lineTo(40+s*15,53);g.closePath();g.fill();
      g.strokeStyle=shade(f.body,-.15);g.lineWidth=1.3;g.beginPath();g.moveTo(40+s*9,42);g.lineTo(40+s*35,14+fl);g.lineTo(40+s*31,38);g.moveTo(40+s*22,30);g.lineTo(40+s*21,44);g.stroke()}
    g.strokeStyle=f.dark;g.lineWidth=3;g.beginPath();g.moveTo(46,68);g.quadraticCurveTo(64,74,62,58-lo);g.stroke();g.fillStyle=f.dark;g.beginPath();g.moveTo(58,60-lo);g.lineTo(63,52-lo);g.lineTo(66,61-lo);g.closePath();g.fill();
    for(const s of[-1,1]){const dy=s<0?lo:-lo;cylG(g,40+s*8-4,60,8,13+dy,f.dark);cylG(g,40+s*9-3,71+dy,6,8,shade(f.dark,-.2));g.fillStyle='#0a0406';g.fillRect(40+s*9-4,78+dy,8,4)}
    sph(g,40,51,15,f.body,14);
    g.strokeStyle=shade(f.body,-.45);g.lineWidth=1.1;g.beginPath();g.moveTo(40,42);g.lineTo(40,62);for(let j=0;j<3;j++){g.moveTo(34,49+j*4);g.lineTo(46,49+j*4)}g.stroke();
    glowDot(g,40,46,2.6,T);
    for(const s of[-1,1]){g.fillStyle=vgrad(g,4,26,'#e8d8c8','#2a1a1a');g.beginPath();g.moveTo(40+s*5,24);g.quadraticCurveTo(40+s*19,20,40+s*17,4);g.lineTo(40+s*11,19);g.closePath();g.fill()}
    sph(g,40,30,11,f.body,10);
    g.fillStyle='#000';for(const s of[-1,1]){g.beginPath();g.moveTo(40+s*2,28);g.lineTo(40+s*9,25);g.lineTo(40+s*8,31);g.closePath();g.fill();glowDot(g,40+s*6,28.5,1.9,f.eye)}
    g.fillStyle='#1a0408';g.beginPath();g.ellipse(40,35.5,5.5,2.4,0,0,Math.PI);g.fill();g.fillStyle='#fff';for(let j=-2;j<=2;j++){g.beginPath();g.moveTo(40+j*2-1,35.5);g.lineTo(40+j*2,37.5);g.lineTo(40+j*2+1,35.5);g.fill()}
  },
  angel(g,f,T,lo){
    const fl=lo*.8;
    for(const s of[-1,1])for(let k2=0;k2<3;k2++){g.fillStyle=k2===0?shade(f.body,-.25):k2===1?shade(f.body,-.05):'#ffffff';g.beginPath();g.ellipse(40+s*(21+k2*2),36-k2*4+fl*.5,17-k2*3,6.5-k2,s*(-.55-k2*.18),0,6.283);g.fill()}
    g.strokeStyle='rgba(120,110,160,.45)';g.lineWidth=1;for(const s of[-1,1])for(let j=0;j<4;j++){g.beginPath();g.moveTo(40+s*(16+j*5),38+j);g.lineTo(40+s*(22+j*5),44+j*1.5);g.stroke()}
    g.fillStyle=vgrad(g,36,84,'#ffffff',shade(f.body,-.3));g.beginPath();g.moveTo(32,37);g.lineTo(48,37);g.lineTo(56,78);g.quadraticCurveTo(40,85,24,78);g.closePath();g.fill();
    g.strokeStyle='rgba(110,100,150,.4)';g.lineWidth=1.2;g.beginPath();for(const xx of [35,40,45]){g.moveTo(xx,48);g.lineTo(xx+(xx-40)*.6,80)}g.stroke();
    g.strokeStyle=f.accent;g.lineWidth=2;g.beginPath();g.moveTo(25,78);g.quadraticCurveTo(40,84,55,78);g.moveTo(33,48);g.lineTo(47,48);g.stroke();
    glowDot(g,40,43,2.8,T);
    sph(g,40,28,9,'#f4f0fc');
    g.fillStyle='#1a2a3a';rrect(g,33,26,14,4,2);g.fill();glowDot(g,36.5,28,1.6,f.eye);glowDot(g,43.5,28,1.6,f.eye);
    g.save();g.shadowColor=f.accent;g.shadowBlur=6;g.strokeStyle=f.accent;g.lineWidth=2.6;g.beginPath();g.ellipse(40,14+fl*.3,10.5,3.4,0,0,6.283);g.stroke();g.restore();
  },
  knight(g,f,T,lo){
    g.fillStyle=vgrad(g,36,82,shade(f.accent,-.05),shade(f.accent,-.6));g.beginPath();g.moveTo(27,38);g.lineTo(53,38);g.lineTo(58,80+lo*.3);g.lineTo(22,80-lo*.3);g.closePath();g.fill();
    for(const s of[-1,1]){const dy=s<0?lo:-lo;cylG(g,40+s*7-4,60,8,17+dy,f.body);sph(g,40+s*7,66,3.6,f.lite);g.fillStyle=shade(f.dark,-.2);rrect(g,40+s*7-5,76+dy,10,5,2);g.fill()}
    g.fillStyle=vgrad(g,34,64,shade(f.body,.5),shade(f.body,-.45));g.beginPath();g.moveTo(26,36);g.lineTo(54,36);g.lineTo(50,62);g.lineTo(30,62);g.closePath();g.fill();
    g.fillStyle=T;g.fillRect(37,40,6,24);g.fillStyle=f.trim;g.fillRect(29,56,22,3);
    for(const s of[-1,1])sph(g,40+s*16,38,8,f.body,6.5);
    g.save();g.shadowColor=f.eye;g.shadowBlur=6;g.strokeStyle=f.eye;g.lineWidth=3.2;g.beginPath();g.moveTo(60,58);g.lineTo(65,16);g.stroke();g.restore();
    g.strokeStyle='#fff';g.lineWidth=1.2;g.beginPath();g.moveTo(60,58);g.lineTo(65,16);g.stroke();g.fillStyle=f.trim;g.fillRect(56,57,9,3);g.fillStyle=f.dark;g.fillRect(59,60,3,6);
    g.fillStyle=vgrad(g,40,72,shade(f.body,.4),shade(f.body,-.4));g.beginPath();g.moveTo(10,40);g.lineTo(30,40);g.lineTo(30,58);g.lineTo(20,72);g.lineTo(10,58);g.closePath();g.fill();
    g.strokeStyle=f.trim;g.lineWidth=2;g.stroke();g.fillStyle=T;g.fillRect(18.5,45,3,20);g.fillRect(13,51,14,3);
    g.fillStyle=vgrad(g,13,36,shade(f.body,.55),shade(f.body,-.35));rrect(g,31,13,18,23,6);g.fill();
    g.fillStyle='#05070c';g.fillRect(33,22,14,3.2);g.fillRect(38.5,22,3,9);g.fillStyle=hexA(f.eye,.9);g.fillRect(34,22.8,12,1.4);
    g.fillStyle=f.accent;g.beginPath();g.moveTo(38,14);g.quadraticCurveTo(44,0,54,4-lo*.5);g.quadraticCurveTo(46,6,42,15);g.closePath();g.fill();
  },
};
function typeGear(g,f,T,type,brute){
  if(type==='gunner'){cylG(g,58,46,8,17,'#2a2e38');g.fillStyle='#14161c';g.fillRect(58,62,8,3);glowDot(g,62,66,2.2,T)}
  else if(type==='armored'){g.fillStyle=vgrad(g,44,66,'#dfe6ef','#5a6474');rrect(g,26,44,28,20,4);g.fill();g.strokeStyle='#14161c';g.lineWidth=1.5;g.stroke();g.fillStyle='#14161c';for(const xx of [29,51])for(const yy of [47,61]){g.beginPath();g.arc(xx,yy,1,0,6.283);g.fill()}g.fillStyle=hexA(T,.9);g.fillRect(30,52,20,3)}
  else if(type==='bomber'){sph(g,58,26,8,'#2b2b33');g.fillStyle=T;g.fillRect(52,24,12,2.4);g.strokeStyle='#e8c070';g.lineWidth=1.5;g.beginPath();g.moveTo(58,18);g.quadraticCurveTo(62,12,66,13);g.stroke()}
  else if(type==='saboteur'){g.strokeStyle=T;g.lineWidth=3;for(const s of[-1,1]){g.beginPath();g.moveTo(40+s*18,52);g.lineTo(40+s*27,42);g.lineTo(40+s*24,36);g.moveTo(40+s*27,42);g.lineTo(40+s*31,38);g.stroke()}}
  else if(type==='totem'){g.strokeStyle='#3a3020';g.lineWidth=2.6;g.beginPath();g.moveTo(66,82);g.lineTo(66,16);g.stroke();g.strokeStyle=T;g.lineWidth=1.6;g.beginPath();g.ellipse(66,14,6,2.4,0,0,6.283);g.stroke();glowDot(g,66,14,3.2,T)}
  else if(type==='splitter'){for(let i=-1;i<=1;i++)glowDot(g,40+i*7,71,2,T)}
  else if(type==='runner'){g.strokeStyle=hexA(T,.8);g.lineWidth=2;for(const s of[-1,1])for(let j=0;j<3;j++){g.beginPath();g.moveTo(40+s*(24+j*3),40+j*8);g.lineTo(40+s*(34+j*3),36+j*8);g.stroke()}}
  else if(type==='phantom'){const gr=g.createRadialGradient(40,46,4,40,46,38);gr.addColorStop(0,hexA(T,0));gr.addColorStop(.7,hexA(T,.18));gr.addColorStop(1,hexA(T,0));g.globalCompositeOperation='destination-over';g.fillStyle=gr;g.fillRect(0,0,80,88);g.globalCompositeOperation='source-over'}
  if(brute){g.fillStyle=vgrad(g,0,14,'#fff3b0','#c98a10');g.beginPath();g.moveTo(28,13);g.lineTo(28,4);g.lineTo(33,9);g.lineTo(40,1);g.lineTo(47,9);g.lineTo(52,4);g.lineTo(52,13);g.closePath();g.fill();g.strokeStyle='#5a3a00';g.lineWidth=1;g.stroke();glowDot(g,40,9,1.6,'#ff3b3b');
    for(const s of[-1,1]){g.fillStyle='#e8e0d0';g.beginPath();g.moveTo(40+s*16,32);g.lineTo(40+s*27,24);g.lineTo(40+s*21,36);g.closePath();g.fill()}}
}
function outlineSprite(src,w,h,pxW,col){
  const o=mk(w,h),g=o.getContext('2d');if(!g||!g.drawImage)return src;
  const s=mk(w,h),sg=s.getContext('2d');sg.drawImage(src,0,0);sg.globalCompositeOperation='source-in';sg.fillStyle=col;sg.fillRect(0,0,w,h);
  for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-.7,-.7],[.7,.7],[-.7,.7],[.7,-.7]])g.drawImage(s,dx*pxW,dy*pxW);
  g.drawImage(src,0,0);return o;
}
const FSPR={};
function foeSprite(f,type,fr,brute,small){
  const key=f.id+type+fr+(brute?1:0)+(small?'s':'');if(FSPR[key])return FSPR[key];
  if(small){const big=foeSprite(f,type,fr,brute,0),c2=mk(40,44),g=c2.getContext('2d');FSPR[key]=c2;if(g&&g.drawImage){g.imageSmoothingQuality='high';g.drawImage(big,0,0,40,44)}return c2}
  const c0=mk(80,88),g=c0.getContext('2d');FSPR[key]=c0;if(!g||!g.createRadialGradient)return c0;
  g.lineJoin='round';g.lineCap='round';
  const T=type?FOES[type].col:f.accent,lo=fr?2.5:-2.5;
  FDRAW[f.id](g,f,T,lo);typeGear(g,f,T,type,brute);
  const out=outlineSprite(c0,80,88,2.2,'rgba(6,5,10,.92)');FSPR[key]=out;return out;
}
// the keep: back citadel, flanking towers, wall face, battlements and turrets, all built in the faction's style
function drawFort(K){
  const fy=S.fy,z=sc(fy)*K,y0=py(fy),pct=clamp(S.baseHP/S.baseMax,0,1),boss=S.lv.boss,f=fac(),fid=f.id,fw=S.fw||174,t=S.t,c=ctx;
  const X=x=>200+(x-200)*fw/174,PX=x=>px(X(x),fy),yT=py(-40),Hh=Math.max(8,y0-yT);
  const xl=PX(26),xr=PX(374),wpx=xr-xl,cxs=(xl+xr)/2,sy=fr=>yT+Hh*fr;
  const det=(i,s)=>{const v=Math.sin(i*127.1+s*311.7)*43758.5453;return v-Math.floor(v)};
  // contact shadow on the causeway
  {const sg=c.createLinearGradient(0,y0,0,y0+22*z);sg.addColorStop(0,'rgba(0,0,0,.55)');sg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=sg;c.fillRect(xl-6*z,y0,wpx+12*z,22*z)}
  // back citadel rising into the sky: a 3D command spire in the faction's colours
  const K3=g3('k_'+fid);
  if(K3){const cw=(px(X(374),-40)-px(X(26),-40))*1.08,ch=cw*360/640;c.drawImage(K3,0,40,640,360,cxs-cw/2,yT+Hh*.05-ch,cw,ch)}
  else  {const bw=wpx*.42,bh=Hh*.85+34*z,bx=cxs-bw/2,by=yT-bh;
   c.fillStyle=vgrad(c,by,yT,shade(f.wall[0],-.1),shade(f.wall[1],-.3));c.fillRect(bx,by,bw,bh+2);
   const sh=c.createLinearGradient(bx,0,bx+bw,0);sh.addColorStop(0,'rgba(0,0,0,.45)');sh.addColorStop(.3,'rgba(255,255,255,.07)');sh.addColorStop(1,'rgba(0,0,0,.5)');c.fillStyle=sh;c.fillRect(bx,by,bw,bh+2);
   for(let r2=0;r2<3;r2++)for(let i=0;i<6;i++){if(det(i,r2)<.35)continue;c.fillStyle=`rgba(${f.muzzle},${.35+.4*det(i+3,r2)})`;c.fillRect(bx+bw*(.1+i*.14),by+bh*(.25+r2*.22),bw*.05,bh*.08)}
   const tx=cxs,ty=by;
   if(fid==='robot'){c.fillStyle=shade(f.wall[0],.2);c.fillRect(bx-3*z,ty-4*z,bw+6*z,5*z);cylG(c,tx-1.5*z,ty-30*z,3*z,28*z,'#7a8496');c.save();c.translate(tx+bw*.3,ty-8*z);c.scale(Math.cos(t*1.2),1);c.fillStyle=vgrad(c,-8*z,8*z,'#dfe6ef','#566173');c.beginPath();c.ellipse(0,0,9*z,6*z,0,0,6.283);c.fill();c.restore();
     if(Math.sin(t*6)>0)glowDot(c,tx,ty-31*z,2.4*z,f.eye)}
   else if(fid==='bug'){sph(c,tx,ty+2*z,bw*.55,f.wall[0],bh*.28);for(let i=0;i<5;i++){const a=Math.PI*(1.1+i*.2);glowDot(c,tx+Math.cos(a)*bw*.4,ty+2*z+Math.sin(a)*bh*.18,(2.4+Math.sin(t*3+i))*z,f.accent)}}
   else if(fid==='beast'){for(let i=0;i<7;i++){const x2=bx+bw*(i+.5)/7;c.fillStyle=vgrad(c,ty-16*z,ty,'#c8a878','#5a3a20');c.beginPath();c.moveTo(x2-4*z,ty+2*z);c.lineTo(x2,ty-14*z-det(i,1)*8*z);c.lineTo(x2+4*z,ty+2*z);c.fill()}
     sph(c,tx,ty+12*z,12*z,'#e8e0cc',10*z);c.fillStyle='#120a06';for(const s of[-1,1]){c.beginPath();c.ellipse(tx+s*4.5*z,ty+11*z,3*z,3.6*z,0,0,6.283);c.fill();glowDot(c,tx+s*4.5*z,ty+11*z,1.3*z,f.eye)}
     for(const s of[-1,1]){c.strokeStyle='#efe6d2';c.lineWidth=3.5*z;c.beginPath();c.moveTo(tx+s*9*z,ty+16*z);c.quadraticCurveTo(tx+s*22*z,ty+18*z,tx+s*22*z,ty+2*z);c.stroke()}}
   else if(fid==='demon'){for(const s of[-1,1]){c.fillStyle=vgrad(c,ty-44*z,ty,'#3a1a1e','#0e0507');c.beginPath();c.moveTo(tx+s*bw*.18,ty+2*z);c.quadraticCurveTo(tx+s*bw*.5,ty-18*z,tx+s*bw*.42,ty-44*z);c.lineTo(tx+s*bw*.3,ty-14*z);c.lineTo(tx+s*bw*.05,ty+2*z);c.fill()}
     glowDot(c,tx,ty-6*z,(5+Math.sin(t*4))*z,f.accent)}
   else if(fid==='angel'){c.fillStyle=vgrad(c,ty-bw*.3,ty,'#fff3c0','#b8862a');c.beginPath();c.ellipse(tx,ty+1*z,bw*.36,bw*.3,0,Math.PI,0);c.fill();c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.ellipse(tx-bw*.12,ty-bw*.14,bw*.08,bw*.05,-.5,0,6.283);c.fill();
     c.save();c.shadowColor=f.accent;c.shadowBlur=12;c.strokeStyle=f.accent;c.lineWidth=3*z;c.beginPath();c.ellipse(tx,ty-bw*.42+Math.sin(t*2)*2*z,bw*.22,bw*.06,0,0,6.283);c.stroke();c.restore()}
   else{for(let i=0;i<6;i++){if(i%2)continue;c.fillStyle=shade(f.wall[0],.1);c.fillRect(bx+bw*i/6,ty-7*z,bw/6,8*z)}
     cylG(c,tx-7*z,ty-34*z,14*z,34*z,f.wall[0]);c.fillStyle=vgrad(c,ty-58*z,ty-34*z,shade(f.trim,.2),shade(f.wall[1],-.2));c.beginPath();c.moveTo(tx-9*z,ty-34*z);c.lineTo(tx,ty-58*z);c.lineTo(tx+9*z,ty-34*z);c.fill();
     c.fillStyle=f.accent;c.beginPath();c.moveTo(tx,ty-58*z);c.lineTo(tx+14*z+Math.sin(t*4)*2*z,ty-54*z);c.lineTo(tx,ty-50*z);c.fill()}
  }
  // flanking towers
  for(const ex of [40,360]){if(K3)continue;const tcx=PX(ex),tw=36*z*Math.max(.6,fw/174),ttop=yT-26*z;
    cylG(c,tcx-tw/2,ttop,tw,y0-ttop,f.wall[0]);
    c.fillStyle='rgba(0,0,0,.35)';for(let r2=1;r2<5;r2++)c.fillRect(tcx-tw/2,ttop+(y0-ttop)*r2/5,tw,1.2*z);
    c.fillStyle=`rgba(${f.muzzle},.75)`;c.fillRect(tcx-2*z,ttop+(y0-ttop)*.35,4*z,7*z);
    if(fid==='robot'){c.fillStyle=shade(f.wall[0],.25);c.fillRect(tcx-tw/2-2*z,ttop-4*z,tw+4*z,5*z);cylG(c,tcx-1*z,ttop-18*z,2*z,15*z,'#9aa6b8');if(Math.sin(t*5+ex)>0)glowDot(c,tcx,ttop-19*z,2*z,f.eye)}
    else if(fid==='bug'){sph(c,tcx,ttop-4*z,tw*.62,f.wall[0],tw*.5);glowDot(c,tcx,ttop-8*z,(3+Math.sin(t*3+ex))*z,f.accent)}
    else if(fid==='beast'){for(const s of[-1,1]){c.strokeStyle='#efe6d2';c.lineWidth=4*z;c.lineCap='round';c.beginPath();c.moveTo(tcx+s*tw*.3,ttop);c.quadraticCurveTo(tcx+s*tw*.9,ttop-6*z,tcx+s*tw*.6,ttop-22*z);c.stroke()}c.lineCap='butt';
      const fl=1+Math.sin(t*14+ex)*.15;glowDot(c,tcx,ttop-6*z,4*z*fl,'#ffa030')}
    else if(fid==='demon'){c.fillStyle=vgrad(c,ttop-34*z,ttop,'#4a1a1e','#120608');c.beginPath();c.moveTo(tcx-tw/2,ttop+1);c.lineTo(tcx,ttop-34*z);c.lineTo(tcx+tw/2,ttop+1);c.fill();glowDot(c,tcx,ttop-34*z,2.4*z,f.accent);
      c.strokeStyle=`rgba(255,120,40,${.5+.3*Math.sin(t*3+ex)})`;c.lineWidth=1.5*z;c.beginPath();c.moveTo(tcx-3*z,ttop-20*z);c.lineTo(tcx+2*z,ttop-10*z);c.lineTo(tcx-1*z,ttop);c.stroke()}
    else if(fid==='angel'){c.fillStyle=vgrad(c,ttop-tw*.6,ttop,'#fff3c0','#b8862a');c.beginPath();c.ellipse(tcx,ttop+1,tw*.55,tw*.6,0,Math.PI,0);c.fill();
      c.save();c.shadowColor=f.accent;c.shadowBlur=8;c.strokeStyle=f.accent;c.lineWidth=2*z;c.beginPath();c.ellipse(tcx,ttop-tw*.85+Math.sin(t*2+ex)*2*z,tw*.4,tw*.12,0,0,6.283);c.stroke();c.restore()}
    else{c.fillStyle=vgrad(c,ttop-30*z,ttop,shade(f.trim,.1),shade(f.wall[1],-.2));c.beginPath();c.moveTo(tcx-tw/2-2*z,ttop+1);c.lineTo(tcx,ttop-30*z);c.lineTo(tcx+tw/2+2*z,ttop+1);c.fill();
      c.fillStyle=f.accent;c.beginPath();c.moveTo(tcx,ttop-30*z);c.lineTo(tcx+12*z+Math.sin(t*5+ex)*2*z,ttop-27*z);c.lineTo(tcx,ttop-24*z);c.fill()}
  }
  // wall face: vertical light falloff plus curved side shading
  c.fillStyle=vgrad(c,yT,y0,shade(f.wall[0],fid==='angel'?-.18:-.05),shade(f.wall[1],fid==='angel'?-.35:-.2));c.beginPath();c.moveTo(px(X(26),-40),yT);c.lineTo(px(X(374),-40),yT);c.lineTo(xr,y0);c.lineTo(xl,y0);c.closePath();c.fill();
  c.save();c.clip();
  const hs=c.createLinearGradient(xl,0,xr,0);hs.addColorStop(0,'rgba(0,0,0,.45)');hs.addColorStop(.25,'rgba(255,255,255,.04)');hs.addColorStop(.45,'rgba(255,255,255,.09)');hs.addColorStop(.75,'rgba(0,0,0,.05)');hs.addColorStop(1,'rgba(0,0,0,.5)');c.fillStyle=hs;c.fillRect(xl,yT,wpx,Hh);
  {// armoured panels, glowing conduits and a light sweep in the faction colour
    const gl=f.glow,pulse=.55+.3*Math.sin(t*2.4),rows=[.18,.42,.66,.86],cols=12;
    c.lineWidth=Math.max(1,1.1*z);c.strokeStyle='rgba(0,0,0,.45)';c.beginPath();for(const fr of rows){c.moveTo(xl,sy(fr));c.lineTo(xr,sy(fr))}
    for(let r2=0;r2<=rows.length;r2++){const ya=r2?sy(rows[r2-1]):yT,yb2=r2<rows.length?sy(rows[r2]):y0;for(let i=1;i<cols;i++){const x2=xl+wpx*(i+(r2%2)*.5)/cols;if(x2>=xr)continue;c.moveTo(x2,ya);c.lineTo(x2,yb2)}}c.stroke();
    c.strokeStyle='rgba(255,255,255,.07)';c.beginPath();for(const fr of rows){c.moveTo(xl,sy(fr)+1.2*z);c.lineTo(xr,sy(fr)+1.2*z)}c.stroke();
    c.fillStyle=hexA(gl,.75*pulse);c.fillRect(xl,sy(.42)-.8*z,wpx,1.6*z);c.fillStyle=hexA(gl,.35*pulse);c.fillRect(xl,sy(.18)-.5*z,wpx,1*z);
    for(const fr2 of [.09,.27,.73,.91]){const x2=xl+wpx*fr2;c.fillStyle='rgba(0,0,0,.5)';c.fillRect(x2-3*z,yT+3*z,6*z,Hh*.78);c.fillStyle=hexA(gl,.8*pulse);c.fillRect(x2-1*z,yT+5*z,2*z,Hh*.74)}
    const sw=(t*.5)%1.6-.3,lx=xl+wpx*sw,lg=c.createLinearGradient(lx-wpx*.1,0,lx+wpx*.1,0);lg.addColorStop(0,hexA(gl,0));lg.addColorStop(.5,hexA(gl,.12));lg.addColorStop(1,hexA(gl,0));c.fillStyle=lg;c.fillRect(xl,yT,wpx,Hh);
    c.save();c.beginPath();c.rect(xl,sy(.88),wpx,Hh*.12);c.clip();c.fillStyle='rgba(0,0,0,.45)';c.fillRect(xl,sy(.88),wpx,Hh*.12);c.fillStyle=hexA(gl,.3);
    for(let x2=xl-Hh;x2<xr;x2+=14*z){c.beginPath();c.moveTo(x2,y0);c.lineTo(x2+5*z,y0);c.lineTo(x2+5*z+Hh*.12,sy(.88));c.lineTo(x2+Hh*.12,sy(.88));c.fill()}c.restore()}
  // cracks spread as the keep falls
  if(!S.cracks||S.cracks.L!==S.L){S.cracks={L:S.L,list:Array.from({length:14},()=>{const x=40+Math.random()*320;const pts=[[x,-6-Math.random()*8]];for(let i=0;i<4;i++){const p=pts[pts.length-1];pts.push([p[0]+(Math.random()-.5)*18,p[1]-6-Math.random()*8])}return pts})}}
  const nc=Math.floor((1-pct)*14);c.strokeStyle=fid==='demon'?'rgba(255,140,40,.9)':fid==='angel'?'rgba(80,60,100,.7)':'rgba(10,4,8,.8)';c.lineWidth=1.8;c.beginPath();
  for(let i=0;i<nc;i++){const pts=S.cracks.list[i];c.moveTo(px(X(pts[0][0]),fy+pts[0][1]),py(fy+pts[0][1]));for(const p of pts)c.lineTo(px(X(p[0]),fy+p[1]),py(fy+p[1]))}c.stroke();
  c.restore();
  // top ledge catches the light, plinth sits in shadow
  c.fillStyle=hexA(shade(f.wall[0],.35),.9);c.beginPath();c.moveTo(px(X(26),-40),yT);c.lineTo(px(X(374),-40),yT);c.lineTo(px(X(372),-36),yT+3*z);c.lineTo(px(X(28),-36),yT+3*z);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.4)';c.fillRect(xl,y0-4*z,wpx,4*z);
  // battlements
  const n=15;for(let i=0;i<n;i++){const x1=px(X(28+i*23.6),-40),x2=px(X(28+i*23.6+13),-40),mw=x2-x1,h=10*z;
    c.fillStyle=vgrad(c,yT-h,yT,shade(f.wall[0],.2),shade(f.wall[0],-.15));c.fillRect(x1,yT-h,mw,h);c.fillStyle='rgba(0,0,0,.35)';c.fillRect(x2-1.5*z,yT-h,1.5*z,h);
    c.fillStyle=hexA(f.glow,.85);c.fillRect(x1+mw*.2,yT-h-1*z,mw*.6,1.6*z)}
  // corner towers stand in front of the wall ends
  if(K3)for(const ex of [30,370]){const tcx=PX(ex),tw=36*z*Math.max(.6,fw/174),dw=tw*1.7,dh=dw*2.5;c.fillStyle='rgba(0,0,0,.4)';c.beginPath();c.ellipse(tcx,y0+2*z,dw*.45,4*z,0,0,6.283);c.fill();c.drawImage(K3,640,0,160,400,tcx-dw/2,y0+3*z-dh,dw,dh)}
  // blast door
  {const dw=48*z*fw/174,dh=Math.min(Hh*.75,30*z),dx1=cxs-dw/2,dyT=y0-dh;
   c.fillStyle=shade(f.trim,-.3);c.beginPath();c.moveTo(dx1-4*z,y0);c.lineTo(dx1-4*z,dyT+6*z);c.lineTo(dx1+6*z,dyT-4*z);c.lineTo(dx1+dw-6*z,dyT-4*z);c.lineTo(dx1+dw+4*z,dyT+6*z);c.lineTo(dx1+dw+4*z,y0);c.closePath();c.fill();
   for(const s of[0,1]){const x0=dx1+s*dw/2;c.fillStyle=vgrad(c,dyT,y0,'#3a3f4a','#14161c');c.fillRect(x0+1,dyT,dw/2-2,dh);c.fillStyle='rgba(255,255,255,.08)';for(let j=1;j<4;j++)c.fillRect(x0+2,dyT+dh*j/4,dw/2-4,1*z)}
   c.fillStyle=`rgba(${f.muzzle},${.7+.3*Math.sin(t*5)})`;c.fillRect(cxs-1*z,dyT,2*z,dh);
   if(boss){const by=yT-Hh*.85-50*z;c.fillStyle='#ffcf2e';c.beginPath();c.moveTo(cxs-11*z,by);c.lineTo(cxs-11*z,by-8*z);c.lineTo(cxs-5*z,by-3*z);c.lineTo(cxs,by-11*z);c.lineTo(cxs+5*z,by-3*z);c.lineTo(cxs+11*z,by-8*z);c.lineTo(cxs+11*z,by);c.closePath();c.fill();c.strokeStyle='#5a3a00';c.lineWidth=1;c.stroke()}}
  // turrets
  const glow=.6+.4*Math.sin(t*6)+(S.charge||0)*1.4;
  for(const tx0 of TUR){const x=PX(tx0),y=y0-Hh*.32;
    c.fillStyle='rgba(0,0,0,.45)';c.beginPath();c.ellipse(x,y+9*z,11*z,4*z,0,0,6.283);c.fill();
    cylG(c,x-10*z,y-2*z,20*z,10*z,shade(f.trim,-.25));sph(c,x,y-2*z,10*z,f.trim,8*z);
    c.fillStyle='#07080b';c.beginPath();c.ellipse(x,y+3*z,5*z,4*z,0,0,6.283);c.fill();
    if(!LQ()){c.globalCompositeOperation='lighter';c.globalAlpha=Math.min(1,glow);const gs2=26*z*(1+(S.charge||0)*1.2);c.drawImage(glowSprite(`rgb(${f.muzzle})`),x-gs2/2,y+3*z-gs2/2,gs2,gs2);c.globalAlpha=1;c.globalCompositeOperation='source-over'}
    c.fillStyle=`rgb(${f.muzzle})`;c.beginPath();c.arc(x,y+3*z,2.4*z,0,6.283);c.fill()}
  // carrier hangars on the flanks
  if(S.mech==='carrier')for(const ex of [40,360]){const x=PX(ex),hw=18*z,hy=y0-14*z;c.fillStyle='#07080b';c.fillRect(x-hw/2,hy,hw,14*z);c.fillStyle='#e8b020';for(let i=0;i<4;i++)c.fillRect(x-hw/2+i*hw/4,hy-2*z,hw/8,2*z);if(Math.sin(t*8+ex)>0)glowDot(c,x,hy+7*z,2*z,f.glow)}
  // shield bubble while the pylons stand
  if(S.shieldUp){const ry=Hh*.9+40*z,cy=y0-Hh*.4,rx=wpx*.58;const sg=c.createRadialGradient(cxs,cy,rx*.4,cxs,cy,rx);sg.addColorStop(0,'rgba(127,224,255,0)');sg.addColorStop(.85,'rgba(127,224,255,.12)');sg.addColorStop(1,'rgba(127,224,255,.4)');c.fillStyle=sg;c.beginPath();c.ellipse(cxs,cy,rx,ry,0,0,6.283);c.fill();
    c.strokeStyle=`rgba(180,240,255,${.5+.3*Math.sin(t*5)})`;c.lineWidth=2;c.stroke()}
  if(S.fortFlash>0&&SET.flash){c.fillStyle='rgba(255,255,255,'+(S.fortFlash*1.6)+')';c.fillRect(xl,yT,wpx,Hh)}
  if(pct<.5&&!LQ()&&Math.random()<(.5-pct)*.6&&S.sparks.length<240)S.sparks.push({x:X(40+Math.random()*320),y:fy-4,vx:(Math.random()-.5)*10,vy:-30-Math.random()*20,life:.9,c:fid==='demon'?'rgba(255,120,40,.5)':'rgba(60,50,55,.55)',smoke:1});
}
const BCOL=[['#ff2e63','#ffd1dc'],['#ff7a1a','#ffe1c2'],['#d13cff','#f3d1ff'],['#ff3b3b','#fff'],['#ff9f1a','#fff3c4'],['#ff2ea6','#ffd1f0']];
function render(){
  const K=k(),dtR=Math.min(.05,FRAME_DT);
  ctx.save();
  if(S.shake>0){const sh=S.shake*SET.shake;ctx.translate((Math.random()-.5)*sh,(Math.random()-.5)*sh);S.shake=Math.max(0,S.shake-dtR*40)}
  S.fortFlash=Math.max(0,(S.fortFlash||0)-dtR);S.hurtFx=Math.max(0,(S.hurtFx||0)-dtR*2.2);
  if(BG)ctx.drawImage(BG,0,0,W,H);else{ctx.fillStyle='#e9c99a';ctx.fillRect(-20,-20,W+40,H+40)}
  drawDecals(K);
  const lv=S.lv;
  // lane markers scroll toward you
  ctx.strokeStyle=biome().lane;ctx.lineWidth=2.2;ctx.setLineDash([14,16]);ctx.lineDashOffset=-S.t*60;
  for(const lx of [120,200,280]){const y0=lv.wall?lv.wall.y2:S.fy;ctx.beginPath();ctx.moveTo(px(lx,y0),py(y0));ctx.lineTo(px(lx,WH),py(WH));ctx.stroke()}
  ctx.setLineDash([]);ctx.lineDashOffset=0;
  // your flight zone
  drawZones(K);
  {const sh=S.baseShake>0?(Math.random()-.5)*4:0;ctx.save();ctx.translate(sh,0);if(S.breachT!=null){const k2=Math.min(1,S.breachT/1.5);ctx.beginPath();ctx.rect(0,0,W,py(S.fy)+1);ctx.clip();ctx.translate((Math.random()-.5)*6*(1-k2),k2*k2*(py(S.fy)-py(-40)+90*sc(S.fy)*K))}drawFortQ(K);drawKeepOverlay(K);drawProps3D(K);drawProps(K);ctx.restore()}
  if(lv.wall){const w=lv.wall;
    ctx.beginPath();ctx.moveTo(px(w.x-4,w.y1),py(w.y1));ctx.lineTo(px(w.x+4,w.y1),py(w.y1));ctx.lineTo(px(w.x+4,w.y2),py(w.y2));ctx.lineTo(px(w.x-4,w.y2),py(w.y2));ctx.closePath();ctx.fillStyle='#6f6a72';ctx.fill();
    ctx.beginPath();ctx.moveTo(px(w.x-4,w.y1),py(w.y1)-6*sc(w.y1)*K);ctx.lineTo(px(w.x+4,w.y1),py(w.y1)-6*sc(w.y1)*K);ctx.lineTo(px(w.x+4,w.y2),py(w.y2)-6*sc(w.y2)*K);ctx.lineTo(px(w.x-4,w.y2),py(w.y2)-6*sc(w.y2)*K);ctx.closePath();ctx.fillStyle='#c9c2c6';ctx.fill();
  }
  // enemy lasers (warning, then beam)
  for(const l of S.lasers){const firing=l.t>l.warn,ly=l.y0??S.fy;
    const w=firing?l.w:l.w*.35*(l.t/l.warn);
    ctx.fillStyle=firing?'rgba(255,46,99,.7)':'rgba(255,46,99,'+(.12+.22*(l.t/l.warn))+')';
    ctx.beginPath();ctx.moveTo(px(l.x-w/2,ly),py(ly));ctx.lineTo(px(l.x+w/2,ly),py(ly));ctx.lineTo(px(l.x+w/2,WH),py(WH));ctx.lineTo(px(l.x-w/2,WH),py(WH));ctx.closePath();ctx.fill();
    if(firing){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,180,200,.9)';ctx.beginPath();ctx.moveTo(px(l.x-w/5,ly),py(ly));ctx.lineTo(px(l.x+w/5,ly),py(ly));ctx.lineTo(px(l.x+w/5,WH),py(WH));ctx.lineTo(px(l.x-w/5,WH),py(WH));ctx.closePath();ctx.fill();ctx.globalCompositeOperation='source-over'}}
  {const c=S.cannon;let ny=-1e9;for(const g of lv.gates)if(!g.dead&&g.y<c.y-6&&g.y>ny)ny=g.y;S.nextG=null;if(ny>-1e9)for(const g of lv.gates){if(g.dead||g.y!==ny)continue;const o=gateX(g);if(c.x>=g.x1+o&&c.x<=g.x2+o){S.nextG=g;break}}}
  const objs=[];for(const g of lv.gates)if(!g.dead)objs.push({y:g.y,g});
  objs.sort((a,b)=>a.y-b.y);
  let prev=-100;
  for(const o of objs){drawEnemies(prev,o.y,K);drawPlayers(prev,o.y,K);prev=o.y;drawGate(o.g,K)}
  drawEnemies(prev,WH+50,K);drawPlayers(prev,WH+50,K);
  // your laser / flame (additive)
  ctx.globalCompositeOperation='lighter';
  for(const b of S.beams){const wob=1+Math.sin(S.t*40)*.08;ctx.fillStyle=b.dr?'rgba(255,220,90,.45)':'rgba(90,200,255,.4)';ctx.beginPath();ctx.moveTo(px(b.x-b.w*wob/2,S.fy),py(S.fy));ctx.lineTo(px(b.x+b.w*wob/2,S.fy),py(S.fy));ctx.lineTo(px(b.x+b.w*wob/2,b.y),py(b.y));ctx.lineTo(px(b.x-b.w*wob/2,b.y),py(b.y));ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.moveTo(px(b.x-b.w/6,S.fy),py(S.fy));ctx.lineTo(px(b.x+b.w/6,S.fy),py(S.fy));ctx.lineTo(px(b.x+b.w/6,b.y),py(b.y));ctx.lineTo(px(b.x-b.w/6,b.y),py(b.y));ctx.closePath();ctx.fill()}
  for(const c of S.cones){const top=c.y-c.reach;const g=ctx.createLinearGradient(0,py(c.y),0,py(top));g.addColorStop(0,'rgba(255,230,120,.9)');g.addColorStop(.5,'rgba(255,120,30,.6)');g.addColorStop(1,'rgba(255,60,20,0)');ctx.fillStyle=g;
    for(let k2=0;k2<2;k2++){ctx.beginPath();ctx.moveTo(px(c.x,c.y),py(c.y));const wob=Math.sin(S.t*30+k2*2)*4;const sp=k2?.35:.5;ctx.lineTo(px(c.x-c.reach*sp-8+wob,top),py(top));ctx.quadraticCurveTo(px(c.x,top-10),py(top-10),px(c.x+c.reach*sp+8-wob,top),py(top));ctx.closePath();ctx.fill()}}
  // explosions: flash, fireball and a shockwave ring
  if(FXOK())for(const b of S.booms){if(!b.seen){b.seen=1;boomFx(b)}}
  if(!FXOK())for(const b of S.booms){const z=sc(b.y)*K,a=Math.min(1,b.life/.3),gr=1.3-a*.3,x=px(b.x,b.y),y=py(b.y);
    ctx.globalAlpha=a;ctx.drawImage(glowSprite('rgb(255,170,60)'),x-b.r*z*1.6*gr,y-b.r*z*1.1*gr,b.r*z*3.2*gr,b.r*z*2.2*gr);
    ctx.globalAlpha=a*.9;ctx.fillStyle='#fff3c4';ctx.beginPath();ctx.ellipse(x,y-2*z,b.r*z*.45*gr,b.r*z*.28*gr,0,0,6.283);ctx.fill();ctx.globalAlpha=1}
  ctx.globalCompositeOperation='source-over';
  drawVfx(dtR,K);
  if(!FXOK())for(const b of S.booms){const z=sc(b.y)*K,a=Math.min(1,b.life/.3),gr=1.6-a*.6;ctx.strokeStyle='rgba(255,255,255,'+(a*.7)+')';ctx.lineWidth=2.5*a+.5;ctx.beginPath();ctx.ellipse(px(b.x,b.y),py(b.y),b.r*z*gr,b.r*z*.45*gr,0,0,6.283);ctx.stroke()}
  // mortar warnings
  for(const a of S.arts){const t=a.t/a.dur,z=sc(a.y)*K,cx=px(a.x,a.y),cy=py(a.y);
    if(FXOK()){dspr('xhair',null,cx,cy,52*z,22*z,0,.45+.55*t);ctx.fillStyle='rgba(239,59,59,'+(.1+.25*t)+')';ctx.beginPath();ctx.ellipse(cx,cy,26*z*t,10*z*t,0,0,6.283);ctx.fill();
      const x=a.x0+(a.x-a.x0)*t,y=a.y0+(a.y-a.y0)*t,zz=sc(y)*K,arc=Math.sin(t*Math.PI)*120*K,vy=Math.cos(t*Math.PI)*120*K;ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(px(x,y),py(y),6*zz,2.5*zz,0,0,6.283);ctx.fill();dspr('shellR',null,px(x,y),py(y)-arc,8*zz,16*zz,Math.atan2(-vy,(a.x-a.x0)*K*.5)+Math.PI/2);continue}
    ctx.strokeStyle='rgba(239,59,59,'+(.4+.6*t)+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(cx,cy,30*z,11*z,0,0,6.283);ctx.stroke();
    ctx.fillStyle='rgba(239,59,59,'+(.12+.25*t)+')';ctx.beginPath();ctx.ellipse(cx,cy,30*z*t,11*z*t,0,0,6.283);ctx.fill();
    const x=a.x0+(a.x-a.x0)*t,y=a.y0+(a.y-a.y0)*t,zz=sc(y)*K,arc=Math.sin(t*Math.PI)*120*K;
    ctx.fillStyle='rgba(0,0,0,.2)';ctx.beginPath();ctx.ellipse(px(x,y),py(y),6*zz,2.5*zz,0,0,6.283);ctx.fill();
    ctx.drawImage(coreSprite('#ef3b3b','#ffb3b3'),px(x,y)-7*zz,py(y)-arc-7*zz,14*zz,14*zz)}
  for(const s2 of S.shells){const t=s2.t/s2.dur,x=s2.x0+(s2.x-s2.x0)*t,y=s2.y0+(s2.y-s2.y0)*t,z=sc(y)*K,arc=Math.sin(t*Math.PI)*60*K;
    ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(px(x,y),py(y),5*z,2*z,0,0,6.283);ctx.fill();if(!dspr('shell',null,px(x,y),py(y)-arc,7*z,14*z,Math.atan2(-Math.cos(t*Math.PI)*60*K,(s2.x-s2.x0)*K*.5)+Math.PI/2))ctx.drawImage(coreSprite('#2b2b33','#888'),px(x,y)-5*z,py(y)-arc-5*z,10*z,10*z)}
  // your missiles with exhaust glow
  for(const m of S.miss){const z=sc(m.y)*K,x=px(m.x,m.y),y=py(m.y)-6*z,a=Math.atan2(m.vy,m.vx);
    if(FXOK()){dspr('jetO',null,x-Math.cos(a)*9*z,y-Math.sin(a)*9*z,6*z,12*z,a-Math.PI/2,.9,1);if(!missile3D(m.fort?1:0,x,y,22*z,a+Math.PI/2))dspr(m.fort?'misG':'misB',null,x,y,9*z,18*z,a+Math.PI/2);continue}
    ctx.globalCompositeOperation='lighter';ctx.drawImage(glowSprite('rgb(255,170,60)'),x-Math.cos(a)*8*z-7*z,y-Math.sin(a)*8*z-7*z,14*z,14*z);ctx.globalCompositeOperation='source-over';
    ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle='#e8eef5';ctx.beginPath();ctx.moveTo(7*z,0);ctx.lineTo(-5*z,-3*z);ctx.lineTo(-5*z,3*z);ctx.closePath();ctx.fill();ctx.fillStyle=m.fort?'#ffd76a':'#1478a8';ctx.fillRect(-6*z,-3.5*z,3*z,7*z);ctx.restore()}
  // sparks and smoke
  drawSparksFx(K);
  ctx.globalAlpha=1;
  ctx.globalCompositeOperation='lighter';ctx.strokeStyle='#bfe8ff';ctx.lineWidth=2.5;
  for(const b of S.bolts){ctx.beginPath();ctx.moveTo(px(b.x1,b.y1),py(b.y1));for(let i=1;i<6;i++){const t=i/6,x=b.x1+(b.x2-b.x1)*t+(Math.random()-.5)*12,y=b.y1+(b.y2-b.y1)*t;ctx.lineTo(px(x,y),py(y))}ctx.lineTo(px(b.x2,b.y2),py(b.y2)-6);ctx.stroke();
    ctx.drawImage(glowSprite('rgb(120,180,255)'),px(b.x2,b.y2)-12,py(b.y2)-18,24,24)}
  ctx.globalCompositeOperation='source-over';
  drawSaws(K);drawEngineer(K);drawDrones(K);if(S.deadT==null)drawVehicle(K);drawOrbs(K);drawBruteLabels(K);
  drawBlackout();drawModsGround(K);
  // enemy bullets: additive glow, then a glossy core; outlined ones get a dark ring
  ctx.globalCompositeOperation='lighter';
  const HC=SET.contrast;
  if(!LQ())for(const b of S.bul){const z=sc(b.y)*K,r=(b.r+6)*z;ctx.drawImage(glowSprite(hexRgb(HC?'#ffe600':BCOL[b.col][0])),px(b.x,b.y)-r,py(b.y)-4*z-r,r*2,r*2)}
  ctx.globalCompositeOperation='source-over';
  for(const b of S.bul){const z=sc(b.y)*K,r=(b.r+1.5)*z,x=px(b.x,b.y),y=py(b.y)-4*z;if(b.home&&FXOK()){const a=Math.atan2(b.vy,b.vx);dspr('jetO',null,x-Math.cos(a)*10*z,y-Math.sin(a)*10*z,7*z,14*z,a-Math.PI/2,.9,1);if(!missile3D(2,x,y,28*z,a+Math.PI/2))dspr('misR',null,x,y,12*z,24*z,a+Math.PI/2);continue}ctx.drawImage(HC?coreSprite('#ffe600','#ffffff'):coreSprite(BCOL[b.col][0],BCOL[b.col][1]),x-r,y-r,r*2,r*2)}
  {ctx.strokeStyle=HC?'#000':'rgba(8,6,14,.8)';ctx.lineWidth=HC?1.5:1.1;ctx.beginPath();for(const b of S.bul){if(b.home)continue;const z=sc(b.y)*K,r=(b.r+1.8)*z,x=px(b.x,b.y),y=py(b.y)-4*z;ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,6.283)}ctx.stroke()}
  {const hard=S.bul.filter(b=>b.hard);if(hard.length){ctx.strokeStyle=HC?'#ff00d4':'#1d1a2b';ctx.lineWidth=HC?2.6:1.8;ctx.beginPath();for(const b of hard){const z=sc(b.y)*K,r=(b.r+2.6)*z;const x=px(b.x,b.y),y=py(b.y)-4*z;ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,6.283)}ctx.stroke()}
   const frz=S.bul.filter(b=>b.frz>0);if(frz.length){ctx.strokeStyle='#bfe8ff';ctx.lineWidth=2;ctx.beginPath();for(const b of frz){const z=sc(b.y)*K,r=(b.r+3.5)*z;const x=px(b.x,b.y),y=py(b.y)-4*z;ctx.moveTo(x+r,y);ctx.arc(x,y,r,0,6.283)}ctx.stroke()}}
  // damage numbers pop in
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(const p of S.popups){if(!SET.nums&&/^[-\d]/.test(p.t))continue;const z=sc(p.y)*K,age=.9-p.life,pop=age<.12?.6+age*3.4:1,fs=Math.max(13,17*z)*pop;ctx.globalAlpha=Math.min(1,p.life*2.2);
    if(p.sfx){const f2=Math.max(12,16*z)*(age<.1?1.35-age*3.5:1);ctx.save();ctx.translate(px(p.x,p.y),py(p.y));ctx.font=`800 ${f2}px Orbitron,sans-serif`;ctx.lineJoin='round';ctx.lineWidth=f2*.22;ctx.strokeStyle='rgba(4,6,12,.9)';ctx.strokeText(p.t,0,0);ctx.fillStyle=p.c;ctx.fillText(p.t,0,0);ctx.restore();continue}ctx.font=`700 ${fs}px "Barlow Condensed",sans-serif`;ctx.lineWidth=4;ctx.strokeStyle='#1d1a2b';ctx.strokeText(p.t,px(p.x,p.y),py(p.y));ctx.fillStyle=p.c;ctx.fillText(p.t,px(p.x,p.y),py(p.y))}
  ctx.globalAlpha=1;
  ctx.restore();
  // drifting dust in screen space
  drawWeather(dtR);
  // the colour grade lives in the cached backdrop; only the cached vignette is drawn on top each frame
  vignette();
  // hurt flash and low-HP pulse
  const hpP=S.cannon.hp/Math.max(1,S.st.maxHp),low=S.running&&hpP<.3?(.18+.12*Math.sin(S.t*6))*(1-hpP/.3):0,ha=Math.max(S.hurtFx*.45,low);
  if(ha>.01&&(SET.flash||low>0)){const vg=ctx.createRadialGradient(W/2,H*.55,Math.min(W,H)*.3,W/2,H*.55,Math.max(W,H)*.75);vg.addColorStop(0,'rgba(220,20,50,0)');vg.addColorStop(1,'rgba(220,20,50,'+ha+')');ctx.fillStyle=vg;ctx.fillRect(0,0,W,H)}
  // siege: red alarm pulse and speed lines toward the marching keep; defeat drains the colour
  if(S.siege&&!S.over){const a=.16+.1*Math.sin(S.t*6),vg=ctx.createRadialGradient(W/2,H*.5,Math.min(W,H)*.25,W/2,H*.5,Math.max(W,H)*.72);vg.addColorStop(0,'rgba(255,30,60,0)');vg.addColorStop(1,`rgba(255,30,60,${a})`);ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);drawSpeedLines(.1,'rgb(255,90,110)',W/2,py(S.fy))}
  else if(S.running&&S.players.some(u=>u.big))drawSpeedLines(.09,'rgb(255,255,255)',W/2,py(S.fy));
  if(S.deadT!=null){ctx.globalCompositeOperation='saturation';ctx.fillStyle=`rgba(128,128,128,${Math.min(1,S.deadT*1.2)})`;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='source-over'}
  drawCut();drawShutters();
}
function drawGate(g,K){
  const o=gateX(g),y=g.y,z=sc(y)*K,x1=px(g.x1+o,y),x2=px(g.x2+o,y),yb=py(y),h=26*z,w=x2-x1,fort=isHeld(g)&&g.own<0;
  const base=g.follow?'#1a6a96':g.t==='sub'?'#7a1c1c':fort?'#a0201a':g.t==='mul'?'#1e5fa0':'#1f7a4a';
  const lite=g.follow?'#7fd6f4':g.t==='sub'?'#ff7a5c':fort?'#ff6a3a':g.t==='mul'?'#7fd0ff':'#8af0b0';
  {ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse((x1+x2)/2,yb+2*z,w/2+6*z,4*z,0,0,6.283);ctx.fill()}
  if(!LQ()){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+(g.flash>0?.45:0);ctx.drawImage(glowSprite(hexRgb(lite)),x1-8*z,yb-h-6*z,w+16*z,h+16*z);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  // hard-light field with drifting scanlines
  const gr=ctx.createLinearGradient(0,yb-h,0,yb);gr.addColorStop(0,hexA(lite,g.follow?.35:.6));gr.addColorStop(.45,hexA(base,g.follow?.3:.5));gr.addColorStop(1,hexA(shade(base,-.4),g.follow?.35:.7));
  ctx.fillStyle=gr;ctx.fillRect(x1,yb-h,w,h);
  ctx.fillStyle=hexA(lite,.35);for(let i=0;i<4;i++){const sy2=yb-h+(((S.t*22+i*h/(4*z))*z)%h);ctx.fillRect(x1,sy2,w,Math.max(1,.9*z))}
  ctx.fillStyle=hexA('#ffffff',.85);ctx.fillRect(x1,yb-h,w,Math.max(1,1.4*z));ctx.fillStyle=hexA(lite,.9);ctx.fillRect(x1,yb-1.6*z,w,1.6*z);
  if(g.flash>0){ctx.fillStyle='rgba(255,255,255,'+(g.flash*3)+')';ctx.fillRect(x1,yb-h,w,h)}
  if(g===S.nextG&&S.running){const pa=.55+.45*Math.sin(S.t*9);ctx.strokeStyle=hexA('#ffffff',.5+.4*pa);ctx.lineWidth=Math.max(1.5,2.2*z);ctx.strokeRect(x1+1,yb-h-1,w-2,h+1);
    ctx.fillStyle=hexA(lite,.6*pa);const cy2=yb+6*z+pa*2*z;for(const dx of [-.25,0,.25]){const cx2=(x1+x2)/2+dx*w;ctx.beginPath();ctx.moveTo(cx2-4*z,cy2+4*z);ctx.lineTo(cx2,cy2);ctx.lineTo(cx2+4*z,cy2+4*z);ctx.lineTo(cx2+4*z,cy2+6*z);ctx.lineTo(cx2,cy2+2*z);ctx.lineTo(cx2-4*z,cy2+6*z);ctx.closePath();ctx.fill()}}
  // emitter pylons at both ends
  const GP=g3('gpost');if(GP){const pi=fort||g.t==='sub'?1:g.t==='add'?2:0,pw=11*z,ph=pw*256/96;for(const ex of [x1,x2])ctx.drawImage(GP,pi*96,0,96,256,ex-pw/2,yb+1.5*z-ph,pw,ph)}
  else for(const ex of [x1,x2]){cylG(ctx,ex-3.6*z,yb-h-7*z,7.2*z,h+9*z,fort?'#6a4a48':'#5a6878');sph(ctx,ex,yb-h-7*z,4.4*z,fort?'#a07070':'#9aaabb',2.6*z);
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(ex-3.6*z,yb-h*.62,7.2*z,1.2*z);ctx.fillStyle=lite;ctx.fillRect(ex-1.2*z,yb-h*.5,2.4*z,h*.36)}
  if(isHeld(g)){const p=(g.ctl+1)/2;ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x1,yb+3*z,w,3.5*z);ctx.fillStyle=g.own>0?'#5fd0ff':'#ff5a2a';ctx.fillRect(x1,yb+3*z,w*(g.own>0?p:1-p),3.5*z)}
  const label=g.t==='mul'?'×'+gateMul(g):g.t==='add'?'+'+g.v:'−'+fmt(g.pool);
  const fs=Math.max(11,Math.min(h*1.05,w*.55));
  ctx.font=`700 ${fs}px "Barlow Condensed","Arial Narrow",sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.lineWidth=Math.max(3,fs*.22);ctx.strokeStyle='#05080e';ctx.strokeText(label,(x1+x2)/2,yb-h/2+1);ctx.fillStyle=fort?'#ffc0a0':'#f2fbff';ctx.fillText(label,(x1+x2)/2,yb-h/2+1);
}
function drawPlayers(y0,y1,K){
  const list=S.players.filter(u=>u.y>y0&&u.y<=y1);if(!list.length)return;
  const R_=u=>radius(u.w)*sc(u.y)*K*(u.big?2.2:1);
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();for(const u of list){const r=R_(u);ctx.moveTo(px(u.x,u.y)+r,py(u.y));ctx.ellipse(px(u.x,u.y),py(u.y),r,r*.38,0,0,6.283)}ctx.fill();
  const bc=cosSel('blob').c,spr=projSprite(R.veh,bc),hot=projSprite(R.veh,bc==='#ffd76a'?'#ffffff':'#ffd76a'),avg=S.st.weight;
  if(!LQ()){ctx.globalCompositeOperation='lighter';for(const u of list){if(u.w>avg*6||u.big){const r=R_(u)*2.2;ctx.globalAlpha=.5;ctx.drawImage(glowSprite('rgb(255,215,106)'),px(u.x,u.y)-r,py(u.y)-R_(u)-r,r*2,r*2)}}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
  if(FXOK())for(const u of list){if(!u.big)continue;const r=R_(u),x=px(u.x,u.y),y=py(u.y)-r;dspr('trace_01','#ffd76a',x,y+r*2.4,r*1.6,r*4,0,.7,1);dspr('twirl_01','#ffd76a',x,y,r*3.4,r*3.4,S.t*9,.8,1);dspr('twirl_01','#ffffff',x,y,r*2.6,r*2.6,-S.t*12,.5,1)}
  const hc=bc==='#ffd76a'?'#ffffff':'#ffd76a',p3=G3D.st['q_'+R.veh]===1||(g3('q_'+R.veh),false);
  for(const u of list){const r=R_(u),q=1+Math.sin(S.t*14+u.x*.3)*.05,x=px(u.x,u.y),y=py(u.y),hh=u.w>avg*6||u.big,im=p3&&proj3D(R.veh,hh?hc:bc,r*2.7*DPR);if(im){const s3=r*2.7;ctx.drawImage(im,x-s3/2,y-r*1.1-s3/2,s3,s3)}else ctx.drawImage(hh?hot:spr,x-r*q,y-r*2.2/q,r*2*q,r*2.25/q)}
}
function foeCol(e){return e.brute?'#ffcf2e':e.t?FOES[e.t].col:'#ef3b3b'}
function drawEnemies(y0,y1,K){
  const list=S.enemies.filter(e=>e.y>y0&&e.y<=y1);if(!list.length)return;
  const f=fac(),R_=e=>radius(e.w,e.brute)*sc(e.y)*K*(e.t==='runner'?.85:e.t==='totem'?1.2:1);
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();for(const e of list){if(e.dr)continue;const r=R_(e)*(e.elite?2:1);ctx.moveTo(px(e.x,e.y)+r,py(e.y));ctx.ellipse(px(e.x,e.y),py(e.y),r,r*.38,0,0,6.283)}ctx.fill();
  for(const e of list){
    if(e.elite||e.dr||e.pylon||e.courier){drawSpecial(e,K);continue}
    const r=R_(e),x=px(e.x,e.y),y=py(e.y),bob=Math.abs(Math.sin(e.wob*1.3))*r*.15,fr=((e.wob*.8)|0)&1;
    if(e.t==='phantom'&&e.phase)ctx.globalAlpha=.3;
    if(e.slowT>0){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.4;ctx.drawImage(glowSprite('rgb(150,210,255)'),x-r*1.6,y-r*2.6,r*3.2,r*3.2);ctx.globalAlpha=e.t==='phantom'&&e.phase?.3:1;ctx.globalCompositeOperation='source-over'}
    const w=r*3.2,h=w*1.1,S3=w*1.45,m3=foe3D(f.id,e.t,fr,S3*DPR);if(m3){if(e.brute)bruteMark(x,y,S3,bob);ctx.drawImage(m3,x-S3/2,y-S3*.8-bob,S3,S3)}else ctx.drawImage(foeSprite(f,e.t,fr,e.brute,w<30||LQ()),x-w/2,y-h*.94-bob,w,h);
    ctx.globalAlpha=1}
  for(const e of list){if(!e.t||e.elite)continue;const r=R_(e),x=px(e.x,e.y),y=py(e.y)-r*1.6,z=sc(e.y)*K;
    if(e.t==='bomber'){ctx.fillStyle=Math.sin(S.t*20)>0?'#fff':'#ff5050';ctx.beginPath();ctx.arc(x+r*.75,y-r*1.25,1.8*z,0,6.283);ctx.fill()}
    else if(e.t==='totem'){ctx.strokeStyle='rgba(20,184,166,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,py(e.y),70*z*.95,26*z,0,0,6.283);ctx.stroke()}
    else if(e.t==='saboteur'&&e.chew>0){ctx.fillStyle='#fff';ctx.font=`700 ${Math.max(9,10*z)}px "Barlow Condensed",sans-serif`;ctx.textAlign='center';ctx.fillText('HACK',x,y-r*1.2)}}
}
function drawSpecial(e,K){
  const z=sc(e.y)*K,x=px(e.x,e.y),y=py(e.y),f=fac();
  if(e.elite){const E=e.elite,s=1.6,zz=z*s;if(e.lblT==null)e.lblT=S.t;const la=clamp(1-(S.t-e.lblT-2.6)/.5,0,1);
    if(!LQ()){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55+.2*Math.sin(S.t*6);ctx.drawImage(glowSprite(hexRgb(f.glow)),x-30*zz,y-14*zz,60*zz,26*zz);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
    if(e.slowT>0){ctx.globalAlpha=.5;ctx.drawImage(glowSprite('rgb(150,210,255)'),x-30*zz,y-36*zz,60*zz,50*zz);ctx.globalAlpha=1}
    if(!drawElite3D(E.k,f.id,E.vx||0,x,y-4*zz,zz)){ctx.save();ctx.translate(x,y-8*zz);ctx.rotate(Math.PI-clamp((E.vx||0)/700,-.3,.3));drawVehSpr(ctx,vehSprite(E.k,f.pal,f.glow,2,shade(f.pal[0],-.6)),zz);ctx.restore()}
    if(E.k==='robot')for(let i=0;i<3;i++){const a=E.saw+i*2.094,sx=e.x+Math.cos(a)*30,sy2=e.y+Math.sin(a)*24,z2=sc(sy2)*K;sawShape(px(sx,sy2),py(sy2)-8*z2,9*z2,S.t*18,f.glow)}
    if(E.hold>0){ctx.globalCompositeOperation='lighter';const gs=(14+20*(1-E.hold/1.4))*zz;ctx.drawImage(glowSprite('rgb(255,80,120)'),x-gs/2,y+4*zz-gs/2,gs,gs);ctx.globalCompositeOperation='source-over'}
    const p=Math.max(0,e.w/e.max),bw=46*z,by=y-44*zz;ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x-bw/2-1,by-1,bw+2,5*z+2);ctx.fillStyle=f.glow;ctx.fillRect(x-bw/2,by,bw*p,5*z);
    ctx.font=`700 ${Math.max(11,12*z)}px "Barlow Condensed",sans-serif`;ctx.textAlign='center';ctx.textBaseline='bottom';ctx.lineWidth=3;ctx.strokeStyle='#000';if(la>0){ctx.globalAlpha=la;ctx.strokeText(E.name.toUpperCase(),x,by-2);ctx.fillStyle='#fff';ctx.fillText(E.name.toUpperCase(),x,by-2);ctx.globalAlpha=1}ctx.textBaseline='middle';
  }else if(e.courier){const fr=((e.wob*.8)|0)&1,w=Math.max(26,radius(e.w,false)*z*7),h=w*1.1;
    if(!LQ()){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.6;ctx.drawImage(glowSprite('rgb(255,207,46)'),x-w*.7,y-h,w*1.4,h*1.1);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
    {const m3=foe3D(f.id,'runner',fr,w*1.1*DPR);if(m3)ctx.drawImage(m3,x-w*.55,y-w*.9,w*1.1,w*1.1);else ctx.drawImage(foeSprite(f,'runner',fr,1,0),x-w/2,y-h*.94,w,h)}sph(ctx,x+w*.3,y-h*.45,w*.16,'#c8962e');
    const t='$ '+Math.ceil(e.courier.t);ctx.font=`900 ${Math.max(11,13*z)}px Orbitron,sans-serif`;ctx.textAlign='center';ctx.textBaseline='bottom';ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(t,x,y-h-2);ctx.fillStyle='#ffcf2e';ctx.fillText(t,x,y-h-2);ctx.textBaseline='middle';
  }else if(e.dr){const yy=y-12*z,a=e.dr.ph?(e.dr.side<0?-.5:.5):0,d3=foe3D(f.id,'',((e.wob||0)*.8|0)&1,30*z*DPR);if(d3){ctx.save();ctx.translate(x,yy);ctx.rotate(a*.5);ctx.drawImage(d3,-15*z,-18*z,30*z,30*z);ctx.restore();ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,y,8*z,3*z,0,0,6.283);ctx.fill()}else{ctx.save();ctx.translate(x,yy);ctx.rotate(Math.PI+a);
    ctx.fillStyle=vgrad(ctx,-9*z,9*z,f.pal[2],f.pal[0]);ctx.beginPath();ctx.moveTo(0,-10*z);ctx.lineTo(10*z,7*z);ctx.lineTo(0,3*z);ctx.lineTo(-10*z,7*z);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(0,0,0,.8)';ctx.lineWidth=1.2;ctx.stroke();
    glowDot(ctx,0,-1*z,2.4*z,f.glow);ctx.restore();
    ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,y,8*z,3*z,0,0,6.283);ctx.fill()}}
  else if(e.pylon){const hgt=34*z;ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(x,y,14*z,5*z,0,0,6.283);ctx.fill();
    if(!pylon3D(x,y,z)){cylG(ctx,x-9*z,y-10*z,18*z,10*z,'#4a5468');cylG(ctx,x-4*z,y-hgt,8*z,hgt-8*z,'#7a8498');
    const cg=ctx.createLinearGradient(0,y-hgt-14*z,0,y-hgt+4*z);cg.addColorStop(0,'#ffffff');cg.addColorStop(1,'#3ac0ff');ctx.fillStyle=cg;ctx.beginPath();ctx.moveTo(x,y-hgt-16*z);ctx.lineTo(x+6*z,y-hgt-4*z);ctx.lineTo(x,y-hgt+4*z);ctx.lineTo(x-6*z,y-hgt-4*z);ctx.closePath();ctx.fill()}
    if(!LQ()){ctx.globalCompositeOperation='lighter';ctx.drawImage(glowSprite('rgb(80,200,255)'),x-16*z,y-hgt-20*z,32*z,32*z);
      ctx.strokeStyle=`rgba(127,224,255,${.35+.25*Math.sin(S.t*8)})`;ctx.lineWidth=2.5*z;ctx.beginPath();ctx.moveTo(x,y-hgt-6*z);ctx.lineTo(px(200,S.fy),py(S.fy)-20*sc(S.fy)*K);ctx.stroke();ctx.globalCompositeOperation='source-over'}
    const p=Math.max(0,e.w/e.max),bw=40*z,by=y-hgt-26*z;ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(x-bw/2-1,by-1,bw+2,5*z+2);ctx.fillStyle='#7fe0ff';ctx.fillRect(x-bw/2,by,bw*p,5*z);
    ctx.font=`700 ${Math.max(10,11*z)}px "Barlow Condensed",sans-serif`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#000';if(e.lblT==null)e.lblT=S.t;const la=clamp(1-(S.t-e.lblT-3)/.5,0,1);if(la>0){ctx.globalAlpha=la;ctx.strokeText('SHIELD PYLON',x,by-7*z);ctx.fillStyle='#bfefff';ctx.fillText('SHIELD PYLON',x,by-7*z);ctx.globalAlpha=1}}
}
function drawBruteLabels(K){
  ctx.textAlign='center';ctx.textBaseline='middle';
  for(const e of S.enemies){if(!e.brute||e.elite||e.pylon)continue;const z=sc(e.y)*K,r=radius(e.w,e.brute)*z,x=px(e.x,e.y),y=py(e.y)-r*3.6;
    const t=fmt(e.w),fs=Math.max(9,10.5*z),bw=Math.max(26*z,fs*t.length*.62+10),bh=fs*1.25;
    ctx.fillStyle='rgba(8,10,16,.82)';rrect(ctx,x-bw/2,y-bh/2,bw,bh,bh/2);ctx.fill();ctx.strokeStyle='rgba(255,90,90,.85)';ctx.lineWidth=1.2;ctx.stroke();
    ctx.font=`700 ${fs}px "Barlow Condensed",sans-serif`;ctx.fillStyle='#ffd0d0';ctx.fillText(t,x,y+1)}
}
function sawShape(x,y,r,rot,col){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.fillStyle=col;ctx.beginPath();for(let j=0;j<16;j++){const rr=j%2?r*.62:r,aa=j*Math.PI/8;ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr)}ctx.closePath();ctx.fill();ctx.strokeStyle='#1d1a2b';ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle='#1d1a2b';ctx.beginPath();ctx.arc(0,0,r*.22,0,6.283);ctx.fill();ctx.restore()}
function drawExtras(K){
  for(const p of S.trail){const z=sc(p.y)*K,a=Math.min(1,p.t);ctx.fillStyle='rgba(255,140,40,'+(.35*a)+')';ctx.beginPath();ctx.ellipse(px(p.x,p.y),py(p.y),11*z,5*z,0,0,6.283);ctx.fill()}
  for(const k2 of S.kamis){const z=sc(k2.y)*K,x=px(k2.x,k2.y),y=py(k2.y)-10*z;ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(k2.vy,k2.vx));ctx.fillStyle='#1d1a2b';ctx.beginPath();ctx.moveTo(9*z,0);ctx.lineTo(-6*z,-6*z);ctx.lineTo(-3*z,0);ctx.lineTo(-6*z,6*z);ctx.closePath();ctx.fill();ctx.fillStyle='#ff2e63';ctx.beginPath();ctx.arc(-5*z,0,2.5*z*(1+Math.random()*.5),0,6.283);ctx.fill();ctx.restore()}
  for(let i=1;i<srcListCache.length;i++){const w=srcListCache[i],z=sc(w.y)*K,x=px(w.x,w.y),y=py(w.y)-10*z;ctx.fillStyle='#1478a8';ctx.beginPath();ctx.moveTo(x,y-9*z);ctx.lineTo(x+8*z,y+5*z);ctx.lineTo(x-8*z,y+5*z);ctx.closePath();ctx.fill();ctx.fillStyle='#ffd76a';ctx.beginPath();ctx.arc(x,y,2.8*z,0,6.283);ctx.fill()}
  for(const v of []){const z=sc(v.y)*K,x=px(v.x,v.y),y=py(v.y);ctx.strokeStyle='rgba(155,63,224,'+Math.min(.6,v.t*.3)+')';ctx.lineWidth=2;for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(x,y,v.r*z*(.3+.25*i),v.r*z*(.3+.25*i)*.4,S.t*3+i,0,4.5);ctx.stroke()}}
  for(const t of S.traps){const z=sc(t.y)*K;ctx.globalAlpha=Math.min(1,t.t);sawShape(px(t.x,t.y),py(t.y)-6*z,t.r*z,S.t*16,'#e2e8f0');ctx.globalAlpha=1}
  for(const m of S.mine){const z=sc(m.y)*K,x=px(m.x,m.y),y=py(m.y);ctx.fillStyle='#1d1a2b';ctx.beginPath();ctx.arc(x,y-2*z,5*z,0,6.283);ctx.fill();ctx.fillStyle=m.arm>0?'#ffcf2e':(Math.sin(S.t*12)>0?'#ff2e63':'#7a1020');ctx.beginPath();ctx.arc(x,y-3*z,2*z,0,6.283);ctx.fill()}
  for(const p of S.sawp){const z=sc(p.y)*K;sawShape(px(p.x,p.y),py(p.y)-8*z,(p.storm?9:7)*z,S.t*20,p.mult>1?'#ffd76a':'#cfd6dc')}
  for(const b of S.boomr){const z=sc(b.y)*K,x=px(b.x,b.y),y=py(b.y)-8*z;ctx.save();ctx.translate(x,y);ctx.rotate(S.t*18);ctx.strokeStyle='#ffb02e';ctx.lineWidth=4*z;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-8*z,-6*z);ctx.lineTo(0,0);ctx.lineTo(-8*z,6*z);ctx.stroke();ctx.restore()}
  if(S.st.glaive)for(const g of glaivePos()){const z=sc(g.y)*K;sawShape(px(g.x,g.y),py(g.y)-10*z,22*z,-S.t*10,'#ffd76a')}
  for(const r of S.rails){const a=r.life/.3,x1=r.x1??r.x;ctx.strokeStyle=r.big?'rgba(255,215,106,'+a+')':'rgba(143,231,255,'+a+')';ctx.lineWidth=(r.big?8:4)*a+1;ctx.beginPath();ctx.moveTo(px(r.x,r.y0),py(r.y0));ctx.lineTo(px(x1,S.fy),py(S.fy));ctx.stroke()}
  for(const p of S.pulses){const z=sc(p.y)*K,a=p.life/.3;ctx.strokeStyle='rgba(143,231,255,'+a+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(px(p.x,p.y),py(p.y),p.r*z*(1.2-a*.2),p.r*z*.45*(1.2-a*.2),0,0,6.283);ctx.stroke()}
}
let srcListCache=[];
function drawSaws(K){
  srcListCache=S.st?srcList():[];
  drawExtras(K);
  const st=S.st;if(!st.orbit)return;const rm=lim('pointblank')?1.5:1,n=st.orbit+(st.sawstorm?2:0);
  for(const c of srcListCache){const R0=38*rm*(c.main?1:.7),sz=8*rm*(c.main?1:.75);
  for(let i=0;i<n;i++){const a=S.t*3.2+i*6.283/n,ox=c.x+Math.cos(a)*R0,oy=c.y-8+Math.sin(a)*R0*.8,z=sc(oy)*K,x=px(ox,oy),y=py(oy)-6*z,r=sz*z;
    ctx.save();ctx.translate(x,y);ctx.rotate(S.t*14);ctx.fillStyle=st.sawstorm?'#ffd76a':'#cfd6dc';ctx.beginPath();
    for(let j=0;j<16;j++){const rr=j%2?r*.62:r,aa=j*Math.PI/8;ctx.lineTo(Math.cos(aa)*rr,Math.sin(aa)*rr)}ctx.closePath();ctx.fill();
    ctx.strokeStyle='#1d1a2b';ctx.lineWidth=1.2;ctx.stroke();ctx.fillStyle='#1d1a2b';ctx.beginPath();ctx.arc(0,0,r*.22,0,6.283);ctx.fill();ctx.restore()}}
}
function drawDrones(K){if(!S.st.drones&&!S.st.hivemind)return;for(const o of srcListCache)for(const d of dronePos(o)){const z=sc(d.y)*K,x=px(d.x,d.y),y=py(d.y)-10*z;ctx.fillStyle='#1d1a2b';ctx.beginPath();ctx.moveTo(x,y-6*z);ctx.lineTo(x+6*z,y);ctx.lineTo(x,y+6*z);ctx.lineTo(x-6*z,y);ctx.closePath();ctx.fill();ctx.fillStyle=S.st.hivemind?'#ffcf2e':'#2fc4e8';ctx.beginPath();ctx.arc(x,y,2.5*z,0,6.283);ctx.fill()}}
function drawOrbs(K){if(!S.st.shield)return;for(const so of srcListCache)for(const o of orbPos(so)){const z=sc(o.y)*K,x=px(o.x,o.y),y=py(o.y)-8*z;ctx.fillStyle=S.st.aegis?'rgba(255,215,106,.85)':'rgba(157,240,191,.85)';ctx.beginPath();ctx.arc(x,y,6*z,0,6.283);ctx.fill();ctx.strokeStyle='#1d1a2b';ctx.lineWidth=1.2;ctx.stroke()}}
function drawVehicle(K){
  const c=S.cannon,z=sc(c.y)*K,x=px(c.x,c.y),y=py(c.y);
  const vx=(c.x-(c.lx??c.x))/Math.max(.008,FRAME_DT);c.lx=c.x;c.tilt=(c.tilt||0)*.85+clamp(vx/900,-.35,.35)*.15;
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55+.15*Math.sin(S.t*20);ctx.drawImage(glowSprite('rgb(80,200,255)'),x-22*z,y-4*z,44*z,22*z);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  if(S.running&&Math.random()<(LQ()?.25:.7)&&S.sparks.length<250){const tc=cosSel('trail').c;S.sparks.push({x:c.x+(Math.random()-.5)*8,y:c.y+10,vx:(Math.random()-.5)*30,vy:60+Math.random()*60,life:.3,c:tc[(Math.random()*tc.length)|0]})}
  if(c.inv>0&&Math.floor(c.inv*20)%2)ctx.globalAlpha=.4;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x,y+7*z,21*z,6*z,0,0,6.283);ctx.fill();ctx.save();ctx.translate(x,y-6*z);ctx.rotate(c.tilt*.4);if(FXOK()&&S.running){const f=.75+Math.random()*.5;dspr('jetB',null,-6*z,14*z,6*z,16*z*f,Math.PI,.85,1);dspr('jetB',null,6*z,14*z,6*z,16*z*f,Math.PI,.85,1)}{if(!drawRide3D(ctx,R.veh,g3paint(),c.tilt,z)){const p=paintOf(R.veh);drawVehSpr(ctx,vehSprite(R.veh,p.c,null,0,p.o),z)}}if(FXOK()&&S.running&&!LQ()&&Math.random()<.7)dspr(Math.random()<.5?'muzzle_01':'muzzle_02','#9ff0ff',0,-40*z,12*z,18*z,0,.35+Math.random()*.4,1);ctx.restore();
  ctx.globalAlpha=1;
  // hitbox dot so you know what can be hit
  ctx.fillStyle='#fff';ctx.strokeStyle='#ff2e63';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y-4*z,Math.max(2.5,S.st.V.hit*.45*z),0,6.283);ctx.fill();ctx.stroke();
  if(SET.hitbox){ctx.strokeStyle='rgba(255,46,99,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y-4*z,S.st.V.hit*z,0,6.283);ctx.stroke()}
  const p=Math.max(0,c.hp/S.st.maxHp);ctx.strokeStyle=p>.35?'#20b46a':'#ef3b3b';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y-4*z,26*z,Math.PI*.15,Math.PI*.15+Math.PI*.7*p);ctx.stroke();
}

