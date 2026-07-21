import { useState, useRef } from 'react';
import { Dashboard } from './components/Dashboard';
import { QuizPlayer } from './components/QuizPlayer';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import './styles/globals.css';
import './styles/components.css';

function App() {
  const [quiz, setQuiz] = useState(null);
  const { toast, showToast } = useToast();
  const resultsRef = useRef(null);

  const handleQuizGenerated = (newQuiz) => {
    setQuiz(newQuiz);
    // Smooth scroll to quiz results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="website-wrapper">
      <nav className="navbar fade-in">
        <div className="nav-container">
          <div className="nav-brand">
            <div className="nav-logo">Q</div>
            <span className="nav-title">AI Quiz Studio</span>
          </div>
        </div>
      </nav>

      <section className="hero-section fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="hero-content">
          <h1>Transform Lessons into Interactive Quizzes</h1>
          <p className="hero-subtitle">
            Harness the power of AI to automatically generate high-quality assessments from any transcript in seconds.
          </p>
        </div>
      </section>

      <main className="main-content">
        <section className="generator-section fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <h2>Create Your Quiz</h2>
            <p>Paste your content below and configure your desired difficulty.</p>
          </div>
          
          <div className="dashboard-wrapper">
            <Dashboard onQuizGenerated={handleQuizGenerated} showToast={showToast} />
          </div>
        </section>

        {quiz && (
          <section className="results-section fade-in" ref={resultsRef}>
            <div className="section-header">
              <h2>Your Generated Assessment</h2>
              <p>Test your knowledge below.</p>
            </div>
            <div className="quiz-wrapper">
              <QuizPlayer quiz={quiz} />
            </div>
          </section>
        )}
      </main>

      <footer className="footer fade-in">
        <p>&copy; {new Date().getFullYear()} AI Quiz Studio. All rights reserved.</p>
      </footer>

      <Toast toast={toast} />
    </div>
  );
}

export default App;
