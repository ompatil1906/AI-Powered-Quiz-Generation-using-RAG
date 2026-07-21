import { useState } from 'react';

export const QuizPlayer = ({ quiz }) => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleOptionSelect = (qIndex, option) => {
    if (showResults) return;
    setAnswers(prev => ({
      ...prev,
      [qIndex]: option
    }));
  };

  const handleCheckAnswers = () => {
    if (Object.keys(answers).length < quiz.length) {
      alert('Please answer all questions first.'); // Fallback, could use context toast
      return;
    }
    setShowResults(true);
  };

  if (!quiz || quiz.length === 0) return null;

  return (
    <div className="quiz-container fade-in">
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your Quiz</h2>
      
      {quiz.map((q, idx) => (
        <div key={idx} className="question-card">
          <div className="question-header">
            <h3 className="question-title">
              <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>{idx + 1}.</span>
              {q.question}
            </h3>
            <div className="badges">
              <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
              <span className="badge badge-type">{q.type}</span>
            </div>
          </div>

          {q.type === 'mcq' && q.options && (
            <div className="options-list">
              {q.options.map((opt, optIdx) => {
                let className = 'option';
                const isSelected = answers[idx] === opt;
                const isCorrect = opt === q.correctAnswer;

                if (isSelected) className += ' selected';
                if (showResults) {
                  if (isCorrect) className += ' correct';
                  else if (isSelected && !isCorrect) className += ' incorrect';
                }

                return (
                  <div 
                    key={optIdx} 
                    className={className}
                    onClick={() => handleOptionSelect(idx, opt)}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          )}
          
          {q.type === 'true_false' && (
            <div className="options-list">
              {['True', 'False'].map((opt, optIdx) => {
                let className = 'option';
                const isSelected = answers[idx] === opt;
                const isCorrect = String(opt).toLowerCase() === String(q.correctAnswer).toLowerCase();

                if (isSelected) className += ' selected';
                if (showResults) {
                  if (isCorrect) className += ' correct';
                  else if (isSelected && !isCorrect) className += ' incorrect';
                }

                return (
                  <div 
                    key={optIdx} 
                    className={className}
                    onClick={() => handleOptionSelect(idx, opt)}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          )}

          {showResults && (
            <div className="explanation fade-in">
              <h4>Explanation</h4>
              <p>{q.explanation}</p>
            </div>
          )}
        </div>
      ))}

      {!showResults && (
        <button 
          style={{ margin: '0 auto', display: 'block', minWidth: '200px' }}
          onClick={handleCheckAnswers}
        >
          Check Answers
        </button>
      )}
    </div>
  );
};
