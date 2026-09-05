'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Clock, Award } from 'lucide-react';
import { Quest } from '@/types/bank';
import { useBank } from '@/context/BankContext';

interface QuestCardProps {
  quest: Quest;
  index: number;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest, index }) => {
  const { submitQuest } = useBank();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleActionClick = () => {
    if (quest.status !== 'ready') return;
    const rect = buttonRef.current?.getBoundingClientRect();
    submitQuest(quest.id, rect);
  };

  // Color theming tokens for rich visual variety
  const themeStyles = {
    pink: {
      bubbleBg: 'from-pink-400 to-rose-500',
      bubbleBorder: 'border-pink-200',
      bubbleShadow: 'rgba(236, 72, 153, 0.4)',
      badgeBg: 'bg-pink-100 text-pink-700 border-pink-200',
      cardBevel: 'border-b-4 border-b-pink-400/40',
    },
    emerald: {
      bubbleBg: 'from-emerald-400 to-teal-500',
      bubbleBorder: 'border-emerald-200',
      bubbleShadow: 'rgba(16, 185, 129, 0.4)',
      badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      cardBevel: 'border-b-4 border-b-emerald-400/40',
    },
    amber: {
      bubbleBg: 'from-amber-400 to-orange-500',
      bubbleBorder: 'border-amber-200',
      bubbleShadow: 'rgba(245, 158, 11, 0.4)',
      badgeBg: 'bg-amber-100 text-amber-700 border-amber-200',
      cardBevel: 'border-b-4 border-b-amber-400/40',
    },
    purple: {
      bubbleBg: 'from-purple-400 to-indigo-500',
      bubbleBorder: 'border-purple-200',
      bubbleShadow: 'rgba(139, 92, 246, 0.4)',
      badgeBg: 'bg-purple-100 text-purple-700 border-purple-200',
      cardBevel: 'border-b-4 border-b-purple-400/40',
    },
    sky: {
      bubbleBg: 'from-sky-400 to-blue-500',
      bubbleBorder: 'border-sky-200',
      bubbleShadow: 'rgba(14, 165, 233, 0.4)',
      badgeBg: 'bg-sky-100 text-sky-700 border-sky-200',
      cardBevel: 'border-b-4 border-b-sky-400/40',
    },
  }[quest.theme || 'pink'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        type: 'spring',
        stiffness: 280,
        damping: 22,
      }}
      className={`candy-card p-4 transition-all duration-200 ${themeStyles.cardBevel}`}
    >
      <div className="flex items-center gap-3.5">
        {/* Left: Chunky 3D Icon Bubble */}
        <motion.div
          whileHover={{ scale: 1.08, rotate: 4 }}
          whileTap={{ scale: 0.94 }}
          className={`relative flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-tr ${themeStyles.bubbleBg} p-0.5 flex items-center justify-center border-2 ${themeStyles.bubbleBorder} shadow-md gloss-highlight`}
          style={{
            boxShadow: `0 8px 16px -3px ${themeStyles.bubbleShadow}`,
          }}
        >
          <div className="w-full h-full rounded-[14px] bg-white/90 flex items-center justify-center shadow-inner">
            <span className="text-2xl select-none drop-shadow-sm">{quest.emoji}</span>
          </div>
        </motion.div>

        {/* Center: Quest Content & Reward Pill */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${themeStyles.badgeBg}`}
            >
              {quest.category}
            </span>
          </div>

          <h3 className="text-base font-black text-slate-800 tracking-tight truncate">
            {quest.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-0.5">
            {/* Reward Pill: Vivid Honey Amber */}
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 font-black text-xs border border-amber-500/60 shadow-xs">
              <span className="text-[11px]">🪙</span>
              <span>+{quest.coins} Coins</span>
            </div>

            {quest.description && (
              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[130px] hidden xs:inline">
                {quest.description}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Action Button Section */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
          {quest.status === 'ready' && <span>⭐ Daily Hero Challenge</span>}
          {quest.status === 'pending' && (
            <span className="text-amber-600 font-extrabold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Sent to Mom & Dad!
            </span>
          )}
          {quest.status === 'approved' && (
            <span className="text-emerald-600 font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Coins Awarded!
            </span>
          )}
        </div>

        {/* The "I Did It!" Tactile 3D Action Button */}
        <div>
          {quest.status === 'ready' && (
            <motion.button
              ref={buttonRef}
              onClick={handleActionClick}
              whileHover={{ scale: 1.04 }}
              whileTap={{
                y: 3,
                scale: 0.96,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative px-4 py-2 rounded-2xl bg-gradient-to-b from-pink-500 to-pink-600 text-white font-black text-xs uppercase tracking-wide border-b-6 border-pink-800 shadow-lg flex items-center gap-1.5 gloss-highlight cursor-pointer"
              style={{
                boxShadow: '0 8px 18px -4px rgba(236, 72, 153, 0.45)',
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>I Did It!</span>
            </motion.button>
          )}

          {quest.status === 'pending' && (
            <motion.div
              animate={{
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 font-black text-xs border-b-4 border-amber-700 shadow-md flex items-center gap-1.5 cursor-default select-none"
            >
              <span className="text-sm animate-pulse">⏳</span>
              <span>Checking with Mom & Dad</span>
            </motion.div>
          )}

          {quest.status === 'approved' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-500 text-white font-black text-xs border-b-4 border-emerald-700 shadow-md flex items-center gap-1.5 cursor-default select-none"
            >
              <Award className="w-3.5 h-3.5 text-yellow-200" />
              <span>Completed! ⭐</span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
