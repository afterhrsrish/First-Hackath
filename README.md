# 🌾 AGRO-CHAOS 3000™: AI Crop Advisory Assistant
### *(Flawless Production Architecture paired with the Worst UI Design Anti-Patterns in Human History)*

[![Built with React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg)](https://vitejs.dev/)
[![Backend Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://expressjs.com/)
[![Database Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ecf8e.svg)](https://supabase.com/)
[![AI Google GenAI](https://img.shields.io/badge/AI-Google%20GenAI%20SDK-orange.svg)](https://ai.google.dev/)
[![UI Accessibility Hostility](https://img.shields.io/badge/A11y-Hostile%20by%20Design-red.svg)](#)

---

## 🌽 Overview

**AGRO-CHAOS 3000™** is an AI-powered agricultural advisory and farm management system. Beneath the hood, it features a **production-grade full-stack architecture** with real Supabase Cloud PostgreSQL persistence, Google Gemini AI structured generation via `@google/genai`, and strict Zod validation.

However, the user interface was maliciously architected to violate every known UX/UI guideline, testing the limits of human patience, eye strain, and mouse dexterity.

---

## 💥 Worst UI / Chaotic Anti-Patterns Included

1. **Hostile Navigation:**
   - **Runaway Buttons:** Submit and Panic buttons that actively detect cursor proximity and dart across the screen with laser sound effects.
   - **Misleading Nav Titles:**
     - `"EVACUATE FARM"` ➡️ Home / Dashboard
     - `"DELETE ALL HARVESTS"` ➡️ Farms & Field Management
     - `"SOW NIGHTSHADE"` ➡️ Gemini AI Advisory
     - `"SPREAD BLIGHT"` ➡️ Leaf Pathology Diagnostics
2. **Aggressive & Eye-Straining Aesthetics:**
   - Blinding neon palette: `#FFFF00` (Blinding Yellow), `#00FF00` (Toxic Green), `#FF007F` (Hot Pink), with low-contrast white text on pale yellow cards.
   - Ransom-font typography combining **Comic Sans, Papyrus, Impact, and Times New Roman** within single sentences.
   - Brutalist ridge and outset borders, spinning icons, tilted cards (-7° to +6°), and continuous news tickers.
3. **Frustrating Form Inputs:**
   - **Scrambled Dropdowns:** Crop species select that randomly rearranges itself alphabetically and semantically whenever focused or clicked.
   - **Historical Year Slider (0 to 3000 AD):** Instead of a standard date picker, users must drag a slider through Ancient Rome, the Medieval Feudal era, the 1928 Dust Bowl, and the Cybernetic Corn epoch.
   - **Forced ALL CAPS:** Punitive text inputs that scream at the user.
   - **Bot Defense CAPTCHA:** Agricultural math and farming trivia challenges required before queries can be submitted to Gemini.
4. **Obnoxious Feedback & Celebrations:**
   - Confetti explosions triggered when clicking `"Cancel"`, dismissing warnings, or clicking random cards.
   - Synthesized retro Web Audio buzzers, dings, and whooshes.
   - Reverse-psychology confirmation modals (`"ABORT & CELEBRATE"` vs `"PROCEED TO DOOM"`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Canvas-Confetti, Web Audio API.
- **Backend:** Node.js, Express.js, `@google/genai`, `@supabase/supabase-js`, Zod, pg, CORS, dotenv.
- **Database:** Supabase PostgreSQL with Row Level Security (RLS) policies.
- **Deployment:** Ready for Render (Server) and Vercel (Client).

---

## 🗄️ Database Schema (`/supabase/migrations/001_initial_schema.sql`)

- **`farms`**: `id`, `farmer_name`, `farm_name`, `location`, `total_area_hectares`, `created_at`
- **`plots`**: `id`, `farm_id`, `plot_name`, `crop_type`, `growth_stage`, `created_at`
- **`advisories`**: `id`, `plot_id`, `query_text`, `condition_diagnosis`, `action_plan` (JSONB), `urgency_level`, `created_at`

---

## 🚀 Quickstart Guide

### 1. Configure Environment Variables

**Backend (`/server/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Frontend (`/client/.env`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_BASE_URL=http://localhost:5000
```

*(Note: The server includes an automatic, intelligent in-memory fallback store and agronomy reasoning engine so the app runs smoothly out-of-the-box even before API keys are plugged in!)*

---

### 2. Apply Database Migration to Supabase

Run the migration script:
```bash
npm run migrate --prefix server
```
Or paste `/supabase/migrations/001_initial_schema.sql` into your Supabase Dashboard **SQL Editor** and click **Run**.

---

### 3. Run the Development Servers

In terminal 1 (Express Backend):
```bash
cd server
npm run dev
```

In terminal 2 (Vite Frontend):
```bash
cd client
npm run dev
```

Visit: **http://localhost:5173**
Backend health check: **http://localhost:5000/api/health**
