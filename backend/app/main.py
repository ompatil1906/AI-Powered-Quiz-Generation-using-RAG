from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import ingest, quiz, auth

app = FastAPI(title="AI Quiz Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingest.router)
app.include_router(quiz.router)
app.include_router(auth.router)

@app.get("/health")
async def health_check():
    from app.services.llm_service import llm_service
    is_ready = llm_service.check_ready()
    return {
        "status": "healthy" if is_ready else "degraded",
        "api_ready": is_ready,
        "llm_model": "gemini-2.5-flash",
        "embedding_model": "gemini-embedding-2",
        "vector_store": "ChromaDB (Persistent)",
        "database": "SQLite (quiz_studio.db)",
        "rag_pipeline": "Enabled",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
