import IPC from '../utils/IPC';
import {BrowserWindow} from 'electron';

function handle(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: unknown) {
    mainWindow.webContents.send('getSystemInfos', {
        chrome: process.versions.chrome,
        node: process.versions.node,
        electron: process.versions.electron
    });
}

export const systemInfos = new IPC({
    nameAPI : 'systemInfos',
    validReceiveChannel: ['getSystemInfos'],
    validSendChannel: {
        'requestSystemInfos': handle
    }
});
