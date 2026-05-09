import os
import logging
from contextlib import asynccontextmanager
from typing import List, Dict

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GROQ_API_KEY  = os.environ["GROQ_API_KEY"]
WORKER_SECRET = os.environ.get("WORKER_SECRET", "")
EMBED_MODEL   = "BAAI/bge-small-en-v1.5"
INDEX_PATH    = "faiss_index"

_rag_chain = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _rag_chain
    logger.info("Loading FAISS index...")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBED_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )
    vectorstore = FAISS.load_local(INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
    retriever   = vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 5, "fetch_k": 12},
    )

    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.3,
        max_tokens=500,
        api_key=GROQ_API_KEY,
    )

    # ── Prompt 1: reformulate question using chat history ──────────────────
    contextualize_prompt = ChatPromptTemplate.from_messages([
        ("system", (
            "Given the conversation history and the user's latest message, "
            "rewrite it as a self-contained question that can be answered without "
            "needing to see the history. Do NOT answer — only rephrase when necessary, "
            "otherwise return the question as-is."
        )),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_prompt)

    # ── Prompt 2: answer using retrieved context ───────────────────────────
    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", (
            "You are PravGPT, the AI assistant on Praveen Sentha's personal portfolio website. "
            "Your audience is recruiters, hiring managers, and technical professionals who want "
            "to learn about Praveen's background, experience, skills, and projects.\n\n"
            "Guidelines:\n"
            "- Be concise and professional. 3–5 sentences unless more detail is explicitly requested.\n"
            "- Use plain prose. No bullet lists unless the user asks for a list.\n"
            "- Highlight what makes Praveen a strong candidate when relevant.\n"
            "- Only answer using the context provided. If something isn't covered, say you don't "
            "have that specific detail and suggest emailing praveen.sentha@gmail.com.\n"
            "- Never fabricate facts, job titles, companies, or numbers.\n\n"
            "Context from knowledge base:\n{context}"
        )),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    qa_chain   = create_stuff_documents_chain(llm, qa_prompt)
    _rag_chain = create_retrieval_chain(history_aware_retriever, qa_chain)

    logger.info("RAG chain ready.")
    yield


app = FastAPI(lifespan=lifespan)


# ── Auth middleware ────────────────────────────────────────────────────────
@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.url.path in ("/", "/health"):
        return await call_next(request)
    if WORKER_SECRET:
        token = request.headers.get("X-Auth-Token", "")
        if token != WORKER_SECRET:
            return JSONResponse({"error": "unauthorized"}, status_code=401)
    return await call_next(request)


# ── Models ─────────────────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    input: str
    chat_history: List[Dict[str, str]] = []   # [{"role": "user"|"assistant", "content": "..."}]

class ChatResponse(BaseModel):
    reply: str


# ── Routes ─────────────────────────────────────────────────────────────────
@app.get("/")
@app.get("/health")
def health():
    return {"status": "ok", "ready": _rag_chain is not None}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not _rag_chain:
        raise HTTPException(status_code=503, detail="Service warming up — try again in a moment.")
    if not req.input.strip():
        raise HTTPException(status_code=400, detail="Empty input.")
    if len(req.input) > 1000:
        raise HTTPException(status_code=400, detail="Input too long (max 1000 chars).")

    # Convert OpenAI-style history to LangChain message objects
    lc_history = []
    for msg in req.chat_history[-20:]:   # cap at 10 turns (20 messages)
        role, content = msg.get("role"), msg.get("content", "")
        if role == "user":
            lc_history.append(HumanMessage(content=content))
        elif role == "assistant":
            lc_history.append(AIMessage(content=content))

    try:
        result = await _rag_chain.ainvoke({
            "input": req.input,
            "chat_history": lc_history,
        })
        reply = (result.get("answer") or "").strip()
        if not reply:
            raise ValueError("Empty answer from RAG chain")
        return ChatResponse(reply=reply)
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("RAG chain error: %s", exc, exc_info=True)
        raise HTTPException(status_code=500, detail="Error generating response — try again.")
