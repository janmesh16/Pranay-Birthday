import React, { useState } from 'react';
import { Film, Image as ImageIcon } from 'lucide-react';

/**
 * ImageWithFallback: Displays an image, or a tasteful cinematic gradient fallback
 * if the image fails to load, is missing, or is not yet provided.
 * Never throws or displays a broken image icon.
 */
export function ImageWithFallback({ 
  src, 
  alt = "Media", 
  className = "", 
  fallbackTitle = "Coming Soon",
  aspectRatio = "aspect-video",
  icon: CustomIcon
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isInvalidSrc = !src || typeof src !== 'string' || !src.trim() || src.toLowerCase().includes("placeholder") || hasError;

  if (isInvalidSrc) {
    const Icon = CustomIcon || Film;
    return (
      <div 
        className={`relative overflow-hidden bg-gradient-to-br from-[#1b1b26] via-[#12121a] to-[#0b0b0f] flex flex-col items-center justify-center p-4 text-center border border-white/5 ${aspectRatio} ${className}`}
        role="img"
        aria-label={alt || fallbackTitle}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pranay-red/15 via-transparent to-transparent pointer-events-none" />
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 text-pranay-red">
          <Icon className="w-5 h-5 opacity-80" />
        </div>
        <p className="text-xs font-semibold text-gray-300 tracking-wider uppercase font-display line-clamp-1">
          {fallbackTitle}
        </p>
        <span className="text-[10px] text-gray-400 mt-1">Photo to be uploaded</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[#161622] animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-500" />
        </div>
      )}
    </div>
  );
}
