// Second-level data under each Chief Minister: council of ministers and MLAs grouped by district.
import { pageHtml, grid, clean, links, thumbs } from "./wiki.mjs";

const hdrs = ($, g) => g[0].map((c) => clean($, c).toLowerCase());
const wikiUrl = (t) => "https://en.wikipedia.org/wiki/" + encodeURIComponent(t.replace(/ /g, "_"));
const lastIdx = (h, re) => { for (let i = h.length - 1; i >= 0; i--) if (re.test(h[i])) return i; return -1; };
const firstIdx = (h, re) => h.findIndex((x) => re.test(x));
const cellText = ($, el) => clean($, el).replace(/\[.*?\]/g, "").trim();
const isCurrent = (t) => !t || /incumbent|present|current|^[-–—]$/i.test(t);

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
      const L = links($, r[nameI])[0]; const name = cellText($, r[nameI]);
      if (!name || /^(vacant|none)$/i.test(name)) continue;
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
      const h = hdrs($, g);
      const dI = firstIdx(h, /^district/), nI = lastIdx(h, /^(name|member|mla|elected member|winner)/);
      if (dI < 0 || nI < 0) return;
      const cI = h.findIndex((x, i) => /constituency/.test(x) && !/^\d+$/.test(cellText($, g[1][i])));
      const pI = lastIdx(h, /party/) >= 0 ? lastIdx(h, /party/) : (h[nI - 1] === h[nI] ? nI - 1 : -1);
      for (const r of g.slice(1)) {
        const district = cellText($, r[dI]).replace(/\s*district$/i, "").trim(), name = cellText($, r[nI]);
        if (!district || !name || r[dI] === r[nI] || /^(vacant|none)$/i.test(name)) continue;
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
