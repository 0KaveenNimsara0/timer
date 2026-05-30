# Celiox Timer Desktop

The official desktop client for the Celiox Timer suite, built with **Next.js**, **React**, and **Electron**. 
It offers a sleek, frameless, and draggable window optimized for productivity.

## Tech Stack
- **Framework:** Next.js (Static Export)
- **Desktop Wrapper:** Electron & Electron Builder
- **Icons:** Lucide React
- **Storage:** LocalStorage API

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Development Mode
Run the Next.js development server and the Electron wrapper concurrently:
```bash
npm run dev
```

### 3. Build for Production
Create a standalone `.exe` installer for Windows:
```bash
npm run build
```
The compiled installer will be located in the `/dist` folder.

## Troubleshooting
**Windows SmartScreen Warning:** When installing the `.exe` for the first time on a new PC, Windows may show a blue "Windows protected your PC" screen because the executable is not signed with an EV Code Signing Certificate. Click **"More info" -> "Run anyway"** to bypass this during development.
