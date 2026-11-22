// Canada. Constitutional text is hand-written and checked against the sources listed; people come from Wikipedia (see scrape).
const PARTIES = {
  "New Democratic": "NDP", "New Democratic Party": "NDP", "Liberal Party of Canada": "Liberal", "Conservative Party of Canada": "Conservative", "Independent politician": "Independent", "Green Party": "Green",
  "None (consensus government)": "Non-partisan", "United Conservative Party": "United Conservative", "Progressive Conservative": "Progressive Conservative",
  ISG: "Independent Senators Group", CSG: "Canadian Senators Group", PSG: "Progressive Senate Group", CPC: "Conservative", NA: "Non-affiliated", GRO: "Government Representative's Office",
  "Independent or non-affiliated": "Non-affiliated",
};
const norm = (s) => { s = (s || "").replace(/\[.*?\]/g, "").replace(/[‡†*█]/g, "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim(); return PARTIES[s] || s; };
const PROVINCES = { AB: "Alberta", BC: "British Columbia", MB: "Manitoba", NB: "New Brunswick", NL: "Newfoundland and Labrador", NT: "Northwest Territories", NS: "Nova Scotia", NU: "Nunavut", ON: "Ontario", PE: "Prince Edward Island", QC: "Quebec", SK: "Saskatchewan", YT: "Yukon" };
const CAPITALS = { Alberta: "Edmonton", "British Columbia": "Victoria", Manitoba: "Winnipeg", "New Brunswick": "Fredericton", "Newfoundland and Labrador": "St. John's", "Northwest Territories": "Yellowknife", "Nova Scotia": "Halifax", Nunavut: "Iqaluit", Ontario: "Toronto", "Prince Edward Island": "Charlottetown", Quebec: "Quebec City", Saskatchewan: "Regina", Yukon: "Whitehorse" };
const CODES = Object.fromEntries(Object.entries(PROVINCES).map(([c, n]) => [n, c]));
const FPTP = ["First-past-the-post", "The candidate with the most votes in a riding wins, even without a majority of all votes."];

export default {
  id: "canada", name: "Canada", iso2: "CA", flag: "🇨🇦", continent: "Americas", locale: "en-CA",
  system: "Federal parliamentary constitutional monarchy",
  description: "An interactive org chart of Canadian politics: the Monarch, Governor General, Prime Minister, Cabinet, House of Commons, Senate, Supreme Court and the premiers of every province and territory.",
  place: "Federal government and 13 provinces and territories",
  summary: "A federal parliamentary constitutional monarchy. The King is head of state and the Governor General represents him; the Prime Minister leads a government that must keep the confidence of the elected House of Commons. Parliament (House of Commons and Senate) makes federal laws, and the ten provinces and three territories run their own governments.",
  rootElectedBy: "Canada's constitution is made up of the Constitution Acts of 1867 and 1982, other laws and unwritten conventions. Voters elect the House of Commons, and the government is formed from the party that can win its confidence.",
  rootReportsTo: "The voters, through the House of Commons",
  rootFacts: [["System", "Federal parliamentary constitutional monarchy"], ["Head of state", "The King, represented by the Governor General"], ["Provinces and territories", "10 provinces and 3 territories"]],
  stats: [["Provinces and territories", 13], ["Commons seats", 343], ["Senate seats", 105]],
  nonpartisan: ["head-of-state", "head-of-state-rep", "justice"],
  sources: [
    "https://www.canada.ca/en/canadian-heritage/services/crown-canada/governor-general.html",
    "https://www.gg.ca/en/governor-general/role-and-responsibilities/constitutional-duties",
    "https://learn.parl.ca/understanding-comprendre/en/people-in-parliament/monarch-and-governor-general/",
    "https://lop.parl.ca/sites/PublicWebsite/default/en_CA/ResearchPublications/202509E",
    "https://www.elections.ca/content.aspx?section=vot&dir=bkg&document=polsys&lang=e",
    "https://www.canada.ca/en/democratic-institutions/services/senate-appointment-process.html",
    "https://www.canada.ca/en/campaign/independent-advisory-board-for-senate-appointments/about-the-senate.html",
    "https://laws-lois.justice.gc.ca/eng/acts/s-26/page-1.html",
    "https://www.scc-csc.ca/visit-visitez/history-histoire/",
    "https://www.ourcommons.ca/Members/en/search/csv",
    "https://www.ourcommons.ca/members/en/party-standings",
    "https://www.pm.gc.ca/en/cabinet",
    "https://sencanada.ca/umbraco/surface/SenatorsAjax/GetSenators?displayFor=senatorslist&Lang=en",
    "https://www.scc-csc.ca/about-apropos/judges-juges/list-liste/",
    "https://www.pm.gc.ca/en/news/news-releases/2023/05/12/prime-minister-welcomes-appointment-46th-speaker-senate",
    "https://globalnews.ca/news/12159369/",
    "https://www.assembly.nu.ca/sites/default/files/Consensus%20Government%20in%20Nunavut%20-%20English.pdf",
  ],
  normParty: norm,
  partyColors: {
    Liberal: "#D71920", Conservative: "#1A4782", "Bloc Québécois": "#33B2CC", NDP: "#F37021", Green: "#3D9B35", Independent: "#6B7280", "Non-affiliated": "#A8B0BA", "Non-partisan": "#A8B0BA",
    "Parti Québécois": "#1E5BA8", "Saskatchewan Party": "#00A650", "Progressive Conservative": "#1F4E8C", "United Conservative": "#2B6CB0",
  },
  partyInfo: {
    Liberal: ["Liberal Party of Canada", "Centrist to centre-left party, one of the two parties that have led most federal governments."],
    Conservative: ["Conservative Party of Canada", "Centre-right party formed in 2003 by the merger of the Canadian Alliance and the Progressive Conservative Party."],
    "Bloc Québécois": ["Bloc Québécois", "Federal party founded in 1991 that defends Quebec's interests and supports sovereignty. It runs candidates only in Quebec."],
    NDP: ["New Democratic Party", "Centre-left party founded in 1961, with roots in the labour movement and the Co-operative Commonwealth Federation."],
    Green: ["Green Party of Canada", "Founded in 1983; focuses on environmental policy."],
    Independent: ["Independent", "Not a member of a political party."],
    "Independent Senators Group": ["Independent Senators Group", "A group of senators who sit independently of any party."],
    "Canadian Senators Group": ["Canadian Senators Group", "A group of senators who sit independently of any party."],
    "Progressive Senate Group": ["Progressive Senate Group", "A group of senators who sit independently of any party."],
    "Non-affiliated": ["Non-affiliated", "Not a member of a party or recognised Senate group."],
  },

  headOfState: {
    label: "Monarch", badge: "KING", place: "The Crown of Canada", icon: "crown",
    card: { where: ["Jurisdiction", "Canada"], chosen: "Heredity", term: "For life" },
    stats: [["Term", "For life"], ["Style", "His Majesty"], ["Represented by", "Governor General"]],
    text: {
      electedBy: "Hereditary. The King of Canada is whoever holds the British throne, and the succession follows the same rules as in the UK, which Canada adopted in the Succession to the Throne Act, 2013.",
      reportsTo: "Head of state. Acts on the advice of Canadian ministers, mainly through the Governor General.",
      plain: "Canada's head of state. The monarch is shared with the UK and other realms, but the Crown of Canada is legally separate. In practice the King does not govern: the Governor General carries out nearly all royal duties in Canada, and the powers of the Crown are used on the advice of the Prime Minister and Cabinet.",
      plainFacts: [["Term", "For life"], ["Chosen by", "Birth (hereditary)"], ["Can be removed by", "Cannot be removed; can only abdicate"], ["Real power", "Mostly ceremonial; exercised through the Governor General"]],
      terms: [["The Crown", "The legal idea of the state's authority in a monarchy. In Canada it covers the monarch, the Governor General and the government acting in the monarch's name."]],
    },
  },
  extraOfficesSpec: {
    "governor-general": {
      label: "Governor General", badge: "GG", place: "Rideau Hall", icon: "flag",
      card: { where: ["Jurisdiction", "Canada"], chosen: "Monarch, on PM's advice", term: "About 5 years" },
      stats: [["Term", "No fixed term; about five years is usual"], ["Residence", "Rideau Hall, Ottawa"]],
      text: {
        electedBy: "Appointed by the monarch on the Prime Minister's advice. The Constitution sets no fixed term; about five years is usual.",
        reportsTo: "The monarch, whom they represent. Acts on the advice of the Prime Minister and Cabinet.",
        plain: "The monarch's representative in Canada, who carries out most royal duties: giving Royal Assent to laws, summoning and dissolving Parliament, reading the Speech from the Throne and appointing the Prime Minister (the person who can command the confidence of the House of Commons). Nearly all of these powers are used on the advice of ministers. The Prime Minister is shown under the Governor General because the Governor General formally appoints the Prime Minister; in practice the Governor General acts on the Prime Minister's advice.",
        plainFacts: [["Term", "No fixed term; about five years is usual"], ["Chosen by", "The monarch, on the Prime Minister's advice"], ["Real power", "Mostly ceremonial, with reserve powers for a crisis"]],
        terms: [["Royal Assent", "The formal approval that turns a bill passed by both houses into law."], ["Reserve powers", "Rarely used powers that the Governor General can exercise without ministers' advice, such as deciding who should be Prime Minister when no party has a majority."]],
      },
    },
  },
  headOfGov: {
    label: "Prime Minister", badge: "PM", place: "Office of the Prime Minister", icon: "briefcase", parent: "governor-general",
    card: { where: ["Jurisdiction", "Canada"], chosen: "Governor General, on Commons support", term: "Up to 5 years" },
    stats: (p) => [["Party", p.party || "—"], ["Residence", "24 Sussex Drive (official)"]].slice(0, 1).concat([["Appointed by", "Governor General"]]),
    text: {
      electedBy: "Appointed by the Governor General as the person most likely to command the confidence of the House of Commons, usually the leader of the party with the most seats. Voters do not elect the Prime Minister directly; they elect the MPs.",
      reportsTo: "The Governor General, who appoints them, and the House of Commons, which can end the government by withdrawing its confidence.",
      plain: "The head of government. Leads the Cabinet, chooses its members and runs the federal government day to day. Stays in office only while commanding the confidence of the House of Commons. This card sits under the Governor General because the Governor General formally appoints the Prime Minister; in practice the Governor General acts on the Prime Minister's advice.",
      plainFacts: [["Term", "No fixed term; at most five years between general elections"], ["Chosen by", "The Governor General, on the basis of Commons support"], ["Can be removed by", "A Commons vote of no confidence, an election defeat, or their own resignation"], ["Real power", "The most executive power in the country"]],
      terms: [["Confidence vote", "A Commons vote on whether the government still has majority support. Losing one normally means resigning or an election."], ["Majority government", "One whose party holds more than half of the 343 seats (172 or more)."]],
    },
  },
  cabinet: {
    label: "Cabinet", badge: "CAB", place: "Government of Canada", icon: "users", membersLabel: "Ministers",
    stats: (m) => [["Ministers", m.length]],
    text: {
      electedBy: "Chosen by the Prime Minister and formally appointed by the Governor General. Ministers are almost always MPs, with a few senators.",
      reportsTo: "Prime Minister; collectively responsible to the House of Commons.",
      plain: "The ministers who run federal departments and make the government's main decisions, chaired by the Prime Minister. Many ministers hold more than one portfolio. Secretaries of State, who assist ministers in specific areas, belong to the wider ministry and are not listed here.",
      plainFacts: [["Term", "At the Prime Minister's pleasure"], ["Chosen by", "The Prime Minister"], ["Can be removed by", "The Prime Minister, or the whole government by a loss of Commons confidence"]],
      terms: [["Portfolio", "The department or area of government a minister is in charge of."], ["Collective responsibility", "Ministers must publicly support government decisions or resign."]],
    },
    memberPlain: {
      plain: "A federal minister who heads a department or takes responsibility for an area such as finance, health or defence. Ministers answer to Parliament for their portfolios and are collectively responsible for government decisions.",
      facts: [["Term", "At the Prime Minister's pleasure"], ["Chosen by", "The Prime Minister"], ["Must be", "In practice, an MP or a senator"]],
    },
    minister: {
      badge: "MIN", card: { where: ["Government", "Canada"], chosen: "Prime Minister", term: "At PM's pleasure" },
      electedBy: "Chosen by the Prime Minister and formally appointed by the Governor General.", reportsTo: "Prime Minister",
      plain: "A federal minister who heads a department or takes responsibility for an area of government, and answers to Parliament for it.",
      plainFacts: [["Term", "At the Prime Minister's pleasure"], ["Chosen by", "The Prime Minister"]],
    },
  },
  chambers: {
    commons: {
      label: "House of Commons", badge: "COM", place: "Elected lower house", seats: 343, leaderTitle: "Speaker", memberLabel: "Member of Parliament", memberBadge: "MP", icon: "landmark",
      card: { where: ["Riding"], chosen: "Riding voters", term: "Up to 5 years" },
      stats: (d) => [["Seats", 343], ["Majority mark", 172], ["Speaker", d.leader?.name || "—"]],
      text: {
        electedBy: "343 members, each elected by the voters of one riding (electoral district) under first-past-the-post. The Constitution sets a maximum of five years between general elections, and the Prime Minister can ask the Governor General to dissolve Parliament earlier.",
        reportsTo: "The voters. The government stays in power only while it keeps the confidence of this house.",
        plain: "The elected house of Parliament and the seat of political power. Passes laws together with the Senate, controls taxes and spending (money bills must start here) and can bring down the government by withdrawing its confidence. The party with the most seats usually forms the government, and 172 seats make a majority.",
        plainFacts: [["Seats", "343"], ["Majority mark", "172"], ["Term", "At most 5 years"]],
        terms: [FPTP, ["Riding", "Another word for an electoral district: the area whose voters elect one MP."], ["Speaker", "The MP elected by the House to chair debates and keep order."]],
      },
      memberPlain: {
        plain: "Elected by the voters of one riding to sit in the House of Commons. MPs debate and vote on bills, question ministers and help people in their riding. Most belong to a party, and the party with the most MPs usually forms the government.",
        facts: [["Term", "Up to 5 years"], ["Chosen by", "Voters of one riding"], ["Can lose the seat by", "Losing an election, resigning, or disqualification"]],
        terms: [FPTP],
      },
    },
    senate: {
      label: "Senate", badge: "SEN", place: "Appointed upper house", seats: 105, leaderTitle: "Speaker of the Senate", memberLabel: "Senator", memberBadge: "SEN", icon: "landmark",
      card: { where: ["Province or territory"], chosen: "Appointment", term: "Until age 75" },
      stats: (d) => [["Seats", 105], ["Sitting", d.expected ?? d.members?.length ?? "—"], ["Speaker", d.leader?.name || "—"]],
      text: {
        electedBy: "105 senators, appointed by the Governor General on the Prime Minister's advice, after non-binding recommendations from an Independent Advisory Board for Senate Appointments. Seats are divided by region: 24 each for Ontario, Quebec, the Maritimes and the West, 6 for Newfoundland and Labrador, and 1 for each territory. Senators serve until age 75.",
        reportsTo: "Parliament. It reviews and amends bills from the elected House of Commons.",
        plain: "The appointed upper house. It reviews, amends and can delay bills passed by the Commons, and can start most bills itself. Bills must pass both houses to become law, and money bills must start in the Commons. Senators do not face election.",
        plainFacts: [["Seats", "105"], ["Term", "Until age 75"], ["Chosen by", "Appointment on the Prime Minister's advice"]],
        terms: [["Independent Advisory Board", "A body that recommends candidates for Senate appointments. The Prime Minister is not bound by its advice."], ["Senate group", "Many senators sit in a group, such as the Independent Senators Group, instead of a party."]],
      },
      memberPlain: {
        plain: "Appointed to represent a province or territory in the Senate. Senators study and amend bills and examine national issues in committees. They serve until age 75 and do not face election.",
        facts: [["Term", "Until age 75"], ["Chosen by", "Governor General, on the Prime Minister's advice"], ["Must be", "At least 30, a resident of the province they represent"]],
      },
    },
  },
  judiciary: {
    label: "Supreme Court", badge: "SCC", place: "Final court of appeal", icon: "scale", chiefTitle: "Chief Justice of Canada", memberTitle: "Justice of the Supreme Court", membersLabel: "Justices",
    card: { where: ["Court", "Supreme Court of Canada"], chosen: "Cabinet, on PM's advice", term: "Until age 75" },
    stats: (j) => [["Justices", j.length], ["From Quebec (by law)", 3], ["Retirement age", 75]],
    text: {
      electedBy: "Appointed by the Governor in Council (the Cabinet) on the Prime Minister's recommendation. By law three of the nine judges come from Quebec, and by convention three come from Ontario, two from the West and North and one from the Atlantic provinces. Judges must retire at 75.",
      reportsTo: "The law only. Independent of the government and Parliament.",
      plain: "Canada's highest court and final court of appeal in all areas of law. It hears appeals on important legal questions, including constitutional ones, and its rulings bind every other court in Canada. It can strike down laws that conflict with the Constitution, including the Charter of Rights and Freedoms.",
      plainFacts: [["Justices", "9 (the Chief Justice and eight others)"], ["Retirement age", "75"], ["Chosen by", "The Cabinet, on the Prime Minister's recommendation"]],
      terms: [["Charter of Rights and Freedoms", "Part of the Constitution that guarantees individual rights such as freedom of expression and equality."]],
    },
    memberPlain: {
      plain: "A judge of Canada's highest court. Justices hear the most important appeals, usually in panels of five, seven or nine, and decide by majority.",
      facts: [["Term", "Until age 75"], ["Chosen by", "The Cabinet, on the Prime Minister's recommendation"], ["Can be removed by", "The Governor General, on a joint address of the Senate and House of Commons"]],
    },
    itemText: {
      electedBy: "Appointed by the Governor in Council (the Cabinet) on the Prime Minister's recommendation.", reportsTo: "The Supreme Court of Canada",
      plain: "A judge of Canada's highest court, which decides the most important legal appeals.", plainFacts: [["Term", "Until age 75"], ["Chosen by", "The Cabinet, on the Prime Minister's recommendation"]],
    },
  },
  regions: {
    label: "Provinces and territories", place: "Premiers", icon: "map", headLabel: "Premier",
    card: { where: ["Province or territory"], chosen: "Legislature and voters", term: "Up to 5 years" },
    stats: (r) => [["Provinces", 10], ["Territories", 3], ["Premiers listed", r.length]],
    text: {
      electedBy: "Canada has ten provinces and three territories. Each has its own elected legislature and a government led by a Premier.",
      reportsTo: "The provincial or territorial legislature and its voters; provinces have their own constitutional powers.",
      plain: "Provinces run their own governments with powers set out in the Constitution, including health care, education and natural resources. Territories exercise powers that Parliament has delegated to them. Each is led by a Premier.",
      plainFacts: [["Provinces", "10"], ["Territories", "3"]],
      terms: [["Province", "A region with its own constitutional powers that the federal Parliament cannot take away on its own."], ["Territory", "A northern region whose powers are delegated by Parliament."]],
    },
    memberPlain: {
      plain: "The head of a provincial or territorial government. Usually the leader of the party with the most seats in the legislature, formally appointed by the Lieutenant Governor (the Commissioner in a territory). The Northwest Territories and Nunavut have no parties, so their elected members choose the Premier.",
      facts: [["Term", "No fixed term; at most five years between elections"], ["Chosen by", "Usually the party with the most seats; elected members in NWT and Nunavut"], ["Can be removed by", "Losing the legislature's confidence, or resigning"]],
      terms: [["Consensus government", "A system without political parties, used in the Northwest Territories and Nunavut. Elected members choose the Premier and Cabinet from among themselves."]],
    },
    headText: {
      electedBy: "Usually the leader of the party with the most seats in the legislature, formally appointed by the Lieutenant Governor (the Commissioner in a territory). In the Northwest Territories and Nunavut, which have no political parties, the elected members choose the Premier.",
      reportsTo: "The provincial or territorial legislature, which can end the government by withdrawing its confidence.",
      plain: "The head of a provincial or territorial government. Runs the government of the province or territory, leads its Cabinet and speaks for it in dealings with the federal government and other provinces.",
      plainFacts: [["Term", "No fixed term; at most five years between elections"], ["Chosen by", "The legislature's majority (or its elected members, in NWT and Nunavut)"], ["Can be removed by", "Losing the legislature's confidence, or resigning"]],
    },
  },

  async scrape(w) {
    const { incumbent, partyOfPage, allTables, T, Tsep, links, nameOnly, dateOf, pageHtml, grid } = w;
    const { getText, parseCsv, nameKey } = await import("../official-sources.mjs");
    const cheerio = await import("cheerio");
    const nm = (title, text) => nameOnly(title || text || "");
    const person = async (page, party = true) => { const i = await incumbent(page); return { title: i.title, name: nm(i.title, i.name), since: i.since, ...(party ? { party: await partyOfPage(i.title, norm) } : {}) }; };

    const headOfState = await person("Monarchy of Canada", false);
    const gg = await person("Governor General of Canada", false);
    const headOfGov = await person("Prime Minister of Canada");
    console.log("monarch", headOfState.name, "| GG", gg.name, "| PM", headOfGov.name, headOfGov.party);

    // ---- House of Commons: the official member list (ourcommons.ca CSV), reconciled with the official party standings page ----
    const csv = parseCsv(await getText("https://www.ourcommons.ca/Members/en/search/csv", { key: "ca-commons-members.csv" }));
    const sitting = csv.filter((r) => !r["End Date"]);
    const standings = await getText("https://www.ourcommons.ca/members/en/party-standings", { key: "ca-party-standings.html" });
    const st = cheerio.load(standings)("body").text().replace(/\s+/g, " ");
    // The page's "per party" totals, in page order: Liberal, Conservative, Bloc Québécois, NDP, Green, Vacant.
    const partyTotals = [...st.matchAll(/(\d+) Members? In total for this party/gi)].map((m) => +m[1]);
    if (partyTotals.length !== 6) throw new Error("ourcommons.ca party-standings layout changed: expected 6 party totals, found " + partyTotals.length);
    const officialByParty = { Liberal: partyTotals[0], Conservative: partyTotals[1], "Bloc Québécois": partyTotals[2], NDP: partyTotals[3], Green: partyTotals[4] };
    const officialSitting = partyTotals.slice(0, 5).reduce((a, b) => a + b, 0), officialVacant = partyTotals[5];
    console.log("commons official CSV", sitting.length, "| standings page: sitting", officialSitting, "vacant", officialVacant);

    // Wikipedia is used only to find each member's article (for a photo and link); it never decides who sits where.
    const { $: hc, tables: ht } = await allTables("List of House members of the 45th Parliament of Canada", 3);
    const wikiTitle = new Map();
    for (const t of ht) {
      if (!(t.h[1] === "name" && t.h[2] === "party" && /electoral district/.test(t.h[3]))) continue;
      for (const r of t.g.slice(1)) { const L = links(hc, r[1])[0]; if (L) wikiTitle.set(nameKey(nm(L.title, L.text)), L.title); }
    }
    const members = sitting.map((r) => {
      const name = `${r["First Name"]} ${r["Last Name"]}`.replace(/\s+/g, " ").trim();
      return { ref: `ca-ourcommons-${r["Person ID"]}`, name, seat: r["Constituency"], group: r["Province / Territory"], party: norm(r["Political Affiliation"]), since: (r["Start Date"] || "").slice(0, 10), title: wikiTitle.get(nameKey(name)) };
    });
    const byParty = members.reduce((a, m) => ((a[m.party] = (a[m.party] || 0) + 1), a), {});
    const partyMismatch = Object.keys(officialByParty).filter((k) => (byParty[k] || 0) !== officialByParty[k]);
    console.log("commons parties", JSON.stringify(byParty), "| matches the standings page:", partyMismatch.length ? "NO: " + partyMismatch.join(", ") : "yes", "| no Wikipedia article found for", members.filter((m) => !m.title).length);
    // exact match first, then first + last name only (pm.gc.ca sometimes adds middle names, e.g. "Julie Aviva Dabrusin")
    const firstLast = (n) => { const t = nameKey(n).split(" ").filter(Boolean); return t.length > 2 ? `${t[0]} ${t[t.length - 1]}` : t.join(" "); };
    const find = (nameText) => members.find((m) => nameKey(m.name) === nameKey(nameText)) || members.find((m) => firstLast(m.name) === firstLast(nameText));
    const spk = await person("Speaker of the House of Commons (Canada)", false);
    const loo = await person("Leader of the Opposition (Canada)");
    const commons = {
      members, official: { count: officialSitting, source: "https://www.ourcommons.ca/members/en/party-standings (member list: https://www.ourcommons.ca/Members/en/search/csv)" },
      leader: { ...(find(spk.name) || spk), title: spk.title, name: spk.name, party: find(spk.name)?.party || "", since: "", note: "Speaker per Wikipedia; the role and start date could not be confirmed on ourcommons.ca" },
      others: [{ ...(find(loo.name) || loo), name: loo.name, party: find(loo.name)?.party || "Conservative", role: "Leader of the Opposition" }],
    };

    // ---- Cabinet: pm.gc.ca (official), full portfolio titles ----
    const cab = cheerio.load(await getText("https://www.pm.gc.ca/en/cabinet", { key: "ca-pm-cabinet.html" }));
    const ministers = [];
    cab("li.minister-row").each((_, li) => {
      const name = cab(li).find(".name").text().replace(/\s+/g, " ").replace(/^The (Right )?Hon(ourable|\.)\s+/i, "").trim();
      const role = cab(li).find(".role").text().replace(/\s+/g, " ").trim();
      const src = cab(li).find("img").attr("src");
      if (!name || /^Prime Minister of Canada$/i.test(role)) return;
      const m = find(name.replace(/\b[A-Z]\.\s*/g, ""));
      ministers.push({ name: m?.name || name, office: role, role, dept: "", party: m?.party || "", title: m?.title || wikiTitle.get(nameKey(name)), since: "", ref: m?.ref, image: src ? "https://www.pm.gc.ca" + src.split("?")[0] : undefined });
    });
    console.log("ministers (pm.gc.ca)", ministers.length, "| without a Commons match:", ministers.filter((m) => !m.party).map((m) => m.name).join(", ") || "none");

    // ---- Senate: sencanada.ca's own data endpoints (list of senators + party standings with the vacancy breakdown) ----
    const SEN = "https://sencanada.ca/umbraco/surface/SenatorsAjax/GetSenators";
    const sList = cheerio.load(await getText(`${SEN}?displayFor=senatorslist&Lang=en`, { key: "ca-senate-list.html" }));
    const sStand = cheerio.load(await getText(`${SEN}?displayFor=senatorsstandings&Lang=en`, { key: "ca-senate-standings.html" }));
    const standRows = sStand("tr").toArray().map((tr) => sStand(tr).children("td").toArray().map((td) => sStand(td).text().replace(/\s+/g, " ").trim())).filter((r) => r.length);
    const rowsOf = sList("tr").toArray().map((tr) => sList(tr).children("td").toArray()).filter((c) => c.length >= 4);
    const vacantRow = standRows.find((r) => /^Vacant/i.test(r[0]));
    const vacantTotal = +vacantRow[1], vacantWhere = vacantRow[2];
    const SHORT = { "British Columbia": "BC", Manitoba: "MB", "Newfoundland and Labrador": "NL", "Nova Scotia": "NS", Ontario: "ON", Quebec: "QC", Saskatchewan: "SK", Alberta: "AB", "New Brunswick": "NB", "Prince Edward Island": "PE", Yukon: "YT", "Northwest Territories": "NT", Nunavut: "NU" };
    const vacantShort = vacantWhere.replace(/([A-Za-zé ]+?) \((\d+)\)/g, (m, n, c) => `${SHORT[n.trim()] || n.trim()} ${c}`).replace(/^[,\s]+/, "").replace(/,\s*/g, ", ");
    const AFF = { ISG: "Independent Senators Group", PSG: "Progressive Senate Group", CSG: "Canadian Senators Group", C: "Conservative", CPC: "Conservative", "Non-affiliated": "Non-affiliated", GRO: "Government Representative's Office" };
    const wikiSen = new Map();
    const { $: sn, tables: st2 } = await allTables("List of current senators of Canada", 3);
    for (const r of st2.find((t) => t.h[0] === "name" && t.g.length > 60).g.slice(1)) { const L = links(sn, r[1])[0]; if (L) wikiSen.set(nameKey(nm(L.title, L.text).replace(/\b[A-Z]\.\s*/g, "")), L.title); }
    const senators = rowsOf.map((c) => {
      const a = sList(c[0]).find("a").first(), [last, first] = a.text().replace(/\s+/g, " ").trim().split(/,\s*/);
      const aff = sList(c[1]).text().replace(/\s+/g, " ").trim(), prov = sList(c[2]).attr("data-order") || sList(c[2]).text().trim();
      const name = `${first} ${last}`.trim(), slug = (a.attr("href") || "").split("/").filter(Boolean).pop();
      return { ref: `ca-senate-${slug}`, name, seat: prov, group: prov, party: AFF[aff] || aff, since: (sList(c[3]).attr("data-order") || sList(c[3]).text()).slice(0, 10), title: wikiSen.get(nameKey(name.replace(/\b[A-Z]\.\s*/g, ""))) };
    });
    const officialSenSitting = standRows.filter((r) => !/^(Vacant|TOTAL)/i.test(r[0])).reduce((a, r) => a + (+r[1] || 0), 0);
    console.log("senate (sencanada.ca)", senators.length, "| standings sitting", officialSenSitting, "| vacant", vacantTotal, `(${vacantShort})`, "| parties", JSON.stringify(senators.reduce((a, m) => ((a[m.party] = (a[m.party] || 0) + 1), a), {})));
    const ss = await person("Speaker of the Senate of Canada", false);
    const ssMember = senators.find((m) => nameKey(m.name) === nameKey(ss.name));
    ss.party = ssMember?.party || ""; ss.ref = ssMember?.ref;
    ss.since = "2023-05-12"; // the Prime Minister's news release of 12 May 2023: https://www.pm.gc.ca/en/news/news-releases/2023/05/12/prime-minister-welcomes-appointment-46th-speaker-senate
    const senate = { members: senators, official: { count: officialSenSitting, source: "https://sencanada.ca/umbraco/surface/SenatorsAjax/GetSenators?displayFor=senatorsstandings&Lang=en" }, leader: ss, others: [] };
    const senateNote = `Senate checked against sencanada.ca: ${senators.length} sitting, ${vacantTotal} vacant (${vacantShort})`;

    // ---- Supreme Court ----
    const { $: sc, tables: sct } = await allTables("Supreme Court of Canada", 8);
    const jt = sct.find((t) => t.h.includes("nominated by"));
    const cj = await incumbent("Chief Justice of Canada");
    const sccText = cheerio.load(await getText("https://www.scc-csc.ca/about-apropos/judges-juges/list-liste/", { key: "ca-scc-judges.html" }))("body").text().replace(/\s+/g, " ");
    const sccCurrent = sccText.slice(0, sccText.indexOf("Former judges") > 0 ? sccText.indexOf("Former judges") : undefined);
    const sccDate = new Map([...sccCurrent.matchAll(/The (?:Right )?Honourable ([^0-9]+?)(?:, P\.C\.,?)?\s*(?:Chief Justice of Canada)?\s*(\d{4}-\d{2}-\d{2})/g)].map((m) => [nameKey(m[1].replace(/\b[A-Z]\.\s*/g, "")), m[2]]));
    const judges = jt.g.slice(2).map((r) => {
      const L = links(sc, r[1])[0]; if (!L) return null;
      const name = nm(L.title, L.text), official = sccDate.get(nameKey(name));
      return { title: L.title, name, chief: L.title === cj.title, since: L.title === cj.title ? cj.since : official || "", ...(L.title === cj.title && official ? { note: `Appointed to the Court ${official}; Chief Justice since ${cj.since}` } : {}) };
    }).filter(Boolean);
    console.log("justices' appointment dates from scc-csc.ca:", judges.filter((j) => j.since).length, "of", judges.length, "| Joyal:", judges.find((j) => /Joyal/.test(j.name))?.since);
    console.log("justices", judges.length);

    // ---- Premiers ----
    const { $: pr, tables: pt } = await allTables("Premier (Canada)", 8);
    const regions = pt[0].g.slice(2).map((r) => {
      const L = links(pr, r[1])[0], name = nameOnly(T(pr, r[2])); if (!L || !PROVINCES[CODES[name]]) return null;
      const rawParty = T(pr, r[5]);
      const party = /consensus|^none\b/i.test(rawParty) || !rawParty ? "Non-partisan" : norm(rawParty); // NWT and Nunavut use consensus government
      const head = { title: L.title, name: nm(L.title, L.text), party, since: "" };
      if (name === "British Columbia") head.since = "2026-11-20"; // Global News, 20 Nov 2026: "Lorne Doerkson becomes B.C.'s 38th premier" https://globalnews.ca/news/12159369/
      return { name, code: CODES[name], capital: CAPITALS[name], head };
    }).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
    console.log("premiers", regions.length, "| consensus-government premiers:", regions.filter((r) => r.head.party === "Non-partisan").map((r) => r.name).join(", "));
    return {
      headOfState, extraOffices: [{ id: "governor-general", role: "head-of-state-rep", who: gg, spec: this.extraOfficesSpec["governor-general"] }], headOfGov, ministers,
      chambers: { commons, senate }, judges, regions,
      note: `House of Commons: the official member list from ourcommons.ca, matching its party standings. ${senateNote}`,
    };
  },
};
