# StackFit

A small, rule-based AI stack fit checker built from `SPEC.md`.

**Live demo:** https://mandlspr.github.io/stackfit/

## Validation & Scope

**What StackFit checks**

- Task capability requirements
- Governance conditions
- Stack coverage and gaps
- Overlap / redundancy
- Evidence freshness
- Overall verdict: Fit / Fit with conditions / Overbuilt / Not viable

**What StackFit does not check**

- Live credentials
- API availability
- Auth scopes
- Runtime uptime
- Production connectivity
- Real-time latency

**Validated against 3 contrasting use cases**

- Internal marketing draft → low-risk / minimal stack / Fit
- Handshake governance workflow → Fit with governance safeguards/review
- Recruitment scoring → mandatory controls / high regulatory exposure

See [StackFit V1.1 — Three Validation Tests](docs/StackFit_V1.1_Three_Validation_Tests.md).

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
