import { exportData } from '../store.js';

/* Hidden page (#/export): downloads this browser's saved data so it can become what first-time
   visitors see. */
export function renderExport(container) {
  const json = JSON.stringify(exportData(), null, 2);
  container.innerHTML = `
    <div class="page-title">Export Site Data</div>
    <div class="card" style="max-width:640px;">
      <p style="margin:0 0 12px;">Downloads everything saved in this browser: every event, conference, company and list as it looks now, including anything removed.
      Send the file to Claude to make it what first-time visitors see.</p>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-primary" id="export-download">Download site data</button>
        <button class="btn btn-ghost" id="export-copy">Copy to clipboard</button>
      </div>
      <div class="section-note" id="export-status" style="margin-top:10px;"></div>
    </div>
  `;
  const status = document.getElementById('export-status');
  document.getElementById('export-download').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: 'extend-site-data.json' });
    a.click();
    URL.revokeObjectURL(url);
    status.textContent = 'Downloaded extend-site-data.json.';
  });
  document.getElementById('export-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(json);
      status.textContent = 'Copied.';
    } catch {
      status.textContent = 'Copy failed; use Download instead.';
    }
  });
}
