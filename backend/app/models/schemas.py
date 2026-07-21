from typing import List, Optional
from pydantic import BaseModel

class IngestRequest(BaseModel):
    lessonId: str
    content: str

class GenerateQuizRequest(BaseModel):
    lessonId: str
    questionCount: int = 5
    difficulty: str = "medium"
    questionTypes: List[str] = ["mcq"]
    bloomTaxonomy: Optional[str] = "Remembering"

class RAGQueryRequest(BaseModel):
    lessonId: str
    query: str
    topK: Optional[int] = 5
