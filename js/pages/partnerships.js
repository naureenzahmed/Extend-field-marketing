import { getData } from '../store.js';
import { escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';
import { renderTrackerSections } from './trackerShared.js';

/* Partnerships: weekly-metric sections (one per city) with companies grouped by opts.groupBy. */
export function renderPartnerships(container, opts) {
  const data = getData();
  container.innerHTML = `
    ${notesBoxHtml('partnerships')}
    <div class="page-title">${escapeHtml(opts.title)}</div>
    <div class="stack-16" id="partnership-sections"></div>
  `;
  renderTrackerSections(document.getElementById('partnership-sections'), data, data.partnerships,
    () => renderPartnerships(container, opts), opts);
}
