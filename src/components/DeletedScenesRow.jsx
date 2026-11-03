import React from 'react';
import { Film, Mic, MessageSquare, Camera, Sparkles, Play } from 'lucide-react';
import { CONFIG } from '../content';
import { ImageWithFallback } from '../utils/mediaFallback';

const TYPE_ICONS = {
  chat: MessageSquare,
  audio: Mic,
  video: Film,
  photo: Camera
};

export function DeletedScenesRow({ onSelectScene }) {
  const scenes = CONFIG.deletedScenes || [];
  if (scenes.length === 0) return null;

  return (
    <section className="mt-10 px-4 sm:px-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-display uppercase tracking-wider text-white flex items-center gap-2">
            <span>Deleted Scenes & Vault Bloopers</span>
            <span className="text-sm">🎬</span>
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-pranay-red/15 border border-pranay-red/30 text-[10px] text-pranay-red font-bold font-mono uppercase tracking-wider">
            Unfiltered
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar snap-x-mandatory pb-4 pt-1">
        {scenes.map((scene) => {
          const Icon = TYPE_ICONS[scene.type] || Film;

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(scene)}
              className="snap-start-card flex-shrink-0 w-52 sm:w-64 group cursor-pointer"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group-hover:border-pranay-red transition-all duration-300 transform group-hover:scale-105 shadow-xl bg-[#14141e]">
                {/* Visual Thumbnail */}
                <ImageWithFallback
                  src={scene.file}
                  alt={scene.title}
                  fallbackTitle={scene.title}
                  aspectRatio="aspect-video"
                  icon={Icon}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Type Badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-black/80 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-sm border border-white/15">
                    <Icon className="w-3 h-3 text-pranay-red" />
                    <span>{scene.tag || scene.type}</span>
                  </span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-gray-300 font-mono">
                    {scene.duration}
                  </span>
                </div>

                {/* Center Play/Inspect indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-pranay-red text-white flex items-center justify-center shadow-glow-red scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Bottom title & caption */}
                <div className="absolute bottom-2.5 left-3 right-3">
                  <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-pranay-red transition-colors line-clamp-1">
                    {scene.title}
                  </h3>
                  <p className="text-[10px] text-gray-300 line-clamp-1 italic mt-0.5">
                    {scene.caption}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

