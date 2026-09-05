'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { Quest, DreamGoal, FlyingCoinParticle, MascotState, ChildProfile, FamilyProfile } from '@/types/bank';
import { sound } from '@/lib/audio/soundEffects';
import * as bankService from '@/lib/bankService';
import type { ChildWallet, TreasuryAllocation } from '@/lib/bankService';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

interface BankContextType {
  coins: number;
  prevCoins: number;
  recentCoinDelta: number;
  isCoinWiggling: boolean;
  quests: Quest[];
  goal: DreamGoal;
  child: ChildProfile | null;
  family: FamilyProfile | null;
  wallet: ChildWallet | null;
  isLoading: boolean;
  isSyncing: boolean;
  flyingCoins: FlyingCoinParticle[];
  mascot: MascotState;
  isParentModalOpen: boolean;
  isTreasuryModalOpen: boolean;
  isReportModalOpen: boolean;
  isMuted: boolean;
  isGoalAchieved: boolean;
  walletTargetRef: React.RefObject<HTMLDivElement | null>;
  setParentModalOpen: (open: boolean) => void;
  setTreasuryModalOpen: (open: boolean) => void;
  setReportModalOpen: (open: boolean) => void;
  toggleMute: () => void;
  submitQuest: (questId: string, triggerRect?: DOMRect) => void;
  approveQuest: (questId: string) => void;
  rejectQuest: (questId: string) => void;
  addCustomQuest: (title: string, category: string, emoji: string, coins: number, theme: Quest['theme']) => void;
  adjustCoins: (delta: number) => void;
  updateGoal: (title: string, targetCoins: number, emoji: string) => void;
  verifyParentPin: (inputPin: string) => Promise<boolean>;
  allocateTreasury: (allocation: TreasuryAllocation) => Promise<{ success: boolean; error?: string }>;
  applyGrowth: () => Promise<{ success: boolean; goldGain: number; landGain: number }>;
  refreshWallet: () => Promise<void>;
  selectChild?: (childId: string) => Promise<void>;
  resetDemoData: () => void;
  triggerConfettiBlast: () => void;
  removeFlyingCoin: (id: string) => void;
  interactWithMascot: () => void;
}

const DEFAULT_QUESTS: Quest[] = [
  {
    id: bankService.STATIC_UUIDS.quests[0],
    title: 'Make the Bed',
    category: 'Morning Habit',
    emoji: '🛏️',
    coins: 10,
    status: 'ready',
    theme: 'pink',
    description: 'Fluff pillows and pull up the cozy blanket neatly!'
  },
  {
    id: bankService.STATIC_UUIDS.quests[1],
    title: 'Read Story Book',
    category: 'Brain Power',
    emoji: '📚',
    coins: 20,
    status: 'ready',
    theme: 'sky',
    description: 'Read 2 chapters or 1 full picture storybook!'
  },
  {
    id: bankService.STATIC_UUIDS.quests[2],
    title: 'Eat Green Veggies',
    category: 'Healthy Hero',
    emoji: '🥦',
    coins: 15,
    status: 'ready',
    theme: 'emerald',
    description: 'Finish all delicious broccoli and crunchy greens on your plate!'
  },
  {
    id: bankService.STATIC_UUIDS.quests[3],
    title: 'Toy Tidy-Up',
    category: 'Room Master',
    emoji: '🧸',
    coins: 10,
    status: 'ready',
    theme: 'amber',
    description: 'Put all toy blocks, cars, and plushies back into the toy chest!'
  }
];

const DEFAULT_GOAL: DreamGoal = {
  id: bankService.STATIC_UUIDS.goal,
  title: 'Super Magic Castle 🏰',
  targetCoins: 300,
  emoji: '🏰',
  description: 'The enchanted glowing fantasy castle playset with flying flags!'
};

const MASCOT_MESSAGES = [
  "You're doing amazing, Explorer! Every coin counts! ⭐",
  "Look at your savings grow! Super Magic Castle is getting closer! 🏰",
  "High five! You're the best mission hero ever! ✋✨",
  "Tidy rooms make happy hearts! Keep up the super work! 🌟",
  "Beep boop! Barnaby is cheering for you! 🐻💛"
];

const BankContext = createContext<BankContextType | undefined>(undefined);

const STORAGE_KEY_COINS = 'tiny_tales_coins_v2';
const STORAGE_KEY_QUESTS = 'tiny_tales_quests_v2';
const STORAGE_KEY_GOAL = 'tiny_tales_goal_v2';

export function BankProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [coins, setCoins] = useState<number>(0);
  const [prevCoins, setPrevCoins] = useState<number>(0);
  const [recentCoinDelta, setRecentCoinDelta] = useState<number>(0);
  const [isCoinWiggling, setIsCoinWiggling] = useState<boolean>(false);
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUESTS);
  const [goal, setGoal] = useState<DreamGoal>(DEFAULT_GOAL);
  const [family, setFamily] = useState<FamilyProfile | null>(null);
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [wallet, setWallet] = useState<ChildWallet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [flyingCoins, setFlyingCoins] = useState<FlyingCoinParticle[]>([]);
  const [isParentModalOpen, setParentModalOpen] = useState<boolean>(false);
  const [isTreasuryModalOpen, setTreasuryModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [celebrationAchieved, setCelebrationAchieved] = useState<boolean>(false);
  const [mascot, setMascot] = useState<MascotState>({
    mood: 'happy',
    message: "Hi Hero! Tap 'I Did It!' whenever you finish a mission! 🌟",
    reactionCount: 0
  });

  const walletTargetRef = React.useRef<HTMLDivElement | null>(null);
  const childRef = React.useRef<ChildProfile | null>(null);
  const familyRef = React.useRef<FamilyProfile | null>(null);

  useEffect(() => {
    childRef.current = child;
  }, [child]);

  useEffect(() => {
    familyRef.current = family;
  }, [family]);

  // Reset all state cleanly when signing out or when user is null
  const resetAllStateToEmpty = useCallback(() => {
    setFamily(null);
    setChild(null);
    childRef.current = null;
    familyRef.current = null;
    setCoins(0);
    setPrevCoins(0);
    setWallet(null);
    setQuests([]);
    setIsLoading(false);
  }, []);

  // Listen directly to Supabase auth events (e.g. signOut) to reset state immediately
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        resetAllStateToEmpty();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [resetAllStateToEmpty]);

  // Load initial data directly from Supabase on mount or when authenticated user session changes
  useEffect(() => {
    let isMounted = true;

    // Halt any data queries when user is null and reset state to empty
    if (!user) {
      resetAllStateToEmpty();
      return;
    }

    async function loadData() {
      setIsLoading(true);
      try {
        const initialData = await bankService.fetchInitialData(user?.email, user?.name);
        if (!isMounted) return;

        setFamily(initialData.family);
        setChild(initialData.child);
        childRef.current = initialData.child;
        familyRef.current = initialData.family;
        setCoins(initialData.coinBalance);
        setPrevCoins(initialData.coinBalance);
        setGoal(initialData.goal);
        setQuests(initialData.quests);

        // Also fetch child's treasury wallet
        if (initialData.child?.id) {
          const childWallet = await bankService.fetchChildWallet(initialData.child.id);
          if (isMounted) {
            setWallet(childWallet);
          }
        }
      } catch (err) {
        console.error('[BankContext] Error loading initial Supabase data:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsMuted(sound.isMuted());
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user, resetAllStateToEmpty]);

  // Backup cache in localStorage for instant offline re-rendering
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COINS, coins.toString());
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
      localStorage.setItem(STORAGE_KEY_GOAL, JSON.stringify(goal));
    } catch {
      // Ignore
    }
  }, [coins, quests, goal]);

  const triggerConfettiBlast = useCallback(() => {
    try {
      const count = 200;
      const defaults = {
        origin: { y: 0.6 },
        colors: ['#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#38BDF8', '#FEF08A']
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, []);

  const triggerCoinAnimation = useCallback((delta: number) => {
    setRecentCoinDelta(delta);
    setIsCoinWiggling(true);
    sound.playCoinChime();
    setTimeout(() => {
      setIsCoinWiggling(false);
    }, 1200);
  }, []);

  // Check goal status when coins change
  useEffect(() => {
    if (coins >= goal.targetCoins && !celebrationAchieved) {
      setCelebrationAchieved(true);
      triggerConfettiBlast();
      sound.playCelebrationFanfare();
      setMascot({
        mood: 'cheering',
        message: "🎉 YOU DID IT!! You unlocked your Dream Goal! Super celebration!! 🏰✨",
        reactionCount: Date.now()
      });
    } else if (coins < goal.targetCoins && celebrationAchieved) {
      setCelebrationAchieved(false);
    }
  }, [coins, goal.targetCoins, celebrationAchieved, triggerConfettiBlast]);

  const toggleMute = useCallback(() => {
    const next = sound.toggleMute();
    setIsMuted(next);
  }, []);

  const removeFlyingCoin = useCallback((id: string) => {
    setFlyingCoins((prev) => prev.filter((p) => p.id !== id));
  }, []);

  /**
   * Child taps "I Did It!" / "Done!":
   * 1. Optimistic UI update immediately.
   * 2. Spawns flying coin particle & plays wooden pop.
   * 3. Syncs quest status = 'pending' directly with live Supabase database.
   */
  const submitQuest = useCallback((questId: string, triggerRect?: DOMRect) => {
    sound.playWoodenPop();

    // Spawn flying coin particle
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (triggerRect) {
      startX = triggerRect.left + triggerRect.width / 2;
      startY = triggerRect.top + triggerRect.height / 2;
    }

    let targetX = window.innerWidth / 2 - 20;
    let targetY = 40;

    if (walletTargetRef.current) {
      const rect = walletTargetRef.current.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;
    }

    const quest = quests.find(q => q.id === questId);
    const amount = quest?.coins ?? 10;

    const newParticle: FlyingCoinParticle = {
      id: `particle-${Date.now()}-${Math.random()}`,
      startX,
      startY,
      targetX,
      targetY,
      amount
    };

    setFlyingCoins((prev) => [...prev, newParticle]);

    // Optimistic UI state update
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: 'pending', submittedAt: Date.now() }
          : q
      )
    );

    // Mascot excited reaction
    setMascot({
      mood: 'excited',
      message: `Woohoo! You completed "${quest?.title || 'a mission'}"! Checking with Mom & Dad! ⏳💛`,
      reactionCount: Date.now()
    });

    // Sync directly to Supabase in background
    setIsSyncing(true);
    bankService.submitQuest(questId).finally(() => {
      setIsSyncing(false);
    });
  }, [quests]);

  /**
   * Parent approves quest:
   * 1. Optimistic coin increment and quest status = 'approved'.
   * 2. Plays arcade chime & triggers counter wiggle and cheering mascot.
   * 3. Syncs with Supabase: sets quest 'completed' and atomically increments child coin_balance.
   */
  const approveQuest = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return;

    sound.playApprovalDing();
    const award = quest.coins;

    setPrevCoins(coins);
    setCoins((c) => c + award);
    triggerCoinAnimation(award);

    // Optimistically mark quest as approved
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: 'approved' }
          : q
      )
    );

    setMascot({
      mood: 'cheering',
      message: `Mom & Dad approved "${quest.title}"! +${award} Golden Coins in your bank! 🪙✨`,
      reactionCount: Date.now()
    });

    // Live sync to Supabase: atomic update in children & quests tables
    const activeChildId = child?.id || childRef.current?.id || '';
    if (activeChildId) {
      setIsSyncing(true);
      bankService.approveQuest(questId, award, activeChildId).then((result) => {
        if (result && typeof result.newBalance === 'number') {
          // Reconcile exact balance from Supabase
          setCoins(result.newBalance);
          setChild((c) => c ? { ...c, coinBalance: result.newBalance } : null);
        }
      }).finally(() => {
        setIsSyncing(false);
      });
    }
  }, [quests, coins, triggerCoinAnimation, child]);

  /**
   * Parent rejects quest / requests retry:
   * 1. Reverts quest status back to 'ready'.
   * 2. Syncs with Supabase to reset status to 'available'.
   */
  const rejectQuest = useCallback((questId: string) => {
    const quest = quests.find(q => q.id === questId);
    sound.playErrorBuzz();

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? { ...q, status: 'ready' }
          : q
      )
    );

    setMascot({
      mood: 'thinking',
      message: `Mom & Dad asked to double check "${quest?.title || 'this mission'}". You got this, try again! 🌟`,
      reactionCount: Date.now()
    });

    setIsSyncing(true);
    bankService.rejectQuest(questId).finally(() => {
      setIsSyncing(false);
    });
  }, [quests]);

  /**
   * Parent adds custom quest:
   * 1. Inserts into UI immediately.
   * 2. Saves to Supabase quests table.
   */
  const addCustomQuest = useCallback((
    title: string,
    category: string,
    emoji: string,
    awardCoins: number,
    theme: Quest['theme']
  ) => {
    sound.playPinClick(7);
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'b0000000-0000-0000-0000-' + Date.now().toString().slice(-12).padStart(12, '0');
    const newQuest: Quest = {
      id: tempId,
      title,
      category: category || 'Daily Chores',
      emoji: emoji || '⭐',
      coins: awardCoins,
      status: 'ready',
      theme,
      description: 'Custom mission added with love by Mom & Dad!'
    };

    setQuests((prev) => [newQuest, ...prev]);

    const activeChildId = child?.id || childRef.current?.id;
    if (activeChildId) {
      setIsSyncing(true);
      bankService.addCustomQuest(activeChildId, title, emoji, awardCoins, category).then((saved) => {
        if (saved?.id) {
          // Replace temporary ID with database ID
          setQuests((prev) =>
            prev.map((q) => (q.id === tempId ? { ...q, id: saved.id } : q))
          );
        }
      }).finally(() => {
        setIsSyncing(false);
      });
    }
  }, [child]);

  /**
   * Parent adjusts coins manually:
   */
  const adjustCoins = useCallback((delta: number) => {
    setPrevCoins(coins);
    setCoins((c) => {
      const next = Math.max(0, c + delta);
      return next;
    });

    if (delta > 0) {
      triggerCoinAnimation(delta);
    } else {
      sound.playPinClick();
    }

    const activeChildId = child?.id || childRef.current?.id;
    if (activeChildId) {
      setIsSyncing(true);
      bankService.adjustChildCoins(activeChildId, delta).then((newBalance) => {
        if (newBalance !== null) {
          setCoins(newBalance);
          setChild((c) => c ? { ...c, coinBalance: newBalance } : null);
        }
      }).finally(() => {
        setIsSyncing(false);
      });
    }
  }, [coins, triggerCoinAnimation, child]);

  /**
   * Parent updates dream goal:
   */
  const updateGoal = useCallback((title: string, targetCoins: number, emoji: string) => {
    sound.playPinClick();
    const updatedTitle = title.trim() || goal.title;
    const updatedTarget = Math.max(10, targetCoins);
    const updatedEmoji = emoji.trim() || goal.emoji;

    setGoal((prev) => ({
      ...prev,
      title: updatedTitle,
      targetCoins: updatedTarget,
      emoji: updatedEmoji
    }));

    if (goal.id) {
      setIsSyncing(true);
      bankService.updateGoal(goal.id, updatedTitle, updatedTarget, updatedEmoji).finally(() => {
        setIsSyncing(false);
      });
    }
  }, [goal]);

  /**
   * Parent PIN verification: checks parent's actual PIN from the profile/context,
   * falling back to '1234' only as a default if no custom PIN is set in the profile.
   */
  const verifyParentPin = useCallback(async (inputPin: string): Promise<boolean> => {
    const configuredPin = family?.parentPin || familyRef.current?.parentPin;
    if (configuredPin) {
      if (inputPin === configuredPin) return true;
    }

    const familyId = family?.id || familyRef.current?.id || '';
    if (familyId && bankService.isValidUUID(familyId)) {
      const isValid = await bankService.verifyParentPin(familyId, inputPin);
      if (isValid) return true;
    }

    // Default fallback to 1234 only if no custom PIN is configured
    if (!configuredPin || configuredPin === '1234') {
      return inputPin === '1234';
    }

    return false;
  }, [family]);

  /**
   * Council: Allocate Sunday Treasury coins to jars
   */
  const allocateTreasury = useCallback(
    async (allocation: TreasuryAllocation): Promise<{ success: boolean; error?: string }> => {
      const activeChildId = child?.id || childRef.current?.id;
      if (!activeChildId) return { success: false, error: 'No active child profile' };

      setIsSyncing(true);
      try {
        const result = await bankService.allocateSundayTreasury(activeChildId, allocation);
        if (result.success && result.wallet) {
          setWallet(result.wallet);
          if (typeof result.remainingCoins === 'number') {
            setCoins(result.remainingCoins);
            setChild((c) => (c ? { ...c, coinBalance: result.remainingCoins! } : null));
          }
          sound.playApprovalDing();
          triggerConfettiBlast();
          setMascot({
            mood: 'cheering',
            message: '🏛️ Sunday Treasury Allocation Sealed! Your adventure jars are filled! 🌟✨',
            reactionCount: Date.now()
          });
          return { success: true };
        }
        return { success: false, error: 'Failed to record jar allocation' };
      } catch (err: any) {
        console.error('[BankContext] allocateTreasury error:', err);
        return { success: false, error: err?.message || 'Unexpected allocation error' };
      } finally {
        setIsSyncing(false);
      }
    },
    [child, triggerConfettiBlast]
  );

  /**
   * Apply passive micro-growth (+1.5% daily gold, +12% weekly land)
   */
  const applyGrowth = useCallback(async (): Promise<{
    success: boolean;
    goldGain: number;
    landGain: number;
  }> => {
    const activeChildId = child?.id || childRef.current?.id;
    if (!activeChildId) return { success: false, goldGain: 0, landGain: 0 };

    setIsSyncing(true);
    try {
      const result = await bankService.applyPassiveGrowth(activeChildId);
      if (result.success && result.wallet) {
        setWallet(result.wallet);
        const totalGain = result.goldGain + result.landGain;
        if (totalGain > 0) {
          sound.playCoinChime();
          triggerConfettiBlast();
          setMascot({
            mood: 'excited',
            message: `🌱 Passive Wealth Harvest! Gold +${result.goldGain}, Land +${result.landGain} added to your jars! 🥇🏡`,
            reactionCount: Date.now()
          });
        }
        return { success: true, goldGain: result.goldGain, landGain: result.landGain };
      }
      return { success: false, goldGain: 0, landGain: 0 };
    } catch (err) {
      console.error('[BankContext] applyGrowth error:', err);
      return { success: false, goldGain: 0, landGain: 0 };
    } finally {
      setIsSyncing(false);
    }
  }, [child, triggerConfettiBlast]);

  /**
   * Refresh wallet state from Supabase
   */
  const refreshWallet = useCallback(async () => {
    if (!user) return;
    const activeChildId = child?.id || childRef.current?.id;
    if (!activeChildId) return;
    const latestWallet = await bankService.fetchChildWallet(activeChildId);
    setWallet(latestWallet);
  }, [user, child]);

  /**
   * Select a child profile dynamically
   */
  const selectChild = useCallback(async (selectedChildId: string) => {
    if (!user || !selectedChildId) return;
    setIsLoading(true);
    try {
      const childData = await bankService.fetchChildProfile(selectedChildId);
      if (childData) {
        setChild(childData);
        childRef.current = childData;
        setCoins(childData.coinBalance);
        setPrevCoins(childData.coinBalance);

        // Fetch wallet for this child
        const childWallet = await bankService.fetchChildWallet(selectedChildId);
        setWallet(childWallet);
      }
    } catch (err) {
      console.error('[BankContext] selectChild error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const resetDemoData = useCallback(async () => {
    if (!user) return;
    sound.playWoodenPop();
    setIsLoading(true);
    try {
      const initialData = await bankService.fetchInitialData(user?.email, user?.name);
      setFamily(initialData.family);
      setChild(initialData.child);
      setCoins(initialData.coinBalance);
      setPrevCoins(initialData.coinBalance);
      setGoal(initialData.goal);
      setQuests(initialData.quests);
      if (initialData.child?.id) {
        const latestWallet = await bankService.fetchChildWallet(initialData.child.id);
        setWallet(latestWallet);
      }
      setCelebrationAchieved(false);
      setMascot({
        mood: 'happy',
        message: "Demo bank reset! Ready for fresh new adventures! 🎈",
        reactionCount: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const interactWithMascot = useCallback(() => {
    sound.playWoodenPop();
    const randomMsg = MASCOT_MESSAGES[Math.floor(Math.random() * MASCOT_MESSAGES.length)];
    setMascot({
      mood: 'excited',
      message: randomMsg,
      reactionCount: Date.now()
    });
  }, []);

  const isGoalAchieved = coins >= goal.targetCoins;

  return (
    <BankContext.Provider
      value={{
        coins,
        prevCoins,
        recentCoinDelta,
        isCoinWiggling,
        quests,
        goal,
        child,
        family,
        wallet,
        isLoading,
        isSyncing,
        flyingCoins,
        mascot,
        isParentModalOpen,
        isTreasuryModalOpen,
        isReportModalOpen,
        isMuted,
        isGoalAchieved,
        walletTargetRef,
        setParentModalOpen,
        setTreasuryModalOpen,
        setReportModalOpen,
        toggleMute,
        submitQuest,
        approveQuest,
        rejectQuest,
        addCustomQuest,
        adjustCoins,
        updateGoal,
        verifyParentPin,
        allocateTreasury,
        applyGrowth,
        refreshWallet,
        selectChild,
        resetDemoData,
        triggerConfettiBlast,
        removeFlyingCoin,
        interactWithMascot,
      }}
    >
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
}
