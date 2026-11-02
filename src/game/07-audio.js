// ---------- audio ----------
let AC=null,lastBlip=0;
function blip(f,d=.05,type='square',vol=.04){
  if(!SET.sfx||!AC)return;const now=AC.currentTime;if(now-lastBlip<.035)return;lastBlip=now;vol*=SET.sfx*1.4;
  if(type==='sawtooth'&&f<160&&d>=.12){noise(vol*2.2,d*1.4,f*6);}
  const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,now);o.frequency.exponentialRampToValueAtTime(f*1.6,now+d);
  g.gain.setValueAtTime(vol,now);g.gain.exponentialRampToValueAtTime(.0001,now+d);o.connect(g).connect(AC.destination);o.start(now);o.stop(now+d+.02);
}
function ensureAudio(){if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}sfxInit();if(AC&&AC.state==='suspended')AC.resume();if(AC&&!MUS.gain)musicInit()}
// sound cues that carry gameplay meaning
function cue(k){if(playS(CUEMAP[k],.6))return;if(!AC||!SET.sfx)return;const t=AC.currentTime,v=.05*SET.sfx*1.4,d=AC.destination;
  if(k==='charge'){tone(t,330,.18,'sine',v*.8,d);tone(t+.08,495,.16,'sine',v*.6,d)}
  else if(k==='laser'){for(let i=0;i<4;i++)tone(t+i*.12,880+i*120,.09,'square',v*.6,d)}
  else if(k==='level'){[0,4,7,12].forEach((n,i)=>tone(t+i*.06,mtof(72+n),.18,'triangle',v*1.4,d))}
  else if(k==='fort'){[0,4,7,12,16].forEach((n,i)=>tone(t+i*.09,mtof(67+n),.3,'square',v,d));noise(v*3,.5,900)}
  else if(k==='siege'){tone(t,110,.9,'sawtooth',v*1.2,d);tone(t+.05,165,.8,'sawtooth',v*.8,d)}
  else if(k==='boss'){[0,-1,-3,-5].forEach((n,i)=>tone(t+i*.22,mtof(52+n),.4,'sawtooth',v*1.2,d))}
  else if(k==='ach'){[0,7,12,19].forEach((n,i)=>tone(t+i*.07,mtof(76+n),.25,'triangle',v*1.4,d))}
  else if(k==='lost'){tone(t,196,.3,'sawtooth',v*1.2,d);tone(t+.12,147,.4,'sawtooth',v*1.2,d)}
  else if(k==='taken'){tone(t,392,.15,'triangle',v*1.2,d);tone(t+.08,587,.25,'triangle',v*1.2,d)}
  else if(k==='newfoe'){tone(t,220,.25,'triangle',v,d);tone(t+.15,180,.3,'triangle',v,d)}}
let NB=null;
function noise(vol,dur,cut){if(!AC)return;if(!NB){NB=AC.createBuffer(1,AC.sampleRate*.5,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
  const now=AC.currentTime,src=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();src.buffer=NB;f.type='lowpass';f.frequency.value=cut||1200;g.gain.setValueAtTime(vol,now);g.gain.exponentialRampToValueAtTime(.0001,now+dur);src.connect(f).connect(g).connect(MUS.out||AC.destination);src.start(now);src.stop(now+dur+.02)}
// placeholder music: a small step sequencer in the current biome's key
const MUS={gain:null,out:null,next:0,step:0,bar:0,mode:'menu'};
function musicInit(){
  MUS.gain=AC.createGain();MUS.gain.gain.value=SET.music*.22;
  // a little hall reverb for the orchestra
  const len=AC.sampleRate*2.2,ir=AC.createBuffer(2,len,AC.sampleRate);for(let ch=0;ch<2;ch++){const d=ir.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
  MUS.verb=AC.createConvolver();MUS.verb.buffer=ir;MUS.wet=AC.createGain();MUS.wet.gain.value=.35;MUS.verb.connect(MUS.wet).connect(MUS.gain);
  MUS.orch=AC.createGain();MUS.orch.connect(MUS.gain);MUS.orch.connect(MUS.verb);
  // guitar: overdrive into a cab-ish lowpass
  const ws=AC.createWaveShaper(),cv=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/512-1;cv[i]=Math.tanh(x*9)}ws.curve=cv;ws.oversample='2x';
  const cab=AC.createBiquadFilter();cab.type='lowpass';cab.frequency.value=3200;cab.Q.value=.7;const hp=AC.createBiquadFilter();hp.type='highpass';hp.frequency.value=90;
  MUS.gtr=AC.createGain();MUS.gtr.gain.value=.5;MUS.gtr.connect(ws);ws.connect(hp).connect(cab);const gOut=AC.createGain();gOut.gain.value=.22;cab.connect(gOut).connect(MUS.gain);
  MUS.drums=AC.createGain();MUS.drums.gain.value=.9;MUS.drums.connect(MUS.gain);
  MUS.gain.connect(AC.destination);MUS.out=AC.destination;MUS.next=AC.currentTime+.1}
const mtof=m=>440*Math.pow(2,(m-69)/12);
function tone(t,f,dur,type,vol,dest,att){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+(att||.01));g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(dest);o.start(t);o.stop(t+dur+.02)}
function pad(t,f,dur,vol,dest,type){for(const det of [-7,0,7]){const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();o.type=type||'sawtooth';o.frequency.value=f;o.detune.value=det;lp.type='lowpass';lp.frequency.value=1400;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol/3,t+dur*.35);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(lp).connect(g).connect(dest);o.start(t);o.stop(t+dur+.05)}}
function choir(t,f,dur,vol,dest){const o=AC.createOscillator(),g=AC.createGain(),bp=AC.createBiquadFilter(),lfo=AC.createOscillator(),lg=AC.createGain();o.type='sawtooth';o.frequency.value=f;bp.type='bandpass';bp.frequency.value=800;bp.Q.value=3;lfo.frequency.value=5.2;lg.gain.value=f*.012;lfo.connect(lg).connect(o.frequency);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);o.connect(bp).connect(g).connect(dest);o.start(t);lfo.start(t);o.stop(t+dur+.05);lfo.stop(t+dur+.05)}
function chord(t,root,dur,vol,mute){for(const iv of [0,7,12]){const o=AC.createOscillator(),g=AC.createGain();o.type='sawtooth';o.frequency.value=mtof(root+iv);o.detune.value=(Math.random()-.5)*8;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+(mute?dur*.5:dur));o.connect(g).connect(MUS.gtr);o.start(t);o.stop(t+dur+.02)}}
function kick(t,dest){const o=AC.createOscillator(),g=AC.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);g.gain.setValueAtTime(.9,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);o.connect(g).connect(dest);o.start(t);o.stop(t+.18)}
function snare(t,dest){if(!NB)noise(0.00001,.01);const s2=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s2.buffer=NB;f.type='bandpass';f.frequency.value=1800;f.Q.value=.7;g.gain.setValueAtTime(.6,t);g.gain.exponentialRampToValueAtTime(.0001,t+.16);s2.connect(f).connect(g).connect(dest);s2.start(t);s2.stop(t+.18);tone(t,190,.08,'triangle',.3,dest)}
function hat(t,dest,v){if(!NB)noise(0.00001,.01);const s2=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s2.buffer=NB;f.type='highpass';f.frequency.value=7000;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0001,t+.05);s2.connect(f).connect(g).connect(dest);s2.start(t);s2.stop(t+.06)}
function crash(t,dest){if(!NB)noise(0.00001,.01);const s2=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s2.buffer=NB;s2.loop=true;f.type='highpass';f.frequency.value=4000;g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.0001,t+1.6);s2.connect(f).connect(g).connect(dest);s2.start(t);s2.stop(t+1.7)}
function timpani(t,f,dest){const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(f*1.5,t);o.frequency.exponentialRampToValueAtTime(f,t+.08);g.gain.setValueAtTime(.7,t);g.gain.exponentialRampToValueAtTime(.0001,t+.9);o.connect(g).connect(dest);o.start(t);o.stop(t+.95)}
// orchestral power metal: i–VI–III–VII in harmonic minor, gallop guitars, double kick, strings, brass, choir
function musicTick(){
  if(!AC||!MUS.gain)return;
  const target=SET.music*(MUS.mode==='game'?.26:MUS.mode==='pause'?.08:.16);MUS.gain.gain.setTargetAtTime(target,AC.currentTime,.3);
  if(!SET.music)return;
  const b=biome().music,game=MUS.mode==='game',bpm=game?(b.fast?168:152):84,spb=60/bpm/4;
  if(MUS.next<AC.currentTime-.5)MUS.next=AC.currentTime+.05;
  const root=b.root-(b.root>46?12:0),prog=[0,8,3,10],hm=[0,2,3,5,7,8,11];
  const lead=[[7,7,8,7,5,3,2,3],[3,5,7,8,7,5,3,5],[12,11,8,7,8,7,5,3],[2,3,5,7,8,11,12,11]];
  while(MUS.next<AC.currentTime+.3){
    const t=MUS.next,st=MUS.step%16,bar=MUS.bar,r=root+prog[bar%4];
    if(st===0){
      pad(t,mtof(r+12),spb*16,.16,MUS.orch);pad(t,mtof(r+19),spb*16,.12,MUS.orch);pad(t,mtof(r+24),spb*16,.08,MUS.orch);
      if(bar%2===0)choir(t,mtof(r+24),spb*16,.06,MUS.orch);
      timpani(t,mtof(r-12),MUS.orch);
    }
    if(game){
      // gallop: x-xx x-xx on the guitars, double kick under it
      if(st%4===0||st%4===2||st%4===3)chord(t,r,spb*(st%4===0?1.8:.9),.16,st%4!==0);
      kick(t,MUS.drums);if(st%4===2)kick(t+spb/2,MUS.drums);
      if(st===4||st===12)snare(t,MUS.drums);
      if(st%2===1)hat(t,MUS.drums,.08);
      if(st===0&&bar%4===0)crash(t,MUS.drums);
      // brass stabs on the downbeat of every other bar
      if(st===0&&bar%2===1){tone(t,mtof(r+12),spb*3,'square',.07,MUS.orch,.02);tone(t,mtof(r+19),spb*3,'square',.05,MUS.orch,.02)}
      // soaring lead in the second half of each phrase
      if(bar%8>=4&&st%2===0){const ph=lead[bar%4],n=ph[(st/2)%8];tone(t,mtof(root+24+hm[n%7]+12*Math.floor(n/7)),spb*2.2,'sawtooth',.045,MUS.orch,.02)}
    }else{
      if(st%8===0)tone(t,mtof(r),spb*8,'triangle',.25,MUS.orch,.05);
      if(st%2===0&&bar%2===1){const n=[0,2,4,2,5,4,2,1][(st/2)%8];tone(t,mtof(root+24+hm[n]),spb*3,'sine',.07,MUS.orch,.05)}
    }
    MUS.next+=spb;MUS.step++;if(MUS.step%16===0)MUS.bar++;
  }
}

