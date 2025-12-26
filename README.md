# Ishita Raghuvanshi — Interactive Watercolor Portfolio (v2)

### Why this version works
In the screenshot you sent, the page was rendering with default browser styles (white background, blue links).  
That happens when the browser can’t find/load `styles.css` / `script.js` (common if files aren’t in the same folder, or if you opened the wrong `index.html`).

So this v2 uses **ONE file** (`index.html`) with **all CSS + JS inline**, which makes it much harder to break.

## Run locally
- Unzip
- Open `index.html`

If the embedded PDF is blocked by your browser when opening from disk, run a small server:
- `python -m http.server 8000`
- visit `http://localhost:8000`

## Deploy FREE with GitHub Pages
1) Create a repo (e.g., `ishita-portfolio`)  
2) Upload everything from this zip to the repo root  
3) Settings → Pages → Deploy from a branch → `main` / `(root)`

## Customize
- Edit the `PROJECTS` array inside `index.html`
- Replace `assets/ishita-placeholder.svg` with your transparent B&W portrait
- Replace `assets/sample.pdf` with your own embeds
