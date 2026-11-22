// Structural checks for every country in public/countries/index.js. Run: npm run verify  (or: node scripts/verify-data.mjs usa)
// Exits 1 if anything is broken. Prints an outline and role counts that the country-fact-checker agent then verifies against real sources.
import fs from "node:fs";
import { COUNTRIES as CUSTOM } from "../public/countries/index.js";
import { makeGeneric } from "../public/countries/generic.js";

// Custom configs (india, usa) plus every generic country listed in public/data/countries.json
const COUNTRIES = { ...CUSTOM };
const manifest = fs.existsSync("public/data/countries.json") ? JSON.parse(fs.readFileSync("public/data/countries.json", "utf8")) : [];
for (const e of manifest) if (!COUNTRIES[e.id]) COUNTRIES[e.id] = makeGeneric(e);

const only = process.argv.slice(2);
const ids = only.length ? only : Object.keys(COUNTRIES);
let errors = 0, warns = 0;
const bad = (m) => { errors++; console.log("  ✗ " + m); };
const warn = (m) => { warns++; console.log("  ! " + m); };

for (const id of ids) {
  const C = COUNTRIES[id];
  console.log(`\n=== ${id} ===`);
  if (!C) { bad("not in public/countries/index.js"); continue; }
  const file = "public" + "/" + C.dataUrl;
  if (!fs.existsSync(file)) { bad(`missing data file ${file}`); continue; }
  const D = JSON.parse(fs.readFileSync(file, "utf8"));
  C.attach?.(D);
  const seen = new Set(), roles = {}, partyCount = {}, all = [], noParty = [], nameIsParty = [], noCard = {};
  (function walk(n, parent, depth) {
    n.parent = parent; n.depth = depth; all.push(n);
    if (seen.has(n.id)) bad(`duplicate id ${n.id}`); seen.add(n.id);
    if (!Array.isArray(n.children)) bad(`${n.id}: children is not an array`);
    if (!n.label) bad(`${n.id}: no label`);
    if (!["group", "house", "office"].includes(n.kind)) bad(`${n.id}: bad kind ${n.kind}`);
    if (n.kind === "office") {
      if (!n.person?.name) bad(`${n.id}: office without a person name`);
      roles[n.role] = (roles[n.role] || 0) + 1;
      if (!n.card && !C.person[n.role]) noCard[n.role] = (noCard[n.role] || 0) + 1;
      if (n.person?.party) partyCount[n.person.party] = (partyCount[n.person.party] || 0) + 1;
      else if (!C.nonpartisan.includes(n.role)) noParty.push(n);
      if (/^[A-Z][A-Za-z()&.\- ]{0,9}$/.test(n.person?.name || "") && n.person.name === n.person.name.toUpperCase()) nameIsParty.push(n);
    }
    (n.members || []).forEach((m) => { if (!m.name) bad(`${n.id}: member without a name`); if (m.party) partyCount[m.party] = (partyCount[m.party] || 0) + 1; });
    (n.children || []).forEach((c) => walk(c, n, depth + 1));
  })(D.root, null, 0);

  if (Object.keys(noCard).length) warn(`office cards with no card rows (no node.card and no config.person entry): ${Object.entries(noCard).map(([r, c]) => r + "=" + c).join(" ")}`);
  const sample = (a) => a.slice(0, 4).map((n) => `${n.id} ("${n.person.name}")`).join(", ");
  if (nameIsParty.length) bad(`${nameIsParty.length} cards whose "name" looks like a party code (scraper read the wrong column): ${sample(nameIsParty)}`);
  if (noParty.length) { const by = {}; noParty.forEach((n) => (by[n.role] = (by[n.role] || 0) + 1)); warn(`${noParty.length} partisan cards without a party: ${Object.entries(by).map(([r, c]) => r + "=" + c).join(" ")} e.g. ${sample(noParty.filter((n) => !nameIsParty.includes(n)))}`); }
  if (D.root.id !== C.rootId) bad(`root id is ${D.root.id}, config.rootId is ${C.rootId}`);
  const top = (arr) => arr.sort((a, b) => partyCount[b] - partyCount[a]).slice(0, 10).map((p) => `${p} (${partyCount[p]})`).join(", ");
  const noColour = Object.keys(partyCount).filter((p) => !D.partyColors?.[p]);
  const noInfo = Object.keys(partyCount).filter((p) => !C.partyInfo?.[p] && partyCount[p] >= 5);
  if (noColour.length) warn(`${noColour.length} parties without a colour, biggest: ${top(noColour)}`);
  if (noInfo.length) warn(`${noInfo.length} parties (5+ people) without a config.partyInfo blurb, biggest: ${top(noInfo)}`);
  const placeholder = all.filter((n) => n.kind === "office" && /^(minister|name|member|vacant)$/i.test(n.person?.name || ""));
  if (placeholder.length) bad(`${placeholder.length} cards with a placeholder name (Minister/Name/...): ${placeholder.slice(0, 4).map((n) => n.id).join(", ")}`);
  const noText = all.filter((n) => (n.kind === "office" ? !C.explainFor(n) : !C.explainFor(n) && n.depth < 4));
  const kinds = [...new Set(noText.map((n) => (n.kind === "office" ? "role:" + n.role : n.id.replace(/-.*/, "-*"))))];
  if (kinds.length) warn(`no plain-English text for: ${kinds.slice(0, 12).join(", ")}`);
  const dupPeople = {};
  all.filter((n) => n.kind === "office").forEach((n) => (dupPeople[n.person.name] ||= []).push(n.id));
  Object.entries(dupPeople).filter(([, v]) => v.length > 1 && v.every((i) => !/^(rep|senator|statesen|staterep|mla|mp|rsmp|legislator)/.test(all.find((n) => n.id === i).role)) && !v.some((i) => all.find((n) => n.id === i).role === "legislator")).slice(0, 8)
    .forEach(([name, v]) => warn(`${name} appears on ${v.length} cards: ${v.join(", ")}`));

  console.log(`  data: generated ${D.generatedAt}, ${all.length} nodes, ${all.filter((n) => n.kind === "office").length} office cards`);
  console.log("  role counts: " + Object.entries(roles).sort((a, b) => b[1] - a[1]).map(([r, c]) => `${r}=${c}`).join(" "));
  console.log("  parties (cards + members): " + Object.entries(partyCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([p, c]) => `${p}=${c}`).join(" "));
  console.log("  outline:");
  (function show(n, d) {
    if (d > 2) return;
    console.log(`  ${"  ".repeat(d)}- ${n.id} [${n.kind}${n.role ? "/" + n.role : ""}] ${n.label}${n.person ? " — " + n.person.name + (n.person.party ? " (" + n.person.party + ")" : "") : ""}${n.children.length > 6 && d === 2 ? ` (+${n.children.length} children)` : ""}`);
    n.children.slice(0, d === 2 ? 0 : 12).forEach((c) => show(c, d + 1));
  })(D.root, 0);
}
console.log(`\n${errors} error(s), ${warns} warning(s)`);
process.exit(errors ? 1 : 0);
