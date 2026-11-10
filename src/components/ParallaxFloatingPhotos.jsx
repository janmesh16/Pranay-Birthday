import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CONFIG } from '../content';

export function ParallaxFloatingPhotos() {
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check prefers-reduced-motion
    try {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (motionQuery.matches) {
        setIsDisabled(true);
        return;
      }
    } catch {}

    // Check low-end device
    try {
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        setIsDisabled(true);
      }
    } catch {}
  }, []);

  const { scrollY } = useScroll();

  // Gather up to 10 photo layers from CONFIG
  const photoLayers = useMemo(() => {
    const rawPhotos = [
      CONFIG.seasons?.[0]?.photo, // Baby Pranay (2007)
      "/photos/pranay/beach-shack.jpg", // Beach king in red bandana
      "/photos/pranay/mom-swag.jpg", // Mom & Pranay shades
      CONFIG.seasons?.[18]?.photo, // Squad Elevator Mirror (2025)
      "/photos/pranay/festive-bandana.jpg", // Festive street swag
      CONFIG.special?.photo || "/photos/janmesh/02.jpg", // Suited up Janmesh & Pranay
      "/photos/pranay/beach-sunset.jpg", // Sunset silhouette
      "/photos/pranay/bike-hero.jpg", // Pranay on blue bike
      "/photos/pranay/specs-aesthetic.jpg", // Vintage aesthetic glasses
      "/photos/pranay/bw-artistic.jpg", // Intense monochrome portrait
      "/photos/pranay/eyes-special-straight.jpg" // His Special Photo - Macro Gaze
    ].filter(Boolean);

    // Take max 10 unique items
    const selected = Array.from(new Set(rawPhotos)).slice(0, 10);

    // Pre-calculate positions & speeds
    return selected.map((photo, i) => {
      const topPercent = 8 + i * 9.2;
      const isLeft = i % 2 === 0;
      const horizontalPercent = isLeft ? 2 + (i % 3) * 2 : 82 + (i % 3) * 2;
      const speed = (i % 2 === 0 ? 1 : -1) * (50 + (i * 15));
      const size = 110 + (i % 3) * 35;
      const rot = (i % 2 === 0 ? -1 : 1) * (4 + (i * 2));

      return {
        id: `float_${i}`,
        photo,
        topPercent,
        horizontalPercent,
        speed,
        size,
        rot
      };
    });
  }, []);

  if (isDisabled) return null;

  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none"
      aria-hidden="true"
    >
      {photoLayers.map((layer) => (
        <FloatingPhotoItem
          key={layer.id}
          layer={layer}
          scrollY={scrollY}
        />
      ))}
    </div>
  );
}

function FloatingPhotoItem({ layer, scrollY }) {
  // Parallax transform tied to page scrollY
  const y = useTransform(scrollY, [0, 6000], [0, layer.speed]);

  return (
    <motion.div
      style={{
        y,
        top: `${layer.topPercent}%`,
        left: `${layer.horizontalPercent}%`,
        width: `${layer.size}px`,
        height: `${layer.size * 0.75}px`,
        rotate: `${layer.rot}deg`,
        willChange: 'transform'
      }}
      className="absolute rounded-2xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] opacity-15 filter blur-[2px] backdrop-blur-sm"
    >
      <img
        src={layer.photo}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover"
        onError={(e) => {
          // If image fails, hide smoothly without breaking layout
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-pranay-red/10 mix-blend-overlay" />
    </motion.div>
  );
}

