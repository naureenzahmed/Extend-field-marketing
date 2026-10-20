import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';
import { partnershipMetrics, PARTNERSHIP_UNASSIGNED_ID, PARTNERSHIP_OTHERS_ID } from '../seed.js';
import { renderTrackerSections } from './trackerShared.js';

/* Partnerships: one section per industry; each company has a city and can be moved between industries. */
export function renderPartnerships(container, opts) {
  const data = getData();
  const rerender = () => renderPartnerships(container, opts);
  container.innerHTML = `
    ${notesBoxHtml('partnerships')}
    <div class="toolbar">
      <div class="page-title" style="margin:0;">${escapeHtml(opts.title)}</div>
      <button class="btn btn-primary" id="add-industry-btn">+ Industry</button>
    </div>
    <div class="stack-16" id="partnership-sections"></div>
  `;

  document.getElementById('add-industry-btn').addEventListener('click', () => {
    const title = prompt('Industry name');
    if (!title || !title.trim()) return;
    data.partnerships.push({ id: uid('partner'), title: title.trim(), entities: [], metrics: partnershipMetrics() });
    commit();
    rerender();
  });

  renderTrackerSections(document.getElementById('partnership-sections'), data, data.partnerships, rerender,
    { companyMode: true, hideWhenEmpty: PARTNERSHIP_UNASSIGNED_ID, labelSections: [PARTNERSHIP_OTHERS_ID] });
}
