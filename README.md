# StackFit

A small, rule-based AI stack fit checker built from `SPEC.md`.

## Run locally

Open `index.html` directly, or serve the folder with any static file server:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

Publish the repository root with GitHub Pages. The app has no build step, backend, database, or external dependencies.

## Modify the rules

- `data/capabilities.js` defines capability dimensions and levels.
- `data/governance.js` defines governance dimensions and statuses.
- `data/tools.js` maps tool categories to capability coverage.
- `data/evidence.js` contains the small static evidence set.
- `app.js` contains the transparent assessment and verdict rules.
