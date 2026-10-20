import { getData } from '../store.js';
import { escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';
import { SCORECARD_NOTE } from '../fieldMarketing.js';
import { renderSection, wireEvents } from './tableSections.js';

/* External Conferences: the scorecard used to choose which conferences to attend. */
export function renderExternalConferences(container) {
  const scorecard = getData().conferenceScorecard;
  const rerender = () => renderExternalConferences(container);

  container.innerHTML = `
    ${notesBoxHtml('externalConferences')}
    <div class="page-title">External Conferences</div>
    <div id="conference-scorecard">
      ${scorecard.map((s) => renderSection(s, { rowLabel: 'Add conference', fixedSections: true, showEmptyTable: true })).join('')}
    </div>
  `;

  wireEvents(document.getElementById('conference-scorecard'), scorecard, rerender);
  // Explain how the score is worked out, under the scorecard title.
  document.querySelector('#conf-scorecard .toolbar')?.insertAdjacentHTML('afterend', `<div class="section-note">${escapeHtml(SCORECARD_NOTE)}</div>`);
}
