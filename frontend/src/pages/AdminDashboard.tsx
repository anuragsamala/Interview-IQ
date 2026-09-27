import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';
import {
  ArrowLeft,
  Users,
  FileText,
  Award,
  Code,
  Shield,
  Loader2,
  UserPlus,
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await apiFetch('admin/overview');
        setData(res);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <p className="text-rose-400 mb-4">{error || 'Failed to load admin data'}</p>
        <button onClick={() => onNavigate('dashboard')} className="text-sky-400 underline">Return to Dashboard</button>
      </div>
    );
  }

  const { stats, topUsers } = data;

  const barData = [
    { name: 'Users', value: stats.totalUsers, color: '#8b5cf6' },
    { name: 'Resumes', value: stats.totalResumes, color: '#38bdf8' },
    { name: 'ATS Scans', value: stats.totalAtsReports, color: '#34d399' },
    { name: 'Interviews', value: stats.totalInterviews, color: '#fbbf24' },
    { name: 'Submissions', value: stats.totalCodingSubmissions, color: '#f87171' },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-amber-400 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            InterviewIQ <span className="text-rose-400">Admin</span>
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
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-white flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-rose-400" /> Admin Control Panel
          </h1>
          <p className="text-sm text-neutral-400">Platform-wide statistics and user management overview.</p>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
            <Users className="w-6 h-6 text-violet-400 mb-2" />
            <p className="text-2xl font-extrabold text-white">{stats.totalUsers}</p>
            <p className="text-xs text-neutral-500 mt-1">Total Users</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
            <UserPlus className="w-6 h-6 text-sky-400 mb-2" />
            <p className="text-2xl font-extrabold text-white">{stats.recentSignups}</p>
            <p className="text-xs text-neutral-500 mt-1">New (7 Days)</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
            <FileText className="w-6 h-6 text-emerald-400 mb-2" />
            <p className="text-2xl font-extrabold text-white">{stats.totalAtsReports}</p>
            <p className="text-xs text-neutral-500 mt-1">ATS Scans</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
            <Award className="w-6 h-6 text-amber-400 mb-2" />
            <p className="text-2xl font-extrabold text-white">{stats.completedInterviews}</p>
            <p className="text-xs text-neutral-500 mt-1">Interviews Done</p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col items-center text-center">
            <Code className="w-6 h-6 text-rose-400 mb-2" />
            <p className="text-2xl font-extrabold text-white">{stats.acceptedSubmissions}</p>
            <p className="text-xs text-neutral-500 mt-1">Accepted Code</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Bar Chart */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-400" /> Platform Activity
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa', borderRadius: '8px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Users Table */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-400" /> Top Users
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-500 text-xs uppercase">
                    <th className="text-left py-2 font-bold">User</th>
                    <th className="text-center py-2 font-bold">Role</th>
                    <th className="text-center py-2 font-bold">Interviews</th>
                    <th className="text-center py-2 font-bold">Code</th>
                  </tr>
                </thead>
                <tbody>
                  {topUsers.map((u: any) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 text-neutral-200 font-medium">{u.name}</td>
                      <td className="py-3 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                          u.role === 'ADMIN'
                            ? 'text-rose-400 bg-rose-400/10 border-rose-400/20'
                            : 'text-sky-400 bg-sky-400/10 border-sky-400/20'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 text-center text-neutral-300 font-bold">{u.interviews}</td>
                      <td className="py-3 text-center text-neutral-300 font-bold">{u.submissions}</td>
                    </tr>
                  ))}
                  {topUsers.length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-neutral-500">No users yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Extra Stats Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <p className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-2">Avg Interview Score</p>
            <p className="text-3xl font-extrabold text-violet-400">{stats.avgInterviewScore}/100</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <p className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-2">Total Resumes Uploaded</p>
            <p className="text-3xl font-extrabold text-sky-400">{stats.totalResumes}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-white/5 text-center">
            <p className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-2">Total Coding Submissions</p>
            <p className="text-3xl font-extrabold text-amber-400">{stats.totalCodingSubmissions}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
