import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, FastForward, Calendar, Film } from 'lucide-react';
import { ImageWithFallback } from '../utils/mediaFallback';

export function EpisodeModal({ season, onClose, onNextSeason, totalSeasons = 19 }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!season) return;
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onNextSeason && season.season < totalSeasons) {
            onNextSeason();
          }
          return 5;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [season, onNextSeason, totalSeasons]);

  if (!season) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg rounded-2xl bg-[#14141e] border border-white/10 overflow-hidden shadow-2xl text-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media Banner */}
        <div className="relative aspect-video w-full bg-black">
          <ImageWithFallback
            src={season.photo}
            alt={season.title}
            fallbackTitle={`Season ${season.season} (${season.year})`}
            aspectRatio="aspect-video"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14141e] via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded bg-pranay-red text-white text-xs font-bold uppercase tracking-wider font-display">
              Season {season.season} • Episode 1
            </span>
            <span className="text-xs text-gray-300 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 text-pranay-red" />
              {season.year}
            </span>
          </div>
        </div>

        {/* Details & Recap */}
        <div className="p-6">
          <h3 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-white mb-2">
            {season.title}
          </h3>

          <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/5 my-4">
            <p className="text-xs uppercase text-pranay-red font-semibold tracking-wider mb-1">
              Official Season Recap
            </p>
            <p className="text-sm leading-relaxed text-gray-300 italic">
              "{season.caption}"
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <FastForward className="w-4 h-4" />
              <span>Skip Recap</span>
            </button>

            {season.season < totalSeasons && onNextSeason && (
              <button
                onClick={onNextSeason}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-pranay-red hover:bg-pranay-redDark text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-glow-red"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Next Episode in {countdown}...</span>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

