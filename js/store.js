import { EXTERNAL_EVENT_FORMATS, REMOVED_INTERNAL_EVENT_IDS, HEAD_OF_CONTENT, NON_TECHNICAL } from './fieldMarketing.js';
import { seedData, seedInspiration, buildPartnershipSections, mergeCityCompanies, addPartnerAdditions, partnershipSection, applyPartnerHQ, applyPartnerPlacements, PARTNERSHIP_OTHERS_ID, DROPPED_SECTIONS, REMOVED_PARTNERS, ESTIMATES_NOTE } from './seed.js';

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
      //   partnershipsVersion 6: Insurance and Pharmaceutical sections removed (Corgi, Recursion and Novo
      //   Nordisk move to Others with an industry label); Harvey labelled Law; Ramp also listed under
      //   Banking; Dialogue added to Health Care; MongoDB added to Dev Tools; Finance and Banking merge
      //   into one Finance & Banking section.
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
        if (partnershipsVersion < 6) {
          const sections = stored.partnerships;
          let others = sections.find((s) => s.id === PARTNERSHIP_OTHERS_ID);
          if (!others) { others = partnershipSection('Others'); sections.push(others); }
          for (const [title, keepNames] of Object.entries(DROPPED_SECTIONS)) {
            for (const dropped of sections.filter((s) => s.title === title)) {
              for (const e of dropped.entities) {
                if (keepNames.includes(e.name) && !others.entities.some((o) => o.name === e.name)) others.entities.push(e);
              }
              sections.splice(sections.indexOf(dropped), 1);
            }
          }
          const finance = sections.find((s) => s.title === 'Finance');
          if (finance) {
            finance.title = 'Finance & Banking';
            for (const banking of sections.filter((s) => s.title === 'Banking')) {
              banking.entities.forEach((e) => { if (!finance.entities.some((f) => f.name === e.name)) finance.entities.push(e); });
              sections.splice(sections.indexOf(banking), 1);
            }
          }
          applyPartnerPlacements(sections);
          applyPartnerHQ(addPartnerAdditions(sections), { onlyBlank: true });
        }
        stored.partnershipsVersion = fresh.partnershipsVersion;
        changed = true;
      }
      // peopleVersion 1: teams become Conference A-D and people become the Extend team. Ids p1-p12 are
      // kept, so tasks and key results stay assigned (now to the person with that id).
      if ((stored.peopleVersion || 0) < fresh.peopleVersion) {
        stored.teams = fresh.teams;
        stored.people = fresh.people;
        stored.peopleVersion = fresh.peopleVersion;
        changed = true;
      }
      // fieldMarketingVersion 1: field-marketing overhaul. Keeps everything typed so far; replaces template content.
      //   fieldMarketingVersion 2: Bo is head of all content (only where the owner hasn't been changed).
      //   fieldMarketingVersion 3: follow-up steps on the conference page have no owner names.
      //   fieldMarketingVersion 4: events, conferences and plans for non-technical audiences are removed,
      //   and Internal Events drops the Conference format.
      //   fieldMarketingVersion 5: the events pages drop the Community Event format and its events.
      //   fieldMarketingVersion 6: Social & Content drops the Content Owner column, and Teaser Date becomes
      //   a window one to two weeks before each event.
      //   fieldMarketingVersion 7: Social & Content gains Posting Period (the week before each event).
      //   fieldMarketingVersion 8: Anti Roch and Wiz leave Partnerships; External Conferences notes say the
      //   numbers are estimates.
      const fmVersion = stored.fieldMarketingVersion || 0;
      if (fmVersion < fresh.fieldMarketingVersion) {
        if (fmVersion < 1) upgradeToFieldMarketing(stored, fresh);
        if (fmVersion === 1) makeHeadOfContent(stored, fresh);
        if (fmVersion < 3) {
          (stored.externalConferences || []).forEach((c) => c.sections
            .filter((s) => s.id.endsWith('-post'))
            .forEach((s) => s.entries.forEach((row) => { row.owner = ''; })));
        }
        if (fmVersion < 4) {
          removeNonTechnical(stored);
          for (const key of ['eventsNyc', 'eventsSf']) {
            (stored[key] || []).filter((s) => s.id.endsWith('-internal-events')).forEach((s) => { s.fields = fresh[key][1].fields; });
          }
        }
        if (fmVersion < 5) {
          for (const key of ['eventsNyc', 'eventsSf']) {
            (stored[key] || []).forEach((s) => {
              s.fields = s.id.endsWith('-internal-events') ? fresh[key][1].fields : fresh[key][0].fields;
              s.entries = s.entries.filter((e) => e.format !== 'Community Event');
            });
            // Event Attendance companies tagged Community Event go back to Unassigned.
            (stored[`${key}Funnel`] || []).forEach((s) => (s.entities || []).forEach((e) => {
              if (e.format === 'Community Event') e.format = '';
            }));
          }
        }
        if (fmVersion < 6) {
          (stored.socialPlan || []).filter((s) => s.id === 'social-events').forEach((s) => {
            s.fields = fresh.socialPlan[0].fields;
            const seededTeaserDates = ['2026-10-21', '2026-11-03', '2026-11-23', ''];
            s.entries.forEach((row) => {
              delete row.contentOwner;
              const teaserWindow = fresh.socialPlan[0].entries.find((f) => f.id === row.id)?.teaserDate;
              if (teaserWindow && seededTeaserDates.includes(row.teaserDate || '')) row.teaserDate = teaserWindow;
            });
          });
        }
        if (fmVersion < 7) {
          (stored.socialPlan || []).filter((s) => s.id === 'social-events').forEach((s) => {
            s.fields = fresh.socialPlan[0].fields;
            s.entries.forEach((row) => {
              if (!row.postingPeriod) row.postingPeriod = fresh.socialPlan[0].entries.find((f) => f.id === row.id)?.postingPeriod || '';
            });
          });
        }
        if (fmVersion < 8) {
          (stored.partnerships || []).forEach((s) => { s.entities = (s.entities || []).filter((e) => !REMOVED_PARTNERS.includes(e.name)); });
          stored.pageNotes = stored.pageNotes || {};
          if (!stored.pageNotes.externalConferences) stored.pageNotes.externalConferences = ESTIMATES_NOTE;
        }
        stored.fieldMarketingVersion = fresh.fieldMarketingVersion;
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

// Function declarations (not consts): load() runs at module start, before later consts exist.
function isRecruitingMetrics(section) {
  return (section.metrics || []).some((m) => /Interview Booked/.test(m.label));
}

function isPlaceholderTask(t) {
  return /^Task \d+$/.test(t.title) && /^Example task description/.test(t.description || '');
}

function removeNonTechnical(stored) {
  const keep = (ids) => (row) => !ids.includes(row.id);
  for (const key of ['eventsNyc', 'eventsSf']) {
    (stored[key] || []).forEach((s) => { s.entries = s.entries.filter(keep(NON_TECHNICAL.events)); });
  }
  (stored.conferenceScorecard || []).forEach((s) => { s.entries = s.entries.filter(keep(NON_TECHNICAL.scorecard)); });
  (stored.socialPlan || []).forEach((s) => { s.entries = s.entries.filter(keep(NON_TECHNICAL.social)); });
  stored.tasks = (stored.tasks || []).filter(keep(NON_TECHNICAL.tasks));
  stored.milestones = (stored.milestones || []).filter(keep(NON_TECHNICAL.milestones));
}

function makeHeadOfContent(stored, fresh) {
  const seededContentPeople = ['Shruthi', 'Devin', 'Addison'];
  const isContentRow = (r) => r.workstream === 'Social' || r.item === 'Swag'
    || /^Post a booth clip/.test(r.activity || '') || /^Recap post/.test(r.step || '');
  for (const conf of stored.externalConferences || []) {
    for (const section of conf.sections) {
      for (const row of section.entries) {
        if (!isContentRow(row) || !seededContentPeople.includes(row.owner)) continue;
        if (row.activity && row.notes === 'See Social & Content') row.notes = `Filmed on site by ${row.owner}; see Social & Content`;
        row.owner = HEAD_OF_CONTENT;
      }
    }
  }
  for (const section of stored.socialPlan || []) {
    if (section.id !== 'social-events') continue;
    section.fields = fresh.socialPlan[0].fields;
    section.entries.forEach((row) => { if (!row.contentOwner) row.contentOwner = HEAD_OF_CONTENT; });
  }
  const bo = stored.people?.find((p) => p.name === HEAD_OF_CONTENT)?.id;
  (stored.tasks || []).forEach((t) => {
    if (['rt-11', 'rt-12'].includes(t.id) && ['p11', 'p15'].includes(t.assigneeId)) t.assigneeId = bo;
  });
  const kr = stored.okrs?.find((o) => o.id === 'okr-3')?.keyResults.find((k) => k.id === 'kr-3-1');
  if (kr && kr.assigneeIds.join() === 'p11,p15') kr.assigneeIds = [bo];
}

function upgradeToFieldMarketing(stored, fresh) {
  // Header target and Roadmap: real goals instead of template placeholders; tasks you added are kept.
  if (stored.companyGoal?.title === 'EoY target') stored.companyGoal = fresh.companyGoal;
  stored.initiatives = fresh.initiatives;
  stored.okrs = fresh.okrs;
  stored.milestones = fresh.milestones;
  const kept = (stored.tasks || []).filter((t) => !isPlaceholderTask(t));
  stored.tasks = [...kept, ...fresh.tasks.filter((t) => !kept.some((k) => k.id === t.id))];

  // Events pages: new columns per table; external events get a format; internal ideas get short names,
  // pitch, co-host, budget and goal (blank cells only); the Computer History Museum dinner is removed.
  for (const key of ['eventsNyc', 'eventsSf']) {
    const freshInternal = fresh[key][1];
    for (const section of stored[key] || []) {
      const internal = section.id.endsWith('-internal-events');
      section.fields = internal ? freshInternal.fields : fresh[key][0].fields;
      if (!internal) {
        section.entries.forEach((e) => { if (!e.format && EXTERNAL_EVENT_FORMATS[e.id]) e.format = EXTERNAL_EVENT_FORMATS[e.id]; });
        continue;
      }
      section.entries = section.entries.filter((e) => !REMOVED_INTERNAL_EVENT_IDS.includes(e.id));
      for (const e of section.entries) {
        const idea = freshInternal.entries.find((f) => f.id === e.id);
        if (!idea) continue;
        if ((e.eventName || '').includes(' – ')) e.eventName = idea.eventName;
        for (const k of ['pitch', 'format', 'coHost', 'coHostIncentive', 'poc', 'budget', 'goal', 'targetAudience']) {
          if (!e[k]) e[k] = idea[k];
        }
      }
    }
  }

  // Weekly metrics: event and co-hosting metrics instead of the recruiting ones (old values kept aside).
  stored.retiredMetrics = stored.retiredMetrics || {};
  const replaceMetrics = (key, freshSections) => (stored[key] || []).forEach((section) => {
    if (!isRecruitingMetrics(section)) return;
    stored.retiredMetrics[section.id] = section.metrics;
    section.metrics = freshSections.find((f) => f.id === section.id)?.metrics || freshSections[0].metrics;
  });
  replaceMetrics('eventsNycFunnel', fresh.eventsNycFunnel);
  replaceMetrics('eventsSfFunnel', fresh.eventsSfFunnel);
  replaceMetrics('partnerships', fresh.partnerships);

  // Lead Lists: Source Event column (and Event / Conference sources).
  (stored.leadLists || []).forEach((section) => { section.fields = fresh.leadLists[0].fields; });

  // External Conferences: drop the empty placeholder, add the three planned conferences.
  const isEmptyPlaceholder = (c) => c.title === 'Conference Name'
    && c.sections.every((s) => !s.entries.length) && !Object.values(c.summary || {}).some(Boolean);
  stored.externalConferences = (stored.externalConferences || []).filter((c) => !isEmptyPlaceholder(c));
  for (const conf of fresh.externalConferences) {
    if (!stored.externalConferences.some((c) => c.id === conf.id)) stored.externalConferences.push(conf);
  }
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
