import os
import faiss
import numpy as np
from typing import List, Dict
from openai import OpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from sentence_transformers import CrossEncoder

# ========== CONFIG ==========
EMBED_MODEL = "text-embedding-3-large"
EMBED_DIM = 3072
INDEX_PATH = "faiss_index.index"

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# In-memory document store
documents: List[Dict] = []
faiss_index = faiss.IndexFlatIP(EMBED_DIM)

# ========== UTILS ==========

def normalize(vectors: np.ndarray) -> np.ndarray:
    """Normalize vectors for cosine similarity."""
    return vectors / np.linalg.norm(vectors, axis=1, keepdims=True)


def embed_text(text: str) -> np.ndarray:
    """Create normalized embeddings using OpenAI API."""
    resp = client.embeddings.create(model=EMBED_MODEL, input=text)
    emb = np.array(resp.data[0].embedding, dtype=np.float32)
    return emb / np.linalg.norm(emb)


def load_index():
    """Load FAISS index from disk if available."""
    global faiss_index
    if os.path.exists(INDEX_PATH):
        faiss_index = faiss.read_index(INDEX_PATH)
        print("✅ Loaded existing FAISS index.")
    else:
        print("🆕 No existing index found, starting fresh.")


def save_index():
    """Persist FAISS index to disk."""
    faiss.write_index(faiss_index, INDEX_PATH)


# ========== DOCUMENT PROCESSING ==========

def process_documents(file_texts: Dict[str, str]):
    """
    Takes a dict of {filename: text} and indexes them in FAISS.
    Uses semantic-aware chunking and large embedding model.
    """
    global documents, faiss_index

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=300,
        separators=["\n\n", "\n", ".", "!", "?", " ", ""]
    )

    print("🔍 Processing documents...")

    all_chunks = []
    embeddings = []

    for filename, text in file_texts.items():
        chunks = splitter.split_text(text)
        for chunk in chunks:
            entry = {
                "text": chunk,
                "doc": filename,
            }
            all_chunks.append(entry)

            emb = embed_text(f"Document: {filename}\n\n{chunk}")
            embeddings.append(emb)

    embeddings = np.vstack(embeddings).astype("float32")
    normalized = normalize(embeddings)

    if faiss_index.ntotal == 0:
        faiss_index = faiss.IndexFlatIP(EMBED_DIM)

    faiss_index.add(normalized)
    documents.extend(all_chunks)
    save_index()

    print(f"✅ Indexed {len(all_chunks)} chunks from {len(file_texts)} documents.")


# ========== RETRIEVAL ==========

def retrieve_relevant_chunks(query: str, k: int = 15) -> List[Dict]:
    """Retrieve top-k most relevant chunks from FAISS."""
    q_emb = embed_text(query).reshape(1, -1)
    D, I = faiss_index.search(q_emb, k)
    return [documents[i] for i in I[0] if i < len(documents)]


def rerank_results(query: str, candidates: List[Dict]) -> List[Dict]:
    """Re-rank retrieved chunks using a cross-encoder model."""
    pairs = [(query, c["text"]) for c in candidates]
    scores = reranker.predict(pairs)
    ranked = sorted(zip(scores, candidates), reverse=True, key=lambda x: x[0])
    return [r[1] for r in ranked]


# ========== ANSWER GENERATION ==========

def answer_query(question: str) -> str:
    """Retrieve best-matching context and generate final answer."""
    if not documents:
        return "⚠️ No documents have been uploaded or processed yet."

    retrieved = retrieve_relevant_chunks(question)
    ranked = rerank_results(question, retrieved)[:6]

    context = "\n\n".join(
        [f"[{r['doc']}] {r['text']}" for r in ranked]
    )

    prompt = f"""
You are an intelligent document assistant (RAG system).
Answer the user's question based ONLY on the information provided below.

If the answer is not explicitly contained in the context,
reply exactly with:
"❌ The answer is not available in the provided documents."

Context:
{context}

Question:
{question}

Answer in the same language as the question.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a factual assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )
        answer = response.choices[0].message.content.strip()
        return answer

    except Exception as e:
        print("❌ Error generating answer:", str(e))
        return "⚠️ An error occurred while generating the answer."


# ========== RESET ==========

def reset_engine():
    """Reset FAISS index and in-memory docs."""
    global documents, faiss_index
    documents = []
    faiss_index = faiss.IndexFlatIP(EMBED_DIM)
    if os.path.exists(INDEX_PATH):
        os.remove(INDEX_PATH)
    print("🧹 Query engine reset.")
