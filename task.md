# OmniDash Feature Implementation Tasks

- [x] **Phase 1: Navigation & Quick Switcher**
  - [x] Add "Exit" button to Navbar.
  - [x] Add Quick Switcher dropdown to Navbar.
  - [x] Implement logic to populate Quick Switcher with saved workspaces.
  - [x] Implement "Exit" logic (clear `globalData`, clear `historicalData`, reset UI, show Title Screen).

- [x] **Phase 2: Title Screen Enhancements**
  - [x] Add animated CSS background to `#title-screen`.
  - [x] Add dynamic "Resume [Workspace]" logic on app startup.

- [x] **Phase 3: Tabbed UI & Table Layout (Zone 3)**
  - [x] Refactor Zone 3 HTML to include Tab Buttons (Current Import vs. Historical Data).
  - [x] Implement Tab 1 container (Active Data + Ignored Items).
  - [x] Adjust CSS so the Ignored Items table takes less vertical space.
  - [x] Implement Tab 2 container (Historical Data Table).
  - [x] Add Javascript to handle switching active tabs and showing/hiding containers.

- [x] **Phase 4: Historical Data Architecture & Graphing**
  - [x] Initialize `historicalData` array and bind to `localStorage` based on active workspace.
  - [x] Add "Save to History" button in Tab 1.
  - [x] Implement duplicate prevention logic when moving rows from Active to History.
  - [x] Hook the Tab switching logic into the `renderAnalytics` function so the graph dynamically updates depending on which tab is viewed.

- [x] **Phase 5: Verification & Polish**
  - [x] Test the full data flow from Import -> Save to History -> Quick Switch Workspace -> Exit.

- [x] **Phase 6: Future Fixes & Improvements**
  - [x] **UI/Layout:** Fix the graph width issue when tables toggle from expanded to stacked view (ensure 50/50 horizontal split instead of graph taking over most of the screen).
  - [x] **Data Export:** Move the CSV and JSON download buttons from the "Current Import" table to the "Historical Data" table, since they are intended to download the history.
  - [x] **Data Import:** Add a JSON file upload option to the "Load Data" section (currently only supports CSV and remote).
  - [x] **User Flow (Tabs):** When selecting "Load Data", automatically switch to the "Current data" (Active) view table and corresponding graph.
  - [x] **Tab Naming:** Ensure the "Historical" tab and "Current" tab terminology is clear (e.g., making sure the default active tab is "Current").
