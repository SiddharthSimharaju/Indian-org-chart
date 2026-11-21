// Political Org Charts: interactive org tree for any country in countries/. Data comes from /data/<country>.json (built from Wikipedia).
import { COUNTRIES, DEFAULT_COUNTRY, ALIASES } from "./countries/index.js";
import { track, visitorCount } from "./analytics.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- Icons (2px rounded outline, 24px grid) ---------- */
const P = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  fit: '<path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  collapse: '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  external: '<path d="M7 17L17 7M8 7h9v9"/>',
  back: '<path d="M15 6l-6 6 6 6"/>',
  tree: '<rect x="9" y="3" width="6" height="5" rx="1.5"/><path d="M12 8v4M5 12h14M5 12v3M19 12v3"/><rect x="2.5" y="15" width="5" height="5" rx="1.5"/><rect x="16.5" y="15" width="5" height="5" rx="1.5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  landmark: '<path d="M3 21h18M5 21V10M9.5 21V10M14.5 21V10M19 21V10M2.5 10L12 3.5 21.5 10z"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
  vote: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M8 12l3 3 5-6"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  crown: '<path d="M3 18h18M4 18L3 7l5 4 4-6 4 6 5-4-1 11"/>',
  map: '<path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.5a5.5 5.5 0 0 1 4.5 5.5"/>',
  flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
  mountain: '<path d="M3 20l6.5-11 4 6.5 2.5-3.5L21 20z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  sunrise: '<path d="M3 18h18M7 18a5 5 0 0 1 10 0M12 4v4M5.5 9.5l2 2M18.5 9.5l-2 2"/>',
  waves: '<path d="M3 9c2.2-2 4.5-2 6 0s3.8 2 6 0 3.5-2 6 0M3 16c2.2-2 4.5-2 6 0s3.8 2 6 0 3.5-2 6 0"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  building: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  star: '<path d="M12 3l2.8 5.9 6.5.9-4.7 4.5 1.1 6.4L12 17.6 6.3 20.7l1.1-6.4L2.7 9.8l6.5-.9z"/>',
};
const icon = (n) => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${P[n] || ""}</svg>`;
const nodeIcon = (n) => C.nodeIcon(n);
const tileColor = (n) => C.tileColor(n);
const MARK = '<svg viewBox="0 0 32 32" fill="none" stroke="#0b7df2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="11" y="3" width="10" height="7" rx="2"/><path d="M16 10v6M7 16h18M7 16v4M25 16v4"/><rect x="3" y="20" width="8" height="8" rx="2"/><rect x="21" y="20" width="8" height="8" rx="2"/></svg>';

/* ---------- State ---------- */
let C, DATA, PARTY = {}; // C: active country config
const nodes = new Map(); // id -> node (with parent, depth)
const url = (hash = "") => { const u = new URL(location.href); u.hash = hash; return u.pathname + u.search + u.hash; };
const expanded = new Set();
const more = new Set();
let selectedId = null, memberIdx = null, tab = "overview", view = "tree";
let k = 0.8, tx = 0, ty = 0; // zoom / pan
const pos = new Map(); // id -> {x,y,w,h}
const els = new Map();

const GAP_X = 20, GAP_Y = 60, CARD_W = 232;
const partyColor = (p) => PARTY[p] || PARTY[(p || "").replace(/\s/g, "")] || "#9a9a9a";
const initials = (name) => name.replace(/\(.*\)/, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function index(n, parent = null, depth = 0) {
  n.parent = parent; n.depth = depth; nodes.set(n.id, n);
  n.children.forEach((c) => index(c, n, depth + 1));
}
const ancestors = (n) => { const a = []; for (let p = n.parent; p; p = p.parent) a.unshift(p); return a; };
const people = (n) => [...(n.person && n.kind === "office" ? [{ ...n.person, role: n.label, node: n }] : []), ...(n.members || []).map((m, i) => ({ ...m, node: n, mi: i }))];

/* ---------- Avatars ---------- */
function avatar(p, cls = "avatar") {
  const ring = p.party ? `--ring:${partyColor(p.party)}` : "";
  if (p.image) return `<img class="${cls}" style="${ring}" src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" referrerpolicy="no-referrer" data-ini="${esc(initials(p.name))}">`;
  return `<div class="${cls} ini" style="${ring}">${esc(initials(p.name))}</div>`;
}
document.addEventListener("error", (e) => {
  const t = e.target;
  if (t.tagName === "IMG" && t.dataset.ini) {
    const d = document.createElement("div");
    d.className = t.className + " ini"; d.style.cssText = t.style.cssText; d.textContent = t.dataset.ini;
    t.replaceWith(d);
  }
}, true);

/* ---------- Cards ---------- */
const cardSub = (n) => C.cardSub(n);
// Every person card shows the same three facts, so cards line up and can be compared at a glance.
function personCard(n) {
  const m = C.person[n.role] || {}, p = n.person;
  const party = p.party ? `<span class="n-party" style="--pc:${partyColor(p.party)}"><i></i>${esc(p.party)}</span>` : `<span class="n-party none">${C.nonpartisan.includes(n.role) ? "Non-partisan" : "No party listed"}</span>`;
  const where = m.where ? [m.where[0], m.where[1] || n.place] : ["Jurisdiction", n.place];
  const rows = [where, ["Chosen by", m.chosen || "—"], ["Term", m.term || "—"]];
  return `
    <div class="n-top"><div class="n-av">${avatar(p)}</div><div class="n-id"><p class="n-name">${esc(p.name)}</p><p class="n-sub">${esc(n.label)}</p></div></div>
    ${party}
    <div class="n-stats">${rows.map(([k, v]) => `<div class="n-stat"><span>${esc(k)}</span><b title="${esc(v)}">${esc(v)}</b></div>`).join("")}</div>
    ${n.children.length ? `<button class="toggle" data-act="toggle" aria-label="Show or hide ${esc(n.label)} reports"></button>` : ""}`;
}
function partyRows(n) {
  if (!n.parties?.length) return "";
  const top = n.parties.slice(0, 4), rest = n.parties.slice(4);
  return `<div class="n-parties">${top.map(([p, c]) => `<div class="n-party-row" style="--pc:${partyColor(p)}"><i></i>${esc(p)}<b>${c}</b></div>`).join("")}${rest.length ? `<div class="n-party-row more">+${rest.length} more parties<b>${rest.reduce((a, [, c]) => a + c, 0)}</b></div>` : ""}</div>`;
}
function cardHTML(n) {
  if (n.kind === "office") return personCard(n);
  const stats = (n.stats || []).map((s) => `<div class="n-stat"><span>${esc(s.label)}</span><b>${esc(s.value)}</b></div>`).join("");
  return `
    <div class="n-top"><div class="n-av"><div class="tile" style="--tile:${tileColor(n)}">${icon(nodeIcon(n))}</div></div><div class="n-id"><p class="n-name">${esc(n.label)}</p><p class="n-sub">${esc(cardSub(n))}</p></div><span class="n-badge">${esc(n.badge)}</span></div>
    ${stats ? `<div class="n-stats">${stats}</div>` : ""}${partyRows(n)}
    ${n.children.length ? `<button class="toggle" data-act="toggle" aria-label="Show or hide ${esc(n.label)} reports"></button>` : ""}`;
}

/* ---------- Layout ---------- */
const visibleKids = (n) => (expanded.has(n.id) ? n.children : []);
function visible(n = DATA.root, out = []) { out.push(n); visibleKids(n).forEach((c) => visible(c, out)); return out; }

const ROW_GAP = 14;
// Person cards (MPs, MLAs, ministers) have a fixed height so they can be laid out without touching the DOM,
// and are only created while on screen. That keeps "expand everything" fast.
const LEAF_H = 200;
const isLeaf = (n) => n.kind === "office" && !n.children.length && C.leafRoles.includes(n.role);
let visSet = new Set(), leaves = [];
document.documentElement.style.setProperty("--person-h", LEAF_H + "px");
const grids = new Map(); // parentId -> {cols, rows}
// More than five leaf cards (MPs, MLAs) are stacked in columns instead of one very wide row.
function gridOf(n) {
  const k = visibleKids(n);
  if (k.length <= 5 || !k.every((c) => !c.children.length)) return null;
  const cols = Math.min(5, Math.ceil(k.length / 5));
  return { cols, rows: Math.ceil(k.length / cols) };
}
function layout() {
  const vis = visible();
  const maxH = [];
  grids.clear();
  vis.forEach((n) => { const h = isLeaf(n) ? LEAF_H : els.get(n.id).offsetHeight; pos.set(n.id, { h, w: CARD_W }); maxH[n.depth] = Math.max(maxH[n.depth] || 0, h); const g = gridOf(n); if (g) grids.set(n.id, g); });
  const yAt = []; let y = 0;
  maxH.forEach((h, d) => { yAt[d] = y; y += h + GAP_Y; });
  const wc = new Map();
  const width = (n) => { if (!wc.has(n.id)) wc.set(n.id, widthRaw(n)); return wc.get(n.id); };
  const widthRaw = (n) => {
    const g = grids.get(n.id); if (g) return Math.max(CARD_W, g.cols * CARD_W + (g.cols - 1) * GAP_X);
    const kids = visibleKids(n); const w = kids.reduce((a, c) => a + width(c), 0) + Math.max(0, kids.length - 1) * GAP_X; return Math.max(CARD_W, w);
  };
  const place = (n, left) => {
    const kids = visibleKids(n), w = width(n), p = pos.get(n.id);
    p.x = left + (w - CARD_W) / 2; p.y = yAt[n.depth];
    const g = grids.get(n.id);
    if (g) {
      const rowH = maxH[n.depth + 1], x0 = left + (w - (g.cols * CARD_W + (g.cols - 1) * GAP_X)) / 2;
      kids.forEach((c, i) => { const q = pos.get(c.id), col = Math.floor(i / g.rows), row = i % g.rows; q.x = x0 + col * (CARD_W + GAP_X); q.y = yAt[n.depth + 1] + row * (rowH + ROW_GAP); });
      return;
    }
    let cur = left + (w - kids.reduce((a, c) => a + width(c), 0) - (kids.length - 1) * GAP_X) / 2;
    kids.forEach((c) => { place(c, cur); cur += width(c) + GAP_X; });
  };
  place(DATA.root, 0);
  return vis;
}

function render(anchorId) {
  const stage = $("#nodes");
  const before = anchorId && pos.get(anchorId) ? { ...pos.get(anchorId) } : null;
  const vis = visible();
  const visIds = new Set(vis.map((n) => n.id));
  visSet = visIds; leaves = vis.filter(isLeaf);
  for (const [id, el] of els) if (!visIds.has(id)) { el.remove(); els.delete(id); }
  const fresh = [];
  vis.forEach((n) => {
    if (isLeaf(n)) return;
    let el = els.get(n.id);
    if (!el) {
      el = document.createElement("div");
      el.className = `node kind-${n.kind}${n.kind === "office" ? " person" : ""} enter`; el.dataset.id = n.id; el.tabIndex = 0; el.setAttribute("role", "button");
      if (n.kind !== "office") el.style.setProperty("--tile", tileColor(n));
      el.innerHTML = cardHTML(n);
      const pp = n.parent && pos.get(n.parent.id);
      el.style.transform = pp ? `translate(${pp.x}px,${pp.y}px)` : "translate(0,0)";
      stage.appendChild(el); els.set(n.id, el); fresh.push(el);
    }
    el.classList.toggle("selected", n.id === selectedId);
    const t = $(".toggle", el);
    if (t) t.innerHTML = expanded.has(n.id) ? icon("minus") : `${icon("plus")}${n.children.length}`;
  });
  layout();
  if (before) { const a = pos.get(anchorId); tx += (before.x - a.x) * k; ty += (before.y - a.y) * k; }
  void stage.offsetWidth;
  vis.forEach((n) => { const el = els.get(n.id); if (el) { const p = pos.get(n.id); el.style.transform = `translate(${p.x}px,${p.y}px)`; } });
  requestAnimationFrame(() => fresh.forEach((el) => el.classList.remove("enter")));
  drawEdges(vis); applyView(); cull(); drawMinimap(vis);
  els.forEach((el, id) => el.classList.toggle("selected", id === selectedId));
}

function drawEdges(vis) {
  const svg = $("#edges");
  const hot = new Set(selectedId ? [selectedId, ...ancestors(nodes.get(selectedId)).map((a) => a.id)] : []);
  let d = `<defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M1 2l6 3-6 3" fill="none" stroke="#9a9a9a" stroke-width="1.6" stroke-linecap="round"/></marker></defs>`;
  vis.forEach((n) => {
    const p = pos.get(n.id), g = grids.get(n.id);
    if (g) {
      const kids = visibleKids(n), x1 = p.x + CARD_W / 2, y1 = p.y + p.h, top = pos.get(kids[0].id).y, barY = top - GAP_Y / 2;
      const hotAny = kids.some((c) => hot.has(c.id)), cls = `edge ${hotAny ? "hot" : ""} ${n.id === growId ? "new" : ""}`;
      const cx = (i) => pos.get(kids[Math.floor(i * g.rows)].id).x + CARD_W / 2;
      const xs = Array.from({ length: g.cols }, (_, i) => cx(i));
      d += `<path class="${cls}" d="M${x1} ${y1}V${barY}"/>`;
      if (xs.length > 1) d += `<path class="${cls}" d="M${Math.min(...xs)} ${barY}H${Math.max(...xs)}"/>`;
      xs.forEach((x, i) => {
        const last = kids[Math.min(kids.length - 1, (i + 1) * g.rows - 1)], q = pos.get(last.id);
        d += `<path class="${cls}" d="M${x} ${barY}V${top - 2}" marker-end="url(#arr)"/><path class="${cls}" d="M${x} ${top}V${q.y + q.h / 2}"/>`;
      });
      return;
    }
    visibleKids(n).forEach((c) => {
      const q = pos.get(c.id), x1 = p.x + CARD_W / 2, y1 = p.y + p.h, x2 = q.x + CARD_W / 2, y2 = q.y - 2, my = y2 - GAP_Y / 2, dx = x2 - x1;
      const r = Math.min(14, Math.abs(dx) / 2), s = Math.sign(dx);
      const path = Math.abs(dx) < 1 ? `M${x1} ${y1}V${y2}` : `M${x1} ${y1}V${my - r}Q${x1} ${my} ${x1 + s * r} ${my}H${x2 - s * r}Q${x2} ${my} ${x2} ${my + r}V${y2}`;
      d += `<path class="edge ${hot.has(c.id) ? "hot" : ""} ${n.id === growId ? "new" : ""}" d="${path}" marker-end="url(#arr)"/>`;
    });
  });
  svg.innerHTML = d;
}

/* ---------- Pan / zoom ---------- */
const canvas = () => $("#canvas");
function applyView() {
  scheduleCull();
  $("#world").style.transform = `translate(${tx}px,${ty}px) scale(${k})`;
  const gs = 24 * k * (k < 0.5 ? 2 : 1), cv = canvas();
  cv.style.backgroundSize = `${gs}px ${gs}px`; cv.style.backgroundPosition = `${tx}px ${ty}px`;
  $("#zVal").textContent = Math.round(k * 100) + "%";
  updateMinimapView();
}
let cullQueued = false;
function scheduleCull() { if (!cullQueued) { cullQueued = true; requestAnimationFrame(() => { cullQueued = false; cull(); }); } }
// Create person cards that are near the viewport and drop the ones that are far away
function cull() {
  const c = canvas(), m = 500, x1 = -tx / k - m, x2 = (c.clientWidth - tx) / k + m, y1 = -ty / k - m, y2 = (c.clientHeight - ty) / k + m;
  const stage = $("#nodes");
  for (const n of leaves) {
    const p = pos.get(n.id); if (!p) continue;
    const on = p.x < x2 && p.x + p.w > x1 && p.y < y2 && p.y + p.h > y1;
    let el = els.get(n.id);
    if (on && !el) {
      el = document.createElement("div");
      el.className = `node kind-office person leaf${n.id === selectedId ? " selected" : ""}`; el.dataset.id = n.id; el.tabIndex = 0; el.setAttribute("role", "button");
      el.innerHTML = cardHTML(n);
      const grow = growId && n.parent?.id === growId && pos.get(growId);
      if (grow) { const q = pos.get(growId); el.classList.add("enter"); el.style.transform = `translate(${q.x}px,${q.y}px)`; }
      else el.style.transform = `translate(${p.x}px,${p.y}px)`;
      stage.appendChild(el); els.set(n.id, el);
      if (grow) { void el.offsetWidth; requestAnimationFrame(() => { el.style.transform = `translate(${p.x}px,${p.y}px)`; el.classList.remove("enter"); }); }
    } else if (!on && el) { el.remove(); els.delete(n.id); }
  }
}
function bounds() {
  let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
  for (const [id, p] of pos) if (visSet.has(id)) { x1 = Math.min(x1, p.x); y1 = Math.min(y1, p.y); x2 = Math.max(x2, p.x + p.w); y2 = Math.max(y2, p.y + p.h); }
  return { x1, y1, x2, y2, w: x2 - x1, h: y2 - y1 };
}
const panelW = () => ($("#panel").getAttribute("aria-hidden") === "false" && view === "tree" ? $("#panel").offsetWidth + 24 : 0);
function fit(animate = true) {
  const c = canvas(), b = bounds(), availW = c.clientWidth - panelW(), pad = 80;
  k = Math.max(0.2, Math.min(1, (availW - pad) / b.w, (c.clientHeight - pad - 90) / b.h));
  tx = (availW - b.w * k) / 2 - b.x1 * k; ty = 56 - b.y1 * k;
  smooth(animate); applyView();
}
function centerOn(id, zoom, yFrac = 0.5) {
  const p = pos.get(id); if (!p) return;
  const c = canvas(), availW = c.clientWidth - panelW();
  if (zoom) k = zoom;
  tx = availW / 2 - (p.x + p.w / 2) * k; ty = c.clientHeight * yFrac - (p.y + p.h / 2) * k - (yFrac === 0.5 ? 20 : 0);
  smooth(true); applyView();
}
function smooth(on) {
  const w = $("#world");
  w.style.transition = on ? "transform .45s cubic-bezier(.2,.8,.2,1)" : "none";
  if (on) setTimeout(() => (w.style.transition = "none"), 480);
}
function zoomAt(f, cx, cy) {
  const c = canvas(), nk = Math.max(0.2, Math.min(1.8, k * f));
  cx ??= c.clientWidth / 2; cy ??= c.clientHeight / 2;
  tx = cx - ((cx - tx) / k) * nk; ty = cy - ((cy - ty) / k) * nk; k = nk; applyView();
}
function initPanZoom() {
  const c = canvas();
  let drag = null;
  c.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".node,.toolbar,.minimap,.legend")) return;
    drag = { x: e.clientX, y: e.clientY, tx, ty }; c.setPointerCapture(e.pointerId); c.classList.add("panning");
  });
  c.addEventListener("pointermove", (e) => { if (!drag) return; tx = drag.tx + e.clientX - drag.x; ty = drag.ty + e.clientY - drag.y; applyView(); });
  const end = () => { drag = null; c.classList.remove("panning"); };
  c.addEventListener("pointerup", end); c.addEventListener("pointercancel", end);
  c.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { const r = c.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * 0.01), e.clientX - r.left, e.clientY - r.top); }
    else { tx -= e.deltaX; ty -= e.deltaY; applyView(); }
  }, { passive: false });
  $("#zIn").onclick = () => { smooth(true); zoomAt(1.25); };
  $("#zOut").onclick = () => { smooth(true); zoomAt(0.8); };
  $("#fit").onclick = () => fit();
  $("#expandAll").onclick = () => { nodes.forEach((n) => n.children.length && !C.expandAllSkip.test(n.id) && expanded.add(n.id)); render(); fit(); };
  $("#collapseAll").onclick = () => { expanded.clear(); expanded.add(C.rootId); render(); fit(); };
}

/* ---------- Minimap ---------- */
let mm = { s: 1, ox: 0, oy: 0, b: null };
function drawMinimap(vis) {
  const cv = $("#mmCanvas"), W = cv.clientWidth, H = cv.clientHeight, dpr = window.devicePixelRatio || 1;
  if (cv.width !== W * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
  const b = bounds(), s = Math.min((W - 16) / b.w, (H - 16) / b.h);
  mm = { s, b, ox: (W - b.w * s) / 2, oy: (H - b.h * s) / 2, W, H };
  const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
  const hot = new Set(selectedId && nodes.has(selectedId) ? [selectedId, ...ancestors(nodes.get(selectedId)).map((a) => a.id)] : []);
  for (const n of vis) {
    const p = pos.get(n.id), x = (p.x - b.x1) * s + mm.ox, y = (p.y - b.y1) * s + mm.oy, w = Math.max(2, CARD_W * s), h = Math.max(2, p.h * s);
    g.fillStyle = hot.has(n.id) ? "#111111" : "#e3e3e3";
    g.beginPath(); g.roundRect(x, y, w, h, Math.min(2, h / 2)); g.fill();
  }
  updateMinimapView();
}
function updateMinimapView() {
  if (!mm.b) return;
  const c = canvas(), { s, b, ox, oy } = mm, v = $("#mmView");
  v.style.left = ((-tx / k) - b.x1) * s + ox + "px"; v.style.top = ((-ty / k) - b.y1) * s + oy + "px";
  v.style.width = (c.clientWidth / k) * s + "px"; v.style.height = (c.clientHeight / k) * s + "px";
}
function initMinimap() {
  const m = $("#minimap");
  const go = (e) => {
    const r = m.getBoundingClientRect(), c = canvas();
    const wx = (e.clientX - r.left - mm.ox) / mm.s + mm.b.x1, wy = (e.clientY - r.top - mm.oy) / mm.s + mm.b.y1;
    tx = c.clientWidth / 2 - wx * k; ty = c.clientHeight / 2 - wy * k; applyView();
  };
  let down = false;
  m.addEventListener("pointerdown", (e) => { down = true; m.setPointerCapture(e.pointerId); go(e); });
  m.addEventListener("pointermove", (e) => down && go(e));
  m.addEventListener("pointerup", () => (down = false));
}

/* ---------- Interaction ---------- */
let growId = null, toggling = false;
const isUnder = (n, id) => { for (let a = n.parent; a; a = a.parent) if (a.id === id) return true; return false; };
// Expanding: the new cards and edges fade in while the camera glides to centre the card.
// Collapsing: the children fade out first, then the layout closes up.
function toggle(id) {
  if (toggling) return;
  const n = nodes.get(id), zoom = k < 0.55 ? 0.7 : k;
  toggling = true;
  if (expanded.has(id)) {
    els.forEach((el, eid) => { if (isUnder(nodes.get(eid), id)) el.classList.add("leaving"); });
    setTimeout(() => { expanded.delete(id); render(); centerOn(id, zoom, 0.3); toggling = false; }, 220);
  } else {
    expanded.add(id); growId = id; track("expands");
    render();
    centerOn(id, zoom, 0.3);
    setTimeout(() => { growId = null; toggling = false; }, 600);
  }
}
function select(id, mi = null, { center = false, open = true } = {}) {
  if (open) track("cards");
  selectedId = id; memberIdx = mi; tab = "overview";
  if (location.hash.slice(1) !== id) history.replaceState(null, "", url(id));
  if (view === "tree") {
    const had = $("#panel").getAttribute("aria-hidden") === "false";
    for (const a of ancestors(nodes.get(id))) expanded.add(a.id);
    render();
    if (center) centerOn(id, Math.max(k, 0.8));
    else if (open && k < 0.6) centerOn(id, 0.8);
    else if (open && !had) setTimeout(() => ensureVisible(id), 30);
  }
  if (open) showPanel();
}
function ensureVisible(id) {
  const p = pos.get(id), c = canvas(), availW = c.clientWidth - panelW();
  const sx = tx + p.x * k, sr = sx + p.w * k;
  if (sr > availW - 20 || sx < 20) centerOn(id);
}
function closePanel() {
  $("#panel").setAttribute("aria-hidden", "true");
  selectedId = null; memberIdx = null; history.replaceState(null, "", url());
  if (view === "tree") render(); else document.querySelectorAll(".tbl tr.sel").forEach((r) => r.classList.remove("sel"));
}

$("#nodes").addEventListener("click", (e) => {
  const el = e.target.closest(".node"); if (!el) return;
  const id = el.dataset.id, act = e.target.closest("[data-act]")?.dataset.act;
  if (act === "toggle") return toggle(id);
  select(id);
});
$("#nodes").addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("node")) { e.preventDefault(); select(e.target.dataset.id); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!$("#results").hidden) hideResults(); else closePanel(); } });

/* ---------- Panel ---------- */
const trunc = (t, n = 640) => {
  if (t.length <= n) return t;
  const cut = t.slice(0, n); let i = -1;
  for (const m of cut.matchAll(/[a-z0-9)\]]{2}\.(?= [A-Z])/g)) i = m.index + 3;
  return i > 200 ? cut.slice(0, i) : cut.trim() + "…";
};
function wikiFor(n, p) {
  if (p?.wiki) return p.wiki;
  return C.wiki?.(n) || "https://en.wikipedia.org/w/index.php?search=" + encodeURIComponent(n.label + " " + (n.place || ""));
}
const chainItem = (n) => {
  const lead = n.kind === "office" ? avatar(n.person) : `<div class="tile" style="--tile:${tileColor(n)}">${icon(nodeIcon(n))}</div>`;
  return `<button class="chain-item" data-go="${n.id}">${lead}<div><div class="t">${esc(n.kind === "office" ? n.person.name : n.label)}</div><div class="s">${esc(n.kind === "office" ? cardSub(n) : n.place)}</div></div></button>`;
};

function showPanel() {
  const n = nodes.get(selectedId), panel = $("#panel");
  const member = memberIdx != null ? n.members[memberIdx] : null;
  const p = member || (n.kind === "office" ? n.person : null);
  const subject = member ? { name: member.name, sub: member.role || "", chip: "Member" } : { name: p ? p.name : n.label, sub: p ? cardSub(n) : n.place, chip: n.badge };
  const hero = p ? avatar(p, "p-photo") : `<div class="p-photo tile" style="--tile:${tileColor(n)}">${icon(nodeIcon(n))}</div>`;
  const tags = [];
  if (p?.party) tags.push(`<span class="tag party" style="--pc:${partyColor(p.party)}"><i></i>${esc(p.party)}</span>`);
  if (p?.since) tags.push(`<span class="tag">In office since ${esc(p.since)}</span>`);
  if (!p && n.stats?.[0]) tags.push(`<span class="tag">${esc(n.stats[0].label)}: ${esc(n.stats[0].value)}</span>`);
  { const g = govStatus(n, p); if (g) tags.push(`<span class="tag ${g.ok ? "ok" : ""}">${esc(g.tag)}</span>`); }
  if (p?.note) tags.push(`<span class="tag warn">${esc(p.note)}</span>`);

  const tabs = [["overview", "Overview"]];
  if (!member) { tabs.push(["path", n.kind === "office" ? "How they got here" : "How it works"]); if (n.children.length) tabs.push(["below", `Reports here`, n.children.length]); if (n.members?.length) tabs.push(["members", n.membersLabel || "Members", n.members.length]); }

  panel.innerHTML = `
    <div class="p-top">
      <span class="p-chip">${esc(subject.chip)}</span><h2>${member ? "Member details" : n.kind === "office" ? "Office details" : C.labels.org}</h2><span class="grow"></span>
      <a class="btn-dark" href="${esc(wikiFor(n, p))}" target="_blank" rel="noopener"><span class="lbl">Open Wikipedia</span>${icon("external")}</a>
      <button class="btn-ghost" data-close aria-label="Close details">${icon("close")}</button>
    </div>
    <div class="p-body">
      ${member ? `<button class="link" data-go="${n.id}" style="margin-bottom:14px;display:inline-flex;align-items:center;gap:6px">${icon("back")}${esc(n.kind === "office" ? n.person.name : n.label)}</button>` : ""}
      <div class="p-hero">${hero}<div><h3>${esc(subject.name)}</h3><p class="sub">${esc(subject.sub)}</p>${p?.blurb ? `<p class="sub blurb">${esc(p.blurb)}</p>` : ""}</div><div class="p-tags">${tags.join("")}</div></div>
      <div class="tabs" role="tablist">${tabs.map(([id, l, c]) => `<button role="tab" data-tab="${id}" aria-selected="${tab === id}">${esc(l)}${c ? `<span class="count">${c}</span>` : ""}</button>`).join("")}</div>
      <div id="tabBody"></div>
      <p class="foot">Source: Wikipedia (CC BY-SA 4.0), fetched ${new Date(DATA.generatedAt).toLocaleDateString(C.locale, { day: "numeric", month: "short", year: "numeric" })}. Offices change; check the linked article for the latest.</p>
    </div>`;
  panel.setAttribute("aria-hidden", "false");
  renderTab(n, member, p);
}

function factsGrid(items) {
  items = items.filter(([, v]) => v !== undefined && v !== null && v !== "");
  return `<div class="facts">${items.map(([k, v], i) => `<div class="fact ${items.length % 2 && i === items.length - 1 ? "odd-last" : ""}"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`).join("")}</div>`;
}

/* ---------- Plain-English context ---------- */
const explainFor = (n, member) => C.explainFor(n, member);
const govStatus = (n, p) => C.govStatus?.(n, p, { nodes }) || null;
function plainBlock(n, member) {
  const ex = explainFor(n, member); if (!ex) return "";
  return `<div class="plain"><h4>In plain English</h4><p>${esc(ex.plain)}</p>${(ex.facts || []).map(([k, v]) => `<div class="pf"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>`;
}
function termsBlock(n, member) {
  const ex = explainFor(n, member); if (!ex?.terms?.length) return "";
  return `<div class="sect">Words you'll see</div>${ex.terms.map(([t, d]) => `<div class="term"><b>${esc(t)}</b><span>${esc(d)}</span></div>`).join("")}`;
}
function partyAbout(p) {
  const info = p?.party && C.partyInfo[p.party]; if (!info) return "";
  return `<div class="sect">About the party</div><div class="plain"><p><b style="font-weight:500">${esc(info[0])}</b><br>${esc(info[1])}</p></div>`;
}

function renderTab(n, member, p) {
  const body = $("#tabBody");
  if (tab === "overview") {
    let facts;
    if (member) facts = [["Role", member.role], ["Party", member.party], ["In office since", member.since], ["Constituency", member.constituency], ["Part of", n.kind === "office" ? n.person.name + "'s team" : n.label]];
    else if (p) facts = [["Office", n.label], ["Jurisdiction", n.place], ["Party", p.party], ["In office since", p.since], ["Seat / constituency", p.constituency], ["Election year", p.election], ["Appointed by", p.appointedBy], ["Alliance", p.stateAlliance || p.nationalAlliance], ...(n.stats || []).filter((s) => C.statLabels.includes(s.label)).map((s) => [s.label, s.value])];
    else facts = (n.stats || []).map((s) => [s.label, s.value]);
    const who = member || p;
    const seatName = who?.constituency || (["mla", "mp"].includes(n.role) ? n.place : "");
    if (who) { facts.push(["Reserved seat", C.reservedSeat?.(seatName)], ["Government role", govStatus(n, who)?.detail]); }
    const about = p ? p.bio : n.summary;
    const tot = (n.parties || []).reduce((a, [, c]) => a + c, 0);
    const partyBlock = !member && n.parties?.length ? `<div class="h-row" style="margin-top:18px"><h4>By party</h4><span class="pill">${tot} members</span></div><div class="pbar">${n.parties.map(([pp, c]) => `<span style="--pc:${partyColor(pp)};width:${(c / tot) * 100}%" title="${esc(pp)} ${c}"></span>`).join("")}</div>${n.parties.map(([pp, c]) => `<div class="prow" style="--pc:${partyColor(pp)}"><i></i>${esc(pp)}<b>${c}</b></div>`).join("")}` : "";
    body.innerHTML = `${plainBlock(n, member)}<div class="h-row"><h4>${p ? "At a glance" : "Key numbers"}</h4></div>${factsGrid(facts)}${partyBlock}${partyAbout(member || p)}${termsBlock(n, member)}
      ${about ? `<p class="about">${esc(p ? trunc(about) : about)}</p>` : ""}
      ${p?.wiki ? `<a class="link" href="${esc(p.wiki)}" target="_blank" rel="noopener">Read more on Wikipedia</a>` : ""}`;
  } else if (tab === "path") {
    const steps = [];
    if (n.electedBy) steps.push([n.kind === "office" ? "Who puts them in office" : "How members get here", n.electedBy]);
    if (n.reportsTo) steps.push(["Who they answer to", n.reportsTo]);
    if (p?.constituency && p.constituency !== "Electoral College") steps.push(["Seat they hold", `${p.constituency}${p.election ? ` (${p.election})` : ""}`]);
    if (p?.since) steps.push(["Current term began", p.since + (p.appointedBy ? `, appointed by ${p.appointedBy}` : "")]);
    const chain = ancestors(n);
    body.innerHTML = `<ol class="steps">${steps.map(([t, d], i) => `<li><span class="n">${i + 1}</span><div class="t">${esc(t)}</div><div class="d">${esc(d)}</div></li>`).join("")}</ol>
      ${chain.length ? `<div class="sect">Chain of command, top to bottom</div><div class="chain">${chain.map(chainItem).join("")}</div>` : ""}`;
  } else if (tab === "below") {
    body.innerHTML = `<div class="chain">${n.children.map(chainItem).join("")}</div>`;
  } else if (tab === "members") {
    body.innerHTML = `<div class="h-row"><h4>${esc(n.membersLabel || "Members")}</h4><span class="pill">${n.members.length}</span></div>
      <div class="filter-wrap"><span data-icon="search">${icon("search")}</span><input class="filter" id="mf" placeholder="Search" aria-label="Filter members"></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th>${C.membersHeader(n)}</th><th>Party</th></tr></thead><tbody id="mrows"></tbody></table></div>`;
    const draw = (q = "") => {
      $("#mrows").innerHTML = n.members.map((m, i) => [m, i]).filter(([m]) => (m.name + m.role + m.party).toLowerCase().includes(q.toLowerCase()))
        .map(([m, i]) => `<tr class="click" data-mi="${i}"><td><div class="who">${avatar(m)}${esc(m.name)}</div></td><td class="role">${esc(trunc(m.role || "", 90))}</td><td>${m.party ? `<span class="chip" style="--pc:${partyColor(m.party)}"><i></i>${esc(m.party)}</span>` : ""}</td></tr>`).join("") || `<tr><td colspan="3" class="role">No matches</td></tr>`;
    };
    draw(); $("#mf").oninput = (e) => draw(e.target.value);
  }
}
$("#panel").addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) return closePanel();
  if (e.target.closest(".btn-dark, a.link")) track("wiki");
  const t = e.target.closest("[data-tab]"); if (t) { tab = t.dataset.tab; const n = nodes.get(selectedId); $("#panel").querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", b === t)); return renderTab(n, memberIdx != null ? n.members[memberIdx] : null, memberIdx != null ? n.members[memberIdx] : n.kind === "office" ? n.person : null); }
  const g = e.target.closest("[data-go]"); if (g) return select(g.dataset.go, null, { center: view === "tree" });
  const r = e.target.closest("tr[data-mi]"); if (r) return select(selectedId, +r.dataset.mi);
});

/* ---------- Search ---------- */
let SEARCH = [], hi = 0;
function buildSearch() {
  SEARCH = [];
  nodes.forEach((n) => {
    if (n.kind === "office") SEARCH.push({ title: n.person.name, sub: cardSub(n), p: n.person, id: n.id, key: `${n.person.name} ${n.label} ${n.place} ${n.person.party}` });
    else SEARCH.push({ title: n.label, sub: n.place, n, id: n.id, key: `${n.label} ${n.place}` });
    (n.members || []).forEach((m, i) => !m.mirror && SEARCH.push({ title: m.name, sub: `${(m.role || "").split(" · ")[0]} · ${n.kind === "office" ? n.place : n.label}`, p: m, id: n.id, mi: i, key: `${m.name} ${m.role} ${m.party}` }));
  });
}
const hideResults = () => { $("#results").hidden = true; };
function showResults(q) {
  const box = $("#results"); q = q.trim().toLowerCase();
  if (!q) return hideResults();
  const words = q.split(/\s+/);
  const score = (s) => { const t = s.title.toLowerCase(); return words.every((w) => t.split(/[\s.]+/).includes(w)) ? 0 : words.every((w) => t.includes(w)) ? 1 : 2; };
  const hits = SEARCH.filter((s) => words.every((w) => s.key.toLowerCase().includes(w))).sort((a, b) => score(a) - score(b)).slice(0, 12);
  hi = 0; box.hidden = false;
  box.innerHTML = hits.length ? hits.map((h, i) => `<button class="result" data-i="${i}" aria-selected="${i === 0}">${h.p ? avatar(h.p) : `<div class="tile" style="--tile:${tileColor(h.n)};width:40px;height:40px;border-radius:11px">${icon(nodeIcon(h.n))}</div>`}<div><div class="t">${esc(h.title)}</div><div class="s">${esc(h.sub)}</div></div></button>`).join("") : `<div class="none">No matches for “${esc(q)}”</div>`;
  box._hits = hits;
}
function pick(h) {
  track("searches");
  hideResults(); $("#q").value = "";
  select(h.id, h.mi ?? null, { center: true });
}
function initSearch() {
  const q = $("#q"), box = $("#results");
  q.addEventListener("input", () => showResults(q.value));
  q.addEventListener("keydown", (e) => {
    const n = box._hits?.length || 0;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); hi = (hi + (e.key === "ArrowDown" ? 1 : -1) + n) % (n || 1); box.querySelectorAll(".result").forEach((r, i) => r.setAttribute("aria-selected", i === hi)); }
    if (e.key === "Enter" && box._hits?.[hi]) pick(box._hits[hi]);
  });
  box.addEventListener("click", (e) => { const r = e.target.closest(".result"); if (r) pick(box._hits[+r.dataset.i]); });
  document.addEventListener("click", (e) => { if (!e.target.closest("#search")) hideResults(); });
  document.addEventListener("keydown", (e) => { if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); q.focus(); } });
}

/* ---------- List view ---------- */
let partyFilter = null;
function renderList() {
  const lv = $("#listview"), rows = [];
  const add = (section, n, p, role, mi) => rows.push({ section, n, p, role, mi });
  const sectionOf = (n) => C.listSection(n, ancestors(n));
  nodes.forEach((n) => {
    if (n.kind === "office") add(sectionOf(n), n, n.person, cardSub(n));
    (n.members || []).forEach((m, i) => !m.mirror && add(n.id === C.listCabinetId ? C.listCabinetSection : sectionOf(n), n, m, m.role || n.membersLabel, i));
  });
  const seen = new Set(), uniq = rows.filter((r) => { const key = r.section + r.p.name + r.role; if (seen.has(key)) return false; seen.add(key); return true; });
  const parties = Object.entries(uniq.reduce((a, r) => (r.p.party ? ((a[r.p.party] = (a[r.p.party] || 0) + 1), a) : a), {})).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const order = C.listOrder(new Set(uniq.map((r) => r.section)));
  const filtered = uniq.filter((r) => !partyFilter || r.p.party === partyFilter);
  lv.innerHTML = `<div class="lv-controls"><b style="margin-right:6px">Filter by party</b>${parties.map(([p, c]) => `<button class="fchip" data-party="${esc(p)}" style="--pc:${partyColor(p)}" aria-pressed="${partyFilter === p}"><i></i>${esc(p)} · ${c}</button>`).join("")}${partyFilter ? `<button class="fchip" data-party="">Clear</button>` : ""}</div>` +
    order.map((s) => { const rs = filtered.filter((r) => r.section === s); if (!rs.length) return ""; return `<div class="lv-group">${esc(s)}<span class="pill">${rs.length}</span></div><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Name</th><th>Office</th><th>Party</th><th>Since</th></tr></thead><tbody>${rs.map((r) => `<tr class="click" data-id="${r.n.id}" data-mi="${r.mi ?? ""}"><td><div class="who">${avatar(r.p)}${esc(r.p.name)}</div></td><td class="role">${esc(trunc(r.role || "", 80))}</td><td>${r.p.party ? `<span class="chip" style="--pc:${partyColor(r.p.party)}"><i></i>${esc(r.p.party)}</span>` : "—"}</td><td class="role">${esc(r.p.since || "—")}</td></tr>`).join("")}</tbody></table></div>`; }).join("");
}
$("#listview").addEventListener("click", (e) => {
  const f = e.target.closest("[data-party]"); if (f) { partyFilter = f.dataset.party || null; return renderList(); }
  const r = e.target.closest("tr[data-id]"); if (r) { select(r.dataset.id, r.dataset.mi === "" ? null : +r.dataset.mi); }
});

/* ---------- View switching ---------- */
function setView(v) {
  view = v; if (v === "list") track("listview");
  document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-selected", b.dataset.view === v));
  $("#canvas").hidden = v !== "tree"; $("#listview").hidden = v !== "list";
  $("#stage").classList.toggle("list", v === "list");
  if (v === "list") renderList(); else { render(); if (selectedId) centerOn(selectedId); }
}

/* ---------- Countries ---------- */
const dataCache = new Map();
let loadSeq = 0;
const safe = (fn) => { try { return fn(); } catch { return null; } };
const pickCountry = () => {
  const q = new URLSearchParams(location.search).get("c")?.toLowerCase();
  const id = ALIASES[q] || q || safe(() => localStorage.getItem("poc-country"));
  return COUNTRIES[id] ? id : DEFAULT_COUNTRY;
};
function resetState() {
  nodes.clear(); els.clear(); pos.clear(); grids.clear(); more.clear(); expanded.clear();
  $("#nodes").innerHTML = ""; $("#edges").innerHTML = "";
  selectedId = null; memberIdx = null; tab = "overview"; growId = null; toggling = false; partyFilter = null; visSet = new Set(); leaves = [];
  mm = { s: 1, ox: 0, oy: 0, b: null };
  $("#panel").setAttribute("aria-hidden", "true"); $("#q").value = ""; hideResults();
}
async function loadCountry(id, hash = "") {
  const seq = ++loadSeq;
  resetState();
  C = COUNTRIES[id];
  document.documentElement.dataset.country = C.id;
  document.title = `Political Org Charts · ${C.pageTitle}`;
  $('meta[name="description"]')?.setAttribute("content", C.description);
  $("#q").placeholder = C.searchPlaceholder;
  $("#subtitle").textContent = "Loading…";
  $("#countryFlag").textContent = C.flag; $("#countryName").textContent = C.name;
  $("#countryMenu").querySelectorAll("[data-country]").forEach((b) => b.setAttribute("aria-selected", b.dataset.country === C.id));
  $("#loading")?.remove();
  $("#stage").insertAdjacentHTML("beforeend", `<div class="loading" id="loading">${esc(C.loading)}</div>`);
  let data = dataCache.get(C.id);
  try {
    if (!data) { const res = await fetch(C.dataUrl); if (!res.ok) throw new Error(res.status); data = await res.json(); dataCache.set(C.id, data); }
  } catch (e) {
    if (seq === loadSeq) $("#loading").textContent = `Couldn't load ${C.dataUrl}. Run \`npm run build:data\` and serve the public folder.`;
    return;
  }
  if (seq !== loadSeq) return; // a newer switch superseded this one
  $("#loading").remove();
  DATA = data; PARTY = DATA.partyColors || {};
  index(DATA.root); buildSearch(); expanded.add(C.rootId);
  $("#subtitle").textContent = C.subtitle(nodes);
  if (view === "list") renderList(); else { render(); fit(false); }
  if (hash && nodes.has(hash)) select(hash, null, { center: true });
}
async function switchCountry(id) {
  if (!COUNTRIES[id] || id === C?.id) return;
  const u = new URL(location.href); u.searchParams.set("c", id); u.hash = "";
  history.replaceState(null, "", u.pathname + u.search);
  safe(() => localStorage.setItem("poc-country", id));
  track("country" + id);
  await loadCountry(id);
}
function initCountryMenu() {
  const btn = $("#countryBtn"), menu = $("#countryMenu");
  menu.innerHTML = Object.values(COUNTRIES).map((c) => `<button role="option" class="country-opt" data-country="${c.id}" aria-selected="false"><span class="flag">${c.flag}</span>${esc(c.name)}</button>`).join("");
  const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", () => { menu.hidden = !menu.hidden; btn.setAttribute("aria-expanded", String(!menu.hidden)); });
  menu.addEventListener("click", (e) => { const o = e.target.closest("[data-country]"); if (!o) return; close(); switchCountry(o.dataset.country); });
  document.addEventListener("click", (e) => { if (!e.target.closest("#country")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { close(); btn.focus(); } });
}

/* ---------- Boot ---------- */
async function boot() {
  document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = icon(el.dataset.icon)));
  $("#brandMark").innerHTML = MARK;
  initCountryMenu(); initPanZoom(); initMinimap(); initSearch();
  track("pageloads");
  visitorCount().then((n) => { if (n == null) return; const v = $("#visitors"); v.textContent = `${n.toLocaleString()} ${n === 1 ? "visitor" : "visitors"}`; v.hidden = false; });
  document.querySelectorAll(".seg button").forEach((b) => (b.onclick = () => setView(b.dataset.view)));
  window.addEventListener("resize", () => updateMinimapView());
  await loadCountry(pickCountry(), location.hash.slice(1));
}
boot();
