import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';
import { newConference, SCORECARD_NOTE } from '../fieldMarketing.js';
import { renderSection, wireEvents } from './tableSections.js';

const SUMMARY_FIELDS = [
  { key: 'eventSummary', label: 'Event Summary', placeholder: 'What the conference is, who attends, and why it matters.' },
  { key: 'participationSummary', label: 'Extend Participation Summary', placeholder: 'How Extend is taking part: booth, talk, sponsorship, team attending.' },
  { key: 'targetGoal', label: 'Extend Target Goal', placeholder: 'What Extend wants to get out of it, e.g. meetings booked, leads, pipeline.' },
];

/* A scorecard to choose conferences, then one group per planned conference with its five stages:
   prep, booth build & shipping, staffing, run-of-show and follow-up. */
export function renderExternalConferences(container) {
  const data = getData();
  const conferences = data.externalConferences;
  const scorecard = data.conferenceScorecard;
  const rerender = () => renderExternalConferences(container);

  container.innerHTML = `
    ${notesBoxHtml('externalConferences')}
    <div class="page-title">External Conferences</div>
    <div id="conference-scorecard">
      ${scorecard.map((s) => renderSection(s, { rowLabel: 'Add conference', fixedSections: true, showEmptyTable: true })).join('')}
    </div>
    <div class="toolbar" style="margin-top:28px;">
      <div class="page-subtitle" style="margin:0;">Planned Conferences: End to End</div>
      <button class="btn btn-primary" id="add-conf-btn">+ Conference</button>
    </div>
    <div class="inline-add-form" id="add-conf-form" style="display:none;">
      <input type="text" id="add-conf-input" placeholder="Conference name" />
      <button class="btn btn-primary" id="add-conf-confirm">Add</button>
      <button class="btn btn-ghost" id="add-conf-cancel">Cancel</button>
    </div>
    <div class="stack-16" id="conference-groups">
      ${conferences.length ? conferences.map(renderConference).join('') : '<div class="empty-hint">No conferences yet.</div>'}
    </div>
  `;

  const form = document.getElementById('add-conf-form');
  const input = document.getElementById('add-conf-input');
  document.getElementById('add-conf-btn').addEventListener('click', () => {
    form.style.display = form.style.display === 'none' ? 'flex' : 'none';
    if (form.style.display === 'flex') input.focus();
  });
  document.getElementById('add-conf-cancel').addEventListener('click', () => {
    form.style.display = 'none';
    input.value = '';
  });
  const confirmAdd = () => {
    const title = input.value.trim();
    if (!title) return;
    conferences.push(newConference(uid('conf'), title));
    commit();
    rerender();
  };
  document.getElementById('add-conf-confirm').addEventListener('click', confirmAdd);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmAdd(); });

  document.querySelectorAll('[data-rename-conf]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const conf = conferences.find((c) => c.id === btn.dataset.renameConf);
      const title = prompt('Conference name', conf.title);
      if (title === null || !title.trim()) return;
      conf.title = title.trim();
      commit();
      rerender();
    });
  });

  document.querySelectorAll('[data-remove-conf]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const conf = conferences.find((c) => c.id === btn.dataset.removeConf);
      if (!confirm(`Remove ${conf.title} and all its tables?`)) return;
      conferences.splice(conferences.indexOf(conf), 1);
      commit();
      rerender();
    });
  });

  document.querySelectorAll('[data-conf-summary]').forEach((textarea) => {
    textarea.addEventListener('input', () => {
      const [confId, key] = textarea.dataset.confSummary.split('|');
      const conf = conferences.find((c) => c.id === confId);
      conf.summary = conf.summary || {};
      conf.summary[key] = textarea.value;
      commit();
    });
  });

  wireEvents(document.getElementById('conference-groups'), conferences.flatMap((c) => c.sections), rerender);
  wireEvents(document.getElementById('conference-scorecard'), scorecard, rerender);
  // Explain how the score is worked out, under the scorecard title.
  document.querySelector('#conf-scorecard .toolbar')?.insertAdjacentHTML('afterend', `<div class="section-note">${escapeHtml(SCORECARD_NOTE)}</div>`);
}

function renderConference(conf) {
  return `
    <div class="conference-group" id="${conf.id}">
      <div class="toolbar conference-group-head">
        <h3 class="conference-group-title">${escapeHtml(conf.title)}</h3>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-ghost" data-rename-conf="${conf.id}" style="padding:4px 8px;">Rename</button>
          <button class="btn btn-ghost btn-danger" data-remove-conf="${conf.id}" style="padding:4px 8px;">Remove conference</button>
        </div>
      </div>
      <div class="card conference-summary">
        ${SUMMARY_FIELDS.map((f) => `
          <div class="conference-summary-field">
            <div class="section-label">${escapeHtml(f.label)}</div>
            <textarea class="notes-box" data-conf-summary="${conf.id}|${f.key}" placeholder="${escapeHtml(f.placeholder)}">${escapeHtml(conf.summary?.[f.key] || '')}</textarea>
          </div>
        `).join('')}
      </div>
      <div class="stack-16" style="margin-top:16px;">
        ${conf.sections.map((s) => renderSection(s, { rowLabel: 'Add row', fixedSections: true, showEmptyTable: true })).join('')}
      </div>
    </div>
  `;
}
