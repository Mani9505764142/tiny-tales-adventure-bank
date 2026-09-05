'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Mail, User as UserIcon, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LivingBackground } from '@/components/LivingBackground';
import { sound } from '@/lib/audio/soundEffects';

export default function SignupPage() {
  const { signup, demoLogin } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      sound.playErrorBuzz();
      setError('Please enter your family or parent name!');
      return;
    }
    if (!email || !email.includes('@')) {
      sound.playErrorBuzz();
      setError('Please enter a valid email address!');
      return;
    }
    if (!password || password.length < 4) {
      sound.playErrorBuzz();
      setError('Password should be at least 4 characters long.');
      return;
    }

    setIsLoading(true);
    await signup(name, email, password);
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
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-pink-200 relative z-10 candy-bevel-pink"
      >
        {/* Header Icon & Brand */}
        <div className="flex flex-col items-center text-center mb-5">
          <Link href="/" onClick={() => sound.playWoodenPop()}>
            <motion.div
              whileHover={{ scale: 1.08, rotate: 4 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-400 via-rose-300 to-amber-300 p-1 flex items-center justify-center shadow-lg border-2 border-white mb-3 cursor-pointer"
            >
              <div className="w-full h-full rounded-[20px] bg-white flex items-center justify-center text-3xl">
                🏰
              </div>
            </motion.div>
          </Link>

          <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 mb-1.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-500" /> 100% Free & Kid-Safe
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Create Family Bank
          </h1>
          <p className="text-xs font-bold text-slate-500 mt-0.5">
            Start motivating your kids with magical daily adventures!
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
            <span className="text-[11px] font-black uppercase text-slate-400">or sign up</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
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
              Family or Parent Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="The Wonder Family (or Mom Sarah)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-pink-500 font-bold text-xs outline-none transition-colors bg-slate-50 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@wonderfamily.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-pink-500 font-bold text-xs outline-none transition-colors bg-slate-50 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-700 block mb-1">
              Create Password
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
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-pink-500 font-bold text-xs outline-none transition-colors bg-slate-50 focus:bg-white"
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
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-b from-pink-500 to-pink-600 text-white font-black text-xs uppercase tracking-wider border-b-6 border-pink-800 shadow-lg flex items-center justify-center gap-2 cursor-pointer gloss-highlight"
            style={{
              boxShadow: '0 10px 20px -5px rgba(236, 72, 153, 0.45)',
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>{isLoading ? 'Creating Vault...' : 'Create Family Bank 🏰'}</span>
          </motion.button>
        </form>

        {/* Footer Link to Login */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-xs font-bold text-slate-500">
            Already have a family bank?{' '}
            <Link
              href="/login"
              onClick={() => sound.playWoodenPop()}
              className="text-purple-600 hover:text-purple-700 font-black underline underline-offset-2"
            >
              Log In
            </Link>
          </p>

          <Link
            href="/"
            onClick={() => sound.playWoodenPop()}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 mt-0.5"
          >
            <span>← Back to Home</span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
