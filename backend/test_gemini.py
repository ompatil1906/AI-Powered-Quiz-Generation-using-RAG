import os
import time
from google import genai
from dotenv import load_dotenv

load_dotenv()
try:
    API_KEY = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=API_KEY)
    
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=["Hello", "World", "Test"],
    )
    print(f"SUCCESS! Returned {len(response.embeddings)} embeddings.")
except Exception as e:
    import traceback
    traceback.print_exc()
