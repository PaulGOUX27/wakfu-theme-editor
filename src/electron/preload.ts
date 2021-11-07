import { contextBridge, ipcRenderer } from "electron";
import { Notification } from 'electron';
import { autoUpdater } from "electron-updater";

autoUpdater.checkForUpdates();

autoUpdater.on("update-available", () => {
    let notification = new Notification({
        title: "Svelte App",
        body: "Updates are available. Click to download.",
        silent: true,

    });
    notification.show();
    notification.on("click", () => {
        autoUpdater.downloadUpdate();
    });
});

autoUpdater.on("update-downloaded", () => {
    let notification = new Notification({
        title: "Svelte App",
        body: "The updates are ready. Click to quit and install.",
        silent: true,
    });
    notification.show();
    notification.on("click", () => {
        autoUpdater.quitAndInstall();
    });
});

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel: string, data: any) => {
            // whitelist channels
            let validChannels = ["toMain", "requestSystemInfo"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel: string, func: (arg0: any) => void) => {
            let validChannels = ["fromMain", "getSystemInfo"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                // @ts-ignore
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);