import { app } from 'electron';
import path from 'path';
import {CustomWindow} from './customWindow';
import {IPCS} from './IPC/IPCs';

// eslint-disable-next-line
require('electron-reload')(__dirname)

app.on('ready', async () => {
  await createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

async function createMainWindow() {
  const mainWindow = new CustomWindow();
  const url = path.join(__dirname, 'www', 'index.html');
  await mainWindow.createWindow(url);

  await mainWindow.setIpcMain(IPCS);
}
