import { addDays, todayISO, uid } from './utils.js';

export const LEAD_FIELDS = [
  { key: 'name', label: 'Name' },
  { key: 'company', label: 'Company' },
  { key: 'title', label: 'Title' },
  { key: 'email', label: 'Email' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'source', label: 'Source' },
  { key: 'status', label: 'Status', type: 'select', options: ['', 'New', 'Contacted', 'Meeting Booked', 'Opportunity', 'Not a Fit'] },
  { key: 'owner', label: 'Owner' },
  { key: 'notes', label: 'Notes' },
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
    items: ['Dates', 'Location', 'Goals', 'Target Accounts', 'Meetings Pre-Booked', 'Materials Needed'],
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
    items: ['Extend Team Attending', 'Tickets', 'Travel', 'Hotel', 'Booth / Space', 'Shipping & Swag'],
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
    items: ['Leads Collected', 'Meetings Held', 'Follow-Up Sent', 'Pipeline Generated', 'Total Cost', 'Takeaways', 'Attend Again?'],
  },
];

/* A conference group: its title plus one table per stage, pre-filled with the standard items. */
export function newConference(id, title) {
  return {
    id, title,
    sections: CONFERENCE_STAGES.map((stage) => ({
      id: `${id}-${stage.key}`,
      title: stage.title,
      fields: stage.fields,
      entries: stage.items.map((item, i) => {
        const row = { id: `${id}-${stage.key}-${i + 1}` };
        stage.fields.forEach((f) => { row[f.key] = ''; });
        row.item = item;
        return row;
      }),
    })),
  };
}

export const EVENT_FIELDS = [
  { key: 'event', label: 'Event' },
  { key: 'attendees', label: 'Number of Attendees' },
  { key: 'icpOverlap', label: 'ICP Overlap with Extend' },
  { key: 'status', label: 'Status', type: 'select', options: ['', 'Considering', 'Planned', 'Confirmed', 'Completed', 'Cancelled'] },
  { key: 'teamAttending', label: 'Extend Team Attending' },
]

function sections(prefix, titles, fields) {
  return titles.map((title) => ({
    id: `${prefix}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
    title,
    fields,
    entries: [],
  }));
}

function docList(id, title, titles) {
  return {
    id, title,
    entries: titles.map((t, i) => ({ id: `${id}-${i + 1}`, title: t, url: '', notes: '' })),
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
    schemaVersions: { events: 2, conferences: 3 },
    teams: TEAMS,
    people: PEOPLE,
    initiatives: INITIATIVES,
    milestones: seedMilestones(),
    okrs: seedOkrs(),
    tasks: seedTasks(),
    slackWebhookUrl: '',
    docs: seedDocs(),
    leadLists: sections('leads', ['Conference Attendee Lists', 'Event RSVPs', 'Target Accounts'], LEAD_FIELDS),
    externalConferences: [newConference('conf-1', 'Conference Name')],
    eventsNyc: sections('nyc', ['External Events', 'Internal Events'], EVENT_FIELDS),
    eventsSf: sections('sf', ['External Events', 'Internal Events'], EVENT_FIELDS),
    pageNotes: {
      documentation: '',
      leadLists: '',
      externalConferences: '',
      eventsNyc: '',
      eventsSf: '',
      roadmap: '',
    },
  };
}
