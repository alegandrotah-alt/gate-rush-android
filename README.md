# Gate Rush for Android

This repository wraps the Gate Rush web game in a native Android app with [Capacitor](https://capacitorjs.com).
GitHub Actions builds an installable APK on every push to `main`.

## Getting the APK

1. Open the **Actions** tab and click the latest **Build Android APK** run.
2. When it has a green tick, download **gate-rush-apk** under *Artifacts* and unzip it.
3. Copy `GateRush-<number>.apk` to your phone and open it. Allow "Install unknown apps" for the app you opened it with when Android asks.

Each build has a higher version number, so a new APK installs over the old one and keeps your saves.

## What's inside

- `www/` is the game: `index.html` plus the pre-rendered 3D sprite sheets in `www/gfx3d/`.
- `art/` holds the launcher icon, adaptive-icon foreground and splash artwork.
- `tools/fetch_fonts.py` bundles the game's fonts so it plays offline.
- `tools/android_setup.py` sets the icons and splash, locks portrait, hides the system bars and keeps the screen on.
- `.github/workflows/build-apk.yml` is the build.

The `android/` folder is generated during the build and is not committed.

## Building locally (optional)

Needs Node 20+, JDK 21, the Android SDK and Python with Pillow.

```
npm install
python3 tools/fetch_fonts.py
npm run setup:android
cd android && ./gradlew assembleDebug
```

## Credits

3D models: Kenney Space Kit and Tower Defense Kit (kenney.nl), KayKit Space Base, Space Ranger and Combat Mech by Kay Lousberg (kaylousberg.com). Particles and sounds by Kenney. All CC0.
