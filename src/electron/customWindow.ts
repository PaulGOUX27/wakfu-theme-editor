import { app, ipcMain, BrowserWindow  } from 'electron';
import path from 'path';
import IPC from './IPC/utils/IPC';

const appName = 'Wakfu Theme Editor';

const defaultSettings = {
    title: appName,
    width: 1500,
    height: 900,
    show: false,
    // To check what is going on bellow
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        // enableRemoteModule: true
        preload: path.join(__dirname, 'preload.js')
    },
};

export class CustomWindow {
    window!: BrowserWindow;
    settings: Record<string, unknown>;

    constructor(settings: Record<string, unknown> = {}) {
        this.settings = settings ? {...defaultSettings, ...settings} : {...defaultSettings};
    }

    async createWindow(url: string) {
        app.name = appName;
        const window = new BrowserWindow(this.settings);

        await window.loadURL(url);
        window.once('ready-to-show', () => {
            window.show();
        });

        this.window = window;
        return window;
    }

    async setIpcMain(ipcs: IPC[]) {
        const promises: Promise<unknown>[] = [];
        ipcs.forEach((ipc: IPC) => promises.push(ipc.initIpcMain(ipcMain, this.window)));
        await Promise.all(promises);
    }
}