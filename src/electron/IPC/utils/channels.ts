import {BrowserWindow} from 'electron';

export interface APIChannels {
    nameAPI: string,
    validSendChannel: SendChannels,
    validReceiveChannel: string[]
}

export interface SendChannels {
    [key: string]: (customWindow: BrowserWindow, event: Electron.IpcMainEvent, message:unknown) => unknown
}