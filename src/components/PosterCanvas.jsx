import React, { useRef, useEffect, useState } from 'react';
import { Download, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import { CONFIG } from '../content';

export function PosterCanvas() {
  const canvasRef = useRef(null);
  const [posterBlobUrl, setPosterBlobUrl] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function generatePoster() {
      try {
        setIsGenerating(true);

        // 1. Wait for custom fonts to load (Bebas Neue, Playfair Display, Inter)
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = 1080;
        const height = 1920;
        canvas.width = width;
        canvas.height = height;

        // 2. Background deep gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#0a0a10');
        bgGrad.addColorStop(0.35, '#160812');
        bgGrad.addColorStop(0.7, '#08080c');
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // 3. Red atmospheric nebula / spotlight at center-top
        const redGlow = ctx.createRadialGradient(width / 2, 600, 50, width / 2, 600, 650);
        redGlow.addColorStop(0, 'rgba(229, 9, 20, 0.5)');
        redGlow.addColorStop(0.5, 'rgba(229, 9, 20, 0.15)');
        redGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = redGlow;
        ctx.fillRect(0, 0, width, height);

        // 4. Subtle cinematic grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 80) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }

        // 5. Top Brand Header: "A PRANAYFLIX ORIGINAL SERIES"
        ctx.fillStyle = '#E50914';
        ctx.font = 'bold 36px "Bebas Neue", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('A PRANAYFLIX ORIGINAL SERIES', width / 2, 140);

        // 6. Center Feature Card
        ctx.save();
        ctx.strokeStyle = 'rgba(229, 9, 20, 0.45)';
        ctx.lineWidth = 4;
        ctx.strokeRect(140, 240, width - 280, 820);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.fillRect(140, 240, width - 280, 820);

        // Giant '20' Watermark
        ctx.fillStyle = 'rgba(229, 9, 20, 0.18)';
        ctx.font = '900 480px "Bebas Neue", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('20', width / 2, 820);

        // Center silhouette/title
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 50px "Bebas Neue", sans-serif';
        ctx.fillText('THE COMPLETE SAGA OF', width / 2, 540);
        ctx.font = '900 120px "Bebas Neue", Impact, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(CONFIG.birthdayName.toUpperCase(), width / 2, 670);
        ctx.restore();

        // 7. Badges Row: 99% Match | U/A 20+ | 19 Seasons | Ultra HD
        const badgeY = 1140;
        ctx.font = 'bold 28px Inter, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#46D369';
        ctx.fillText('99% MATCH', width / 2 - 320, badgeY);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('U/A 20+', width / 2 - 120, badgeY);

        ctx.fillStyle = '#AAAAAA';
        ctx.fillText('19 SEASONS PREVIEWED', width / 2 + 130, badgeY);

        ctx.fillStyle = '#E50914';
        ctx.fillText('4K HDR', width / 2 + 340, badgeY);

        // 8. Series Main Title & Tagline
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '900 130px "Bebas Neue", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PRANAY: SEASON 20', width / 2, 1310);

        ctx.fillStyle = '#FFB3B3';
        ctx.font = 'italic 34px "Playfair Display", Georgia, serif';
        ctx.fillText(`"${CONFIG.tagline}"`, width / 2, 1380);

        // 9. Cast List
        ctx.fillStyle = '#888899';
        ctx.font = 'bold 24px Inter, -apple-system, sans-serif';
        ctx.fillText('STARRING', width / 2, 1470);

        ctx.fillStyle = '#DDDDDD';
        ctx.font = '26px Inter, -apple-system, sans-serif';
        const castNames = [
          CONFIG.birthdayName,
          CONFIG.special?.name || "Janmesh Roida",
          ...(CONFIG.friends || []).map(f => f.name)
        ].join('  •  ');
        ctx.fillText(castNames, width / 2, 1515);

        // 10. Directed By & Creator
        ctx.fillStyle = '#888899';
        ctx.font = 'bold 24px Inter, -apple-system, sans-serif';
        ctx.fillText('DIRECTED & CURATED BY', width / 2, 1600);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 34px "Playfair Display", serif';
        ctx.fillText(CONFIG.special?.name || 'Janmesh Roida', width / 2, 1648);

        // 11. Bottom Streaming Badge & Date
        ctx.fillStyle = '#E50914';
        ctx.font = '900 48px "Bebas Neue", Impact, sans-serif';
        ctx.fillText('STREAMING NOW ONLY ON PRANAYFLIX', width / 2, 1780);

        ctx.fillStyle = '#666677';
        ctx.font = '22px Inter, -apple-system, sans-serif';
        ctx.fillText('PREMIERED: 10 NOVEMBER 2026 • ALL RIGHTS RESERVED TO SQUAD', width / 2, 1830);

        // 12. Create Mobile-Compatible Blob URL
        canvas.toBlob((blob) => {
          if (!isMounted || !blob) return;
          const url = URL.createObjectURL(blob);
          setPosterBlobUrl(url);
          setDownloadReady(true);
          setIsGenerating(false);
        }, 'image/png');

      } catch (err) {
        console.warn("Poster generation fallback error:", err);
        if (isMounted) setIsGenerating(false);
      }
    }

    generatePoster();

    return () => {
      isMounted = false;
      if (posterBlobUrl) {
        URL.revokeObjectURL(posterBlobUrl);
      }
    };
  }, []);

  const handleDownload = () => {
    try {
      if (!posterBlobUrl) return;

      const link = document.createElement('a');
      link.download = `pranay-season-20-official-poster.png`;
      link.href = posterBlobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setHasDownloaded(true);
      setTimeout(() => setHasDownloaded(false), 3000);
    } catch (err) {
      console.warn("Download error, using long-press fallback:", err);
      alert("Tap and hold (long-press) the poster image to save directly to Photos!");
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto touch-manipulation">
      {/* Hidden real-size canvas (1080x1920) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Styled Phone Preview Poster (renders actual image for long-press support) */}
      <div className="relative aspect-[9/16] w-64 sm:w-72 rounded-2xl overflow-hidden border-2 border-pranay-red/40 shadow-glow-red bg-[#0c0c14] my-4 group">
        {posterBlobUrl ? (
          <img
            src={posterBlobUrl}
            alt="Pranay: Season 20 Official Poster"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center animate-pulse">
            <ImageIcon className="w-10 h-10 text-pranay-red mb-3" />
            <span className="text-xs font-display tracking-widest uppercase text-gray-300">
              Rendering HD Poster...
            </span>
          </div>
        )}
      </div>

      {/* Mobile Long-Press Guidance Badge */}
      <p className="text-[11px] text-gray-400 text-center mb-4 leading-relaxed px-2">
        📱 <strong className="text-gray-200">Mobile tip:</strong> You can also tap & hold (long-press) the image above to save directly to your Photos library.
      </p>

      {/* Download Button with 44px tap target */}
      <button
        onClick={handleDownload}
        disabled={isGenerating || !downloadReady}
        className="w-full h-12 min-tap-target px-6 rounded-xl bg-pranay-red hover:bg-pranay-redDark disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red transition-all active:scale-95"
      >
        {hasDownloaded ? (
          <>
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Poster Saved to Device!</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>{isGenerating ? "Rendering Poster..." : "Download Season 20 Poster (HD)"}</span>
          </>
        )}
      </button>
    </div>
  );
}
