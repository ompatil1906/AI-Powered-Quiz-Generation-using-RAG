import React, { useState } from 'react';
import { 
  Sparkles, 
  LogIn, 
  UserPlus, 
  Loader2, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Brain, 
  Database, 
  Zap, 
  CheckCircle2, 
  Activity,
  ArrowRight,
  Layers,
  Award
} from 'lucide-react';

export function LandingAuthPage({ onLogin, onSignup, onDemoLogin, isLoading }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim() || !loginPassword) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    await onLogin(loginEmail, loginPassword);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!fullName.trim() || !signupEmail.trim() || !signupPassword) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    await onSignup(fullName, signupEmail, signupPassword);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between overflow-x-hidden selection:bg-primary/20">
      
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Top Brand Nav Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-xl shadow-lg shadow-primary/20">
            Q
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none">AI Quiz Studio</h1>
            <p className="text-xs text-muted-foreground mt-0.5">RAG-Powered Assessment Engine</p>
          </div>
        </div>

        <button
          onClick={onDemoLogin}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all shadow-sm"
        >
          <Sparkles className="h-4 w-4" />
          <span>Instant Demo Login</span>
        </button>
      </header>

      {/* Main Hero & Auth Card Layout */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Hero Column */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Activity className="h-3.5 w-3.5" />
            <span>AI-Powered Quiz Generation using RAG & Gemini 2.5 Flash</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Transform Lesson Transcripts into <span className="bg-gradient-to-r from-primary via-emerald-500 to-amber-500 bg-clip-text text-transparent">Grounded Quizzes</span>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-xl">
              Log in to access your personal AI Quiz Studio dashboard. Ingest lecture transcripts, configure Bloom's taxonomy objectives, run real-time vector inspection, and manage assessment history.
            </p>
          </div>

          {/* Feature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Database className="h-4 w-4 text-emerald-500" />
                <span>Sentence-Aware RAG Engine</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ChromaDB vector indexing with sentence boundary chunking to prevent mid-fact cuts.
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Brain className="h-4 w-4 text-primary" />
                <span>Bloom's Taxonomy Engine</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Target cognitive depth from Remembering & Understanding to Analyzing & Evaluating.
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Verified Source Grounding</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Every generated question includes exact context evidence quotes and citation badges.
              </p>
            </div>

            <div className="p-4 rounded-xl border bg-card/60 backdrop-blur-sm space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <Layers className="h-4 w-4 text-purple-500" />
                <span>Persistent History & Export</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Automatically save, search, reload, and export past assessments as structured JSON files.
              </p>
            </div>
          </div>

        </div>

        {/* Right Auth Card Column */}
        <div className="lg:col-span-5 w-full">
          <div className="w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden text-card-foreground">
            
            {/* Auth Card Header */}
            <div className="p-6 border-b border-border bg-muted/30 text-center space-y-1">
              <div className="inline-flex p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 mb-1">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Welcome to AI Quiz Studio</h3>
              <p className="text-xs text-muted-foreground">Sign in to unlock full dashboard access</p>
            </div>

            {/* Tab Selector */}
            <div className="flex border-b border-border bg-muted/20 font-semibold text-xs">
              <button
                onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
                className={`flex-1 py-3.5 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'login' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <LogIn className="h-4 w-4" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => { setActiveTab('signup'); setErrorMsg(''); }}
                className={`flex-1 py-3.5 text-center border-b-2 transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'signup' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              {errorMsg && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive font-medium text-center">
                  {errorMsg}
                </div>
              )}

              {/* 1-Click Instant Demo Card */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-primary">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Explore Without Account Creation</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Use the pre-configured demo account to instantly access all RAG assessment features.
                </p>
                <button
                  onClick={onDemoLogin}
                  disabled={isLoading}
                  className="w-full py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-1"
                >
                  {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  <span>⚡ Access Studio with 1-Click Demo</span>
                </button>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border" />
                <span className="flex-shrink mx-3 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Or Account Sign In</span>
                <div className="flex-grow border-t border-border" />
              </div>

              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      placeholder="demo@learnyst.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                    <span>Enter Dashboard</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>Confirm Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    <span>Create & Enter Studio</span>
                  </button>
                </form>
              )}

            </div>

            <div className="p-4 border-t border-border bg-muted/30 text-center text-xs text-muted-foreground">
              <span>Secure Authentication & RAG Assessment System</span>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/40 py-4 px-6 text-center text-xs text-muted-foreground relative z-10">
        <span>© 2026 AI Quiz Studio. Built with FastAPI, ChromaDB RAG & Gemini 2.5 Flash.</span>
      </footer>

    </div>
  );
}
