'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const LivingBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Soft Sunshine Radial Glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full opacity-60 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(254, 243, 199, 0.9) 0%, rgba(186, 230, 253, 0.4) 60%, rgba(233, 213, 255, 0) 100%)'
        }}
      />

      {/* Floating Cloud 1 (Left to Right drift) */}
      <motion.div
        className="absolute top-12 left-[-120px] opacity-75"
        animate={{
          x: [0, 480, 0],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg width="180" height="90" viewBox="0 0 180 90" fill="none">
          <ellipse cx="65" cy="55" rx="45" ry="32" fill="#FFFFFF" fillOpacity="0.85" />
          <ellipse cx="115" cy="52" rx="40" ry="28" fill="#FFFFFF" fillOpacity="0.8" />
          <ellipse cx="90" cy="40" rx="35" ry="30" fill="#FFFFFF" fillOpacity="0.9" />
          <ellipse cx="135" cy="60" rx="25" ry="20" fill="#FFFFFF" fillOpacity="0.75" />
        </svg>
      </motion.div>

      {/* Floating Cloud 2 (Right to Left drift) */}
      <motion.div
        className="absolute top-44 right-[-100px] opacity-65"
        animate={{
          x: [0, -420, 0],
          y: [0, 12, 0],
        }}
        transition={{
          duration: 44,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5,
        }}
      >
        <svg width="160" height="85" viewBox="0 0 160 85" fill="none">
          <ellipse cx="55" cy="50" rx="40" ry="28" fill="#FFFFFF" fillOpacity="0.85" />
          <ellipse cx="105" cy="48" rx="38" ry="26" fill="#FFFFFF" fillOpacity="0.8" />
          <ellipse cx="80" cy="38" rx="30" ry="25" fill="#FFFFFF" fillOpacity="0.9" />
        </svg>
      </motion.div>

      {/* Floating Cloud 3 (Mid-screen gentle drift) */}
      <motion.div
        className="absolute bottom-40 left-[-80px] opacity-60"
        animate={{
          x: [0, 360, 0],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 48,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 12,
        }}
      >
        <svg width="150" height="75" viewBox="0 0 150 75" fill="none">
          <ellipse cx="50" cy="45" rx="38" ry="25" fill="#FFFFFF" fillOpacity="0.8" />
          <ellipse cx="95" cy="42" rx="35" ry="22" fill="#FFFFFF" fillOpacity="0.75" />
          <ellipse cx="72" cy="32" rx="28" ry="22" fill="#FFFFFF" fillOpacity="0.85" />
        </svg>
      </motion.div>

      {/* Swaying 3D Hot-Air Balloon Badge */}
      <motion.div
        className="absolute top-24 right-4 sm:right-12 z-0"
        animate={{
          y: [-12, 14, -12],
          rotate: [-3.5, 3.5, -3.5],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative drop-shadow-lg filter">
          <svg width="68" height="92" viewBox="0 0 68 92" fill="none">
            {/* Balloon Body */}
            <defs>
              <linearGradient id="balloonPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id="balloonYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient id="balloonCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#67E8F9" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            {/* Balloon segments */}
            <path
              d="M34 2C15.2 2 0 17.2 0 36c0 15 15.5 28 28 32v4h12v-4c12.5-4 28-17 28-32 0-18.8-15.2-34-34-34z"
              fill="url(#balloonPink)"
            />
            {/* Center Yellow Stripe */}
            <path
              d="M34 2c-8 0-14 16-14 34 0 15 6 30 14 32 8-2 14-17 14-32 0-18-6-34-14-34z"
              fill="url(#balloonYellow)"
            />
            {/* Center Turquoise Stripe Accent */}
            <path
              d="M34 2c-4 0-7 16-7 34 0 15 3 30 7 32 4-2 7-17 7-32 0-18-3-34-7-34z"
              fill="url(#balloonCyan)"
            />
            {/* Balloon Ropes */}
            <line x1="28" y1="72" x2="25" y2="82" stroke="#94A3B8" strokeWidth="2" />
            <line x1="40" y1="72" x2="43" y2="82" stroke="#94A3B8" strokeWidth="2" />
            {/* Wicker Basket */}
            <rect x="22" y="81" width="24" height="11" rx="3" fill="#D97706" />
            <rect x="24" y="83" width="20" height="7" rx="2" fill="#FBBF24" />
          </svg>
          {/* Sparkle badge near balloon */}
          <motion.div
            className="absolute -top-1 -right-1 text-yellow-300 text-xs font-bold select-none"
            animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✨
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Mini Stars / Sparkles */}
      {[
        { top: '15%', left: '15%', delay: 0, size: 14 },
        { top: '35%', left: '8%', delay: 1.5, size: 18 },
        { top: '65%', right: '12%', delay: 2.5, size: 16 },
        { top: '80%', left: '20%', delay: 3, size: 12 },
        { top: '25%', right: '22%', delay: 1, size: 14 },
      ].map((star, i) => (
        <motion.div
          key={i}
          className="absolute text-amber-300 select-none opacity-60"
          style={{ top: star.top, left: star.left, right: star.right }}
          animate={{
            scale: [0.8, 1.25, 0.8],
            opacity: [0.3, 0.75, 0.3],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};
