# Ishita Portfolio — Admin Edition

## Run locally
Just open `index.html` (or use VS Code Live Server).

## Deploy on GitHub Pages
1. Push these files to a GitHub repo (root or `/docs`).
2. Repo Settings → Pages:
   - Source: Deploy from a branch
   - Branch: `main` (or `master`), folder `/ (root)` or `/docs`
3. Wait for the Pages URL to appear; open it.

## Admin panel (add/edit tiles from the frontend)
Open Admin:
- **Ctrl/⌘ + Shift + A**, OR
- **Triple-click the name** “Ishita Raghuvanshi”

### Set the password (required)
This is a **client-side privacy gate**.
1. Open your live site.
2. Press **F12 → Console**
3. Run:
   `await window.__hash("your-new-password")`
4. Copy the printed hex string.
5. In `script.js`, set:
   `const ADMIN_PASSWORD_HASH = "PASTE_HASH_HERE";`
6. Commit and redeploy.

### Where edits are saved
- Admin edits are saved to **localStorage** for your browser (so it feels like “saving”).
- Other visitors will still see the default projects until you **publish** changes.

### Publish admin changes for everyone
1. Open Admin → click **Export JSON**
2. Save the file as `projects.json` in the repo root
3. In `script.js`, set:
   `const LOAD_PROJECTS_FROM_JSON = true;`
4. Commit both and redeploy.

## Embeds (PDF/Figma/etc.)
- Upload PDFs/images into `/assets/` and use `assets/yourfile.pdf` in **Embed src**.
- For Figma, use the Figma embed URL.

## “Real” security + true editing for only you
GitHub Pages is static. If you want real login + editing that writes to your repo:
- Use **Decap (Netlify) CMS** with Git Gateway, or
- Use a small backend (Firebase/ Supabase) and load data from there.
