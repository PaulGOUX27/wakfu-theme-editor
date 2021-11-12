import IPC from './IPC';
import { APIChannels} from './channels';
import { ipcRenderer, contextBridge } from 'electron';

interface APIContextBridge {
    send: (channel: string, data: unknown) => void;
    receive: (channel: string, func: (...args: unknown[]) => void ) => void
}

function getArrayOfValidSendChannel(apiChannel: APIChannels): string[] {
    const {validSendChannel} = apiChannel;
    return Object.keys(validSendChannel);
}

function getContextBridge(apiChannel: APIChannels): APIContextBridge {
    const {validReceiveChannel} = apiChannel;
    const validSendChannel = getArrayOfValidSendChannel(apiChannel);
    return {
        send: ((channel: string, data: unknown) => {
            if(validSendChannel.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        }),
        receive: ((channel: string, func: (...arg: unknown[]) => void) => {
            if (validReceiveChannel.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args: unknown[]) => {
                    func(...args);
                });
            }
        })
    };
}

export function generateContextBridge(ipcList: IPC[]) {
    const channels: APIChannels[] = [];

    ipcList.forEach((ipc) => {
        channels.push(ipc.channels);
    });
    
    const apis : Record<string, APIContextBridge> = {};

    channels.forEach((channel) => {
        const api = getContextBridge(channel);
        const name = channel.nameAPI;
        apis[name] = api;
    });

    contextBridge.exposeInMainWorld('api', apis);
}