# ---------------------------
# Stage 1: Base Python image
# ---------------------------
FROM python:3.10-slim

# Prevent Python from buffering logs
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# ---------------------------
# Install dependencies
# ---------------------------
# Update packages and install system deps for OCR, PDFs, images, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    tesseract-ocr-fra \
    tesseract-ocr-ara \
    tesseract-ocr-deu \
    tesseract-ocr-chi-sim \
    tesseract-ocr-rus \
    libtesseract-dev \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ---------------------------
# Install Python dependencies
# ---------------------------
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------------------------
# Copy project files
# ---------------------------
COPY backend/ .

# ---------------------------
# Expose API port
# ---------------------------
EXPOSE 8000

# ---------------------------
# Start FastAPI with Uvicorn
# ---------------------------
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
