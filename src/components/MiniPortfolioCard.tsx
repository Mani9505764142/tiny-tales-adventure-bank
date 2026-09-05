'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Sparkles, Sprout, ShieldCheck, 
  Coins, ChevronRight, Lock, ArrowUpRight, Flame
} from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { sound } from '@/lib/audio/soundEffects';

export const MiniPortfolioCard: React.FC = () => {
  const { wallet, setTreasuryModalOpen, setReportModalOpen, applyGrowth, isSyncing } = useBank();
  const [isHarvesting, setIsHarvesting] = useState<boolean>(false);
  const [harvestResult, setHarvestResult] = useState<{ gold: number; land: number } | null>(null);

  const goldCoins = wallet?.gold_coins ?? 0;
  const landCoins = wallet?.land_coins ?? 0;
  const vaultCoins = wallet?.vault_coins ?? 0;
  const spendCoins = wallet?.spend_coins ?? 0;
  const needsCoins = wallet?.needs_coins ?? 0;

  const totalPortfolio = goldCoins + landCoins + vaultCoins + spendCoins + needsCoins;

  // Potential yields preview
  const estimatedGoldYield = goldCoins > 0 ? Math.max(1, Math.round(goldCoins * 0.015)) : 0;
  const estimatedLandYield = landCoins > 0 ? Math.max(1, Math.round(landCoins * 0.12)) : 0;
  const hasYieldsToClaim = estimatedGoldYield > 0 || estimatedLandYield > 0;

  const handleHarvestClick = async () => {
    sound.playPinClick(4);
    setIsHarvesting(true);
    try {
      const res = await applyGrowth();
      if (res.success && (res.goldGain > 0 || res.landGain > 0)) {
        setHarvestResult({ gold: res.goldGain, land: res.landGain });
        setTimeout(() => {
          setHarvestResult(null);
        }, 4000);
      }
    } finally {
      setIsHarvesting(false);
    }
  };

  const handleOpenCouncil = () => {
    sound.playWoodenPop();
    setTreasuryModalOpen(true);
  };

  const handleOpenReport = () => {
    sound.playWoodenPop();
    setReportModalOpen(true);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full px-4 my-2 select-none z-10"
    >
      <div className="candy-card p-4 bg-gradient-to-b from-white via-amber-50/20 to-orange-50/30 border-2 border-amber-200/90 shadow-md relative overflow-hidden">
        {/* Ambient background sparkle */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-300/15 rounded-full blur-xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
                  4-Jar Wealth Engine
                </h3>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300 flex items-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 leading-none mt-0.5">
                Total Jars Balance: <span className="text-amber-800 font-extrabold">{totalPortfolio} coins</span>
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenCouncil}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-b from-amber-500 via-yellow-500 to-amber-600 text-white font-black text-xs border-b-2 border-amber-800 shadow-sm cursor-pointer"
            title="Open Family Treasury Council"
          >
            <span>Open Treasury Council 🏛️</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-100" />
          </motion.button>
        </div>

        {/* 3 Core Asset Cards (Gold, Land, Savings/Vault) */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* 1. Digital Gold Card */}
          <div className="p-2.5 rounded-2xl bg-gradient-to-b from-amber-50 to-amber-100/60 border border-amber-300 flex flex-col justify-between shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xl">🥇</span>
              <span className="text-[9px] font-black text-amber-800 bg-amber-200/80 px-1 py-0.5 rounded-md leading-none">
                +1.5%/d
              </span>
            </div>
            <div className="mt-2">
              <span className="text-base font-black text-amber-950 leading-tight block">
                {goldCoins}
              </span>
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-tight block">
                Digital Gold
              </span>
            </div>
          </div>

          {/* 2. Magic Land Card */}
          <div className="p-2.5 rounded-2xl bg-gradient-to-b from-emerald-50 to-emerald-100/60 border border-emerald-300 flex flex-col justify-between shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xl">🏡</span>
              <span className="text-[9px] font-black text-emerald-800 bg-emerald-200/80 px-1 py-0.5 rounded-md leading-none">
                +12%/w
              </span>
            </div>
            <div className="mt-2">
              <span className="text-base font-black text-emerald-950 leading-tight block">
                {landCoins}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-tight block">
                Magic Land
              </span>
            </div>
          </div>

          {/* 3. Future Vault / Savings Card */}
          <div className="p-2.5 rounded-2xl bg-gradient-to-b from-purple-50 to-purple-100/60 border border-purple-300 flex flex-col justify-between shadow-2xs relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xl">🔒</span>
              <span className="text-[9px] font-black text-purple-800 bg-purple-200/80 px-1 py-0.5 rounded-md leading-none">
                Vault
              </span>
            </div>
            <div className="mt-2">
              <span className="text-base font-black text-purple-950 leading-tight block">
                {vaultCoins}
              </span>
              <span className="text-[10px] font-extrabold text-purple-800 uppercase tracking-tight block">
                Future Vault
              </span>
            </div>
          </div>
        </div>

        {/* Mini Spend & Needs Pill row */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-600 mb-2.5 shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span>🎮 Joy Jar:</span>
            <span className="font-black text-pink-600">{spendCoins}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <span>🛡️ Daily Needs:</span>
            <span className="font-black text-sky-600">{needsCoins}</span>
          </div>
        </div>

        {/* Automated Daily Compounding Yields Indicator */}
        <div className="relative mb-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-emerald-50 border border-emerald-300/80 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
                <Flame className="w-4 h-4 fill-emerald-100 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-emerald-950">
                    ⚡ Automated Daily Yields Active
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-[10px] font-bold text-emerald-700 leading-tight">
                  Compounds every midnight UTC (+1.5% Gold, +12% Land)
                </p>
              </div>
            </div>

            {hasYieldsToClaim && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isHarvesting || isSyncing}
                onClick={handleHarvestClick}
                className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                title="Manual fallback harvest"
              >
                <Sprout className="w-3 h-3" />
                <span>Instant Harvest</span>
              </motion.button>
            )}
          </div>

          {/* Floating Harvest Result Toast */}
          <AnimatePresence>
            {harvestResult && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl text-white font-black text-xs flex items-center justify-center gap-2 shadow-md z-20"
              >
                <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
                <span>Harvested! Gold +{harvestResult.gold} 🥇, Land +{harvestResult.land} 🏡!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button: 📜 View Moral Report */}
        <div className="pt-2 border-t border-amber-200/60">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenReport}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-900 font-black text-xs border border-purple-200 border-b-3 border-b-purple-400 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            title="View Moral & Financial Report Card"
          >
            <span className="text-base">📜</span>
            <span>View Moral &amp; Financial Report Card</span>
            <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};
