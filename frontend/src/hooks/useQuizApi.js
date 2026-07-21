import { useState } from 'react';
import { ingestTranscript, generateQuiz } from '../api/quizApi';

export function useQuizApi(showToast) {
  const [isIngesting, setIsIngesting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const ingest = async (lessonId, content) => {
    setIsIngesting(true);
    try {
      await ingestTranscript(content, lessonId);
      showToast?.('Transcript ingested successfully! Ready to generate quiz.', 'success');
      return true;
    } catch (error) {
      showToast?.(error.message || 'Failed to ingest transcript', 'error');
      return false;
    } finally {
      setIsIngesting(false);
    }
  };

  const generate = async (lessonId, options) => {
    setIsGenerating(true);
    try {
      const data = await generateQuiz(lessonId, options);
      setQuiz(data.questions);
      showToast?.('Quiz generated successfully!', 'success');
      return data.questions;
    } catch (error) {
      showToast?.(error.message || 'Failed to generate quiz', 'error');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const resetQuiz = () => {
    setQuiz(null);
  };

  return {
    isIngesting,
    isGenerating,
    quiz,
    setQuiz,
    ingest,
    generate,
    resetQuiz
  };
}
