// Prints the usage counters. Usage: npm run stats
import fs from "node:fs";
const src = fs.readFileSync("public/analytics.js", "utf8");
const NS = src.match(/const NS = "([^"]+)"/)[1], API = src.match(/const API = "([^"]+)"/)[1];
const LABELS = {
  visitors: "Unique visitors (per browser)", pageloads: "Page loads", cards: "Cards opened", expands: "Expand clicks",
  searches: "Search results picked", listview: "List view opened", wiki: "Wikipedia links clicked",
};
for (const [key, label] of Object.entries(LABELS)) {
  const r = await fetch(`${API}/get/${NS}/${key}`);
  const v = r.ok ? (await r.json()).value : 0;
  console.log(label.padEnd(34), String(v).padStart(8));
}
