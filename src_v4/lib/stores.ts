import { writable } from 'svelte/store';

export const darkMode = writable<'dark' | 'light' | undefined>(undefined);
export const altMode = writable<'alt' | 'primary' | undefined>(undefined);

export const reduceMotion = writable<boolean>(false);
