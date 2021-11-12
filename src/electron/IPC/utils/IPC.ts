import {APIChannels, SendChannels} from './channels';
import {IpcMain, BrowserWindow} from 'electron';

export default class IPC {
    private nameAPI = 'api';
    private validSendChannel: SendChannels = {}
    private validReceiveChannel: string[] = []

    constructor(channels: APIChannels) {
        this.nameAPI = channels.nameAPI;
        this.validSendChannel = channels.validSendChannel;
        this.validReceiveChannel = channels.validReceiveChannel;
    }

    get channels(): APIChannels {
        return {
            nameAPI: this.nameAPI,
            validSendChannel: this.validSendChannel,
            validReceiveChannel: this.validReceiveChannel
        };
    }

    async initIpcMain(ipcMain: IpcMain, customWindow: BrowserWindow){
        if(customWindow) {
            Object.keys(this.validSendChannel).forEach((key: string) => {
               ipcMain.on(key, async(event, message) => {
                   try {
                       await this.validSendChannel[key](customWindow, event, message);
                   } catch (e) {
                       console.error(`Error when sending message ${key}`, {
                           event,
                           message,
                           key,
                           e
                       });
                   }
               });
            });
        }
    }
}