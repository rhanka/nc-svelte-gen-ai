import { writable } from 'svelte/store';

// Cr�e un store pour stocker les donn�es des �v�nements
export const createdItem = writable(null);
export const updateCreatedItem = writable(null);
export const taskLabel = {
    "000": "Non-Conformity Report",
    "100": "Task 100 - Analysis",
    "200": "Task 200 - Analysis Validation",
    "300": "Task 300 - Stress Analysis",
    "400": "Task 400 - Stress Analysis Validation",
    "500": "Task 500 - Final Analysis Validation"
  }
export const isUpdating = writable(false);
export const askForHelp = writable(false);