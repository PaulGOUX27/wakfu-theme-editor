import IPC from '../utils/IPC';
import {BrowserWindow, app } from 'electron';
import fs from 'fs';
import Path from 'path';

type Message = {
    path: string;
    data: unknown;
}

function handle(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: unknown) {
    const {data} = message as Message;
    const {path} = message as Message;

    if (!path) {
        mainWindow.webContents.send('savedFile', {
            path: path,
            success: false,
            error: 'No path received'
        });
    }

    const realPath = app.getPath('userData') + '/' + path;
    const dir = Path.dirname(path);

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(realPath, JSON.stringify(data), function (error) {
        if (error) {
            mainWindow.webContents.send('savedFile', {
                path: path,
                success: false,
                error: error
            });
        } else {
            mainWindow.webContents.send('savedFile', {
                path: path,
                success: true,
            });
        }
    });
}

export const appFiles = new IPC({
    nameAPI : 'appFiles',
    validReceiveChannel: ['savedFile'],
    validSendChannel: {
        'saveFile': handle
    }
});
