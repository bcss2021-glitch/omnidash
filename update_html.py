import sys

with open('src/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove collapse button
html = html.replace('      <button class="nav-btn" id="btn-toggle-metrics">➖ Collapse Metrics</button>\n', '')

# 2. Make zone-metrics permanently compact
html = html.replace('<section class="zone" id="zone-metrics">', '<section class="zone compact" id="zone-metrics">')

# 3. Move the help button
old_help_btn = '      <button class="nav-btn" id="btn-settings-help" style="position: absolute; top: 1.5rem; right: 1.5rem;">❓ Help Guide</button>\n'
html = html.replace(old_help_btn, '')

cloud_section = """      <div class="accordion-content" id="content-cloud">
      <p style="color: #888; font-size:0.9rem; margin-bottom: 20px;">Select the active cloud provider and configure its connection.</p>"""

new_cloud_section = """      <div class="accordion-content" id="content-cloud">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <p style="color: #888; font-size:0.9rem; margin: 0;">Select the active cloud provider and configure its connection.</p>
        <button class="action-btn-sm" id="btn-settings-help" style="padding: 0.4rem 0.8rem; margin-top: -5px;">❓ Integration Guide</button>
      </div>"""

html = html.replace(cloud_section, new_cloud_section)

with open('src/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
