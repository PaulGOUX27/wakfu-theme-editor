import type {Theme} from '../types/core';

const themePath = 'theme.json';

const pendingFiles: Map<string, {resolve, reject}> = new Map();

export async function download(url: string, path: string) {
    return new Promise((resolve, reject) => {
        globalThis.api.appFiles.send('download', {url, path, id: path});
        pendingFiles.set(url, {resolve, reject});
    });
}

export async function saveTheme(data: Theme) {
    return new Promise((resolve, reject) => {
        globalThis.api.appFiles.send('saveFile', {path:themePath, data, id: themePath});
        pendingFiles.set(themePath, {resolve, reject});
    });
}

export async function loadTheme(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        globalThis.api.appFiles.send('loadFile', {path:themePath, id: themePath});
        pendingFiles.set(themePath, {resolve, reject});
    });
}


// Handle IPC Response
['downloaded', 'loadedFile','savedFile'].forEach(key => {
    globalThis.api.appFiles.receive(key, (response) => {
        const { success, data, error, id } = response;

        if(!pendingFiles.has(id)) {
            // TODO add log error as it shouldn't occur
            return;
        }
        let func, message;
        if(success) {
            func = pendingFiles.get(id).resolve;
            message = data;
        } else {
            func = pendingFiles.get(id).reject;
            message = error;
        }
        pendingFiles.delete(id);
        func(message);
    });
});
