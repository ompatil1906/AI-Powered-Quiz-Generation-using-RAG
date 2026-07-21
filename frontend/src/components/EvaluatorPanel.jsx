import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  X,
  Globe,
  Flame,
  Search,
  Layers,
  ShieldCheck,
  FileText,
  Loader2,
  BarChart3,
  Target,
  Brain,
  CheckCircle,
  AlertTriangle,
  Award,
  DatabaseBackup,
  Info
} from 'lucide-react';
import { checkHealth, previewRagQuery, fetchRagMetrics } from '../api/quizApi';
import { DEFAULT_LESSON_ID, DEFAULT_TRANSCRIPT } from '../data/defaultTranscript';

const SAMPLE_TRANSCRIPTS = {
  agents: {
    lessonId: DEFAULT_LESSON_ID,
    title: 'AI Agents, MCP & Agent-to-Agent Architecture',
    text: DEFAULT_TRANSCRIPT
  }
};

export function EvaluatorPanel({ isOpen, onClose, onLoadSample, activeLessonId, isIngested, hasQuiz }) {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('quality'); // 'quality' | 'testbench' | 'bloom' | 'system'
  
  // Real-time RAG Metrics State
  const [liveMetrics, setLiveMetrics] = useState(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  // Interactive RAG Inspector State
  const [testQuery, setTestQuery] = useState('What is Model Context Protocol (MCP)?');
  const [testLessonId, setTestLessonId] = useState(activeLessonId || '');
  const [ragResults, setRagResults] = useState(null);
  const [isSearchingRag, setIsSearchingRag] = useState(false);
  const [ragError, setRagError] = useState('');

  const isSessionReady = Boolean(isIngested && hasQuiz && activeLessonId && activeLessonId.trim());

  const fetchHealthAndMetrics = async () => {
    setIsLoading(true);
    setIsLoadingMetrics(true);
    
    // Fetch health data
    const hData = await checkHealth();
    setHealthData(hData);
    setIsLoading(false);

    // Dynamic metrics ONLY calculated when transcript is ingested AND quiz is generated for active lesson
    if (!isSessionReady) {
      setLiveMetrics({
        status: 'not_ingested',
        chunkCount: 0,
        overallScore: 0,
        faithfulnessScore: 0,
        relevanceScore: 0,
        boundaryScore: 0,
        citationScore: 0,
        totalChars: 0,
        avgChunkSize: 0
      });
      setIsLoadingMetrics(false);
      return;
    }

    try {
      const targetId = activeLessonId.trim();
      const mData = await fetchRagMetrics(targetId);
      setLiveMetrics(mData);
    } catch (err) {
      setLiveMetrics({
        status: 'not_ingested',
        chunkCount: 0,
        overallScore: 0,
        faithfulnessScore: 0,
        relevanceScore: 0,
        boundaryScore: 0,
        citationScore: 0,
        totalChars: 0,
        avgChunkSize: 0
      });
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleTestRagQuery = async (e) => {
    if (e) e.preventDefault();
    if (!testQuery.trim() || !testLessonId.trim()) return;
    setIsSearchingRag(true);
    setRagError('');
    try {
      const data = await previewRagQuery(testLessonId, testQuery, 5);
      setRagResults(data);
    } catch (err) {
      setRagError(err.message || 'Failed to query vector database. Ensure transcript is ingested first.');
      setRagResults(null);
    } finally {
      setIsSearchingRag(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTestLessonId(activeLessonId || '');
      fetchHealthAndMetrics();
    }
  }, [isOpen, activeLessonId, isIngested, hasQuiz]);

  if (!isOpen) return null;

  const currentTargetId = (activeLessonId && activeLessonId.trim()) || (testLessonId && testLessonId.trim()) || "";
  const isMetricsAvailable = isSessionReady && liveMetrics && liveMetrics.status === 'active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden my-8 text-card-foreground">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Evaluator & Real-Time RAG Inspector</h2>
                {isMetricsAvailable ? (
                  <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Score: {liveMetrics.overallScore}%
                  </span>
                ) : (
                  <span className="bg-amber-500/10 text-amber-500 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                    Assessment Generation Required
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time metrics for {currentTargetId ? <code className="font-mono text-foreground font-semibold bg-muted px-1 rounded">{currentTargetId}</code> : <span className="italic">No active lesson selected</span>}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-muted/20 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('quality')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'quality' 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Real-Time RAG Quality & Accuracy</span>
          </button>

          <button
            onClick={() => setActiveTab('testbench')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'testbench' 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="h-4 w-4" />
            <span>Live Vector Test Bench</span>
          </button>

          <button
            onClick={() => setActiveTab('bloom')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'bloom' 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Brain className="h-4 w-4" />
            <span>Bloom's Taxonomy Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              activeTab === 'system' 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Server className="h-4 w-4" />
            <span>System Health & Specs</span>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* TAB 1: RAG Quality & Accuracy Scorecard */}
          {activeTab === 'quality' && (
            <div className="space-y-6">
              
              {!isMetricsAvailable && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-600 block text-sm">
                        {!isIngested ? 'Step 1: Content Ingestion Required' : 'Step 2: Quiz Generation Required'}
                      </span>
                      <p className="text-muted-foreground mt-0.5">
                        {!isIngested 
                          ? "Please paste your lesson transcript into the Ingestion Panel and click 'Process Transcript' to index vectors into ChromaDB."
                          : "Transcript indexed! Please click 'Generate Quiz' in the Configuration Panel to generate an assessment and compute real-time RAG accuracy scores."
                        }
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onLoadSample(DEFAULT_LESSON_ID, DEFAULT_TRANSCRIPT);
                      onClose();
                    }}
                    className="px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>⚡ Inject Sample & Test Studio</span>
                  </button>
                </div>
              )}

              {/* Overall RAG Quality Header Card */}
              <div className="p-5 rounded-xl border bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold tracking-tight">
                        {isMetricsAvailable ? `${liveMetrics.overallScore}%` : '--'}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${isMetricsAvailable ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'}`}>
                        {isMetricsAvailable ? 'Real-Time Vector Analysis' : 'Pending Generation'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      RAG Context Faithfulness & Grounded Accuracy Score for {currentTargetId ? <code className="font-mono text-foreground font-semibold bg-muted px-1 rounded">{currentTargetId}</code> : 'None'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={fetchHealthAndMetrics}
                  disabled={isLoadingMetrics || !isSessionReady}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border hover:bg-muted disabled:opacity-50 transition-colors shadow-sm"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
                  <span>Re-analyze Vectors</span>
                </button>
              </div>

              {/* 4 Key Real-Time Accuracy Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase font-semibold">
                    <span>Context Faithfulness</span>
                    <Target className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {isMetricsAvailable ? `${liveMetrics.faithfulnessScore}%` : '--'}
                  </div>
                  <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> {isMetricsAvailable ? 'Live Computed' : 'Awaiting Data'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase font-semibold">
                    <span>Semantic Relevance</span>
                    <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {isMetricsAvailable ? `${liveMetrics.relevanceScore}%` : '--'}
                  </div>
                  <p className="text-[10px] text-blue-500 font-medium">
                    {isMetricsAvailable ? 'Vector Distance Match' : 'Awaiting Data'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase font-semibold">
                    <span>Sentence Boundary</span>
                    <Layers className="h-3.5 w-3.5 text-purple-500" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {isMetricsAvailable ? `${liveMetrics.boundaryScore}%` : '--'}
                  </div>
                  <p className="text-[10px] text-purple-500 font-medium">
                    {isMetricsAvailable ? 'Punctuation Preserved' : 'Awaiting Data'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border bg-card/60 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase font-semibold">
                    <span>Stored Vector Chunks</span>
                    <DatabaseBackup className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {isMetricsAvailable ? liveMetrics.chunkCount : 0}
                  </div>
                  <p className="text-[10px] text-amber-500 font-medium">
                    {isMetricsAvailable ? `Avg ${liveMetrics.avgChunkSize} chars/chunk` : 'No vectors'}
                  </p>
                </div>
              </div>

              {/* Quality Progress Breakdown Bars */}
              <div className="p-4 rounded-xl border bg-card space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Real-Time RAG Accuracy & Quality Analysis
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {isMetricsAvailable ? `${liveMetrics.totalChars.toLocaleString()} total characters indexed` : 'Generation Pending'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  
                  {/* Metric 1 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span>1. Context Grounding & Faithfulness</span>
                      <span className="font-mono text-emerald-500 font-bold">
                        {isMetricsAvailable ? `${liveMetrics.faithfulnessScore}%` : '--'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${isMetricsAvailable ? liveMetrics.faithfulnessScore : 0}%` }} 
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Measures whether generated questions derive exclusively from retrieved RAG context.
                    </p>
                  </div>

                  {/* Metric 2 */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between font-medium">
                      <span>2. Semantic Chunk Retrieval Relevance</span>
                      <span className="font-mono text-blue-500 font-bold">
                        {isMetricsAvailable ? `${liveMetrics.relevanceScore}%` : '--'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                        style={{ width: `${isMetricsAvailable ? liveMetrics.relevanceScore : 0}%` }} 
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Multi-pass vector similarity (definitions, workflows, trade-offs) computed directly from ChromaDB index.
                    </p>
                  </div>

                  {/* Metric 3 */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between font-medium">
                      <span>3. Sentence Boundary Preservation</span>
                      <span className="font-mono text-purple-500 font-bold">
                        {isMetricsAvailable ? `${liveMetrics.boundaryScore}%` : '--'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full transition-all duration-500" 
                        style={{ width: `${isMetricsAvailable ? liveMetrics.boundaryScore : 0}%` }} 
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Sentence-aware sliding window (~700 chars, 150 overlap) prevents cutting key definitions mid-sentence.
                    </p>
                  </div>

                  {/* Metric 4 */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between font-medium">
                      <span>4. Citation Attribution Completeness</span>
                      <span className="font-mono text-amber-500 font-bold">
                        {isMetricsAvailable ? `${liveMetrics.citationScore}%` : '--'}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${isMetricsAvailable ? liveMetrics.citationScore : 0}%` }} 
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Evaluates presence of verifiable source snippets and context citations for every generated item.
                    </p>
                  </div>

                </div>
              </div>

              {/* RAG Quality Assurance Rules */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border bg-emerald-500/5 border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Active Quality Safeguards</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-muted-foreground list-disc list-inside">
                    <li>Timestamp stripping (`[00:00:00]`) prior to embedding</li>
                    <li>Source quote snippet returned for context verification</li>
                    <li>Bloom's Taxonomy difficulty scaling</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border bg-blue-500/5 border-blue-500/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-600">
                    <Zap className="h-4 w-4" />
                    <span>Zero-Hallucination Policy</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-muted-foreground list-disc list-inside">
                    <li>Strict prompt boundaries forbidding extraneous assumptions</li>
                    <li>Mandatory grounding in retrieved vector chunks</li>
                    <li>Verifiable RAG evidence citation badge on quiz cards</li>
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Interactive Live Vector Test Bench */}
          {activeTab === 'testbench' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Interactive Live RAG Retriever Test Bench</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Test semantic similarity against ChromaDB</span>
                </div>

                <form onSubmit={handleTestRagQuery} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Enter Lesson ID..."
                    value={testLessonId}
                    onChange={(e) => setTestLessonId(e.target.value)}
                    className="w-full sm:w-44 px-3 py-2 text-xs rounded-lg border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Type query e.g. What is MCP protocol?"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingRag || !testQuery.trim() || !testLessonId.trim()}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    {isSearchingRag ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                    <span>Inspect RAG Search</span>
                  </button>
                </form>

                {ragError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    <span>{ragError}</span>
                  </div>
                )}

                {ragResults && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Retrieved <strong className="text-foreground">{ragResults.retrievedCount}</strong> relevant context chunks for <code className="font-mono bg-muted px-1 rounded">{ragResults.lessonId}</code></span>
                      <span>Total chunks in DB: <strong>{ragResults.totalChunksInDB}</strong></span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                      {ragResults.chunks.map((chunk, idx) => (
                        <div key={idx} className="p-3 rounded-lg border bg-muted/20 text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className="text-primary font-bold">Chunk #{chunk.chunkIndex}</span>
                            <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              Similarity: {(chunk.similarityPercent !== undefined ? chunk.similarityPercent : (chunk.similarityScore * 100)).toFixed(1)}% (Dist: {chunk.distance})
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            "{chunk.content}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 1-Click Evaluation Presets */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold">1-Click Evaluation Presets</span>
                  <span className="text-xs text-muted-foreground">(Quickly load sample data into Ingestion Panel)</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(SAMPLE_TRANSCRIPTS).map(([key, sample]) => (
                    <button
                      key={key}
                      onClick={() => {
                        onLoadSample(sample.lessonId, sample.text);
                        onClose();
                      }}
                      className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/50 text-left transition-all group flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary group-hover:underline">
                            {sample.title}
                          </span>
                          <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono text-muted-foreground">
                            {sample.lessonId}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {sample.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-primary font-medium">
                        <span>Load into Ingestion Panel</span>
                        <Sparkles className="h-3 w-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Bloom's Taxonomy Matrix */}
          {activeTab === 'bloom' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border bg-card space-y-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="text-sm font-bold">Bloom's Revised Taxonomy Cognitive Distribution</h3>
                    <p className="text-xs text-muted-foreground">Controls question depth, reasoning complexity, and assessment objective</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold text-primary block">1. Remembering</span>
                    <p className="text-[11px] text-muted-foreground">Direct recall of facts, definitions, model names, and specific terminology from transcript.</p>
                  </div>

                  <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold text-blue-500 block">2. Understanding</span>
                    <p className="text-[11px] text-muted-foreground">Explaining concepts, summarizing core mechanics, and explaining why tools or systems function.</p>
                  </div>

                  <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold text-emerald-500 block">3. Applying</span>
                    <p className="text-[11px] text-muted-foreground">Practical use cases, scenario-based problem solving, API endpoints, and configuration setups.</p>
                  </div>

                  <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold text-purple-500 block">4. Analyzing</span>
                    <p className="text-[11px] text-muted-foreground">Comparing components (LLM vs Agent, API vs MCP, agent-to-agent) and structural relationships.</p>
                  </div>

                  <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold text-amber-500 block">5. Evaluating</span>
                    <p className="text-[11px] text-muted-foreground">Assessing trade-offs, validating statements, identifying configuration errors, and judging architectures.</p>
                  </div>

                  <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold text-rose-500 block">6. Creating</span>
                    <p className="text-[11px] text-muted-foreground">Designing multi-agent workflows, combining MCP tools with LLMs, and synthesizing solutions.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: System Health & Specs */}
          {activeTab === 'system' && (
            <div className="space-y-4">
              
              {/* Live Backend Status */}
              <div className="p-4 rounded-xl border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Live Backend Status & Latency</span>
                  </div>
                  <button
                    onClick={fetchHealthAndMetrics}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Re-ping</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted/40 border text-center">
                    <span className="text-[11px] text-muted-foreground block uppercase font-medium">Health</span>
                    <span className="text-sm font-bold flex items-center justify-center gap-1.5 mt-1">
                      <span className={`h-2 w-2 rounded-full ${healthData?.status === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span className="capitalize">{healthData?.status || 'Connecting...'}</span>
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border text-center">
                    <span className="text-[11px] text-muted-foreground block uppercase font-medium">Ping Latency</span>
                    <span className="text-sm font-bold text-primary mt-1 block">
                      {healthData?.latency !== undefined ? `${healthData.latency} ms` : '--'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border text-center">
                    <span className="text-[11px] text-muted-foreground block uppercase font-medium">API Ready</span>
                    <span className="text-sm font-bold text-emerald-500 mt-1 block">
                      {healthData?.api_ready ? 'Yes (Gemini Active)' : 'No'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border text-center">
                    <span className="text-[11px] text-muted-foreground block uppercase font-medium">Version</span>
                    <span className="text-sm font-bold text-foreground mt-1 block">
                      v{healthData?.version || '1.0.0'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1 border-t">
                  <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="truncate">Active API Endpoint: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">{healthData?.apiUrl || 'Detecting...'}</code></span>
                </div>
              </div>

              {/* Architecture Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Database className="h-4 w-4 text-emerald-500" />
                    <span>Vector Database & Storage</span>
                  </div>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside pl-1">
                    <li><strong>Engine:</strong> ChromaDB (Local/Persistent)</li>
                    <li><strong>Embedding Model:</strong> Google <code className="bg-muted px-1 py-0.5 rounded font-mono">text-embedding-004</code></li>
                    <li><strong>Similarity Search:</strong> Cosine distance kNN top-15</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-foreground">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <span>LLM & Prompt Generation</span>
                  </div>
                  <ul className="space-y-1 text-muted-foreground list-disc list-inside pl-1">
                    <li><strong>Model:</strong> Google Gemini 2.5 Flash</li>
                    <li><strong>Output Format:</strong> Strict JSON Schema validation</li>
                    <li><strong>Taxonomy:</strong> Bloom's Revised Taxonomy support</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
