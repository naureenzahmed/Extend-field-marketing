import { getData } from './store.js';

/* Read-only table cells ({ type: 'computed' } fields), keyed by field key. */

const MEETING_STAGES = ['Demo Booked', 'Demo Completed', 'Negotiation', 'Won'];

const normalize = (s) => String(s || '').trim().toLowerCase();

// Lead Lists rows whose Source Event matches this event's name.
function leadsFor(eventName) {
  const name = normalize(eventName);
  if (!name) return [];
  return (getData().leadLists || []).flatMap((s) => s.entries).filter((lead) => normalize(lead.sourceEvent) === name);
}

const isMeeting = (lead) => MEETING_STAGES.includes(lead.stage) || lead.demoBookedDate || lead.meetingWithAeDate;

// Numbers typed as "$15,000" or "1,280" (blank or "n/a" gives NaN).
const num = (s) => parseFloat(String(s ?? '').replace(/[$,\s]/g, ''));

function costPerMeeting(row) {
  const cost = num(row.estCost);
  const meetings = num(row.expectedMeetings);
  return cost > 0 && meetings > 0 ? cost / meetings : NaN;
}

// Score (/10) = ICP fit (1–5) + cost per meeting (≤ $300: 3, ≤ $600: 2, ≤ $1,200: 1) + reach (≥ 2,000 devs: 2, ≥ 700: 1).
function score(row) {
  const fit = num(row.icpFit);
  if (!(fit > 0)) return '';
  const cpm = costPerMeeting(row);
  const cpmPoints = cpm <= 300 ? 3 : cpm <= 600 ? 2 : cpm <= 1200 ? 1 : 0;
  const devs = num(row.estDevelopers);
  const reachPoints = devs >= 2000 ? 2 : devs >= 700 ? 1 : 0;
  return fit + (Number.isNaN(cpm) ? 0 : cpmPoints) + reachPoints;
}

export const COMPUTED = {
  leadsFromEvent: (row) => leadsFor(row.eventName).length,
  meetingsFromEvent: (row) => leadsFor(row.eventName).filter(isMeeting).length,
  costPerMeeting: (row) => {
    const cpm = costPerMeeting(row);
    return Number.isNaN(cpm) ? '—' : `$${Math.round(cpm).toLocaleString('en-US')}`;
  },
  score: (row) => score(row),
};
