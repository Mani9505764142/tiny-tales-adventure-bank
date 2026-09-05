'use client';

import React from 'react';
import { LivingBackground } from '@/components/LivingBackground';
import { HeroHeader } from '@/components/HeroHeader';
import { MiniPortfolioCard } from '@/components/MiniPortfolioCard';
import { GoalVaultCard } from '@/components/GoalVaultCard';
import { QuestList } from '@/components/QuestList';
import { MascotWidget } from '@/components/MascotWidget';
import { FlyingCoinsOverlay } from '@/components/FlyingCoinsOverlay';
import { ParentModal } from '@/components/ParentModal';
import { SundayTreasuryModal } from '@/components/SundayTreasuryModal';
import { MoralReportModal } from '@/components/MoralReportModal';

export default function DashboardPage() {
  return (
    <main className="min-h-[100dvh] w-full flex items-center justify-center p-0 sm:py-4 bg-slate-900/10">
      {/* Living Ambient Sky Background */}
      <LivingBackground />

      {/* 
        Native Screen Framing:
        - min-h-[100dvh] w-full max-w-md mx-auto flex flex-col bg-white shadow-2xl relative
        - No artificial phone status bars ("9:41", "5G")
      */}
      <div className="min-h-[100dvh] w-full max-w-md mx-auto flex flex-col bg-white shadow-2xl relative overflow-hidden sm:rounded-[36px] sm:border-4 sm:border-white/90">
        {/* Hero Header with Golden Coin Wallet & Parent Gate */}
        <HeroHeader />

        {/* Scrollable Quest Canvas with pb-28 Clearance */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-gradient-to-b from-sky-50/50 via-white to-purple-50/30 pb-28 pt-2">
          {/* Mini Portfolio Card mounted directly between HeroHeader and Dream Goal Vault */}
          <MiniPortfolioCard />

          {/* The Dream Goal Vault Centerpiece */}
          <GoalVaultCard />

          {/* Mission Quests List */}
          <QuestList />
        </div>

        {/* Floating Mascot Widget strictly anchored to container's bottom-right */}
        <MascotWidget />

        {/* Flying Coin Particles */}
        <FlyingCoinsOverlay />

        {/* Parent Gated Dashboard Overlay */}
        <ParentModal />

        {/* Sunday Family Treasury Council Modal */}
        <SundayTreasuryModal />

        {/* Moral & Financial Report Card Modal */}
        <MoralReportModal />
      </div>
    </main>
  );
}


