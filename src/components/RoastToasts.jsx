import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Info } from 'lucide-react';

const ROAST_MESSAGES = [
  "You scrolled past Season 12 fast. We noticed.",
  "Warning: Still not an adult. Parental supervision advised.",
  "Bro, close this app and go to sleep. It's late.",
  "Did you really think Season 20 would have less drama?",
  "Calculating time wasted on Instagram today: 6 hours 42 mins.",
  "Fact: You owe someone ₹50 right now and you know who it is.",
  "Look at you reading all the roast lines instead of studying."
];

export function RoastToasts({ roastMode, activeCustomToast, onCloseCustomToast }) {
  const [currentRoast, setCurrentRoast] = useState(null);

  useEffect(() => {
    if (!roastMode) {
      setCurrentRoast(null);
      return;
    }

    // Trigger a funny roast toast periodically when Roast Mode is active
    const interval = setInterval(() => {
      const randomMsg = ROAST_MESSAGES[Math.floor(Math.random() * ROAST_MESSAGES.length)];
      setCurrentRoast(randomMsg);

      setTimeout(() => {
        setCurrentRoast(null);
      }, 4500);
    }, 18000); // every 18 seconds

    // Initial roast trigger after 4s
    const firstTimer = setTimeout(() => {
      setCurrentRoast("Roast Mode is ACTIVE. No feelings are safe.");
      setTimeout(() => setCurrentRoast(null), 4000);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(firstTimer);
    };
  }, [roastMode]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {/* Roast Mode Periodic Toast */}
      <AnimatePresence>
        {currentRoast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="pointer-events-auto px-4 py-3 rounded-2xl bg-amber-950/90 border border-amber-500/50 text-amber-200 text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-md flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <p className="flex-1 leading-snug">{currentRoast}</p>
            <button
              onClick={() => setCurrentRoast(null)}
              className="text-amber-400/60 hover:text-amber-200"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Action Toast (e.g. My List, Remind Me, New Review) */}
      <AnimatePresence>
        {activeCustomToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="pointer-events-auto px-4 py-3 rounded-2xl bg-[#181826]/95 border border-white/15 text-white text-xs sm:text-sm font-medium shadow-2xl backdrop-blur-md flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-pranay-red/20 flex items-center justify-center flex-shrink-0 text-pranay-red">
              <Info className="w-4 h-4" />
            </div>
            <p className="flex-1 leading-snug">{activeCustomToast}</p>
            {onCloseCustomToast && (
              <button
                onClick={onCloseCustomToast}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

