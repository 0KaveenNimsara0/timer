const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve');
const path = require('path');
const isDev = require('electron-is-dev');

const appServe = app.isPackaged ? serve({ directory: path.join(__dirname, 'out') }) : null;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 400,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hidden',
    autoHideMenuBar: true,
    alwaysOnTop: false,
    resizable: true,
  });

  if (isDev) {
    win.loadURL('http://localhost:3005');
  } else {
    appServe(win).then(() => {
      win.loadURL('app://-');
    });
  }

  const { ipcMain } = require('electron');
  
  ipcMain.on('toggle-always-on-top', () => {
    const isAlwaysOnTop = win.isAlwaysOnTop();
    win.setAlwaysOnTop(!isAlwaysOnTop);
  });

  ipcMain.on('minimize-window', () => {
    win.minimize();
  });

  ipcMain.on('maximize-window', () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  });

  ipcMain.on('close-window', () => {
    win.close();
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
