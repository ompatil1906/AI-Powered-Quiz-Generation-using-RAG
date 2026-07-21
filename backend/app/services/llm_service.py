import json
from google import genai
from app.core.config import settings

class LLMService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None

    def check_ready(self):
        return self.client is not None

    def embed_batch(self, texts: list) -> list:
        response = self.client.models.embed_content(
            model=settings.EMBEDDING_MODEL,
            contents=texts,
        )
        return [e.values for e in response.embeddings]

    def embed_query(self, query: str) -> list:
        response = self.client.models.embed_content(
            model=settings.EMBEDDING_MODEL,
            contents=query,
        )
        return response.embeddings[0].values

    def generate_quiz(self, context: str, difficulty: str, count: int, types: list) -> dict:
        prompt = f"""
        You are an expert educational AI. Generate a quiz based STRICTLY on the provided lesson transcript context.

        Difficulty: {difficulty}
        Number of Questions: {count}
        Allowed Question Types: {', '.join(types)}

        Context:
        {context}

        Output the quiz as a valid JSON array of objects. Do not include markdown code blocks (like ```json), just output the raw JSON array.
        Each object must have the following structure:
        {{
          "question": "The question text",
          "type": "mcq" | "true_false" | "fill_blank" | "short_answer",
          "difficulty": "{difficulty}",
          "options": ["Option A", "Option B", "Option C", "Option D"], // ONLY include this if type is "mcq"
          "correctAnswer": "The correct answer",
          "explanation": "Explanation of why this is the correct answer based on the context"
        }}
        """

        response = self.client.models.generate_content(
            model=settings.GENERATION_MODEL,
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
        return json.loads(result_text)

llm_service = LLMService()
