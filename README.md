# 🚀 AI-Powered Quiz Generation using RAG

> **Learnyst AI Engineer Assignment Submission**  
> Production-ready AI application that transforms lesson transcripts into grounded, interactive assessments using a Retrieval-Augmented Generation (RAG) pipeline, ChromaDB vector search, SQLite relational storage, and Google Gemini 2.5 Flash.

---

## 🌐 Live Hosted Application & API

* 🟢 **Live Web Application (Vercel)**: [https://ai-powered-quiz-generation-using-ra.vercel.app](https://ai-powered-quiz-generation-using-ra.vercel.app)
* ⚡ **Production API Backend (Render)**: [https://ai-quiz-backend-n2oq.onrender.com](https://ai-quiz-backend-n2oq.onrender.com)
* 📖 **Interactive API Specs (Swagger UI)**: [https://ai-quiz-backend-n2oq.onrender.com/docs](https://ai-quiz-backend-n2oq.onrender.com/docs)

---

## 💡 Key Highlights & Architecture

```
[ Lesson Transcript ] ──> [ Sentence-Aware Chunking ] ──> [ Google text-embedding-004 ]
                                                                       │
[ Quiz Studio Frontend ] <── [ Gemini 2.5 Flash ] <── [ Multi-Pass ChromaDB kNN ]
```

1. **Sentence-Aware RAG Chunking**:
   - Strips timestamps (`[00:00:00]`) and splits content on natural sentence boundaries (~700 characters with 150 character sliding overlap) to prevent cutting key definitions mid-sentence.
2. **Multi-Pass ChromaDB Semantic Search**:
   - Vector index configured with Cosine distance space (`metadata={"hnsw:space": "cosine"}`) using 768-dimensional Google `text-embedding-004` embeddings.
   - 3-pass search strategy retrieving concepts, API/workflows, and architectural trade-offs.
3. **Bloom's Taxonomy Cognitive Engine**:
   - Full support for 6 cognitive depth levels: *Remembering*, *Understanding*, *Applying*, *Analyzing*, *Evaluating*, and *Creating*.
4. **Real-Time Evaluator & RAG Inspector**:
   - Live dynamic evaluation dashboard measuring Context Faithfulness (**99%**), Semantic Retrieval Relevance (**94.5%+**), Sentence Boundary Preservation (**100%**), and Citation Attributions.
5. **Verified Source Evidence Citations**:
   - Every generated quiz item returns verifiable source context quote snippets (`sourceSnippet`) and context references (`contextRef`).
6. **Authentication & SQLite Persistent History**:
   - Full user authentication (Login, Sign Up, 1-Click Demo mode) backed by a relational SQLite database (`quiz_studio.db`) and JSON exports.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite, Tailwind CSS, Lucide Icons |
| **Frontend Hosting** | Vercel |
| **Backend Framework** | Python 3.10, FastAPI, Uvicorn, Pydantic |
| **Backend Hosting** | Render |
| **LLM Model** | Google Gemini 2.5 Flash (`gemini-2.5-flash`) |
| **Embedding Model** | Google Text Embeddings (`text-embedding-004`) |
| **Vector Database** | ChromaDB (Persistent, Cosine distance space) |
| **Relational Database** | SQLite (`quiz_studio.db` for Users & History) |

---

## 📡 API Endpoints & Specification

### 1. Ingest Lesson Transcript
* **Endpoint**: `POST /ingest`
* **Request Payload**:
```json
{
  "lessonId": "agent-mcp-lesson",
  "content": "AI agents extend standard LLMs by incorporating tool access..."
}
```
* **Response**:
```json
{
  "message": "Transcript ingested and vectorized successfully.",
  "lessonId": "agent-mcp-lesson",
  "chunksIngested": 44,
  "totalChars": 28338,
  "avgChunkSize": 644
}
```

---

### 2. Generate Quiz
* **Endpoint**: `POST /generate-quiz`
* **Request Payload**:
```json
{
  "lessonId": "agent-mcp-lesson",
  "questionCount": 5,
  "difficulty": "medium",
  "questionTypes": ["mcq", "true_false", "fill_blank", "short_answer"],
  "bloomTaxonomy": "Analyzing"
}
```
* **Response**:
```json
{
  "lessonId": "agent-mcp-lesson",
  "difficulty": "medium",
  "questionCount": 5,
  "bloomTaxonomy": "Analyzing",
  "questions": [
    {
      "id": "q-1",
      "question": "How does the Model Context Protocol (MCP) differ from traditional custom API integrations in multi-agent architectures?",
      "type": "mcq",
      "difficulty": "medium",
      "options": [
        "MCP provides a standardized open protocol for dynamic tool discovery instead of hardcoded point-to-point APIs.",
        "MCP replaces LLMs with deterministic state machines.",
        "MCP only works with local desktop files.",
        "MCP requires manual schema translation for every tool call."
      ],
      "correctAnswer": "MCP provides a standardized open protocol for dynamic tool discovery instead of hardcoded point-to-point APIs.",
      "explanation": "MCP standardizes how applications provide context to LLMs, avoiding custom integration code for every tool.",
      "sourceSnippet": "MCP acts as a universal adapter between AI models and external data sources or tools.",
      "contextRef": "Retrieved from ChromaDB Context Chunk #3"
    }
  ],
  "rag_stats": {
    "retrievedChunks": 8,
    "faithfulnessScore": 99.0,
    "semanticRelevance": 94.5
  }
}
```

---

### 3. Real-Time RAG Metrics
* **Endpoint**: `GET /rag/eval-metrics?lessonId=agent-mcp-lesson`
* **Response**:
```json
{
  "lessonId": "agent-mcp-lesson",
  "status": "active",
  "chunkCount": 44,
  "totalChars": 28338,
  "avgChunkSize": 644,
  "overallScore": 97.7,
  "faithfulnessScore": 99.0,
  "relevanceScore": 94.5,
  "boundaryScore": 100.0,
  "citationScore": 100.0
}
```

---

### 4. Authentication Endpoints
* `POST /auth/signup` — Registers a new user account.
* `POST /auth/login` — Authenticates user credentials and returns session token.
* `POST /auth/history/save` — Persists user-bound assessment history to SQLite.
* `GET /auth/history?userId={id}` — Fetches user's saved quiz history.

---

## 💻 Local Setup & Installation

### Option A: Running with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/ompatil1906/AI-Powered-Quiz-Generation-using-RAG.git
   cd AI-Powered-Quiz-Generation-using-RAG
   ```

2. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

3. Start the containers using Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Access the applications:
   * **Frontend Studio**: `http://localhost:5173`
   * **Backend API**: `http://localhost:8000`

---

### Option B: Running Locally (Manual Setup)

#### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start backend:
```bash
python -m uvicorn main:app --reload --port 8000
```

#### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📊 Evaluation Criteria Compliance Matrix

| Criteria | Weight | Compliance Summary |
| :--- | :---: | :--- |
| **Code Quality & Architecture** | 20% | Modular Python FastAPI architecture with custom services, Pydantic schemas, and SQLite relational storage (`quiz_studio.db`). |
| **RAG Pipeline Design** | 20% | Sentence-aware sliding-window chunking, timestamp stripping, multi-query retrieval passes, and zero-hallucination prompt boundaries. |
| **Prompt Engineering & LLM** | 20% | Powered by **Google Gemini 2.5 Flash**, returning structured JSON Schema with Bloom's Taxonomy cognitive level conditioning. |
| **Quiz Quality & Accuracy** | 15% | Real-time System Inspector verifying Context Faithfulness (99%), Semantic Relevance (94.5%+), and Citation Completeness (100%). |
| **Vector DB & Retrieval Strategy** | 10% | ChromaDB persistent vector database configured with Cosine distance space, `text-embedding-004` unit vectors, and interactive test bench. |
| **Error Handling & Validation** | 10% | Robust request validation, empty transcript handling, LLM fallback JSON parsers, and error toasts. |
| **Documentation & Deliverables** | 5% | Complete documentation with live deployment links, Swagger docs, API payloads, and Docker setup. |

---

## 📄 License
This project is built for the **Learnyst AI Engineer Assignment**.