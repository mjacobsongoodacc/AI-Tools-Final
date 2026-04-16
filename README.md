# DiligenceAI

React + Vite app for document intake, company-scoped analysis runs, and review flows. Analysis posts to an **n8n** webhook with **plain text** extracted from PDFs in the browser (**pdf.js**), then polls **Supabase** until the run completes.

## UI

The app uses a **dark chrome**: black surfaces (`#000000` / `#0A0A0A`), **off-white** primary text (`#FAFAFA` via Tailwind `white` / `bone-100`), and a single **red accent** (`#EF4444`). Semantic chart colors (green / amber / red for PASS / WATCH / FAIL style signals) are preserved for KPI and diligence visuals. Tailwind tokens live under `ink`, `bone`, and `accent` in `tailwind.config.js`.

## Requirements

- Node 18+ (npm)
- Environment variables (see below)

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local — required for analysis runs
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_N8N_WEBHOOK_URL` | n8n **webhook production URL** (path contains `/webhook/`). Do not use the workflow editor URL. |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key — used to poll `dilligencetable` until `status === 'complete'` after the webhook responds. |
| `VITE_ANALYSIS_POLL_TIMEOUT_MS` | Optional. Max ms to wait for a completed `dilligencetable` row after the webhook returns. Default **600000** (10 minutes). Minimum enforced: **30000**. |
| `VITE_DOCUMENT_UPLOAD_TIMEOUT_MS` | Optional. If set, upload `fetch` to your upload webhook uses `AbortSignal.timeout(ms)`. |

Copy `.env.example` to `.env.local` and fill in values. `.env.local` is gitignored.

## How analysis works (documents → n8n)

1. **Upload** — Each file is stored in **IndexedDB** by document id (`src/utils/docFileCache.js`) so PDF bytes survive reloads; `localStorage` only keeps metadata (PDFs do not store base64 `content` there).
2. **Run analysis** — `Analysis.jsx` restores `File` objects from IndexedDB when needed, then `buildAnalysisWebhookPayload` sends ready PDFs as `{ name, type, file }` (no upstream `content`).
3. **`runDiligenceWorkflow`** — Uses **pdf.js** to extract text from each `File`, then POSTs JSON `{ companyName, companyId, documents }` where each document has string `content` (plain text) for n8n. The pdf.js worker is loaded via Vite’s `?url` import (`pdf.worker.min.mjs`).
4. **Polling** — The client polls Supabase (`dilligencetable`) for the completed `result` for that `companyId` / run id.

### n8n / Supabase `run_id` contract

The JSON body sent to n8n includes **`companyId`** (same value as `submissionId` from the Analysis page). The poller looks for a row where **`run_id` equals that `companyId`** and **`status` is the string `complete`**, with a non-null **`result`**. Your n8n workflow must persist `run_id` using the webhook’s `companyId` (or the client will poll until timeout).

### Troubleshooting “Analysis timed out”

1. **Read the error text** — It includes the `run_id` searched and hints for `VITE_ANALYSIS_POLL_TIMEOUT_MS` and the n8n contract above.
2. **Dev console** — In development, `runDiligenceWorkflow` logs when polling starts: `run_id`, interval, and timeout ms.
3. **Network** — Inspect the webhook POST: status, time to response, and response body size (large extracted text + four PDFs can slow n8n).
4. **Supabase** — Open `dilligencetable` and filter by `run_id` = the id shown in the error. Confirm a row appears, `status` becomes `complete`, and `result` is populated. If completion takes longer than your timeout, raise `VITE_ANALYSIS_POLL_TIMEOUT_MS`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | ESLint |

## Stack

- **React 19**, **React Router 7**, **Vite 8**
- **Tailwind CSS 3.4** — utility styling; custom `ink` / `bone` / `accent` colors (no shadcn/ui)
- **@radix-ui/react-icons**, **@headlessui/react** (menus), **framer-motion** (landing motion)
- **recharts** (dashboard charts)
- **@supabase/supabase-js**, **pdfjs-dist** (in-browser PDF text extraction)
- **jspdf** (analysis PDF export from the Analysis page)
- Deploy-friendly static build (e.g. Vercel — see `vercel.json` if present)

## License

Private / see repository owner.
