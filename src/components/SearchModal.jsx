import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Frown, Film, Sparkles } from 'lucide-react';
import { CONFIG } from '../content';

export function SearchModal({ onClose, onSelectSeason }) {
  const [query, setQuery] = useState('');

  const cleanQ = query.trim().toLowerCase();

  const isCrushQuery = cleanQ.includes('crush');
  const isDietQuery = cleanQ.includes('diet') || cleanQ.includes('gym');
  const isMoneyQuery = cleanQ.includes('salary') || cleanQ.includes('money');

  // Filter seasons or friends
  const filteredSeasons = cleanQ && !isCrushQuery ? CONFIG.seasons.filter(s => 
    s.title.toLowerCase().includes(cleanQ) || 
    s.caption.toLowerCase().includes(cleanQ) ||
    String(s.year).includes(cleanQ) ||
    `season ${s.season}`.includes(cleanQ)
  ) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative w-full max-w-lg rounded-2xl bg-[#14141e] border border-white/10 p-6 text-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search seasons, inside jokes, episodes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 focus:border-pranay-red focus:outline-none text-sm placeholder:text-gray-500"
          />
        </div>

        {/* Dynamic Search Results */}
        <div className="min-h-[160px] flex flex-col justify-center">
          {isCrushQuery ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-3 text-pranay-red">
                <Frown className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-display uppercase tracking-wider text-white">
                No Results Found
              </h4>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                Error 404: Relationship not found. Try searching for "Chai" or "Sleep" instead.
              </p>
            </div>
          ) : isDietQuery ? (
            <div className="text-center py-6">
              <span className="text-3xl mb-2 block">🍕</span>
              <h4 className="text-lg font-display uppercase tracking-wider text-white">
                File Corrupted by Shawarma
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Pranay's diet search was permanently paused in 2021.
              </p>
            </div>
          ) : isMoneyQuery ? (
            <div className="text-center py-6">
              <span className="text-3xl mb-2 block">💸</span>
              <h4 className="text-lg font-display uppercase tracking-wider text-white">
                Insufficient Funds
              </h4>
              <p className="text-xs text-gray-400 mt-1">
                Status: Borrowing ₹100 from friends since Season 16.
              </p>
            </div>
          ) : cleanQ && filteredSeasons.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-2">
                Matching Seasons ({filteredSeasons.length})
              </p>
              {filteredSeasons.map((s) => (
                <div
                  key={s.season}
                  onClick={() => {
                    onClose();
                    if (onSelectSeason) onSelectSeason(s);
                  }}
                  className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer flex items-center justify-between border border-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-pranay-red text-[10px] font-bold uppercase font-display">
                      S{s.season}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-white">{s.title}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{s.caption}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{s.year}</span>
                </div>
              ))}
            </div>
          ) : cleanQ ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400">No episodes matched "{query}"</p>
              <p className="text-xs text-gray-600 mt-1">Try "Season 1", "2018", or inside jokes.</p>
            </div>
          ) : (
            <div className="text-center py-4 text-xs text-gray-500">
              <p className="font-semibold text-gray-400 mb-1">Quick Suggestions:</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                {["my crush", "Awkward", "Studying", "Lockdown", "Diet"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    "{tag}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

