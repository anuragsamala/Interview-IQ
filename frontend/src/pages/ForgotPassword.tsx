import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Sparkles, Mail, Lock, Key, AlertCircle, ArrowLeft } from 'lucide-react';

interface ForgotPasswordProps {
  onNavigate: (page: string) => void;
}

export default function ForgotPassword({ onNavigate }: ForgotPasswordProps) {
  const { forgotPassword, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
      if (!otpSent) {
        // Request OTP code
        await forgotPassword(email);
        setMessage('If the email matches an active account, a password reset OTP code has been dispatched.');
        setOtpSent(true);
      } else {
        // Perform password reset using OTP
        await resetPassword(email, code, newPassword);
        setMessage('Password has been successfully updated.');
        setTimeout(() => {
          onNavigate('login');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Verification process failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button 
          onClick={() => onNavigate('login')} 
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors mb-6 mx-auto bg-white/5 px-3 py-1.5 rounded-full border border-white/5"
          id="btn-forgot-back-login"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>
        
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-sky-400 flex items-center justify-center shadow-lg shadow-violet-600/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight font-sans text-white">Reset Your Password</h2>
        <p className="mt-2 text-sm text-neutral-400">
          {otpSent ? 'Enter the reset code and choose a new password' : 'We will dispatch an OTP to verify your request'}
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

            {otpSent && (
              <>
                <div>
                  <label htmlFor="code" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">OTP Reset Code</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                      <Key className="w-4 h-4" />
                    </div>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      maxLength={6}
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-violet-500 tracking-[4px] font-mono text-center text-neutral-200"
                      placeholder="000000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              id="btn-forgot-submit"
            >
              {loading ? 'Processing...' : (otpSent ? 'Update Password' : 'Send Recovery OTP')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
