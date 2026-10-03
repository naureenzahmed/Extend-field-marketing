import { seedData, seedInspiration } from './seed.js';

const STORAGE_KEY = 'extendFieldMarketingData.v1';

const SCHEMA_KEYS = {
  events: ['eventsNyc', 'eventsSf'],
  conferences: ['externalConferences'],
  leads: ['leadLists'],
  recruitment: ['recruitmentFunnel'],
};

// Documentation section ids added in each docsVersion.
const DOC_SECTIONS_ADDED = {
  2: ['docs-attendee-lists', 'docs-event-checklists'],
  3: ['docs-inspiration'],
};

// One-off fixes to existing Documentation sections, by docsVersion.
const DOC_PATCHES = {
  // Inspiration rows gain LinkedIn / X / Instagram links; fill blanks from the seed by title.
  4: (docs) => {
    const section = docs.find((s) => s.id === 'docs-inspiration');
    if (!section) return;
    section.socials = true;
    const seeded = seedInspiration().entries;
    section.entries.forEach((e) => {
      const match = seeded.find((x) => x.title === e.title);
      ['linkedin', 'x', 'instagram'].forEach((k) => { if (!e[k]) e[k] = match?.[k] || ''; });
    });
  },
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
      // Bring saved Documentation up to the current docsVersion: add sections introduced since
      // (once, so a section the user deletes stays deleted) and apply one-off patches.
      const docsVersion = stored.docsVersion || 1;
      if (docsVersion < fresh.docsVersion) {
        for (let version = docsVersion + 1; version <= fresh.docsVersion; version++) {
          const ids = DOC_SECTIONS_ADDED[version] || [];
          for (const section of fresh.docs.filter((s) => ids.includes(s.id))) {
            if (!stored.docs.some((s) => s.id === section.id)) stored.docs.push(section);
          }
          DOC_PATCHES[version]?.(stored.docs);
        }
        stored.docsVersion = fresh.docsVersion;
        changed = true;
      }
      // eventsFunnelVersion 2: Event Attendance lists Event 1-4; keep the weekly numbers already entered.
      if ((stored.eventsFunnelVersion || 1) < fresh.eventsFunnelVersion) {
        for (const key of ['eventsNycFunnel', 'eventsSfFunnel']) {
          const section = stored[key]?.find((s) => s.id.endsWith('-attendance'));
          if (section) section.entities = fresh[key].find((s) => s.id === section.id).entities;
        }
        stored.eventsFunnelVersion = fresh.eventsFunnelVersion;
        changed = true;
      }
      // eventsImportVersion 1: Date becomes a text column, and External Events gets the events imported
      // from the SF/NYC spreadsheet (skipping any already listed by name).
      if ((stored.eventsImportVersion || 0) < fresh.eventsImportVersion) {
        for (const key of ['eventsNyc', 'eventsSf']) {
          const freshSections = fresh[key];
          stored[key].forEach((section) => { section.fields = freshSections[0].fields; });
          const external = stored[key].find((s) => s.id === freshSections[0].id);
          if (!external) continue;
          for (const event of freshSections[0].entries) {
            if (!external.entries.some((e) => e.eventName === event.eventName)) external.entries.push(event);
          }
        }
        stored.eventsImportVersion = fresh.eventsImportVersion;
        changed = true;
      }
      // Backfill any keys added to the seed after this data was first saved.
      for (const key of Object.keys(fresh)) {
        if (!(key in stored)) { stored[key] = fresh[key]; changed = true; }
      }
      for (const key of Object.keys(fresh.pageNotes)) {
        if (!(key in stored.pageNotes)) { stored.pageNotes[key] = fresh.pageNotes[key]; changed = true; }
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

export function findPerson(id) {
  return data.people.find((p) => p.id === id) || null;
}

export function findTeam(id) {
  return data.teams.find((t) => t.id === id) || null;
}

export function findInitiative(id) {
  return data.initiatives.find((i) => i.id === id) || null;
}

export function findTask(id) {
  return data.tasks.find((t) => t.id === id) || null;
}
