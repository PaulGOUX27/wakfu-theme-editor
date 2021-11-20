import IPC from '../utils/IPC';
import {BrowserWindow, app } from 'electron';
import fs from 'fs';
import Path from 'path';
import axios from 'axios';

type BaseMessage = {
    id: string;
}

type SaveMessage = BaseMessage & {
    path: string;
    data: unknown;
}

type LoadMessage = BaseMessage & {
    path: string;
}

type DownloadMessage = BaseMessage & {
    path: string;
    url: string;
}

function realPath(path: string): string {
    return app.getPath('userData') + '/data/' + path;
}

async function handleDownload(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: unknown) {
    const {path, url, id} = message as DownloadMessage;
    if (!path || !url) {
        mainWindow.webContents.send('savedFile', {
            path: path,
            success: false,
            error: 'No path & url received',
            id
        });
    }

    const _realPath: string = realPath(path);
    const dir = Path.dirname(_realPath);

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    const res = await axios.get(url, { responseType: 'stream' });

    const writer = fs.createWriteStream(_realPath);

    res.data.pipe(writer);

    writer.on('finish', () => {
        mainWindow.webContents.send('downloaded', {
            path: path,
            success: true,
            url,
            id
        });
    });

    writer.on('error', (error) => {
        mainWindow.webContents.send('downloaded', {
            path: path,
            success: false,
            error: error,
            url,
            id
        });
    });
}

function handleSave(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: unknown) {
    const {data, id, path} = message as SaveMessage;

    if (!path) {
        mainWindow.webContents.send('savedFile', {
            path: path,
            success: false,
            error: 'No path received',
            id
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
                error: error,
                id
            });
        } else {
            mainWindow.webContents.send('savedFile', {
                path: path,
                success: true,
                id
            });
        }
    });
}

function handleLoad(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: unknown) {
    const {path, id} = message as LoadMessage;

    fs.readFile(realPath(path), (error, data) => {
        if (error) {
            mainWindow.webContents.send('loadedFile', {
                path: path,
                success: false,
                error: error,
                id
            });
        } else {
            mainWindow.webContents.send('loadedFile', {
                path: path,
                success: true,
                data,
                id
            });
        }
    });
}

export const appFiles = new IPC({
    nameAPI : 'appFiles',
    validReceiveChannel: ['savedFile', 'loadedFile', 'downloaded'],
    validSendChannel: {
        'saveFile': handleSave,
        'loadFile': handleLoad,
        'download': handleDownload,
    }
});
