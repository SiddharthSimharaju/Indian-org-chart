// Second-level data under each Chief Minister: council of ministers and MLAs grouped by district.
import { pageHtml, grid, clean, links, thumbs } from "./wiki.mjs";

const hdrs = ($, g) => g[0].map((c) => clean($, c).toLowerCase());
const wikiUrl = (t) => "https://en.wikipedia.org/wiki/" + encodeURIComponent(t.replace(/ /g, "_"));
const lastIdx = (h, re) => { for (let i = h.length - 1; i >= 0; i--) if (re.test(h[i])) return i; return -1; };
const firstIdx = (h, re) => h.findIndex((x) => re.test(x));
const cellText = ($, el) => clean($, el).replace(/\[.*?\]/g, "").trim();
const isCurrent = (t) => !t || /incumbent|present|current|^[-–—]$/i.test(t);

const SUBHDR = /^(no\.?|name|party|constituency|district|remarks|alliance|member.*|assembly constituency)$/i;
/**
 * Column positions of an assembly table. Some pages (Rajasthan, Chhattisgarh) have a two-row header whose second row holds the real
 * labels ("No.", "Name", "Party"); the first row's repeated labels are then combined with it. When several columns are labelled
 * "Party" (Tripura), the one with the most filled cells is the party column.
 */
function assemblyColumns($, g) {
  let h = hdrs($, g), start = 1;
  const two = g.length > 2 && g[1].filter((c) => SUBHDR.test(cellText($, c))).length >= 3;
  if (two) { const h2 = g[1].map((c) => cellText($, c).toLowerCase()); h = h.map((x, i) => `${x} ${h2[i]}`.trim()); start = 2; }
  const rows = g.slice(start);
  const filled = (i) => rows.filter((r) => cellText($, r[i])).length;
  const dI = firstIdx(h, /^district/);
  let nI = two ? lastIdx(h, /(member|mla|elected|winner).*\bname$/) : lastIdx(h, /^(name|member|mla|elected member|winner)/);
  if (two && nI < 0) nI = lastIdx(h, /\bname$/);
  const partyCols = h.map((x, i) => (/party/.test(x) ? i : -1)).filter((i) => i >= 0);
  let pI = partyCols.length ? partyCols.reduce((best, i) => (filled(i) >= filled(best) ? i : best), partyCols[0]) : (nI > 0 && h[nI - 1] === h[nI] ? nI - 1 : -1);
  if (pI >= 0 && filled(pI) === 0) pI = -1;
  const cI = h.findIndex((x, i) => /constituency/.test(x) && !/\bno\.?$/.test(x) && rows[0] && !/^\d+$/.test(cellText($, rows[0][i])));
  return { rows, dI, nI, pI, cI };
}
const PLACEHOLDER_NAME = /^(minister|ministers|name|names|portfolio|portfolios|vacant|none|member|mla|#|no\.?|party|chief minister|deputy chief minister)$/i;
const CODE_NAME = /^[A-Z][A-Z()\-.&]{0,7}$/; // a party code (INC, BJP, SS(UBT)) is never a person's name

/** Current ministers from a "X ministry" page. */
export async function ministers(page) {
  const $ = await pageHtml(page);
  const out = [], seen = new Map();
  $("table.wikitable").each((_, t) => {
    const g = grid($, t); if (g.length < 2) return;
    const h = hdrs($, g);
    const nameI = firstIdx(h, /^(minister|name)/), portI = firstIdx(h, /portfolio|department/);
    if (nameI < 0 || portI < 0) return;
    const left = firstIdx(h, /left office|term end|^to$/), took = firstIdx(h, /took office|assumed|^from$|term of office/), party = lastIdx(h, /party/), cons = firstIdx(h, /constituency/);
    for (const r of g.slice(1)) {
      if (r[nameI] === r[portI]) continue; // section header row
      if (left >= 0 && !isCurrent(cellText($, r[left]))) continue;
      const L = links($, r[nameI])[0]; let name = cellText($, r[nameI]);
      if (L?.text && name.startsWith(L.text) && name.length > L.text.length) name = L.text; // the cell glues a title ("Neiphiu RioChief Minister") to the name
      name = name.replace(/\s*(Deputy )?Chief Minister$/i, "").trim();
      if (!name || PLACEHOLDER_NAME.test(name) || CODE_NAME.test(name)) continue;
      const portfolio = cellText($, r[portI]).replace(/\s*\n\s*/g, " · ");
      const key = L?.title || name;
      if (seen.has(key)) { const e = seen.get(key); if (portfolio && !e.role.includes(portfolio)) e.role += " · " + portfolio; continue; }
      const e = { title: L?.title, name, role: portfolio, since: took >= 0 ? cellText($, r[took]).replace(/\(.*$/, "").trim() : "", party: party >= 0 ? cellText($, r[party]) : "", constituency: cons >= 0 ? cellText($, r[cons]) : "" };
      seen.set(key, e); out.push(e);
    }
  });
  return out;
}

/** MLAs grouped by district from the assembly page(s). Returns {districtName: [mla]} or null. */
export async function mlasByDistrict(state, seats) {
  const main = `${state} Legislative Assembly`;
  const tryPage = async (p) => {
    const $ = await pageHtml(p).catch(() => null); if (!$) return null;
    const res = [];
    $("table.wikitable").each((_, t) => {
      const g = grid($, t); if (g.length < 3) return;
      const { rows, dI, nI, pI, cI } = assemblyColumns($, g);
      if (dI < 0 || nI < 0) return;
      for (const r of rows) {
        const district = cellText($, r[dI]).replace(/\s*district$/i, "").trim(), name = cellText($, r[nI]);
        if (!district || !name || r[dI] === r[nI] || /^(vacant|none)$/i.test(name) || CODE_NAME.test(name) || PLACEHOLDER_NAME.test(name)) continue;
        if (name === district || (cI >= 0 && name === cellText($, r[cI]))) continue; // a merged district or constituency cell, not a person
        const L = links($, r[nI])[0];
        res.push({ district, title: L?.title, name, role: cI >= 0 ? cellText($, r[cI]) : "", party: pI >= 0 ? cellText($, r[pI]) : "" });
      }
    });
    const uniq = new Map(); res.forEach((m) => uniq.set(m.role || m.name, m));
    return uniq.size >= seats * 0.9 && uniq.size <= seats * 1.1 ? [...uniq.values()] : null;
  };
  let res = await tryPage(main);
  if (!res) {
    const $ = await pageHtml(main).catch(() => null);
    const num = $ ? [...new Set($("a[href^='/wiki/']").map((_, a) => decodeURIComponent($(a).attr("href").slice(6)).replace(/_/g, " ")).get().filter((t) => /^\d+(st|nd|rd|th) .*Assembly$/.test(t) && t.includes(state.split(" ")[0])))].sort((a, b) => parseInt(b) - parseInt(a)) : [];
    for (const p of num.slice(0, 2)) { res = await tryPage(p); if (res) break; }
  }
  if (!res) return null;
  const by = {};
  for (const m of res) (by[m.district] ||= []).push(m);
  return by;
}

export { thumbs, wikiUrl };

/** All members of a house of Parliament: one wikitable per state under a heading. kind: "ls" | "rs". */
export async function parliament(kind) {
  const page = kind === "ls" ? "List of members of the 18th Lok Sabha" : "List of current members of the Rajya Sabha";
  const $ = await pageHtml(page);
  const out = [];
  $("table.wikitable").each((_, t) => {
    const g = grid($, t); if (g.length < 2) return;
    const h = hdrs($, g);
    const nI = firstIdx(h, /^name/), pI = lastIdx(h, /party/), cI = firstIdx(h, /constituency/), fI = firstIdx(h, /^field/), tI = firstIdx(h, /term start/);
    if (nI < 0 || pI < 0 || (kind === "ls" && cI < 0) || /alliance/.test(h[0])) return;
    const state = $(t).prevAll(".mw-heading").first().find("h2,h3,h4").first().text().replace(/\[.*?\]/g, "").trim();
    for (const r of g.slice(1)) {
      const name = cellText($, r[nI]); if (!name || /^vacant/i.test(name)) continue;
      const L = links($, r[nI])[0];
      out.push({ title: L?.title, name, state, party: cellText($, r[pI]), constituency: cI >= 0 ? cellText($, r[cI]) : "", field: fI >= 0 ? cellText($, r[fI]) : "", since: tI >= 0 ? cellText($, r[tI]) : "" });
    }
  });
  return out;
}
