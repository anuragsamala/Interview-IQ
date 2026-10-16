import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Sparkles, Mail, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onNavigate: (page: string) => void;
  emailForVerification?: string;
  setEmailForVerification?: (email: string) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(email, password, name);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button 
          onClick={() => onNavigate('landing')} 
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-6 mx-auto bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
          id="btn-register-back-landing"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
        </button>
        
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center shadow-lg shadow-violet-600/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight font-sans text-white">
          Create an Account
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Join InterviewIQ and start your mock assessment journey
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-xl border border-white/5 relative">
          
          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20 disabled:opacity-50"
              id="btn-register-submit"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')} 
              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
              id="btn-register-to-login"
            >
              Sign In
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
