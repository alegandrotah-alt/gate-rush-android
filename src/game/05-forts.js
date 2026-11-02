// ---------- forts ----------
function fortKind(L){if(L===1)return'intro';if((L-2)%4===3)return'stairs';if(!R)return'choice';R.kinds=R.kinds||{};if(!R.kinds[L]){const prev=R.kinds[L-1],pool=['choice','movers','gauntlet','zigzag','gamble','fortified','scatter'].filter(k=>k!==prev);R.kinds[L]=pool[(Math.random()*pool.length)|0]}return R.kinds[L]}
const LAYOUT={intro:1,choice:5,movers:3,gauntlet:10,zigzag:3.5,gamble:4,fortified:5,scatter:3.5,stairs:24};
function fortHP(L,kind){return 1100*Math.pow(2.4,L-1)*LAYOUT[kind]*(L===1?1.3:L<=4?1.7:1)*(L>13?Math.pow(2.5,Math.pow(L-13,1.35)):1)}
function makeLevel(L){
  const kind=fortKind(L);
  const lv={L,kind,gates:[],wall:null,initial:[],spawnLanes:[[40,360]],boss:kind==='stairs',T:60};
  let id=0;
  const G=(x1,x2,y,t,v,o={})=>lv.gates.push({id:id++,x1,x2,y,t,v,amp:o.amp||0,spd:o.spd||1,ph:o.ph||0,pool:v,flash:0,dead:false,bonus:0,ctl:1,own:1});
  lv.unitW=Math.pow(1.55,L-1);
  const shield=Math.round(30*Math.pow(1.7,L-1));
  if(kind==='intro'){
    G(30,200,500,'mul',2);G(200,370,500,'add',2);
    G(140,260,360,'mul',3,{amp:95,spd:1});
  }else if(kind==='choice'){
    G(30,145,520,'mul',2);G(145,255,520,'add',3);G(255,370,520,'sub',shield);
    G(30,200,400,'mul',3);G(200,370,400,'add',5);
    G(155,245,270,'mul',5,{amp:115,spd:1.1});
  }else if(kind==='movers'){
    G(150,250,540,'mul',3,{amp:110,spd:1.3});G(160,240,420,'mul',2,{amp:120,spd:0.9,ph:1});G(150,250,280,'mul',4,{amp:100,spd:1.7,ph:2});
    G(30,95,350,'sub',shield);G(305,370,350,'sub',shield);
  }else if(kind==='gauntlet'){
    lv.wall={x:200,y1:200,y2:470};
    G(40,190,520,'sub',shield*2);G(40,190,420,'mul',6);G(40,190,300,'mul',4);
    G(210,360,510,'mul',2);G(210,360,390,'mul',2);G(210,360,270,'add',4);
  }else if(kind==='zigzag'){
    G(30,135,570,'mul',2);G(265,370,510,'mul',2);G(30,135,450,'mul',3);G(265,370,390,'mul',3);G(130,270,330,'sub',shield);G(155,245,260,'mul',4,{amp:95,spd:1.2});
  }else if(kind==='gamble'){
    G(30,170,550,'add',4);G(230,370,550,'mul',2);G(182,218,430,'mul',8,{amp:150,spd:1.8});G(30,175,330,'sub',Math.round(shield*1.5));G(225,370,330,'sub',Math.round(shield*1.5));G(165,235,260,'mul',3);
  }else if(kind==='fortified'){
    G(60,340,570,'mul',2);G(30,120,460,'sub',shield);G(120,280,460,'mul',4);G(280,370,460,'sub',shield);G(30,140,340,'sub',shield*2);G(140,260,340,'mul',5);G(260,370,340,'sub',shield*2);
  }else if(kind==='scatter'){
    const n=5+((Math.random()*3)|0);
    for(let i=0;i<n;i++){const y=250+i*(330/n)+Math.random()*20,w=70+Math.random()*60,x=30+Math.random()*(340-w),r=Math.random();
      if(r<.6)G(x,x+w,y,'mul',2+((Math.random()*3)|0),Math.random()<.35?{amp:50+Math.random()*50,spd:.8+Math.random(),ph:Math.random()*6}:{});else if(r<.85)G(x,x+w,y,'add',3+((Math.random()*4)|0));else G(x,x+w,y,'sub',shield)}
  }else{
    for(let i=0;i<15;i++){const c=52+i*21.1,y=600-i*28.5;G(c-17,c+17,y,'mul',i+2)}
    const u=lv.unitW;
    [[60,100,150],[24,200,190],[20,300,230]].forEach(([s,x,y])=>lv.initial.push({x,y,w:Math.round(u*s*5),brute:true}));
    lv.advance=true;lv.T=70;lv.mech=rnd(['pulse','carrier','shield']);
  }
  lv.baseHP=fortHP(L,kind)*({pulse:.75,shield:.85,carrier:.9}[lv.mech]||1);
  return lv;
}

