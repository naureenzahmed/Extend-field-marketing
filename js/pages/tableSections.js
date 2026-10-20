import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';
import { renderTrackerSections } from './trackerShared.js';

export const UNASSIGNED = 'Unassigned';

/* A page made of titled sections, each an editable table with its own field schema.
   opts.trackerKey adds weekly-metric tracker sections (from that data key) below the tables;
   opts.notesKey reads page notes from a key other than the data key;
   opts.groupBy = { key, groups } splits each table (and tracker name lists) into sub-groups. */
export function renderTableSectionsPage(container, key, opts) {
  const data = getData();
  const sections = data[key];
  const rerender = () => renderTableSectionsPage(container, key, opts);

  container.innerHTML = `
    ${notesBoxHtml(opts.notesKey || key)}
    <div class="toolbar">
      <div class="page-title" style="margin:0;">${escapeHtml(opts.title)}</div>
      <button class="btn btn-primary" id="add-section-btn">+ Section</button>
    </div>
    <div class="inline-add-form" id="add-section-form" style="display:none;">
      <input type="text" id="add-section-input" placeholder="Section title" />
      <button class="btn btn-primary" id="add-section-confirm">Add</button>
      <button class="btn btn-ghost" id="add-section-cancel">Cancel</button>
    </div>
    <div class="stack-16" id="table-sections">${sections.map((s) => renderSection(s, opts)).join('')}</div>
    ${opts.trackerKey ? '<div class="stack-16" id="page-tracker-sections" style="margin-top:16px;"></div>' : ''}
  `;

  const sectionForm = document.getElementById('add-section-form');
  const sectionInput = document.getElementById('add-section-input');
  document.getElementById('add-section-btn').addEventListener('click', () => {
    sectionForm.style.display = sectionForm.style.display === 'none' ? 'flex' : 'none';
    if (sectionForm.style.display === 'flex') sectionInput.focus();
  });
  document.getElementById('add-section-cancel').addEventListener('click', () => {
    sectionForm.style.display = 'none';
    sectionInput.value = '';
  });
  const confirmAddSection = () => {
    const title = sectionInput.value.trim();
    if (!title) return;
    sections.push({ id: uid('sec'), title, fields: opts.fields, entries: [] });
    commit();
    rerender();
  };
  document.getElementById('add-section-confirm').addEventListener('click', confirmAddSection);
  sectionInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmAddSection(); });

  wireEvents(document.getElementById('table-sections'), sections, rerender, opts.groupBy?.key);
  if (opts.trackerKey) {
    renderTrackerSections(document.getElementById('page-tracker-sections'), data, data[opts.trackerKey], rerender, opts);
  }
}

export function renderSection(s, opts) {
  const group = opts.groupBy;
  const addLabel = `+ ${escapeHtml(opts.rowLabel || 'Add row')}`;
  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <div style="display:flex; gap:6px;">
          ${group ? '' : `<button class="btn btn-ghost" data-add-row="${s.id}" style="padding:4px 8px;">${addLabel}</button>`}
          ${opts.fixedSections ? '' : `<button class="btn btn-ghost btn-danger" data-remove-section="${s.id}" style="padding:4px 8px;">Remove section</button>`}
        </div>
      </div>
      ${group ? groupedTablesHtml(s, opts, addLabel) : tableHtml(s, s.entries, opts)}
    </div>
  `;
}

/* opts.groupBy = { key, groups }: one sub-table per group, plus "Unassigned" for rows outside the groups. */
function groupedTablesHtml(s, opts, addLabel) {
  const { key, groups } = opts.groupBy;
  const unassigned = s.entries.filter((e) => !groups.includes(e[key]));
  const parts = [
    ...(unassigned.length ? [{ name: UNASSIGNED, rows: unassigned }] : []),
    ...groups.map((g) => ({ name: g, rows: s.entries.filter((e) => e[key] === g) })),
  ];
  return parts.map((part) => `
    <div class="subgroup">
      <div class="subgroup-head">
        <h5>${escapeHtml(part.name)} <span>${part.rows.length}</span></h5>
        <button class="btn btn-ghost" data-add-row="${s.id}" data-group="${escapeHtml(part.name)}" style="padding:3px 8px;">${addLabel}</button>
      </div>
      ${tableHtml(s, part.rows, { ...opts, showEmptyTable: true })}
    </div>
  `).join('');
}


function tableHtml(s, rows, opts) {
  if (!rows.length && !opts.showEmptyTable) return '<div class="empty-hint">No entries yet.</div>';
  return `
    <div class="tracker-scroll">
      <table class="list-table doc-fields-table">
        <thead>
          <tr>
            ${s.fields.map((f) => `<th>${escapeHtml(f.label)}</th>`).join('')}
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((entry) => `
            <tr>
              ${s.fields.map((f) => `<td>${renderCell(s, entry, f)}</td>`).join('')}
              <td><button class="btn btn-ghost" data-remove-row="${s.id}|${entry.id}" style="padding:3px 7px;">✕</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderCell(s, entry, f) {
  const value = entry[f.key] || '';
  const width = f.width ? ` style="min-width:${f.width}px;"` : '';
  const attrs = `class="cell-input" data-row-id="${entry.id}" data-section-id="${s.id}" data-field="${f.key}"${width}`;
  if (f.type === 'select') {
    return `<select ${attrs}>
      ${f.options.map((o) => `<option value="${escapeHtml(o)}" ${o === value ? 'selected' : ''}>${o ? escapeHtml(o) : '—'}</option>`).join('')}
    </select>`;
  }
  if (f.type === 'date') return `<input type="date" ${attrs} value="${escapeHtml(value)}" />`;
  return `<input type="text" ${attrs} value="${escapeHtml(value)}" title="${escapeHtml(value)}" />`;
}

export function wireEvents(root, sections, rerender, groupKey = null) {
  const findSection = (id) => sections.find((s) => s.id === id);

  root.querySelectorAll('[data-add-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = findSection(btn.dataset.addRow);
      const row = { id: uid('row') };
      section.fields.forEach((f) => { row[f.key] = ''; });
      if (groupKey && btn.dataset.group && btn.dataset.group !== UNASSIGNED) row[groupKey] = btn.dataset.group;
      section.entries.push(row);
      commit();
      rerender();
    });
  });

  root.querySelectorAll('.doc-fields-table .cell-input').forEach((input) => {
    const evt = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(evt, () => {
      const entry = findSection(input.dataset.sectionId).entries.find((e) => e.id === input.dataset.rowId);
      entry[input.dataset.field] = input.value;
      commit();
      if (input.dataset.field === groupKey) rerender(); // the row moves to its new group
    });
  });

  root.querySelectorAll('[data-remove-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, rowId] = btn.dataset.removeRow.split('|');
      const section = findSection(sectionId);
      section.entries = section.entries.filter((e) => e.id !== rowId);
      commit();
      rerender();
    });
  });

  root.querySelectorAll('[data-remove-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = sections.findIndex((s) => s.id === btn.dataset.removeSection);
      if (idx >= 0) sections.splice(idx, 1);
      commit();
      rerender();
    });
  });
}
