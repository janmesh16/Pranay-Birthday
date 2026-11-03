import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, 
  Subtitles, ThumbsDown, ThumbsUp, Heart, X, ChevronRight, 
  Flame, Sparkles, Check
} from 'lucide-react';
import { CONFIG } from '../content';
import { playClickSound, playErrorSound, unlockAudio } from '../utils/audio';
import { unlockAchievement } from '../utils/achievements';

export function VideoPlayer({ onVideoEnd, onClose, initialRoastMode = false }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60); // default 60s for simulation
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [roastMode, setRoastMode] = useState(initialRoastMode);
  const [subtitleTrack, setSubtitleTrack] = useState(initialRoastMode ? 'roast' : 'english');
  const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
  const [dislikeError, setDislikeError] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [userRating, setUserRating] = useState(null); // 'like', 'double'
  const [videoHasError, setVideoHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFinishVideo = () => {
    unlockAchievement('WATCH_TRAILER');
    if (onVideoEnd) onVideoEnd();
  };

  // Simulated video playback timer if video file is missing
  useEffect(() => {
    let simInterval = null;
    if (videoHasError || !CONFIG.mainVideo) {
      if (isPlaying) {
        simInterval = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              clearInterval(simInterval);
              setIsPlaying(false);
              handleFinishVideo();
              return duration;
            }
            return prev + 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(simInterval);
  }, [isPlaying, videoHasError, duration, onVideoEnd]);

  // Fullscreen change listener for desktop / Android
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const togglePlay = () => {
    unlockAudio();
    playClickSound();
    if (videoRef.current && !videoHasError) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          setVideoHasError(true);
          setIsPlaying(true);
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && !videoHasError) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 60);
    }
  };

  const handleSeek = (e) => {
    const seekTo = Number(e.target.value);
    setCurrentTime(seekTo);
    if (videoRef.current && !videoHasError) {
      videoRef.current.currentTime = seekTo;
    }
  };

  const toggleMute = () => {
    unlockAudio();
    if (videoRef.current && !videoHasError) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Fullscreen handler with iPhone Safari and Android Chrome cross-compatibility
  const handleFullscreen = () => {
    unlockAudio();
    playClickSound();
    const container = containerRef.current;
    if (!container) return;

    if (container.requestFullscreen) {
      // Standard HTML5 Fullscreen (Android Chrome, Desktop, iPadOS)
      if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {
          setIsFullscreen(prev => !prev);
        });
      } else {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    } else if (videoRef.current && videoRef.current.webkitEnterFullscreen && !videoHasError) {
      // iOS Safari native video fullscreen option
      try {
        videoRef.current.webkitEnterFullscreen();
      } catch {
        setIsFullscreen(prev => !prev);
      }
    } else {
      // Bulletproof mobile viewport CSS fullscreen
      setIsFullscreen(prev => !prev);
    }
  };

  // Find active roast subtitle for current timestamp
  const activeRoastSubtitle = CONFIG.roastSubtitles?.find(
    s => currentTime >= s.at && currentTime < s.at + 4
  );

  const handleDislike = () => {
    playErrorSound();
    setDislikeError(true);
    setTimeout(() => setDislikeError(false), 3000);
  };

  const handleLike = () => {
    playClickSound();
    setUserRating('like');
  };

  const handleDoubleLike = () => {
    playClickSound();
    setUserRating('double');
    const newHearts = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 80 + 10,
      scale: Math.random() * 0.8 + 0.8,
      duration: Math.random() * 1.5 + 1.2
    }));
    setFloatingHearts(newHearts);
    setTimeout(() => setFloatingHearts([]), 2500);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 ${
        isFullscreen ? 'z-[9999] w-screen h-[100dvh]' : 'z-50'
      } bg-black flex flex-col items-center justify-center select-none overflow-hidden touch-manipulation`}
    >
      {/* Top Header / Exit */}
      <div className="absolute top-0 inset-x-0 z-40 p-4 sm:p-6 safe-top safe-left safe-right bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-11 h-11 min-tap-target rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-colors"
            title="Close trailer"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm sm:text-base font-display uppercase tracking-wider text-white">
              {CONFIG.birthdayName}: Season {CONFIG.age} • Trailer
            </h2>
            <p className="text-[11px] text-gray-400">Episode 0: The 20-Year Teaser</p>
          </div>
        </div>

        <button
          onClick={onVideoEnd}
          className="h-11 min-tap-target px-4 rounded-xl bg-pranay-red hover:bg-pranay-redDark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-glow-red transition-all active:scale-95"
        >
          <span>Skip to Finale</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Video Canvas / Video Player */}
      <div className="relative w-full h-full flex items-center justify-center bg-black" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={CONFIG.mainVideo}
          poster={CONFIG.videoPoster}
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleFinishVideo}
          onError={() => setVideoHasError(true)}
          className={`w-full h-full object-contain ${videoHasError ? 'hidden' : 'block'}`}
        />

        {/* Fallback Animated Video Simulation if video file is not yet uploaded */}
        {videoHasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[#120a10] via-[#09090f] to-black">
            <div className="w-20 h-20 rounded-full bg-pranay-red/15 border border-pranay-red/30 flex items-center justify-center text-pranay-red mb-4 shadow-glow-red">
              <Flame className="w-10 h-10 animate-pulse" />
            </div>
            <span className="text-xs uppercase font-bold tracking-[0.3em] text-pranay-red font-display">
              Official Birthday Trailer Preview
            </span>
            <h3 className="text-2xl sm:text-4xl font-display uppercase tracking-wider text-white mt-1 mb-2">
              Pranay: Season 20
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md">
              (Upload <code className="text-pranay-red bg-white/5 px-1 py-0.5 rounded">journey.mp4</code> in <code className="text-pranay-red bg-white/5 px-1 py-0.5 rounded">/public/video/</code> to play real clip)
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Simulated Stream Active ({formatTime(currentTime)} / {formatTime(duration)})</span>
            </div>
          </div>
        )}

        {/* Roast Subtitles Overlay */}
        {(subtitleTrack === 'roast' || roastMode) && activeRoastSubtitle && (
          <div className="absolute bottom-28 inset-x-4 sm:inset-x-20 z-30 flex justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="px-5 py-2.5 rounded-xl bg-black/85 border border-amber-500/40 text-amber-300 text-sm sm:text-base font-semibold shadow-2xl text-center max-w-lg backdrop-blur-md"
            >
              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-amber-400 mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Roast Subtitle</span>
              </div>
              <p>"{activeRoastSubtitle.text}"</p>
            </motion.div>
          </div>
        )}

        {/* Regular Subtitles */}
        {subtitleTrack === 'english' && !roastMode && isPlaying && (
          <div className="absolute bottom-28 inset-x-6 z-30 flex justify-center pointer-events-none">
            <span className="px-4 py-1.5 rounded-lg bg-black/70 text-white text-xs sm:text-sm font-medium backdrop-blur-sm">
              [Dramatic orchestral swell as Pranay enters Season 20]
            </span>
          </div>
        )}

        {/* Center Play Button Overlay on Pause */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-pranay-red/90 text-white flex items-center justify-center shadow-glow-red transform scale-110">
              <Play className="w-9 h-9 fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Floating Hearts Animation (Double Thumbs Up) */}
        <AnimatePresence>
          {floatingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
              animate={{ 
                opacity: 0, 
                y: -400, 
                x: (Math.random() - 0.5) * 120, 
                scale: h.scale 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: h.duration, ease: "easeOut" }}
              style={{ left: `${h.left}%`, bottom: '25%' }}
              className="absolute z-40 text-red-500 pointer-events-none"
            >
              <Heart className="w-10 h-10 fill-current drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dislike Error Toast */}
      <AnimatePresence>
        {dislikeError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-24 z-50 px-4 py-2.5 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs sm:text-sm font-medium shadow-glow-red flex items-center gap-2"
          >
            <span>🚫 Error: this option is not available for best friends.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtitles & Audio Settings Menu Modal */}
      <AnimatePresence>
        {showSubtitleMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-28 right-6 z-50 w-72 rounded-2xl bg-[#14141e]/98 border border-white/10 p-4 text-white shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <span className="text-xs uppercase font-bold tracking-wider font-display text-gray-300">
                Audio & Subtitles
              </span>
              <button 
                onClick={() => setShowSubtitleMenu(false)} 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              {[
                { id: 'off', label: 'Off' },
                { id: 'english', label: 'English [CC]' },
                { id: 'hindi', label: 'Hindi Dub' },
                { id: 'roast', label: 'Roast Mode (Subtitles) 🔥' },
                { id: 'honest', label: 'Brutally Honest' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSubtitleTrack(opt.id);
                    if (opt.id === 'roast') setRoastMode(true);
                    setShowSubtitleMenu(false);
                  }}
                  className={`w-full min-tap-target flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                    subtitleTrack === opt.id ? 'bg-pranay-red text-white font-bold' : 'hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <span>{opt.label}</span>
                  {subtitleTrack === opt.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 inset-x-0 z-40 p-4 sm:p-6 safe-bottom safe-left safe-right bg-gradient-to-t from-black via-black/85 to-transparent flex flex-col gap-2.5">
        {/* Progress Bar / Scrubber */}
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg bg-white/20 accent-pranay-red cursor-pointer"
          />
          <span className="text-xs text-gray-400 font-mono flex-shrink-0">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Buttons Row with 44px tap targets */}
        <div className="flex items-center justify-between pt-1">
          {/* Left: Play, Mute */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-11 h-11 min-tap-target rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 active:scale-95 transition-all shadow-md"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="w-11 h-11 min-tap-target flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-pranay-red" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Right: Subtitles, Rating Buttons, Fullscreen */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Subtitles Button */}
            <button
              onClick={() => setShowSubtitleMenu(!showSubtitleMenu)}
              className={`w-11 h-11 min-tap-target flex items-center justify-center rounded-lg border transition-colors ${
                subtitleTrack !== 'off' ? 'bg-white/10 border-pranay-red text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
              title="Subtitles"
            >
              <Subtitles className="w-5 h-5" />
            </button>

            {/* Ratings Cluster */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-1.5 py-1">
              {/* Thumbs Down */}
              <button
                onClick={handleDislike}
                title="Dislike"
                className="w-9 h-9 min-tap-target flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
              >
                <ThumbsDown className="w-4 h-4" />
              </button>

              {/* Thumbs Up */}
              <button
                onClick={handleLike}
                title="Like"
                className={`w-9 h-9 min-tap-target flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ${
                  userRating === 'like' ? 'text-pranay-red' : 'text-gray-400 hover:text-white'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
              </button>

              {/* Double Thumbs Up */}
              <button
                onClick={handleDoubleLike}
                title="Love it!"
                className={`w-9 h-9 min-tap-target flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ${
                  userRating === 'double' ? 'text-pink-500 animate-pulse' : 'text-gray-400 hover:text-pink-400'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Fullscreen (iPhone Safari + Android Chrome) */}
            <button
              onClick={handleFullscreen}
              className="w-11 h-11 min-tap-target flex items-center justify-center text-gray-300 hover:text-white transition-colors"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
