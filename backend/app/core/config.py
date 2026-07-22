import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CHROMA_DB_PATH: str = "./chroma_db"
    EMBEDDING_MODEL: str = "text-embedding-004"
    GENERATION_MODEL: str = "gemini-2.5-flash"

settings = Settings()
