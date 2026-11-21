// Registry of countries. To add one: create countries/<id>.js (see usa.js), add it here, and build public/data/<id>.json.
import india from "./india.js";
import usa from "./usa.js";

export const COUNTRIES = { india, usa };
export const DEFAULT_COUNTRY = "india";
export const ALIASES = { in: "india", us: "usa", "united-states": "usa", america: "usa" };
