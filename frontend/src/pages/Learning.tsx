import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  PlayCircle,
  FileText,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Target,
  FileCheck,
  AlertTriangle,
  RefreshCw,
  Check,
  Zap
} from 'lucide-react';

interface LearningProps {
  onNavigate: (page: string) => void;
}

const POPULAR_GOALS = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Engineer',
  'Data Scientist & ML Engineer',
  'DevOps & Cloud Engineer',
  'Cybersecurity Analyst'
];

export default function Learning({ onNavigate }: LearningProps) {
  const [targetGoal, setTargetGoal] = useState<string>('Frontend Developer');
  const [customGoal, setCustomGoal] = useState<string>('');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const [isSettingGoal, setIsSettingGoal] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<{ [key: string]: boolean }>({});
  const [activeResumeName, setActiveResumeName] = useState<string | null>(null);

  // Fetch active resume info on initial load
  useEffect(() => {
    const fetchActiveResume = async () => {
      try {
        const resumes = await apiFetch('resumes');
        const active = resumes.find((r: any) => r.isCurrent);
        if (active) {
          setActiveResumeName(active.fileName);
        }
      } catch (err) {
        /* silent fallback */
      }
    };
    fetchActiveResume();
  }, []);

  const generateRoadmap = async (selectedGoal: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`learning/roadmap?goal=${encodeURIComponent(selectedGoal)}`);
      setRoadmap(data);
      setIsSettingGoal(false);
      setExpandedModule(0);
    } catch (err: any) {
      setError(err.message || 'Failed to generate learning roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalGoal = customGoal.trim() || targetGoal;
    if (!finalGoal) return;
    generateRoadmap(finalGoal);
  };

  const toggleTask = (taskKey: string) => {
    setCompletedTasks(prev => ({ ...prev, [taskKey]: !prev[taskKey] }));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      {/* Header with Navigation Bar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            InterviewIQ <span className="text-amber-400">Roadmap</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">Dashboard</button>
          <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">Analytics</button>
          <button onClick={() => onNavigate('resumes')} className="hover:text-white transition-colors">Resumes</button>
          <button onClick={() => onNavigate('ats-scanner')} className="hover:text-white transition-colors">ATS Scanner</button>
          <button onClick={() => onNavigate('interview-setup')} className="hover:text-white transition-colors">Mock Interviews</button>
          <button onClick={() => onNavigate('coding-challenges')} className="hover:text-white transition-colors">Coding</button>
          <button className="text-amber-400 font-semibold">Roadmap</button>
          <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">Profile</button>
        </nav>

        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-xs font-medium px-3.5 py-2 rounded-lg transition-all text-neutral-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col gap-8">
        {/* Step 1: Goal Input Form */}
        {isSettingGoal ? (
          <div className="max-w-2xl mx-auto w-full glass-panel p-8 md:p-10 rounded-3xl border border-white/5 text-left space-y-8 animate-in fade-in zoom-in-95">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
                <Target className="w-3.5 h-3.5" /> Goal-Driven Curriculum
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">Set Your Career Goal</h1>
              <p className="text-neutral-400 text-sm mt-1">
                Tell us your target role. We will analyze your active resume and assessment history to generate a personalized skill-gap roadmap.
              </p>
            </div>

            {/* Resume Detection Banner */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
              activeResumeName
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              <FileCheck className="w-5 h-5 flex-shrink-0" />
              <div>
                {activeResumeName ? (
                  <p><span className="font-bold text-white">Active Resume Detected:</span> {activeResumeName} (Gemini AI will cross-examine your resume to spot explicit skill gaps)</p>
                ) : (
                  <p><span className="font-bold text-neutral-300">No active resume found:</span> Roadmap will be generated based on standard industry benchmarks for your target goal. (You can upload a resume anytime under Resumes).</p>
                )}
              </div>
            </div>

            <form onSubmit={handleGoalSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                  Select a Popular Career Path
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {POPULAR_GOALS.map(goal => (
                    <button
                      type="button"
                      key={goal}
                      onClick={() => { setTargetGoal(goal); setCustomGoal(''); }}
                      className={`p-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between ${
                        targetGoal === goal && !customGoal
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/5'
                          : 'bg-[#121217] border-white/5 text-neutral-300 hover:border-white/20'
                      }`}
                    >
                      <span>{goal}</span>
                      {targetGoal === goal && !customGoal && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Or Enter Custom Role / Goal
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mobile iOS Developer, AI Security Specialist..."
                  value={customGoal}
                  onChange={e => setCustomGoal(e.target.value)}
                  className="w-full bg-[#121217] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-violet-600 hover:from-amber-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Resume & Generating Roadmap...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" /> Generate AI Active Learning Roadmap
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Render Goal-Based AI Roadmap */
          <div className="space-y-8 animate-in fade-in">
            {/* Header Strategy Summary */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/5 text-left space-y-4 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <Target className="w-4 h-4" /> Customized Learning Plan
                  </div>
                  <h1 className="text-2xl font-extrabold text-white">
                    Target Role: <span className="text-amber-400">{roadmap.targetGoal}</span>
                  </h1>
                </div>
                <button
                  onClick={() => setIsSettingGoal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 px-3.5 py-2 rounded-xl transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Change Goal
                </button>
              </div>

              {/* Skill Gaps Identified */}
              {roadmap.skillGaps?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Identified Skill Gaps to Bridge
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.skillGaps.map((gap: string, i: number) => (
                      <span key={i} className="text-xs font-semibold px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strategic Summary */}
              {roadmap.focusSummary && (
                <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-xs text-neutral-300 leading-relaxed">
                  <span className="font-bold text-white block mb-1">AI Strategy & Gap Analysis:</span>
                  {roadmap.focusSummary}
                </div>
              )}

              {roadmap.resumeFileName && (
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cross-examined with active resume: <span className="underline">{roadmap.resumeFileName}</span>
                </p>
              )}
            </div>

            {/* Modules Timeline */}
            <div className="relative text-left">
              {/* Vertical Line */}
              <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-violet-500 to-sky-500 opacity-20"></div>

              <div className="space-y-6">
                {roadmap.modules.map((mod: any, idx: number) => {
                  const isExpanded = expandedModule === idx;
                  return (
                    <div key={idx} className="relative pl-12 md:pl-20">
                      {/* Timeline Dot */}
                      <div className="absolute left-3 md:left-7 top-6 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-[#09090b]"></div>
                      
                      <div className={`glass-panel rounded-2xl border transition-all duration-300 ${isExpanded ? 'border-amber-500/30 bg-white/[0.03]' : 'border-white/5 hover:border-white/10 cursor-pointer'}`}>
                        <div 
                          className="p-6 flex items-center justify-between"
                          onClick={() => setExpandedModule(isExpanded ? null : idx)}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                Module {idx + 1}
                              </span>
                              <span className="text-xs font-semibold text-neutral-400 bg-white/5 px-2 py-0.5 rounded">{mod.duration}</span>
                            </div>
                            <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                            {!isExpanded && <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{mod.description}</p>}
                          </div>
                          <ChevronDown className={`w-5 h-5 text-neutral-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>

                        {isExpanded && (
                          <div className="px-6 pb-6 pt-2 border-t border-white/5 animate-in slide-in-from-top-4 space-y-6">
                            <p className="text-xs text-neutral-300 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/5">
                              {mod.description}
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              {/* Recommended Resources */}
                              <div>
                                <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-3">Recommended Resources</h4>
                                <div className="space-y-2.5">
                                  {mod.resources.map((res: any, rIdx: number) => (
                                    <a key={rIdx} href={res.url !== '#' ? res.url : undefined} target="_blank" rel="noreferrer" className="flex items-start gap-3 p-3 rounded-xl bg-[#121217] border border-white/5 hover:border-amber-500/30 transition-colors group">
                                      {res.type?.toLowerCase().includes('video') ? (
                                        <PlayCircle className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                                      ) : res.type?.toLowerCase().includes('book') ? (
                                        <BookOpen className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                                      ) : (
                                        <FileText className="w-5 h-5 text-sky-400 mt-0.5 flex-shrink-0" />
                                      )}
                                      <div>
                                        <p className="text-xs font-bold text-neutral-200 group-hover:text-amber-400 transition-colors">{res.title}</p>
                                        <span className="text-[10px] text-neutral-500 uppercase font-semibold">{res.type}</span>
                                      </div>
                                    </a>
                                  ))}
                                </div>
                              </div>

                              {/* Action Items / Tasks with Interactive Completion */}
                              <div>
                                <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-3">Action Items</h4>
                                <div className="space-y-2.5">
                                  {mod.tasks.map((task: string, tIdx: number) => {
                                    const taskKey = `${idx}-${tIdx}`;
                                    const isDone = Boolean(completedTasks[taskKey]);
                                    return (
                                      <div
                                        key={tIdx}
                                        onClick={() => toggleTask(taskKey)}
                                        className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                          isDone ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-[#121217] border-white/5 text-neutral-300 hover:border-white/15'
                                        }`}
                                      >
                                        <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center text-xs flex-shrink-0 transition-colors ${
                                          isDone ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/30'
                                        }`}>
                                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <p className={`text-xs leading-normal ${isDone ? 'line-through text-emerald-400/80' : ''}`}>{task}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
