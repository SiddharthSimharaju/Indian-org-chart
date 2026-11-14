import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";

const UA = "bharat-sansad-chart/0.1 (personal non-commercial project)";
const CACHE = path.resolve(".cache");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function api(params, { cacheKey } = {}) {
  const qs = new URLSearchParams({ format: "json", formatversion: "2", redirects: "1", ...params });
  const file = cacheKey && path.join(CACHE, cacheKey.replace(/[^\w.-]+/g, "_") + ".json");
  if (file && fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, "utf8"));
  for (let attempt = 0; attempt < 8; attempt++) {
    let res;
    try { res = await fetch("https://en.wikipedia.org/w/api.php?" + qs, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(30000) }); }
    catch (e) { await sleep(3000 * (attempt + 1)); continue; }
    if (res.status === 429) { await sleep(8000 * (attempt + 1)); continue; }
    if (!res.ok) throw new Error(`${res.status} ${qs}`);
    const json = await res.json();
    if (file) fs.writeFileSync(file, JSON.stringify(json));
    await sleep(1200);
    return json;
  }
  throw new Error("rate limited: " + qs);
}

export async function pageHtml(page) {
  const j = await api({ action: "parse", prop: "text", page }, { cacheKey: "html-" + page });
  return cheerio.load(j.parse.text);
}

/** Expand a table into a grid of cheerio cells, honouring rowspan/colspan. */
export function grid($, table) {
  const rows = [];
  const pending = []; // col -> {cell, left}
  $(table).find("tr").each((_, tr) => {
    const row = [];
    let col = 0;
    const take = () => {
      while (pending[col]?.left > 0) {
        row[col] = pending[col].cell; pending[col].left--; col++;
      }
    };
    $(tr).children("th,td").each((_, el) => {
      take();
      const cs = +($(el).attr("colspan") || 1), rs = +($(el).attr("rowspan") || 1);
      for (let i = 0; i < cs; i++) {
        row[col] = el;
        if (rs > 1) pending[col] = { cell: el, left: rs - 1 };
        col++;
      }
    });
    take();
    rows.push(row);
  });
  return rows;
}

export const clean = ($, el) =>
  el ? $(el).clone().find("sup,style,.reference").remove().end().text().replace(/\s+/g, " ").trim() : "";

/** All wiki article links inside a cell: [{title, text}] */
export function links($, el) {
  if (!el) return [];
  const out = [];
  $(el).find("a[href^='/wiki/']").each((_, a) => {
    const href = $(a).attr("href");
    if (/^\/wiki\/(File|Wikipedia|Help|Special|Template):/.test(href) || $(a).closest("sup").length) return;
    out.push({ title: decodeURIComponent(href.slice(6).split("#")[0]).replace(/_/g, " "), text: $(a).text().trim() });
  });
  return out;
}

/** Batch-fetch image + extract + description for article titles. */
export async function summaries(titles) {
  const out = {};
  const uniq = [...new Set(titles)];
  for (let i = 0; i < uniq.length; i += 20) {
    const chunk = uniq.slice(i, i + 20);
    const j = await api(
      {
        action: "query", prop: "pageimages|extracts|description|info", inprop: "url",
        piprop: "thumbnail|name", pithumbsize: "640", exintro: "1", explaintext: "1", exlimit: "20",
        titles: chunk.join("|"),
      },
      { cacheKey: "sum-" + chunk.join("|").slice(0, 120) + "-" + chunk.length + "-" + i }
    );
    const norm = {};
    for (const n of j.query.normalized || []) norm[n.from] = n.to;
    for (const r of j.query.redirects || []) norm[r.from] = r.to;
    for (const t of chunk) {
      let to = norm[t] || t; to = norm[to] || to;
      const p = j.query.pages.find((p) => p.title === to);
      if (p && !p.missing) out[t] = {
        title: p.title, image: p.thumbnail?.source || null, extract: p.extract || "",
        description: p.description || "", url: p.fullurl,
      };
    }
  }
  return out;
}

/** Small thumbnails only (fast for long lists): title -> url|null. 50 titles per request. */
export async function thumbs(titles, size = 120) {
  const out = {};
  const uniq = [...new Set(titles.filter(Boolean))];
  for (let i = 0; i < uniq.length; i += 50) {
    const chunk = uniq.slice(i, i + 50);
    const j = await api(
      { action: "query", prop: "pageimages", piprop: "thumbnail", pithumbsize: String(size), pilimit: "50", titles: chunk.join("|") },
      { cacheKey: `thumb${size}-` + chunk[0] + "-" + chunk.length + "-" + chunk[chunk.length - 1] }
    );
    const norm = {};
    for (const n of j.query.normalized || []) norm[n.from] = n.to;
    for (const r of j.query.redirects || []) norm[r.from] = r.to;
    const byTitle = Object.fromEntries(j.query.pages.map((p) => [p.title, p.thumbnail?.source || null]));
    for (const t of chunk) { let to = norm[t] || t; to = norm[to] || to; out[t] = byTitle[to] ?? null; }
    process.stdout.write(`\r  thumbs ${Math.min(i + 50, uniq.length)}/${uniq.length}`);
  }
  process.stdout.write("\n");
  return out;
}

/** Wikipedia's one-line description ("Indian politician (born 1964)") per title. 50 titles per request. */
export async function descriptions(titles) {
  const out = {};
  const uniq = [...new Set(titles.filter(Boolean))];
  for (let i = 0; i < uniq.length; i += 50) {
    const chunk = uniq.slice(i, i + 50);
    const j = await api(
      { action: "query", prop: "description", titles: chunk.join("|") },
      { cacheKey: "desc-" + chunk[0] + "-" + chunk.length + "-" + chunk[chunk.length - 1] }
    );
    const norm = {};
    for (const n of j.query.normalized || []) norm[n.from] = n.to;
    for (const r of j.query.redirects || []) norm[r.from] = r.to;
    const byTitle = Object.fromEntries(j.query.pages.map((p) => [p.title, p.description || ""]));
    for (const t of chunk) { let to = norm[t] || t; to = norm[to] || to; out[t] = byTitle[to] || ""; }
    process.stdout.write(`\r  descriptions ${Math.min(i + 50, uniq.length)}/${uniq.length}`);
  }
  process.stdout.write("\n");
  return out;
}
