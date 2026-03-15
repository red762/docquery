
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
