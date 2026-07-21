import React, { useState } from 'react';
import { Toast } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { useQuizApi } from './hooks/useQuizApi';
import { useQuizHistory } from './hooks/useQuizHistory';
import { useAuth } from './hooks/useAuth';
import { IngestionPanel } from './components/IngestionPanel';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { QuizResults } from './components/QuizResults';
import { EvaluatorPanel } from './components/EvaluatorPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { AuthModal } from './components/AuthModal';
import { LandingAuthPage } from './components/LandingAuthPage';
import { Activity, History, LogOut } from 'lucide-react';
import './index.css';

function App() {
  const { toast, showToast } = useToast();
  const { isIngesting, isGenerating, quiz, setQuiz, ingest, generate } = useQuizApi(showToast);
  const { user, isAuthLoading, login, signup, loginAsDemo, logout } = useAuth(showToast);
  const { history, addHistoryEntry, deleteHistoryEntry, clearHistory, exportHistoryAsJSON } = useQuizHistory(user);

  const [lessonId, setLessonId] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isIngested, setIsIngested] = useState(false);
  const [isEvaluatorOpen, setIsEvaluatorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
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
    const data = await generate(lessonId, config);
    if (data && data.questions) {
      addHistoryEntry({
        lessonId: lessonId || 'lesson-1',
        config,
        quiz: data.questions,
        ragStats: data.rag_stats
      });
    }
  };

  const handleLoadSample = (sampleLessonId, sampleText) => {
    setLessonId(sampleLessonId);
    setTranscript(sampleText);
    showToast('Loaded sample transcript successfully!', 'success');
  };

  // Auth Guard: Require login to access dashboard
  if (!user) {
    return (
      <>
        <LandingAuthPage
          onLogin={login}
          onSignup={signup}
          onDemoLogin={loginAsDemo}
          isLoading={isAuthLoading}
        />
        <Toast toast={toast} />
      </>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      
      {/* Left Sidebar Layout */}
      <div className="w-1/3 min-w-[350px] max-w-[500px] flex flex-col border-r bg-card/50 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b shrink-0 bg-card flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                Q
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight leading-none">AI Quiz Studio</h1>
                <p className="text-xs text-muted-foreground mt-1">Transform content into assessments</p>
              </div>
            </div>

            {/* Auth User Badge */}
            <div className="flex items-center gap-2 bg-muted/40 border border-border px-2.5 py-1 rounded-xl">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
                {user.fullName ? user.fullName[0] : 'U'}
              </div>
              <div className="text-[11px] leading-tight hidden sm:block max-w-[90px] truncate">
                <span className="font-bold text-foreground block truncate">{user.fullName}</span>
              </div>
              <button
                onClick={logout}
                className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-1 border-t border-border/60">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-muted text-foreground transition-all shadow-sm relative"
                title="View Assessment History"
              >
                <History className="h-3.5 w-3.5 text-primary" />
                <span>History</span>
                {history.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {history.length}
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsEvaluatorOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all shadow-sm"
              title="Open Evaluator System Info & Metrics"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>System Inspector</span>
            </button>
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

      <EvaluatorPanel
        isOpen={isEvaluatorOpen}
        onClose={() => setIsEvaluatorOpen(false)}
        onLoadSample={handleLoadSample}
        activeLessonId={lessonId}
        isIngested={isIngested}
        hasQuiz={Boolean(quiz && quiz.length > 0)}
      />

      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadQuiz={(loadedQuiz) => {
          setQuiz(loadedQuiz);
          showToast('Loaded assessment from history!', 'success');
        }}
        onDeleteEntry={deleteHistoryEntry}
        onClearHistory={clearHistory}
        onExportHistory={exportHistoryAsJSON}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={login}
        onSignup={signup}
        onDemoLogin={loginAsDemo}
        isLoading={isAuthLoading}
      />
    </div>
  );
}

export default App;
