import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Sparkles, 
  LayoutGrid, 
  SlidersHorizontal,
  Camera,
  Layers
} from 'lucide-react';
import { CONFIG } from '../content';
import { ImageWithFallback } from '../utils/mediaFallback';
import { playClickSound, playCardFlipSound } from '../utils/audio';

const ERAS = [
  { id: 'all', label: 'All 19 Seasons', start: 0, end: 18 },
  { id: 'baby', label: '🍼 Baby & Wonder (S1-S5)', start: 0, end: 4 },
  { id: 'school', label: '🎒 School Days (S6-S12)', start: 5, end: 11 },
  { id: 'teen', label: '⚡ Teenage Chaos (S13-S17)', start: 12, end: 16 },
  { id: 'adult', label: '👑 Adulthood Eve (S18-S19)', start: 17, end: 18 }
];

export function TimeTunnel({ onSelectSeason }) {
  const seasons = CONFIG.seasons || [];
  const total = seasons.length;

  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedEra, setSelectedEra] = useState('all');
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid'
  const filmstripRef = useRef(null);

  // Keyboard navigation (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== 'carousel') return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, activeIdx, total]);

  // Center active thumbnail in bottom filmstrip
  useEffect(() => {
    if (filmstripRef.current) {
      const activeBtn = filmstripRef.current.children[activeIdx];
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeIdx]);

  const handleNext = () => {
    playCardFlipSound();
    setActiveIdx((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    playCardFlipSound();
    setActiveIdx((prev) => (prev - 1 + total) % total);
  };

  const handleSelectEra = (era) => {
    playClickSound();
    setSelectedEra(era.id);
    setActiveIdx(era.start);
  };

  const activeSeason = seasons[activeIdx] || seasons[0];

  return (
    <section className="relative mt-8 px-4 sm:px-8 py-4 overflow-hidden">
      {/* 1. Header Toolbar with Title, Era Pills & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-pranay-red/20 border border-pranay-red/40 text-pranay-red text-[10px] font-bold uppercase tracking-widest font-display flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-current" />
              <span>Memories Spotlight</span>
            </span>
            <span className="text-xs text-gray-400 font-mono">
              (19 Years of Blockbuster Chaos • 2007 → 2025)
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-display uppercase tracking-wider text-white">
            Previously on Pranay: The Complete 19-Season Saga
          </h2>
        </div>

        {/* View Toggle (3D Carousel vs All Seasons Grid) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-1 bg-white/[0.06] p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button
              onClick={() => { playClickSound(); setViewMode('carousel'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'carousel'
                  ? 'bg-pranay-red text-white shadow-glow-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Panoramic Stage</span>
            </button>
            <button
              onClick={() => { playClickSound(); setViewMode('grid'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-pranay-red text-white shadow-glow-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>19 Seasons Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Era Quick Jump Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 max-w-7xl mx-auto">
        {ERAS.map((era) => {
          const isSelected = selectedEra === era.id;
          return (
            <button
              key={era.id}
              onClick={() => handleSelectEra(era)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-white/20 border-white/40 text-white shadow-sm'
                  : 'bg-white/[0.04] border-white/10 text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {era.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* VIEW A: PANORAMIC 3D SPOTLIGHT STAGE (NO EMPTY SPACE)    */}
      {/* ========================================================= */}
      {viewMode === 'carousel' && (
        <div className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#13131e] via-[#0d0d16] to-[#08080e] shadow-2xl p-4 sm:p-8">
          
          {/* Dynamic Living Ambient Backdrop behind cards (fills empty space with vibrant photo blur) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
            <img 
              src={activeSeason.photo} 
              alt="" 
              className="w-full h-full object-cover filter blur-3xl scale-125 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080e] via-[#0d0d16]/70 to-[#13131e]/80" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.85)_100%)]" />
          </div>

          {/* 3D Multi-Card Panorama Stage */}
          <div className="relative z-10 w-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center my-2 overflow-hidden">
            
            {/* Left Nav Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/70 hover:bg-black/95 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md"
              title="Previous Season (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/70 hover:bg-black/95 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md"
              title="Next Season (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Cards Array Display with Perspective Offsets */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              style={{ perspective: '1200px' }}
            >
              {[-2, -1, 0, 1, 2].map((offset) => {
                const targetIdx = (activeIdx + offset + total) % total;
                const season = seasons[targetIdx];
                const isCenter = offset === 0;

                // Position styling based on offset from active center
                let xTranslate = 0;
                let scale = 1;
                let rotateY = 0;
                let zIndex = 20;
                let opacity = 1;

                if (offset === -2) {
                  xTranslate = -520;
                  scale = 0.68;
                  rotateY = 32;
                  zIndex = 10;
                  opacity = 0.35;
                } else if (offset === -1) {
                  xTranslate = -280;
                  scale = 0.84;
                  rotateY = 20;
                  zIndex = 15;
                  opacity = 0.75;
                } else if (offset === 0) {
                  xTranslate = 0;
                  scale = 1.0;
                  rotateY = 0;
                  zIndex = 25;
                  opacity = 1;
                } else if (offset === 1) {
                  xTranslate = 280;
                  scale = 0.84;
                  rotateY = -20;
                  zIndex = 15;
                  opacity = 0.75;
                } else if (offset === 2) {
                  xTranslate = 520;
                  scale = 0.68;
                  rotateY = -32;
                  zIndex = 10;
                  opacity = 0.35;
                }

                // Hide outer cards on smaller mobile viewports to prevent overflow
                const isFar = Math.abs(offset) === 2;

                return (
                  <motion.div
                    key={season.season}
                    onClick={() => {
                      if (isCenter) {
                        playClickSound();
                        onSelectSeason(season);
                      } else {
                        playCardFlipSound();
                        setActiveIdx(targetIdx);
                      }
                    }}
                    animate={{
                      x: xTranslate,
                      scale: scale,
                      rotateY: rotateY,
                      opacity: opacity
                    }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    style={{ zIndex }}
                    className={`absolute w-[86vw] max-w-[340px] sm:max-w-[440px] md:max-w-[500px] aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border-2 transition-colors duration-300 ${
                      isCenter 
                        ? 'border-pranay-red shadow-[0_20px_60px_rgba(229,9,20,0.45)]' 
                        : 'border-white/15 hover:border-white/40 shadow-2xl'
                    } ${isFar ? 'hidden md:block' : ''}`}
                  >
                    <ImageWithFallback
                      src={season.photo}
                      alt={season.title}
                      fallbackTitle={`Season ${season.season} (${season.year})`}
                      aspectRatio="aspect-auto"
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-pranay-red text-white text-[11px] sm:text-xs font-black uppercase tracking-wider font-display shadow-glow-red">
                        Season {season.season}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-black/70 text-gray-200 text-[10px] sm:text-xs font-mono border border-white/10 flex items-center gap-1 backdrop-blur-md">
                        <Calendar className="w-3.5 h-3.5 text-pranay-red" />
                        <span>{season.year}</span>
                      </span>
                      {season.hasRealPhoto && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[9px] font-bold uppercase tracking-wider font-mono flex items-center gap-1 shadow-md">
                          <Camera className="w-3 h-3 fill-current" />
                          <span>Real Photo</span>
                        </span>
                      )}
                    </div>

                    {/* Center Card Inspect Prompt */}
                    {isCenter && (
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <span className="px-3 py-1 rounded-full bg-pranay-red text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-red transition-all">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tap to Play</span>
                        </span>
                      </div>
                    )}

                    {/* Bottom Caption & Title */}
                    <div className="absolute bottom-3 inset-x-3 sm:bottom-5 sm:inset-x-5">
                      <h3 className="text-sm sm:text-xl font-bold text-white line-clamp-1 drop-shadow-md">
                        {season.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 mt-1 leading-snug drop-shadow-sm font-sans">
                        {season.caption}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Filmstrip Timeline Navigation (All 19 Seasons Track) */}
          <div className="relative z-20 mt-6 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2 px-1 text-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                Timeline Ribbon • Season {activeIdx + 1} of {total} ({activeSeason.year})
              </span>
              <span className="text-[11px] text-amber-300 font-mono hidden sm:inline">
                ★ Click any season thumbnail to jump
              </span>
            </div>

            <div 
              ref={filmstripRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
            >
              {seasons.map((s, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={s.season}
                    onClick={() => {
                      playCardFlipSound();
                      setActiveIdx(idx);
                    }}
                    className={`relative flex-shrink-0 w-20 sm:w-24 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                      isActive
                        ? 'border-pranay-red scale-110 shadow-glow-red z-10'
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                    title={`Season ${s.season} (${s.year}): ${s.title}`}
                  >
                    <img 
                      src={s.photo} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    
                    {/* Season Tag */}
                    <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white bg-black/75 px-1 rounded">
                      S{s.season}
                    </span>

                    {/* Real Photo Star Indicator */}
                    {s.hasRealPhoto && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 shadow-glow-gold" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW B: ALL 19 SEASONS HIGH-DENSITY GRID                 */}
      {/* ========================================================= */}
      {viewMode === 'grid' && (
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 pt-2">
          {seasons.map((s) => (
            <div
              key={s.season}
              onClick={() => {
                playClickSound();
                onSelectSeason(s);
              }}
              className="group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 group-hover:border-pranay-red transition-all duration-300 transform group-hover:scale-105 shadow-xl bg-[#14141e]">
                <ImageWithFallback
                  src={s.photo}
                  alt={s.title}
                  fallbackTitle={`S${s.season} (${s.year})`}
                  aspectRatio="aspect-auto"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-pranay-red text-[9px] font-bold uppercase font-display text-white">
                    S{s.season}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-gray-300">
                    {s.year}
                  </span>
                </div>

                {s.hasRealPhoto && (
                  <div className="absolute top-2 right-2">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-black text-[8px] font-black uppercase font-mono">
                      ★ REAL
                    </span>
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-pranay-red transition-colors line-clamp-1">
                    {s.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
