import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Send, ShieldAlert, Clock, Lock, Sparkles, CheckCircle2, Wifi, Radio } from 'lucide-react';
import { subscribeToReviews, addReview } from '../firebase';
import { CONFIG } from '../content';
import { playUnlockSound } from '../utils/audio';
import { getAccurateNow, hasUnlocked } from '../utils/timeSync';
import { unlockAchievement } from '../utils/achievements';

const BAD_WORDS = ['hate', 'ugly', 'scam', 'fraud', 'worst'];

export function FanReviews({ onNewReviewPosted }) {
  const [reviews, setReviews] = useState([]);
  const [totalVaultedCount, setTotalVaultedCount] = useState(0);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [stars, setStars] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(() => hasUnlocked(CONFIG.unlockAt));
  const [syncStatus, setSyncStatus] = useState({ mode: 'cloud', connected: true });
  const [newArrivalPing, setNewArrivalPing] = useState(false);
  const previousReviewsLength = useRef(null);

  // Determine whether reviews should be held until unlock
  const shouldHold = CONFIG.holdUntilUnlock ?? CONFIG.reviews?.holdUntilUnlock ?? true;
  const isHolding = shouldHold && !isUnlocked;

  // Check accurate unlock status periodically
  useEffect(() => {
    const checkUnlockStatus = () => {
      const unlockedNow = hasUnlocked(CONFIG.unlockAt);
      if (unlockedNow !== isUnlocked) {
        setIsUnlocked(unlockedNow);
      }
    };

    checkUnlockStatus();
    const interval = setInterval(checkUnlockStatus, 1000);
    return () => clearInterval(interval);
  }, [isUnlocked]);

  // Check cooldown timer from localStorage
  useEffect(() => {
    const checkCooldown = () => {
      try {
        const lastPost = localStorage.getItem('pranayflix_last_review_ts');
        if (lastPost) {
          const diff = Date.now() - Number(lastPost);
          const cooldownMs = 30000; // 30s
          if (diff < cooldownMs) {
            setCooldownRemaining(Math.ceil((cooldownMs - diff) / 1000));
          } else {
            setCooldownRemaining(0);
          }
        }
      } catch {
        setCooldownRemaining(0);
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to real-time reviews in Firestore (or local dev storage)
  useEffect(() => {
    let unsubscribe = null;
    try {
      unsubscribe = subscribeToReviews(
        (allReviews) => {
          const safeList = Array.isArray(allReviews) ? allReviews : [];
          setTotalVaultedCount(safeList.length);

          // Detect live incoming review from another device
          if (previousReviewsLength.current !== null && safeList.length > previousReviewsLength.current) {
            setNewArrivalPing(true);
            setTimeout(() => setNewArrivalPing(false), 3000);
            if (onNewReviewPosted && safeList[0]) {
              onNewReviewPosted({
                name: safeList[0].name || "Anonymous Friend",
                stars: safeList[0].stars || 5,
                message: safeList[0].message || "Best series ever!"
              });
            }
          }
          previousReviewsLength.current = safeList.length;

          if (isHolding) {
            // Reviews posted before unlock time are saved but hidden from the feed until unlockAt
            setReviews([]);
          } else {
            // When unlocked, all appear together
            setReviews(safeList);
          }
        },
        (status) => {
          setSyncStatus(status);
        }
      );
    } catch (err) {
      console.warn("Reviews subscription error, using empty state:", err);
      setReviews([]);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        try {
          unsubscribe();
        } catch {}
      }
    };
  }, [isHolding]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (cooldownRemaining > 0) {
      setFormError(`Please wait ${cooldownRemaining}s before posting another review.`);
      return;
    }

    const cleanName = name.trim();
    const cleanMsg = message.trim();

    if (!cleanName) {
      setFormError("Please enter your name.");
      return;
    }
    if (cleanName.length > 40) {
      setFormError("Name must be under 40 characters.");
      return;
    }
    if (!cleanMsg) {
      setFormError("Please enter a short birthday message or review.");
      return;
    }
    if (cleanMsg.length > 300) {
      setFormError("Review must be under 300 characters.");
      return;
    }

    // Profanity check
    const hasBadWord = BAD_WORDS.some(bw => cleanMsg.toLowerCase().includes(bw));
    if (hasBadWord) {
      setFormError("Only positive vibes & birthday love permitted!");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        name: cleanName,
        stars,
        message: cleanMsg
      });

      playUnlockSound();
      unlockAchievement('FAN_REVIEW');
      try {
        localStorage.setItem('pranayflix_last_review_ts', String(Date.now()));
      } catch {}

      setCooldownRemaining(30);
      setName('');
      setMessage('');
      setStars(5);

      if (isHolding) {
        setSuccessMessage("Review saved to cloud! It is safely stored in the vault and will appear at midnight on 10 Nov.");
        setTotalVaultedCount(prev => prev + 1);
      } else {
        setSuccessMessage("Review posted live to Cloud Firestore!");
      }

      if (onNewReviewPosted) {
        onNewReviewPosted(`${cleanName} posted a 5★ review!`);
      }
    } catch (err) {
      setFormError(err.message || "Failed to save review. Please check connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatReviewTime = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return "Just now";
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-white/10">
      {/* Wall Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-pranay-red" />
            <span className="text-xs font-bold uppercase tracking-widest text-pranay-red font-display">
              Audience Wall
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display uppercase tracking-wider text-white">
            Fan Reviews & Wishes
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Certified Rotten Tomatoes: 100% Fresh • Rated by friends & family
          </p>
        </div>

        {/* Right Badges: Live Sync Status + Star Average */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subtle Live Sync Indicator */}
          {syncStatus.mode === 'cloud' && syncStatus.connected ? (
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border ${
                newArrivalPing ? 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'border-emerald-500/30'
              } text-emerald-400 text-xs transition-all duration-300`}
              title="Connected to Firebase Cloud Firestore. Reviews update in real-time across devices."
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold tracking-wider uppercase text-[10px] font-mono">
                {newArrivalPing ? '⚡ Synced New Review' : 'Live Cloud Sync'}
              </span>
            </div>
          ) : syncStatus.mode === 'local' ? (
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono"
              title="Running in local storage fallback mode for development"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="font-semibold uppercase text-[10px]">Local Mode (Dev)</span>
            </div>
          ) : (
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono"
              title="Connecting to Cloud Firestore..."
            >
              <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></span>
              <span className="font-semibold uppercase text-[10px]">Connecting...</span>
            </div>
          )}

          {/* Average Rating Badge */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs text-gray-300">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">4.9 / 5.0</span>
            <span className="text-gray-400">
              ({isHolding ? `${totalVaultedCount} locked in vault` : `${reviews.length} reviews`})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Review Submission Form */}
        <div className="lg:col-span-5 bg-[#12121c] border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-display uppercase tracking-wide text-white mb-1">
            Leave a Review for Pranay
          </h3>
          <p className="text-xs text-gray-400 mb-5">
            {isHolding 
              ? "All wishes are safely locked and will be revealed at midnight 10 Nov!" 
              : "Drop your birthday wish, inside joke, or roast line."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Your Name
                </label>
                <span className="text-[10px] text-gray-400 font-mono">{name.length}/40</span>
              </div>
              <input
                type="text"
                placeholder="e.g. Aryan, Rohan, Mystery Fan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-pranay-red focus:outline-none text-sm text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Star Rating
                </label>
                <span className="text-[10px] text-amber-400/90 font-medium italic">
                  *Ratings below 5 are disabled for this VIP
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setStars(val)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                      stars === val 
                        ? 'bg-amber-400/15 border-amber-400 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.25)]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{val} Stars {val === 5 ? '⭐' : '🔥'}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Message / Wish
                </label>
                <span className="text-[10px] text-gray-400 font-mono">{message.length}/300</span>
              </div>
              <textarea
                placeholder="Write your birthday wish or roast..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={300}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 focus:border-pranay-red focus:outline-none text-sm text-white placeholder:text-gray-400 resize-none"
              />
            </div>

            {formError && (
              <div className="p-2.5 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || cooldownRemaining > 0}
              className="w-full py-3 rounded-xl bg-pranay-red disabled:opacity-50 hover:bg-pranay-redDark text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-glow-red active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>
                {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s (Cooldown)` : isSubmitting ? 'Posting...' : 'Post Review'}
              </span>
            </button>
          </form>
        </div>

        {/* Right: Live Reviews Feed OR Premiere Vault Locked Banner */}
        <div className="lg:col-span-7 space-y-3.5 max-h-[520px] overflow-y-auto no-scrollbar pr-1">
          {isHolding ? (
            /* HELD UNTIL UNLOCK BANNER */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-[#141422] border border-amber-500/30 shadow-glow-gold text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
                <Lock className="w-8 h-8" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400 font-display">
                Premiere Night Security Protocol
              </span>
              <h3 className="text-xl sm:text-2xl font-display uppercase tracking-wider text-white mt-1 mb-2">
                Fan Reviews Held Until Midnight
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed mb-6">
                All birthday wishes and fan reviews submitted before premiere time are safely locked in the cloud. They will all be revealed together at <strong>10 Nov 2026, 12:00 AM IST</strong> so Pranay sees every wish at the same time!
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-amber-300 font-mono">
                <Sparkles className="w-4 h-4 text-amber-400 fill-current" />
                <span>{totalVaultedCount} wishes already locked in the vault</span>
              </div>
            </motion.div>
          ) : reviews.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-400 font-semibold">No reviews unlocked yet</p>
              <p className="text-xs text-gray-600 mt-1">Be the first to post a 5-star review!</p>
            </div>
          ) : (
            reviews.map((r, idx) => (
              <motion.div
                key={r.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-xl bg-[#14141f] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pranay-red to-orange-600 flex items-center justify-center text-white text-xs font-bold uppercase">
                      {r.name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-wide">{r.name}</h4>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: r.stars || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-300 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {formatReviewTime(r.createdAt)}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic pl-10">
                  "{r.message}"
                </p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
