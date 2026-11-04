import React, { useRef, useState, useEffect } from 'react';
import { CONFIG } from '../content';

export function LivingBackgroundVideo({ isPaused = false }) {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [isDataSaver, setIsDataSaver] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check user preferences & connection
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    try {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(motionQuery.matches);
      const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
      motionQuery.addEventListener?.('change', handleMotionChange);
      return () => motionQuery.removeEventListener?.('change', handleMotionChange);
    } catch {}

    // Check Data Saver / slow mobile connection
    try {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        setIsDataSaver(Boolean(conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g'));
      }
    } catch {}
  }, []);

  // Handle play / pause based on modal state & visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const shouldPlay = !isPaused && !hasError && !autoplayBlocked && !prefersReducedMotion && !isDataSaver;

    if (shouldPlay) {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Silent fallback to poster if autoplay is blocked
          setAutoplayBlocked(true);
        });
      }
    } else {
      video.pause();
    }
  }, [isPaused, hasError, autoplayBlocked, prefersReducedMotion, isDataSaver]);

  // Tab visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        video.pause();
      } else if (!isPaused && !hasError && !autoplayBlocked && !prefersReducedMotion && !isDataSaver) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isPaused, hasError, autoplayBlocked, prefersReducedMotion, isDataSaver]);

  const videoSrc = CONFIG.backgroundVideo || "/video/video-bg.mp4";
  const posterSrc = CONFIG.backgroundPoster || CONFIG.videoPoster || "/photos/video-poster.jpg";
  const shouldRenderVideo = !prefersReducedMotion && !isDataSaver && !hasError;

  return (
    <div 
      className="fixed inset-0 w-full h-[100dvh] pointer-events-none z-0 overflow-hidden select-none bg-[#0b0b0f]"
      aria-hidden="true"
    >
      {/* 1. Underlying Media (Video or Fallback Poster) */}
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="metadata"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            autoplayBlocked ? 'opacity-0' : 'opacity-70'
          }`}
        />
      ) : null}

      {/* Fallback Poster Image if video is missing, autoplay blocked, or reduced motion enabled */}
      {(!shouldRenderVideo || autoplayBlocked) && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 opacity-30"
          style={{ backgroundImage: `url(${posterSrc})` }}
        />
      )}

      {/* Slow ambient gradient breathing layer behind overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#12050b]/60 via-[#0b0b0f]/80 to-[#070710]/70 animate-pulse duration-[8000ms]" />

      {/* 2. 75-80% Dark Gradient Overlay with subtle blur & Red Vignette */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(229,9,20,0.12)_0%,_rgba(11,11,15,0.7)_60%,_rgba(11,11,15,0.95)_100%)]" />

      {/* Top & Bottom seamless fades for navigation bars */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0b0b0f] via-[#0b0b0f]/80 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/80 to-transparent" />
    </div>
  );
}
