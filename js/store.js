import { seedData } from './seed.js';

const STORAGE_KEY = 'extendFieldMarketingData.v1';

let data = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      const fresh = seedData();
      // Backfill any keys added to the seed after this data was first saved.
      let changed = false;
      // Events pages moved to External / Internal sections with new columns.
      if (stored.eventsSchema !== fresh.eventsSchema) {
        stored.eventsNyc = fresh.eventsNyc;
        stored.eventsSf = fresh.eventsSf;
        stored.eventsSchema = fresh.eventsSchema;
        changed = true;
      }
      for (const key of Object.keys(fresh)) {
        if (!(key in stored)) { stored[key] = fresh[key]; changed = true; }
      }
      if (changed) save(stored);
      return stored;
    }
  } catch (e) {
    console.warn('Failed to load stored data, reseeding.', e);
  }
  const fresh = seedData();
  save(fresh);
  return fresh;
}

function save(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

export function getData() {
  return data;
}

export function commit() {
  save(data);
}

export function resetData() {
  data = seedData();
  save(data);
}
