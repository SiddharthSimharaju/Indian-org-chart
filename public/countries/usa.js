// United States: everything country-specific the chart needs. Plain-English text states constitutional facts only; no opinions.

const MAJORITY_H = ["Majority mark", "218 of 435 voting seats in the House. The party that holds it elects the Speaker and controls the agenda."];
const PLURALITY = ["First-past-the-post", "The candidate with the most votes in a district wins, even without a majority of all votes."];
const DISTRICT = ["District", "The geographic area whose voters elect one representative."];
const VETO = ["Veto", "The President or a governor can reject a bill. The legislature can override it, usually with a two-thirds vote."];
const CONFIRM = ["Confirmation", "The Senate's vote to approve a President's nominee for a cabinet post or a federal judgeship."];

const EXPLAIN = {
  usa: { plain: "The United States splits power three ways. Congress makes laws, the President carries them out, and the courts decide what the laws mean. Fifty states run their own governments alongside the federal one, each with the same three-way split." },
  president: {
    plain: "Head of state and head of government in one person. Carries out federal laws, commands the armed forces, signs or vetoes bills from Congress, proposes the budget and nominates cabinet members, ambassadors and federal judges, all subject to Senate approval.",
    facts: [["Term", "4 years, maximum two terms"], ["Chosen by", "The Electoral College (270 of 538 electoral votes to win)"], ["Can be removed by", "Impeachment by the House and conviction by a two-thirds Senate vote"]],
    terms: [["Electoral College", "538 electors, allocated to states by population, who formally choose the President after the popular vote in each state."], VETO, ["Impeachment", "A formal charge brought by the House. The Senate then holds the trial."]],
  },
  vp: {
    plain: "Elected on the same ticket as the President. Presides over the Senate and casts the deciding vote when it is tied 50-50. If the President dies, resigns or is removed, the Vice President becomes President.",
    facts: [["Term", "4 years"], ["Chosen by", "The Electoral College, on the President's ticket"], ["Real power", "Mostly the tie-breaking Senate vote and succession"]],
  },
  secretary: {
    plain: "Heads a federal department or agency, such as State, Defense or Treasury, and advises the President as part of the Cabinet. Each is nominated by the President and must be confirmed by a majority of the Senate.",
    facts: [["Term", "No fixed term; serves as long as the President wants"], ["Chosen by", "Nominated by the President, confirmed by the Senate"], ["Can be removed by", "The President, or by impeachment"]],
    terms: [CONFIRM, ["Cabinet", "The heads of the executive departments, plus other officials the President gives Cabinet rank."]],
  },
  justice: {
    plain: "One of nine judges on the Supreme Court, the highest court in the country. The Court decides whether laws and government actions are consistent with the Constitution, and its rulings bind every other court. Justices serve for life, which keeps them independent of elections.",
    facts: [["Term", "Life, \"during good behavior\""], ["Chosen by", "Nominated by the President, confirmed by the Senate"], ["Can be removed by", "Impeachment only"]],
    terms: [CONFIRM, ["Judicial review", "The power of courts to strike down laws that conflict with the Constitution."]],
  },
  senator: {
    plain: "One of two senators from each state, elected by all of that state's voters. Senators write and pass federal laws together with the House, confirm the President's nominees, approve treaties and try impeachments.",
    facts: [["Term", "6 years; about one-third of seats are up every 2 years"], ["Chosen by", "Voters of the whole state (17th Amendment, 1913)"], ["Must be", "At least 30 years old and a citizen for 9 years"]],
    terms: [CONFIRM, ["Filibuster", "A tactic of extended debate that can block a vote. Ending it normally takes 60 senators."]],
  },
  rep: {
    plain: "Elected by the voters of one congressional district to sit in the House of Representatives. Representatives write and pass federal laws together with the Senate, and every spending bill must start in the House. Delegates from D.C. and the territories can debate and serve on committees but cannot vote on the final passage of bills.",
    facts: [["Term", "2 years"], ["Chosen by", "Voters of one congressional district"], ["Must be", "At least 25 years old and a citizen for 7 years"]],
    terms: [DISTRICT, PLURALITY, ["Midterm election", "The House election held halfway through a President's term."]],
  },
  governor: {
    plain: "The elected head of a state's government: the state-level counterpart of the President. Carries out state laws, proposes the state budget, signs or vetoes bills from the state legislature and commands the state's National Guard when it is not in federal service.",
    facts: [["Term", "4 years in 48 states; 2 years in New Hampshire and Vermont"], ["Chosen by", "Voters of the whole state"], ["Can be removed by", "Impeachment or, in some states, a recall election"]],
    terms: [VETO, ["Term limits", "Rules on how many times a governor can be re-elected. They differ by state."]],
  },
  ltgov: {
    plain: "The state's second-highest executive officer. In most states steps in if the governor leaves office, and in many also presides over the state senate. Some states elect the Lieutenant Governor on a joint ticket with the governor; others elect the two separately.",
    facts: [["Term", "Usually 4 years"], ["Chosen by", "Voters of the whole state"]],
  },
  mayor: {
    plain: "The elected head of the District of Columbia's government. D.C. is not a state: the Constitution gives Congress final authority over it, and it has a non-voting delegate in the House.",
    facts: [["Term", "4 years"], ["Chosen by", "D.C. voters"]],
  },
  statesen: {
    plain: "Elected by the voters of one state senate district to sit in the upper house of their state legislature. State legislators write the state's laws, pass its budget and set rules for matters such as education, policing and local taxes.",
    facts: [["Term", "2 or 4 years, depending on the state"], ["Chosen by", "Voters of one state senate district"]],
    terms: [DISTRICT, ["State legislature", "The elected law-making body of a state. 49 states have two chambers; Nebraska has one."]],
  },
  staterep: {
    plain: "Elected by the voters of one district to sit in the larger chamber of their state legislature (called the House of Representatives, Assembly or House of Delegates, depending on the state). Writes state laws and passes the state budget.",
    facts: [["Term", "2 years in most states; 4 in a few"], ["Chosen by", "Voters of one state house district"]],
    terms: [DISTRICT, ["State legislature", "The elected law-making body of a state. 49 states have two chambers; Nebraska has one."]],
  },
  speaker: {
    plain: "The presiding officer of the House and the leader of the majority party in it. Elected by the whole House at the start of each Congress, decides which bills come to a vote, and is second in the line of succession to the presidency after the Vice President.",
    facts: [["Chosen by", "House members, by majority vote"], ["Line of succession", "Second, after the Vice President"]],
  },
  ppt: {
    plain: "Presides over the Senate when the Vice President is absent. By tradition the post goes to the longest-serving senator of the majority party. Third in line to the presidency.",
    facts: [["Chosen by", "Senate members"], ["Line of succession", "Third, after the Vice President and the Speaker"]],
  },
  majorityLeader: {
    plain: "The majority party's chief strategist in its chamber. Chosen by that party's members, and in the Senate controls what reaches the floor for a vote.",
    facts: [["Chosen by", "Their party's members in the chamber"]],
  },
  minorityLeader: {
    plain: "Leads the largest party that is not in the majority in the chamber, organises its response to the majority's agenda and speaks for it in debates.",
    facts: [["Chosen by", "Their party's members in the chamber"]],
  },
  chiefJustice: {
    plain: "Leads the Supreme Court and the federal judiciary. Has one vote like the other eight justices, but presides over arguments, assigns the writing of opinions when in the majority, and presides over a Senate impeachment trial of the President.",
    facts: [["Chosen by", "Nominated by the President, confirmed by the Senate"], ["Term", "Life"]],
  },
  congress: {
    plain: "The legislative branch. Two chambers, the House of Representatives and the Senate, must both pass a bill in identical form before it goes to the President. Congress also controls federal taxes and spending, can declare war and oversees the executive branch.",
    terms: [["Bicameral", "Having two chambers."], ["Congress (numbered)", "Each two-year term is a numbered Congress. The one elected in 2024 is the 119th."]],
  },
  "house-reps": {
    plain: "The larger chamber of Congress, with 435 voting members spread among the states according to population and re-elected every two years. All spending bills start here, and it holds the power to impeach.",
    terms: [MAJORITY_H, DISTRICT, ["Reapportionment", "Redistributing the 435 seats among the states after each 10-year census."]],
  },
  senate: {
    plain: "The smaller chamber, with two senators per state regardless of population. It confirms the President's nominees, ratifies treaties by a two-thirds vote and tries impeachments. The Vice President presides and votes only to break ties.",
    terms: [["Majority mark", "51 of 100 seats, or 50 plus the Vice President's tie-breaking vote."], ["Class", "Senators are divided into three groups so that about one-third of the seats are up for election every two years."]],
  },
  cabinet: {
    plain: "The heads of the executive departments (State, Treasury, Defense, Justice and so on), who run the federal government's agencies and advise the President. The Vice President also sits in it. The President can give other officials Cabinet rank.",
    terms: [CONFIRM],
  },
  "supreme-court": {
    plain: "The top of the judicial branch. Nine justices, appointed for life, hear the most important appeals and decide constitutional questions. Congress sets the number of justices; it has been nine since 1869.",
    terms: [["Judicial review", "The power of courts to strike down laws that conflict with the Constitution."]],
  },
  states: { plain: "The 50 states each have their own constitution and a government with the same three branches: a governor, a legislature and courts. Under the 10th Amendment, powers the Constitution does not give to the federal government stay with the states and the people." },
  territories: { plain: "Washington, D.C. is the federal capital district and is governed under authority granted by Congress. Five inhabited territories (Puerto Rico, Guam, the U.S. Virgin Islands, American Samoa and the Northern Mariana Islands) have their own elected governors but no voting members in Congress and no electoral votes for President, except that residents of D.C. do vote for President." },
  region: { plain: "The four regions the U.S. Census Bureau uses to group states. Used here only to organise the chart; they have no government of their own." },
  state: { plain: "One of the 50 states. Each has an elected governor, a legislature and its own courts. This card lists the state's main elected officials and the two chambers of its legislature." },
  stateLeg: { plain: "One chamber of a state's law-making body. State legislatures write state law, pass the state budget and decide on matters such as education, policing and local taxes." },
  group: { plain: "The members of Congress from one state." },
};

export const PARTY_INFO = {
  Democratic: ["Democratic Party", "One of the two major parties; its roots go back to the 1820s. Generally centre-left to left: favours a larger role for government in health care, education and the economy."],
  Republican: ["Republican Party", "One of the two major parties, founded in 1854. Generally centre-right to right: favours lower taxes, smaller federal government and traditional social values."],
  Independent: ["Independent", "Not a member of a political party. Independents in Congress usually join one party's caucus to get committee assignments."],
  Nonpartisan: ["Nonpartisan", "Nebraska's one-chamber legislature is officially nonpartisan: candidates run without party labels on the ballot."],
  Libertarian: ["Libertarian Party", "Founded in 1971. Stresses individual liberty, limited government and free markets."],
  Progressive: ["Vermont Progressive Party", "A left-leaning state party, mainly active in Vermont."],
};

const ICONS = { president: "flag", vp: "landmark", secretary: "briefcase", justice: "scale", senator: "landmark", rep: "vote", governor: "shield", ltgov: "shield", mayor: "building", statesen: "landmark", staterep: "vote" };
const REGION_ICON = { "region-northeast": "waves", "region-midwest": "target", "region-south": "sun", "region-west": "mountain" };
const REGION_COLOR = { "region-northeast": "#2563eb", "region-midwest": "#ca8a04", "region-south": "#ea580c", "region-west": "#0f766e" };
const WIKI = { usa: "Federal_government_of_the_United_States", congress: "United_States_Congress", "house-reps": "United_States_House_of_Representatives", senate: "United_States_Senate", cabinet: "Cabinet_of_the_United_States", "supreme-court": "Supreme_Court_of_the_United_States", states: "U.S._state", territories: "Territories_of_the_United_States" };

const isState = (a) => a.kind === "group" && /^state-(?!senate-|house-)/.test(a.id);
const stateOf = (n) => { for (let a = n; a; a = a.parent) if (isState(a)) return a.label; return ""; };
const FEDERAL = ["house-reps", "senate", "congress"];

export default {
  id: "usa", name: "United States", flag: "🇺🇸", dataUrl: "data/usa.json", locale: "en-US",
  rootId: "usa", pageTitle: "United States", loading: "Loading the republic…",
  description: "An interactive org chart of US politics: the President, Cabinet, Congress, Supreme Court and the governors and legislatures of all 50 states.",
  searchPlaceholder: "Search a person, state or office",
  labels: { org: "Organization details" },
  leafRoles: ["rep", "senator", "statesen", "staterep", "secretary", "justice"],
  expandAllSkip: /^(hr-|sen-|state-senate-|state-house-)/,
  statLabels: ["Capital", "House seats", "Electoral votes", "Residence", "Term"],
  nonpartisan: ["justice", "secretary"],
  person: {
    president: { where: ["Jurisdiction", "United States"], chosen: "Electoral College", term: "4 years" },
    vp: { where: ["Jurisdiction", "United States"], chosen: "Electoral College", term: "4 years" },
    secretary: { where: ["Department"], chosen: "President + Senate", term: "At pleasure" },
    justice: { where: ["Court", "Supreme Court"], chosen: "President + Senate", term: "Life" },
    senator: { where: ["State"], chosen: "State voters", term: "6 years" },
    rep: { where: ["Seat"], chosen: "District voters", term: "2 years" },
    governor: { where: ["State"], chosen: "State voters", term: "4 years" },
    ltgov: { where: ["State"], chosen: "State voters", term: "4 years" },
    mayor: { where: ["City", "Washington, D.C."], chosen: "D.C. voters", term: "4 years" },
    statesen: { where: ["Seat"], chosen: "District voters", term: "2 to 4 years" },
    staterep: { where: ["Seat"], chosen: "District voters", term: "2 to 4 years" },
  },
  partyInfo: PARTY_INFO,
  wiki: (n) => (WIKI[n.id] ? "https://en.wikipedia.org/wiki/" + WIKI[n.id] : null),
  subtitle: (nodes) => `${[...nodes.values()].filter(isState).length} states · ${[...nodes.values()].filter((n) => n.kind === "office").length} office holders`,

  tileColor(n) {
    if (REGION_COLOR[n.id]) return REGION_COLOR[n.id];
    if (n.id === "usa") return "#1d4ed8";
    if (n.id === "states") return "#0f766e";
    if (n.id === "territories") return "#7c3aed";
    if (n.id === "cabinet") return "#b45309";
    if (n.id === "congress" || n.id === "house-reps" || n.id.startsWith("hr-")) return "#4f46e5";
    if (n.id === "senate" || n.id.startsWith("sen-")) return "#7c3aed";
    if (n.id === "supreme-court") return "#1f2a7a";
    if (n.id.startsWith("state-senate-")) return "#7c3aed";
    if (n.id.startsWith("state-house-")) return "#4f46e5";
    if (isState(n)) return "#0d9488";
    return n.kind === "house" ? "#1f2a7a" : n.kind === "group" ? "#64748b" : "#222";
  },
  nodeIcon(n) {
    if (REGION_ICON[n.id]) return REGION_ICON[n.id];
    if (n.id === "usa") return "flag";
    if (n.id === "states") return "map";
    if (n.id === "territories") return "building";
    if (n.id === "cabinet") return "users";
    if (n.id === "supreme-court") return "scale";
    if (/^(hr|sen)-/.test(n.id)) return "pin";
    if (isState(n)) return "map";
    if (n.kind === "house") return "landmark";
    return n.kind === "group" ? "map" : ICONS[n.role] || "star";
  },
  cardSub(n) {
    if (n.kind === "office") {
      if (["rep", "senator", "statesen", "staterep"].includes(n.role)) { const s = stateOf(n) || (n.parent?.label ?? ""); return s ? `${n.label} · ${s}` : n.label; }
      return ["governor", "ltgov", "mayor"].includes(n.role) ? `${n.label} · ${n.place}` : n.label;
    }
    return n.sub || n.place;
  },

  explainFor(n, member) {
    if (member) {
      const r = member.role || "";
      if (/^Speaker/.test(r)) return EXPLAIN.speaker;
      if (/pro tempore/i.test(r)) return EXPLAIN.ppt;
      if (/Majority Leader/.test(r)) return EXPLAIN.majorityLeader;
      if (/Minority Leader/.test(r)) return EXPLAIN.minorityLeader;
      if (/^Chief Justice/.test(r)) return EXPLAIN.chiefJustice;
      if (n.id === "supreme-court") return EXPLAIN.justice;
      if (n.id === "cabinet") return EXPLAIN.secretary;
      if (n.id === "house-reps") return EXPLAIN.rep;
      if (n.id === "senate") return EXPLAIN.senator;
      if (n.id.startsWith("state-senate-")) return EXPLAIN.statesen;
      if (n.id.startsWith("state-house-")) return EXPLAIN.staterep;
      return null;
    }
    if (n.kind === "office") return n.label.startsWith("Chief Justice") ? EXPLAIN.chiefJustice : EXPLAIN[n.role];
    if (n.id.startsWith("region-")) return EXPLAIN.region;
    if (n.id.startsWith("state-senate-") || n.id.startsWith("state-house-")) return EXPLAIN.stateLeg;
    if (isState(n)) return EXPLAIN.state;
    if (/^(hr|sen)-/.test(n.id)) return EXPLAIN.group;
    return EXPLAIN[n.id] || null;
  },

  // A presidential system has no "government vs opposition" in the parliamentary sense, so compare with the
  // President's party for Congress and with the governor's party for state legislators.
  govStatus(n, p, { nodes }) {
    if (!p?.party || !["rep", "senator", "statesen", "staterep", undefined].includes(n.role) && n.kind === "office") return null;
    let scope = null;
    for (let a = n; a; a = a.parent) {
      if (FEDERAL.includes(a.id)) { scope = "federal"; break; }
      if (isState(a)) { scope = a.id.slice(6); break; }
    }
    if (!scope) return null;
    if (scope === "federal") {
      const lead = nodes.get("president")?.person?.party; if (!lead) return null;
      const ok = p.party === lead;
      return { ok, tag: ok ? "President's party" : "Not President's party", detail: ok ? "Same party as the President." : `Not the President's party (the President is ${lead}).` };
    }
    if (n.kind === "office" && !["statesen", "staterep"].includes(n.role)) return null;
    if (n.kind !== "office" && !/^state-(senate|house)-/.test(n.id)) return null;
    const lead = nodes.get("gov-" + scope)?.person?.party; if (!lead) return null;
    const ok = p.party === lead;
    return { ok, tag: ok ? "Governor's party" : "Not governor's party", detail: ok ? "Same party as the state's governor." : `Not the governor's party (the governor is ${lead}).` };
  },

  membersHeader: (n) => (n.id === "cabinet" ? "Department" : ["house-reps", "senate"].includes(n.id) || /^state-(senate|house)-/.test(n.id) ? "Seat" : "Role"),

  listSection(n, anc) {
    const a = [n, ...anc.slice().reverse()];
    const reg = a.find((x) => x.id.startsWith("region-")); if (reg) return `States · ${reg.label}`;
    if (a.some((x) => x.id === "territories")) return "Federal district & territories";
    if (a.some((x) => x.id === "cabinet")) return "Cabinet";
    if (a.some((x) => x.id === "congress")) return "Congress";
    return "Federal leadership & courts";
  },
  listOrder: (sections) => ["Federal leadership & courts", "Cabinet", "Congress", ...[...sections].filter((s) => s.startsWith("States")).sort(), "Federal district & territories"],
  listCabinetId: "cabinet", listCabinetSection: "Cabinet",
};
