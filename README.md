# psentha02.github.io

Personal portfolio site for Praveen Sentha. Dark constellation theme with a live AI chat
(PravGPT) that answers questions about Praveen's background, experience, and projects.

**Live site**: https://psentha02.github.io (served from the `main` branch)
**Current development branch**: `redesign-constellation`

---

## Repository Structure

```
psentha02.github.io/
├── index.html          # The entire site — one self-contained file
├── Sentha_Family_2.jpg # Profile photo used in the About card
├── worker/             # Cloudflare Worker — PravGPT backend
│   ├── src/index.js    # Worker source (knowledge base + Groq proxy)
│   └── wrangler.toml   # Cloudflare config
└── README.md
```

---

## How the Site Works

The portfolio is a **single HTML file** with no build step. It uses:

- **React 18** and **ReactDOM** via CDN (`unpkg.com`)
- **Babel Standalone** for in-browser JSX transpilation
- **Google Fonts** (Playfair Display, Fraunces, Newsreader, Inter, DM Sans, JetBrains Mono)

All component logic, styles, and data live in `index.html` as inline `<script type="text/babel">` blocks. There is no bundler, no `package.json`, and no compilation step — the browser handles everything.

### Key sections inside `index.html`

| Block | Purpose |
|---|---|
| `window.PORTFOLIO_DATA` | JSON object with all of Praveen's data (experience, projects, skills, etc.) |
| `PRAVGPT_SYSTEM_PROMPT` | System prompt for the chat — interpolates `PORTFOLIO_DATA` |
| `window.usePravGPT` | React hook that manages chat state and calls the Worker |
| `window.VarA` | Main app component (routing, panels, chat, theme toggle) |
| Entry point | `ReactDOM.createRoot(...).render(...)` at the bottom |

### Routing

Hash-based (`#/about`, `#/work`, `#/projects`, `#/contact`). Page state lives in React, and `window.history.pushState` keeps the URL in sync.

### Theme

Dark/light mode is controlled by the dangling pendant orb (top-right). State lives in `VarA`. Palette is selected at render time — all colors flow through a `palette` object; no hardcoded rgba values.

---

## How PravGPT Works

```
Browser → Cloudflare Worker → Groq API (llama-3.3-70b-versatile)
```

1. The user types a message. `usePravGPT` sends a `POST` to the Worker with the full conversation as a `messages` array.
2. The **Cloudflare Worker** (`worker/src/index.js`):
   - Validates the `Origin` header (only `psentha02.github.io` and localhost are allowed)
   - Rate-limits per IP (20 requests / 5 minutes)
   - Extracts the current user message and up to 10 turns of conversation history
   - Calls **Groq** with a system prompt containing the complete knowledge base (~4K tokens)
   - Returns `{ reply: "..." }`
3. The reply is displayed in the chat UI.

### Why full-context instead of RAG

The entire knowledge base fits comfortably in Groq's 32K context window (~4K tokens). Sending all of it with every request means the LLM can never "miss" relevant context due to retrieval errors — a common failure mode in RAG systems with small, structured data. Simpler, faster, and more accurate for this use case.

### Knowledge base

The knowledge base is a markdown string constant at the top of `worker/src/index.js`. It covers:

- Bio, contact, and what makes Praveen stand out
- Work experience (Qualcomm full-time + intern, Stryker intern) with quantified impact
- Projects (Text-to-SQL agent, Hunch, Telemetry pipelines) with technical depth
- Full skills inventory with context on production usage
- Education (Georgia Tech M.S. AI, Purdue B.S. Data Science)
- Recruiter FAQ (visa status, relocation, open to roles, strongest achievements)

---

## Running Locally

```bash
# Start a local HTTP server (Python, no install needed)
python3 -m http.server 8080

# Open in browser
open http://localhost:8080
```

The chat will call the live Cloudflare Worker (localhost is in the allowed-origins list).

---

## Deploying

### Site (GitHub Pages)

The site is served from the `main` branch root via GitHub Pages.

```bash
# Merge redesign-constellation into main when ready to go live
git checkout main
git merge redesign-constellation
git push
```

GitHub Pages picks up the change automatically within ~30 seconds.

### Cloudflare Worker

The Worker must be deployed separately via Wrangler.

```bash
cd worker/

# First-time setup
npm install -g wrangler
wrangler login

# Set the Groq API key (only needed once, or when rotating)
wrangler secret put GROQ_API_KEY

# Deploy
wrangler deploy
```

The Worker URL is `https://pravgpt.pravgpt.workers.dev`. This is hardcoded in
`index.html` as `PRAVGPT_ENDPOINT`.

---

## Updating the Knowledge Base

The knowledge base lives at the top of `worker/src/index.js` as the `KNOWLEDGE_BASE`
constant. Edit the markdown there, then redeploy the Worker:

```bash
cd worker/
wrangler deploy
```

No changes to `index.html` are needed.

---

## Secrets and Environment Variables

| Location | Secret | Purpose |
|---|---|---|
| Cloudflare Worker | `GROQ_API_KEY` | Authenticates requests to Groq |

Set with: `wrangler secret put GROQ_API_KEY` from the `worker/` directory.

The Groq API key is **never** in the static HTML or any client-loaded resource.

---

## Tech Stack Summary

| Layer | Tech | Notes |
|---|---|---|
| Frontend | React 18 (CDN), Babel Standalone | No build step |
| Hosting | GitHub Pages | Served from `main` branch |
| AI Chat backend | Cloudflare Worker (free) | CORS proxy + rate limiter |
| LLM | Groq `llama-3.3-70b-versatile` (free tier) | ~1,000 req/day |
| Fonts | Google Fonts | Playfair Display, Inter |

**Total monthly infrastructure cost: $0**
