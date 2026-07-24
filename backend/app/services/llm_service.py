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
            contents=[[t] for t in texts],
        )
        return [e.values for e in response.embeddings]

    def embed_query(self, query: str) -> list:
        response = self.client.models.embed_content(
            model=settings.EMBEDDING_MODEL,
            contents=query,
        )
        return response.embeddings[0].values

    def embed_queries(self, queries: list) -> list:
        response = self.client.models.embed_content(
            model=settings.EMBEDDING_MODEL,
            contents=[[q] for q in queries],
        )
        return [e.values for e in response.embeddings]

    def generate_quiz(self, context: str, difficulty: str, count: int, types: list, bloom_taxonomy: str = "Remembering") -> dict:
        bloom_guidance = {
            "Remembering": "Focus on direct recall of facts, definitions, model names, and specific terminology directly stated in the text.",
            "Understanding": "Focus on explaining concepts, summarizing core mechanics, and explaining why tools or systems function as described.",
            "Applying": "Focus on practical use cases, scenario-based problem solving, API endpoints, and configuration examples.",
            "Analyzing": "Focus on comparing components (e.g. LLM vs AI Agent, API vs MCP, single agent vs agent-to-agent), architectural decisions, and structural relationships.",
            "Evaluating": "Focus on evaluating trade-offs, assessing validity of statements, identifying errors, and judging optimal system architectures.",
            "Creating": "Focus on designing multi-agent workflows, combining MCP tools with LLMs, and synthesizing solution architectures."
        }
        
        guidance_text = bloom_guidance.get(bloom_taxonomy, bloom_guidance["Remembering"])

        prompt = f"""
        You are an elite educational AI assessment engine grounded in Retrieval-Augmented Generation (RAG).
        Generate a quiz based STRICTLY AND FAITHFULLY on the provided lesson transcript context.

        Assessment Specifications:
        - Target Difficulty: {difficulty}
        - Total Questions: {count}
        - Allowed Question Types: {', '.join(types)}
        - Targeted Bloom's Taxonomy Level: {bloom_taxonomy} ({guidance_text})

        GROUNDING & RAG CITATION RULES:
        1. Every question MUST be answerable directly using the provided Context.
        2. Do NOT invent facts outside the provided Context.
        3. For every question, provide a "sourceSnippet" (an exact quote or core excerpt from the text that proves the answer) and "contextRef" ("Verified RAG Citation").

        Context:
        {context}

        Output the quiz as a valid JSON array of objects. Do not include markdown code blocks (like ```json), just output the raw JSON array.
        Each object must strictly match this schema:
        {{
          "question": "The clear question text",
          "type": "mcq" | "true_false" | "fill_blank" | "short_answer",
          "difficulty": "{difficulty}",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "The exact correct answer",
          "explanation": "Detailed explanation of why this answer is correct based on the text",
          "sourceSnippet": "Exact quote or key excerpt from context proving the answer",
          "contextRef": "Verified RAG Citation"
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
