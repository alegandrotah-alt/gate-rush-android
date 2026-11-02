// ---------- sound effects: decoded once, played with light pitch variation; falls back to the synth blips ----------
const SBUF={},SLAST={};let SFXREADY=false;
function sfxInit(){if(SFXREADY||!AC||!AC.decodeAudioData)return;SFXREADY=true;
  for(const [k,b64] of Object.entries(SFXDATA)){try{const bin=atob(b64),buf=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)buf[i]=bin.charCodeAt(i);AC.decodeAudioData(buf.buffer,d=>SBUF[k]=d,()=>{})}catch(e){}}}
function playS(k,vol,rate){if(!k||!AC||!SET.sfx||!SBUF[k])return false;const now=AC.currentTime;if(now-(SLAST[k]||0)<.045)return true;SLAST[k]=now;
  try{const s=AC.createBufferSource(),g=AC.createGain();s.buffer=SBUF[k];s.playbackRate.value=rate||1;g.gain.value=(vol??.6)*SET.sfx;s.connect(g).connect(AC.destination);s.start()}catch(e){return false}return true}
const CUEMAP={lost:'lost',taken:'taken',level:'pick',fort:'boomBig',newfoe:'elite',ach:'ready',siege:'siege',boss:'siege'};
