import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  Sparkles,
  ArrowLeft,
  Award,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Code,
  FileText,
  Loader2
} from 'lucide-react';

interface InterviewReportProps {
  onNavigate: (page: string) => void;
  interviewId: string;
}

export default function InterviewReport({ onNavigate, interviewId }: InterviewReportProps) {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await apiFetch(`interviews/${interviewId}`);
        setReport(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load interview report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <p className="text-rose-400 mb-4">{error || 'Report not found'}</p>
        <button onClick={() => onNavigate('dashboard')} className="text-sky-400 underline">Return to Dashboard</button>
      </div>
    );
  }

  const feedback = report.feedbacks?.[0] || {};
  const isHire = report.hiringRecommendation?.toLowerCase().includes('hire') && !report.hiringRecommendation?.toLowerCase().includes('no hire');

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            InterviewIQ <span className="text-violet-400">AI</span>
          </span>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-xs font-medium px-3.5 py-2 rounded-lg transition-all text-neutral-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Award className="w-8 h-8 text-violet-400" /> Interview Performance Report
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Role: <span className="text-white font-medium">{report.role}</span> at <span className="text-white font-medium">{report.company || 'Unknown'}</span> | 
            Type: <span className="text-white font-medium">{report.type}</span>
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Overall Score</p>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-extrabold ${report.score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>{report.score || 0}</span>
              <span className="text-neutral-500 font-bold">/100</span>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">AI Rating</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-sky-400">{report.overallRating || 0}</span>
              <span className="text-neutral-500 font-bold">/5.0</span>
            </div>
          </div>
          <div className={`glass-panel p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${isHire ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Recommendation</p>
            <span className={`text-xl font-extrabold ${isHire ? 'text-emerald-400' : 'text-rose-400'}`}>
              {report.hiringRecommendation || 'Pending'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Strengths & Weaknesses */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <ThumbsUp className="w-4 h-4 text-emerald-400" /> Key Strengths
              </h3>
              <ul className="space-y-2">
                {report.strengths?.map((s: string, i: number) => (
                  <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <ThumbsDown className="w-4 h-4 text-rose-400" /> Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {report.weaknesses?.map((w: string, i: number) => (
                  <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Feedback */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-sky-400" /> General Feedback
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{feedback.generalFeedback || 'No general feedback provided.'}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-violet-400" /> Technical Feedback
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{feedback.technicalFeedback || 'No technical feedback provided.'}</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-400" /> Communication Feedback
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{feedback.communicationFeedback || 'No communication feedback provided.'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
