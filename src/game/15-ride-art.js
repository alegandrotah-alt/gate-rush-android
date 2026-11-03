// ---------- ride personalities: signature colours, outline, eye colour ----------
const VEHPAL={
  cannon:{p:['#0e2a32','#2f6870','#8db4b6'],a:'#c0622a',o:'#04070a',iris:'#ffb43a'},
  robot:{p:['#33240a','#a8802e','#d8c08a'],a:'#9a2e1e',o:'#0e0802',iris:'#8aff5a'},
  jet:{p:['#1c2434','#7e8898','#c8ced8'],a:'#a8242c',o:'#05070c',iris:'#ff4a3a'},
  tank:{p:['#1c2210','#4a5628','#929a64'],a:'#9a763a',o:'#060804',iris:'#ffb43a'},
  saucer:{p:['#1a1228','#4e3670','#a890c8'],a:'#38c09a',o:'#05030a',iris:'#3affd0'},
  hive:{p:['#241600','#a8781a','#dcc070'],a:'#14100a',o:'#080500',iris:'#ff3a2a'},
};
function animeEye(g,x,y,rw,rh,iris,mood,side){
  rh*=.72;g.fillStyle='#e8e2d8';g.beginPath();g.ellipse(x,y,rw,rh,0,0,6.283);g.fill();
  const ir=g.createLinearGradient(0,y-rh,0,y+rh);ir.addColorStop(0,shade(iris,-.6));ir.addColorStop(.55,iris);ir.addColorStop(1,shade(iris,.55));
  g.fillStyle=ir;g.beginPath();g.ellipse(x+side*rw*.1,y+rh*.12,rw*.78,rh*.82,0,0,6.283);g.fill();
  g.fillStyle='#06070c';g.beginPath();g.ellipse(x+side*rw*.1,y+rh*.2,rw*.38,rh*.45,0,0,6.283);g.fill();
  g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.arc(x-rw*.3,y-rh*.25,rw*.16,0,6.283);g.fill();
  g.strokeStyle='#0a0a12';g.lineWidth=Math.max(1,rw*.36);g.beginPath();g.ellipse(x,y,rw,rh,0,Math.PI*1.05,Math.PI*1.95);g.stroke();
  g.fillStyle='#0a0a12';g.beginPath();g.moveTo(x-rw*1.25,y-rh*(side<0?.75:.45));g.lineTo(x+rw*1.25,y-rh*(side<0?.45:.75));g.lineTo(x+rw*1.25,y-rh*1.6);g.lineTo(x-rw*1.25,y-rh*1.6);g.closePath();g.fill();
  if(mood){g.fillStyle='#0a0a12';g.beginPath();g.moveTo(x-rw*1.3,y-rh*(side<0?1.25:.15));g.lineTo(x+rw*1.3,y-rh*(side<0?.15:1.25));g.lineTo(x+rw*1.3,y-rh*1.7);g.lineTo(x-rw*1.3,y-rh*1.7);g.closePath();g.fill()}
}
function blush(g,x,y,z){if(x<70)return;g.strokeStyle='rgba(230,220,200,.6)';g.lineWidth=.8*z;g.beginPath();g.moveTo(x-2*z,y-2.5*z);g.lineTo(x+1.5*z,y+1.5*z);g.moveTo(x-1.2*z,y-.6*z);g.lineTo(x-.2*z,y-1.6*z);g.stroke()}
let VTO=null;const VSPR={};
// mood 0: cheerful player ride, 1: angry, 2: no face (an elite drawn rotated; its eyes are added upright afterwards)
function drawVehicleShape(g,type,x,y,z,pal,glow,noShadow,mood,acc){
  const T=VTO!=null?VTO:(typeof S!=='undefined'&&S)?S.t:performance.now()/1000,VP=VEHPAL[type]||VEHPAL.cannon;
  pal=Array.isArray(pal)?pal:VP.p;acc=acc||VP.a;glow=glow||'#5fd8ff';mood=mood||0;const dark=pal[0],main=pal[1],lite=pal[2],iris=mood?glow:VP.iris,face=false;
  if(!noShadow){g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x,y+13*z,21*z,6*z,0,0,6.283);g.fill()}
  g.lineJoin='round';g.lineCap='round';
  const flame=(fx,fy,r)=>{const fl=1+Math.sin(T*40+fx)*.2;const fg=g.createRadialGradient(fx,fy,0,fx,fy+r*fl,r*1.8*fl);fg.addColorStop(0,'#ffffff');fg.addColorStop(.3,hexA(glow,.9));fg.addColorStop(1,hexA(glow,0));g.fillStyle=fg;g.beginPath();g.ellipse(fx,fy+r*.8*fl,r,r*1.9*fl,0,0,6.283);g.fill()};
  const glass=(cx,cy,rx,ry)=>{const gg=g.createLinearGradient(cx-rx,cy-ry,cx+rx,cy+ry);gg.addColorStop(0,'#f0fcff');gg.addColorStop(.4,hexA(glow,.85));gg.addColorStop(.41,hexA(shade(glow,-.3),.9));gg.addColorStop(1,'#0a1a2a');g.fillStyle=gg;g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,6.283);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(cx-rx*.35,cy-ry*.4,rx*.28,ry*.16,-.5,0,6.283);g.fill()};
  const smile=(cx,cy,w)=>{g.strokeStyle='#120808';g.lineWidth=1.4*z;g.beginPath();g.moveTo(cx-w,cy);g.lineTo(cx+w*.4,cy+.2*z);g.lineTo(cx+w,cy-.5*z);g.stroke()};
  const frown=(cx,cy,w)=>{g.strokeStyle='#1a0a10';g.lineWidth=1.4*z;g.beginPath();g.arc(cx,cy+w*.9,w,Math.PI+.5,-.5);g.stroke()};
  if(type==='cannon'){ // "Bolt": round hover-pod with a cannon top-knot
    for(const dx of [-11,0,11])flame(x+dx*z,y+12*z,2.4*z);
    g.fillStyle=shade(dark,-.3);g.beginPath();g.ellipse(x,y+9*z,18*z,6*z,0,0,6.283);g.fill();g.strokeStyle=acc;g.lineWidth=2*z;g.beginPath();g.ellipse(x,y+8.5*z,15*z,4*z,0,0,6.283);g.stroke();
    for(const s of[-1,1]){g.fillStyle=acc;g.beginPath();g.moveTo(x+s*12*z,y-6*z);g.lineTo(x+s*22*z,y+1*z);g.lineTo(x+s*13*z,y+6*z);g.closePath();g.fill();g.fillStyle=shade(acc,-.35);g.beginPath();g.moveTo(x+s*13*z,y+1*z);g.lineTo(x+s*22*z,y+1*z);g.lineTo(x+s*13*z,y+6*z);g.closePath();g.fill()}
    cylG(g,x-3.6*z,y-34*z,7.2*z,20*z,shade(main,-.15));cylG(g,x-5.2*z,y-36*z,10.4*z,4.4*z,acc);glowDot(g,x,y-36*z,1.6*z,glow);
    sph(g,x,y-3*z,15*z,main,13.5*z);
    g.fillStyle=hexA(dark,.55);g.beginPath();g.ellipse(x,y+.5*z,11*z,7.5*z,0,0,6.283);g.fill();g.fillStyle='#14181c';for(let i=-4;i<=4;i++){g.beginPath();g.arc(x+i*3.2*z,y+8*z-Math.abs(i)*.4*z,.8*z,0,6.283);g.fill()}
    g.fillStyle='#d8b23a';g.font=`900 ${4*z}px Orbitron,sans-serif`;g.textAlign='center';g.fillText('07',x-9*z,y-6*z);
    g.fillStyle=acc;g.beginPath();g.moveTo(x+9*z,y-16*z);g.lineTo(x+13*z,y-12*z);g.lineTo(x+10.5*z,y-12*z);g.lineTo(x+13.5*z,y-8*z);g.lineTo(x+8.5*z,y-12.5*z);g.lineTo(x+11*z,y-12.5*z);g.closePath();g.fill();
    if(face){animeEye(g,x-5.2*z,y-1.5*z,3.5*z,4.5*z,iris,mood,-1);animeEye(g,x+5.2*z,y-1.5*z,3.5*z,4.5*z,iris,mood,1);if(mood)frown(x,y+5.5*z,2.6*z);else{smile(x,y+5*z,2.4*z);blush(g,x-8.5*z,y+3.5*z,z);blush(g,x+8.5*z,y+3.5*z,z)}}
  }else if(type==='robot'){ // "Rivet": hazard-striped mech with a CRT face
    for(const s of[-1,1]){cylG(g,x+s*8*z-3.5*z,y+2*z,7*z,10*z,dark);g.fillStyle=acc;g.beginPath();g.roundRect(x+s*8*z-5.5*z,y+11*z,11*z,4.5*z,2*z);g.fill()}
    g.fillStyle=vgrad(g,y-13*z,y+6*z,lite,main);g.beginPath();g.roundRect(x-14*z,y-13*z,28*z,19*z,5*z);g.fill();
    g.save();g.beginPath();g.rect(x-14*z,y+.5*z,28*z,5.5*z);g.clip();g.fillStyle='#1a1408';g.fillRect(x-14*z,y+.5*z,28*z,5.5*z);g.fillStyle=main;for(let i=-4;i<5;i++){g.beginPath();g.moveTo(x+i*6*z,y+6*z);g.lineTo(x+i*6*z+3*z,y+6*z);g.lineTo(x+i*6*z+8.5*z,y+.5*z);g.lineTo(x+i*6*z+5.5*z,y+.5*z);g.fill()}g.restore();
    glowDot(g,x,y-6*z,2.4*z,acc);
    for(const s of[-1,1]){cylG(g,x+s*19*z-3*z,y-24*z,6*z,15*z,dark);sph(g,x+s*16.5*z,y-10*z,6.2*z,acc,5.5*z);
      g.save();g.translate(x+s*19*z,y-26*z);g.rotate(T*8*s);g.fillStyle='#d8dee6';g.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8,r=i%2?3.2*z:5*z;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.fillStyle='#22262e';g.beginPath();g.arc(0,0,1.4*z,0,6.283);g.fill();g.restore()}
    g.fillStyle=vgrad(g,y-32*z,y-16*z,'#8a847a','#4a463e');g.beginPath();g.roundRect(x-10*z,y-31*z,20*z,15*z,4*z);g.fill();
    g.fillStyle='#071a12';g.beginPath();g.roundRect(x-7.5*z,y-28.5*z,15*z,10*z,2.5*z);g.fill();
    if(face){g.fillStyle=mood?glow:iris;if(mood){for(const s of[-1,1]){g.save();g.translate(x+s*3.6*z,y-24*z);g.rotate(s*.45);g.fillRect(-2.6*z,-.9*z,5.2*z,1.8*z);g.restore()}g.fillRect(x-2.5*z,y-21*z,5*z,1.2*z)}
      else{for(const s of[-1,1]){g.save();g.translate(x+s*3.6*z,y-24*z);g.rotate(-s*.18);g.fillRect(-2.6*z,-.8*z,5.2*z,1.6*z);g.restore()}g.fillRect(x-3*z,y-21*z,6*z,.9*z)}}
    g.fillStyle='rgba(120,255,170,.12)';for(let i=0;i<4;i++)g.fillRect(x-7.5*z,y-28*z+i*2.6*z,15*z,.8*z);
    g.strokeStyle='#5a544a';g.lineWidth=1.4*z;g.beginPath();g.moveTo(x+6*z,y-31*z);g.lineTo(x+9*z,y-37*z);g.stroke();sph(g,x+9*z,y-37.5*z,2.2*z,acc);
  }else if(type==='jet'){ // "Zephyr": racing-livery fighter with a shark grin
    for(const s of[-1,1])flame(x+s*4*z,y+13*z,2.8*z);
    g.fillStyle=vgrad(g,y-10*z,y+8*z,main,shade(main,-.35));g.beginPath();g.moveTo(x,y-14*z);g.lineTo(x+24*z,y+4*z);g.lineTo(x+22*z,y+7*z);g.lineTo(x+6*z,y+4*z);g.lineTo(x-6*z,y+4*z);g.lineTo(x-22*z,y+7*z);g.lineTo(x-24*z,y+4*z);g.closePath();g.fill();
    g.strokeStyle=acc;g.lineWidth=2.2*z;g.beginPath();g.moveTo(x-7*z,y-7*z);g.lineTo(x-21*z,y+3.5*z);g.moveTo(x+7*z,y-7*z);g.lineTo(x+21*z,y+3.5*z);g.stroke();
    g.strokeStyle=dark;g.lineWidth=1.4*z;g.beginPath();g.moveTo(x-10*z,y-2*z);g.lineTo(x-18*z,y+4*z);g.moveTo(x+10*z,y-2*z);g.lineTo(x+18*z,y+4*z);g.stroke();
    for(const s of[-1,1])glowDot(g,x+s*23*z,y+5*z,1.4*z,s<0?'#ff4050':'#40ff80');
    for(const s of[-1,1]){g.fillStyle=dark;g.beginPath();g.moveTo(x+s*5*z,y+3*z);g.lineTo(x+s*11*z,y+12*z);g.lineTo(x+s*5*z,y+11*z);g.closePath();g.fill()}
    const fg=g.createLinearGradient(x-6*z,0,x+6*z,0);fg.addColorStop(0,shade(main,-.45));fg.addColorStop(.25,shade(main,-.45));fg.addColorStop(.26,lite);fg.addColorStop(.45,lite);fg.addColorStop(.46,main);fg.addColorStop(.75,main);fg.addColorStop(.76,shade(main,-.3));fg.addColorStop(1,shade(main,-.3));
    g.fillStyle=fg;g.beginPath();g.moveTo(x,y-34*z);g.quadraticCurveTo(x+7*z,y-24*z,x+6.5*z,y-8*z);g.lineTo(x+7*z,y+10*z);g.lineTo(x-7*z,y+10*z);g.lineTo(x-6.5*z,y-8*z);g.quadraticCurveTo(x-7*z,y-24*z,x,y-34*z);g.fill();
    g.fillStyle=dark;g.fillRect(x-1.6*z,y-6*z,3.2*z,16*z);g.fillStyle=acc;g.beginPath();g.moveTo(x,y-34*z);g.quadraticCurveTo(x+3.4*z,y-30*z,x+4.2*z,y-27*z);g.lineTo(x-4.2*z,y-27*z);g.quadraticCurveTo(x-3.4*z,y-30*z,x,y-34*z);g.fill();
    glass(x,y-6*z,3.4*z,6.5*z);
    if(face){g.fillStyle=mood?'#3a0010':'#c41e2a';g.beginPath();g.moveTo(x-5.6*z,y-17.5*z);g.quadraticCurveTo(x,y-13*z,x+5.6*z,y-17.5*z);g.quadraticCurveTo(x,y-15.5*z,x-5.6*z,y-17.5*z);g.fill();
      g.fillStyle='#fff';for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(x+i*2*z-.9*z,y-16.6*z+Math.abs(i)*.2*z);g.lineTo(x+i*2*z,y-14.6*z+Math.abs(i)*.1*z);g.lineTo(x+i*2*z+.9*z,y-16.6*z+Math.abs(i)*.2*z);g.fill()}
      animeEye(g,x-3*z,y-22.5*z,2.2*z,2.8*z,iris,mood,-1);animeEye(g,x+3*z,y-22.5*z,2.2*z,2.8*z,iris,mood,1)}
  }else if(type==='tank'){ // "Bulwark": grumpy camo tank with a moustache vent
    const off=(T*30)%4;
    for(const s of[-1,1]){g.fillStyle='#16180e';g.beginPath();g.roundRect(x+s*16.5*z-5*z,y-14*z,10*z,29*z,3.5*z);g.fill();g.fillStyle='rgba(255,255,255,.16)';for(let i=0;i<7;i++){const ty=y-13*z+((i*4+off)%28)*z;g.fillRect(x+s*16.5*z-4.4*z,ty,8.8*z,1.3*z)}
      for(let i=0;i<3;i++){g.fillStyle=acc;g.beginPath();g.arc(x+s*16.5*z,y-7*z+i*9*z,1.6*z,0,6.283);g.fill()}}
    g.fillStyle=vgrad(g,y-13*z,y+14*z,main,dark);g.beginPath();g.roundRect(x-12.5*z,y-13*z,25*z,27*z,4*z);g.fill();
    g.save();g.beginPath();g.roundRect(x-12.5*z,y-13*z,25*z,27*z,4*z);g.clip();g.fillStyle=hexA(lite,.4);[[-7,-7,5,3],[6,2,6,3.5],[-5,8,4,2.5],[7,-9,3,2]].forEach(([a,b,c,d])=>{g.beginPath();g.ellipse(x+a*z,y+b*z,c*z,d*z,.4,0,6.283);g.fill()});g.fillStyle=hexA(dark,.5);[[3,-4,4,2.4],[-8,3,3.5,2]].forEach(([a,b,c,d])=>{g.beginPath();g.ellipse(x+a*z,y+b*z,c*z,d*z,-.3,0,6.283);g.fill()});g.restore();
    cylG(g,x-3*z,y-38*z,6*z,27*z,shade(main,-.15));cylG(g,x-4.8*z,y-40*z,9.6*z,4.6*z,dark);cylG(g,x-3.6*z,y-26*z,7.2*z,2.4*z,acc);
    sph(g,x,y-1*z,11*z,main,10*z);
    if(face){for(const s of[-1,1]){animeEye(g,x+s*4.4*z,y-2*z,3*z,3.4*z,iris,mood,s);if(!mood){g.fillStyle=shade(main,-.25);g.beginPath();g.ellipse(x+s*4.4*z,y-4.4*z,3.8*z,2.2*z,0,Math.PI,0);g.fill();g.fillRect(x+s*4.4*z-3.8*z,y-4.6*z,7.6*z,1.6*z)}
        g.strokeStyle='#14100a';g.lineWidth=1.8*z;g.beginPath();g.moveTo(x+s*1.5*z,y-6.2*z+(mood?1:0)*z);g.lineTo(x+s*8*z,y-7.4*z);g.stroke()}
      g.fillStyle='#2a2216';for(const s of[-1,1]){g.beginPath();g.moveTo(x,y+3.2*z);g.quadraticCurveTo(x+s*4*z,y+2*z,x+s*6.5*z,y+4.6*z);g.quadraticCurveTo(x+s*4*z,y+4*z,x,y+4.8*z);g.fill()}}
  }else if(type==='saucer'){ // "Nova": pastel saucer with a big-eyed alien pilot
    const ug=g.createRadialGradient(x,y,0,x,y,22*z);ug.addColorStop(0,hexA(acc,.55));ug.addColorStop(1,hexA(acc,0));g.fillStyle=ug;g.beginPath();g.ellipse(x,y+3*z,22*z,8*z,0,0,6.283);g.fill();
    const dg=g.createRadialGradient(x-7*z,y-9*z,0,x-2*z,y-5*z,24*z);dg.addColorStop(0,lite);dg.addColorStop(.3,lite);dg.addColorStop(.31,main);dg.addColorStop(.7,main);dg.addColorStop(.71,shade(main,-.25));dg.addColorStop(1,dark);g.fillStyle=dg;g.beginPath();g.ellipse(x,y-4*z,21*z,8.5*z,0,0,6.283);g.fill();
    g.strokeStyle=acc;g.lineWidth=2.2*z;g.beginPath();g.ellipse(x,y-3*z,17*z,5.6*z,0,0,Math.PI);g.stroke();
    for(let i=0;i<8;i++){const a=T*2+i*.785,cx2=x+Math.cos(a)*18*z,cy2=y-3*z+Math.sin(a)*6*z;if(Math.sin(a)<-.2)continue;glowDot(g,cx2,cy2,1.4*z,i%2?acc:'#ffe86a')}
    g.fillStyle=hexA('#cfefff',.35);g.beginPath();g.ellipse(x,y-11*z,9.5*z,9*z,0,Math.PI,0);g.fill();
    if(face){const bob=Math.sin(T*3)*.6*z;g.strokeStyle='#4ac07a';g.lineWidth=1.2*z;for(const s of[-1,1]){g.beginPath();g.moveTo(x+s*2.5*z,y-16*z+bob);g.quadraticCurveTo(x+s*5*z,y-21*z,x+s*4*z,y-23*z+bob);g.stroke();g.fillStyle=acc;g.beginPath();g.arc(x+s*4*z,y-23*z+bob,1.5*z,0,6.283);g.fill()}
      sph(g,x,y-11*z+bob,6*z,'#5a8a6a',6.4*z);
      for(const s of[-1,1]){g.fillStyle='#0a0612';g.beginPath();g.ellipse(x+s*2.6*z,y-11*z+bob,2.4*z,1.5*z,s*-.45,0,6.283);g.fill();g.fillStyle=mood?'#ff3a5a':'#ffffff';g.beginPath();g.arc(x+s*2.5*z-.7*z,y-12*z+bob,.8*z,0,6.283);g.fill();g.beginPath();g.arc(x+s*2.5*z+.6*z,y-10*z+bob,.4*z,0,6.283);g.fill()}
      if(mood){g.fillStyle='#0a0612';for(const s of[-1,1]){g.beginPath();g.moveTo(x+s*.6*z,y-14*z+bob);g.lineTo(x+s*5*z,y-15.6*z+bob);g.lineTo(x+s*5*z,y-14.4*z+bob);g.closePath();g.fill()}}}
    g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(x-4*z,y-16*z,3*z,1.4*z,-.5,0,6.283);g.fill();
    g.strokeStyle=hexA('#ffffff',.7);g.lineWidth=1*z;g.beginPath();g.ellipse(x,y-11*z,9.5*z,9*z,0,Math.PI,0);g.stroke();
  }else{ // "Buzz": bumblebee truck with windshield eyes and flapping wings
    for(const dx of [-13,13])for(const dy of [-4,11]){sph(g,x+dx*z,y+dy*z,4.4*z,'#22262e',4.4*z);g.fillStyle=lite;g.beginPath();g.arc(x+dx*z,y+dy*z,1.5*z,0,6.283);g.fill()}
    const fl=Math.sin(T*34)*.5;g.fillStyle='rgba(230,250,255,.7)';g.strokeStyle='rgba(60,80,100,.8)';g.lineWidth=1*z;
    for(const s of[-1,1]){g.save();g.translate(x+s*9*z,y-2*z);g.rotate(s*(.9+fl));g.beginPath();g.ellipse(0,-7*z,4.5*z,9*z,0,0,6.283);g.fill();g.stroke();g.restore()}
    g.fillStyle=main;g.beginPath();g.roundRect(x-12*z,y-9*z,24*z,25*z,7*z);g.fill();
    g.save();g.beginPath();g.roundRect(x-12*z,y-9*z,24*z,25*z,7*z);g.clip();g.fillStyle=acc;for(const by of [-3,4,11])g.fillRect(x-12*z,y+by*z,24*z,3.6*z);g.fillStyle=hexA(lite,.6);g.fillRect(x-12*z,y-9*z,6*z,25*z);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x+7*z,y-9*z,5*z,25*z);g.restore();
    g.fillStyle=acc;g.beginPath();g.moveTo(x-3*z,y+15*z);g.lineTo(x,y+21*z);g.lineTo(x+3*z,y+15*z);g.fill();
    g.fillStyle=vgrad(g,y-25*z,y-9*z,lite,main);g.beginPath();g.roundRect(x-10.5*z,y-25*z,21*z,16*z,6*z);g.fill();
    g.strokeStyle=acc;g.lineWidth=1.3*z;for(const s of[-1,1]){g.beginPath();g.moveTo(x+s*3*z,y-25*z);g.quadraticCurveTo(x+s*5*z,y-32*z,x+s*8.5*z,y-32*z);g.stroke();g.fillStyle=acc;g.beginPath();g.arc(x+s*8.5*z,y-32*z,1.6*z,0,6.283);g.fill()}
    if(face){animeEye(g,x-4.6*z,y-18.5*z,3.6*z,4.4*z,iris,mood,-1);animeEye(g,x+4.6*z,y-18.5*z,3.6*z,4.4*z,iris,mood,1);if(mood)frown(x,y-11.5*z,2*z);else{smile(x,y-12*z,2*z);blush(g,x-8*z,y-13.5*z,z*.8);blush(g,x+8*z,y-13.5*z,z*.8)}}
  }
}
function vehSprite(type,pal,glow,mood,outl){const fr=((performance.now()/90)|0)%8,key=type+String(pal)+(glow||'')+(mood||0)+(outl||'')+fr;if(VSPR[key])return VSPR[key];
  const c0=mk(140,150),g=c0.getContext('2d');if(!g||!g.createRadialGradient){VSPR[key]=c0;return c0}
  VTO=fr*Math.PI/8;drawVehicleShape(g,type,70,98,2.4,pal,glow,1,mood);VTO=null;grime(g,140,150,type.length*977+type.charCodeAt(0)*31+(mood||0)*7);
  const o=outlineSprite(c0,140,150,3.4,outl||'rgba(4,6,12,.95)');VSPR[key]=o;return o}
function drawVehSpr(g,sp,z){const q=z/2.4;g.drawImage(sp,-70*q,-98*q,140*q,150*q)}
function paintOf(type){const p=cosSel('paint');return{c:p.c,o:p.o||(VEHPAL[type]||VEHPAL.cannon).o}}
function drawVehIcon(g,type,x,y,z,item){if(drawRideIcon(g,type,item&&item.id?item.id:g3paint(),x,y,z,item?null:cosSel('finish').id))return;const p=item?{c:item.c,o:item.o||VEHPAL[type].o}:paintOf(type);g.save();g.translate(x,y);drawVehSpr(g,vehSprite(type,p.c,null,0,p.o),z);g.restore()}
function grime(g,w,h,seed,light){let s=seed;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
  g.save();g.globalCompositeOperation='source-atop';
  const sg=g.createLinearGradient(0,h*.25,0,h);sg.addColorStop(0,'rgba(18,12,8,0)');sg.addColorStop(1,`rgba(18,12,8,${light?.3:.5})`);g.fillStyle=sg;g.fillRect(0,0,w,h);
  g.fillStyle=`rgba(46,44,42,${light?.12:.2})`;g.fillRect(0,0,w,h);
  for(let i=0;i<(light?20:80);i++){g.fillStyle=r()<.62?`rgba(10,8,6,${.25+r()*.4})`:`rgba(255,240,220,${.1+r()*.2})`;const q=.6+r()*2.2;g.fillRect(r()*w,r()*h,q,q)}
  g.lineWidth=1;for(let i=0;i<(light?3:16);i++){const x=r()*w,y=r()*h,l=4+r()*12,a=r()*3.14;g.strokeStyle=r()<.5?'rgba(255,245,230,.35)':'rgba(0,0,0,.45)';g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
  for(let i=0;i<(light?0:6);i++){g.fillStyle=`rgba(${r()<.5?'100,52,20':'20,16,12'},.35)`;g.beginPath();g.ellipse(r()*w,r()*h,3+r()*6,2+r()*3,r()*3,0,6.283);g.fill()}
  g.restore()}
