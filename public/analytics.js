// Lightweight, cookie-free analytics.
//  - A public counter (abacus) powers the "visitors" pill and click counts. The key is an opaque random id.
//  - Vercel Web Analytics (page views, referrers, countries) loads only on *.vercel.app once enabled in the dashboard.
// Nothing about the visitor is sent: only a counter name like "cards" is incremented. Local development is never counted.

const NS = "iocec3c2f9c0a2366";
const API = "https://abacus.jasoncameron.dev";
const local = ["localhost", "127.0.0.1", ""].includes(location.hostname);
const safe = (fn) => { try { return fn(); } catch { return null; } };

/** Add 1 to a named counter (fire and forget). */
export function track(name) {
  if (local) return;
  fetch(`${API}/hit/${NS}/${name}`, { keepalive: true }).catch(() => {});
}

/** Count this browser once as a visitor and return the running total. */
export async function visitorCount() {
  try {
    const seen = safe(() => localStorage.getItem("ioc-seen"));
    const res = await fetch(`${API}/${seen || local ? "get" : "hit"}/${NS}/visitors`);
    if (!seen && !local) safe(() => localStorage.setItem("ioc-seen", "1"));
    if (res.status === 404) return 0;
    return (await res.json()).value ?? null;
  } catch { return null; }
}

if (location.hostname.endsWith(".vercel.app")) {
  const s = document.createElement("script");
  s.defer = true; s.src = "/_vercel/insights/script.js";
  document.head.appendChild(s);
}
export const COUNTER = { NS, API };
