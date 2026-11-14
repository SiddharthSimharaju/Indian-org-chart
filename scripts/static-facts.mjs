// Constitutional facts that don't change with each election.
export const STATES = {
  "Andhra Pradesh": { code: "AP", capital: "Amaravati", region: "South", la: 175, lc: 58, ls: 25, rs: 11 },
  "Arunachal Pradesh": { code: "AR", capital: "Itanagar", region: "Northeast", la: 60, ls: 2, rs: 1 },
  "Assam": { code: "AS", capital: "Dispur", region: "Northeast", la: 126, ls: 14, rs: 7 },
  "Bihar": { code: "BR", capital: "Patna", region: "East", la: 243, lc: 75, ls: 40, rs: 16 },
  "Chhattisgarh": { code: "CG", capital: "Raipur", region: "Central", la: 90, ls: 11, rs: 5 },
  "Goa": { code: "GA", capital: "Panaji", region: "West", la: 40, ls: 2, rs: 1 },
  "Gujarat": { code: "GJ", capital: "Gandhinagar", region: "West", la: 182, ls: 26, rs: 11 },
  "Haryana": { code: "HR", capital: "Chandigarh", region: "North", la: 90, ls: 10, rs: 5 },
  "Himachal Pradesh": { code: "HP", capital: "Shimla", region: "North", la: 68, ls: 4, rs: 3 },
  "Jharkhand": { code: "JH", capital: "Ranchi", region: "East", la: 81, ls: 14, rs: 6 },
  "Karnataka": { code: "KA", capital: "Bengaluru", region: "South", la: 224, lc: 75, ls: 28, rs: 12 },
  "Kerala": { code: "KL", capital: "Thiruvananthapuram", region: "South", la: 140, ls: 20, rs: 9 },
  "Madhya Pradesh": { code: "MP", capital: "Bhopal", region: "Central", la: 230, ls: 29, rs: 11 },
  "Maharashtra": { code: "MH", capital: "Mumbai", region: "West", la: 288, lc: 78, ls: 48, rs: 19 },
  "Manipur": { code: "MN", capital: "Imphal", region: "Northeast", la: 60, ls: 2, rs: 1 },
  "Meghalaya": { code: "ML", capital: "Shillong", region: "Northeast", la: 60, ls: 2, rs: 1 },
  "Mizoram": { code: "MZ", capital: "Aizawl", region: "Northeast", la: 40, ls: 1, rs: 1 },
  "Nagaland": { code: "NL", capital: "Kohima", region: "Northeast", la: 60, ls: 1, rs: 1 },
  "Odisha": { code: "OD", capital: "Bhubaneswar", region: "East", la: 147, ls: 21, rs: 10 },
  "Punjab": { code: "PB", capital: "Chandigarh", region: "North", la: 117, ls: 13, rs: 7 },
  "Rajasthan": { code: "RJ", capital: "Jaipur", region: "North", la: 200, ls: 25, rs: 10 },
  "Sikkim": { code: "SK", capital: "Gangtok", region: "Northeast", la: 32, ls: 1, rs: 1 },
  "Tamil Nadu": { code: "TN", capital: "Chennai", region: "South", la: 234, ls: 39, rs: 18 },
  "Telangana": { code: "TS", capital: "Hyderabad", region: "South", la: 119, lc: 40, ls: 17, rs: 7 },
  "Tripura": { code: "TR", capital: "Agartala", region: "Northeast", la: 60, ls: 2, rs: 1 },
  "Uttar Pradesh": { code: "UP", capital: "Lucknow", region: "North", la: 403, lc: 100, ls: 80, rs: 31 },
  "Uttarakhand": { code: "UK", capital: "Dehradun", region: "North", la: 70, ls: 5, rs: 3 },
  "West Bengal": { code: "WB", capital: "Kolkata", region: "East", la: 294, ls: 42, rs: 16 },
};

export const UTS = {
  "Andaman and Nicobar Islands": { code: "AN", capital: "Port Blair", ls: 1, rs: 0, short: "Andaman & Nicobar" },
  "Chandigarh": { code: "CH", capital: "Chandigarh", ls: 1, rs: 0 },
  "Dadra and Nagar Haveli and Daman and Diu": { code: "DD", capital: "Daman", ls: 2, rs: 0, short: "Dadra & NH and Daman & Diu" },
  "Delhi": { code: "DL", capital: "New Delhi", la: 70, ls: 7, rs: 3, aliases: ["National Capital Territory of Delhi"] },
  "Jammu and Kashmir": { code: "JK", capital: "Srinagar / Jammu", la: 90, ls: 5, rs: 4, short: "Jammu & Kashmir" },
  "Ladakh": { code: "LA", capital: "Leh", ls: 1, rs: 0 },
  "Lakshadweep": { code: "LD", capital: "Kavaratti", ls: 1, rs: 0 },
  "Puducherry": { code: "PY", capital: "Puducherry", la: 33, ls: 1, rs: 1 },
};

export const REGION_BLURB = {
  North: "Himalayan foothills to the Thar desert and the Gangetic plains.",
  Northeast: "Eight states bordering China, Myanmar, Bhutan and Bangladesh.",
  East: "Ganga delta, Chota Nagpur plateau and the Bay of Bengal coast.",
  West: "The Arabian Sea coast, from Gujarat to Goa.",
  Central: "The heart of India: Vindhya, Satpura and Dandakaranya.",
  South: "Peninsular India, from the Deccan plateau to Kanyakumari.",
};

export const ELECTED_BY = {
  president:
    "Elected by an Electoral College made up of the elected members of both Houses of Parliament and of the Legislative Assemblies of the states (and of Delhi, Puducherry and Jammu & Kashmir). Voting is by secret ballot under proportional representation with the single transferable vote (Articles 54–55). Five-year term, eligible for re-election.",
  vp:
    "Elected by an electoral college of all members of both Houses of Parliament (elected and nominated), by secret ballot under proportional representation with the single transferable vote (Article 66). Five-year term. Serves ex officio as Chairman of the Rajya Sabha.",
  pm:
    "Appointed by the President as the leader who commands the confidence of the majority of the Lok Sabha (Article 75). The PM must be a member of either House and the Council of Ministers is collectively responsible to the Lok Sabha.",
  cabinet:
    "Appointed by the President on the advice of the Prime Minister (Article 75). Ministers must become members of Parliament within six months of appointment.",
  speaker:
    "Elected by the members of the Lok Sabha from among themselves at the start of each Lok Sabha. Presides over the House and decides questions of disqualification under the Tenth Schedule.",
  lop:
    "Recognised leader of the largest opposition party in the House (a party needs at least 10% of the seats). Carries Cabinet-rank status and sits on selection committees for key appointments.",
  rsDeputy:
    "Elected by the members of the Rajya Sabha from among themselves. Presides when the Chairman (the Vice President) is absent.",
  cji:
    "Appointed by the President. By long-standing convention the senior-most Supreme Court judge is recommended by the outgoing Chief Justice. Retires at age 65.",
  cec:
    "Appointed by the President on the recommendation of a selection committee of the Prime Minister, a Union Cabinet minister and the Leader of the Opposition (Chief Election Commissioner and Other Election Commissioners Act, 2023).",
  ag:
    "Appointed by the President on the advice of the Union Government (Article 76). Chief legal adviser to the Government of India, serving at the President's pleasure.",
  governor:
    "Appointed by the President on the advice of the Union Council of Ministers (Article 155). Serves for five years, but holds office during the President's pleasure. The Governor is the constitutional head of the state and formally appoints the Chief Minister.",
  lg:
    "Appointed by the President (Article 239 / 239AB). Heads a Union Territory as the President's representative; in Delhi, Puducherry and Jammu & Kashmir an elected Chief Minister runs the government within defined limits.",
  admin:
    "Appointed by the President (Article 239) to administer a Union Territory without a legislature on the Union Government's behalf.",
  cm:
    "Appointed by the Governor (Article 164) as the leader of the party or coalition that commands a majority in the Vidhan Sabha. Collectively responsible to the Legislative Assembly, which is directly elected every five years.",
  council:
    "Appointed by the Governor on the Chief Minister's advice. Ministers must be (or within six months become) members of the state legislature, and the council is collectively responsible to the Vidhan Sabha.",
  district:
    "Districts are administrative units, not elected offices. The District Collector is an IAS officer posted by the state government; the MLAs here are elected from constituencies inside the district.",
  mla:
    "Directly elected by voters of one assembly constituency using first-past-the-post, for a term of up to five years (Article 170). Sits in the Vidhan Sabha and can become a minister or Chief Minister.",
  mp:
    "Directly elected by voters of one parliamentary constituency using first-past-the-post, for a term of up to five years (Article 81). Sits in the Lok Sabha.",
  rsmp:
    "Elected by the MLAs of their state (single transferable vote) for a six-year term, or nominated by the President for expertise in the arts, literature, science or social service (Article 80). Sits in the Rajya Sabha.",
  minister:
    "Appointed by the President (Union) or the Governor (state) on the advice of the Prime Minister or Chief Minister. Ministers must be members of the legislature, or become one within six months.",
  dcm:
    "Not a constitutional post. Appointed by the Governor on the Chief Minister's advice as a senior member of the Council of Ministers, usually to balance coalition partners or regions.",
};

export const PARTY_COLORS = {
  BJP: "#F97316", INC: "#2563EB", AAP: "#0891B2", AITC: "#16A34A", TMC: "#16A34A", DMK: "#DC2626", TVK: "#B91C1C",
  TDP: "#EAB308", JSP: "#DC2626", "JD(U)": "#15803D", "JD (U)": "#15803D", JMM: "#059669", JKNC: "#DC2626", SHS: "#EA580C",
  NCP: "#0EA5E9", NPP: "#F59E0B", NPF: "#7C3AED", ZPM: "#0D9488", SKM: "#D97706", AINRC: "#2563EB", BRS: "#DB2777",
  CPI: "#B91C1C", "NCP(SP)": "#0284C7", "CPI(ML)L": "#B91C1C", RLP: "#16A34A", BAP: "#0D9488", AIADMK: "#16A34A", YSRCP: "#2563EB", "SHS(UBT)": "#F97316", BJD: "#15803D", AIMIM: "#047857", SAD: "#1D4ED8", JJP: "#CA8A04", INLD: "#15803D", RLD: "#15803D", "JD(S)": "#16A34A", IND: "#6B7280", NDPP: "#DB2777", AGP: "#16A34A", TIPRA: "#7C3AED", IUML: "#16A34A", AIUDF: "#065F46", "LJP(RV)": "#0EA5E9", HAM: "#F59E0B", RLM: "#0EA5E9", "KC(M)": "#16A34A", "CPI(M)": "#B91C1C", "CPI (M)": "#B91C1C", SP: "#DC2626", BSP: "#2563EB", RJD: "#16A34A",
};
