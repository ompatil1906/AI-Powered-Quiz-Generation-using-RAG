import { useState } from 'react';
import { Loader } from './ui/Loader';
import { ingestTranscript, generateQuiz } from '../api/quizApi';

export const Dashboard = ({ onQuizGenerated, showToast }) => {
  const [transcript, setTranscript] = useState('');
  const [isIngesting, setIsIngesting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState({
    questionCount: 5,
    difficulty: 'medium',
    questionTypes: 'mcq'
  });

  const handleIngest = async () => {
    if (!transcript.trim()) {
      showToast('Please paste a lesson transcript first.', 'error');
      return;
    }

    setIsIngesting(true);
    try {
      await ingestTranscript(transcript);
      showToast('Transcript ingested successfully! Ready to generate quiz.');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsIngesting(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateQuiz('lesson-1', config);
      onQuizGenerated(data.questions);
      showToast('Quiz generated successfully!');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="structured-dashboard">
      <div className="config-sidebar fade-in">
        <div className="sidebar-header">
          <h3>Quiz Settings</h3>
          <p>Configure your assessment parameters.</p>
        </div>
        
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
          <label htmlFor="difficulty">Difficulty Level</label>
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
          <label htmlFor="type">Question Format</label>
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

      <div className="input-main fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="main-header">
          <h3>Source Content</h3>
        </div>
        
        <div className="form-group transcript-group">
          <textarea 
            id="transcript"
            className="seamless-textarea"
            placeholder="Paste your lesson transcript, article, or document text here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          ></textarea>
        </div>
        
        <div className="action-footer">
          <button 
            className="btn-outline"
            onClick={handleIngest} 
            disabled={isIngesting || !transcript.trim()}
          >
            {isIngesting ? <Loader /> : '1. Ingest Content'}
          </button>
          
          <button 
            className="btn-primary"
            onClick={handleGenerate} 
            disabled={isGenerating}
          >
            {isGenerating ? <Loader /> : '2. Generate Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
};
