const ALLOWED_ORIGINS = [
  'https://psentha02.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080',
];

const MAX_MESSAGES      = 22;
const MAX_CONTENT_CHARS = 20000;
const HISTORY_TURNS     = 10;   // last N user+assistant pairs forwarded

const rateLimitMap = new Map();
const RATE_LIMIT_MAX       = 20;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(ip) {
  const now   = Date.now();
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
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
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
    const origin        = request.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : null;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      if (!allowedOrigin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
    }

    const url = new URL(request.url);
    if (request.method !== 'POST' || url.pathname !== '/chat') {
      return new Response('Not found', { status: 404 });
    }

    if (!allowedOrigin) return new Response('Forbidden', { status: 403 });

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(ip)) {
      return json({ error: 'rate_limited', message: 'Too many requests — try again in a few minutes.' }, 429, allowedOrigin);
    }

    // Parse + validate
    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'bad_request', message: 'Invalid JSON.' }, 400, allowedOrigin); }

    const { messages } = body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'bad_request', message: 'messages array required.' }, 400, allowedOrigin);
    }
    if (messages.length > MAX_MESSAGES) {
      return json({ error: 'bad_request', message: 'Too many messages.' }, 400, allowedOrigin);
    }
    const totalChars = messages.reduce((n, m) => n + (m.content?.length || 0), 0);
    if (totalChars > MAX_CONTENT_CHARS) {
      return json({ error: 'bad_request', message: 'Content too long.' }, 400, allowedOrigin);
    }

    // Extract current question (last user message) and conversation history
    const nonSystem    = messages.filter(m => m.role !== 'system');
    const lastUserIdx  = [...nonSystem].reverse().findIndex(m => m.role === 'user');
    if (lastUserIdx === -1) {
      return json({ error: 'bad_request', message: 'No user message found.' }, 400, allowedOrigin);
    }
    const currentInput = nonSystem[nonSystem.length - 1 - lastUserIdx].content;

    // Build chat_history: all preceding user/assistant turns (capped)
    const preceding    = nonSystem.slice(0, nonSystem.length - 1 - lastUserIdx);
    const chatHistory  = preceding
      .slice(-(HISTORY_TURNS * 2))
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }));

    // Forward to HF Space RAG backend
    const hfUrl = (env.HF_SPACE_URL || '').replace(/\/$/, '') + '/chat';
    let ragRes;
    try {
      ragRes = await fetch(hfUrl, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': env.SHARED_SECRET || '',
        },
        body: JSON.stringify({ input: currentInput, chat_history: chatHistory }),
      });
    } catch (err) {
      console.error('HF Space fetch error:', err);
      return json({ error: 'upstream_error', message: 'Could not reach the model. Try again.' }, 502, allowedOrigin);
    }

    if (!ragRes.ok) {
      const text = await ragRes.text().catch(() => '');
      console.error('HF Space error', ragRes.status, text);
      if (ragRes.status === 429) {
        return json({ error: 'rate_limited', message: 'Model is busy — try again in a moment.' }, 429, allowedOrigin);
      }
      if (ragRes.status === 503) {
        return json({ error: 'warming_up', message: 'Service is warming up — try again in 30 seconds.' }, 503, allowedOrigin);
      }
      return json({ error: 'upstream_error', message: 'Model returned an error. Try again.' }, 502, allowedOrigin);
    }

    let data;
    try { data = await ragRes.json(); }
    catch { return json({ error: 'upstream_error', message: 'Unexpected response from model.' }, 502, allowedOrigin); }

    return json({ reply: data.reply || '' }, 200, allowedOrigin);
  },
};
