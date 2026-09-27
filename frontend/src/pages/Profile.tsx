import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { apiFetch } from '../services/api.js';
import {
  Sparkles,
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Globe,
  Save,
  ArrowLeft,
  Plus,
  X,
  FileText,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ProfileData {
  name: string;
  avatarUrl: string | null;
  college: string | null;
  graduationYear: number | null;
  preferredRole: string | null;
  preferredLanguage: string | null;
  skills: string[];
}

interface ResumeItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isCurrent: boolean;
  createdAt: string;
}

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { user } = useAuth();

  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    avatarUrl: null,
    college: null,
    graduationYear: null,
    preferredRole: null,
    preferredLanguage: null,
    skills: [],
  });
  const [resumes, setResumes] = useState<ResumeItem[]>([]);

  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, resumesRes] = await Promise.all([
          apiFetch('users/profile'),
          apiFetch('users/resumes'),
        ]);

        if (profileRes.profile) {
          setProfile({
            name: profileRes.profile.name || '',
            avatarUrl: profileRes.profile.avatarUrl || null,
            college: profileRes.profile.college || null,
            graduationYear: profileRes.profile.graduationYear || null,
            preferredRole: profileRes.profile.preferredRole || null,
            preferredLanguage: profileRes.profile.preferredLanguage || null,
            skills: profileRes.profile.skills || [],
          });
        }
        setResumes(resumesRes || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const res = await apiFetch('users/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          college: profile.college,
          graduationYear: profile.graduationYear,
          preferredRole: profile.preferredRole,
          preferredLanguage: profile.preferredLanguage,
          skills: profile.skills,
        }),
      });
      if (res.profile) {
        setProfile({
          name: res.profile.name || '',
          avatarUrl: res.profile.avatarUrl || null,
          college: res.profile.college || null,
          graduationYear: res.profile.graduationYear || null,
          preferredRole: res.profile.preferredRole || null,
          preferredLanguage: res.profile.preferredLanguage || null,
          skills: res.profile.skills || [],
        });
      }
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (profile.skills.includes(trimmed)) {
      setNewSkill('');
      return;
    }
    setProfile({ ...profile, skills: [...profile.skills, trimmed] });
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const initials = profile.name
    ? profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-t-2 border-violet-500 animate-spin" />
          <Sparkles className="w-6 h-6 text-violet-400 absolute animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-semibold text-neutral-400 tracking-wider uppercase">Loading Profile...</p>
      </div>
    );
  }

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
          <button onClick={() => onNavigate('resumes')} className="hover:text-white transition-colors">Resumes</button>
          <button className="text-violet-400 font-semibold">Profile</button>
        </nav>

        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-xs font-medium px-3.5 py-2 rounded-lg transition-all text-neutral-300"
          id="btn-profile-back"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Profile Settings</h1>
          <p className="text-sm text-neutral-400 mt-1">Edit your personal information, manage skills, and view your resume uploads.</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
          {/* Avatar Banner */}
          <div className="h-28 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-sky-600/20 relative">
            <div className="absolute -bottom-10 left-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center text-white text-2xl font-extrabold shadow-lg shadow-violet-600/20 border-4 border-[#09090b]">
                {initials}
              </div>
            </div>
          </div>

          <div className="pt-14 pb-8 px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div>
                <h2 className="text-xl font-bold text-white">{profile.name || 'User'}</h2>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> {user?.email}
                </p>
              </div>
              <span className="text-xs bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold px-2.5 py-1 rounded-full self-start sm:self-auto">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-violet-400" /> Personal Details
          </h3>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label htmlFor="profileName" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                id="profileName"
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                placeholder="Jane Doe"
              />
            </div>

            {/* College */}
            <div>
              <label htmlFor="profileCollege" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                <GraduationCap className="w-3.5 h-3.5 inline-block mr-1" /> College / University
              </label>
              <input
                id="profileCollege"
                type="text"
                value={profile.college || ''}
                onChange={(e) => setProfile({ ...profile, college: e.target.value || null })}
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                placeholder="IIT Delhi"
              />
            </div>

            {/* Graduation Year */}
            <div>
              <label htmlFor="profileGradYear" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Graduation Year</label>
              <input
                id="profileGradYear"
                type="number"
                value={profile.graduationYear || ''}
                onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                placeholder="2026"
                min={1900}
                max={2100}
              />
            </div>

            {/* Preferred Role */}
            <div>
              <label htmlFor="profileRole" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                <Briefcase className="w-3.5 h-3.5 inline-block mr-1" /> Target Role
              </label>
              <input
                id="profileRole"
                type="text"
                value={profile.preferredRole || ''}
                onChange={(e) => setProfile({ ...profile, preferredRole: e.target.value || null })}
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                placeholder="Software Engineer"
              />
            </div>

            {/* Preferred Language */}
            <div className="md:col-span-2">
              <label htmlFor="profileLang" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5 inline-block mr-1" /> Preferred Language
              </label>
              <input
                id="profileLang"
                type="text"
                value={profile.preferredLanguage || ''}
                onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value || null })}
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                placeholder="English"
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" /> Technical Skills
          </h3>
          <p className="text-xs text-neutral-400">Add skills that represent your technical capabilities. These are used by AI agents to personalize mock interview questions.</p>

          {/* Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
              placeholder="e.g. React, TypeScript, PostgreSQL"
              id="txt-skill-input"
            />
            <button
              onClick={handleAddSkill}
              className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
              id="btn-add-skill"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {/* Skill Tags */}
          <div className="flex flex-wrap gap-2 min-h-[40px]">
            {profile.skills.length === 0 ? (
              <p className="text-xs text-neutral-500 italic">No skills added yet. Type a skill name and press Enter or click Add.</p>
            ) : (
              profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 px-3 py-1.5 rounded-lg text-xs font-medium group hover:border-rose-500/30 transition-colors"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-violet-400/50 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-violet-600/15 text-sm"
            id="btn-save-profile"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Resume History */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl border border-white/5 space-y-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" /> Resume Upload History
          </h3>

          {resumes.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">No resumes uploaded yet.</p>
              <p className="text-xs text-neutral-600 mt-1">Upload your first resume in the ATS Scanner module to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-emerald-600/10 border border-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <FileText className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-neutral-200">{resume.fileName}</p>
                      <p className="text-xs text-neutral-500">
                        {resume.fileType} • {(resume.fileSize / 1024).toFixed(1)} KB • {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {resume.isCurrent && (
                      <span className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded">Active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-neutral-500 bg-black">
        © 2026 InterviewIQ AI. All rights reserved.
      </footer>
    </div>
  );
}
