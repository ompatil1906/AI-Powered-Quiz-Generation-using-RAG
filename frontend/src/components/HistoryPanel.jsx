import React, { useState } from 'react';
import { 
  History, 
  X, 
  Trash2, 
  Download, 
  ExternalLink, 
  Clock, 
  Search, 
  BookOpen, 
  Sparkles, 
  Brain, 
  CheckCircle2,
  FileJson
} from 'lucide-react';
import { Badge } from './ui/badge';

export function HistoryPanel({ 
  isOpen, 
  onClose, 
  history, 
  onLoadQuiz, 
  onDeleteEntry, 
  onClearHistory, 
  onExportHistory 
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.lessonId.toLowerCase().includes(term) ||
      item.difficulty.toLowerCase().includes(term) ||
      (item.bloomTaxonomy && item.bloomTaxonomy.toLowerCase().includes(term)) ||
      item.quiz.some((q) => q.question.toLowerCase().includes(term))
    );
  });

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return isoString;
    }
  };

  const exportSingleQuiz = (item) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(item, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${item.lessonId}_quiz_${new Date(item.timestamp).getTime()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden my-8 text-card-foreground">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <History className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Assessment History</h2>
                <Badge variant="secondary" className="font-mono text-xs">
                  {history.length} Saved
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review, export, or reload past RAG-generated assessments
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

        {/* Toolbar Controls */}
        <div className="p-4 border-b border-border bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search history by lesson or question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {history.length > 0 && (
              <>
                <button
                  onClick={onExportHistory}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-card border border-border hover:bg-muted text-foreground transition-colors"
                  title="Export all history as JSON"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  <span>Export All</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all assessment history?')) {
                      onClearHistory();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
                  title="Clear all history"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear History</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* History List */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground">
                <History className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">No assessment history found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                  {searchTerm ? 'No items match your search filter.' : 'Generate your first assessment using the Ingestion and Configuration panels to record it here!'}
                </p>
              </div>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all space-y-3 shadow-sm group"
              >
                {/* Item Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground font-mono bg-muted px-2 py-0.5 rounded">
                        {item.lessonId}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    {item.quiz && item.quiz[0] && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1 font-medium">
                        "{item.quiz[0].question}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onLoadQuiz(item.quiz);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                      title="Load this assessment into Quiz Studio"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Load Quiz</span>
                    </button>
                    <button
                      onClick={() => exportSingleQuiz(item)}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Export single quiz as JSON"
                    >
                      <FileJson className="h-4 w-4 text-emerald-500" />
                    </button>
                    <button
                      onClick={() => onDeleteEntry(item.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t text-[11px]">
                  <Badge variant="outline" className="bg-background font-mono">
                    {item.questionCount} Questions
                  </Badge>
                  <Badge 
                    variant={item.difficulty === 'hard' ? 'destructive' : item.difficulty === 'easy' ? 'secondary' : 'default'}
                    className="capitalize"
                  >
                    {item.difficulty}
                  </Badge>
                  {item.bloomTaxonomy && (
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      {item.bloomTaxonomy}
                    </Badge>
                  )}
                  {item.ragStats && (
                    <span className="text-emerald-500 font-medium ml-auto flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="h-3 w-3" />
                      {item.ragStats.retrievedChunks || 8} RAG Chunks Grounded
                    </span>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-muted/30 flex justify-between items-center text-xs text-muted-foreground">
          <span>Total assessments saved: <strong>{history.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold rounded-lg bg-card border hover:bg-muted text-foreground transition-colors"
          >
            Close History
          </button>
        </div>

      </div>
    </div>
  );
}
