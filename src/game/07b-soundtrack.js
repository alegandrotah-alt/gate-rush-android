// ---------- soundtrack: recorded orchestral tracks that loop for as long as you play ----------
// menu.mp3 and battle1.mp3: Pirate Nation by Proof of Play (MIT); battle2.mp3: "The Arrival (BATTLE II)" by Estudio Vaca Roxa (CC0).
// See music/CREDITS.txt. The synth-metal sequencer in the audio section is the fallback, and a choice in Settings.
const OST={base:'music/',tracks:{menu:{f:'menu'},battle1:{f:'battle1'},battle2:{f:'battle2',xf:4.5}},buf:{},ld:{},fail:{},cur:null,gain:null};
const ostWanted=()=>SET.ost!=='synth'&&typeof fetch!=='undefined';
function ostLoad(k){
  if(OST.buf[k]||OST.ld[k]||OST.fail[k]||!AC)return;OST.ld[k]=1;
  fetch(OST.base+OST.tracks[k].f+'.mp3').then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()})
    .then(a=>new Promise((res,rej)=>{const p=AC.decodeAudioData(a,res,rej);if(p&&p.then)p.then(res,rej)}))
    .then(b=>{// trim encoder silence at both ends so loops are gapless
      const d=b.getChannelData(0),n=d.length;let s=0,e=n-1;while(s<n&&Math.abs(d[s])<2e-4)s++;while(e>s&&Math.abs(d[e])<2e-4)e--;
      OST.buf[k]={b,ls:s/b.sampleRate,le:(e+1)/b.sampleRate}})
    .catch(()=>{OST.fail[k]=1});
}
function ostPick(){
  if(MUS.mode==='menu'||!S)return 'menu';
  if(S.lv&&S.lv.boss)return 'battle2';
  return (S.L||1)%2?'battle1':'battle2';
}
function ostStart(k,fadeIn){
  const T=OST.buf[k],t=AC.currentTime,src=AC.createBufferSource(),g=AC.createGain(),tr=OST.tracks[k];
  src.buffer=T.b;if(!tr.xf){src.loop=true;src.loopStart=T.ls;src.loopEnd=T.le}
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+(fadeIn||.05));src.connect(g).connect(OST.gain);src.start(t,T.ls);
  return{k,src,g,t0:t,end:t+(T.le-T.ls)};
}
function ostStop(c,fade){if(!c)return;const t=AC.currentTime;try{c.g.gain.cancelScheduledValues(t);c.g.gain.setValueAtTime(c.g.gain.value,t);c.g.gain.linearRampToValueAtTime(0,t+fade);c.src.stop(t+fade+.05)}catch(e){}}
// returns true while the recorded soundtrack owns the music
function ostTick(){
  if(!AC)return false;
  if(!OST.gain){OST.gain=AC.createGain();OST.gain.gain.value=0;OST.gain.connect(AC.destination)}
  const on=ostWanted();
  if(!on){if(OST.cur){ostStop(OST.cur,.8);OST.cur=null}OST.gain.gain.setTargetAtTime(0,AC.currentTime,.2);return false}
  const want=ostPick();ostLoad(want);if(OST.buf[want])for(const k in OST.tracks)ostLoad(k);if(OST.fail[want]){if(OST.cur){ostStop(OST.cur,.8);OST.cur=null}return false}
  OST.gain.gain.setTargetAtTime(SET.music*(MUS.mode==='game'?.85:MUS.mode==='pause'?.35:.7),AC.currentTime,.25);
  if(!OST.buf[want])return true;// still loading: stay quiet for a moment rather than switch styles
  const t=AC.currentTime;
  if(!OST.cur||OST.cur.k!==want){if(OST.cur)ostStop(OST.cur,1.4);OST.cur=ostStart(want,OST.cur?1.4:.6)}
  else if(OST.tracks[want].xf&&t>OST.cur.end-OST.tracks[want].xf){const old=OST.cur;ostStop(old,OST.tracks[want].xf);OST.cur=ostStart(want,1.2)}
  return true;
}
// pause the whole mix while the app is in the background, pick it back up on return
if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('visibilitychange',()=>{if(!AC)return;try{if(document.hidden)AC.suspend();else AC.resume()}catch(e){}});
