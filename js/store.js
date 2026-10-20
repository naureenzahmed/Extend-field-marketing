import { seedData, seedInspiration, buildPartnershipSections, mergeCityCompanies, addPartnerAdditions, partnershipSection, applyPartnerHQ } from './seed.js';

const STORAGE_KEY = 'extendFieldMarketingData.v1';

const SCHEMA_KEYS = {
  events: ['eventsNyc', 'eventsSf'],
  conferences: ['externalConferences'],
  leads: ['leadLists'],
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
      // Event Attendance / Partnership Events name lists changed; swap the names, keep the weekly numbers.
      //   eventsFunnelVersion 2: Event Attendance lists Event 1-4 (NYC and SF).
      //   eventsFunnelVersion 3: SF Partnership Events lists the SF companies to collab with.
      //   eventsFunnelVersion 4-5: SF Partnership Events list updated again.
      //   eventsFunnelVersion 6: NYC Partnership Events adds Betaworks and Rho (appended, existing names kept).
      //   eventsFunnelVersion 7: NYC Partnership Events drops 222.
      const funnelVersion = stored.eventsFunnelVersion || 1;
      if (funnelVersion < fresh.eventsFunnelVersion) {
        const refresh = (key, suffix) => {
          const section = stored[key]?.find((s) => s.id.endsWith(suffix));
          const freshSection = [...fresh[key], ...fresh.partnerships].find((s) => s.id === section?.id);
          if (section && freshSection) section.entities = freshSection.entities;
        };
        if (funnelVersion < 2) ['eventsNycFunnel', 'eventsSfFunnel'].forEach((key) => refresh(key, '-attendance'));
        if (funnelVersion < 5) refresh('eventsSfFunnel', '-partnerships');
        if (funnelVersion < 6) {
          const section = stored.eventsNycFunnel?.find((s) => s.id === 'nyc-partnerships');
          const added = fresh.partnerships.find((s) => s.id === 'nyc-partnerships').entities
            .filter((e) => ['Betaworks', 'Rho'].includes(e.name));
          added.forEach((e) => { if (section && !section.entities.some((x) => x.name === e.name)) section.entities.push(e); });
        }
        if (funnelVersion < 7) {
          const section = stored.eventsNycFunnel?.find((s) => s.id === 'nyc-partnerships');
          if (section) section.entities = section.entities.filter((e) => e.name !== '222');
        }
        stored.eventsFunnelVersion = fresh.eventsFunnelVersion;
        changed = true;
      }
      // Add imported events to saved data once, skipping any already listed by name.
      //   eventsImportVersion 1: Date becomes a text column; External Events (NYC, SF) from the SF/NYC spreadsheet.
      //   eventsImportVersion 2: SF Internal Events ideas.
      //   eventsImportVersion 3: NYC Internal Events ideas, plus two more for SF.
      //   eventsImportVersion 4: Video Game Olympics moves from SF to NYC; Raspberry Pi Night cost corrected.
      const importVersion = stored.eventsImportVersion || 0;
      if (importVersion < fresh.eventsImportVersion) {
        const addMissing = (key, index) => {
          const freshSection = fresh[key][index];
          const section = stored[key].find((s) => s.id === freshSection.id);
          if (!section) return;
          for (const event of freshSection.entries) {
            if (!section.entries.some((e) => e.eventName === event.eventName)) section.entries.push(event);
          }
        };
        if (importVersion < 1) {
          for (const key of ['eventsNyc', 'eventsSf']) {
            stored[key].forEach((section) => { section.fields = fresh[key][0].fields; });
            addMissing(key, 0);
          }
        }
        if (importVersion < 2) addMissing('eventsSf', 1);
        if (importVersion < 3) { addMissing('eventsNyc', 1); addMissing('eventsSf', 1); }
        if (importVersion < 4) {
          const isVideoGames = (e) => e.eventName.startsWith('Video Game Olympics');
          const sfInternal = stored.eventsSf.find((s) => s.id === 'sf-internal-events');
          const nycInternal = stored.eventsNyc.find((s) => s.id === 'nyc-internal-events');
          const moving = sfInternal?.entries.find(isVideoGames);
          if (moving && nycInternal) {
            sfInternal.entries = sfInternal.entries.filter((e) => e !== moving);
            if (!nycInternal.entries.some(isVideoGames)) nycInternal.entries.push(moving);
          }
          const pi = nycInternal?.entries.find((e) => e.id === 'nyc-int-2');
          if (pi) pi.eventName = pi.eventName.replace('low-cost Raspberry Pis ($0.80 per unit)', 'Raspberry Pis (about $40 per unit on average)');
        }
        stored.eventsImportVersion = fresh.eventsImportVersion;
        changed = true;
      }
      // titlesVersion 1: "Target Accounts" on Lead Lists becomes "Target Accounts with Interaction"
      // (only if the user hasn't renamed it themselves).
      if ((stored.titlesVersion || 0) < fresh.titlesVersion) {
        const section = stored.leadLists?.find((s) => s.id === 'leads-target-accounts');
        if (section?.title === 'Target Accounts') section.title = 'Target Accounts with Interaction';
        stored.titlesVersion = fresh.titlesVersion;
        changed = true;
      }
      // industryVersion 1: events tables gain Company Name and Industry columns.
      if ((stored.industryVersion || 0) < fresh.industryVersion) {
        for (const key of ['eventsNyc', 'eventsSf']) {
          stored[key].forEach((section) => { section.fields = fresh[key][0].fields; });
        }
        stored.industryVersion = fresh.industryVersion;
        changed = true;
      }
      // Partnerships page upgrades, keeping companies (and their clubs and industries):
      //   partnershipsVersion 1: Partnership Events move off the events pages (one section per city).
      //   partnershipsVersion 2: sections become industries; each company keeps its city. The per-city
      //   sections (and their weekly numbers) are kept in partnershipsByCity.
      //   partnershipsVersion 3: more companies per industry (and a new Others section), skipping names already on the page.
      //   partnershipsVersion 4: new AI section (before Dev Tools) holding OpenAI, Anthropic, Cursor (SpaceX) and Gumloop.
      //   partnershipsVersion 5: City becomes each company's headquarters where known.
      const partnershipsVersion = stored.partnershipsVersion || 0;
      if (partnershipsVersion < fresh.partnershipsVersion) {
        let byCity = stored.partnerships;
        if (partnershipsVersion < 1) {
          byCity = ['nyc', 'sf'].map((prefix) => {
            const key = prefix === 'nyc' ? 'eventsNycFunnel' : 'eventsSfFunnel';
            const section = stored[key]?.find((s) => s.id === `${prefix}-partnerships`);
            if (stored[key]) stored[key] = stored[key].filter((s) => s !== section);
            return section;
          }).filter(Boolean);
        }
        if (partnershipsVersion < 2) {
          const cityOf = (id) => (id.startsWith('nyc') ? 'NYC' : 'SF');
          const companies = mergeCityCompanies(Object.fromEntries(
            (byCity || []).map((s) => [cityOf(s.id), s.entities || []]),
          ));
          stored.partnershipsByCity = byCity;
          stored.partnerships = companies.length ? buildPartnershipSections(companies) : fresh.partnerships;
        }
        if (partnershipsVersion < 3) {
          if (!stored.partnerships.some((s) => s.title === 'Others')) stored.partnerships.push(partnershipSection('Others'));
          addPartnerAdditions(stored.partnerships);
        }
        if (partnershipsVersion < 4) {
          const sections = stored.partnerships;
          let ai = sections.find((s) => s.title === 'AI');
          if (!ai) {
            ai = partnershipSection('AI');
            const devTools = sections.findIndex((s) => s.title === 'Dev Tools');
            sections.splice(devTools >= 0 ? devTools : sections.length, 0, ai);
          }
          for (const name of ['OpenAI', 'Anthropic', 'Cursor (SpaceX)', 'Gumloop']) {
            const from = sections.find((s) => s !== ai && s.entities?.some((e) => e.name === name));
            if (from) {
              const index = from.entities.findIndex((e) => e.name === name);
              ai.entities.push(...from.entities.splice(index, 1));
            } else if (!ai.entities.some((e) => e.name === name)) {
              ai.entities.push({ name, city: '', links: [] });
            }
          }
        }
        if (partnershipsVersion < 5) applyPartnerHQ(stored.partnerships);
        stored.partnershipsVersion = fresh.partnershipsVersion;
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
