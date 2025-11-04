import requests
from pathlib import Path
from docx import Document
from pptx import Presentation
import openpyxl

OCR_API_URL = "https://ocr-1-l9fl.onrender.com/ocr"

def extract_text_from_file(path: str, filename: str) -> str:
    ext = filename.split(".")[-1].lower()

    try:
        if ext in ["pdf", "jpg", "jpeg", "png"]:
            with open(path, "rb") as f:
                files = {"file": (filename, f)}
                r = requests.post(OCR_API_URL, files=files)
                return r.json().get("text", "")

        elif ext == "docx":
            return "\n".join([p.text for p in Document(path).paragraphs])
        elif ext == "pptx":
            return "\n".join([shape.text for slide in Presentation(path).slides for shape in slide.shapes if hasattr(shape, "text")])
        elif ext == "xlsx":
            wb = openpyxl.load_workbook(path)
            return "\n".join(
                " ".join([str(c) for c in row if c]) for sheet in wb.sheetnames for row in wb[sheet].iter_rows(values_only=True)
            )
        elif ext == "txt":
            return open(path, "r", encoding="utf-8").read()

        else:
            return f"[Unsupported file type: {ext}]"
    except Exception as e:
        return f"[Error reading {filename}: {str(e)}]"
