import IPC from '../utils/IPC';
import {BrowserWindow, app } from 'electron';
import fs from 'fs';
import Path from 'path';
import axios from 'axios';

type SaveMessage = {
    path: string;
    data: unknown;
}

type LoadMessage = {
    path: string;
}

type DownloadMessage = {
    path: string;
    url: string;
}

function realPath(path: string): string {
    return app.getPath('userData') + '/data/' + path;
}

async function handleDownload(mainWindow: BrowserWindow, event: Electron.IpcMainEvent, message: unknown) {
    const {path, url} = message as DownloadMessage;
    if (!path || !url) {
        mainWindow.webContents.send('savedFile', {
            path: path,
            success: false,
            error: 'No path & url received'
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
            url
        });
    });

    writer.on('error', (error) => {
        mainWindow.webContents.send('downloaded', {
            path: path,
            success: false,
            error: error,
            url
        });
    });
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
    validReceiveChannel: ['savedFile', 'loadedFile', 'downloaded'],
    validSendChannel: {
        'saveFile': handleSave,
        'loadFile': handleLoad,
        'download': handleDownload,
    }
});
