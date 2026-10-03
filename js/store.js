import { seedData } from './seed.js';

const STORAGE_KEY = 'extendFieldMarketingData.v1';

const SCHEMA_KEYS = {
  events: ['eventsNyc', 'eventsSf'],
  conferences: ['externalConferences'],
};

let data = load();

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw);
      const fresh = seedData();
      let changed = false;
      // Reseed pages whose section layout changed since this data was saved.
      const versions = stored.schemaVersions || { events: stored.eventsSchema };
      for (const [name, keys] of Object.entries(SCHEMA_KEYS)) {
        if (versions[name] !== fresh.schemaVersions[name]) {
          keys.forEach((k) => { stored[k] = fresh[k]; });
          changed = true;
        }
      }
      if (changed) stored.schemaVersions = fresh.schemaVersions;
      delete stored.eventsSchema;
      // Backfill any keys added to the seed after this data was first saved.
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
