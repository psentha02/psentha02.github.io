const ALLOWED_ORIGINS = [
  'https://psentha02.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080',
];

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const MAX_TOKENS = 400;
const MAX_MESSAGES = 22;       // system + up to 10 turns + current user msg
const MAX_CONTENT_CHARS = 20000;

// In-memory rate limit — resets on cold start. Good enough for a personal portfolio.
// Upgrade to Workers KV if you start seeing abuse across instances.
const rateLimitMap = new Map();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : null;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      if (!allowedOrigin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
    }

    // Route guard
    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not found', { status: 404 });
    }

    // Origin check
    if (!allowedOrigin) {
      return new Response('Forbidden', { status: 403 });
    }

    // Per-IP rate limit
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(ip)) {
      return json({ error: 'rate_limited', message: 'Too many requests — try again in a few minutes.' }, 429, allowedOrigin);
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'bad_request', message: 'Invalid JSON body.' }, 400, allowedOrigin);
    }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'bad_request', message: 'messages array is required.' }, 400, allowedOrigin);
    }
    if (messages.length > MAX_MESSAGES) {
      return json({ error: 'bad_request', message: 'Too many messages.' }, 400, allowedOrigin);
    }

    const totalChars = messages.reduce((n, m) => n + (typeof m.content === 'string' ? m.content.length : 0), 0);
    if (totalChars > MAX_CONTENT_CHARS) {
      return json({ error: 'bad_request', message: 'Message content too long.' }, 400, allowedOrigin);
    }

    // Validate message shapes
    for (const m of messages) {
      if (!['system', 'user', 'assistant'].includes(m.role) || typeof m.content !== 'string') {
        return json({ error: 'bad_request', message: 'Invalid message format.' }, 400, allowedOrigin);
      }
    }

    // Call Groq
    let groqRes;
    try {
      groqRes = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature: 0.6,
          max_tokens: MAX_TOKENS,
        }),
      });
    } catch (err) {
      console.error('Groq fetch error:', err);
      return json({ error: 'upstream_error', message: 'Could not reach the model. Try again.' }, 502, allowedOrigin);
    }

    if (!groqRes.ok) {
      const text = await groqRes.text().catch(() => '');
      console.error('Groq error', groqRes.status, text);
      if (groqRes.status === 429) {
        return json({ error: 'rate_limited', message: 'Model is busy right now — try again in a moment.' }, 429, allowedOrigin);
      }
      return json({ error: 'upstream_error', message: 'Model returned an error. Try again.' }, 502, allowedOrigin);
    }

    let data;
    try {
      data = await groqRes.json();
    } catch {
      return json({ error: 'upstream_error', message: 'Unexpected response from model.' }, 502, allowedOrigin);
    }

    const reply = data.choices?.[0]?.message?.content?.trim() || '';
    return json({ reply }, 200, allowedOrigin);
  },
};
