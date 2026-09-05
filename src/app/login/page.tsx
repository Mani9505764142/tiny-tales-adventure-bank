'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Sparkles, ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LivingBackground } from '@/components/LivingBackground';
import { sound } from '@/lib/audio/soundEffects';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const { demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      sound.playErrorBuzz();
      setError('Please enter a valid family email address!');
      return;
    }
    if (!password || password.length < 4) {
      sound.playErrorBuzz();
      setError('Password should be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (signInError) {
        sound.playErrorBuzz();
        const msg = signInError.message.toLowerCase();
        if (msg.includes('not confirmed') || msg.includes('verif')) {
          setError('Email not verified. Please check your inbox and verify your email before logging in!');
        } else if (msg.includes('invalid login credentials')) {
          setError('Invalid family email or password. Please verify your credentials and try again.');
        } else {
          setError(signInError.message || 'Login failed. Please check your details and try again.');
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        sound.playApprovalDing();
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      sound.playErrorBuzz();
      setError(err?.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    demoLogin();
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <LivingBackground />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-purple-200 relative z-10 candy-bevel-purple"
      >
        {/* Header Icon & Brand */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" onClick={() => sound.playWoodenPop()}>
            <motion.div
              whileHover={{ scale: 1.08, rotate: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-300 via-pink-400 to-purple-500 p-1 flex items-center justify-center shadow-lg border-2 border-white mb-3 cursor-pointer"
            >
              <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center text-3xl">
                🪙
              </div>
            </motion.div>
          </Link>

          <span className="text-[11px] font-black uppercase tracking-wider text-pink-500 bg-pink-50 px-3 py-1 rounded-full border border-pink-200 mb-1.5">
            Welcome Back, Adventurers!
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Log In to Family Bank
          </h1>
          <p className="text-xs font-bold text-slate-500 mt-0.5">
            Continue tracking chores and unlocking magical rewards!
          </p>
        </div>

        {/* Quick Instant Demo Login Button */}
        <div className="mb-5">
          <motion.button
            type="button"
            onClick={handleDemoLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97, y: 2 }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-xs uppercase tracking-wider border-b-4 border-amber-600 shadow-md flex items-center justify-center gap-2 cursor-pointer gloss-highlight"
          >
            <Zap className="w-4 h-4 fill-amber-950 text-amber-950 animate-pulse" />
            <span>⚡ Instant Demo Login (1-Click Preview)</span>
          </motion.button>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-black uppercase text-slate-400">or use email</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-black flex items-center gap-2"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </motion.div>
          )}

          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              Family Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parents@wonderfamily.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 font-bold text-xs outline-none transition-colors bg-slate-50 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              Secret Family Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-purple-500 font-bold text-xs outline-none transition-colors bg-slate-50 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* 3D Squashable Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97, y: 2 }}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-b from-purple-600 to-purple-700 text-white font-black text-xs uppercase tracking-wider border-b-6 border-purple-900 shadow-lg flex items-center justify-center gap-2 cursor-pointer gloss-highlight"
            style={{
              boxShadow: '0 10px 20px -5px rgba(139, 92, 246, 0.45)',
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>{isLoading ? 'Opening Vault...' : 'Log In to Adventure 🚀'}</span>
          </motion.button>
        </form>

        {/* Footer Link to Signup */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-slate-500">
            Don&apos;t have a family bank yet?{' '}
            <Link
              href="/signup"
              onClick={() => sound.playWoodenPop()}
              className="text-pink-600 hover:text-pink-700 font-black underline underline-offset-2"
            >
              Start Free Adventure
            </Link>
          </p>

          <Link
            href="/"
            onClick={() => sound.playWoodenPop()}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-1"
          >
            <span>← Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
