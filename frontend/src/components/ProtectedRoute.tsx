import React from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackPageSetter: (page: string) => void;
}

export default function ProtectedRoute({ children, fallbackPageSetter }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      fallbackPageSetter('login');
    }
  }, [isLoading, isAuthenticated, fallbackPageSetter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-t-2 border-violet-500 animate-spin" />
          <Sparkles className="w-6 h-6 text-violet-400 absolute animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-semibold text-neutral-400 tracking-wider uppercase">Evaluating Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will trigger redirect in useEffect
  }

  return <>{children}</>;
}
