# Apex — the Performance Intelligence Platform by Hubcycle

Apex assesses the personality dynamics and fit of collaborators and candidates: natural contribution style (F1-inspired profiles), culture alignment against the Hubcycle Manifesto, role match against each fiche de poste's top success factors, and team dynamics.

## Sections

| Section | Purpose |
| --- | --- |
| **Apex Recruit** | Send the 15–20 min assessment to candidates; review culture fit (super fit → misfit), role match (1–5 per success factor), strengths & watch-outs, team fit. Full report is admin-only; a shareable "candidate digest" contains the personality summary only. |
| **Apex Dynamics** | Team maps (Reflection ↔ Action × Systems ↔ People) and profile-coverage analysis per team, with candidate overlay. |
| **Apex Coach** | Per-person manager guidance: top 3 motivators, top 3 frustrations, coaching tips. |
| **Apex Growth** | Individual development view (Ideal-Team-Player-inspired): strengths, one development focus, coaching angles. |
| **Apex Insights** | Organizational analytics: profile distribution, average culture alignment per value. |

## The 8 contribution profiles

🏁 Driver · 🎧 Race Engineer · 📊 Strategist · 🔧 Chief Mechanic · ⚡ Pit Crew · 📡 Telemetry Engineer · 🌬️ Aerodynamicist · 🎯 Team Principal

Profiles describe *how someone contributes to team performance*, never job titles: a Race Engineer profile can work as a Sales Manager. No profile is better than another; each has strengths and watch-outs.

## Methodology in one paragraph

81 bilingual items (FR/EN, ~15–20 min): 36 forced-choice pairs → 8 profile dimensions — 28 "strengths" pairs in a complete round-robin (every profile faces every other exactly once, so no profile is structurally favored) plus 8 "under pressure" pairs where both options are watch-outs (ipsative formats that reduce social desirability); 45 Likert items in one mixed section → 24 items for 8 work-style facets and 21 items for the 7 Hubcycle Manifesto values, interleaved so culture items are not a recognizable block. Facet items are one-third reverse-keyed; value items are keyed ≈50/50 (11 reversed / 10 positive) and phrased as trade-offs rather than virtues, so straight-lining "5" lands below the culture midpoint. Role match rates each fiche-de-poste success factor 1–5 through a library of 12 behavioural competencies (weighted combinations of profiles + facets). Output style follows the conventions of SOSIE 2 / Hogan / AssessFirst reports: hedged language, results framed as interview hypotheses, both an upside and a shadow side for every dimension. **Neutrality:** every item concerns work behaviour only — nothing references or correlates with origin, age, gender or disability.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Admin access code defaults to `apex-hubcycle-2026` — **set `ADMIN_ACCESS_CODE` before deploying**.

## Deploying to Vercel

1. Import this repository in Vercel (framework auto-detected: Next.js).
2. Environment variables:
   - **SSO (recommended)**: `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` (Google Cloud OAuth client, consent screen type *Internal*, redirect URI `https://<domain>/api/auth/callback/google`). Sign-in is restricted server-side to `@hubcycled.com` (`SSO_ALLOWED_DOMAIN` to change). Set `AUTH_SECRET` (any long random string) and optionally `ADMIN_EMAILS` (comma-separated emails granted the HR role; defaults to lbarre@hubcycled.com).
   - `ADMIN_ACCESS_CODE` — break-glass access code granting the HR role if SSO is down (change the default!).
   - Storage (recommended): **Postgres via Prisma** — set `DATABASE_URL` to a Neon (or any Postgres) connection string and run `npx prisma migrate deploy` against it once. When `DATABASE_URL` is absent the app falls back to the legacy backends: Upstash Redis (`KV_REST_API_URL` + `KV_REST_API_TOKEN`), then a local JSON file in development, then **demo mode** (in-memory, data lost on redeploy — a banner warns about this).
3. Deploy. Invitation links look like `https://<your-domain>/a/<token>`.

### Migrating existing Upstash data to Postgres

With `DATABASE_URL`, `KV_REST_API_URL` and `KV_REST_API_TOKEN` all set, sign in with the HR role and call `POST /api/admin/import-kv`: it reads the legacy `apex-db-v1` document from Upstash and upserts it into Postgres. The route is idempotent (safe to run several times; records already migrated are updated in place, records created after the migration are left untouched). Note that the Prisma CLI reads `.env` but not `.env.local` — for local commands, either keep `DATABASE_URL` in `.env` or prefix the command (`DATABASE_URL=... npx prisma migrate dev`).

## Brand

Follows the Hubcycle Brandbook 2025: deep teal `#00414F`, coral `#FF684D`, light blue `#A1D0DB`, lavender `#D4B6FF`, ink `#0F2024`, grey `#F2F2F2`; Manrope for body text. PP Valve (licensed) is used for headings when the `.woff2` files are dropped into `public/fonts/` (`PPValve-Plain.woff2`, `PPValve-Medium.woff2` — see the brand Drive folder *3 - FONTS*); Manrope is the automatic fallback.

## Access control

Four roles, resolved from the signed-in Google account (matched to a person's email in the Admin panel) and enforced server-side in every API:
- **HR admin** — everything (assigned via `ADMIN_EMAILS` or the Access column in the Admin panel).
- **Manager** — auto-detected (someone reports to them, direct or dotted) or assigned: their reports, their teams and the candidates attached to those teams.
- **Recruiter** — candidates only.
- **Employee** — their own Apex Me space only (profile, strengths, growth focus — no comparisons).

The legacy `ADMIN_ACCESS_CODE` login remains as a break-glass path (HR role). For local development set `AUTH_DEV_MODE=true` to enable a passwordless email sign-in (disabled on Vercel). Candidates never log in: they use their private invitation token and can never see results through the app; HR shares the printable digest at its discretion. PDF export = print-optimized report pages.

## Data sources

- Culture values: Notion **🌟 Culture Manifesto** (7 values, 2025).
- Roles & top success factors: Notion **💼 Fiches de poste / "What's my job?"** database (July 2026 snapshot, condensed in `src/data/roles.ts` — roles flagged `derived: true` had no explicit success-factor section and should be reviewed).

## Limitations (v1)

- The role library is a static snapshot; re-sync from Notion when fiches de poste change.
- Scores are self-reported preferences, not validated psychometrics — use them to structure interviews, never as the sole hiring criterion.
- Single shared admin code (no per-user accounts yet).
