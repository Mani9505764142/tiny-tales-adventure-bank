'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, ShieldCheck, Star, ArrowRight, Heart, Zap, CheckCircle2, Play } from 'lucide-react';
import { LivingBackground } from '@/components/LivingBackground';
import { sound } from '@/lib/audio/soundEffects';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { demoLogin, user } = useAuth();

  const handleDemoClick = () => {
    demoLogin();
  };

  return (
    <main className="min-h-screen w-full relative overflow-x-hidden flex flex-col justify-between">
      {/* Living Pastel Sky Background with clouds and balloon */}
      <LivingBackground />

      {/* Top Navbar */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between z-20 relative select-none">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -3 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 via-purple-300 to-amber-300 p-0.5 flex items-center justify-center shadow-md border-2 border-white"
          >
            <span className="text-xl">🪙</span>
          </motion.div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-slate-800 leading-none">
              Tiny Tales
            </span>
            <span className="text-[11px] font-black tracking-wider uppercase text-pink-600 leading-tight">
              Adventure Bank
            </span>
          </div>
        </Link>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => sound.playWoodenPop()}
              className="px-4 py-2 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-emerald-700 shadow-md flex items-center gap-1.5 gloss-highlight cursor-pointer"
            >
              <span>Open Dashboard 🏰</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => sound.playWoodenPop()}
                className="px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-700 font-black text-xs border-b-3 border-slate-300 shadow-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                <span>Log In 🔑</span>
              </Link>

              <Link
                href="/signup"
                onClick={() => sound.playWoodenPop()}
                className="px-4 py-2 rounded-2xl bg-gradient-to-b from-pink-500 to-pink-600 text-white font-black text-xs uppercase tracking-wider border-b-4 border-pink-800 shadow-md flex items-center gap-1.5 gloss-highlight cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                <span>Sign Up Free</span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-4 pt-6 pb-12 z-10 relative flex flex-col items-center text-center">
        {/* Floating Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border-2 border-pink-200 shadow-md mb-5 select-none"
        >
          <span className="text-base">🌈</span>
          <span className="text-xs font-black uppercase tracking-wider text-pink-600">
            For Kids Ages 4 - 13 &amp; Mindful Families
          </span>
          <span className="text-base">✨</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 280, damping: 20 }}
          className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.12] max-w-3xl drop-shadow-xs select-none"
        >
          Turn Daily Chores into{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 drop-shadow-sm">
            Magical Adventures!
          </span>{' '}
          ✨
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg font-bold text-slate-600 mt-4 max-w-2xl leading-relaxed select-none"
        >
          A fun, virtual rewards bank to build lifelong habits for kids. Zero real money, 100% safe. Kids conquer quests, earn shiny coins, and unlock dream rewards with Mom &amp; Dad!
        </motion.p>

        {/* 3D Chunky Tactile CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 mt-8 w-full max-w-md select-none"
        >
          {/* Main CTA: Start Free Adventure */}
          <Link
            href="/signup"
            onClick={() => sound.playWoodenPop()}
            className="flex-1 min-w-[200px]"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96, y: 2 }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-b from-pink-500 via-pink-500 to-pink-600 text-white font-black text-sm uppercase tracking-wider border-b-6 border-pink-800 shadow-xl flex items-center justify-center gap-2 gloss-highlight cursor-pointer"
              style={{
                boxShadow: '0 12px 25px -4px rgba(236, 72, 153, 0.45)',
              }}
            >
              <span>Start Free Adventure 🚀</span>
            </motion.div>
          </Link>

          {/* Secondary CTA: Log In */}
          <Link
            href="/login"
            onClick={() => sound.playWoodenPop()}
            className="min-w-[120px]"
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96, y: 2 }}
              className="py-4 px-6 rounded-2xl bg-white text-purple-700 font-black text-sm uppercase tracking-wider border-b-6 border-purple-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Log In 🔑</span>
            </motion.div>
          </Link>

          {/* Quick Demo Preview Button */}
          <div className="w-full mt-1">
            <motion.button
              onClick={handleDemoClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97, y: 2 }}
              className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-amber-950 font-black text-xs uppercase tracking-wider border-b-4 border-amber-600 shadow-md flex items-center justify-center gap-2 cursor-pointer gloss-highlight"
            >
              <Zap className="w-4 h-4 fill-amber-950 text-amber-950 animate-bounce" />
              <span>⚡ Try Demo Quest Hub (Instant 1-Click Preview)</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Social Proof Mini Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 select-none text-xs font-black text-slate-500">
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Safe • Zero Real Money</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200">
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>Loved by 12,000+ Happy Families</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-full border border-slate-200">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Tactile 3D Mobile-Game Feel</span>
          </div>
        </div>

        {/* Interactive Feature Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-lg mt-10 p-5 rounded-3xl bg-white/90 backdrop-blur-md shadow-2xl border-4 border-white select-none text-left candy-bevel-purple"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full border border-pink-200">
              Interactive Preview
            </span>
            <span className="text-xs font-black text-amber-600">
              Vault: 145 / 300 ⭐
            </span>
          </div>

          {/* Sample Quest Card Preview */}
          <div className="p-3.5 rounded-2xl bg-white border-2 border-pink-200 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-500 flex items-center justify-center text-2xl shadow-sm border border-pink-200">
                🛏️
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-pink-500 tracking-wider">
                  Morning Habit
                </span>
                <h4 className="text-sm font-black text-slate-800 leading-tight">
                  Make the Bed
                </h4>
                <span className="text-xs font-black text-amber-600">
                  +10 Golden Coins 🪙
                </span>
              </div>
            </div>

            <Link href="/dashboard" onClick={() => sound.playWoodenPop()}>
              <div className="px-3.5 py-2 rounded-xl bg-gradient-to-b from-pink-500 to-pink-600 text-white font-black text-xs uppercase tracking-wide border-b-4 border-pink-800 shadow-sm cursor-pointer gloss-highlight">
                I Did It! ✨
              </div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Mini Feature Showcase Grid */}
      <section className="w-full max-w-5xl mx-auto px-4 py-8 z-10 relative select-none">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Feature 1: Fun Quests */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-white/95 border-3 border-pink-100 shadow-lg candy-bevel-pink flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl mb-4 border border-pink-200 shadow-inner">
              🛏️
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">
              Fun Daily Quests
            </h3>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Kids complete real-life habits like tidying toys, reading books, and brushing teeth to earn shiny virtual gold coins.
            </p>
          </motion.div>

          {/* Feature 2: Dream Goal */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-white/95 border-3 border-amber-100 shadow-lg candy-bevel-amber flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-4 border border-amber-200 shadow-inner">
              🏰
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">
              Visual Dream Goal Vault
            </h3>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Children set a dream reward like the &quot;Super Magic Castle&quot; and watch the chunky 3D rainbow progress bar fill up with every completed task!
            </p>
          </motion.div>

          {/* Feature 3: Kid-Safe & Parent Controlled */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-white/95 border-3 border-purple-100 shadow-lg candy-bevel-purple flex flex-col"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-4 border border-purple-200 shadow-inner">
              🔒
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-1">
              Parent Gate Controlled
            </h3>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              100% kid-safe and offline-capable. Grown-ups review and approve tasks through a 4-digit PIN gate before coins are deposited into the wallet.
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
