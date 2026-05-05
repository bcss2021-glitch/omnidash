# Step 1 – Revert to stable commit `180697f`

- **Action**: Run the following Git command in the project root:
  ```bash
  git checkout 180697f
  # or, if you need to discard any uncommitted changes:
  git reset --hard 180697f
  ```
- **Verification**: After the checkout completes, start the development server and confirm the application loads without the recent bugs.
  ```bash
  npm run dev
  ```
  Then open the app in a browser (e.g., `http://localhost:3000`) and verify that the UI renders correctly and no errors appear.

> **Note**: This step corresponds to the first part of the implementation plan stored in `implementation_plan.md`. When you return, you can ask the AI to open that file for reference and continue with the next steps.
