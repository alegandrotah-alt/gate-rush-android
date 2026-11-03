// ---------- illustrated sci-fi icons, drawn once and cached as images ----------
const ICON={};
function iconBadge(g,col,frame){
  const s=96,cx=48,cy=48;g.clearRect(0,0,s,s);
  const hex=(r)=>{g.beginPath();for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;g.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}g.closePath()};
  hex(46);const rim=g.createLinearGradient(0,0,0,s);rim.addColorStop(0,frame||'#9aa6b8');rim.addColorStop(.5,shade(frame||'#9aa6b8',-.45));rim.addColorStop(1,shade(frame||'#9aa6b8',-.7));g.fillStyle=rim;g.fill();
  hex(40);const bg=g.createRadialGradient(cx,cy-8,4,cx,cy,46);bg.addColorStop(0,shade(col,-.35));bg.addColorStop(.55,'#121821');bg.addColorStop(1,'#06090e');g.fillStyle=bg;g.fill();
  g.save();hex(40);g.clip();g.strokeStyle=hexA(col,.16);g.lineWidth=1;for(let y=6;y<s;y+=6){g.beginPath();g.moveTo(0,y);g.lineTo(s,y);g.stroke()}
  const gl=g.createRadialGradient(cx,cy,0,cx,cy,34);gl.addColorStop(0,hexA(col,.45));gl.addColorStop(1,hexA(col,0));g.fillStyle=gl;g.fillRect(0,0,s,s);g.restore();
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1.5;g.beginPath();for(let i=3;i<6;i++){const a=Math.PI/6+i*Math.PI/3;g.lineTo(cx+Math.cos(a)*44,cy+Math.sin(a)*44)}g.stroke();
}
const PICTO={
  orbit(g,c){g.save();g.translate(48,48);g.fillStyle='#c8d0da';g.beginPath();for(let i=0;i<32;i++){const a=i/32*6.283,r=i%2?14:21;g.lineTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.strokeStyle='#1a1e26';g.lineWidth=2;g.stroke();sph(g,0,0,9,'#7a8494');g.fillStyle='#0a0c10';g.beginPath();g.arc(0,0,3,0,6.283);g.fill();g.restore()},
  zap(g,c){cylG(g,44,30,8,40,'#7a8494');sph(g,48,28,7,'#5fe1ff');g.strokeStyle='#fff6a0';g.lineWidth=3;g.beginPath();g.moveTo(56,24);g.lineTo(66,34);g.lineTo(60,38);g.lineTo(72,52);g.stroke();g.beginPath();g.moveTo(40,24);g.lineTo(30,36);g.lineTo(36,40);g.lineTo(24,54);g.stroke()},
  bomb(g,c){sph(g,48,52,17,'#3a3e48');g.fillStyle='#ffb43a';g.fillRect(31,48,34,4);cylG(g,44,28,8,10,'#5a606c');g.strokeStyle='#e8c070';g.lineWidth=2;g.beginPath();g.moveTo(48,28);g.quadraticCurveTo(54,18,62,20);g.stroke();glowDot(g,62,20,3,'#ffcf2e')},
  missile(g,c){g.save();g.translate(48,48);g.rotate(-.75);const fg=g.createRadialGradient(0,26,0,0,26,12);fg.addColorStop(0,'#fff');fg.addColorStop(.4,'#ffb43a');fg.addColorStop(1,'rgba(255,90,20,0)');g.fillStyle=fg;g.beginPath();g.ellipse(0,28,7,13,0,0,6.283);g.fill();cylG(g,-6,-14,12,32,'#d8dee8');g.fillStyle='#ff4a3a';g.beginPath();g.moveTo(-6,-14);g.quadraticCurveTo(0,-30,6,-14);g.fill();g.fillStyle='#8a94a6';for(const s of[-1,1]){g.beginPath();g.moveTo(s*6,8);g.lineTo(s*14,20);g.lineTo(s*6,18);g.fill()}g.restore()},
  laser(g,c){const bg=g.createLinearGradient(40,0,56,0);bg.addColorStop(0,'rgba(95,225,255,0)');bg.addColorStop(.5,'#e8fcff');bg.addColorStop(1,'rgba(95,225,255,0)');g.fillStyle=bg;g.fillRect(38,8,20,42);g.fillStyle='#5fe1ff';g.fillRect(46,8,4,42);cylG(g,34,50,28,22,'#5a6878');sph(g,48,52,6,'#5fe1ff')},
  flame(g,c){for(let i=0;i<3;i++){const fg=g.createRadialGradient(48,40-i*4,0,48,34,26-i*6);fg.addColorStop(0,'#fff8c0');fg.addColorStop(.4,i?'#ffb43a':'#ff6a1a');fg.addColorStop(1,'rgba(255,60,20,0)');g.fillStyle=fg;g.beginPath();g.moveTo(48,10+i*6);g.quadraticCurveTo(70-i*4,36,48,56);g.quadraticCurveTo(26+i*4,36,48,10+i*6);g.fill()}cylG(g,40,56,16,18,'#5a606c');cylG(g,36,54,24,5,'#8a94a6')},
  shield(g,c){g.strokeStyle='#9df0bf';g.lineWidth=3;g.beginPath();g.ellipse(48,48,28,11,-.4,0,6.283);g.stroke();sph(g,48,48,13,'#3fcf8e');sph(g,72,40,5,'#9df0bf');sph(g,25,57,5,'#9df0bf')},
  drones(g,c){g.strokeStyle='#3a404a';g.lineWidth=4;g.beginPath();g.moveTo(30,30);g.lineTo(66,66);g.moveTo(66,30);g.lineTo(30,66);g.stroke();for(const [x,y] of [[28,28],[68,28],[28,68],[68,68]]){g.fillStyle='rgba(200,230,255,.35)';g.beginPath();g.ellipse(x,y,11,4,0,0,6.283);g.fill();sph(g,x,y,3,'#8a94a6')}sph(g,48,48,10,'#7a8494');glowDot(g,48,48,3,'#5fe1ff')},
  boomer(g,c){g.save();g.translate(48,50);g.rotate(-.3);g.fillStyle='#ffb43a';g.beginPath();g.moveTo(-24,-14);g.quadraticCurveTo(-4,-4,0,14);g.quadraticCurveTo(4,-4,24,-14);g.lineTo(18,-20);g.quadraticCurveTo(0,-8,-18,-20);g.closePath();g.fill();g.strokeStyle='#5a3a10';g.lineWidth=2;g.stroke();g.restore()},
  mines(g,c){g.strokeStyle='#22262e';g.lineWidth=4;g.beginPath();for(let i=0;i<8;i++){const a=i*.785;g.moveTo(48+Math.cos(a)*12,50+Math.sin(a)*12);g.lineTo(48+Math.cos(a)*24,50+Math.sin(a)*24)}g.stroke();sph(g,48,50,15,'#4a4e58');glowDot(g,48,46,4,'#ff3030')},
  rail(g,c){g.save();g.translate(48,48);g.rotate(-.75);cylG(g,-5,-30,10,52,'#6a7484');cylG(g,-9,8,18,16,'#3a404a');g.fillStyle='#5fe1ff';for(let i=0;i<5;i++)g.fillRect(-6,-24+i*7,12,2);glowDot(g,0,-32,5,'#5fe1ff');g.restore()},
  tesla(g,c){cylG(g,42,40,12,30,'#5a606c');for(let i=0;i<4;i++){g.fillStyle=i%2?'#c87a3a':'#e8a050';g.beginPath();g.ellipse(48,62-i*7,14-i*1.5,4,0,0,6.283);g.fill()}sph(g,48,26,10,'#8ad8ff');g.strokeStyle='#e8fcff';g.lineWidth=2;for(const s of[-1,1]){g.beginPath();g.moveTo(48+s*8,24);g.lineTo(48+s*18,18);g.lineTo(48+s*14,28);g.lineTo(48+s*26,26);g.stroke()}},
  sentry(g,c){g.strokeStyle='#2a3a32';g.lineWidth=4;g.beginPath();g.moveTo(48,52);g.lineTo(30,74);g.moveTo(48,52);g.lineTo(66,74);g.moveTo(48,52);g.lineTo(48,76);g.stroke();cylG(g,36,40,24,14,'#3a5a48');sph(g,48,40,12,'#7dffb0',10);cylG(g,45,14,6,24,'#2a3a32');glowDot(g,48,40,3,'#eafff0')},
  blade(g,c){g.save();g.translate(48,52);g.lineCap='round';g.strokeStyle='rgba(127,232,255,.45)';g.lineWidth=12;g.beginPath();g.arc(0,0,26,-Math.PI+.35,-.35);g.stroke();g.strokeStyle='#e8fcff';g.lineWidth=4;g.beginPath();g.arc(0,0,26,-Math.PI+.35,-.35);g.stroke();g.rotate(-.7);cylG(g,-3,-6,6,20,'#5a6474');g.fillStyle='#cfe9ff';g.beginPath();g.moveTo(-3,-6);g.lineTo(0,-30);g.lineTo(3,-6);g.closePath();g.fill();g.restore()},
  vortex(g,c){g.save();g.translate(48,48);for(let i=0;i<3;i++){g.strokeStyle=i%2?'rgba(120,210,255,.8)':'rgba(200,140,255,.85)';g.lineWidth=3-i*.6;g.beginPath();g.ellipse(0,0,24+i*5,8+i*2,-.35,0,6.283);g.stroke()}const gr=g.createRadialGradient(0,0,2,0,0,16);gr.addColorStop(0,'#000');gr.addColorStop(.7,'#08020f');gr.addColorStop(1,'rgba(150,90,255,.6)');g.fillStyle=gr;g.beginPath();g.arc(0,0,15,0,6.283);g.fill();g.restore()},
  prism(g,c){g.fillStyle='rgba(255,255,255,.95)';g.fillRect(8,45,26,3);g.save();g.translate(48,48);g.fillStyle='rgba(200,240,255,.35)';g.strokeStyle='#e8fcff';g.lineWidth=2;g.beginPath();g.moveTo(0,-20);g.lineTo(18,14);g.lineTo(-18,14);g.closePath();g.fill();g.stroke();g.restore();
    ['#ff3b5c','#ffcf2e','#4aff9a','#4ab8ff','#b06aff'].forEach((col,i)=>{g.strokeStyle=col;g.lineWidth=3;g.beginPath();g.moveTo(58,48);g.lineTo(90,30+i*9);g.stroke()})},
  venom(g,c){for(const [x,y,r,a] of [[48,30,16,.55],[36,22,10,.4],[60,20,11,.45],[50,12,8,.35]]){const gl=g.createRadialGradient(x,y,0,x,y,r);gl.addColorStop(0,`rgba(200,255,120,${a+.3})`);gl.addColorStop(1,'rgba(90,200,40,0)');g.fillStyle=gl;g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}
    cylG(g,42,46,12,30,'#5a606c');g.fillStyle='#2a2e36';g.fillRect(39,44,18,6);sph(g,48,72,9,'#8cb82e');g.fillStyle='#14161c';g.font='900 12px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('☣',48,72)},
  spores(g,c){const gl=g.createRadialGradient(48,60,2,48,60,34);gl.addColorStop(0,'rgba(166,255,74,.5)');gl.addColorStop(1,'rgba(166,255,74,0)');g.fillStyle=gl;g.beginPath();g.ellipse(48,62,36,18,0,0,6.283);g.fill();
    sph(g,48,40,16,'#5aa01e');g.fillStyle='#d8ff7a';for(const [x,y,r] of [[42,34,3.5],[54,38,3],[47,47,2.5],[56,30,2]]){g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}g.strokeStyle='#d8ff7a';g.lineWidth=2;g.beginPath();g.moveTo(48,24);g.quadraticCurveTo(52,14,60,14);g.stroke()},
  nanite(g,c){g.save();g.translate(48,48);g.rotate(-.75);cylG(g,-4,-6,8,30,'#c8d0dc');g.fillStyle='#e8ffb0';g.beginPath();g.moveTo(-4,-6);g.lineTo(0,-30);g.lineTo(4,-6);g.closePath();g.fill();g.fillStyle='rgba(166,255,74,.85)';g.fillRect(-3,2,6,12);g.fillStyle='#5a606c';g.fillRect(-7,22,14,5);g.restore();
    g.fillStyle='#dfe6ee';for(const [x,y] of [[64,66],[70,58],[58,72],[72,70]]){g.beginPath();g.arc(x,y,2.4,0,6.283);g.fill()}},
  virulence(g,c){sph(g,48,46,18,'#8cb82e');g.fillStyle='#10180a';g.beginPath();g.arc(41,43,5,0,6.283);g.arc(55,43,5,0,6.283);g.fill();g.fillRect(43,54,10,6);g.fillStyle='#8cb82e';g.fillRect(46.5,54,3,6);
    g.fillStyle='#d8ff7a';g.beginPath();g.moveTo(48,64);g.quadraticCurveTo(42,76,48,80);g.quadraticCurveTo(54,76,48,64);g.fill()},
  contagion(g,c){const pts=[[48,30],[28,60],[68,62],[48,74]];g.strokeStyle='rgba(166,255,74,.9)';g.lineWidth=2.5;g.beginPath();for(const [x,y] of pts.slice(1)){g.moveTo(48,30);g.quadraticCurveTo((48+x)/2,Math.min(30,y)-6,x,y)}g.stroke();
    for(const [x,y] of pts)sph(g,x,y,x===48&&y===30?11:7,'#7ac02a')},
  catalyst(g,c){g.fillStyle='rgba(200,230,255,.35)';g.strokeStyle='#e8f4ff';g.lineWidth=2.5;g.beginPath();g.moveTo(42,18);g.lineTo(54,18);g.lineTo(54,38);g.lineTo(70,70);g.quadraticCurveTo(72,78,64,78);g.lineTo(32,78);g.quadraticCurveTo(24,78,26,70);g.lineTo(42,38);g.closePath();g.fill();g.stroke();
    g.fillStyle='#8ae02e';g.beginPath();g.moveTo(35,56);g.lineTo(61,56);g.lineTo(69,72);g.quadraticCurveTo(70,76,64,76);g.lineTo(32,76);g.quadraticCurveTo(26,76,27,72);g.closePath();g.fill();g.fillStyle='#eaffb8';for(const [x,y,r] of [[42,64,3],[52,68,2.5],[47,50,2],[50,40,1.6]]){g.beginPath();g.arc(x,y,r,0,6.283);g.fill()}},
};
function glyphPicto(g,ch,col){g.font=`900 ${ch.length>2?24:ch.length>1?32:40}px Orbitron,"Segoe UI Symbol",sans-serif`;g.textAlign='center';g.textBaseline='middle';g.lineWidth=5;g.strokeStyle='#05070a';g.strokeText(ch,48,50);const gr=g.createLinearGradient(0,30,0,70);gr.addColorStop(0,'#ffffff');gr.addColorStop(.45,shade(col,.4));gr.addColorStop(.5,col);gr.addColorStop(1,shade(col,-.3));g.fillStyle=gr;g.fillText(ch,48,50)}
function iconFor(id,kind,tier){
  const key=id+(kind||'')+(tier||'');if(ICON[key])return ICON[key];
  const c=mk(96,96),g=c.getContext('2d');if(!g||!g.createRadialGradient||!c.toDataURL)return ICON[key]='';
  const u=UPNAME[id],rl=RELIC[id];
  if(kind==='relic'&&rl){const t=tier||has(id)||1,tc=TIERC[relicTierOf(id,t)]||'#cfe9ff';iconBadge(g,tc,tc);
    g.fillStyle=hexA(tc,.85);g.beginPath();g.moveTo(48,18);g.lineTo(68,40);g.lineTo(48,78);g.lineTo(28,40);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.moveTo(48,18);g.lineTo(58,40);g.lineTo(48,40);g.lineTo(38,40);g.closePath();g.fill();
    g.strokeStyle='#05070a';g.lineWidth=2;g.beginPath();g.moveTo(48,18);g.lineTo(68,40);g.lineTo(48,78);g.lineTo(28,40);g.closePath();g.stroke();
    g.font='900 22px Orbitron,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=4;g.strokeStyle='#05070a';g.strokeText(rl.name[0],48,46);g.fillStyle='#fff';g.fillText(rl.name[0],48,46)}
  else if(u){const col=CATC[u.evo||u.cat==='evo'?'evo':u.cat]||'#9aa6b8',frame=u.cat==='evo'?'#ffcf2e':u.cat==='lim'?'#ff9a3c':u.kind==='p'?'#c9a6ff':u.kind==='w'?'#9aa6b8':'#6a7484';iconBadge(g,col,frame);
    const base=u.cat==='evo'?u.w:id;if(PICTO[base])PICTO[base](g,col);else glyphPicto(g,u.ic||'?',col);
    if(u.cat==='evo'){g.fillStyle='#ffcf2e';g.font='900 18px sans-serif';g.textAlign='center';g.fillText('★',76,20)}}
  else return ICON[key]='';
  return ICON[key]=c.toDataURL();
}
