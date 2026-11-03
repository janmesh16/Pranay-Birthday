import React from 'react';
import { motion } from 'framer-motion';
import { X, Award, Sparkles, Terminal, Heart } from 'lucide-react';
import { CONFIG } from '../content';

export function EasterEggModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md rounded-2xl bg-[#12121c] border border-red-500/40 p-6 text-white shadow-glow-red overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pranay-red to-orange-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-pranay-red">
              Secret Easter Egg Discovered!
            </span>
            <h3 className="text-xl font-display uppercase tracking-wide text-white">
              The Creator's Cut
            </h3>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-3 font-mono text-xs text-gray-300 my-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span>developer_mode: ACTIVE</span>
          </div>
          <p className="text-gray-300 leading-relaxed font-sans text-sm">
            You found the hidden logo tap Easter Egg! Built with precision, brotherhood, and endless inside jokes by <strong>Janmesh Roida</strong> for Pranay's 20th birthday.
          </p>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-gray-300">
            <p>🏆 <strong>Achievement Unlocked:</strong> Curious Detective</p>
            <p className="mt-1">Secret Code for Aryan: <code className="text-pranay-red font-bold">ARYAN-404</code></p>
            <p>Special Code for Janmesh: <code className="text-amber-400 font-bold">JANMESH-ROIDA</code></p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-pranay-red hover:bg-pranay-redDark text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Long Live Season 20!</span>
        </button>
      </motion.div>
    </div>
  );
}

