import React, { useState } from 'react';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { useQuizApi } from './hooks/useQuizApi';
import { IngestionPanel } from './components/IngestionPanel';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { QuizResults } from './components/QuizResults';
import './index.css';

function App() {
  const { toast, showToast } = useToast();
  const { isIngesting, isGenerating, quiz, ingest, generate } = useQuizApi(showToast);

  const [lessonId, setLessonId] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isIngested, setIsIngested] = useState(false);
  
  const [config, setConfig] = useState({
    questionCount: 5,
    difficulty: 'medium',
    questionTypes: ['mcq'],
    bloomTaxonomy: 'Remembering'
  });

  const handleIngest = async () => {
    const success = await ingest(lessonId, transcript);
    if (success) {
      setIsIngested(true);
    }
  };

  const handleGenerate = async () => {
    await generate(lessonId, config);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      
      {/* Left Sidebar Layout */}
      <div className="w-1/3 min-w-[350px] max-w-[500px] flex flex-col border-r bg-card/50 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              Q
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-none">AI Quiz Studio</h1>
              <p className="text-xs text-muted-foreground mt-1">Transform content into assessments</p>
            </div>
          </div>
        </div>
        
        {/* Scrollable Panels */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col custom-scrollbar">
          <div className="min-h-min shrink-0">
            <IngestionPanel 
              transcript={transcript}
              setTranscript={setTranscript}
              lessonId={lessonId}
              setLessonId={setLessonId}
              onIngest={handleIngest}
              isIngesting={isIngesting}
            />
          </div>
          
          <div className="min-h-min shrink-0 border-t">
            <ConfigurationPanel 
              config={config}
              setConfig={setConfig}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              isIngested={isIngested}
            />
          </div>
        </div>

      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-muted/10">
        <QuizResults quiz={quiz} />
      </main>

      <Toast toast={toast} />
    </div>
  );
}

export default App;
