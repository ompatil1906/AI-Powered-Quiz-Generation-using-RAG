import chromadb
from app.core.config import settings

class VectorStore:
    def __init__(self):
        self.client = chromadb.PersistentClient(path=settings.CHROMA_DB_PATH)
        self.collection = self.client.get_or_create_collection(name="lessons")

    def add_chunks(self, lesson_id: str, chunks: list, embeddings: list):
        ids = [f"{lesson_id}-chunk-{i}" for i in range(len(chunks))]
        metadatas = [{"lessonId": lesson_id, "chunkIndex": i} for i in range(len(chunks))]
        
        # Check if already exists and delete to overwrite
        existing = self.collection.get(where={"lessonId": lesson_id})
        if existing and existing['ids']:
            self.collection.delete(ids=existing['ids'])
            
        self.collection.add(
            embeddings=embeddings,
            documents=chunks,
            metadatas=metadatas,
            ids=ids
        )

    def query(self, lesson_id: str, query_embedding: list, n_results: int = 15):
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where={"lessonId": lesson_id}
        )
        if not results['documents'] or not results['documents'][0]:
            return None
        return results['documents'][0]

vector_store = VectorStore()
