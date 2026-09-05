'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';
import { useBank } from '@/context/BankContext';

export const MascotWidget: React.FC = () => {
  const { mascot, interactWithMascot } = useBank();
  const [showSpeech, setShowSpeech] = useState<boolean>(true);
  const [burstParticles, setBurstParticles] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);

  // Auto-show speech bubble whenever mascot state updates
  useEffect(() => {
    setShowSpeech(true);
    // Spawn floating heart and star particles on excited/cheering reactions
    if (mascot.mood === 'excited' || mascot.mood === 'cheering') {
      const items = ['⭐', '💖', '✨', '🎈'];
      const particles = Array.from({ length: 6 }).map((_, i) => ({
        id: Date.now() + i,
        emoji: items[i % items.length],
        x: (Math.random() - 0.5) * 70,
        y: -30 - Math.random() * 50,
      }));
      setBurstParticles(particles);
      const timer = setTimeout(() => setBurstParticles([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [mascot.reactionCount, mascot.mood]);

  return (
    /* Strictly anchored inside the mobile container */
    <div className="absolute bottom-4 right-4 z-40 flex flex-col items-end select-none pointer-events-auto">
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="mb-2 max-w-[190px] bg-white rounded-2xl p-2.5 border-2 border-pink-200 shadow-xl relative cursor-pointer"
            onClick={() => setShowSpeech(false)}
          >
            {/* Top mini header */}
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[10px] font-black uppercase text-pink-500 tracking-wider flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Barnaby Bear
              </span>
            </div>
            <p className="text-xs font-black text-slate-700 leading-tight">
              {mascot.message}
            </p>

            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white border-r-2 border-b-2 border-pink-200 rotate-45 transform" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Particles Burst Container */}
      <div className="relative">
        <AnimatePresence>
          {burstParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 1.5,
                x: p.x,
                y: p.y,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute top-0 left-4 text-sm pointer-events-none z-50"
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Mascot Interactive Button */}
        <motion.button
          onClick={() => {
            interactWithMascot();
            setShowSpeech(true);
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92, y: 2 }}
          animate={
            mascot.mood === 'excited' || mascot.mood === 'cheering'
              ? {
                  y: [0, -18, 0, -10, 0],
                  rotate: [0, -10, 10, -5, 0],
                  scale: [1, 1.15, 1],
                }
              : {
                  scale: [1, 1.04, 1],
                  y: [0, -4, 0],
                }
          }
          transition={
            mascot.mood === 'excited' || mascot.mood === 'cheering'
              ? { duration: 0.85, ease: 'easeInOut' }
              : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
          }
          className="relative w-15 h-15 rounded-full bg-gradient-to-tr from-amber-300 via-amber-200 to-yellow-100 p-1 border-3 border-white shadow-2xl flex items-center justify-center cursor-pointer gloss-highlight"
          style={{
            boxShadow: '0 10px 25px -4px rgba(245, 158, 11, 0.5), inset 0 2px 4px rgba(255,255,255,0.8)',
          }}
          title="Tap Barnaby to talk!"
        >
          {/* Barnaby the Star Bear SVG Mascot */}
          <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
            {/* Bear Ears */}
            <circle cx="26" cy="26" r="16" fill="#D97706" />
            <circle cx="26" cy="26" r="10" fill="#FDE68A" />
            <circle cx="74" cy="26" r="16" fill="#D97706" />
            <circle cx="74" cy="26" r="10" fill="#FDE68A" />

            {/* Bear Head */}
            <circle cx="50" cy="54" r="38" fill="#F59E0B" />

            {/* Star Headband */}
            <path d="M22 36 Q 50 28 78 36" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
            <circle cx="50" cy="30" r="7" fill="#FDE047" stroke="#BE185D" strokeWidth="2" />

            {/* Cheeks */}
            <ellipse cx="30" cy="62" rx="6" ry="4" fill="#F472B6" fillOpacity="0.8" />
            <ellipse cx="70" cy="62" rx="6" ry="4" fill="#F472B6" fillOpacity="0.8" />

            {/* Snout */}
            <ellipse cx="50" cy="64" rx="14" ry="11" fill="#FEF3C7" />
            <ellipse cx="50" cy="59" rx="5" ry="3.5" fill="#78350F" />
            <path d="M50 63 v 5 M46 67 q 4 3 8 0" stroke="#78350F" strokeWidth="2.2" strokeLinecap="round" />

            {/* Happy Eyes */}
            {mascot.mood === 'excited' || mascot.mood === 'cheering' ? (
              <>
                <path d="M32 48 q 6 -6 12 0" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d="M56 48 q 6 -6 12 0" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <circle cx="38" cy="48" r="4.5" fill="#78350F" />
                <circle cx="40" cy="46" r="1.5" fill="#FFFFFF" />
                <circle cx="62" cy="48" r="4.5" fill="#78350F" />
                <circle cx="64" cy="46" r="1.5" fill="#FFFFFF" />
              </>
            )}
          </svg>

          {/* Mini Talk Indicator Badge */}
          <div className="absolute -bottom-0.5 -left-0.5 w-4.5 h-4.5 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-white text-[9px] shadow-sm">
            <MessageCircle className="w-2.5 h-2.5" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};
