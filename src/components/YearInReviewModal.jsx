import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Share2, Sparkles, 
  MessageCircle, Dumbbell, Clock, Coffee, Heart, Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../content';
import { playCardFlipSound, playClickSound } from '../utils/audio';

const ICON_MAP = {
  MessageCircle,
  Dumbbell,
  Clock,
  Coffee,
  Sparkles,
  Heart
};

export function YearInReviewModal({ onClose }) {
  const yir = CONFIG.yearInReview;
  const stories = yir?.stories || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasCopiedShare, setHasCopiedShare] = useState(false);

  // Auto-advance timer (5 seconds per slide)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev < stories.length - 1) {
          playCardFlipSound();
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, stories.length]);

  // Trigger confetti on the final celebration slide
  useEffect(() => {
    if (currentIndex === stories.length - 1) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [currentIndex, stories.length]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      playCardFlipSound();
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      playCardFlipSound();
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentStory = stories[currentIndex] || {};
  const IconComponent = currentStory.icon && ICON_MAP[currentStory.icon] 
    ? ICON_MAP[currentStory.icon] 
    : Sparkles;

  const handleShare = () => {
    playClickSound();
    const shareText = `🔥 PRANAY: SEASON 19 WRAPPED\n• Said 'Bhai' 4,218 times\n• WhatsApp latency: 14 business days\n• Chai drank: 847 cups\nStream Season 20 exclusively on PRANAYFLIX!`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setHasCopiedShare(true);
      setTimeout(() => setHasCopiedShare(false), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-6 safe-top safe-bottom safe-left safe-right select-none touch-manipulation"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Phone-shaped Story Container (9:16 aspect ratio on mobile/desktop) */}
      <div className={`relative w-full max-w-sm sm:max-w-md h-[92dvh] max-h-[820px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 bg-gradient-to-b ${currentStory.gradient || 'from-red-950 via-zinc-950 to-black'} border border-white/20 transition-all duration-700`}>
        {/* Top Progress Segment Bars */}
        <div className="relative z-20 flex items-center gap-1.5 w-full pt-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
              <div 
                className={`h-full bg-white transition-all duration-300 ${
                  i < currentIndex ? 'w-full' : i === currentIndex ? 'w-full animate-story-progress' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Top Header Bar */}
        <div className="relative z-20 flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-white/90 font-display">
              {yir.title || "Season 19 Wrapped"}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-mono text-white/80">
              {currentIndex + 1}/{stories.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 min-tap-target rounded-full bg-black/40 hover:bg-black/60 active:scale-95 flex items-center justify-center text-white transition-colors"
            title="Exit Story"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Animated Story Slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id || currentIndex}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 my-auto"
          >
            {/* Top Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-[0.25em] text-white/90 font-display mb-6 flex items-center gap-1.5 shadow-sm"
            >
              <IconComponent className="w-3.5 h-3.5" style={{ color: currentStory.accent || '#FFFFFF' }} />
              <span>{currentStory.badge || currentStory.category}</span>
            </motion.div>

            {/* Giant Stat Display */}
            <motion.h1
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="text-6xl sm:text-7xl font-display font-black text-white tracking-wider drop-shadow-[0_5px_25px_rgba(0,0,0,0.8)]"
              style={{ color: currentStory.accent || '#FFFFFF' }}
            >
              {currentStory.stat}
            </motion.h1>

            {/* Stat Label */}
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-lg sm:text-xl font-bold text-white mt-3 mb-4 leading-snug font-sans"
            >
              {currentStory.label}
            </motion.h3>

            {/* Comic Detail Punchline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="max-w-xs p-4 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-200 leading-relaxed font-sans shadow-lg"
            >
              {currentStory.detail}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Invisible Left / Right Screen Tap Zones for Fast Navigation */}
        <div 
          onClick={handlePrev}
          className="absolute inset-y-16 left-0 w-1/3 z-10 cursor-pointer"
          title="Previous Story"
        />
        <div 
          onClick={handleNext}
          className="absolute inset-y-16 right-0 w-2/3 z-10 cursor-pointer"
          title="Next Story"
        />

        {/* Bottom Bar / Actions */}
        <div className="relative z-20 pt-4 flex items-center justify-between gap-3 border-t border-white/10">
          <button
            onClick={handleShare}
            className="h-11 min-tap-target px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            {hasCopiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied Stats!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Share Stats</span>
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="h-11 min-tap-target px-5 rounded-xl bg-white text-black hover:bg-gray-200 active:scale-95 text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-lg"
          >
            <span>{currentIndex === stories.length - 1 ? "Finish" : "Next"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

