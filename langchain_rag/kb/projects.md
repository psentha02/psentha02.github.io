# Projects

## Text-to-SQL Infrastructure Agent
**Stack: LangChain, Anthropic Claude, FAISS, PostgreSQL, Python**

### Problem
Qualcomm's infrastructure team managed server data across 20+ global data centers in SQL databases. Extracting insights required an analyst who could write SQL — this created a bottleneck for director-level decisions that needed quick answers about fleet status, firmware versions, capacity, and anomalies.

### What Praveen Built
A production natural-language to SQL agent with a semantic layer over infrastructure data. The system uses:
- **LangChain** to orchestrate the agent pipeline
- **FAISS** vector search over a semantic layer of table/column descriptions (so the agent "knows" what each field means in business terms, not just technical schema names)
- **Anthropic Claude** as the language model to generate SQL from natural language
- **PostgreSQL** as the underlying data store

Directors and engineers ask questions in plain English. The agent reformulates the question into SQL, executes it against the database, and returns a human-readable answer. Edge cases (ambiguous questions, multi-table joins, aggregations) are handled through the semantic layer that maps business vocabulary to schema vocabulary.

### Impact
90% reduction in time-to-insight for root-cause analysis. This is a production system actively used by directors at Qualcomm for daily capacity planning.

---

## Hunch — Peer-to-Peer Prediction Market Platform
**Stack: Next.js, Supabase, PostgreSQL, Vercel, Google OAuth**
**Live at**: hunch-beta.vercel.app

### What It Is
A production-ready P2P prediction market platform. Users create markets on any topic, other users make predictions with stakes, and when the market resolves the payouts are distributed via a refund-based zero-sum model (losers' stakes are redistributed to winners proportionally).

### Technical Highlights
- Full serverless deployment: Next.js frontend + API routes on Vercel, Supabase for PostgreSQL and auth
- Google OAuth for user authentication
- Fair payout algorithm: refund-based model ensures zero-sum outcomes with no house edge
- Market lifecycle management: creation, active prediction period, outcome submission, resolution, and payout

### Why It Matters as a Portfolio Project
Hunch demonstrates that Praveen can build a complete consumer-facing product end-to-end — not just infrastructure tooling. It shows product thinking (how do you make a fair P2P market?), full-stack development (auth, database, API design, frontend), and deployment on modern serverless infrastructure.

---

## Telemetry Ingestion Pipelines
**Stack: PowerShell, Python, Azure DevOps, Grafana, Prometheus**

### What It Does
Continuous infrastructure telemetry ingestion processing 100,000+ rows of server data every 30 minutes. The pipeline:
- Collects telemetry from servers across 20+ global data centers using distributed low-latency ingestion VMs
- Runs on a 30-minute cadence with Azure DevOps CI/CD orchestration
- Includes validation checks to catch data quality issues before they hit dashboards
- Feeds automated alerting for anomalies in CPU, memory, and storage utilization
- Provides the data foundation for the Grafana capacity planning dashboards used by Qualcomm leadership

### Scale
At 100K+ rows every 30 minutes, this pipeline ingests approximately 4.8 million rows per day of infrastructure telemetry. The pipeline reliability is critical — it directly feeds the dashboards Qualcomm directors use for billion-dollar infrastructure investment decisions.
