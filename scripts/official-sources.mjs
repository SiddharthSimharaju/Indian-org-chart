// Fetch helpers for OFFICIAL machine-readable sources (parliament APIs, open-data files, government pages).
// Policy: for member rosters, cabinets and counts, use these first; fall back to Wikipedia only when a country has no official source.
// Responses are cached in .cache/official so rebuilds are fast and repeatable. Delete the folder to refresh.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DIR = path.resolve(".cache/official");
const UA = "Mozilla/5.0 (compatible; political-org-charts/0.1; non-commercial)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const keyFile = (key) => path.join(DIR, key.replace(/[^\w.-]+/g, "_"));

/** GET a URL (cached). Returns a Buffer. */
export async function getBuffer(url, { key = url, headers = {}, retries = 4, refresh = false } = {}) {
  fs.mkdirSync(DIR, { recursive: true });
  const file = keyFile(key);
  if (!refresh && fs.existsSync(file)) return fs.readFileSync(file);
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "*/*", ...headers }, redirect: "follow", signal: AbortSignal.timeout(60000) });
      if (res.status === 429 || res.status >= 500) { await sleep(2000 * (i + 1)); continue; }
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(file, buf);
      return buf;
    } catch (e) { if (i === retries - 1) throw e; await sleep(1500 * (i + 1)); }
  }
  throw new Error("failed " + url);
}
export const getText = async (url, opts) => (await getBuffer(url, opts)).toString("utf8").replace(/^﻿/, "");
export const getJson = async (url, opts) => JSON.parse(await getText(url, opts));

/** Download a zip (cached) and return the text of one file inside it. */
export async function getZipFile(url, inner, { key = url } = {}) {
  await getBuffer(url, { key });
  return execFileSync("unzip", ["-p", keyFile(key), inner], { maxBuffer: 512 * 1024 * 1024 }).toString("utf8");
}
/** Download a zip (cached) and return its entry names. */
export async function listZip(url, { key = url } = {}) {
  await getBuffer(url, { key });
  return execFileSync("unzip", ["-Z1", keyFile(key)], { maxBuffer: 64 * 1024 * 1024 }).toString("utf8").split("\n").filter(Boolean);
}

/** Download a zip (cached) and unpack it once into .cache/official/<key>-dir; returns the directory. */
export async function getZipDir(url, { key = url } = {}) {
  await getBuffer(url, { key });
  const dir = keyFile(key) + "-dir";
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); execFileSync("unzip", ["-q", "-o", keyFile(key), "-d", dir], { maxBuffer: 64 * 1024 * 1024 }); }
  return dir;
}

/** Minimal RFC-4180 CSV parser: returns an array of objects keyed by the header row. Lines starting with % or # before the header are skipped. */
export function parseCsv(text, { delimiter = "," } = {}) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === delimiter) { row.push(cell); cell = ""; }
    else if (c === "\n") { row.push(cell.replace(/\r$/, "")); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const data = rows.filter((r) => r.length > 1 || (r[0] && !/^[%#]/.test(r[0])));
  const head = data[0].map((h) => h.trim());
  return data.slice(1).filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i].trim()])));
}

/** Names of people often differ only by accents, case or honorifics; use this to match across sources. */
export const nameKey = (s) => String(s).normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\b(dr|prof|mr|mrs|ms|mx|sir|dame|rt hon|hon|the|lord|lady|baroness|baron|mp)\b\.?/g, "").replace(/[^a-z]+/g, " ").trim();

// ---- Japanese names: match official records (kanji + hiragana reading) to English-romanised names ----
const KANA = { あ: "a", い: "i", う: "u", え: "e", お: "o", か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko", さ: "sa", し: "shi", す: "su", せ: "se", そ: "so", た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to", な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no", は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho", ま: "ma", み: "mi", む: "mu", め: "me", も: "mo", や: "ya", ゆ: "yu", よ: "yo", ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro", わ: "wa", を: "o", ん: "n", が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go", ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo", だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do", ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo", ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po", ゔ: "vu" };
const KANA2 = { きゃ: "kya", きゅ: "kyu", きょ: "kyo", しゃ: "sha", しゅ: "shu", しょ: "sho", ちゃ: "cha", ちゅ: "chu", ちょ: "cho", にゃ: "nya", にゅ: "nyu", にょ: "nyo", ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo", みゃ: "mya", みゅ: "myu", みょ: "myo", りゃ: "rya", りゅ: "ryu", りょ: "ryo", ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo", じゃ: "ja", じゅ: "ju", じょ: "jo", びゃ: "bya", びゅ: "byu", びょ: "byo", ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo" };
export function kanaToRomaji(kana) {
  let out = "";
  for (let i = 0; i < kana.length; i++) {
    const c = kana[i];
    if (c === "っ") { const r = KANA2[kana.slice(i + 1, i + 3)] || KANA[kana[i + 1]] || ""; out += r[0] === "c" ? "t" : r[0] || ""; continue; }
    const two = kana.slice(i, i + 2); if (KANA2[two]) { out += KANA2[two]; i++; continue; }
    if (c !== "ー") out += KANA[c] ?? "";
  }
  return out;
}
/** Comparable key for a romanised name: lower case, no macrons, long vowels collapsed, m before b/m/p written n. Same function for both sides. */
export const jaNorm = (s) => String(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/g, "").replace(/ou|oo|oh/g, "o").replace(/uu/g, "u").replace(/aa/g, "a").replace(/m(?=[bmp])/g, "n");
/** Keys for an English name written "Given Family": each part is normalised separately so long vowels never collapse across the boundary. */
export const jaNameKey = (englishName) => String(englishName).split(/\s+/).filter(Boolean).map(jaNorm).join("");
export const jaNameParts = (englishName) => { const t = String(englishName).split(/\s+/).filter(Boolean); return { fam: jaNorm(t[t.length - 1] || ""), giv: jaNorm(t.slice(0, -1).join("")) }; };
/** Key and parts for a hiragana reading written "family given" (separated by spaces, including full-width spaces). */
export const jaReadingParts = (reading) => { const [family, ...given] = String(reading).split(/[\s\u3000]+/).filter(Boolean); return { fam: jaNorm(kanaToRomaji(family || "")), giv: jaNorm(kanaToRomaji(given.join(""))) }; };
export const jaReadingKey = (reading) => { const { fam, giv } = jaReadingParts(reading); return giv + fam; };
