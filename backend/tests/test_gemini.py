import os
import unittest
from google import genai
from dotenv import load_dotenv

class TestGeminiIntegration(unittest.TestCase):
    def test_gemini_embedding(self):
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            self.skipTest("GEMINI_API_KEY not configured")
        
        client = genai.Client(api_key=api_key)
        response = client.models.embed_content(
            model="text-embedding-004",
            contents=["Hello", "World", "Test"],
        )
        self.assertEqual(len(response.embeddings), 3)

if __name__ == "__main__":
    unittest.main()
