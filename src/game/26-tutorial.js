// ---------- first run: a short interactive tutorial that points at what matters ----------
let TUT=null;
function tutStart(){const co=$('coach'),ct=co&&co.querySelector&&co.querySelector('.ct');if(META.tut||!ct)return;TUT={step:0,t:0,busy:true,x0:S.cannon.x};$('coach').hidden=false}
function tutEnd(){if(!TUT)return;TUT=null;META.tut=1;for(const id of ['gate','keep','bullets','lvl'])META.guide=Object.assign(META.guide||{},{[id]:1});saveMeta();$('coach').hidden=true}
function tutSkip(){if(TUT){tutEnd();toast('Tutorial skipped. Cards in the Field Guide explain the rest.',2600,1)}}
function coachAt(x,y,text,below){const el=$('coach'),st=$('stage').getBoundingClientRect(),cvr=cv.getBoundingClientRect();
  const X=x+cvr.left-st.left,Y=y+cvr.top-st.top;el.querySelector('.ct').textContent=text;el.classList.toggle('below',!!below);
  el.style.left=Math.max(8,Math.min(st.width-8,X))+'px';el.style.top=Y+'px';
  const bub=el.querySelector('.cb'),bw=bub.offsetWidth||220;bub.style.left=(Math.max(8,Math.min(st.width-bw-8,X-bw/2))-Math.max(8,Math.min(st.width-8,X)))+'px'}
function coachEl(id,text,below){const r=$(id).getBoundingClientRect(),cvr=cv.getBoundingClientRect();coachAt(r.left+r.width/2-cvr.left,(below?r.bottom:r.top)-cvr.top,text,below)}
function tutTick(dt){
  if(!TUT)return;const co=$('coach');if(!S.running||S.over){co.classList.add('wait');return}if(TUT.step<3)co.classList.remove('wait');TUT.t+=dt;const c=S.cannon,K=k();
  if(TUT.step===0){coachAt(px(c.x,c.y),py(c.y)-40*sc(c.y)*K,'Drag anywhere to steer. Your ride fires on its own.');if(Math.abs(c.x-TUT.x0)>45&&TUT.t>1.2){TUT.step=1;TUT.t=0}}
  else if(TUT.step===1){let g=S.nextG;if(!g){let best=null;for(const q of S.lv.gates)if(!q.dead&&q.y<c.y&&(!best||q.y>best.y))best=q;g=best}
    if(g){const o=gateX(g),gx=(g.x1+g.x2)/2+o;coachAt(px(gx,g.y),py(g.y)+6*sc(g.y)*K,'Steer so your shots fly through a gate. × gates multiply them.',true)}
    if(TUT.gate&&TUT.t>1.5||TUT.t>14){TUT.step=2;TUT.t=0}}
  else if(TUT.step===2){coachEl('hpFill','Shots that reach the wall damage the keep. Break it before the timer hits zero.',true);if(TUT.t>5){TUT.step=3;TUT.t=0}}
  else if(TUT.step===3){let b=null;for(const q of S.bul)if(q.y<c.y&&(!b||q.y>b.y))b=q;
    if(b){coachAt(px(b.x,b.y),py(b.y)-10*sc(b.y)*K,'Glowing bullets hurt you. Slide out of their way.');TUT.seenB=1}else if(!TUT.seenB)$('coach').classList.add('wait');
    if(b)$('coach').classList.remove('wait');if(TUT.seenB&&TUT.t>4.5||TUT.t>20){TUT.step=4;TUT.t=0}}
  else if(TUT.step===4){$('coach').classList.toggle('wait',!(R.pendingPicks>0));if(R.pendingPicks>0)coachEl('lvlBtn','You levelled up! Tap +LVL to choose an upgrade.');
    if(R.picking||TUT.t>25)tutEnd()}
}
