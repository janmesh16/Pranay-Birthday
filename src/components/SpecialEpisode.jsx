import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Heart, 
  Film, 
  Maximize2, 
  Shield, 
  Palette, 
  FileText, 
  Camera, 
  Award,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../content';
import { ImageWithFallback } from '../utils/mediaFallback';
import { unlockAchievement } from '../utils/achievements';
import { playWarmChime, playClickSound, playCardFlipSound, playAchievementSound } from '../utils/audio';

export function SpecialEpisode({ onClose }) {
  const special = CONFIG.special;
  const rawPhotos = special.photos && special.photos.length > 0 
    ? special.photos 
    : [
        { url: "/photos/janmesh/01.jpg", title: "Bappa's Blessings", subtitle: "Festive Vibes", tag: "Festive Edition", caption: "Standing side-by-side with Lord Ganesha's blessings." },
        { url: "/photos/janmesh/02.jpg", title: "Suited Up & Unstoppable", subtitle: "Two Brothers", tag: "Dapper Duo", caption: "Dressed in black, sharp as ever." }
      ];

  const letterParagraphs = special.letter ? special.letter.split('\n\n').filter(p => p.trim()) : [];

  // Main Tabs: 'photos' | 'letter' | 'crest' | 'video'
  const [activeTab, setActiveTab] = useState('photos');
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [letterMode, setLetterMode] = useState('narration'); // 'narration' | 'parchment'
  const [isKenBurns, setIsKenBurns] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [sketchLoadFailed, setSketchLoadFailed] = useState(false);

  // Touch gesture handling for mobile swipe
  const touchStartX = useRef(null);

  // Play warm chime on initial open
  useEffect(() => {
    try {
      playWarmChime();
    } catch {}
    unlockAchievement('JANMESH_LETTER');
  }, []);

  // Keyboard navigation for photos
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen) {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowRight') handleNextPhoto();
        if (e.key === 'ArrowLeft') handlePrevPhoto();
        return;
      }
      if (activeTab === 'photos') {
        if (e.key === 'ArrowRight') handleNextPhoto();
        if (e.key === 'ArrowLeft') handlePrevPhoto();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentPhotoIdx, isLightboxOpen, rawPhotos.length]);

  const handleNextPhoto = () => {
    playCardFlipSound();
    setCurrentPhotoIdx((prev) => (prev + 1) % rawPhotos.length);
  };

  const handlePrevPhoto = () => {
    playCardFlipSound();
    setCurrentPhotoIdx((prev) => (prev - 1 + rawPhotos.length) % rawPhotos.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextPhoto();
      } else {
        handlePrevPhoto();
      }
    }
    touchStartX.current = null;
  };

  const handleFireConfetti = () => {
    playAchievementSound();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff', '#ef4444']
    });
  };

  const currentPhoto = rawPhotos[currentPhotoIdx];
  const photoUrl = typeof currentPhoto === 'string' ? currentPhoto : currentPhoto.url;
  const photoTitle = typeof currentPhoto === 'object' && currentPhoto.title ? currentPhoto.title : `Memory ${currentPhotoIdx + 1}`;
  const photoSubtitle = typeof currentPhoto === 'object' && currentPhoto.subtitle ? currentPhoto.subtitle : 'Janmesh & Pranay';
  const photoTag = typeof currentPhoto === 'object' && currentPhoto.tag ? currentPhoto.tag : 'Keepsake';
  const photoCaption = typeof currentPhoto === 'object' && currentPhoto.caption ? currentPhoto.caption : '';
  const isSketchSlot = (typeof currentPhoto === 'object' && currentPhoto.isSketch) || photoUrl.includes('03.jpg');
  const isVideoSlot = Boolean((typeof currentPhoto === 'object' && currentPhoto.isVideo) || (photoUrl && photoUrl.endsWith('.mp4')));

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Subtle Warm Ambient Background Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-black to-black pointer-events-none" />

      {/* 1. CINEMATIC TOP BAR */}
      <header className="h-16 sm:h-20 w-full bg-black/90 backdrop-blur-md z-30 flex items-center justify-between px-4 sm:px-8 safe-top safe-left safe-right border-b border-amber-500/20 shadow-xl">
        {/* Creator Brand Pill */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-600 p-[1.5px] shadow-glow-gold flex-shrink-0">
            <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-display text-amber-400 font-bold">
                PRANAYFLIX ORIGINAL
              </span>
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                SPECIAL EPISODE
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>{special.name}</span>
              <span className="text-amber-400/80 font-normal hidden md:inline">• {special.role}</span>
            </h1>
          </div>
        </div>

        {/* Center Navigation Tabs (Mobile & Desktop) */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-white/[0.06] p-1 rounded-full border border-white/10 backdrop-blur-md">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('photos');
            }}
            className={`min-tap-target px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'photos'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-glow-gold font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Memories</span>
            <span className="text-[10px] opacity-75 font-mono">({rawPhotos.length})</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('letter');
            }}
            className={`min-tap-target px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'letter'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-glow-gold font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>The Letter</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('crest');
            }}
            className={`min-tap-target px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
              activeTab === 'crest'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-glow-gold font-bold'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Brotherhood</span>
          </button>

          {special.video && (
            <button
              onClick={() => {
                playClickSound();
                setActiveTab('video');
              }}
              className={`min-tap-target px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-glow-gold font-bold'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video Reel</span>
            </button>
          )}
        </nav>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-10 h-10 min-tap-target rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-gray-300 hover:text-white transition-all border border-white/10"
          title="Return to PRANAYFLIX"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* 2. MAIN INTERACTIVE CONTENT AREA */}
      <main className="relative flex-1 flex items-center justify-center px-4 sm:px-8 py-3 overflow-y-auto no-scrollbar">
        
        {/* ==================================================== */}
        {/* TAB 1: INTERACTIVE MEMORIES REEL (PHOTOS)           */}
        {/* ==================================================== */}
        {activeTab === 'photos' && (
          <div 
            className="w-full max-w-4xl flex flex-col items-center justify-center my-auto"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Toolbar for Photo */}
            <div className="w-full flex items-center justify-between mb-3 px-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                  {photoTag}
                </span>
                <span className="text-gray-400 text-[11px] font-mono">
                  {currentPhotoIdx + 1} / {rawPhotos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Ken Burns Toggle */}
                {!isVideoSlot && (
                  <button
                    onClick={() => setIsKenBurns(prev => !prev)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                      isKenBurns 
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' 
                        : 'bg-white/5 border-white/10 text-gray-400'
                    }`}
                    title="Toggle cinematic slow pan effect"
                  >
                    {isKenBurns ? 'Ken Burns: ON' : 'Ken Burns: OFF'}
                  </button>
                )}

                {/* Lightbox Expand */}
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 transition-all"
                  title="Inspect fullscreen"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>{isVideoSlot ? 'Fullscreen' : 'Inspect'}</span>
                </button>
              </div>
            </div>

            {/* Cinematic Photo Frame */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-video rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-[#0e0e16] group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhotoIdx}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="w-full h-full relative cursor-pointer"
                  onClick={() => {
                    if (!isVideoSlot) setIsLightboxOpen(true);
                  }}
                >
                  {isVideoSlot ? (
                    <div 
                      className="w-full h-full flex items-center justify-center bg-black relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <video
                        src={photoUrl}
                        controls
                        playsInline
                        webkit-playsinline="true"
                        preload="metadata"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : isSketchSlot && sketchLoadFailed ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#1b1712] via-[#120f0d] to-black">
                      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-glow-gold animate-pulse">
                        <Palette className="w-10 h-10" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest font-mono mb-2">
                        ★ PENDING SKETCH UPLOAD
                      </span>
                      <h3 className="text-xl sm:text-2xl font-serif text-white mb-2">
                        The Hand-Drawn Sketch
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-300 max-w-md leading-relaxed">
                        This sacred canvas is reserved for Janmesh & Pranay's hand-drawn sketched portrait. Once uploaded, it will be immortalized here forever!
                      </p>
                    </div>
                  ) : (
                    <div className={`w-full h-full ${isKenBurns ? 'animate-ken-burns' : ''}`}>
                      <img
                        src={photoUrl}
                        alt={photoTitle}
                        onError={() => {
                          if (isSketchSlot) setSketchLoadFailed(true);
                        }}
                        className="w-full h-full object-cover sm:object-contain bg-black"
                      />
                    </div>
                  )}

                  {/* Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                  {/* Floating Caption & Details */}
                  <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 pointer-events-none">
                    <div className="max-w-2xl">
                      <h2 className="text-lg sm:text-2xl font-serif font-bold text-white drop-shadow-md">
                        {photoTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-amber-300 font-serif italic mb-1.5">
                        {photoSubtitle}
                      </p>
                      {photoCaption && (
                        <p className="text-[11px] sm:text-xs text-gray-200/90 leading-relaxed font-sans line-clamp-2 drop-shadow">
                          "{photoCaption}"
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Left / Right Arrow Controls (Desktop & Large Touch targets) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPhoto();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-xl backdrop-blur-sm"
                title="Previous Memory (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPhoto();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 shadow-xl backdrop-blur-sm"
                title="Next Memory (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnail Filmstrip Navigation */}
            <div className="w-full flex items-center justify-between gap-2 mt-4 px-1">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {rawPhotos.map((item, idx) => {
                  const url = typeof item === 'string' ? item : item.url;
                  const title = typeof item === 'object' && item.title ? item.title : `Photo ${idx + 1}`;
                  const isActive = idx === currentPhotoIdx;
                  const isSketch = (typeof item === 'object' && item.isSketch) || url.includes('03.jpg');
                  const isItemVideo = Boolean((typeof item === 'object' && item.isVideo) || (url && url.endsWith('.mp4')));

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        playCardFlipSound();
                        setCurrentPhotoIdx(idx);
                      }}
                      className={`relative flex-shrink-0 h-14 sm:h-16 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        isActive
                          ? 'border-amber-400 scale-105 shadow-glow-gold'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                      title={title}
                    >
                      {isItemVideo ? (
                        <div className="w-full h-full bg-gradient-to-tr from-amber-950 via-zinc-900 to-black flex flex-col items-center justify-center text-amber-400">
                          <Film className="w-5 h-5 text-amber-400 animate-pulse" />
                          <span className="text-[8px] font-mono uppercase tracking-wider text-amber-300 mt-0.5">Reel</span>
                        </div>
                      ) : isSketch && sketchLoadFailed ? (
                        <div className="w-full h-full bg-[#1b1712] flex items-center justify-center text-amber-400">
                          <Palette className="w-5 h-5" />
                        </div>
                      ) : (
                        <img 
                          src={url} 
                          alt={title}
                          className="w-full h-full object-cover" 
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
                      <span className="absolute bottom-1 left-1.5 text-[9px] font-mono font-bold text-white bg-black/70 px-1 rounded pointer-events-none">
                        {isItemVideo ? '▶ 04' : `0${idx + 1}`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Read Letter Quick Jump */}
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('letter');
                }}
                className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-gold hover:opacity-95 active:scale-95 transition-all"
              >
                <span>Read Letter</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: THE HEARTFELT LETTER                         */}
        {/* ==================================================== */}
        {activeTab === 'letter' && (
          <div className="w-full max-w-2xl my-auto flex flex-col justify-center">
            {/* Mode Switch Header */}
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-serif italic text-amber-300">
                  {letterMode === 'narration' 
                    ? `Passage ${currentLineIdx + 1} of ${letterParagraphs.length}` 
                    : `Complete Letter • Written with Love`}
                </span>
              </div>

              {/* Switch View Mode */}
              <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-lg border border-white/10">
                <button
                  onClick={() => {
                    playClickSound();
                    setLetterMode('narration');
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                    letterMode === 'narration' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Step-by-Step
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setLetterMode('parchment');
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                    letterMode === 'parchment' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Full Parchment
                </button>
              </div>
            </div>

            {/* MODE A: CINEMATIC STEP-BY-STEP NARRATION */}
            {letterMode === 'narration' && (
              <div className="flex flex-col">
                {/* Progress bar */}
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-300"
                    style={{ width: `${((currentLineIdx + 1) / letterParagraphs.length) * 100}%` }}
                  />
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentLineIdx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-[200px] sm:min-h-[250px] flex items-center justify-center text-center px-4 py-4 rounded-2xl bg-amber-950/15 border border-amber-500/20 backdrop-blur-sm"
                  >
                    <p className="font-serif text-base sm:text-xl md:text-2xl text-amber-50/95 leading-relaxed tracking-wide whitespace-pre-line italic">
                      "{letterParagraphs[currentLineIdx]}"
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between pt-2">
                  <button
                    disabled={currentLineIdx === 0}
                    onClick={() => {
                      playClickSound();
                      setCurrentLineIdx(prev => Math.max(0, prev - 1));
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/5 disabled:opacity-20 hover:bg-white/10 text-xs font-medium text-gray-300 uppercase tracking-wider transition-colors"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => {
                      playClickSound();
                      if (currentLineIdx < letterParagraphs.length - 1) {
                        setCurrentLineIdx(prev => prev + 1);
                      } else {
                        handleFireConfetti();
                        setActiveTab('crest');
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:opacity-95 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-glow-gold transition-all active:scale-95"
                  >
                    <span>
                      {currentLineIdx < letterParagraphs.length - 1 
                        ? 'Next Passage' 
                        : 'View Brotherhood Crest'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* MODE B: FULL PARCHMENT SCROLL */}
            {letterMode === 'parchment' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-h-[62vh] overflow-y-auto no-scrollbar p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#181512] via-[#120f0d] to-[#0a0908] border-2 border-amber-500/40 shadow-2xl space-y-4"
              >
                <div className="text-center pb-3 border-b border-amber-500/20">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-400">
                    AN UNBROKEN PROMISE • 10 NOV 2026
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif text-white font-bold mt-1">
                    To My Brother Pranay
                  </h2>
                </div>

                <div className="space-y-4 font-serif text-amber-50/90 text-sm sm:text-base leading-relaxed whitespace-pre-line italic">
                  {special.letter}
                </div>

                <div className="pt-6 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-amber-400/40 bg-amber-500/10 flex items-center justify-center text-amber-400 font-serif font-black text-lg shadow-glow-gold">
                      JR
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-serif">{special.name}</p>
                      <p className="text-[10px] text-amber-300 font-mono">Creator & Lifelong Co-Pilot</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleFireConfetti();
                      setActiveTab('crest');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-gold hover:opacity-95"
                  >
                    <span>Celebrate Brotherhood</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: THE BROTHERHOOD CREST & KEEPSAKE             */}
        {/* ==================================================== */}
        {activeTab === 'crest' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl my-auto text-center px-4"
          >
            {/* Crest Emblem */}
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 p-[2px] shadow-glow-gold mx-auto mb-5">
              <div className="w-full h-full rounded-3xl bg-[#120f0d] flex items-center justify-center text-amber-400">
                <Shield className="w-10 h-10 fill-amber-400/20" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-400 font-bold block mb-1">
              THE UNWRITTEN COVENANT
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide mb-2">
              Janmesh & Pranay
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/80 font-serif italic max-w-md mx-auto mb-6">
              "Two brothers. Nineteen seasons in the books. And a lifetime of blockbuster adventures ahead."
            </p>

            {/* 4 Bond Pillars */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-left mb-6">
              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-amber-500/20">
                <span className="text-amber-400 text-sm font-mono font-bold block">19+ Seasons</span>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5">
                  From childhood memories to stepping together into our 20s.
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-amber-500/20">
                <span className="text-amber-400 text-sm font-mono font-bold block">&infin; Inside Jokes</span>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5">
                  Glances and words that nobody else on Earth will ever decode.
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-amber-500/20">
                <span className="text-amber-400 text-sm font-mono font-bold block">0 Filter</span>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5">
                  100% honesty, zero drama, and having each other's back forever.
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-amber-500/20">
                <span className="text-amber-400 text-sm font-mono font-bold block">Lifetime Co-Pilot</span>
                <p className="text-[10px] sm:text-xs text-gray-300 mt-0.5">
                  Guaranteed front-row seat to each other's biggest victories.
                </p>
              </div>
            </div>

            {/* Celebratory Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 justify-center">
              <button
                onClick={handleFireConfetti}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold uppercase tracking-wider text-xs shadow-glow-gold hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Shower Golden Confetti 🎉</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('photos');
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Revisit Photos</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <span>Back to Homepage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: VAULT VIDEO (IF PRESENT)                     */}
        {/* ==================================================== */}
        {activeTab === 'video' && special.video && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md sm:max-w-lg md:max-w-xl max-h-[75vh] flex flex-col items-center justify-center my-auto px-2"
          >
            {/* Header pill */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Janmesh & Pranay Brotherhood Reel</span>
              </span>
            </div>

            {/* Video Player */}
            <div className="relative w-full max-h-[66vh] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-glow-gold bg-black flex items-center justify-center">
              <video 
                src={special.video} 
                controls 
                autoPlay 
                playsInline
                webkit-playsinline="true"
                preload="metadata"
                className="w-full max-h-[66vh] object-contain rounded-2xl"
              />
            </div>

            <div className="mt-3 text-center">
              <h3 className="text-sm sm:text-base font-serif font-bold text-white">
                {special.videoTitle || "Janmesh & Pranay: The Brotherhood Reel"}
              </h3>
              <p className="text-xs text-amber-300/80 font-serif italic mt-0.5">
                {special.videoSubtitle || "19+ Years of Brotherhood in Motion"}
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* 3. CINEMATIC BOTTOM BAR */}
      <footer className="h-12 sm:h-14 w-full bg-black/95 z-30 flex items-center justify-between px-4 sm:px-8 border-t border-white/5 safe-bottom safe-left safe-right text-[10px] text-gray-400 font-mono">
        <span className="uppercase tracking-widest text-amber-300/80">
          ★ PRANAYFLIX CINEMATIC ARCHIVE • JANMESH ROIDA
        </span>
        <span className="hidden sm:inline text-gray-300 tracking-wider">
          Season 20 Premiere Edition
        </span>
      </footer>

      {/* 4. FULLSCREEN HIGH-RES LIGHTBOX MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Close */}
            <div className="flex items-center justify-between text-white z-20">
              <div>
                <h3 className="text-sm font-serif font-bold text-amber-300">{photoTitle}</h3>
                <p className="text-[11px] text-gray-400 font-mono">{photoTag} • Memory {currentPhotoIdx + 1} of {rawPhotos.length}</p>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 min-tap-target rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Centered High-Res Image with no crop */}
            <div 
              className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {isVideoSlot ? (
                <div className="w-full h-full max-h-[80vh] flex items-center justify-center">
                  <video
                    src={photoUrl}
                    controls
                    autoPlay
                    playsInline
                    webkit-playsinline="true"
                    className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-amber-500/30"
                  />
                </div>
              ) : isSketchSlot && sketchLoadFailed ? (
                <div className="text-center p-6 text-amber-300">
                  <Palette className="w-16 h-16 mx-auto mb-3 opacity-60" />
                  <p className="font-serif text-lg">Hand-Drawn Sketch Chapter</p>
                  <p className="text-xs text-gray-400 mt-1">Upload pending for /photos/janmesh/03.jpg</p>
                </div>
              ) : (
                <img
                  src={photoUrl}
                  alt={photoTitle}
                  className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/10"
                />
              )}
            </div>

            {/* Bottom Caption */}
            <div className="text-center text-xs text-gray-300 max-w-xl mx-auto z-20" onClick={(e) => e.stopPropagation()}>
              <p className="italic font-serif">"{photoCaption || photoSubtitle}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
