import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Sparkles, X, ZoomIn, Shield, Camera, Award } from 'lucide-react';
import { CONFIG } from '../content';
import { playClickSound } from '../utils/audio';
import { unlockAchievement } from '../utils/achievements';

export function SpecialPhotoCard() {
  const [isOpen, setIsOpen] = useState(false);
  const data = CONFIG.specialPhoto;

  if (!data) return null;

  const handleOpen = () => {
    playClickSound();
    unlockAchievement('SPECIAL_PHOTO');
    setIsOpen(true);
  };

  const handleClose = () => {
    playClickSound();
    setIsOpen(false);
  };

  return (
    <>
      <section className="mt-12 px-4 sm:px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-display uppercase tracking-wider text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-gray-200" />
              <span>{data.title || "His Special Photo"}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300 fill-current" />
              <span>{data.tag || "Special Edition"}</span>
            </span>
          </div>
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">
            Classified Macro Archive
          </span>
        </div>

        {/* Featured Card */}
        <div 
          onClick={handleOpen}
          className="group relative rounded-3xl bg-gradient-to-br from-[#181824] via-[#10101a] to-[#0c0c14] border border-white/15 hover:border-white/40 shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.01]"
        >
          {/* Subtle Ambient Background Light */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full filter blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-pranay-red/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 sm:p-7 relative z-10 items-center">
            {/* Left: Cinematic Viewfinder Photo Container */}
            <div className="lg:col-span-6 relative aspect-[2/1] rounded-2xl overflow-hidden bg-black border border-white/20 shadow-xl flex items-center justify-center group-hover:border-white/50 transition-colors">
              {/* Ambient Glow behind image */}
              <img 
                src={data.photo} 
                alt={data.title}
                className="absolute inset-0 w-full h-full object-cover filter blur-xl opacity-40 scale-110 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />

              {/* High-res cropped eyes photo */}
              <img 
                src={data.photo} 
                alt={data.title}
                className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Viewfinder HUD Corner Brackets */}
              <div className="absolute top-2.5 left-2.5 w-4 h-4 border-l-2 border-t-2 border-white/70 pointer-events-none z-20" />
              <div className="absolute top-2.5 right-2.5 w-4 h-4 border-r-2 border-t-2 border-white/70 pointer-events-none z-20" />
              <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-l-2 border-b-2 border-white/70 pointer-events-none z-20" />
              <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-r-2 border-b-2 border-white/70 pointer-events-none z-20" />

              {/* Center Crosshair Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 opacity-40 group-hover:opacity-75 transition-opacity">
                <div className="w-8 h-8 rounded-full border border-dashed border-white/60 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Inspect Hover Pill */}
              <div className="absolute bottom-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/20 shadow-lg">
                  <ZoomIn className="w-3 h-3 text-amber-300" />
                  <span>Inspect High-Res</span>
                </span>
              </div>
            </div>

            {/* Right: Cool Title, Description & Stats */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-gray-200 border border-white/15 text-[10px] font-bold font-mono uppercase tracking-widest flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>{data.badge || "Official Spotlight"}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    20/20 Vision Mode
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display uppercase tracking-wide text-white group-hover:text-gray-100 transition-colors">
                  {data.title || "His Special Photo"}
                </h3>
                
                <p className="text-xs font-semibold text-amber-300/90 font-mono uppercase tracking-wider mt-1 mb-3">
                  {data.subtitle || "The Vision of Season 20 • Classified Macro Gaze"}
                </p>

                {/* Cool Description */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans mb-4">
                  {data.description}
                </p>
              </div>

              {/* Stats & Interactive Trigger */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {data.stats?.map((stat, i) => (
                    <div 
                      key={i} 
                      className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-[10px] text-gray-300 font-mono"
                    >
                      <span className="text-gray-400">{stat.label}:</span>{" "}
                      <span className="text-white font-semibold">{stat.value}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={handleOpen}
                  className="px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform active:scale-95 shadow-md flex-shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Cinematic Inspection Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md safe-top safe-bottom select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar bg-gradient-to-b from-[#181824] via-[#101018] to-[#0c0c12] border border-white/20 rounded-3xl shadow-2xl my-auto text-white"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1">
                    <Eye className="w-3 h-3 text-amber-300" />
                    <span>{data.title || "His Special Photo"}</span>
                  </span>
                  <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                    High Resolution Inspection
                  </span>
                </div>

                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Image Showcase */}
              <div className="p-5 sm:p-6">
                <div className="relative aspect-[2/1] w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center">
                  {/* Ambient Backdrop */}
                  <img
                    src={data.photo}
                    alt={data.title}
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-50 scale-110 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/30 pointer-events-none" />

                  {/* Sharp Eye Photo */}
                  <img
                    src={data.photo}
                    alt={data.title}
                    className="relative z-10 w-full h-full object-cover"
                  />

                  {/* High-tech Viewfinder Overlays */}
                  <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-white pointer-events-none z-20" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-white pointer-events-none z-20" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-l-2 border-b-2 border-white pointer-events-none z-20" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-r-2 border-b-2 border-white pointer-events-none z-20" />
                </div>

                {/* Details Section */}
                <div className="mt-5 p-5 rounded-2xl bg-white/[0.04] border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-display uppercase tracking-wider text-white">
                      {data.tagline || "The Vision of Season 20"}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      VERIFIED ORIGINAL
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-gray-200 font-sans italic">
                    "{data.description}"
                  </p>
                </div>

                {/* Technical / Fun Metadata Grid */}
                <div className="grid grid-cols-3 gap-3 mt-4 text-center">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[9px] uppercase font-mono text-gray-400 block mb-0.5">Classification</span>
                    <span className="text-xs font-bold text-white font-mono">Special Photo</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[9px] uppercase font-mono text-gray-400 block mb-0.5">Focus Mode</span>
                    <span className="text-xs font-bold text-amber-300 font-mono">Locked on 20</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[9px] uppercase font-mono text-gray-400 block mb-0.5">Aura</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">Main Character</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
