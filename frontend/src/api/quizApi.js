const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const ingestTranscript = async (content, lessonId = 'lesson-1') => {
  const response = await fetch(`${API_BASE_URL}/ingest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lessonId,
      content,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to ingest transcript');
  }

  return response.json();
};

export const generateQuiz = async (lessonId = 'lesson-1', options = {}) => {
  const response = await fetch(`${API_BASE_URL}/generate-quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lessonId,
      questionCount: options.questionCount || 5,
      difficulty: options.difficulty || 'medium',
      questionTypes: options.questionTypes || ['mcq', 'true_false'],
      bloomTaxonomy: options.bloomTaxonomy || 'Remembering',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to generate quiz');
  }

  return response.json();
};

export const previewRagQuery = async (lessonId, query, topK = 5) => {
  const response = await fetch(`${API_BASE_URL}/rag/query-preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lessonId,
      query,
      topK,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to query vector database');
  }

  return response.json();
};

export const fetchRagMetrics = async (lessonId = 'agent-mcp-lesson') => {
  const response = await fetch(`${API_BASE_URL}/rag/eval-metrics?lessonId=${encodeURIComponent(lessonId)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch RAG evaluation metrics');
  }
  return response.json();
};

// Auth API Calls
export const loginUserApi = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }
  return response.json();
};

export const signupUserApi = async (fullName, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed');
  }
  return response.json();
};

export const saveUserHistoryApi = async (userId, lessonId, config, quiz, ragStats) => {
  const response = await fetch(`${API_BASE_URL}/auth/history/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, lessonId, config, quiz, ragStats }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to save history entry to server');
  }
  return response.json();
};

export const getUserHistoryApi = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/auth/history?userId=${encodeURIComponent(userId)}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to fetch history');
  }
  return response.json();
};

export const deleteUserHistoryApi = async (userId, entryId) => {
  const response = await fetch(`${API_BASE_URL}/auth/history/${encodeURIComponent(entryId)}?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to delete history item');
  }
  return response.json();
};

export const checkHealth = async () => {
  const startTime = performance.now();
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const endTime = performance.now();
    const latency = Math.round(endTime - startTime);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return {
      ...data,
      latency,
      apiUrl: API_BASE_URL,
    };
  } catch (error) {
    const endTime = performance.now();
    return {
      status: 'offline',
      api_ready: false,
      error: error.message,
      latency: Math.round(endTime - startTime),
      apiUrl: API_BASE_URL,
    };
  }
};
