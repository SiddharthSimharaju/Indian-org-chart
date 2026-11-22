// Generic country builder. Usage: node scripts/build-country.mjs <id> [<id>...]   (flags: --fast skips photos/descriptions, --force writes even if self-checks fail)
// Each country is a spec in scripts/countries/<id>.mjs (see scripts/country-facts-schema.md). Output: public/data/<id>.json + an entry in public/data/countries.json.
import fs from "node:fs";
import { summaries, thumbs, descriptions } from "./wiki.mjs";
import * as W from "./generic-depth.mjs";
const { slug, wikiUrl, hueColor } = W;

const args = process.argv.slice(2);
const FAST = args.includes("--fast"), FORCE = args.includes("--force");
const ids = args.filter((a) => !a.startsWith("--"));
if (!ids.length) { console.error("usage: node scripts/build-country.mjs <id> [<id>...] [--fast] [--force]"); process.exit(2); }

const FACT = (label, value) => ({ label, value });
const nameKeyOf = (s) => String(s).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]+/g, " ").trim();
const PLACEHOLDER = /^(minister|name|member|vacant|tbd|n\/a|unknown)$/i;
const looksLikeParty = (s) => /^[A-Z][A-Za-z()&.\-]{1,9}$/.test(s) && s === s.toUpperCase() && s.length <= 6;
const GLUED = /[a-z](Prime Minister|Minister|President|Chancellor|Speaker|Governor|Premier|MP for|Member of)/;

async function build(id) {
  const t0 = Date.now();
  const spec = (await import(`./countries/${id}.mjs`)).default;
  console.log(`\n=== ${id}: scraping ===`);
  const data = await spec.scrape(W);

  // ---------- photos + bios ----------
  const norm = spec.normParty || ((s) => s);
  const headline = [
    data.headOfState, data.headOfGov, ...(data.extraOffices || []).map((e) => e.who), ...(data.ministers || []), ...(data.judges || []), ...(data.regions || []).map((r) => r.head),
    ...Object.values(data.chambers || {}).flatMap((c) => [c.leader, ...(c.others || [])]),
  ].filter(Boolean);
  const members = Object.values(data.chambers || {}).flatMap((c) => c.members || []);
  const headTitles = headline.map((o) => o.title).filter(Boolean);
  const memTitles = members.filter((m) => !m.image).map((m) => m.title).filter(Boolean);
  const sums = FAST ? {} : await summaries(headTitles);
  const thumbOf = FAST ? {} : await thumbs([...memTitles, ...headTitles], 120);
  const descOf = FAST ? {} : await descriptions(memTitles);

  const person = (o, extra = {}) => {
    const s = (o?.title && sums[o.title]) || {};
    return {
      name: o?.name || s.title?.replace(/\s*\(.*\)$/, "") || "",
      image: o?.image || s.image || thumbOf[o?.title] || null, blurb: s.description || o?.blurb || "", bio: o?.bio ?? s.extract ?? "", wiki: s.url || o?.wiki || (o?.title ? wikiUrl(o.title) : null),
      ...(o?.ref ? { ref: o.ref } : {}),
      party: o?.party || "", since: o?.since || "", ...(o?.constituency ? { constituency: o.constituency } : {}), ...(o?.note ? { note: o.note } : {}), ...extra,
    };
  };
  const member = (m, extra = {}) => ({
    name: m.name, image: m.image || thumbOf[m.title] || null, blurb: m.blurb || descOf[m.title] || "", bio: "", wiki: m.wiki || (m.title ? wikiUrl(m.title) : null),
    party: m.party || "", since: m.since || "", ...(m.seat ? { constituency: m.seat } : {}), ...(m.ref ? { ref: m.ref } : {}), ...(m.note ? { note: m.note } : {}), ...extra,
  });

  // ---------- tree ----------
  const used = new Set();
  const uid = (base) => { let u = base, i = 2; while (used.has(u)) u = `${base}-${i++}`; used.add(u); return u; };
  const mk = (nid, kind, label, props = {}) => { used.add(nid); return { id: nid, kind, label, children: [], ...props }; };
  const text = (t = {}) => ({ electedBy: t.electedBy, reportsTo: t.reportsTo, plain: t.plain, plainFacts: t.plainFacts, ...(t.terms ? { terms: t.terms } : {}), ...(t.summary ? { summary: t.summary } : {}) });
  const stats = (s) => (s || []).map(([l, v]) => FACT(l, v));
  const icon = (o) => ({ ...(o?.icon ? { icon: o.icon } : {}), ...(o?.color ? { color: o.color } : {}) });
  const officeNode = (nid, role, who, s, extra = {}) => mk(nid, "office", s.label, {
    badge: s.badge || "", role, place: s.place, person: person(who, s.role ? { role: s.role } : {}), card: s.card, stats: stats(typeof s.stats === "function" ? s.stats(who) : s.stats), ...text(s.text), ...icon(s), ...extra,
  });
  const mp = (s) => s.memberPlain && { memberPlain: s.memberPlain };

  // head of state (+ representatives) and head of government
  const hos = data.headOfState && officeNode("head-of-state", "head-of-state", data.headOfState, spec.headOfState);
  const extras = (data.extraOffices || []).map((e) => officeNode(e.id, e.role, e.who, e.spec));
  const hog = data.headOfGov && spec.headOfGov && officeNode("head-of-gov", "head-of-gov", data.headOfGov, spec.headOfGov);

  // cabinet
  let cabinet = null;
  if (data.ministers?.length && spec.cabinet) {
    const c = spec.cabinet;
    const mm = data.ministers.map((m) => person(m, { role: m.role || `${m.office}${m.dept ? " · " + m.dept : ""}`, mirror: true }));
    cabinet = mk("cabinet", "house", c.label, {
      badge: c.badge || "", place: c.place, stats: stats(c.stats?.(data.ministers) || c.stats), ...text(c.text), ...mp(c), members: mm, membersLabel: c.membersLabel || "Ministers", ...icon(c),
    });
    cabinet.children = data.ministers.map((m, i) => mk(uid(`min-${slug(m.office)}-${slug(m.name)}`.slice(0, 90)), "office", m.office, {
      badge: c.minister.badge || "", role: "minister", place: m.dept || c.place, person: { ...mm[i], mirror: undefined, role: undefined },
      card: c.minister.card, ...text({ electedBy: c.minister.electedBy, reportsTo: c.minister.reportsTo, plain: c.minister.plain, plainFacts: c.minister.plainFacts, terms: c.minister.terms }),
    }));
  }

  // chambers
  const chambers = [];
  const coverage = { legislature: "none", note: "" };
  const parsed = [];
  for (const [key, cs] of Object.entries(spec.chambers || {})) {
    const d = data.chambers?.[key] || {};
    const list = d.members || null;
    const leaderPerson = d.leader && person(d.leader, { role: cs.leaderTitle });
    const node = mk(`chamber-${key}`, "house", cs.label, {
      badge: cs.badge || "", place: cs.place, ...(d.leader ? { sub: `${cs.label} · ${cs.leaderTitle} ${d.leader.name}`, person: leaderPerson, personRole: cs.leaderTitle } : { sub: cs.place }),
      stats: stats(cs.stats?.(d) || cs.stats), ...text(cs.text), memberPlain: cs.memberPlain, ...icon(cs),
    });
    const lead = [d.leader && { ...leaderPerson, role: cs.leaderTitle }, ...(d.others || []).map((o) => person(o, { role: o.role }))].filter(Boolean);
    if (list) {
      node.membersLabel = cs.membersLabel || "Members";
      const lname = new Set(lead.map((l) => l.name)), ltitle = new Set(lead.map((l) => l.wiki).filter(Boolean));
      node.members = [...lead, ...list.filter((m) => !lname.has(m.name) && !(m.title && ltitle.has(wikiUrl(m.title)))).map((m) => member(m, { role: m.group && m.seat && m.seat !== m.group && !m.seat.includes(m.group) ? `${m.seat} · ${m.group}` : m.seat || m.group || "", mirror: true }))];
      const cardFor = (m) => mk(uid(`${key}-${slug(m.seat || m.group || "")}-${slug(m.name)}`.slice(0, 90)), "office", cs.memberLabel, {
        badge: cs.memberBadge || "", role: "legislator", place: m.seat || m.group || "Seat not listed", person: { ...member(m), role: undefined }, card: cs.card,
      });
      const hasGroups = list.some((m) => m.group) && cs.groupBy !== false;
      if (hasGroups) {
        const by = {};
        list.forEach((m) => (by[m.group || cs.ungroupedLabel || "Other"] ||= []).push(m));
        node.children = Object.keys(by).sort().map((g) => mk(uid(`${key}-${slug(g)}`), "group", g, {
          badge: `${by[g].length}`, place: `${cs.label} · ${by[g].length} member${by[g].length === 1 ? "" : "s"}`, accent: "District",
          plain: `The ${by[g].length} member${by[g].length === 1 ? "" : "s"} of the ${cs.label} from ${g}.`, plainFacts: [["Members", String(by[g].length)]], memberPlain: cs.memberPlain,
          stats: [FACT("Members", by[g].length)], children: by[g].map(cardFor),
        }));
      } else node.children = list.map(cardFor);
      parsed.push([cs.label, node.members.length, cs.noFixedSize ? null : (d.official?.count ?? d.expected ?? cs.seats), cs.noFixedSize ? null : cs.seats, !!cs.unconfirmed]);
    } else {
      node.summary = (cs.text?.summary || "") + " A reliable member list could not be read from Wikipedia, so members are not shown here.";
      parsed.push([cs.label, 0, cs.seats, cs.seats]);
    }
    chambers.push(node);
  }
  const seatsGot = parsed.reduce((a, p) => a + p[1], 0);
  const full = parsed.length && parsed.every(([, got, seats]) => got > 0 && (seats == null || got >= seats * 0.97));
  coverage.legislature = !parsed.length || seatsGot === 0 ? "none" : full ? "complete" : "partial";
  coverage.note = parsed.map(([l, got, exp, seats, unconf]) => `${l}: ${got}${exp ? " of " + exp + " sitting" : ""} members listed${exp == null ? " (no fixed size)" : ""}${exp && seats && exp < seats && !unconf ? ` (${seats - exp} of ${seats} seats vacant)` : ""}${unconf ? " (listed from Wikipedia; official count unconfirmed)" : ""}`).join("; ") + (spec.coverageNote ? ". " + spec.coverageNote : "") + (data.note ? ". " + data.note : "");

  // judiciary
  let judiciary = null;
  if (data.judges?.length && spec.judiciary) {
    const j = spec.judiciary, chief = data.judges.find((x) => x.chief) || data.judges[0];
    const jp = data.judges.map((x) => person(x, { role: x.label || (x.chief ? j.chiefTitle : j.memberTitle), party: "" }));
    judiciary = mk("judiciary", "house", j.label, {
      badge: j.badge || "", place: j.place, sub: `${j.label} · ${j.chiefTitle} ${chief.name}`, person: person(chief, { role: j.chiefTitle, party: "" }), personRole: j.chiefTitle,
      members: jp.map((p) => ({ ...p, mirror: true })), membersLabel: j.membersLabel || "Judges", stats: stats(j.stats?.(data.judges) || j.stats), ...text(j.text), ...mp(j), ...icon(j),
    });
    judiciary.children = data.judges.map((x, i) => mk(uid(`justice-${slug(x.name)}`), "office", x.label || (x.chief ? j.chiefTitle : j.memberTitle), {
      badge: j.badge || "", role: "justice", place: j.label, person: jp[i], card: j.card, ...text({ ...j.itemText, ...(x.chief && j.chiefText ? j.chiefText : {}) }),
    }));
  }

  // regions (first-level subdivisions and their heads)
  let regions = null;
  if (data.regions?.length && spec.regions) {
    const r = spec.regions;
    regions = mk("regions", "group", r.label, {
      badge: `${data.regions.length}`, place: r.place, stats: stats(r.stats?.(data.regions) || r.stats), ...text(r.text), ...mp(r), accent: "Districts", ...icon(r),
      children: data.regions.map((x) => officeNode(uid(`region-${slug(x.name)}`), "regional-head", x.head, {
        label: x.headLabel || r.headLabel, badge: x.code || "", place: x.name, card: r.card, text: r.headText, stats: [["Region", x.name], ...(x.capital ? [["Capital", x.capital]] : [])],
      })),
    });
  }

  // assemble: root -> head of state -> (representatives, head of government -> cabinet) ; chambers, judiciary, regions under root
  if (cabinet) (hog || hos || { children: [] }).children.push(cabinet);
  if (hog) { const parent = spec.headOfGov.parent ? extras.find((e) => e.id === spec.headOfGov.parent) : null; (parent || hos).children.push(hog); }
  if (hos) hos.children.unshift(...extras);
  const root = mk(spec.id, "group", spec.name, {
    badge: spec.iso2, place: spec.place, summary: spec.summary, plain: spec.summary, plainFacts: spec.rootFacts || [], stats: stats(spec.stats),
    electedBy: spec.rootElectedBy, reportsTo: spec.rootReportsTo,
    children: [hos, ...(hos ? [] : [hog, cabinet]), ...chambers, judiciary, regions].filter(Boolean),
  });

  // party tally for every node that lists people
  (function tally(n) {
    const src = n.members && n.members.length > 4 ? n.members : n.children.length > 2 && n.children.every((c) => c.kind === "office" && c.person) ? n.children.map((c) => c.person) : null;
    if (src) { const c = {}; src.forEach((m) => m.party && (c[m.party] = (c[m.party] || 0) + 1)); if (Object.keys(c).length) n.parties = Object.entries(c).sort((a, b) => b[1] - a[1]); }
    n.children.forEach(tally);
  })(root);

  // party colours: spec colours first, deterministic fallback for the rest
  const usedParties = new Set();
  (function w(n) { (n.members || []).forEach((m) => m.party && usedParties.add(m.party)); if (n.person?.party) usedParties.add(n.person.party); n.children.forEach(w); })(root);
  const partyColors = {};
  for (const p of [...usedParties].sort()) partyColors[p] = spec.partyColors?.[p] || hueColor(p);
  const partyInfo = Object.fromEntries(Object.entries(spec.partyInfo || {}).filter(([p]) => usedParties.has(p)));

  // ---------- self-checks ----------
  const errors = [], seen = new Set(), byRole = {}, all = [];
  let offices = 0;
  (function check(n) {
    all.push(n);
    if (seen.has(n.id)) errors.push(`duplicate id ${n.id}`); seen.add(n.id);
    if (!Array.isArray(n.children)) errors.push(`${n.id}: no children array`);
    const isLeg = n.role === "legislator";
    if (n.kind === "office") {
      offices++; byRole[n.role] = (byRole[n.role] || 0) + 1;
      const nm = n.person?.name || "";
      if (!nm) errors.push(`${n.id}: office without a person name`);
      else if (PLACEHOLDER.test(nm) || looksLikeParty(nm) || GLUED.test(nm)) errors.push(`${n.id}: suspicious name "${nm}"`);
      if (/[a-z](Associate|Minister|Secretary|Leader|President|Deputy|Parliamentary)/.test(n.label)) errors.push(`${n.id}: label looks glued: "${n.label}"`);
      if (!n.card?.chosen || !n.card?.term || !n.card?.where) errors.push(`${n.id}: missing card {where, chosen, term}`);
    }
    for (const m of n.members || []) if (!m.name || PLACEHOLDER.test(m.name) || looksLikeParty(m.name) || GLUED.test(m.name)) errors.push(`${n.id}: suspicious member name "${m.name}"`);
    if (!isLeg && n.kind !== "group") for (const k of ["electedBy", "reportsTo", "plain", "plainFacts"]) if (!n[k] || (Array.isArray(n[k]) && !n[k].length)) errors.push(`${n.id}: missing ${k}`);
    if (n.kind === "group" && !n.plain && !(n.id === root.id)) errors.push(`${n.id}: group without plain`);
    if (n.kind === "house" && n.children.some((c) => c.kind === "office" || c.kind === "group") && !n.memberPlain && !spec.skipMemberPlainCheck?.includes(n.id) && n.id !== "cabinet" && n.id !== "judiciary") errors.push(`${n.id}: house with people but no memberPlain`);
    if ((n.id === "cabinet" || n.id === "judiciary" || n.id === "regions") && !n.memberPlain) errors.push(`${n.id}: missing memberPlain`);
    n.children.forEach(check);
  })(root);
  if (!data.headOfState) errors.push("no head of state scraped");
  // Generic check 1: parsed member count must equal the official count whenever the source provides one.
  for (const [key, d] of Object.entries(data.chambers || {})) {
    if (d.official?.count != null && d.members && d.members.length + (d.official.excludedLeaders || 0) !== d.official.count) errors.push(`chamber-${key}: ${d.members.length} members parsed but the official count (${d.official.source}) is ${d.official.count}`);
  }
  // Generic check 2: no person on two legislator cards (same official id, same Wikipedia page, or same name in the same seat).
  { const seenLeg = new Map();
    all.filter((n) => n.role === "legislator").forEach((n) => { const k = n.person.ref || n.person.wiki || `${n.person.name}|${n.place}`; if (seenLeg.has(k)) errors.push(`${n.id} and ${seenLeg.get(k)} are the same person (${n.person.name})`); else seenLeg.set(k, n.id); }); }
  // Generic checks 5 and 6 (text hygiene) on every string a visitor reads, except people's names and external descriptions:
  //   5. no string ends in a comma/semicolon/colon, and no glued words (a run of 3+ lowercase letters, then a capital, then 2+ lowercase: "SolidaritésMinistre")
  //   6. no relative dates ("9 years ago") and no scraper leftovers ("(date as given in ...)")
  { const GLUED = /[a-zà-ÿ]{3,}[A-ZÀ-Þ][a-zà-ÿ]{2,}/, TRAIL = /[,;:]\s*$/, REL = /\b\d+\s+(years?|months?|weeks?|days?)\s+ago\b|\(date as given|as given in the party|\[\s*\d+\s*\]/i;
    const bad = (where, v) => { if (typeof v !== "string") return; const hit = TRAIL.test(v) ? "ends in punctuation" : GLUED.test(v) ? "glued words" : REL.test(v) ? "relative date or scraper leftover" : ""; if (hit) errors.push(`${where}: ${hit}: "${v.slice(0, 90)}"`); };
    const pairs = (where, arr) => (arr || []).forEach((x) => (Array.isArray(x) ? x : [x?.label, x?.value]).forEach((v) => bad(where, v)));
    for (const n of all) {
      for (const k of ["label", "place", "sub", "badge", "summary", "plain", "electedBy", "reportsTo"]) bad(`${n.id}.${k}`, n[k]);
      pairs(`${n.id}.plainFacts`, n.plainFacts); pairs(`${n.id}.terms`, n.terms); pairs(`${n.id}.stats`, n.stats); pairs(`${n.id}.memberPlain.facts`, n.memberPlain?.facts); pairs(`${n.id}.memberPlain.terms`, n.memberPlain?.terms);
      bad(`${n.id}.memberPlain.plain`, n.memberPlain?.plain); for (const v of Object.values(n.card || {})) (Array.isArray(v) ? v : [v]).forEach((x) => bad(`${n.id}.card`, x));
      if (n.person) { bad(`${n.id}.person.party`, n.person.party); bad(`${n.id}.person.note`, n.person.note); bad(`${n.id}.person.since`, n.person.since); }
      for (const m of n.members || []) { bad(`${n.id} member ${m.name} party`, m.party); bad(`${n.id} member ${m.name} role`, m.role); bad(`${n.id} member ${m.name} note`, m.note); }
    }
    for (const [party, info] of Object.entries(partyInfo)) { bad(`partyInfo ${party}`, info[0]); bad(`partyInfo ${party}`, info[1]); }
    for (const party of Object.keys(partyColors)) bad(`partyColors key`, party);
  }
  // Generic check 7: neutral tone. Scraped bios and blurbs must not carry loaded political labels; replace them with a short hand-written bio (`bio` on the person) instead.
  { const LOADED = /\b(far[- ]?right|far[- ]?left|ultra[- ]?nationalist|ultranationalist|revisionis[mt]|extremis[mt]|populis[mt]|fascis[mt]|neo-?nazi|radical right|hard[- ]?line|demagogue)\b/i;
    for (const n of all) {
      if (n.person) for (const k of ["bio", "blurb", "note"]) if (LOADED.test(n.person[k] || "")) errors.push(`${n.id}.person.${k}: loaded wording "${(n.person[k].match(LOADED) || [])[0]}" (write a neutral hand-written bio instead)`);
      for (const m of n.members || []) if (LOADED.test(m.blurb || "") || LOADED.test(m.note || "")) errors.push(`${n.id} member ${m.name}: loaded wording in blurb/note`);
    }
    for (const [party, info] of Object.entries(partyInfo)) if (LOADED.test(info[1] || "")) errors.push(`partyInfo ${party}: loaded wording "${(info[1].match(LOADED) || [])[0]}"`);
  }
  // Generic check 8: no list member may be matched "by elimination" (the one left over on each side); a person is matched by name, id or an official record, never by guessing.
  for (const m of members) if (m.matchedBy === "elimination") errors.push(`${m.name}: matched only by elimination`);
  // Generic check 4: the head of state or government must not also appear as a minister card.
  { const heads = new Set([data.headOfState, data.headOfGov].filter(Boolean).map((h) => nameKeyOf(h.name)));
    for (const m of data.ministers || []) if (heads.has(nameKeyOf(m.name))) errors.push(`${m.name} is both a head of state/government and a minister card`); }
  // Generic check 3: where the constitution bars ministers from sitting (spec.ministersCannotSit), no minister may also be a sitting legislator.
  if (spec.ministersCannotSit) {
    const sitting = new Set(all.filter((n) => n.role === "legislator").map((n) => nameKeyOf(n.person.name)));
    for (const m of data.ministers || []) if (sitting.has(nameKeyOf(m.name))) errors.push(`minister ${m.name} is also listed as a sitting legislator; the constitution requires a substitute to sit instead`);
  }
  const nodeCount = seen.size;
  console.log(`nodes ${nodeCount}, offices ${offices}, by role ${JSON.stringify(byRole)}`);
  console.log("coverage:", coverage.legislature, "|", coverage.note);
  if (errors.length) { console.log(`SELF-CHECK: ${errors.length} problem(s)`); errors.slice(0, 40).forEach((e) => console.log("  ✗ " + e)); if (!FORCE) { console.log(`NOT written (use --force to override)`); return { id, ok: false, errors: errors.length }; } }
  else console.log("SELF-CHECK: ok");

  // ---------- write ----------
  const out = {
    generatedAt: new Date().toISOString(), source: "Wikipedia (CC BY-SA 4.0)", partyColors, ...(Object.keys(partyInfo).length ? { partyInfo } : {}),
    meta: { id: spec.id, name: spec.name, flag: spec.flag, locale: spec.locale, system: spec.system, description: spec.description, nonpartisan: spec.nonpartisan || [], sources: spec.sources || [], coverage, officialSources: Object.fromEntries(Object.entries(data.chambers || {}).filter(([, d]) => d.official).map(([k, d]) => [k, d.official.source])) },
    root,
  };
  fs.mkdirSync("public/data", { recursive: true });
  const file = `public/data/${spec.id}.json`;
  fs.writeFileSync(file, JSON.stringify(out, (k, v) => (v === "" || v === null ? undefined : v)));
  const mfile = "public/data/countries.json";
  let manifest = []; try { manifest = JSON.parse(fs.readFileSync(mfile, "utf8")); } catch {}
  manifest = manifest.filter((c) => c.id !== spec.id).concat({ id: spec.id, name: spec.name, flag: spec.flag, continent: spec.continent, dataUrl: `data/${spec.id}.json`, coverage: coverage.legislature }).sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(mfile, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`wrote ${file} (${(fs.statSync(file).size / 1024).toFixed(0)} KB) in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  return { id, ok: true, nodes: nodeCount, offices, coverage: coverage.legislature };
}

const results = [];
for (const id of ids) results.push(await build(id).catch((e) => { console.error(`\n${id} FAILED:`, e.stack || e.message); return { id, ok: false, error: e.message }; }));
console.log("\nSUMMARY", JSON.stringify(results));
process.exit(results.every((r) => r.ok) ? 0 : 1);
