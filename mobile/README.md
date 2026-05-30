# Celiox Timer Mobile

The official mobile client for the Celiox Timer suite, built with **React Native** (CLI).
It provides a fully native Android and iOS experience with smooth modal sidebars and mobile-optimized touch controls.

## Tech Stack
- **Framework:** React Native 0.85
- **Icons:** Lucide React Native
- **Storage:** AsyncStorage (`@react-native-async-storage/async-storage`)

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Mode
Start the Metro Bundler and launch the app on an Android Emulator:
```bash
npm run android
```
*(For iOS, run `npm run ios` on a macOS machine).*

### 3. Build for Production (Android APK)
To generate a standalone `.apk` for release:
```bash
cd android
./gradlew assembleRelease
```
The compiled APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`
