import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Sparkles, Mail, Lock, Key, Github, Chrome, AlertCircle, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
  setEmailForVerification?: (email: string) => void;
}

export default function Login({ onNavigate, setEmailForVerification }: LoginProps) {
  const { login, loginWithOAuth } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (useOtp) {
        if (!otpSent) {
          // Trigger OTP code dispatch
          const res = await login(email);
          setMessage(res.message || 'OTP sent successfully!');
          setOtpSent(true);
        } else {
          // Verify login OTP code
          await login(email, undefined, otpCode);
          onNavigate('dashboard');
        }
      } else {
        // Password Login
        await login(email, password);
        onNavigate('dashboard');
      }
    } catch (err: any) {
      if (err.message?.includes('verification required')) {
        // Redirect to OTP verification inside registration
        if (setEmailForVerification) {
          setEmailForVerification(email);
        }
        onNavigate('register');
      } else {
        setError(err.message || 'Authentication process failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'GOOGLE' | 'GITHUB') => {
    setError(null);
    setLoading(true);
    try {
      // Mock OAuth account payload for demo
      const providerUserId = Math.floor(100000 + Math.random() * 900000).toString();
      const mockEmail = `oauth.${provider.toLowerCase()}.${providerUserId}@example.com`;
      const mockName = `${provider === 'GOOGLE' ? 'Google' : 'GitHub'} User ${providerUserId}`;
      
      await loginWithOAuth(mockEmail, mockName, provider, providerUserId);
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || `${provider} OAuth sign-in failed`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button 
          onClick={() => onNavigate('landing')} 
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-6 mx-auto bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
          id="btn-login-back-landing"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
        </button>
        
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center shadow-lg shadow-violet-600/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight font-sans text-white">Sign In to InterviewIQ</h2>
        <p className="mt-2 text-sm text-neutral-400">Welcome back! Access your personalized prep console</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-2xl shadow-xl border border-white/5 relative">
          
          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading || otpSent}
                  className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {useOtp ? (
              otpSent && (
                <div>
                  <label htmlFor="otpCode" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">OTP Verification Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      id="otpCode"
                      name="otpCode"
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-violet-500 tracking-[4px] font-mono text-center text-neutral-200"
                      placeholder="000000"
                    />
                  </div>
                </div>
              )
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Password</label>
                  <button 
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
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
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              id="btn-login-submit"
            >
              {loading ? 'Processing...' : (useOtp ? (otpSent ? 'Verify & Sign In' : 'Send OTP Code') : 'Sign In')}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
            <button 
              type="button" 
              onClick={() => {
                setUseOtp(!useOtp);
                setOtpSent(false);
                setOtpCode('');
                setError(null);
                setMessage(null);
              }}
              className="text-violet-400 hover:text-violet-300 font-medium"
            >
              {useOtp ? 'Use standard password' : 'Sign in using email OTP'}
            </button>

            {otpSent && (
              <button 
                type="button" 
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    await login(email);
                    setMessage('OTP code re-sent successfully.');
                  } catch (err: any) {
                    setError(err.message);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="text-violet-400 hover:text-violet-300 font-medium"
              >
                Resend Code
              </button>
            )}
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-[#0d0d11] text-neutral-500">Or continue with</span></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOAuth('GOOGLE')}
              className="w-full inline-flex justify-center py-2.5 border border-white/10 rounded-lg bg-[#18181b] hover:bg-white/5 text-sm font-medium text-neutral-300 transition-colors gap-2 items-center"
              id="btn-oauth-google"
            >
              <Chrome className="w-4 h-4 text-rose-500" /> Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuth('GITHUB')}
              className="w-full inline-flex justify-center py-2.5 border border-white/10 rounded-lg bg-[#18181b] hover:bg-white/5 text-sm font-medium text-neutral-300 transition-colors gap-2 items-center"
              id="btn-oauth-github"
            >
              <Github className="w-4 h-4" /> GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-neutral-500">
            Don't have an account?{' '}
            <button 
              onClick={() => onNavigate('register')} 
              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
              id="btn-login-to-register"
            >
              Sign Up
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
