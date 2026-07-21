import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ai_quiz_studio_history';

export function useQuizHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.warn('Failed to load quiz history from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to persist quiz history to localStorage:', e);
    }
  }, [history]);

  const addHistoryEntry = ({ lessonId, config, quiz, ragStats }) => {
    if (!quiz || quiz.length === 0) return;
    const newEntry = {
      id: `quiz-hist-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      lessonId: lessonId || 'lesson-1',
      questionCount: quiz.length,
      difficulty: config?.difficulty || 'medium',
      bloomTaxonomy: config?.bloomTaxonomy || 'Remembering',
      questionTypes: config?.questionTypes || ['mcq'],
      quiz,
      ragStats: ragStats || null,
    };

    setHistory((prev) => [newEntry, ...prev]);
    return newEntry;
  };

  const deleteHistoryEntry = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const exportHistoryAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `quiz_history_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return {
    history,
    addHistoryEntry,
    deleteHistoryEntry,
    clearHistory,
    exportHistoryAsJSON,
  };
}
