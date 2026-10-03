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

export const CONFERENCE_FIELDS = [
  { key: 'conference', label: 'Conference' },
  { key: 'startDate', label: 'Start Date', type: 'date' },
  { key: 'endDate', label: 'End Date', type: 'date' },
  { key: 'location', label: 'Location' },
  { key: 'website', label: 'Website' },
  { key: 'participation', label: 'Participation', type: 'select', options: ['', 'Attending', 'Sponsoring', 'Booth', 'Speaking'] },
  { key: 'cost', label: 'Cost' },
  { key: 'owner', label: 'Owner' },
  { key: 'notes', label: 'Notes' },
];

export const EVENT_FIELDS = [
  { key: 'event', label: 'Event' },
  { key: 'date', label: 'Date', type: 'date' },
  { key: 'venue', label: 'Venue' },
  { key: 'format', label: 'Format', type: 'select', options: ['', 'Dinner', 'Happy Hour', 'Breakfast', 'Panel', 'Workshop', 'Meetup', 'Other'] },
  { key: 'coHost', label: 'Co-host' },
  { key: 'targetAttendees', label: 'Target Attendees' },
  { key: 'rsvps', label: 'RSVPs' },
  { key: 'attended', label: 'Attended' },
  { key: 'budget', label: 'Budget' },
  { key: 'owner', label: 'Owner' },
  { key: 'notes', label: 'Notes' },
];

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
    docs: seedDocs(),
    leadLists: sections('leads', ['Conference Attendee Lists', 'Event RSVPs', 'Target Accounts'], LEAD_FIELDS),
    externalConferences: sections('conf', ['Upcoming', 'Under Consideration', 'Past'], CONFERENCE_FIELDS),
    eventsNyc: sections('nyc', ['Upcoming Events', 'Past Events'], EVENT_FIELDS),
    eventsSf: sections('sf', ['Upcoming Events', 'Past Events'], EVENT_FIELDS),
    pageNotes: {
      documentation: '',
      leadLists: '',
      externalConferences: '',
      eventsNyc: '',
      eventsSf: '',
    },
  };
}
