import sys

with open('src/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_block = """        <div class="config-toolbar">
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="file" id="schema-config-load" accept=".json" style="display:none;" />
            <button class="action-btn" id="btn-import-schema-csv" style="width: auto; padding: 0.4rem 0.8rem;">📥 Import Headers (.csv)</button>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" id="workspace-name" placeholder="Workspace Name" style="background:var(--bg-color); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; padding:0.4rem; width:140px;" />
            <button class="action-btn" id="btn-export-schema-config" style="padding: 0.4rem 0.8rem;">💾 Save Config</button>
            <button class="action-btn" id="btn-load-schema-config" style="padding: 0.4rem 0.8rem;">📁 Load from File</button>
            
            <div style="border-left: 1px solid var(--border-color); height: 30px; margin: 0 5px;"></div>
            
            <select id="config-dropdown" style="background:var(--bg-color); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; padding:0.4rem; width:140px;"></select>
            <button class="action-btn" id="btn-load-selected" style="padding: 0.4rem 0.8rem;">Load</button>
            <button class="action-btn" id="btn-download-selected" style="padding: 0.4rem 0.8rem; color: var(--brand-color); border-color: var(--brand-color);">Download</button>
          </div>
        </div>"""

new_block = """        <div class="config-toolbar" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start; background: transparent; border: none; padding: 0;">

          <!-- Left Column: New Profile -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">New Profile</span>
            <div style="display: flex; gap: 5px; align-items: center;">
              <input type="text" id="workspace-name" placeholder="profile name" style="background:var(--bg-color); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; padding:0.4rem; flex-grow: 1;" />
              <button class="action-btn" id="btn-export-schema-config" style="padding: 0.4rem 0.8rem;">SAVE</button>
            </div>
            <div style="display: flex; gap: 5px; align-items: center;">
              <span style="font-size: 0.85rem; color: var(--text-secondary); margin-right: auto;">From File</span>
              <input type="file" id="schema-config-load" accept=".json" style="display:none;" />
              <button class="action-btn" id="btn-load-schema-config" style="padding: 0.4rem 0.8rem;">RESTORE</button>
            </div>
          </div>

          <!-- Right Column: Existing -->
          <div style="display: flex; flex-direction: column; gap: 8px; border-left: 1px solid var(--border-color); padding-left: 20px;">
            <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">Existing</span>
            <div style="display: flex; gap: 5px; align-items: center;">
              <select id="config-dropdown" style="background:var(--bg-color); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; padding:0.4rem; flex-grow: 1;"></select>
              <button class="action-btn" id="btn-load-selected" style="padding: 0.4rem 0.8rem;">LOAD</button>
              <button class="action-btn" id="btn-download-selected" style="padding: 0.4rem 0.8rem; color: var(--brand-color); border-color: var(--brand-color);">BACKUP</button>
            </div>
          </div>

        </div>
        
        <div style="display: flex; justify-content: flex-end; align-items: center; gap: 10px; margin-top: 15px; margin-bottom: 20px;">
          <span style="font-size: 0.85rem; color: var(--text-secondary);">Headers(.csv)</span>
          <button class="action-btn" id="btn-import-schema-csv" style="padding: 0.4rem 0.8rem;">IMPORT</button>
        </div>"""

if old_block in html:
    html = html.replace(old_block, new_block)
    with open('src/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Successfully replaced.")
else:
    print("Old block not found!")
