import React, { useState, useEffect } from 'react';
import { QuizCard } from './QuizCard';
import { Button } from './ui/button';
import { DownloadCloud, FileJson, CheckCircle, RotateCcw } from 'lucide-react';

export function QuizResults({ quiz }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [isQuizEvaluated, setIsQuizEvaluated] = useState(false);

  // Reset state when a new quiz is loaded
  useEffect(() => {
    setUserAnswers({});
    setIsQuizEvaluated(false);
  }, [quiz]);

  if (!quiz || quiz.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-12 text-muted-foreground">
        <div className="w-24 h-24 mb-6 rounded-full bg-muted/50 flex items-center justify-center">
          <svg className="w-12 h-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">No Quiz Generated Yet</h3>
        <p className="max-w-md">Process a transcript and configure your settings on the left to generate an AI-powered assessment.</p>
      </div>
    );
  }

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quiz, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "quiz-export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleExportCSV = () => {
    const headers = ["Question", "Type", "Difficulty", "Correct Answer", "Explanation"];
    const rows = quiz.map(q => [
      `"${q.question.replace(/"/g, '""')}"`,
      q.type,
      q.difficulty,
      `"${q.correctAnswer.replace(/"/g, '""')}"`,
      `"${(q.explanation || '').replace(/"/g, '""')}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", encodedUri);
    downloadAnchorNode.setAttribute("download", "quiz-export.csv");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((q, index) => {
      const userAnswer = userAnswers[index] || '';
      if (userAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score += 1;
      }
    });
    return score;
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsQuizEvaluated(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between p-6 border-b bg-card shrink-0 z-10">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Generated Assessment</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isQuizEvaluated ? 'Review your results below.' : 'Answer the questions and submit your quiz at the bottom.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <FileJson className="mr-2 h-4 w-4" />
            JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <DownloadCloud className="mr-2 h-4 w-4" />
            CSV
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6 bg-muted/10 relative">
        <div className="max-w-4xl mx-auto pb-32">
          {isQuizEvaluated && (
            <div className="mb-6 p-6 bg-card border rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Quiz Results</h3>
                <p className="text-muted-foreground">You scored {calculateScore()} out of {quiz.length}</p>
              </div>
              <div className="text-3xl font-black text-primary">
                {Math.round((calculateScore() / quiz.length) * 100)}%
              </div>
            </div>
          )}

          {quiz.map((question, index) => (
            <QuizCard 
              key={index} 
              question={question} 
              index={index} 
              selectedAnswer={userAnswers[index] || ''}
              onAnswerChange={(ans) => handleAnswerChange(index, ans)}
              isEvaluated={isQuizEvaluated}
            />
          ))}
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t flex justify-end z-20 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto w-full flex justify-end gap-4">
          {isQuizEvaluated ? (
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleRetake}
              className="px-8 text-base h-12"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Retake Quiz
            </Button>
          ) : (
            <Button 
              size="lg" 
              onClick={() => setIsQuizEvaluated(true)}
              className="px-12 text-lg h-14 shadow-lg hover:shadow-xl transition-all"
            >
              <CheckCircle className="mr-2 w-5 h-5" />
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
