import fitz
from docx import Document
from openpyxl import load_workbook
from pptx import Presentation
import os

def extract_text_from_file(filepath: str, filename: str) -> str:
    ext = os.path.splitext(filename)[1].lower()
    text = ""

    if ext == ".pdf":
        with fitz.open(filepath) as doc:
            for page in doc:
                text += page.get_text("text")
    elif ext == ".docx":
        text = "\n".join([p.text for p in Document(filepath).paragraphs])
    elif ext == ".xlsx":
        wb = load_workbook(filepath, data_only=True)
        for ws in wb.worksheets:
            for row in ws.iter_rows(values_only=True):
                text += " ".join([str(c) for c in row if c]) + "\n"
    elif ext == ".pptx":
        prs = Presentation(filepath)
        for slide in prs.slides:
            for shape in slide.shapes:
                if hasattr(shape, "text"):
                    text += shape.text + "\n"
    elif ext == ".txt":
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()

    return text.strip()
