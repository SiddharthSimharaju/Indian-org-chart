// Constitutional and statutory facts for the US chart that don't change with each election.
// seats: [state senate, state house]; house = US House seats (2020 apportionment); electoral votes = house + 2.
const R = { NE: "Northeast", MW: "Midwest", S: "South", W: "West" };
const S = (code, capital, region, house, senate, lower, extra = {}) => ({ code, capital, region, house, ev: house + 2, senate, lower, ...extra });

export const STATES = {
  "Alabama": S("AL", "Montgomery", R.S, 7, 35, 105),
  "Alaska": S("AK", "Juneau", R.W, 1, 20, 40),
  "Arizona": S("AZ", "Phoenix", R.W, 9, 30, 60, { noLt: true }),
  "Arkansas": S("AR", "Little Rock", R.S, 4, 35, 100),
  "California": S("CA", "Sacramento", R.W, 52, 40, 80, { lowerName: "Assembly", lowerMember: "Assembly Member" }),
  "Colorado": S("CO", "Denver", R.W, 8, 35, 65),
  "Connecticut": S("CT", "Hartford", R.NE, 5, 36, 151),
  "Delaware": S("DE", "Dover", R.S, 1, 21, 41),
  "Florida": S("FL", "Tallahassee", R.S, 28, 40, 120),
  "Georgia": S("GA", "Atlanta", R.S, 14, 56, 180),
  "Hawaii": S("HI", "Honolulu", R.W, 2, 25, 51),
  "Idaho": S("ID", "Boise", R.W, 2, 35, 70),
  "Illinois": S("IL", "Springfield", R.MW, 17, 59, 118),
  "Indiana": S("IN", "Indianapolis", R.MW, 9, 50, 100),
  "Iowa": S("IA", "Des Moines", R.MW, 4, 50, 100),
  "Kansas": S("KS", "Topeka", R.MW, 4, 40, 125),
  "Kentucky": S("KY", "Frankfort", R.S, 6, 38, 100),
  "Louisiana": S("LA", "Baton Rouge", R.S, 6, 39, 105),
  "Maine": S("ME", "Augusta", R.NE, 2, 35, 151, { noLt: true }),
  "Maryland": S("MD", "Annapolis", R.S, 8, 47, 141, { lowerName: "House of Delegates", lowerMember: "Delegate" }),
  "Massachusetts": S("MA", "Boston", R.NE, 9, 40, 160),
  "Michigan": S("MI", "Lansing", R.MW, 13, 38, 110),
  "Minnesota": S("MN", "Saint Paul", R.MW, 8, 67, 134),
  "Mississippi": S("MS", "Jackson", R.S, 4, 52, 122),
  "Missouri": S("MO", "Jefferson City", R.MW, 8, 34, 163),
  "Montana": S("MT", "Helena", R.W, 2, 50, 100),
  "Nebraska": S("NE", "Lincoln", R.MW, 3, 49, 0, { unicameral: true }),
  "Nevada": S("NV", "Carson City", R.W, 4, 21, 42, { lowerName: "Assembly", lowerMember: "Assembly Member" }),
  "New Hampshire": S("NH", "Concord", R.NE, 2, 24, 400, { noLt: true, govTerm: "2 years" }),
  "New Jersey": S("NJ", "Trenton", R.NE, 12, 40, 80, { lowerName: "General Assembly", lowerMember: "Assembly Member" }),
  "New Mexico": S("NM", "Santa Fe", R.W, 3, 42, 70),
  "New York": S("NY", "Albany", R.NE, 26, 63, 150, { lowerName: "Assembly", lowerMember: "Assembly Member" }),
  "North Carolina": S("NC", "Raleigh", R.S, 14, 50, 120),
  "North Dakota": S("ND", "Bismarck", R.MW, 1, 47, 94),
  "Ohio": S("OH", "Columbus", R.MW, 15, 33, 99),
  "Oklahoma": S("OK", "Oklahoma City", R.S, 5, 48, 101),
  "Oregon": S("OR", "Salem", R.W, 6, 30, 60, { noLt: true }),
  "Pennsylvania": S("PA", "Harrisburg", R.NE, 17, 50, 203),
  "Rhode Island": S("RI", "Providence", R.NE, 2, 38, 75),
  "South Carolina": S("SC", "Columbia", R.S, 7, 46, 124),
  "South Dakota": S("SD", "Pierre", R.MW, 1, 35, 70),
  "Tennessee": S("TN", "Nashville", R.S, 9, 33, 99),
  "Texas": S("TX", "Austin", R.S, 38, 31, 150),
  "Utah": S("UT", "Salt Lake City", R.W, 4, 29, 75),
  "Vermont": S("VT", "Montpelier", R.NE, 1, 30, 150, { govTerm: "2 years" }),
  "Virginia": S("VA", "Richmond", R.S, 11, 40, 100, { lowerName: "House of Delegates", lowerMember: "Delegate" }),
  "Washington": S("WA", "Olympia", R.W, 10, 49, 98),
  "West Virginia": S("WV", "Charleston", R.S, 2, 34, 100, { lowerName: "House of Delegates", lowerMember: "Delegate" }),
  "Wisconsin": S("WI", "Madison", R.MW, 8, 33, 99, { lowerName: "Assembly", lowerMember: "Assembly Member" }),
  "Wyoming": S("WY", "Cheyenne", R.W, 1, 31, 62, { noLt: true }),
};

export const REGIONS = ["Northeast", "Midwest", "South", "West"];
export const REGION_BLURB = {
  Northeast: "New England and the Mid-Atlantic: the oldest states, from Maine to Pennsylvania.",
  Midwest: "The Great Lakes and the Great Plains, from Ohio to the Dakotas.",
  South: "From Delaware down the Atlantic coast and across the Gulf to Texas and Oklahoma.",
  West: "The Mountain West and the Pacific states, plus Alaska and Hawaii.",
};

// Special chamber names for the state upper and lower houses. Wikipedia page titles tried in order.
export const SENATE_PAGES = {
  California: ["California State Senate"], Connecticut: ["Connecticut State Senate"], Georgia: ["Georgia State Senate"], Louisiana: ["Louisiana State Senate"],
  Nebraska: ["Nebraska Legislature"], "New York": ["New York State Senate"], Oregon: ["Oregon State Senate"], Pennsylvania: ["Pennsylvania State Senate"],
  Virginia: ["Senate of Virginia"], Washington: ["Washington State Senate"], Wisconsin: ["Wisconsin State Senate"], Utah: ["Utah State Senate"], Maryland: ["Maryland Senate"],
  Mississippi: ["Mississippi State Senate"], Hawaii: ["Hawaii State Senate"], Massachusetts: ["194th Massachusetts General Court"],
};
export const LOWER_PAGES = {
  California: ["California State Assembly"], Maryland: ["Maryland House of Delegates"], Nevada: ["Nevada Assembly"], "New Jersey": ["New Jersey General Assembly"],
  "New York": ["New York State Assembly"], Virginia: ["Virginia House of Delegates"], Massachusetts: ["194th Massachusetts General Court"], "West Virginia": ["West Virginia House of Delegates"], Wisconsin: ["Wisconsin State Assembly"],
};

export const TERRITORIES = {
  "Puerto Rico": { code: "PR", capital: "San Juan", status: "Unincorporated territory (Commonwealth)" },
  "Guam": { code: "GU", capital: "Hagåtña", status: "Unincorporated organized territory" },
  "U.S. Virgin Islands": { code: "VI", capital: "Charlotte Amalie", status: "Unincorporated organized territory", aliases: ["United States Virgin Islands", "U.S. Virgin Islands", "US Virgin Islands"] },
  "American Samoa": { code: "AS", capital: "Pago Pago", status: "Unincorporated unorganized territory" },
  "Northern Mariana Islands": { code: "MP", capital: "Saipan", status: "Unincorporated territory (Commonwealth)" },
};

export const ELECTED_BY = {
  president:
    "Elected every four years through the Electoral College. Voters in each state choose electors; the 538 electors meet in December and a candidate needs 270 electoral votes to win (Article II and the 12th Amendment). A President can serve at most two elected terms (22nd Amendment).",
  vp:
    "Elected on the same ticket as the President through the Electoral College (12th Amendment), for a four-year term. Presides over the Senate and breaks tied votes, and becomes President if that office falls vacant (25th Amendment).",
  cabinet:
    "Most members are nominated by the President and confirmed by a majority vote of the Senate; the White House Chief of Staff is appointed without Senate confirmation. They serve at the President's pleasure and can be dismissed at any time. The Cabinet is not described in the Constitution beyond a reference to the President's 'principal Officer in each of the executive Departments'.",
  chiefOfStaff:
    "Appointed by the President; no Senate confirmation. The Chief of Staff leads the White House staff in the Executive Office of the President and serves at the President's pleasure.",
  secretary:
    "Nominated by the President and confirmed by a majority of the Senate (Article II, Section 2). Serves at the President's pleasure. Leads a federal department or agency and sits in the Cabinet.",
  speaker:
    "Elected by a majority vote of the whole House at the start of each Congress (Article I, Section 2). By custom the Speaker is the leader of the majority party, though the Constitution does not require a member of the House. Second in line to the presidency after the Vice President.",
  presProTem:
    "Elected by the Senate; by tradition the longest-serving member of the majority party. Presides when the Vice President is absent and is third in line to the presidency after the Speaker.",
  house:
    "435 voting members, each directly elected by the voters of one single-member district every two years using first-past-the-post. Seats are shared among the states in proportion to population after each census (Reapportionment Act of 1929). Six non-voting delegates represent D.C. and the territories.",
  senate:
    "100 senators, two per state regardless of population. Directly elected by the whole state since the 17th Amendment (1913), for six-year terms. Terms are staggered in three classes so about one-third of seats are up every two years.",
  rep:
    "Directly elected by the voters of one congressional district every two years, using first-past-the-post (Article I, Section 2). Must be at least 25 years old, a citizen for seven years and an inhabitant of the state.",
  senator:
    "Directly elected by all voters of their state for a six-year term (Article I, Section 3 and the 17th Amendment). Must be at least 30 years old and a citizen for nine years. Two senators per state, with elections staggered across three classes.",
  court:
    "Justices are nominated by the President and confirmed by a majority of the Senate. They hold office 'during good behavior', meaning for life unless they resign, retire or are impeached and removed by Congress. The number of seats (nine) is set by statute, not the Constitution.",
  chief:
    "Nominated by the President and confirmed by the Senate to lead the Supreme Court. Serves for life unless they resign, retire or are impeached. Presides over the Court and over a President's impeachment trial in the Senate.",
  justice:
    "Nominated by the President and confirmed by a majority of the Senate (Article II, Section 2). Serves 'during good behavior', which in practice means for life unless they resign, retire or are impeached and removed.",
  governor:
    "Elected by the voters of the whole state. Four-year terms in 48 states and two-year terms in New Hampshire and Vermont. Term limits differ: many states cap a governor at two terms, some have no limit.",
  governorTerritory:
    "Elected by the voters of the territory. Territorial governors lead local government but Congress has final authority over the territories.",
  mayor:
    "Elected by the voters of the District of Columbia for a four-year term under the Home Rule Act of 1973. Congress keeps the power to overturn D.C. laws and budgets.",
  ltgovSeparate:
    "Elected by the voters of the whole state in a separate election, so the Lieutenant Governor can belong to a different party from the Governor.",
  ltgovTicket:
    "Elected on the same ticket as the Governor, so the two are always from the same party.",
  ltgovAppointed:
    "Not elected statewide. Holds the office by virtue of another position or by appointment, depending on state law.",
  statesen:
    "Directly elected by the voters of one state senate district. Terms are four years in most states and two years in some. Makes state law and approves the state budget.",
  staterep:
    "Directly elected by the voters of one state house district, normally for a two-year term. Makes state law and approves the state budget.",
  stateLegislature:
    "The state's law-making body. All states except Nebraska have two chambers: a senate and a larger house. Nebraska's single chamber is officially nonpartisan.",
};

export const PARTY_COLORS = {
  Democratic: "#2563EB", Republican: "#DC2626", Independent: "#6B7280", Nonpartisan: "#9CA3AF", "No party affiliation": "#9CA3AF", Libertarian: "#EAB308", Progressive: "#16A34A",
  Green: "#15803D", Constitution: "#7C3AED", Other: "#A1A1AA",
  "Popular Democratic": "#EF4444", "New Progressive": "#0EA5E9", "Democratic Party": "#2563EB",
};

// Wikipedia party text -> a short, consistent name.
export const normParty = (raw = "") => {
  let t = raw.replace(/\[.*?\]/g, "").replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
  const s = t.toLowerCase();
  if (!s) return "";
  if (/democratic.?farmer.?labor|^dfl|democratic-npl|democratic.?nonpartisan|^democratic|^democrat|^dem\b/.test(s)) return /popular democratic/.test(s) ? "Popular Democratic" : "Democratic";
  if (/republican|^rep\b|^gop$/.test(s)) return "Republican";
  if (/new progressive/.test(s)) return "New Progressive";
  if (/^prog(ressive)?\b/.test(s)) return "Progressive"; // Vermont Progressives are listed as "Prog/Dem" on Wikipedia
  if (/popular democratic/.test(s)) return "Popular Democratic";
  if (/independent|^ind\b|caucus|unaffiliated|unenrolled/.test(s)) return "Independent";
  if (/non-?partisan/.test(s)) return "Nonpartisan";
  if (/no party affiliation/.test(s)) return "No party affiliation";
  if (/libertarian/.test(s)) return "Libertarian";
  if (/progressive/.test(s)) return "Progressive";
  if (/green/.test(s)) return "Green";
  if (/vacant/.test(s)) return "";
  return "Other";
};

export const PARTIES_WITH_COLOR = Object.keys(PARTY_COLORS);
