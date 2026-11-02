
(()=>{
const WW=400,WH=700,DEF_Y=684,BASE_Y=58,Y_MIN=300,Y_MAX=668;
const P_CAP=1100,E_CAP=700,B_CAP=480;
const cv=document.getElementById('cv');let ctx=cv.getContext('2d',{alpha:false});
const $=id=>document.getElementById(id);
let W=0,H=0,DPR=1,gx=0,gw=0,gy=0,gh=0;
function resize(){
  DPR=Math.min(LQ()?1:SET.quality==='high'?2:1.5,window.devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;
  cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);
  gw=Math.min(W,H*0.64);gx=(W-gw)/2;gy=H*0.19;gh=H-gy-H*0.01;
  if(typeof buildBG==='function')buildBG();
}
window.addEventListener('resize',resize);
function sc(y){return 0.5+0.5*Math.max(0,y/WH)}
function px(x,y){return gx+gw/2+(x-200)/400*gw*1.06*sc(y)}
function py(y){const t=Math.max(-0.1,y/WH);return gy+gh*(t*(0.5+0.5*t))}
function k(){return gw/400*1.06}
function unY(sy){const a=Math.max(0,(sy-gy)/gh);return(-0.5+Math.sqrt(0.25+2*a))*WH}
function unX(sx,y){return 200+(sx-gx-gw/2)/(gw*1.06*sc(y))*400}
const fmt=n=>{if(Number.isNaN(n))return'naneinf';if(n===Infinity)return'∞';n=Math.max(0,Math.round(n));if(n>=1e15)return n.toExponential(1).replace('+','');if(n>=1e12)return(n/1e12).toFixed(1)+'T';if(n>=1e9)return(n/1e9).toFixed(1)+'B';if(n>=1e6)return(n/1e6).toFixed(n>=1e7?0:1)+'M';if(n>=1e4)return(n/1e3).toFixed(n>=1e5?0:1)+'K';return String(n)};
const rnd=a=>a[(Math.random()*a.length)|0];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

