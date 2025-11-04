from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from utils.document_loader import extract_text_from_file
from utils.query_engine import ask_openai
import tempfile

app = FastAPI(title="DocQuery Backend", version="1.0")

# Allow your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary in-memory store for extracted text
DOCUMENTS_CONTENT = ""


@app.post("/upload")
async def upload_documents(files: List[UploadFile] = File(...)):
    """
    Accepts multiple files, extracts their text,
    and stores the combined content temporarily in memory.
    """
    global DOCUMENTS_CONTENT
    DOCUMENTS_CONTENT = ""

    for file in files:
        # Save to a temp file for reading
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            tmp.flush()
            text = extract_text_from_file(tmp.name, file.filename)
            DOCUMENTS_CONTENT += f"\n\n--- Document: {file.filename} ---\n{text}"

    return {"status": "success", "message": "Documents uploaded and processed."}


@app.post("/query")
async def query_document(question: str = Form(...)):
    """
    Queries the combined documents with the given question.
    """
    global DOCUMENTS_CONTENT

    if not DOCUMENTS_CONTENT:
        return {"error": "No documents uploaded yet."}

    answer = ask_openai(DOCUMENTS_CONTENT, question)
    return {"answer": answer}
