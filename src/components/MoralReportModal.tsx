'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Sparkles, TrendingUp, Award, Shield, 
  Coins, Heart, Sprout, Calendar, Clock, ArrowRight,
  PieChart, CheckCircle2, ChevronRight, MessageSquareQuote
} from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { sound } from '@/lib/audio/soundEffects';
import { 
  fetchTreasuryLedger, 
  ReportTimeRange, 
  FinancialReportSummary, 
  MoralArchetype, 
  evaluateMoralArchetype 
} from '@/lib/bankService';

const TIME_RANGES: Array<{ id: ReportTimeRange; label: string; icon: string }> = [
  { id: 'weekly', label: 'Weekly', icon: '📅' },
  { id: 'monthly', label: 'Monthly', icon: '🌕' },
  { id: 'quarterly', label: 'Quarterly', icon: '🏛️' },
  { id: 'annual', label: 'Annual', icon: '👑' }
];

export const MoralReportModal: React.FC = () => {
  const { isReportModalOpen, setReportModalOpen, child, wallet, coins } = useBank();
  const [selectedRange, setSelectedRange] = useState<ReportTimeRange>('weekly');
  const [report, setReport] = useState<FinancialReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    if (isReportModalOpen && child?.id) {
      setIsLoading(true);
      fetchTreasuryLedger(child.id, selectedRange)
        .then((data) => {
          if (isMounted) {
            setReport(data);
          }
        })
        .catch((err) => {
          console.error('[MoralReportModal] Error fetching report:', err);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isReportModalOpen, child?.id, selectedRange, wallet, coins]);

  if (!isReportModalOpen) return null;

  const handleClose = () => {
    sound.playWoodenPop();
    setReportModalOpen(false);
  };

  const handleTabChange = (range: ReportTimeRange) => {
    sound.playPinClick(1);
    setSelectedRange(range);
  };

  const archetype: MoralArchetype = report?.archetype || evaluateMoralArchetype(0, 0, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border-4 border-purple-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Banner */}
          <div className="p-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white relative flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl filter drop-shadow">📜</span>
              <div>
                <h2 className="text-lg font-black tracking-tight drop-shadow leading-tight">
                  Moral &amp; Financial Report
                </h2>
                <p className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">
                  Wisdom • Character • Wealth
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Time Range Selector Tabs */}
          <div className="px-4 pt-3 pb-1 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {TIME_RANGES.map((t) => {
              const isActive = selectedRange === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabChange(t.id)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs border-b-2 border-purple-800'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 1. Moral Archetype Badge Award Card */}
            <motion.div
              key={archetype.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-3xl bg-gradient-to-br ${archetype.color} text-white shadow-lg relative overflow-hidden`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xs border-2 border-white/40 flex items-center justify-center text-3xl shadow-inner">
                    {archetype.icon}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/25 text-white inline-block mb-1">
                      Moral Archetype
                    </span>
                    <h3 className="text-xl font-black leading-tight drop-shadow-xs">
                      {archetype.name}
                    </h3>
                    <p className="text-xs font-bold text-white/90 leading-tight mt-0.5">
                      {archetype.badge}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-yellow-300/30 flex items-center justify-center text-yellow-200">
                  <Award className="w-5 h-5 fill-current" />
                </div>
              </div>

              {/* Barnaby the Bear's Character Building Wisdom */}
              <div className="mt-3.5 p-3 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-start gap-2.5">
                <span className="text-2xl flex-shrink-0 mt-0.5">🐻</span>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-yellow-200">
                    Barnaby the Bear&apos;s Wisdom
                  </div>
                  <p className="text-xs font-bold text-white/95 leading-relaxed mt-0.5">
                    &ldquo;{archetype.barnabyTip}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 2. Key Financial Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Total Earned */}
              <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-amber-700 mb-1">
                  <Coins className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Earned</span>
                </div>
                <div>
                  <span className="text-lg font-black text-amber-950 leading-tight block">
                    {report?.totalEarned ?? 0}
                  </span>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-tight block">
                    Total Coins
                  </span>
                </div>
              </div>

              {/* Passive Yields */}
              <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-700 mb-1">
                  <Sprout className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Yields</span>
                </div>
                <div>
                  <span className="text-lg font-black text-emerald-950 leading-tight block">
                    +{report?.yieldsHarvested ?? 0}
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-tight block">
                    Harvested
                  </span>
                </div>
              </div>

              {/* Net Worth */}
              <div className="p-3 rounded-2xl bg-purple-50 border-2 border-purple-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-purple-700 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Net Worth</span>
                </div>
                <div>
                  <span className="text-lg font-black text-purple-950 leading-tight block">
                    {report?.currentNetWorth ?? 0}
                  </span>
                  <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-tight block">
                    Jars + Liquid
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Wealth Split Visual (Joy vs Needs vs Kingdom Investment) */}
            <div className="p-4 rounded-3xl bg-slate-50 border-2 border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <PieChart className="w-4 h-4 text-purple-600" />
                  Treasure Distribution Ratio
                </h4>
                <span className="text-[10px] font-black text-slate-400 uppercase">
                  {selectedRange} breakdown
                </span>
              </div>

              {/* Segmented Distribution Bar */}
              <div className="w-full h-4 rounded-full bg-slate-200 overflow-hidden flex p-0.5 gap-0.5 border border-slate-300">
                <motion.div
                  className="h-full rounded-l-full bg-gradient-to-r from-pink-500 to-rose-500"
                  style={{ width: `${Math.max(4, report?.joyPercent ?? 33)}%` }}
                  title={`Joy Jar: ${report?.joyPercent}%`}
                />
                <motion.div
                  className="h-full bg-gradient-to-r from-sky-400 to-blue-500"
                  style={{ width: `${Math.max(4, report?.needsPercent ?? 33)}%` }}
                  title={`Daily Needs: ${report?.needsPercent}%`}
                />
                <motion.div
                  className="h-full rounded-r-full bg-gradient-to-r from-amber-400 to-emerald-500"
                  style={{ width: `${Math.max(4, report?.investPercent ?? 34)}%` }}
                  title={`Investments: ${report?.investPercent}%`}
                />
              </div>

              {/* Breakdown Legend Chips */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-pink-50 border border-pink-200">
                  <span className="text-[10px] font-black text-pink-600 block">
                    🎮 Joy ({report?.joyPercent ?? 0}%)
                  </span>
                  <span className="text-xs font-extrabold text-pink-950 block">
                    {wallet?.spend_coins ?? 0} coins
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-sky-50 border border-sky-200">
                  <span className="text-[10px] font-black text-sky-600 block">
                    🛡️ Needs ({report?.needsPercent ?? 0}%)
                  </span>
                  <span className="text-xs font-extrabold text-sky-950 block">
                    {wallet?.needs_coins ?? 0} coins
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] font-black text-emerald-700 block">
                    🏰 Growth ({report?.investPercent ?? 0}%)
                  </span>
                  <span className="text-xs font-extrabold text-emerald-950 block">
                    {(wallet?.gold_coins ?? 0) + (wallet?.land_coins ?? 0) + (wallet?.vault_coins ?? 0)} coins
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Ledger Entries Log */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Recent Treasury Movements
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  {report?.entries.length ?? 0} recorded
                </span>
              </div>

              {report?.entries && report.entries.length > 0 ? (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {report.entries.map((entry, i) => (
                    <div
                      key={entry.id || i}
                      className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">
                          {entry.category === 'asset_yield' ? '🌱' : '🪙'}
                        </span>
                        <div>
                          <p className="font-extrabold text-slate-800 leading-tight">
                            {entry.description}
                          </p>
                          <span className="text-[9px] font-semibold text-slate-400 block mt-0.5">
                            {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                      </div>
                      <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        +{entry.amount}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center text-xs font-semibold text-slate-400">
                  No ledger entries recorded yet in this time window. Complete a Sunday Council allocation to populate history!
                </div>
              )}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full py-3 rounded-2xl bg-gradient-to-b from-purple-600 to-purple-700 text-white font-black text-xs uppercase tracking-wider border-b-4 border-purple-900 shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Close Report</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
