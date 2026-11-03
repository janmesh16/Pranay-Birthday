import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CONFIG } from '../content';

export function IntroSting({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden select-none">
      {/* Cinematic Red Flare Streaks in the background */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: [0, 0.8, 1, 0.4, 0], scaleX: [0.1, 1.5, 2.5, 3] }}
        transition={{ duration: 2.8, ease: "easeOut" }}
        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-pranay-red to-transparent blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 0.6, 0.9, 0], scale: [0.5, 1.2, 1.8] }}
        transition={{ duration: 2.8, ease: "easeOut" }}
        className="absolute w-96 h-96 rounded-full bg-pranay-red/30 blur-3xl pointer-events-none"
      />

      {/* Main PRANAYFLIX Wordmark with Dramatic Cinematic Zoom */}
      <motion.div
        initial={{ scale: 0.35, opacity: 0, letterSpacing: "-0.05em" }}
        animate={{ 
          scale: [0.35, 1, 1.15, 1.45], 
          opacity: [0, 1, 1, 0],
          letterSpacing: ["-0.05em", "0.08em", "0.15em", "0.25em"]
        }}
        transition={{ duration: 3.2, times: [0, 0.4, 0.8, 1], ease: "easeInOut" }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
      >
        <span className="pranayflix-logo text-6xl sm:text-8xl md:text-9xl font-display uppercase tracking-widest filter drop-shadow-[0_0_35px_rgba(229,9,20,0.85)]">
          {CONFIG.siteName}
        </span>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 0, 1, 0], y: [10, 0, 0, -10] }}
          transition={{ duration: 2.8, times: [0, 0.4, 0.75, 1] }}
          className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-gray-300 uppercase mt-2 font-display"
        >
          An Original Birthday Production
        </motion.span>
      </motion.div>

      {/* Skip button in the bottom right corner */}
      <button
        onClick={onComplete}
        className="absolute bottom-8 right-8 z-20 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs text-gray-400 hover:text-white uppercase tracking-wider backdrop-blur-sm transition-all"
      >
        Skip
      </button>
    </div>
  );
}

