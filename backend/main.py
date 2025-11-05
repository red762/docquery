from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
from utils.document_loader import extract_text_from_file
from utils.query_engine import ask_openai
import tempfile
import uuid
import asyncio

app = FastAPI(title="DocQuery Backend", version="1.1")

# Allow your Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # e.g. ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store
SESSION_DATA: Dict[str, str] = {}
SESSION_LOCK = asyncio.Lock()  # Prevent race conditions


@app.post("/session/start")
async def start_session():
    """
    Create a new session ID for document isolation.
    The frontend must use this session_id for all upload/query requests.
    """
    session_id = str(uuid.uuid4())
    async with SESSION_LOCK:
        SESSION_DATA[session_id] = ""
    return {"session_id": session_id}


@app.post("/upload")
async def upload_documents(
    session_id: str = Query(..., description="Unique session identifier"),
    files: List[UploadFile] = File(...)
):
    """
    Accepts multiple files, extracts text, and stores the content for this session only.
    """
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")

    combined_text = ""

    for file in files:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(await file.read())
            tmp.flush()
            text = extract_text_from_file(tmp.name, file.filename)
            combined_text += f"\n\n--- Document: {file.filename} ---\n{text}"

    async with SESSION_LOCK:
        SESSION_DATA[session_id] = combined_text

    return {"status": "success", "session_id": session_id}


@app.post("/query")
async def query_document(
    session_id: str = Query(..., description="Unique session identifier"),
    question: str = Form(...)
):
    """
    Queries documents belonging to the given session_id only.
    """
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")

    async with SESSION_LOCK:
        document_text = SESSION_DATA.get(session_id, "")

    if not document_text:
        return {"error": "No documents uploaded for this session."}

    answer = ask_openai(document_text, question)
    return {"answer": answer}


@app.delete("/session/end")
async def end_session(session_id: str = Query(...)):
    """
    Delete session data when user finishes to free memory.
    """
    async with SESSION_LOCK:
        SESSION_DATA.pop(session_id, None)
    return {"status": "ended"}
