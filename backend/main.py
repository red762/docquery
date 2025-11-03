from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import tempfile

from utils.rag_engine import process_documents, answer_query

app = FastAPI(title="DocQuery RAG Engine", version="3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Processes multiple uploaded documents and builds a RAG index (vector DB).
    """
    with tempfile.TemporaryDirectory() as tmpdir:
        filepaths = []
        for file in files:
            temp_path = f"{tmpdir}/{file.filename}"
            with open(temp_path, "wb") as f:
                f.write(await file.read())
            filepaths.append(temp_path)

        process_documents(filepaths)

    return {"status": "success", "count": len(files)}

@app.post("/query")
async def query_documents(question: str = Form(...)):
    """
    Retrieve relevant context via embeddings and query OpenAI for an answer.
    """
    answer = answer_query(question)
    return {"answer": answer}
