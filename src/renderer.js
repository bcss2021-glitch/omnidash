// --- DEFAULT STATES --- //
let schema = JSON.parse(localStorage.getItem('scandoc_schema')) || [
  { name: 'Identifier', type: 'string' },
  { name: 'Date', type: 'date' },
  { name: 'Total', type: 'currency' },
  { name: 'Status', type: 'string' }
];

const btnInitDash = document.getElementById('btn-init-dash');
if (btnInitDash) {
  btnInitDash.addEventListener('click', () => {
    const ts = document.getElementById('title-screen');
    if (ts) {
      ts.style.opacity = '0';
      ts.style.visibility = 'hidden';
    }
  });
}

let cloudSettings = JSON.parse(localStorage.getItem('scandoc_cloud')) || {
  active: 'google',
  google: { authMode: 'api_key', docId: '', apiKey: '', serviceAccountJson: null },
  microsoft: { workbookId: '', token: '' },
  airtable: { baseId: '', tableName: '', apiKey: '' }
};

let analyticsConfig = JSON.parse(localStorage.getItem('scandoc_analytics')) || {
  type: 'line', xAxis: 'Date', yAxis1: 'Total', yAxis2: ''
};

let globalData = [];
let currentFilter = 1;
let chartInstance = null;
let chartToggles = { smooth: true, grid: true, stacked: false, fill: true };
let isExpandedView = JSON.parse(localStorage.getItem('scandoc_view')) || false;
if (isExpandedView) document.querySelector('.dashboard-grid').classList.add('expanded-view');

// --- UI ELEMENTS --- //
const modalSettings = document.getElementById('settings-modal');
const modalImport = document.getElementById('import-modal');
const modalHelp = document.getElementById('help-modal');

const btnSettingsHelp = document.getElementById('btn-settings-help');
const btnCloseHelp = document.getElementById('btn-close-help');

btnSettingsHelp.addEventListener('click', () => {
  modalSettings.classList.remove('visible');
  modalHelp.classList.add('visible');
});

btnCloseHelp.addEventListener('click', () => {
  modalHelp.classList.remove('visible');
  modalSettings.classList.add('visible');
});

const btnToggleView = document.getElementById('btn-toggle-view');
btnToggleView.addEventListener('click', () => {
  isExpandedView = !isExpandedView;
  localStorage.setItem('scandoc_view', JSON.stringify(isExpandedView));
  document.querySelector('.dashboard-grid').classList.toggle('expanded-view');
  if (chartInstance) chartInstance.resize();
});

const btnImportModal = document.getElementById('btn-import-modal');
const btnImportLocal = document.getElementById('btn-import-local');
const btnImportCloud = document.getElementById('btn-import-cloud');
const fileInput = document.getElementById('file-upload');
const schemaUploadInput = document.getElementById('schema-upload');
const btnCloseImport = document.getElementById('btn-close-import');
const btnSettings = document.getElementById('btn-settings');
const btnCloseSettings = document.getElementById('btn-close-settings');
const btnCloseSettingsX = document.getElementById('btn-close-settings-x');
const btnSaveSettings = document.getElementById('btn-save-settings');
const btnAddSchemaRow = document.getElementById('btn-add-schema-row');
const btnImportSchemaCsv = document.getElementById('btn-import-schema-csv');
const btnExportSchemaConfig = document.getElementById('btn-export-schema-config');
const btnLoadSchemaConfig = document.getElementById('btn-load-schema-config');
const schemaConfigLoadInput = document.getElementById('schema-config-load');

const schemaBody = document.getElementById('schema-body');
const tableHeaders = document.getElementById('table-headers');
const tableBody = document.getElementById('table-body');
const ignoredTableHeaders = document.getElementById('ignored-table-headers');
const ignoredTableBody = document.getElementById('ignored-table-body');
const valTotalItems = document.getElementById('val-total-items');
const valUnrecognized = document.getElementById('val-unrecognized');
const valIgnored = document.getElementById('val-ignored');

const lastBackupDateSpan = document.getElementById('last-backup-date');
let storedLastBackupDate = localStorage.getItem('scandoc_last_backup') || 'Never';
if(lastBackupDateSpan) lastBackupDateSpan.innerText = 'Last Backup: ' + storedLastBackupDate;

// --- 1. SETTINGS MANAGEMENT --- //
function renderSchemaEditor() {
  schemaBody.innerHTML = '';
  schema.forEach((col) => addSchemaRowToDOM(col.name, col.type, col.visible !== false));
}

function addSchemaRowToDOM(name = '', type = 'string', visible = true) {
  const tr = document.createElement('tr');
  tr.className = 'schema-row';
  tr.innerHTML = `
    <td><input type="text" value="${name}" class="schema-name" placeholder="Column Header Name" style="width:100%; padding:0.4rem;"/></td>
    <td>
      <select class="schema-type" style="padding:0.4rem;">
        <option value="string" ${type === 'string' ? 'selected' : ''}>String</option>
        <option value="number" ${type === 'number' ? 'selected' : ''}>Number</option>
        <option value="currency" ${type === 'currency' ? 'selected' : ''}>Currency ($)</option>
        <option value="date" ${type === 'date' ? 'selected' : ''}>Date</option>
      </select>
    </td>
    <td style="text-align: center;">
      <input type="checkbox" class="schema-visible" style="transform: scale(1.3);" ${visible ? 'checked' : ''} />
    </td>
    <td><button class="nav-btn cancel btn-del-row">X</button></td>
  `;
  tr.querySelector('.btn-del-row').addEventListener('click', () => { tr.remove(); updateDynamicDropdownsFromDOM(); });
  tr.querySelector('.schema-name').addEventListener('input', updateDynamicDropdownsFromDOM);
  schemaBody.appendChild(tr);
  updateDynamicDropdownsFromDOM();
}

function updateDynamicDropdownsFromDOM() {
  const selectX = document.getElementById('analytics-xaxis');
  const selectY1 = document.getElementById('analytics-yaxis1');
  const selectY2 = document.getElementById('analytics-yaxis2');
  
  const currentX = selectX.value;
  const currentY1 = selectY1.value;
  const currentY2 = selectY2.value;

  let optionsHtml = '';
  document.querySelectorAll('.schema-row .schema-name').forEach(input => {
    const val = input.value.trim();
    if (val) optionsHtml += `<option value="${val}">${val}</option>`;
  });

  selectX.innerHTML = optionsHtml;
  selectY1.innerHTML = optionsHtml;
  selectY2.innerHTML = '<option value="">-- None --</option>' + optionsHtml;

  if (currentX) selectX.value = currentX; else if (analyticsConfig.xAxis) selectX.value = analyticsConfig.xAxis;
  if (currentY1) selectY1.value = currentY1; else if (analyticsConfig.yAxis1) selectY1.value = analyticsConfig.yAxis1;
  if (currentY2) selectY2.value = currentY2; else if (analyticsConfig.yAxis2) selectY2.value = analyticsConfig.yAxis2;
}

function loadSettingsToUI() {
  // Cloud
  document.getElementById(`cloud-${cloudSettings.active}`).checked = true;
  document.getElementById('google-doc-id').value = cloudSettings.google.docId;
  document.getElementById('google-api-key').value = cloudSettings.google.apiKey;
  const authMode = cloudSettings.google.authMode || 'api_key';
  document.querySelector(`input[name="google_auth_mode"][value="${authMode}"]`).checked = true;
  toggleGoogleAuthUI(authMode);
  document.getElementById('ms-workbook-id').value = cloudSettings.microsoft.workbookId;
  document.getElementById('ms-access-token').value = cloudSettings.microsoft.token;
  document.getElementById('airtable-base-id').value = cloudSettings.airtable.baseId;
  document.getElementById('airtable-table-name').value = cloudSettings.airtable.tableName;
  document.getElementById('airtable-api-key').value = cloudSettings.airtable.apiKey;
  document.getElementById('workspace-name').value = localStorage.getItem('scandoc_workspace_name') || '';

  // Analytics Type
  document.getElementById('analytics-type').value = analyticsConfig.type;
}

function toggleGoogleAuthUI(mode) {
  if (mode === 'api_key') {
    document.getElementById('google-api-key').style.display = 'block';
    document.getElementById('google-service-account-upload').style.display = 'none';
  } else {
    document.getElementById('google-api-key').style.display = 'none';
    document.getElementById('google-service-account-upload').style.display = 'block';
  }
}

document.querySelectorAll('input[name="google_auth_mode"]').forEach(radio => {
  radio.addEventListener('change', (e) => toggleGoogleAuthUI(e.target.value));
});

let tempServiceAccountJson = null;

document.getElementById('google-sa-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      tempServiceAccountJson = JSON.parse(event.target.result);
      document.getElementById('google-sa-status').innerText = '✅ Valid JSON Loaded';
      document.getElementById('google-sa-status').style.color = '#2ea043';
    } catch (err) {
      document.getElementById('google-sa-status').innerText = '❌ Invalid JSON File';
      document.getElementById('google-sa-status').style.color = 'var(--danger-color)';
    }
  };
  reader.readAsText(file);
});

btnAddSchemaRow.addEventListener('click', () => addSchemaRowToDOM());

btnSettings.addEventListener('click', () => {
  if (cloudSettings.google.serviceAccountJson) tempServiceAccountJson = cloudSettings.google.serviceAccountJson;
  renderSchemaEditor();
  loadSettingsToUI();

  // Ensure all accordions are collapsed initially
  document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
  document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));

  modalSettings.classList.add('visible');
});

btnCloseSettings.addEventListener('click', () => modalSettings.classList.remove('visible'));
btnCloseSettingsX.addEventListener('click', () => modalSettings.classList.remove('visible'));

btnSaveSettings.addEventListener('click', () => {
  // Save Schema
  const rows = schemaBody.querySelectorAll('.schema-row');
  let newSchema = [];
  rows.forEach(tr => {
    const name = tr.querySelector('.schema-name').value.trim();
    const type = tr.querySelector('.schema-type').value;
    const visible = tr.querySelector('.schema-visible').checked;
    if (name) newSchema.push({ name, type, visible });
  });
  schema = newSchema;
  localStorage.setItem('scandoc_schema', JSON.stringify(schema));

  // Save Cloud
  cloudSettings.active = document.querySelector('input[name="active_cloud"]:checked').value;
  cloudSettings.google = { 
    authMode: document.querySelector('input[name="google_auth_mode"]:checked').value,
    docId: document.getElementById('google-doc-id').value.trim(), 
    apiKey: document.getElementById('google-api-key').value.trim(),
    serviceAccountJson: tempServiceAccountJson
  };
  cloudSettings.microsoft = { workbookId: document.getElementById('ms-workbook-id').value.trim(), token: document.getElementById('ms-access-token').value.trim() };
  cloudSettings.airtable = { baseId: document.getElementById('airtable-base-id').value.trim(), tableName: document.getElementById('airtable-table-name').value.trim(), apiKey: document.getElementById('airtable-api-key').value.trim() };
  localStorage.setItem('scandoc_cloud', JSON.stringify(cloudSettings));

  // Save Analytics config
  analyticsConfig.type = document.getElementById('analytics-type').value;
  analyticsConfig.xAxis = document.getElementById('analytics-xaxis').value;
  analyticsConfig.yAxis1 = document.getElementById('analytics-yaxis1').value;
  analyticsConfig.yAxis2 = document.getElementById('analytics-yaxis2').value;
  localStorage.setItem('scandoc_analytics', JSON.stringify(analyticsConfig));

  modalSettings.classList.remove('visible');
  processData(); 
});

// Schema Generator Hook
btnImportSchemaCsv.addEventListener('click', () => schemaUploadInput.click());
schemaUploadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  Papa.parse(file, {
    header: true,
    preview: 1, // Only read the very top of massive files
    complete: function(results) {
      if (results.meta && results.meta.fields) {
        schemaBody.innerHTML = ''; 
        results.meta.fields.forEach((header) => {
          addSchemaRowToDOM(header, 'string', true);
        });
      }
      e.target.value = '';
    }
  });
});

// Schema Config Backup Hook
btnExportSchemaConfig.addEventListener('click', () => {
  const rows = schemaBody.querySelectorAll('.schema-row');
  let currentEditorSchema = [];
  rows.forEach(tr => {
    const name = tr.querySelector('.schema-name').value.trim();
    const type = tr.querySelector('.schema-type').value;
    const visible = tr.querySelector('.schema-visible').checked;
    if (name) currentEditorSchema.push({ name, type, visible });
  });
  
  if (currentEditorSchema.length === 0) return alert("No columns to backup!");

  const currentCloudActive = document.querySelector('input[name="active_cloud"]:checked').value;
  const activeCloudConfig = {
    active: currentCloudActive,
    google: { 
      authMode: document.querySelector('input[name="google_auth_mode"]:checked').value,
      docId: document.getElementById('google-doc-id').value.trim(), 
      apiKey: document.getElementById('google-api-key').value.trim(),
      serviceAccountJson: tempServiceAccountJson
    },
    microsoft: { workbookId: document.getElementById('ms-workbook-id').value.trim(), token: document.getElementById('ms-access-token').value.trim() },
    airtable: { baseId: document.getElementById('airtable-base-id').value.trim(), tableName: document.getElementById('airtable-table-name').value.trim(), apiKey: document.getElementById('airtable-api-key').value.trim() }
  };
  
  const currentAnalyticsConfig = {
    type: document.getElementById('analytics-type').value,
    xAxis: document.getElementById('analytics-xaxis').value,
    yAxis1: document.getElementById('analytics-yaxis1').value,
    yAxis2: document.getElementById('analytics-yaxis2').value
  };

  const inputName = document.getElementById('workspace-name').value.trim();
  if (!inputName) {
    return alert("Please enter a workspace name before saving the configuration!");
  }

  const safeName = inputName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (!safeName) {
     return alert("Please use valid letters or numbers for the workspace name.");
  }

  let savedNames = JSON.parse(localStorage.getItem('omnidash_saved_configs')) || [];
  if (savedNames.includes(safeName)) {
    return alert("A workspace configuration with this name already exists in our records! Please choose a unique name.");
  }

  localStorage.setItem('scandoc_workspace_name', inputName);

  const fullWorkspace = {
    workspaceName: inputName,
    schema: currentEditorSchema,
    cloud: activeCloudConfig,
    analytics: currentAnalyticsConfig
  };
  
  const blobContent = JSON.stringify(fullWorkspace, null, 2);
  localStorage.setItem('omnidash_config_' + safeName, blobContent);

  savedNames.push(safeName);
  localStorage.setItem('omnidash_saved_configs', JSON.stringify(savedNames));
  
  updateConfigDropdown();
  if (document.getElementById('config-dropdown')) {
    document.getElementById('config-dropdown').value = safeName;
  }
  
  alert("Configuration saved successfully to local records!");

  const now = new Date().toLocaleString();
  localStorage.setItem('scandoc_last_backup', now);
  if(document.getElementById('last-backup-date')) {
    document.getElementById('last-backup-date').innerText = 'Last Backup: ' + now;
  }
});

function applyWorkspaceConfig(loaded) {
  schemaBody.innerHTML = '';
  
  let loadedSchemaToUse = [];
  
  if (Array.isArray(loaded)) {
    loadedSchemaToUse = loaded;
  } else if (loaded && loaded.schema) {
    loadedSchemaToUse = loaded.schema;
    if (loaded.cloud) {
       cloudSettings = loaded.cloud; 
       loadSettingsToUI();
    }
    if (loaded.analytics) {
       analyticsConfig = loaded.analytics;
       document.getElementById('analytics-type').value = analyticsConfig.type;
    }
  } else {
    throw new Error("Invalid format");
  }
  
  loadedSchemaToUse.forEach(col => addSchemaRowToDOM(col.name, col.type, col.visible !== false));
  
  if (!Array.isArray(loaded) && loaded.analytics) {
     if (loaded.analytics.xAxis) document.getElementById('analytics-xaxis').value = loaded.analytics.xAxis;
     if (loaded.analytics.yAxis1) document.getElementById('analytics-yaxis1').value = loaded.analytics.yAxis1;
     if (loaded.analytics.yAxis2) document.getElementById('analytics-yaxis2').value = loaded.analytics.yAxis2;
  }
  
  if (!Array.isArray(loaded) && loaded.workspaceName) {
     document.getElementById('workspace-name').value = loaded.workspaceName;
     localStorage.setItem('scandoc_workspace_name', loaded.workspaceName);
  } else {
     document.getElementById('workspace-name').value = '';
     localStorage.setItem('scandoc_workspace_name', '');
  }
  
  alert("Workspace loaded successfully! Don't forget to hit 'Save All Settings' below.");
}

// Schema Config Load Hook
btnLoadSchemaConfig.addEventListener('click', () => schemaConfigLoadInput.click());
schemaConfigLoadInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const loaded = JSON.parse(event.target.result);
      
      const rawName = file.name.replace(/\.json$/i, '');
      const safeName = rawName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30) || 'imported_config';
      
      let savedNames = JSON.parse(localStorage.getItem('omnidash_saved_configs')) || [];
      if (!savedNames.includes(safeName)) {
        savedNames.push(safeName);
        localStorage.setItem('omnidash_saved_configs', JSON.stringify(savedNames));
      }
      localStorage.setItem('omnidash_config_' + safeName, event.target.result);
      
      loaded.workspaceName = safeName;
      
      applyWorkspaceConfig(loaded);
      
      updateConfigDropdown();
      if (document.getElementById('config-dropdown')) {
        document.getElementById('config-dropdown').value = safeName;
      }
      
    } catch (err) {
      alert("Failed to load config: Invalid file format.");
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

// Config Dropdown Actions
const btnLoadSelected = document.getElementById('btn-load-selected');
const btnDownloadSelected = document.getElementById('btn-download-selected');
const configDropdown = document.getElementById('config-dropdown');

function updateConfigDropdown() {
  if (!configDropdown) return;
  configDropdown.innerHTML = '<option value="">-- Select Config --</option>';
  let savedNames = JSON.parse(localStorage.getItem('omnidash_saved_configs')) || [];
  savedNames.forEach(name => {
    configDropdown.innerHTML += `<option value="${name}">${name}</option>`;
  });
}
updateConfigDropdown();

if (btnLoadSelected) {
  btnLoadSelected.addEventListener('click', () => {
    const selected = configDropdown.value;
    if (!selected) return alert("Please select a config from the dropdown!");
    const storedStr = localStorage.getItem('omnidash_config_' + selected);
    if (!storedStr) return alert("Config data missing in storage!");
    try { applyWorkspaceConfig(JSON.parse(storedStr)); }
    catch(err) { alert("Stored config is corrupt!"); }
  });
}

if (btnDownloadSelected) {
  btnDownloadSelected.addEventListener('click', () => {
    const selected = configDropdown.value;
    if (!selected) return alert("Please select a config from the dropdown!");
    const storedStr = localStorage.getItem('omnidash_config_' + selected);
    if (!storedStr) return alert("Config data missing in storage!");
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([storedStr], { type: 'application/json' }));
    a.download = `${selected}_workspace_backup.json`;
    a.click();
  });
}

// --- 2. IMPORT MANAGEMENT --- //
btnImportModal.addEventListener('click', () => modalImport.classList.add('visible'));
btnCloseImport.addEventListener('click', () => modalImport.classList.remove('visible'));

btnImportLocal.addEventListener('click', () => { fileInput.click(); modalImport.classList.remove('visible'); });

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  Papa.parse(file, { header: true, skipEmptyLines: true, complete: function(results) { injectDataIntoGlobal(results.data); } });
});

btnImportCloud.addEventListener('click', async () => {
  modalImport.classList.remove('visible');
  const provider = cloudSettings.active;
  if (provider === 'google') {
    const { authMode, docId, apiKey, serviceAccountJson } = cloudSettings.google;
    if (!docId) return alert("Please specify Spreadsheet ID in Settings.");
    if (authMode === 'api_key' && !apiKey) return alert("Please specify API Key in Settings.");
    if (authMode === 'service_account' && !serviceAccountJson) return alert("Please upload Service Account JSON in Settings.");
    
    try {
      const currentAuthMode = authMode || 'api_key';
      const rows = await window.googleApp.fetchGoogleSheet({
        authMode: currentAuthMode,
        docId,
        apiKey,
        serviceAccountJson
      });
      if (!rows || rows.length < 2) return alert("Sheet has no data.");
      const headers = rows[0];
      let parsedData = [];
      for (let i = 1; i < rows.length; i++) {
        let obj = {};
        for(let j=0; j < headers.length; j++) obj[headers[j]] = rows[i][j] || "";
        parsedData.push(obj);
      }
      injectDataIntoGlobal(parsedData);
    } catch (err) { alert("Error fetching from Google Drive: " + err.message); }
  } 
  else { alert(`${provider.toUpperCase()} provider assumes OAuth. This endpoint is stubbed for Demo.`); }
});

function injectDataIntoGlobal(dataList) {
  globalData = dataList.map((row, i) => ({ ...row, _id: i, _ignored: false, _selected: false }));
  processData();
}

// --- 3. FILTERING & TOGGLES LOGIC --- //
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = parseInt(e.target.getAttribute('data-months'));
    processData();
  });
});

['smooth','grid','stacked','fill'].forEach(btnId => {
  document.getElementById('toggle-'+btnId).addEventListener('click', (e) => {
    chartToggles[btnId] = !chartToggles[btnId];
    e.target.classList.toggle('active');
    const processedActiveData = globalData.filter(row => !row._ignored);
    renderAnalytics(processedActiveData);
  });
});

function toggleSelect(id) { const row = globalData.find(r => r._id === id); if (row) row._selected = !row._selected; }

// Helper for filtering cleanly for bulk select
function getFilteredActiveData() {
  const dateCol = schema.find(c => c.type === 'date')?.name;
  let filteredData = globalData;
  if (dateCol && currentFilter > 0) {
    const cutoffDate = new Date(); cutoffDate.setMonth(cutoffDate.getMonth() - currentFilter);
    filteredData = globalData.filter(row => row[dateCol] && new Date(row[dateCol]) >= cutoffDate);
  }
  return filteredData.filter(row => !row._ignored);
}

// --- 4. DATA PROCESSING & RENDERING --- //
function processData() {
  if (globalData.length === 0) { renderDataGrids([], []); return; }
  const activeData = getFilteredActiveData();
  const ignoredData = globalData.filter(row => row._ignored);
  
  valTotalItems.innerText = activeData.length;
  valUnrecognized.innerText = activeData.filter(r => Object.values(r).some(v => v === '' || v === undefined)).length;
  valIgnored.innerText = ignoredData.length; 
  renderDataGrids(activeData, ignoredData);
  renderAnalytics(activeData);
}

function renderDataGrids(active = [], ignored = []) {
  const visibleSchema = schema.filter(col => col.visible !== false);
  
  tableHeaders.innerHTML = `<th style="width: 40px;">☑️</th>` + visibleSchema.map(col => `<th>${col.name}</th>`).join('');
  ignoredTableHeaders.innerHTML = `<th style="width: 40px;">☑️</th>` + visibleSchema.map(col => `<th>${col.name}</th>`).join('');
  
  const generateRowHtml = (dataList) => {
    if (dataList.length === 0) return `<tr><td colspan="${visibleSchema.length + 1}" style="text-align:center;">No data available.</td></tr>`;
    return dataList.slice(0, 500).map(row => {
      let cells = visibleSchema.map(col => `<td>${(col.type === 'currency' && row[col.name] && !isNaN(row[col.name])) ? '$'+parseFloat(row[col.name]).toFixed(2) : (row[col.name]||'')}</td>`).join('');
      return `<tr><td><input type="checkbox" class="select-toggle" data-id="${row._id}" ${row._selected ? 'checked' : ''}/></td>${cells}</tr>`;
    }).join('');
  };
  tableBody.innerHTML = generateRowHtml(active); 
  ignoredTableBody.innerHTML = generateRowHtml(ignored);
  document.querySelectorAll('.select-toggle').forEach(chk => chk.addEventListener('change', (e) => toggleSelect(parseInt(e.currentTarget.getAttribute('data-id')))));
}

// --- 5. BULK EXPORT ACTIONS --- //
// Active Toolbars
document.getElementById('btn-select-all').addEventListener('click', () => {
  const activeIds = getFilteredActiveData().map(r => r._id);
  globalData.forEach(r => { if (activeIds.includes(r._id)) r._selected = true; }); processData();
});
document.getElementById('btn-clear').addEventListener('click', () => {
  globalData.forEach(r => { if (!r._ignored) r._selected = false; }); processData();
});
document.getElementById('btn-bulk-ignore').addEventListener('click', () => {
  globalData.forEach(r => { if (!r._ignored && r._selected) { r._ignored = true; r._selected = false; } }); processData();
});

// Ignored Toolbars
document.getElementById('btn-select-all-ignored').addEventListener('click', () => {
  globalData.forEach(r => { if (r._ignored) r._selected = true; }); processData();
});
document.getElementById('btn-clear-ignored').addEventListener('click', () => {
  globalData.forEach(r => { if (r._ignored) r._selected = false; }); processData();
});
document.getElementById('btn-bulk-restore').addEventListener('click', () => {
  globalData.forEach(r => { if (r._ignored && r._selected) { r._ignored = false; r._selected = false; } }); processData();
});

// Exports
document.getElementById('btn-csv-export').addEventListener('click', () => {
  const data = globalData.filter(r => !r._ignored && r._selected);
  if (data.length===0) return alert("Select items first.");
  const clean = data.map(r => { const o={...r}; delete o._id; delete o._ignored; delete o._selected; return o; });
  downloadBlob(Papa.unparse(clean), "omnidash_export.csv", "text/csv");
});

document.getElementById('btn-json-export').addEventListener('click', () => {
  const data = globalData.filter(r => !r._ignored && r._selected);
  if (data.length===0) return alert("Select items first.");
  const clean = data.map(r => { const o={...r}; delete o._id; delete o._ignored; delete o._selected; return o; });
  downloadBlob(JSON.stringify(clean, null, 2), "omnidash_export.json", "application/json");
});

document.getElementById('btn-print').addEventListener('click', () => {
  const data = globalData.filter(r => !r._ignored && r._selected);
  if (data.length===0) return alert("Select items first.");
  let html = '<html><head><title>Print Report</title><style>table{width:100%;border-collapse:collapse;font-family:sans-serif;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background-color:#f2f2f2;}</style></head><body><h2>OmniDash Selected Data</h2><table>';
  html += '<tr>' + schema.map(c => `<th>${c.name}</th>`).join('') + '</tr>';
  data.forEach(row => { html += '<tr>' + schema.map(c => `<td>${row[c.name]||''}</td>`).join('') + '</tr>'; });
  html += '</table><script>window.print();</sc'+'ript></body></html>';
  const p = window.open('','','width=800,height=600'); p.document.write(html); p.document.close();
});

function downloadBlob(content, name, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], {type})); a.download=name; a.click();
}

function renderAnalytics(data) {
  const { type, xAxis, yAxis1, yAxis2 } = analyticsConfig;
  if (!xAxis || !yAxis1) return; 

  const agg = {};
  data.forEach(row => {
    const xVal = row[xAxis];
    const yVal1 = parseFloat(row[yAxis1].toString().replace(/[^0-9.-]+/g,"")) || 0;
    const yVal2 = yAxis2 ? (parseFloat(row[yAxis2].toString().replace(/[^0-9.-]+/g,"")) || 0) : 0;
    if (!xVal) return;
    if (!agg[xVal]) agg[xVal] = { y1: 0, y2: 0 };
    agg[xVal].y1 += yVal1; agg[xVal].y2 += yVal2;
  });

  const isTime = schema.find(c => c.name === xAxis)?.type === 'date';
  const sortedDates = Object.keys(agg).sort((a,b) => isTime ? new Date(a) - new Date(b) : a.localeCompare(b));
  
  const chartData1 = sortedDates.map(d => agg[d].y1);
  const chartData2 = sortedDates.map(d => agg[d].y2);

  const datasets = [{
    label: yAxis1, data: chartData1, borderColor: '#58a6ff', backgroundColor: 'rgba(88, 166, 255, 0.2)', borderWidth: 2, 
    fill: chartToggles.fill, tension: chartToggles.smooth ? 0.4 : 0
  }];

  if (yAxis2) datasets.push({ label: yAxis2, data: chartData2, borderColor: '#d29922', backgroundColor: 'rgba(210, 153, 34, 0.2)', borderWidth: 2, 
    fill: chartToggles.fill, tension: chartToggles.smooth ? 0.4 : 0 });

  const ctx = document.getElementById('analytics-chart').getContext('2d');
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: type,
    data: { labels: sortedDates, datasets: datasets },
    options: { 
      responsive: true, maintainAspectRatio: false, 
      plugins: { legend: { labels: { color: '#c9d1d9' } } }, 
      scales: { 
        x: { 
          stacked: chartToggles.stacked,
          ticks: { color: '#8b949e' }, 
          grid: { color: '#30363d', display: chartToggles.grid } 
        }, 
        y: { 
          stacked: chartToggles.stacked,
          ticks: { color: '#8b949e' }, 
          grid: { color: '#30363d', display: chartToggles.grid } 
        } 
      } 
    }
  });
}

renderDataGrids([], []);

// Accordion Logic for Settings Modal
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    const isCurrentlyActive = header.classList.contains('active');
    
    // Close everything
    document.querySelectorAll('.accordion-header').forEach(h => h.classList.remove('active'));
    document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
    
    // Toggle clicked section
    if (!isCurrentlyActive) {
      header.classList.add('active');
      const targetId = header.getAttribute('data-target');
      if (targetId) document.getElementById(targetId).classList.add('active');
    }
  });
});
