import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  Sparkles,
  ArrowLeft,
  Code,
  Play,
  Terminal,
  Loader2,
  Search,
  Building2
} from 'lucide-react';

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  companies?: string[];
}

interface CodingChallengesProps {
  onNavigate: (page: string, params?: any) => void;
}

export default function CodingChallenges({ onNavigate }: CodingChallengesProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await apiFetch('coding/problems');
        setProblems(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch problems');
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const getDifficultyColor = (diff: string) => {
    if (diff === 'EASY') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (diff === 'MEDIUM') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  };

  const topCompanies = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Bloomberg', 'Goldman Sachs', 'Uber'];

  const filteredProblems = problems.filter(p => {
    const matchesDiff = filterDifficulty === 'ALL' || p.difficulty === filterDifficulty;
    const matchesCompany = selectedCompany === 'ALL' || (p.companies && p.companies.includes(selectedCompany));
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.companies && p.companies.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesDiff && matchesCompany && matchesSearch;
  });

  const countForDiff = (diff: string) => {
    let list = problems;
    if (selectedCompany !== 'ALL') {
      list = list.filter(p => p.companies && p.companies.includes(selectedCompany));
    }
    if (diff === 'ALL') return list.length;
    return list.filter(p => p.difficulty === diff).length;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans">
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            InterviewIQ <span className="text-sky-400">Coding</span>
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
            <Terminal className="w-8 h-8 text-sky-400" /> Algorithmic Challenges
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Practice essential coding interview problems with real-time complexity analysis and Gemini 2.5 Flash AI code review.
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 bg-[#121217] p-1 rounded-xl border border-white/5 w-full sm:w-auto">
              {['ALL', 'EASY', 'MEDIUM', 'HARD'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    filterDifficulty === diff
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {diff.charAt(0) + diff.slice(1).toLowerCase()}
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-neutral-400 font-mono">
                    {countForDiff(diff)}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, description, company..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#121217] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Company Filter Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1 mr-1">
              <Building2 className="w-3.5 h-3.5 text-sky-400" /> Target Company:
            </span>
            <button
              onClick={() => setSelectedCompany('ALL')}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                selectedCompany === 'ALL'
                  ? 'bg-white/15 text-white border-white/30'
                  : 'bg-[#121217] text-neutral-400 border-white/5 hover:text-white hover:border-white/20'
              }`}
            >
              All Companies
            </button>
            {topCompanies.map(comp => (
              <button
                key={comp}
                onClick={() => setSelectedCompany(comp)}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                  selectedCompany === comp
                    ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-sm'
                    : 'bg-[#121217] text-neutral-400 border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* Problems List */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-sky-400" /> Problem Catalog
            </h3>
            <span className="text-xs text-neutral-500">
              Showing {filteredProblems.length} of {problems.length} challenges
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-3">
              <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
              <p className="text-xs text-neutral-400">Loading problem set...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProblems.map((p, idx) => (
                <div
                  key={p.id}
                  onClick={() => onNavigate('coding-editor', { problemId: p.id })}
                  className="p-4 rounded-xl border border-white/5 bg-[#121217] hover:bg-white/[0.03] hover:border-sky-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono font-bold text-neutral-500 w-6 pt-0.5">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-200 group-hover:text-sky-400 transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5 max-w-xl">
                        {p.description}
                      </p>
                      {/* Company Tags */}
                      {p.companies && p.companies.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          {p.companies.map(c => (
                            <span
                              key={c}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/10 flex items-center gap-1"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getDifficultyColor(p.difficulty)}`}>
                      {p.difficulty}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('coding-editor', { problemId: p.id });
                      }}
                      className="flex items-center gap-1.5 bg-sky-600/20 hover:bg-sky-600 text-sky-400 hover:text-white border border-sky-500/30 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Solve
                    </button>
                  </div>
                </div>
              ))}

              {filteredProblems.length === 0 && (
                <div className="text-center py-12 text-neutral-500 text-xs">
                  No problems match your current search or filter.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
