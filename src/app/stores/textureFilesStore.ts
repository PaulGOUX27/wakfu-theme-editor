import {derived, Readable, Writable} from 'svelte/store';
import type {Theme} from '../types/core';
import {themeStore} from './themeStore';
import {loadTexture} from '../services/appFileManager';

export type TextureFilesStore = Record<string, Uint8Array>

export const textureFilesStore: Readable<TextureFilesStore> = derived<Writable<Theme>, TextureFilesStore>(themeStore, ($themeStore, set) => {

    const storeData = {};
    $themeStore?.textures.forEach(async (texture) => {
        storeData[texture.id] = await loadTexture(texture);
    });
    set(storeData);

    return function stop() {
        set({});
    };
});
