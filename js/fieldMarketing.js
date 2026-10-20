/* Field-marketing content for Extend (AI document processing; customers in finance, health care,
   real estate and logistics; audience: AI and developer teams). Budgets, costs, meetings and scores
   below are planning estimates to adjust, not quotes. */

/* ---------- Events pages ---------- */

export const EVENT_FORMATS = ['Conference', 'Demo Day', 'Founder Dinner', 'Meetup / Talk', 'Hackathon / Build Night', 'Community Event'];

const FORMAT_FIELD = { key: 'format', label: 'Format', type: 'select', options: ['', ...EVENT_FORMATS] };
// Extend's own events are never conferences, so Internal Events has no Conference format (or group).
const INTERNAL_FORMAT_FIELD = { ...FORMAT_FIELD, options: FORMAT_FIELD.options.filter((f) => f !== 'Conference') };
const CO_HOST_FIELDS = [
  { key: 'coHost', label: 'Co-host', width: 150 },
  { key: 'coHostIncentive', label: 'Co-host Incentive', width: 300 },
  { key: 'poc', label: 'Potential POC', width: 200 },
];
// Leads and Meetings Booked are counted from Lead Lists rows whose Source Event matches the Event Name.
const FUNNEL_FIELDS = [
  { key: 'expectedAttendees', label: 'Number of Attendees Expected' },
  { key: 'currentAttendees', label: 'Current Number of Attendees' },
  { key: 'attended', label: 'Attended' },
  { key: 'leadsFromEvent', label: 'Leads (from Lead Lists)', type: 'computed' },
  { key: 'meetingsFromEvent', label: 'Meetings Booked (from Lead Lists)', type: 'computed' },
  { key: 'pipeline', label: 'Pipeline ($)' },
];

export const EXTERNAL_EVENT_FIELDS = [
  { key: 'eventName', label: 'Event Name', width: 260 },
  FORMAT_FIELD,
  { key: 'date', label: 'Date', width: 200 },
  { key: 'companyName', label: 'Company Name', width: 180 },
  { key: 'targetAudience', label: 'Target Audience', width: 420 },
  { key: 'lumaLink', label: 'Link to Luma' },
  ...FUNNEL_FIELDS,
  ...CO_HOST_FIELDS,
  { key: 'checklistLink', label: 'Event Checklist Link' },
];

export const INTERNAL_EVENT_FIELDS = [
  { key: 'eventName', label: 'Event Name', width: 230 },
  { key: 'pitch', label: 'One-line Pitch', width: 420 },
  INTERNAL_FORMAT_FIELD,
  { key: 'date', label: 'Date', width: 140 },
  ...CO_HOST_FIELDS,
  { key: 'budget', label: 'Budget (est.)', width: 200 },
  { key: 'goal', label: 'Goal', width: 260 },
  { key: 'targetAudience', label: 'Target Audience', width: 260 },
  { key: 'lumaLink', label: 'Link to Luma' },
  ...FUNNEL_FIELDS,
  { key: 'checklistLink', label: 'Event Checklist Link' },
];

// Format for each imported external event, from the spreadsheet's Type column.
export const EXTERNAL_EVENT_FORMATS = {
  'nyc-ext-1': 'Meetup / Talk', 'nyc-ext-2': 'Conference', 'nyc-ext-3': 'Meetup / Talk', 'nyc-ext-4': 'Demo Day',
  'nyc-ext-5': 'Conference', 'nyc-ext-6': 'Conference', 'nyc-ext-7': 'Conference', 'nyc-ext-8': 'Conference',
  'nyc-ext-9': 'Conference', 'nyc-ext-10': 'Conference', 'nyc-ext-11': 'Conference', 'nyc-ext-12': 'Demo Day',
  'sf-ext-1': 'Meetup / Talk', 'sf-ext-2': 'Demo Day', 'sf-ext-3': 'Conference', 'sf-ext-4': 'Conference',
  'sf-ext-5': 'Conference', 'sf-ext-6': 'Conference', 'sf-ext-7': 'Conference', 'sf-ext-8': 'Conference',
  'sf-ext-9': 'Conference', 'sf-ext-10': 'Conference', 'sf-ext-11': 'Demo Day',
};

function idea(id, eventName, pitch, format, coHost, coHostIncentive, poc, budget, goal, targetAudience, companyName = '') {
  return {
    id, eventName, pitch, format, coHost, coHostIncentive, poc, budget, goal, targetAudience, companyName,
    date: '', lumaLink: '', expectedAttendees: '', currentAttendees: '', attended: '', pipeline: '', checklistLink: '',
  };
}

// Co-hosts are suggestions from the Partnerships page; POCs are the role to reach, not a named person.
export const SF_INTERNAL_EVENTS = [
  idea('sf-int-8', 'Board Games + Late-Night Build', 'Board games early, then heads-down building until late, with demos at the end.', 'Hackathon / Build Night',
    'Supabase', 'Developers building on their stack; credits as prizes', 'Developer relations lead', '$1,200 (venue, food, prizes)', '40 builders · 15 signups · 3 meetings', 'Developers and technical founders'),
  idea('sf-int-11', 'Design Your Own Mechanical Keyboard', 'Build-your-own keyboard night with a wall of unique keycaps to customize with.', 'Hackathon / Build Night',
    'Vercel', 'Developer brand moment; splits the mid-size budget', 'Developer relations lead', '$3,000, split with co-host (kits, keycaps)', '30 builders · 12 signups · 3 meetings', 'Developers and technical founders'),
];

export const NYC_INTERNAL_EVENTS = [
  idea('nyc-int-2', 'Raspberry Pi Night', 'Builders night: 3 hours building with Raspberry Pis (about $40 per unit on average), 1 hour of demos, 2 hours networking with berry pies.', 'Hackathon / Build Night',
    'Betaworks', 'Builder programming for their studio space', 'Programming / events lead', '$2,500 (40 Pis at ~$40, food, pies)', '40 builders · 15 signups · 4 meetings', 'Builders'),
];

// Internal event ids that were removed from the plan.
export const REMOVED_INTERNAL_EVENT_IDS = ['sf-int-6']; // Dinner at the Computer History Museum (Mountain View)

// Everything whose main audience isn't technical / software people (investors, enterprise buyers,
// general founders and operators) is out of the plan.
export const NON_TECHNICAL = {
  events: [
    'nyc-ext-4', 'nyc-ext-11', 'nyc-ext-12', 'sf-ext-1', 'sf-ext-2', 'sf-ext-3', 'sf-ext-8', 'sf-ext-11',
    'sf-int-1', 'sf-int-2', 'sf-int-3', 'sf-int-4', 'sf-int-5', 'sf-int-7', 'sf-int-9', 'sf-int-10',
    'nyc-int-1', 'nyc-int-3', 'nyc-int-4',
  ],
  scorecard: ['sc-5', 'sc-14'],
  social: ['soc-5', 'soc-6', 'soc-7'],
  tasks: ['rt-9', 'rt-10'],
  milestones: ['ms-yc'],
};

/* Weekly metrics for Event Attendance and Partnerships (replacing recruiting metrics). */
export function eventFunnelMetrics() {
  return [
    { id: 'rsvps', label: 'RSVPs', target: 100, values: {} },
    { id: 'attended', label: 'Attended', target: 60, values: {} },
    { id: 'signups', label: 'Product Signups', target: 20, values: {} },
    { id: 'meetings', label: 'Meetings Booked', target: 5, values: {} },
    { id: 'cpm', label: 'Cost per Meeting ($)', target: '< $300', values: {} },
  ];
}

export function partnershipFunnelMetrics() {
  return [
    { id: 'cohosted', label: 'Co-hosted Events', target: '1 per quarter', values: {} },
    { id: 'attendees', label: 'Attendees', target: 60, values: {} },
    { id: 'signups', label: 'Product Signups', target: 15, values: {} },
    { id: 'meetings', label: 'Meetings Booked', target: 4, values: {} },
  ];
}

/* ---------- External Conferences: scorecard ---------- */

export const SCORECARD_FIELDS = [
  { key: 'conference', label: 'Conference', width: 230 },
  { key: 'city', label: 'City' },
  { key: 'dates', label: 'Dates', width: 170 },
  { key: 'expectedAttendees', label: 'Expected Attendees' },
  { key: 'estDevelopers', label: 'Est. Developers' },
  { key: 'icpFit', label: 'ICP Fit (1–5)', type: 'select', options: ['', '1', '2', '3', '4', '5'] },
  { key: 'estCost', label: 'Est. Cost ($)' },
  { key: 'expectedMeetings', label: 'Expected Meetings' },
  { key: 'costPerMeeting', label: 'Cost per Meeting', type: 'computed' },
  { key: 'sponsorshipTier', label: 'Sponsorship Tier', type: 'select', options: ['', 'Attend only', 'Side event', 'Booth', 'Booth + talk', 'Speaking'] },
  { key: 'cfpDeadline', label: 'Speaking CFP Deadline' },
  { key: 'score', label: 'Score (/10)', type: 'computed' },
  { key: 'decision', label: 'Decision', type: 'select', options: ['', 'Go', 'Maybe', 'No'] },
];

export const SCORECARD_NOTE = 'EXAMPLE Score (/10) = ICP fit (1–5) + cost per meeting (≤ $300: 3, ≤ $600: 2, ≤ $1,200: 1) + reach (≥ 2,000 developers: 2, ≥ 700: 1). ICP fit, cost and meetings are planning estimates.';

function scored(id, conference, city, dates, expectedAttendees, estDevelopers, icpFit, estCost, expectedMeetings, sponsorshipTier, decision) {
  return { id, conference, city, dates, expectedAttendees, estDevelopers, icpFit, estCost, expectedMeetings, sponsorshipTier, cfpDeadline: '', decision };
}

// Upcoming conferences from SF_NYC_Dev_and_Startup_Events_2026.xlsx (attendees and developers from the sheet).
export const SCORECARD_ROWS = [
  scored('sc-1', 'Next.js Conf 2026', 'San Francisco', 'Oct 22', '1,000', '850', '2', '2,500', '4', 'Attend only', 'No'),
  scored('sc-2', 'GitHub Universe 2026', 'San Francisco', 'Oct 28–29', '4,000', '2,800', '4', '15,000', '25', 'Booth', 'Go'),
  scored('sc-3', 'OWASP Global AppSec USA', 'San Francisco', 'Nov 2–6', '800', '600', '2', '3,000', '3', 'Attend only', 'No'),
  scored('sc-4', 'AI Engineer Code Summit 2026', 'San Francisco', 'Nov 10–12', '1,500', '1,280', '5', '20,000', '40', 'Booth + talk', 'Go'),
  scored('sc-6', 'QCon San Francisco 2026', 'San Francisco', 'Nov 16–18', '1,500', '1,280', '3', '6,000', '6', 'Attend only', 'No'),
  scored('sc-7', 'Microsoft Ignite 2026', 'San Francisco', 'Nov 17–20', '15,000', '5,250', '3', '7,000', '8', 'Attend only', 'No'),
  scored('sc-8', 'AI Native DevCon New York 2026', 'New York', 'Nov 2–4', '', '', '4', '4,000', '10', 'Attend only', 'Maybe'),
  scored('sc-9', 'Open Source in Finance Forum New York', 'New York', 'Nov 4–5', '', '', '4', '3,000', '8', 'Attend only', 'Maybe'),
  scored('sc-10', 'JSNation US 2026', 'Jersey City (NYC area)', 'Nov 16', '700', '670', '2', '2,000', '3', 'Attend only', 'No'),
  scored('sc-11', 'AI Coding Summit NYC', 'New York', 'Nov 16–17', '', '', '3', '2,500', '6', 'Attend only', 'No'),
  scored('sc-12', 'React Summit US 2026', 'Jersey City (NYC area)', 'Nov 17', '800', '760', '2', '2,000', '3', 'Attend only', 'No'),
  scored('sc-13', 'AI Dev NYC 2026 (DeepLearning.AI)', 'New York', 'Nov 30 – Dec 1', '2,500', '2,250', '5', '12,000', '30', 'Booth', 'Go'),
];

/* ---------- External Conferences: planned conferences, end to end ---------- */

const STATUS = ['', 'Not Started', 'In Progress', 'Done'];

// Owns all content: social teasers, swag, live clips and recap posts, at every event.
export const HEAD_OF_CONTENT = 'Bo';

export const CONFERENCE_STAGES = [
  {
    key: 'pre', title: '1 · Pre-Conference Prep',
    fields: [
      { key: 'workstream', label: 'Workstream', width: 170 },
      { key: 'task', label: 'Task', width: 380 },
      { key: 'owner', label: 'Owner' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS },
    ],
  },
  {
    key: 'logistics', title: '2 · Booth Build & Shipping',
    fields: [
      { key: 'item', label: 'Item', width: 200 },
      { key: 'details', label: 'Vendor / Details', width: 340 },
      { key: 'owner', label: 'Owner' },
      { key: 'dueDate', label: 'Ship-by / Due', type: 'date' },
      { key: 'cost', label: 'Cost (est.)' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS },
    ],
  },
  {
    key: 'staffing', title: '3 · Staffing',
    fields: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role', width: 200 },
      { key: 'shift', label: 'Shift', width: 200 },
      { key: 'responsibilities', label: 'Responsibilities', width: 380 },
    ],
  },
  {
    key: 'runOfShow', title: '4 · Run-of-Show',
    fields: [
      { key: 'time', label: 'Time' },
      { key: 'activity', label: 'Activity', width: 380 },
      { key: 'owner', label: 'Owner' },
      { key: 'location', label: 'Location', width: 180 },
      { key: 'notes', label: 'Notes', width: 260 },
    ],
  },
  {
    key: 'post', title: '5 · Post-Conference Follow-Up',
    fields: [
      { key: 'step', label: 'Step', width: 380 },
      { key: 'timing', label: 'Timing' },
      { key: 'owner', label: 'Owner' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS },
    ],
  },
];

// Template rows for a new conference: the workstreams and follow-up steps every conference needs.
const PRE_TEMPLATE = [
  ['Event selection', 'Score on the scorecard; confirm Go and budget sign-off'],
  ['Sponsorship', 'Sign sponsorship / booth contract'],
  ['Speaking', 'Submit a talk or lightning demo to the CFP'],
  ['Booth / activation', 'Finalize booth concept and vendor'],
  ['Meeting generation', 'Pre-book meetings with Target Accounts with Interaction'],
  ['Collateral', 'One-pager, demo script, QR code to sign up'],
  ['Lead capture', 'Badge scanning set up to land in Lead Lists with Source Event'],
  ['Social', 'Teaser post and side-event Luma (see Social & Content)'],
];
const POST_TEMPLATE = [
  ['Upload badge scans to Lead Lists with Source Event set', 'Day 0 (same night)'],
  ['Personal follow-up to every booth conversation', 'Day 1'],
  ['Recap post with photos and clips', 'Day 2'],
  ['Second touch: offer a demo to engaged leads', 'Day 3'],
  ['Check meetings booked vs. scorecard estimate', 'Day 7'],
  ['Results review: cost per meeting, pipeline, go again next year?', 'Day 14'],
];

const day = (iso, n) => {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

function stageRows(confId, key, rows) {
  return rows.map((row, i) => ({ id: `${confId}-${key}-${i + 1}`, ...row }));
}

export function newConference(id, title, plan = null) {
  const rows = plan?.rows || {
    pre: PRE_TEMPLATE.map(([workstream, task]) => ({ workstream, task, owner: '', dueDate: '', status: 'Not Started' })),
    post: POST_TEMPLATE.map(([step, timing]) => ({ step, timing, owner: '', dueDate: '', status: 'Not Started' })),
  };
  return {
    id, title,
    summary: plan?.summary || {},
    sections: CONFERENCE_STAGES.map((stage) => ({
      id: `${id}-${stage.key}`, title: stage.title, fields: stage.fields, entries: stageRows(id, stage.key, rows[stage.key] || []),
    })),
  };
}

function plannedConference({ id, title, start, owners, summary, preOwners, booth, shipBy, sideEvent, talk, staff }) {
  const [lead, meetings, content, demo] = owners;
  const pre = PRE_TEMPLATE.map(([workstream, task], i) => ({
    workstream, task, owner: workstream === 'Social' ? HEAD_OF_CONTENT : preOwners[i] || lead, dueDate: day(start, [-14, -12, -10, -10, -3, -5, -4, -7][i]), status: 'Not Started',
  }));
  const logistics = [
    { item: 'Booth kit', details: booth, owner: lead, dueDate: day(start, -10), cost: '$6,000', status: 'Not Started' },
    { item: 'Ship booth kit to venue', details: `Ship by ${shipBy}; keep tracking number in the checklist`, owner: lead, dueDate: day(start, -7), cost: '$1,200', status: 'Not Started' },
    { item: 'Swag', details: 'Small, useful and on-brand: notebooks printed with parsed-document art, stickers', owner: HEAD_OF_CONTENT, dueDate: day(start, -9), cost: '$1,500', status: 'Not Started' },
    { item: 'Power, wifi and lead scanners', details: 'Order from the venue; test on build day', owner: demo, dueDate: day(start, -7), cost: '$800', status: 'Not Started' },
    { item: 'Travel', details: 'Flights / trains for the staffed team', owner: lead, dueDate: day(start, -14), cost: '$2,000', status: 'Not Started' },
    { item: 'Hotel', details: 'Rooms near the venue for all event nights', owner: lead, dueDate: day(start, -14), cost: '$2,500', status: 'Not Started' },
  ];
  const runOfShow = [
    { time: '07:30', activity: 'Booth check: screens, power, wifi, demo laptops', owner: demo, location: 'Booth', notes: '' },
    { time: '08:30', activity: 'Team huddle: targets, talk tracks, meeting schedule', owner: lead, location: 'Booth', notes: '' },
    { time: '09:00', activity: 'Doors open; booth staffed (2 on demos, 1 on lead capture)', owner: lead, location: 'Booth', notes: '' },
    { time: '10:00–12:00', activity: 'Pre-booked meetings block', owner: meetings, location: 'Meeting area', notes: '' },
    { time: '12:30', activity: 'Staggered lunch rotation', owner: lead, location: 'Booth', notes: 'Booth never below 2 people' },
    { time: '13:00', activity: talk || 'Live demo: parse any document in 60 seconds', owner: demo, location: talk ? 'Main stage' : 'Booth', notes: '' },
    { time: '15:00', activity: 'Post a booth clip and day-one highlight', owner: HEAD_OF_CONTENT, location: 'Booth', notes: `Filmed on site by ${content}; see Social & Content` },
    { time: '17:00', activity: 'Doors close; upload scans to Lead Lists', owner: meetings, location: 'Booth', notes: '' },
    { time: '18:30', activity: sideEvent, owner: lead, location: 'Nearby venue', notes: '' },
  ];
  const post = POST_TEMPLATE.map(([step, timing], i) => ({
    step, timing, owner: '', dueDate: day(start, [0, 1, 2, 3, 7, 14][i] + 1), status: 'Not Started',
  }));
  return { id, title, plan: { summary, rows: { pre, logistics, staffing: staff, runOfShow, post } } };
}

const staffRow = (name, role, shift, responsibilities) => ({ name, role, shift, responsibilities });

// Staffed by the Conference A, B and C teams from the Roadmap.
export const PLANNED_CONFERENCES = [
  plannedConference({
    id: 'conf-github-universe', title: 'GitHub Universe 2026 (SF, Oct 28–29)', start: '2026-10-28',
    owners: ['Andrew', 'Sophia', 'Shruthi', 'James'],
    preOwners: ['Andrew', 'Andrew', 'James', 'Andrew', 'Sophia', 'Joseph', 'Richard', 'Shruthi'],
    summary: {
      eventSummary: "GitHub's flagship developer conference at Fort Mason: Copilot, agentic coding, DevOps and security. About 4,000 attendees, ~70% developers.",
      participationSummary: 'Startup booth with a live "parse any document" demo, a pre-booked meeting block, and a founder dinner on night one. Staffed by the Conference A team.',
      targetGoal: '25 meetings booked · 150 product signups · cost per meeting under $600.',
    },
    booth: '10×10 startup booth: backwall, counter, two demo screens (rental vendor via GitHub expo)',
    shipBy: 'Oct 21', sideEvent: 'Founder dinner for 12 developer-tools founders', talk: '',
    staff: [
      staffRow('Andrew', 'Booth lead', 'Both days, all day', 'Run the booth, huddles, staffing gaps'),
      staffRow('James', 'Demo engineer', 'Both days, 9:00–15:00', 'Live demos, technical questions'),
      staffRow('Sophia', 'Meetings lead', 'Both days, 10:00–17:00', 'Pre-booked meetings, booking follow-ups'),
      staffRow('Joseph', 'Lead capture', 'Day 1, all day', 'Badge scans, qualifying notes'),
      staffRow('Richard', 'Lead capture', 'Day 2, all day', 'Badge scans, qualifying notes'),
      staffRow('Shruthi', 'Content / social', 'Both days, floating', 'Clips, posts, recap'),
    ],
  }),
  plannedConference({
    id: 'conf-ai-engineer-code', title: 'AI Engineer Code Summit 2026 (SF, Nov 10–12)', start: '2026-11-10',
    owners: ['Bo', 'Victor', 'Devin', 'Harvey'],
    preOwners: ['Bo', 'Bo', 'Harvey', 'Bo', 'Victor', 'Jack', 'Jack', 'Devin'],
    summary: {
      eventSummary: 'Coding agents and developer tools at the Hilton Union Square: AI engineers, researchers and founders. 1,500+ in person, ~85% developers.',
      participationSummary: 'Booth plus a talk submission on document agents in production, a meeting block each morning, and an evening build session. Staffed by the Conference B team.',
      targetGoal: '40 meetings booked · 200 product signups · cost per meeting under $500.',
    },
    booth: '10×10 booth with a "drop a document" kiosk; two demo screens',
    shipBy: 'Nov 3', sideEvent: 'Evening build session with a co-host from Partnerships (Dev Tools)',
    talk: 'Talk (if accepted): Document agents in production',
    staff: [
      staffRow('Bo', 'Booth lead', 'All three days', 'Run the booth, huddles, staffing gaps'),
      staffRow('Harvey', 'Demo engineer / speaker', 'All three days, 9:00–15:00', 'Demos and the talk'),
      staffRow('Victor', 'Meetings lead', 'All three days, 10:00–17:00', 'Pre-booked meetings, booking follow-ups'),
      staffRow('Jack', 'Lead capture', 'Days 1–2', 'Badge scans, qualifying notes'),
      staffRow('Devin', 'Content / social', 'All three days, floating', 'Clips, posts, recap'),
    ],
  }),
  plannedConference({
    id: 'conf-ai-dev-nyc', title: 'AI Dev NYC 2026 (NYC, Nov 30 – Dec 1)', start: '2026-11-30',
    owners: ['Jing', 'Scott', 'Addison', 'Matthew'],
    preOwners: ['Jing', 'Jing', 'Matthew', 'Jing', 'Scott', 'Joon', 'Joon', 'Addison'],
    summary: {
      eventSummary: "DeepLearning.AI's hands-on AI engineering conference at Chelsea Piers, with 50+ labs. About 2,500 AI engineers and builders.",
      participationSummary: 'Booth in the expo hall plus a side event near Chelsea Piers on night one, close to Extend’s NYC home base. Staffed by the Conference C team.',
      targetGoal: '30 meetings booked · 175 product signups · cost per meeting under $400.',
    },
    booth: '10×10 booth: backwall, counter, two demo screens (NYC vendor)',
    shipBy: 'Nov 20', sideEvent: 'Side event: AI builders happy hour near Chelsea Piers', talk: '',
    staff: [
      staffRow('Jing', 'Booth lead', 'Both days, all day', 'Run the booth, huddles, staffing gaps'),
      staffRow('Matthew', 'Demo engineer', 'Both days, 9:00–15:00', 'Live demos, technical questions'),
      staffRow('Scott', 'Meetings lead', 'Both days, 10:00–17:00', 'Pre-booked meetings, booking follow-ups'),
      staffRow('Joon', 'Lead capture', 'Both days', 'Badge scans, qualifying notes'),
      staffRow('Addison', 'Content / social', 'Both days, floating', 'Clips, posts, recap'),
    ],
  }),
];

/* ---------- Social & Content ---------- */

export const SOCIAL_FIELDS = [
  { key: 'eventName', label: 'Event', width: 240 },
  { key: 'date', label: 'Date', width: 150 },
  { key: 'channels', label: 'Channels', width: 170 },
  { key: 'teaser', label: 'Pre-Event Teaser', width: 380 },
  { key: 'teaserDate', label: 'Teaser Date', type: 'date' },
  { key: 'lumaPage', label: 'Luma Page' },
  { key: 'contentToFilm', label: 'Content to Film', width: 340 },
  { key: 'contentOwner', label: 'Content Owner' },
  { key: 'whoPosts', label: 'Who Posts', width: 200 },
  { key: 'postLinks', label: 'Post Links' },
  { key: 'impressions', label: 'Impressions' },
  { key: 'follows', label: 'Follows' },
  { key: 'signupsFromPosts', label: 'Signups from Posts' },
];

function social(id, eventName, date, channels, teaser, teaserDate, contentToFilm, whoPosts) {
  return { id, eventName, date, channels, teaser, teaserDate, lumaPage: '', contentToFilm, contentOwner: HEAD_OF_CONTENT, whoPosts, postLinks: '', impressions: '', follows: '', signupsFromPosts: '' };
}

export const SOCIAL_PLAN = [
  social('soc-1', 'GitHub Universe 2026', 'Oct 28–29', 'X, LinkedIn', 'Bring your messiest PDF to our booth: we parse it live in 60 seconds.', '2026-10-21',
    '60-second live parse clips; booth timelapse; founder dinner moments', 'Shruthi (Extend), Andrew (personal)'),
  social('soc-2', 'AI Engineer Code Summit 2026', 'Nov 10–12', 'X, LinkedIn, YouTube', 'Talk announcement: document agents in production, plus a "drop a document" kiosk.', '2026-11-03',
    'Talk recording; kiosk reactions; build-session demos', 'Devin (Extend), Harvey (speaker)'),
  social('soc-3', 'AI Dev NYC 2026', 'Nov 30 – Dec 1', 'X, LinkedIn', 'NYC builders: Extend booth + happy hour by Chelsea Piers. RSVP on Luma.', '2026-11-23',
    'Booth demos; happy hour photos; one customer quote on video', 'Addison (Extend), Jing (personal)'),
  social('soc-4', 'Raspberry Pi Night (NYC)', '', 'X, Instagram, LinkedIn', 'Three hours, forty Raspberry Pis, one hour of demos. And pie.', '',
    'Build timelapse; demo highlight reel; co-host shout-out with Betaworks', 'Sydney (Extend), co-host account'),
];

/* ---------- Roadmap (opened from the header target) ---------- */

export const COMPANY_GOAL = { title: 'Meetings from events', current: 0, target: 150, unit: '', targetDate: '2026-12-31' };

export const ROADMAP_INITIATIVES = [
  { id: 'init-1', name: 'Conferences', teamId: 'team-a', goalLabel: 'Meetings booked at conferences', current: 0, target: 95, unit: '' },
  { id: 'init-2', name: 'Startup Community Events', teamId: 'team-b', goalLabel: 'Signups from community events', current: 0, target: 150, unit: '' },
  { id: 'init-3', name: 'Social & Content', teamId: 'team-c', goalLabel: 'Event post impressions (k)', current: 0, target: 100, unit: 'k' },
  { id: 'init-4', name: 'Partnerships & Co-hosting', teamId: 'team-d', goalLabel: 'Co-hosted events', current: 0, target: 6, unit: '' },
];

function task(id, title, sectionId, teamId, assigneeId, startDate, endDate, status, description, impact, blockedBy = []) {
  return {
    id, title, description, impact, status, assigneeId, startDate, endDate, designDeadline: '', sectionId, teamId,
    client: '', createdBy: 'You', blockedBy, subtasks: [], comments: [],
  };
}

export const ROADMAP_TASKS = [
  task('rt-1', 'GitHub Universe: booth kit + shipping', 'init-1', 'team-a', 'p1', '2026-10-14', '2026-10-21', 'In progress',
    'Confirm booth vendor, ship the kit by Oct 21, order power and scanners.', 'Booth is ready on build day; nothing figured out on site.'),
  task('rt-2', 'GitHub Universe: pre-book 25 meetings', 'init-1', 'team-a', 'p5', '2026-10-14', '2026-10-27', 'In progress',
    'Outreach to Target Accounts with Interaction attending GitHub Universe.', 'Most conference meetings are booked before the doors open.'),
  task('rt-3', 'GitHub Universe (Oct 28–29)', 'init-1', 'team-a', 'p9', '2026-10-28', '2026-10-29', 'Committed',
    'Run the booth, demos, meeting block and founder dinner.', 'First conference of the plan; sets the cost-per-meeting baseline.', ['rt-1', 'rt-2']),
  task('rt-4', 'AI Engineer Code Summit: talk + booth plan', 'init-1', 'team-b', 'p2', '2026-10-20', '2026-11-03', 'In progress',
    'Submit the document-agents talk, finalize the kiosk booth, ship by Nov 3.', 'Highest ICP fit conference in SF.'),
  task('rt-5', 'AI Engineer Code Summit (Nov 10–12)', 'init-1', 'team-b', 'p6', '2026-11-10', '2026-11-12', 'Ready',
    'Booth, talk (if accepted), meetings and the evening build session.', '40 meetings target.', ['rt-4']),
  task('rt-6', 'AI Dev NYC: booth + side event', 'init-1', 'team-c', 'p3', '2026-11-03', '2026-11-20', 'Backlog',
    'Book the NYC booth vendor and the Chelsea Piers happy hour venue.', 'Home-city conference with high ICP fit.'),
  task('rt-7', 'AI Dev NYC (Nov 30 – Dec 1)', 'init-1', 'team-c', 'p7', '2026-11-30', '2026-12-01', 'Backlog',
    'Booth, meetings, side event.', '30 meetings target.', ['rt-6']),
  task('rt-8', 'Raspberry Pi Night with Betaworks', 'init-2', 'team-b', 'p10', '2026-10-27', '2026-11-14', 'Ready',
    'Lock date and venue with Betaworks, order 40 Pis, open Luma.', 'Builder audience in NYC; strong content moment.'),
  task('rt-11', 'Teaser + recap posts for GitHub Universe', 'init-3', 'team-c', 'p2', '2026-10-21', '2026-10-31', 'In progress',
    'Teaser Oct 21, live clips during, recap Oct 31.', 'Turns one booth into reach beyond the hall.'),
  task('rt-12', 'Event recap template + posting cadence', 'init-3', 'team-c', 'p2', '2026-10-20', '2026-10-30', 'Ready',
    'Reusable recap post, clip checklist, and who posts what.', 'Every event gets posted the same way.'),
  task('rt-13', 'Pitch top 10 co-hosts', 'init-4', 'team-d', 'p4', '2026-10-20', '2026-11-06', 'In progress',
    'Use Partnerships and the Co-host columns on the events pages.', 'Co-hosting halves cost and doubles reach.'),
  task('rt-14', 'Sign 2 co-hosted events for November', 'init-4', 'team-d', 'p8', '2026-11-01', '2026-11-15', 'Backlog',
    'Confirm co-host, date, budget split and POC for two events.', 'First co-hosted events on the calendar.', ['rt-13']),
];

export const ROADMAP_MILESTONES = [
  { id: 'ms-github', date: '2026-10-28', title: 'GitHub Universe', teamId: 'team-a' },
  { id: 'ms-aie', date: '2026-11-10', title: 'AI Engineer Code Summit', teamId: 'team-b' },
  { id: 'ms-aidev', date: '2026-11-30', title: 'AI Dev NYC', teamId: 'team-c' },
];

const kr = (id, title, target, deadline, assigneeIds) => ({ id, title, current: 0, target, deadline, assigneeIds });

export const ROADMAP_OKRS = [
  {
    id: 'okr-company', objective: 'Make every startup know and think of Extend', teamId: null,
    keyResults: [
      kr('kr-co-1', 'Meetings booked from events', 150, '2026-12-31', []),
      kr('kr-co-2', 'Product signups from events', 1000, '2026-12-31', []),
    ],
  },
  {
    id: 'okr-1', objective: 'Run conferences that pay back', teamId: 'team-a',
    keyResults: [kr('kr-1-1', 'Meetings booked at the three planned conferences', 95, '2026-12-01', ['p1', 'p5'])],
  },
  {
    id: 'okr-2', objective: 'Activate the startup community in NYC and SF', teamId: 'team-b',
    keyResults: [kr('kr-2-1', 'Community events hosted', 8, '2026-12-31', ['p2', 'p10']), kr('kr-2-2', 'Founders attending', 300, '2026-12-31', ['p14'])],
  },
  {
    id: 'okr-3', objective: 'Make every event visible online', teamId: 'team-c',
    keyResults: [kr('kr-3-1', 'Event post impressions (thousands)', 100, '2026-12-31', ['p2'])],
  },
  {
    id: 'okr-4', objective: 'Co-host with partners', teamId: 'team-d',
    keyResults: [kr('kr-4-1', 'Co-hosted events', 6, '2026-12-31', ['p4', 'p8'])],
  },
];
