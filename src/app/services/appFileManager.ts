import type {Theme} from '../types/core';

const themePath = 'theme.json';

const pendingFiles: Map<string, {resolve, reject}> = new Map();

export async function download(url: string, path: string) {
    return new Promise((resolve, reject) => {
        globalThis.api.appFiles.send('download', {url, path});
        pendingFiles.set(url, {resolve, reject});
    });
}

export async function saveTheme(data: Theme) {
    return new Promise((resolve, reject) => {
        globalThis.api.appFiles.send('saveFile', {path:themePath, data});
        pendingFiles.set(themePath, {resolve, reject});
    });
}

export async function loadTheme(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        globalThis.api.appFiles.send('loadFile', {path:themePath});
        pendingFiles.set(themePath, {resolve, reject});
    });
}

globalThis.api.appFiles.receive('downloaded', (response) => {
    const { url, success, error } = response;
    if(!pendingFiles.has(url)) {
        return;
    }

    let func, message;
    if(success) {
        func = pendingFiles.get(url).resolve;
        message = 'OK';
    } else {
        func = pendingFiles.get(url).reject;
        message = error;
    }
    pendingFiles.delete(url);
    func(message);
});

globalThis.api.appFiles.receive('loadedFile', (response) => {
    const { path, success, data, error } = response;

    if(!pendingFiles.has(path)) {
        return;
    }

    let func, message;
    if(success) {
        func = pendingFiles.get(path).resolve;
        message = data;
    } else {
        func = pendingFiles.get(path).reject;
        message = error;
    }
    pendingFiles.delete(path);
    func(message);
});

globalThis.api.appFiles.receive('savedFile', (response) => {
    const { path, success, error } = response;

    if(!pendingFiles.has(path)) {
        return;
    }

    let func, message;
    if(success) {
        func = pendingFiles.get(path).resolve;
        message = 'OK';
    } else {
        func = pendingFiles.get(path).reject;
        message = error;
    }
    pendingFiles.delete(path);
    func(message);
});