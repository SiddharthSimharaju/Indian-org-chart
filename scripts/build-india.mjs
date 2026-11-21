import fs from "node:fs";
import { pageHtml, grid, clean, links, summaries, descriptions } from "./wiki.mjs";
import { ministers, mlasByDistrict, parliament, thumbs, wikiUrl } from "./depth.mjs";
import { STATES, UTS, REGION_BLURB, ELECTED_BY, PARTY_COLORS } from "./static-facts.mjs";

const PARTY_CODES = {
  "bharatiya janata party": "BJP", "indian national congress": "INC", "janata dal (united)": "JD(U)", "aam aadmi party": "AAP", "nationalist congress party": "NCP",
  "independent": "IND", "samajwadi party": "SP", "nationalist congress party (sharadchandra pawar)": "NCP(SP)", "nationalist congress party – sharadchandra pawar": "NCP(SP)", "communist party of india (marxist–leninist) liberation": "CPI(ML)L", "rashtriya loktantrik party": "RLP", "bharat adivasi party": "BAP", "azad samaj party (kanshi ram)": "ASP(KR)", "voice of the people party": "VPP", "indian national congress (i)": "INC", "bahujan samaj party": "BSP", "rashtriya janata dal": "RJD", "all india trinamool congress": "AITC", "trinamool congress": "AITC",
  "dravida munnetra kazhagam": "DMK", "all india anna dravida munnetra kazhagam": "AIADMK", "telugu desam party": "TDP", "yuvajana sramika rythu congress party": "YSRCP",
  "ysr congress party": "YSRCP", "shiv sena": "SHS", "shiv sena (ubt)": "SHS(UBT)", "shiv sena (uddhav balasaheb thackeray)": "SHS(UBT)", "communist party of india (marxist)": "CPI(M)", "communist party of india": "CPI",
  "jharkhand mukti morcha": "JMM", "biju janata dal": "BJD", "bharat rashtra samithi": "BRS", "jammu and kashmir national conference": "JKNC", "jammu & kashmir national conference": "JKNC",
  "national people's party": "NPP", "naga people's front": "NPF", "zoram people's movement": "ZPM", "sikkim krantikari morcha": "SKM", "tipra motha party": "TIPRA", "indian union muslim league": "IUML",
  "janasena party": "JSP", "jana sena party": "JSP", "tamilaga vettri kazhagam": "TVK", "lok janshakti party (ram vilas)": "LJP(RV)", "janata dal (secular)": "JD(S)", "rashtriya lok dal": "RLD",
  "all india majlis-e-ittehadul muslimeen": "AIMIM", "shiromani akali dal": "SAD", "kerala congress (m)": "KC(M)", "national democratic progressive party": "NDPP", "nationalist democratic progressive party": "NDPP",
  "all india united democratic front": "AIUDF", "asom gana parishad": "AGP", "united people's party liberal": "UPPL", "bodoland people's front": "BPF", "indian national lok dal": "INLD", "jannayak janta party": "JJP",
  "hindustani awam morcha": "HAM", "rashtriya lok morcha": "RLM", "apna dal (soneylal)": "AD(S)", "nishad party": "NISHAD", "suheldev bharatiya samaj party": "SBSP", "puducherry all india n.r. congress": "AINRC", "all india n.r. congress": "AINRC",
};
const shortParty = (t) => { const n = (t || "").replace(/\s*\(since.*$/, "").replace(/\s*\(\d{4}.*$/, "").split(/,|;/)[0].trim(); return PARTY_CODES[n.toLowerCase()] || n; };
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const stripTenure = (s) => s.replace(/\s*\(.*$/, "").replace(/\s+\d+\s*years?.*$/, "").replace(/\s+\d+\s*days?.*$/, "").trim();

// ---------- 1. Scrape ----------
async function infobox(page) {
  const $ = await pageHtml(page);
  const rows = {};
  $("table.infobox tr").each((_, tr) => {
    const th = clean($, $(tr).children("th")[0]);
    const td = $(tr).children("td")[0];
    if (th && td) rows[th] = { text: clean($, td), links: links($, td) };
  });
  let inc;
  $("table.infobox td").each((_, td) => { if (!inc && /^Incumbent/.test(clean($, td))) inc = td; });
  const incText = inc ? clean($, inc) : "";
  const since = incText.match(/since\s+(.+?)(?:\(|$)/)?.[1]?.trim() || rows["Assumed office"]?.text || "";
  return {
    title: inc && links($, inc)[0]?.title,
    name: inc && links($, inc)[0]?.text,
    since: stripTenure(since),
    party: rows["Political party"]?.text,
    constituency: rows["Constituency"]?.text,
    rows,
  };
}

const UNION_PAGES = {
  president: "President of India",
  vp: "Vice President of India",
  pm: "Prime Minister of India",
  speaker: "Speaker of the Lok Sabha",
  lop: "Leader of the Opposition (Lok Sabha)",
  cji: "Chief Justice of India",
  cec: "Chief Election Commissioner of India",
  rsDeputy: "Deputy Chairman of the Rajya Sabha",
  rsLop: "Leader of the Opposition (Rajya Sabha)",
  ag: "Attorney General for India",
};
const union = {};
for (const [k, p] of Object.entries(UNION_PAGES)) {
  union[k] = await infobox(p);
  console.log("union", k, "->", union[k].name);
}

// Party + seat for the political Union posts come from the person's own infobox.
for (const k of ["pm", "vp", "speaker", "lop", "rsDeputy", "rsLop"]) {
  const u = union[k];
  const $p = await pageHtml(u.title);
  const rows = {};
  $p("table.infobox tr").each((_, tr) => {
    const th = clean($p, $p(tr).children("th")[0]), td = $p(tr).children("td")[0];
    if (th && td && !rows[th]) rows[th] = clean($p, td);
  });
  u.party = shortParty(rows["Party"] || rows["Political party"] || "")|| u.party;
  const seat = rows["Constituency"] || Object.entries(rows).find(([h]) => /^Member of Parliament/i.test(h))?.[1];
  u.constituency = (seat || "").replace(/\s*\(.*?\)/g, "").trim() || u.constituency;
  console.log("  ", k, u.name, "|", u.party, "|", u.constituency);
}

// Chief ministers + deputies
const cmPage = await pageHtml("Chief minister (India)");
const cmTables = cmPage("table.wikitable").toArray();
const cms = {};
for (const r of grid(cmPage, cmTables[1]).slice(1)) {
  const state = clean(cmPage, r[0]);
  const L = links(cmPage, r[3])[0];
  cms[state] = {
    title: L?.title, name: clean(cmPage, r[3]),
    since: stripTenure(clean(cmPage, r[4])),
    party: clean(cmPage, r[5]), nationalAlliance: clean(cmPage, r[7]), stateAlliance: clean(cmPage, r[8]),
    ministry: links(cmPage, r[9])[0]?.title, constituency: clean(cmPage, r[10]), election: clean(cmPage, r[11]), appointedBy: clean(cmPage, r[12]),
  };
}
const deputies = {};
for (const r of grid(cmPage, cmTables[2]).slice(1)) {
  const state = clean(cmPage, r[0]);
  const L = links(cmPage, r[3])[0];
  (deputies[state] ||= []).push({ title: L?.title, name: clean(cmPage, r[3]), since: stripTenure(clean(cmPage, r[4])), party: clean(cmPage, r[5]) });
}

// Governors, LGs, administrators
const govPage = await pageHtml("Governor (India)");
const govTables = govPage("table.wikitable").toArray();
const governors = {};
for (const r of grid(govPage, govTables[0]).slice(1)) {
  governors[clean(govPage, r[0])] = { kind: "governor", title: links(govPage, r[3])[0]?.title, name: clean(govPage, r[3]), since: stripTenure(clean(govPage, r[4])), appointedBy: clean(govPage, r[5]) };
}
let utKind = "lg";
for (const r of grid(govPage, govTables[1]).slice(1)) {
  const first = clean(govPage, r[0]);
  if (r[0] === r[3]) { utKind = /administrator/i.test(first) ? "admin" : "lg"; continue; }
  let name = clean(govPage, r[3]);
  governors[first] = { kind: utKind, title: links(govPage, r[3])[0]?.title, name: name.replace(/\s*\(.*\)$/, ""), note: /\(/.test(name) ? name.match(/\((.*)\)/)[1] : "", since: stripTenure(clean(govPage, r[4])), appointedBy: clean(govPage, r[5]) };
}

// Union cabinet
const modi = await pageHtml("Third Modi ministry");
const cabinet = new Map();
const RANKS = ["Cabinet Minister", "Minister of State (Independent Charge)", "Minister of State"];
modi("table.wikitable").toArray().slice(0, 3).forEach((tbl, ti) => {
  for (const r of grid(modi, tbl).slice(1)) {
    if (!/incumbent/i.test(clean(modi, r[3]))) continue;
    const L = links(modi, r[1])[0];
    if (!L) continue;
    const entry = cabinet.get(L.title) || { title: L.title, name: clean(modi, r[1]), since: clean(modi, r[2]), party: clean(modi, r[5]) || clean(modi, r[4]), rank: RANKS[ti], portfolios: [] };
    entry.portfolios.push(clean(modi, r[0]).replace(/Minister of/g, "|Minister of").replace(/Prime Minister/g, "|Prime Minister").split("|").map((s) => s.trim()).filter(Boolean).join(" · "));
    cabinet.set(L.title, entry);
  }
});
console.log("cabinet", cabinet.size);

// Council of ministers + MLAs by district for every state / UT that has a Chief Minister
const depth = {};
for (const [state, cm] of Object.entries(cms)) {
  const facts = STATES[state] || UTS[state];
  const d = { ministers: [], districts: null };
  try { if (cm.ministry) d.ministers = await ministers(cm.ministry); } catch (e) { console.log("ministers fail", state, e.message); }
  try { if (facts.la) d.districts = await mlasByDistrict(state, facts.la); } catch (e) { console.log("districts fail", state, e.message); }
  depth[state] = d;
  console.log("depth", state.padEnd(18), "ministers", d.ministers.length, "districts", d.districts ? Object.keys(d.districts).length : "-", "mlas", d.districts ? Object.values(d.districts).flat().length : "-");
}
const depthTitles = Object.values(depth).flatMap((d) => [...d.ministers, ...Object.values(d.districts || {}).flat()]).map((m) => m.title).filter(Boolean);
const dedupe = (arr) => { const m = new Map(); arr.forEach((x) => m.set(x.state + "|" + (x.constituency || x.name), x)); return [...m.values()]; };
const lsAll = dedupe(await parliament("ls")), rsAll = await parliament("rs");
console.log("parliament", lsAll.length, rsAll.length);
const depthThumbs = await thumbs([...depthTitles, ...lsAll.map((m) => m.title), ...rsAll.map((m) => m.title)].filter(Boolean), 120);
const descOf = await descriptions([...depthTitles, ...lsAll.map((m) => m.title), ...rsAll.map((m) => m.title)]);
const parl = (m, kind) => ({ mirror: true, name: m.name.replace(/\s*\(.*\)$/, ""), image: depthThumbs[m.title] || null, blurb: descOf[m.title] || "", bio: "", wiki: m.title ? wikiUrl(m.title) : null, party: shortParty(m.party || ""), since: m.since || "", constituency: kind === "ls" ? m.constituency : "", role: kind === "ls" ? `${m.constituency} · ${m.state}` : `${m.state}${m.field ? " · " + m.field : ""}` });

// ---------- 2. Images + bios ----------
const titles = [
  ...Object.values(union).map((u) => u.title),
  ...Object.values(cms).map((c) => c.title),
  ...Object.values(deputies).flat().map((d) => d.title),
  ...Object.values(governors).map((g) => g.title),
  ...[...cabinet.values()].map((c) => c.title),
].filter(Boolean);
const sums = await summaries(titles);
console.log("summaries", Object.keys(sums).length, "/", new Set(titles).size);

const person = (o, extra = {}) => {
  const s = (o.title && sums[o.title]) || {};
  return {
    name: s.title?.replace(/\s*\(.*\)$/, "") || o.name,
    image: s.image || null, blurb: s.description || "", bio: s.extract || "", wiki: s.url || (o.title ? "https://en.wikipedia.org/wiki/" + encodeURIComponent(o.title.replace(/ /g, "_")) : null),
    party: o.party || "", since: o.since || "", ...extra,
  };
};

// ---------- 3. Build tree ----------
const mk = (id, kind, label, props = {}) => ({ id, kind, label, children: [], ...props });
const FACT = (label, value) => ({ label, value });

const house = (id, label, props) => mk(id, "house", label, props);
const usedIds = new Set();
const uid = (base) => { let id = base, i = 2; while (usedIds.has(id)) id = `${base}-${i++}`; usedIds.add(id); return id; };
// A card for one legislator. role: mla | mp | rsmp
const LABEL = { mla: "MLA", mp: "Member of Lok Sabha", rsmp: "Member of Rajya Sabha" };
const legislator = (role, state, m, parent) => mk(uid(`${role}-${slug(state)}-${slug(m.constituency || m.role || m.name)}-${slug(m.name)}`.slice(0, 90)), "office", LABEL[role], {
  badge: role === "mla" ? "MLA" : "MP", role, place: role === "rsmp" ? state : (m.constituency || m.role || state),
  person: { ...m, mirror: undefined }, electedBy: ELECTED_BY[role], reportsTo: parent,
});
// A card for one minister in a council of ministers
const minister = (idp, m, label, place, parent) => mk(uid(`min-${idp}-${slug(m.name)}`), "office", label, {
  badge: "MIN", role: "minister", place, person: { ...m, mirror: undefined }, electedBy: ELECTED_BY.minister, reportsTo: parent,
});
// state-wise group of legislators under a house
const stateGroups = (idp, house, list, role, parent) => {
  const by = {};
  list.forEach((m) => (by[m.state] ||= []).push(m));
  return Object.keys(by).sort().map((st) => mk(uid(`${idp}-${slug(st)}`), "group", st, {
    badge: `${by[st].length}`, place: `${house} · ${by[st].length} members`, accent: "District",
    summary: `${by[st].length} ${house} members from ${st}.`,
    stats: [FACT("Members", by[st].length)],
    children: by[st].map((m) => legislator(role, st, parl(m, role === "mp" ? "ls" : "rs"), parent)),
  }));
};

// state subtree
function stateNode(name, isUT) {
  const facts = isUT ? UTS[name] : STATES[name];
  const gov = governors[name] || governors[facts.aliases?.[0]];
  const cm = cms[name];
  const display = facts.short || name;
  const govNode = mk(`gov-${slug(name)}`, "office", gov.kind === "governor" ? "Governor" : gov.kind === "lg" ? "Lieutenant Governor" : "Administrator", {
    badge: facts.code, place: display, role: gov.kind, 
    person: person(gov, { note: gov.note, appointedBy: gov.appointedBy }),
    electedBy: ELECTED_BY[gov.kind === "governor" ? "governor" : gov.kind], 
    reportsTo: "President of India",
    stats: [FACT("Capital", facts.capital), FACT("Lok Sabha seats", facts.ls), ...(facts.rs ? [FACT("Rajya Sabha seats", facts.rs)] : [])],
  });
  const dp = depth[name];
  const asMember = (m) => ({ name: m.name.replace(/\s*\(.*\)$/, ""), image: depthThumbs[m.title] || null, blurb: descOf[m.title] || "", bio: "", wiki: m.title ? wikiUrl(m.title) : null, party: shortParty(m.party || ""), since: m.since || "", role: m.role || "", constituency: m.constituency || "" });
  if (cm) {
    const dcms = (deputies[name] || []).map((d) => person(d, { role: "Deputy Chief Minister" }));
    const cmNode = mk(`cm-${slug(name)}`, "office", "Chief Minister", {
      badge: facts.code, place: display, role: "cm",
      person: person(cm, { constituency: cm.constituency, election: cm.election, nationalAlliance: cm.nationalAlliance, stateAlliance: cm.stateAlliance, appointedBy: cm.appointedBy }),
      electedBy: ELECTED_BY.cm, reportsTo: `Governor of ${display}`, members: dcms, membersLabel: "Deputy Chief Ministers",
      stats: [FACT("Party", cm.party), FACT("Alliance", cm.stateAlliance || cm.nationalAlliance || "—"), FACT("Deputy CMs", dcms.length)],
    });
    const mlaMembers = dp?.districts ? Object.entries(dp.districts).flatMap(([dn, arr]) => arr.map((m) => ({ ...asMember(m), role: `${m.role} · ${dn}`, mirror: true }))) : [];
    if (facts.la) {
      const bicam = !!facts.lc;
      cmNode.children.push(house(`vs-${slug(name)}`, bicam ? "Vidhan Sabha + Parishad" : "Vidhan Sabha", {
        badge: facts.code, place: display,
        electedBy: `The ${bicam ? "Vidhan Sabha (lower house) is" : "Vidhan Sabha is"} directly elected by voters in single-member constituencies every five years.${bicam ? ` The ${facts.lc}-member Vidhan Parishad (upper house) is indirectly elected by MLAs, local bodies, graduates, teachers and the Governor's nominees.` : ""}`,
        reportsTo: `Chief Minister of ${display}`, members: mlaMembers, membersLabel: "MLAs",
        stats: [FACT("Assembly seats", facts.la), ...(bicam ? [FACT("Council seats", facts.lc)] : [FACT("Houses", "Unicameral")]), FACT("Majority mark", Math.floor(facts.la / 2) + 1)],
        summary: `${display} has a ${bicam ? "bicameral" : "unicameral"} legislature seated in ${facts.capital}.`,
      }));
    }
    if (dp?.ministers.length) {
      const mm = dp.ministers.map((m) => ({ ...asMember(m), mirror: true }));
      cmNode.children.push(house(`council-${slug(name)}`, "Council of Ministers", {
        badge: facts.code, place: display, electedBy: ELECTED_BY.council, reportsTo: `Chief Minister of ${display}`,
        members: mm, membersLabel: "Ministers",
        children: mm.map((m) => minister(slug(name), m, "Minister", m.role, `Chief Minister of ${display}`)),
        stats: [FACT("Ministers", mm.length), FACT("Led by", cm.name)],
        summary: `The ministers who run departments of the ${display} government. Appointed by the Governor on the Chief Minister's advice and collectively answerable to the Vidhan Sabha.`,
      }));
    }
    if (dp?.districts) {
      const names = Object.keys(dp.districts).sort();
      const total = Object.values(dp.districts).flat().length;
      cmNode.children.push(mk(`districts-${slug(name)}`, "group", "Districts", {
        badge: `${names.length}`, place: `${display} · ${names.length} districts`, accent: "Districts",
        summary: `${names.length} districts of ${display}. Each is run day to day by a District Collector (an IAS officer posted by the state government) with a Superintendent of Police, and is represented in the Vidhan Sabha by the MLAs listed here.`,
        stats: [FACT("Districts", names.length), FACT("MLAs", total)],
        children: names.map((dn) => {
          const mlas = dp.districts[dn].map((m) => ({ ...asMember(m), mirror: true }));
          const dNode = mk(`dist-${slug(name)}-${slug(dn)}`, "group", dn, {
            badge: `${mlas.length}`, place: `District · ${display}`, accent: "District",
            electedBy: ELECTED_BY.district, reportsTo: `Chief Minister of ${display}, through the state government`,
            members: mlas, membersLabel: "MLAs",
            stats: [FACT("MLAs", mlas.length), FACT("State", display)],
            summary: `${dn} district of ${display}. Its elected MLAs are listed below; the administration is led by the District Collector.`,
          });
          dNode.children = mlas.map((m) => legislator("mla", display, m, `${dn} district, ${display}`));
          return dNode;
        }),
      }));
    }
    govNode.children.push(cmNode);
  }
  return govNode;
}

const presidentNode = mk("president", "office", "President of India", {
  badge: "POI", role: "president", place: "Rashtrapati Bhavan",
  person: person(union.president, { constituency: "Electoral College" }),
  electedBy: ELECTED_BY.president, reportsTo: "Head of State; Supreme Commander of the Armed Forces",
  stats: [FACT("Term", "5 years"), FACT("Residence", "Rashtrapati Bhavan, New Delhi"), FACT("Elected by", "4,809 MPs and MLAs")],
});

const cabinetMembers = [...cabinet.values()].map((c) => person({ ...c, party: shortParty(c.party) }, { role: `${c.rank} · ${c.portfolios.join(" · ")}`, rank: c.rank, portfolio: c.portfolios.join(" · "), mirror: true }));
const nRank = (r) => [...cabinet.values()].filter((c) => c.rank === r).length;
const pm = mk("pm", "office", "Prime Minister", {
  badge: "PM", role: "pm", place: "Prime Minister's Office",
  person: person(union.pm, { constituency: union.pm.constituency }),
  electedBy: ELECTED_BY.pm, reportsTo: "President of India (appointed by); accountable to Lok Sabha",
  stats: [FACT("Party", union.pm.party || "BJP"), FACT("Ministers", cabinetMembers.length), FACT("Residence", "7, Lok Kalyan Marg")],
  children: [house("cabinet", "Union Cabinet", {
    badge: "UC", place: "Council of Ministers", electedBy: ELECTED_BY.cabinet, reportsTo: "Prime Minister",
    members: cabinetMembers, membersLabel: "Ministers",
    children: cabinetMembers.map((m) => minister("union", m, m.rank, m.portfolio, "Prime Minister")),
    stats: [FACT("Cabinet", nRank(RANKS[0])), FACT("MoS (Independent)", nRank(RANKS[1])), FACT("MoS", nRank(RANKS[2]))],
    summary: "The Union Cabinet is the executive core of the Council of Ministers and meets under the Prime Minister.",
  })],
});

const rajyaSabha = house("rajya-sabha", "Rajya Sabha", {
  badge: "RS", place: "Council of States", reportsTo: "Vice President (Chairman)",
  electedBy: "245 members: 233 elected by state and UT legislators (single transferable vote, one-third retiring every two years) and 12 nominated by the President for expertise in art, literature, science and social service.",
  stats: [FACT("Seats", 245), FACT("Elected", 233), FACT("Nominated", 12)],
  members: [
    person(union.rsDeputy, { role: "Deputy Chairman" }),
    person(union.rsLop, { role: "Leader of the Opposition" }),
    ...rsAll.filter((m) => ![union.rsDeputy.name, union.rsLop.name].includes(m.name)).map((m) => parl(m, "rs")),
  ], membersLabel: "Members",
  summary: "The upper house of Parliament. It is a permanent body: it cannot be dissolved.",
});
const vp = mk("vp", "office", "Vice President", {
  badge: "VP", role: "vp", place: "Ex-officio Chairman, Rajya Sabha",
  person: person(union.vp, {}), electedBy: ELECTED_BY.vp, reportsTo: "Second-highest constitutional office",
  stats: [FACT("Term", "5 years"), FACT("Chairs", "Rajya Sabha"), FACT("Elected by", "788 MPs")],
  children: [rajyaSabha],
});

const lokSabha = house("lok-sabha", "Lok Sabha", {
  badge: "LS", place: "House of the People", reportsTo: "Parliament of India",
  electedBy: "543 members directly elected from single-member constituencies by all citizens aged 18+ (first-past-the-post), every five years. The President may nominate Anglo-Indian members no longer; the house has 543 elected seats.",
  person: person(union.speaker, { role: "Speaker" }), personRole: "Speaker",
  members: [person(union.speaker, { role: "Speaker" }), person(union.lop, { role: "Leader of the Opposition" }),
    ...lsAll.filter((m) => ![union.speaker.name, union.lop.name].includes(m.name)).map((m) => parl(m, "ls"))], membersLabel: "Members",
  stats: [FACT("Seats", 543), FACT("Majority mark", 272), FACT("Speaker", union.speaker.name)],
  summary: "The lower house of Parliament and the seat of real executive accountability: the government survives only while it holds the confidence of the Lok Sabha.",
});

const supreme = mk("supreme-court", "office", "Chief Justice of India", {
  badge: "SC", role: "cji", place: "Supreme Court of India",
  person: person(union.cji, {}), electedBy: ELECTED_BY.cji, reportsTo: "Head of the Indian judiciary",
  stats: [FACT("Retirement age", 65), FACT("Sanctioned strength", "34 judges"), FACT("Seat", "Tilak Marg, New Delhi")],
});
const eci = mk("election-commission", "office", "Chief Election Commissioner", {
  badge: "ECI", role: "cec", place: "Election Commission of India",
  person: person(union.cec, {}), electedBy: ELECTED_BY.cec, reportsTo: "Independent constitutional body (Article 324)",
  stats: [FACT("Conducts", "All national & state elections"), FACT("Max. term", "6 yrs or age 65")],
});
const ag = mk("attorney-general", "office", "Attorney General", {
  badge: "AG", role: "ag", place: "Chief law officer of India", person: person(union.ag, {}), electedBy: ELECTED_BY.ag,
  reportsTo: "Government of India", stats: [FACT("Article", 76)],
});

// States grouped by region, UTs flat
const regionOrder = ["North", "Northeast", "East", "West", "Central", "South"];
const regionNodes = regionOrder.map((r) => {
  const names = Object.keys(STATES).filter((n) => STATES[n].region === r);
  return mk(`region-${slug(r)}`, "group", r, {
    badge: `${names.length}`, place: `${names.length} states`, summary: REGION_BLURB[r], accent: r,
    stats: [FACT("States", names.length), FACT("Lok Sabha seats", names.reduce((a, n) => a + STATES[n].ls, 0)), FACT("Assembly seats", names.reduce((a, n) => a + STATES[n].la, 0))],
    children: names.map((n) => stateNode(n, false)),
  });
});
const statesGroup = mk("states", "group", "States", {
  badge: "28", place: "Governors & Chief Ministers", summary: "28 states, each with a Governor appointed by the President and a Chief Minister who runs the elected government.",
  stats: [FACT("States", 28), FACT("Assembly seats", Object.values(STATES).reduce((a, s) => a + s.la, 0).toLocaleString("en-IN"))],
  children: regionNodes,
});
const utGroup = mk("uts", "group", "Union Territories", {
  badge: "8", place: "Lieutenant Governors & Administrators", summary: "8 Union Territories governed by the Centre through the President's appointees. Delhi, Puducherry and Jammu & Kashmir also have elected assemblies and Chief Ministers.",
  stats: [FACT("UTs", 8), FACT("With legislature", 3)],
  children: Object.keys(UTS).map((n) => stateNode(n, true)),
});

presidentNode.children = [vp, pm, lokSabha, supreme, eci, ag, statesGroup, utGroup];

lokSabha.children = stateGroups("ls", "Lok Sabha", lsAll, "mp", "Lok Sabha");
rajyaSabha.children = stateGroups("rs", "Rajya Sabha", rsAll, "rsmp", "Rajya Sabha");

// party breakdown for every node that holds a list of people
(function tally(n) {
  const src = n.members && n.members.length > 4 ? n.members : n.children.length > 2 && n.children.every((c) => c.kind === "office" && c.person) ? n.children.map((c) => c.person) : null;
  if (src) {
    const c = {};
    src.forEach((m) => { if (m.party) c[m.party] = (c[m.party] || 0) + 1; });
    n.parties = Object.entries(c).sort((a, b) => b[1] - a[1]);
  }
  n.children.forEach(tally);
})(presidentNode);

// ---------- 4. Write ----------
// quick audit
const missing = [];
(function walk(n) { if (n.person && !n.person.image) missing.push(n.id + ":" + n.person.name); n.members?.forEach((m) => !m.image && missing.push("member:" + m.name)); n.children.forEach(walk); })(presidentNode);
console.log("no image:", missing.length, "of people (Wikipedia has no photo)", missing.slice(0, 5));

fs.mkdirSync("public/data", { recursive: true });
fs.writeFileSync("public/data/india.json", JSON.stringify({ generatedAt: new Date().toISOString(), source: "Wikipedia (CC BY-SA 4.0)", partyColors: PARTY_COLORS, root: presidentNode }, (k, v) => (v === "" || v === null ? undefined : v)));
console.log("wrote public/data/india.json", (fs.statSync("public/data/india.json").size / 1024).toFixed(0) + " KB");
