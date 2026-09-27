import { useState, useEffect } from 'react';
import { apiFetch } from '../services/api.ts';
import Editor from '@monaco-editor/react';
import {
  Sparkles,
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  BrainCircuit,
  AlertCircle,
  X,
  Building2
} from 'lucide-react';

interface CodeEditorProps {
  onNavigate: (page: string, params?: any) => void;
  problemId: string;
}

export default function CodeEditor({ onNavigate, problemId }: CodeEditorProps) {
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState('// Write your solution here\nfunction solution() {\n  \n}\n');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await apiFetch('coding/problems');
        const prob = data.find((p: any) => p.id === problemId);
        if (prob) {
          setProblem(prob);
          // Set starter code if empty
          if (prob.title.toLowerCase().includes('two sum')) {
            setCode('function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\n');
          }
        } else {
          setLoadError('Problem not found');
        }
      } catch (err: any) {
        setLoadError(err.message || 'Failed to fetch problem');
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [problemId]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    setResult(null);
    setShowResults(true);

    try {
      const data = await apiFetch('coding/submit', {
        method: 'POST',
        body: JSON.stringify({ problemId, code, language })
      });
      setResult(data);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (loadError || !problem) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <p className="text-rose-400 mb-4">{loadError || 'Problem not found'}</p>
        <button onClick={() => onNavigate('coding-challenges')} className="text-sky-400 underline">Return to Challenges</button>
      </div>
    );
  }

  const isAccepted = result?.submission?.status === 'ACCEPTED';

  return (
    <div className="h-screen w-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-14 flex-shrink-0 z-40 glass-panel border-b border-white/5 px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('coding-challenges')}
            className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Challenges
          </button>
          <span className="text-neutral-600">|</span>
          <span className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            {problem.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value)}
            className="bg-[#18181b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-sky-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          {result && (
            <button
              onClick={() => setShowResults(!showResults)}
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              {showResults ? 'Hide Results' : 'View Results'}
            </button>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-violet-600 hover:from-sky-500 hover:to-violet-500 text-white text-xs font-bold px-5 py-2 rounded-lg transition-all shadow-lg shadow-sky-600/20 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Evaluating...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Run & Submit
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Pane */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Pane: Problem Description */}
        <div className="w-2/5 border-r border-white/5 bg-[#09090b] overflow-y-auto p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-xl font-extrabold text-white">{problem.title}</h1>
              <span className={`text-xs font-bold px-2.5 py-1 rounded border ${
                problem.difficulty === 'EASY' ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' :
                problem.difficulty === 'MEDIUM' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' :
                'text-rose-400 bg-rose-400/10 border-rose-400/20'
              }`}>
                {problem.difficulty}
              </span>
            </div>

            {problem.companies && problem.companies.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-4">
                <span className="text-[11px] text-neutral-400 font-semibold flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-sky-400" /> Companies:
                </span>
                {problem.companies.map((c: string) => (
                  <span
                    key={c}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-neutral-300 border border-white/10"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div className="text-sm text-neutral-300 leading-relaxed mb-6">
              <p>{problem.description}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Constraints</h4>
                <pre className="text-xs text-amber-300 bg-amber-950/20 p-3 rounded-xl border border-amber-500/20 whitespace-pre-wrap font-mono">
                  {problem.constraints}
                </pre>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Sample Input / Output</h4>
                <div className="bg-[#121217] p-4 rounded-xl border border-white/5 space-y-2 text-xs font-mono text-neutral-300">
                  <p><span className="text-sky-400 font-bold">Input:</span> {problem.sampleInput}</p>
                  <p><span className="text-emerald-400 font-bold">Output:</span> {problem.sampleOutput}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Powered by Gemini 2.5 Flash</span>
            <span className="text-sky-400 font-semibold">Judge0 Sandboxed</span>
          </div>
        </div>

        {/* Right Pane: Editor & Live Results Tray */}
        <div className="w-3/5 flex flex-col min-h-0 h-full overflow-hidden">
          {/* Monaco Editor Container */}
          <div className={`transition-all duration-300 min-h-0 ${showResults ? 'h-1/2' : 'h-full'}`}>
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true
              }}
            />
          </div>

          {/* Results Tray (Bottom 50% when active) */}
          {showResults && (
            <div className="h-1/2 min-h-0 border-t border-sky-500/20 bg-[#0d0d12] flex flex-col overflow-hidden animate-in slide-in-from-bottom-6">
              {/* Results Tray Header */}
              <div className="h-10 px-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                    Execution Results & AI Review
                  </span>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Results Content Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {submitting ? (
                  <div className="flex flex-col items-center justify-center h-full text-neutral-400 gap-4 py-8">
                    <div className="relative">
                      <Loader2 className="w-10 h-10 animate-spin text-sky-400" />
                      <Sparkles className="w-4 h-4 text-violet-400 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-white">Running Test Cases & AI Code Review</p>
                      <p className="text-xs text-neutral-500 mt-1">Analyzing runtime complexity and edge cases with Gemini 2.5 Flash...</p>
                    </div>
                  </div>
                ) : submitError ? (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-xs">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Evaluation Error</p>
                      <p className="text-neutral-300 mt-0.5">{submitError}</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="space-y-6">
                    {/* Execution Outcome Badge */}
                    <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        {isAccepted ? (
                          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-base bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5" /> Accepted
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-base bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                            <XCircle className="w-5 h-5" /> Wrong Answer
                          </div>
                        )}
                      </div>

                      {result.submission && (
                        <div className="flex gap-4 text-xs text-neutral-400 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                          <p>Runtime: <span className="text-sky-400 font-bold">{result.submission.runtime || 24} ms</span></p>
                          <p>Memory: <span className="text-emerald-400 font-bold">{result.submission.memory || 2400} KB</span></p>
                        </div>
                      )}
                    </div>

                    {/* AI Code Review Block */}
                    {result.feedback && (
                      <div className="glass-panel p-5 rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-black/40 p-3.5 rounded-xl border border-white/5">
                            <p className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider mb-1">Complexity Analysis</p>
                            <p className="text-sm font-semibold text-white">{result.feedback.complexityAnalysis}</p>
                          </div>
                          <div className="bg-black/40 p-3.5 rounded-xl border border-white/5">
                            <p className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider mb-1">Readability & Quality</p>
                            <p className="text-sm font-bold text-sky-400">{result.feedback.readabilityScore} / 100</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider mb-1.5">AI Review Summary</p>
                          <p className="text-xs text-neutral-300 leading-relaxed bg-black/30 p-3.5 rounded-xl border border-white/5 whitespace-pre-line">
                            {result.feedback.feedbackText}
                          </p>
                        </div>

                        {result.feedback.edgeCasesMissed?.length > 0 && (
                          <div>
                            <p className="text-[11px] text-neutral-400 uppercase font-bold tracking-wider mb-2">Unchecked Edge Cases</p>
                            <div className="flex gap-2 flex-wrap">
                              {result.feedback.edgeCasesMissed.map((ec: string, i: number) => (
                                <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                  {ec}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
