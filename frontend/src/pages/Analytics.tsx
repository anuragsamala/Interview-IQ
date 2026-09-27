import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  Sparkles,
  ArrowLeft,
  Activity,
  Award,
  Target,
  Code,
  FileText,
  Loader2,
  TrendingUp,
  Brain
} from 'lucide-react';

interface AnalyticsProps {
  onNavigate: (page: string) => void;
}

export default function Analytics({ onNavigate }: AnalyticsProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiFetch('analytics');
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <p className="text-rose-400 mb-4">{error || 'Failed to load analytics'}</p>
        <button onClick={() => onNavigate('dashboard')} className="text-sky-400 underline">Return to Dashboard</button>
      </div>
    );
  }

  const { readinessScore, progressData, modules } = data;

  // Radar Data based on strengths/weaknesses if available, else placeholder
  const radarData = [
    { subject: 'System Design', A: 85, fullMark: 100 },
    { subject: 'Algorithms', A: modules.coding?.successRate || 70, fullMark: 100 },
    { subject: 'Communication', A: modules.interviews?.avgScore || 75, fullMark: 100 },
    { subject: 'Problem Solving', A: 80, fullMark: 100 },
    { subject: 'Code Quality', A: modules.coding?.avgReadability || 75, fullMark: 100 },
    { subject: 'Domain Match', A: modules.ats?.avgScore || 60, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            InterviewIQ <span className="text-sky-400">Analytics</span>
          </span>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-xs font-medium px-3.5 py-2 rounded-lg transition-all text-neutral-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
              <Activity className="w-8 h-8 text-violet-400" /> AI Readiness Dashboard
            </h1>
            <p className="text-sm text-neutral-400">Track your progress across ATS Match, Mock Interviews, and Coding Challenges.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-neutral-500 tracking-wider">Overall Readiness</p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className={`text-4xl font-extrabold ${readinessScore >= 80 ? 'text-emerald-400' : readinessScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {readinessScore}
                </span>
                <span className="text-sm font-bold text-neutral-500">/100</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center bg-black/50" style={{ borderColor: readinessScore >= 80 ? '#34d399' : readinessScore >= 60 ? '#fbbf24' : '#f87171' }}>
              <Target className={`w-8 h-8 ${readinessScore >= 80 ? 'text-emerald-400' : readinessScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Progress Chart */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-400" /> Performance Trend
            </h3>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                    itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skill Radar */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-violet-400" /> Skills Radar
            </h3>
            <p className="text-xs text-neutral-500 mb-4">Competency breakdown based on AI evaluation.</p>
            <div className="flex-1 min-h-[300px] -ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#27272a" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} axisLine={false} />
                  <Radar name="Candidate" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Module Breakdown Cards */}
        <h3 className="text-xl font-bold text-white mt-4 border-b border-white/10 pb-4">Module Breakdown</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {/* ATS Stats */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Resume Scans</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">{modules.ats?.avgScore || 0}%</p>
            <p className="text-sm text-neutral-400">Average ATS Match Score</p>
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-neutral-500">
              Total Scans: <span className="text-neutral-300 font-bold">{modules.ats?.total || 0}</span>
            </div>
          </div>

          {/* Interviews Stats */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                <Award className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Mock Interviews</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">{modules.interviews?.avgScore || 0}/100</p>
            <p className="text-sm text-neutral-400">Average Interview Score</p>
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-neutral-500">
              Sessions Completed: <span className="text-neutral-300 font-bold">{modules.interviews?.total || 0}</span>
            </div>
          </div>

          {/* Coding Stats */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Code className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Coding Challenges</span>
            </div>
            <p className="text-3xl font-extrabold text-white mb-1">{modules.coding?.successRate || 0}%</p>
            <p className="text-sm text-neutral-400">Success Rate</p>
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-neutral-500">
              Avg Code Readability: <span className="text-neutral-300 font-bold">{modules.coding?.avgReadability || 0}/100</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
