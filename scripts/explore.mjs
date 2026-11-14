import { pageHtml, grid, clean, links } from "./wiki.mjs";
import { STATES, UTS } from "./static-facts.mjs";
const all = { ...STATES, ...Object.fromEntries(["Delhi", "Jammu and Kashmir", "Puducherry"].map((n) => [n, UTS[n]])) };
const hdr = ($, g) => g[0].map((c) => clean($, c).toLowerCase());
const isMemberTable = (h) => h.some((x) => /constituency|assembly/.test(x)) && h.some((x) => /^(name|member|mla|elected member|winner|candidate)/.test(x));
for (const [state, f] of Object.entries(all)) {
  const main = `${state} Legislative Assembly`;
  let $ = await pageHtml(main).catch(() => null);
  if (!$) { console.log(state, "NO MAIN"); continue; }
  const num = [...new Set($("a[href^='/wiki/']").map((_, a) => decodeURIComponent($(a).attr("href").slice(6)).replace(/_/g, " ")).get().filter((t) => /^\d+(st|nd|rd|th) .*Assembly$/.test(t) && t.includes(state.split(" ")[0])))].sort((a, b) => parseInt(b) - parseInt(a));
  const cands = [main, ...num.slice(0, 2)];
  let report = [];
  for (const c of cands) {
    const $c = c === main ? $ : await pageHtml(c).catch(() => null); if (!$c) continue;
    let rows = 0, tabs = 0, h0 = "";
    $c("table.wikitable").each((_, t) => { const g = grid($c, t); if (g.length && isMemberTable(hdr($c, g))) { rows += g.length - 1; tabs++; h0 ||= hdr($c, g).join("|").slice(0, 60); } });
    report.push(`${c}: ${tabs}t/${rows}r [${h0}]`);
  }
  console.log(state.padEnd(18), `seats ${f.la}`, "\n   ", report.join("\n    "));
}
