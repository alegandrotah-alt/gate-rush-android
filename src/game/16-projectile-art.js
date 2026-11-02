// ---------- projectiles: each ride fires its own kind of shot ----------
const PSPR={};
function projSprite(veh,col){const spin=veh==='robot'||veh==='saucer',fr=spin?((performance.now()/55)|0)%4:0,key=veh+col+fr;if(PSPR[key])return PSPR[key];
  const c2=mk(64,72),g=c2.getContext('2d');PSPR[key]=c2;if(!g||!g.createRadialGradient)return c2;
  const C=col,cx=32,cy=40,ink='rgba(6,8,16,.95)';g.lineJoin='round';
  if(veh==='cannon'){const tg=g.createLinearGradient(0,cy,0,cy+30);tg.addColorStop(0,hexA(C,.85));tg.addColorStop(1,hexA(C,0));g.fillStyle=tg;g.beginPath();g.moveTo(cx-13,cy);g.quadraticCurveTo(cx,cy+42,cx+13,cy);g.fill();
    sph(g,cx,cy-4,15,C);g.strokeStyle=ink;g.lineWidth=3;g.beginPath();g.arc(cx,cy-4,15,0,6.283);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(cx-5,cy-10,4,0,6.283);g.fill()}
  else if(veh==='robot'){g.save();g.translate(cx,cy-2);g.rotate(fr*Math.PI/16);g.fillStyle=shade(C,-.1);g.beginPath();for(let i=0;i<32;i++){const a=i/32*6.283,r=(Math.floor(i/2)%2)?14:20;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.strokeStyle=ink;g.lineWidth=2.6;g.stroke();
    sph(g,0,0,11,C);g.fillStyle='#0a0c12';g.beginPath();g.arc(0,0,4.5,0,6.283);g.fill();g.restore()}
  else if(veh==='jet'){const fg=g.createRadialGradient(cx,cy+18,0,cx,cy+18,12);fg.addColorStop(0,'#fff');fg.addColorStop(.4,hexA(C,.8));fg.addColorStop(1,hexA(C,0));g.fillStyle=fg;g.beginPath();g.ellipse(cx,cy+20,7,12,0,0,6.283);g.fill();
    g.fillStyle=C;for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*5,cy+2);g.lineTo(cx+s*14,cy+16);g.lineTo(cx+s*5,cy+13);g.closePath();g.fill()}
    const bg=g.createLinearGradient(cx-6,0,cx+6,0);bg.addColorStop(0,'#9aa4b8');bg.addColorStop(.3,'#ffffff');bg.addColorStop(.6,'#e8ecf4');bg.addColorStop(.61,'#b8c0d0');bg.addColorStop(1,'#8a94a8');g.fillStyle=bg;g.beginPath();g.moveTo(cx,cy-26);g.quadraticCurveTo(cx+6,cy-14,cx+6,cy-4);g.lineTo(cx+6,cy+14);g.lineTo(cx-6,cy+14);g.lineTo(cx-6,cy-4);g.quadraticCurveTo(cx-6,cy-14,cx,cy-26);g.fill();
    g.fillStyle=C;g.beginPath();g.moveTo(cx,cy-26);g.quadraticCurveTo(cx+4.6,cy-17,cx+5.2,cy-12);g.lineTo(cx-5.2,cy-12);g.quadraticCurveTo(cx-4.6,cy-17,cx,cy-26);g.fill();
    g.strokeStyle=ink;g.lineWidth=2.4;g.beginPath();g.moveTo(cx,cy-26);g.quadraticCurveTo(cx+6,cy-14,cx+6,cy-4);g.lineTo(cx+6,cy+14);g.lineTo(cx-6,cy+14);g.lineTo(cx-6,cy-4);g.quadraticCurveTo(cx-6,cy-14,cx,cy-26);g.stroke()}
  else if(veh==='tank'){const cg=g.createLinearGradient(cx-10,0,cx+10,0);cg.addColorStop(0,'#7a5a1a');cg.addColorStop(.25,'#ffe8a0');cg.addColorStop(.4,'#e0b450');cg.addColorStop(.75,'#c8962e');cg.addColorStop(.76,'#8a6418');cg.addColorStop(1,'#6a4a10');
    g.fillStyle=cg;g.fillRect(cx-10,cy-2,20,22);g.fillStyle='#8a6418';g.fillRect(cx-11,cy+18,22,4);
    const tg2=g.createLinearGradient(cx-10,0,cx+10,0);tg2.addColorStop(0,shade(C,-.5));tg2.addColorStop(.25,shade(C,.5));tg2.addColorStop(.4,C);tg2.addColorStop(.75,C);tg2.addColorStop(.76,shade(C,-.35));tg2.addColorStop(1,shade(C,-.5));
    g.fillStyle=tg2;g.beginPath();g.moveTo(cx-10,cy-2);g.quadraticCurveTo(cx-10,cy-22,cx,cy-28);g.quadraticCurveTo(cx+10,cy-22,cx+10,cy-2);g.closePath();g.fill();g.fillStyle='#3a2a0a';g.fillRect(cx-10,cy-3,20,3);
    g.strokeStyle=ink;g.lineWidth=2.6;g.beginPath();g.moveTo(cx-10,cy+22);g.lineTo(cx-10,cy-2);g.quadraticCurveTo(cx-10,cy-22,cx,cy-28);g.quadraticCurveTo(cx+10,cy-22,cx+10,cy-2);g.lineTo(cx+10,cy+22);g.closePath();g.stroke()}
  else if(veh==='saucer'){const gg=g.createRadialGradient(cx,cy-2,4,cx,cy-2,28);gg.addColorStop(0,hexA(C,.7));gg.addColorStop(1,hexA(C,0));g.fillStyle=gg;g.beginPath();g.arc(cx,cy-2,28,0,6.283);g.fill();
    g.save();g.translate(cx,cy-2);g.rotate(fr*Math.PI/8);g.lineWidth=9;g.strokeStyle=C;g.beginPath();g.ellipse(0,0,15,13,0,0,6.283);g.stroke();g.lineWidth=3;g.strokeStyle='#ffffff';g.beginPath();g.ellipse(0,0,15,13,0,0,6.283);g.stroke();
    g.fillStyle='#ffffff';for(let i=0;i<3;i++){const a=i*2.094;g.beginPath();g.arc(Math.cos(a)*15,Math.sin(a)*13,2.4,0,6.283);g.fill()}g.restore()}
  else{g.fillStyle='rgba(235,250,255,.8)';g.strokeStyle='rgba(40,60,80,.8)';g.lineWidth=1.5;for(const s of[-1,1]){g.beginPath();g.ellipse(cx+s*10,cy-8,6,10,s*.6,0,6.283);g.fill();g.stroke()}
    g.fillStyle=C;g.beginPath();g.ellipse(cx,cy+4,12,15,0,0,6.283);g.fill();
    g.save();g.beginPath();g.ellipse(cx,cy+4,12,15,0,0,6.283);g.clip();g.fillStyle='#1a1408';g.fillRect(cx-12,cy+1,24,4.5);g.fillRect(cx-12,cy+10,24,4.5);g.fillStyle='rgba(255,255,255,.35)';g.fillRect(cx-12,cy-11,5,30);g.restore();
    g.fillStyle='#1a1408';g.beginPath();g.moveTo(cx-3,cy+18);g.lineTo(cx,cy+25);g.lineTo(cx+3,cy+18);g.fill();
    g.strokeStyle=ink;g.lineWidth=2.4;g.beginPath();g.ellipse(cx,cy+4,12,15,0,0,6.283);g.stroke();
    sph(g,cx,cy-14,8.5,'#1a140c');for(const s of[-1,1]){g.fillStyle='#ff3a2a';g.beginPath();g.ellipse(cx+s*3.8,cy-14.5,2.6,1.7,s*-.5,0,6.283);g.fill()}g.fillStyle='#d8c8a0';for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*1.5,cy-8);g.lineTo(cx+s*3,cy-4);g.lineTo(cx+s*.4,cy-6.5);g.fill()}
    g.strokeStyle='#2a2216';g.lineWidth=1.6;for(const s of[-1,1]){g.beginPath();g.moveTo(cx+s*3,cy-21);g.quadraticCurveTo(cx+s*6,cy-28,cx+s*9,cy-27);g.stroke()}}
  grime(g,64,72,veh.length*131+C.length,1);return c2}
