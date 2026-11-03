import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Lock, Clock, ShieldCheck, Sparkles, Key, 
  MessageSquare, Heart, AlertTriangle, Eye, EyeOff 
} from 'lucide-react';
import { CONFIG } from '../content';
import { getAccurateNow } from '../utils/timeSync';
import { playClickSound, playUnlockSound } from '../utils/audio';

export function TimeCapsuleModal({ onClose }) {
  const capsule = CONFIG.timeCapsule;
  const targetDate = new Date(capsule.unlockAt).getTime();

  const [timeLeft, setTimeLeft] = useState(() => calculateRemaining());
  const [isPastDate, setIsPastDate] = useState(false);
  const [previewUnlocked, setPreviewUnlocked] = useState(false);

  function calculateRemaining() {
    const now = getAccurateNow();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const years = Math.floor(totalSeconds / (365.25 * 24 * 3600));
    const days = Math.floor((totalSeconds % (365.25 * 24 * 3600)) / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { years, days, hours, minutes, seconds, total: diff };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const rem = calculateRemaining();
      setTimeLeft(rem);
      if (rem.total <= 0) {
        setIsPastDate(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const isActuallyUnlocked = isPastDate || previewUnlocked;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-xl overflow-y-auto safe-top safe-bottom select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#13111c] via-[#0d0c14] to-[#08070c] border-2 border-indigo-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.25)] my-auto max-h-[92dvh] flex flex-col"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                <span>10-Year Automated Vault</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                Target: 10 Nov 2036
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wider text-white">
              {capsule.title}
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              {capsule.tagline}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 min-tap-target rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-7 overflow-y-auto no-scrollbar space-y-6">
          {/* Futuristic Countdown Clock */}
          <div className="relative bg-[#100e19] border border-indigo-500/30 rounded-2xl p-5 text-center shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryogenic Countdown to 30th Birthday</span>
            </div>

            {/* Countdown Digits Grid */}
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
              {[
                { label: "YEARS", val: timeLeft.years },
                { label: "DAYS", val: timeLeft.days },
                { label: "HOURS", val: timeLeft.hours },
                { label: "MINS", val: timeLeft.minutes },
                { label: "SECS", val: timeLeft.seconds }
              ].map(({ label, val }) => (
                <div key={label} className="bg-black/60 border border-white/10 rounded-xl p-2 sm:p-3 text-center">
                  <span className="block text-xl sm:text-3xl font-display font-black text-white">
                    {String(val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 mt-3 font-mono">
              Sealed by: <strong className="text-gray-200">{capsule.sealedBy}</strong>
            </p>
          </div>

          {/* LOCKED STATE VIEW (Normal pre-2036 mode) */}
          {!isActuallyUnlocked ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Encrypted Predictions from Aryan, Rohan, Tanvi & Kabir
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Sealed until 10 November 2036. What will Pranay be doing at 30?
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Lock className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Classified Letter from Janmesh (To 30-Year-Old Pranay)
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Written on the eve of his 20th birthday, sealed for a decade.
                  </p>
                </div>
              </div>

              <div className="text-center py-2">
                <p className="text-xs text-indigo-300/80 italic font-mono">
                  "{capsule.lockedMessage}"
                </p>
              </div>

              {/* Developer / Janmesh preview inspector switch */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => {
                    playUnlockSound();
                    setPreviewUnlocked(true);
                  }}
                  className="text-[11px] text-gray-500 hover:text-indigo-400 underline underline-offset-4 flex items-center gap-1 transition-colors"
                >
                  <Key className="w-3 h-3" />
                  <span>Preview Secret Vault Contents (Creator Mode)</span>
                </button>
              </div>
            </div>
          ) : (
            /* UNLOCKED STATE (Past 2036 or Creator Preview) */
            <div className="space-y-6">
              {previewUnlocked && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <strong>Creator Preview Active</strong> (Regular viewers see countdown lock)
                  </span>
                  <button
                    onClick={() => setPreviewUnlocked(false)}
                    className="underline text-[11px] hover:text-white"
                  >
                    Lock Vault Again
                  </button>
                </div>
              )}

              {/* Janmesh Letter */}
              <div className="p-5 rounded-2xl bg-[#181320] border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-amber-400" />
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-400 font-display">
                    Letter to 30-Year-Old Pranay
                  </span>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-line font-serif italic leading-relaxed">
                  {capsule.janmeshLetter}
                </p>
              </div>

              {/* Friends' Predictions */}
              <div>
                <h4 className="text-xs uppercase font-bold tracking-widest text-indigo-400 font-display mb-3">
                  Squad Predictions for Season 30
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(capsule.predictions || []).map((p, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.04] border border-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-xs text-white">{p.friend}</strong>
                        <span className="text-[10px] text-indigo-300 font-mono">{p.role}</span>
                      </div>
                      <p className="text-xs text-gray-300 italic">
                        "{p.prediction}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between">
          <span className="text-[10px] text-gray-400 font-mono">
            Encrypted with 2026-Vault-Protocol
          </span>
          <button
            onClick={onClose}
            className="h-11 min-tap-target px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md active:scale-95"
          >
            Close Vault
          </button>
        </div>
      </motion.div>
    </div>
  );
}

