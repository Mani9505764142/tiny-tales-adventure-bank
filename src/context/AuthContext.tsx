'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { sound } from '@/lib/audio/soundEffects';
import { supabase } from '@/lib/supabaseClient';

export interface User {
  name: string;
  email: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  demoLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = 'tiny_tales_auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Load user from Supabase session or fallback to localStorage on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: sbUser } }) => {
      if (sbUser && sbUser.email) {
        setUser({
          name: sbUser.user_metadata?.name || sbUser.email.split('@')[0] || 'Adventure Family',
          email: sbUser.email,
          createdAt: Date.now(),
        });
      } else {
        try {
          const saved = localStorage.getItem(STORAGE_KEY_AUTH);
          if (saved) {
            setUser(JSON.parse(saved));
          }
        } catch {
          // Ignore
        }
      }
    });

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user && session.user.email) {
        const u: User = {
          name: session.user.user_metadata?.name || session.user.email.split('@')[0] || 'Adventure Family',
          email: session.user.email,
          createdAt: Date.now(),
        };
        setUser(u);
        try {
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(u));
        } catch {}
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEY_AUTH);
          document.cookie = 'tiny_tales_demo_session=; path=/; max-age=0';
        } catch {}
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error || !data.user) {
      sound.playErrorBuzz();
      return false;
    }

    sound.playApprovalDing();
    const newUser: User = {
      name: data.user.user_metadata?.name || email.split('@')[0] || 'Adventure Family',
      email: data.user.email || email,
      createdAt: Date.now(),
    };
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
    } catch {}
    router.push('/dashboard');
    router.refresh();
    return true;
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    sound.playApprovalDing();
    const { data } = await supabase.auth.signUp({
      email: email.trim(),
      password: pass,
      options: {
        data: { name: name.trim() }
      }
    });

    const newUser: User = {
      name: name.trim() || 'Adventure Family',
      email,
      createdAt: Date.now(),
    };
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
    } catch {
      // Ignore
    }
    router.push('/dashboard');
    return true;
  };

  const demoLogin = () => {
    sound.playCoinChime();
    const demoUser: User = {
      name: "Leo & Mia's Family",
      email: "demo@tinytales.kids",
      createdAt: Date.now(),
    };
    setUser(demoUser);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(demoUser));
      document.cookie = 'tiny_tales_demo_session=true; path=/; max-age=86400';
    } catch {
      // Ignore
    }
    router.push('/dashboard');
    router.refresh();
  };

  const logout = async () => {
    sound.playWoodenPop();
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
      document.cookie = 'tiny_tales_demo_session=; path=/; max-age=0';
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    router.push('/login');
    router.refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
