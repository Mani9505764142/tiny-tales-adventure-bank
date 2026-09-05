'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBank } from '@/context/BankContext';

export const FlyingCoinsOverlay: React.FC = () => {
  const { flyingCoins, removeFlyingCoin } = useBank();

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {flyingCoins.map((particle) => {
          // Calculate high curved arch trajectory
          const midX = (particle.startX + particle.targetX) / 2 + (Math.random() * 60 - 30);
          const midY = Math.min(particle.startY, particle.targetY) - 100;

          return (
            <motion.div
              key={particle.id}
              className="absolute pointer-events-none"
              initial={{
                x: particle.startX - 18,
                y: particle.startY - 18,
                scale: 0.6,
                opacity: 0.9,
              }}
              animate={{
                x: [particle.startX - 18, midX, particle.targetX - 18],
                y: [particle.startY - 18, midY, particle.targetY - 18],
                scale: [0.6, 1.4, 0.8],
                opacity: [1, 1, 0.9],
                rotate: [0, 360, 720],
              }}
              transition={{
                duration: 0.85,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onAnimationComplete={() => {
                removeFlyingCoin(particle.id);
              }}
            >
              {/* 3D Golden SVG Coin */}
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 via-amber-300 to-yellow-100 border-2 border-amber-600 shadow-xl flex items-center justify-center filter drop-shadow-lg">
                <span className="text-base select-none">🪙</span>
                {/* Sparkle Trails */}
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-200 rounded-full animate-ping" />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
