"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Film,
} from "lucide-react";

export interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface QuickViewMediaGalleryProps {
  coverImage: string;
  productName: string;
  secondaryMedia?: MediaItem[];
  imageScale?: number;
  imagePosition?: string;
  imageOffsetX?: number;
  imageOffsetY?: number;
}

export default function QuickViewMediaGallery({
  coverImage,
  productName,
  secondaryMedia = [],
  imageScale = 100,
  imagePosition = "center",
  imageOffsetX = 0,
  imageOffsetY = 0,
}: QuickViewMediaGalleryProps) {
  // All media items: primary cover image is index 0, followed by secondary media
  const allMedia: MediaItem[] = [
    { url: coverImage, type: "image" },
    ...(Array.isArray(secondaryMedia) ? secondaryMedia : []),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Touch gesture tracking for swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = allMedia.length;
  const currentItem = allMedia[activeIndex] || allMedia[0];
  const isVideo = currentItem.type === "video";

  // Auto-play when switching to a video item
  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with audio might be blocked by browser; fallback to muted
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    } else {
      setIsPlaying(false);
    }
  }, [activeIndex, isVideo]);

  const handlePrev = () => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    if (total <= 1) return;
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const toggleVideoPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative w-full flex flex-col gap-2 flex-shrink-0">
      {/* ── Main Showcase Window (Portrait-friendly for videos, clean for images) ── */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`relative w-full rounded-2xl overflow-hidden select-none touch-pan-y transition-all duration-300 border border-rose/15 ${
          isVideo
            ? "h-[360px] sm:h-[400px] bg-neutral-950"
            : "h-[360px] sm:h-64 bg-[#f8e6e8]"
        }`}
      >
        {isVideo ? (
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={toggleVideoPlay}
          >
            {/* Ambient Blurred Background (Prevents harsh empty black bars for portrait videos) */}
            <div className="absolute inset-0 opacity-35 blur-2xl scale-125 pointer-events-none overflow-hidden">
              <video
                src={currentItem.url}
                className="w-full h-full object-cover"
                muted
                playsInline
                loop
                aria-hidden="true"
              />
            </div>

            {/* Foreground Video with Smooth Hardware Acceleration */}
            <video
              key={currentItem.url}
              ref={videoRef}
              src={currentItem.url}
              className="relative z-10 w-full h-full object-contain pointer-events-auto"
              playsInline
              loop
              muted={isMuted}
              preload="auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Center Play/Pause Indicator (Fades out when playing) */}
            <div
              className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
                isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100 bg-black/30"
              }`}
            >
              <div className="w-13 h-13 rounded-full bg-rose/90 backdrop-blur-sm text-white flex items-center justify-center shadow-xl">
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                )}
              </div>
            </div>

            {/* Audio Toggle Button (Bottom-Right) */}
            <button
              type="button"
              onClick={toggleMute}
              className="absolute bottom-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer pointer-events-auto"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/80" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        ) : (
          <div
            className="relative w-full h-full"
            style={{
              transform:
                activeIndex === 0
                  ? `scale(${imageScale / 100}) translate3d(${imageOffsetX}px, ${imageOffsetY}px, 0)`
                  : "none",
            }}
          >
            <Image
              src={currentItem.url}
              alt={`${productName} view ${activeIndex + 1}`}
              fill
              className="object-cover"
              style={{
                objectPosition: activeIndex === 0 ? imagePosition : "center",
              }}
              priority
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Media Counter Badge */}
        {total > 1 && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/65 text-white backdrop-blur-md shadow-sm flex items-center gap-1">
              {isVideo ? <Film className="w-3 h-3 text-rose" /> : null}
              <span>
                {isVideo ? "Video" : "Photo"} &bull; {activeIndex + 1}/{total}
              </span>
            </span>
          </div>
        )}

        {/* Swipe / Navigation Arrows */}
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-maroon flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-maroon flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer"
              aria-label="Next media"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* ── High-Performance Thumbnail Ribbon (Zero-lag lightweight previews) ── */}
      {total > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 px-0.5 no-scrollbar">
          {allMedia.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeIndex === idx
                  ? "border-rose shadow-sm scale-105"
                  : "border-rose/20 opacity-70 hover:opacity-100"
              }`}
            >
              {m.type === "video" ? (
                <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col items-center justify-center text-white">
                  <Play className="w-4 h-4 fill-rose text-rose" />
                  <span className="text-[8px] font-bold uppercase tracking-wider text-rose mt-0.5">
                    Video
                  </span>
                </div>
              ) : (
                <Image
                  src={m.url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
