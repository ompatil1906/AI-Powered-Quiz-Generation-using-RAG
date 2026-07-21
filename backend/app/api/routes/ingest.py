from fastapi import APIRouter, HTTPException
from app.models.schemas import IngestRequest
from app.services.text_processing import chunk_text
from app.services.llm_service import llm_service
from app.services.vector_store import vector_store

router = APIRouter()

@router.post("/ingest")
async def ingest_lesson(request: IngestRequest):
    if not llm_service.check_ready():
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
        
    chunks = chunk_text(request.content)
    
    try:
        embeddings = llm_service.embed_batch(chunks)
        vector_store.add_chunks(request.lessonId, chunks, embeddings)
        return {"status": "success", "message": f"Ingested {len(chunks)} chunks successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
