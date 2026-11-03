import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Play, Pause, Volume2, VolumeX, MessageSquare, 
  Film, Camera, Mic, Sparkles, Clock, AlertTriangle 
} from 'lucide-react';
import { ImageWithFallback } from '../utils/mediaFallback';
import { playClickSound, unlockAudio } from '../utils/audio';

export function DeletedSceneModal({ scene, onClose }) {
  if (!scene) return null;

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const audioRef = useRef(null);

  // Audio simulation if no real mp3 uploaded yet
  useEffect(() => {
    let interval = null;
    if (scene.type === 'audio' && isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, scene.type]);

  const toggleAudio = () => {
    unlockAudio();
    playClickSound();
    if (audioRef.current && audioRef.current.src) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {
          setIsPlayingAudio(true);
        });
      } else {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }
    } else {
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  const IconType = scene.type === 'audio' 
    ? Mic 
    : scene.type === 'video' 
      ? Film 
      : scene.type === 'chat' 
        ? MessageSquare 
        : Camera;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md safe-top safe-bottom select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative w-full max-w-xl bg-gradient-to-b from-[#181824] via-[#101018] to-[#0c0c12] border border-white/15 rounded-3xl overflow-hidden shadow-2xl my-auto"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-start justify-between bg-black/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-pranay-red/20 text-pranay-red border border-pranay-red/30 text-[10px] font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                <IconType className="w-3 h-3" />
                <span>{scene.tag || "Deleted Scene"}</span>
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {scene.duration}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {scene.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 min-tap-target rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Preview Box */}
        <div className="p-5 flex flex-col items-center">
          {/* TYPE: AUDIO VOICE NOTE */}
          {scene.type === 'audio' && (
            <div className="w-full bg-[#12121a] border border-emerald-500/30 rounded-2xl p-5 flex flex-col items-center shadow-lg">
              <audio ref={audioRef} src={scene.file} onEnded={() => setIsPlayingAudio(false)} className="hidden" />

              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Mic className={`w-8 h-8 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </div>

              {/* Animated Soundwave Visualizer */}
              <div className="flex items-center gap-1 h-12 w-full justify-center max-w-xs my-2">
                {[12, 28, 44, 20, 36, 16, 48, 30, 22, 40, 18, 32, 46, 24, 14].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isPlayingAudio ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'
                    }`}
                    style={{
                      height: isPlayingAudio ? `${Math.max(8, (h * ((i % 3) + 1)) % 48)}px` : '8px'
                    }}
                  />
                ))}
              </div>

              {/* Progress Slider */}
              <div className="w-full max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden my-3">
                <div 
                  className="bg-emerald-400 h-full transition-all duration-300" 
                  style={{ width: `${audioProgress}%` }}
                />
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={toggleAudio}
                className="mt-2 h-12 min-tap-target px-6 rounded-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 active:scale-95 transition-all shadow-md"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Voice Note</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                    <span>Play Audio Leak</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TYPE: VIDEO BLOOPER */}
          {scene.type === 'video' && (
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center relative">
              {scene.file ? (
                <video
                  src={scene.file}
                  controls
                  playsInline
                  webkit-playsinline="true"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6">
                  <Film className="w-12 h-12 text-pranay-red mx-auto mb-2 animate-pulse" />
                  <p className="text-xs text-gray-300">
                    Blooper video placeholder (upload <code className="text-pranay-red bg-white/5 px-1 py-0.5 rounded">{scene.file}</code>)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TYPE: PHOTO / CHAT SCREENSHOT */}
          {(scene.type === 'photo' || scene.type === 'chat') && (
            <div className="w-full max-h-80 rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center">
              <ImageWithFallback
                src={scene.file}
                alt={scene.title}
                fallbackTitle={scene.title}
                aspectRatio="aspect-auto"
                className="w-full h-full object-contain max-h-80"
              />
            </div>
          )}

          {/* Funny Caption Callout */}
          <div className="mt-5 w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-pranay-red font-display block mb-1">
              Vault Classification Note
            </span>
            <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans italic">
              "{scene.caption}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/50 flex justify-end">
          <button
            onClick={onClose}
            className="h-11 min-tap-target px-5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

