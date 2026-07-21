# AI-Powered Quiz Generation using RAG

This is a full-stack application that generates interactive quizzes from lesson transcripts using Retrieval-Augmented Generation (RAG).

## Architecture
- **Backend**: Python, FastAPI, ChromaDB (Local Vector Database), Google Gemini API
- **Frontend**: React, Vite, Vanilla CSS

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your API key:
   Open the `.env` file and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
5. Run the backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`).

## Usage
1. Open the lesson transcript from `docs/Lesson Transcript.txt` and copy its contents.
2. Paste the transcript into the frontend dashboard and click **Ingest Transcript**.
3. Configure the quiz (Difficulty, Question Count, Question Type).
4. Click **Generate Quiz** and enjoy!

## Deployment Options (Free)
- **Frontend**: Connect your GitHub repo to [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/) and set the root directory to `frontend`.
- **Backend**: Connect your GitHub repo to [Render](https://render.com/). Create a new "Web Service", set the root directory to `backend`, build command to `pip install -r requirements.txt`, and start command to `uvicorn main:app --host 0.0.0.0 --port 10000`. Be sure to add `GEMINI_API_KEY` to the Environment Variables.