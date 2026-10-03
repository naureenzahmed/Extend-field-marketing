import { getData, commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { notesBoxHtml } from '../notesBox.js';

/* A page made of titled sections, each an editable table with its own field schema. */
export function renderTableSectionsPage(container, key, opts) {
  const sections = getData()[key];
  const rerender = () => renderTableSectionsPage(container, key, opts);

  container.innerHTML = `
    ${notesBoxHtml(key)}
    <div class="toolbar">
      <div class="page-title" style="margin:0;">${escapeHtml(opts.title)}</div>
      <button class="btn btn-primary" id="add-section-btn">+ Section</button>
    </div>
    <div class="inline-add-form" id="add-section-form" style="display:none;">
      <input type="text" id="add-section-input" placeholder="Section title" />
      <button class="btn btn-primary" id="add-section-confirm">Add</button>
      <button class="btn btn-ghost" id="add-section-cancel">Cancel</button>
    </div>
    <div class="stack-16">${sections.map((s) => renderSection(s, opts)).join('')}</div>
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

  wireEvents(sections, rerender);
}

export function renderSection(s, opts) {
  return `
    <div class="card doc-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-ghost" data-add-row="${s.id}" style="padding:4px 8px;">+ ${escapeHtml(opts.rowLabel || 'Add row')}</button>
          ${opts.fixedSections ? '' : `<button class="btn btn-ghost btn-danger" data-remove-section="${s.id}" style="padding:4px 8px;">Remove section</button>`}
        </div>
      </div>
      ${s.entries.length || opts.showEmptyTable ? `
        <div class="tracker-scroll">
          <table class="list-table doc-fields-table">
            <thead>
              <tr>
                ${s.fields.map((f) => `<th>${escapeHtml(f.label)}</th>`).join('')}
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${s.entries.map((entry) => `
                <tr>
                  ${s.fields.map((f) => `<td>${renderCell(s, entry, f)}</td>`).join('')}
                  <td><button class="btn btn-ghost" data-remove-row="${s.id}|${entry.id}" style="padding:3px 7px;">✕</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-hint">No entries yet.</div>'}
    </div>
  `;
}

function renderCell(s, entry, f) {
  const value = entry[f.key] || '';
  const attrs = `class="cell-input" data-row-id="${entry.id}" data-section-id="${s.id}" data-field="${f.key}"`;
  if (f.type === 'select') {
    return `<select ${attrs}>
      ${f.options.map((o) => `<option value="${escapeHtml(o)}" ${o === value ? 'selected' : ''}>${o ? escapeHtml(o) : '—'}</option>`).join('')}
    </select>`;
  }
  if (f.type === 'date') return `<input type="date" ${attrs} value="${escapeHtml(value)}" />`;
  return `<input type="text" ${attrs} value="${escapeHtml(value)}" />`;
}

export function wireEvents(sections, rerender) {
  const findSection = (id) => sections.find((s) => s.id === id);

  document.querySelectorAll('[data-add-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const section = findSection(btn.dataset.addRow);
      const row = { id: uid('row') };
      section.fields.forEach((f) => { row[f.key] = ''; });
      section.entries.push(row);
      commit();
      rerender();
    });
  });

  document.querySelectorAll('.doc-fields-table .cell-input').forEach((input) => {
    const evt = input.tagName === 'SELECT' ? 'change' : 'input';
    input.addEventListener(evt, () => {
      const entry = findSection(input.dataset.sectionId).entries.find((e) => e.id === input.dataset.rowId);
      entry[input.dataset.field] = input.value;
      commit();
    });
  });

  document.querySelectorAll('[data-remove-row]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, rowId] = btn.dataset.removeRow.split('|');
      const section = findSection(sectionId);
      section.entries = section.entries.filter((e) => e.id !== rowId);
      commit();
      rerender();
    });
  });

  document.querySelectorAll('[data-remove-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = sections.findIndex((s) => s.id === btn.dataset.removeSection);
      if (idx >= 0) sections.splice(idx, 1);
      commit();
      rerender();
    });
  });
}
