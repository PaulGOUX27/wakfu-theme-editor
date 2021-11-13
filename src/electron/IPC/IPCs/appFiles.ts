import IPC from '../utils/IPC';
import {BrowserWindow, app } from 'electron';
import fs from 'fs';
import Path from 'path';

type SaveMessage = {
    path: string;
    data: unknown;
}

type LoadMessage = {
    path: string;
}

function realPath(path: string): string {
    return app.getPath('userData') + '/' + path;
}

function handleSave(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: unknown) {
    const {data} = message as SaveMessage;
    const {path} = message as SaveMessage;

    if (!path) {
        mainWindow.webContents.send('savedFile', {
            path: path,
            success: false,
            error: 'No path received'
        });
    }

    const _realPath: string = realPath(path);
    const dir = Path.dirname(_realPath);

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(_realPath, JSON.stringify(data), function (error) {
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

function handleLoad(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: unknown) {
    const {path} = message as LoadMessage;

    fs.readFile(realPath(path), (error, data) => {
        if (error) {
            mainWindow.webContents.send('loadedFile', {
                path: path,
                success: false,
                error: error
            });
        } else {
            mainWindow.webContents.send('loadedFile', {
                path: path,
                success: true,
                data
            });
        }
    });
}

export const appFiles = new IPC({
    nameAPI : 'appFiles',
    validReceiveChannel: ['savedFile', 'loadedFile'],
    validSendChannel: {
        'saveFile': handleSave,
        'loadFile': handleLoad,
    }
});
