<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->

## Adding or changing a country (Political Org Charts)

Every country lives in `public/countries/<id>.js` (config), `public/data/<id>.json` (built by `scripts/build-<id>.mjs`) and the registry in `public/countries/index.js`.

- **Whenever a country is added, or its builder, config or data file changes, run the `country-fact-checker` sub-agent for that country before calling the work done** (use the Agent tool with `subagent_type: "country-fact-checker"` and the country id in the prompt). It checks the hierarchy and every fact against official sources and returns `VERDICT: PASS` or `FAIL`. Fix every error it reports, rebuild, and re-run it until it passes. Do not report a country as finished while the verdict is FAIL.
- Run `npm run verify` first. It is a fast structural check (unique ids, names, parties, missing text) and the agent runs it too.
- The data is scraped from Wikipedia, so facts must be checked against official sources, not against Wikipedia.
- Report stale items (changed since the data snapshot) to the user rather than silently refreshing a long build.
