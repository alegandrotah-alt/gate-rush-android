# Gate Rush: notes for working on this repo

- Edit the game in `src/`, never `www/index.html` (it's generated). `node tools/build.js` assembles it.
- `src/game/*.js` files are concatenated in name order into one script inside one IIFE; they share one scope, so order matters for top-level `const`s.
- Before pushing, run `node tools/build.js && node tools/sim.js --runs 2`; CI also runs `tools/browser-check.js`.
- Sim and browser check load the game with fake or headless DOMs: guard DOM-only code (`querySelector`, `classList.contains`) so it degrades instead of throwing.
- 3D sprite sheets in `www/gfx3d/` are rendered offline from CC0 models; the game falls back to drawn sprites while they load.
- Pushing to `main` releases: Android APK on Releases (version = run number) and the web version on GitHub Pages.
