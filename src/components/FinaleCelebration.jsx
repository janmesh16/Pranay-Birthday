import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Flame, Mic, MicOff, Gift, ArrowRight, RotateCcw, 
  Check, Heart, Award, HelpCircle, Film, Share2
} from 'lucide-react';
import { CONFIG } from '../content';
import { startBlowDetector, playUnlockSound, playClickSound } from '../utils/audio';
import { PosterCanvas } from './PosterCanvas';
import { unlockAchievement } from '../utils/achievements';

export function FinaleCelebration({ onFinish, onReturnHome }) {
  // Steps: 'still_watching' -> 'cake' -> 'confetti' -> 'credits' -> 'gift_card' -> 'post_credits' -> 'poster'
  const [step, setStep] = useState('still_watching');
  const [candles, setCandles] = useState(Array(20).fill(true)); // all 20 lit
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(null);
  const [giftRedeemed, setGiftRedeemed] = useState(false);
  const micControllerRef = useRef(null);

  // Trigger celebratory confetti burst
  const triggerConfetti = () => {
    playUnlockSound();
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.5 } });
      confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.5 } });
      confetti({ ...defaults, particleCount, origin: { x: 0.5, y: 0.4 } });
    }, 250);
  };

  // Blow out a single candle or remaining candles
  const blowOutCandle = (index) => {
    playClickSound();
    setCandles(prev => {
      const next = [...prev];
      next[index] = false;
      const allOut = next.every(c => !c);
      if (allOut) {
        setTimeout(() => {
          if (micControllerRef.current) micControllerRef.current.stop();
          triggerConfetti();
          unlockAchievement('BLOW_CANDLES');
          setStep('confetti');
        }, 600);
      }
      return next;
    });
  };

  const blowOutAll = () => {
    playClickSound();
    setCandles(Array(20).fill(false));
    if (micControllerRef.current) micControllerRef.current.stop();
    triggerConfetti();
    unlockAchievement('BLOW_CANDLES');
    setStep('confetti');
  };

  // Setup microphone listener when in cake step (with full error & permission safety)
  useEffect(() => {
    if (step === 'cake') {
      let isMounted = true;
      try {
        startBlowDetector(() => {
          // Microphone blow detected! Blow out candles progressively
          setCandles(prev => {
            const litIndices = prev.map((lit, idx) => (lit ? idx : null)).filter(idx => idx !== null);
            if (litIndices.length === 0) return prev;
            
            const next = [...prev];
            // Extinguish 3-5 candles per blow puff
            const toBlow = litIndices.slice(0, 4);
            toBlow.forEach(idx => { next[idx] = false; });
            
            if (next.every(c => !c)) {
              setTimeout(() => {
                try {
                  if (micControllerRef.current && typeof micControllerRef.current.stop === 'function') {
                    micControllerRef.current.stop();
                  }
                } catch {}
                triggerConfetti();
                unlockAchievement('BLOW_CANDLES');
                setStep('confetti');
              }, 600);
            }
            return next;
          });
        }).then(res => {
          if (!isMounted) return;
          if (res && res.supported) {
            setMicActive(true);
            micControllerRef.current = res;
          } else {
            setMicActive(false);
            setMicError(res?.error || "Microphone not active");
          }
        }).catch(err => {
          if (!isMounted) return;
          setMicActive(false);
          setMicError("Microphone unavailable - please tap candles instead");
        });
      } catch (err) {
        setMicActive(false);
        setMicError("Microphone access unavailable");
      }

      return () => {
        isMounted = false;
        try {
          if (micControllerRef.current && typeof micControllerRef.current.stop === 'function') {
            micControllerRef.current.stop();
          }
        } catch {}
      };
    }
  }, [step]);

  const litCount = candles.filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#0b0b0f] text-white flex flex-col justify-between overflow-y-auto select-none p-4 sm:p-8">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-pranay-red/15 via-transparent to-black pointer-events-none" />

      {/* STEP 1: Are you still watching? (Netflix Signature Pop) */}
      {step === 'still_watching' && (
        <div className="m-auto w-full max-w-md bg-[#14141e] border border-white/10 rounded-2xl p-6 sm:p-8 text-center shadow-2xl z-10">
          <div className="w-16 h-16 rounded-2xl bg-pranay-red/15 border border-pranay-red/30 flex items-center justify-center mx-auto mb-5 text-pranay-red shadow-glow-red">
            <Film className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-white mb-2">
            Are you still watching?
          </h2>
          <p className="text-xs text-gray-300 mb-6 leading-relaxed">
            You've completed 19 Seasons of {CONFIG.birthdayName}. The grand 20th Birthday celebration protocol is waiting.
          </p>

          <button
            onClick={() => {
              playClickSound();
              setStep('cake');
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-pranay-red hover:bg-pranay-redDark text-white font-display text-sm uppercase tracking-wider font-bold shadow-glow-red transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Continue to Celebration</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: The 20th Birthday Cake (Mic blow or tap) */}
      {step === 'cake' && (
        <div className="m-auto w-full max-w-lg flex flex-col items-center text-center z-10 py-4">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-pranay-red font-display mb-1">
            Season 20 Milestone
          </span>
          <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-wider text-white mb-2">
            Blow Out The 20 Candles!
          </h2>
          <p className="text-xs text-gray-300 max-w-xs mb-6">
            {micActive 
              ? "💨 Blow into your microphone, or tap each candle to extinguish it!" 
              : "Tap each candle to blow it out for good luck!"}
          </p>

          {/* The Birthday Cake Visual */}
          <div className="relative w-72 sm:w-80 h-56 rounded-t-3xl bg-gradient-to-b from-[#2a1b24] via-[#1f141b] to-[#120a10] border-t-4 border-x-4 border-pink-500/40 shadow-2xl flex flex-col items-center justify-between p-4 pt-3 mt-4">
            {/* Frosting drips */}
            <div className="absolute -top-3 inset-x-0 h-4 bg-gradient-to-r from-pink-400 via-rose-300 to-pink-400 rounded-full blur-[1px] shadow-sm" />

            {/* 20 Candles Grid (2 rows of 10) */}
            <div className="w-full grid grid-cols-10 gap-1 sm:gap-2 pt-1 z-10">
              {candles.map((isLit, idx) => (
                <div
                  key={idx}
                  onClick={() => isLit && blowOutCandle(idx)}
                  className="flex flex-col items-center justify-end cursor-pointer group min-h-[44px] py-1 active:scale-125 transition-transform"
                  title={`Tap to blow out candle ${idx + 1}`}
                >
                  {/* Flame */}
                  <div className="h-5 flex items-end justify-center">
                    {isLit ? (
                      <div className="w-2.5 h-4 bg-gradient-to-t from-orange-500 via-yellow-400 to-amber-200 rounded-full animate-flame shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                    ) : (
                      <div className="w-1 h-2 bg-gray-500/40 rounded-full" />
                    )}
                  </div>
                  {/* Candle Stick */}
                  <div className={`w-1.5 h-6 rounded-t ${idx % 2 === 0 ? 'bg-amber-300' : 'bg-red-400'} shadow-sm`} />
                </div>
              ))}
            </div>

            {/* Cake Center Plate / Badge */}
            <div className="my-auto text-center">
              <span className="text-2xl sm:text-3xl font-display tracking-widest text-pink-300 drop-shadow-md">
                PRANAY • 20
              </span>
              <p className="text-[10px] text-pink-200/60 uppercase tracking-widest font-mono">
                {litCount} {litCount === 1 ? 'candle' : 'candles'} remaining
              </p>
            </div>

            {/* Cake Base */}
            <div className="w-full h-3 bg-pink-600/30 rounded-b-xl border-t border-pink-400/20" />
          </div>

          {/* Action buttons & Mic status */}
          <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-xs">
            <button
              onClick={blowOutAll}
              className="w-full h-12 min-tap-target px-4 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <span>Can't blow? Tap to Extinguish All</span>
            </button>
          </div>

          {/* Microphone Status Banner / Friendly Fallback */}
          <div className="mt-4 w-full max-w-xs">
            {micActive ? (
              <div className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
                <span>Microphone listener active: blow on your phone!</span>
              </div>
            ) : (
              <div className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-gray-300 text-xs flex items-center justify-center gap-2 text-center">
                <MicOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{micError ? "Mic access blocked. Tap the candles to extinguish them!" : "Tap individual candles or the button to blow them out!"}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Confetti Burst & Happy Birthday Animation */}
      {step === 'confetti' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="m-auto w-full max-w-md text-center z-10 py-8 px-4"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-20 h-20 rounded-full bg-gradient-to-tr from-pranay-red to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-glow-red text-white"
          >
            <Sparkles className="w-10 h-10 fill-current" />
          </motion.div>

          <span className="text-xs uppercase font-bold tracking-[0.35em] text-pranay-red font-display">
            Official Premiere Milestone
          </span>
          <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wider text-white mt-1 mb-3">
            Happy 20th Birthday, {CONFIG.birthdayName}!
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto mb-8">
            You've conquered 19 seasons of childhood and teenage chaos. Welcome to the prime-time blockbuster era!
          </p>

          <button
            onClick={() => {
              playClickSound();
              setStep('credits');
            }}
            className="w-full py-3.5 px-6 rounded-xl bg-pranay-red hover:bg-pranay-redDark text-white font-display text-sm uppercase tracking-wider font-bold shadow-glow-red transition-all flex items-center justify-center gap-2"
          >
            <span>Roll End Credits</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* STEP 4: Rolling End Credits */}
      {step === 'credits' && (
        <div className="relative w-full max-w-2xl mx-auto h-[550px] overflow-hidden rounded-2xl bg-[#08080d] border border-white/10 p-6 flex flex-col justify-between z-10">
          <div className="text-center pb-3 border-b border-white/5 flex items-center justify-between">
            <span className="text-xs font-display uppercase tracking-widest text-pranay-red">
              PRANAYFLIX • Official Season 20 Credits
            </span>
            <button
              onClick={() => setStep('gift_card')}
              className="text-xs text-gray-400 hover:text-white uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded"
            >
              Skip Credits &rarr;
            </button>
          </div>

          {/* Rolling marquee style text */}
          <div className="flex-1 overflow-y-auto no-scrollbar py-6 space-y-8 text-center">
            <div className="space-y-1">
              <p className="text-xs text-gray-300 uppercase tracking-widest">A Production by</p>
              <h3 className="text-2xl font-serif text-amber-300">{CONFIG.special.name}</h3>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-gray-300 uppercase tracking-widest">Starring as Himself</p>
              <h3 className="text-3xl font-display tracking-wider text-white">{CONFIG.birthdayName}</h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-300 uppercase tracking-widest">Co-Starring & Friend Circle</p>
              {CONFIG.friends.map(f => (
                <div key={f.id} className="py-2 border-b border-white/5">
                  <p className="text-base font-semibold text-white">{f.name}</p>
                  <p className="text-xs text-pranay-red italic">{f.role}</p>
                  <p className="text-xs text-gray-400 max-w-md mx-auto mt-1 leading-relaxed">
                    "{f.message}"
                  </p>
                </div>
              ))}
            </div>

            <div className="py-4 space-y-2">
              <p className="text-xs text-gray-300 uppercase tracking-widest">Special Thanks</p>
              <p className="text-xs text-gray-400 max-w-md mx-auto italic">
                "{CONFIG.credits.thanks}"
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <button
              onClick={() => {
                playClickSound();
                setStep('gift_card');
              }}
              className="w-full py-3 rounded-xl bg-pranay-red hover:bg-pranay-redDark text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red transition-all"
            >
              <span>Proceed to Birthday Gift Card</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Gift Card Reveal */}
      {step === 'gift_card' && (
        <div className="m-auto w-full max-w-md z-10 text-center px-4">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-amber-400 font-display">
            VIP Reward Unlocked
          </span>
          <h2 className="text-3xl font-display uppercase tracking-wider text-white mt-1 mb-2">
            The 20th Birthday Gift Card
          </h2>
          <p className="text-xs text-gray-300 mb-6">
            Tap redeem below to claim your official birthday voucher.
          </p>

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="rounded-2xl bg-gradient-to-br from-amber-600 via-amber-700 to-yellow-800 p-6 text-black border border-amber-400/50 shadow-glow-gold relative overflow-hidden text-left mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-display text-xl tracking-wider text-black font-extrabold">
                PRANAYFLIX PASS
              </span>
              <Gift className="w-6 h-6 text-black" />
            </div>

            <h3 className="text-lg font-bold text-black mb-1">
              {CONFIG.giftCard.title}
            </h3>
            <p className="text-xs text-amber-950 font-medium mb-4 leading-relaxed">
              {CONFIG.giftCard.message}
            </p>

            <div className="p-3 rounded-xl bg-black/20 border border-black/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-amber-950 font-bold block">
                  Voucher Code
                </span>
                <span className="font-mono text-sm font-black text-black tracking-widest">
                  {CONFIG.giftCard.code}
                </span>
              </div>
              <span className="px-2.5 py-1 rounded bg-black text-amber-400 text-[10px] font-bold uppercase font-display">
                ACTIVE
              </span>
            </div>
          </motion.div>

          <button
            onClick={() => {
              playClickSound();
              setStep('post_credits');
            }}
            className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span>View Post-Credits Teaser</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 6: Post-Credits Scene */}
      {step === 'post_credits' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="m-auto w-full max-w-md text-center z-10 px-4 py-8"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-pranay-red">
            <Film className="w-8 h-8" />
          </div>

          <span className="text-xs uppercase font-bold tracking-[0.4em] text-pranay-red font-display">
            Post-Credits Scene
          </span>
          <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-wider text-white mt-2 mb-2">
            Pranay: Season 21
          </h2>
          <p className="text-base font-serif italic text-amber-300/90 mb-8">
            Coming to Life: 10 November 2027
          </p>

          <div className="p-4 rounded-xl bg-white/[0.04] border border-white/5 mb-8 text-xs text-gray-300 leading-relaxed italic">
            "The journey continues. More stories to tell, more chai to drink, and more memories to build."
          </div>

          <button
            onClick={() => {
              playClickSound();
              setStep('poster');
            }}
            className="w-full py-3.5 rounded-xl bg-pranay-red hover:bg-pranay-redDark text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red transition-all"
          >
            <span>Generate & Download Season 20 Poster</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* STEP 7: Download Season 20 Poster */}
      {step === 'poster' && (
        <div className="m-auto w-full max-w-md z-10 text-center px-4 py-4">
          <span className="text-xs uppercase font-bold tracking-[0.3em] text-pranay-red font-display">
            Official Keepsake
          </span>
          <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-white mt-1 mb-1">
            Season 20 Poster
          </h2>
          <p className="text-xs text-gray-300 mb-2">
            Perfect size for Instagram Story (1080 × 1920).
          </p>

          <PosterCanvas />

          <button
            onClick={onReturnHome}
            className="mt-6 text-xs text-gray-300 hover:text-white uppercase tracking-wider underline underline-offset-4 transition-colors"
          >
            &larr; Back to PRANAYFLIX Homepage
          </button>
        </div>
      )}
    </div>
  );
}

