import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { apiFetch } from '../services/api.ts';
import { 
  Sparkles, 
  TrendingUp, 
  Award, 
  Clock, 
  Activity, 
  LogOut, 
  Play, 
  Upload, 
  Terminal, 
  FileText, 
  BookOpen, 
  MessageSquare,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface DailyGoal {
  id: string;
  text: string;
  completed: boolean;
}

const DEFAULT_GOALS: DailyGoal[] = [
  { id: '1', text: 'Complete 2 DP Coding Submissions', completed: true },
  { id: '2', text: 'Take 1 Voice Mock Round (HR questions)', completed: false },
  { id: '3', text: 'Index resume with 5 missing skills', completed: false }
];

const DEFAULT_PROGRESS = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 70 },
  { name: 'Wed', score: 78 },
  { name: 'Thu', score: 74 },
  { name: 'Fri', score: 82 },
  { name: 'Sat', score: 85 },
  { name: 'Sun', score: 89 },
];

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user, logout } = useAuth();

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Daily Practice Goals state with LocalStorage persistence
  const [goals, setGoals] = useState<DailyGoal[]>(() => {
    const saved = localStorage.getItem('interviewiq_daily_goals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEFAULT_GOALS;
  });

  const [newGoalText, setNewGoalText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Fetch actual user analytics & dashboard data from backend
  useEffect(() => {
    const fetchDashboardAnalytics = async () => {
      try {
        const res = await apiFetch('analytics');
        setDashboardData(res);
      } catch (err) {
        console.warn('Failed to load real dashboard metrics:', err);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchDashboardAnalytics();
  }, []);

  useEffect(() => {
    localStorage.setItem('interviewiq_daily_goals', JSON.stringify(goals));
  }, [goals]);

  const handleLogout = async () => {
    await logout();
    onNavigate('landing');
  };

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const newGoal: DailyGoal = {
      id: Date.now().toString(),
      text: newGoalText.trim(),
      completed: false
    };
    setGoals([...goals, newGoal]);
    setNewGoalText('');
    setIsAdding(false);
  };

  const startEdit = (goal: DailyGoal, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(goal.id);
    setEditText(goal.text);
  };

  const saveEdit = (id: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editText.trim()) return;
    setGoals(goals.map(g => g.id === id ? { ...g, text: editText.trim() } : g));
    setEditingId(null);
  };

  const deleteGoal = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setGoals(goals.filter(g => g.id !== id));
  };

  const completedCount = goals.filter(g => g.completed).length;

  // Real Stats from Database
  const stats = dashboardData?.stats;
  const recentHistory = dashboardData?.recentHistory || [];
  const progressData = dashboardData?.progressData || DEFAULT_PROGRESS;
  const readinessIndex = dashboardData?.readinessScore ?? 0;

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
          <button className="text-violet-400 font-semibold">Dashboard</button>
          <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">Analytics</button>
          <button onClick={() => onNavigate('resumes')} className="hover:text-white transition-colors">Resumes</button>
          <button onClick={() => onNavigate('ats-scanner')} className="hover:text-white transition-colors">ATS Scanner</button>
          <button onClick={() => onNavigate('interview-setup')} className="hover:text-white transition-colors">Mock Interviews</button>
          <button onClick={() => onNavigate('coding-challenges')} className="hover:text-white transition-colors">Coding</button>
          <button onClick={() => onNavigate('learning')} className="hover:text-white transition-colors">Roadmap</button>
          <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">Profile</button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-neutral-400">Logged in as</p>
            <p className="text-sm font-bold text-violet-400">{user?.email}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 border border-white/10 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 text-xs font-medium px-3.5 py-2 rounded-lg transition-all"
            id="btn-dashboard-logout"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Welcome Banner */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-violet-600/5 rounded-full blur-[60px] pointer-events-none" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Welcome back to your Prep Console</h1>
            <p className="text-sm text-neutral-400 mt-1">Check stats, optimize your resume keywords, and launch adaptive AI mock rounds.</p>
          </div>
        </div>

        {/* Real User Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ATS Score Card */}
          <div className="glass-panel p-5 rounded-xl text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">ATS Score</span>
              <FileText className="w-4 h-4 text-violet-400" />
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-white">
              {loadingAnalytics ? <Loader2 className="w-6 h-6 animate-spin text-neutral-500" /> : stats?.atsScore ? `${stats.atsScore}%` : 'N/A'}
            </p>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> {stats?.atsChangeText || 'Upload resume to scan'}
            </span>
          </div>

          {/* Coding Score Card */}
          <div className="glass-panel p-5 rounded-xl text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Coding Score</span>
              <Terminal className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-white">
              {loadingAnalytics ? <Loader2 className="w-6 h-6 animate-spin text-neutral-500" /> : stats?.codingScore ? stats.codingScore : 'N/A'}
            </p>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3 h-3" /> {stats?.codingChangeText || 'Solve coding problems'}
            </span>
          </div>

          {/* Average Interview Card */}
          <div className="glass-panel p-5 rounded-xl text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Average Interview</span>
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-white">
              {loadingAnalytics ? <Loader2 className="w-6 h-6 animate-spin text-neutral-500" /> : stats?.interviewScore ? `${stats.interviewScore}%` : 'N/A'}
            </p>
            <span className="text-xs font-medium text-neutral-400 flex items-center gap-0.5 mt-1">
              {stats?.interviewChangeText || 'Take a mock interview'}
            </span>
          </div>

          {/* Practice Streak Card */}
          <div className="glass-panel p-5 rounded-xl text-left">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Practice Streak</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-white">
              {loadingAnalytics ? <Loader2 className="w-6 h-6 animate-spin text-neutral-500" /> : `${stats?.streakDays || 1} Days`}
            </p>
            <span className="text-xs font-medium text-neutral-400 mt-1 block">
              Level {stats?.candidateLevel || 1} Candidate (XP: {stats?.xpPoints || 0})
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Progress Chart */}
          <div 
            onClick={() => onNavigate('analytics')}
            className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 flex flex-col hover:border-violet-500/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">AI Readiness Trajectory</h3>
                <p className="text-xs text-neutral-400">Weekly evaluation based on real mock interview and assessment scores.</p>
              </div>
              <div className="bg-[#18181b] border border-white/5 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-400">
                Overall Index: {readinessIndex > 0 ? `${readinessIndex}/100` : 'Initializing'}
              </div>
            </div>
            <div className="h-[220px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                    labelStyle={{ color: '#a78bfa', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Operations List */}
          <div className="glass-panel p-6 rounded-2xl text-left space-y-4">
            <h3 className="font-bold text-lg text-white">Quick Operations</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <button 
                onClick={() => onNavigate('interview-setup')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-sm group"
                id="btn-action-mock"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-violet-600/10 border border-violet-500/10 flex items-center justify-center text-violet-400"><Play className="w-4 h-4 fill-violet-400/20" /></span>
                  <span className="font-medium text-neutral-200">Start Mock Interview</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigate('resumes')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all text-sm group"
                id="btn-action-ats"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-sky-600/10 border border-sky-500/10 flex items-center justify-center text-sky-400"><Upload className="w-4 h-4" /></span>
                  <span className="font-medium text-neutral-200">Upload Resume / JD</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigate('coding-challenges')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all text-sm group"
                id="btn-action-coding"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/10 flex items-center justify-center text-emerald-400"><Terminal className="w-4 h-4" /></span>
                  <span className="font-medium text-neutral-200">Coding assessments</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
              </button>

              <button 
                onClick={() => onNavigate('learning')}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all text-sm group"
                id="btn-action-learn"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-amber-600/10 border border-amber-500/10 flex items-center justify-center text-amber-400"><BookOpen className="w-4 h-4" /></span>
                  <span className="font-medium text-neutral-200">Active Learning Roadmap</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Real User Activity & Daily Goals */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* REAL User Assessment History */}
          <div className="glass-panel p-6 rounded-2xl text-left space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" /> Recent Assessment History
            </h3>

            {loadingAnalytics ? (
              <div className="flex justify-center p-6">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
              </div>
            ) : recentHistory.length > 0 ? (
              <div className="space-y-3">
                {recentHistory.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-3">
                    <div>
                      <p className="text-sm font-semibold text-neutral-200">{item.title}</p>
                      <p className="text-xs text-neutral-500">{item.subtitle}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      item.badgeStyle === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      item.badgeStyle === 'violet' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                      item.badgeStyle === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {item.scoreBadge}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-neutral-400">No assessments logged yet for your account.</p>
                <div className="flex justify-center gap-2">
                  <button onClick={() => onNavigate('ats-scanner')} className="text-xs text-sky-400 hover:underline">Scan Resume</button>
                  <span className="text-neutral-600">•</span>
                  <button onClick={() => onNavigate('coding-challenges')} className="text-xs text-emerald-400 hover:underline">Solve Coding Challenge</button>
                  <span className="text-neutral-600">•</span>
                  <button onClick={() => onNavigate('interview-setup')} className="text-xs text-violet-400 hover:underline">Start Mock</button>
                </div>
              </div>
            )}
          </div>

          {/* Interactive & Editable Daily Practice Goals */}
          <div className="glass-panel p-6 rounded-2xl text-left space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" /> Daily Practice Goals
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-neutral-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  {completedCount} / {goals.length} Done
                </span>
                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="text-xs font-bold bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Goal
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-400 to-violet-500 h-full transition-all duration-500"
                style={{ width: `${goals.length > 0 ? (completedCount / goals.length) * 100 : 0}%` }}
              />
            </div>

            {/* Add Goal Input */}
            {isAdding && (
              <form onSubmit={handleAddGoal} className="flex gap-2 animate-in slide-in-from-top-2">
                <input
                  type="text"
                  placeholder="Enter new daily goal..."
                  value={newGoalText}
                  onChange={e => setNewGoalText(e.target.value)}
                  className="flex-1 bg-[#121217] border border-sky-500/30 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                  autoFocus
                />
                <button type="submit" className="bg-sky-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-sky-500">
                  Add
                </button>
                <button type="button" onClick={() => setIsAdding(false)} className="text-neutral-400 hover:text-white px-2 text-xs">
                  Cancel
                </button>
              </form>
            )}

            {/* Goals List */}
            <div className="space-y-2.5">
              {goals.map((g, idx) => {
                const isEditing = editingId === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => !isEditing && toggleGoal(g.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group ${
                      g.completed
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-neutral-900/60 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        g.completed
                          ? 'bg-emerald-500 border-emerald-500 text-black'
                          : 'border-white/20 text-neutral-500 group-hover:border-sky-400'
                      }`}>
                        {g.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>

                      {isEditing ? (
                        <form onSubmit={(e) => saveEdit(g.id, e)} className="flex gap-2 flex-1" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            className="flex-1 bg-black border border-sky-400 rounded px-2 py-0.5 text-xs text-white"
                            autoFocus
                          />
                          <button type="submit" className="text-emerald-400 p-1 hover:text-emerald-300">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => setEditingId(null)} className="text-neutral-400 p-1 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <span className={`text-sm text-neutral-200 truncate ${g.completed ? 'line-through text-neutral-500' : ''}`}>
                          {g.text}
                        </span>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => startEdit(g, e)}
                          className="p-1 text-neutral-400 hover:text-sky-400 transition-colors"
                          title="Edit Goal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => deleteGoal(g.id, e)}
                          className="p-1 text-neutral-400 hover:text-rose-400 transition-colors"
                          title="Delete Goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {goals.length === 0 && (
                <div className="text-center py-6 text-xs text-neutral-500">
                  No practice goals for today. Click "+ Add Goal" above!
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-neutral-500 bg-black">
        © 2026 InterviewIQ AI. All rights reserved. Registered as secure placement pilot program.
      </footer>
    </div>
  );
}
