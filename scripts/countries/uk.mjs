// United Kingdom. Constitutional text is hand-written and checked against the sources listed; people come from Wikipedia (see scrape).
const PARTIES = {
  "Labour Co-op": "Labour", "Scottish National": "SNP", "Reform": "Reform UK", "Green (E&W)": "Green", "Ind. Alliance": "Independent Alliance",
  "Independent politician": "Independent", "Restore": "Restore Britain", "Conservative and Unionist": "Conservative", "Non‑affiliated": "Non-affiliated",
  "Liberal Democrat": "Liberal Democrats", Bishops: "Lords Spiritual", "Green Party": "Green", "Social Democratic & Labour Party": "SDLP", "Lord Speaker": "Speaker", "Scottish National Party": "SNP", "Democratic Unionist": "DUP", "Democratic Unionist Party": "DUP", "Social Democratic and Labour": "SDLP", "Social Democratic and Labour Party": "SDLP", "Traditional Unionist Voice": "TUV", "Ulster Unionist": "UUP", "Ulster Unionist Party": "UUP", "Alliance Party of Northern Ireland": "Alliance", "Lord Spiritual": "Lords Spiritual", "Plaid": "Plaid Cymru", "Alliance Party": "Alliance",
};
const norm = (s) => { s = (s || "").replace(/\[.*?\]/g, "").replace(/\s*\(.*?\)\s*$/, (m) => (/E&W/.test(m) ? m : "")).trim(); return PARTIES[s] || PARTIES[s.replace(/\s*\(.*$/, "")] || s; };
const FPTP = ["First-past-the-post", "The candidate with the most votes in a constituency wins, even without a majority of all votes."];

export default {
  id: "uk", name: "United Kingdom", iso2: "GB", flag: "🇬🇧", continent: "Europe", locale: "en-GB",
  system: "Parliamentary constitutional monarchy",
  description: "An interactive org chart of UK politics: the Monarch, Prime Minister, Cabinet, House of Commons, House of Lords and Supreme Court.",
  place: "Government and Parliament of the UK",
  summary: "A parliamentary constitutional monarchy. The monarch is head of state but acts on ministers' advice; the Prime Minister leads the government, which must keep the confidence of the elected House of Commons. Parliament (Commons and Lords) makes laws, and the Supreme Court is the final court of appeal.",
  rootElectedBy: "The UK has no single written constitution. It is set out in Acts of Parliament, court decisions and conventions. Voters elect the House of Commons, and the government is formed from the party or coalition that can win the Commons' confidence.",
  rootReportsTo: "The voters, through the House of Commons",
  rootFacts: [["System", "Parliamentary constitutional monarchy"], ["Head of state", "The Monarch"], ["Parliament", "House of Commons (650) and House of Lords"]],
  stats: [["System", "Constitutional monarchy"], ["Commons seats", 650], ["Majority mark", 326]],
  nonpartisan: ["head-of-state", "justice"],
  sources: [
    "https://www.parliament.uk/about/how/elections-and-voting/voting-systems/",
    "https://commonslibrary.parliament.uk/research-briefings/cbp-10879/",
    "https://www.gov.uk/elections-in-the-uk/general-election",
    "https://supremecourt.uk/news/new-appointments-to-the-uk-supreme-court-and-jcpc",
    "https://researchbriefings.files.parliament.uk/documents/CBP-9536/CBP-9536.pdf",
    "https://www.legislation.gov.uk/ukpga/2026/12/",
    "https://lordslibrary.parliament.uk/",
    "https://members-api.parliament.uk/",
    "https://www.gov.uk/government/ministers",
    "https://commonslibrary.parliament.uk/research-briefings/cbp-10635/",
    "https://supremecourt.uk/news/lord-reed-announces-retirement",
    "https://www.supremecourt.uk/news/lord-briggs-appointed-next-president-of-the-supreme-court",
  ],
  normParty: norm,
  partyColors: {
    Labour: "#E4003B", Conservative: "#0087DC", "Liberal Democrats": "#FAA61A", SNP: "#D9A600", "Reform UK": "#12B6CF", Green: "#02A95B", "Plaid Cymru": "#005B54",
    DUP: "#D46A4C", "Sinn Féin": "#326760", SDLP: "#2AA82C", Alliance: "#C9A800", UUP: "#48A5EE", TUV: "#0C3A6A", Independent: "#6B7280", Speaker: "#64748B",
    Crossbench: "#8B95A1", "Non-affiliated": "#A8B0BA", "Lords Spiritual": "#6D28D9",
  },
  partyInfo: {
    Labour: ["Labour Party", "Centre-left party founded in 1900 with roots in the trade union movement."],
    Conservative: ["Conservative and Unionist Party", "Centre-right party whose modern form dates from the 1830s. Its members are often called Tories."],
    "Liberal Democrats": ["Liberal Democrats", "Centrist, liberal party formed in 1988 by the merger of the Liberal Party and the Social Democratic Party."],
    SNP: ["Scottish National Party", "Founded in 1934. Campaigns for Scottish independence."],
    "Reform UK": ["Reform UK", "Right-wing party founded in 2018 as the Brexit Party and renamed Reform UK in 2021."],
    Green: ["Green Party of England and Wales", "Environmentalist party, separate from the Scottish Greens since 1990."],
    "Plaid Cymru": ["Plaid Cymru", "Welsh nationalist party founded in 1925."],
    DUP: ["Democratic Unionist Party", "Northern Ireland unionist party founded in 1971."],
    "Sinn Féin": ["Sinn Féin", "Irish republican party. Its MPs do not take their seats in the House of Commons."],
    SDLP: ["Social Democratic and Labour Party", "Northern Ireland nationalist party founded in 1970."],
    Alliance: ["Alliance Party of Northern Ireland", "Northern Ireland party founded in 1970 that does not identify as unionist or nationalist."],
    UUP: ["Ulster Unionist Party", "Northern Ireland unionist party founded in 1905."],
    TUV: ["Traditional Unionist Voice", "Northern Ireland unionist party founded in 2007."],
    Independent: ["Independent", "Not a member of any political party."],
    Speaker: ["Speaker", "The Speaker gives up party ties while in the chair."],
    "Non-affiliated": ["Non-affiliated", "Members of the House of Lords who belong neither to a political party nor to the Crossbench group (House of Commons Library briefing CBP-10635)."],
    Crossbench: ["Crossbench", "Peers who belong to no party and sit independently in the House of Lords."],
    "Lords Spiritual": ["Lords Spiritual", "Church of England bishops who sit in the House of Lords because of their office."],
  },

  headOfState: {
    label: "Monarch", badge: "KING", place: "The Crown", icon: "crown",
    card: { where: ["Jurisdiction", "United Kingdom"], chosen: "Heredity", term: "For life" },
    stats: [["Term", "For life"], ["Residence", "Buckingham Palace, London"], ["Style", "His Majesty"]],
    text: {
      electedBy: "Hereditary. The crown passes by birth, mainly to the sovereign's eldest child, under rules in the Act of Settlement 1701 and the Succession to the Crown Act 2013.",
      reportsTo: "Head of state. Acts on the advice of ministers rather than answering to voters.",
      plain: "The head of state. By long-standing convention the monarch takes no political decisions: the powers of the Crown are used on the advice of ministers. The monarch appoints the Prime Minister (the person who can command the confidence of the House of Commons), gives Royal Assent to bills and formally opens each session of Parliament.",
      plainFacts: [["Term", "For life"], ["Chosen by", "Birth (hereditary)"], ["Can be removed by", "Cannot be removed; can only abdicate, which needs an Act of Parliament"], ["Real power", "Mostly ceremonial; ministers use the Crown's powers"]],
      terms: [["Royal Assent", "The monarch's formal approval that turns a bill passed by Parliament into law."], ["Royal prerogative", "Powers of the Crown that ministers exercise in the monarch's name, such as making treaties."]],
    },
  },
  headOfGov: {
    label: "Prime Minister", badge: "PM", place: "10 Downing Street", icon: "briefcase",
    card: { where: ["Jurisdiction", "United Kingdom"], chosen: "Monarch, on Commons support", term: "No fixed term" },
    stats: (p) => [["Party", p.party || "—"], ["Residence", "10 Downing Street, London"], ["Also", "First Lord of the Treasury"]],
    text: {
      electedBy: "Appointed by the monarch as the person most likely to command the confidence of the House of Commons, in practice the leader of the largest party or of a coalition. By convention the Prime Minister sits in the Commons. Voters do not elect the Prime Minister directly.",
      reportsTo: "The monarch, who appoints them, and the House of Commons, which can remove the government with a vote of no confidence.",
      plain: "The head of government. Leads the Cabinet, chooses (and can dismiss) the other ministers and runs the government day to day. Stays in office only while commanding the confidence of the House of Commons.",
      plainFacts: [["Term", "No fixed term; a general election is due within five years of Parliament first meeting"], ["Chosen by", "The monarch, on the basis of Commons support"], ["Can be removed by", "A Commons vote of no confidence, an election defeat, or their own resignation"], ["Real power", "The most executive power in the country"]],
      terms: [["Confidence vote", "A Commons vote on whether the government still has majority support. Losing one normally means resigning or an election."], ["Majority mark", "326 of the 650 seats: the number a party needs to win every vote on its own."]],
    },
  },
  cabinet: {
    label: "Cabinet", badge: "CAB", place: "His Majesty's Government", icon: "users", membersLabel: "Ministers",
    stats: (m) => [["Ministers listed", m.length]],
    text: {
      electedBy: "Appointed by the monarch on the Prime Minister's advice. Almost all ministers are members of the House of Commons or the House of Lords.",
      reportsTo: "Prime Minister; collectively responsible to Parliament.",
      plain: "The senior ministers who run the government departments (such as the Treasury and the Home Office) and meet to take the government's main decisions. Some junior ministers are invited to attend Cabinet meetings without being full members.",
      plainFacts: [["Term", "At the Prime Minister's pleasure"], ["Chosen by", "The Prime Minister"], ["Can be removed by", "The Prime Minister, or the whole government by a loss of Commons confidence"]],
      terms: [["Collective responsibility", "Ministers must publicly support government decisions or resign."], ["Secretary of State", "The title of most senior ministers who head a department."]],
    },
    memberPlain: {
      plain: "A minister in the government. Cabinet ministers head a department or hold a senior role; ministers who \"attend Cabinet\" sit in on its meetings without being full members.",
      facts: [["Term", "At the Prime Minister's pleasure"], ["Chosen by", "The Prime Minister"], ["Must be", "A member of the Commons or the Lords (in practice)"]],
    },
    minister: {
      badge: "MIN", card: { where: ["Department"], chosen: "Prime Minister", term: "At PM's pleasure" },
      electedBy: "Appointed by the monarch on the Prime Minister's advice.", reportsTo: "Prime Minister",
      plain: "A minister who heads a government department or holds a senior government role, and answers to Parliament for it.",
      plainFacts: [["Term", "At the Prime Minister's pleasure"], ["Chosen by", "The Prime Minister"]],
    },
  },
  chambers: {
    commons: {
      label: "House of Commons", badge: "COM", place: "Elected lower house", seats: 650, leaderTitle: "Speaker", memberLabel: "Member of Parliament", memberBadge: "MP", icon: "landmark",
      card: { where: ["Constituency"], chosen: "Constituency voters", term: "Up to 5 years" },
      stats: (d) => [["Seats", 650], ["Majority mark", 326], ["Speaker", d.leader?.name || "—"]],
      text: {
        electedBy: "650 members, each elected by the voters of one constituency under first-past-the-post. A general election must be held within five years of Parliament first meeting, and the Prime Minister can ask the monarch to call one earlier.",
        reportsTo: "The voters. The government stays in power only while it keeps the confidence of this house.",
        plain: "The elected chamber of Parliament and the seat of political power. Passes laws together with the House of Lords, approves taxes and spending, questions ministers and can bring down a government with a vote of no confidence. The Commons has the final say if the two houses disagree.",
        plainFacts: [["Seats", "650"], ["Majority mark", "326"], ["Term", "Up to 5 years"]],
        terms: [FPTP, ["Constituency", "The area whose voters elect one MP."], ["Speaker", "The MP who chairs debates and keeps order. Gives up party ties while in the chair."]],
      },
      memberPlain: {
        plain: "Elected by the voters of one constituency to sit in the House of Commons. MPs debate and vote on laws, question ministers and represent local people. The party or coalition that holds most seats forms the government.",
        facts: [["Term", "Up to 5 years"], ["Chosen by", "Voters of one constituency"], ["Can lose the seat by", "Losing an election, resigning, or disqualification such as a prison sentence of more than a year"]],
        terms: [FPTP],
      },
    },
    lords: {
      label: "House of Lords", badge: "LDS", place: "Appointed upper house", seats: 800, noFixedSize: true, leaderTitle: "Lord Speaker", memberLabel: "Member of the House of Lords", memberBadge: "LORD", icon: "landmark",
      card: { where: ["Seat"], chosen: "Appointment", term: "For life" },
      stats: (d) => [["Sitting members", d.members?.length ?? "—"], ["Lord Speaker", d.leader?.name || "—"], ["Bishops (up to 26)", d.members?.filter((m) => m.party === "Lords Spiritual").length ?? "—"]],
      text: {
        electedBy: "Not elected. The Lords Temporal are life peers appointed by the monarch on the Prime Minister's advice, plus up to 26 Church of England bishops who sit by right of office. Hereditary peers lost their right to sit in April 2026.",
        reportsTo: "Parliament. It revises the Commons' bills but cannot override the elected house.",
        plain: "The unelected second chamber of Parliament. It examines and amends bills passed by the Commons and can delay most of them for about a year, but the Commons has the final say. Members are appointed rather than elected.",
        plainFacts: [["Sitting members", "Listed from the Parliament Members API; excludes peers on leave of absence"], ["Chosen by", "Appointment"], ["Hereditary peers", "None since April 2026"]],
        terms: [["Life peer", "A member appointed for life who cannot pass the title on to their children."], ["Lords Spiritual", "Church of England bishops with seats in the Lords because of their position."], ["Crossbencher", "A peer who belongs to no party."]],
      },
      memberPlain: {
        plain: "A member of the House of Lords: a life peer or a Church of England bishop. Lords debate and amend bills, question the government and serve on committees. They are not elected and do not represent a constituency.",
        facts: [["Term", "For life (bishops until they retire as bishops)"], ["Chosen by", "Appointment by the monarch on advice"], ["Can lose the seat by", "Retiring, or expulsion for serious misconduct or crime"]],
      },
    },
  },
  judiciary: {
    label: "Supreme Court", badge: "UKSC", place: "Final court of appeal", icon: "scale", chiefTitle: "President of the Supreme Court", memberTitle: "Justice of the Supreme Court", membersLabel: "Justices",
    card: { where: ["Court", "Supreme Court"], chosen: "Monarch, on advice", term: "Until age 75" },
    stats: (j) => [["Justices", j.length], ["Maximum", 12], ["Retirement age", 75]],
    text: {
      electedBy: "An independent selection commission picks one candidate for each vacancy. The Lord Chancellor can accept or reject the choice, and the Prime Minister then recommends the appointment to the monarch. Justices serve until the mandatory retirement age of 75.",
      reportsTo: "The law only. Independent of the government and Parliament.",
      plain: "The final court of appeal for civil cases across the UK and for criminal cases from England, Wales and Northern Ireland. It decides legal questions of general public importance and rules on disputes about the powers of the devolved governments. It cannot strike down Acts of Parliament.",
      plainFacts: [["Justices", "Up to 12"], ["Retirement age", "75"], ["Chosen by", "Selection commission, then monarch on advice"]],
      terms: [["Devolution", "The transfer of some powers to the Scottish, Welsh and Northern Ireland governments."]],
    },
    memberPlain: {
      plain: "A senior judge on the UK's highest court. Justices hear the most important appeals, usually in panels of five or more, and decide by majority.",
      facts: [["Term", "Until age 75"], ["Chosen by", "Selection commission, then monarch on advice"], ["Can be removed by", "Both Houses of Parliament, on the grounds of misconduct"]],
    },
    itemText: {
      electedBy: "Appointed by the monarch on the Prime Minister's recommendation, after an independent selection commission chooses a candidate.", reportsTo: "The Supreme Court of the United Kingdom",
      plain: "A judge of the highest court in the UK, which decides the most important legal appeals.", plainFacts: [["Term", "Until age 75"], ["Chosen by", "Selection commission, then monarch on advice"]],
    },
  },

  async scrape(w) {
    const { incumbent, partyOfPage, allTables, memberTable, T, links, nameOnly, dateOf, grid, pageHtml } = w;
    const nm = (title, text) => nameOnly(title || text || "");

    const mon = await incumbent("Monarchy of the United Kingdom");
    const headOfState = { title: mon.title, name: nm(mon.title, mon.name), since: mon.since };
    const pmI = await incumbent("Prime Minister of the United Kingdom");
    const headOfGov = { title: pmI.title, name: nm(pmI.title, pmI.name), since: pmI.since, party: await partyOfPage(pmI.title, norm) };
    console.log("monarch", headOfState.name, "| PM", headOfGov.name, headOfGov.party);

    // Commons and Lords: the official UK Parliament Members API (https://members-api.parliament.uk), checked against its own StateOfTheParties totals.
    const { getJson } = await import("../official-sources.mjs");
    const API = "https://members-api.parliament.uk/api";
    const fetchHouse = async (house) => {
      const out = [];
      for (let skip = 0; skip < 1200; skip += 20) {
        const d = await getJson(`${API}/Members/Search?House=${house}&IsCurrentMember=true&skip=${skip}&take=20`, { key: `uk-${house === 1 ? "commons" : "lords"}-${skip}` });
        out.push(...d.items.map((i) => i.value));
        if (d.items.length < 20) break;
      }
      return out;
    };
    const today = new Date().toISOString().slice(0, 10);
    const stateTotal = async (house) => (await getJson(`${API}/Parties/StateOfTheParties/${house}/${today}`, { key: `uk-state-${house}-${today}` })).items.reduce((a, i) => a + i.value.total, 0);
    const strip = (n) => n.replace(/^(Rt Hon |Mr |Mrs |Ms |Miss |Mx |Dr |Sir |Dame |Prof )+/i, "").trim();
    const HEREDITARY_TITLE = /^(The )?(Earl|Duke|Marquess|Viscount|Baron) /;
    const toMember = (v, seat) => {
      const start = (v.latestHouseMembership.membershipStartDate || "").slice(0, 10);
      // Members API: hereditary-title holders listed as life peers from June 2026 (hereditary seats ended on 29 April 2026, House of Lords (Hereditary Peers) Act 2026)
      const heredity = v.latestHouseMembership.house === 2 && HEREDITARY_TITLE.test(v.nameDisplayAs) && v.latestHouseMembership.membershipFrom === "Life peer" && start >= "2026-05-01";
      return {
        ref: `uk-members-${v.id}`, name: strip(v.nameDisplayAs), party: norm(v.latestParty?.name), seat, image: v.thumbnailUrl,
        since: start.slice(0, 4), wiki: null, title: null,
        ...(heredity ? { note: `Holds a hereditary title; listed as a life peer since ${start} (hereditary seats in the Lords ended on 29 April 2026)` } : {}),
      };
    };
    const commonsApi = await fetchHouse(1);
    const members = commonsApi.map((v) => toMember(v, v.latestHouseMembership.membershipFrom));
    const commonsTotal = await stateTotal(1);
    console.log("commons (official API)", members.length, "| official state of parties", commonsTotal);
    const spkV = commonsApi.find((v) => v.latestParty?.name === "Speaker");
    const opp = await getJson(`${API}/Posts/OppositionPosts`, { key: "uk-opp-posts" });
    const looHolder = opp.find((p) => /Leader of HM Official Opposition/i.test(p.value.name))?.value.postHolders.find((h) => !h.endDate)?.member.value;
    const looMember = looHolder && members.find((m) => m.ref === `uk-members-${looHolder.id}`);
    console.log("speaker", spkV?.nameDisplayAs, "| leader of the opposition", looMember?.name);
    const commons = {
      members, official: { count: commonsTotal, source: `${API}/Parties/StateOfTheParties/1/${today}` },
      leader: { ...members.find((m) => m.ref === `uk-members-${spkV.id}`), party: "Speaker" },
      others: looMember ? [{ ...looMember, role: "Leader of the Opposition" }] : [],
    };

    // Lords: members with status "Current Member" (excludes peers on leave of absence, disqualified or suspended). Bishops come from the same API.
    const lordsApi = await fetchHouse(2);
    const statusOf = (v) => v.latestHouseMembership.membershipStatus.statusDescription;
    const sitting = lordsApi.filter((v) => statusOf(v) === "Current Member");
    const away = lordsApi.filter((v) => statusOf(v) !== "Current Member");
    const lordsMembers = sitting.map((v) => toMember(v, v.latestParty?.name === "Bishops" ? "Lord Spiritual" : "Life peer"));
    const lordsTotal = await stateTotal(2);
    console.log("lords (official API) sitting", lordsMembers.length, "| official state of parties", lordsTotal, "| not sitting:", away.length);
    const lsV = sitting.find((v) => v.latestParty?.name === "Lord Speaker");
    const lords = {
      members: lordsMembers, official: { count: lordsTotal, source: `${API}/Parties/StateOfTheParties/2/${today}` },
      leader: { ...lordsMembers.find((m) => m.ref === `uk-members-${lsV.id}`), party: "Speaker" }, others: [],
    };
    const statusCount = (d) => away.filter((v) => statusOf(v) === d).length;
    this.chambers.lords.text.plainFacts = [["Sitting members", `${lordsMembers.length} with status "Current Member" in the Parliament Members API; excludes ${away.length} peers on leave of absence (${statusCount("Leave of Absence")}), disqualified (${statusCount("Disqualified")}) or suspended (${statusCount("Suspended")})`], ["Chosen by", "Appointment"], ["Hereditary peers", "None since April 2026"]];
    const notSittingNote = `The Lords list shows the ${lordsMembers.length} members with status "Current Member" in the Parliament Members API; ${away.length} others are on leave of absence, disqualified or suspended and are not shown`;

    // Cabinet: gov.uk/government/ministers is the roster and the source of exact titles; photos and parties come from the Parliament API.
    const { getText, nameKey } = await import("../official-sources.mjs");
    const cheerio = await import("cheerio");
    const gov = cheerio.load(await getText("https://www.gov.uk/government/ministers", { key: "uk-govuk-ministers.html" }));
    const apiByKey = new Map([...members, ...lordsMembers].map((m) => [nameKey(m.name), m]));
    const rolesBy = new Map(), order = [];
    for (const section of ["cabinet", "also-attends-cabinet"]) {
      gov(`ul#${section} .gem-c-image-card`).each((_, card) => {
        const name = gov(card).find(".gem-c-image-card__title-link").first().text().replace(/\s+/g, " ").replace(/\s+MP$/, "").trim();
        const role = gov(card).find(".gem-c-image-card__description").first().text().replace(/\s+/g, " ").trim();
        if (!name || !role) return;
        const k = nameKey(name); if (!rolesBy.has(k)) { rolesBy.set(k, { name, roles: [] }); order.push(k); }
        if (!rolesBy.get(k).roles.includes(role)) rolesBy.get(k).roles.push(role);
      });
    }
    const pmKey = nameKey(headOfGov.name);
    const ministers = order.filter((k) => k !== pmKey).map((k) => {
      const e = rolesBy.get(k), plain = e.name.replace(/,.*$/, "").replace(/\b(DBE|KC|CBE|OBE|KBE|CB|MP|Dame|Sir)\b/g, "").replace(/\s+/g, " ").trim();
      const m = apiByKey.get(k) || apiByKey.get(nameKey(plain));
      return { name: m?.name || e.name, office: e.roles[0], role: e.roles.join(" · "), dept: "", party: m?.party || "", image: m?.image, ref: m?.ref, since: "" };
    });
    console.log("ministers (gov.uk)", ministers.length, "| without a Parliament API match:", ministers.filter((m) => !m.ref).map((m) => m.name).join(", ") || "none");

    // Supreme Court
    const { $: sc, tables: st } = await allTables("Supreme Court of the United Kingdom", 8);
    const judges = st[0].g.slice(1).map((r) => {
      const L = links(sc, r[1])[0], t = T(sc, r[1]);
      return L && { title: L.title, name: nm(L.title, L.text), chief: /\(President\)/.test(t), deputy: /Deputy President/.test(t), since: dateOf(T(sc, r[4])) };
    }).filter(Boolean);
    judges.forEach((j) => { if (j.deputy) j.label = "Deputy President of the Supreme Court"; });
    // Source: supremecourt.uk/news/lord-reed-announces-retirement and /news/lord-briggs-appointed-next-president-of-the-supreme-court
    const reed = judges.find((j) => j.chief); if (reed) reed.note = "Retires 10 January 2027; Lord Briggs of Westbourne is due to succeed as President";
    console.log("justices", judges.length, judges.map((j) => j.name).join("; ").slice(0, 200));
    return { headOfState, headOfGov, ministers, chambers: { commons, lords }, judges, note: notSittingNote };
  },
};
