import { NYC_EXTERNAL_EVENTS, SF_EXTERNAL_EVENTS } from './eventImports.js';
import {
  EXTERNAL_EVENT_FIELDS, INTERNAL_EVENT_FIELDS, EXTERNAL_EVENT_FORMATS, NYC_INTERNAL_EVENTS, SF_INTERNAL_EVENTS,
  eventFunnelMetrics, partnershipFunnelMetrics, newConference, PLANNED_CONFERENCES, SCORECARD_FIELDS, SCORECARD_ROWS,
  SOCIAL_FIELDS, SOCIAL_PLAN, COMPANY_GOAL, ROADMAP_INITIATIVES, ROADMAP_TASKS, ROADMAP_MILESTONES, ROADMAP_OKRS,
} from './fieldMarketing.js';

// Same columns as the ElevenLabs Inbound Leads table, with "User Name" as "Lead Name".
const YES_NO_OPTIONS = ['', 'Yes', 'No'];

export const LEAD_FIELDS = [
  { key: 'company', label: 'Company' },
  { key: 'leadName', label: 'Lead Name' },
  { key: 'source', label: 'Source', type: 'select', options: ['', 'Event', 'Conference', 'Email', 'LinkedIn Ads', 'Google Ads', 'SEO/AEO', 'Reddit', 'Newsletter', 'Referral', 'Website', 'Other'] },
  // Links a lead to an event; the events pages count Leads and Meetings Booked from this.
  { key: 'sourceEvent', label: 'Source Event', list: 'event-names', width: 240 },
  { key: 'title', label: 'Title' },
  { key: 'stage', label: 'Stage', type: 'select', options: ['', 'New', 'Contacted', 'Demo Booked', 'Demo Completed', 'Negotiation', 'Won', 'Lost'] },
  { key: 'positiveAnswer', label: 'Positive Answer', type: 'select', options: YES_NO_OPTIONS },
  { key: 'demoBookedDate', label: 'Demo Booked Date', type: 'date' },
  { key: 'demoHappenedDate', label: 'Demo Happened Date', type: 'date' },
  { key: 'lostLead', label: 'Lost Lead', type: 'select', options: YES_NO_OPTIONS },
  { key: 'meetingWithAeDate', label: 'Meeting with AE date', type: 'date' },
  { key: 'estimatedQuantity', label: 'Estimated Quantity' },
  { key: 'estimatedRevenue', label: 'Estimated Revenue' },
  { key: 'note', label: 'Note' },
];

function sections(prefix, titles, fields) {
  return titles.map((title) => ({
    id: `${prefix}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    title,
    fields,
    entries: [],
  }));
}

/* Retitles a section while keeping the id it was created with (ids come from the original title). */
function renameSection(pageSections, id, title) {
  pageSections.find((s) => s.id === id).title = title;
  return pageSections;
}

/* Fills an events page's External and Internal Events sections (each with its own columns). */
function withEvents(pageSections, external, internal = []) {
  const blank = (fields) => Object.fromEntries(fields.filter((f) => f.type !== 'computed').map((f) => [f.key, '']));
  pageSections[0].fields = EXTERNAL_EVENT_FIELDS;
  pageSections[0].entries = external.map((e) => ({ ...blank(EXTERNAL_EVENT_FIELDS), ...e, format: EXTERNAL_EVENT_FORMATS[e.id] || '' }));
  pageSections[1].fields = INTERNAL_EVENT_FIELDS;
  pageSections[1].entries = internal.map((e) => ({ ...blank(INTERNAL_EVENT_FIELDS), ...e }));
  return pageSections;
}

function docList(id, title, titles) {
  return {
    id, title,
    entries: titles.map((t, i) => ({ id: `${id}-${i + 1}`, title: t, url: '', notes: '' })),
  };
}

const INSPIRATION = [
  { title: 'Long Journey Ventures', linkedin: 'https://www.linkedin.com/company/longjourney', x: 'https://x.com/LongJourneyVC', instagram: '' },
  { title: 'Gumloop', linkedin: '', x: 'https://x.com/gumloop', instagram: '' },
  { title: 'New York Startup Week', linkedin: '', x: '', instagram: '' },
  { title: 'Verci', linkedin: '', x: '', instagram: '' },
];

export function seedInspiration() {
  return {
    ...docList('docs-inspiration', 'Inspiration', INSPIRATION.map((i) => i.title)),
    socials: true,
    entries: INSPIRATION.map((i, n) => ({ id: `docs-inspiration-${n + 1}`, url: '', notes: '', ...i })),
  };
}

function seedDocs() {
  return [
    {
      id: 'docs-logins', title: 'Software Login',
      fields: [
        { key: 'name', label: 'Software Name' },
        { key: 'loginProcess', label: 'Login Process' },
        { key: 'adminAccess', label: 'Admin Access' },
        { key: 'useCases', label: 'Use Cases' },
      ],
      entries: [],
    },
    docList('docs-brand', 'Brand & Messaging', ['Brand Guidelines', 'Messaging Document', 'Pitch Deck', 'One Pager']),
    docList('docs-playbooks', 'Event Playbooks', ['Event Planning Checklist', 'Booth Setup Guide', 'Post-Event Follow-Up Sequence', 'Swag & Materials Inventory']),
    docList('docs-templates', 'Templates', ['Event Invite Email', 'Event Follow-Up Email', 'Event Landing Page']),
    docList('docs-attendee-lists', 'Attendee Lists', ['Event 1', 'Event 2', 'Event 3']),
    docList('docs-event-checklists', 'Event Checklists', ['Event 1', 'Event 2', 'Event 3']),
    seedInspiration(),
  ];
}

/* ---------- Weeks for the weekly-metric sections on the events pages ---------- */

function seedWeeks() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);
  const weeks = [];
  for (let i = -2; i < 6; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i * 7);
    weeks.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isCurrent: i === 0,
    });
  }
  return weeks;
}

/* Partnership Events companies per city. */
const PARTNERS = {
  nyc: ['Corgi', 'Verci', 'General Intelligence Company of New York', 'Anti Roch', 'Ramp', 'Clay', 'Brex', 'Betaworks', 'Rho'],
  sf: ['Corgi', 'Circleback', 'Gumloop', 'Mintlify', 'Vercel', 'Discord', 'Rentahuman AI', 'PostHog', 'Solo Founders'],
};

/* Event Attendance (weekly metrics); NYC and SF each get their own copy. */
function seedEventsFunnel(prefix) {
  return [
    {
      id: `${prefix}-attendance`,
      title: 'Event Attendance',
      entities: [
        { name: 'Event 1', links: [] },
        { name: 'Event 2', links: [] },
        { name: 'Event 3', links: [] },
        { name: 'Event 4', links: [] },
      ],
      metrics: eventFunnelMetrics(),
    },
  ];
}

/* ---------- Partnerships page: one section per industry ---------- */

export const PARTNERSHIP_INDUSTRIES = [
  'Documentation Software', 'HR Software', 'Finance', 'Banking', 'Community', 'Pharmaceutical',
  'Cybersecurity', 'Health Care', 'AI', 'Dev Tools', 'Sales Tools', 'Insurance', 'Others',
];

// Industry for companies we could place; anything else starts in Unassigned.
const PARTNER_INDUSTRY = {
  Corgi: 'Insurance',
  Ramp: 'Finance',
  Brex: 'Finance',
  Rho: 'Banking',
  Clay: 'Sales Tools',
  Betaworks: 'Community',
  Discord: 'Community',
  'Solo Founders': 'Community',
  Vercel: 'Dev Tools',
  PostHog: 'Dev Tools',
  Gumloop: 'AI',
  Mintlify: 'Documentation Software',
  Circleback: 'Documentation Software',
};

// Industries used on the events pages that map onto a Partnerships section.
const INDUSTRY_ALIASES = { Pharmaceuticals: 'Pharmaceutical' };

// Further companies per industry (no city yet); skipped if the name is already on the page.
export const PARTNER_ADDITIONS = {
  'Documentation Software': ['Notion', 'Atlassian (Confluence)', 'Mintlify', 'GitBook', 'Grammarly / Superhuman (owns Coda)'],
  'HR Software': ['Rippling', 'Deel', 'Gusto', 'Lattice', 'Ashby'],
  Finance: ['Stripe', 'Ramp', 'Brex', 'Plaid', 'Mercury'],
  Banking: ['Revolut', 'Nubank', 'Monzo', 'Chime', 'Wise', 'JPMorgan Chase (kept for its large AI investment)'],
  Community: ['Discord', 'Reddit', 'Circle', 'Skool'],
  Pharmaceutical: ['Isomorphic Labs (from Google DeepMind)', 'Recursion', 'Insitro', 'Xaira Therapeutics', 'Novo Nordisk'],
  Cybersecurity: ['Wiz (being acquired by Google)', 'CrowdStrike', 'Cloudflare', 'Vanta', '1Password', 'Snyk'],
  'Health Care': ['Abridge', 'Hippocratic AI', 'Tempus AI', 'Oscar Health', 'Hinge Health'],
  AI: ['OpenAI', 'Anthropic', 'Cursor (SpaceX)', 'Gumloop'],
  'Dev Tools': ['Vercel', 'Supabase', 'Linear', 'Replit', 'Retool', 'PostHog'],
  'Sales Tools': ['Clay', 'Gong', 'Apollo.io', 'Attio', 'HubSpot'],
  Insurance: ['Lemonade', 'Coalition', 'Vouch', 'Root', 'Next Insurance'],
  Others: ['Harvey'],
};

/* Appends PARTNER_ADDITIONS to the matching industry sections, skipping names already anywhere on the page. */
export function addPartnerAdditions(sections) {
  const known = new Set(sections.flatMap((s) => (s.entities || []).map((e) => e.name.toLowerCase())));
  for (const [industry, names] of Object.entries(PARTNER_ADDITIONS)) {
    const section = sections.find((s) => s.title === industry);
    if (!section) continue;
    section.entities = section.entities || [];
    for (const name of names) {
      if (known.has(name.toLowerCase())) continue;
      section.entities.push({ name, city: '', links: [] });
      known.add(name.toLowerCase());
    }
  }
  return sections;
}

// Headquarters city per company (from public company profiles, Oct 2026). Companies not listed keep their city.
const SF = 'San Francisco, CA';
const NYC = 'New York, NY';
export const PARTNER_HQ = {
  'General Intelligence Company of New York': NYC,
  'Rentahuman AI': SF,
  Circleback: SF,
  Mintlify: SF,
  Notion: SF,
  'Atlassian (Confluence)': 'Sydney, Australia',
  'Grammarly / Superhuman (owns Coda)': SF,
  Rippling: SF,
  Deel: SF,
  Gusto: SF,
  Lattice: SF,
  Ashby: SF,
  Ramp: NYC,
  Brex: SF,
  Stripe: 'South San Francisco, CA and Dublin, Ireland',
  Plaid: SF,
  Mercury: SF,
  Rho: NYC,
  Revolut: 'London, UK',
  Nubank: 'São Paulo, Brazil',
  Monzo: 'London, UK',
  Chime: SF,
  Wise: 'London, UK',
  'JPMorgan Chase (kept for its large AI investment)': NYC,
  Betaworks: NYC,
  Discord: SF,
  Reddit: SF,
  Circle: NYC,
  Skool: 'Los Angeles, CA',
  'Isomorphic Labs (from Google DeepMind)': 'London, UK',
  Recursion: 'Salt Lake City, UT',
  Insitro: 'South San Francisco, CA',
  'Xaira Therapeutics': 'South San Francisco, CA',
  'Novo Nordisk': 'Bagsværd, Denmark',
  'Wiz (being acquired by Google)': NYC,
  CrowdStrike: 'Austin, TX',
  Cloudflare: SF,
  Vanta: SF,
  '1Password': 'Toronto, Canada',
  Snyk: 'Boston, MA',
  Abridge: 'Pittsburgh, PA',
  'Hippocratic AI': 'Palo Alto, CA',
  'Tempus AI': 'Chicago, IL',
  'Oscar Health': NYC,
  'Hinge Health': SF,
  Gumloop: SF,
  OpenAI: SF,
  Anthropic: SF,
  'Cursor (SpaceX)': SF,
  Vercel: SF,
  PostHog: SF,
  Supabase: SF,
  Linear: SF,
  Replit: 'Foster City, CA',
  Retool: SF,
  Clay: NYC,
  Gong: SF,
  'Apollo.io': SF,
  Attio: 'London, UK',
  HubSpot: 'Cambridge, MA',
  Corgi: SF,
  Lemonade: NYC,
  Coalition: SF,
  Vouch: SF,
  Root: 'Columbus, OH',
  'Next Insurance': 'Palo Alto, CA',
  Harvey: SF,
};

/* Sets each known company's city to its headquarters. */
export function applyPartnerHQ(sections) {
  for (const section of sections) {
    for (const e of section.entities || []) if (PARTNER_HQ[e.name]) e.city = PARTNER_HQ[e.name];
  }
  return sections;
}

export const PARTNERSHIP_UNASSIGNED_ID = 'partner-unassigned';

export function partnershipMetrics() {
  return partnershipFunnelMetrics();
}

/* Sorts companies ({ name, city, links, industry? }) into one section per industry, plus Unassigned. */
export function partnershipSection(title) {
  return { id: `partner-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, title, entities: [], metrics: partnershipMetrics() };
}

export function buildPartnershipSections(companies) {
  const sections = [
    { id: PARTNERSHIP_UNASSIGNED_ID, title: 'Unassigned', entities: [], metrics: partnershipMetrics() },
    ...PARTNERSHIP_INDUSTRIES.map(partnershipSection),
  ];
  for (const company of companies) {
    const industry = INDUSTRY_ALIASES[company.industry] || company.industry || PARTNER_INDUSTRY[company.name];
    const section = sections.find((s) => s.title === industry) || sections[0];
    const { industry: _unused, ...entity } = company;
    section.entities.push(entity);
  }
  return sections;
}

/* Merges per-city company lists ({ NYC: [...], SF: [...] }) so a company in both cities appears once. */
export function mergeCityCompanies(byCity) {
  const merged = [];
  for (const [city, companies] of Object.entries(byCity)) {
    for (const c of companies) {
      const existing = merged.find((m) => m.name === c.name);
      if (existing) {
        existing.city = `${existing.city}, ${city}`;
        existing.links = [...(existing.links || []), ...(c.links || [])];
        existing.industry = existing.industry || c.industry;
      } else {
        merged.push({ ...c, city, links: c.links || [] });
      }
    }
  }
  return merged;
}

function seedPartnerships() {
  const toCompanies = (names) => names.map((name) => ({ name, links: [] }));
  return applyPartnerHQ(addPartnerAdditions(buildPartnershipSections(mergeCityCompanies({ NYC: toCompanies(PARTNERS.nyc), SF: toCompanies(PARTNERS.sf) }))));
}

/* ---------- Roadmap (opened from the header target) ---------- */

export const TEAMS = [
  { id: 'team-a', name: 'Conference A', color: '#6c8cff' },
  { id: 'team-b', name: 'Conference B', color: '#ef6f6c' },
  { id: 'team-c', name: 'Conference C', color: '#57c785' },
  { id: 'team-d', name: 'Conference D', color: '#f2994a' },
];

// Extend team, dealt round-robin across the conferences.
const TEAM_NAMES = [
  'Andrew', 'Bo', 'Jing', 'Sydney', 'Sophia', 'Victor', 'Scott', 'Sasha', 'James', 'Harvey', 'Addison',
  'Mike', 'Shruthi', 'Devin', 'Matthew', 'Aiden', 'Joseph', 'Jack', 'Joon', 'Veerpartap', 'Richard',
];

export const PEOPLE = TEAM_NAMES.map((name, i) => ({
  id: `p${i + 1}`, name, role: '', teamId: TEAMS[i % TEAMS.length].id,
}));

export function seedData() {
  return {
    fieldMarketingVersion: 2,
    companyGoal: { ...COMPANY_GOAL },
    schemaVersions: { events: 3, conferences: 4, leads: 2 },
    peopleVersion: 1,
    teams: TEAMS,
    people: PEOPLE,
    initiatives: ROADMAP_INITIATIVES,
    milestones: ROADMAP_MILESTONES,
    okrs: ROADMAP_OKRS,
    tasks: ROADMAP_TASKS,
    slackWebhookUrl: '',
    weeks: seedWeeks(),
    docs: seedDocs(),
    docsVersion: 4,
    titlesVersion: 1,
    leadLists: renameSection(sections('leads', ['Conference Attendee Lists', 'Event RSVPs', 'Target Accounts'], LEAD_FIELDS), 'leads-target-accounts', 'Target Accounts with Interaction'),
    conferenceScorecard: [{ id: 'conf-scorecard', title: 'Conference Scorecard', fields: SCORECARD_FIELDS, entries: SCORECARD_ROWS }],
    externalConferences: PLANNED_CONFERENCES.map((c) => newConference(c.id, c.title, c.plan)),
    socialPlan: [{ id: 'social-events', title: 'Event Social Plan', fields: SOCIAL_FIELDS, entries: SOCIAL_PLAN }],
    eventsImportVersion: 4,
    industryVersion: 1,
    eventsNyc: withEvents(sections('nyc', ['External Events', 'Internal Events'], EXTERNAL_EVENT_FIELDS), NYC_EXTERNAL_EVENTS, NYC_INTERNAL_EVENTS),
    eventsFunnelVersion: 7,
    eventsNycFunnel: seedEventsFunnel('nyc'),
    eventsSfFunnel: seedEventsFunnel('sf'),
    partnershipsVersion: 5,
    partnerships: seedPartnerships(),
    eventsSf: withEvents(sections('sf', ['External Events', 'Internal Events'], EXTERNAL_EVENT_FIELDS), SF_EXTERNAL_EVENTS, SF_INTERNAL_EVENTS),
    pageNotes: {
      documentation: '',
      partnerships: '',
      leadLists: '',
      externalConferences: '',
      eventsNyc: '',
      eventsSf: '',
      roadmap: '',
      socialPlan: '',
    },
  };
}
