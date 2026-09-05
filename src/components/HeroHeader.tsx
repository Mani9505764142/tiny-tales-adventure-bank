'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Volume2, VolumeX, Sparkles, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { useBank } from '@/context/BankContext';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/audio/soundEffects';

export const HeroHeader: React.FC = () => {
  const {
    coins,
    isCoinWiggling,
    recentCoinDelta,
    setParentModalOpen,
    isMuted,
    toggleMute,
    walletTargetRef
  } = useBank();

  const { user, logout } = useAuth();

  const handleOpenParentMode = () => {
    sound.playPinClick(1);
    setParentModalOpen(true);
  };

  const handleSoundToggle = () => {
    toggleMute();
  };

  return (
    <header className="w-full pt-3 pb-2 px-3.5 flex items-center justify-between z-20 select-none bg-white/70 backdrop-blur-sm border-b border-pink-100 shadow-xs">
      {/* Brand Mini Ribbon / Home Link */}
      <div className="flex items-center gap-1.5">
        <Link href="/" onClick={() => sound.playWoodenPop()}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-white shadow-xs border border-pink-200 cursor-pointer"
          >
            <span className="text-lg">✨</span>
            <div className="flex flex-col">
              <span className="text-[11px] font-black uppercase tracking-wider text-pink-600 leading-none">
                Tiny Tales
              </span>
              <span className="text-[9px] font-bold text-slate-500 leading-none">
                Adventure Bank
              </span>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Center/Right Action Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Floating 3D Golden Coin Pill (Interactive Wallet Target) */}
        <div ref={walletTargetRef} className="relative">
          <motion.div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-b-4 border-amber-700 shadow-md text-white font-black cursor-default select-none"
            style={{
              boxShadow: '0 6px 16px -3px rgba(245, 158, 11, 0.45)',
            }}
            animate={
              isCoinWiggling
                ? {
                    scale: [1, 1.25, 0.96, 1.12, 1],
                    rotate: [0, -6, 6, -3, 0],
                    backgroundColor: ['#F59E0B', '#FDE047', '#F59E0B'],
                  }
                : {}
            }
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {/* Breathing 3D Golden Cartoon Coin */}
            <motion.div
              className="relative w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-500 via-yellow-300 to-amber-200 border-2 border-yellow-100 flex items-center justify-center shadow-xs overflow-hidden"
              animate={{
                scale: [1, 1.09, 1],
                rotate: [0, 4, -4, 0],
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span className="text-xs font-black text-amber-900 drop-shadow-sm select-none">
                🪙
              </span>
            </motion.div>

            {/* Dynamic Coin Counter */}
            <div className="flex items-baseline gap-1">
              <motion.span
                key={coins}
                initial={{ y: -6, opacity: 0.7 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-base tracking-tight font-black drop-shadow ${
                  isCoinWiggling ? 'text-yellow-100 scale-110' : 'text-white'
                }`}
              >
                {coins}
              </motion.span>
              <span className="text-[10px] font-extrabold uppercase text-amber-950/80">
                coins
              </span>
            </div>

            {/* Floating Delta Indicator (+10, +20) */}
            <AnimatePresence>
              {isCoinWiggling && recentCoinDelta > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.5 }}
                  animate={{ opacity: 1, y: -26, scale: 1.2 }}
                  exit={{ opacity: 0, y: -38, scale: 0.8 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black text-[11px] px-2 py-0.5 rounded-full border-2 border-white shadow-md flex items-center gap-0.5 pointer-events-none"
                >
                  <Sparkles className="w-3 h-3 text-yellow-200 animate-spin" />
                  +{recentCoinDelta}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sound Toggle Button */}
        <motion.button
          onClick={handleSoundToggle}
          title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92, y: 1 }}
          className={`p-1.5 rounded-xl border-b-3 flex items-center justify-center transition-all ${
            isMuted
              ? 'bg-slate-200 text-slate-500 border-slate-400'
              : 'bg-gradient-to-b from-sky-400 to-sky-500 text-white border-sky-700 shadow-xs'
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </motion.button>

        {/* "Parent Mode" Lock Pill */}
        <motion.button
          onClick={handleOpenParentMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94, y: 2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-b from-purple-500 to-purple-600 text-white border-b-4 border-purple-800 shadow-md text-[11px] font-black cursor-pointer gloss-highlight"
          title="Parent Gate (PIN: 1234)"
        >
          <Lock className="w-3 h-3 text-purple-100" />
          <span>Parents</span>
        </motion.button>

        {/* Logout / Exit Button if user logged in */}
        {user && (
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92, y: 1 }}
            title="Log Out"
            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 border-b-3 border-rose-300 shadow-xs cursor-pointer flex items-center justify-center"
          >
            <LogOut className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>
    </header>
  );
};
