from typing import List
from pydantic import BaseModel

class IngestRequest(BaseModel):
    lessonId: str
    content: str

class GenerateQuizRequest(BaseModel):
    lessonId: str
    questionCount: int = 5
    difficulty: str = "medium"
    questionTypes: List[str] = ["mcq"]
