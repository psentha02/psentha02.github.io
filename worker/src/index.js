// ─── Knowledge Base ───────────────────────────────────────────────────────────
// Full context is sent with every request (~4K tokens, well within Groq's 32K window).
// No embeddings, no retrieval, no external services — the LLM sees everything.

const KNOWLEDGE_BASE = `
# Praveen Sentha — Full Profile

## Who He Is
Praveen Sentha is an Infrastructure Engineer at Qualcomm in San Diego, CA, and is pursuing a
Master of Science in Computer Science (AI specialization) at Georgia Institute of Technology
(started January 2026). He graduated from Purdue University in December 2023 with a B.S. in
Data Science and a Certificate in Entrepreneurship & Innovation.

He is a U.S. Citizen and does not require visa sponsorship.

## In His Own Words (About Section)
"Hey, I'm Praveen. I'm an infrastructure engineer at Qualcomm from the Bay Area, currently based
in San Diego. Aside from Cloud Infrastructure, my interests include Agentic AI, MLOps, and
Cybersecurity to name a few. I'm passionate about building systems that have a real impact,
learning new skills, and solving problems in new areas.

When I'm not automating systems or building agents, I'm an athlete, food enthusiast, and traveller."

## Currently
- Studying AI & ML theory at Georgia Tech OMSCS
- Shipping production infrastructure tooling at Qualcomm
- Built Agent Workflow Runner — a Kubernetes-native platform for running LangGraph agents as isolated Jobs
- Built this portfolio's AI chat (PravGPT) using Cloudflare Workers + Groq

## Contact
- Email: praveen.sentha@gmail.com
- Phone: (925) 366-0766
- LinkedIn: linkedin.com/in/praveen-sentha
- GitHub: github.com/psentha02
- Website: psentha02.github.io
- Location: San Diego, CA

## What Makes Praveen Stand Out
Most engineers are infra specialists or AI specialists. Praveen is both — and in production, not
just on paper. He physically racks servers and writes the LLM agents that query them. That
combination is increasingly rare and valuable as companies try to bridge platform/infra teams with
their AI teams.

He shipped a production LLM agent at Qualcomm that real directors use daily — not a proof of
concept. The agent writes SQL, executes it, and returns answers about a global server fleet.

Interests: Distributed Systems, LLM Agents & RAG, Cloud Infrastructure, Observability,
Prediction Markets, MLOps, Algorithmic Trading, Cybersecurity.
Honors: Eagle Scout, Varsity Tennis Captain, Azure Fundamentals certified.

---

## Work Experience

### Qualcomm — Infrastructure Engineer, Server Lifecycle Automation
San Diego, CA | February 2024 – Present

**Scale**: 5,000+ ESXi hosts, 20+ global data centers, ~100 production servers delivered,
400+ monthly net-new host onboardings.

**AI / LLM Agent (flagship achievement)**: Built a production natural-language to SQL agent using
LangChain, Anthropic Claude, and FAISS vector search. The agent sits on a semantic layer over
infrastructure data — directors type plain-English questions and the agent writes SQL, executes it,
and returns human-readable answers. Result: 90% reduction in RCA time-to-insight. Used by Qualcomm
directors daily for capacity planning.

**Telemetry Pipelines**: Designed continuous infrastructure telemetry ingestion processing
100,000+ rows every 30 minutes using PowerShell and Python orchestrated through Azure DevOps CI/CD.
Feeds Grafana dashboards used for director-level capacity planning across CPU, memory, and storage.

**Security**: Led CyberArk PAM onboarding for 5,000+ ESXi hosts with automated password vaulting
and rotation. Handles 400+ monthly net-new host onboardings.

**Server Lifecycle**: Delivered ~100 production servers across 20+ global data centers —
complete lifecycle from procurement through firmware/BIOS validation to production handoff.

### Qualcomm — Software Engineering Intern, Server Lifecycle Automation
San Diego, CA | May 2023 – August 2023

Praveen's internship led directly to his full-time offer. Key work:
- Built a showback notification framework to surface VM over-provisioning and reduce virtualization costs
- Constructed a VM template pipeline on Azure DevOps + VMware vRealize with monthly updates and automated deployment tests
- Enhanced a system-management framework used across IT; validated end-to-end with Postman

### Stryker — Software Design Engineering Intern
San Jose, CA | May 2022 – August 2022

- Built a C# GUI application for display monitor testing, improving efficiency by 70%
- Used Microsoft SQL Server for performance data storage and analysis

---

## Projects

### Text-to-SQL Infrastructure Agent
Stack: LangChain, Anthropic Claude, FAISS, PostgreSQL, Python | Production at Qualcomm

Problem: Querying server fleet data required an analyst who could write SQL, creating a bottleneck
for director-level decisions. Praveen built a production agent with a semantic layer that maps
business vocabulary to database schema. Engineers ask plain-English questions; the agent writes
and executes the SQL and returns the answer. Cut RCA time-to-insight by 90%.

### Hunch — Peer-to-Peer Prediction Market
Stack: Next.js, Supabase, PostgreSQL, Vercel, Google OAuth | Live: hunch-beta.vercel.app

A production P2P prediction market. Users create markets, others make predictions, payouts
distributed via a refund-based zero-sum model. Full-stack: auth, database design, API, frontend,
serverless deployment. Demonstrates Praveen can build complete consumer products end-to-end.

### Telemetry Ingestion Pipelines
Stack: PowerShell, Python, Azure DevOps, Grafana, Prometheus | Production at Qualcomm

100,000+ rows every 30 minutes from servers across 20+ global data centers. Distributed
low-latency ingestion VMs, validation checks, automated alerting, and Grafana dashboards
used by Qualcomm leadership for infrastructure investment decisions.

### Agent Workflow Runner
Stack: Kubernetes, Helm, FastAPI, Python, Redis, LangGraph, Anthropic Claude, Prometheus, Grafana, Docker
GitHub: github.com/psentha02/agent-workflow-runner

A Kubernetes-native AI task platform built from scratch. Clients submit tasks over HTTP and the
system dynamically provisions isolated Kubernetes Jobs that run Claude-powered LangGraph agents —
each with its own resource limits, failure domain, and lifecycle. The agent reasons in multiple
steps: planning, optional web search, synthesis, and a structured answer with a full reasoning
trace. Packaged as a Helm chart and instrumented with Prometheus metrics on Grafana dashboards.

---

## Skills

**Languages**: Python (daily), PowerShell (daily), SQL (advanced), JavaScript/TypeScript,
Go, Java, C#, R

**Infrastructure & Virtualization**: VMware ESXi, vCenter, Hyper-V, SCVMM, Azure Local,
VDI, Cloud PCs, CyberArk PAM, Active Directory

**Cloud & DevOps**: Azure, AWS, Azure DevOps, Git, Terraform, Kubernetes

**Data & Observability**: Grafana, Prometheus, PostgreSQL, MS SQL Server, MongoDB, Neo4j,
Apache Spark, Hadoop, Kibana

**AI & ML**: LangChain, FAISS, RAG, Text-to-SQL, Prompt Engineering, Anthropic Claude

**Best suited for**: AI Infrastructure Engineer, MLOps Engineer, LLM Application Engineer,
Platform Engineer at AI-native companies, Senior Infrastructure Engineer

---

## Education

**Georgia Institute of Technology** — M.S. Computer Science, AI Specialization
January 2026 – Present | OMSCS program (same curriculum and faculty as on-campus)

Praveen is building the theoretical and research foundations to complement his production AI
engineering experience. He has practitioner experience (LLM agents at Qualcomm) combined with
academic rigor (Georgia Tech AI program) — a combination most candidates have only one of.

**Purdue University** — B.S. Data Science + Certificate in Entrepreneurship & Innovation
August 2020 – December 2023 | Graduated in 3.5 years

Coursework: statistical modeling, machine learning, data engineering, Spark/Hadoop, databases,
programming (Python, R, Java). The entrepreneurship certificate reflects his interest in building
products — evidenced by Hunch.

---

## Recruiter FAQ

**Is Praveen open to new opportunities?**
Yes. His Georgia Tech M.S. in AI signals intentional career growth. He is open to conversations
about AI/ML Infrastructure, MLOps, LLM platform engineering, and AI application engineering.
Best contact: praveen.sentha@gmail.com

**Does he require visa sponsorship?**
No. U.S. Citizen.

**Where is he located? Open to relocation?**
San Diego, CA. Open to discussing relocation or remote for the right opportunity.

**Years of experience?**
Full-time since February 2024 (Qualcomm). Including internships (Stryker 2022, Qualcomm 2023),
he has been shipping production software since 2022.

**Strongest technical achievement?**
The production LangChain + Claude + FAISS text-to-SQL agent at Qualcomm — 90% reduction in
RCA time for directors. A real production system at enterprise scale, not a proof of concept.

**Has he worked at large companies or startups?**
Qualcomm (40,000+ employees) is his primary experience. He has also built Hunch independently,
showing he can operate in both structured enterprise environments and as a self-directed builder.

**Honors**: Eagle Scout, Varsity Tennis Captain, Azure Fundamentals certified.
**Interests**: Distributed systems, LLM agents and RAG, observability, tennis, scouting.
`;

const SYSTEM_PROMPT = `You are PravGPT, the AI assistant on Praveen Sentha's personal portfolio website.
Your audience is recruiters, hiring managers, and technical professionals.

RESPONSE FORMAT — follow this exactly:
- Use **bold** around key facts: names, companies, numbers, technologies (e.g. **Qualcomm**, **90% reduction**, **LangChain**)
- Separate distinct ideas with a blank line (two newlines) — never write one long wall of text
- For list-type answers (skills, tech stack, roles he fits), use "- item" bullet format, one per line
- Lead every response with the direct answer in the first sentence
- 2–3 short paragraphs or a paragraph + a short bullet list is the ideal length
- Only expand beyond that if the user explicitly asks for more detail
- Always speak about Praveen in third person ("He built…", "Praveen's experience…")

CONTENT RULES:
- Only use facts from the knowledge base below — never fabricate
- If something isn't covered, say so and suggest emailing praveen.sentha@gmail.com
- When answering overview questions, always mention: current role, biggest achievement (the AI agent + 90% stat), and Georgia Tech M.S.

Knowledge base:
${KNOWLEDGE_BASE}`;

// ─── Config ───────────────────────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  'https://psentha02.github.io',
  'http://localhost:8080',
  'http://localhost:3000',
  'http://127.0.0.1:8080',
];

const GROQ_API_URL   = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL          = 'llama-3.3-70b-versatile';
const MAX_TOKENS     = 650;
const MAX_MESSAGES   = 22;
const MAX_CHARS      = 20000;
const HISTORY_TURNS  = 10;   // last N user+assistant pairs sent to Groq

const rateLimitMap        = new Map();
const RATE_LIMIT_MAX      = 20;
const RATE_LIMIT_WINDOW   = 5 * 60 * 1000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isRateLimited(ip) {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
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

// ─── Handler ──────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const origin        = request.headers.get('Origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : null;

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
    if (totalChars > MAX_CHARS) {
      return json({ error: 'bad_request', message: 'Content too long.' }, 400, allowedOrigin);
    }

    // Extract current user question and preceding conversation history
    const nonSystem   = messages.filter(m => m.role === 'user' || m.role === 'assistant');
    const lastUserIdx = [...nonSystem].map(m => m.role).lastIndexOf('user');
    if (lastUserIdx === -1) {
      return json({ error: 'bad_request', message: 'No user message found.' }, 400, allowedOrigin);
    }

    const currentInput = nonSystem[lastUserIdx].content?.trim();
    if (!currentInput) {
      return json({ error: 'bad_request', message: 'Empty user message.' }, 400, allowedOrigin);
    }

    // Cap history to last N turns before the current message
    const history = nonSystem
      .slice(0, lastUserIdx)
      .slice(-(HISTORY_TURNS * 2))
      .map(({ role, content }) => ({ role, content }));

    // Call Groq with full knowledge base in system prompt
    let groqRes;
    try {
      groqRes = await fetch(GROQ_API_URL, {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          model:       MODEL,
          temperature: 0.3,
          max_tokens:  MAX_TOKENS,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: currentInput },
          ],
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
        return json({ error: 'rate_limited', message: 'Model is busy — try again in a moment.' }, 429, allowedOrigin);
      }
      return json({ error: 'upstream_error', message: 'Model returned an error. Try again.' }, 502, allowedOrigin);
    }

    let data;
    try { data = await groqRes.json(); }
    catch { return json({ error: 'upstream_error', message: 'Unexpected response from model.' }, 502, allowedOrigin); }

    const reply = data.choices?.[0]?.message?.content?.trim() || '';
    return json({ reply }, 200, allowedOrigin);
  },
};
