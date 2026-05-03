import sys

with open('src/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. SCHEMA SETTINGS
schema_header = """      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
        <div>
          <h2>Schema Settings</h2>
          <p style="color: #888; font-size:0.9rem; margin-bottom: 0;">Define the expected columns to map your imported or synced data onto exactly.</p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; align-items: flex-end;">
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="text" id="workspace-name" placeholder="Name (e.g. Finance)" style="background:var(--bg-color); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; padding:0.4rem; width:140px;" />
            <input type="file" id="schema-config-load" accept=".json" style="display:none;" />
            <button class="nav-btn" id="btn-export-schema-config">💾 Save Config</button>
            <button class="nav-btn" id="btn-load-schema-config">📁 Load from File</button>
            <button class="action-btn" id="btn-import-schema-csv" style="width: auto; padding: 0.5rem 1rem;">📥 Import Headers (.csv)</button>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <label style="color: var(--text-secondary); font-size: 0.85rem;">Saved Configs:</label>
            <select id="config-dropdown" style="background:var(--bg-color); color:var(--text-primary); border:1px solid var(--border-color); border-radius:4px; padding:0.4rem; width:160px;"></select>
            <button class="action-btn-sm" id="btn-load-selected" style="padding: 0.4rem 0.8rem;">Load</button>
            <button class="action-btn-sm" id="btn-download-selected" style="padding: 0.4rem 0.8rem; color: var(--brand-color); border-color: var(--brand-color);">Download</button>
          </div>
        </div>
      </div>"""

new_schema_header = """      <div class="accordion-header active" data-target="content-schema">Schema Settings <span class="accordion-chevron">▼</span></div>
      <div class="accordion-content active" id="content-schema">
        <p style="color: #888; font-size:0.9rem; margin-bottom: 15px;">Define the expected columns to map your imported or synced data onto exactly.</p>
        
        <div class="config-toolbar">
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

html = html.replace(schema_header, new_schema_header)

table_btn = """      <button class="action-btn" id="btn-add-schema-row">+ Add Column</button>"""
new_table_btn = """      <button class="action-btn" id="btn-add-schema-row">+ Add Column</button>
      </div>"""
html = html.replace(table_btn, new_table_btn)


# 2. ANALYTICS CONFIG
analytics_header = """      <!-- Analytics Settings Section -->
      <h2>Analytics Configuration</h2>
      <p style="color: #888; font-size:0.9rem; margin-bottom: 20px;">Design the Zone 4 Graph dynamically using the columns mapped above.</p>"""

new_analytics_header = """      <!-- Analytics Settings Section -->
      <div class="accordion-header" data-target="content-analytics">Analytics Configuration <span class="accordion-chevron">▼</span></div>
      <div class="accordion-content" id="content-analytics">
      <p style="color: #888; font-size:0.9rem; margin-bottom: 20px;">Design the Zone 4 Graph dynamically using the columns mapped above.</p>"""
html = html.replace(analytics_header, new_analytics_header)

analytics_footer = """             <!-- Injected dynamically -->
          </select>
        </div>
      </div>"""
new_analytics_footer = """             <!-- Injected dynamically -->
          </select>
        </div>
      </div>
      </div>"""
html = html.replace(analytics_footer, new_analytics_footer)


# 3. CLOUD INTEGRATION
cloud_header = """      <!-- Cloud Settings Section -->
      <h2 style="margin-bottom:5px;">Cloud Integration</h2>
      <p style="color: #888; font-size:0.9rem; margin-bottom: 20px;">Select the active cloud provider and configure its connection.</p>"""

new_cloud_header = """      <!-- Cloud Settings Section -->
      <div class="accordion-header" data-target="content-cloud">Cloud Integration <span class="accordion-chevron">▼</span></div>
      <div class="accordion-content" id="content-cloud">
      <p style="color: #888; font-size:0.9rem; margin-bottom: 20px;">Select the active cloud provider and configure its connection.</p>"""

html = html.replace(cloud_header, new_cloud_header)

cloud_footer = """            <input type="password" id="airtable-api-key" placeholder="Personal Access Token"/>
          </div>
        </label>
      </div>

      <br/>"""

new_cloud_footer = """            <input type="password" id="airtable-api-key" placeholder="Personal Access Token"/>
          </div>
        </label>
      </div>
      </div>

      <br/>"""

html = html.replace(cloud_footer, new_cloud_footer)

html = html.replace('      <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 2rem 0;"/>\n', '')

with open('src/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
