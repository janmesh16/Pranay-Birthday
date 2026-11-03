import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Flame, Users, Heart, AlertCircle, X, Film, CheckCircle } from 'lucide-react';
import { CONFIG } from '../content';
import { playIntroSound, playErrorSound, playClickSound, unlockAudio } from '../utils/audio';
import { unlockAchievement } from '../utils/achievements';

export function WhosWatching({ onSelectProfile }) {
  const [guestDenied, setGuestDenied] = useState(false);
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const handlePranay = () => {
    unlockAudio();
    playClickSound();
    playIntroSound(CONFIG.introSound);
    onSelectProfile({ role: 'pranay', roastMode: false });
  };

  const handleRoastMode = () => {
    unlockAudio();
    playClickSound();
    playIntroSound(CONFIG.introSound);
    unlockAchievement('ROAST_MODE');
    onSelectProfile({ role: 'pranay', roastMode: true });
  };

  const handleGuest = () => {
    unlockAudio();
    playErrorSound();
    setGuestDenied(true);
    setShakeKey(prev => prev + 1);
    setTimeout(() => {
      setGuestDenied(false);
    }, 3500);
  };

  const handleFamily = () => {
    unlockAudio();
    playClickSound();
    setFamilyModalOpen(true);
  };

  const profiles = [
    {
      id: 'pranay',
      name: CONFIG.birthdayName,
      badge: 'Birthday Boy',
      color: 'from-red-600 to-red-800',
      icon: User,
      action: handlePranay,
      glow: 'hover:shadow-glow-red border-pranay-red/40'
    },
    {
      id: 'roast',
      name: 'Roast Mode',
      badge: 'Unfiltered 🌶️',
      color: 'from-amber-600 to-orange-700',
      icon: Flame,
      action: handleRoastMode,
      glow: 'hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] border-amber-500/40'
    },
    {
      id: 'family',
      name: 'Mom / Family',
      badge: 'Special Love',
      color: 'from-pink-600 to-rose-800',
      icon: Heart,
      action: handleFamily,
      glow: 'hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] border-pink-500/40'
    },
    {
      id: 'guest',
      name: 'Guest',
      badge: 'Unregistered',
      color: 'from-gray-700 to-gray-900',
      icon: Users,
      action: handleGuest,
      glow: 'hover:border-gray-500 border-white/10'
    }
  ];

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center p-6 bg-[#0b0b0f] select-none overflow-y-auto">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pranay-red/10 via-transparent to-black pointer-events-none" />

      {/* Brand Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 sm:mb-12 text-center"
      >
        <span className="pranayflix-logo text-4xl sm:text-5xl tracking-widest font-display">
          {CONFIG.siteName}
        </span>
        <h2 className="text-xl sm:text-3xl font-display uppercase tracking-widest text-white mt-4">
          Who's Watching?
        </h2>
        <p className="text-xs text-gray-400 mt-1">Select your profile to start streaming Season {CONFIG.age}</p>
      </motion.div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-2xl px-2">
        {profiles.map((p, idx) => {
          const Icon = p.icon;
          const isGuestTile = p.id === 'guest';
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isGuestTile && guestDenied ? {
                x: [-12, 12, -10, 10, -5, 5, 0],
                transition: { duration: 0.4 }
              } : { opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={p.action}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Profile Box */}
              <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br ${p.color} border-2 ${p.glow} flex flex-col items-center justify-center p-3 transition-all duration-300 transform group-hover:scale-105 active:scale-95 shadow-xl overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white drop-shadow-md z-10" />
                <span className="absolute bottom-2 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-sm text-gray-200 z-10">
                  {p.badge}
                </span>
              </div>

              {/* Name */}
              <span className="mt-3 text-sm sm:text-base font-semibold text-gray-300 group-hover:text-white transition-colors tracking-wide">
                {p.name}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Guest Denied Banner */}
      <AnimatePresence>
        {guestDenied && (
          <motion.div
            key={shakeKey}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-8 px-5 py-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-glow-red"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" />
            <span>Access denied: not invited. Only Pranay and his squad allowed!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Family Surprise Modal */}
      <AnimatePresence>
        {familyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg rounded-2xl bg-[#14141e] border border-pink-500/30 p-6 text-white shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setFamilyModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center text-white shadow-lg">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="text-xl font-display uppercase tracking-wider text-pink-400">
                    {CONFIG.family.title || "From Mom & Family"}
                  </h3>
                  <p className="text-xs text-gray-400">Special Birthday Message</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 my-4">
                <p className="text-sm leading-relaxed text-gray-200 whitespace-pre-line italic">
                  "{CONFIG.family.message}"
                </p>
              </div>

              {CONFIG.family.video && (
                <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black aspect-video flex items-center justify-center">
                  <video 
                    src={CONFIG.family.video} 
                    controls 
                    playsInline
                    webkit-playsinline="true"
                    preload="metadata"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setFamilyModalOpen(false);
                    handlePranay();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                >
                  Continue as Pranay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

