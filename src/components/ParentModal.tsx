'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Lock, ShieldCheck, Check, RotateCcw, Plus, 
  Coins, Sparkles, AlertCircle, Trash2, ArrowLeft,
  Calendar, CheckCircle2, Sprout
} from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { sound } from '@/lib/audio/soundEffects';
import { Quest } from '@/types/bank';

export const ParentModal: React.FC = () => {
  const {
    isParentModalOpen,
    setParentModalOpen,
    quests,
    approveQuest,
    rejectQuest,
    addCustomQuest,
    adjustCoins,
    coins,
    goal,
    updateGoal,
    resetDemoData,
    verifyParentPin,
    applyGrowth,
  } = useBank();

  // Authentication State
  const [pin, setPin] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isPinError, setIsPinError] = useState<boolean>(false);

  // Parent Dashboard Tabs: 'inbox' | 'quests' | 'coins' | 'goal'
  const [activeTab, setActiveTab] = useState<'inbox' | 'quests' | 'coins' | 'goal'>('inbox');

  // Form State for Adding Custom Quest
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Daily Chores');
  const [newEmoji, setNewEmoji] = useState<string>('⭐');
  const [newCoins, setNewCoins] = useState<number>(15);
  const [newTheme, setNewTheme] = useState<Quest['theme']>('pink');

  // Form State for Goal Editing
  const [goalTitle, setGoalTitle] = useState<string>(goal.title);
  const [goalCoins, setGoalCoins] = useState<number>(goal.targetCoins);
  const [goalEmoji, setGoalEmoji] = useState<string>(goal.emoji);

  const pendingQuests = quests.filter((q) => q.status === 'pending');

  const handleClose = () => {
    sound.playWoodenPop();
    setParentModalOpen(false);
    // Reset PIN entry on close
    setPin('');
    setIsPinError(false);
  };

  const handleKeypadPress = async (digit: string) => {
    if (digit === 'clear') {
      sound.playPinClick(1);
      setPin('');
      setIsPinError(false);
      return;
    }
    if (digit === 'back') {
      sound.playPinClick(2);
      setPin((p) => p.slice(0, -1));
      setIsPinError(false);
      return;
    }

    sound.playPinClick(parseInt(digit, 10));
    const nextPin = pin + digit;

    if (nextPin.length <= 4) {
      setPin(nextPin);

      if (nextPin.length === 4) {
        // Validate PIN against Supabase parent_pin (with default 1234 fallback)
        const isValid = await verifyParentPin(nextPin);
        if (isValid) {
          sound.playApprovalDing();
          setIsAuthenticated(true);
          setIsPinError(false);
        } else {
          sound.playErrorBuzz();
          setIsPinError(true);
          setTimeout(() => {
            setPin('');
            setIsPinError(false);
          }, 800);
        }
      }
    }
  };

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addCustomQuest(newTitle, newCategory, newEmoji, newCoins, newTheme);
    setNewTitle('');
    setActiveTab('inbox');
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoal(goalTitle, goalCoins, goalEmoji);
    setActiveTab('inbox');
  };

  if (!isParentModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-purple-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white flex items-center justify-between border-b-4 border-purple-900 shadow-md">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/80 border border-purple-300 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-purple-100" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight leading-none">
                  Parent Command Center
                </h2>
                <p className="text-[11px] font-bold text-purple-200 leading-tight mt-0.5">
                  Gated Dashboard & Approvals
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Modal Content: PIN Screen vs Dashboard */}
          {!isAuthenticated ? (
            /* PIN Gate Screen */
            <div className="p-6 flex flex-col items-center select-none">
              <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-600 border-2 border-purple-200 flex items-center justify-center shadow-inner mb-3">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-black text-slate-800 text-center">
                Grown-Ups Only! 🔐
              </h3>
              <p className="text-xs font-bold text-slate-500 text-center mt-1 max-w-[260px]">
                Please enter your 4-digit Parent PIN to approve quests or adjust coins.
              </p>

              <div className="mt-2 px-3 py-1 bg-purple-50 rounded-full border border-purple-200 text-[11px] font-black text-purple-700">
                Default PIN: <span className="underline decoration-wavy">1234</span>
              </div>

              {/* 4 PIN Dots */}
              <motion.div
                animate={isPinError ? { x: [-12, 12, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-4 my-5"
              >
                {[0, 1, 2, 3].map((idx) => {
                  const filled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full transition-all duration-200 ${
                        isPinError
                          ? 'bg-rose-500 scale-110 shadow-md'
                          : filled
                          ? 'bg-purple-600 scale-125 shadow-md shadow-purple-500/40'
                          : 'bg-slate-200 border-2 border-slate-300'
                      }`}
                    />
                  );
                })}
              </motion.div>

              {/* Tactile Keypad */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[260px]">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <motion.button
                    key={num}
                    onClick={() => handleKeypadPress(num)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92, y: 2 }}
                    className="h-13 rounded-2xl bg-white text-slate-800 font-black text-xl border-b-4 border-slate-300 shadow-md flex items-center justify-center cursor-pointer hover:bg-purple-50 active:border-b-0"
                  >
                    {num}
                  </motion.button>
                ))}

                {/* Clear */}
                <motion.button
                  onClick={() => handleKeypadPress('clear')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92, y: 2 }}
                  className="h-13 rounded-2xl bg-rose-50 text-rose-600 font-black text-sm border-b-4 border-rose-300 shadow-md flex items-center justify-center cursor-pointer active:border-b-0"
                >
                  Clear
                </motion.button>

                {/* 0 */}
                <motion.button
                  onClick={() => handleKeypadPress('0')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92, y: 2 }}
                  className="h-13 rounded-2xl bg-white text-slate-800 font-black text-xl border-b-4 border-slate-300 shadow-md flex items-center justify-center cursor-pointer hover:bg-purple-50 active:border-b-0"
                >
                  0
                </motion.button>

                {/* Backspace */}
                <motion.button
                  onClick={() => handleKeypadPress('back')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92, y: 2 }}
                  className="h-13 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm border-b-4 border-slate-300 shadow-md flex items-center justify-center cursor-pointer active:border-b-0"
                >
                  ⌫
                </motion.button>
              </div>
            </div>
          ) : (
            /* Authenticated Parent Dashboard */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1.5 overflow-x-auto">
                {[
                  { id: 'inbox', label: `Pending (${pendingQuests.length})`, icon: '📥' },
                  { id: 'quests', label: 'Add Mission', icon: '➕' },
                  { id: 'coins', label: 'Bank Adjust', icon: '🪙' },
                  { id: 'goal', label: 'Dream Vault', icon: '🏰' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.playPinClick(1);
                      setActiveTab(tab.id as typeof activeTab);
                    }}
                    className={`px-3 py-2 text-xs font-black rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-white text-purple-700 border-t-2 border-l-2 border-r-2 border-purple-300 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Panels */}
              <div className="flex-1 overflow-y-auto p-4 select-none">
                {/* 1. Pending Approvals Inbox */}
                {activeTab === 'inbox' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Awaiting Parent Review
                      </h4>
                      <span className="text-xs font-extrabold text-purple-600">
                        Current Bank: {coins} Coins 🪙
                      </span>
                    </div>

                    {pendingQuests.length === 0 ? (
                      <div className="py-8 text-center flex flex-col items-center">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                          <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-black text-slate-700">
                          All caught up! No pending missions.
                        </p>
                        <p className="text-xs font-semibold text-slate-400 mt-1 max-w-[240px]">
                          When your child taps &quot;I Did It!&quot; on their quests, they will show up here for one-tap approval!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingQuests.map((q) => (
                          <div
                            key={q.id}
                            className="p-3.5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm flex flex-col gap-2.5"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl flex-shrink-0">
                                {q.emoji}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-black text-slate-800 truncate">
                                  {q.title}
                                </h5>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[11px] font-bold text-amber-700">
                                    +{q.coins} Coins
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    • {q.category}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* One-Tap Action Buttons */}
                            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                              {/* Approve Button */}
                              <motion.button
                                onClick={() => approveQuest(q.id)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95, y: 2 }}
                                className="flex-1 py-2 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-black text-xs border-b-4 border-emerald-800 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                <span>Approve (+{q.coins})</span>
                              </motion.button>

                              {/* Try Again Button */}
                              <motion.button
                                onClick={() => rejectQuest(q.id)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95, y: 2 }}
                                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs border-b-4 border-slate-300 shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Try Again</span>
                              </motion.button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reset Demo / Replay Helper */}
                    <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400">
                        Testing Demo Mode
                      </span>
                      <motion.button
                        onClick={resetDemoData}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset Bank & Quests
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* 2. Add Custom Quest */}
                {activeTab === 'quests' && (
                  <form onSubmit={handleCreateQuest} className="space-y-3.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Create a Special Mission
                    </h4>

                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1">
                        Mission Title
                      </label>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="e.g. Practice Piano 🎹 or Help Fold Laundry"
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-purple-500 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-black text-slate-700 block mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black text-slate-700 block mb-1">
                          Coin Reward
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={100}
                          step={5}
                          value={newCoins}
                          onChange={(e) => setNewCoins(parseInt(e.target.value, 10) || 10)}
                          className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-purple-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1">
                        Pick an Icon
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {['⭐', '🎹', '🎨', '🐶', '🚴', '🧼', '🍎', '🧩', '🌱'].map((em) => (
                          <button
                            type="button"
                            key={em}
                            onClick={() => setNewEmoji(em)}
                            className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 cursor-pointer transition-all ${
                              newEmoji === em
                                ? 'border-purple-500 bg-purple-100 scale-110 shadow-sm'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {em}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1">
                        Color Theme
                      </label>
                      <div className="flex gap-2">
                        {(['pink', 'emerald', 'amber', 'purple', 'sky'] as Quest['theme'][]).map((thm) => (
                          <button
                            type="button"
                            key={thm}
                            onClick={() => setNewTheme(thm)}
                            className={`flex-1 py-1.5 rounded-xl text-[11px] font-black uppercase border-2 cursor-pointer capitalize ${
                              newTheme === thm
                                ? 'border-slate-800 bg-slate-800 text-white shadow-sm'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            }`}
                          >
                            {thm}
                          </button>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97, y: 2 }}
                      className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-b from-purple-600 to-purple-700 text-white font-black text-xs uppercase tracking-wider border-b-4 border-purple-900 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Mission to Adventure Board
                    </motion.button>
                  </form>
                )}

                {/* 3. Direct Coin Adjustment */}
                {activeTab === 'coins' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-amber-800">
                          Current Adventure Balance
                        </span>
                        <h3 className="text-2xl font-black text-amber-950">
                          {coins} Golden Coins 🪙
                        </h3>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                        Quick Bonus Rewards (+Coins)
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[5, 10, 20, 50].map((amt) => (
                          <motion.button
                            key={amt}
                            onClick={() => adjustCoins(amt)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.94, y: 2 }}
                            className="py-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 font-black text-sm border-b-4 border-amber-700 shadow-sm cursor-pointer"
                          >
                            +{amt}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                        Deductions / Spent in Store (-Coins)
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[-5, -10, -25].map((amt) => (
                          <motion.button
                            key={amt}
                            onClick={() => adjustCoins(amt)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.94, y: 2 }}
                            className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs border-b-4 border-slate-300 shadow-sm cursor-pointer"
                          >
                            {amt}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Passive Growth Manual Trigger (Fallback) */}
                    <div className="pt-3 border-t border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black text-slate-700">
                          Automated 4-Jar Compounding
                        </span>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          Cron Active (00:00 UTC)
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 mb-2">
                        Passive growth compounds automatically every midnight. You can also trigger an immediate manual calculation.
                      </p>
                      <motion.button
                        type="button"
                        onClick={async () => {
                          await applyGrowth();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sprout className="w-4 h-4" />
                        <span>Run Manual Yield Calculation Now</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* 4. Dream Goal Vault Settings */}
                {activeTab === 'goal' && (
                  <form onSubmit={handleSaveGoal} className="space-y-3.5">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                      Customize Child&apos;s Dream Goal
                    </h4>

                    <div>
                      <label className="text-xs font-black text-slate-700 block mb-1">
                        Dream Reward Name
                      </label>
                      <input
                        type="text"
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        placeholder="e.g. Super Magic Castle or Trip to Zoo"
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-purple-500 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-black text-slate-700 block mb-1">
                          Emoji Icon
                        </label>
                        <input
                          type="text"
                          value={goalEmoji}
                          onChange={(e) => setGoalEmoji(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-purple-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-black text-slate-700 block mb-1">
                          Target Coins
                        </label>
                        <input
                          type="number"
                          min={20}
                          max={1000}
                          step={20}
                          value={goalCoins}
                          onChange={(e) => setGoalCoins(parseInt(e.target.value, 10) || 100)}
                          className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs focus:border-purple-500 outline-none"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97, y: 2 }}
                      className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-b from-purple-600 to-purple-700 text-white font-black text-xs uppercase tracking-wider border-b-4 border-purple-900 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      Update Dream Goal Vault
                    </motion.button>
                  </form>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
