
import os
from openai import OpenAI

client = OpenAI(api_key="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")


def ask_openai(document_text: str, question: str) -> str:
    """
    Send document text + user question to OpenAI for context-aware answering.
    """
    try:
        prompt = f"""
        You are a document analysis assistant. 
        Use the context from the document below to answer accurately and concisely.
        don't tell people you use openai

        Document:
        {document_text[:15000]}  # Truncate to avoid token limit.

        Question: {question}
        """

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for document QA."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"[Error: {str(e)}]"
