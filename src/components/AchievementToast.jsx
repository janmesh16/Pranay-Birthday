import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Flame, Tv, Heart, Key, Clock, Film, BarChart3, Star, Users, Eye } from 'lucide-react';

const ICON_MAP = {
  Trophy,
  Award,
  Flame,
  Tv,
  Heart,
  Key,
  Clock,
  Film,
  BarChart3,
  Star,
  Users,
  Eye
};

export function AchievementToast() {
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const handleAchievementUnlocked = (e) => {
      const achievement = e.detail;
      if (!achievement) return;
      setQueue((prev) => [...prev, achievement]);
    };

    window.addEventListener('pranayflix:achievement', handleAchievementUnlocked);
    return () => window.removeEventListener('pranayflix:achievement', handleAchievementUnlocked);
  }, []);

  // Process queue
  useEffect(() => {
    if (!activeAchievement && queue.length > 0) {
      const next = queue[0];
      setActiveAchievement(next);
      setQueue((prev) => prev.slice(1));

      const timer = setTimeout(() => {
        setActiveAchievement(null);
      }, 4500);

      return () => clearTimeout(timer);
    }
  }, [activeAchievement, queue]);

  const IconComponent = activeAchievement && activeAchievement.icon && ICON_MAP[activeAchievement.icon] 
    ? ICON_MAP[activeAchievement.icon] 
    : Trophy;

  return (
    <div className="fixed top-4 inset-x-0 z-[10000] flex justify-center pointer-events-none px-4 safe-top">
      <AnimatePresence>
        {activeAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="pointer-events-auto flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-[#0e1710]/95 border-2 border-[#107C10] text-white shadow-[0_10px_35px_rgba(16,124,16,0.45)] backdrop-blur-xl max-w-md w-full"
          >
            {/* Xbox Signature Glowing Circular Emblem */}
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#107C10] to-[#2ca22c] flex items-center justify-center flex-shrink-0 shadow-[0_0_18px_rgba(44,162,44,0.7)] border border-white/20">
              <IconComponent className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-30" />
            </div>

            {/* Achievement Text & Gamerscore */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#52d852] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#52d852] animate-pulse" />
                  ACHIEVEMENT UNLOCKED
                </span>
                {activeAchievement.gamerscore && (
                  <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-md bg-[#107C10]/40 text-[#52d852] border border-[#107C10]/60 font-mono">
                    +{activeAchievement.gamerscore}
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-white tracking-wide truncate mt-0.5">
                {activeAchievement.title}
              </h4>
              <p className="text-[11px] text-gray-300 truncate font-sans">
                {activeAchievement.desc}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

