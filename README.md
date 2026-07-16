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
   - `ADMIN_ACCESS_CODE` — the admin access code (required; HR & hiring managers only).
   - Storage (recommended): create an **Upstash Redis** database via the Vercel Marketplace and link it to the project; the integration injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` automatically. Without it, the app runs in **demo mode** (in-memory, data lost on redeploy — a banner warns about this).
3. Deploy. Invitation links look like `https://<your-domain>/a/<token>`.

## Brand

Follows the Hubcycle Brandbook 2025: deep teal `#00414F`, coral `#FF684D`, light blue `#A1D0DB`, lavender `#D4B6FF`, ink `#0F2024`, grey `#F2F2F2`; Manrope for body text. PP Valve (licensed) is used for headings when the `.woff2` files are dropped into `public/fonts/` (`PPValve-Plain.woff2`, `PPValve-Medium.woff2` — see the brand Drive folder *3 - FONTS*); Manrope is the automatic fallback.

## Access control

- Admins (shared access code, httpOnly session cookie) see everything.
- Assessment-takers authenticate only through their private invitation token and can never see results — not even their own — through the app; HR shares the printable digest at its discretion.
- PDF export = print-optimized report pages (use the "Download PDF" button → save as PDF).

## Data sources

- Culture values: Notion **🌟 Culture Manifesto** (7 values, 2025).
- Roles & top success factors: Notion **💼 Fiches de poste / "What's my job?"** database (July 2026 snapshot, condensed in `src/data/roles.ts` — roles flagged `derived: true` had no explicit success-factor section and should be reviewed).

## Limitations (v1)

- The role library is a static snapshot; re-sync from Notion when fiches de poste change.
- Scores are self-reported preferences, not validated psychometrics — use them to structure interviews, never as the sole hiring criterion.
- Single shared admin code (no per-user accounts yet).
