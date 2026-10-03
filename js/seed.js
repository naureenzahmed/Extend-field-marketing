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

export function seedData() {
  const year = new Date().getFullYear();
  return {
    companyGoal: { title: 'EoY target', current: 0, target: 100, unit: '%', targetDate: `${year}-12-31` },
    schemaVersions: { events: 2, conferences: 3 },
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
    },
  };
}
