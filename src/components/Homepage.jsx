import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Plus, Check, Bell, Search, AlertCircle, Flame, 
  Lock, Unlock, ChevronRight, ChevronLeft, Star, Heart, 
  Sparkles, Calendar, Clock, Film, Award, User, BarChart3, 
  Users, CheckCircle2 
} from 'lucide-react';
import { CONFIG } from '../content';
import { ImageWithFallback } from '../utils/mediaFallback';
import { EpisodeModal } from './EpisodeModal';
import { FriendUnlockModal } from './FriendUnlockModal';
import { SearchModal } from './SearchModal';
import { ReportProblemModal } from './ReportProblemModal';
import { EasterEggModal } from './EasterEggModal';
import { FanReviews } from './FanReviews';
import { SpecialPhotoCard } from './SpecialPhotoCard';
import { DeletedScenesRow } from './DeletedScenesRow';
import { DeletedSceneModal } from './DeletedSceneModal';
import { TimeCapsuleModal } from './TimeCapsuleModal';
import { YearInReviewModal } from './YearInReviewModal';
import { DirectorsCutModal } from './DirectorsCutModal';
import { LivingBackgroundVideo } from './LivingBackgroundVideo';
import { TimeTunnel } from './TimeTunnel';
import { ParallaxFloatingPhotos } from './ParallaxFloatingPhotos';
import { playClickSound, playUnlockSound } from '../utils/audio';
import { unlockAchievement } from '../utils/achievements';

export function Homepage({ 
  roastMode, 
  onToggleRoastMode, 
  onOpenVideo, 
  onOpenSpecial, 
  onOpenFinale,
  onSwitchProfile,
  onTriggerToast 
}) {
  const [logoTapCount, setLogoTapCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [inMyList, setInMyList] = useState(false);
  const [remindedList, setRemindedList] = useState({});

  // Active modals
  const [activeSeason, setActiveSeason] = useState(null);
  const [activeFriend, setActiveFriend] = useState(null);
  const [activeDeletedScene, setActiveDeletedScene] = useState(null);
  const [showTimeCapsule, setShowTimeCapsule] = useState(false);
  const [showYearInReview, setShowYearInReview] = useState(false);
  const [showDirectorsCut, setShowDirectorsCut] = useState(false);

  // Check if any modal is active (to pause ambient background video)
  const isAnyModalOpen = Boolean(
    activeSeason || 
    activeFriend || 
    activeDeletedScene || 
    showTimeCapsule || 
    showYearInReview || 
    showDirectorsCut || 
    showSearch || 
    showEasterEgg || 
    showReport
  );

  // Unlocked friends list from localStorage
  const [unlockedFriends, setUnlockedFriends] = useState(() => {
    try {
      const saved = localStorage.getItem('pranayflix_unlocked_friends');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic notifications list with unread flags
  const [notificationsList, setNotificationsList] = useState(() => {
    const raw = CONFIG.notifications || [];
    return raw.map((n, i) => {
      if (typeof n === 'object' && n !== null) return n;
      return { id: `init_${i}`, text: String(n), time: "Today", unread: i < 3 };
    });
  });

  const unreadNotificationsCount = notificationsList.filter(n => n.unread).length;

  // Check if every friend episode in CONFIG.friends is unlocked
  const friendIds = (CONFIG.friends || []).map(f => f.id);
  const isSquadFullyUnlocked = friendIds.length > 0 && friendIds.every(id => unlockedFriends.includes(id));

  // Auto-unlock ALL_FRIENDS achievement when squad is complete
  useEffect(() => {
    if (isSquadFullyUnlocked) {
      unlockAchievement('ALL_FRIENDS');
    }
  }, [isSquadFullyUnlocked]);

  // Logo tap counter for Easter Egg (5 taps)
  const handleLogoTap = () => {
    playClickSound();
    const nextCount = logoTapCount + 1;
    setLogoTapCount(nextCount);
    if (nextCount >= 5) {
      playUnlockSound();
      setShowEasterEgg(true);
      setLogoTapCount(0);
    }
  };

  const handleToggleMyList = () => {
    playClickSound();
    const nextState = !inMyList;
    setInMyList(nextState);
    if (nextState) {
      onTriggerToast("Added to Pranay's priority list (estimated review time: 3-5 business years)");
    } else {
      onTriggerToast("Removed from My List");
    }
  };

  const handleToggleRemindMe = (title) => {
    playClickSound();
    const isAlready = Boolean(remindedList[title]);
    setRemindedList(prev => ({ ...prev, [title]: !isAlready }));
    if (!isAlready) {
      onTriggerToast("We'll remind you in your next life.");
    } else {
      onTriggerToast(`Reminder cancelled for ${title}`);
    }
  };

  const handleFriendUnlocked = (friendId) => {
    const friendObj = [...CONFIG.friends, CONFIG.special].find(f => f.id === friendId);
    const friendName = friendObj ? friendObj.name : "Friend";

    setUnlockedFriends(prev => {
      const updated = Array.from(new Set([...prev, friendId]));
      try {
        localStorage.setItem('pranayflix_unlocked_friends', JSON.stringify(updated));
      } catch {}

      // Check if all friends are now unlocked!
      const allDone = friendIds.every(id => updated.includes(id));
      if (allDone) {
        setTimeout(() => {
          unlockAchievement('ALL_FRIENDS');
          setShowDirectorsCut(true);
        }, 800);
      }
      return updated;
    });

    // Add live notification with red dot badge
    const newNote = {
      id: Date.now(),
      text: `🔓 Friend Vault Unlocked: Cracked the code for ${friendName}!`,
      time: "Just now",
      unread: true
    };
    setNotificationsList(prev => [newNote, ...prev]);

    onTriggerToast(`Unlocked ${friendId === 'janmesh' ? 'The Special Episode' : `${friendName}'s Vault`}!`);
  };

  const handleNewReviewNotification = (reviewData) => {
    const isObj = typeof reviewData === 'object' && reviewData !== null;
    const noteText = isObj 
      ? `⭐ New Review from ${reviewData.name || "Friend"} (${reviewData.stars || 5}★): "${(reviewData.message || "").slice(0, 45)}..."`
      : String(reviewData);

    const newNote = {
      id: Date.now(),
      text: noteText,
      time: "Just now",
      unread: true
    };
    setNotificationsList(prev => [newNote, ...prev]);
    onTriggerToast(noteText);
  };

  // Combine standard friends with Janmesh's special episode for the Friends row
  const allFriendCards = [
    {
      ...CONFIG.special,
      isSpecial: true
    },
    ...CONFIG.friends
  ];

  return (
    <div className="relative min-h-screen bg-[#0b0b0f] text-white overflow-x-hidden pb-16 selection:bg-[#E50914] selection:text-white">
      {/* Living Ambient Background Video (Fixed 100dvh background with dark gradient & vignette) */}
      <LivingBackgroundVideo isPaused={isAnyModalOpen} />

      {/* Floating Parallax Photo Layers (Depth ambiance behind rows) */}
      <ParallaxFloatingPhotos />

      {/* 1. TOP NAVBAR */}
      <header className="fixed top-0 inset-x-0 z-40 bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-sm px-4 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo with 5-tap easter egg */}
          <div 
            onClick={handleLogoTap} 
            className="cursor-pointer group flex items-center gap-1.5"
            title="Tap 5 times for a secret easter egg!"
          >
            <span className="pranayflix-logo text-2xl sm:text-3xl font-display tracking-widest">
              {CONFIG.siteName}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-pranay-red text-white uppercase tracking-wider font-display hidden sm:inline-block">
              S20
            </span>
          </div>

          {/* Roast Mode Badge & Toggle */}
          <button
            onClick={onToggleRoastMode}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold transition-all ${
              roastMode 
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Roast Mode: {roastMode ? 'ON 🌶️' : 'OFF'}</span>
          </button>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Mobile Roast Toggle */}
          <button
            onClick={onToggleRoastMode}
            className={`sm:hidden p-2 rounded-full border ${
              roastMode ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'border-transparent text-gray-400'
            }`}
            title="Toggle Roast Mode"
          >
            <Flame className="w-4 h-4" />
          </button>

          {/* Search Button */}
          <button
            onClick={() => setShowSearch(true)}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Search Pranayflix"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Report a Problem (Joke form) */}
          <button
            onClick={() => setShowReport(true)}
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
            title="Report a Problem"
          >
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
              }}
              className="relative p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-pranay-red text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-[0_0_8px_rgba(229,9,20,0.8)] animate-pulse">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#14141e]/98 border border-white/10 p-4 text-white shadow-2xl backdrop-blur-md z-50"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-display uppercase tracking-widest text-pranay-red">
                        Notifications
                      </span>
                      {unreadNotificationsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-pranay-red/20 text-pranay-red text-[10px] font-bold font-mono">
                          {unreadNotificationsCount} new
                        </span>
                      )}
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={() => {
                          setNotificationsList(prev => prev.map(n => ({ ...n, unread: false })));
                        }}
                        className="text-[10px] text-gray-400 hover:text-white underline font-mono"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
                    {notificationsList.map((note) => (
                      <div
                        key={note.id || note.text}
                        className={`p-2.5 rounded-xl border text-xs leading-snug transition-colors flex items-start gap-2.5 ${
                          note.unread 
                            ? 'bg-pranay-red/10 border-pranay-red/30 text-white font-medium' 
                            : 'bg-white/[0.03] border-white/5 text-gray-300'
                        }`}
                      >
                        {note.unread && (
                          <span className="w-2 h-2 rounded-full bg-pranay-red mt-1.5 flex-shrink-0 animate-ping" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="line-clamp-2">{note.text}</p>
                          {note.time && (
                            <span className="text-[9px] text-gray-400 mt-0.5 block font-mono">
                              {note.time}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={onSwitchProfile}
            className="flex items-center gap-1.5 pl-1.5 group"
            title="Switch Profile"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden border border-white/20 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform bg-gradient-to-tr from-red-600 to-red-800">
              <img src="/photos/pranay/bike-hero.jpg" alt="P" className="w-full h-full object-cover" />
            </div>
          </button>
        </div>
      </header>

      {/* 2. HERO BANNER */}
      <section className="relative w-full min-h-[520px] sm:min-h-[640px] flex items-end justify-start pt-20 px-4 sm:px-12 pb-12 overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={CONFIG.heroPhoto}
            alt="Pranay Hero"
            fallbackTitle="Pranay: Season 20 Premiere"
            aspectRatio="aspect-auto"
            className="w-full h-full object-cover"
          />
          {/* Multi-angle cinematic dark vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f] via-[#0b0b0f]/40 to-transparent" />
        </div>

        {/* Hero Metadata & CTA */}
        <div className="relative z-10 max-w-xl">
          {/* Original Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-pranay-red font-display">
              A PRANAYFLIX ORIGINAL
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display uppercase tracking-wider text-white leading-none drop-shadow-md">
            {CONFIG.birthdayName}: Season {CONFIG.age}
          </h1>

          <p className="text-sm sm:text-base font-serif italic text-amber-200/90 mt-2.5 mb-3.5 drop-shadow">
            "{CONFIG.tagline}"
          </p>

          {/* Tags & Rating Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300 mb-6">
            <span className="px-2 py-0.5 rounded bg-white/10 border border-white/20 font-bold text-white">
              U/A 20+
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              99% Match
            </span>
            <span className="text-gray-400">•</span>
            <span>Comedy</span>
            <span className="text-gray-400">•</span>
            <span>Chaos</span>
            <span className="text-gray-400">•</span>
            <span>Bromance</span>
            <span className="text-gray-400">•</span>
            <span>Food-Driven Drama</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenVideo}
              className="py-3 px-6 rounded-xl bg-white text-black hover:bg-gray-200 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 shadow-xl"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Watch Trailer</span>
            </button>

            <button
              onClick={handleToggleMyList}
              className="py-3 px-5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md transition-colors"
            >
              {inMyList ? <Check className="w-4 h-4 text-emerald-400" /> : <Plus className="w-4 h-4" />}
              <span>{inMyList ? 'In My List' : 'My List'}</span>
            </button>

            {/* Secret Finale shortcut button */}
            <button
              onClick={onOpenFinale}
              className="py-3 px-4 rounded-xl bg-pranay-red/20 hover:bg-pranay-red/30 border border-pranay-red/50 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-glow-red"
            >
              <Sparkles className="w-4 h-4 text-pranay-red fill-current" />
              <span>Birthday Finale</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. ROW 1: PREVIOUSLY ON PRANAY (3D DEPTH TIME TUNNEL) */}
      <TimeTunnel onSelectSeason={(s) => setActiveSeason(s)} />

      {/* 4. ROW 2: FRIENDS' EPISODES (LOCKED BEHIND SECRET CODES) */}
      <section className="mt-10 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display uppercase tracking-wider text-white">
              Friends' Episodes (Locked)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-amber-300 font-mono">
              Secret Code Required
            </span>
          </div>

          {isSquadFullyUnlocked && (
            <button
              onClick={() => {
                playClickSound();
                setShowDirectorsCut(true);
              }}
              className="text-xs text-amber-300 hover:text-amber-200 font-bold uppercase tracking-wider flex items-center gap-1 font-display"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Director's Cut Unlocked ⭐</span>
            </button>
          )}
        </div>

        {/* Squad 100% Unlocked Golden Banner */}
        {isSquadFullyUnlocked && (
          <div
            onClick={() => {
              playClickSound();
              setShowDirectorsCut(true);
            }}
            className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-amber-500/25 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-black flex items-center justify-center font-bold shadow-md">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-300 font-display uppercase tracking-wide flex items-center gap-1.5">
                  <span>★ 100% SQUAD UNLOCKED: DIRECTOR'S CUT BONUS READY!</span>
                </h4>
                <p className="text-[11px] text-gray-200">
                  You cracked every friend code! Tap here to watch the exclusive uncensored vault reel & notes.
                </p>
              </div>
            </div>
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-400 group-hover:bg-amber-300 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
              <span>Play Cut</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-4 pt-1">
          {allFriendCards.map((f) => {
            const isUnlocked = unlockedFriends.includes(f.id);
            const isSpecial = f.id === 'janmesh';
            const isLove = f.isLove || f.name?.toLowerCase() === 'sana';

            return (
              <div
                key={f.id}
                onClick={() => {
                  if (isSpecial && isUnlocked) {
                    onOpenSpecial();
                  } else {
                    setActiveFriend(f);
                  }
                }}
                className="snap-start-card flex-shrink-0 w-48 sm:w-60 group cursor-pointer"
              >
                <div className={`relative aspect-video rounded-xl overflow-hidden border ${
                  isLove
                    ? 'border-pink-500/60 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                    : isSpecial 
                      ? 'border-amber-500/50 shadow-glow-gold' 
                      : isUnlocked ? 'border-emerald-500/40' : 'border-white/10 group-hover:border-pranay-red'
                } transition-all duration-300 transform group-hover:scale-105 shadow-xl bg-[#14141e]`}>
                  <ImageWithFallback
                    src={f.photo || (f.photos && (typeof f.photos[0] === 'string' ? f.photos[0] : f.photos[0]?.url))}
                    alt={f.name}
                    fallbackTitle={f.name}
                    aspectRatio="aspect-video"
                    icon={isLove ? Heart : Film}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Lock/Unlock Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    {isUnlocked ? (
                      <span className={`px-2 py-0.5 rounded-full ${
                        isLove ? 'bg-gradient-to-r from-pink-600 to-rose-600' : 'bg-emerald-500/80'
                      } text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm shadow-sm`}>
                        {isLove ? <Heart className="w-3 h-3 fill-current" /> : <Unlock className="w-3 h-3" />}
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full ${
                        isLove ? 'bg-pink-900/90 text-pink-200 border-pink-500/40' : isSpecial ? 'bg-amber-500 text-black' : 'bg-black/80 text-white'
                      } text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm border border-white/15`}>
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  {/* Special Loved One Banner */}
                  {isLove && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Heart className="w-2.5 h-2.5 fill-current" />
                        <span>Special One ❤️</span>
                      </span>
                    </div>
                  )}

                  {/* Special Episode Banner */}
                  {!isLove && isSpecial && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-[9px] font-extrabold uppercase tracking-wider font-display">
                        ★ Special Episode
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h3 className={`text-xs sm:text-sm font-bold ${
                      isLove ? 'text-pink-300 font-sans' : isSpecial ? 'text-amber-300 font-serif' : 'text-white'
                    } line-clamp-1`}>
                      {f.name}
                    </h3>
                    <p className="text-[10px] text-gray-300 line-clamp-1 italic">
                      {f.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ROW 3: TOP 10 IN PRANAY'S FRIEND CIRCLE TODAY */}
      <section className="mt-10 px-4 sm:px-8">
        <h2 className="text-lg sm:text-xl font-display uppercase tracking-wider text-white mb-3">
          Top 10 in Pranay's Friend Circle Today
        </h2>

        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-4 pt-1">
          {CONFIG.topTen.map((item) => (
            <div
              key={item.rank}
              className="snap-start-card flex-shrink-0 flex items-center w-64 sm:w-72 bg-[#12121c] border border-white/5 rounded-2xl p-3 shadow-lg group hover:border-pranay-red transition-colors"
            >
              {/* Giant Rank Number in Netflix style */}
              <span className="text-5xl sm:text-6xl font-display font-black text-white/20 group-hover:text-pranay-red/40 transition-colors w-14 flex-shrink-0 text-center">
                #{item.rank}
              </span>

              {/* Inside Joke Text */}
              <div className="flex-1 pl-2">
                <span className="text-[10px] text-pranay-red uppercase font-bold tracking-wider">
                  Top Trending Habit
                </span>
                <p className="text-xs sm:text-sm font-semibold text-gray-200 leading-snug line-clamp-3 mt-0.5">
                  "{item.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. ROW 4: CONTINUE WATCHING */}
      <section className="mt-10 px-4 sm:px-8">
        <h2 className="text-lg sm:text-xl font-display uppercase tracking-wider text-white mb-3">
          Continue Watching for Pranay
        </h2>

        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-4 pt-1">
          {CONFIG.continueWatching.map((cw, idx) => (
            <div
              key={idx}
              onClick={() => onTriggerToast(`Resuming "${cw.title}"... buffer error: laziness detected`)}
              className="snap-start-card flex-shrink-0 w-52 sm:w-60 bg-[#14141e] rounded-xl overflow-hidden border border-white/10 hover:border-white/25 cursor-pointer transition-all shadow-md group"
            >
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center p-3 text-center overflow-hidden">
                {cw.photo && (
                  <img
                    src={cw.photo}
                    alt={cw.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/25 transition-colors" />
                <div className="relative z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-pranay-red text-white flex items-center justify-center transition-colors shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[9px] text-gray-200 font-mono z-10 border border-white/10">
                  {cw.season}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1 bg-white/10">
                <div className="h-full bg-pranay-red" style={{ width: `${cw.progress}%` }} />
              </div>

              <div className="p-3">
                <h3 className="text-xs font-semibold text-white line-clamp-1">{cw.title}</h3>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1">
                  <span>{cw.duration}</span>
                  <span className="text-pranay-red font-bold">{cw.progress}% watched</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6.3 HIS SPECIAL PHOTO (FEATURED SPOTLIGHT CARD) */}
      <SpecialPhotoCard />

      {/* 6.5 DELETED SCENES & BLOOPERS ROW */}
      <DeletedScenesRow 
        onSelectScene={(scene) => {
          unlockAchievement('DELETED_SCENES');
          setActiveDeletedScene(scene);
        }} 
      />

      {/* 7. ROW 5: COMING SOON + SEASON 30 TIME CAPSULE */}
      <section className="mt-10 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-display uppercase tracking-wider text-white">
            Coming Soon to Pranay's Life
          </h2>
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">Future Seasons & Vaults</span>
        </div>

        {/* Featured Season 30 Time Capsule Card */}
        <div
          onClick={() => {
            playClickSound();
            unlockAchievement('TIME_CAPSULE');
            setShowTimeCapsule(true);
          }}
          className="mb-5 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#171329] via-[#100e1f] to-[#090712] border-2 border-indigo-500/40 shadow-[0_0_35px_rgba(99,102,241,0.2)] hover:border-indigo-400 transition-all cursor-pointer group flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold font-mono uppercase tracking-wider">
                  Vault Locked Until 10 Nov 2036
                </span>
                <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                  Decade Vault
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {CONFIG.timeCapsule?.title || "Season 30: The 10-Year Time Capsule"}
              </h3>
              <p className="text-xs text-gray-300 max-w-lg mt-0.5">
                Contains sealed letters from Janmesh and squad predictions for Pranay at age 30. Auto-decrypts on his 30th birthday.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/10 pt-3 md:pt-0">
            <div className="text-left md:text-right font-mono">
              <span className="text-[10px] text-indigo-300 uppercase block tracking-widest font-bold">
                Security Status
              </span>
              <span className="text-xs text-white flex items-center gap-1 font-bold">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cryogenically Sealed</span>
              </span>
            </div>

            <button className="h-11 min-tap-target px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all">
              <span>Inspect Vault</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONFIG.comingSoon.map((cs, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#14141e] border border-white/5 flex flex-col justify-between hover:border-white/15 transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                    {cs.date}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Expected Release</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{cs.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{cs.desc}</p>
              </div>

              <button
                onClick={() => handleToggleRemindMe(cs.title)}
                className={`mt-4 w-full py-2 px-3 rounded-xl border text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${
                  remindedList[cs.title]
                    ? 'bg-pranay-red text-white border-pranay-red'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{remindedList[cs.title] ? 'Reminded 🔔' : 'Remind Me'}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 8. ROW 6: CAST & CREW */}
      <section className="mt-10 px-4 sm:px-8">
        <h2 className="text-lg sm:text-xl font-display uppercase tracking-wider text-white mb-3">
          Star Cast & Lifelong Crew
        </h2>

        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-4 pt-1">
          {/* Pranay Main Lead */}
          <div className="snap-start-card flex-shrink-0 w-36 sm:w-44 text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto mb-2 border-2 border-pranay-red shadow-glow-red bg-[#161622] flex items-center justify-center">
              <ImageWithFallback
                src="/photos/pranay/bike-hero.jpg"
                alt={CONFIG.birthdayName}
                fallbackTitle={CONFIG.birthdayName}
                aspectRatio="aspect-square"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white">{CONFIG.birthdayName}</h4>
            <p className="text-[10px] text-pranay-red font-semibold uppercase tracking-wide">The Main Character</p>
          </div>

          {/* Janmesh Director */}
          <div 
            onClick={() => {
              playClickSound();
              onOpenSpecial();
            }}
            className="snap-start-card flex-shrink-0 w-36 sm:w-44 text-center cursor-pointer group"
          >
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto mb-2 border-2 border-amber-400 group-hover:border-amber-300 shadow-glow-gold bg-[#161622] transition-transform duration-300 group-hover:scale-105">
              <ImageWithFallback
                src={CONFIG.special.photo || "/photos/janmesh/02.jpg"}
                alt={CONFIG.special.name}
                fallbackTitle={CONFIG.special.name}
                aspectRatio="aspect-square"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{CONFIG.special.name}</h4>
            <p className="text-[10px] text-amber-300 font-semibold uppercase tracking-wide">Director & Creator</p>
          </div>

          {/* Friends */}
          {CONFIG.friends.map(f => (
            <div key={f.id} className="snap-start-card flex-shrink-0 w-36 sm:w-44 text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto mb-2 border-2 border-white/10 bg-[#161622] flex items-center justify-center">
                <User className="w-12 h-12 text-gray-500" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{f.name}</h4>
              <p className="text-[10px] text-gray-400 line-clamp-1 italic">{f.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8.5 YOUR YEAR IN REVIEW (SEASON 19 WRAPPED) */}
      <section className="mt-14 px-4 sm:px-8">
        <div 
          onClick={() => {
            playClickSound();
            unlockAchievement('YEAR_IN_REVIEW');
            setShowYearInReview(true);
          }}
          className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-red-950 via-rose-950 to-black border-2 border-pranay-red/40 shadow-glow-red cursor-pointer hover:border-pranay-red transition-all group"
        >
          {/* Background ambient lighting */}
          <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-pranay-red/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-pranay-red text-white text-[10px] font-black uppercase tracking-widest font-display shadow-sm">
                  ★ PRANAY WRAPPED 2026
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  Swipeable Stories
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-wider text-white group-hover:text-pranay-red transition-colors">
                Your Year in Review: Season 19
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
                4,218 times saying "Bhai", 14-day WhatsApp latency, 847 cups of cutting chai, and 100% completion of your teenage saga. Tap to view your official animated stories!
              </p>
            </div>

            <button className="h-12 min-tap-target px-6 rounded-2xl bg-white text-black hover:bg-gray-200 active:scale-95 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl transition-all flex-shrink-0">
              <Sparkles className="w-4 h-4 text-pranay-red fill-current" />
              <span>Open Wrapped Stories</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 9. SCREEN 8: FAN REVIEWS WALL */}
      <FanReviews onNewReviewPosted={handleNewReviewNotification} />

      {/* 10. FOOTER */}
      <footer className="mt-12 text-center text-xs text-gray-400 px-4 space-y-2 border-t border-white/5 pt-8">
        <p className="pranayflix-logo text-xl font-display tracking-widest">
          {CONFIG.siteName}
        </p>
        <p>
          Created with endless brotherhood & love by <strong>{CONFIG.special.name}</strong> for Pranay's 20th Birthday.
        </p>
        <p className="text-[10px] text-gray-400">
          *Not affiliated with Netflix Inc. All roast subtitles are scientifically verified facts.
        </p>
      </footer>

      {/* MODALS */}
      {/* Season Episode Modal */}
      {activeSeason && (
        <EpisodeModal
          season={activeSeason}
          onClose={() => setActiveSeason(null)}
          totalSeasons={CONFIG.seasons.length}
          onNextSeason={() => {
            const nextIdx = CONFIG.seasons.findIndex(s => s.season === activeSeason.season) + 1;
            if (nextIdx < CONFIG.seasons.length) {
              setActiveSeason(CONFIG.seasons[nextIdx]);
            } else {
              setActiveSeason(null);
            }
          }}
        />
      )}

      {/* Friend Unlock Modal */}
      {activeFriend && (
        <FriendUnlockModal
          friend={activeFriend}
          isUnlocked={unlockedFriends.includes(activeFriend.id)}
          onClose={() => setActiveFriend(null)}
          onUnlockSuccess={handleFriendUnlocked}
          onLaunchSpecial={() => {
            setActiveFriend(null);
            onOpenSpecial();
          }}
        />
      )}

      {/* Search Modal */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onSelectSeason={(season) => {
            setShowSearch(false);
            setActiveSeason(season);
          }}
        />
      )}

      {/* Report Problem Modal */}
      {showReport && (
        <ReportProblemModal onClose={() => setShowReport(false)} />
      )}

      {/* Secret Easter Egg Modal */}
      {showEasterEgg && (
        <EasterEggModal onClose={() => setShowEasterEgg(false)} />
      )}

      {/* Deleted Scene Modal */}
      {activeDeletedScene && (
        <DeletedSceneModal
          scene={activeDeletedScene}
          onClose={() => setActiveDeletedScene(null)}
        />
      )}

      {/* Season 30 Time Capsule Modal */}
      {showTimeCapsule && (
        <TimeCapsuleModal onClose={() => setShowTimeCapsule(false)} />
      )}

      {/* Year in Review (Wrapped) Modal */}
      {showYearInReview && (
        <YearInReviewModal onClose={() => setShowYearInReview(false)} />
      )}

      {/* Director's Cut Bonus Modal */}
      {showDirectorsCut && (
        <DirectorsCutModal onClose={() => setShowDirectorsCut(false)} />
      )}
    </div>
  );
}

