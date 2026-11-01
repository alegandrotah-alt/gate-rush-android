# Gate Rush for Android

This repository wraps the Gate Rush web game in a native Android app with [Capacitor](https://capacitorjs.com).
GitHub Actions builds an installable APK on every push to `main`.

## Getting the APK

On your phone, open this repository's **Releases** page (the latest release is at the top) and tap `GateRush-<number>.apk`.
Open the downloaded file and allow "Install unknown apps" when Android asks.

Every build is also attached to its run in the **Actions** tab as **gate-rush-apk** (a zip containing the APK).

Each build has a higher version number, so a new APK installs over the old one and keeps your saves.

## Play on iPhone, iPad or any browser

The same game is published as a web app with GitHub Pages: https://alegandrotah-alt.github.io/gate-rush-android/

On iPhone or iPad, open that link in **Safari**, tap **Share → Add to Home Screen**, then start it from the new icon.
It runs full screen, works offline after the first visit, and keeps saves on the device.
The **Publish web version** workflow updates it on every push to `main`.

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
