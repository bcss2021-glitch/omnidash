# Revert to commit 180697f and reapply fixes step‑by‑step

## Goal Description
We will reset the repository to the stable commit `180697f` (May 4 2026) and then re‑apply the specific fixes that were added after that point. After each change we will run the dev server (`npm run dev`) and verify the UI behaves as expected.

## User Review Required
> [!IMPORTANT]
> Please confirm that you want to proceed with the revert to `180697f`. This will change the working tree and may discard uncommitted work.

## Open Questions
> [!CAUTION]
> None at this time.

## Proposed Changes
---
### Step 1 – Revert to stable commit
- **Action**: `git checkout 180697f`
- **Verification**: Run `npm run dev` and open the app in a browser to ensure it loads without the recent bugs.
---
### Step 2 – Re‑apply fixes (one at a time)
The following items were previously attempted (see `issue_summary.md`). We will re‑apply each, testing after each step:
1. **Bypass aggressive browser caching** – ensure latest files are loaded.
2. **Fix "Illegal return statement" syntax error** – correct duplicated code blocks.
3. **Resolve null‑reference errors** that prevented UI interaction.
4. **Restore "Start Fresh" button functionality**.
5. **Re‑enable print functionality**.
6. **Adjust UI layout modifications** (graph width, table toggling).
7. **Accordion collapse functionality** – ensure it works.
8. **Relocate export (CSV/JSON) buttons** to the historical data view.
9. **Re‑implement caching work‑arounds** (e.g., meta tags, service‑worker busting).
10. **Verify full data workflow** (import → save to history → workspace switch → exit).
---
### Step 3 – Final regression test
- Run the full test suite (manual steps documented in `issue_summary.md`).
- Commit the combined changes with a clear message, e.g., `"Restore stable base (180697f) and re‑apply UI fixes"`.

## Verification Plan
### Automated Tests
- `npm run dev` → open `http://localhost:3000` (or appropriate port).
- Visually confirm each UI element works after its respective fix.

### Manual Verification
- Perform the import‑save‑switch‑exit flow.
- Check that the graph updates correctly for both current and historical tabs.
- Ensure export buttons download the correct data.

Once you approve this plan, I will create a task list and start executing the steps.
