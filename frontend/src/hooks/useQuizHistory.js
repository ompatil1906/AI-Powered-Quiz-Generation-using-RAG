import { useState, useEffect } from 'react';
import { saveUserHistoryApi, getUserHistoryApi, deleteUserHistoryApi } from '../api/quizApi';

const STORAGE_KEY_PREFIX = 'ai_quiz_studio_history_';

export function useQuizHistory(currentUser) {
  const userId = currentUser ? currentUser.id : 'guest';

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Fetch backend history whenever user logs in
  useEffect(() => {
    if (currentUser && currentUser.id) {
      getUserHistoryApi(currentUser.id)
        .then((serverHistory) => {
          if (Array.isArray(serverHistory)) {
            setHistory(serverHistory);
            localStorage.setItem(`${STORAGE_KEY_PREFIX}${currentUser.id}`, JSON.stringify(serverHistory));
          }
        })
        .catch((err) => {
          console.warn('Could not sync history with backend server:', err);
        });
    } else {
      // Guest mode
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}guest`);
        setHistory(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setHistory([]);
      }
    }
  }, [currentUser]);

  // Persist locally
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to persist history to localStorage:', e);
    }
  }, [history, userId]);

  const addHistoryEntry = async ({ lessonId, config, quiz, ragStats }) => {
    if (!quiz || quiz.length === 0) return;
    
    const entryId = `quiz-hist-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newEntry = {
      id: entryId,
      userId,
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

    if (currentUser && currentUser.id) {
      try {
        await saveUserHistoryApi(currentUser.id, lessonId, config, quiz, ragStats);
      } catch (e) {
        console.warn('Failed to save history entry to server:', e);
      }
    }

    return newEntry;
  };

  const deleteHistoryEntry = async (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (currentUser && currentUser.id) {
      try {
        await deleteUserHistoryApi(currentUser.id, id);
      } catch (e) {
        console.warn('Failed to delete history item on server:', e);
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${userId}`);
    } catch (e) {}
  };

  const exportHistoryAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `quiz_history_${userId}_${new Date().toISOString().slice(0, 10)}.json`);
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
