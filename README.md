# Celiox Timer App

A sleek, premium, and highly customizable desktop timer application built with Next.js, Electron, and React. Designed for maximum productivity, the Celiox Timer App provides a powerful toolset for tracking work sessions, managing repetitive tasks, and analyzing your time history.

## Features

- **Dual Modes:** Seamlessly switch between a traditional Countdown timer and an open-ended Stopwatch mode.
- **Dynamic Task Library:** Save repetitive tasks with pre-configured durations and default notes.
- **Sub-task Logging:** When loading a saved task, you can instantly append a specific "sub-task" note before starting the timer, allowing you to track exactly what you worked on.
- **Granular History:** Automatically saves your completed timer sessions. You can review your history in the sidebar and delete individual entries to keep your records clean.
- **Customizable Themes:** A built-in Settings tab allows you to completely customize the app's background, text, and button colors to match your aesthetic perfectly.
- **Always on Top:** A handy pin icon allows you to lock the timer to the top of your screen, ensuring it stays visible above all other windows while you work.
- **Fluid Sidebar Interface:** A beautiful, animated left-rail navigation sidebar that automatically minimizes when a timer is started so it stays out of your way.

## Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Desktop Wrapper:** Electron (via electron-builder)
- **UI & Styling:** React, Vanilla CSS, Lucide React (Icons)
- **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`)
- **Storage:** LocalStorage (Persistence for History, Tasks, and Themes)

## Installation

You can find the compiled Windows Installer (`.exe`) in the `dist/` directory after building.

1. Navigate to `dist/Celiox Timer App Setup 0.1.0.exe`.
2. Run the installer and follow the prompts.
3. Launch the application from your desktop or start menu.

## Development Setup

To run the application locally in development mode:

1. Clone the repository and navigate into the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs both Next.js and Electron):
   ```bash
   npm run dev
   ```

## Building for Production

To package the application into a standalone Windows executable (`.exe`):

1. Run the build command:
   ```bash
   npm run build
   ```
2. Wait for the compilation to finish. The output installer will be located in the `dist/` directory.

## Customization & Theming

The app uses an internal custom hook (`useTheme`) to manage DOM root variables dynamically. The default theme is a deep dark aesthetic (`#111111` background, `#ffffff` text, `#222222` buttons), but these can be reset or overridden in real-time from the Settings tab in the sidebar.

## Author

Developed by **CELIOX**.
