import os
import numpy as np
import faiss
from openai import OpenAI
#from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_text_splitters import RecursiveCharacterTextSplitter

from utils.document_loader import extract_text_from_file

client = OpenAI(api_key="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")
# In-memory FAISS index
EMBEDDING_DIM = 1536
index = faiss.IndexFlatL2(EMBEDDING_DIM)
chunks = []  # store {text, doc_name, embedding}


def embed_text(text: str):
    """
    Convert text to an OpenAI embedding vector.
    """
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return np.array(response.data[0].embedding, dtype=np.float32)


def process_documents(filepaths: list):
    """
    Extracts, chunks, embeds, and stores document sections in FAISS.
    """
    global index, chunks
    index.reset()
    chunks = []

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
        separators=["\n\n", "\n", ".", "!", "?", " ", ""],
    )

    for path in filepaths:
        filename = os.path.basename(path)
        text = extract_text_from_file(path, filename)
        if not text.strip():
            print(f"⚠️ No readable text in {filename}")
            continue

        for chunk in splitter.split_text(text):
            emb = embed_text(chunk)
            index.add(np.array([emb]))
            chunks.append({"text": chunk, "doc": filename, "embedding": emb})


def retrieve_relevant_chunks(query: str, k: int = 5):
    """
    Retrieve top-k most semantically relevant chunks for the given query.
    """
    if len(chunks) == 0:
        return []

    q_emb = embed_text(query)
    D, I = index.search(np.array([q_emb]), k)
    results = [chunks[i] for i in I[0] if i < len(chunks)]
    return results


def answer_query(question: str):
    """
    Retrieves relevant chunks and asks OpenAI for an answer.
    """
    relevant = retrieve_relevant_chunks(question)

    if not relevant:
        return "❌ No relevant documents found. Please upload files first."

    context = "\n\n".join(
        [f"[{r['doc']}] {r['text']}" for r in relevant]
    )

    prompt = f"""
You are an intelligent document assistant using retrieval-augmented generation (RAG).
Use only the provided context to answer truthfully.
If the answer cannot be found, respond with:
"❌ The answer is not available in the provided documents."

Question: {question}

Context:
{context}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a strict document QA assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
    )

    return response.choices[0].message.content.strip()
