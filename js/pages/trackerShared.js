import { commit } from '../store.js';
import { uid, escapeHtml } from '../utils.js';
import { openClubSidebar } from '../clubSidebar.js';

/* Renders weekly-metric tracker sections into root; all event wiring is scoped to root.
   opts.groupBy = { key, groups } groups each section's company list (and lets companies be added).
   opts.companyMode: each section is a group of companies (with a city) that can be added, removed
   or moved to another section; an empty section with id opts.hideWhenEmpty is not shown. */
export function renderTrackerSections(root, data, sections, rerender, opts = {}) {
  const visible = sections.filter((s) => !(s.id === opts.hideWhenEmpty && !s.entities?.length));
  root.innerHTML = visible.map((s) => renderSection(s, data.weeks, { ...opts, allSections: sections })).join('');
  wireEvents(root, sections, rerender, opts);
}

function renderSection(s, weeks, opts = {}) {
  if (s.isIntro) {
    return `<div class="card page-intro">${(Array.isArray(s.note) ? s.note : [s.note]).map((p) => `<p style="margin:0 0 8px;">${escapeHtml(p)}</p>`).join('')}</div>`;
  }

  return `
    <div class="card tracker-card" id="${s.id}">
      <div class="toolbar" style="margin-bottom:6px;">
        <h4 style="margin:0;">${escapeHtml(s.title)}</h4>
        <div style="display:flex; gap:6px;">
          ${opts.companyMode ? `<button class="btn btn-ghost" data-add-entity="${s.id}" style="padding:4px 8px;">+ Add company</button>` : ''}
          <button class="btn btn-ghost" data-add-metric="${s.id}" style="padding:4px 8px;">+ Add metric</button>
          <button class="btn btn-ghost btn-danger" data-remove-section="${s.id}" style="padding:4px 8px;">Remove section</button>
        </div>
      </div>
      ${s.note ? `<div class="section-desc">${escapeHtml(s.note)}</div>` : ''}
      ${opts.companyMode ? companyListHtml(s, opts.allSections) : opts.groupBy && s.entities ? groupedEntitiesHtml(s, opts.groupBy) : s.entities && s.entities.length ? `
        <div class="entity-list">
          ${s.entities.map((e, entityIndex) => entityRowHtml(s, e, entityIndex)).join('')}
        </div>
      ` : ''}
      ${s.metrics && s.metrics.length ? `
        <div class="tracker-scroll">
          <table class="list-table tracker-table">
            <thead>
              <tr>
                <th class="tracker-sticky-col">Metric</th>
                <th>Notes</th>
                <th>Target</th>
                ${weeks.map((w) => `<th class="tracker-week-th ${w.isCurrent ? 'current-week' : ''}">${escapeHtml(w.label)}</th>`).join('')}
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${s.metrics.map((m) => `
                <tr>
                  <td class="tracker-sticky-col">${escapeHtml(m.label)}</td>
                  <td class="tracker-note">${escapeHtml(m.note || '')}</td>
                  <td class="tracker-target">${m.target ?? '—'}</td>
                  ${weeks.map((w) => `
                    <td class="tracker-week-td ${w.isCurrent ? 'current-week' : ''}">
                      <input type="text" inputmode="decimal" class="tracker-input" data-metric="${s.id}|${m.id}|${w.key}" value="${escapeHtml(m.values?.[w.key] ?? '')}" />
                    </td>
                  `).join('')}
                  <td><button class="btn btn-ghost" data-remove-metric="${s.id}|${m.id}" style="padding:2px 7px;">✕</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : '<div class="empty-hint">No metrics yet.</div>'}
      ${renderMeetingsSummary(s)}
      <div class="inline-add-form" id="add-metric-form-${s.id}" style="display:none;">
        <input type="text" id="add-metric-input-${s.id}" placeholder="Metric name" />
        <button class="btn btn-primary" data-confirm-add-metric="${s.id}">Add</button>
        <button class="btn btn-ghost" data-cancel-add-metric="${s.id}">Cancel</button>
      </div>
    </div>
  `;
}

function entityRowHtml(s, e, entityIndex, groupBy = null) {
  return `
    <div class="entity-row">
      <div class="entity-name">${escapeHtml(e.name)}</div>
      ${groupBy ? `
        <select class="cell-input entity-group-select" data-entity-group="${s.id}|${entityIndex}">
          ${['', ...groupBy.groups].map((g) => `<option value="${escapeHtml(g)}" ${g === (e[groupBy.key] || '') ? 'selected' : ''}>${g ? escapeHtml(g) : 'Unassigned'}</option>`).join('')}
        </select>
      ` : ''}
      ${e.note
        ? `<div class="entity-note">${escapeHtml(e.note)}</div>`
        : `<div class="entity-org-list">${e.links && e.links.length ? e.links.map((l) => `<button type="button" class="entity-org-box" data-open-club="${s.id}|${entityIndex}|${l.id}">${escapeHtml(l.name)}</button>`).join('') : '<span class="entity-org-empty">—</span>'}</div>`
      }
      ${groupBy ? `<button class="btn btn-ghost" data-remove-entity="${s.id}|${entityIndex}" style="padding:2px 7px;">✕</button>` : ''}
    </div>
  `;
}

/* Companies in a section, each with its city and a dropdown to move it to another section. */
function companyListHtml(s, allSections) {
  if (!s.entities?.length) return '<div class="empty-hint" style="margin-bottom:12px;">No companies yet.</div>';
  return `
    <div class="entity-list">
      <div class="entity-row entity-head"><div class="entity-name">Company Name</div><div class="entity-city">City</div><div>Industry</div></div>
      ${s.entities.map((e, i) => `
        <div class="entity-row">
          <div class="entity-name">${escapeHtml(e.name)}</div>
          <input type="text" class="cell-input entity-city" data-entity-city="${s.id}|${i}" value="${escapeHtml(e.city || '')}" title="${escapeHtml(e.city || '')}" placeholder="Headquarters city" />
          <select class="cell-input entity-group-select" data-entity-move="${s.id}|${i}">
            ${allSections.map((t) => `<option value="${t.id}" ${t.id === s.id ? 'selected' : ''}>${escapeHtml(t.title)}</option>`).join('')}
          </select>
          <div class="entity-org-list">${e.links && e.links.length ? e.links.map((l) => `<button type="button" class="entity-org-box" data-open-club="${s.id}|${i}|${l.id}">${escapeHtml(l.name)}</button>`).join('') : ''}</div>
          <button class="btn btn-ghost" data-remove-entity="${s.id}|${i}" style="padding:2px 7px;">✕</button>
        </div>
      `).join('')}
    </div>
  `;
}

/* Company list split into groups (e.g. industries); companies outside the groups show as Unassigned. */
function groupedEntitiesHtml(s, groupBy) {
  const indexed = s.entities.map((e, i) => ({ e, i }));
  const unassigned = indexed.filter(({ e }) => !groupBy.groups.includes(e[groupBy.key]));
  const parts = [
    ...(unassigned.length ? [{ name: 'Unassigned', items: unassigned }] : []),
    ...groupBy.groups.map((g) => ({ name: g, items: indexed.filter(({ e }) => e[groupBy.key] === g) })),
  ];
  return `
    <div class="entity-list">
      <div class="entity-row entity-head"><div class="entity-name">Company Name</div><div>Industry</div></div>
      ${parts.map((part) => `
        <div class="subgroup">
          <div class="subgroup-head">
            <h5>${escapeHtml(part.name)} <span>${part.items.length}</span></h5>
            <button class="btn btn-ghost" data-add-entity="${s.id}" data-group="${escapeHtml(part.name)}" style="padding:3px 8px;">+ Add company</button>
          </div>
          ${part.items.length
            ? part.items.map(({ e, i }) => entityRowHtml(s, e, i, groupBy)).join('')
            : '<div class="empty-hint">No companies yet.</div>'}
        </div>
      `).join('')}
    </div>
  `;
}

function renderMeetingsSummary(s) {
  const metric = s.metrics?.find((m) => /meeting(s)?\s*booked/i.test(m.label) && !/%/.test(m.label));
  if (!metric) return '';
  const total = Object.values(metric.values || {}).reduce((sum, v) => {
    const n = parseFloat(v);
    return sum + (Number.isNaN(n) ? 0 : n);
  }, 0);
  return `<div class="tracker-summary">Meetings booked <b>${total}</b></div>`;
}

function wireEvents(root, sections, rerender, opts = {}) {
  const groupKey = opts.groupBy?.key;

  root.querySelectorAll('[data-add-entity]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = prompt('Company name');
      if (!name || !name.trim()) return;
      const section = sections.find((s) => s.id === btn.dataset.addEntity);
      const entity = { name: name.trim(), links: [] };
      if (groupKey) entity[groupKey] = btn.dataset.group === 'Unassigned' ? '' : btn.dataset.group;
      section.entities = section.entities || [];
      section.entities.push(entity);
      commit();
      rerender();
    });
  });

  root.querySelectorAll('[data-entity-group]').forEach((select) => {
    select.addEventListener('change', () => {
      const [sectionId, index] = select.dataset.entityGroup.split('|');
      sections.find((s) => s.id === sectionId).entities[Number(index)][groupKey] = select.value;
      commit();
      rerender();
    });
  });

  root.querySelectorAll('[data-entity-city]').forEach((input) => {
    input.addEventListener('input', () => {
      const [sectionId, index] = input.dataset.entityCity.split('|');
      sections.find((s) => s.id === sectionId).entities[Number(index)].city = input.value;
      commit();
    });
  });

  root.querySelectorAll('[data-entity-move]').forEach((select) => {
    select.addEventListener('change', () => {
      const [sectionId, index] = select.dataset.entityMove.split('|');
      const [entity] = sections.find((s) => s.id === sectionId).entities.splice(Number(index), 1);
      const target = sections.find((s) => s.id === select.value);
      target.entities = target.entities || [];
      target.entities.push(entity);
      commit();
      rerender();
    });
  });

  root.querySelectorAll('[data-remove-entity]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, index] = btn.dataset.removeEntity.split('|');
      sections.find((s) => s.id === sectionId).entities.splice(Number(index), 1);
      commit();
      rerender();
    });
  });

  root.querySelectorAll('[data-open-club]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, entityIndex, linkId] = btn.dataset.openClub.split('|');
      openClubSidebar(sections, sectionId, Number(entityIndex), linkId, rerender);
    });
  });

  root.querySelectorAll('.tracker-input').forEach((input) => {
    input.addEventListener('input', () => {
      const [sectionId, metricId, weekKey] = input.dataset.metric.split('|');
      const section = sections.find((s) => s.id === sectionId);
      const metric = section.metrics.find((m) => m.id === metricId);
      metric.values = metric.values || {};
      if (input.value.trim() === '') delete metric.values[weekKey];
      else metric.values[weekKey] = input.value;
      commit();
    });
  });

  root.querySelectorAll('[data-add-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const form = document.getElementById(`add-metric-form-${btn.dataset.addMetric}`);
      const input = document.getElementById(`add-metric-input-${btn.dataset.addMetric}`);
      form.style.display = form.style.display === 'none' ? 'flex' : 'none';
      if (form.style.display === 'flex') input.focus();
    });
  });

  root.querySelectorAll('[data-cancel-add-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById(`add-metric-form-${btn.dataset.cancelAddMetric}`).style.display = 'none';
    });
  });

  const confirmAddMetric = (sectionId) => {
    const input = document.getElementById(`add-metric-input-${sectionId}`);
    const label = input.value.trim();
    if (!label) return;
    const section = sections.find((s) => s.id === sectionId);
    section.metrics = section.metrics || [];
    section.metrics.push({ id: uid('m'), label, target: null, values: {} });
    commit();
    rerender();
  };
  root.querySelectorAll('[data-confirm-add-metric]').forEach((btn) => {
    btn.addEventListener('click', () => confirmAddMetric(btn.dataset.confirmAddMetric));
  });
  root.querySelectorAll('[id^="add-metric-input-"]').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') confirmAddMetric(input.id.replace('add-metric-input-', ''));
    });
  });

  root.querySelectorAll('[data-remove-metric]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const [sectionId, metricId] = btn.dataset.removeMetric.split('|');
      const section = sections.find((s) => s.id === sectionId);
      section.metrics = section.metrics.filter((m) => m.id !== metricId);
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
