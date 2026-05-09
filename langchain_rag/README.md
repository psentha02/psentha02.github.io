---
title: PravGPT RAG Backend
emoji: 🤖
colorFrom: blue
colorTo: indigo
sdk: docker
pinned: false
---

# PravGPT RAG Backend

LangChain RAG backend for [psentha02.github.io](https://psentha02.github.io).

- **Embeddings**: `BAAI/bge-small-en-v1.5` (baked into image, no cold-start)
- **Vector store**: FAISS (pre-built at image build time)
- **Retrieval**: MMR (Maximal Marginal Relevance, k=5)
- **LLM**: Groq `llama-3.3-70b-versatile`
- **Chain**: LCEL `create_history_aware_retriever` + `create_retrieval_chain`

## Deploy to Hugging Face Spaces

### 1. Create a new Space
- Go to huggingface.co → New Space
- Name it `pravgpt` (URL will be `https://huggingface.co/spaces/<username>/pravgpt`)
- SDK: **Docker**
- Visibility: Public

### 2. Set Secrets (Settings → Variables and Secrets → New Secret)
| Name | Value |
|---|---|
| `GROQ_API_KEY` | Your Groq API key from console.groq.com |
| `WORKER_SECRET` | A random string you invent — must match `SHARED_SECRET` in the Cloudflare Worker |

### 3. Push this directory as the Space repo
```bash
cd langchain_rag/

git init
git remote add space https://huggingface.co/spaces/<YOUR_HF_USERNAME>/pravgpt
git add .
git commit -m "initial"
git push space main
```

HF will build the Docker image (5–10 min first time). When the build finishes,
your Space URL is: `https://<username>-pravgpt.hf.space`

### 4. Update the Cloudflare Worker
```bash
cd ../worker/
wrangler secret put HF_SPACE_URL
# enter: https://<username>-pravgpt.hf.space

wrangler secret put SHARED_SECRET
# enter: the same random string you used for WORKER_SECRET above

wrangler deploy
```

### 5. Test
```bash
curl -X POST https://<username>-pravgpt.hf.space/chat \
  -H "X-Auth-Token: <your-WORKER_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{"input": "What does Praveen do at Qualcomm?", "chat_history": []}'
```

## Updating the Knowledge Base

Edit any file in `kb/`, commit, and push to the Space repo.
The Docker image rebuilds automatically and the new index is baked in.

## Endpoint

`POST /chat`
```json
{
  "input": "What is Praveen's strongest technical achievement?",
  "chat_history": [
    {"role": "user", "content": "Tell me about Praveen"},
    {"role": "assistant", "content": "..."}
  ]
}
```
Returns: `{"reply": "..."}`

`GET /health` → `{"status": "ok", "ready": true}`
