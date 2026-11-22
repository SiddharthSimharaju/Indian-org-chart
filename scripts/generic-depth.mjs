// Helpers for scripts/countries/<id>.mjs scrape() functions: read Wikipedia tables defensively and validate against known seat counts.
import { pageHtml, grid, clean, links } from "./wiki.mjs";

export { pageHtml, grid, clean, links };

/** Cell text without footnote markers. */
export const T = ($, el) => clean($, el).replace(/\[.*?\]/g, "").trim();
/** Cell text with " | " between block elements and line breaks, so stacked entries don't run together. */
export const Tsep = ($, el) => {
  if (!el) return "";
  const c = $(el).clone();
  c.find("sup,style,.reference").remove();
  c.find("br").replaceWith(" | ");
  c.find("li,div,p").each((_, e) => { $(e).append(" | "); });
  return c.text().replace(/\[.*?\]/g, "").replace(/\s+/g, " ").replace(/(\s*\|\s*)+$/g, "").trim();
};
export const slug = (s) => String(s).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const wikiUrl = (t) => "https://en.wikipedia.org/wiki/" + encodeURIComponent(t.replace(/ /g, "_"));
/** Drops "(...)" parts: "Alex Norris (British politician)" -> "Alex Norris". */
export const nameOnly = (s) => String(s).replace(/\s*\(.*?\)\s*/g, " ").replace(/\s+/g, " ").trim();
export const dateOf = (s) =>
  s.match(/\d{1,2}\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/)?.[0] ||
  s.match(/(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/)?.[0] ||
  s.match(/\b(?:1[89]|20)\d{2}\b/)?.[0] || "";
export const firstIdx = (h, re) => h.findIndex((x) => re.test(x));
export const lastIdx = (h, re) => { for (let i = h.length - 1; i >= 0; i--) if (re.test(h[i])) return i; return -1; };
export const hdr = ($, g) => g[0].map((c) => T($, c).toLowerCase());

/** Current holder of an office from the office article's infobox: {title, name, since}. */
export async function incumbent(page) {
  const $ = await pageHtml(page);
  let inc;
  $("table.infobox td").each((_, td) => { if (!inc && /^Incumbent/.test(clean($, td))) inc = td; });
  // Some infoboxes put "Incumbent" in a header row and the holder in the next row.
  if (!inc) $("table.infobox tr").each((_, tr) => {
    if (inc || !/^Incumbent/.test(clean($, $(tr).children("th")[0])) || $(tr).children("td")[0]) return;
    let row = $(tr).next("tr");
    for (let i = 0; i < 4 && row.length && !inc; i++, row = row.next("tr")) { const td = row.children("td")[0]; if (td && clean($, td) && links($, td).length) inc = td; }
  });
  if (!inc) return null;
  const L = links($, inc)[0];
  const text = clean($, inc);
  return { title: L?.title, name: L?.text, since: dateOf(text.match(/since\s+(.+?)(?:\(|$)/)?.[1] || text) };
}

/** Value of an infobox row by its header regex (first match). */
export async function infoboxRow(title, re) {
  const $ = await pageHtml(title);
  let out = "";
  $("table.infobox tr").each((_, tr) => {
    if (out) return;
    const th = clean($, $(tr).children("th")[0]);
    if (re.test(th)) out = clean($, $(tr).children("td")[0]);
  });
  return out;
}

/** Party from a person's own infobox. `norm` maps raw text to the display name. When several are listed the one marked "present" wins. */
export async function partyOfPage(title, norm = (s) => s) {
  if (!title) return "";
  try {
    const txt = await infoboxRow(title, /^(Political party|Party)$/);
    if (!txt) return "";
    const segs = txt.split(/(?<=\))\s*(?=[A-Z])/);
    return norm(segs.find((s) => /present/i.test(s)) || segs[0]);
  } catch { return ""; }
}

/** All wikitables of a page as {g, h, i}. */
export async function allTables(page, minRows = 3) {
  const $ = await pageHtml(page);
  const out = [];
  $("table.wikitable").each((i, t) => { const g = grid($, t); if (g.length >= minRows) out.push({ i, g, h: hdr($, g), t }); });
  return { $, tables: out };
}

/**
 * Members of one chamber from a wikitable. `pages` are Wikipedia titles tried in order.
 * opts: { seats (expected size, required), pick(tbl) -> bool to choose the table, cols: {seat, name, party, since} (regexes on lowercased headers, or numeric indexes),
 *         row(r, $, ctx) -> optional {name,title,seat,party,since,group} override, norm(party), tolerance (default .1), headerRows }.
 * A table is accepted only when its row count is within the tolerance of `seats`; otherwise returns null so the caller can omit members rather than guess.
 */
export async function memberTable(pages, opts) {
  const { seats, cols = {}, norm = (s) => s, tolerance = 0.1, headerRows = 1 } = opts;
  for (const page of Array.isArray(pages) ? pages : [pages]) {
    const $ = await pageHtml(page).catch(() => null);
    if (!$) continue;
    let best = null;
    $("table.wikitable").each((_, t) => {
      const g = grid($, t); if (g.length < 3) return;
      const h = g[Math.max(0, headerRows - 1)].map((c) => T($, c).toLowerCase());
      const tbl = { g, h, $ };
      if (opts.pick && !opts.pick(tbl)) return;
      const ix = (k) => (typeof cols[k] === "number" ? cols[k] : cols[k] ? firstIdx(h, cols[k]) : -1);
      const nI = ix("name"); if (nI < 0 && !opts.row) return;
      const sI = ix("seat"), pI = ix("party"), dI = ix("since");
      const out = [], seen = new Set();
      for (const r of g.slice(headerRows)) {
        let m;
        if (opts.row) { m = opts.row(r, $, { h, g }); if (!m) continue; }
        else {
          const cell = r[nI]; const L = links($, cell)[0];
          let name = nameOnly(T($, cell)); if (opts.nameFromLink && L) name = nameOnly(L.text);
          m = { title: L?.title, name, seat: sI >= 0 ? T($, r[sI]) : "", party: pI >= 0 ? norm(T($, r[pI])) : "", since: dI >= 0 ? dateOf(T($, r[dI])) : "" };
        }
        if (!m.name || /^(vacant|vacancy|none|—|-|–)$/i.test(m.name) || /vacant/i.test(m.name)) continue;
        const key = (m.seat || "") + "|" + m.name; if (seen.has(key)) continue; seen.add(key);
        out.push(m);
      }
      if (out.length >= seats * (1 - tolerance) && out.length <= seats * (1 + tolerance) && (!best || Math.abs(out.length - seats) < Math.abs(best.length - seats))) best = out;
    });
    if (best) return best;
  }
  return null;
}

/** Deterministic fallback colour for a party with no brand colour. */
export function hueColor(s) {
  let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const hue = h % 360, l = 0.42, a = 0.55 * Math.min(l, 1 - l);
  const f = (n) => { const k = (n + hue / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, "0"); };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
