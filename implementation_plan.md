# OmniDash: Historical Data & UI Enhancements Plan (Finalized)

This plan outlines the architectural changes required to support persisting historical data per profile, drawing analytics dynamically based on tabs, and enhancing the user experience with a polished intro screen, logout function, and quick profile switcher.

## Approved Decisions

1. **Dynamic Analytics (Graph Toggling):** The Analytics Chart will dynamically switch its data source based on the active tab in Zone 3. If you are viewing the "Current Import" tab, the graph shows newly imported data. If you switch to the "Historical Data" tab, the graph shows historical data.
2. **Table Layout:** Zone 3 will use a Tabbed Interface. Tab 1 ("Current Import") will contain the existing Active and Ignored tables stacked, but the Ignored table will occupy less vertical space by default. Tab 2 will contain the new Historical Data table.
3. **Logout Behavior:** Clicking "Exit Workspace" will clear out the currently imported active data from the screen, returning the app to a clean state on the Intro Screen while preserving all saved historical data.
4. **Duplicate Prevention:** The "Save to History" function will implement logic to prevent identical rows from being appended to history multiple times.
5. **Quick Profile Switcher:** A dropdown or quick-access menu will be added to the main Navbar to allow switching between saved configs/profiles without needing to open the Settings Modal.

## Proposed Changes

### 1. Intro Page & Navigation Enhancements
- **Title Screen Overhaul:** Add a dynamic, animated CSS gradient background to the `#title-screen` to give it a premium, modern feel.
- **Resume Feature:** The Title Screen will detect the last used workspace from `localStorage` and display a "Resume [Workspace Name]" button alongside "Start Fresh".
- **Navbar Controls:** 
  - Add an "Exit" button to clear the session and return to the Title Screen.
  - Add a "Quick Switcher" dropdown in the navbar populated with all saved workspaces to allow rapid profile changing.

---

### 2. Data Architecture: Active vs. Historical
- **Historical Storage:** Introduce `historicalData` array in memory, backed by `localStorage.getItem('omnidash_history_' + profileName)`.
- **Startup/Switch Sequence:** Upon initialization or switching profiles, the app will load the profile's Schema and its `historicalData`.
- **Duplicate Prevention Engine:** When moving data from Active to History, a hash of the row values will be checked against existing history to silently ignore duplicates.

---

### 3. UI Layout Adjustments (Zone 3 & 4)
#### [MODIFY] src/index.html
- Convert the Zone 3 Data area into a **Tabbed Interface**:
  - **Tab 1: Current Import** (Contains Active Data table, "Save to History" button, and Ignored Items table).
  - **Tab 2: Historical Repository** (Contains the historical data table).
- Enhance the Title Screen HTML structure.
- Update the Navbar with the Exit button and Quick Switcher.

#### [MODIFY] src/index.css
- Add styles for the Tabbed navigation UI in Zone 3.
- Adjust the `flex` properties of the Ignored Items container to occupy less vertical space.
- Add keyframe animations for the Intro Screen background.

#### [MODIFY] src/renderer.js
- Implement the Tab switching logic.
- Implement `historicalData` state management.
- Update `renderAnalytics` to accept an argument dictating whether to graph `globalData` or `historicalData` based on the active tab.
- Implement duplicate prevention in the "Save to History" function.
- Implement the "Exit" and "Quick Switch" logic.

## Verification Plan
1. **Intro Screen:** Verify the animated background and "Resume" button function correctly.
2. **Tabs & Graphing:** Import data, verify it graphs on Tab 1. Switch to Tab 2, verify graph updates to show history.
3. **Duplicates:** Attempt to save the same data twice to history; verify duplicates are rejected.
4. **Quick Switcher:** Change profiles from the navbar and ensure schemas and historical data reload correctly.
5. **Exit:** Click exit and ensure the active tables are wiped clean before showing the Intro Screen.
