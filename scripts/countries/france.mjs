// France. Constitutional text is hand-written from the Constitution of 4 October 1958 (English text, conseil-constitutionnel.fr) and official Senate/Assembly pages; people come from Wikipedia (see scrape).
const PARTIES = {
  RN: "National Rally", RE: "Renaissance", EPR: "Renaissance", LFI: "La France Insoumise", "LFI-NFP": "La France Insoumise", PS: "Socialist Party", SOC: "Socialist Party", LR: "The Republicans", DR: "The Republicans",
  MoDem: "MoDem", DEM: "MoDem", HOR: "Horizons", EELV: "The Ecologists", LE: "The Ecologists", ECO: "The Ecologists", PCF: "Communist Party", GDR: "Communist Party", UDR: "UDR", UDI: "UDI",
  DVG: "Miscellaneous left", DVD: "Miscellaneous right", DVC: "Miscellaneous centre", Ind: "Independent", DIV: "Other", REG: "Regionalists", PRG: "Radical Party of the Left", GRS: "Republican and Socialist Left",
  LIOT: "LIOT", PP: "Place Publique", GE: "Génération.s", "Independent politician": "Independent",
};
const norm = (s) => { s = (s || "").replace(/\[.*?\]/g, "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim(); return PARTIES[s] || s; };

export default {
  id: "france", name: "France", iso2: "FR", flag: "🇫🇷", continent: "Europe", locale: "en-GB",
  system: "Semi-presidential republic",
  description: "An interactive org chart of French politics: the President, Prime Minister, Government, National Assembly, Senate and Constitutional Council.",
  place: "The Fifth Republic",
  summary: "A semi-presidential republic. The President is directly elected and shares executive power with a Prime Minister, who leads a Government that is answerable to the National Assembly. Parliament is made up of the directly elected National Assembly and the indirectly elected Senate, and the Constitutional Council checks laws against the Constitution.",
  rootElectedBy: "France's constitution is the Constitution of the Fifth Republic, adopted in 1958. Voters directly elect both the President and the National Assembly; the Senate is elected by local officials.",
  rootReportsTo: "The voters, who elect the President and the National Assembly",
  rootFacts: [["System", "Semi-presidential republic"], ["Head of state", "The President of the Republic"], ["Parliament", "National Assembly (577) and Senate (348)"]],
  stats: [["System", "Semi-presidential"], ["Deputies", 577], ["Senators", 348]],
  nonpartisan: ["head-of-state", "justice"],
  sources: [
    "https://www.conseil-constitutionnel.fr/en/constitution-of-4-october-1958",
    "https://www.senat.fr/connaitre-le-senat/role-et-fonctionnement/mode-delection-des-senateurs.html",
    "https://www2.assemblee-nationale.fr/content/download/936583/8903314/version/1/file/Getting+to+know+the+French+National+Assembly+2024.pdf",
    "https://www.assemblee-nationale.fr/depute/election_depute.asp",
    "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip",
    "https://data.senat.fr/data/senateurs/ODSEN_GENERAL.json",
    "https://www.senat.fr/senateurs/grp.html",
    "https://fr.wikipedia.org/wiki/Gouvernement_Lecornu_II",
    "https://www.elysee.fr/emmanuel-macron/2026/02/26/nomination-du-gouvernement-7",
    "https://www.elysee.fr/emmanuel-macron/2026/11/07/pour-la-duree-de-son-conge-maternite-maud-bregeon-est-remplacee-au-porte-parolat-du-gouvernement-par-mathieu-lefevre",
  ],
  normParty: norm,
  ministersCannotSit: true,
  partyColors: {
    // Parliamentary groups (Assembly and Senate) and the party labels used for ministers
    RN: "#0D378A", EPR: "#F5B800", "LFI-NFP": "#CC2443", SOC: "#E75480", DR: "#0066CC", ECOS: "#00A86B", DEM: "#F28C00", HOR: "#2D9CDB", LIOT: "#7F7F7F", UDR: "#1B3A6B", GDR: "#C8102E", NI: "#A8B0BA",
    LR: "#0066CC", SER: "#E75480", UCI: "#F2A900", RDPI: "#F5B800", "CRCE-K": "#C8102E", RDSE: "#9B7EBD", GEST: "#00A86B", LIRT: "#5B8DB8", UNT: "#1B3A6B",
    Renaissance: "#F5B800", MoDem: "#F28C00", Horizons: "#2D9CDB", UDI: "#00A0DF", "Miscellaneous right": "#6FA8DC", "Miscellaneous left": "#E88CAB", Independent: "#6B7280",
  },
  partyInfo: {},

  headOfState: {
    label: "President of the Republic", badge: "PR", place: "Élysée Palace", icon: "flag",
    card: { where: ["Jurisdiction", "France"], chosen: "National voters", term: "5 years" },
    stats: [["Term", "5 years, max two in a row"], ["Elected by", "Direct vote of all voters"], ["Residence", "Élysée Palace, Paris"]],
    text: {
      electedBy: "Elected directly by all voters for a five-year term. A candidate needs an absolute majority of votes cast; if no one has one in the first round, the two leading candidates face each other in a second round two weeks later. No one may serve more than two consecutive terms (Articles 6 and 7 of the Constitution).",
      reportsTo: "The voters. Can be removed during their term only by Parliament sitting as a High Court, for a breach of duties patently incompatible with continuing in office (Article 68).",
      plain: "The head of state. Ensures respect for the Constitution and, by arbitration, the proper functioning of the public authorities (Article 5), chairs the Council of Ministers, appoints the Prime Minister and is commander-in-chief of the armed forces. Can dissolve the National Assembly. By convention the President leads on defence and foreign policy; the Constitution gives the Government responsibility for national policy (Article 20).",
      plainFacts: [["Term", "5 years; at most two consecutive terms"], ["Chosen by", "All voters, in a two-round election"], ["Can be removed by", "Parliament sitting as a High Court, for a breach of duties incompatible with the office"], ["Powers", "Appoints the Prime Minister, can dissolve the Assembly, chairs the Council of Ministers; the Government determines and conducts national policy (Article 20)"]],
      terms: [["Dissolution", "The President can end the National Assembly's term early and call a new election, after consulting the Prime Minister and the presidents of both houses. No new dissolution is allowed within a year of the election that follows (Article 12)."], ["Cohabitation", "When the President and the Prime Minister come from opposing political camps."]],
    },
  },
  headOfGov: {
    label: "Prime Minister", badge: "PM", place: "Hôtel de Matignon", icon: "briefcase",
    card: { where: ["Jurisdiction", "France"], chosen: "President", term: "No fixed term" },
    stats: (p) => [["Party", p.party || "—"], ["Appointed by", "The President"], ["Seat", "Hôtel de Matignon, Paris"]],
    text: {
      electedBy: "Appointed by the President of the Republic, who ends the appointment when the Prime Minister tenders the Government's resignation (Article 8). In practice the President must choose someone who will not be defeated by a majority in the National Assembly.",
      reportsTo: "Appointed by the President. The Government is responsible to Parliament (Article 20) and can be forced out by the National Assembly (Article 49).",
      plain: "The head of government. Directs the actions of the Government, is responsible for national defence and ensures laws are carried out (Article 21). The Government \"determines and conducts the policy of the Nation\" (Article 20) and answers to Parliament.",
      plainFacts: [["Term", "No fixed term"], ["Chosen by", "The President of the Republic"], ["Can be removed by", "A no-confidence vote in the National Assembly, or the President accepting their resignation"], ["Real power", "Runs the Government and its policy, in a shared arrangement with the President"]],
      terms: [["Motion of no confidence", "A vote in the National Assembly that, if passed by a majority of the members composing it (289 when all 577 seats are filled), forces the Government to resign (Article 49)."], ["Article 49.3", "For a finance or social security bill, and for one other bill per session, the Prime Minister can make the passing of the bill an issue of a vote of confidence. The bill is then deemed adopted unless a motion of no confidence is tabled within 24 hours and passed."]],
    },
  },
  cabinet: {
    label: "Government", badge: "GOV", place: "Council of Ministers", icon: "users", membersLabel: "Ministers",
    stats: (m) => [["Members listed", m.length], ["Led by", "The Prime Minister"]],
    text: {
      electedBy: "Appointed by the President of the Republic on the Prime Minister's recommendation (Article 8).",
      reportsTo: "The Prime Minister, who directs the Government's actions; the Government as a whole answers to the National Assembly.",
      plain: "The Prime Minister and the ministers, ministers delegate and the government spokesperson. The Government determines and conducts national policy and has the civil service and armed forces at its disposal. Ministers cannot also sit in Parliament or on the Constitutional Council.",
      plainFacts: [["Term", "While the Government stays in office"], ["Chosen by", "The President, on the Prime Minister's recommendation"], ["Can be removed by", "A National Assembly no-confidence vote, or the President on the Prime Minister's proposal"]],
      terms: [["Minister Delegate", "A junior minister attached to the Prime Minister or to a senior minister."], ["Council of Ministers", "The weekly meeting of the Government, chaired by the President."]],
    },
    memberPlain: {
      plain: "A member of the Government who runs a ministry or a part of one. Ministers are appointed by the President on the Prime Minister's recommendation and are answerable, as a Government, to the National Assembly.",
      facts: [["Term", "While the Government stays in office"], ["Chosen by", "The President, on the Prime Minister's recommendation"], ["Cannot also be", "A member of Parliament: government membership is incompatible with a seat (Article 23)"]],
    },
    minister: {
      badge: "MIN", card: { where: ["Portfolio"], chosen: "President, on PM's advice", term: "While Government serves" },
      electedBy: "Appointed by the President of the Republic on the Prime Minister's recommendation.", reportsTo: "The Prime Minister",
      plain: "A member of the Government who runs a ministry or a part of one.",
      plainFacts: [["Term", "While the Government stays in office"], ["Chosen by", "The President, on the Prime Minister's recommendation"]],
    },
  },
  chambers: {
    assembly: {
      label: "National Assembly", badge: "AN", place: "Directly elected lower house", seats: 577, leaderTitle: "President of the National Assembly", memberLabel: "Deputy", memberBadge: "DEP", icon: "landmark",
      card: { where: ["Constituency"], chosen: "Constituency voters", term: "5 years" },
      stats: (d) => [["Seats", 577], ["Majority mark", "289 when all 577 seats are filled"], ["President", d.leader?.name || "—"]],
      text: {
        electedBy: "577 deputies, each elected by the voters of one single-member constituency in a two-round election, for five years unless the Assembly is dissolved. In the first round a candidate needs an absolute majority (and votes from a quarter of registered voters) to win outright; otherwise a second round decides.",
        reportsTo: "The voters. The Government answers to it and can be forced out by a no-confidence vote.",
        plain: "The directly elected house of Parliament, with the final say over the Senate in most disagreements. Passes laws, approves the budget and holds the Government to account. It can force the Government to resign with a motion of no confidence passed by a majority of the members composing it.",
        plainFacts: [["Seats", "577"], ["Majority mark", "289 when all 577 seats are filled (Article 49 counts the members composing the Assembly)"], ["Term", "5 years, unless dissolved"]],
        terms: [["Two-round election", "If no candidate wins an absolute majority in round one, the candidates who reach 12.5% of registered voters may stand in round two, and the one with most votes wins."], ["Parliamentary group", "A formal group of deputies from one party or alliance. In the Assembly it needs at least 15 members."]],
      },
      memberPlain: {
        plain: "Elected by the voters of one single-member constituency to sit in the National Assembly. Deputies vote on laws and the budget, question ministers and can vote to bring down the Government.",
        facts: [["Term", "5 years, unless the Assembly is dissolved"], ["Chosen by", "Voters of one constituency, in a two-round election"], ["Cannot also be", "A minister (Article 23)"]],
        terms: [["Two-round election", "A second round is held if no candidate wins an absolute majority in the first."]],
      },
    },
    senate: {
      label: "Senate", badge: "SEN", place: "Indirectly elected upper house", seats: 348, leaderTitle: "President of the Senate", memberLabel: "Senator", memberBadge: "SEN", icon: "landmark",
      card: { where: ["Department"], chosen: "Local officials", term: "6 years" },
      stats: (d) => [["Seats", 348], ["President", d.leader?.name || "—"], ["Renewal", "Half every 3 years"]],
      text: {
        electedBy: "348 senators, elected indirectly by about 162,000 \"grands électeurs\": deputies, senators, regional and departmental councillors and delegates of municipal councils (municipal delegates are about 95% of the total). Senators serve six years and half of the Senate is renewed every three years.",
        reportsTo: "The local officials who elect it. It represents the territorial communities of the Republic (Article 24).",
        plain: "The upper house of Parliament, which represents the country's local authorities. Reviews and amends laws, can block constitutional changes and cannot be dissolved. If the two houses cannot agree, the National Assembly usually has the last word. The Government does not answer to the Senate in the same way as it does to the Assembly.",
        plainFacts: [["Seats", "348"], ["Term", "6 years; half renewed every 3 years"], ["Chosen by", "About 162,000 local officials (indirect election)"]],
        terms: [["Grands électeurs", "The local officials and parliamentarians who vote in senatorial elections."]],
      },
      memberPlain: {
        plain: "Elected by local officials (the grands électeurs) in a department or overseas territory to sit in the Senate. Senators vote on laws and the budget, question ministers and speak for local authorities.",
        facts: [["Term", "6 years; half the Senate is renewed every 3 years"], ["Chosen by", "Local officials and parliamentarians (indirect election)"], ["Cannot also be", "A minister"]],
      },
    },
  },
  judiciary: {
    label: "Constitutional Council", badge: "CC", place: "Guardian of the Constitution", icon: "scale", chiefTitle: "President of the Constitutional Council", memberTitle: "Member of the Constitutional Council", membersLabel: "Members",
    card: { where: ["Council", "Constitutional Council"], chosen: "President or house presidents", term: "9 years, once" },
    stats: (j) => [["Appointed members", j.length], ["Term", "9 years, not renewable"], ["Renewal", "One third every 3 years"]],
    text: {
      electedBy: "Nine members serve non-renewable nine-year terms, and one third is renewed every three years. Three are appointed by the President of the Republic, three by the President of the National Assembly and three by the President of the Senate. The President of the Council is chosen by the President of the Republic and has a casting vote. Former Presidents of the Republic are also ex officio life members (Article 56); this chart lists only the nine appointed members.",
      reportsTo: "The Constitution only. Independent of the Government and Parliament.",
      plain: "Checks that laws and certain government acts comply with the Constitution, and oversees national elections and referendums. Laws can be referred to it before they are promulgated, and since 2010 also in the course of a court case. Its decisions are final and bind public authorities and courts.",
      plainFacts: [["Members", "9 appointed, plus former Presidents of the Republic as ex officio life members (not listed here)"], ["Term", "9 years, not renewable"], ["Chosen by", "President of the Republic and the presidents of the two houses (three each)"]],
      terms: [["Priority question of constitutionality", "Since 2010, a party in a court case can ask for a law to be checked against the Constitution."]],
    },
    memberPlain: {
      plain: "One of the nine appointed members of France's constitutional court. Members decide together whether laws comply with the Constitution and cannot also be ministers or members of Parliament (Article 57).",
      facts: [["Term", "9 years, not renewable"], ["Chosen by", "The President of the Republic or the president of one of the two houses"], ["Cannot also be", "A minister or member of Parliament"]],
    },
    itemText: {
      electedBy: "Appointed by the President of the Republic, the President of the National Assembly or the President of the Senate (three members each).", reportsTo: "The Constitutional Council",
      plain: "A member of France's constitutional court, which checks that laws comply with the Constitution.", plainFacts: [["Term", "9 years, not renewable"], ["Chosen by", "One of the three appointing authorities"]],
    },
  },

  async scrape(w) {
    const { incumbent, partyOfPage, allTables, T, links, nameOnly, dateOf } = w;
    const { getJson, getText, getZipDir, nameKey } = await import("../official-sources.mjs");
    const cheerio = await import("cheerio");
    const fs = await import("node:fs");
    const path = await import("node:path");
    const nm = (title, text) => nameOnly(title || text || "");
    const person = async (page, party = true) => { const i = await incumbent(page); return { title: i.title, name: nm(i.title, i.name), since: i.since, ...(party ? { party: await partyOfPage(i.title, norm) } : {}) }; };

    const headOfState = await person("President of France", false);
    const headOfGov = await person("Prime Minister of France");
    console.log("president", headOfState.name, "| PM", headOfGov.name, headOfGov.party);

    // ---- National Assembly: the Assembly's own open data (sitting deputies only; suppléants sit in place of ministers) ----
    const AN = "https://data.assemblee-nationale.fr/static/openData/repository/17/amo/deputes_actifs_mandats_actifs_organes/AMO10_deputes_actifs_mandats_actifs_organes.json.zip";
    const dir = await getZipDir(AN, { key: "fr-an-amo10.zip" });
    const readJson = (sub, f) => JSON.parse(fs.readFileSync(path.join(dir, "json", sub, f), "utf8"));
    const groups = {};
    for (const f of fs.readdirSync(path.join(dir, "json", "organe"))) { const o = readJson("organe", f).organe; if (o.codeType === "GP") groups[o.uid] = { abbr: o.libelleAbrev, name: o.libelle, ended: !!o.viMoDe?.dateFin }; }
    const ord = (n) => (n === "1" ? "1st" : n === "2" ? "2nd" : n === "3" ? "3rd" : `${n}th`);
    const asArr = (x) => (Array.isArray(x) ? x : x ? [x] : []);
    const actFiles = fs.readdirSync(path.join(dir, "json", "acteur"));
    const members = [];
    for (const f of actFiles) {
      const a = readJson("acteur", f).acteur, id = a.uid["#text"], ms = asArr(a.mandats?.mandat);
      const asm = ms.find((m) => m.typeOrgane === "ASSEMBLEE" && !m.dateFin);
      const gp = ms.filter((m) => m.typeOrgane === "GP" && !m.dateFin && groups[m.organes?.organeRef] && !groups[m.organes.organeRef].ended).sort((x, y) => (y.dateDebut || "").localeCompare(x.dateDebut || ""))[0];
      if (!asm) continue;
      const lieu = asm.election?.lieu || {};
      members.push({
        ref: `fr-an-${id}`, name: `${a.etatCivil.ident.prenom} ${a.etatCivil.ident.nom}`.replace(/\s+/g, " ").trim(),
        seat: `${ord(lieu.numCirco)} constituency`, group: lieu.departement, party: gp ? groups[gp.organes.organeRef].abbr : "NI",
        image: `https://www2.assemblee-nationale.fr/static/tribun/17/photos/${id.replace(/^PA/, "")}.jpg`, since: (asm.dateDebut || "").slice(0, 10),
      });
    }
    members.sort((x, y) => x.group.localeCompare(y.group) || x.seat.localeCompare(y.seat, undefined, { numeric: true }));
    const byGroup = members.reduce((acc, m) => ((acc[m.party] = (acc[m.party] || 0) + 1), acc), {});
    console.log("deputies (official open data)", members.length, "of", actFiles.length, "active files | groups", JSON.stringify(byGroup));

    // President of the Assembly: the name comes from Wikipedia's list of presidents, matched to the official record
    let leader = null;
    try {
      const { $: lp, tables: lt } = await allTables("List of presidents of the National Assembly of France", 5);
      const rows = lt.flatMap((t) => t.g.slice(1)).filter((r) => /incumbent|present/i.test(r.map((c) => T(lp, c)).join(" ")));
      const last = rows[rows.length - 1]; const L = last && last.flatMap((c) => links(lp, c)).find((l) => !/^(List|President|National Assembly|French|Union|Renaissance|Socialist)/i.test(l.title));
      if (L) { const mm = members.find((m) => nameKey(m.name) === nameKey(nm(L.title, L.text))); leader = mm ? { ...mm, title: L.title } : { title: L.title, name: nm(L.title, L.text), party: "" }; }
    } catch (e) { console.log("  assembly president lookup failed", e.message); }
    console.log("assembly president", leader?.name, leader?.party);
    const assembly = { members, official: { count: actFiles.length, source: AN }, leader, others: [] };
    // Three seats are empty in the official file; the Senate's own list shows their former deputies as sitting senators.
    const VACANT = [["Aube", "2nd", "Bazin-Malgras"], ["Charente-Maritime", "5th", "Plassard"], ["Gironde", "11th", "Diaz"]];
    const senatorsNow = (await getJson("https://data.senat.fr/data/senateurs/ODSEN_GENERAL.json", { key: "fr-senat-general.json" })).results.filter((r) => r.Etat === "ACTIF");
    const vacantNote = VACANT.filter(([dep, ord]) => !members.some((m) => m.group === dep && m.seat === `${ord} constituency`)).map(([dep, ord, who]) => `${dep} ${ord}${senatorsNow.some((r) => r.Nom_usuel === who) ? ` (its former deputy ${who} now sits as a senator)` : ""}`);

    // ---- Senate: senat.fr open data (active senators) ----
    const SEN = "https://data.senat.fr/data/senateurs/ODSEN_GENERAL.json";
    const sen = (await getJson(SEN, { key: "fr-senat-general.json" })).results.filter((r) => r.Etat === "ACTIF");
    const GROUP_CODE = { "Les Républicains": "LR", "Les Indépendants": "LIRT" };
    const senators = sen.map((r) => ({ ref: `fr-senat-${r.Matricule}`, name: `${r.Prenom_usuel} ${r.Nom_usuel}`.replace(/\s+/g, " ").trim(), seat: r.Circonscription, group: r.Circonscription, party: GROUP_CODE[r.Groupe_politique] || r.Groupe_politique || "NI", since: "" }));
    const sBy = senators.reduce((acc, m) => ((acc[m.party] = (acc[m.party] || 0) + 1), acc), {});
    const presRow = sen.find((r) => /^Président du Sénat$/i.test((r.Fonction_au_Bureau_du_Senat || "").trim()));
    const lar = presRow && senators.find((m) => m.ref === `fr-senat-${presRow.Matricule}`);
    console.log("senators (senat.fr)", senators.length, JSON.stringify(sBy), "| president", lar?.name);
    const senate = { members: senators, official: { count: senators.length, source: SEN }, leader: lar, others: [] };

    // ---- Government: the official government sites could not be read (403/redirect), so this is French Wikipedia's current composition (updated for changes since October 2025) ----
    const fr = await getJson("https://fr.wikipedia.org/w/api.php?action=parse&page=Gouvernement_Lecornu_II&prop=text&format=json&redirects=1", { key: "fr-wiki-lecornu-ii.json" });
    const $ = cheerio.load(fr.parse.text["*"]);
    const NUANCE = { RE: "Renaissance", SE: "Independent", MoDem: "MoDem", HOR: "Horizons", UDI: "UDI", DVD: "Miscellaneous right", CONV: "Miscellaneous left" };
    const nuance = (raw) => { const t = raw.replace(/\[.*?\]/g, "").split(/puis/).pop().replace(/[\s,;.]+$/g, "").trim(); if (/diss/.test(t)) return "Miscellaneous right"; return NUANCE[t.split(/[\/ ]/)[0]] || t; };
    // English titles from the English page (by name); a few new members are mapped by hand from the French titles
    const { $: en, tables: et } = await allTables("Lecornu governments", 5);
    const enRows = new Map();
    for (const t of et) { const h = en(t.t).prevAll(".mw-heading").first().find("h2,h3,h4").first().text(); if (!/second lecornu/i.test(h)) continue; for (const r of t.g.slice(1)) { const nmIdx = t.h[1] === "attached minister" ? 2 : 1; const L = links(en, r[nmIdx])[0]; if (L) enRows.set(nameKey(nm(L.title, L.text)), { title: L.title, office: T(en, r[0]).replace(/\s+/g, " ") }); } }
    const MANUAL = {
      "camille galliard minier": "Minister Delegate for Autonomy and Persons with Disabilities", "arnaud viala": "Minister Delegate for Rural Affairs",
      "sabrina agresti roubache": "Minister Delegate for Education and Vocational Training", "jean didier berger": "Minister Delegate (portfolio not confirmed)",
      "catherine pegard": "Minister of Culture", "maud bregeon": "Government Spokesperson and Minister Delegate for Energy",
    };
    const ministers = [];
    $("table.wikitable.sortable").each((_, tb) => {
      const head = $(tb).find("tr").first().children("th,td").map((__, c) => $(c).text().trim()).get();
      const isMin = head[0] === "Portrait" && head[1] === "Fonction" && head[2] === "Nom", isDel = head[0] === "Portrait" && head.includes("Ministre de tutelle");
      if (!isMin && !isDel) return;
      $(tb).find("tr").slice(1).each((__, tr) => {
        const cells = $(tr).children("td,th").toArray(); if (cells.length < 4) return;
        const fonction = $(cells[1]).text().replace(/\s+/g, " ").trim(), tutelle = isDel ? $(cells[2]).text().replace(/\s+/g, " ").trim() : "";
        const nameCell = cells[cells.length - 2], partyCell = cells[cells.length - 1];
        const a = $(nameCell).find("a").first();
        const name = nameOnly(a.attr("title") || $(nameCell).text().trim()).replace(/\s+/g, " ");
        const key = nameKey(name), e = enRows.get(key);
        if (key === nameKey(headOfGov.name) || /^(Prime Minister|Premier ministre)$/i.test(fonction)) return; // the Prime Minister is the head-of-gov card, not a minister card
        const office = MANUAL[key] || e?.office || fonction;
        ministers.push({ name, title: e?.title, office, role: office, dept: isDel && tutelle ? tutelle : "", party: nuance($(partyCell).text().trim()), since: "", ...(key === "maud bregeon" ? { note: "On leave; Mathieu Lefèvre is interim government spokesperson (reported)" } : {}), ...(key === "mathieu lefevre" ? { note: "Interim government spokesperson (reported)" } : {}) });
      });
    });
    console.log("government (French Wikipedia, current composition)", ministers.length, "| titles still in French:", ministers.filter((m) => /^(Ministre|Garde|Porte)/.test(m.office)).map((m) => m.name).join(", ") || "none");
    // Official roster: the decree published on elysee.fr on 26 February 2026, plus the Élysée announcement of 7 November 2026. English titles are translations of the decree's titles.
    const DECREE = "https://www.elysee.fr/emmanuel-macron/2026/02/26/nomination-du-gouvernement-7";
    const NOV7 = "https://www.elysee.fr/emmanuel-macron/2026/11/07/pour-la-duree-de-son-conge-maternite-maud-bregeon-est-remplacee-au-porte-parolat-du-gouvernement-par-mathieu-lefevre";
    const flat = (u, key) => cheerio.load(u)("body").text().replace(/\s+/g, " ");
    const decreeText = flat(await getText(DECREE, { key: "fr-elysee-decree-2026-02-26.html" }));
    const nov7Text = flat(await getText(NOV7, { key: "fr-elysee-2026-11-07.html" }));
    const GOV = [
      ["Laurent Nuñez", "Minister of the Interior"], ["Catherine Vautrin", "Minister of the Armed Forces and Veterans"], ["Jean-Pierre Farandou", "Minister of Labour and Solidarity"],
      ["Monique Barbut", "Minister of Ecological Transition, Biodiversity and International Negotiations on Climate and Nature"], ["Gérald Darmanin", "Keeper of the Seals, Minister of Justice"],
      ["Roland Lescure", "Minister of the Economy, Finance and Industrial, Energy and Digital Sovereignty"], ["Serge Papin", "Minister of Small and Medium-sized Enterprises, Trade, Crafts, Tourism and Purchasing Power"],
      ["Annie Genevard", "Minister of Agriculture, Agri-food and Food Sovereignty"], ["Édouard Geffray", "Minister of National Education"], ["Jean-Noël Barrot", "Minister for Europe and Foreign Affairs"],
      ["Stéphanie Rist", "Minister of Health, Families, Autonomy and Persons with Disabilities"], ["Catherine Pégard", "Minister of Culture"], ["Naïma Moutchou", "Minister of Overseas Territories"],
      ["Françoise Gatel", "Minister of Regional Planning and Decentralisation"], ["David Amiel", "Minister for Public Action and Accounts"], ["Philippe Baptiste", "Minister of Higher Education, Research and Space"],
      ["Marina Ferrari", "Minister of Sports, Youth and Community Life"], ["Philippe Tabarot", "Minister of Transport"], ["Vincent Jeanbrun", "Minister of the City and Housing"],
      ["Laurent Panifous", "Minister Delegate to the Prime Minister, for Relations with Parliament"], ["Maud Bregeon", "Government Spokesperson; Minister Delegate to the Minister of the Economy, for Energy"],
      ["Aurore Bergé", "Minister Delegate to the Prime Minister, for Equality between Women and Men and the Fight against Discrimination"], ["Jean-Didier Berger", "Minister Delegate to the Minister of the Interior"],
      ["Marie-Pierre Vedrenne", "Minister Delegate to the Minister of the Interior, for Citizenship"], ["Alice Rufo", "Minister Delegate to the Minister of the Armed Forces and Veterans"],
      ["Sabrina Roubache", "Minister Delegate to the Ministers of Labour and Solidarity and of National Education, for Vocational Education, Training and Apprenticeships"],
      ["Catherine Chabaud", "Minister Delegate to the Minister of Ecological Transition, for the Sea and Fisheries"], ["Mathieu Lefèvre", "Minister Delegate to the Minister of Ecological Transition, for Ecological Transition"],
      ["Sébastien Martin", "Minister Delegate to the Minister of the Economy, for Industry"], ["Anne Le Hénanff", "Minister Delegate to the Minister of the Economy, for Artificial Intelligence and Digital Affairs"],
      ["Benjamin Haddad", "Minister Delegate to the Minister for Europe and Foreign Affairs, for Europe"], ["Nicolas Forissier", "Minister Delegate to the Minister for Europe and Foreign Affairs, for Foreign Trade and Attractiveness"],
      ["Éléonore Caroit", "Minister Delegate to the Minister for Europe and Foreign Affairs, for Francophonie, International Partnerships and French Nationals Abroad"],
      ["Camille Galliard-Minier", "Minister Delegate to the Minister of Health, for Autonomy and Persons with Disabilities"], ["Michel Fournier", "Minister Delegate to the Minister of Regional Planning and Decentralisation, for Rural Affairs"],
    ];
    const frBy = new Map(ministers.map((m) => [nameKey(m.name), m]));
    const dKey = nameKey(decreeText);
    const notInDecree = GOV.filter(([n]) => !dKey.includes(nameKey(n))).map(([n]) => n);
    if (notInDecree.length) throw new Error("not found in the Élysée decree: " + notInDecree.join(", "));
    // 7 November 2026: Viala replaces Fournier; Lefèvre is acting spokesperson; Lescure exercises the Energy attributions during Bregeon's leave
    const n7 = nameKey(nov7Text);
    if (!(n7.includes("arnaud viala") && n7.includes("ruralit") && n7.includes("mathieu lefevre") && n7.includes("roland lescure"))) throw new Error("the 7 November announcement no longer says what this loader expects");
    const roster = GOV.map(([name, office]) => (name === "Michel Fournier" ? ["Arnaud Viala", "Minister Delegate to the Minister of Regional Planning and Decentralisation, for Rural Affairs", "2026-11-07"] : [name, office, ""]));
    const NOTES = {
      "maud bregeon": "On maternity leave from 7 November 2026: Mathieu Lefèvre is acting government spokesperson and Roland Lescure exercises the Energy attributions (Élysée, 7 November 2026)",
      "mathieu lefevre": "Acting government spokesperson from 7 November 2026, during Maud Bregeon's leave (Élysée)",
      "roland lescure": "Also exercises the Energy attributions from 7 November 2026, during Maud Bregeon's leave (Élysée)",
    };
    ministers.length = 0;
    for (const [name, office, since] of roster) {
      const e = frBy.get(nameKey(name)) || frBy.get(nameKey(name.replace("Roubache", "Agresti-Roubache")));
      ministers.push({ name, title: e?.title, office, role: office, dept: "", party: e?.party || "", since, ...(NOTES[nameKey(name)] ? { note: NOTES[nameKey(name)] } : {}) });
    }
    console.log("government (Élysée decree of 26 Feb 2026 + 7 Nov 2026 announcement)", ministers.length, "| parties from French Wikipedia; without one:", ministers.filter((m) => !m.party).map((m) => m.name).join(", ") || "none");

    // ---- Constitutional Council: the nine appointed members ----
    const { $: cc, tables: ct } = await allTables("Constitutional Council (France)", 5);
    const ctbl = ct.find((t) => t.h[0] === "member" && t.g.length >= 10 && t.g.length < 14);
    const judges = ctbl.g.slice(2).map((r) => {
      const L = links(cc, r[0])[0], txt = T(cc, r[0]);
      return { title: L?.title, name: nm(L?.title, txt.replace(/\s*\(.*$/, "")), chief: /\(President\)/.test(txt), since: dateOf(T(cc, r[4])) };
    }).filter((j) => j.name);
    console.log("council", judges.length);

    // party info for the groups actually used (official group names; no descriptive claims beyond what the data states)
    const used = new Set([...members, ...senators].map((m) => m.party));
    const infos = {};
    for (const g of Object.values(groups)) if (used.has(g.abbr) && !g.ended) infos[g.abbr] = [g.name, `Parliamentary group in the National Assembly (${byGroup[g.abbr] || 0} members).`];
    const SENAT_NAMES = { LR: "Les Républicains", UCI: "Union Centriste et Indépendants", SER: "Socialiste, Écologiste et Républicain", "CRCE-K": "Communiste Républicain Citoyen et Écologiste – Kanaky", RDSE: "Rassemblement Démocratique et Social Européen", RDPI: "Rassemblement des démocrates, progressistes et indépendants", GEST: "Écologiste – Solidarité et Territoires", LIRT: "Les Indépendants – République et Territoires", UNT: "Union Nationale pour les Territoires", NI: "Sénateurs ne figurant sur la liste d'aucun groupe" };
    const SENAT_TOTALS = { LR: 124, UCI: 63, SER: 62, "CRCE-K": 18, RDSE: 18, RDPI: 16, GEST: 15, LIRT: 14, UNT: 15, NI: 3 }; // senat.fr/senateurs/grp.html, 21 November 2026
    const sMismatch = Object.keys(SENAT_TOTALS).filter((k) => (sBy[k] || 0) !== SENAT_TOTALS[k]);
    console.log("senate group totals vs senat.fr group page:", sMismatch.length ? "MISMATCH " + sMismatch.join(", ") : "all match");
    for (const [abbr, n] of Object.entries(sBy)) if (!infos[abbr]) infos[abbr] = [SENAT_NAMES[abbr] || abbr, `Political group in the Senate (${n} senators).`];
    this.partyInfo = infos;

    return { headOfState, headOfGov, ministers, chambers: { assembly, senate }, judges, note: `Parliamentary groups are shown as the party. The Assembly list is the official open-data file of sitting deputies (${members.length} sitting, ${577 - members.length} vacant: ${vacantNote.join("; ")}; their suppléants are not yet in the open data) and the Senate list is senat.fr's. The Government is the roster in the Élysée decree of 26 February 2026 with the changes the Élysée announced on 7 November 2026; party labels come from French Wikipedia` };
  },
};
