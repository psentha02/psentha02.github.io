FROM python:3.11-slim

WORKDIR /app

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy knowledge base and source
COPY kb/ kb/
COPY build_index.py app.py ./

# Bake embedding model download into the image (eliminates cold-start model fetch)
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('BAAI/bge-small-en-v1.5')"

# Pre-build the FAISS index (also baked into image — instant startup)
RUN python build_index.py

EXPOSE 7860

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
