import { useState } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  Sparkles,
  ArrowLeft,
  Scan,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';

interface AtsReport {
  score: number;
  recruiterScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  weaknesses: string[];
  improvements: string[];
}

interface AtsScannerProps {
  onNavigate: (page: string) => void;
}

export default function AtsScanner({ onNavigate }: AtsScannerProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AtsReport | null>(null);

  const handleScan = async () => {
    if (jobDescription.trim().length < 50) {
      setError('Please provide a detailed job description (at least 50 characters).');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const result = await apiFetch('ats/scan', {
        method: 'POST',
        body: JSON.stringify({ jobDescription }),
      });
      setReport(result);
    } catch (err: any) {
      setError(err.message || 'Failed to generate ATS report. Ensure you have an active resume uploaded.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-400/10 border-emerald-400/20';
    if (score >= 60) return 'bg-amber-400/10 border-amber-400/20';
    return 'bg-rose-400/10 border-rose-400/20';
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            InterviewIQ <span className="text-violet-400">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
          <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">Analytics</button>
          <button onClick={() => onNavigate('resumes')} className="hover:text-white transition-colors">Resumes</button>
          <button className="text-sky-400 font-semibold">ATS Scanner</button>
          <button onClick={() => onNavigate('interview-setup')} className="hover:text-white transition-colors">Mock Interviews</button>
          <button onClick={() => onNavigate('coding-challenges')} className="hover:text-white transition-colors">Coding</button>
          <button onClick={() => onNavigate('learning')} className="hover:text-white transition-colors">Roadmap</button>
          <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">Profile</button>
        </nav>

        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-xs font-medium px-3.5 py-2 rounded-lg transition-all text-neutral-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Scan className="w-8 h-8 text-sky-400" /> ATS Compatibility Scanner
          </h1>
          <p className="text-sm text-neutral-400 mt-2">Paste the target Job Description below. We'll use Gemini AI to analyze your active resume and provide an actionable compatibility report.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-neutral-400" /> Job Description
            </h3>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here (responsibilities, requirements, qualifications)..."
              className="w-full h-80 bg-[#18181b] border border-white/10 rounded-2xl p-5 text-sm focus:outline-none focus:border-sky-500 transition-colors text-neutral-200 resize-none"
            />
            <button
              onClick={handleScan}
              disabled={loading || jobDescription.trim().length === 0}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sky-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Scan className="w-5 h-5" />}
              {loading ? 'Analyzing Resume via Gemini AI...' : 'Run ATS Scan'}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {!report && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 glass-panel rounded-2xl border border-white/5 border-dashed">
                <Scan className="w-12 h-12 text-neutral-700 mb-4" />
                <h3 className="text-lg font-bold text-neutral-300">Ready to Scan</h3>
                <p className="text-sm text-neutral-500 mt-2 max-w-sm">Paste a job description and hit scan to see how well your resume matches the role.</p>
              </div>
            )}

            {loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 glass-panel rounded-2xl border border-sky-500/20 bg-sky-500/5">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-t-2 border-sky-400 animate-spin" />
                  <Sparkles className="w-6 h-6 text-sky-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-sky-400 mt-6">Analyzing Profile</h3>
                <p className="text-sm text-neutral-400 mt-2">Matching keywords, extracting insights, and generating recommendations...</p>
              </div>
            )}

            {report && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreBg(report.score)}`}>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">ATS Match</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${getScoreColor(report.score)}`}>{report.score}</span>
                      <span className="text-neutral-500 font-bold">%</span>
                    </div>
                  </div>
                  <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${getScoreBg(report.recruiterScore)}`}>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Recruiter Appeal</p>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold ${getScoreColor(report.recruiterScore)}`}>{report.recruiterScore}</span>
                      <span className="text-neutral-500 font-bold">%</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-5">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Matched Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {report.matchedKeywords.length === 0 ? <p className="text-xs text-neutral-500">No keywords matched.</p> : report.matchedKeywords.map((kw, i) => (
                        <span key={i} className="text-xs font-medium px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{kw}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="h-px bg-white/5 w-full my-4" />

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4 text-rose-400" /> Missing Keywords
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {report.missingKeywords.length === 0 ? <p className="text-xs text-neutral-500">No major keywords missing!</p> : report.missingKeywords.map((kw, i) => (
                        <span key={i} className="text-xs font-medium px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actionable Feedback */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-400" /> Actionable Improvements
                  </h4>
                  <ul className="space-y-3">
                    {report.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-neutral-300">
                        <ChevronRight className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                    {report.improvements.length === 0 && (
                      <p className="text-xs text-neutral-500">Your resume looks solid for this role!</p>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
