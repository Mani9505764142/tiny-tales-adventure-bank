export type QuestStatus = 'ready' | 'pending' | 'approved';

export type QuestTheme = 'pink' | 'emerald' | 'amber' | 'purple' | 'sky';

export interface Quest {
  id: string;
  title: string;
  category: string;
  emoji: string;
  coins: number;
  status: QuestStatus;
  theme: QuestTheme;
  description?: string;
  submittedAt?: number;
}

export interface DreamGoal {
  id: string;
  title: string;
  targetCoins: number;
  emoji: string;
  description: string;
}

export interface FlyingCoinParticle {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  amount: number;
}

export type MascotMood = 'happy' | 'excited' | 'cheering' | 'thinking' | 'sleeping';

export interface MascotState {
  mood: MascotMood;
  message: string;
  reactionCount: number;
}

export interface ChildProfile {
  id: string;
  familyId: string;
  name: string;
  coinBalance: number;
}

export interface FamilyProfile {
  id: string;
  name: string;
  parentPin: string;
}
