'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Scale, 
  CheckCircle2, 
  X, 
  Activity, 
  HeartHandshake,
  Coins,
  FileText
} from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/audio/soundEffects';

type ModalType = 'security' | 'coppa' | null;

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTreasuryModalOpen, setReportModalOpen } = useBank();
  const { user } = useAuth();
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const handleCouncilClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playWoodenPop();
    if (pathname === '/dashboard') {
      setTreasuryModalOpen(true);
    } else {
      router.push(user ? '/dashboard' : '/login');
    }
  };

  const handleReportsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playWoodenPop();
    if (pathname === '/dashboard') {
      setReportModalOpen(true);
    } else {
      router.push(user ? '/dashboard' : '/login');
    }
  };

  const openModal = (type: ModalType) => {
    sound.playWoodenPop();
    setActiveModal(type);
  };

  const closeModal = () => {
    sound.playWoodenPop();
    setActiveModal(null);
  };

  return (
    <>
      <footer className="w-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-300 border-t-4 border-amber-400/40 relative z-20 select-none shadow-2xl">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-pink-400 to-purple-400 opacity-80" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          {/* Main Footer Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mb-10">
            {/* Column 1: Brand & Tagline (5 cols) */}
            <div className="md:col-span-5 flex flex-col items-start text-left">
              <Link 
                href="/" 
                className="flex items-center gap-3 group mb-3 focus:outline-hidden"
                onClick={() => sound.playWoodenPop()}
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotate: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-purple-400 p-0.5 flex items-center justify-center shadow-lg border-2 border-white/80"
                >
                  <span className="text-2xl drop-shadow-xs">🏰</span>
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                    Tiny Tales Adventure Bank
                  </span>
                  <span className="text-[11px] font-black tracking-widest uppercase text-amber-400/90">
                    4-Jar Wealth &amp; Habits Engine
                  </span>
                </div>
              </Link>

              <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-sm mb-4">
                Empowering families to build lifelong financial wisdom through gamified saving, investing, and moral growth.
              </p>

              {/* Trust Micro-Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-bold text-amber-300 shadow-xs">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Zero Real Money
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-[11px] font-bold text-emerald-300 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Parent-Gated
                </span>
              </div>
            </div>

            {/* Column 2: Quick Links (4 cols) */}
            <div className="md:col-span-4 flex flex-col text-left">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Quick Navigation &amp; Features
              </h4>
              <ul className="space-y-2.5 text-sm font-bold">
                <li>
                  <button
                    onClick={handleCouncilClick}
                    className="flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors text-left group cursor-pointer focus:outline-hidden"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">🏛️</span>
                    <span>Treasury Council</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      4-Jar
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleReportsClick}
                    className="flex items-center gap-2 text-slate-300 hover:text-purple-300 transition-colors text-left group cursor-pointer focus:outline-hidden"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">📜</span>
                    <span>Moral Report Card</span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-400/10 text-purple-300 border border-purple-400/20">
                      Analytics
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('security')}
                    className="flex items-center gap-2 text-slate-300 hover:text-emerald-300 transition-colors text-left group cursor-pointer focus:outline-hidden"
                  >
                    <Lock className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Family Safe &amp; Encrypted</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal('coppa')}
                    className="flex items-center gap-2 text-slate-300 hover:text-sky-300 transition-colors text-left group cursor-pointer focus:outline-hidden"
                  >
                    <FileText className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <span>COPPA Compliant &amp; Privacy First</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Live System Architecture Indicator (3 cols) */}
            <div className="md:col-span-3 flex flex-col text-left">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Engine Status
              </h4>

              <div className="p-4 rounded-2xl bg-slate-800/90 border-2 border-slate-700/80 shadow-md flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-black text-white">
                    Live System Active
                  </span>
                </div>

                <p className="text-xs font-bold text-amber-300 leading-snug">
                  ⚡ 24/7 Automated Yield Compounding Engine Active
                </p>

                <div className="mt-1 pt-2 border-t border-slate-700/60 flex flex-col gap-1 text-[11px] font-semibold text-slate-400">
                  <div className="flex justify-between">
                    <span>Compounding:</span>
                    <span className="text-slate-200">Daily 00:00 UTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Layer:</span>
                    <span className="text-emerald-400">Edge Middleware</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <span className="text-sky-400">Atomic Postgres RPC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Declarations */}
          <div className="pt-8 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs font-medium text-slate-400">
            <p>
              © 2026 Tiny Tales Bank Inc. All rights reserved. Crafted for resilient family wealth.
            </p>
            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-3.5 h-3.5 text-pink-400" />
                Designed for Happy Families
              </span>
              <span>•</span>
              <span className="text-amber-400/90 font-bold">100% Safe Virtual Economy</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Security & COPPA Informational Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border-4 border-slate-100 text-left relative candy-bevel-purple select-none overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {activeModal === 'security' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-200">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        Family Safe &amp; Encrypted
                      </h3>
                      <p className="text-xs font-bold text-emerald-600">
                        Enterprise-Grade Edge &amp; Postgres Protection
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-medium text-slate-600 leading-relaxed">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Zero Real-Money Risk:</strong>
                        <p>All coins, jars, and goals are strictly gamified virtual tokens. No real monetary transactions ever occur.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Encrypted Parent PIN Gate:</strong>
                        <p>Parent approvals, goal adjustments, and treasury reallocations require a secure parent PIN.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Row-Level Security (RLS):</strong>
                        <p>All database queries run through Supabase Row-Level Security and atomic Postgres RPC transactions.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      Understood &amp; Protected 👍
                    </button>
                  </div>
                </div>
              )}

              {activeModal === 'coppa' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner border border-sky-200">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        COPPA Compliant &amp; Privacy First
                      </h3>
                      <p className="text-xs font-bold text-sky-600">
                        Child Online Privacy Protection Act Standards
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs font-medium text-slate-600 leading-relaxed">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">No Behavioral Profiling:</strong>
                        <p>We do not track children across websites or create advertising profiles. Kids enjoy a clean, ad-free environment.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">No Third-Party Ad Networks:</strong>
                        <p>Zero pop-up advertisements, trackers, or commercial monetization algorithms targeting kids.</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-800">Parental Control &amp; Deletion:</strong>
                        <p>Parents retain full sovereignty over their family profile and may reset, modify, or delete data anytime.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={closeModal}
                      className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-black text-xs uppercase tracking-wider hover:bg-sky-700 transition-colors cursor-pointer"
                    >
                      Family Privacy Assured ✨
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
