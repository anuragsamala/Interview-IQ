import { useState } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  Sparkles,
  ArrowLeft,
  Briefcase,
  Building,
  Target,
  Loader2,
  Mic,
  MessageSquare,
  Sparkle
} from 'lucide-react';

interface InterviewSetupProps {
  onNavigate: (page: string, params?: any) => void;
}

export default function InterviewSetup({ onNavigate }: InterviewSetupProps) {
  const [type, setType] = useState('TECHNICAL');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Frontend Developer');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedRoles = [
    'Frontend Developer',
    'Backend Engineer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist'
  ];

  const handleStart = async () => {
    if (type === 'SPEECHX') {
      onNavigate('speechx');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch('interviews/start', {
        method: 'POST',
        body: JSON.stringify({
          type,
          company: company.trim() || 'Tech Company',
          role: role.trim() || 'Software Engineer',
          difficulty
        })
      });
      // Data contains { interview, question }
      onNavigate('interview-session', { 
        interviewId: data.interview.id, 
        initialQuestion: data.question,
        role: role.trim() || 'Software Engineer',
        company: company.trim() || 'Tech Company',
        interviewType: type
      });
    } catch (err: any) {
      setError(err.message || 'Failed to start interview');
      setLoading(false);
    }
  };

  const types = [
    { id: 'TECHNICAL', label: 'Technical Interview', desc: 'Core DSA, system engineering & code logic in interactive text chat' },
    { id: 'HR', label: 'HR & Behavioral', desc: 'Culture fit & STAR method responses via conversational chat' },
    { id: 'SYSTEM_DESIGN', label: 'System Design', desc: 'Architecture, microservices & scaling questions' },
    { id: 'SPEECHX', label: 'AMCAT SpeechX', desc: 'Oral fluency, sentence repeat & voice pronunciation test' }
  ];

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

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col gap-8 text-left">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-3">
            <Target className="w-8 h-8 text-violet-400" /> Start AI Mock Session
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Practice realistic interviews in focused text chat format, or launch SpeechX for oral English evaluation.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="glass-panel p-8 rounded-2xl border border-white/5 space-y-8">
          {/* Type Selection */}
          <div>
            <label className="text-sm font-bold text-white mb-4 block">Interview Category</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {types.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    type === t.id
                      ? 'bg-violet-500/10 border-violet-500/50 ring-1 ring-violet-500'
                      : 'border-white/5 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {t.id === 'SPEECHX' ? (
                      <Mic className="w-4 h-4 text-amber-400" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-violet-400" />
                    )}
                    <h4 className={`font-bold text-sm ${type === t.id ? 'text-violet-400' : 'text-neutral-300'}`}>
                      {t.label}
                    </h4>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {type !== 'SPEECHX' && (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Target Role */}
                <div>
                  <label className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-neutral-400" /> Target Role
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer"
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200 mb-2.5"
                  />
                  {/* Quick role chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {suggestedRoles.map((sRole) => (
                      <button
                        key={sRole}
                        type="button"
                        onClick={() => setRole(sRole)}
                        className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                          role === sRole
                            ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                            : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {sRole}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Company */}
                <div>
                  <label className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4 text-neutral-400" /> Target Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Microsoft, Amazon"
                    className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                  />
                  <p className="text-[11px] text-neutral-500 mt-2">
                    Leave blank to practice general industry questions.
                  </p>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="text-sm font-bold text-white mb-4 block">Difficulty Level</label>
                <div className="flex gap-4">
                  {['EASY', 'MEDIUM', 'HARD'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`px-6 py-2 rounded-lg text-sm font-medium border transition-all ${
                        difficulty === level
                          ? 'bg-sky-500/10 border-sky-500 text-sky-400 font-semibold'
                          : 'bg-[#18181b] border-white/10 text-neutral-400 hover:border-white/20'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === 'SPEECHX' && (
            <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl text-xs text-amber-300 space-y-2">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" /> AMCAT SpeechX Spoken English Assessment (Voice Only)
              </h4>
              <p>
                SpeechX measures your spoken fluency, sentence structure, pronunciation, and hesitation penalty across 4 interactive oral modules (Sentence Repeat, Audio Comprehension, Extempore Speech, Grammar Correction).
              </p>
            </div>
          )}

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-violet-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Initializing AI Interview Engine...
              </>
            ) : type === 'SPEECHX' ? (
              <>
                <Mic className="w-5 h-5 text-amber-300" /> Launch AMCAT SpeechX Voice Assessment
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5 text-violet-200" /> Start Text Interview
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
