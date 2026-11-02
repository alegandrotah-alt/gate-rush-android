// ---------- relics: every family has tiers I–III, plus one-of-a-kind Exotics ----------
const TIERC=['','#cfe9ff','#e6c8ff','#ffd76a','#ff8ad8'];
const TIERN=['','Common','Rare','Legendary','Exotic'];
const ROMAN=['','I','II','III',''];
const pct=v=>Math.round(v*100)+'%';
const RELICS=[
  {id:'lucky',name:'Lucky Gate',v:[[12,6],[8,10],[5,15]],d:v=>`1 in ${v[0]} × gate crossings multiply by ${v[1]} instead.`},
  {id:'glass',name:'Glass Cannon',v:[[1.6,.7],[2.5,.5],[4,.35]],d:v=>`Blobs weigh ${v[0]}× more. Your hull keeps only ${pct(v[1])} of its HP.`},
  {id:'midas',name:'Midas Touch',v:[80,40,20],d:v=>`Every ${v} enemies crushed drops a coin. Brutes drop one too.`},
  {id:'shrapnel',name:'Shrapnel',v:[.2,.4,.7],d:v=>`Crushed enemies burst for ${pct(v)} of their weight. Chains.`},
  {id:'alchemy',name:'Alchemy',v:[1,2,3],d:v=>v===1?'Green + gates are worth double.':v===2?'Green + gates become × gates (about half their value).':'Green + gates become × gates of their full value.'},
  {id:'ram',name:'Battering Ram',v:[1.3,2,3],d:v=>`Blobs hit the fort ${v}× as hard.`},
  {id:'underdog',name:'Underdog',v:[1.6,2.5,4],d:v=>`Below half HP, blobs and weapons deal ${v}× damage.`},
  {id:'crowd',name:'Crowd Surfer',v:[.003,.01,.02],d:v=>`Blobs hit the fort +${(v*100).toFixed(1).replace('.0','')}% harder for every blob on screen.`},
  {id:'snowball',name:'Snowball',v:[.03,.06,.04],d:(v,t)=>t===3?`Every 300 blobs that reach a fort multiply blob weight ×1.03, forever. Compounds.`:`Every 150 blobs that reach a fort permanently add +${pct(v)} blob weight.`},
  {id:'conductor',name:'Conductor',v:[[.35,1],[1,1],[1,2]],d:v=>`${v[0]<1?'Some':'All'} Storm Rod bolts also strike a × gate, adding +${v[1]} to it for the rest of the fort.`},
  {id:'echo',name:'Echo',v:[[2,1.5],[3,3],[0,1.6]],d:v=>v[0]?`Blobs that passed ${v[0]}+ gates hit ${v[1]}× harder.`:`Blobs hit ×1.6 harder for every gate they passed. Compounds.`},
  {id:'bloodlust',name:'Bloodlust',v:[[.006,.6],[.015,1.5],[.03,3]],d:v=>`Each kill gives +${(v[0]*100).toFixed(1)}% fire rate, up to +${pct(v[1])}. Fades when the killing stops.`},
  {id:'executioner',name:'Executioner',v:[.5,1,2],d:v=>`Hits on the fort get stronger as it weakens, up to ${1+v}×.`},
  {id:'interest',name:'Compound Interest',v:[.04,.1,.05],d:(v,t)=>t===3?`After each fort, blob weight is multiplied by +5% for every 5 coins you hold (max +25%). Compounds.`:`After each fort, gain +${pct(v)} blob weight for every 5 coins you hold (up to 25 coins).`},
  {id:'daredevil',name:'Daredevil',v:[.8,2,4],d:v=>`The closer you fly to the fort, the harder blobs hit it, up to ${1+v}×.`},
  {id:'hydra',name:'Hydra Gates',v:[[1,0],[1,1],[2,1]],d:v=>`Every × gate multiplies by ${v[0]} more${v[1]?' and splits blobs into extra copies':''}.`},
  {id:'singularity',name:'Singularity',v:[2,4,6],d:(v,t)=>`Big One charges ${v}× faster${t>=2?' and swallows every blob it touches':''}${t===3?'. It also weighs 3× more':''}.`},
  {id:'mirrorfort',name:'Mirror Fort',v:[.1,.25,.5],d:v=>`${pct(v)} of all damage you deal to enemies also hits the fort.`},
  {id:'collector',name:'Collector',v:[.1,.25,.4],d:v=>`Everything deals ${pct(v)} more for each relic you own. Compounds.`},
  {id:'phoenix',name:'Phoenix Plating',v:[.05,.1,.15],d:v=>`Every 100 kills repairs ${pct(v)} HP (from your repair budget). Getting hit charges your weapons +${pct(v)} for 4s.`},
  {id:'brawler',name:'Brawler',v:[1.5,2.5,4],d:v=>`Saws, flames and orbs deal ${v}× damage.`},
  {id:'vampeng',name:'Vampire Engine',v:[[.008,.03],[.016,.05],[.028,.08]],d:v=>`Close range: close-range weapon kills repair you, ignoring the repair cap (up to ${(v[1]*100).toFixed(1)}% HP per second).`},
  {id:'thorns',name:'Thorn Plating',v:[.15,.25,.4],d:v=>`Close range: take ${pct(v)} less damage.`},
  {id:'riot',name:'Riot Pulse',v:[60,90,130],d:v=>`Close range: getting hit erases every plain bullet within ${v} of you (every 3s).`},
  {id:'scope',name:'Sniper Scope',v:[1.3,1.6,2.2],d:v=>`Long range: long-range weapons deal ${v}× damage behind the long-range line.`},
  {id:'overwatch',name:'Overwatch',v:[.25,.5,.9],d:v=>`Hold still for a moment: +${pct(v)} fire rate and weapon recharge until you move.`},
  {id:'artillery',name:'Artillery Doctrine',v:[1.4,1.9,2.8],d:v=>`Long range: Mortar and Missile damage ×${v}, anywhere.`},
  {id:'servos',name:'Overclocked Servos',v:[1.5,2.5,4],d:v=>`Engineer: turrets, drones and mines deal ${v}× damage.`},
  {id:'rally',name:'Rally Point',v:[.01,.02,.035],d:v=>`Engineer: flying next to one of your turrets repairs ${(v*100).toFixed(1)}% HP per second (from your repair budget).`},
  {id:'gateeng',name:'Gate Engineer',v:[[1,0],[1,1],[2,1]],d:v=>`Gates you hold multiply by ${v[0]} more${v[1]?' and lose control half as fast':''}.`},
  {id:'switch',name:'Switch Hitter',v:[.3,.6,1],d:v=>`Moving into close or long range gives +${pct(v)} damage for 3s.`},
  // exotics: one tier, rare, expensive, and they break the game
  {id:'ouroboros',name:'Ouroboros',x:1,d:()=>'Blobs that hit the fort loop back to you once and run every gate again.'},
  {id:'blackcard',name:'Black Card',x:1,d:()=>'Everything deals ×1.5 for every fort you have destroyed this run. Compounds.'},
  {id:'infmirror',name:'Infinity Mirror',x:1,d:()=>'× gates square their multiplier: ×4 becomes ×16.'},
  {id:'frenzy',name:'Feeding Frenzy',x:1,d:()=>'Blobs that crush an enemy swallow half its weight and keep going.'},
  {id:'bigbang',name:'Big Bang',x:1,d:()=>'The Big One carries the weight of every blob you have fired this fort.'},
  {id:'bloodmoon',name:'Blood Moon',x:1,d:()=>'Every close-range kill multiplies all damage ×1.002 for the rest of the run. Compounds.'},
  {id:'undying',name:'Undying Rage',x:1,d:()=>'Close range: a hit that would kill you leaves you at 1 HP instead. Recharges after 20s.'},
  {id:'orbital',name:'Orbital Lance',x:1,d:()=>'Every 9s an orbital beam strikes the thickest crowd for 30× your blob power and hits the keep for 40×.'},
  {id:'vonneumann',name:'Von Neumann',x:1,d:()=>'+2 turret cap. Turrets rebuild themselves once when they expire or break.'},
  {id:'polychrome',name:'Polychrome',x:1,d:()=>'Blobs hit the fort ×1.5 harder for every relic you own. Compounds.'},
];
const RELIC={};RELICS.forEach(r=>RELIC[r.id]=r);
const has=id=>R&&R.rt?(R.rt[id]||0):0;
const val=id=>{const t=has(id);const r=RELIC[id];return t&&r.v?r.v[t-1]:0};
const relicTierOf=(id,t)=>RELIC[id].x?4:t;
const relicName=(id,t)=>RELIC[id].name+(RELIC[id].x?'':' '+ROMAN[t]);
const relicDesc=(id,t)=>{const r=RELIC[id];return r.x?r.d():r.d(r.v[t-1],t)};
const lim=id=>R&&R.ups[id]>0;

