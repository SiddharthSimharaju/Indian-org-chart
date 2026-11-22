// Japan. Constitutional text is hand-written from the Constitution of Japan (English, japaneselawtranslation.go.jp), the Court Act and official government pages; people come from Wikipedia (see scrape).
const NAMES = {
  "Independent politician": "Independent", Independent: "Independent", "Liberal Democratic": "Liberal Democratic Party", LDP: "Liberal Democratic Party",
  "Nippon Ishin no Kai": "Japan Innovation Party", Ishin: "Japan Innovation Party", // the same party under its Japanese name
  "Centrist Reform Alliance": "Centrist Reform Alliance (former member)",
};
const norm = (s) => { s = (s || "").replace(/\[.*?\]/g, "").replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim(); return NAMES[s] || s; };

export default {
  id: "japan", name: "Japan", iso2: "JP", flag: "🇯🇵", continent: "Asia", locale: "en-GB",
  system: "Parliamentary constitutional monarchy",
  description: "An interactive org chart of Japanese politics: the Emperor, Prime Minister, Cabinet, House of Representatives, House of Councillors, Supreme Court and the governors of all 47 prefectures.",
  place: "Government and the Diet of Japan",
  summary: "A parliamentary constitutional monarchy. The Emperor is a symbol of the State with no powers of government. The Diet, made up of the House of Representatives and the House of Councillors, is the highest organ of state power and chooses the Prime Minister, who leads a Cabinet that answers to it.",
  rootElectedBy: "Japan's constitution took effect in 1947. Under it the people hold sovereign power, exercised through the Diet, whose members are elected by voters.",
  rootReportsTo: "The people, through the elected Diet",
  rootFacts: [["System", "Parliamentary constitutional monarchy"], ["Head of state", "The Emperor (symbolic)"], ["Diet", "House of Representatives (465) and House of Councillors (248)"]],
  stats: [["Prefectures", 47], ["Representatives", 465], ["Councillors", 248]],
  nonpartisan: ["head-of-state", "justice", "regional-head"],
  sources: [
    "https://www.japaneselawtranslation.go.jp/en/laws/view/174",
    "https://www.japaneselawtranslation.go.jp/en/laws/view/4150/en",
    "https://www.japan.go.jp/japan/index.html",
    "https://www.courts.go.jp/english/vc-files/courts-en/file/2018_Court_System_of_Japan.pdf",
    "https://www.soumu.go.jp/main_content/000770124.pdf",
    "https://www.sangiin.go.jp/japanese/joho1/kousei/giin/221/giin.htm",
    "https://en.wikipedia.org/wiki/Democratic_Reform_Party_(Japan,_2026)",
  ],
  normParty: norm,
  partyColors: { "Liberal Democratic Party": "#D7263D", "Constitutional Democratic Party of Japan": "#1E4FA3", Komeito: "#F5A800", "Japanese Communist Party": "#C0001A", Independent: "#6B7280", "Centrist Reform Alliance (former member)": "#A8B0BA", "Centrist Reform Alliance (winding up)": "#A8B0BA", "Democratic Reform Party (民主改革の会)": "#6C8EBF", "Independent (no caucus)": "#6B7280", "Independent (Speaker)": "#6B7280" },
  partyInfo: {
    "Liberal Democratic Party": ["Liberal Democratic Party", "Conservative party founded in 1955 that has governed for most of the time since then."],
    Komeito: ["Komeito", "Centrist party founded in 1964 with ties to the lay Buddhist organisation Soka Gakkai."],
    "Japanese Communist Party": ["Japanese Communist Party", "Left-wing party founded in 1922."],
    Independent: ["Independent", "Not a member of a political party."],
    "Democratic Party For the People": ["Democratic Party For the People", "Founded in 2018; re-formed in its current form in 2020."],
    "Japan Innovation Party": ["Japan Innovation Party", "Founded in 2015."],
    "Constitutional Democratic Party of Japan": ["Constitutional Democratic Party of Japan", "Founded in 2017; re-formed in 2020."],
    Sanseitō: ["Sanseitō", "Founded in 2020."],
    "Team Mirai": ["Team Mirai", "Founded in 2025."],
    "Reiwa Shinsengumi": ["Reiwa Shinsengumi", "Founded in 2019."],
    "Democratic Reform Party (民主改革の会)": ["Democratic Reform Party (民主改革の会)", "Launched on 24 September 2026 with 18 representatives who had left the Centrist Reform Alliance (jiji.com). Minshu Kaikaku no Kai is the official Japanese name; an official English name is unconfirmed."],
    "Centrist Reform Alliance (winding up)": ["Centrist Reform Alliance", "Formed in 2026; most of its members left in September 2026 and the remaining member, Sō Watanabe, stayed to wind it up (jiji.com, 24 September 2026)."],
  },

  headOfState: {
    label: "Emperor", badge: "EMP", place: "The Imperial Household", icon: "crown",
    card: { where: ["Jurisdiction", "Japan"], chosen: "Heredity", term: "For life" },
    stats: [["Term", "For life"], ["Role", "Symbol of the State"], ["Acts on", "The Cabinet's advice and approval (Article 3)"]],
    text: {
      electedBy: "Hereditary. The throne is dynastic and passes according to the Imperial House Law, which the Diet passes (Article 2 of the Constitution).",
      reportsTo: "The Emperor's position derives \"from the will of the people with whom resides sovereign power\" (Article 1). Every act in matters of state needs the advice and approval of the Cabinet (Article 3).",
      plain: "The head of state in a purely ceremonial role. The Emperor is \"the symbol of the State and of the unity of the people\" and has no powers related to government (Articles 1 and 4). On the Cabinet's advice and approval, the Emperor performs formal acts such as appointing the Prime Minister (as designated by the Diet), appointing the Chief Justice (as designated by the Cabinet), promulgating laws and convening the Diet (Articles 6 and 7).",
      plainFacts: [["Term", "For life"], ["Chosen by", "Birth, under the Imperial House Law"], ["Can be removed by", "Cannot be removed; a Regent acts if the Emperor cannot perform his duties (Article 5)"], ["Real power", "None in government; ceremonial acts only"]],
      terms: [["Imperial House Law", "The law, passed by the Diet, that sets the rules of succession to the throne and the Imperial Household."], ["Matters of state", "The formal ceremonial acts listed in the Constitution, which the Emperor performs on the Cabinet's advice."]],
    },
  },
  headOfGov: {
    label: "Prime Minister", badge: "PM", place: "Prime Minister's Office (Kantei)", icon: "briefcase",
    card: { where: ["Jurisdiction", "Japan"], chosen: "Diet, then Emperor", term: "No fixed term" },
    stats: (p) => [["Party", p.party || "—"], ["Designated by", "The Diet"], ["Office", "Kantei, Tokyo"]],
    text: {
      electedBy: "Designated from among the Diet's members by a resolution of the Diet, then appointed by the Emperor. If the two houses disagree, the House of Representatives' choice prevails (Articles 6 and 67).",
      reportsTo: "The Diet, and above all the House of Representatives: the Cabinet must resign en masse if that house passes a no-confidence resolution, unless it is dissolved within ten days (Article 69).",
      plain: "The head of government. Heads the Cabinet, appoints and can dismiss the other Ministers of State (most of whom must be Diet members) and directs the government's work. The Prime Minister and all ministers must be civilians (Articles 66 and 68).",
      plainFacts: [["Term", "No fixed term; the Cabinet resigns en masse after each general election of the House of Representatives and the Diet then designates a Prime Minister again"], ["Chosen by", "A Diet resolution; the House of Representatives prevails"], ["Can be removed by", "A no-confidence vote in the House of Representatives, or resigning"], ["Powers", "Leads the Cabinet, which holds executive power (Article 65)"]],
      terms: [["Designation", "The Diet's vote that chooses the Prime Minister before the Emperor formally appoints them."], ["Dissolution", "Ending the House of Representatives' term early to hold a general election. The Emperor does so on the Cabinet's advice."]],
    },
  },
  cabinet: {
    label: "Cabinet", badge: "CAB", place: "The Cabinet of Japan", icon: "users", membersLabel: "Ministers",
    stats: (m) => [["Ministers listed", m.length], ["Led by", "The Prime Minister"]],
    text: {
      electedBy: "The Prime Minister appoints and can dismiss the Ministers of State. A majority of them must be chosen from among Diet members (Article 68).",
      reportsTo: "The Prime Minister, who heads it. The Cabinet is collectively responsible to the Diet for its exercise of executive power (Article 66).",
      plain: "The Prime Minister and the Ministers of State, who head the ministries and take the government's decisions together. The Cabinet exercises executive power and must resign en masse if the House of Representatives passes a no-confidence resolution and is not dissolved within ten days.",
      plainFacts: [["Term", "While the Prime Minister's Cabinet stays in office"], ["Chosen by", "The Prime Minister"], ["Can be removed by", "The Prime Minister dismisses ministers; the whole Cabinet resigns on a lost no-confidence vote"]],
      terms: [["Minister of State", "A member of the Cabinet, usually heading a ministry."], ["Collective responsibility", "The Cabinet as a whole answers to the Diet for its decisions."]],
    },
    memberPlain: {
      plain: "A Minister of State in the Cabinet, usually the head of a ministry or agency. Appointed by the Prime Minister, who can dismiss them at will. A majority of ministers must be Diet members.",
      facts: [["Term", "While the Prime Minister's Cabinet stays in office"], ["Chosen by", "The Prime Minister"], ["Must be", "A civilian; a majority of ministers must be Diet members"]],
    },
    minister: {
      badge: "MIN", card: { where: ["Portfolio"], chosen: "Prime Minister", term: "At PM's pleasure" },
      electedBy: "Appointed by the Prime Minister.", reportsTo: "The Prime Minister",
      plain: "A Minister of State who usually heads a ministry or agency and answers to the Diet for it.",
      plainFacts: [["Term", "While the Prime Minister's Cabinet stays in office"], ["Chosen by", "The Prime Minister"]],
    },
  },
  chambers: {
    reps: {
      label: "House of Representatives", badge: "HoR", place: "Lower house", seats: 465, leaderTitle: "Speaker", memberLabel: "Member of the House of Representatives", memberBadge: "MHR", icon: "landmark",
      card: { where: ["Seat"], chosen: "Voters", term: "4 years, unless dissolved" },
      stats: (d) => [["Seats", 465], ["Majority mark", 233], ["Speaker", d.leader?.name || "—"]],
      text: {
        electedBy: "465 members: 289 elected in single-member constituencies and 176 by proportional representation in regional blocs. The term is four years, unless the House is dissolved earlier (Article 45), which is frequent. A general election must follow within 40 days of a dissolution (Article 54).",
        reportsTo: "The voters. The Cabinet answers to it and must resign if it passes a no-confidence resolution (Article 69).",
        plain: "The more powerful house of the Diet. Its choice of Prime Minister prevails if the houses disagree (Article 67), and it can pass an ordinary bill over the upper house's objection with a two-thirds majority of members present (Article 59). Only this house can bring down the Cabinet.",
        plainFacts: [["Seats", "465 (289 constituency, 176 proportional)"], ["Majority mark", "233"], ["Term", "4 years, unless dissolved"]],
        terms: [["Single-member constituency", "An area that elects one member, the candidate with the most votes."], ["Proportional representation", "Seats given to parties in regional blocs in proportion to their votes."], ["Dissolution", "Ending the House's term early to call a general election."]],
      },
      memberPlain: {
        plain: "Elected either to represent a single-member constituency or from a party's proportional-representation list in a regional bloc. Members vote on laws and the budget, take part in designating the Prime Minister and can vote to bring down the Cabinet.",
        facts: [["Term", "4 years, unless the House is dissolved"], ["Chosen by", "Voters, in a constituency or from a party list"], ["Cannot also be", "A member of the House of Councillors (Article 48)"]],
        terms: [["Proportional representation", "Seats given to parties in proportion to their share of the vote in a regional bloc."]],
      },
    },
    councillors: {
      label: "House of Councillors", badge: "HoC", place: "Upper house", seats: 248, leaderTitle: "President", memberLabel: "Member of the House of Councillors", memberBadge: "MHC", icon: "landmark",
      card: { where: ["Seat"], chosen: "Voters", term: "6 years" },
      stats: (d) => [["Seats", 248], ["Half elected every", "3 years"], ["President", d.leader?.name || "—"]],
      text: {
        electedBy: "248 members serving six-year terms, with half elected every three years (Article 46): 148 in prefectural constituencies and 100 by proportional representation. It is not dissolved when the House of Representatives is.",
        reportsTo: "The voters. The Cabinet is not removed by this house.",
        plain: "The upper house of the Diet. It reviews and can reject or amend bills, but the House of Representatives can pass an ordinary bill over its objection with a two-thirds majority (Article 59) and prevails on the Prime Minister's designation, the budget and treaties. Both houses must pass a bill for it to become law, except as the Constitution says.",
        plainFacts: [["Seats", "248"], ["Term", "6 years; half elected every 3 years"], ["Chosen by", "Voters, in constituencies and by proportional representation"]],
        terms: [["Half renewal", "Half the house is elected every three years, so it is never replaced all at once."]],
      },
      memberPlain: {
        plain: "Elected in a prefectural constituency or from a party list to sit in the upper house. Councillors vote on laws, the budget and treaties and question the government.",
        facts: [["Term", "6 years; half the house is elected every 3 years"], ["Chosen by", "Voters, in a prefecture or from a national party list"], ["Cannot also be", "A member of the House of Representatives (Article 48)"]],
      },
    },
  },
  judiciary: {
    label: "Supreme Court", badge: "SC", place: "Highest court", icon: "scale", chiefTitle: "Chief Justice of the Supreme Court", memberTitle: "Justice of the Supreme Court", membersLabel: "Justices",
    card: { where: ["Court", "Supreme Court"], chosen: "Cabinet", term: "Until age 70" },
    stats: (j) => [["Justices", j.length], ["Retirement age", 70], ["Review by voters", "Every ~10 years"]],
    text: {
      electedBy: "The Cabinet designates the Chief Justice and the Emperor appoints him or her; the other justices are appointed by the Cabinet (Articles 6 and 79). Each appointment is reviewed by voters at the first general election of the House of Representatives after it, and again ten years later. Justices retire at 70.",
      reportsTo: "The Constitution and the law. Independent of the Diet and the Cabinet.",
      plain: "The court of last resort, with the power to decide whether any law, order, regulation or official act is constitutional (Article 81). It is made up of a Chief Justice and 14 other justices.",
      plainFacts: [["Justices", "15, including the Chief Justice"], ["Retirement age", "70"], ["Chosen by", "The Cabinet; the Chief Justice is appointed by the Emperor"]],
      terms: [["National review", "A vote by all voters at a general election on whether a justice should keep their post. If most vote to dismiss, the justice is removed."]],
    },
    memberPlain: {
      plain: "A justice of Japan's highest court. Justices hear cases in smaller benches or, for the most important questions, as the full Grand Bench, and decide questions of law and constitutionality.",
      facts: [["Term", "Until age 70"], ["Chosen by", "The Cabinet"], ["Reviewed by", "Voters, at a general election after appointment and every ten years after"]],
    },
    itemText: {
      electedBy: "Appointed by the Cabinet (the Chief Justice is designated by the Cabinet and appointed by the Emperor).", reportsTo: "The Supreme Court of Japan",
      plain: "A justice of Japan's highest court, which decides whether laws and official acts are constitutional.", plainFacts: [["Term", "Until age 70"], ["Chosen by", "The Cabinet"]],
    },
  },
  regions: {
    label: "Prefectures", place: "Governors", icon: "map", headLabel: "Governor",
    card: { where: ["Prefecture"], chosen: "Prefecture voters", term: "4 years" },
    stats: (r) => [["Prefectures", 47], ["Governors listed", r.length]],
    text: {
      electedBy: "Japan is divided into 47 prefectures, each with an elected governor and assembly.",
      reportsTo: "The voters of each prefecture.",
      plain: "Japan has 47 prefectures. The chief executive of each is elected by direct popular vote of the residents, as are the members of its assembly (Article 93 of the Constitution).",
      plainFacts: [["Prefectures", "47"], ["Governor's term", "4 years"]],
      terms: [["Prefecture", "Japan's first-level administrative division, such as Tokyo or Hokkaido."]],
    },
    memberPlain: {
      plain: "The chief executive of a prefecture, directly elected by its residents. Governors run the prefectural administration, propose its budget to the prefectural assembly and carry out national tasks assigned to the prefecture.",
      facts: [["Term", "4 years"], ["Chosen by", "Direct vote of the prefecture's residents"], ["Cannot also be", "A Diet member or assembly member"]],
    },
    headText: {
      electedBy: "Elected by direct popular vote of the prefecture's residents (Article 93 of the Constitution).",
      reportsTo: "The voters of the prefecture, and a prefectural assembly that is also directly elected.",
      plain: "The elected chief executive of a prefecture. Runs the prefectural administration and proposes its budget to the assembly.",
      plainFacts: [["Term", "4 years"], ["Chosen by", "Direct vote of the prefecture's residents"]],
    },
  },

  async scrape(w) {
    const { incumbent, partyOfPage, infoboxRow, allTables, T, links, nameOnly, dateOf, grid } = w;
    const { getText, nameKey } = await import("../official-sources.mjs");
    const nm = (title, text) => nameOnly(title || text || "");
    // Party cell: the page the abbreviation links to gives the full party name.
    const pf = ($, cell) => { const L = links($, cell)[0]; return L ? norm(nameOnly(L.title)) : norm(T($, cell)); };
    const person = async (page) => { const i = await incumbent(page); return { title: i.title, name: nm(i.title, i.name), since: i.since }; };

    const reign = await infoboxRow("Naruhito", /^Reign$/);
    const headOfState = { title: "Naruhito", name: "Naruhito", since: dateOf(reign) };
    const headOfGov = await person("Prime Minister of Japan");
    console.log("emperor", headOfState.name, headOfState.since, "| PM", headOfGov.name);

    // Cabinet: the reshuffled cabinet table, current ministers only
    const { $: cb, tables: ct } = await allTables("Second Takaichi cabinet", 5);
    const tbl = ct.find((t) => /reshuffled cabinet/i.test(cb(t.t).prevAll(".mw-heading").first().find("h2,h3,h4").first().text()) && t.h[0] === "portfolio");
    const by = new Map();
    for (const r of tbl.g.slice(1)) {
      if (r[0] === r[1]) continue;
      const L = links(cb, r[3])[0]; if (!L) continue;
      if (T(cb, r[6])) continue; // has a "left office" date
      const parts = [...new Set(T(cb, r[0]).replace(/([a-z])(Minister|Chairman|Chief|Chair)/g, "$1|$2").split("|").map((x) => x.trim()).filter(Boolean))];
      const office = parts[0] || T(cb, r[0]);
      if (/^Prime Minister$/i.test(office)) continue;
      const e = by.get(L.title) || { title: L.title, name: nm(L.title, L.text), since: dateOf(T(cb, r[5])), offices: [] };
      for (const p of parts.length ? parts : [office]) if (!e.offices.includes(p)) e.offices.push(p);
      by.set(L.title, e);
    }
    const ministers = [...by.values()].map((m) => ({ ...m, office: m.offices[0], role: m.offices.join(" · "), dept: "" }));
    // (ministers are Diet members; their party is filled in from the chamber lists below)
    console.log("ministers", ministers.length);

    // House of Representatives 2026: constituency tables (with prefecture header rows) and proportional-representation tables
    const { $: hr, tables: ht } = await allTables("Representatives elected in the 2026 Japanese general election", 3);
    const reps = [];
    for (const t of ht) {
      const h0 = t.g[0].map((c) => T(hr, c)), h1 = (t.g[1] || []).map((c) => T(hr, c));
      if (h1[0] === "Constituency" && h1.includes("Elected Member")) {
        let pref = h0[0].replace(/\s*Prefecture$/i, "");
        for (const r of t.g.slice(2)) {
          const c0 = T(hr, r[0]);
          if (r[0] === r[1] && r[1] === r[3]) { pref = c0.replace(/\s*Prefecture$/i, ""); continue; }
          if (c0 === "Constituency" || T(hr, r[3]) === "Elected Member") continue; // repeated header row inside the table
          const L = links(hr, r[3])[0], name = nm(L?.title, T(hr, r[3])); if (!name) continue;
          reps.push({ title: L?.title, name, seat: c0.replace(/-/g, " "), group: pref, party: pf(hr, r[2]), since: "" });
        }
      } else if (h0[0] === "#" && h0.includes("Elected Member")) {
        for (const r of t.g.slice(1)) {
          const L = links(hr, r[3])[0], name = nm(L?.title, T(hr, r[3])); if (!name) continue;
          const ran = T(hr, r[4]);
          reps.push({ title: L?.title, name, seat: "Proportional representation" + (ran && !/^PR only$/i.test(ran) ? ` (ran in ${ran.replace(/-/g, " ")})` : ""), group: "Proportional representation", party: pf(hr, r[2]), since: "" });
        }
      }
    }
    const nSmd = reps.filter((m) => m.group !== "Proportional representation").length;
    console.log("representatives", reps.length, "(constituency", nSmd, ", proportional", reps.length - nSmd, ")");
    // ---- House of Representatives: the Shugiin's own member list (as of 28 September 2026) gives the sitting count and each member's caucus ----
    const { getBuffer, jaNameKey, jaNameParts, jaReadingKey, jaReadingParts, jaNorm } = await import("../official-sources.mjs");
    const SH = (n) => `https://www.shugiin.go.jp/internet/itdb_annai.nsf/html/statics/syu/${n}giin.htm`;
    const shRows = [];
    for (let n = 1; n <= 10; n++) {
      const html = new TextDecoder("shift_jis").decode(await getBuffer(SH(n), { key: `jp-shugiin-${n}giin.html` }));
      for (const m of html.matchAll(/<TR VALIGN = top><TD class="sh1td5"><TT class="sh1tt1"><a\s+href='[^']*'>([^<]*)<\/a>[\s\S]*?<TD class="sh1td6"><TT class="sh1tt1">([^<]*)<\/TT><\/TD>\s*<TD class="sh1td7"><TT class="sh1tt1"><CENTER>([^<]*)<\/CENTER>[\s\S]*?<TD class="sh1td5"><TT class="sh1tt1">([^<]*)<\/TT>/g))
        shRows.push({ kanji: m[1].replace(/君$/, "").replace(/[\s\u3000]+/g, ""), key: jaReadingKey(m[2]), ...jaReadingParts(m[2]), caucus: m[3].replace(/\s+/g, ""), seat: m[4].replace(/\s+/g, "") });
    }
    const shCaucus = shRows.reduce((a, r) => ((a[r.caucus] = (a[r.caucus] || 0) + 1), a), {});
    console.log("shugiin.go.jp (28 Sep 2026):", shRows.length, "members | caucuses", JSON.stringify(shCaucus));
    const PREF_JP = { 北海道: "Hokkaido", 青森: "Aomori", 岩手: "Iwate", 宮城: "Miyagi", 秋田: "Akita", 山形: "Yamagata", 福島: "Fukushima", 茨城: "Ibaraki", 栃木: "Tochigi", 群馬: "Gunma", 埼玉: "Saitama", 千葉: "Chiba", 東京: "Tokyo", 神奈川: "Kanagawa", 新潟: "Niigata", 富山: "Toyama", 石川: "Ishikawa", 福井: "Fukui", 山梨: "Yamanashi", 長野: "Nagano", 岐阜: "Gifu", 静岡: "Shizuoka", 愛知: "Aichi", 三重: "Mie", 滋賀: "Shiga", 京都: "Kyoto", 大阪: "Osaka", 兵庫: "Hyogo", 奈良: "Nara", 和歌山: "Wakayama", 鳥取: "Tottori", 島根: "Shimane", 岡山: "Okayama", 広島: "Hiroshima", 山口: "Yamaguchi", 徳島: "Tokushima", 香川: "Kagawa", 愛媛: "Ehime", 高知: "Kochi", 福岡: "Fukuoka", 佐賀: "Saga", 長崎: "Nagasaki", 熊本: "Kumamoto", 大分: "Oita", 宮崎: "Miyazaki", 鹿児島: "Kagoshima", 沖縄: "Okinawa" };
    const seatKeyJp = (seat) => { const m = seat.match(/^(.+?)(\d+)$/); return m && PREF_JP[m[1]] ? `${jaNorm(PREF_JP[m[1]])}|${m[2]}` : null; };
    const seatKeyEn = (seat) => { const m = seat.match(/^(.+?)\s+(\d+)(?:st|nd|rd|th)$/); return m ? `${jaNorm(m[1])}|${m[2]}` : null; };
    // Second pass for leftovers: pair a member with a record only when exactly one unused record shares the family name or the given name (spelling differences such as Suda/Sudō, Jesús/ヘスス).
    const partialMatch = (ours, theirs, used, label) => {
      for (const m of [...ours.unmatched]) {
        const { fam, giv } = jaNameParts(m.name);
        const c = theirs.filter((x) => !used.has(x) && ((fam && x.fam === fam) || (giv && x.giv === giv)));
        if (c.length === 1) { used.add(c[0]); m[label] = c[0]; ours.unmatched.splice(ours.unmatched.indexOf(m), 1); console.log(`  matched by partial name (${label}): ${m.name} = ${c[0].kanji}`); }
      }
    };
    const shByKey = new Map(); shRows.forEach((r) => { if (!shByKey.has(r.key)) shByKey.set(r.key, []); shByKey.get(r.key).push(r); });
    const used = new Set(), unmatched = [];
    for (const m of reps) { const r = (shByKey.get(jaNameKey(m.name)) || []).find((x) => !used.has(x)); if (r) { used.add(r); m.sh = r; } else unmatched.push(m); }
    // fall back to the constituency for single-seat members whose romanisation differs
    for (const m of [...unmatched]) { const k = seatKeyEn(m.seat); const r = k && shRows.find((x) => !used.has(x) && seatKeyJp(x.seat) === k); if (r) { used.add(r); m.sh = r; unmatched.splice(unmatched.indexOf(m), 1); console.log("  matched by constituency:", m.name, "=", r.kanji); } }
    partialMatch({ unmatched }, shRows, used, "sh");
    console.log("representatives not on the Shugiin list (removed):", unmatched.map((m) => `${m.name} (${m.party}, ${m.seat})`).join("; ") || "none", "| Shugiin members not matched:", shRows.filter((x) => !used.has(x)).map((x) => x.kanji).join(", ") || "none");
    const removedReps = unmatched.map((m) => m.name);
    reps.splice(0, reps.length, ...reps.filter((m) => m.sh));

    // The Centrist Reform Alliance broke up in September 2026 (jiji.com, 24 September 2026). Former members are labelled from the Democratic Reform Party's member list and the official caucus column.
    const DRP = "Democratic Reform Party (民主改革の会)";
    let drpMoved = 0;
    try {
      const { $: dr, tables: drt } = await allTables("Democratic Reform Party (Japan, 2026)", 3);
      const drpNames = new Set(drt.flatMap((t) => t.g.slice(1)).flatMap((r) => r.map((c) => links(dr, c)[0]?.title).filter(Boolean)));
      for (const m of reps) if (/^Centrist Reform Alliance/.test(m.party) && m.title && drpNames.has(m.title)) { m.party = DRP; drpMoved++; }
    } catch (e) { console.log("  DRP list unavailable:", e.message); }
    const K = (n) => jaNameKey(n), SO = K("So Watanabe"), IZUMI = K("Kenta Izumi"), OSHIMA = K("Atsushi Oshima");
    const noCaucus = (c) => /^(無|無所属|各派に属しない議員)$/.test(c);
    const CAUCUS_EN = { 自民: "LDP", 中道: "Chūdō", 維新: "Ishin", 国民: "DPFP", 参政: "Sanseitō", みらい: "Team Mirai", 共産: "JCP" };
    const relabel = { komeito: 0, independentNoCaucus: [], independentCaucus: 0 };
    for (const m of reps) {
      const k = K(m.name), c = m.sh.caucus;
      if (/^Centrist Reform Alliance/.test(m.party)) {
        if (k === SO) { m.party = "Centrist Reform Alliance (winding up)"; m.note = "Stayed in the Alliance when the other members left (jiji.com, 24 September 2026)"; }
        else if (k === OSHIMA) { m.party = "Independent (Chūdō caucus)"; m.note = "Did not join the Democratic Reform Party; joined the unified Chūdō caucus (jiji.com, 24 September 2026)"; relabel.independentCaucus++; }
        else if (k === IZUMI) { m.party = "Independent"; m.note = "Did not join the Democratic Reform Party (sakigake.jp, jiji.com)"; }
        else if (c === "中道") { m.party = "Komeito"; m.note = "Komeito-origin member; Komeito approved the return of 28 such members on 24 September 2026 (jiji.com)"; relabel.komeito++; }
        else { m.party = "Independent (no caucus)"; m.note = "Listed without a caucus on the Shugiin list (28 September 2026); party not stated"; relabel.independentNoCaucus.push(m.name); }
      } else if (m.party === "Independent" && !noCaucus(c)) { m.party = `Independent (${CAUCUS_EN[c] || c} caucus)`; relabel.independentCaucus++; }
    }
    const spk = await person("Speaker of the House of Representatives (Japan)");
    const spkMember = reps.find((m) => K(m.name) === K(spk.name));
    if (spkMember && noCaucus(spkMember.sh.caucus)) { spkMember.party = "Independent (Speaker)"; spkMember.note = "Listed without a caucus on the Shugiin list (28 September 2026), as Speakers conventionally are"; }
    spk.party = spkMember?.party || ""; spk.ref = spkMember?.ref;
    if (spkMember?.note) spk.note = spkMember.note;
    headOfGov.party = reps.find((m) => m.title === headOfGov.title)?.party || norm(await partyOfPage(headOfGov.title));
    const repTally = reps.reduce((a, m) => ((a[m.party] = (a[m.party] || 0) + 1), a), {});
    console.log("former Alliance members: DRP", drpMoved, "| Komeito", relabel.komeito, "| independent in a caucus", relabel.independentCaucus, "| independent, no caucus:", relabel.independentNoCaucus.join(", ") || "none", "| Speaker:", spk.name, spk.party);
    console.log("representative parties:", JSON.stringify(repTally));
    const drpNote = `The Centrist Reform Alliance broke up in September 2026: its members are labelled from the Democratic Reform Party's member list and the Shugiin's caucus column (${drpMoved} Democratic Reform, ${relabel.komeito} Komeito, the rest independent or still in the Alliance); the exact dissolution date was not confirmed`;
    const lowerVacant = 465 - shRows.length;
    const lowerNote = `House of Representatives: ${shRows.length} sitting and ${lowerVacant} vacant on the Shugiin's member list of 28 September 2026${removedReps.length ? `; ${removedReps.join(", ")} (reported dead on 17 September 2026 by the Hokkaido Shimbun) is no longer listed` : ""}`;
    const lower = { members: reps, official: { count: shRows.length, source: "https://www.shugiin.go.jp/internet/itdb_annai.nsf/html/statics/syu/1giin.htm (and 2giin to 10giin), as of 28 September 2026" }, leader: spk, others: [] };

    // House of Councillors
    const { $: cs, tables: cst } = await allTables("List of current senators of Japan", 3);
    const councillors = [];
    for (const t of cst) {
      const h = t.h;
      if (h[0] === "constituency" && h.includes("member")) {
        const nI = h.indexOf("member"), pI = nI + 2 <= t.g[0].length - 1 && /^party$/.test(h[nI + 1]) ? nI + 2 : nI + 1;
        for (const r of t.g.slice(1)) {
          const L = links(cs, r[nI])[0], name = nm(L?.title, T(cs, r[nI])); if (!name || /vacant/i.test(name)) continue;
          councillors.push({ title: L?.title, name, seat: `${T(cs, r[0])}`, group: T(cs, r[0]), party: pf(cs, r[pI]), since: T(cs, r[1]).match(/\d{4}/)?.[0] || "" });
        }
      } else if (h[0] === "party" && h.includes("member")) {
        const cls = cs(t.t).prevAll(".mw-heading").first().find("h2,h3,h4").first().text().replace(/\[.*?\]/g, "").trim();
        for (const r of t.g.slice(1)) {
          const L = links(cs, r[3])[0], name = nm(L?.title, T(cs, r[3])); if (!name || /vacant/i.test(name)) continue;
          councillors.push({ title: L?.title, name, seat: `Proportional representation (${cls})`, group: "Proportional representation", party: pf(cs, r[1]), since: cls.match(/\d{4}/)?.[0] || "" });
        }
      }
    }
    const nPr = councillors.filter((m) => m.group === "Proportional representation").length;
    console.log("councillors", councillors.length, "(constituency", councillors.length - nPr, ", proportional", nPr, ")");
    const pres = cst.find((t) => t.h[0] === "office" && t.h.includes("member"));
    const prow = pres.g.slice(1).find((r) => /^President/i.test(T(cs, r[0])));
    const pl = links(cs, prow[1])[0];
    // Official list: the Sangiin's current member list (222nd session). It gives the sitting count and each member's caucus.
    const SANGIIN = "https://www.sangiin.go.jp/japanese/joho1/kousei/giin/222/giin.htm";
    const sg = await getText(SANGIIN, { key: "jp-sangiin-giin-222.html" });
    const sgAsOf = sg.match(/令和\d+年\d+月\d+日現在/)?.[0] || "";
    const sgCells = [...sg.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].map((m) => [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/g)].map((c) => c[1].replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim()));
    const sgMembers = sgCells.map((cells) => { const i = cells.findIndex((c) => /^令和\d+年\d+月\d+日$/.test(c)); return i >= 4 ? { kanji: cells[i - 4].replace(/[\s\u3000]+/g, ""), key: jaReadingKey(cells[i - 3]), ...jaReadingParts(cells[i - 3]), caucus: cells[i - 2], seat: cells[i - 1] } : null; }).filter(Boolean);
    console.log("sangiin.go.jp (222nd session list", sgAsOf + "):", sgMembers.length, "members");
    const sgByKey = new Map(); sgMembers.forEach((r) => { if (!sgByKey.has(r.key)) sgByKey.set(r.key, []); sgByKey.get(r.key).push(r); });
    const sgUsed = new Set(), cUnmatched = [];
    for (const m of councillors) { const r = (sgByKey.get(jaNameKey(m.name)) || []).find((x) => !sgUsed.has(x)); if (r) { sgUsed.add(r); m.sg = r; } else cUnmatched.push(m); }
    console.log("councillors not on the current Sangiin list (removed):", cUnmatched.map((m) => `${m.name} (${m.party}, ${m.seat})`).join("; ") || "none", "| Sangiin members not matched:", sgMembers.filter((x) => !sgUsed.has(x)).map((x) => x.kanji).join(", ") || "none");
    partialMatch({ unmatched: cUnmatched }, sgMembers, sgUsed, "sg");
    // Name-order or stage-name differences confirmed by hand against the Sangiin list (kanji): Saya = Shioiri Sayaka, Takumi Shibata, LaSalle Ishii; Makoto Kage is paired with 古賀千景 only because they are the single unmatched CDP proportional-representation record on each side (name unverified).
    for (const [en, kj] of [["Saya", "塩入清香"], ["Shibata Takumi", "柴田巧"], ["LaSalle Ishii", "ラサール石井[石井朗夫]"], ["Makoto Kage", "古賀千景"]]) {
      const m = cUnmatched.find((x) => x.name === en), r = sgMembers.find((x) => x.kanji === kj && !sgUsed.has(x));
      if (m && r) { sgUsed.add(r); m.sg = r; cUnmatched.splice(cUnmatched.indexOf(m), 1); console.log(`  matched by hand: ${en} = ${kj}`); }
    }
    console.log("  unmatched Sangiin records:", JSON.stringify(sgMembers.filter((x) => !sgUsed.has(x)).map((x) => [x.kanji, x.caucus, x.seat])));
    console.log("councillors not on the current Sangiin list after partial matching (removed):", cUnmatched.map((m) => `${m.name} (${m.party}, ${m.seat})`).join("; ") || "none", "| Sangiin members not matched:", sgMembers.filter((x) => !sgUsed.has(x)).map((x) => x.kanji).join(", ") || "none");
    const removedCouncillors = cUnmatched.map((m) => m.name);
    councillors.splice(0, councillors.length, ...councillors.filter((m) => m.sg));
    // Independents who sit in a caucus are labelled with it; a member in no caucus is an independent (this fixes the President, whom Wikipedia lists under his former party)
    const cRelabel = { caucus: [], none: [] };
    for (const m of councillors) {
      const c = m.sg.caucus;
      if (noCaucus(c) && m.party !== "Independent") { cRelabel.none.push(`${m.name} (${m.party})`); m.party = "Independent"; }
      else if (m.party === "Independent" && !noCaucus(c)) { m.party = `Independent (${CAUCUS_EN[c] || c} caucus)`; cRelabel.caucus.push(m.name); }
    }
    console.log("councillors relabelled: now independent, no caucus:", cRelabel.none.join("; ") || "none", "| independents in a caucus:", cRelabel.caucus.join(", ") || "none");
    const presMember = councillors.find((m) => jaNameKey(m.name) === jaNameKey(nm(pl?.title, T(cs, prow[1]))));
    const upper = { members: councillors, official: { count: sgMembers.length, source: `${SANGIIN} (${sgAsOf})` }, leader: { title: pl?.title, name: nm(pl?.title, T(cs, prow[1])), party: presMember?.party || pf(cs, prow[2]), since: "", ref: presMember?.ref }, others: [] };
    const upperNote = `House of Councillors: ${sgMembers.length} sitting (${248 - sgMembers.length} vacant) on the Sangiin's own list${sgAsOf ? " (" + sgAsOf + ")" : ""}${removedCouncillors.length ? `; ${removedCouncillors.join(", ")} is no longer listed` : ""}`;
    console.log("president of councillors", upper.leader.name);
    const partyByTitle = new Map([...reps, ...councillors].filter((m) => m.title).map((m) => [m.title, m.party]));
    for (const m of ministers) m.party = partyByTitle.get(m.title) || norm(await partyOfPage(m.title));
    console.log("ministers without a party:", ministers.filter((m) => !m.party).map((m) => m.name).join(", ") || "none");

    // Supreme Court: Chief Justice + 14
    const { $: sc, tables: sct } = await allTables("Supreme Court of Japan", 8);
    const jt = sct.find((t) => t.h[0] === "title" && t.h[1] === "name");
    const judges = jt.g.slice(1).map((r) => { const L = links(sc, r[1])[0]; return { title: L?.title, name: nm(L?.title, T(sc, r[1])), chief: /Chief Justice/.test(T(sc, r[0])), since: "" }; }).filter((j) => j.name);
    console.log("justices", judges.length, judges[0]?.name);

    // Governors
    const { $: gv, tables: gt } = await allTables("List of current Japanese governors", 20);
    const gtbl = gt.find((t) => t.h[0] === "prefecture");
    const regions = gtbl.g.slice(1).map((r) => { const L = links(gv, r[2])[0], name = nameOnly(T(gv, r[0])).replace(/\s*list$/i, "").trim(); if (!L) return null; return { name, head: { title: L.title, name: nm(L.title, L.text), party: "", since: dateOf(T(gv, r[6])) } }; }).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));
    console.log("governors", regions.length);
    return { headOfState, headOfGov, ministers, chambers: { reps: lower, councillors: upper }, judges, regions, note: [lowerNote, drpNote, upperNote].filter(Boolean).join(". ") };
  },
};
