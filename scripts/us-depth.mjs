// State legislature members, scraped defensively from Wikipedia chamber pages.
import { pageHtml, grid, clean, links } from "./wiki.mjs";
import { normParty } from "./us-facts.mjs";

const cellText = ($, el) => clean($, el).replace(/\[.*?\]/g, "").trim();
const firstIdx = (h, re) => h.findIndex((x) => re.test(x));
const lastIdx = (h, re) => { for (let i = h.length - 1; i >= 0; i--) if (re.test(h[i])) return i; return -1; };
const dateOf = (s) => s.match(/[A-Z][a-z]+ \d{1,2}, \d{4}/)?.[0] || s.match(/\b(1[89]|20)\d{2}\b/)?.[0] || "";

/**
 * Members of one chamber. `pages` are Wikipedia titles to try in order; `seats` is the known size.
 * A table is only accepted when it has a district and a name column and its row count is within
 * 10% of the seat count, so a wrong table is rejected rather than guessed at.
 * Returns [{title, name, district, party, since}] or null.
 */
export async function chamberMembers(pages, seats, opts = {}) {
  for (const page of pages) {
    const $ = await pageHtml(page).catch(() => null);
    if (!$) continue;
    let best = null;
    $("table.wikitable").each((_, t) => {
      const g = grid($, t); if (g.length < 3) return;
      const h = g[0].map((c) => cellText($, c).toLowerCase());
      const dI = firstIdx(h, /^(district|assemblydistrict|seat|dist\.?|no\.?)\b/), nI = lastIdx(h, /^(state )?(name|member|senator|representative|legislator|assembly ?member|delegate|incumbent|rep\.?|sen\.?)\b/);
      if (dI < 0 || nI < 0 || dI === nI) return;
      const pI = lastIdx(h, /^party\b(?!.*shad)/) >= 0 ? lastIdx(h, /^party\b(?!.*shad)/) : (h[nI + 1] === "party" ? nI + 1 : -1);
      const noI = opts.withNo ? firstIdx(h, /^no\.?$/) : -1;
      const sI = firstIdx(h, /^(start|assumed|took office|since|term start|first elected|elected)/);
      const out = [], seen = new Set();
      for (const r of g.slice(1)) {
        if (r[dI] === r[nI] && g[0][dI] !== g[0][nI]) continue; // section divider row
        const name = cellText($, r[nI]).replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
        let district = cellText($, r[dI]).replace(/^District\s+/i, "").trim();
        const no = noI >= 0 && noI !== dI ? cellText($, r[noI]) : "";
        if (no && no !== district) district = `${district} ${no}`;
        if (/^(name|member|senator|representative)s?$/i.test(name) || /^district$/i.test(district)) continue; // repeated header row
        if (!name || /^(vacant|vacancy|none|—|-)$/i.test(name) || /vacant/i.test(name)) continue;
        if (/^\d+$/.test(district) && +district > seats) continue; // numbered districts can't exceed the seat count
        const key = district + "|" + name; if (seen.has(key)) continue; seen.add(key);
        const L = links($, r[nI])[0];
        out.push({ title: L?.title, name, district, party: pI >= 0 ? normParty(cellText($, r[pI])) : "", since: sI >= 0 ? dateOf(cellText($, r[sI])) : "" });
      }
      if (out.length >= seats * 0.9 && out.length <= seats * 1.1 && (!best || Math.abs(out.length - seats) < Math.abs(best.length - seats))) best = out;
    });
    if (best) return best;
  }
  return null;
}
