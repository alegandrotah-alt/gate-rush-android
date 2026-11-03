// ---------- damage types: every weapon deals one; factions and some minions are weak or resistant ----------
let DTY='kin';
const DTN={kin:'Kinetic',exp:'Explosive',nrg:'Energy',fire:'Fire'};
const DTC={kin:'#dfe8f2',exp:'#ffb43a',nrg:'#5fe1ff',fire:'#ff6a3a'};
const WTYPE={sentry:'kin',orbit:'kin',zap:'nrg',bomb:'exp',missile:'exp',laser:'nrg',flame:'fire',shield:'nrg',drones:'kin',boomer:'kin',mines:'exp',rail:'kin',tesla:'nrg',vortex:'nrg',prism:'nrg',blade:'kin'};
// [weak to, resists]
const FWEAK={robot:['nrg','kin'],bug:['fire','nrg'],beast:['kin','exp'],demon:['exp','fire'],angel:['kin','nrg'],knight:['fire','kin']};
const TMOD={armored:{exp:1.6,kin:.6},phantom:{nrg:2},splitter:{fire:1.7},totem:{exp:1.7},bomber:{fire:1.4}};
function dmod(e,blob){
  const fw=FWEAK[fac().id],ty=blob?'kin':DTY;let m=1;
  if(ty===fw[0])m*=blob?1.25:1.6;else if(ty===fw[1])m*=blob?.75:.55;
  if(!blob&&e.t&&TMOD[e.t]&&TMOD[e.t][ty])m*=TMOD[e.t][ty];
  if(e.pylon&&ty==='nrg')m*=1.6;
  return m;
}
function weakTo(ty){return FACL.filter(f=>FWEAK[f.id][0]===ty).map(f=>f.short)}
