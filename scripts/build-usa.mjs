// Builds public/data/usa.json: the US political org chart, from Wikipedia. Same node shape as india.json.
import fs from "node:fs";
import { pageHtml, grid, clean, links, summaries, thumbs, descriptions } from "./wiki.mjs";
import { chamberMembers } from "./us-depth.mjs";
import { STATES, REGIONS, REGION_BLURB, TERRITORIES, ELECTED_BY, PARTY_COLORS, normParty, SENATE_PAGES, LOWER_PAGES } from "./us-facts.mjs";

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const T = ($, el) => clean($, el).replace(/\[.*?\]/g, "").trim();
const dateOf = (s) => s.match(/[A-Z][a-z]+ \d{1,2}, \d{4}/)?.[0] || s.match(/\b(1[789]|20)\d{2}\b/)?.[0] || "";
const wikiUrl = (t) => "https://en.wikipedia.org/wiki/" + encodeURIComponent(t.replace(/ /g, "_"));
const nameOnly = (s) => s.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
const stripList = (s) => s.replace(/\s*\(list\)\s*/i, "").trim();
const firstIdx = (h, re) => h.findIndex((x) => re.test(x));
const lastIdx = (h, re) => { for (let i = h.length - 1; i >= 0; i--) if (re.test(h[i])) return i; return -1; };
const PLACE = (n) => n.replace(/\bU\.S\./g, "US");

// ---------- 1. Scrape ----------
/** Party from a person's own infobox. Takes the segment marked "present" when several parties are listed. */
async function partyOfPage(title) {
  if (!title) return "";
  try {
    const $ = await pageHtml(title);
    let txt = "";
    $("table.infobox tr").each((_, tr) => {
      if (txt) return;
      const th = clean($, $(tr).children("th")[0]);
      if (/^(Political party|Party)$/.test(th)) txt = clean($, $(tr).children("td")[0]);
    });
    if (!txt) return "";
    const segs = txt.split(/(?<=\))\s*(?=[A-Z])/);
    return normParty(segs.find((s) => /present/i.test(s)) || segs[0]);
  } catch { return ""; }
}

/** The current holder of an office from the office article's infobox. */
async function incumbent(page) {
  const $ = await pageHtml(page);
  let inc;
  $("table.infobox td").each((_, td) => { if (!inc && /^Incumbent/.test(clean($, td))) inc = td; });
  const L = inc && links($, inc)[0];
  const text = inc ? clean($, inc) : "";
  return { title: L?.title, name: L?.text, since: dateOf(text.match(/since\s+(.+?)(?:\(|$)/)?.[1] || "") };
}

const pres = await incumbent("President of the United States");
pres.party = await partyOfPage(pres.title);
console.log("president", pres.name, pres.party, pres.since);

// Cabinet: two tables (executive departments, then cabinet-level officials).
const cab = await pageHtml("Cabinet of the United States");
const cabTables = cab("table.wikitable").toArray();
const cabinetRows = [];
let vp = null;
[1, 2].forEach((ti) => {
  for (const r of grid(cab, cabTables[ti]).slice(1)) {
    const officeCell = r[1], office = T(cab, officeCell).replace(/\(.*$/, "").trim() || links(cab, officeCell)[0]?.text;
    const nameCell = r[3] || r[2], L = links(cab, nameCell)[0], startText = T(cab, r[4]);
    const stillActing = /Acting:[^–]*$/.test(startText);
    const row = { office, title: L?.title, name: nameOnly(T(cab, nameCell)), since: dateOf(startText), note: stillActing ? "Acting" : "" };
    if (/^Vice President/.test(office)) { vp = row; continue; }
    if (!row.name) continue;
    cabinetRows.push(row);
  }
});
console.log("cabinet", cabinetRows.length, "vp", vp?.name);
vp.party = await partyOfPage(vp.title);
for (const c of cabinetRows) c.party = await partyOfPage(c.title);

// Congress
const housePage = await pageHtml("List of current members of the United States House of Representatives");
const hTables = housePage("table.wikitable").toArray();
const houseTable = hTables.find((t) => grid(housePage, t)[0]?.some((c) => /^District$/i.test(T(housePage, c))) && grid(housePage, t).length > 400);
const delegateTable = hTables.find((t) => { const g = grid(housePage, t); return g.length >= 5 && g.length <= 9 && /district/i.test(T(housePage, g[0][0])) && /at-large/i.test(T(housePage, g[1][0])); });
const reps = [];
const readRep = (g, delegate) => {
  const h = g[0].map((c) => T(housePage, c).toLowerCase());
  const dI = firstIdx(h, /^district/), nI = firstIdx(h, /^member/), pI = lastIdx(h, /^party/), sI = firstIdx(h, /assumed/);
  for (const r of g.slice(1)) {
    const d = T(housePage, r[dI]), name = nameOnly(T(housePage, r[nI]));
    if (!name || /vacant/i.test(name) || /vacant/i.test(T(housePage, r[pI]))) continue;
    const m = d.match(/^(.*?)\s+(\d+|at-large)$/i); if (!m) continue;
    const state = m[1].trim(), n = m[2].toLowerCase();
    reps.push({ title: links(housePage, r[nI])[0]?.title, name, state, district: delegate ? "Delegate" : n === "at-large" ? "At-large" : `District ${n}`, party: normParty(T(housePage, r[pI])), since: dateOf(T(housePage, r[sI])), delegate });
  }
};
readRep(grid(housePage, houseTable), false);
if (delegateTable) readRep(grid(housePage, delegateTable), true);
console.log("representatives", reps.filter((r) => !r.delegate).length, "delegates", reps.filter((r) => r.delegate).length);

const leaderRow = (page, tbl, ri, nameCol, partyCol, dateCol) => {
  const r = grid(page, tbl)[ri];
  return { title: links(page, r[nameCol])[0]?.title, name: nameOnly(T(page, r[nameCol])), party: partyCol != null ? normParty(T(page, r[partyCol])) : "", since: dateOf(T(page, r[dateCol])) };
};
const speaker = leaderRow(housePage, hTables[0], 1, 1, 3, 4);
const hMaj = leaderRow(housePage, hTables[1], 1, 1, null, 3);
const hMin = leaderRow(housePage, hTables[2], 1, 1, null, 3);
const partyByName = (list, who) => list.find((m) => m.name === who.name)?.party || "";
hMaj.party = partyByName(reps, hMaj) || (await partyOfPage(hMaj.title));
hMin.party = partyByName(reps, hMin) || (await partyOfPage(hMin.title));
console.log("house leaders", speaker.name, hMaj.name, hMin.name);

const senPage = await pageHtml("List of current United States senators");
const sTables = senPage("table.wikitable").toArray();
const senTable = sTables.find((t) => grid(senPage, t).length > 90);
const senators = [];
{
  const g = grid(senPage, senTable), h = g[0].map((c) => T(senPage, c).toLowerCase());
  const stI = 0, nI = firstIdx(h, /^senator/), pI = lastIdx(h, /^party/), aI = firstIdx(h, /assumed/), cI = firstIdx(h, /^class/);
  for (const r of g.slice(1)) {
    const name = nameOnly(T(senPage, r[nI])); if (!name || /vacant/i.test(name)) continue;
    const cls = T(senPage, r[cI]).match(/Class\s*(\d)/)?.[1];
    senators.push({ title: links(senPage, r[nI])[0]?.title, name, state: T(senPage, r[stI]), party: normParty(T(senPage, r[pI])), since: dateOf(T(senPage, r[aI])), cls: cls ? ["I", "II", "III"][+cls - 1] : "" });
  }
}
console.log("senators", senators.length);
const proTem = leaderRow(senPage, sTables[1], 2, 2, 1, 4);
const sMaj = leaderRow(senPage, sTables[2], 1, 1, null, 3);
const sMin = leaderRow(senPage, sTables[3], 1, 1, null, 3);
sMaj.party = partyByName(senators, sMaj); sMin.party = partyByName(senators, sMin);
console.log("senate leaders", proTem.name, sMaj.name, sMin.name);

// Supreme Court
const scPage = await pageHtml("Supreme Court of the United States");
const justices = [];
{
  const g = grid(scPage, scPage("table.wikitable").toArray()[0]);
  for (const r of g.slice(2)) {
    const cell = r[1], txt = T(scPage, cell);
    if (!txt) continue;
    const chief = /Chief Justice/.test(txt.slice(0, 20));
    const L = links(scPage, cell).find((l) => !/^(Chief Justice|Associate Justice)/.test(l.title));
    const name = nameOnly(txt.replace(/^\(Chief Justice\)\s*/, "")).replace(/\s*\d{4}-\d{2}-\d{2}.*$/, "").replace(/\s*\(.*$/, "").trim();
    justices.push({ title: L?.title, name: L?.text || name, chief, since: dateOf(T(scPage, r[6])), appointedBy: T(scPage, r[2]).replace(/\s*\(([RD])\)/, " ($1)") });
  }
}
console.log("justices", justices.length, justices.map((j) => j.name).join(", "));

// Governors, lieutenant governors, territories, D.C.
const govPage = await pageHtml("List of current United States governors");
const gTables = govPage("table.wikitable").toArray();
const readGov = (g, nameCol = 2) => g.slice(1).map((r) => ({
  place: stripList(T(govPage, r[0])), title: links(govPage, r[nameCol])[0]?.title, name: nameOnly(T(govPage, r[nameCol])),
  party: normParty(T(govPage, r[4])), since: dateOf(T(govPage, r[7])), termEnd: T(govPage, r[8]).replace(/\s*\(.*?\)/, (m) => m),
}));
const governors = readGov(grid(govPage, gTables[0]));
const terrGovs = readGov(grid(govPage, gTables[1]));
const dcMayor = readGov(grid(govPage, gTables[2]))[0];
console.log("governors", governors.length, "territory governors", terrGovs.length, "mayor", dcMayor?.name);

const ltPage = await pageHtml("List of current United States lieutenant governors");
const ltTables = ltPage("table.wikitable").toArray();
const ltGovs = grid(ltPage, ltTables[0]).slice(1).map((r) => ({
  place: stripList(T(ltPage, r[0])), title: links(ltPage, r[2])[0]?.title, name: nameOnly(T(ltPage, r[2])),
  party: normParty(T(ltPage, r[3])), since: dateOf(T(ltPage, r[5])), termEnd: T(ltPage, r[6]), selection: T(ltPage, r[7]),
}));
console.log("lieutenant governors", ltGovs.length);

// State legislatures
const legs = {}; // state -> {senate, lower}
let seatsTotal = 0, seatsParsed = 0;
const failed = [];
for (const [state, f] of Object.entries(STATES)) {
  const upperPages = SENATE_PAGES[state] || [`${state} Senate`, `${state} State Senate`];
  const lowerPages = LOWER_PAGES[state] || [`${state} House of Representatives`];
  const l = (legs[state] = {});
  l.senate = await chamberMembers(upperPages, f.senate, { withNo: state === "Massachusetts" }).catch((e) => { console.log("  fail", state, "upper", e.message); return null; });
  seatsTotal += f.senate; if (l.senate) seatsParsed += l.senate.length; else failed.push(`${state} ${f.unicameral ? "Legislature" : "Senate"}`);
  if (!f.unicameral) {
    l.lower = await chamberMembers(lowerPages, f.lower, { withNo: state === "Massachusetts" }).catch((e) => { console.log("  fail", state, "lower", e.message); return null; });
    seatsTotal += f.lower; if (l.lower) seatsParsed += l.lower.length; else failed.push(`${state} ${f.lowerName || "House of Representatives"}`);
  }
  console.log("legislature", state.padEnd(15), "senate", l.senate?.length ?? "-", "/", f.senate, f.unicameral ? "" : `lower ${l.lower?.length ?? "-"} / ${f.lower}`);
}
console.log(`state legislators parsed: ${seatsParsed} of ${seatsTotal}; failed chambers (${failed.length}):`, failed.join("; "));

// ---------- 2. Images + bios ----------
const headline = [
  pres, vp, ...cabinetRows, speaker, hMaj, hMin, proTem, sMaj, sMin, ...justices, ...governors, ...terrGovs, dcMayor, ...ltGovs,
].map((o) => o?.title).filter(Boolean);
const sums = await summaries(headline);
console.log("summaries", Object.keys(sums).length, "/", new Set(headline).size);

const legTitles = Object.values(legs).flatMap((l) => [...(l.senate || []), ...(l.lower || [])]).map((m) => m.title);
const allTitles = [...reps, ...senators].map((m) => m.title).concat(legTitles).filter(Boolean);
const thumbOf = await thumbs([...allTitles, ...headline], 120);
const descOf = await descriptions(allTitles);

const person = (o, extra = {}) => {
  const s = (o.title && sums[o.title]) || {};
  return {
    name: s.title?.replace(/\s*\(.*\)$/, "") || o.name,
    image: s.image || thumbOf[o.title] || null, blurb: s.description || "", bio: s.extract || "", wiki: s.url || (o.title ? wikiUrl(o.title) : null),
    party: o.party || "", since: o.since || "", ...extra,
  };
};
// A lightweight person for the long lists (thumbnail + one-line description only).
const member = (m, extra = {}) => ({
  name: m.name, image: thumbOf[m.title] || null, blurb: descOf[m.title] || "", bio: "", wiki: m.title ? wikiUrl(m.title) : null,
  party: m.party || "", since: m.since || "", ...extra,
});

// ---------- 3. Build tree ----------
const mk = (id, kind, label, props = {}) => ({ id, kind, label, children: [], ...props });
const FACT = (label, value) => ({ label, value });
const usedIds = new Set();
const uid = (base) => { let id = base, i = 2; while (usedIds.has(id)) id = `${base}-${i++}`; usedIds.add(id); return id; };
const house = (id, label, props) => mk(id, "house", label, props);
const code = (state) => STATES[state]?.code || TERRITORIES[state]?.code || "";

// ---- Federal
const presidentNode = mk("president", "office", "President of the United States", {
  badge: "POTUS", role: "president", place: "The White House",
  person: person(pres), electedBy: ELECTED_BY.president, reportsTo: "The voters, through the Electoral College; head of state and head of government",
  stats: [FACT("Term", "4 years (max two terms)"), FACT("Residence", "The White House, Washington, D.C."), FACT("Elected by", "Electoral College (538 electors)")],
});
const vpNode = mk("vp", "office", "Vice President", {
  badge: "VP", role: "vp", place: "President of the Senate", person: person(vp),
  electedBy: ELECTED_BY.vp, reportsTo: "Elected on the same ticket as the President",
  stats: [FACT("Term", "4 years"), FACT("Presides over", "The Senate"), FACT("Elected by", "Electoral College")],
});

const deptOf = (office) => {
  const special = {
    "Attorney General": "Department of Justice", "Director of National Intelligence": "Office of the Director of National Intelligence",
    "Trade Representative": "Office of the US Trade Representative", "White House Chief of Staff": "Executive Office of the President",
  };
  if (special[office]) return special[office];
  let m;
  if ((m = office.match(/^Secretary of (.+)$/))) return `Department of ${m[1]}`;
  if ((m = office.match(/^(?:Administrator|Director) of the (.+)$/))) return m[1];
  if ((m = office.match(/^Administrator of (.+)$/))) return m[1];
  return office;
};
const cabinetPeople = cabinetRows.map((c) => ({ ...c, role: c.office, dept: deptOf(c.office) }));
const cabinetMembers = cabinetPeople.map((c) => person(c, { role: `${c.office} · ${PLACE(c.dept)}`, note: c.note || undefined, mirror: true }));
const cabinetNode = house("cabinet", "Cabinet", {
  badge: "CAB", place: "Executive departments", electedBy: ELECTED_BY.cabinet, reportsTo: "President of the United States",
  members: cabinetMembers, membersLabel: "Members",
  children: cabinetPeople.map((c, i) => mk(uid(`sec-${slug(c.office)}`), "office", c.office, {
    badge: "SEC", role: "secretary", place: PLACE(c.dept), person: { ...cabinetMembers[i], mirror: undefined },
    electedBy: ELECTED_BY.secretary, reportsTo: "President of the United States",
  })),
  stats: [FACT("Departments", cabinetPeople.filter((c) => /^(Secretary|Attorney General)/.test(c.office)).length), FACT("Cabinet-level", cabinetPeople.filter((c) => !/^(Secretary|Attorney General)/.test(c.office)).length), FACT("Led by", pres.name)],
  summary: "The heads of the 15 executive departments, plus other officials the President gives Cabinet rank. They advise the President and run the federal agencies. Each is nominated by the President and confirmed by the Senate.",
});
presidentNode.children = [vpNode, cabinetNode];

// ---- Congress
const labelRole = (m, text) => ({ ...member(m), role: text });
const holder = (role, who, extra) => person(who, { role, ...extra });
const repMember = (m) => member(m, { constituency: m.district, role: `${m.state} · ${m.district}`, mirror: true });
const repCard = (m) => mk(uid(`rep-${slug(m.state)}-${slug(m.district)}-${slug(m.name)}`.slice(0, 90)), "office", m.delegate ? (m.state === "Puerto Rico" ? "Resident Commissioner" : "Delegate") : "Representative", {
  badge: "REP", role: "rep", place: m.district, person: { ...member(m, { constituency: m.district }), role: undefined },
  electedBy: ELECTED_BY.rep, reportsTo: "House of Representatives",
});
const repsByState = {};
reps.forEach((m) => (repsByState[m.state] ||= []).push(m));
const hrGroups = Object.keys(repsByState).sort().map((st) => mk(uid(`hr-${slug(st)}`), "group", st, {
  badge: `${repsByState[st].length}`, place: `House of Representatives · ${repsByState[st].length} member${repsByState[st].length === 1 ? "" : "s"}`, accent: "District",
  summary: `${repsByState[st].length} member${repsByState[st].length === 1 ? "" : "s"} of the House of Representatives from ${st}.`,
  stats: [FACT("Members", repsByState[st].length)],
  children: repsByState[st].map(repCard),
}));
const votingReps = reps.filter((r) => !r.delegate).length;
const houseNode = house("house-reps", "House of Representatives", {
  badge: "HR", place: `${votingReps >= 435 ? 435 : 435} voting members + ${reps.filter((r) => r.delegate).length} delegates`,
  sub: `House of Representatives · Speaker ${speaker.name}`, reportsTo: "Congress", electedBy: ELECTED_BY.house,
  person: person(speaker, { role: "Speaker" }), personRole: "Speaker",
  members: [holder("Speaker", speaker), holder("Majority Leader", hMaj), holder("Minority Leader", hMin), ...reps.filter((m) => ![speaker.name, hMaj.name, hMin.name].includes(m.name)).map(repMember)], membersLabel: "Members",
  stats: [FACT("Seats", 435), FACT("Majority mark", 218), FACT("Speaker", speaker.name)],
  summary: "The lower house of Congress. Every member is elected from a single-member district every two years, and the number of seats each state gets depends on its population. All spending bills must start here, and it holds the power to impeach federal officials.",
  children: hrGroups,
});

const senatorsByState = {};
senators.forEach((m) => (senatorsByState[m.state] ||= []).push(m));
const senGroups = Object.keys(senatorsByState).sort().map((st) => mk(uid(`sen-${slug(st)}`), "group", st, {
  badge: `${senatorsByState[st].length}`, place: `Senate · ${senatorsByState[st].length} senators`, accent: "District",
  summary: `The ${senatorsByState[st].length} US senators from ${st}. Every state has two, regardless of population.`,
  stats: [FACT("Senators", senatorsByState[st].length)],
  children: senatorsByState[st].map((m) => mk(uid(`senator-${slug(st)}-${slug(m.name)}`), "office", "Senator", {
    badge: "SEN", role: "senator", place: st, person: { ...member(m, { constituency: st }), role: undefined },
    electedBy: ELECTED_BY.senator, reportsTo: "Senate",
  })),
}));
const senateNode = house("senate", "Senate", {
  badge: "SEN", place: "100 senators, two per state", sub: `Senate · President pro tempore ${proTem.name}`, reportsTo: "Vice President (President of the Senate)",
  electedBy: ELECTED_BY.senate, person: person(proTem, { role: "President pro tempore" }), personRole: "President pro tempore",
  members: [holder("President pro tempore", proTem), holder("Majority Leader", sMaj), holder("Minority Leader", sMin),
    ...senators.filter((m) => ![proTem.name, sMaj.name, sMin.name].includes(m.name)).map((m) => member(m, { constituency: m.state, role: `${m.state}${m.cls ? " · Class " + m.cls : ""}`, mirror: true }))], membersLabel: "Members",
  stats: [FACT("Seats", 100), FACT("Majority mark", 51), FACT("President pro tempore", proTem.name)],
  summary: "The upper house of Congress. Each state sends two senators for six-year terms. It confirms the President's nominees (Cabinet, judges, ambassadors), ratifies treaties by a two-thirds vote and tries officials impeached by the House.",
  children: senGroups,
});
const congressNode = house("congress", "Congress", {
  badge: "CONG", place: "Legislative branch", reportsTo: "The voters of the 50 states", electedBy: "Made up of the House of Representatives and the Senate (Article I of the Constitution). Members of both chambers are elected directly by voters.",
  stats: [FACT("Chambers", 2), FACT("Members", 535), FACT("Non-voting delegates", reps.filter((r) => r.delegate).length)],
  summary: "The legislative branch. Congress writes federal law, controls federal taxes and spending, declares war and checks the President. A bill must pass both chambers and be signed by the President (or survive a veto by two-thirds of each) to become law.",
  children: [houseNode, senateNode],
});

// ---- Supreme Court
const chiefJ = justices.find((j) => j.chief) || justices[0];
const justicePeople = justices.map((j) => person(j, { role: j.chief ? "Chief Justice" : "Associate Justice", appointedBy: j.appointedBy, party: "" }));
const courtNode = house("supreme-court", "Supreme Court", {
  badge: "SCOTUS", place: "Judicial branch", sub: `Supreme Court · Chief Justice ${chiefJ.name}`, reportsTo: "The Constitution; independent of the President and Congress",
  electedBy: ELECTED_BY.court, person: person(chiefJ, { role: "Chief Justice", appointedBy: chiefJ.appointedBy, party: "" }), personRole: "Chief Justice",
  members: justicePeople.map((p) => ({ ...p, mirror: true })), membersLabel: "Justices",
  stats: [FACT("Justices", justices.length), FACT("Tenure", "Life, during good behavior"), FACT("Seat", "Washington, D.C.")],
  summary: "The highest federal court and the final interpreter of the Constitution. It chooses which cases to hear, and its rulings bind every other court. Nine justices decide cases by majority vote.",
  children: justices.map((j, i) => mk(uid(`justice-${slug(j.name)}`), "office", j.chief ? "Chief Justice of the United States" : "Associate Justice", {
    badge: "SCOTUS", role: "justice", place: "Supreme Court of the United States", person: justicePeople[i],
    electedBy: j.chief ? ELECTED_BY.chief : ELECTED_BY.justice, reportsTo: "Supreme Court of the United States",
  })),
});

// ---- States
const govByState = Object.fromEntries(governors.map((g) => [g.place, g]));
const ltByState = Object.fromEntries(ltGovs.map((g) => [g.place, g]));
const legislator = (state, chamberKind, m, chamberLabel) => {
  const f = STATES[state], sen = chamberKind === "senate";
  return mk(uid(`${sen ? "statesen" : "staterep"}-${slug(state)}-${slug(m.district)}-${slug(m.name)}`.slice(0, 90)), "office",
    sen ? "State Senator" : f.lowerMember || "State Representative", {
      badge: sen ? "SEN" : "REP", role: sen ? "statesen" : "staterep", place: m.district ? `District ${m.district}` : state,
      person: { ...member(m, { constituency: m.district }), role: undefined },
      electedBy: sen ? ELECTED_BY.statesen : ELECTED_BY.staterep, reportsTo: `${state} ${chamberLabel}`,
    });
};
function chamberNode(state, kind, list) {
  const f = STATES[state], sen = kind === "senate";
  const label = sen ? (f.unicameral ? "Legislature" : "Senate") : f.lowerName || "House of Representatives";
  const seats = sen ? f.senate : f.lower;
  const node = house(`state-${sen ? "senate" : "house"}-${slug(state)}`, label, {
    badge: f.code, place: `${state} ${label}`, reportsTo: f.unicameral ? `Voters of ${state}` : `Governor of ${state} (laws need the governor's signature)`,
    electedBy: f.unicameral ? "49 senators, each directly elected by the voters of one district. Nebraska's legislature is the only unicameral and officially nonpartisan state legislature in the US: candidates run without party labels." : `${seats} members, each directly elected by the voters of one district, for terms of two or four years depending on the state.`,
    stats: [FACT("Seats", seats), FACT("Majority mark", Math.floor(seats / 2) + 1), FACT("Chamber", f.unicameral ? "Unicameral" : sen ? "Upper house" : "Lower house")],
    summary: list ? `${state}'s ${f.unicameral ? "single-chamber legislature" : sen ? "upper house" : "lower house"}, meeting in ${f.capital}.` : `${state}'s ${f.unicameral ? "single-chamber legislature" : sen ? "upper house" : "lower house"}, meeting in ${f.capital}. A full member list could not be read reliably from Wikipedia, so it is not shown here.`,
  });
  if (list) {
    node.membersLabel = "Members";
    node.members = list.map((m) => member(m, { constituency: m.district, role: m.district ? `District ${m.district}` : "", mirror: true }));
    node.children = list.map((m) => legislator(state, kind, m, label));
  }
  return node;
}
function stateNode(state) {
  const f = STATES[state], gov = govByState[state], lt = ltByState[state], l = legs[state];
  const total = f.senate + f.lower;
  const node = mk(`state-${slug(state)}`, "group", state, {
    badge: f.code, place: f.capital, accent: f.region,
    summary: `${state} has a governor elected statewide${f.noLt ? "" : " and a lieutenant governor"}, and a ${f.unicameral ? "single-chamber" : "two-chamber"} legislature in ${f.capital}.`,
    stats: [FACT("Capital", f.capital), FACT("House seats", f.house), FACT("Electoral votes", f.ev), FACT("Legislature", f.unicameral ? `Unicameral, ${total} members` : `Bicameral, ${total} members`)],
  });
  const govNode = mk(`gov-${slug(state)}`, "office", "Governor", {
    badge: f.code, role: "governor", place: state, person: person(gov), electedBy: ELECTED_BY.governor, reportsTo: `The voters of ${state}`,
    stats: [FACT("Capital", f.capital), FACT("Term", f.govTerm ? `${f.govTerm} (term limits vary)` : "4 years (term limits vary)"), FACT("Term ends", gov.termEnd || "—")],
  });
  node.children.push(govNode);
  if (lt) {
    const sep = /separate/i.test(lt.selection), tick = /ticket/i.test(lt.selection);
    node.children.push(mk(`ltgov-${slug(state)}`, "office", "Lieutenant Governor", {
      badge: f.code, role: "ltgov", place: state, person: person(lt),
      electedBy: sep ? ELECTED_BY.ltgovSeparate : tick ? ELECTED_BY.ltgovTicket : ELECTED_BY.ltgovAppointed + (lt.selection ? ` (${lt.selection}.)` : ""), reportsTo: `The voters of ${state}`,
      stats: [FACT("Selection", lt.selection || "—"), FACT("Term ends", lt.termEnd || "—")],
    }));
  }
  node.children.push(chamberNode(state, "senate", l.senate));
  if (!f.unicameral) node.children.push(chamberNode(state, "lower", l.lower));
  return node;
}
const regionNodes = REGIONS.map((r) => {
  const names = Object.keys(STATES).filter((s) => STATES[s].region === r);
  return mk(`region-${slug(r)}`, "group", r, {
    badge: `${names.length}`, place: `${names.length} states`, accent: r, summary: REGION_BLURB[r],
    stats: [FACT("States", names.length), FACT("House seats", names.reduce((a, s) => a + STATES[s].house, 0)), FACT("Electoral votes", names.reduce((a, s) => a + STATES[s].ev, 0))],
    children: names.map(stateNode),
  });
});
const statesNode = mk("states", "group", "States", {
  badge: "50", place: "Governors and legislatures", summary: "50 states, each with a governor elected by its voters and its own legislature. States run most day-to-day government: schools, police, roads, courts and elections.",
  stats: [FACT("States", 50), FACT("House seats", Object.values(STATES).reduce((a, s) => a + s.house, 0)), FACT("State legislators", Object.values(STATES).reduce((a, s) => a + s.senate + s.lower, 0).toLocaleString("en-US"))],
  children: regionNodes,
});

// ---- Territories + D.C.
const terrChildren = [];
if (dcMayor) terrChildren.push(mk("gov-district-of-columbia", "office", "Mayor", {
  badge: "DC", role: "mayor", place: "District of Columbia", person: person(dcMayor), electedBy: ELECTED_BY.mayor, reportsTo: "The voters of D.C.; Congress can overturn D.C. laws",
  stats: [FACT("Capital", "Washington, D.C."), FACT("Term", "4 years"), FACT("Term ends", dcMayor.termEnd || "—")],
}));
for (const g of terrGovs) {
  const key = Object.keys(TERRITORIES).find((k) => k === g.place || TERRITORIES[k].aliases?.includes(g.place)) || g.place;
  const t = TERRITORIES[key] || {};
  terrChildren.push(mk(`gov-${slug(key)}`, "office", "Governor", {
    badge: t.code || "", role: "governor", place: key, person: person(g), electedBy: ELECTED_BY.governorTerritory, reportsTo: `The voters of ${key}; Congress has final authority over the territories`,
    stats: [FACT("Capital", t.capital || "—"), FACT("Status", t.status || "Territory"), FACT("Term ends", g.termEnd || "—")],
  }));
}
const territoriesNode = mk("territories", "group", "Federal District & Territories", {
  badge: `${terrChildren.length}`, place: "Mayor and governors", summary: "Washington, D.C. and five inhabited territories are governed under federal law. Each elects its own leader and a non-voting delegate to the House, but none has voting seats in Congress or votes for President (D.C. does vote for President).",
  stats: [FACT("Entities", terrChildren.length), FACT("Non-voting delegates", reps.filter((r) => r.delegate).length)],
  children: terrChildren,
});

// ---- Root
const root = mk("usa", "group", "United States", {
  badge: "US", place: "Federal government and 50 states",
  summary: "A federal republic of 50 states. Power is split three ways: the President runs the executive branch, Congress makes the laws, and the courts interpret them. States hold the powers the Constitution doesn't give to the federal government.",
  stats: [FACT("States", 50), FACT("Electoral votes", 538), FACT("Members of Congress", 535)],
  children: [presidentNode, congressNode, courtNode, statesNode, territoriesNode],
});

// party breakdown for every node that holds a list of people
(function tally(n) {
  const src = n.members && n.members.length > 4 ? n.members : n.children.length > 2 && n.children.every((c) => c.kind === "office" && c.person) ? n.children.map((c) => c.person) : null;
  if (src) {
    const c = {};
    src.forEach((m) => { if (m.party) c[m.party] = (c[m.party] || 0) + 1; });
    if (Object.keys(c).length) n.parties = Object.entries(c).sort((a, b) => b[1] - a[1]);
  }
  n.children.forEach(tally);
})(root);

// ---------- 4. Validate + write ----------
const ids = new Set(); let dupes = 0, noName = 0, offices = 0;
const byRole = {};
(function walk(n) {
  if (ids.has(n.id)) dupes++; ids.add(n.id);
  if (!Array.isArray(n.children)) throw new Error("no children array: " + n.id);
  if (n.kind === "office") { offices++; byRole[n.role] = (byRole[n.role] || 0) + 1; if (!n.person?.name) { noName++; console.log("  office without person name:", n.id); } }
  n.children.forEach(walk);
})(root);
console.log("nodes", ids.size, "offices", offices, "dupe ids", dupes, "offices missing name", noName);
console.log("by role", JSON.stringify(byRole));
const missing = [];
(function walk(n) { if (n.person && !n.person.image) missing.push(n.id); n.children.forEach(walk); })(root);
console.log("no image:", missing.length, "of", offices, "offices (Wikipedia has no photo)");

fs.mkdirSync("public/data", { recursive: true });
fs.writeFileSync("public/data/usa.json", JSON.stringify({ generatedAt: new Date().toISOString(), source: "Wikipedia (CC BY-SA 4.0)", partyColors: PARTY_COLORS, root }, (k, v) => (v === "" || v === null ? undefined : v)));
console.log("wrote public/data/usa.json", (fs.statSync("public/data/usa.json").size / 1024).toFixed(0) + " KB");
