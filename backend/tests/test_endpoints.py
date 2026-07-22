import unittest
from fastapi.testclient import TestClient
from app.main import app

class TestAPIEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)
        self.assertEqual(data["version"], "1.0.0")

    def test_ingest_empty_content(self):
        response = self.client.post("/ingest", json={"lessonId": "test-lesson", "content": "   "})
        self.assertEqual(response.status_code, 400)
        self.assertIn("Content cannot be empty", response.json()["detail"])

    def test_generate_quiz_missing_lesson(self):
        response = self.client.post("/generate-quiz", json={
            "lessonId": "non-existent-lesson-99999",
            "questionCount": 5,
            "difficulty": "easy",
            "questionTypes": ["mcq"]
        })
        self.assertEqual(response.status_code, 404)
        self.assertIn("Lesson not found", response.json()["detail"])

    def test_eval_metrics(self):
        response = self.client.get("/rag/eval-metrics?lessonId=test-lesson")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("overallScore", data)

if __name__ == "__main__":
    unittest.main()
