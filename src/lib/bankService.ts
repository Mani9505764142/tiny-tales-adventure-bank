import { supabase } from '@/lib/supabaseClient';
import { Quest, DreamGoal, ChildProfile, FamilyProfile, QuestTheme } from '@/types/bank';

export interface InitialBankData {
  family: FamilyProfile;
  child: ChildProfile;
  coinBalance: number;
  goal: DreamGoal;
  quests: Quest[];
  isOfflineFallback?: boolean;
}

const DEFAULT_FAMILY_NAME = 'The Wonder Family';
const DEFAULT_PARENT_PIN = '1234';
const DEFAULT_CHILD_NAME = 'Aarav';
const DEFAULT_COIN_BALANCE = 0;

const DEFAULT_STARTER_QUESTS: Array<{
  title: string;
  category: string;
  icon: string;
  reward_coins: number;
  theme: QuestTheme;
  description: string;
}> = [
  {
    title: 'Make the Bed',
    category: 'Morning Habit',
    icon: '🛏️',
    reward_coins: 10,
    theme: 'pink',
    description: 'Fluff pillows and pull up the cozy blanket neatly!'
  },
  {
    title: 'Read Story Book',
    category: 'Brain Power',
    icon: '📚',
    reward_coins: 20,
    theme: 'sky',
    description: 'Read 2 chapters or 1 full picture storybook!'
  },
  {
    title: 'Eat Green Veggies',
    category: 'Healthy Hero',
    icon: '🥦',
    reward_coins: 15,
    theme: 'emerald',
    description: 'Finish all delicious broccoli and crunchy greens on your plate!'
  },
  {
    title: 'Toy Tidy-Up',
    category: 'Room Master',
    icon: '🧸',
    reward_coins: 10,
    theme: 'amber',
    description: 'Put all toy blocks, cars, and plushies back into the toy chest!'
  }
];

const DEFAULT_GOAL_CONFIG = {
  title: 'Super Magic Castle 🏰',
  target_coins: 300,
  icon: '🏰',
  description: 'The enchanted glowing fantasy castle playset with flying flags!'
};

/**
 * Helper to map category/index to UI Theme
 */
export function getThemeForCategory(category: string, index = 0): QuestTheme {
  const cat = category.toLowerCase();
  if (cat.includes('morning') || cat.includes('bed')) return 'pink';
  if (cat.includes('brain') || cat.includes('read') || cat.includes('book')) return 'sky';
  if (cat.includes('health') || cat.includes('veg') || cat.includes('eat')) return 'emerald';
  if (cat.includes('room') || cat.includes('toy') || cat.includes('clean')) return 'amber';
  
  const themePalette: QuestTheme[] = ['purple', 'pink', 'sky', 'emerald', 'amber'];
  return themePalette[index % themePalette.length];
}

/**
 * Helper to get default quest descriptions
 */
function getQuestDescription(title: string, category: string): string {
  const starter = DEFAULT_STARTER_QUESTS.find(
    (q) => q.title.toLowerCase() === title.toLowerCase()
  );
  if (starter) return starter.description;
  return `${category} mission added by Mom & Dad! Complete to earn golden coins!`;
}

export const STATIC_UUIDS = {
  family: 'f0000000-0000-0000-0000-000000000001',
  child: 'a0000000-0000-0000-0000-000000000001',
  goal: 'c0000000-0000-0000-0000-000000000001',
  quests: [
    'b0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000004'
  ]
};

export function isValidUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/**
 * Fallback generator when Supabase tables are blocked by RLS or offline
 */
function getLocalFallbackData(): InitialBankData {
  return {
    isOfflineFallback: true,
    family: {
      id: STATIC_UUIDS.family,
      name: DEFAULT_FAMILY_NAME,
      parentPin: DEFAULT_PARENT_PIN
    },
    child: {
      id: STATIC_UUIDS.child,
      familyId: STATIC_UUIDS.family,
      name: DEFAULT_CHILD_NAME,
      coinBalance: 0
    },
    coinBalance: 0,
    goal: {
      id: STATIC_UUIDS.goal,
      title: DEFAULT_GOAL_CONFIG.title,
      targetCoins: DEFAULT_GOAL_CONFIG.target_coins,
      emoji: DEFAULT_GOAL_CONFIG.icon,
      description: DEFAULT_GOAL_CONFIG.description
    },
    quests: DEFAULT_STARTER_QUESTS.map((q, idx) => ({
      id: STATIC_UUIDS.quests[idx] || `b0000000-0000-0000-0000-00000000000${idx + 1}`,
      title: q.title,
      category: q.category,
      emoji: q.icon,
      coins: q.reward_coins,
      status: 'ready',
      theme: q.theme,
      description: q.description
    }))
  };
}

interface DbFamily {
  id: string;
  name: string;
  email?: string;
  parent_pin: string;
  created_at?: string;
}

interface DbChild {
  id: string;
  family_id: string;
  name: string;
  coin_balance: number;
  created_at?: string;
}

/**
 * 1. fetchInitialData(userEmail?: string, familyName?: string):
 * - Loads the family and child row dynamically from Supabase based on user session email.
 * - Defaults starting balance to 0 for pristine production accounts.
 */
export async function fetchInitialData(userEmail?: string, familyName?: string): Promise<InitialBankData> {
  const targetEmail = userEmail?.trim() || 'demo@tinytaleskids.com';
  const targetFamilyName = familyName?.trim() || DEFAULT_FAMILY_NAME;

  try {
    // 1. Query for existing family by email
    const { data: existingFamily, error: famError } = await supabase
      .from('families')
      .select('*')
      .eq('email', targetEmail)
      .maybeSingle();

    if (famError) {
      console.warn(
        '[bankService] Could not read families table. If RLS is enabled, please execute supabase_schema.sql. Falling back to local demo state.',
        famError.message
      );
      return getLocalFallbackData();
    }

    let activeFamily: DbFamily | null = existingFamily ? (existingFamily as DbFamily) : null;
    let activeChild: DbChild | null = null;

    // 2. If no family found, auto-seed the family and child
    if (!activeFamily) {
      console.info('[bankService] No family detected in Supabase. Auto-seeding family & child for:', targetEmail);
      
      const { data: newFamily, error: createFamError } = await supabase
        .from('families')
        .insert({
          name: targetFamilyName,
          email: targetEmail,
          parent_pin: DEFAULT_PARENT_PIN
        })
        .select()
        .single();

      if (createFamError || !newFamily) {
        console.warn(
          '[bankService] Failed to seed family row (likely RLS policy). Run supabase_schema.sql in Supabase SQL editor.',
          createFamError?.message
        );
        return getLocalFallbackData();
      }

      const createdFamily: DbFamily = newFamily;
      activeFamily = createdFamily;

      // Seed child Aarav with 0 starting balance
      const { data: newChild, error: createChildError } = await supabase
        .from('children')
        .insert({
          family_id: createdFamily.id,
          name: DEFAULT_CHILD_NAME,
          coin_balance: DEFAULT_COIN_BALANCE
        })
        .select()
        .single();

      if (createChildError || !newChild) {
        console.warn('[bankService] Failed to seed child row:', createChildError?.message);
        return getLocalFallbackData();
      }

      const createdChild: DbChild = newChild;
      activeChild = createdChild;

      // Seed 4 starter quests
      const starterQuestRows = DEFAULT_STARTER_QUESTS.map((q) => ({
        child_id: createdChild.id,
        title: q.title,
        category: q.category,
        icon: q.icon,
        reward_coins: q.reward_coins,
        status: 'available'
      }));

      await supabase.from('quests').insert(starterQuestRows);

      // Seed dream goal
      await supabase.from('goals').insert({
        child_id: createdChild.id,
        title: DEFAULT_GOAL_CONFIG.title,
        target_coins: DEFAULT_GOAL_CONFIG.target_coins,
        icon: DEFAULT_GOAL_CONFIG.icon
      });
    } else {
      // Family exists: fetch child
      const currentFamily = activeFamily;
      const { data: children, error: childError } = await supabase
        .from('children')
        .select('*')
        .eq('family_id', currentFamily.id)
        .order('created_at', { ascending: true })
        .limit(1);

      if (childError || !children || children.length === 0) {
        // Create child for existing family if missing
        const { data: newChild } = await supabase
          .from('children')
          .insert({
            family_id: currentFamily.id,
            name: DEFAULT_CHILD_NAME,
            coin_balance: DEFAULT_COIN_BALANCE
          })
          .select()
          .single();

        activeChild = newChild as DbChild;
      } else {
        activeChild = children[0] as DbChild;
      }
    }

    if (!activeFamily || !activeChild) {
      return getLocalFallbackData();
    }

    // 3. Fetch live quests for child
    const { data: questsData, error: questsError } = await supabase
      .from('quests')
      .select('*')
      .eq('child_id', activeChild.id)
      .order('created_at', { ascending: true });

    let liveQuests: Quest[] = [];
    if (questsError || !questsData || questsData.length === 0) {
      // If quests table empty for child, seed them
      const starterQuestRows = DEFAULT_STARTER_QUESTS.map((q) => ({
        child_id: activeChild.id,
        title: q.title,
        category: q.category,
        icon: q.icon,
        reward_coins: q.reward_coins,
        status: 'available'
      }));
      const { data: seededQuests } = await supabase
        .from('quests')
        .insert(starterQuestRows)
        .select();

      const items = seededQuests && seededQuests.length > 0 ? seededQuests : starterQuestRows;
      liveQuests = items.map((q: any, idx: number) => ({
        id: (q.id && isValidUUID(q.id)) ? q.id : (STATIC_UUIDS.quests[idx] || `b0000000-0000-0000-0000-00000000000${idx + 1}`),
        title: q.title,
        category: q.category,
        emoji: q.icon,
        coins: q.reward_coins,
        status: 'ready',
        theme: getThemeForCategory(q.category, idx),
        description: getQuestDescription(q.title, q.category)
      }));
    } else {
      liveQuests = questsData.map((q, idx) => ({
        id: (q.id && isValidUUID(q.id)) ? q.id : (STATIC_UUIDS.quests[idx] || `b0000000-0000-0000-0000-00000000000${idx + 1}`),
        title: q.title,
        category: q.category,
        emoji: q.icon,
        coins: q.reward_coins,
        status: q.status === 'completed' ? 'approved' : q.status === 'pending' ? 'pending' : 'ready',
        theme: getThemeForCategory(q.category, idx),
        description: getQuestDescription(q.title, q.category)
      }));
    }

    // 4. Fetch live goal for child
    const { data: goalsData } = await supabase
      .from('goals')
      .select('*')
      .eq('child_id', activeChild.id)
      .order('created_at', { ascending: true })
      .limit(1);

    let liveGoal: DreamGoal;
    if (!goalsData || goalsData.length === 0) {
      const { data: newGoal } = await supabase
        .from('goals')
        .insert({
          child_id: activeChild.id,
          title: DEFAULT_GOAL_CONFIG.title,
          target_coins: DEFAULT_GOAL_CONFIG.target_coins,
          icon: DEFAULT_GOAL_CONFIG.icon
        })
        .select()
        .single();

      liveGoal = {
        id: (newGoal?.id && isValidUUID(newGoal.id)) ? newGoal.id : STATIC_UUIDS.goal,
        title: newGoal?.title || DEFAULT_GOAL_CONFIG.title,
        targetCoins: newGoal?.target_coins || DEFAULT_GOAL_CONFIG.target_coins,
        emoji: newGoal?.icon || DEFAULT_GOAL_CONFIG.icon,
        description: DEFAULT_GOAL_CONFIG.description
      };
    } else {
      const g = goalsData[0];
      liveGoal = {
        id: (g.id && isValidUUID(g.id)) ? g.id : STATIC_UUIDS.goal,
        title: g.title,
        targetCoins: g.target_coins,
        emoji: g.icon || '🏰',
        description: DEFAULT_GOAL_CONFIG.description
      };
    }

    return {
      family: {
        id: activeFamily.id,
        name: activeFamily.name,
        parentPin: activeFamily.parent_pin
      },
      child: {
        id: activeChild.id,
        familyId: activeFamily.id,
        name: activeChild.name,
        coinBalance: activeChild.coin_balance
      },
      coinBalance: activeChild.coin_balance,
      goal: liveGoal,
      quests: liveQuests
    };
  } catch (err: any) {
    console.error('[bankService] Unexpected error in fetchInitialData:', err);
    return getLocalFallbackData();
  }
}

/**
 * 2. submitQuest(questId: string):
 * Update quest row in `quests` table to set `status = 'pending'`.
 */
export async function submitQuest(questId: string) {
  try {
    if (!isValidUUID(questId)) {
      return null;
    }
    const { data, error } = await supabase
      .from('quests')
      .update({ status: 'pending' })
      .eq('id', questId)
      .select();

    if (error) {
      console.warn('[bankService] submitQuest DB notice:', error.message);
    }
    return data;
  } catch (err) {
    console.error('[bankService] submitQuest error:', err);
  }
}

/**
 * 3. approveQuest(questId: string, rewardCoins: number, childId: string):
 * - Update quest status to `'completed'`.
 * - Atomically increment the child's `coin_balance` in `children` by `rewardCoins`.
 */
export async function approveQuest(questId: string, rewardCoins: number, childId: string) {
  try {
    if (!isValidUUID(questId) || !isValidUUID(childId)) {
      return null;
    }
    // Mark quest as completed
    const { error: questError } = await supabase
      .from('quests')
      .update({ status: 'completed' })
      .eq('id', questId);

    if (questError) {
      console.warn('[bankService] approveQuest status update notice:', questError.message);
    }

    // Atomically increment child balance
    const { data: child, error: childFetchError } = await supabase
      .from('children')
      .select('coin_balance')
      .eq('id', childId)
      .single();

    if (childFetchError) {
      console.warn('[bankService] Could not fetch child for balance increment:', childFetchError.message);
      return null;
    }

    const newBalance = (child?.coin_balance ?? 0) + rewardCoins;

    const { data: updatedChild, error: updateError } = await supabase
      .from('children')
      .update({ coin_balance: newBalance })
      .eq('id', childId)
      .select()
      .single();

    if (updateError) {
      console.warn('[bankService] Could not update child balance in DB:', updateError.message);
    }

    return {
      questId,
      newBalance: updatedChild ? updatedChild.coin_balance : newBalance
    };
  } catch (err) {
    console.error('[bankService] approveQuest error:', err);
    return null;
  }
}

/**
 * 4. rejectQuest(questId: string):
 * Reset quest status back to `'available'`.
 */
export async function rejectQuest(questId: string) {
  try {
    if (!isValidUUID(questId)) {
      return null;
    }
    const { data, error } = await supabase
      .from('quests')
      .update({ status: 'available' })
      .eq('id', questId)
      .select();

    if (error) {
      console.warn('[bankService] rejectQuest DB notice:', error.message);
    }
    return data;
  } catch (err) {
    console.error('[bankService] rejectQuest error:', err);
  }
}

/**
 * 5. addCustomQuest(childId: string, title: string, icon: string, rewardCoins: number, category?: string):
 * Insert new row into `quests` table.
 */
export async function addCustomQuest(
  childId: string,
  title: string,
  icon: string,
  rewardCoins: number,
  category = 'Daily Chores'
) {
  try {
    if (!isValidUUID(childId)) {
      return null;
    }
    const { data, error } = await supabase
      .from('quests')
      .insert({
        child_id: childId,
        title: title.trim(),
        category,
        icon: icon || '⭐',
        reward_coins: Math.max(1, rewardCoins),
        status: 'available'
      })
      .select()
      .single();

    if (error) {
      console.warn('[bankService] addCustomQuest DB notice:', error.message);
    }
    return data;
  } catch (err) {
    console.error('[bankService] addCustomQuest error:', err);
    return null;
  }
}

/**
 * 6. updateGoal(goalId: string, title: string, targetCoins: number, icon?: string):
 * Update goal details in `goals` table.
 */
export async function updateGoal(
  goalId: string,
  title: string,
  targetCoins: number,
  icon?: string
) {
  try {
    if (!isValidUUID(goalId)) {
      return null;
    }
    const payload: Record<string, any> = {
      title: title.trim(),
      target_coins: Math.max(10, targetCoins)
    };
    if (icon) {
      payload.icon = icon.trim();
    }

    const { data, error } = await supabase
      .from('goals')
      .update(payload)
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.warn('[bankService] updateGoal DB notice:', error.message);
    }
    return data;
  } catch (err) {
    console.error('[bankService] updateGoal error:', err);
    return null;
  }
}

/**
 * 7. verifyParentPin(familyId: string, inputPin: string):
 * Check if inputPin matches the family's `parent_pin`.
 */
export async function verifyParentPin(familyId: string, inputPin: string): Promise<boolean> {
  try {
    // If demo fallback family or invalid UUID
    if (!familyId || !isValidUUID(familyId)) {
      return inputPin === DEFAULT_PARENT_PIN;
    }

    const { data, error } = await supabase
      .from('families')
      .select('parent_pin')
      .eq('id', familyId)
      .maybeSingle();

    if (error || !data) {
      // Safe fallback to default PIN
      return inputPin === DEFAULT_PARENT_PIN;
    }

    return data.parent_pin === inputPin;
  } catch (err) {
    console.error('[bankService] verifyParentPin error:', err);
    return inputPin === DEFAULT_PARENT_PIN;
  }
}

/**
 * Adjust coins directly (e.g. from parent manual coin adjustment)
 */
export async function adjustChildCoins(childId: string, delta: number): Promise<number | null> {
  try {
    if (!childId || !isValidUUID(childId)) return null;

    const { data: child, error: childFetchError } = await supabase
      .from('children')
      .select('coin_balance')
      .eq('id', childId)
      .single();

    if (childFetchError || !child) return null;

    const newBalance = Math.max(0, child.coin_balance + delta);

    const { data: updatedChild, error: updateError } = await supabase
      .from('children')
      .update({ coin_balance: newBalance })
      .eq('id', childId)
      .select()
      .single();

    if (updateError) {
      console.warn('[bankService] adjustChildCoins update notice:', updateError.message);
      return newBalance;
    }

    return updatedChild?.coin_balance ?? newBalance;
  } catch (err) {
    console.error('[bankService] adjustChildCoins error:', err);
    return null;
  }
}

export interface ChildWallet {
  id?: string;
  child_id: string;
  spend_coins: number;
  needs_coins: number;
  gold_coins: number;
  land_coins: number;
  vault_coins: number;
  updated_at?: string;
}

export interface TreasuryLedgerEntry {
  id?: string;
  child_id: string;
  amount: number;
  category?: string | null;
  description: string;
  created_at?: string;
}

export interface TreasuryAllocation {
  spend: number;
  needs: number;
  gold: number;
  land: number;
  vault: number;
}

/**
 * 8. fetchChildWallet(childId: string):
 * Fetches or creates the wallet row for the child in `child_wallets`.
 */
export async function fetchChildWallet(childId: string): Promise<ChildWallet> {
  const defaultWallet: ChildWallet = {
    child_id: childId,
    spend_coins: 0,
    needs_coins: 0,
    gold_coins: 0,
    land_coins: 0,
    vault_coins: 0
  };

  try {
    if (!childId || !isValidUUID(childId)) {
      return defaultWallet;
    }

    const { data, error } = await supabase
      .from('child_wallets')
      .select('*')
      .eq('child_id', childId)
      .maybeSingle();

    if (error) {
      console.warn('[bankService] fetchChildWallet notice:', error.message);
      return defaultWallet;
    }

    if (data) {
      return {
        id: data.id,
        child_id: data.child_id,
        spend_coins: data.spend_coins ?? 0,
        needs_coins: data.needs_coins ?? 0,
        gold_coins: data.gold_coins ?? 0,
        land_coins: data.land_coins ?? 0,
        vault_coins: data.vault_coins ?? 0,
        updated_at: data.updated_at
      };
    }

    // Row does not exist yet; auto-create initial wallet
    const { data: newWallet, error: insertError } = await supabase
      .from('child_wallets')
      .insert({
        child_id: childId,
        spend_coins: 0,
        needs_coins: 0,
        gold_coins: 0,
        land_coins: 0,
        vault_coins: 0
      })
      .select()
      .single();

    if (insertError || !newWallet) {
      console.warn('[bankService] Could not insert initial child_wallets row:', insertError?.message);
      return defaultWallet;
    }

    return {
      id: newWallet.id,
      child_id: newWallet.child_id,
      spend_coins: newWallet.spend_coins ?? 0,
      needs_coins: newWallet.needs_coins ?? 0,
      gold_coins: newWallet.gold_coins ?? 0,
      land_coins: newWallet.land_coins ?? 0,
      vault_coins: newWallet.vault_coins ?? 0,
      updated_at: newWallet.updated_at
    };
  } catch (err) {
    console.error('[bankService] fetchChildWallet unexpected error:', err);
    return defaultWallet;
  }
}

/**
 * Fetch child profile dynamically by ID
 */
export async function fetchChildProfile(childId: string): Promise<ChildProfile | null> {
  try {
    if (!childId || !isValidUUID(childId)) {
      return null;
    }

    const { data, error } = await supabase
      .from('children')
      .select('*')
      .eq('id', childId)
      .maybeSingle();

    if (error || !data) {
      console.warn('[bankService] fetchChildProfile error:', error?.message);
      return null;
    }

    return {
      id: data.id,
      familyId: data.family_id,
      name: data.name,
      coinBalance: data.coin_balance ?? 0
    };
  } catch (err) {
    console.error('[bankService] fetchChildProfile unexpected error:', err);
    return null;
  }
}

/**
 * 9. allocateSundayTreasury(childId: string, alloc: TreasuryAllocation):
 * Calls the atomic Postgres RPC transaction `allocate_sunday_treasury_atomic`.
 */
export async function allocateSundayTreasury(
  childId: string,
  alloc: { spend: number; needs: number; gold: number; land: number; vault: number }
): Promise<{ success: boolean; wallet: ChildWallet | null; remainingCoins: number | null }> {
  try {
    if (!childId || !isValidUUID(childId)) {
      return { success: false, wallet: null, remainingCoins: null };
    }

    const { data, error } = await supabase.rpc('allocate_sunday_treasury_atomic', {
      p_child_id: childId,
      p_spend: alloc.spend || 0,
      p_needs: alloc.needs || 0,
      p_gold: alloc.gold || 0,
      p_land: alloc.land || 0,
      p_vault: alloc.vault || 0
    });

    if (error) {
      console.error('[bankService] Atomic allocation failed:', error.message);
      return { success: false, wallet: null, remainingCoins: null };
    }

    // Fetch the updated wallet and child state post-transaction
    const [updatedWallet, updatedChild] = await Promise.all([
      fetchChildWallet(childId),
      fetchChildProfile(childId)
    ]);

    return {
      success: true,
      wallet: updatedWallet,
      remainingCoins: updatedChild ? updatedChild.coinBalance : null
    };
  } catch (err) {
    console.error('[bankService] Atomic allocation failed:', err);
    return { success: false, wallet: null, remainingCoins: null };
  }
}

/**
 * 10. applyPassiveGrowth(childId: string):
 * - Calculates daily micro-growth (+1.5%) on `gold_coins`.
 * - Calculates weekly maturation yield (+12%) on `land_coins`.
 * - Saves gains to `child_wallets` and logs them under 'asset_yield'.
 */
export async function applyPassiveGrowth(childId: string): Promise<{
  success: boolean;
  goldGain: number;
  landGain: number;
  wallet: ChildWallet | null;
}> {
  try {
    if (!childId || !isValidUUID(childId)) {
      return { success: false, goldGain: 0, landGain: 0, wallet: null };
    }

    const currentWallet = await fetchChildWallet(childId);

    const goldCoins = currentWallet.gold_coins || 0;
    const landCoins = currentWallet.land_coins || 0;

    // +1.5% micro-growth on gold coins (min 1 coin if goldCoins > 0)
    const goldGain = goldCoins > 0 ? Math.max(1, Math.round(goldCoins * 0.015)) : 0;

    // +12% maturation yield on land coins (min 1 coin if landCoins > 0)
    const landGain = landCoins > 0 ? Math.max(1, Math.round(landCoins * 0.12)) : 0;

    if (goldGain === 0 && landGain === 0) {
      return { success: true, goldGain: 0, landGain: 0, wallet: currentWallet };
    }

    const updatedJarTotals = {
      gold_coins: goldCoins + goldGain,
      land_coins: landCoins + landGain,
      updated_at: new Date().toISOString()
    };

    let savedWallet: ChildWallet = {
      ...currentWallet,
      ...updatedJarTotals
    };

    if (currentWallet.id) {
      const { data: updatedRow, error: updateError } = await supabase
        .from('child_wallets')
        .update(updatedJarTotals)
        .eq('id', currentWallet.id)
        .select()
        .single();

      if (!updateError && updatedRow) {
        savedWallet = updatedRow as ChildWallet;
      }
    }

    // Save gains to treasury_ledger under category 'asset_yield'
    if (goldGain > 0) {
      await supabase.from('treasury_ledger').insert({
        child_id: childId,
        amount: goldGain,
        category: 'asset_yield',
        description: `🥇 Digital Gold: +${goldGain} coins (1.5% daily micro-growth)`
      });
    }

    if (landGain > 0) {
      await supabase.from('treasury_ledger').insert({
        child_id: childId,
        amount: landGain,
        category: 'asset_yield',
        description: `🏡 Magic Land: +${landGain} coins (12% weekly maturation yield)`
      });
    }

    return {
      success: true,
      goldGain,
      landGain,
      wallet: savedWallet
    };
  } catch (err) {
    console.error('[bankService] applyPassiveGrowth error:', err);
    return { success: false, goldGain: 0, landGain: 0, wallet: null };
  }
}

export type ReportTimeRange = 'weekly' | 'monthly' | 'quarterly' | 'annual';

export interface MoralArchetype {
  name: 'Prudent Builder' | 'Balanced Hero' | 'Joy Explorer';
  icon: string;
  badge: string;
  description: string;
  barnabyTip: string;
  color: string;
}

export interface FinancialReportSummary {
  timeRange: ReportTimeRange;
  totalEarned: number;
  spent: number;
  invested: number;
  yieldsHarvested: number;
  currentNetWorth: number;
  joyPercent: number;
  needsPercent: number;
  investPercent: number;
  archetype: MoralArchetype;
  entries: TreasuryLedgerEntry[];
}

/**
 * 11. evaluateMoralArchetype:
 * Evaluates the distribution between Joy (spending), Daily Needs, and Kingdom Investments (Gold, Land, Vault).
 */
export function evaluateMoralArchetype(
  joyCoins: number,
  needsCoins: number,
  investCoins: number
): MoralArchetype {
  const total = joyCoins + needsCoins + investCoins;
  if (total <= 0) {
    return {
      name: 'Balanced Hero',
      icon: '⚖️',
      badge: 'Harmonious Guardian',
      description: 'A wise, steady balance between daily happiness, family needs, and future wealth.',
      barnabyTip: 'The Golden Mean! You balance fun today with kingdom security tomorrow. Pure mastery! 🌿🪙',
      color: 'from-purple-500 to-sky-600'
    };
  }

  const investRatio = investCoins / total;
  const joyRatio = joyCoins / total;

  if (investRatio > 0.5) {
    return {
      name: 'Prudent Builder',
      icon: '🏰',
      badge: 'Master Kingdom Architect',
      description: 'Over 50% of your treasure is growing in Digital Gold, Magic Land & Future Vault!',
      barnabyTip: 'Incredible discipline, young ruler! Over half of your treasure is actively working to grow your future kingdom! 🏰✨',
      color: 'from-amber-500 to-emerald-600'
    };
  }

  if (joyRatio > 0.6) {
    return {
      name: 'Joy Explorer',
      icon: '🎈',
      badge: 'Champion of Happiness',
      description: 'You love celebrating life and enjoying the fruits of your adventures!',
      barnabyTip: "Fun brings big smiles! Remember to tuck away a few shiny gold coins in the Future Vault for tomorrow's quests! 🌟",
      color: 'from-pink-500 to-rose-600'
    };
  }

  return {
    name: 'Balanced Hero',
    icon: '⚖️',
    badge: 'Harmonious Guardian',
    description: 'A wise, steady balance between daily happiness, family needs, and future wealth.',
    barnabyTip: 'The Golden Mean! You balance fun today with kingdom security tomorrow. Pure mastery! 🌿🪙',
    color: 'from-purple-500 to-sky-600'
  };
}

/**
 * 12. fetchTreasuryLedger:
 * Aggregates financial statements and moral archetype reports for a given timeRange.
 */
export async function fetchTreasuryLedger(
  childId: string,
  timeRange: ReportTimeRange = 'weekly'
): Promise<FinancialReportSummary> {
  const defaultArchetype = evaluateMoralArchetype(0, 0, 0);
  const fallbackSummary: FinancialReportSummary = {
    timeRange,
    totalEarned: 0,
    spent: 0,
    invested: 0,
    yieldsHarvested: 0,
    currentNetWorth: 0,
    joyPercent: 33,
    needsPercent: 33,
    investPercent: 34,
    archetype: defaultArchetype,
    entries: []
  };

  try {
    if (!childId || !isValidUUID(childId)) {
      return fallbackSummary;
    }

    const now = Date.now();
    let msOffset = 7 * 24 * 60 * 60 * 1000;
    if (timeRange === 'monthly') msOffset = 30 * 24 * 60 * 60 * 1000;
    else if (timeRange === 'quarterly') msOffset = 90 * 24 * 60 * 60 * 1000;
    else if (timeRange === 'annual') msOffset = 365 * 24 * 60 * 60 * 1000;

    const cutoffDate = new Date(now - msOffset).toISOString();

    const { data: ledgerData, error: ledgerError } = await supabase
      .from('treasury_ledger')
      .select('*')
      .eq('child_id', childId)
      .gte('created_at', cutoffDate)
      .order('created_at', { ascending: false });

    if (ledgerError) {
      console.warn('[bankService] fetchTreasuryLedger notice:', ledgerError.message);
    }

    const rawEntries: TreasuryLedgerEntry[] = ledgerData || [];

    const wallet = await fetchChildWallet(childId);
    const { data: child } = await supabase
      .from('children')
      .select('coin_balance')
      .eq('id', childId)
      .maybeSingle();

    const liquidCoins = child?.coin_balance ?? 0;
    const jarCoins =
      (wallet.spend_coins || 0) +
      (wallet.needs_coins || 0) +
      (wallet.gold_coins || 0) +
      (wallet.land_coins || 0) +
      (wallet.vault_coins || 0);

    const currentNetWorth = liquidCoins + jarCoins;

    let spentJoy = 0;
    let spentNeeds = 0;
    let investedGold = 0;
    let investedLand = 0;
    let investedVault = 0;
    let yieldsHarvested = 0;

    for (const entry of rawEntries) {
      const desc = (entry.description || '').toLowerCase();
      const cat = (entry.category || '').toLowerCase();
      const amt = entry.amount || 0;

      if (cat === 'asset_yield' || desc.includes('yield') || desc.includes('micro-growth')) {
        yieldsHarvested += amt;
      } else if (desc.includes('joy')) {
        spentJoy += amt;
      } else if (desc.includes('needs')) {
        spentNeeds += amt;
      } else if (desc.includes('gold')) {
        investedGold += amt;
      } else if (desc.includes('land')) {
        investedLand += amt;
      } else if (desc.includes('vault')) {
        investedVault += amt;
      }
    }

    // If no ledger rows exist in this window, fall back to current wallet jar values
    if (rawEntries.length === 0) {
      spentJoy = wallet.spend_coins || 0;
      spentNeeds = wallet.needs_coins || 0;
      investedGold = wallet.gold_coins || 0;
      investedLand = wallet.land_coins || 0;
      investedVault = wallet.vault_coins || 0;
    }

    const totalSpent = spentJoy + spentNeeds;
    const totalInvested = investedGold + investedLand + investedVault;
    const totalAllocated = totalSpent + totalInvested;

    let joyPercent = 33;
    let needsPercent = 33;
    let investPercent = 34;

    if (totalAllocated > 0) {
      joyPercent = Math.round((spentJoy / totalAllocated) * 100);
      needsPercent = Math.round((spentNeeds / totalAllocated) * 100);
      investPercent = Math.max(0, 100 - joyPercent - needsPercent);
    }

    const archetype = evaluateMoralArchetype(spentJoy, spentNeeds, totalInvested);
    const totalEarned = Math.max(liquidCoins + totalAllocated, liquidCoins);

    return {
      timeRange,
      totalEarned,
      spent: totalSpent,
      invested: totalInvested,
      yieldsHarvested,
      currentNetWorth,
      joyPercent,
      needsPercent,
      investPercent,
      archetype,
      entries: rawEntries
    };
  } catch (err) {
    console.error('[bankService] fetchTreasuryLedger error:', err);
    return fallbackSummary;
  }
}


