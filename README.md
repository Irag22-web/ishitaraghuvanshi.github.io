# Ishita Raghuvanshi — Interactive Watercolor Portfolio (GitHub Pages)

## What this is
A modern, black-background portfolio with:
- landing page + watercolor “melt” scroll transition
- cursor-reveal menu in the upper-right
- 3D masonry project tiles (click to expand)
- detail view with an embedded file (PDF/figma/video via iframe)
- About Me with handwritten intro + transparent B&W portrait

Palette used:
- #81a6de  #689139  #ca7487  #456ab5  #d8b152

## Run locally
Open `index.html` directly.

If the embedded PDF doesn’t load due to browser restrictions, run a small local server:
- `python -m http.server 8000`
- visit `http://localhost:8000`

## Customize
### Projects
Edit `PROJECTS` inside `script.js` (title, description, embedSrc, links).

### About image
Replace `assets/ishita-placeholder.svg` with your image (transparent B&W) and update `index.html` to point to it.

## Deploy FREE with GitHub Pages
1) Create a GitHub repo (example: `ishita-portfolio`)  
2) Upload these files to the repo root  
3) Settings → Pages → “Deploy from a branch” → `main` / `(root)`  
4) Your site URL will appear there after enabling.
