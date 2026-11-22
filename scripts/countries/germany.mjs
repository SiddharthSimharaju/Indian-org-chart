// Germany. Constitutional text is hand-written from the Basic Law (gesetze-im-internet.de) and the Federal Constitutional Court's own pages; people come from Wikipedia (see scrape).
const PARTIES = { Grüne: "Greens", GRÜNE: "Greens", "Alliance 90/The Greens": "Greens", Linke: "Die Linke", "The Left": "Die Linke", Ind: "Independent", Independent: "Independent", Greens: "Greens", Left: "Die Linke", "FW": "Free Voters",
  "Christian Democratic Union": "CDU", "Christian Democratic Union of Germany": "CDU", "Social Democratic Party of Germany": "SPD", "Christian Social Union": "CSU", "Christian Social Union in Bavaria": "CSU", "Alternative for Germany": "AfD", "Free Democratic Party": "FDP", "Free Democratic Party (Germany)": "FDP" };
const norm = (s) => { s = (s || "").replace(/\[.*?\]/g, "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim(); return PARTIES[s] || s; };
const STATES = ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"];

export default {
  id: "germany", name: "Germany", iso2: "DE", flag: "🇩🇪", continent: "Europe", locale: "en-GB",
  system: "Federal parliamentary republic",
  description: "An interactive org chart of German politics: the Federal President, Chancellor, Cabinet, Bundestag, Bundesrat, Federal Constitutional Court and the leaders of all 16 states.",
  place: "Federal government and 16 states",
  summary: "A federal parliamentary republic. The Federal President is a largely ceremonial head of state; the Chancellor, elected by the Bundestag, leads the government. The Bundestag is directly elected, the Bundesrat represents the 16 state governments, and the Federal Constitutional Court guards the Basic Law.",
  rootElectedBy: "Germany's constitution is the Basic Law (Grundgesetz) of 1949. Voters elect the Bundestag, which elects the Chancellor; the 16 states take part in federal lawmaking through the Bundesrat.",
  rootReportsTo: "The voters, through the Bundestag",
  rootFacts: [["System", "Federal parliamentary republic"], ["Head of state", "The Federal President"], ["States", "16"]],
  stats: [["States", 16], ["Bundestag seats", 630], ["Bundesrat votes", 69]],
  nonpartisan: ["head-of-state", "justice"],
  sources: [
    "https://www.gesetze-im-internet.de/englisch_gg/englisch_gg.html",
    "https://www.bundestag.de/parlament/wahlen/wahlrecht-inhalt-975000",
    "https://www.bundesrat.de/EN/organisation-en/stimmenverteilung-en/stimmenverteilung-en-node.html",
    "https://www.bundesverfassungsgericht.de/EN/Das-Gericht/das-gericht_node.html",
    "https://www.gesetze-im-internet.de/englisch_bverfgg/englisch_bverfgg.html",
    "https://www.bundespraesident.de/EN/Role-and-Functions/ConstitutionalBasis/Election-of-the-Federal-President/Elections-node.html",
  ],
  normParty: norm,
  partyColors: { "Independent (Linke group)": "#6B7280", "Independent (no group)": "#6B7280", CDU: "#2B2B2B", CSU: "#0080C8", SPD: "#E3000F", AfD: "#009EE0", Greens: "#46962B", "Die Linke": "#BE3075", SSW: "#003C8F", FDP: "#FFED00", BSW: "#7D2A4A", "Free Voters": "#F7941D", Independent: "#6B7280" },
  partyInfo: {
    CDU: ["Christian Democratic Union", "Centre-right party founded in 1945. It runs in every state except Bavaria, where its sister party, the CSU, runs."],
    CSU: ["Christian Social Union", "Centre-right party that runs only in Bavaria and forms a joint parliamentary group with the CDU in the Bundestag."],
    SPD: ["Social Democratic Party", "Centre-left party."],
    AfD: ["Alternative for Germany", "Right-wing party founded in 2013."],
    Greens: ["Alliance 90/The Greens", "Environmentalist party founded in 1980; it merged with the East German Alliance 90 in 1993."],
    "Die Linke": ["The Left", "Left-wing party formed in 2007 from the PDS and the WASG."],
    SSW: ["South Schleswig Voters' Association", "Party of the Danish and Frisian minorities in Schleswig-Holstein, exempt from the 5% threshold."],
    Independent: ["Independent", "Not a member of a political party."],
  },

  headOfState: {
    label: "Federal President", badge: "BPr", place: "Schloss Bellevue", icon: "flag",
    card: { where: ["Jurisdiction", "Germany"], chosen: "Federal Convention", term: "5 years" },
    stats: [["Term", "5 years, one re-election"], ["Elected by", "Federal Convention"], ["Residence", "Schloss Bellevue, Berlin"]],
    text: {
      electedBy: "Elected without debate by the Federal Convention, made up of all Bundestag members and an equal number of delegates chosen by the state parliaments. Must be a German entitled to vote in Bundestag elections and aged 40 or over. The term is five years, and re-election for a consecutive term is allowed only once (Article 54 of the Basic Law).",
      reportsTo: "Head of state. Not answerable to voters; can be impeached before the Federal Constitutional Court.",
      plain: "The head of state, a mainly representative and moral authority. Represents Germany abroad, signs laws and formally appoints the Chancellor and ministers. In practice these acts follow the Bundestag's choice and the Chancellor's proposals. The President proposes a Chancellor candidate to the Bundestag, and can dissolve it only in rare situations.",
      plainFacts: [["Term", "5 years; one consecutive re-election"], ["Chosen by", "The Federal Convention"], ["Can be removed by", "The Federal Constitutional Court, after impeachment by the Bundestag or Bundesrat"], ["Real power", "Mostly ceremonial"]],
      terms: [["Federal Convention", "A body that meets only to elect the President: all Bundestag members plus an equal number of delegates from the state parliaments."], ["Impeachment", "A charge of wilful violation of the law, which needs a two-thirds vote in the Bundestag or Bundesrat before the Constitutional Court decides."]],
    },
  },
  headOfGov: {
    label: "Chancellor", badge: "BK", place: "Federal Chancellery", icon: "briefcase",
    card: { where: ["Jurisdiction", "Germany"], chosen: "Bundestag", term: "Until a new Bundestag" },
    stats: (p) => [["Party", p.party || "—"], ["Elected by", "The Bundestag"], ["Seat", "Federal Chancellery, Berlin"]],
    text: {
      electedBy: "Elected by the Bundestag without debate on the Federal President's proposal, and appointed by the President. Voters do not choose the Chancellor directly. Being elected takes a majority of all Bundestag members in the first rounds (Article 63).",
      reportsTo: "The Bundestag. The Chancellor can be removed only by a constructive vote of no confidence that elects a successor (Article 67).",
      plain: "The head of government. Sets the general guidelines of government policy (Article 65) and leads the Cabinet. Chosen by parliament rather than directly by voters.",
      plainFacts: [["Term", "Tied to the Bundestag's four-year term; no term limit"], ["Chosen by", "The Bundestag"], ["Can be removed by", "A constructive vote of no confidence: the Bundestag elects a successor by a majority of its members"], ["Powers", "Determines the general guidelines of policy for the whole government (Article 65)"]],
      terms: [["Constructive vote of no confidence", "A way to remove the Chancellor that requires the Bundestag to elect a replacement at the same time, so the country is never left without a government."], ["Coalition", "An agreement between parties to govern together when none has a majority alone."]],
    },
  },
  cabinet: {
    label: "Federal Cabinet", badge: "BReg", place: "The Federal Government", icon: "users", membersLabel: "Ministers",
    stats: (m) => [["Ministers listed", m.length], ["Led by", "The Chancellor"]],
    text: {
      electedBy: "Appointed and dismissed by the Federal President on the Chancellor's proposal (Article 64).",
      reportsTo: "The Chancellor, who sets the policy guidelines; each minister runs their own department within them.",
      plain: "The Federal Government: the Chancellor and the federal ministers. Each minister runs a department on their own responsibility within the Chancellor's guidelines, and the Cabinet as a whole settles disputes between ministers.",
      plainFacts: [["Term", "While the Chancellor stays in office"], ["Chosen by", "The Chancellor proposes; the President appoints"], ["Can be removed by", "The President, on the Chancellor's proposal"]],
      terms: [["Vice Chancellor", "The Chancellor's deputy, who also heads a ministry."], ["Federal ministry", "A government department such as Finance or Defence."]],
    },
    memberPlain: {
      plain: "A federal minister who runs a government department, or a minister with special tasks, on their own responsibility within the Chancellor's guidelines. Ministers are usually members of the Bundestag and of one of the governing parties.",
      facts: [["Term", "While the Chancellor stays in office"], ["Chosen by", "The Chancellor proposes; the President appoints"], ["Takes an oath", "Before the Bundestag, on taking office"]],
    },
    minister: {
      badge: "MIN", card: { where: ["Ministry"], chosen: "Chancellor", term: "While Chancellor serves" },
      electedBy: "Appointed by the Federal President on the Chancellor's proposal.", reportsTo: "The Chancellor",
      plain: "A federal minister who runs a government department on their own responsibility within the Chancellor's policy guidelines.",
      plainFacts: [["Term", "While the Chancellor stays in office"], ["Chosen by", "The Chancellor proposes; the President appoints"]],
    },
  },
  chambers: {
    bundestag: {
      label: "Bundestag", badge: "BT", place: "Directly elected parliament", seats: 630, ungroupedLabel: "State not listed", leaderTitle: "President of the Bundestag", memberLabel: "Member of the Bundestag", memberBadge: "MdB", icon: "landmark",
      card: { where: ["Seat"], chosen: "Voters", term: "4 years" },
      stats: (d) => [["Seats", 630], ["Majority mark", 316], ["President", d.leader?.name || "—"]],
      text: {
        electedBy: "630 members elected in general, direct, free, equal and secret elections for four years (Articles 38 and 39). Each voter has two votes: the first for a candidate in one of 299 constituencies, the second for a party list, which decides how many seats each party gets. Since the 2023 reform, a directly elected candidate takes a seat only if their party's second-vote share covers it.",
        reportsTo: "The voters. The Chancellor needs the support of a majority of its members.",
        plain: "The directly elected parliament and the centre of federal politics. Passes federal laws, elects the Chancellor, approves the budget and oversees the government. A Chancellor needs the backing of a majority of its members.",
        plainFacts: [["Seats", "630"], ["Majority mark", "316"], ["Term", "4 years"]],
        terms: [["Two votes", "Each voter casts a first vote for a local candidate and a second vote for a party list. The second vote decides each party's share of seats."], ["Constituency", "One of 299 areas that each elect a candidate directly with the first vote."], ["Parliamentary group (Fraktion)", "The members of a party or a party alliance in the Bundestag, such as the CDU/CSU."]],
      },
      memberPlain: {
        plain: "Elected by voters in one of 299 constituencies or from a party list in one of the 16 states. Members represent the whole people and are not bound by orders or instructions (Article 38). They vote on laws, elect the Chancellor and oversee the government.",
        facts: [["Term", "4 years"], ["Chosen by", "Voters, in a constituency or from a party list"], ["Must be", "A German aged 18 or over"]],
        terms: [["Two votes", "Each voter casts a first vote for a local candidate and a second vote for a party list."]],
      },
    },
    bundesrat: {
      label: "Bundesrat", badge: "BR", place: "Chamber of the 16 states", seats: 69, leaderTitle: "President of the Bundesrat", memberLabel: "Member of the Bundesrat", memberBadge: "BR", icon: "landmark", groupBy: true,
      card: { where: ["State"], chosen: "State government", term: "While in state office" },
      stats: (d) => [["Votes", 69], ["Simple majority", 35], ["President", d.leader?.name || "—"]],
      text: {
        electedBy: "Not elected. Each of the 16 states sends members of its own government, which appoints and recalls them. A state has between three and six votes depending on its population (69 in total), and it must cast its votes as a block (Article 51).",
        reportsTo: "The 16 state governments, which appoint and recall its members.",
        plain: "The chamber through which the 16 states take part in federal lawmaking and administration and in EU matters (Article 50). Its consent is needed for laws that affect the states' powers; on other laws it can lodge an objection, which the Bundestag can overrule. The presidency rotates among the states each year.",
        plainFacts: [["Votes", "69"], ["Votes per state", "3 to 6, by population"], ["Chosen by", "State governments"]],
        terms: [["Block voting", "A state's votes can only be cast together, according to its government's position."]],
      },
      memberPlain: {
        plain: "A member of a state government (usually the Minister-President or a state minister) who represents that state in the Bundesrat. Votes are cast by state as a block, following the state government's position.",
        facts: [["Term", "For as long as they hold their state office"], ["Chosen by", "Their state government"], ["Votes", "Each state casts 3 to 6 votes as a block"]],
      },
    },
  },
  judiciary: {
    label: "Federal Constitutional Court", badge: "BVerfG", place: "Guardian of the Basic Law", icon: "scale", chiefTitle: "President of the Federal Constitutional Court", memberTitle: "Judge of the Federal Constitutional Court", membersLabel: "Judges",
    card: { where: ["Court", "Federal Constitutional Court"], chosen: "Bundestag or Bundesrat", term: "12 years (to age 68)" },
    stats: (j) => [["Judges", j.length], ["Senates", 2], ["Term", "12 years, no re-election"]],
    text: {
      electedBy: "Half of the judges are elected by the Bundestag and half by the Bundesrat, each by a two-thirds majority. Judges serve a single term of twelve years, or until age 68 if that comes first, and cannot be re-elected.",
      reportsTo: "The Basic Law only. Independent of the government and Parliament.",
      plain: "The guardian of the Basic Law. Decides whether laws and government actions comply with the constitution, settles disputes between federal bodies and hears constitutional complaints from individuals. Its rulings bind all other state bodies and courts. Sixteen judges sit in two senates of eight.",
      plainFacts: [["Judges", "16, in two senates of eight"], ["Term", "12 years, no re-election; retire at 68"], ["Chosen by", "Bundestag and Bundesrat, two-thirds majority"]],
      terms: [["Constitutional complaint", "A case any person can bring if they think the state has violated their basic rights."]],
    },
    memberPlain: {
      plain: "A judge of Germany's constitutional court. Judges sit in one of two senates of eight, decide constitutional questions together and publish their rulings, which bind all other courts and state bodies.",
      facts: [["Term", "12 years, no re-election; retire at 68"], ["Chosen by", "Bundestag or Bundesrat, two-thirds majority"], ["Can be removed by", "Only with the consent of two thirds of the Court, for a grave breach of duty or a serious conviction (Section 105 of the Court's Act)"]],
    },
    itemText: {
      electedBy: "Elected by the Bundestag or the Bundesrat by a two-thirds majority.", reportsTo: "The Federal Constitutional Court",
      plain: "A judge of Germany's constitutional court, which decides whether laws and government actions comply with the Basic Law.", plainFacts: [["Term", "12 years, no re-election; retire at 68"], ["Chosen by", "Bundestag or Bundesrat, two-thirds majority"]],
    },
  },
  regions: {
    label: "States (Länder)", place: "State government leaders", icon: "map", headLabel: "Minister-President",
    card: { where: ["State"], chosen: "State parliament", term: "Until the next state election" },
    stats: (r) => [["States", 16], ["Leaders listed", r.length]],
    text: {
      electedBy: "Germany is a federation of 16 states, each with its own constitution, parliament and government.",
      reportsTo: "Each state's parliament and voters; the states take part in federal lawmaking through the Bundesrat.",
      plain: "Germany is a federation of 16 states. Each has its own constitution, elected parliament and government. States run schools, policing and much of the administration, and take part in federal lawmaking through the Bundesrat.",
      plainFacts: [["States", "16"], ["City-states", "Berlin, Hamburg and Bremen"]],
      terms: [["City-state", "A state that is also a single city: Berlin, Hamburg and Bremen."]],
    },
    memberPlain: {
      plain: "The head of a state government, elected by the state parliament. The title varies: Minister-President in most states, Governing Mayor in Berlin, First Mayor in Hamburg and President of the Senate in Bremen. State leaders also sit in the Bundesrat.",
      facts: [["Term", "Until the next state election, or until the parliament withdraws support"], ["Chosen by", "The state parliament"], ["Role in federal politics", "Usually a member of the Bundesrat"]],
    },
    headText: {
      electedBy: "Elected by the state parliament. The title varies: Minister-President in most states, Governing Mayor in Berlin, First Mayor in Hamburg and President of the Senate and Mayor in Bremen.",
      reportsTo: "The state parliament, which elects them and can withdraw its support.",
      plain: "The head of a state government. Leads the state's cabinet, represents the state and usually sits in the Bundesrat, where the states take part in federal lawmaking.",
      plainFacts: [["Term", "Until the next state election, or until the parliament withdraws support"], ["Chosen by", "The state parliament"]],
    },
  },

  async scrape(w) {
    const { incumbent, partyOfPage, allTables, T, links, nameOnly, dateOf } = w;
    const { getText, getZipFile, nameKey } = await import("../official-sources.mjs");
    const cheerio = await import("cheerio");
    const nm = (title, text) => nameOnly(title || text || "");
    // first + last name only: sources differ on middle names and initials (e.g. "Alexis L. Giersch" vs "Alexis Giersch")
    const fl = (n) => { const t = nameKey(n).split(" ").filter(Boolean); return t.length > 2 ? `${t[0]} ${t[t.length - 1]}` : t.join(" "); };
    const strip = (n) => n.replace(/^((Prof\.|Dr\.|Dipl\.-\w+\.?|h\.c\.|mult\.)\s*)+/g, "").replace(/\s+/g, " ").trim();
    const person = async (page, party = true) => { const i = await incumbent(page); return { title: i.title, name: nm(i.title, i.name), since: i.since, ...(party ? { party: await partyOfPage(i.title, norm) } : {}) }; };
    const headOfState = await person("President of Germany", false);
    const headOfGov = await person("Chancellor of Germany");
    if (headOfGov.name === "Friedrich Merz") headOfGov.bio = "Friedrich Merz is the Chancellor of Germany and chairman of the Christian Democratic Union (CDU)."; // hand-written neutral bio (builder check 7)
    console.log("president", headOfState.name, "| chancellor", headOfGov.name, headOfGov.party);

    // ---- Wikipedia 21st Bundestag page: used for photos/links (name -> article) and for departures reported after the open-data file's date ----
    const { $: bt, tables: btt } = await allTables("21st Bundestag", 3);
    const wikiTitle = new Map();
    const mainTbl = btt.find((t) => t.h.includes("name") && t.h.includes("member since") && t.g.length > 500);
    for (const r of mainTbl.g.slice(1)) { const L = links(bt, r[1])[0]; if (L) wikiTitle.set(fl(nm(L.title, L.text)), L.title); }
    // Official list of departures and successors, and of name changes, in this Wahlperiode (bundestag.de)
    const AUS = cheerio.load(await getText("https://www.bundestag.de/abgeordnete/biografien/ausgeschiedene", { key: "de-bundestag-ausgeschiedene.html" }));
    const ausRows = (t) => AUS(t).find("tr").toArray().map((tr) => AUS(tr).children("th,td").toArray().map((c) => AUS(c).text().replace(/\(Interner Link\)/g, "").replace(/\s+/g, " ").trim())).filter((r) => r.length >= 3);
    const ausTables = AUS("table").toArray();
    const person2 = (str) => { const [n, ...p] = str.split(","); return { name: strip(n), party: p.join(",").trim() }; };
    const isDate = (x) => /^\d\d\.\d\d\.\d{4}$/.test(x || "");
    const departures = ausRows(ausTables[0]).filter((r) => isDate(r[0])).map((r) => ({ date: r[0], gone: person2(r[1]), successor: person2(r[2].replace(/\s+(CDU\/CSU|SPD|AfD)$/, ", $1")), entry: r[3] }));
    const nameChanges = ausRows(ausTables[1] || ausTables[0]).filter((r) => r.length >= 4 && isDate(r[3]) && /,/.test(r[0]) && !/ \| /.test(r[0])).map((r) => { const [ln, fn] = r[0].split(/,\s*/), [ln2, fn2] = r[1].split(/,\s*/); return { from: `${fn} ${ln}`.trim(), to: `${(fn2 || "").replace(/\s*\(.*$/, "")} ${ln2}`.trim(), date: r[3] }; });
    console.log("bundestag.de departures:", departures.length, "| name changes:", nameChanges.map((n) => `${n.from} -> ${n.to} (${n.date})`).join("; ") || "none");

    // ---- Bundestag: official open data (MdB-Stammdaten, Wahlperiode 21) ----
    const STATE = { BW: "Baden-Württemberg", BY: "Bavaria", BE: "Berlin", BB: "Brandenburg", HB: "Bremen", HH: "Hamburg", HE: "Hesse", MV: "Mecklenburg-Vorpommern", NI: "Lower Saxony", NW: "North Rhine-Westphalia", RP: "Rhineland-Palatinate", SL: "Saarland", SN: "Saxony", ST: "Saxony-Anhalt", SH: "Schleswig-Holstein", TH: "Thuringia" };
    const BT_URL = "https://www.bundestag.de/resource/blob/472878/MdB-Stammdaten.zip";
    const xml = await getZipFile(BT_URL, "MDB_STAMMDATEN.XML", { key: "de-mdb-stammdaten.zip" });
    const tag = (blk, t) => (blk.match(new RegExp(`<${t}>([^<]*)</${t}>`)) || [, ""])[1].trim();
    const PARTY_DE = { CDU: "CDU", CSU: "CSU", SPD: "SPD", AfD: "AfD", "BÜNDNIS 90/DIE GRÜNEN": "Greens", "DIE LINKE.": "Die Linke", SSW: "SSW", Plos: "Independent" };
    const official = [];
    for (const blk of xml.split("<MDB>").slice(1)) {
      const wp = blk.match(/<WAHLPERIODE>\s*<WP>21<\/WP>([\s\S]*?)<\/WAHLPERIODE>/); if (!wp) continue;
      const w21 = wp[1]; if (tag(w21, "MDBWP_BIS")) continue; // mandate ended
      const names = [...blk.matchAll(/<NAME>([\s\S]*?)<\/NAME>/g)].map((m) => m[1]).filter((b) => /<HISTORIE_BIS\s*\/>/.test(b));
      const nb = names[names.length - 1] || ""; const name = [tag(nb, "VORNAME"), tag(nb, "PRAEFIX"), tag(nb, "NACHNAME")].filter(Boolean).join(" ");
      const partyRaw = tag(blk, "PARTEI_KURZ"), kind = tag(w21, "MANDATSART");
      const fr = [...w21.matchAll(/<INSART_LANG>Fraktion\/Gruppe<\/INSART_LANG>\s*<INS_LANG>([^<]*)<\/INS_LANG>\s*<MDBINS_VON>[^<]*<\/MDBINS_VON>\s*<MDBINS_BIS\s*\/>/g)].map((m) => m[1]).pop() || "";
      const listState = STATE[tag(w21, "LISTE")], wkrState = STATE[tag(w21, "WKR_LAND")];
      const direct = kind === "Direktwahl";
      official.push({
        ref: `de-bundestag-${tag(blk, "ID")}`, name, party: partyRaw === "Plos" ? (/Linke/.test(fr) ? "Independent (Linke group)" : "Independent (no group)") : PARTY_DE[partyRaw] || partyRaw, since: tag(w21, "MDBWP_VON").slice(-4),
        seat: direct ? `${tag(w21, "WKR_NAME")} (${tag(w21, "WKR_NUMMER").padStart(3, "0")})` : `List · ${listState}`, group: direct ? wkrState || listState : listState,
        ...(partyRaw === "Plos" ? { note: `Non-party; member of the ${fr.replace(/^Fraktion /, "")} parliamentary group` } : {}), kind, fraktion: fr,
      });
    }
    console.log("bundestag official open data (WP 21, no end date):", official.length, "| direct", official.filter((m) => m.kind === "Direktwahl").length, "list", official.filter((m) => m.kind === "Landesliste").length);

    // Reconcile the open-data file (dated 29 April 2026) with the departures and successors bundestag.de lists since: remove departed members, add successors on the departed member's state list
    const byKey = new Map(official.map((m) => [fl(m.name), m]));
    const PARTY_PAGE = { "Bündnis 90/Die Grünen": "Greens", "Die Linke": "Die Linke", SPD: "SPD", AfD: "AfD", CSU: "CSU", CDU: "CDU" };
    const iso = (d) => d.split(".").reverse().join("-");
    const gone = new Map(); let removed = 0, already = 0; const added = [];
    for (const d of departures) { const k = fl(d.gone.name); const m = byKey.get(k); if (m) { gone.set(k, m); byKey.delete(k); removed++; } }
    for (const d of departures) {
      const sk = fl(d.successor.name); if (byKey.has(sk)) { already++; continue; }
      const g = gone.get(fl(d.gone.name)); if (!g) continue; // the departed member had already left the file
      byKey.set(sk, { ref: `de-bundestag-nachfolger-${sk.replace(/ /g, "-")}`, name: d.successor.name, party: PARTY_PAGE[d.successor.party] || g.party, since: d.entry.slice(-4), seat: `List · ${g.group}`, group: g.group, kind: "Landesliste", note: `Entered the Bundestag on ${iso(d.entry)}, succeeding ${d.gone.name} (bundestag.de)` });
      added.push(d.successor.name);
    }
    for (const c of nameChanges) { const m = byKey.get(fl(c.from)); if (!m) continue; byKey.delete(fl(c.from)); byKey.set(fl(c.to), { ...m, name: c.to, note: `Name changed from ${c.from} on ${iso(c.date)} (bundestag.de)` }); }
    const members = [...byKey.values()].map((m) => ({ ...m, title: wikiTitle.get(fl(m.name)) }));
    const NOTE_MDB = { [fl("Jan Wenzel Schmidt")]: "Party member; excluded from the AfD parliamentary group on 3 March 2026, sits fraktionslos (bundestag.de)", [fl("Gerhard Trabert")]: "Seat held but not exercised for health reasons (evangelisch.de, 19 August 2025)" };
    for (const m of members) if (NOTE_MDB[fl(m.name)]) m.note = NOTE_MDB[fl(m.name)];
    const tally = members.reduce((a, m) => { const k = /^Independent/.test(m.party) ? "independents" : m.party; a[k] = (a[k] || 0) + 1; return a; }, {});
    console.log("bundestag party tally:", JSON.stringify(tally));
    console.log("reconciled with bundestag.de departures:", departures.length, "listed;", removed, "removed from the file;", already, "successors already in the file;", added.length, "added (" + added.join(", ") + ") => members", members.length);
    const pres = await incumbent("President of the Bundestag");
    const lead = members.find((m) => fl(m.name) === fl(nm(pres.title, pres.name)));
    const bundestag = { members, official: { count: 630, source: "Bundestag open data MdB-Stammdaten (WP 21) reconciled with reported departures; seat total fixed by law at 630 (Federal Elections Act, 2023 reform)" }, leader: { ...(lead || {}), title: pres.title, name: nm(pres.title, pres.name), party: lead?.party || "CDU", since: pres.since }, others: [] };

    // ---- Federal cabinet: bundesregierung.de (official) with English titles from Wikipedia ----
    const cab = cheerio.load(await getText("https://www.bundesregierung.de/breg-de/bundesregierung/bundeskabinett", { key: "de-bundeskabinett.html" }));
    const { $: mc, tables: mct } = await allTables("Merz cabinet", 5);
    const mtbl = mct.find((t) => t.h[0] === "order" && t.h.includes("office"));
    const enOff = new Map();
    for (const r of mtbl.g.slice(1)) { if (!/incumbent/i.test(T(mc, r[7]))) continue; const L = links(mc, r[3])[0]; if (!L) continue; const k = nameKey(nm(L.title, L.text)), e = enOff.get(k) || { title: L.title, offices: [], party: "" }; const o = T(mc, r[1]); if (!e.offices.includes(o)) e.offices.push(o); e.party = norm(T(mc, r[4])); enOff.set(k, e); }
    const ministers = [];
    cab("li.bpa-teaser-wrapper").each((_, li) => {
      const name = strip(cab(li).find(".bpa-teaser-title-text-inner").first().text().replace(/\s+/g, " "));
      const roleDe = cab(li).find("ul.bpa-teaser-cabinet-list li").map((__, x) => cab(x).text().replace(/\s+/g, " ").trim()).get().filter((t) => t !== "Lebenslauf").join("; ");
      const src = cab(li).find("img").first().attr("src");
      if (!name || /^Bundeskanzler$/i.test(roleDe)) return;
      const k = nameKey(name), e = enOff.get(k), mm = members.find((m) => fl(m.name) === fl(name));
      let offices = e?.offices || [roleDe];
      const vice = offices.find((o) => /^Vice Chancellor/.test(o)), rest = offices.filter((o) => o !== vice);
      let office = vice && rest.length ? `${vice} and ${rest.join(" and ")}` : offices.join(" and ");
      if (/besondere Aufgaben/.test(roleDe)) office = "Federal Minister for Special Affairs and Head of the Federal Chancellery (Bundesministerin für besondere Aufgaben/Chefin des Bundeskanzleramtes)";
      if (/Landwirtschaft, Ernährung und Heimat/.test(roleDe)) office = `Federal Minister of Agriculture, Food and Regional Identity (Bundesminister für Landwirtschaft, Ernährung und Heimat)`;
      ministers.push({ name, title: e?.title || wikiTitle.get(fl(name)), office, role: office, dept: "", party: mm?.party || e?.party || "", since: "", image: src ? "https://www.bundesregierung.de" + src : undefined });
    });
    const rosterWiki = [...enOff.keys()].filter((k) => !/^friedrich merz$/.test(k)), rosterOff = new Set(ministers.map((m) => nameKey(m.name)));
    console.log("cabinet (bundesregierung.de)", ministers.length, "| differences vs Wikipedia:", rosterWiki.filter((k) => !rosterOff.has(k)).join(", ") || "none");

    // ---- Bundesrat and state leaders: bundesrat.de member pages, one per state ----
    const SNAME = { "Baden-Württemberg": "Baden-Württemberg", "Freistaat Bayern": "Bavaria", Berlin: "Berlin", Brandenburg: "Brandenburg", "Freie Hansestadt Bremen": "Bremen", "Freie und Hansestadt Hamburg": "Hamburg", Hessen: "Hesse", "Mecklenburg-Vorpommern": "Mecklenburg-Vorpommern", Niedersachsen: "Lower Saxony", "Nordrhein-Westfalen": "North Rhine-Westphalia", "Rheinland-Pfalz": "Rhineland-Palatinate", Saarland: "Saarland", "Freistaat Sachsen": "Saxony", "Sachsen-Anhalt": "Saxony-Anhalt", "Schleswig-Holstein": "Schleswig-Holstein", "Freistaat Thüringen": "Thuringia" };
    const VOTES = { "Baden-Württemberg": 6, Bavaria: 6, Berlin: 4, Brandenburg: 4, Bremen: 3, Hamburg: 3, Hesse: 5, "Mecklenburg-Vorpommern": 3, "Lower Saxony": 6, "North Rhine-Westphalia": 6, "Rhineland-Palatinate": 4, Saarland: 3, Saxony: 4, "Saxony-Anhalt": 4, "Schleswig-Holstein": 4, Thuringia: 4 };
    const PARTY_BR = { "BÜNDNIS 90/DIE GRÜNEN": "Greens", "DIE LINKE": "Die Linke", "FREIE WÄHLER": "Free Voters", parteilos: "Independent" };
    const delegates = [], heads = {};
    for (let n = 2; n <= 17; n++) {
      const page = cheerio.load(await getText(`https://www.bundesrat.de/DE/bundesrat/mitglieder/mitglieder-node.html?param1=state-${n}`, { key: `de-bundesrat-state-${n}.html` }));
      let section = "";
      page("h2").each((_, h) => {
        const t = page(h).text().replace(/\s+/g, " ").trim();
        if (/^Stellvertretende Mitglieder \|/.test(t)) { section = "alt"; return; }
        if (/^Mitglieder \|/.test(t)) { section = "member"; return; }
        if (section !== "member" || !/ \| /.test(t)) return;
        const card = page(h).closest("li,article,div[class*=teaser]"), [rawName, rawParty] = t.split(" | ");
        const stateDe = card.find("p").first().text().replace(/\s+/g, " ").trim(), state = SNAME[stateDe]; if (!state) return;
        const roles = card.find("h3").map((__, x) => page(x).text().replace(/\s+/g, " ").trim()).get();
        const img = card.find("img").first().attr("src"), name = strip(rawName);
        const m = { name, title: wikiTitle.get(fl(name)), seat: roles.slice(0, 2).join(" · "), group: state, party: norm(PARTY_BR[rawParty] || rawParty), since: "", image: img, ref: `de-bundesrat-${nameKey(name).replace(/ /g, "-")}-${state}` };
        if (fl(name) === fl("Claudia Müller") && state === "Mecklenburg-Vorpommern") { m.seat = "Member of the state government; ministry title not confirmed after the November 2026 re-election"; m.title = undefined; m.wiki = null; }
        delegates.push(m);
        const headRole = roles.find((r) => /(Ministerpräsident|Regierende[rn]? Bürgermeister|Erste[rn]? Bürgermeister|Präsident des Senats)/i.test(r) && !/Stellvertret|Zweite|Dritte|Vizepräsident/i.test(r)); if (headRole) heads[state] = { ...m, roleDe: headRole };
      });
    }
    const perState = delegates.reduce((a, m) => ((a[m.group] = (a[m.group] || 0) + 1), a), {});
    const shortfalls = Object.keys(VOTES).filter((k) => (perState[k] || 0) !== VOTES[k]).map((k) => `${k} ${perState[k] || 0}/${VOTES[k]}`);
    console.log("bundesrat (bundesrat.de)", delegates.length, "of 69 | per-state differences vs votes:", shortfalls.join(", ") || "none");
    const bp = await incumbent("President of the German Bundesrat");
    const bundesrat = { members: delegates, official: { count: 69, source: "Basic Law Art. 51 (69 votes); delegates from https://www.bundesrat.de/DE/bundesrat/mitglieder/mitglieder-node.html" }, leader: { ...(delegates.find((m) => fl(m.name) === fl(nm(bp.title, bp.name))) || {}), title: bp.title, name: nm(bp.title, bp.name), since: bp.since }, others: [] };
    bundesrat.leader.party = bundesrat.leader.party || "";

    // ---- Federal Constitutional Court: the Court's own pages (list of judges and each judge's CV) ----
    const { $: fc, tables: fct } = await allTables("Federal Constitutional Court", 10);
    const wikiJudge = new Map();
    for (const r of fct.find((t) => t.h[0] === "name" && t.h.includes("election by")).g.slice(1)) { if (r[0] === r[1]) continue; const L = links(fc, r[0])[0]; if (L) wikiJudge.set(fl(nm(L.title, L.text)), L.title); }
    const bl = cheerio.load(await getText("https://www.bundesverfassungsgericht.de/DE/Richter/richter_node.html", { key: "de-bverfg-judges.html" }));
    const judgeLinks = bl("a").toArray().map((a) => ({ t: bl(a).text().replace(/\s+/g, " ").trim(), h: bl(a).attr("href") })).filter((x) => /RichterinnenRichter\/(ErsterSenat|ZweiterSenat)\/.+_node\.html/i.test(x.h || ""));
    const MONTH = { Januar: "January", Februar: "February", März: "March", April: "April", Mai: "May", Juni: "June", Juli: "July", August: "August", September: "September", Oktober: "October", November: "November", Dezember: "December" };
    const MON = Object.keys(MONTH).join("|"), toEn = (d) => d.replace(new RegExp(MON), (m) => MONTH[m]);
    const judges = [];
    for (const l of judgeLinks) {
      const body = cheerio.load(await getText(l.h, { key: "de-bverfg-" + l.h.split("/").slice(-2).join("-") }))("body").text().replace(/\s+/g, " ");
      const name = strip(l.t.replace(/,\s*LL\.M\..*$/, "")).replace(/^Prof\.\s*Dr\.\s*/, "");
      const judgeSince = body.match(new RegExp(`seit ((?:${MON}) \\d{4})\\s*Richter(?:in)? des Bundesverfassungsgerichts`))?.[1];
      const viceSince = body.match(new RegExp(`seit ((?:${MON}) \\d{4})\\s*Vorsitzende[^.]{0,80}?Vizepr`))?.[1] || body.match(new RegExp(`((?:${MON}) \\d{4})\\s*Ernennung zum Vizepräsidenten des Bundesverfassungsgerichts`))?.[1];
      const presSince = body.match(new RegExp(`((?:${MON}) \\d{4})\\s*Ernennung zum Präsidenten des Bundesverfassungsgerichts`))?.[1];
      const chief = !!presSince, vice = !chief && !!viceSince;
      judges.push({ title: wikiJudge.get(fl(name)), name, chief, label: vice ? "Vice President of the Federal Constitutional Court" : undefined,
        since: toEn(chief ? presSince : judgeSince || viceSince || ""), ...(chief && viceSince ? { note: `Vice President of the Court since ${toEn(viceSince)}` } : {}) });
    }
    judges.sort((a, b) => (b.chief ? 1 : 0) - (a.chief ? 1 : 0));
    console.log("judges (bundesverfassungsgericht.de)", judges.length, "| without a start date:", judges.filter((j) => !j.since).map((j) => j.name).join(", ") || "none", "| president:", judges.find((j) => j.chief)?.name, judges.find((j) => j.chief)?.since, "| vice president:", judges.find((j) => j.label)?.name, judges.find((j) => j.label)?.since);

    // ---- State leaders: names from the Bundesrat pages, since-dates from Wikipedia only where both agree ----
    const { $: mp, tables: mpt } = await allTables("Minister president (Germany)", 10);
    const lt = mpt.find((t) => t.h[0] === "state" && t.h[1] === "portrait");
    const wikiHead = new Map(lt.g.slice(1).map((r) => [nameOnly(T(mp, r[0])), { key: nameKey(nm(links(mp, r[2]).find((l) => !/^(List of|Governing Mayor|First Mayor|Mayor|Minister|President of the Senate)/i.test(l.title))?.title, "")), since: dateOf(T(mp, r[5])), title: links(mp, r[2]).find((l) => !/^(List of|Governing Mayor|First Mayor|Mayor|Minister|President of the Senate)/i.test(l.title))?.title }]));
    const LABEL = { Berlin: "Governing Mayor", Hamburg: "First Mayor and President of the Senate", Bremen: "President of the Senate and Mayor" };
    const NOTE = {
      Berlin: "Caretaker government after the 20 September 2026 election; Linke, Greens and SPD began coalition talks on 2 November 2026 (reported)",
      "Saxony-Anhalt": "Remains in office after the 6 September 2026 election; formation of a new government not confirmed",
      "Mecklenburg-Vorpommern": "Re-elected 16 November 2026 (39 of 71 votes; SPD, Linke and Greens) (infranken)",
    };
    // Start dates are kept only where they were confirmed; the rest are left blank rather than taken from Wikipedia unchecked.
    const CONFIRMED_SINCE = new Set(["Baden-Württemberg", "Rhineland-Palatinate"]), UNCONFIRMED = new Set();
    // Start dates sourced by hand: Voigt elected 12 December 2024 (zdfheute), Rehlinger 25 April 2022 (orf.at), Schulze 28 January 2026.
    const SINCE_HAND = { Thuringia: "2024-12-12", Saarland: "2022-04-25", "Saxony-Anhalt": "2026-01-28", "Mecklenburg-Vorpommern": "2026-11-16" };
    const regions = Object.keys(VOTES).sort().map((state) => {
      const h = heads[state], wk = wikiHead.get(state); if (!h) return null;
      const agrees = wk && wk.key === nameKey(h.name);
      return { name: state, headLabel: LABEL[state] || "Minister-President", head: { title: h.title || wk?.title, name: h.name, party: h.party, since: SINCE_HAND[state] || (agrees && !NOTE[state] && CONFIRMED_SINCE.has(state) ? wk.since : ""), image: h.image, ref: h.ref, ...(NOTE[state] ? { note: NOTE[state] } : {}), ...(!NOTE[state] && UNCONFIRMED.has(state) ? { note: "Listed as head of government on bundesrat.de; start date not confirmed" } : {}) } };
    }).filter(Boolean);
    console.log("state leaders (bundesrat.de)", regions.length, "| names differing from Wikipedia:", regions.filter((r) => { const wk = wikiHead.get(r.name); return wk && wk.key !== nameKey(r.head.name); }).map((r) => r.name).join(", ") || "none");

    return { headOfState, headOfGov, ministers, chambers: { bundestag, bundesrat }, judges, regions, note: `Bundestag: official open data (Wahlperiode 21, file dated 29 April 2026) reconciled with the departures, successors and name changes on bundestag.de; cabinet from bundesregierung.de; Bundesrat delegations and state leaders from bundesrat.de; judges from bundesverfassungsgericht.de. Party and parliamentary-group counts differ; this chart counts by party (CDU ${tally.CDU}, CSU ${tally.CSU}, AfD ${tally.AfD}, SPD ${tally.SPD}, Greens ${tally.Greens}, Linke ${tally["Die Linke"]}, SSW ${tally.SSW}, independents ${tally.independents}). Bundesrat: the full members listed on bundesrat.de are shown; the deputy members (stellvertretende Mitglieder) listed there separately are not` };
  },
};
