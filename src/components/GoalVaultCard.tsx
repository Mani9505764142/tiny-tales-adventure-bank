'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, PartyPopper } from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { sound } from '@/lib/audio/soundEffects';

export const GoalVaultCard: React.FC = () => {
  const { coins, goal, isGoalAchieved, triggerConfettiBlast } = useBank();

  const progressPercent = Math.min(100, Math.round((coins / goal.targetCoins) * 100));
  const remainingCoins = Math.max(0, goal.targetCoins - coins);

  const handleCelebrateClick = () => {
    sound.playCelebrationFanfare();
    triggerConfettiBlast();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      className="w-full px-4 my-2 z-10 select-none"
    >
      <div 
        className={`candy-card p-4 relative overflow-hidden transition-all duration-300 ${
          isGoalAchieved
            ? 'border-4 border-yellow-300 shadow-[0_15px_30px_-5px_rgba(245,158,11,0.35)] bg-gradient-to-b from-amber-50/90 via-white to-amber-100/60'
            : 'border-b-6 border-b-pink-500/30'
        }`}
      >
        {/* Top Header Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-pink-100 text-pink-600 border border-pink-200 shadow-xs flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-pink-500" />
            Dream Goal Vault
          </span>

          <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            {progressPercent}% Unlocked
          </span>
        </div>

        {/* Goal Hero Row with Enlarged Circular Glowing Badge */}
        <div className="flex items-center gap-4 mb-3.5">
          {/* Enlarged Goal Icon inside a Vibrant Circular Glowing Badge */}
          <motion.div
            className="relative flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-amber-300 p-1 flex items-center justify-center shadow-xl border-4 border-white gloss-highlight"
            style={{
              boxShadow: '0 10px 25px -4px rgba(236, 72, 153, 0.45), 0 0 20px 2px rgba(245, 158, 11, 0.3)',
            }}
            animate={{
              y: [-4, 4, -4],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 3.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center shadow-inner">
              <span className="text-4xl drop-shadow-md select-none">{goal.emoji}</span>
            </div>
            {/* Sparkle badge */}
            <motion.div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center shadow-sm text-xs font-black text-amber-900"
              animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              ⭐
            </motion.div>
          </motion.div>

          {/* Goal Information: Clear Bold Stats */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black text-slate-800 tracking-tight leading-tight truncate">
              {goal.title}
            </h2>

            {/* Clear Bold Stats: "120 / 300 ⭐" and "180 Coins to Unlock!" */}
            <div className="mt-1 flex flex-col gap-0.5">
              <div className="flex items-baseline gap-1 text-base font-black text-pink-600">
                <span>{coins} / {goal.targetCoins}</span>
                <span className="text-amber-500 text-sm">⭐</span>
              </div>

              {!isGoalAchieved ? (
                <span className="text-xs font-black text-amber-600">
                  {remainingCoins} Coins to Unlock! 🚀
                </span>
              ) : (
                <span className="text-xs font-black text-emerald-600">
                  Goal Achieved! Unlocked! 🎉
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chunky 3D Rainbow Progress Bar with Glossy Candy Reflection Overlay */}
        <div className="relative w-full">
          {/* Outer Track with 3D Inset Shadow */}
          <div className="w-full h-8 bg-slate-100 rounded-full p-1 border-2 border-slate-200/90 shadow-inner relative overflow-hidden flex items-center">
            {/* Rainbow Progress Fill */}
            <motion.div
              className="h-full rounded-full rainbow-progress-stripe shadow-md relative flex items-center justify-end pr-1.5"
              style={{
                background: 'linear-gradient(90deg, #EC4899 0%, #F59E0B 35%, #10B981 70%, #38BDF8 100%)',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(6, progressPercent)}%` }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
              }}
            >
              {/* Glossy Candy Reflection Overlay */}
              <div className="absolute inset-x-1.5 top-0.5 h-3 rounded-full bg-gradient-to-b from-white/70 via-white/30 to-transparent pointer-events-none" />
            </motion.div>

            {/* Pulsing Star Marker Indicating Current Distance */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none"
              style={{
                left: `calc(${Math.min(94, Math.max(4, progressPercent))}% - 14px)`,
              }}
              animate={{
                scale: [1, 1.25, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div className="w-7 h-7 rounded-full bg-yellow-400 border-2 border-white shadow-md flex items-center justify-center text-xs font-black text-amber-900">
                ⭐
              </div>
            </motion.div>
          </div>
        </div>

        {/* Goal Achieved Celebration Banner */}
        {isGoalAchieved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-400 to-emerald-400 text-white shadow-md flex items-center justify-between gap-2 border-2 border-white"
          >
            <div className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5 animate-bounce text-yellow-100" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-amber-950">
                  🎉 Goal Unlocked! 🎉
                </p>
                <p className="text-[11px] font-bold text-white leading-tight">
                  You conquered your dream reward!
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleCelebrateClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92, y: 2 }}
              className="px-3 py-1.5 rounded-xl bg-white text-pink-600 border-b-4 border-pink-700 font-black text-xs shadow flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Celebrate!
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
