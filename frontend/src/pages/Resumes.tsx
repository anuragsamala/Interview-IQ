import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../services/api.ts';
import {
  Sparkles,
  ArrowLeft,
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react';

interface ResumeItem {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isCurrent: boolean;
  createdAt: string;
}

interface ResumesProps {
  onNavigate: (page: string) => void;
}

export default function Resumes({ onNavigate }: ResumesProps) {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResumes = async () => {
    try {
      const data = await apiFetch('resumes');
      setResumes(data);
    } catch (err: any) {
      setError('Failed to fetch resumes: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported at this time.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      await apiFetch('resumes/upload', {
        method: 'POST',
        body: formData,
      });

      await fetchResumes(); // Refresh the list to reflect new isCurrent state
    } catch (err: any) {
      setError('Failed to upload resume: ' + (err.message || 'Upload failed'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    
    try {
      await apiFetch(`resumes/${id}`, { method: 'DELETE' });
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err: any) {
      setError('Failed to delete resume: ' + err.message);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const getBackendUrl = (url: string) => {
    return url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-full border-t-2 border-emerald-500 animate-spin" />
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
          <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">Analytics</button>
          <button className="text-emerald-400 font-semibold">Resumes</button>
          <button onClick={() => onNavigate('ats-scanner')} className="hover:text-white transition-colors">ATS Scanner</button>
          <button onClick={() => onNavigate('interview-setup')} className="hover:text-white transition-colors">Mock Interviews</button>
          <button onClick={() => onNavigate('coding-challenges')} className="hover:text-white transition-colors">Coding</button>
          <button onClick={() => onNavigate('learning')} className="hover:text-white transition-colors">Roadmap</button>
          <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">Profile</button>
        </nav>

        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-1.5 border border-white/10 hover:bg-white/5 text-xs font-medium px-3.5 py-2 rounded-lg transition-all text-neutral-300"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Resume Management</h1>
          <p className="text-sm text-neutral-400 mt-1">Upload your resumes for ATS analysis and AI-driven mock interviews.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Upload Zone */}
        <div 
          className={`glass-panel border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all ${
            dragActive ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-emerald-500/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files && handleUpload(e.target.files[0])} 
            accept="application/pdf"
            className="hidden" 
          />
          
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-emerald-400" />
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            {uploading ? 'Uploading & Parsing...' : 'Drag & Drop your resume here'}
          </h3>
          <p className="text-sm text-neutral-400 mb-6 max-w-md">
            Upload your latest resume in PDF format. We'll automatically parse it and set it as your active profile for the ATS Scanner. Max size: 5MB.
          </p>
          <button 
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Processing...' : 'Browse Files'}
          </button>
        </div>

        {/* Resumes List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Upload History</h3>
          
          {resumes.length === 0 ? (
            <div className="text-center py-10 glass-panel border border-white/5 rounded-2xl">
              <FileText className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm text-neutral-500">No resumes uploaded yet.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {resumes.map((resume) => (
                <div key={resume.id} className={`glass-panel p-4 rounded-xl border flex items-center justify-between transition-all ${
                  resume.isCurrent ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/5 hover:border-white/10'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      resume.isCurrent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-neutral-400'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{resume.fileName}</p>
                        {resume.isCurrent && (
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-1">
                        {(resume.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href={getBackendUrl(resume.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Download/Preview"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
