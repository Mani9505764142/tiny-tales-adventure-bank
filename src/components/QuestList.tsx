'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Target, Sparkles } from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { QuestCard } from './QuestCard';

export const QuestList: React.FC = () => {
  const { quests } = useBank();

  const completedCount = quests.filter((q) => q.status === 'approved').length;
  const pendingCount = quests.filter((q) => q.status === 'pending').length;

  return (
    <section className="w-full px-4 my-2 z-10 select-none pb-24">
      {/* Section Header with Mission Counter */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 leading-none">
              Daily Hero Quests
            </h2>
            <p className="text-[11px] font-bold text-slate-400 leading-tight mt-0.5">
              Complete missions, earn golden rewards!
            </p>
          </div>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200/80 shadow-xs text-xs font-black">
          <Sparkles className="w-3 h-3 text-pink-500" />
          <span className="text-pink-600 font-extrabold">{completedCount}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">{quests.length}</span>
          {pendingCount > 0 && (
            <span className="ml-1 text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.2 rounded-full">
              {pendingCount} ⏳
            </span>
          )}
        </div>
      </div>

      {/* Quest Cards Grid / Stack */}
      <div className="flex flex-col gap-3">
        {quests.map((quest, index) => (
          <QuestCard key={quest.id} quest={quest} index={index} />
        ))}
      </div>
    </section>
  );
};
