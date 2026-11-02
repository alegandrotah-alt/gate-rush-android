// ---------- performance: auto quality, cached vignette, cached keep on low settings ----------
var AUTOLOW=false,FPSE=1/60,slowT=0,fastT=0;
function perfTick(dt){
  if(SET.quality!=='auto'||!S||!S.running)return;FPSE=FPSE*.95+dt*.05;
  if(!AUTOLOW){if(FPSE>.026){slowT+=dt;if(slowT>3){AUTOLOW=true;slowT=0;resize();toast('Effects lowered for smoother play',1600,0)}}else slowT=0}
  else{if(FPSE<.0175){fastT+=dt;if(fastT>10){AUTOLOW=false;fastT=0;resize()}}else fastT=0}
}
let VIG=null;
function vignette(){if(!VIG||VIG.w!==W||VIG.h!==H){const c=mk(Math.max(1,Math.round(W/2)),Math.max(1,Math.round(H/2))),g=c.getContext('2d');if(g&&g.createRadialGradient){const vg=g.createRadialGradient(c.width/2,c.height*.5,Math.min(c.width,c.height)*.35,c.width/2,c.height*.5,Math.max(c.width,c.height)*.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=vg;g.fillRect(0,0,c.width,c.height)}VIG={c,w:W,h:H}}ctx.drawImage(VIG.c,0,0,W,H)}
let FC=null;
function drawFortQ(K){
  if(!LQ()||S.breachT!=null){drawFort(K);return}
  const key=Math.round(S.fy)+'|'+Math.round(S.fw||174)+'|'+Math.floor(clamp(S.baseHP/S.baseMax,0,1)*14)+'|'+(S.shieldUp?1:0)+'|'+W+'|'+H+'|'+S.L;
  if(!FC||FC.key!==key||S.t-FC.t>.35||S.t<FC.t){const cw=Math.round(W*DPR),ch=Math.max(1,Math.round(Math.min(H,py(S.fy)+60)*DPR));
    if(!FC||FC.c.width!==cw||FC.c.height!==ch)FC={c:mk(cw,ch)};const g=FC.c.getContext('2d');if(!g||!g.setTransform){drawFort(K);return}
    g.setTransform(DPR,0,0,DPR,0,0);g.clearRect(0,0,W,H);const keep=ctx;ctx=g;try{drawFort(K)}finally{ctx=keep}FC.key=key;FC.t=S.t}
  ctx.drawImage(FC.c,0,0,FC.c.width/DPR,FC.c.height/DPR);
}
// Kenney asset atlases (CC0) and CC0 sound effects, embedded so the game loads in one file
