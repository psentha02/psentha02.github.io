# psentha02.github.io

Personal portfolio site for Praveen Sentha. Dark constellation theme with a live AI chat
(PravGPT) that answers questions about Praveen's background, experience, and projects.

**Live site**: https://psentha02.github.io (served from `main`)

---

## Repository Structure

```
psentha02.github.io/
├── index.html          # The entire site — one self-contained file
├── Sentha_Family_2.jpg # Profile photo used in the About card
├── worker/             # Cloudflare Worker — PravGPT backend
│   ├── src/index.js    # Knowledge base, system prompt, Groq proxy
│   └── wrangler.toml   # Cloudflare config
└── README.md
```

---

## How the Site Works

The portfolio is a **single HTML file** with no build step. It uses:

- **React 18** and **ReactDOM** via CDN (`unpkg.com`)
- **Babel Standalone** for in-browser JSX transpilation
- **Google Fonts** (Playfair Display, Inter, and others)

All component logic, styles, and data live in `index.html` as inline `<script type="text/babel">` blocks. There is no bundler, no `package.json`, and no compilation step — the browser handles everything.

### Key blocks inside `index.html`

| Block | Purpose |
|---|---|
| `window.PORTFOLIO_DATA` | All of Praveen's data — experience, projects, skills, education, contact |
| `PRAVGPT_ENDPOINT` | Hardcoded URL of the Cloudflare Worker |
| `window.usePravGPT` | React hook — manages chat state, calls the Worker, handles errors |
| `BubbleContent` | Renders assistant replies with **bold**, paragraph breaks, and `- bullet` lists |
| `window.VarA` | Main app component — routing, panels, chat mode, theme toggle |
| Entry point | `ReactDOM.createRoot(...).render(...)` at the bottom |

### Routing

Hash-based (`#/about`, `#/work`, `#/projects`, `#/contact`). Page state lives in React, and `window.history.pushState` keeps the URL in sync.

### Theme

Dark/light mode toggled by the dangling pendant orb (top-right corner). State lives in `VarA`. All colors flow through a `palette` object — no hardcoded colour values in components.

### Chat response rendering

`BubbleContent` parses assistant messages before rendering:
- `**text**` → `<strong>` (bold)
- Blank lines between paragraphs → visual breathing room
- Lines starting with `- ` → styled bullet list with accent markers

---

## How PravGPT Works

```
Browser → Cloudflare Worker → Groq API (llama-3.3-70b-versatile)
```

1. The user types a message. `usePravGPT` sends `POST /chat` to the Worker with the conversation history as a `messages` array.
2. The **Cloudflare Worker** (`worker/src/index.js`):
   - Validates the `Origin` header — only `psentha02.github.io` and localhost are allowed
   - Rate-limits per IP (20 requests / 5 minutes)
   - Extracts the current user message and up to 10 turns of history
   - Calls **Groq** with the full knowledge base in the system prompt (~5K tokens)
   - Returns `{ reply: "..." }`
3. The reply is rendered by `BubbleContent` with formatting applied.

### Why full-context instead of RAG

The entire knowledge base is ~5K tokens. Groq's context window is 32K. Sending everything with every request means the LLM can never miss relevant context — a common failure mode in RAG systems with small, structured datasets. Simpler, faster, and more accurate for this use case.

### Knowledge base

Defined as `KNOWLEDGE_BASE` at the top of `worker/src/index.js`. Covers:

- Bio, positioning, contact info, and what makes Praveen stand out
- Work experience (Qualcomm full-time + intern, Stryker intern) with quantified impact
- Projects (Text-to-SQL agent, Hunch, Telemetry pipelines) with technical depth
- Full skills inventory with context on production usage
- Education (Georgia Tech M.S. AI, Purdue B.S. Data Science)
- Recruiter FAQ (visa, relocation, open to roles, strongest achievements)

### Updating the knowledge base

Edit `KNOWLEDGE_BASE` in `worker/src/index.js`, then redeploy:

```bash
cd worker/
wrangler deploy
```

No changes to `index.html` needed.

---

## Running Locally

```bash
python3 -m http.server 8080
open http://localhost:8080
```

The chat calls the live Worker — `localhost:8080` is in the Worker's allowed-origins list.

---

## Deploying

### Site (GitHub Pages)

Work directly on `main` and push — GitHub Pages updates automatically within ~30 seconds.

```bash
git add .
git commit -m "your message"
git push
```

### Cloudflare Worker

The Worker deploys independently from the site.

```bash
cd worker/

# First-time setup
npm install -g wrangler
wrangler login
wrangler secret put GROQ_API_KEY   # paste key from console.groq.com

# Deploy (run this any time worker/src/index.js changes)
wrangler deploy
```

The Worker URL (`https://pravgpt.pravgpt.workers.dev`) is hardcoded in `index.html` as `PRAVGPT_ENDPOINT`. If you ever redeploy to a different Worker name, update that constant.

---

## Secrets

| Location | Secret | How to set |
|---|---|---|
| Cloudflare Worker | `GROQ_API_KEY` | `wrangler secret put GROQ_API_KEY` from `worker/` |

The Groq API key is **never** in the static HTML or any client-loaded resource.

---

## Tech Stack

| Layer | Tech | Notes |
|---|---|---|
| Frontend | React 18 (CDN), Babel Standalone | No build step |
| Hosting | GitHub Pages | Served from `main` branch root |
| AI chat backend | Cloudflare Worker (free plan) | CORS, rate limiting, Groq proxy |
| LLM | Groq `llama-3.3-70b-versatile` (free tier) | ~1,000 req/day free |
| Fonts | Google Fonts | Playfair Display, Inter |

**Total monthly cost: $0**
