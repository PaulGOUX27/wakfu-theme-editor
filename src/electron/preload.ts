import {generateContextBridge} from './IPC/utils/contextBridge';

import {IPCS} from './IPC/IPCs';

generateContextBridge(IPCS);

/* import { contextBridge, ipcRenderer, Notification } from 'electron';

import { autoUpdater } from 'electron-updater';

autoUpdater.checkForUpdates();

autoUpdater.on('update-available', () => {
  const notification = new Notification({
    title: 'Svelte App',
    body: 'Updates are available. Click to download.',
    silent: true,
  });
  notification.show();
  notification.on('click', () => {
    autoUpdater.downloadUpdate();
  });
});

autoUpdater.on('update-downloaded', () => {
  const notification = new Notification({
    title: 'Svelte App',
    body: 'The updates are ready. Click to quit and install.',
    silent: true,
  });
  notification.show();
  notification.on('click', () => {
    autoUpdater.quitAndInstall();
  });
});

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  // eslint-disable-next-line
  send: (channel: string, data: any) => {
    // whitelist channels
    const validChannels = ['toMain', 'requestSystemInfo'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  // eslint-disable-next-line
  receive: (channel: string, func: (arg0: any) => void) => {
    const validChannels = ['fromMain', 'getSystemInfo'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      // eslint-disable-next-line
      // @ts-ignore
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
 */
