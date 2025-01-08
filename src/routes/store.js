import { writable } from 'svelte/store';

function createLocalStorageStore(key, initialValue, clean=false) {
  const storedValue = clean ? null : localStorage.getItem(key);
  const store = writable(storedValue ? JSON.parse(storedValue) : initialValue);

  store.subscribe(value => {
    localStorage.setItem(key, JSON.stringify(value));
  });

  return store;
}

let history = {
  '000': [],
  '100': [],
  '200': [],
  '300': [],
  '400': [],
  '500': []
};

function initialCreatedItem(history) {
  return {
    currentTask: '000',
    ATA_code: "ATA-28",
    part_num: "ATA-281-15553-102",
    nc_event_id: "ATA-28-xxx",
    role: 'Quality Controler',
    name: "Eric Roy",
    nc_event_date: (new Date()).toISOString().replace(/T.*/,""),
    analysis_history: {
      "000": history['000'],
      "100": history['100'],
      "200": history['200'],
      "300": history['300'],
      "400": history['400'],
      "500": history['500'],
    }
  }
}

export function resetCreatedItem() {
  createdItem.set(
    initialCreatedItem(
      {
      '000': [],
      '100': [],
      '200': [],
      '300': [],
      '400': [],
      '500': []
      }
    )
  );
}
// Crée un store pour stocker les donn�es des �v�nements
export const createdItem = createLocalStorageStore('createdItem',initialCreatedItem(history) );
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
export const accessToken = createLocalStorageStore('accessToken', '');