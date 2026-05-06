// renderer_helpers.js
// Safe helper to wire guarded event listeners and manage Load Data state
(function(){
  function safeOn(id, ev, fn) {
    try {
      const el = document.getElementById(id);
      if (el) el.addEventListener(ev, fn);
    } catch(e) { console.warn('safeOn failed for', id, e); }
  }

  function updateLoadDataState() {
    try {
      const savedNames = JSON.parse(localStorage.getItem('omnidash_saved_configs')) || [];
      const hasConfig = savedNames.length > 0 || !!localStorage.getItem('scandoc_workspace_name');
      ['btn-import-modal','btn-import-local','btn-import-cloud'].forEach(id=>{
        const el = document.getElementById(id);
        if (el) el.disabled = !hasConfig;
      });
      // header hint
      const header = document.querySelector('.nav-controls');
      if (header) {
        let hint = document.getElementById('load-data-hint');
        if (!hint) { hint = document.createElement('span'); hint.id = 'load-data-hint'; hint.style.marginLeft='10px'; hint.style.color='var(--text-secondary)'; hint.style.fontSize='0.9rem'; header.appendChild(hint); }
        hint.innerText = hasConfig ? '' : ' (No profile yet — create one in Settings)';
      }
      // quick-switcher visibility
      const quick = document.getElementById('quick-switcher');
      if (quick) quick.style.display = (savedNames.length > 0) ? 'inline-block' : 'none';
    } catch(e) { console.warn('updateLoadDataState failed', e); }
  }

  // Wire guarded import actions
  safeOn('btn-import-modal','click', ()=>{
    const savedNames = JSON.parse(localStorage.getItem('omnidash_saved_configs'))||[];
    const hasConfig = savedNames.length>0||!!localStorage.getItem('scandoc_workspace_name');
    if (!hasConfig) return; const modal = document.getElementById('import-modal'); if (modal) modal.classList.add('visible');
  });
  safeOn('btn-import-local','click', ()=>{
    const savedNames = JSON.parse(localStorage.getItem('omnidash_saved_configs'))||[];
    const hasConfig = savedNames.length>0||!!localStorage.getItem('scandoc_workspace_name');
    if (!hasConfig) return; const fi = document.getElementById('file-upload'); if (fi) fi.click(); const modal = document.getElementById('import-modal'); if (modal) modal.classList.remove('visible');
  });

  // Ensure update after saving settings
  safeOn('btn-save-settings','click', ()=> setTimeout(()=>{ updateLoadDataState(); }, 80));

  // initial call
  document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(updateLoadDataState, 50); });
})();
