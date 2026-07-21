import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [transcript, setTranscript] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [config, setConfig] = useState({
    questionCount: 5,
    difficulty: 'medium',
    questionTypes: 'mcq'
  });

  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleIngest = async () => {
    if (!transcript.trim()) {
      showToast('Please paste a lesson transcript first.', 'error');
      return;
    }

    setIsIngesting(true);
    try {
      const response = await fetch(`${API_URL}/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: 'lesson-001',
          content: transcript
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.detail || 'Failed to ingest');
      
      showToast('Transcript ingested successfully! Ready to generate quiz.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsIngesting(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setQuiz(null);
    setAnswers({});
    setShowResults(false);

    try {
      const response = await fetch(`${API_URL}/generate-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: 'lesson-001',
          questionCount: parseInt(config.questionCount),
          difficulty: config.difficulty,
          questionTypes: [config.questionTypes]
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.detail || 'Failed to generate quiz');
      
      setQuiz(data.questions);
      showToast('Quiz generated successfully!');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOptionSelect = (qIndex, option) => {
    if (showResults) return;
    setAnswers(prev => ({
      ...prev,
      [qIndex]: option
    }));
  };

  const handleCheckAnswers = () => {
    if (Object.keys(answers).length < quiz.length) {
      showToast('Please answer all questions first.', 'error');
      return;
    }
    setShowResults(true);
  };

  return (
    <div className="container">
      <header className="fade-in">
        <h1>AI Quiz Generator</h1>
        <p className="subtitle">Transform lesson transcripts into interactive quizzes instantly.</p>
      </header>

      <main>
        {/* Input Section */}
        <div className="card fade-in">
          <div className="form-group">
            <label htmlFor="transcript">1. Paste Lesson Transcript</label>
            <textarea 
              id="transcript"
              rows="6"
              placeholder="Paste the text content of your lesson here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            ></textarea>
          </div>
          <div className="button-group">
            <button 
              onClick={handleIngest} 
              disabled={isIngesting || !transcript.trim()}
            >
              {isIngesting ? <div className="loader"></div> : 'Ingest Transcript'}
            </button>
          </div>
        </div>

        {/* Config Section */}
        <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
          <label>2. Configure Quiz</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label htmlFor="count">Number of Questions</label>
              <input 
                type="number" 
                id="count" 
                min="1" 
                max="20"
                value={config.questionCount}
                onChange={(e) => setConfig({...config, questionCount: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select 
                id="difficulty"
                value={config.difficulty}
                onChange={(e) => setConfig({...config, difficulty: e.target.value})}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="type">Question Type</label>
              <select 
                id="type"
                value={config.questionTypes}
                onChange={(e) => setConfig({...config, questionTypes: e.target.value})}
              >
                <option value="mcq">Multiple Choice</option>
                <option value="true_false">True / False</option>
              </select>
            </div>
          </div>
          
          <div className="button-group">
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="btn-secondary"
            >
              {isGenerating ? <div className="loader"></div> : 'Generate Quiz'}
            </button>
          </div>
        </div>

        {/* Quiz Display Section */}
        {quiz && quiz.length > 0 && (
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
                      // Support both boolean and string "True"/"False" from API
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
        )}
      </main>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
