import { addDays, todayISO, uid } from './utils.js';
import { NYC_EXTERNAL_EVENTS, SF_EXTERNAL_EVENTS } from './eventImports.js';

// Same columns as the ElevenLabs Inbound Leads table, with "User Name" as "Lead Name".
const YES_NO_OPTIONS = ['', 'Yes', 'No'];

export const LEAD_FIELDS = [
  { key: 'company', label: 'Company' },
  { key: 'leadName', label: 'Lead Name' },
  { key: 'source', label: 'Source', type: 'select', options: ['', 'Email', 'LinkedIn Ads', 'Google Ads', 'SEO/AEO', 'Reddit', 'Newsletter', 'Referral', 'Website', 'Other'] },
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

const STATUS_OPTIONS = ['', 'Not Started', 'In Progress', 'Done'];

const CONFERENCE_STAGES = [
  {
    key: 'pre', title: 'Pre-Conference Prep',
    fields: [
      { key: 'item', label: 'Item' },
      { key: 'details', label: 'Details' },
      { key: 'owner', label: 'Owner' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    ],
  },
  {
    key: 'logistics', title: 'Conference Logistics',
    fields: [
      { key: 'item', label: 'Item' },
      { key: 'details', label: 'Details' },
      { key: 'owner', label: 'Owner' },
      { key: 'cost', label: 'Cost' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    ],
  },
  {
    key: 'post', title: 'Post-Conference',
    fields: [
      { key: 'item', label: 'Item' },
      { key: 'details', label: 'Details' },
      { key: 'owner', label: 'Owner' },
      { key: 'dueDate', label: 'Due Date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: STATUS_OPTIONS },
    ],
  },
];

/* A conference group: its title plus one empty table per stage. */
export function newConference(id, title) {
  return {
    id, title,
    sections: CONFERENCE_STAGES.map((stage) => ({
      id: `${id}-${stage.key}`,
      title: stage.title,
      fields: stage.fields,
      entries: [],
    })),
  };
}

export const CANDIDATE_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'idealRole', label: 'Ideal Role' },
  { key: 'currentCompany', label: 'Current Company' },
  { key: 'linkedin', label: 'Link to LinkedIn' },
  { key: 'interactions', label: 'Interactions with Extend' },
];

export const EVENT_FIELDS = [
  { key: 'eventName', label: 'Event Name', width: 260 },
  // Text, not a date picker: imported dates include ranges like "Oct 13–15".
  { key: 'date', label: 'Date', width: 200 },
  { key: 'lumaLink', label: 'Link to Luma' },
  { key: 'expectedAttendees', label: 'Number of Attendees Expected' },
  { key: 'currentAttendees', label: 'Current Number of Attendees' },
  { key: 'targetAudience', label: 'Target Audience', width: 420 },
  { key: 'checklistLink', label: 'Event Checklist Link' },
];

function sections(prefix, titles, fields) {
  return titles.map((title) => ({
    id: `${prefix}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    title,
    fields,
    entries: [],
  }));
}

/* Fills an events page's External Events section with the imported events. */
function withExternalEvents(pageSections, events) {
  pageSections[0].entries = events.map((e) => ({ ...e }));
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

/* ---------- Recruitment Funnel (copied from the ElevenLabs Recruitment page) ---------- */

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

function seedRecruitmentFunnel() {
  return [
    {
      id: 'rec-total',
      title: 'Total',
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: null, values: {} },
        { id: 'm2', label: 'Interview Booked (%)', target: null, values: {} },
        { id: 'm3', label: 'Interview Booked (#)', target: null, values: {} },
      ],
    },
  ];
}

/* Event Attendance and Partnership Events, moved from the Recruitment Funnel; NYC and SF each get their own copy. */
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
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: 100, values: {} },
        { id: 'm2', label: 'Interview Booked (%)', target: '20%', values: {} },
        { id: 'm3', label: 'Interview Booked (#)', target: 20, values: {} },
      ],
    },
    {
      id: `${prefix}-partnerships`,
      title: 'Partnership Events',
      entities: [
        { name: 'Corgi', links: [] },
        { name: 'Verci', links: [] },
        { name: 'General Intelligence Company of New York', links: [] },
        { name: 'Anti Roch', links: [] },
        { name: 'Ramp', links: [] },
        { name: 'Clay', links: [] },
        { name: 'Brex', links: [] },
        { name: '222', links: [] },
      ],
      metrics: [
        { id: 'm1', label: 'Leads (#)', target: '40 per event', values: {} },
        { id: 'm2', label: 'Interview Booked (%)', target: '37.5%', values: {} },
        { id: 'm3', label: 'Interview Booked (#)', target: '15 per event', values: {} },
      ],
    },
  ];
}

/* ---------- Roadmap (opened from the header target) ---------- */

export const TEAMS = [
  { id: 'team-a', name: 'Team A', color: '#6c8cff' },
  { id: 'team-b', name: 'Team B', color: '#ef6f6c' },
  { id: 'team-c', name: 'Team C', color: '#57c785' },
];

export const PEOPLE = [
  { id: 'p1', name: 'Alex', role: 'Engineer', teamId: 'team-a' },
  { id: 'p2', name: 'Sam', role: 'Engineer', teamId: 'team-a' },
  { id: 'p3', name: 'Taylor', role: 'Engineer', teamId: 'team-a' },
  { id: 'p4', name: 'Jordan', role: 'Product Manager', teamId: 'team-a' },
  { id: 'p5', name: 'Riley', role: 'Designer', teamId: 'team-a' },
  { id: 'p6', name: 'Casey', role: 'Product Manager', teamId: 'team-b' },
  { id: 'p7', name: 'Morgan', role: 'Designer', teamId: 'team-b' },
  { id: 'p8', name: 'Drew', role: 'Engineer', teamId: 'team-b' },
  { id: 'p9', name: 'Blake', role: 'Engineer', teamId: 'team-b' },
  { id: 'p10', name: 'Quinn', role: 'Product Manager', teamId: 'team-c' },
  { id: 'p11', name: 'Sage', role: 'Designer', teamId: 'team-c' },
  { id: 'p12', name: 'Reese', role: 'Engineer', teamId: 'team-c' },
];

export const INITIATIVES = [
  { id: 'init-1', name: 'Initiative 1', teamId: 'team-a', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
  { id: 'init-2', name: 'Initiative 2', teamId: 'team-b', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
  { id: 'init-3', name: 'Initiative 3', teamId: 'team-c', goalLabel: 'Reach target', current: 0, target: 100, unit: '%' },
];

const TASK_STATUSES = ['Backlog', 'Ready', 'In progress', 'In design', 'Committed', 'Done'];

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function seedTasks() {
  const tasks = [];
  INITIATIVES.forEach((init) => {
    const teamPeople = PEOPLE.filter((p) => p.teamId === init.teamId);
    const count = randomInt(2, 4);
    for (let i = 1; i <= count; i++) {
      const startOffset = randomInt(-21, 45);
      const duration = randomInt(3, 12);
      const assignee = teamPeople.length ? teamPeople[randomInt(0, teamPeople.length - 1)] : null;
      tasks.push({
        id: uid('task'),
        title: `Task ${i}`,
        description: 'Example task description — replace with the real scope of work.',
        impact: 'Example impact statement.',
        status: TASK_STATUSES[randomInt(0, TASK_STATUSES.length - 1)],
        assigneeId: assignee ? assignee.id : null,
        startDate: addDays(todayISO(), startOffset),
        endDate: addDays(todayISO(), startOffset + duration),
        designDeadline: '',
        sectionId: init.id,
        teamId: init.teamId,
        client: '',
        createdBy: 'You',
        blockedBy: [],
        subtasks: [],
        comments: [],
      });
    }
  });
  return tasks;
}

function seedMilestones() {
  return [
    { id: 'ms1', date: addDays(todayISO(), -30), title: 'Milestone 1', teamId: 'team-a' },
    { id: 'ms2', date: addDays(todayISO(), -10), title: 'Milestone 2', teamId: 'team-b' },
    { id: 'ms3', date: addDays(todayISO(), 20), title: 'Milestone 3', teamId: 'team-c' },
    { id: 'ms4', date: addDays(todayISO(), 60), title: 'Milestone 4', teamId: 'team-a' },
  ];
}

function seedOkrs() {
  return [
    {
      id: 'okr-company', objective: 'Sector Objective 1', teamId: null,
      keyResults: [
        { id: 'kr-co-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 90), assigneeIds: [] },
        { id: 'kr-co-2', title: 'Key result 2', current: 0, target: 100, deadline: addDays(todayISO(), 60), assigneeIds: [] },
      ],
    },
    {
      id: 'okr-1', objective: 'Objective 1', teamId: 'team-a',
      keyResults: [
        { id: 'kr-1-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: ['p1', 'p4'] },
        { id: 'kr-1-2', title: 'Key result 2', current: 0, target: 100, deadline: addDays(todayISO(), 45), assigneeIds: ['p2'] },
      ],
    },
    {
      id: 'okr-2', objective: 'Objective 2', teamId: 'team-b',
      keyResults: [{ id: 'kr-2-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: ['p6', 'p8'] }],
    },
    {
      id: 'okr-3', objective: 'Objective 3', teamId: 'team-c',
      keyResults: [{ id: 'kr-3-1', title: 'Key result 1', current: 0, target: 100, deadline: addDays(todayISO(), 30), assigneeIds: ['p10', 'p12'] }],
    },
  ];
}

export function seedData() {
  const year = new Date().getFullYear();
  return {
    companyGoal: { title: 'EoY target', current: 0, target: 100, unit: '%', targetDate: `${year}-12-31` },
    schemaVersions: { events: 3, conferences: 4, leads: 2, recruitment: 4 },
    teams: TEAMS,
    people: PEOPLE,
    initiatives: INITIATIVES,
    milestones: seedMilestones(),
    okrs: seedOkrs(),
    tasks: seedTasks(),
    slackWebhookUrl: '',
    weeks: seedWeeks(),
    recruitmentFunnel: seedRecruitmentFunnel(),
    recruitmentCandidates: sections('rec', ['Candidates'], CANDIDATE_FIELDS),
    docs: seedDocs(),
    docsVersion: 4,
    leadLists: sections('leads', ['Conference Attendee Lists', 'Event RSVPs', 'Target Accounts'], LEAD_FIELDS),
    externalConferences: [newConference('conf-1', 'Conference Name')],
    eventsImportVersion: 1,
    eventsNyc: withExternalEvents(sections('nyc', ['External Events', 'Internal Events'], EVENT_FIELDS), NYC_EXTERNAL_EVENTS),
    eventsFunnelVersion: 2,
    eventsNycFunnel: seedEventsFunnel('nyc'),
    eventsSfFunnel: seedEventsFunnel('sf'),
    eventsSf: withExternalEvents(sections('sf', ['External Events', 'Internal Events'], EVENT_FIELDS), SF_EXTERNAL_EVENTS),
    pageNotes: {
      documentation: '',
      leadLists: '',
      recruitmentFunnel: 'This is to bring top-of-funnel talent towards Extend.\n\nA note on events: it’s much more interesting to do events in partnership with others, since it has the same impact with much less effort and time spent. For school partnerships, the goal is to create relationships early, so when there is very strong talent, it gets funneled to us quickly.\n\nTo create a successful funnel for Extend, there need to be multiple long-term relationships put in place. That’s why we’re looking at:\n\n• School partnerships for newcomers\n• Event sponsorships for those already in the ecosystem\n• Event attendance, to really understand who we are getting in front of and whether we are getting in front of the right people — whether that is a potential employee of a future client, or our own future employee\n• Event partnerships, as our ICPs converge\n• Companies to track employees at, as these would be recruiting for more senior roles with the same level of intensity and grit as Extend\n• The count from overview leads into interview booked, and the delta between them',
      externalConferences: '',
      eventsNyc: '',
      eventsSf: '',
      roadmap: '',
    },
  };
}
