import { getData } from '../store.js';
import { escapeHtml } from '../utils.js';

export function renderCover(container, pages) {
  const data = getData();
  const manifest = Object.entries(pages)
    .filter(([, p]) => p.dataKey)
    .map(([key, p]) => ({
      key,
      label: p.label,
      subsections: data[p.dataKey].map((s) => ({ id: s.id, label: s.title })),
    }));

  container.innerHTML = `
    <div class="page-title">Extend Field Marketing</div>
    <div class="section-desc" style="margin-top:-14px; margin-bottom: 20px;">Jump to any page or section below.</div>
    <div class="cover-grid">
      ${manifest.map((p) => `
        <div class="card cover-card">
          <a class="cover-page-title" href="#/${p.key}">${escapeHtml(p.label)}</a>
          ${p.subsections.length ? `
            <ul class="cover-sublist">
              ${p.subsections.map((s) => `<li><a href="#/${p.key}?anchor=${encodeURIComponent(s.id)}">${escapeHtml(s.label)}</a></li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `).join('')}
    </div>
  `;
}
