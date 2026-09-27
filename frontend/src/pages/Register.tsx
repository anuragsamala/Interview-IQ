import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Sparkles, Mail, Lock, User, Key, AlertCircle, ArrowLeft } from 'lucide-react';

interface RegisterProps {
  onNavigate: (page: string) => void;
  emailForVerification?: string;
  setEmailForVerification?: (email: string) => void;
}

export default function Register({ onNavigate, emailForVerification = '', setEmailForVerification }: RegisterProps) {
  const { register, verifyOtp } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // If email was passed in (e.g. from redirect due to unverified user trying to log in), initialize OTP mode
  useEffect(() => {
    if (emailForVerification) {
      setEmail(emailForVerification);
      setOtpSent(true);
    }
  }, [emailForVerification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (!otpSent) {
        // Register Account
        const res = await register(email, password, name);
        if (res?.otpCode) {
          setDevOtp(res.otpCode);
          setOtpCode(res.otpCode);
        }
        setMessage(res.message || 'Verification OTP code sent.');
        if (setEmailForVerification) {
          setEmailForVerification(email);
        }
        setOtpSent(true);
      } else {
        // Verify OTP (Auto log in)
        const currentEmail = emailForVerification || email;
        await verifyOtp(currentEmail, otpCode, 'EMAIL_VERIFICATION');
        if (setEmailForVerification) {
          setEmailForVerification('');
        }
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration process failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <button 
          onClick={() => {
            if (setEmailForVerification) {
              setEmailForVerification('');
            }
            onNavigate('landing');
          }} 
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
          {otpSent ? 'Verify Your Account' : 'Create an Account'}
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          {otpSent ? `Enter the 6-digit OTP code sent to ${emailForVerification || email}` : 'Join InterviewIQ and start mock assessment journeys'}
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

          {devOtp && (
            <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-lg text-xs">
              <p className="font-bold mb-1 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> Dev Mode — Your OTP Code
              </p>
              <p className="text-neutral-400 mb-2">Email sending is in local mode. Use this code to verify:</p>
              <div className="text-center text-2xl font-extrabold tracking-[8px] text-amber-300 bg-black/30 rounded-lg py-2 font-mono">
                {devOtp}
              </div>
              <p className="text-neutral-500 mt-2">The code is also pre-filled in the box below.</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!otpSent ? (
              <>
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Full Name</label>
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
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

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
                      disabled={loading}
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors text-neutral-200"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Password</label>
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
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label htmlFor="otpCode" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Enter Verification Code</label>
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
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              id="btn-register-submit"
            >
              {loading ? 'Processing...' : (otpSent ? 'Verify OTP & Create Account' : 'Sign Up')}
            </button>
          </form>

          {otpSent && (
            <button 
              type="button" 
              onClick={async () => {
                setError(null);
                setLoading(true);
                try {
                  // Trigger OTP re-generation on authService
                  await register(email, password, name);
                  setMessage('OTP code re-sent successfully.');
                } catch (err: any) {
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-4 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors block text-center w-full"
            >
              Resend verification code
            </button>
          )}

          <p className="mt-8 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <button 
              onClick={() => {
                if (setEmailForVerification) {
                  setEmailForVerification('');
                }
                onNavigate('login');
              }} 
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
