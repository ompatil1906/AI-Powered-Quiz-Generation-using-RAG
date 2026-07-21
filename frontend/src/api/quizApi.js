const API_BASE_URL = 'http://127.0.0.1:8000';

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
      questionCount: options.count || 5,
      difficulty: options.difficulty || 'medium',
      questionTypes: ['mcq', 'true_false'],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to generate quiz');
  }

  return response.json();
};
