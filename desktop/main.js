const { app, BrowserWindow } = require('electron');
const serve = require('electron-serve').default || require('electron-serve');
const path = require('path');
const isDev = !app.isPackaged;

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
    icon: path.join(__dirname, 'public', 'timer_logo.png'),
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

  ipcMain.on('toggle-fullscreen', () => {
    win.setFullScreen(!win.isFullScreen());
  });

  ipcMain.on('exit-fullscreen', () => {
    win.setFullScreen(false);
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
