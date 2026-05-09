"""
Run once at Docker build time to pre-build the FAISS index.
Output: ./faiss_index/ directory (loaded at startup by app.py)
"""
import os
from pathlib import Path
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import MarkdownHeaderTextSplitter, RecursiveCharacterTextSplitter

EMBED_MODEL = "BAAI/bge-small-en-v1.5"
KB_DIR = Path("kb")
INDEX_PATH = "faiss_index"

HEADER_SPLITS = [("#", "h1"), ("##", "h2"), ("###", "h3")]

def load_kb_docs():
    splitter = MarkdownHeaderTextSplitter(headers_to_split_on=HEADER_SPLITS, strip_headers=False)
    docs = []
    for md_file in sorted(KB_DIR.glob("*.md")):
        text = md_file.read_text(encoding="utf-8")
        chunks = splitter.split_text(text)
        for chunk in chunks:
            chunk.metadata["source"] = md_file.stem
        docs.extend(chunks)
    return docs

def chunk_docs(docs):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=60)
    return splitter.split_documents(docs)

def main():
    print("Loading knowledge base...")
    docs = load_kb_docs()
    chunks = chunk_docs(docs)
    print(f"  {len(docs)} markdown sections → {len(chunks)} chunks")

    print(f"Loading embedding model: {EMBED_MODEL}")
    embeddings = HuggingFaceEmbeddings(
        model_name=EMBED_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

    print("Building FAISS index...")
    vectorstore = FAISS.from_documents(chunks, embeddings)
    vectorstore.save_local(INDEX_PATH)
    print(f"Index saved to ./{INDEX_PATH}/")
    print(f"Done — {len(chunks)} vectors indexed.")

if __name__ == "__main__":
    main()
