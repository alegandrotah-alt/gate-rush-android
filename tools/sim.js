#!/usr/bin/env node
// Headless balance simulation: plays full runs with a simple bot, no browser needed.
// Every run is seeded, so the same game code always gives the same numbers.
//   node tools/sim.js               4 runs per ride, prints a table, fails on crashes or a broken first keep
//   node tools/sim.js --runs 10 --rides jet,tank
const fs = require('fs');
const vm = require('vm');
const { buildFragment } = require('./build.js');

const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const RUNS = +arg('runs', 4);
const RIDES = arg('rides', 'cannon,jet,tank,saucer,hive,robot').split(',');
const MAX_MIN = +arg('minutes', 14);
const ALLSEC = { ghost: 1, abyss: 1, prism: 1, speed: 1, ascetic: 1, edge: 1, sovereign: 1 };

const frag = buildFragment();
let src = frag.slice(frag.indexOf('<script>') + 8, frag.lastIndexOf('</script>'));
src = src.replace(/\}\)\(\);\s*$/, 'globalThis.G={update,begin,openPick,get S(){return S},get R(){return R},takePick,get pickSet(){return pickSet},get SH(){return SH},relicPrice,nextFort,restat,buyRelic,has:(id)=>R.rt[id]||0};})();');
const script = new vm.Script(src, { filename: 'game.js' });

function mulberry(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const noop = () => {};
const fake = () => new Proxy(function () {}, { get: (t, p) => p === 'getContext' ? () => fake() : p === 'style' ? { setProperty: noop } : p === 'classList' ? { add: noop, remove: noop, toggle: noop, contains: () => false } : p === 'dataset' ? {} : p === 'clientWidth' ? 400 : p === 'clientHeight' ? 800 : p === 'getBoundingClientRect' ? () => ({ left: 0, top: 0, width: 400, height: 800 }) : (p === 'createLinearGradient' || p === 'createRadialGradient') ? () => ({ addColorStop: noop }) : p === 'firstChild' ? null : p === 'querySelectorAll' ? () => [] : p === 'querySelector' ? () => null : noop, set: () => true, apply: () => fake() });

function runOnce(veh, seed, secrets, give) {
  const rand = mulberry(seed);
  const math = Object.create(Math); math.random = rand;
  let pending = [];
  const ctx = {
    Math: math, console, JSON, Object, Array, Number, String, Date, Promise, Map, Set, WeakMap, Proxy, Reflect, Error, isFinite, parseFloat, parseInt, Uint8Array, Float32Array,
    document: { getElementById: () => fake(), createElement: () => fake(), addEventListener: noop, querySelectorAll: () => [], querySelector: () => fake(), body: fake() },
    window: { addEventListener: noop, devicePixelRatio: 1, matchMedia: () => ({ matches: false }) },
    navigator: {}, location: { search: '' },
    localStorage: { getItem: (k) => k === 'gaterush-meta2' ? JSON.stringify({ gems: 0, best: 0, shop: {}, veh, tut: 1, rec: { runs: 5, kills: 0, forts: 0, bestHit: 0, bestLvl: 0, biomes: {} }, guide: {}, secret: secrets ? ALLSEC : {} }) : null, setItem: noop, removeItem: noop },
    performance: { now: () => 0 }, requestAnimationFrame: noop, setTimeout: (f) => { pending.push(f); return 0; }, clearTimeout: noop, setInterval: noop,
    Image: undefined, addEventListener: noop,
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  script.runInContext(ctx);
  const g = ctx.G; g.begin();
  if (give) { Object.assign(g.R.ups, give); g.restat(); }
  let t = 0; const keeps = []; let died = null, err = null;
  try {
    for (let step = 0; step < 60 * 60 * MAX_MIN; step++) {
      const s = g.S, r = g.R;
      if (pending.length) { const p = pending; pending = []; p.forEach((f) => f()); continue; }
      if (r.pendingPicks > 0 && !r.picking && !s.over && s.running) { g.openPick('Level up!'); continue; }
      if (r.picking) { const c = g.pickSet; const own = c.filter((x) => (r.ups[x.id] || 0) > 0); const pick = c.find((x) => x.evo) || c.find((x) => x.cat === 'lim') || own.sort((a, b) => (r.ups[b.id] || 0) - (r.ups[a.id] || 0))[0] || c[(rand() * c.length) | 0]; g.takePick(pick); continue; }
      if (s.over) {
        if (s.cannon.hp <= 0) { died = s.L; break; }
        keeps.push({ L: s.L, t: Math.round(s.t), hp: Math.round(100 * (s.minhp ?? 1)) });
        const SH = g.SH, cards = SH.cards.map((c, i) => ({ c, i })).filter((o) => !SH.sold.includes(o.i));
        for (const o of cards) { const p = g.relicPrice(o.c), own = g.has(o.c.id); if (r.coins >= p && (own ? own < o.c.t : r.relics.length < r.slots)) { r.coins -= p; g.buyRelic(o.c); SH.sold.push(o.i); } }
        g.nextFort(); continue;
      }
      // bot: dodge nearby threats, otherwise line up with the most valuable × gate
      const c = s.cannon; let fx = 0, fy = 0;
      for (const b of s.bul) { const dx = c.x - b.x, dy = c.y - b.y, d = Math.hypot(dx, dy); if (d < 70) { fx += dx / d * (70 - d); fy += dy / d * (70 - d); } }
      for (const l of s.lasers) if (Math.abs(l.x - c.x) < 40) fx += (c.x >= l.x ? 1 : -1) * 60;
      for (const a of s.arts) { const d = Math.hypot(c.x - a.x, c.y - a.y); if (d < 45 && a.t > a.dur * .4) { fx += (c.x - a.x) / (d + 1) * 60; fy += (c.y - a.y) / (d + 1) * 60; } }
      if (fx || fy) { c.tx = c.x + fx * 1.5; c.ty = c.y + fy * 1.5; }
      else {
        c.tx = 200 + 90 * Math.sin(t * .5); let best = null, bv = 0;
        for (const gg of s.lv.gates) { if (gg.dead || gg.t !== 'mul' || gg.own < 0 || gg.follow) continue; const o = gg.amp ? Math.sin(s.t * gg.spd + gg.ph) * gg.amp : 0; const v = gg.v / (1 + Math.abs(gg.y - c.y) / 400); if (v > bv) { bv = v; best = (gg.x1 + gg.x2) / 2 + o; } }
        if (best != null) c.tx = best + 15 * Math.sin(t * 3); c.ty = 600;
      }
      if (c.charge >= 1) c.charge = 0;
      g.update(1 / 60); t += 1 / 60; s.minhp = Math.min(s.minhp ?? 1, c.hp / s.st.maxHp);
    }
  } catch (e) { err = e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : String(e); }
  return { veh, seed, secrets: !!secrets, give: !!give, cleared: keeps.length, died, keeps, err, level: g.R.lvl };
}

const results = [];
const t0 = Date.now();
// odd-numbered runs have every secret unlocked, so secret weapons and perks show up in the bot's picks
for (const veh of RIDES) for (let i = 0; i < RUNS; i++) results.push(runOnce(veh, 1000 + i * 7919 + veh.length * 31, i % 2 === 1));
// crash test: one run with the whole secret arsenal forced in at full power
const ARSENAL = { blade: 5, riftcut: 1, vortex: 5, horizon: 1, prism: 5, spectrum: 1, overdrive: 3, phase: 3, gatelord: 3, gravity: 3, channel: 3 };
const arsenal = runOnce('jet', 4242, true, ARSENAL);
const secs = ((Date.now() - t0) / 1000).toFixed(1);

const rows = RIDES.map((v) => {
  const rs = results.filter((r) => r.veh === v), c = rs.map((r) => r.cleared).sort((a, b) => a - b);
  return { v, avg: (c.reduce((a, b) => a + b, 0) / c.length).toFixed(1), med: c[c.length >> 1], max: c[c.length - 1], k1: rs.filter((r) => r.cleared >= 1).length, n: rs.length, errs: rs.filter((r) => r.err).length };
});
const errors = results.concat([arsenal]).filter((r) => r.err);
const k1 = results.filter((r) => r.cleared >= 1).length / results.length;
let md = `### Balance simulation\n${results.length} seeded bot runs in ${secs}s (bot steers toward × gates and dodges bullets; it plays worse than a person).\n\n| Ride | Avg keeps cleared | Median | Best | Cleared keep 1 | Crashes |\n|---|---|---|---|---|---|\n`;
for (const r of rows) md += `| ${r.v} | ${r.avg} | ${r.med} | ${r.max} | ${r.k1}/${r.n} | ${r.errs} |\n`;
md += `\nSecret arsenal crash test (every secret weapon and perk, maxed): ${arsenal.err ? '**crashed**' : `ran clean, cleared ${arsenal.cleared} keeps`}.\n`;
const fails = [];
if (errors.length) fails.push(`${errors.length} run(s) crashed: ${errors[0].veh} seed ${errors[0].seed}: ${errors[0].err}`);
if (k1 < .5) fails.push(`only ${(k1 * 100).toFixed(0)}% of runs cleared keep 1 (expected at least 50%)`);
md += fails.length ? `\n**Failed:** ${fails.join('; ')}\n` : `\nAll checks passed.\n`;
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
if (process.argv.includes('--json')) fs.writeFileSync('sim-results.json', JSON.stringify(results, null, 1));
process.exit(fails.length ? 1 : 0);
