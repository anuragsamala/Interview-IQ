import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Terminal, 
  FileText, 
  Award, 
  Play, 
  ArrowRight, 
  HelpCircle, 
  Github, 
  Menu, 
  X,
  Volume2,
  Code,
  MessageSquare
} from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Profile from './pages/Profile.tsx';
import Resumes from './pages/Resumes.tsx';
import AtsScanner from './pages/AtsScanner.tsx';
import InterviewSetup from './pages/InterviewSetup.tsx';
import InterviewSession from './pages/InterviewSession.tsx';
import InterviewReport from './pages/InterviewReport.tsx';
import CodingChallenges from './pages/CodingChallenges.tsx';
import CodeEditor from './pages/CodeEditor.tsx';
import Analytics from './pages/Analytics.tsx';
import Learning from './pages/Learning.tsx';
import SpeechX from './pages/SpeechX.tsx';
import SpeechXReport from './pages/SpeechXReport.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';

function Landing({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('technical');
  const [demoResumeText, setDemoResumeText] = useState('');
  const [demoAtsResult, setDemoAtsResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const categories = [
    { id: 'technical', label: 'Technical Interviews', desc: 'DSA, Algorithms, and System Design with code evaluation.', icon: Code },
    { id: 'behavioral', label: 'Behavioral & HR', desc: 'STAR method response evaluation and communication insights.', icon: MessageSquare },
    { id: 'aptitude', label: 'Aptitude & Logic', desc: 'Analytical reasoning, speed-math, and logical thinking tests.', icon: Cpu },
  ];

  const handleDemoScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoResumeText.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      setDemoAtsResult({
        score: 82,
        match: 'Strong Match',
        keywords: ['TypeScript', 'Node.js', 'React', 'Prisma'],
        missing: ['Redis', 'Docker'],
        tips: 'Highlight database transactions and list containerization experience.'
      });
      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] selection:bg-violet-500 selection:text-white relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center shadow-lg shadow-violet-600/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent font-sans">
            InterviewIQ <span className="text-violet-400">AI</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">AI Demo</a>
          <a href="#categories" className="hover:text-white transition-colors">Categories</a>
          <a href="#scanner" className="hover:text-white transition-colors">ATS Scanner</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <button 
              onClick={() => onNavigate('dashboard')} 
              className="text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-4.5 py-2.5 rounded-lg transition-all shadow-md shadow-violet-600/10"
              id="btn-nav-dashboard"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className="text-sm font-medium hover:text-white transition-colors px-4 py-2" id="btn-login-header">
                Login
              </button>
              <button onClick={() => onNavigate('register')} className="text-sm font-medium bg-white text-black hover:bg-neutral-200 px-4 py-2.5 rounded-lg transition-all shadow-md shadow-white/5" id="btn-register-header">
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-2 text-neutral-400 hover:text-white"
          id="btn-mobile-nav"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/5 p-6 flex flex-col gap-4 absolute top-[73px] left-0 w-full z-40">
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-white py-2">Features</a>
          <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-white py-2">AI Demo</a>
          <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-white py-2">Categories</a>
          <a href="#scanner" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-white py-2">ATS Scanner</a>
          <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-neutral-300 hover:text-white py-2">FAQ</a>
          <hr className="border-white/5 my-2" />
          <div className="flex gap-4">
            {isAuthenticated ? (
              <button onClick={() => { setMobileMenuOpen(false); onNavigate('dashboard'); }} className="flex-1 py-2 text-center text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Go to Dashboard</button>
            ) : (
              <>
                <button onClick={() => { setMobileMenuOpen(false); onNavigate('login'); }} className="flex-1 py-2 text-center text-sm font-medium border border-white/10 rounded-lg hover:bg-white/5 transition-colors">Login</button>
                <button onClick={() => { setMobileMenuOpen(false); onNavigate('register'); }} className="flex-1 py-2 text-center text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">Get Started</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 md:px-12 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/5 text-violet-400 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Next-generation AI Co-pilot for placements
        </div>
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] font-sans">
          Practice Interviews Like <br />
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">
            A Real Recruiter Is Watching
          </span>
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl max-w-3xl mx-auto mb-10 font-sans leading-relaxed">
          InterviewIQ AI evaluates your speech, analyses coding execution, scores resumes against job specifications, and builds customizable plans to ace your dream companies.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => onNavigate(isAuthenticated ? 'dashboard' : 'register')} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-600/20"
            id="btn-hero-register"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => onNavigate('login')} className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/10 hover:bg-white/5 hover:border-white/20 font-medium px-8 py-4 rounded-xl transition-all" id="btn-hero-login">
            <Play className="w-4 h-4 text-violet-400 fill-violet-400/20" /> Try Demo Login
          </button>
        </div>

        {/* Company logos showcase */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">Built for top-tier hiring standards</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-75 transition-all">
            <span className="text-lg font-bold text-white tracking-widest font-sans">MICROSOFT</span>
            <span className="text-lg font-bold text-white tracking-widest font-sans">AMAZON</span>
            <span className="text-lg font-bold text-white tracking-widest font-sans">META</span>
            <span className="text-lg font-bold text-white tracking-widest font-sans">GOOGLE</span>
            <span className="text-lg font-bold text-white tracking-widest font-sans">STRIPE</span>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-24 px-6 md:px-12 border-t border-white/5 bg-gradient-to-b from-transparent to-[#0e0e11]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-sans">Advanced Intelligent Features</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">Complete modular engines orchestrating interview realism and ATS optimization.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6 shadow-md shadow-violet-500/5">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-sans">Adaptive Voice Agent</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Powered by Gemini 2.5 and ElevenLabs, simulating dynamic recruiter personalities with adaptive questioning depending on your answer depth.
              </p>
              <span className="text-xs text-violet-400 font-semibold bg-violet-400/5 border border-violet-500/10 px-2 py-1 rounded">Speech-to-Text Enabled</span>
            </div>

            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6 shadow-md shadow-sky-500/5">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-sans">Monaco Code Execution</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Execute code inside an integrated Monaco Editor with Judge0 compilers. Leverages AI agents for hidden test case design and runtime analysis.
              </p>
              <span className="text-xs text-sky-400 font-semibold bg-sky-400/5 border border-sky-500/10 px-2 py-1 rounded">Judge0 Integration</span>
            </div>

            <div className="glass-panel glass-panel-hover p-8 rounded-2xl flex flex-col items-start text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 shadow-md shadow-emerald-500/5">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-sans">ATS Scanner & Parser</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Extract keywords from PDF/DOCX and cross-match with specific job descriptions to estimate hiring likelihood and grammar suggestions.
              </p>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-400/5 border border-emerald-500/10 px-2 py-1 rounded">Resume Parser v1.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* AI Demo Preview */}
      <section id="demo" className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-5xl mx-auto glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-violet-600/10 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-1.5 text-xs text-violet-400 font-semibold bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full mb-4">
                <Play className="w-3 h-3 fill-violet-400" /> Interactive Preview
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans leading-tight">Hear the AI Interviewer</h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Experience the conversational flow. Below is a mock technical question from our adaptive AI interviewer. Tap play to listen, or see the expected output review.
              </p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-5 py-3 rounded-lg text-sm font-semibold transition-all">
                  <Volume2 className="w-4 h-4" /> Listen to Audio
                </button>
                <button className="flex items-center gap-2 border border-white/10 hover:bg-white/5 px-5 py-3 rounded-lg text-sm font-semibold transition-all">
                  View Text Question
                </button>
              </div>
            </div>

            <div className="bg-black/50 border border-white/5 rounded-2xl p-6 text-left font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <span className="text-neutral-400 font-sans">Simulated Question Feed</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-violet-400 mb-2">// AI Interviewer (Technical Role)</p>
              <p className="text-neutral-300 leading-relaxed mb-4">
                "Okay, let's explore optimization. Imagine you have a database relation with 10 million rows, and query filters are slowing down on a nested JSON field. How would you design the index schema in PostgreSQL to handle this, and what are the trade-offs?"
              </p>
              <div className="border-t border-white/5 pt-4 mt-2">
                <p className="text-neutral-500 mb-2">// Suggested Core Competencies</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">GIN Indexing</span>
                  <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">JSONB</span>
                  <span className="bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">Query Optimization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Categories (Tabs) */}
      <section id="categories" className="py-24 px-6 md:px-12 border-t border-white/5 bg-[#0b0b0d]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-sans">Tailored Interview Formats</h2>
            <p className="text-neutral-400">Personalized workflows built specifically for your preparation path.</p>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-4 mb-10">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-left border transition-all ${
                    activeCategory === cat.id
                      ? 'bg-violet-600/10 border-violet-500/40 text-white shadow-md'
                      : 'bg-transparent border-white/5 text-neutral-400 hover:border-white/10 hover:text-neutral-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-violet-400' : 'text-neutral-500'}`} />
                  <div>
                    <p className="font-semibold text-sm font-sans">{cat.label}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="glass-panel p-8 rounded-2xl min-h-[160px] flex items-center justify-center text-center">
            <div>
              <h3 className="text-2xl font-bold mb-3 font-sans">
                {categories.find(c => c.id === activeCategory)?.label}
              </h3>
              <p className="text-neutral-400 text-sm max-w-xl mx-auto">
                {categories.find(c => c.id === activeCategory)?.desc}
              </p>
              <button className="mt-6 flex items-center gap-1 mx-auto text-sm font-semibold text-violet-400 hover:text-violet-300">
                Learn more about this format <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Scanner Preview (Interactive Form) */}
      <section id="scanner" className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-sans">Interactive ATS Analyzer Preview</h2>
            <p className="text-neutral-400">Test a mini-simulation of our scanner engine below. Input skill details to evaluate match capability.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="glass-panel p-6 rounded-2xl text-left">
              <h3 className="text-lg font-bold mb-4 font-sans flex items-center gap-2">
                <FileText className="w-5 h-5 text-violet-400" /> Enter Mock Resume Details
              </h3>
              <form onSubmit={handleDemoScan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Resume Text Summary</label>
                  <textarea 
                    rows={4} 
                    value={demoResumeText} 
                    onChange={(e) => setDemoResumeText(e.target.value)}
                    placeholder="e.g. Fullstack Engineer with 2 years of experience building applications with React, TypeScript, Node.js and Prisma." 
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-neutral-600 text-neutral-200"
                    id="txt-landing-demo-resume"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isScanning}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  id="btn-landing-demo-scan"
                >
                  {isScanning ? 'Processing with Agent...' : 'Analyze Match'}
                </button>
              </form>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-left min-h-[295px] flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold mb-4 font-sans flex items-center gap-2">
                  <Award className="w-5 h-5 text-sky-400" /> Scanner Engine Feedback
                </h3>
                
                {!demoAtsResult ? (
                  <div className="flex flex-col items-center justify-center text-center py-12">
                    <p className="text-neutral-500 text-sm">Enter resume data and tap scan to trigger the local analyzer.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-[#18181b] p-3 rounded-lg border border-white/5">
                      <span className="text-sm font-semibold text-neutral-300">Match score</span>
                      <span className="text-lg font-bold text-violet-400">{demoAtsResult.score}% ({demoAtsResult.match})</span>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Identified Skills</span>
                      <div className="flex flex-wrap gap-1.5">
                        {demoAtsResult.keywords.map((kw: string) => (
                          <span key={kw} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-xs">{kw}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Missing Keywords</span>
                      <div className="flex flex-wrap gap-1.5">
                        {demoAtsResult.missing.map((kw: string) => (
                          <span key={kw} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-xs">{kw}</span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-3">
                      <span className="block text-xs font-bold text-neutral-400 mb-1">Recommendation</span>
                      <p className="text-neutral-300 text-xs leading-relaxed">{demoAtsResult.tips}</p>
                    </div>
                  </div>
                )}
              </div>

              {demoAtsResult && (
                <button 
                  onClick={() => setDemoAtsResult(null)} 
                  className="w-full text-center text-neutral-500 hover:text-neutral-300 text-xs transition-colors py-2"
                  id="btn-landing-clear-demo"
                >
                  Clear Results
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-12 border-t border-white/5 bg-[#08080a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-sans">Loved by Candidates</h2>
            <p className="text-neutral-400">See how graduates are using InterviewIQ to land tech offers.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-2xl text-left">
              <p className="text-neutral-300 italic mb-6 leading-relaxed">
                "The adaptive follow-up feature felt exactly like the technical screen I had at Amazon. The coding hints helped me understand how to explain runtime optimization out loud."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center font-bold text-white">S</div>
                <div>
                  <h4 className="font-bold text-sm font-sans">Saurabh Sharma</h4>
                  <p className="text-neutral-500 text-xs">Software Engineer, Amazon Placement</p>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl text-left">
              <p className="text-neutral-300 italic mb-6 leading-relaxed">
                "Uploading the job description along with my resume helped pinpoint key GIN index missing terms. The ATS match score rose from 60% to 85%, getting me an immediate callback."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center font-bold text-white">A</div>
                <div>
                  <h4 className="font-bold text-sm font-sans">Aishwarya Rao</h4>
                  <p className="text-neutral-500 text-xs">Associate Data Analyst</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 font-sans">Frequently Asked Questions</h2>
            <p className="text-neutral-400">Answers to core platform operational queries.</p>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl text-left">
              <h3 className="font-bold text-base mb-2 font-sans flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-violet-400" /> How does the adaptive AI follow-up work?
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                If your answer is highly complete and structured, the Interview Agent generates a tougher question. If you struggle or make errors, the agent simplifies the prompt sequence to help you recover.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-xl text-left">
              <h3 className="font-bold text-base mb-2 font-sans flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-violet-400" /> Can I run the project without real API keys?
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Yes, Phase 1 includes mock fallback endpoints inside the backend architecture, allowing developers to execute standard flows without active credentials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 md:px-12 bg-black text-center text-sm text-neutral-500">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-neutral-300">InterviewIQ AI</span>
          </div>
          
          <div className="flex gap-6">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">AI Demo</a>
            <a href="#scanner" className="hover:text-white transition-colors">ATS Scanner</a>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <a href="#" className="hover:text-white"><Github className="w-5 h-5" /></a>
          </div>
        </div>
        <p className="mt-8 text-xs text-neutral-600">© 2026 InterviewIQ AI. All rights reserved. Built as college project startup framework.</p>
      </footer>
    </div>
  );
}

function AppContent() {
  const [pageState, setPageState] = useState({ name: 'landing', params: null as any });
  const [emailForVerification, setEmailForVerification] = useState('');

  const setPage = (pageName: string, params?: any) => {
    setPageState({ name: pageName, params });
  };

  const page = pageState.name;
  const pageParams = pageState.params;

  switch (page) {
    case 'landing':
      return <Landing onNavigate={setPage} />;
    case 'login':
      return <Login onNavigate={setPage} setEmailForVerification={setEmailForVerification} />;
    case 'register':
      return (
        <Register 
          onNavigate={setPage} 
          emailForVerification={emailForVerification} 
          setEmailForVerification={setEmailForVerification} 
        />
      );
    case 'forgot-password':
      return <ForgotPassword onNavigate={setPage} />;
    case 'dashboard':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <Dashboard onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'profile':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <Profile onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'resumes':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <Resumes onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'ats-scanner':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <AtsScanner onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'interview-setup':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <InterviewSetup onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'interview-session':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <InterviewSession onNavigate={setPage} interviewId={pageParams?.interviewId} initialQuestion={pageParams?.initialQuestion} />
        </ProtectedRoute>
      );
    case 'interview-report':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <InterviewReport onNavigate={setPage} interviewId={pageParams?.interviewId} />
        </ProtectedRoute>
      );
    case 'speechx':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <SpeechX onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'speechx-report':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <SpeechXReport onNavigate={setPage} report={pageParams?.report} />
        </ProtectedRoute>
      );
    case 'coding-challenges':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <CodingChallenges onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'coding-editor':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <CodeEditor onNavigate={setPage} problemId={pageParams?.problemId} />
        </ProtectedRoute>
      );
    case 'analytics':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <Analytics onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'learning':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <Learning onNavigate={setPage} />
        </ProtectedRoute>
      );
    case 'admin':
      return (
        <ProtectedRoute fallbackPageSetter={setPage}>
          <AdminDashboard onNavigate={setPage} />
        </ProtectedRoute>
      );
    default:
      return <Landing onNavigate={setPage} />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
