# Indian Org Chart

Interactive org chart of Indian politics: the President, Vice President, Prime Minister and Union Cabinet, both houses of Parliament (all Lok Sabha and Rajya Sabha members), and every state and Union Territory with its Governor, Chief Minister, Council of Ministers, Vidhan Sabha and MLAs grouped by district. Click any card for a plain-English explanation of the office, how the person got there, and which party they belong to.

**Live:** https://siddharthsimharaju.github.io/Indian-org-chart/

## Run locally

```sh
npm install
npm start            # http://localhost:5173
```

## Refresh the data

```sh
npm run build:data   # scrapes Wikipedia -> public/data/india.json
```

Officeholders, parties, constituencies, photos and descriptions come from Wikipedia (CC BY-SA 4.0), cached in `.cache/` (not committed). Constitutional facts live in `scripts/static-facts.mjs`; the plain-English explanations and party notes live in `public/explain.js`.

## Deploying

Pushing to `main` publishes the `public/` folder to GitHub Pages through `.github/workflows/pages.yml`.

## Controls

Drag to pan, ⌘/Ctrl + scroll to zoom, `/` to search, `Esc` to close the panel.

## Not covered

Local-body representatives, civil servants and party office-bearers are not included, and state legislative councils (MLCs) are not yet added.
