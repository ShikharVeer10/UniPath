import os
from io import BytesIO
from pypdf import PdfReader
from openai import OpenAI
from sqlmodel.ext.asyncio import AsyncSession
from app.models.rag_documentmodel import UniversityDocument

client=OpenAI(base_url="http://localhost:11434/v1",api_key="ollama",)

async def ingest_university_pdf(db:AsyncSession,university_id:int,file_bytes:bytes,chunk_size:int=500):
    pdf_file=BytesIO(file_bytes)
    reader=PdfReader(pdf_file)

    full_text=""
    for page in reader.pages:
        text=page.extract_text()
        if text:
            full_text += text + "\n"

    if not full_text.strip():
        raise ValueError("Provided PDF file contains no readable text.")

    words=full_text.split()
    chunks=[" ".join(words[i:i + chunk_size]) for i in range(0,len(words),chunk_size)]
    for chunk in chunks:
        dummy_embedding=[0.0]*1536

        doc_entry=UniversityDocument(university=university_id,chunk_text=chunk,embedding=dummy_embedding)
        db.add(doc_entry)
    
    await db.commit()
    return len(chunks)