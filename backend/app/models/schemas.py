from typing import List, Optional, Any, Dict
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

# Auth Schemas
class UserRegisterRequest(BaseModel):
    email: str
    password: str
    fullName: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    fullName: str
    createdAt: str

class HistorySaveRequest(BaseModel):
    userId: str
    lessonId: str
    config: Optional[Dict[str, Any]] = None
    quiz: List[Dict[str, Any]]
    ragStats: Optional[Dict[str, Any]] = None
