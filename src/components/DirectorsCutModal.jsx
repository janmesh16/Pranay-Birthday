import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Film, Sparkles, Award, Play, Pause, ChevronRight, 
  MessageSquare, Heart, Camera, Volume2 
} from 'lucide-react';
import { CONFIG } from '../content';
import { ImageWithFallback } from '../utils/mediaFallback';
import { playClickSound } from '../utils/audio';

export function DirectorsCutModal({ onClose }) {
  const dc = CONFIG.directorsCut;
  const [activeTab, setActiveTab] = useState('note'); // 'note' | 'commentary' | 'photos'
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl overflow-y-auto safe-top safe-bottom select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative w-full max-w-3xl bg-gradient-to-b from-[#181119] via-[#0f0b12] to-[#08060a] border-2 border-amber-500/50 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.25)] my-auto max-h-[92dvh] flex flex-col"
      >
        {/* Top Header */}
        <div className="relative p-5 sm:p-7 border-b border-white/10 bg-gradient-to-r from-amber-500/10 via-pranay-red/10 to-transparent flex items-start justify-between">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-[10px] font-black uppercase tracking-wider font-display flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>{dc.badge || "100% SQUAD UNLOCKED"}</span>
              </span>
              <span className="text-[10px] text-amber-300 font-mono">
                Classified Vault Reel
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display uppercase tracking-wider text-white">
              {dc.title}
            </h2>
            <p className="text-xs text-gray-300 mt-1 max-w-xl">
              {dc.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 min-tap-target rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white transition-colors flex-shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Reel Preview Box */}
        <div className="relative aspect-video max-h-60 sm:max-h-72 w-full bg-black border-b border-white/10 overflow-hidden group">
          {dc.video ? (
            <video
              src={dc.video}
              poster={dc.poster || CONFIG.videoPoster}
              controls
              playsInline
              webkit-playsinline="true"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1a101b] via-[#100a12] to-black">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-display uppercase tracking-wider text-white">
                Unreleased Director's Cut Reel
              </h3>
              <p className="text-xs text-gray-400 max-w-md mt-1">
                Upload <code className="text-amber-400 bg-white/5 px-1 py-0.5 rounded">directors-cut.mp4</code> in <code className="text-amber-400 bg-white/5 px-1 py-0.5 rounded">/public/video/</code> for the uncompressed reel.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-white/[0.02] px-4 pt-2 gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { playClickSound(); setActiveTab('note'); }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'note'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Director's Letter</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('commentary'); }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'commentary'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Scene Commentary</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('photos'); }}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Secret Vault Photos</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-5 sm:p-7 overflow-y-auto no-scrollbar flex-1 space-y-4">
          {activeTab === 'note' && (
            <div className="bg-[#140e16]/80 border border-amber-500/20 rounded-2xl p-5 sm:p-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-amber-400 font-display">
                Exclusive Word from Janmesh
              </span>
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-line font-serif italic mt-3">
                "{dc.directorNote}"
              </p>
            </div>
          )}

          {activeTab === 'commentary' && (
            <div className="space-y-3">
              {(dc.commentary || []).map((c, i) => (
                <div 
                  key={i}
                  className="p-4 rounded-xl bg-white/[0.04] border border-white/5 flex items-start gap-3 hover:bg-white/[0.07] transition-colors"
                >
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold flex-shrink-0">
                    {c.timestamp}
                  </span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      {c.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {c.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(dc.secretPhotos || []).map((photo, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-[#161219]">
                  <ImageWithFallback
                    src={photo}
                    alt={`Director's Vault Photo ${i + 1}`}
                    fallbackTitle={`Vault Memory #${i + 1}`}
                    aspectRatio="aspect-video"
                    className="w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/60 flex items-center justify-between gap-3">
          <div className="text-[11px] text-gray-400 flex items-center gap-1.5 font-mono">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Unlocked by cracking all 4 friend codes</span>
          </div>

          <button
            onClick={onClose}
            className="h-11 min-tap-target px-6 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
          >
            <span>Close Director's Cut</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

