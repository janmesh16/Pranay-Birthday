import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Calendar, ChevronRight, Eye, Sparkles, SlidersHorizontal, List } from 'lucide-react';
import { CONFIG } from '../content';
import { ImageWithFallback } from '../utils/mediaFallback';
import { playClickSound } from '../utils/audio';

export function TimeTunnel({ onSelectSeason }) {
  const containerRef = useRef(null);
  const seasons = CONFIG.seasons || [];
  const total = seasons.length;

  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const [viewMode, setViewMode] = useState('tunnel'); // 'tunnel' | 'classic'

  // Detect accessibility & device capability
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
      if (motionQuery.matches) setViewMode('classic');

      const handleMotion = (e) => {
        setPrefersReducedMotion(e.matches);
        if (e.matches) setViewMode('classic');
      };
      motionQuery.addEventListener?.('change', handleMotion);
      return () => motionQuery.removeEventListener?.('change', handleMotion);
    } catch {}

    // Check device specs (hardwareConcurrency <= 4 is typical of entry/mid-range phones)
    try {
      const cores = navigator.hardwareConcurrency || 4;
      const isSlowNet = navigator.connection && (
        navigator.connection.saveData || 
        navigator.connection.effectiveType === '2g' || 
        navigator.connection.effectiveType === '3g'
      );
      if (cores <= 4 || isSlowNet) {
        setIsLowEnd(true);
      }
    } catch {}
  }, []);

  // Track scroll progress along the tunnel container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Keep track of the active center season index for side indicator & windowing
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const rawIdx = Math.round(latest * (total - 1));
    const clamped = Math.max(0, Math.min(total - 1, rawIdx));
    if (clamped !== activeSeasonIdx) {
      setActiveSeasonIdx(clamped);
    }
  });

  // If user prefers reduced motion or explicitly toggles classic mode:
  if (viewMode === 'classic') {
    return (
      <section className="mt-8 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display uppercase tracking-wider text-white">
              Previously on Pranay (Seasons 1 to 19)
            </h2>
            <span className="text-xs text-gray-500 font-mono">({total} years)</span>
          </div>

          <button
            onClick={() => { playClickSound(); setViewMode('tunnel'); }}
            className="text-xs text-pranay-red hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 font-display"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Switch to 3D Tunnel</span>
          </button>
        </div>

        {/* Classic horizontal snap row */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-4 pt-1">
          {seasons.map((s) => (
            <div
              key={s.season}
              onClick={() => onSelectSeason(s)}
              className="snap-start-card flex-shrink-0 w-44 sm:w-56 group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group-hover:border-pranay-red transition-all duration-300 transform group-hover:scale-105 shadow-lg bg-[#14141e]">
                <ImageWithFallback
                  src={s.photo}
                  alt={s.title}
                  fallbackTitle={`S${s.season} (${s.year})`}
                  aspectRatio="aspect-video"
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 rounded bg-pranay-red text-[10px] font-bold uppercase font-display text-white">
                    S{s.season}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2.5 right-2.5">
                  <span className="text-[10px] text-gray-300 flex items-center gap-1 font-mono">
                    <Calendar className="w-3 h-3 text-pranay-red" />
                    {s.year}
                  </span>
                </div>
              </div>
              <div className="mt-2 px-1">
                <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-pranay-red transition-colors line-clamp-1">
                  {s.title}
                </h3>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-0.5 leading-snug">
                  {s.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 3D TIME TUNNEL EXPERIENCE
  return (
    <section 
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${total * 55}vh` }} // Generous scrolling runway for all 19 seasons
    >
      {/* Sticky Stage Viewport (100dvh for mobile Safari address bar safety) */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex flex-col justify-between py-6 px-4 sm:px-8 select-none">
        {/* Section Top Header & Mode Toggle */}
        <div className="relative z-30 pt-16 flex items-center justify-between max-w-4xl mx-auto w-full">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-pranay-red/20 border border-pranay-red/40 text-pranay-red text-[10px] font-bold uppercase tracking-widest font-display flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>3D Memory Tunnel</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                Scroll to travel 2007 → 2025
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl font-display uppercase tracking-wider text-white">
              Previously on Pranay: 19 Years of Chaos
            </h2>
          </div>

          <button
            onClick={() => { playClickSound(); setViewMode('classic'); }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors border border-white/10 flex-shrink-0"
            title="Switch to Horizontal Row"
          >
            <List className="w-4 h-4 text-pranay-red" />
            <span className="hidden sm:inline">Classic Row</span>
          </button>
        </div>

        {/* 3D Depth Stage with CSS Perspective */}
        <div 
          className="relative z-20 flex-1 w-full flex items-center justify-center my-auto"
          style={{
            perspective: isLowEnd ? 'none' : '1200px',
            WebkitPerspective: isLowEnd ? 'none' : '1200px',
            perspectiveOrigin: 'center center',
            transformStyle: 'preserve-3d'
          }}
        >
          {seasons.map((season, idx) => {
            // Windowing optimization: only render cards within +/- 3 of current active index to keep 60fps
            const distance = Math.abs(idx - activeSeasonIdx);
            if (distance > 3) return null;

            return (
              <TimeTunnelCard
                key={season.season}
                season={season}
                index={idx}
                total={total}
                scrollYProgress={scrollYProgress}
                isLowEnd={isLowEnd}
                onSelectSeason={onSelectSeason}
              />
            );
          })}
        </div>

        {/* Thin Side Progress Indicator (Season N of 19) */}
        <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 pointer-events-none">
          <div className="flex flex-col items-end">
            <span className="px-2 py-1 rounded-md bg-black/85 border border-pranay-red/40 text-pranay-red font-mono text-[10px] sm:text-xs font-bold tracking-wider shadow-lg backdrop-blur-md">
              Season {activeSeasonIdx + 1} of {total}
            </span>
            <span className="text-[9px] text-gray-400 font-mono mt-0.5">
              {seasons[activeSeasonIdx]?.year}
            </span>
          </div>

          {/* Vertical progress line */}
          <div className="w-1.5 h-36 sm:h-48 rounded-full bg-white/15 relative overflow-hidden backdrop-blur-sm">
            <motion.div
              className="w-full bg-gradient-to-b from-pranay-red to-amber-500 rounded-full"
              style={{
                height: `${((activeSeasonIdx + 1) / total) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Bottom Interactive Guidance Pill */}
        <div className="relative z-30 pb-4 text-center">
          <span className="px-4 py-1.5 rounded-full bg-black/60 border border-white/10 text-[11px] text-gray-300 backdrop-blur-md inline-flex items-center gap-1.5">
            <span>Scroll vertically to fly through memories • Tap center card to view</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual Season Card positioned in 3D Depth
 */
function TimeTunnelCard({ season, index, total, scrollYProgress, isLowEnd, onSelectSeason }) {
  // Compute normalized target point along scroll timeline [0, 1]
  const targetP = index / (total - 1);
  const step = 1 / (total - 1);

  // Scroll milestones for this specific card
  const enterP = Math.max(0, targetP - step * 1.6);
  const centerP = targetP;
  const exitP = Math.min(1, targetP + step * 1.4);

  // Transform depth (translateZ): from deep background (-1000px) -> center (0px) -> exit toward camera (+400px)
  const z = useTransform(
    scrollYProgress,
    [enterP, centerP, exitP],
    isLowEnd ? [0, 0, 0] : [-1000, 0, 420]
  );

  // Scale: small in distance (0.4) -> full size (1.0) -> expands as it passes (1.3)
  const scale = useTransform(
    scrollYProgress,
    [enterP, centerP, exitP],
    [0.45, 1.0, 1.3]
  );

  // Opacity: fades in as it approaches -> solid 1 at center -> fades out as it drifts past
  const opacity = useTransform(
    scrollYProgress,
    [enterP, enterP + step * 0.7, centerP, exitP - step * 0.4, exitP],
    [0, 0.45, 1, 0.8, 0]
  );

  // Subtle left / right alternation & rotation to feel like navigating a memory corridor
  const isOdd = index % 2 !== 0;
  const xOffset = isOdd ? -24 : 24;
  const rotZ = isOdd ? -3 : 3;

  const rotateZ = useTransform(
    scrollYProgress,
    [enterP, centerP, exitP],
    [rotZ * 1.5, rotZ, rotZ * 2]
  );

  const x = useTransform(
    scrollYProgress,
    [enterP, centerP, exitP],
    [xOffset * 1.8, xOffset, xOffset * 3]
  );

  return (
    <motion.div
      onClick={() => {
        playClickSound();
        onSelectSeason(season);
      }}
      style={{
        transformStyle: isLowEnd ? 'flat' : 'preserve-3d',
        z,
        scale,
        opacity,
        rotateZ,
        x,
        willChange: 'transform, opacity'
      }}
      className="absolute max-w-sm sm:max-w-md w-[85vw] sm:w-[440px] cursor-pointer group"
    >
      {/* 3D Card Shell */}
      <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border-2 border-white/20 group-hover:border-pranay-red bg-gradient-to-b from-[#181824] to-[#0c0c14] shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-colors duration-300">
        <ImageWithFallback
          src={season.photo}
          alt={season.title}
          fallbackTitle={`Season ${season.season} (${season.year})`}
          aspectRatio="aspect-auto"
          className="w-full h-full object-cover"
        />

        {/* Ambient Dark Gradient & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-pranay-red text-white text-xs font-black uppercase tracking-wider font-display shadow-glow-red">
            Season {season.season}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/70 text-gray-200 text-[10px] font-mono border border-white/10 flex items-center gap-1 backdrop-blur-md">
            <Calendar className="w-3 h-3 text-pranay-red" />
            {season.year}
          </span>
        </div>

        {/* Inspect / Open Cue */}
        <div className="absolute top-3.5 right-3.5">
          <span className="px-2 py-1 rounded-full bg-black/60 text-white/90 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md border border-white/10 group-hover:bg-pranay-red transition-colors">
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Inspect</span>
          </span>
        </div>

        {/* Bottom Details */}
        <div className="absolute bottom-4 inset-x-4">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-pranay-red transition-colors line-clamp-1 drop-shadow-md">
            {season.title}
          </h3>
          <p className="text-xs text-gray-300 line-clamp-2 mt-1 leading-snug drop-shadow-sm font-sans">
            {season.caption}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

