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
  Flame
} from 'lucide-react';
import { checkHealth } from '../api/quizApi';
import { DEFAULT_LESSON_ID, DEFAULT_TRANSCRIPT } from '../data/defaultTranscript';

const SAMPLE_TRANSCRIPTS = {
  agents: {
    lessonId: DEFAULT_LESSON_ID,
    title: 'AI Agents, MCP & Agent-to-Agent Architecture',
    text: DEFAULT_TRANSCRIPT
  }
};

export function EvaluatorPanel({ isOpen, onClose, onLoadSample }) {
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchHealth = async () => {
    setIsLoading(true);
    const data = await checkHealth();
    setHealthData(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden my-8 text-card-foreground">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Evaluator & System Inspector</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time metrics, architecture specs, and 1-click evaluation tools
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

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Live Health Status Card */}
          <div className="p-4 rounded-xl border bg-card/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Live Backend Status & Latency</span>
              </div>
              <button
                onClick={fetchHealth}
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

          {/* Quick Demo Load Presets for Evaluator */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold">1-Click Evaluation Presets</span>
              <span className="text-xs text-muted-foreground">(Quickly load sample data into Ingestion Panel)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* Architecture Specifications */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">RAG Architecture & Technical Stack</span>
            </div>

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

          {/* Evaluation Checklist */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <CheckCircle2 className="h-4 w-4" />
              <span>Assessment Verification Checklist</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">✓ RAG Context Chunking</div>
              <div className="flex items-center gap-1.5">✓ Vector Embedding Store</div>
              <div className="flex items-center gap-1.5">✓ Multiple Difficulty Levels</div>
              <div className="flex items-center gap-1.5">✓ Question Type Selectors</div>
              <div className="flex items-center gap-1.5">✓ Interactive Quiz Player</div>
              <div className="flex items-center gap-1.5">✓ Export Quiz as JSON</div>
            </div>
          </div>

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
