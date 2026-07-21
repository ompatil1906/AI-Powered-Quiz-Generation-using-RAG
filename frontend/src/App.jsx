import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { QuizPlayer } from './components/QuizPlayer';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import './styles/globals.css';
import './styles/components.css';

function App() {
  const [quiz, setQuiz] = useState(null);
  const { toast, showToast } = useToast();

  const handleQuizGenerated = (newQuiz) => {
    setQuiz(newQuiz);
  };

  return (
    <div className="app-container">
      <nav className="top-nav fade-in">
        <div className="nav-brand">
          <div className="nav-logo">Q</div>
          <span className="nav-title">AI Quiz Studio</span>
        </div>
      </nav>

      <main className="workspace">
        <aside className="workspace-sidebar fade-in" style={{ animationDelay: '0.1s' }}>
          <Dashboard onQuizGenerated={handleQuizGenerated} showToast={showToast} />
        </aside>
        
        <section className="workspace-content fade-in" style={{ animationDelay: '0.2s' }}>
          {!quiz ? (
            <div className="empty-state">
              <div className="empty-icon">✨</div>
              <h3>Ready to Generate</h3>
              <p>Configure your quiz on the left and click "Generate Quiz" to see the results here.</p>
            </div>
          ) : (
            <QuizPlayer quiz={quiz} />
          )}
        </section>
      </main>

      <Toast toast={toast} />
    </div>
  );
}

export default App;
