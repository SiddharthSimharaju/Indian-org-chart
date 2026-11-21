// India: everything country-specific the chart needs (data file, icons, colours, plain-English text, rules).
import { EXPLAIN, PARTY_INFO, reservedSeat } from "./india-explain.js";

const ACCENT = { North: "#0f766e", Northeast: "#7c3aed", East: "#db2777", West: "#ea580c", Central: "#ca8a04", South: "#2563eb", States: "#ff9933", "Union Territories": "#138808", Districts: "#0f766e", District: "#64748b" };
const REGION_ICON = { "region-north": "mountain", "region-northeast": "compass", "region-east": "sunrise", "region-west": "waves", "region-central": "target", "region-south": "sun" };
const ROLE_ICON = { minister: "briefcase", mla: "vote", mp: "vote", rsmp: "landmark", president: "flag", vp: "landmark", pm: "briefcase", cji: "scale", cec: "vote", ag: "book", governor: "shield", lg: "shield", admin: "shield", cm: "crown" };

const WIKI = { "lok-sabha": "Lok_Sabha", "rajya-sabha": "Rajya_Sabha", cabinet: "Union_Council_of_Ministers", states: "States_and_union_territories_of_India", uts: "Union_territory", "supreme-court": "Supreme_Court_of_India", "election-commission": "Election_Commission_of_India" };

export default {
  id: "india", name: "India", flag: "🇮🇳", dataUrl: "data/india.json", locale: "en-IN",
  rootId: "president", pageTitle: "India", loading: "Loading the republic…",
  description: "An interactive org chart of Indian politics: the President, Prime Minister, Parliament, Governors and Chief Ministers of every state.",
  searchPlaceholder: "Search a person, state or office",
  labels: { org: "Organisation details" },
  leafRoles: ["mla", "mp", "rsmp", "minister"],
  expandAllSkip: /^(districts-|dist-|ls-|rs-)/,
  statLabels: ["Capital", "Lok Sabha seats", "Rajya Sabha seats", "Residence", "Term"],
  nonpartisan: ["president", "cji", "cec", "ag", "governor", "lg", "admin"],
  person: {
    president: { where: ["Jurisdiction", "All of India"], chosen: "Electoral College", term: "5 years" },
    vp: { where: ["Jurisdiction", "Parliament"], chosen: "MPs", term: "5 years" },
    pm: { where: ["Jurisdiction", "All of India"], chosen: "President", term: "Up to 5 years" },
    cji: { where: ["Jurisdiction", "Supreme Court"], chosen: "President", term: "Until age 65" },
    cec: { where: ["Jurisdiction", "Election Commission"], chosen: "President", term: "6 years or age 65" },
    ag: { where: ["Jurisdiction", "Union Government"], chosen: "President", term: "At pleasure" },
    governor: { where: ["State"], chosen: "President", term: "5 years" },
    lg: { where: ["Territory"], chosen: "President", term: "At pleasure" },
    admin: { where: ["Territory"], chosen: "President", term: "At pleasure" },
    cm: { where: ["State"], chosen: "Governor", term: "Up to 5 years" },
    mp: { where: ["Constituency"], chosen: "Constituency voters", term: "5 years" },
    rsmp: { where: ["State"], chosen: "State MLAs", term: "6 years" },
    mla: { where: ["Constituency"], chosen: "Constituency voters", term: "5 years" },
    minister: { where: ["Portfolio"], chosen: "PM or Chief Minister", term: "At pleasure" },
  },
  partyInfo: PARTY_INFO,
  reservedSeat,
  wiki: (n) => (WIKI[n.id] ? "https://en.wikipedia.org/wiki/" + WIKI[n.id] : null),
  subtitle: (nodes) => `${nodes.get("states").children.reduce((a, r) => a + r.children.length, 0)} states · ${nodes.get("uts").children.length} union territories · ${[...nodes.values()].filter((n) => n.kind === "office").length} office holders`,

  tileColor(n) {
    if (n.id === "states") return ACCENT.States;
    if (n.id === "uts") return ACCENT["Union Territories"];
    if (n.id === "cabinet" || n.id.startsWith("council-")) return "#b45309";
    if (n.id.startsWith("ls-")) return "#4f46e5";
    if (n.id.startsWith("rs-")) return "#7c3aed";
    if (/^(districts|dist)-/.test(n.id)) return "#0d9488";
    if (n.kind === "house") return "#1f2a7a";
    return n.kind === "group" ? ACCENT[n.label] || "#555" : "#222";
  },
  nodeIcon(n) {
    if (REGION_ICON[n.id]) return REGION_ICON[n.id];
    if (n.id === "states") return "map";
    if (n.id === "uts") return "building";
    if (/^(districts|dist|ls|rs)-/.test(n.id)) return "pin";
    if (n.id === "cabinet" || n.id.startsWith("council-")) return "users";
    if (n.kind === "house") return "landmark";
    return n.kind === "group" ? "map" : ROLE_ICON[n.role] || "star";
  },
  cardSub(n) {
    if (n.kind === "office") return ["governor", "lg", "admin", "cm", "mla", "mp", "rsmp", "minister"].includes(n.role) ? `${n.label} · ${n.place}` : n.label;
    if (n.id === "lok-sabha") return `${n.place} · Speaker ${n.person.name}`;
    return n.place;
  },

  explainFor(n, member) {
    if (member) {
      const r = member.role || "";
      if (/^Speaker/.test(r)) return EXPLAIN.speaker;
      if (/Leader of the Opposition/.test(r)) return EXPLAIN.lop;
      if (/Deputy Chairman/.test(r)) return EXPLAIN.deputyChair;
      if (/Deputy Chief Minister/.test(r)) return EXPLAIN.dcm;
      if (n.id === "cabinet" || n.id.startsWith("council-")) return EXPLAIN.minister;
      if (n.id === "lok-sabha") return EXPLAIN.mp;
      if (n.id === "rajya-sabha") return EXPLAIN.rsmp;
      if (/^(vs|dist)-/.test(n.id)) return EXPLAIN.mla;
      return null;
    }
    if (n.kind === "office") return EXPLAIN[n.role];
    if (n.id.startsWith("region-")) return EXPLAIN.region;
    if (n.id.startsWith("council-")) return EXPLAIN.council;
    if (n.id.startsWith("vs-")) return EXPLAIN.vs;
    if (n.id.startsWith("districts-")) return EXPLAIN.districts;
    if (n.id.startsWith("dist-")) return EXPLAIN.district;
    if (/^(ls|rs)-/.test(n.id)) return EXPLAIN.group;
    return EXPLAIN[n.id] || null;
  },

  // "In government" / "Outside government": does the person's party have ministers in the Union or state government?
  govStatus(n, p, { nodes }) {
    if (!p?.party || n.id === "president" || n.role === "governor") return null;
    let scope = null;
    for (let a = n; a; a = a.parent) {
      if (a.id.startsWith("cm-")) { scope = a.id.slice(3); break; }
      if (["lok-sabha", "rajya-sabha", "cabinet", "pm"].includes(a.id)) { scope = "union"; break; }
    }
    if (!scope) return null;
    const s = new Set();
    if (scope === "union") { (nodes.get("cabinet")?.members || []).forEach((m) => m.party && s.add(m.party)); const pm = nodes.get("pm")?.person?.party; if (pm) s.add(pm); }
    else { (nodes.get("council-" + scope)?.members || []).forEach((m) => m.party && s.add(m.party)); const cm = nodes.get("cm-" + scope)?.person?.party; if (cm) s.add(cm); }
    const ok = s.has(p.party), where = scope === "union" ? "Union" : "state";
    return { ok, tag: ok ? "In government" : "Outside government", detail: ok ? `In government. Their party has ministers in the ${where} government.` : `Outside government. Their party has no ministers in the ${where} government.` };
  },

  membersHeader: (n) => (n.id === "cabinet" || n.id.startsWith("council-") ? "Portfolio" : n.id.startsWith("vs-") || n.id.startsWith("dist-") || n.id === "lok-sabha" ? "Constituency" : "Role"),

  listSection(n, anc) {
    const a = [n, ...anc.slice().reverse()];
    const reg = a.find((x) => x.id.startsWith("region-")); if (reg) return `States · ${reg.label}`;
    if (a.some((x) => x.id === "uts")) return "Union Territories";
    if (a.some((x) => x.id === "cabinet")) return "Union Cabinet";
    return "Union leadership & institutions";
  },
  listOrder: (sections) => ["Union leadership & institutions", "Union Cabinet", ...[...sections].filter((s) => s.startsWith("States")).sort(), "Union Territories"],
  listCabinetId: "cabinet", listCabinetSection: "Union Cabinet",
};
