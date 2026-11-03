import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ChevronRight, X, Heart, Film } from 'lucide-react';
import { CONFIG } from '../content';
import { ImageWithFallback } from '../utils/mediaFallback';
import { unlockAchievement } from '../utils/achievements';

export function SpecialEpisode({ onClose }) {
  // Steps: 'title' -> 'photos' -> 'letter' -> 'video' -> 'closing'
  const [step, setStep] = useState('title');
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);

  const special = CONFIG.special;
  const photos = special.photos && special.photos.length > 0 ? special.photos : ["/photos/janmesh/01.jpg"];
  const letterParagraphs = special.letter ? special.letter.split('\n\n').filter(p => p.trim()) : [];

  // Title card duration: 3.5 seconds then moves to photos
  useEffect(() => {
    if (step === 'title') {
      const timer = setTimeout(() => {
        setStep('photos');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // When entering letter step, unlock achievement
  useEffect(() => {
    if (step === 'letter') {
      unlockAchievement('JANMESH_LETTER');
    }
  }, [step]);

  // Photo sequence: cycles through photos, then transitions to letter
  useEffect(() => {
    if (step === 'photos') {
      const photoTimer = setTimeout(() => {
        if (currentPhotoIdx < photos.length - 1) {
          setCurrentPhotoIdx(prev => prev + 1);
        } else {
          setStep('letter');
        }
      }, 4200);
      return () => clearTimeout(photoTimer);
    }
  }, [step, currentPhotoIdx, photos.length]);

  const handleNextParagraph = () => {
    if (currentLineIdx < letterParagraphs.length - 1) {
      setCurrentLineIdx(prev => prev + 1);
    } else {
      if (special.video) {
        setStep('video');
      } else {
        setStep('closing');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Cinematic Letterbox: Top Black Bar */}
      <div className="h-14 sm:h-20 w-full bg-black z-30 flex items-center justify-between px-6 safe-top safe-left safe-right border-b border-white/5">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-serif text-amber-300/80">
          A Special Episode • {special.name}
        </span>
        <button
          onClick={onClose}
          className="w-11 h-11 min-tap-target rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main View Area */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-4 overflow-hidden">
        {/* Subtle Ambient Gold Glow in background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/15 via-transparent to-black pointer-events-none" />

        {/* STEP 1: Title Card */}
        {step === 'title' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="text-center max-w-lg z-10"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400 shadow-glow-gold"
            >
              <Heart className="w-7 h-7 fill-current" />
            </motion.div>
            <span className="text-xs uppercase tracking-[0.4em] text-amber-400 font-display block mb-2">
              PRANAYFLIX EXCLUSIVE
            </span>
            <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-wide">
              Special Episode
            </h1>
            <h2 className="text-lg sm:text-xl font-serif italic text-amber-200/90 mt-2">
              A Letter from {special.name}
            </h2>
          </motion.div>
        )}

        {/* STEP 2: Photo Sequence with Ken Burns Effect */}
        {step === 'photos' && (
          <div className="relative w-full max-w-2xl aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhotoIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
                className="w-full h-full relative"
              >
                <div className="w-full h-full animate-ken-burns">
                  <ImageWithFallback
                    src={photos[currentPhotoIdx]}
                    alt={`Memory ${currentPhotoIdx + 1}`}
                    fallbackTitle={`Memory ${currentPhotoIdx + 1}`}
                    aspectRatio="aspect-video"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-xs tracking-widest uppercase text-amber-300 font-mono">
                    Memory {currentPhotoIdx + 1} of {photos.length}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => setStep('letter')}
              className="absolute top-4 right-4 z-20 px-3 py-1 rounded-md bg-black/60 hover:bg-black/90 text-xs text-gray-300 hover:text-white uppercase tracking-wider backdrop-blur-sm"
            >
              Read Letter &rarr;
            </button>
          </div>
        )}

        {/* STEP 3: The Letter (Line-by-line / Paragraph with Tap to Continue) */}
        {step === 'letter' && (
          <div className="w-full max-w-2xl z-10 flex flex-col justify-center">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-serif italic text-amber-300">
                  Part {currentLineIdx + 1} of {letterParagraphs.length}
                </span>
              </div>
              <span className="text-[11px] text-gray-300">
                Tap anywhere or click Next to read
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentLineIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.7 }}
                className="min-h-[180px] sm:min-h-[220px] flex items-center justify-center text-center px-4"
              >
                <p className="font-serif text-base sm:text-xl md:text-2xl text-amber-50/95 leading-relaxed tracking-wide whitespace-pre-line italic">
                  "{letterParagraphs[currentLineIdx]}"
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
              <button
                disabled={currentLineIdx === 0}
                onClick={() => setCurrentLineIdx(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl bg-white/5 disabled:opacity-20 hover:bg-white/10 text-xs font-medium text-gray-300 uppercase tracking-wider transition-colors"
              >
                Previous
              </button>

              <button
                onClick={handleNextParagraph}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:opacity-95 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-glow-gold transition-all active:scale-95"
              >
                <span>{currentLineIdx < letterParagraphs.length - 1 ? 'Continue' : special.video ? 'Watch Video' : 'Final Card'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Optional Video */}
        {step === 'video' && special.video && (
          <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <video 
              src={special.video} 
              controls 
              autoPlay 
              playsInline
              webkit-playsinline="true"
              preload="metadata"
              onEnded={() => setStep('closing')}
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* STEP 5: Closing Card */}
        {step === 'closing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center max-w-md z-10 px-4"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-6 text-amber-400">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif italic text-white mb-2">
              "Season 20 is just the beginning."
            </h2>
            <p className="text-xs text-amber-200/80 mb-8 font-serif">
              Crafted with endless love by {special.name}
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold uppercase tracking-wider text-xs shadow-glow-gold hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Return to PRANAYFLIX Homepage</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Cinematic Letterbox: Bottom Black Bar */}
      <div className="h-12 sm:h-20 w-full bg-black z-30 flex items-center justify-center border-t border-white/5">
        <span className="text-[10px] text-gray-400 tracking-widest uppercase">
          PRANAYFLIX CINEMATIC VAULT • RESTRICTED ARCHIVE
        </span>
      </div>
    </div>
  );
}

