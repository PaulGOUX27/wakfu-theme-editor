import type {Theme} from '../types/core';

const baseDir = '/data/';
const pendingFiles: Map<string, {resolve, reject}> = new Map();

export async function saveTheme(data: Theme) {
    const path = baseDir + 'theme.json';
    return new Promise((resolve, reject) => {
        globalThis.api.appFiles.send('saveFile', {path, data});
        pendingFiles.set(path, {resolve, reject});
    });
}

globalThis.api.appFiles.receive('savedFile', (data) => {
    const { path, success } = data;

    if(!pendingFiles.has(path)) {
        return;
    }

    let func, message;
    if(success) {
        func = pendingFiles.get(path).resolve;
        message = 'OK';
    } else {
        func = pendingFiles.get(path).reject;
        message = data.error;
    }
    pendingFiles.delete(path);
    func(message);
});