import { app, BrowserWindow } from 'electron';
import path from 'path';

// eslint-disable-next-line
require('electron-reload')(__dirname)

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      // enableRemoteModule: true
    },
  });
  mainWindow.loadURL(path.join(__dirname, 'www', 'index.html'));
};

app.on('ready', () => {
  app.name = 'Svelte Template';
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
