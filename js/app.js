import { getData, commit } from './store.js';
import { LEAD_FIELDS, EVENT_FIELDS } from './seed.js';
import { renderCover } from './pages/cover.js';
import { renderDocumentation } from './pages/documentation.js';
import { renderTableSectionsPage } from './pages/tableSections.js';
import { renderExternalConferences } from './pages/externalConferences.js';
import { renderRoadmap } from './pages/roadmap.js';
import { renderTrackerPage } from './pages/trackerShared.js';

const tablePage = (key, title, fields, rowLabel) => (c) => renderTableSectionsPage(c, key, { title, fields, rowLabel });

const PAGES = {
  home: { label: 'Home', render: (c) => renderCover(c, PAGES) },
  documentation: { label: 'Documentation', dataKey: 'docs', render: renderDocumentation },
  leadLists: { label: 'Lead Lists', dataKey: 'leadLists', render: tablePage('leadLists', 'Lead Lists', LEAD_FIELDS, 'Add lead') },
  recruitmentFunnel: { label: 'Recruitment Funnel', dataKey: 'recruitmentFunnel', render: (c) => renderTrackerPage(c, getData(), 'recruitmentFunnel', { title: 'Recruitment Funnel' }) },
  externalConferences: { label: 'External Conferences', dataKey: 'externalConferences', render: renderExternalConferences },
  eventsNyc: { label: 'Events NYC', dataKey: 'eventsNyc', render: tablePage('eventsNyc', 'Events NYC', EVENT_FIELDS, 'Add event') },
  eventsSf: { label: 'Events SF', dataKey: 'eventsSf', render: tablePage('eventsSf', 'Events SF', EVENT_FIELDS, 'Add event') },
  // Not in the nav: opened by clicking the target in the header.
  roadmap: { label: 'Roadmap', hidden: true, render: renderRoadmap },
};

function currentRoute() {
  const hash = location.hash.replace('#/', '').split('?')[0];
  return PAGES[hash] ? hash : 'home';
}

function currentAnchor() {
  const qIdx = location.hash.indexOf('?');
  if (qIdx === -1) return null;
  return new URLSearchParams(location.hash.slice(qIdx + 1)).get('anchor');
}

export function rerender() {
  const route = currentRoute();
  renderHeader(route);
  const page = document.getElementById('app-page');
  page.innerHTML = '';
  PAGES[route].render(page);

  const anchor = currentAnchor();
  if (anchor) {
    requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  } else {
    window.scrollTo(0, 0);
  }
}

function renderHeader(route) {
  const data = getData();
  const header = document.getElementById('app-header');
  const pct = data.companyGoal.target ? Math.round((data.companyGoal.current / data.companyGoal.target) * 100) : 0;

  header.innerHTML = `
    <div class="header-left">
      <div class="wordmark">
        <img src="assets/extend-logo.jpg" alt="" /><span class="wordmark-text">Extend</span>
      </div>
      <nav class="nav-tabs">
        ${Object.entries(PAGES).filter(([, p]) => !p.hidden).map(([key, p]) => `
          <a class="nav-tab ${key === route ? 'active' : ''}" href="#/${key}">${p.label}</a>
        `).join('')}
      </nav>
    </div>
    <a class="header-goal ${route === 'roadmap' ? 'active' : ''}" id="header-goal" href="#/roadmap" title="Open roadmap">
      <div>
        <div class="goal-sub">${escapeAttr(data.companyGoal.title)}</div>
        <div class="goal-value">${data.companyGoal.current}${data.companyGoal.unit} <span class="goal-sub">/ ${data.companyGoal.target}${data.companyGoal.unit}</span></div>
      </div>
      <span class="pill">${pct}%</span>
    </a>
  `;
}

/* Edit the header target; used from the roadmap page. */
export function editCompanyGoal() {
  const data = getData();
  const title = prompt('Goal title', data.companyGoal.title);
  if (title === null) return;
  const current = Number(prompt('Current value', data.companyGoal.current));
  const target = Number(prompt('Target value', data.companyGoal.target));
  data.companyGoal.title = title;
  if (!Number.isNaN(current)) data.companyGoal.current = current;
  if (!Number.isNaN(target)) data.companyGoal.target = target;
  commit();
  rerender();
}

function escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}

window.addEventListener('hashchange', rerender);
window.addEventListener('DOMContentLoaded', () => {
  if (!location.hash) location.hash = '#/home';
  rerender();
});
