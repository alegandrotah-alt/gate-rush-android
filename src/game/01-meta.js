// ---------- meta (persists between runs) ----------
// research tree: four branches, each node needs a rank in the one before it
const RES=[
  {id:'might',b:'Offense',name:'Might',max:5,cost:[30,60,110,180,280],desc:'+10% blob weight'},
  {id:'haste',b:'Offense',name:'Haste',max:5,cost:[30,60,110,180,280],desc:'+6% fire rate'},
  {id:'salvo',b:'Offense',name:'Opening Salvo',max:1,cost:[160],desc:'Start every fort with the Big One charged',req:['haste',2]},
  {id:'gatetune',b:'Offense',name:'Gate Tuning',max:1,cost:[260],desc:'Every × gate multiplies by 1 more',req:['might',3]},
  {id:'ocstart',b:'Offense',name:'Warm Start',max:1,cost:[350],desc:'Start runs with Overclock level 1',req:['gatetune',1]},
  {id:'armor',b:'Defense',name:'Hull Plating',max:5,cost:[30,60,110,180,280],desc:'+30 hull HP'},
  {id:'repairs',b:'Defense',name:'Field Repairs',max:3,cost:[70,150,260],desc:'+4% repair budget per fort',req:['armor',1]},
  {id:'plating',b:'Defense',name:'Shield Pip',max:1,cost:[220],desc:'Start with 1 shield pip that blocks a hit',req:['armor',2]},
  {id:'reflex',b:'Defense',name:'Reflexes',max:2,cost:[180,320],desc:'+0.08s invulnerability after a hit',req:['plating',1]},
  {id:'kit',b:'Defense',name:'Emergency Kit',max:1,cost:[450],desc:'Every run starts with Second Wind',req:['repairs',3]},
  {id:'greed',b:'Economy',name:'Greed',max:5,cost:[30,60,110,180,280],desc:'+1 coin per fort'},
  {id:'startcoins',b:'Economy',name:'Nest Egg',max:3,cost:[50,110,200],desc:'+3 starting coins',req:['greed',1]},
  {id:'interestcap',b:'Economy',name:'Bigger Vault',max:2,cost:[140,280],desc:'+2 max interest per fort',req:['greed',2]},
  {id:'slots',b:'Economy',name:'Pockets',max:2,cost:[200,420],desc:'+1 relic slot',req:['greed',3]},
  {id:'rarity',b:'Economy',name:'Connections',max:3,cost:[120,220,340],desc:'Rarer relics show up more often',req:['interestcap',1]},
  {id:'lens',b:'Economy',name:'Exotic Lens',max:1,cost:[480],desc:'Exotics can appear from fort 2, and more often',req:['rarity',3]},
  {id:'luck',b:'Arsenal',name:'Luck',max:3,cost:[40,90,160],desc:'+1 level-up reroll'},
  {id:'xp',b:'Arsenal',name:'Quick Study',max:3,cost:[50,110,200],desc:'+10% XP'},
  {id:'choice4',b:'Arsenal',name:'Wider Choice',max:1,cost:[300],desc:'Level-ups offer 4 cards',req:['luck',2]},
  {id:'veteran',b:'Arsenal',name:'Veteran',max:1,cost:[160],desc:'Your starting weapon begins at level 2',req:['xp',1]},
  {id:'arsenal',b:'Arsenal',name:'Weapon Rack',max:1,cost:[380],desc:'+1 weapon slot (5 total)',req:['veteran',1]},
  {id:'satchel',b:'Arsenal',name:'Perk Satchel',max:1,cost:[300],desc:'+1 perk slot (5 total)',req:['luck',1]},
];
const RESN={};RES.forEach(r=>RESN[r.id]=r);
let META={gems:0,best:0,shop:{},veh:'cannon'};
try{const m=JSON.parse(localStorage.getItem('gaterush-meta2')||'null');if(m)META=Object.assign(META,m)}catch(e){}
const saveMeta=()=>{try{localStorage.setItem('gaterush-meta2',JSON.stringify(META))}catch(e){}};
const rank=id=>META.shop[id]||0;
const shopCost=id=>RESN[id].cost[rank(id)]||999;
const resOpen=r=>!r.req||rank(r.req[0])>=r.req[1];
let SET={fps:0,autolvl:0,vib:1,fxtext:1,banners:1,music:.5,sfx:.7,shake:1,nums:1,quality:'auto',hitbox:1,contrast:0,flash:1};
try{const m=JSON.parse(localStorage.getItem('gaterush-settings')||'null');if(m)SET=Object.assign(SET,m)}catch(e){}
const saveSet=()=>{try{localStorage.setItem('gaterush-settings',JSON.stringify(SET))}catch(e){}};
const LQ=()=>SET.quality==='low'||(SET.quality==='auto'&&AUTOLOW);
// scenery: one is picked at random for each fort
// planets: each keep is fought on a random world
const BIOMES=[
  {id:'dune',name:'Kepler Dunes',sky:['#12060f','#4a1a2a','#d0643a'],sun:'255,190,120',hills:['#7a3628','#3e1a16'],hillKind:'mesa',ground:['#a8522e','#5a2616'],road:['#1a181e','#34303a'],curb:'#ffb43a',lane:'rgba(255,180,90,.8)',deco:'spire',weather:'dust',haze:'255,150,90',rail:'255,170,70',
    planet:{c:['#ffe2b8','#d87a44','#3a1208'],r:.3,x:.22,y:.44,moon:1},neb:['255,90,60','160,40,90'],music:{root:45,scale:[0,3,5,7,10]}},
  {id:'cryo',name:'Cryo-9',sky:['#030916','#10284e','#5d9ccc'],sun:'200,235,255',hills:['#8fb4d6','#4a6f96'],hillKind:'crystal',ground:['#c4dcef','#6f8fae'],road:['#161e2a','#313f52'],curb:'#7fe0ff',lane:'rgba(127,224,255,.85)',deco:'crystal',weather:'snow',haze:'190,225,255',rail:'110,220,255',
    planet:{c:['#f6ead0','#c99a5a','#3a2410'],r:.46,x:.74,y:.4,ring:1},neb:['80,140,255','120,90,220'],music:{root:50,scale:[0,2,3,7,8]}},
  {id:'verdant',name:'Verdant Prime',sky:['#020f0b','#0b3324','#3aa57a'],sun:'210,255,210',hills:['#1d6a44','#0e3a26'],hillKind:'flora',ground:['#2c623a','#12301b'],road:['#121a16','#29372f'],curb:'#7dffb0',lane:'rgba(125,255,176,.75)',deco:'flora',weather:'spores',haze:'120,230,170',rail:'120,255,170',
    planet:{c:['#d8f4ff','#4a8ad0','#0a1a40'],r:.26,x:.72,y:.42,moon:1},neb:['60,200,140','40,120,200'],music:{root:48,scale:[0,2,4,7,9]}},
  {id:'magmus',name:'Magmus',sky:['#100305','#460c0c','#c03a18'],sun:'255,120,40',hills:['#2e1616','#160a0c'],hillKind:'volcano',ground:['#382020','#180c0e'],road:['#110d0f','#2a2024'],curb:'#ff5a1f',lane:'rgba(255,120,50,.75)',deco:'lava',weather:'embers',haze:'255,90,40',rail:'255,100,40',
    planet:{c:['#ffe08a','#ff6a1a','#4a0a04'],r:.4,x:.3,y:.5},neb:['255,60,20','140,20,40'],music:{root:41,scale:[0,1,5,7,8]}},
  {id:'arcadia',name:'Neo-Arcadia',sky:['#05031a','#1c0c46','#6a2a8a'],sun:'255,90,220',hills:['#1c1644','#0c0a24'],hillKind:'city',ground:['#15112c','#090716'],road:['#0a0a16','#1a1a30'],curb:'#36f1ff',lane:'rgba(54,241,255,.85)',deco:'neon',weather:'rain',haze:'140,70,220',rail:'54,241,255',
    planet:{c:['#ffd6f6','#c040c0','#20063a'],r:.3,x:.22,y:.36,ring:1},neb:['255,60,220','60,120,255'],music:{root:45,scale:[0,3,5,7,10],fast:1}},
  {id:'void',name:'Void Reach',sky:['#000002','#04041a','#1c1c3e'],sun:'210,220,255',hills:['#4a4a58','#26262f'],hillKind:'crater',ground:['#5a5a64','#2a2a33'],road:['#111117','#292935'],curb:'#c8d2ff',lane:'rgba(200,210,255,.7)',deco:'crater',weather:'motes',haze:'150,160,220',rail:'170,180,255',
    planet:{c:['#eef8ff','#3a7ad0','#04102a'],r:.58,x:.68,y:.55,earth:1},neb:['120,80,255','255,90,160'],music:{root:43,scale:[0,2,3,7,8]}},
];
// enemy factions: each keep is held by one of them, which sets its minions, champions and architecture
const FACTIONS={
  robot:{id:'robot',name:'Iron Legion',short:'Legion',body:'#8d99ab',dark:'#353d4b',lite:'#dfe6ef',eye:'#ff3b3b',accent:'#ffb43a',muzzle:'255,70,60',wall:['#566173','#20262f'],trim:'#9aa6b8',bias:['gunner','armored'],pal:['#232932','#6f7a8a','#c8d0dc'],glow:'#ff3b3b',tip:'machines: more gunners and armor'},
  bug:{id:'bug',name:'Hive Swarm',short:'Swarm',body:'#7a4aa8',dark:'#2c1640',lite:'#c9a6f0',eye:'#c6ff4a',accent:'#c6ff4a',muzzle:'198,255,74',wall:['#55306a','#1c0c26'],trim:'#9a6ac8',bias:['runner','splitter'],pal:['#2c1640','#6a3a96','#b98ae6'],glow:'#c6ff4a',tip:'swarms: runners and splitters'},
  beast:{id:'beast',name:'Xeno Pack',short:'Pack',body:'#9a6440',dark:'#4a2c1a',lite:'#e0b088',eye:'#ffd23a',accent:'#3affd0',muzzle:'255,200,60',wall:['#6a4a30','#2a1a10'],trim:'#d8c8a8',bias:['runner','bomber'],pal:['#3a2414','#8a5a36','#d8a878'],glow:'#ffd23a',tip:'beasts: fast rushers and bombers'},
  demon:{id:'demon',name:'Hellforged',short:'Hellforged',body:'#c42a36',dark:'#4a0a12',lite:'#ff8a7a',eye:'#ffcf2e',accent:'#ff7a1a',muzzle:'255,110,40',wall:['#33181c','#0e0507'],trim:'#4a2226',bias:['bomber','phantom'],pal:['#3a0a10','#a01e2a','#ff7a6a'],glow:'#ff7a1a',tip:'demons: bombers and phantoms'},
  angel:{id:'angel',name:'Seraph Choir',short:'Seraph',body:'#ecebf6',dark:'#8a86a8',lite:'#ffffff',eye:'#7fe0ff',accent:'#ffd76a',muzzle:'255,230,140',wall:['#dedaf0','#8a86a0'],trim:'#ffd76a',bias:['totem','phantom'],pal:['#5a5678','#cfcce4','#ffffff'],glow:'#ffd76a',tip:'angels: healers and phantoms'},
  knight:{id:'knight',name:'Void Templars',short:'Templar',body:'#7d8cae',dark:'#2a3248',lite:'#c8d4ee',eye:'#7fe0ff',accent:'#d62a3a',muzzle:'127,224,255',wall:['#46526e','#1a2034'],trim:'#c9a050',bias:['armored','saboteur'],pal:['#1e2638','#5a6a8e','#c0ccea'],glow:'#7fe0ff',tip:'knights: armor and saboteurs'},
};
const FACL=Object.values(FACTIONS);
const fac=()=>S&&S.fac||FACTIONS.robot;
const hexA=(h,a)=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`};
const biome=()=>S&&S.biome||BIOMES[0];
// cosmetics bought with gems
const COS={
  paint:[{id:'ocean',name:'Signature',cost:0,c:null},{id:'crimson',name:'Crimson',cost:60,c:['#7e1626','#e2454f','#ffb3b8'],o:'#2a0410'},{id:'jade',name:'Jade',cost:60,c:['#0f6b4a','#23c483','#9cf5cf'],o:'#03201a'},
    {id:'royal',name:'Royal',cost:90,c:['#3b2a8f','#7a5cff','#cfc4ff'],o:'#0e0630'},{id:'sunset',name:'Sunset',cost:90,c:['#a84a14','#ff9a3c','#ffe0a3'],o:'#3a1000'},{id:'sakura',name:'Sakura',cost:90,c:['#a83a6a','#ff9ac8','#ffe6f2'],o:'#4a0a2a'},
    {id:'toxic',name:'Toxic',cost:90,c:['#2a4a00','#9aff2a','#eaffb8'],o:'#0a1a00'},{id:'midnight',name:'Midnight Neon',cost:120,c:['#141428','#3a3a6a','#9aa0ff'],o:'#5fe1ff'},{id:'arctic',name:'Arctic',cost:120,c:['#4a6a8a','#e8f4ff','#ffffff'],o:'#1a2a4a'},
    {id:'inferno',name:'Inferno',cost:150,c:['#4a0a00','#ff4a1a','#ffd27a'],o:'#ffcf2e'},{id:'void',name:'Voidglass',cost:180,c:['#05050c','#22223a','#7a5cff'],o:'#ff3df0'},{id:'gold',name:'Gilded',cost:220,c:['#7d5e0c','#e8b923','#fff0a8'],o:'#3a1a00'}],
  blob:[{id:'aqua',name:'Aqua',cost:0,c:'#2fc4e8'},{id:'lime',name:'Lime',cost:50,c:'#7ad63a'},{id:'bubble',name:'Bubblegum',cost:50,c:'#ff7ac2'},{id:'violet',name:'Violet',cost:80,c:'#9b6bff'},{id:'tang',name:'Tangerine',cost:80,c:'#ff9a3c'},{id:'ghost',name:'Ghost',cost:140,c:'#e6eeff'}],
  trail:[{id:'spark',name:'Sparks',cost:0,c:['#ffd76a','#8fe7ff']},{id:'fire',name:'Fire',cost:60,c:['#ff7a1a','#ffcf2e','#ff3b3b']},{id:'frost',name:'Frost',cost:60,c:['#bfe8ff','#ffffff']},{id:'shadow',name:'Shadow',cost:100,c:['#3a2a5a','#7a5cff']},{id:'rainbow',name:'Rainbow',cost:180,c:['#ff3b3b','#ffcf2e','#20b46a','#2fc4e8','#9b6bff']}],
};
// achievements reward milestones with gems; records track personal bests
const ACH=[
  {id:'f1',name:'First Breach',d:'Breach your first gatekeep',g:20},
  {id:'boss',name:'Gatebreaker',d:'Breach a Grand Gatekeep',g:40},
  {id:'f10',name:'Deep Run',d:'Reach gatekeep 10',g:80},
  {id:'f20',name:'Unstoppable',d:'Reach gatekeep 20',g:200},
  {id:'hold',name:'Warden',d:'Breach a gatekeep without losing a single gate',g:50},
  {id:'evo',name:'Evolution',d:'Evolve a weapon',g:40},
  {id:'evo3',name:'Arsenal of Legends',d:'Own 3 evolutions in one run',g:120},
  {id:'t3',name:'Collector',d:'Own a tier III relic',g:30},
  {id:'exo',name:'Game Breaker',d:'Own an Exotic relic',g:60},
  {id:'clean',name:'Untouchable',d:'Breach a gatekeep without taking a hit',g:40},
  {id:'hoard',name:'Dragon Hoard',d:'Hold 40 coins at once',g:40},
  {id:'mil',name:'Seven Figures',d:'Deal 1,000,000 damage in a single hit',g:60},
  {id:'world',name:'World Tour',d:'Fight on all six planets',g:80},
  {id:'k10',name:'Horde Breaker',d:'Crush 10,000 enemies in total',g:100},
  {id:'elite1',name:'Giant Slayer',d:'Defeat an elite champion',g:20},
  {id:'elite10',name:'Champion Hunter',d:'Defeat 10 elites in total',g:60},
  {id:'close50',name:'Up Close',d:'Breach a keep after spending half the fight in close range',g:40},
  {id:'leech',name:'Leech Lord',d:'Repair 500 HP from close-range lifesteal in one run',g:60},
  {id:'snipe',name:'Sharpshooter',d:'Breach a keep without ever entering close range',g:40},
  {id:'eng6',name:'Architect',d:'Have 6 turrets deployed at once',g:50},
  {id:'weak300',name:'Exploit the Weakness',d:'Kill 300 enemies with damage they are weak to in one run',g:50},
  {id:'siege',name:'Under Pressure',d:'Breach a keep during its siege',g:30},
  {id:'photo',name:'Photo Finish',d:'Breach a keep less than 5 seconds before being overrun',g:60},
  {id:'mechs',name:'Citadel Crusher',d:'Defeat all three kinds of Grand Gatekeep',g:100},
  {id:'xeno',name:'Xenologist',d:'Breach keeps held by all six factions',g:80},
  {id:'pilot',name:'Test Pilot',d:'Breach a keep with every ride',g:80},
  {id:'undying',name:'Not Today',d:'Survive a lethal hit with Undying Rage',g:40},
  {id:'lvl30',name:'Ascendant',d:'Reach level 30 in one run',g:60},
  {id:'big10',name:'Big Shot',d:'Hit keeps with 10 Big Ones in one run',g:30},
  {id:'ghost',name:'Ghost Run',d:'Breach 3 keeps in a row without taking a hit',g:100},
  {id:'relic6',name:'Curator',d:'Own 6 relics at once',g:40},
  {id:'cond2',name:'Bad Weather',d:'Breach a keep with two keep conditions at once',g:40},
  {id:'bounty',name:'Bounty Hunter',d:'Catch a bounty courier',g:20},
  {id:'twin',name:'Double Trouble',d:'Breach Twin Keeps',g:30},
  {id:'tut',name:'Graduate',d:'Finish the tutorial',g:15},
  {id:'guide13',name:'Field Notes',d:'Discover 13 Field Guide entries',g:25},
  {id:'guideall',name:'Field Researcher',d:'Discover every Field Guide entry',g:80},
  {id:'fast20',name:'Blitz',d:'Breach a keep in under 20 seconds',g:40},
  {id:'thread',name:'Hanging by a Thread',d:'Breach a keep with less than 10% hull left',g:40},
  {id:'shells',name:'Shell Shocked',d:'Breach a keep after 10 mortar shells without a single mortar hit',g:50},
  {id:'hoard100',name:'Vault',d:'Hold 100 coins at once',g:60},
  {id:'lvl50',name:'Transcendent',d:'Reach level 50 in one run',g:100},
  {id:'res10',name:'Researcher',d:'Buy 10 research upgrades',g:30},
  {id:'style6',name:'Stylist',d:'Own 6 cosmetics you bought',g:30},
  {id:'courier3',name:'Hot Pursuit',d:'Catch 3 bounty couriers in one run',g:50},
  {id:'iron5',name:'Iron Wall',d:'Breach 5 keeps in one run without losing a gate in any of them',g:80},
];
// milestones: lifetime goals with five levels each; every level pays gems, so steady play keeps paying out
const MROMAN=['I','II','III','IV','V'];
const live=k=>R&&!R.banked?(R[k]||0):0;
const MILE=[
  {id:'kills',name:'Horde Crusher',u:'enemies crushed',t:[500,2500,10000,50000,250000],g:[15,30,60,120,250],v:()=>META.rec.kills+Math.round(live('kills'))},
  {id:'forts',name:'Keep Breaker',u:'keeps breached',t:[5,25,75,200,500],g:[15,30,60,120,250],v:()=>META.rec.forts+live('forts')},
  {id:'runs',name:'Veteran',u:'runs played',t:[3,10,25,60,150],g:[10,20,40,80,160],v:()=>META.rec.runs},
  {id:'deep',name:'Deep Diver',u:'keeps in your best run',t:[3,6,10,15,25],g:[15,30,60,120,250],v:()=>Math.max(META.best,live('forts'))},
  {id:'elites',name:'Elite Hunter',u:'elites defeated',t:[5,25,75,200,500],g:[15,30,60,120,250],v:()=>META.rec.elites||0},
  {id:'bosses',name:'Grand Slayer',u:'Grand Gatekeeps breached',t:[1,5,15,40,100],g:[20,40,80,150,300],v:()=>META.rec.bosses||0},
  {id:'flawless',name:'Flawless',u:'keeps breached without a hit',t:[3,10,30,75,150],g:[15,30,60,120,250],v:()=>META.rec.flawless||0},
  {id:'levels',name:'Ascension',u:'levels gained',t:[25,100,300,800,2000],g:[10,25,50,100,200],v:()=>(META.rec.levels||0)+(R&&!R.banked?R.lvl-1:0)},
  {id:'gates',name:'Gatecrasher',u:'gate boosts',t:[1000,10000,50000,250000,1000000],g:[10,25,50,100,200],v:()=>(META.rec.gates||0)+live('gateN')},
  {id:'bigs',name:'Big Shot',u:'Big One hits',t:[10,50,200,600,1500],g:[10,25,50,100,200],v:()=>(META.rec.bigs||0)+live('bigHits')},
  {id:'relics',name:'Collector',u:'relics bought',t:[3,10,30,75,150],g:[10,25,50,100,200],v:()=>(META.rec.relicsB||0)+live('relicsBought')},
  {id:'couriers',name:'Bounty Hunter',u:'couriers caught',t:[3,10,30,75,150],g:[10,25,50,100,200],v:()=>META.rec.couriers||0},
];
if(!META.mile)META.mile={};
function mileCheck(){
  let n=0,gems=0,last='';
  for(const m of MILE){let lv=META.mile[m.id]||0;const v=m.v();while(lv<m.t.length&&v>=m.t[lv]){gems+=m.g[lv];n++;last=`${m.name} ${MROMAN[lv]}`;lv++}META.mile[m.id]=lv}
  if(n){META.gems+=gems;saveMeta();toast(n>1?`${n} milestones reached  +${gems} gems`:`Milestone: ${last}  +${gems} gems`,2200,1);cue('ach')}
}
function achMeta(){const res=Object.values(META.shop||{}).reduce((a,b)=>a+b,0);if(res>=10)award('res10');
  const bought=Object.entries(META.cos||{}).reduce((a,[k,v])=>a+v.filter(id=>{const it=(COS[k]||[]).find(x=>x.id===id);return it&&it.cost>0}).length,0);if(bought>=6)award('style6')}
if(!META.ach)META.ach={};
if(!META.rec)META.rec={runs:0,kills:0,forts:0,bestHit:0,bestLvl:0,biomes:{}};
function award(id){if(META.ach[id])return;const a=ACH.find(x=>x.id===id);META.ach[id]=1;META.gems+=a.g;saveMeta();toast(`Achievement: ${a.name}  +${a.g} gems`,2000,1);cue('ach')}
function checkAch(ev){
  if(!R||!S)return;const rec=META.rec;
  if(ev==='fort'){award('f1');if(S.lv.boss){award('boss');rec.bosses=(rec.bosses||0)+1}if(!S.hitsThisFort){award('clean');rec.flawless=(rec.flawless||0)+1}if(!S.gatesLost){award('hold');R.iron=(R.iron||0)+1;if(R.iron>=5)award('iron5')}
    if(S.t<20)award('fast20');if(S.cannon.hp>0&&S.cannon.hp/S.st.maxHp<.1)award('thread');if((S.mortarN||0)>=10&&!S.mortarHit)award('shells');
    if(S.t>15&&(S.closeTime||0)/S.t>=.5)award('close50');if(S.t>20&&!S.wasClose)award('snipe');if(S.siege){award('siege');if(30-(S.sgT||0)<5)award('photo')}
    R.clean=S.hitsThisFort?0:(R.clean||0)+1;if(R.clean>=3)award('ghost');
    rec.facs=rec.facs||{};rec.facs[fac().id]=1;if(Object.keys(rec.facs).length>=6)award('xeno');
    rec.rides=rec.rides||{};rec.rides[R.veh]=1;if(Object.keys(rec.rides).length>=6)award('pilot');
    if(S.lv.boss){rec.mechs=rec.mechs||{};rec.mechs[S.mech]=1;if(Object.keys(rec.mechs).length>=3)award('mechs')}}
  if(ev==='fort'&&S.mods){if(S.mods.length>=2)award('cond2');if(S.mods.includes('twin'))award('twin')}
  if(R.lvl>=30)award('lvl30');if(R.relics.length>=6)award('relic6');
  if(S.L>=10)award('f10');if(S.L>=20)award('f20');
  const evos=EVO.filter(e=>lv_(e.id)).length;if(evos)award('evo');if(evos>=3)award('evo3');
  if(R.relics.some(id=>RELIC[id].x))award('exo');if(R.relics.some(id=>!RELIC[id].x&&has(id)===3))award('t3');
  if(R.coins>=40)award('hoard');if(R.coins>=100)award('hoard100');if(R.lvl>=50)award('lvl50');
  rec.biomes[biome().id]=1;if(Object.keys(rec.biomes).length>=6)award('world');
  if(rec.kills+R.kills>=10000)award('k10');
  mileCheck();
}
if(!META.cos)META.cos={paint:['ocean'],blob:['aqua'],trail:['spark']};
if(!META.sel)META.sel={paint:'ocean',blob:'aqua',trail:'spark'};
const cosSel=k2=>COS[k2].find(x=>x.id===META.sel[k2])||COS[k2][0];

