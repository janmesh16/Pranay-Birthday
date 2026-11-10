import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, X, KeyRound, Sparkles, AlertCircle, Heart, Film, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../utils/mediaFallback';
import { playUnlockSound, playErrorSound, playClickSound } from '../utils/audio';
import { unlockAchievement } from '../utils/achievements';

export function FriendUnlockModal({ 
  friend, 
  isUnlocked, 
  onClose, 
  onUnlockSuccess, 
  onLaunchSpecial 
}) {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shakeKey, setShakeKey] = useState(0);

  if (!friend) return null;

  const isJanmeshSpecial = friend.id === 'janmesh';
  const isLove = friend.isLove || friend.name?.toLowerCase() === 'sana';

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanInput = code.trim().toUpperCase();

    // Check if matches the friend's code (or universal special code)
    const isCodeMatch = cleanInput === friend.code?.toUpperCase() ||
      (friend.aliases && friend.aliases.some(a => a.toUpperCase() === cleanInput)) ||
      (isJanmeshSpecial && cleanInput === 'JANMESH-ROIDA') ||
      (isLove && (cleanInput === 'SANA' || cleanInput === 'SANA-LOVE' || cleanInput === 'LOVE' || cleanInput === 'SANA20' || cleanInput === 'SANA-20'));

    if (isCodeMatch) {
      playUnlockSound();
      unlockAchievement('FRIEND_CODE');
      onUnlockSuccess(friend.id);
      if (isJanmeshSpecial && onLaunchSpecial) {
        onLaunchSpecial();
      }
    } else {
      playErrorSound();
      setShakeKey((prev) => prev + 1);
      setErrorMessage("Wrong code. Ask your friend nicely!");
      setTimeout(() => {
        setErrorMessage('');
      }, 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`relative w-full max-w-lg rounded-2xl bg-[#14141e] border ${
          isLove
            ? 'border-pink-500/50 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
            : isJanmeshSpecial 
              ? 'border-amber-500/40 shadow-glow-gold' 
              : 'border-white/10 shadow-2xl'
        } overflow-hidden text-white`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isUnlocked ? (
          /* LOCKED STATE */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <motion.div 
              key={shakeKey}
              animate={shakeKey > 0 ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-16 h-16 rounded-2xl ${
                isLove
                  ? 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                  : isJanmeshSpecial 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : 'bg-pranay-red/10 border-pranay-red/30 text-pranay-red'
              } border flex items-center justify-center mb-5`}
            >
              {isLove ? <Heart className="w-8 h-8 fill-current text-pink-400" /> : <Lock className="w-8 h-8" />}
            </motion.div>

            <span className={`text-[11px] font-bold tracking-widest uppercase ${
              isLove ? 'text-pink-400' : isJanmeshSpecial ? 'text-amber-400' : 'text-pranay-red'
            }`}>
              {isLove ? "The Special One's Episode ❤️" : isJanmeshSpecial ? "Special Classified Episode" : "Friend's Vault"}
            </span>

            <h3 className="text-xl sm:text-2xl font-display uppercase tracking-wide text-white mt-1 mb-2">
              Unlock {friend.name}'s Episode
            </h3>

            <p className="text-xs text-gray-300 max-w-sm mb-6 leading-relaxed">
              This episode contains an exclusive personal message for Pranay's 20th birthday. Enter the secret code {friend.name} gave you to unlock.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter secret code..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 focus:border-pranay-red focus:outline-none text-center font-mono tracking-widest uppercase text-sm placeholder:text-gray-400 placeholder:normal-case placeholder:font-sans"
                />
                <KeyRound className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-300 pointer-events-none" />
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl ${
                  isLove
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold shadow-md'
                    : isJanmeshSpecial 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-extrabold'
                      : 'bg-pranay-red hover:bg-pranay-redDark text-white'
                } text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2`}
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Episode</span>
              </button>
            </form>

            {/* Error Banner */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 px-3 py-2 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-6 pt-4 border-t border-white/5 w-full flex items-center justify-between text-[11px] text-gray-300">
              <span>Code hint: in <code className="text-gray-300">src/content.js</code></span>
              <span className="font-mono text-gray-300">{friend.code}</span>
            </div>
          </div>
        ) : (
          /* UNLOCKED STATE */
          <div>
            <div className="relative aspect-video w-full bg-black">
              <ImageWithFallback
                src={friend.photo || (friend.photos && (typeof friend.photos[0] === 'string' ? friend.photos[0] : friend.photos[0]?.url))}
                alt={friend.name}
                fallbackTitle={friend.name}
                aspectRatio="aspect-video"
                icon={isLove ? Heart : Film}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14141e] via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded ${
                  isLove
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-md'
                    : isJanmeshSpecial 
                      ? 'bg-amber-500 text-black font-extrabold' 
                      : 'bg-pranay-red text-white font-bold'
                } text-xs uppercase tracking-wider font-display flex items-center gap-1.5`}>
                  <Unlock className="w-3.5 h-3.5" />
                  <span>{isLove ? "Unlocked: Sana's Love Tape ❤️" : "Unlocked Episode"}</span>
                </span>
                <span className="text-xs text-gray-300 bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-sm">
                  {friend.role}
                </span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-display uppercase tracking-wide text-white mb-1">
                {friend.name}
              </h3>
              <p className="text-xs text-gray-300 mb-4">{friend.role}</p>

              <div className={`p-4 rounded-xl ${isLove ? 'bg-pink-950/20 border-pink-500/30' : 'bg-white/[0.04] border-white/5'} border my-3`}>
                <p className={`text-xs uppercase ${isLove ? 'text-pink-400' : 'text-pranay-red'} font-semibold tracking-wider mb-1.5 flex items-center gap-1.5`}>
                  <Heart className={`w-3.5 h-3.5 ${isLove ? 'text-pink-400' : 'text-pranay-red'} fill-current`} />
                  <span>{isLove ? "Special Birthday Wish to Pranay" : "Birthday Message to Pranay"}</span>
                </p>
                <p className="text-sm leading-relaxed text-gray-200 italic whitespace-pre-line">
                  "{friend.message || friend.letter}"
                </p>
              </div>

              {friend.video && (
                <div className={`mt-4 rounded-xl overflow-hidden border ${isLove ? 'border-pink-500/40 shadow-[0_0_25px_rgba(244,63,94,0.3)]' : 'border-white/10'} max-h-[62vh] bg-black flex items-center justify-center`}>
                  <video 
                    src={friend.video} 
                    controls 
                    autoPlay
                    playsInline
                    webkit-playsinline="true"
                    preload="metadata"
                    className="w-full max-h-[62vh] object-contain rounded-xl" 
                  />
                </div>
              )}

              {isJanmeshSpecial && (
                <button
                  onClick={() => {
                    onClose();
                    if (onLaunchSpecial) onLaunchSpecial();
                  }}
                  className="w-full mt-4 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-display text-sm tracking-wider uppercase font-bold flex items-center justify-center gap-2 shadow-glow-gold hover:opacity-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Experience The Special Letterbox Episode</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

