import docx
import fitz  # PyMuPDF for PDFs
import pptx
import openpyxl

def extract_text_from_file(path: str, filename: str) -> str:
    ext = filename.split(".")[-1].lower()

    try:
        if ext == "pdf":
            return extract_from_pdf(path)
        elif ext == "docx":
            return extract_from_docx(path)
        elif ext == "txt":
            return open(path, "r", encoding="utf-8", errors="ignore").read()
        elif ext == "xlsx":
            return extract_from_xlsx(path)
        elif ext == "pptx":
            return extract_from_pptx(path)
        else:
            return f"[Unsupported file type: {ext}]"
    except Exception as e:
        return f"[Error reading {filename}: {str(e)}]"


def extract_from_pdf(path: str) -> str:
    text = ""
    with fitz.open(path) as doc:
        for page in doc:
            text += page.get_text()
    return text


def extract_from_docx(path: str) -> str:
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])


def extract_from_xlsx(path: str) -> str:
    wb = openpyxl.load_workbook(path)
    text = ""
    for sheet in wb.sheetnames:
        ws = wb[sheet]
        for row in ws.iter_rows(values_only=True):
            text += " ".join([str(cell) for cell in row if cell]) + "\n"
    return text


def extract_from_pptx(path: str) -> str:
    pres = pptx.Presentation(path)
    text = ""
    for slide in pres.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                text += shape.text + "\n"
    return text
