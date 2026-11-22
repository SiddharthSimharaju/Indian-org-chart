// Generic country config: everything comes from the data file (meta, plain, plainFacts, memberPlain, card, icon, color),
// so adding a country needs only a spec in scripts/countries/ and a build; no JS here.
const PALETTE = ["#2563eb", "#b45309", "#4f46e5", "#7c3aed", "#0f766e", "#ea580c", "#db2777", "#1f2a7a"];
const ROLE_ICON = { "head-of-state": "flag", "head-of-state-rep": "crown", "head-of-gov": "briefcase", minister: "briefcase", legislator: "vote", justice: "scale", "regional-head": "shield" };
const LEAF = ["legislator", "minister", "justice", "regional-head"];
const shape = (n, src = n) => (src?.plain ? { plain: src.plain, facts: src.plainFacts || src.facts || [], terms: src.terms || [] } : null);

export function makeGeneric(stub) {
  const C = {
    ...stub, generic: true, locale: "en", rootId: stub.id, pageTitle: stub.name, loading: "Loading…",
    description: `An interactive org chart of the political system of ${stub.name}.`,
    searchPlaceholder: "Search a person or office", labels: { org: "Organization details" },
    leafRoles: LEAF, statLabels: ["Capital", "Residence", "Term", "Seats"], nonpartisan: [], person: {}, partyInfo: {},
    meta: null,
    // Called once the data file has loaded
    attach(data) {
      this.meta = data.meta || {};
      this.partyInfo = data.partyInfo || {};
      this.nonpartisan = this.meta.nonpartisan || [];
      if (this.meta.locale) this.locale = this.meta.locale;
      if (this.meta.description) this.description = this.meta.description;
      if (this.meta.name) this.pageTitle = this.meta.name;
    },
    wiki: () => null,
    subtitle(nodes) {
      const offices = [...nodes.values()].filter((n) => n.kind === "office").length;
      const cov = this.meta?.coverage?.legislature;
      return `${this.meta?.system ? this.meta.system + " · " : ""}${offices.toLocaleString()} office holders${cov && cov !== "complete" ? " · legislature list " + cov : ""}`;
    },
    expandAllSkip: (n) => (n.kind === "group" && n.parent?.id.startsWith("chamber-")) || (n.id.startsWith("chamber-") && n.children.length > 120 && n.children.every((c) => c.kind === "office")),
    tileColor(n) {
      if (n.color) return n.color;
      let top = n; while (top.parent && top.parent.parent) top = top.parent;
      if (!top.parent) return "#1d4ed8";
      const i = top.parent.children.indexOf(top);
      return PALETTE[i % PALETTE.length];
    },
    nodeIcon(n) {
      if (n.icon) return n.icon;
      if (n.kind === "office") return ROLE_ICON[n.role] || "star";
      if (!n.parent) return "flag";
      if (n.id === "cabinet") return "users";
      if (n.id === "judiciary") return "scale";
      if (n.id === "regions") return "map";
      if (n.id.startsWith("chamber-")) return "landmark";
      return n.kind === "group" ? "pin" : "landmark";
    },
    cardSub(n) {
      if (n.kind === "office") return n.role === "legislator" || n.role === "regional-head" ? [n.label, n.place].filter(Boolean).join(" · ") : n.label;
      return n.sub || n.place || "";
    },
    explainFor(n, member) {
      if (member) return member.plain ? shape(n, member) : member.mirror ? shape(n, n.memberPlain) : null;
      if (n.kind === "office") return shape(n) || shape(n, n.parent?.memberPlain);
      return shape(n);
    },
    govStatus: () => null,
    membersHeader: (n) => (n.id === "cabinet" ? "Portfolio" : n.id.startsWith("chamber-") ? "Seat" : "Role"),
    listSection(n, anc) {
      const a = [n, ...anc.slice().reverse()];
      const top = a.find((x) => x.parent && x.parent.id === this.rootId);
      if (!top) return "Leadership";
      if (/^head-of-/.test(top.id)) return "Leadership";
      if (top.id === "cabinet") return "Cabinet";
      return top.label;
    },
    listOrder: (sections) => { const fixed = ["Leadership", "Cabinet", "Judiciary", "Regions"]; return ["Leadership", "Cabinet", ...[...sections].filter((x) => !fixed.includes(x)), "Judiciary", "Regions"].filter((x) => sections.has(x)); },
    listCabinetId: "cabinet", listCabinetSection: "Cabinet",
  };
  return C;
}
