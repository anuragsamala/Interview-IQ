import {
  Sparkles,
  ArrowLeft,
  Award,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Target
} from 'lucide-react';

interface SpeechXReportProps {
  onNavigate: (page: string, params?: any) => void;
  report: any;
}

export default function SpeechXReport({ onNavigate, report }: SpeechXReportProps) {
  if (!report) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white p-6">
        <p className="text-rose-400 mb-4">No SpeechX evaluation report found.</p>
        <button onClick={() => onNavigate('dashboard')} className="text-sky-400 underline">Return to Dashboard</button>
      </div>
    );
  }

  const { overallScore, cefrLevel, hiringCategory, metrics, fillerWordsDetected, totalFillerCount, strengths, improvements } = report;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            AMCAT <span className="text-amber-400">SpeechX Report</span>
          </span>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-xs font-medium px-3.5 py-2 rounded-lg transition-all text-neutral-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col gap-8 text-left">
        {/* Main Banner */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
                <Award className="w-4 h-4" /> AMCAT SpeechX Standard
              </div>
              <h1 className="text-3xl font-extrabold text-white">Communication Diagnostic Scorecard</h1>
              <p className="text-sm text-neutral-400 mt-1">{hiringCategory}</p>
            </div>

            {/* Score Pill */}
            <div className="bg-[#121217] border border-amber-500/30 p-5 rounded-2xl text-center min-w-[160px]">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">Overall SpeechX</span>
              <span className="text-4xl font-extrabold text-amber-400">{overallScore}</span>
              <span className="text-xs text-neutral-500 block font-semibold mt-1">/ 100</span>
            </div>
          </div>

          {/* CEFR Level Tag */}
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-400" /> CEFR Spoken English Level:
            </span>
            <span className="font-extrabold text-amber-300 text-sm">{cefrLevel}</span>
          </div>
        </div>

        {/* Diagnostic Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">Fluency & Rhythm</span>
            <p className="text-2xl font-extrabold text-white">{metrics?.fluency || 85}%</p>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${metrics?.fluency || 85}%` }} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">Pronunciation</span>
            <p className="text-2xl font-extrabold text-white">{metrics?.pronunciation || 86}%</p>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-sky-400 h-full" style={{ width: `${metrics?.pronunciation || 86}%` }} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">Grammar Structure</span>
            <p className="text-2xl font-extrabold text-white">{metrics?.grammar || 84}%</p>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-violet-400 h-full" style={{ width: `${metrics?.grammar || 84}%` }} />
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">Vocabulary Diversity</span>
            <p className="text-2xl font-extrabold text-white">{metrics?.vocabulary || 82}%</p>
            <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: `${metrics?.vocabulary || 82}%` }} />
            </div>
          </div>
        </div>

        {/* Filler Word Penalty Analysis */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" /> Filler Word & Hesitation Penalty Analysis
          </h3>

          <div className="grid md:grid-cols-2 gap-4 bg-[#121217] p-5 rounded-2xl border border-white/5">
            <div>
              <p className="text-xs text-neutral-400">Total Filler Words Spoken</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-1">{totalFillerCount || 0} Count</p>
              <p className="text-[11px] text-neutral-500 mt-1">Penalty Impact: -{metrics?.fillerWordPenalty || 0} pts on fluency</p>
            </div>

            <div>
              <p className="text-xs text-neutral-400 mb-2">Detected Hesitations</p>
              <div className="flex flex-wrap gap-2">
                {fillerWordsDetected && fillerWordsDetected.length > 0 ? (
                  fillerWordsDetected.map((f: string, i: number) => (
                    <span key={i} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      "{f}"
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> No major filler words detected!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Actionable Coaching */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Communication Strengths
            </h3>
            <ul className="space-y-3">
              {strengths?.map((s: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" /> AI Communication Coaching Tips
            </h3>
            <ul className="space-y-3">
              {improvements?.map((imp: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
