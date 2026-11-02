// ---------- level-up upgrades ----------
// Weapons do the killing (4 slots). Perks change how your weapons and your ride behave (4 slots).
// Boosts are plain stat upgrades and take no slot. Each weapon has two synergy perks:
// max the weapon and either of its synergy perks to evolve it into a game changer.
const UP=[
  {id:'orbit',kind:'w',name:'Spinning Saws',ic:'✲',cat:'wpn',max:5,syn:['gravity','wing'],d:l=>l===0?'Saws circle you, shredding mobs and cutting plain bullets':'+1 saw, more damage'},
  {id:'zap',kind:'w',name:'Storm Rod',ic:'↯',cat:'wpn',max:5,syn:['echo','volatile'],d:l=>l===0?'Lightning strikes the closest enemy and chains':'Strikes faster and chains further'},
  {id:'bomb',kind:'w',name:'Mortar',ic:'◉',cat:'wpn',max:5,syn:['volatile','kami'],d:l=>l===0?'Lobs a bomb at the thickest crowd':'Bigger, more frequent blasts'},
  {id:'missile',kind:'w',name:'Homing Missiles',ic:'➶',cat:'wpn',max:5,syn:['ricochet','channel'],d:l=>l===0?'Fires missiles that seek enemies':'+1 missile per volley, more damage'},
  {id:'laser',kind:'w',name:'Laser',ic:'│',cat:'wpn',max:5,syn:['channel','cryo'],d:l=>l===0?'A beam straight ahead burns anything in line':'Wider, hotter beam'},
  {id:'flame',kind:'w',name:'Flamethrower',ic:'∴',cat:'wpn',max:5,syn:['gravity','burn'],d:l=>l===0?'Short cone of fire in front of you':'Longer reach, more burn'},
  {id:'shield',kind:'w',name:'Guardian Orbs',ic:'○',cat:'wpn',max:5,syn:['absorb','cryo'],d:l=>l===0?'Orbs circle you, deleting plain bullets and burning what they touch':'+1 orb'},
  {id:'drones',kind:'w',name:'Drones',ic:'◇',cat:'wpn',max:5,syn:['wing','kami'],d:l=>l===0?'A drone flies with you and fires its own blobs':'+1 drone, faster fire'},
  {id:'boomer',kind:'w',name:'Boomerang',ic:'⟲',cat:'wpn',max:5,syn:['ricochet','hair'],d:l=>l===0?'Throws a boomerang that cuts through everything, out and back':'+1 boomerang, more damage'},
  {id:'mines',kind:'w',name:'Mine Layer',ic:'✷',cat:'wpn',max:5,syn:['volatile','burn'],d:l=>l===0?'Drops mines where you fly. They blow when enemies step close':'Faster laying, bigger blasts'},
  {id:'rail',kind:'w',name:'Railgun',ic:'⇡',cat:'wpn',max:5,syn:['channel','hair'],d:l=>l===0?'Charges, then fires a piercing line all the way to the fort':'Faster charge, more damage'},
  {id:'tesla',kind:'w',name:'Tesla Coil',ic:'ϟ',cat:'wpn',max:5,syn:['absorb','echo'],d:l=>l===0?'Pulses lightning around you and fries plain bullets':'Wider, faster pulses'},
  {id:'sentry',kind:'w',name:'Sentry Turret',ic:'▲',cat:'wpn',max:5,syn:['hair','absorb'],d:l=>l===0?'Deploys a turret where you fly. It shoots the nearest enemy (or the keep, if planted close), soaks plain bullets and lasts 12s':'+1 turret, faster deploys, more damage'},
  // perks: change how things play
  {id:'wing',kind:'p',name:'Wingmen',ic:'⋈',cat:'perk',max:3,d:l=>`${l+2} escort drones fly with you, each running a copy of every weapon you own at ${30+10*(l+1)}% damage.`},
  {id:'kami',kind:'p',name:'Kamikaze',ic:'☄',cat:'perk',max:3,d:l=>`Every ${[6,4.5,3][l]}s a suicide drone dives into the thickest crowd, or the fort if it's clear. Hits harder for every weapon you own.`},
  {id:'echo',kind:'p',name:'Echo',ic:'))',cat:'perk',max:3,d:l=>`Weapon shots, strikes and pulses have a ${[25,40,55][l]}% chance to fire a second time.`},
  {id:'hair',kind:'p',name:'Hair Trigger',ic:'⌁',cat:'perk',max:3,d:l=>`Weapons recharge ${[20,40,60][l]}% faster and steady weapons burn ${[15,30,45][l]}% hotter.`},
  {id:'ricochet',kind:'p',name:'Ricochet',ic:'⤳',cat:'perk',max:3,d:l=>`Missiles split into ${l+1} more on impact, boomerangs throw ${l+1} extra, railgun fires ${l+1} angled shots.`},
  {id:'channel',kind:'p',name:'Gate Channel',ic:'×»',cat:'perk',max:3,d:l=>`Missiles, boomerangs, railgun shots and lasers pick up ${['half','three-quarters of','all of'][l]} the × gate multipliers they pass through.`},
  {id:'gravity',kind:'p',name:'Gravity Well',ic:'@',cat:'perk',max:3,d:l=>`Drags enemies within ${110+30*l} toward you. Saws and flames deal +${20*(l+1)}% damage. Risky.`},
  {id:'absorb',kind:'p',name:'Absorber',ic:'⊛',cat:'perk',max:3,d:l=>`Every enemy bullet your weapons destroy charges the Big One and adds ${l+1} Rage.`},
  {id:'volatile',kind:'p',name:'Volatile',ic:'✺',cat:'perk',max:3,d:l=>`Enemies your weapons kill explode for ${[25,40,60][l]}% of their weight. Explosions can chain.`},
  {id:'cryo',kind:'p',name:'Cryo',ic:'❄',cat:'perk',max:3,d:l=>`Weapon hits slow enemies ${[30,45,60][l]}%. Orbs, Tesla and lasers freeze plain bullets in place.`},
  {id:'burn',kind:'p',name:'Afterburn',ic:'≋',cat:'perk',max:3,d:l=>`Flying leaves a fire trail that burns enemies and plain bullets for ${[1.5,2,2.5][l]}s. Mine Layer drops mines along it.`},
  // boosts: stats, no slot
  {id:'rapid',kind:'b',name:'Rapid Fire',ic:'»',cat:'can',max:5,d:l=>'+15% fire rate'},
  {id:'twin',kind:'b',name:'Extra Barrel',ic:'‖',cat:'can',max:3,d:l=>'+1 blob per shot'},
  {id:'might',kind:'b',name:'Heavy Blobs',ic:'●',cat:'can',max:5,d:l=>'+25% blob weight'},
  {id:'power',kind:'b',name:'Overclock',ic:'%',cat:'can',max:10,d:l=>'+15% damage for blobs and weapons'},
  {id:'amp',kind:'b',name:'Gate Amplifier',ic:'×+',cat:'gate',max:3,d:l=>'Every × gate multiplies by 1 more'},
  {id:'mirror',kind:'b',name:'Pocket Gate',ic:'[×]',cat:'gate',max:5,d:l=>l===0?'A ×2 gate rides just in front of you':'Pocket gate gets wider and stronger'},
  {id:'breaker',kind:'b',name:'Shield Breaker',ic:'//',cat:'gate',max:3,d:l=>'Blobs smash red shields twice as hard'},
  {id:'tough',kind:'b',name:'Thick Skin',ic:'◆',cat:'can',max:4,d:l=>'Blobs hit enemies 25% harder'},
  {id:'armor',kind:'b',name:'Armor Plating',ic:'▣',cat:'def',max:3,d:l=>'+1 shield pip that blocks a whole hit. Pips recharge every 12s.'},
  {id:'regen',kind:'b',name:'Repair Bots',ic:'+',cat:'def',max:5,d:l=>'After 5s without a hit, repair 1.2% HP per second'},
  {id:'vamp',kind:'b',name:'Bloodsucker',ic:'♥',cat:'def',max:5,d:l=>'Each enemy crushed repairs 0.1% HP'},
  {id:'berserk',kind:'b',name:'Berserker',ic:'≫',cat:'can',max:3,d:l=>'+40 Rage cap. Close-range kills build Rage: +2.5% close-range damage and +1.25% to everything per stack.'},
  {id:'charge',kind:'b',name:'Overcharge',ic:'!',cat:'can',max:3,d:l=>'Big One charges 40% faster and hits harder'},
  {id:'thrust',kind:'b',name:'Thrusters',ic:'⇶',cat:'can',max:5,d:l=>'+12% movement speed'},
  {id:'siphon',kind:'b',name:'Blood Siphon',ic:'♥»',cat:'def',max:3,d:l=>'Close range: close-range weapon kills repair you, ignoring the repair cap (up to 2% HP per second per level)'},
  {id:'guard',kind:'b',name:'Close Guard',ic:'◈',cat:'def',max:2,d:l=>'Close range: take 12% less damage'},
];
const EVO=[
  {id:'sawstorm',w:'orbit',name:'Saw Storm',ic:'✲✲',d:'Saws launch nonstop in a fan. Launched saws ride your × gates like blobs, multiplying, and carve the fort.'},
  {id:'thunder',w:'zap',name:'Thunder Gate',ic:'↯×',d:'Every bolt arcs through your three strongest × gates into the fort, multiplied by all three.'},
  {id:'carpet',w:'bomb',name:'Carpet Bomb',ic:'◉◉',d:'Four bombs a volley. Everything a blast crushes is reborn as one of your blobs, carrying half the weight it had.'},
  {id:'swarm',w:'missile',name:'Missile Swarm',ic:'➶➶',d:'Triple missiles. Half of them skip the horde, fly through your × gates multiplying, and slam the fort.'},
  {id:'deathray',w:'laser',name:'Death Ray',ic:'┃',d:'The beam multiplies by every × gate it passes through, erases bullets, and burns the fort.'},
  {id:'inferno',w:'flame',name:'Inferno',ic:'∴∴',d:'Rage never fades. Double reach, melts every bullet in the cone, and burns the fort 3× harder.'},
  {id:'aegis',w:'shield',name:'Aegis',ic:'◎',d:'+3 big orbs. Every bullet they touch, outlined or not, is fired back as a heavy blob. Every 10 caught restores a pip.'},
  {id:'hivemind',w:'drones',name:'Hivemind',ic:'◇◇',d:'+3 drones, and every drone copies your full volley at full weight.'},
  {id:'glaive',w:'boomer',name:'Orbital Glaives',ic:'⟲⟲',d:'Three huge glaives orbit the fort itself, shredding it and anything nearby nonstop.'},
  {id:'minefield',w:'mines',name:'Minefield',ic:'✷✷',d:'Mines rain across the whole road. Blasts chain into nearby mines, each link hitting 25% harder, and leave saw traps.'},
  {id:'massdriver',w:'rail',name:'Mass Driver',ic:'⇡⇡',d:'Fires every 1.2s. The shot multiplies by every × gate in its line and hits the fort with all of it.'},
  {id:'reactor',w:'tesla',name:'Arc Reactor',ic:'ϟ@',d:'Pulses twice as wide, twice as often, and erase every bullet in range, outlined ones too.'},
  {id:'fortress',w:'sentry',name:'Fortress Protocol',ic:'▲▲',d:'Turrets stay until the keep falls, deploy every 3s up to 8, take twice the hits and fire double shots twice as fast.'},
];
// late-game limit breaks: one of each, offered once you're strong
const LIM=[
  {id:'btime',name:'Bullet Time',ic:'⧗',d:'Enemy bullets move 30% slower.'},
  {id:'wind',name:'Second Wind',ic:'↺',d:'Once per run, survive a killing blow and repair to 40%.'},
  {id:'graze',name:'Graze',ic:'≈',d:'Bullets that barely miss you charge the Big One and add +3% damage for 3s, up to +120%.'},
  {id:'gatekeeper',name:'Gatekeeper',ic:'×2',d:'Every × gate multiplies by 2 more.'},
  {id:'doubleevo',name:'Double Evolution',ic:'⇈',d:'Evolved weapons deal double damage.'},
  {id:'hull',name:'Iron Hull',ic:'▦',d:'Take 35% less damage from everything.'},
  {id:'pointblank',name:'Point Blank',ic:'⊕',d:'Saws, flames and orbs deal 3× damage and reach 50% further.'},
  {id:'overkill',name:'Overkill',ic:'%%',d:'Overclock can now go to level 20.'},
];
const CATC={can:'#8fe7ff',gate:'#d6b0ff',wpn:'#ffe27a',def:'#9df0bf',perk:'#ffc2e0',evo:'#ff9aa8',lim:'#ffb35c'};
const UPNAME={};UP.forEach(u=>UPNAME[u.id]=u);EVO.forEach(e=>{e.ps=UPNAME[e.w].syn;UPNAME[e.id]=Object.assign({cat:'evo'},e)});LIM.forEach(e=>UPNAME[e.id]=Object.assign({cat:'lim',max:1},e));

