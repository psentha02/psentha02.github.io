# PravGPT Worker

Cloudflare Worker that proxies chat requests from psentha02.github.io to Groq's LLM API.
The Groq API key lives only in this Worker — never in the static site.

## One-time setup

### 1. Accounts (both free, no credit card)
- Cloudflare: https://cloudflare.com → create account
- Groq: https://console.groq.com → create account → API Keys → Create key

### 2. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 3. Store the Groq API key as a secret
```bash
cd worker/
wrangler secret put GROQ_API_KEY
# paste your key when prompted
```

### 4. Deploy
```bash
wrangler deploy
```

Wrangler prints the Worker URL, e.g.:
```
https://pravgpt.<your-subdomain>.workers.dev
```

### 5. Update the frontend
In `index.html`, find this line near the top of the PravGPT script block:

```js
const PRAVGPT_ENDPOINT = 'REPLACE_WITH_YOUR_WORKER_URL/chat';
```

Replace `REPLACE_WITH_YOUR_WORKER_URL` with your Worker URL from step 4.

### 6. Test
```bash
curl -X POST https://pravgpt.<your-subdomain>.workers.dev/chat \
  -H 'Origin: https://psentha02.github.io' \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"system","content":"You are a test."},{"role":"user","content":"Say hello."}]}'
```

You should get `{"reply":"Hello!"}` (or similar).

## Local dev
```bash
wrangler dev
# Worker runs on http://localhost:8787
```

Then temporarily add `http://localhost:8787` as the endpoint in index.html for testing.

## Model
Currently using `llama-3.3-70b-versatile` on Groq's free tier (~1,000 req/day).
For higher throughput, switch to `llama-3.1-8b-instant` (~14,400 req/day) by editing
`MODEL` in `src/index.js`.

## Rate limits enforced by this Worker
- Max 20 requests per IP per 5 minutes
- Max 22 messages per request
- Max 20,000 total characters across all messages
