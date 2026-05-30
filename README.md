# Celiox Timer App (Monorepo)

A beautifully designed, cross-platform productivity and task management suite. This repository is structured as a monorepo containing two distinct applications that share the same design language, assets, and core functionality:

1. **Desktop App** (Electron + Next.js)
2. **Mobile App** (React Native for Android/iOS)

## 🚀 Features
- ⏱ **Dual Timer Modes:** Seamlessly switch between a precise Countdown Timer and a standard Stopwatch.
- 📋 **Advanced Task Management:** Create tasks, attach detailed notes, and assign custom time limits using interactive Hr/Min/Sec unit pickers.
- 🕒 **Comprehensive History Tracking:** Automatically logs completed tasks and timer sessions, categorized by mode and timestamp, so you can track your productivity over time.
- 🎨 **Dynamic Theming System:** Switch between 5 pre-configured, instantly-applied color themes (Dark, Light, Ocean, Forest, Sunset) to match your workflow or mood.
- 💾 **Persistent Storage:** Saves all tasks, historical data, and user preferences locally (using LocalStorage for Desktop and AsyncStorage for Mobile) ensuring complete privacy.

## 🏗️ Architecture & Tech Stack

This project was built with a unified design philosophy across both platforms:

### Desktop Application (`/desktop`)
- **UI Framework:** Next.js (React) exported as a static site.
- **Native Wrapper:** Electron for system integration and window management.
- **Styling:** Custom CSS with a sleek, frameless, and draggable window optimized for desktop productivity.
- **Build Tools:** Electron Builder for generating standalone Windows `.exe` installers.

### Mobile Application (`/mobile`)
- **Framework:** React Native 0.85 (CLI).
- **Styling:** Custom StyleSheet leveraging React Native's Flexbox engine for responsive design.
- **Components:** Uses native `<Modal>` components for robust Android/iOS overlay rendering (e.g., Sidebars and Settings).
- **Build Tools:** Gradle (Android) / Xcode (iOS) for generating production `.apk` files.

## 📂 Project Structure
```text
timer_app/
├── desktop/                  # Electron + Next.js source code
│   ├── public/               # Desktop app icons and static assets
│   ├── src/                  # React components, hooks, and pages
│   ├── main.js               # Electron main process entry point
│   └── package.json          
├── mobile/                   # React Native source code
│   ├── android/              # Native Android project files
│   ├── ios/                  # Native iOS project files
│   ├── src/                  # React Native components, hooks, and screens
│   └── package.json          
└── README.md                 # Project overview (You are here)
```

## 🛠️ Getting Started
To get started with development, please refer to the dedicated README files inside each project directory for setup, development, and production build instructions:
- [👉 Desktop App Documentation](./desktop/README.md)
- [👉 Mobile App Documentation](./mobile/README.md)

---
*Designed & Developed by Celiox*
