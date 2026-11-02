#!/usr/bin/env node
// Browser check: loads the built game in headless Chromium on a phone-sized screen, plays a little,
// fails on any script error, and measures frame times with the CPU slowed down like a budget phone.
//   node tools/build.js && node tools/browser-check.js
// Note: CI machines have no GPU, so absolute frame rates are far lower than on a real phone.
// Watch the trend between builds rather than the raw number.
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('playwright');

const WWW = path.resolve(__dirname, '..', 'www');
const OUT = path.resolve(__dirname, '..', 'check-output');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.css': 'text/css', '.woff2': 'font/woff2' };

function serve() {
  return new Promise((res) => {
    const srv = http.createServer((req, rsp) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(WWW, p);
      if (!f.startsWith(WWW) || !fs.existsSync(f)) { rsp.writeHead(404); rsp.end(); return; }
      rsp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rsp);
    }).listen(0, '127.0.0.1', () => res(srv));
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = await serve();
  const url = `http://127.0.0.1:${srv.address().port}/?debug`;
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH, args: ['--no-sandbox'] } : {});
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 400, height: 820 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push('page error: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::/.test(m.text())) errors.push('console: ' + m.text()); });

  // 1. first launch: menu, then the tutorial run
  await page.goto(url); await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(OUT, '1-menu.png') });
  await page.click('#play'); await page.waitForTimeout(4500);
  await page.mouse.move(200, 640); await page.mouse.down();
  for (let i = 0; i < 30; i++) { await page.mouse.move(200 + 100 * Math.sin(i / 4), 640); await page.waitForTimeout(100); }
  await page.mouse.up();
  await page.screenshot({ path: path.join(OUT, '2-tutorial.png') });
  const tut = await page.evaluate(() => !document.getElementById('coach').hidden);

  // 2. a busy late keep with elites, CPU slowed 4x, frame times measured
  await page.evaluate(() => { const G = window.__GR; G.startFort(7, false); G.S.running = true; G.S.cannon.inv = 9999; });
  await page.waitForTimeout(4000);
  await page.evaluate(() => { window.__GR.spawnElite('hive'); window.__GR.spawnElite('jet'); });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => { window.__ft = []; const f = (t) => { window.__ft.push(t); if (window.__ft.length < 20000) requestAnimationFrame(f); }; requestAnimationFrame(f); });
  for (let i = 0; i < 40; i++) { await page.mouse.move(200 + 120 * Math.sin(i / 4), 640); await page.waitForTimeout(200); if (i % 10 === 0) await page.evaluate(() => { window.__GR.S.cannon.inv = 9999; }); }
  const ft = await page.evaluate(() => window.__ft);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await page.screenshot({ path: path.join(OUT, '3-busy-keep.png') });
  const busy = await page.evaluate(() => ({ enemies: window.__GR.S.enemies.length, shots: window.__GR.S.players.length }));
  await browser.close(); srv.close();

  const d = ft.slice(1).map((t, i) => t - ft[i]).sort((a, b) => a - b);
  const avg = d.reduce((a, b) => a + b, 0) / Math.max(1, d.length), p95 = d[Math.floor(d.length * .95)] || 0;
  let md = `### Browser check\n- Script errors: ${errors.length ? '**' + errors.length + '**' : 'none'}\n- Tutorial shown on first run: ${tut ? 'yes' : '**no**'}\n` +
    `- Busy keep (${busy.enemies} enemies, ${busy.shots} shot groups), CPU slowed 4×, phone screen at 2× density: **${(1000 / avg).toFixed(0)} FPS** average, ${p95.toFixed(0)} ms 95th-percentile frame\n` +
    `  (CI has no GPU, so real phones run far faster; compare this number between builds)\n- Screenshots are attached to the run as **browser-check-screens**.\n`;
  if (errors.length) md += '\n```\n' + errors.slice(0, 10).join('\n') + '\n```\n';
  console.log(md);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + '\n');
  process.exit(errors.length || !tut ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
