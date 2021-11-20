import {Writable, writable} from 'svelte/store';
import type {Theme} from '../types/core';

export const themeStore: Writable<Theme> = writable<Theme >(null);
