import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch, setAccessToken } from '../services/api.js';

interface User {
  id: string;
  email: string;
  role: 'GUEST' | 'USER' | 'ADMIN';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, code?: string) => Promise<any>;
  register: (email: string, passwordPlain: string, name: string) => Promise<any>;
  verifyOtp: (email: string, code: string, purpose: 'EMAIL_VERIFICATION' | 'LOGIN' | 'PASSWORD_RESET') => Promise<any>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<any>;
  resetPassword: (email: string, code: string, newPasswordPlain: string) => Promise<any>;
  loginWithOAuth: (email: string, name: string, provider: 'GOOGLE' | 'GITHUB', providerUserId: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogoutLocal = () => {
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    // 1. Silent token refresh on app mount
    const checkSession = async () => {
      try {
        const data = await apiFetch('auth/refresh', { method: 'POST', skipAuth: true });
        setUser(data.user);
        setAccessToken(data.accessToken);
      } catch (err) {
        // Safe to ignore on mount, user simply is not logged in
        handleLogoutLocal();
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // 2. Listen for global unauthorized events
    const handleUnauthorized = () => {
      handleLogoutLocal();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email: string, password?: string, code?: string) => {
    setIsLoading(true);
    try {
      const data = await apiFetch('auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, code }),
        skipAuth: true,
      });

      // If it returned session info, store tokens
      if (data.accessToken) {
        setUser(data.user);
        setAccessToken(data.accessToken);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, passwordPlain: string, name: string) => {
    setIsLoading(true);
    try {
      return await apiFetch('auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password: passwordPlain, name }),
        skipAuth: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (email: string, code: string, purpose: 'EMAIL_VERIFICATION' | 'LOGIN' | 'PASSWORD_RESET') => {
    setIsLoading(true);
    try {
      const endpoint = purpose === 'EMAIL_VERIFICATION' ? 'auth/verify-email' : 'auth/login';
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, code, purpose }),
        skipAuth: true,
      });

      if (data.accessToken) {
        setUser(data.user);
        setAccessToken(data.accessToken);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiFetch('auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Backend logout failed or session already dead');
    } finally {
      handleLogoutLocal();
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    return apiFetch('auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      skipAuth: true,
    });
  };

  const resetPassword = async (email: string, code: string, newPasswordPlain: string) => {
    return apiFetch('auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword: newPasswordPlain }),
      skipAuth: true,
    });
  };

  const loginWithOAuth = async (email: string, name: string, provider: 'GOOGLE' | 'GITHUB', providerUserId: string) => {
    setIsLoading(true);
    try {
      const data = await apiFetch('auth/oauth', {
        method: 'POST',
        body: JSON.stringify({ email, name, provider, providerUserId }),
        skipAuth: true,
      });
      if (data.accessToken) {
        setUser(data.user);
        setAccessToken(data.accessToken);
      }
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    verifyOtp,
    logout,
    forgotPassword,
    resetPassword,
    loginWithOAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
