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
    <>
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
            {isIngesting ? <Loader /> : 'Ingest Transcript'}
          </button>
        </div>
      </div>

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
            {isGenerating ? <Loader /> : 'Generate Quiz'}
          </button>
        </div>
      </div>
    </>
  );
};
