import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Clock, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../content';
import { syncNetworkTime, getAccurateNow, hasUnlocked } from '../utils/timeSync';

export function PremiereLock({ onUnlock }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());
  const [isUnlocked, setIsUnlocked] = useState(false);

  function calculateTimeLeft() {
    try {
      const target = new Date(CONFIG.unlockAt).getTime();
      const now = getAccurateNow();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
  }

  useEffect(() => {
    // 1. Sync time against reliable network clock (falls back to device clock if offline)
    syncNetworkTime().then(() => {
      setTimeLeft(calculateTimeLeft());
    }).catch(() => {});

    // 2. Check if already past unlock time
    if (hasUnlocked(CONFIG.unlockAt)) {
      setIsUnlocked(true);
      onUnlock();
      return;
    }

    // 3. Countdown loop
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.total <= 0) {
        clearInterval(timer);
        setIsUnlocked(true);
        setTimeout(() => {
          onUnlock();
        }, 1200);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onUnlock]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 safe-top safe-bottom safe-left safe-right h-[100dvh] bg-[#0b0b0f] overflow-hidden select-none">
      {/* Background radial glowing effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pranay-red/20 via-transparent to-black pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-pranay-red/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Tag */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-6 text-center"
      >
        <span className="pranayflix-logo text-3xl sm:text-4xl tracking-widest font-display">
          {CONFIG.siteName}
        </span>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-pranay-red animate-ping" />
          <span className="text-[11px] tracking-widest uppercase font-semibold text-gray-300">
            Exclusive World Premiere
          </span>
        </div>
      </motion.div>

      {/* Center Countdown Unit */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-md flex flex-col items-center text-center my-auto px-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 shadow-glow-red flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-pranay-red" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-white mb-2">
          {CONFIG.birthdayName}: Season {CONFIG.age}
        </h1>
        <p className="text-gray-300 text-sm mb-8 flex items-center justify-center gap-1.5">
          <Clock className="w-4 h-4 text-pranay-red" />
          <span>Premieres in</span>
        </p>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-3 w-full mb-8">
          {[
            { label: 'Days', val: timeLeft.days },
            { label: 'Hours', val: timeLeft.hours },
            { label: 'Minutes', val: timeLeft.minutes },
            { label: 'Seconds', val: timeLeft.seconds },
          ].map((item, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md"
            >
              <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] tracking-wider uppercase text-gray-300 font-medium mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-300 italic max-w-xs leading-relaxed">
          The 19-year recap is locked in the vault until midnight 10 Nov 2026 IST.
        </p>
      </motion.div>

      {/* Clean Production Bottom Footer (Impossible to bypass from UI) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="pb-6 flex items-center justify-center gap-2 text-gray-500 text-[11px] tracking-wider uppercase font-mono"
      >
        <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
        <span>Premiere Encryption Active • IST Midnight 10 Nov 2026</span>
      </motion.div>
    </div>
  );
}
