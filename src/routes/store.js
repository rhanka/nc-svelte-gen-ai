import { writable } from 'svelte/store';

// Crée un store pour stocker les données des événements
export const createdItem = writable(null);
export const updateCreatedItem = writable(null);