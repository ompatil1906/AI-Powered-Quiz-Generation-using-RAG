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
    <div className="container">
      <header className="fade-in">
        <h1>AI Quiz Generator</h1>
        <p className="subtitle">Transform lesson transcripts into interactive quizzes instantly.</p>
      </header>

      <main>
        <Dashboard onQuizGenerated={handleQuizGenerated} showToast={showToast} />
        <QuizPlayer quiz={quiz} />
      </main>

      <Toast toast={toast} />
    </div>
  );
}

export default App;
