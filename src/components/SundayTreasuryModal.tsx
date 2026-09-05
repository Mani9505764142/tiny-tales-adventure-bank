'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Lock, ShieldCheck, Check, Sparkles, 
  Coins, ArrowRight, CheckCircle2, ChevronRight,
  TrendingUp, RefreshCw, AlertCircle, Award
} from 'lucide-react';
import { useBank } from '@/context/BankContext';
import { sound } from '@/lib/audio/soundEffects';

interface JarConfig {
  key: 'spend' | 'needs' | 'gold' | 'land' | 'vault';
  name: string;
  emoji: string;
  tagline: string;
  badge?: string;
  theme: {
    gradient: string;
    border: string;
    accent: string;
    lightBg: string;
    textColor: string;
  };
}

const JARS: JarConfig[] = [
  {
    key: 'spend',
    name: 'Joy Jar',
    emoji: '🎮',
    tagline: 'Spend for toys, games, snacks & movie fun',
    badge: 'Instant Joy',
    theme: {
      gradient: 'from-pink-500 to-rose-500',
      border: 'border-pink-300',
      accent: 'bg-pink-500',
      lightBg: 'bg-pink-50',
      textColor: 'text-pink-600',
    }
  },
  {
    key: 'needs',
    name: 'Daily Needs',
    emoji: '🛡️',
    tagline: 'Stationery, books, school essentials & gears',
    badge: 'Essentials',
    theme: {
      gradient: 'from-sky-500 to-blue-600',
      border: 'border-sky-300',
      accent: 'bg-sky-500',
      lightBg: 'bg-sky-50',
      textColor: 'text-sky-600',
    }
  },
  {
    key: 'gold',
    name: 'Digital Gold',
    emoji: '🥇',
    tagline: 'Micro-growth asset yielding daily coin dividends',
    badge: '+1.5% Daily Yield',
    theme: {
      gradient: 'from-amber-400 to-yellow-500',
      border: 'border-amber-300',
      accent: 'bg-amber-500',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-700',
    }
  },
  {
    key: 'land',
    name: 'Magic Land',
    emoji: '🏡',
    tagline: 'Enchanted estate maturing with weekly bonus harvest',
    badge: '+12% Weekly Yield',
    theme: {
      gradient: 'from-emerald-500 to-teal-600',
      border: 'border-emerald-300',
      accent: 'bg-emerald-500',
      lightBg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    }
  },
  {
    key: 'vault',
    name: 'Future Vault',
    emoji: '🔒',
    tagline: 'Untouchable reserve for huge milestone dream goals',
    badge: 'Royal Vault',
    theme: {
      gradient: 'from-purple-500 to-indigo-600',
      border: 'border-purple-300',
      accent: 'bg-purple-500',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-700',
    }
  }
];

export const SundayTreasuryModal: React.FC = () => {
  const {
    isTreasuryModalOpen,
    setTreasuryModalOpen,
    coins,
    wallet,
    allocateTreasury,
    verifyParentPin,
    isSyncing,
    child,
    family
  } = useBank();

  // Allocation State
  const [allocation, setAllocation] = useState({
    spend: 0,
    needs: 0,
    gold: 0,
    land: 0,
    vault: 0
  });

  // Modal Step: 'allocate' | 'pin' | 'success'
  const [step, setStep] = useState<'allocate' | 'pin' | 'success'>('allocate');
  const [pin, setPin] = useState<string>('');
  const [isPinError, setIsPinError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Available coins to distribute (capped by current balance)
  const maxAvailable = coins;

  const totalAllocated = useMemo(() => {
    return (
      allocation.spend +
      allocation.needs +
      allocation.gold +
      allocation.land +
      allocation.vault
    );
  }, [allocation]);

  const coinsRemaining = Math.max(0, maxAvailable - totalAllocated);

  // Initialize or reset allocation when modal opens
  useEffect(() => {
    if (isTreasuryModalOpen) {
      setStep('allocate');
      setPin('');
      setIsPinError(false);

      if (maxAvailable > 0) {
        // Default smart split: 20% to each jar
        const share = Math.floor(maxAvailable / 5);
        const remainder = maxAvailable - share * 5;
        setAllocation({
          spend: share + remainder,
          needs: share,
          gold: share,
          land: share,
          vault: share
        });
      } else {
        setAllocation({ spend: 0, needs: 0, gold: 0, land: 0, vault: 0 });
      }
    }
  }, [isTreasuryModalOpen, maxAvailable]);

  if (!isTreasuryModalOpen) return null;

  const handleClose = () => {
    sound.playWoodenPop();
    setTreasuryModalOpen(false);
  };

  // Adjust jar slider with real-time budget clamping
  const handleSliderChange = (key: keyof typeof allocation, value: number) => {
    sound.playPinClick(1);
    const otherJarsTotal = totalAllocated - allocation[key];
    const clampedValue = Math.max(0, Math.min(value, maxAvailable - otherJarsTotal));

    setAllocation((prev) => ({
      ...prev,
      [key]: clampedValue
    }));
  };

  // Micro adjustments via +/- buttons
  const handleDeltaChange = (key: keyof typeof allocation, delta: number) => {
    const current = allocation[key];
    const target = current + delta;
    handleSliderChange(key, target);
  };

  // Presets
  const applyPreset = (type: 'balanced' | 'growth' | 'saver' | 'clear') => {
    sound.playPinClick(3);
    if (maxAvailable <= 0 || type === 'clear') {
      setAllocation({ spend: 0, needs: 0, gold: 0, land: 0, vault: 0 });
      return;
    }

    if (type === 'balanced') {
      const share = Math.floor(maxAvailable / 5);
      const remainder = maxAvailable - share * 5;
      setAllocation({
        spend: share + remainder,
        needs: share,
        gold: share,
        land: share,
        vault: share
      });
    } else if (type === 'growth') {
      // 35% Gold, 35% Land, 10% Vault, 10% Needs, 10% Joy
      const goldShare = Math.floor(maxAvailable * 0.35);
      const landShare = Math.floor(maxAvailable * 0.35);
      const vaultShare = Math.floor(maxAvailable * 0.10);
      const needsShare = Math.floor(maxAvailable * 0.10);
      const spendShare = maxAvailable - (goldShare + landShare + vaultShare + needsShare);
      setAllocation({
        gold: goldShare,
        land: landShare,
        vault: vaultShare,
        needs: needsShare,
        spend: spendShare
      });
    } else if (type === 'saver') {
      // 50% Vault, 25% Gold, 15% Land, 5% Needs, 5% Joy
      const vaultShare = Math.floor(maxAvailable * 0.50);
      const goldShare = Math.floor(maxAvailable * 0.25);
      const landShare = Math.floor(maxAvailable * 0.15);
      const needsShare = Math.floor(maxAvailable * 0.05);
      const spendShare = maxAvailable - (vaultShare + goldShare + landShare + needsShare);
      setAllocation({
        vault: vaultShare,
        gold: goldShare,
        land: landShare,
        needs: needsShare,
        spend: spendShare
      });
    }
  };

  // Pin Keypad press
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
        setIsSubmitting(true);
        const isValid = await verifyParentPin(nextPin);
        if (isValid) {
          // Perform allocation
          const res = await allocateTreasury(allocation);
          setIsSubmitting(false);
          if (res.success) {
            setStep('success');
          } else {
            sound.playErrorBuzz();
            setIsPinError(true);
            setTimeout(() => {
              setPin('');
              setIsPinError(false);
            }, 800);
          }
        } else {
          setIsSubmitting(false);
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border-4 border-amber-200 overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Royal Banner */}
          <div className="p-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white relative flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="text-3xl filter drop-shadow-md">🏛️</span>
              <div>
                <h2 className="text-lg font-black tracking-tight drop-shadow leading-tight">
                  Family Treasury Council
                </h2>
                <p className="text-[11px] font-bold text-amber-100 uppercase tracking-wider">
                  4-Jar Wealth Engine & Growth
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

          {/* STEP 1: ALLOCATION SCREEN */}
          {step === 'allocate' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Live Math Counter Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/70 border-2 border-amber-200 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-600" />
                    Coins to Distribute
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-amber-200 shadow-xs">
                    <span className="text-xs font-black text-amber-900">
                      {totalAllocated} / {maxAvailable}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">allocated</span>
                  </div>
                </div>

                {/* Progress Visual Bar */}
                <div className="w-full h-3.5 rounded-full bg-amber-100 overflow-hidden p-0.5 border border-amber-200">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500"
                    style={{
                      width: `${maxAvailable > 0 ? Math.min(100, Math.round((totalAllocated / maxAvailable) * 100)) : 0}%`
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>

                {/* Dynamic Status Message */}
                <div className="mt-2.5 flex items-center justify-between text-xs font-extrabold">
                  {coinsRemaining > 0 ? (
                    <span className="text-amber-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                      {coinsRemaining} coins left to place into jars!
                    </span>
                  ) : totalAllocated > 0 ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      All {maxAvailable} coins allocated! Ready to seal!
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      Drag sliders to split coins across jars!
                    </span>
                  )}

                  <span className="text-[11px] font-bold text-slate-500">
                    Remaining: <b className="text-amber-900 font-black">{coinsRemaining}</b>
                  </span>
                </div>
              </div>

              {/* Quick Strategy Presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => applyPreset('balanced')}
                  className="flex-1 min-w-[90px] px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-black border border-slate-200 transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  ⚖️ Balanced
                </button>
                <button
                  onClick={() => applyPreset('growth')}
                  className="flex-1 min-w-[90px] px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-black border border-amber-300 transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  📈 Growth Focus
                </button>
                <button
                  onClick={() => applyPreset('saver')}
                  className="flex-1 min-w-[90px] px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-black border border-purple-300 transition-all cursor-pointer whitespace-nowrap text-center"
                >
                  🏰 Super Saver
                </button>
                <button
                  onClick={() => applyPreset('clear')}
                  className="px-2 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-black border border-rose-200 transition-all cursor-pointer"
                  title="Reset to 0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 5 JARS LIST */}
              <div className="space-y-3">
                {JARS.map((jar) => {
                  const currentJarValue = allocation[jar.key];
                  const existingCoins = (wallet as any)?.[`${jar.key}_coins`] ?? 0;

                  return (
                    <div
                      key={jar.key}
                      className={`p-3 rounded-2xl border-2 ${jar.theme.border} ${jar.theme.lightBg} transition-all`}
                    >
                      {/* Jar Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{jar.emoji}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-black text-slate-800 leading-none">
                                {jar.name}
                              </h3>
                              {jar.badge && (
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md text-white bg-gradient-to-r ${jar.theme.gradient} shadow-2xs`}>
                                  {jar.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] font-semibold text-slate-500 mt-0.5 leading-tight line-clamp-1">
                              {jar.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Jar Balance Badge */}
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-slate-900 leading-none">
                            +{currentJarValue} <span className="text-[10px] font-bold text-amber-700">🪙</span>
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 mt-0.5">
                            Bank: {existingCoins + currentJarValue}
                          </span>
                        </div>
                      </div>

                      {/* Slider + Tactile Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => handleDeltaChange(jar.key, -5)}
                          className="w-7 h-7 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 active:scale-90 flex items-center justify-center cursor-pointer"
                        >
                          -5
                        </button>

                        <input
                          type="range"
                          min="0"
                          max={maxAvailable}
                          value={currentJarValue}
                          onChange={(e) => handleSliderChange(jar.key, parseInt(e.target.value, 10) || 0)}
                          className="flex-1 accent-amber-500 cursor-pointer h-2 bg-white rounded-lg border border-slate-200"
                        />

                        <button
                          type="button"
                          onClick={() => handleDeltaChange(jar.key, 5)}
                          className="w-7 h-7 rounded-lg bg-white shadow-xs border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 active:scale-90 flex items-center justify-center cursor-pointer"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button: Proceed to Parent PIN */}
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={totalAllocated <= 0}
                  onClick={() => {
                    sound.playWoodenPop();
                    setStep('pin');
                  }}
                  className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    totalAllocated > 0
                      ? 'bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white border-b-4 border-amber-800 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 border-b-4 border-slate-300 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Seal with Parent PIN ({totalAllocated} Coins)</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          )}

          {/* STEP 2: PARENT PIN CONFIRMATION */}
          {step === 'pin' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between mb-2">
                <button
                  onClick={() => {
                    sound.playWoodenPop();
                    setStep('allocate');
                  }}
                  className="text-xs font-black text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  ← Back to Jars
                </button>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Council Authorization
                </span>
              </div>

              <div className="text-center my-2">
                <div className="w-14 h-14 rounded-full bg-purple-100 border-2 border-purple-300 mx-auto flex items-center justify-center mb-2 shadow-inner">
                  <ShieldCheck className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-base font-black text-slate-800">
                  Parent PIN Required
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Mom &amp; Dad: enter your 4-digit PIN {family?.parentPin && family.parentPin !== '1234' ? '' : '(default: 1234) '}to lock in {child?.name || 'your child'}&apos;s jars!
                </p>
              </div>

              {/* PIN Dots Display */}
              <motion.div
                animate={isPinError ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3 my-3"
              >
                {[0, 1, 2, 3].map((idx) => {
                  const isFilled = pin.length > idx;
                  return (
                    <div
                      key={idx}
                      className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                        isFilled
                          ? 'bg-purple-600 border-purple-700 scale-110 shadow-xs'
                          : isPinError
                          ? 'bg-rose-100 border-rose-400'
                          : 'bg-slate-100 border-slate-300'
                      }`}
                    />
                  );
                })}
              </motion.div>

              {isPinError && (
                <p className="text-xs font-black text-rose-500 mb-2">
                  Incorrect PIN. Please try again!
                </p>
              )}

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-[260px] mb-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((key) => {
                  if (key === 'clear') {
                    return (
                      <button
                        key={key}
                        onClick={() => handleKeypadPress('clear')}
                        className="h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black transition-all active:scale-95 cursor-pointer"
                      >
                        Clear
                      </button>
                    );
                  }
                  if (key === 'back') {
                    return (
                      <button
                        key={key}
                        onClick={() => handleKeypadPress('back')}
                        className="h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black transition-all active:scale-95 cursor-pointer"
                      >
                        ⌫
                      </button>
                    );
                  }
                  return (
                    <button
                      key={key}
                      onClick={() => handleKeypadPress(key)}
                      className="h-11 rounded-2xl bg-white hover:bg-purple-50 text-slate-800 text-base font-black border-b-2 border-slate-200 shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {key}
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-[10px] font-bold text-slate-400">
                {isSubmitting ? 'Sealing allocation in Supabase...' : 'Parent Council Verification'}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CELEBRATION */}
          {step === 'success' && (
            <div className="flex-1 p-5 flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-green-500 border-4 border-white shadow-xl flex items-center justify-center text-3xl"
              >
                🎉
              </motion.div>

              <div>
                <h3 className="text-xl font-black text-slate-800">
                  Allocation Sealed! 🏛️✨
                </h3>
                <p className="text-xs font-bold text-slate-500 mt-1">
                  The Sunday Family Treasury Council has locked in your coins!
                </p>
              </div>

              {/* Breakdown Card */}
              <div className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  New Coins Deposited:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-extrabold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span>🎮 Joy:</span>
                    <span className="text-pink-600">+{allocation.spend}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🛡️ Needs:</span>
                    <span className="text-sky-600">+{allocation.needs}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🥇 Gold:</span>
                    <span className="text-amber-600">+{allocation.gold} (+1.5%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>🏡 Land:</span>
                    <span className="text-emerald-600">+{allocation.land} (+12%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <span>🔒 Future Vault:</span>
                    <span className="text-purple-600">+{allocation.vault}</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleClose}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-sm border-b-4 border-emerald-800 shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Return to Adventure Bank</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
