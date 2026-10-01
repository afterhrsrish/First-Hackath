# FieldOps AI — Agentic farm incident response

## Problem statement
Farm teams receive field observations across calls, photos, and messages. A symptom can be reported without a shared priority, owner, or follow-up plan, delaying consistent action across the farm.

## Solution
FieldOps AI turns a field observation into a coordinated response. A workflow planner organizes the report, an agronomy specialist evaluates crop symptoms, and a risk and operations reviewer prioritizes actions and assigns them to field roles. The Express server returns the shared decision and dispatches a checklist saved to the advisory history. Gemini is called only from the backend when `GEMINI_API_KEY` is configured; otherwise the existing agronomy rule engine provides a clearly identified demo fallback.

## Agent workflow
1. **Workflow planner** scopes the incident and prepares it for review.
2. **Agronomy specialist** uses Gemini (or the fallback rule engine) to assess symptoms and draft actions.
3. **Risk & operations** applies urgency, assigns owners, and dispatches a shared checklist.
4. The application stores the incident and advisory in Supabase PostgreSQL (or in memory for a no-credentials demo).

## Stack
React 18, Vite, React Router, Tailwind CSS, Node.js, Express, Zod, JWT, bcryptjs, Supabase PostgreSQL, Google Gemini API.

## Run locally
1. Install Node.js 18 or newer.
2. Copy `server/.env.example` to `server/.env`. Set a long random `JWT_SECRET`. Add Gemini and Supabase credentials if available. Gemini keys belong only in the server environment.
3. Apply `supabase/migrations/001_initial_schema.sql` and then `supabase/migrations/002_app_users.sql` in the Supabase SQL editor. For a demo without Supabase, the app uses an in-memory store.
4. In one terminal run `npm install --prefix server && npm run dev --prefix server`.
5. In another run `npm install --prefix client && npm run dev --prefix client`.
6. Open http://localhost:5173. The sample field incident is prefilled; select **Coordinate response** to show the collaborative run and action checklist.

The API exposes `POST /api/auth/register` and `POST /api/auth/login`; passwords are hashed with bcryptjs and successful authentication returns a 12-hour JWT. Set `JWT_SECRET` on the backend. The UI demo can run without signing in.

## Deploy
- **Frontend:** Deploy the `client` folder to Vercel. Configure a rewrite/proxy so `/api/*` reaches the Express service.
- **Backend:** Deploy `server` to Render or another Node host. Set `CLIENT_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in the host's environment settings.
- Health check: `/api/health`.

A public repo is available at https://github.com/afterhrsrish/First-Hackath. A live deployment and demo recording link should be added here after deployment/recording; neither is claimed by this repository yet.

## Demo video outline (3–5 minutes)
- 0:00–0:25 — Introduce the coordination gap: reports arrive, but decisions and owners are fragmented.
- 0:25–0:55 — Enter the sample yellowing leaves incident and choose crop and growth stage.
- 0:55–1:50 — Run the workflow and explain the planner, agronomy specialist, and risk/operations reviewer.
- 1:50–2:40 — Show the urgency, shared diagnosis, confidence, and assigned action checklist; mark an action complete.
- 2:40–3:15 — Show the backend health endpoint and explain Gemini server-side key handling, Supabase persistence, and the no-key fallback.
- 3:15–3:30 — State the measured next step: connect field sensors and messaging integrations.

## Submission summary
**Problem:** Fragmented field observations delay consistent farm decisions and follow-through.  
**Solution:** A coordinated AI workflow that plans, assesses, ranks, assigns, and records crop incident responses.
