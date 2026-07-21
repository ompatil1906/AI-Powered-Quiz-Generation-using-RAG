from fastapi import APIRouter, HTTPException
from app.models.schemas import GenerateQuizRequest
from app.services.llm_service import llm_service
from app.services.vector_store import vector_store

router = APIRouter()

@router.post("/generate-quiz")
async def generate_quiz(request: GenerateQuizRequest):
    if not llm_service.check_ready():
        raise HTTPException(status_code=500, detail="Gemini API Key not configured")
        
    try:
        query_text = "Important facts, key concepts, definitions, and details suitable for a quiz."
        query_embedding = llm_service.embed_query(query_text)
        
        context_chunks = vector_store.query(request.lessonId, query_embedding, n_results=15)
        
        if not context_chunks:
            raise HTTPException(status_code=404, detail="Lesson not found or no context available. Please ingest first.")
            
        context = "\n\n---\n\n".join(context_chunks)
        
        quiz_json = llm_service.generate_quiz(
            context=context,
            difficulty=request.difficulty,
            count=request.questionCount,
            types=request.questionTypes
        )
        
        return {"questions": quiz_json}
        
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse LLM response as JSON.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
