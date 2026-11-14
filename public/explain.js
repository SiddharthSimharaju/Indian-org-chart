// Plain-English context for people new to Indian politics. Constitutional facts only; no opinions.

const FPTP = ["First-past-the-post", "The candidate with the most votes wins the seat, even without a majority of all votes."];
const CONSTITUENCY = ["Constituency", "The geographic area whose voters elect one representative."];
const MAJORITY = ["Majority mark", "More than half the seats in a house. A party or coalition needs it to form a government."];

export const EXPLAIN = {
  president: {
    plain: "The ceremonial head of state. Every government action is taken in the President's name, but in practice the President acts on the advice of the Prime Minister and the cabinet. Think of the role as a constitutional guardian rather than a decision-maker.",
    facts: [["Term", "5 years, can be re-elected"], ["Can be removed by", "Impeachment in Parliament"], ["Real power", "Mostly ceremonial; more discretion when no party has a majority"]],
    terms: [["Electoral College", "The MPs and MLAs who vote to choose the President."]],
  },
  vp: {
    plain: "The second-highest office. The Vice President chairs the Rajya Sabha, casts the deciding vote on a tie, and steps in as acting President if that office falls vacant.",
    facts: [["Term", "5 years"], ["Can be removed by", "A Rajya Sabha resolution that the Lok Sabha agrees to"], ["Real power", "Limited to running the Rajya Sabha"]],
  },
  pm: {
    plain: "The head of government and the person who actually runs the country day to day. Leads the cabinet and must keep the support of a majority in the Lok Sabha to stay in office.",
    facts: [["Term", "No fixed term; up to 5 years between general elections"], ["Can be removed by", "Losing a confidence vote in the Lok Sabha, or resigning"], ["Real power", "The most executive power in the country"]],
    terms: [["Confidence vote", "A vote in the Lok Sabha that decides whether the government still has a majority."], MAJORITY],
  },
  minister: {
    plain: "A member of the government who heads one or more departments (called portfolios), such as Finance or Health. Cabinet ministers form the inner decision-making group; Ministers of State assist them or run smaller departments.",
    facts: [["Term", "Serves as long as the PM or Chief Minister wants and the legislature supports the government"], ["Can be removed by", "The Prime Minister or Chief Minister asking them to resign"]],
    terms: [["Portfolio", "The department or area of government a minister is in charge of."], ["Minister of State", "A junior minister who assists a Cabinet Minister, or runs a department independently if marked (Independent Charge)."]],
  },
  cm: {
    plain: "The head of a state government: the state-level equivalent of the Prime Minister. Runs the state, leads the state ministers, and must keep a majority in the state's Vidhan Sabha.",
    facts: [["Term", "No fixed term; up to 5 years between state elections"], ["Can be removed by", "Losing a majority in the Vidhan Sabha, or resigning"], ["Real power", "Runs the state; the Governor is only the formal head"]],
    terms: [["Vidhan Sabha", "The elected state assembly."], ["President's Rule", "When a state government cannot function, the Centre can take over its administration for a limited time."]],
  },
  dcm: {
    plain: "Not a constitutional post. A senior minister given the title, usually to balance a coalition or a region. Legally a Deputy Chief Minister is an ordinary minister.",
    facts: [["Real power", "Depends on the portfolios held and on the coalition"]],
  },
  governor: {
    plain: "The President's representative in a state and its formal head. Appoints the Chief Minister (the leader with majority support), signs bills into law, and can recommend President's Rule if a state government breaks down. In daily running of the state the Chief Minister holds the real power.",
    facts: [["Term", "5 years, but serves at the President's pleasure"], ["Can be removed by", "The President, on the Centre's advice"], ["Real power", "Mostly ceremonial; matters most in a hung assembly or a crisis"]],
    terms: [["President's Rule", "The Centre takes over a state's administration; the Governor reports that it is needed."]],
  },
  lg: {
    plain: "The Centre's appointee who heads a Union Territory. In Delhi, Puducherry and Jammu & Kashmir there is also an elected government, but the Lieutenant Governor keeps important powers over it.",
    facts: [["Term", "At the President's pleasure"], ["Appointed by", "The President, on the Centre's advice"]],
    terms: [["Union Territory", "An area governed directly or mostly by the Centre rather than a full state government."]],
  },
  admin: {
    plain: "A Centre-appointed official who runs a smaller Union Territory that has no elected assembly. Acts on behalf of the Union Government.",
    facts: [["Term", "At the President's pleasure"]],
  },
  mp: {
    plain: "Elected by the voters of one constituency to sit in the Lok Sabha. MPs make national laws, question the government and approve the budget. The party or coalition with 272 or more MPs forms the government.",
    facts: [["Term", "5 years"], ["Chosen by", "Voters of one constituency"], ["Can lose the seat by", "Disqualification, such as defecting from their party or a serious conviction"]],
    terms: [CONSTITUENCY, FPTP, ["Whip", "A party order to vote a certain way. Breaking it can risk disqualification under the anti-defection law."]],
  },
  rsmp: {
    plain: "A member of the Rajya Sabha, the upper house. Most are elected by the MLAs of their state; 12 are nominated by the President for expertise in fields like art or science. The house reviews laws and can delay them, but the Lok Sabha has the final say on money bills.",
    facts: [["Term", "6 years; one-third retire every 2 years"], ["Chosen by", "State MLAs, or nominated by the President"], ["Can lose the seat by", "Disqualification, like any MP"]],
    terms: [["Single transferable vote", "A ranked-choice voting method used to elect Rajya Sabha members."]],
  },
  mla: {
    plain: "Elected by the voters of one constituency to sit in the state's Vidhan Sabha. MLAs make state laws, pass the state budget, and vote to decide who is Chief Minister.",
    facts: [["Term", "5 years"], ["Chosen by", "Voters of one assembly constituency"], ["Can lose the seat by", "Disqualification, such as defecting from their party"]],
    terms: [CONSTITUENCY, FPTP],
  },
  speaker: {
    plain: "The presiding officer of the Lok Sabha. Runs debates, keeps order, decides who speaks, and rules on whether an MP should be disqualified for defecting.",
    facts: [["Chosen by", "Lok Sabha members, from among themselves"]],
  },
  lop: {
    plain: "The leader of the largest party not in government. Holds Cabinet-rank status, leads the opposition's questions to the government, and sits on committees that pick officials such as the Chief Election Commissioner.",
    facts: [["Needs", "Their party must hold at least 10% of the seats"]],
  },
  deputyChair: {
    plain: "Presides over the Rajya Sabha when the Chairman (the Vice President) is absent.",
    facts: [["Chosen by", "Rajya Sabha members, from among themselves"]],
  },
  cji: {
    plain: "Head of the Indian judiciary and of the Supreme Court. Decides which judges hear which cases and heads the collegium that recommends judges for appointment. Independent of the government.",
    facts: [["Retires at", "65"], ["Can be removed by", "A rare process in Parliament, like other Supreme Court judges"]],
  },
  cec: {
    plain: "Heads the Election Commission, the independent body that runs national and state elections, draws up the rules during campaigns (the Model Code of Conduct) and manages the voter rolls.",
    facts: [["Term", "6 years or until age 65, whichever comes first"]],
    terms: [["Model Code of Conduct", "Rules parties and governments must follow once elections are announced."]],
  },
  ag: {
    plain: "The government's chief legal adviser and its main lawyer in the Supreme Court.",
    facts: [["Serves", "At the President's pleasure"]],
  },
  "lok-sabha": {
    plain: "The lower house of Parliament, directly elected by voters. Makes laws, controls taxes and spending, and the government survives only while it has the confidence of this house.",
    terms: [MAJORITY, CONSTITUENCY],
  },
  "rajya-sabha": {
    plain: "The upper house of Parliament, representing the states. Reviews and can delay laws but cannot bring down the government. It is a permanent body that can never be dissolved; a third of its members retire every two years.",
  },
  cabinet: {
    plain: "The ministers who run the departments of the central government, led by the Prime Minister. It has three ranks: Cabinet Ministers (the inner circle), Ministers of State (Independent Charge) and Ministers of State who assist.",
    terms: [["Portfolio", "The department or area of government a minister is in charge of."]],
  },
  council: {
    plain: "The ministers who run the departments of a state government, led by the Chief Minister. All of them answer to the Vidhan Sabha.",
  },
  vs: {
    plain: "The elected state assembly and the state's law-making body. The party or coalition with a majority in it picks the Chief Minister.",
    terms: [MAJORITY, CONSTITUENCY],
  },
  states: { plain: "India has 28 states. Each has an elected government led by a Chief Minister, with a Governor appointed by the President as formal head." },
  uts: { plain: "Union Territories are governed by the Centre through the President's appointees. Delhi, Puducherry and Jammu & Kashmir also have elected assemblies and Chief Ministers." },
  region: { plain: "A loose grouping of neighbouring states, used here only to organise the chart. It has no government of its own." },
  districts: { plain: "States are divided into districts for administration. Each district is run by a District Collector, a civil-service officer rather than an elected politician." },
  district: {
    plain: "A district is the basic unit of administration inside a state. It is run day to day by a District Collector, a civil-service officer posted by the state government. The elected politicians connected to a district are its MLAs and MPs.",
    terms: [["District Collector", "The top administrator of a district, appointed by the state from the Indian Administrative Service."]],
  },
  group: { plain: "A group of members from one state." },
};

export const PARTY_INFO = {
  BJP: ["Bharatiya Janata Party", "Founded 1980. Right-wing and Hindu nationalist in outlook; the largest party in the Lok Sabha."],
  INC: ["Indian National Congress", "Founded 1885, India's oldest party and the main national alternative to the BJP. Centre to centre-left."],
  AAP: ["Aam Aadmi Party", "Founded in 2012 out of the anti-corruption movement. Focuses on welfare, schools and healthcare."],
  AITC: ["All India Trinamool Congress", "Regional party of West Bengal, founded in 1998 by Mamata Banerjee."],
  DMK: ["Dravida Munnetra Kazhagam", "Tamil Nadu party in the Dravidian movement, built around social justice and regional identity."],
  AIADMK: ["All India Anna Dravida Munnetra Kazhagam", "Tamil Nadu Dravidian party that split from the DMK in 1972."],
  TVK: ["Tamilaga Vettri Kazhagam", "Tamil Nadu party founded in 2024 by the film actor Vijay."],
  TDP: ["Telugu Desam Party", "Andhra Pradesh regional party founded in 1982 by the actor N. T. Rama Rao."],
  YSRCP: ["Yuvajana Sramika Rythu Congress Party", "Andhra Pradesh regional party founded in 2011 by Y. S. Jagan Mohan Reddy."],
  JSP: ["Jana Sena Party", "Andhra Pradesh party founded in 2014 by the actor Pawan Kalyan."],
  "JD(U)": ["Janata Dal (United)", "Bihar-based party that grew out of the socialist Janata movement."],
  RJD: ["Rashtriya Janata Dal", "Bihar party founded in 1997 by Lalu Prasad Yadav."],
  SP: ["Samajwadi Party", "Uttar Pradesh party founded in 1992 by Mulayam Singh Yadav; socialist roots."],
  BSP: ["Bahujan Samaj Party", "Founded in 1984 by Kanshi Ram to represent Dalits and other marginalised communities."],
  SHS: ["Shiv Sena", "Maharashtra regional party founded in 1966 by Bal Thackeray. Split into two factions in 2022."],
  "SHS(UBT)": ["Shiv Sena (Uddhav Balasaheb Thackeray)", "The faction led by Uddhav Thackeray after Shiv Sena split in 2022."],
  NCP: ["Nationalist Congress Party", "Maharashtra party founded in 1999 by Sharad Pawar. Split into two factions in 2023."],
  "NCP(SP)": ["Nationalist Congress Party (Sharadchandra Pawar)", "The faction led by Sharad Pawar after the NCP split in 2023."],
  BJD: ["Biju Janata Dal", "Odisha party founded in 1997 by Naveen Patnaik."],
  BRS: ["Bharat Rashtra Samithi", "Telangana party founded in 2001 as the TRS to win statehood for Telangana; renamed in 2022."],
  JMM: ["Jharkhand Mukti Morcha", "Jharkhand party that grew out of the movement for a separate tribal state."],
  "CPI(M)": ["Communist Party of India (Marxist)", "Left party, strongest in Kerala, Tripura and West Bengal."],
  CPI: ["Communist Party of India", "India's oldest communist party, founded in 1925."],
  JKNC: ["Jammu & Kashmir National Conference", "Regional party of Jammu & Kashmir, founded in 1932."],
  "JD(S)": ["Janata Dal (Secular)", "Karnataka regional party founded in 1999."],
  IUML: ["Indian Union Muslim League", "Kerala-based party representing Muslim interests."],
  AIMIM: ["All India Majlis-e-Ittehadul Muslimeen", "Hyderabad-based party that represents Muslim voters."],
  NPP: ["National People's Party", "Founded in 2013 by P. A. Sangma; strongest in Meghalaya and the Northeast."],
  NPF: ["Naga People's Front", "Nagaland regional party."],
  ZPM: ["Zoram People's Movement", "Mizoram party formed in 2017 from a group of smaller parties and civic groups."],
  SKM: ["Sikkim Krantikari Morcha", "Sikkim regional party founded in 2013."],
  IND: ["Independent", "Not backed by any political party. Independents win seats on their own name."],
};

export const reservedSeat = (c = "") => {
  if (/\(SC\)/.test(c)) return "Scheduled Caste (SC). Only SC candidates can contest this seat, but every voter in the area votes.";
  if (/\(ST\)/.test(c)) return "Scheduled Tribe (ST). Only ST candidates can contest this seat, but every voter in the area votes.";
  return "";
};
