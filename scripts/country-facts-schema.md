# Adding a country: the spec format

One country = one file, `scripts/countries/<id>.mjs`, that `export default`s a spec. The generic builder does the rest:

```sh
node scripts/build-country.mjs <id> [<id>...]        # full build: photos, descriptions, bios (slow: Wikipedia rate limit)
node scripts/build-country.mjs <id> --fast           # skip photos and descriptions while you debug the scraper
node scripts/build-country.mjs <id> --force          # write the file even if the self-checks fail (don't ship that)
```

Output: `public/data/<id>.json` and an entry in `public/data/countries.json` (the manifest the country switcher reads). Requests are cached in `.cache`, so re-runs after the first are fast. Reference specs: `uk.mjs` (monarchy, two chambers, no regions), `canada.mjs` (extra office, vacancies, regions), `germany.mjs` (federal, delegates, constituency lookup), `france.mjs` (a chamber that can't be read), `japan.mjs` (multi-table chamber, regions).

## Scope: countries with big legislatures

The decision is to cover countries with **large legislatures**, not every country. A big legislature is where a full member list and an official roster source add the most value, and where hand-checking each country stays affordable. Before adding a country, confirm its combined legislature size (all chambers) against the threshold the project owner sets, and prefer countries that publish an official member list or open-data file (see the source table below). The five pilots (UK, Canada, Germany, France, Japan) are the template; India and the US keep their own builders.

## The tree the builder produces

```
<id>                       group   root (label = country, badge = ISO alpha-2)
├─ head-of-state           office  role head-of-state
│  ├─ <extra office>       office  e.g. governor-general (role head-of-state-rep), optional
│  └─ head-of-gov          office  role head-of-gov   (omit when one person is both, as in the US)
│     └─ cabinet           house   children: offices role minister (id min-…)
├─ chamber-<key> …         house   one per legislative chamber; children: legislator offices (grouped if members have `group`)
├─ judiciary               house   children: offices role justice (id justice-…)
└─ regions                 group   children: offices role regional-head, optional
```

Every office has `person`, `card {where, chosen, term}`. Every non-legislator node has `electedBy`, `reportsTo`, `plain`, `plainFacts`. Cabinet, judiciary, regions and each chamber also have `memberPlain` (the explanation shown for every member card, so it is not repeated per member).

## Official sources first (mandatory)

Wikipedia lags real events, so it must not decide who sits in a legislature, who is in the cabinet, or how many members there are. **For every new country, look for an official machine-readable source before writing a Wikipedia scraper**, use it for rosters, cabinets and counts, and fall back to Wikipedia only where none exists (and say so in `note`). Wikipedia is still fine for photos and links (match people by name), for English titles, and for people who change rarely (court judges, regional heads), but check those names against an official page where one exists.

Look for, in this order: a parliament API or open-data download (members, parties, constituencies, photos), the legislature's own member list or party-standings page, the government's cabinet page, the electoral body's results, and the court's judges page. Cache downloads through `scripts/official-sources.mjs` (`getText`, `getJson`, `getZipFile`, `getZipDir`, `parseCsv`, `nameKey`).

Sources found so far (what worked from a plain HTTP client):

| Country | Official, machine-readable | Not usable |
| --- | --- | --- |
| UK | `members-api.parliament.uk` (Members/Search for either house, Parties/StateOfTheParties, Posts/OppositionPosts; JSON, photos included) | |
| Canada | `ourcommons.ca/Members/en/search/csv` (members, ridings, parties), `ourcommons.ca/members/en/party-standings` (HTML totals), `pm.gc.ca/en/cabinet` (HTML, full titles, photos) | `sencanada.ca` (slow, shell page); BC government site |
| France | Assembly open data zip `data.assemblee-nationale.fr/.../AMO10_deputes_actifs_mandats_actifs_organes.json.zip` (574 sitting deputies, groups, constituencies); `data.senat.fr/data/senateurs/ODSEN_GENERAL.json` (348 active senators); `senat.fr/senateurs/grp.html` (group totals) | `gouvernement.fr`, `info.gouv.fr` (403/redirect), `elysee.fr` (404) |
| Germany | Bundestag open data `bundestag.de/resource/blob/472878/MdB-Stammdaten.zip` (XML, mandate type and list state); `bundesregierung.de/.../bundeskabinett` (HTML, portraits); `bundesrat.de/DE/bundesrat/mitglieder/mitglieder-node.html?param1=state-N` (HTML, delegates vs alternates in separate sections) | The Bundestag file is only as current as its date; reconcile with reported departures |
| Japan | `sangiin.go.jp/japanese/joho1/kousei/giin/221/giin.htm` (HTML, Japanese: members, caucus, constituency) | `shugiin.go.jp` (404 for the paths tried); `kunaicho.go.jp` (redirect) |

## Generic self-checks the builder runs

Every build fails (no file written without `--force`) if any of these break:

1. **Official count:** when a chamber's loader returns `official: {count, source}`, the number of members parsed must equal it.
2. **No duplicate legislators:** no person on two legislator cards (same official id `ref`, same Wikipedia page, or same name in the same seat).
3. **Ministers who may not sit:** with `ministersCannotSit: true` in the spec (France), no minister may also be listed as a sitting legislator; the constitution requires the substitute to sit instead.
4. **Head is not a minister:** a head of state or government must not also appear as a minister card.
5. **Text hygiene:** no string field may end in a comma, semicolon or colon, or contain glued words (a lowercase letter run immediately followed by an uppercase one, e.g. "SolidaritésMinistre").
6. **No scraper leftovers:** no "N years ago", "(date as given in the party's…" or `[1]`-style footnote text in any field.
7. **Neutral tone:** scraped bios, blurbs and notes must not contain loaded labels ("far-right", "far-left", "revisionist", "extremist", "populist" and similar); set a short hand-written `bio` on the person instead.
8. **No guessing:** a list member matched only "by elimination" (the one left over on each side) fails the build; match by name, id or an official record.
9. **No scraped bios:** Wikipedia lead paragraphs are never used as a `bio`; only the one-line `blurb` and the `wiki` link are kept. A `bio` exists only when the spec writes it by hand (the builder marks it `bioHand`), and every sentence in it must be sourced. IPA strings, newlines and trailing whitespace are stripped from scraped text and checked.
10. The structural checks: unique ids, a name and a `card` on every office, no placeholder or glued names, text on every node.

## Spec fields (declarative text, written by hand)

| Field | Meaning |
| --- | --- |
| `id`, `name`, `iso2`, `flag`, `continent` (Africa, Americas, Asia, Europe, Oceania), `locale` | Identity. |
| `system`, `description`, `place`, `summary`, `stats [[label, value]]` | Shown on the root card and in `meta`. |
| `rootElectedBy`, `rootReportsTo`, `rootFacts` | Text for the root card. |
| `nonpartisan` | Roles shown as "Non-partisan" instead of "No party listed". |
| `sources [urls]` | The official sources you checked the text against. Required. |
| `normParty(raw)`, `partyColors {party: #hex}`, `partyInfo {party: [fullName, one factual sentence]}` | Party names must be the display names. Missing colours get a deterministic fallback. |
| `headOfState`, `headOfGov`, `extraOfficesSpec` | `{label, badge, place, icon, card, stats (array or fn(person)), text: {electedBy, reportsTo, plain, plainFacts [[k, v]], terms [[word, def]]}}`. `headOfGov.parent` can name an extra office to nest under. |
| `cabinet` | `{label, badge, place, membersLabel, stats(ministers), text, memberPlain, minister: {badge, card, electedBy, reportsTo, plain, plainFacts}}`. |
| `chambers {key: {...}}` | `{label, badge, place, seats, noFixedSize?, leaderTitle, memberLabel, memberBadge, card, stats(d), text, memberPlain, ungroupedLabel?}`. |
| `judiciary` | `{label, badge, place, chiefTitle, memberTitle, membersLabel, card, stats(judges), text, memberPlain, itemText}`. |
| `regions` | `{label, place, headLabel, card, stats(regions), text, memberPlain, headText}`. |
| `coverageNote` | Extra sentence added to `meta.coverage.note`. |

Icons: `flag landmark briefcase scale vote book shield crown map users pin building star`.

## `scrape(w)` returns

```js
{
  headOfState: {title, name, since, party?},         // title = Wikipedia article title (photo + bio come from it)
  headOfGov:   {title, name, since, party},
  extraOffices: [{id, role, who: {...}, spec: {...}}],
  ministers:   [{title, name, office, dept?, role?, party, since}],    // one entry per person (merge people with several portfolios)
  chambers: { <key>: { members: [{title?, name, seat, group?, party, since, ref?, image?, note?}] | null,   // ref = the official id; image = official photo URL
                       official?: {count, source},    // the official sitting count: the builder fails the build if members.length differs
                       expected?: n,                  // sitting members, when seats can be vacant and no official count exists
                       leader: {title, name, party, since}, others: [{..., role}] } },
  judges:      [{title, name, chief?, label?, since}],
  regions:     [{name, code?, capital?, headLabel?, head: {title, name, party, since}}],
  note?: "extra sentence for the coverage note"
}
```

Helpers in `w` (from `scripts/generic-depth.mjs`): `incumbent(page)` (current holder from an office article's infobox), `partyOfPage(title, norm)`, `infoboxRow(title, regex)`, `allTables(page, minRows)` → `{$, tables: [{g, h, t}]}`, `memberTable(pages, {seats, cols, pick, row, norm})`, `T`, `Tsep`, `links`, `grid`, `nameOnly`, `dateOf`, `slug`, `pageHtml`.

## Rules

- **Never fabricate.** If a member list can't be read reliably, return `members: null`. The house keeps its seat count and leader, and the builder sets `meta.coverage.legislature` to `partial` or `none` and says why. Vacancies are omitted, not invented.
- **Validate counts.** Compare what you parsed with an authoritative total (seat count, or the page's own summary table) and print the difference. Use `expected` for chambers with vacancies.
- **Check every sentence of the text against official sources** (constitution, parliament, court and government sites), not against Wikipedia, which is where the people come from. List the sources in `sources`. Anything you can't source, leave out.
- Keep the text neutral and factual.

## Wikipedia pitfalls the builder can't fix for you

- Cell text has no separators: "Minister of FinanceMinister of State…". Use `Tsep`, link texts, or an unglue regex.
- Tables repeat header rows inside the body (one per region), and rowspans make people appear twice. Skip header-like rows and dedupe by name.
- Lists mix current and former holders: look for "until", "left office" or "incumbent" columns, and keep the latest row per seat.
- Party cells hold abbreviations. Expand them with a map, or with the title of the page the cell links to.
- The first link in a cell is sometimes the office, not the person.

## Before you call a country finished

1. `node scripts/build-country.mjs <id>` ends with `SELF-CHECK: ok` (unique ids, a name on every office, no placeholder or glued names, text on every node).
2. `npm run verify -- <id>` passes.
3. Run the `country-fact-checker` agent for the country and fix everything it reports.
