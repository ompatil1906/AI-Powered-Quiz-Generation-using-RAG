import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

import chromadb
from google import genai

load_dotenv()

app = FastAPI(title="AI Quiz Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY) if API_KEY else None

chroma_client = chromadb.PersistentClient(path="./chroma_db")
try:
    collection = chroma_client.get_or_create_collection(name="lessons")
except Exception as e:
    print(f"Error initializing ChromaDB: {e}")

class IngestRequest(BaseModel):
    lessonId: str
    content: str

class GenerateQuizRequest(BaseModel):
    lessonId: str
    questionCount: int = 5
    difficulty: str = "medium"
    questionTypes: List[str] = ["mcq"]

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    chunks = []
    start = 0
    text_length = len(text)
    while start < text_length:
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap
    return chunks

@app.post("/ingest")
async def ingest_lesson(request: IngestRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
        
    chunks = chunk_text(request.content)
    
    try:
        # Generate embeddings in a single batch request to avoid rate limits
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=chunks,
        )
        embeddings = [e.values for e in response.embeddings]
            
        ids = [f"{request.lessonId}-chunk-{i}" for i in range(len(chunks))]
        metadatas = [{"lessonId": request.lessonId, "chunkIndex": i} for i in range(len(chunks))]
        
        # Check if already exists and delete to overwrite
        existing = collection.get(where={"lessonId": request.lessonId})
        if existing and existing['ids']:
            collection.delete(ids=existing['ids'])
            
        collection.add(
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas,
            ids=ids
        )
        
        return {"status": "success", "message": f"Ingested {len(chunks)} chunks successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-quiz")
async def generate_quiz(request: GenerateQuizRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
        
    try:
        query_text = "Important facts, key concepts, definitions, and details suitable for a quiz."
        query_embedding_res = client.models.embed_content(
            model="gemini-embedding-001",
            contents=query_text
        )
        query_embedding = query_embedding_res.embeddings[0].values
        
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=15,
            where={"lessonId": request.lessonId}
        )
        
        if not results['documents'] or not results['documents'][0]:
            raise HTTPException(status_code=404, detail="Lesson not found or no context available. Please ingest first.")
            
        context_chunks = results['documents'][0]
        context = "\n\n---\n\n".join(context_chunks)
        
        prompt = f"""
You are an expert educational AI. Generate a quiz based STRICTLY on the provided lesson transcript context.

Difficulty: {request.difficulty}
Number of Questions: {request.questionCount}
Allowed Question Types: {', '.join(request.questionTypes)}

Context:
{context}

Output the quiz as a valid JSON array of objects. Do not include markdown code blocks (like ```json), just output the raw JSON array.
Each object must have the following structure:
{{
  "question": "The question text",
  "type": "mcq" | "true_false" | "fill_blank" | "short_answer",
  "difficulty": "{request.difficulty}",
  "options": ["Option A", "Option B", "Option C", "Option D"], // ONLY include this if type is "mcq"
  "correctAnswer": "The correct answer",
  "explanation": "Explanation of why this is the correct answer based on the context"
}}
"""

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        result_text = response.text.strip()
        
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        elif result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
            
        result_text = result_text.strip()
        
        quiz_json = json.loads(result_text)
        return {"questions": quiz_json}
        
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse LLM response as JSON. Error: {{e}}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
