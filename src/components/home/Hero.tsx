"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronDown, Sparkles } from "lucide-react";

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute smooth parallax and scale values based on scroll position
  // 0 to 450px transition window
  const progress = Math.min(Math.max(scrollY / 450, 0), 1);
  const heroScale = 1 - progress * 0.04; // subtle scale down
  const heroTranslateY = progress * 40; // subtle depth glide

  const handleScrollDown = () => {
    const target = document.getElementById("packages") || document.getElementById("gifts-of-the-month");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#fce3e0] z-0 -mt-16 sm:-mt-[4.75rem]">
      {/* 
        Hero Banner container:
        Matches exact continuous #fce3e0 background with zero opacity fading
        so the transparent cutouts and edges stay 100% seamless!
      */}
      <div
        className="w-full flex justify-center bg-[#fce3e0] transition-transform duration-75 will-change-transform"
        style={{
          transform: `translate3d(0, ${heroTranslateY}px, 0) scale(${heroScale})`,
        }}
      >
        <div className="relative w-full max-w-[1920px]">
          {/* Mobile Hero Banner (Transparent wavy bottom cutout blending into website background) */}
          <div className="block sm:hidden w-full relative">
            <Image
              src="/images/mobile-hero-banner.png"
              alt="Gift Town - A Little World of Extraordinary Gifts"
              width={1448}
              height={1086}
              priority
              quality={100}
              unoptimized
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              className="object-contain block drop-shadow-xs"
            />
          </div>

          {/* Desktop & Tablet Widescreen Hero Banner (Pixel-Perfect HD Uncompressed 1024x506) */}
          <div className="hidden sm:block w-full relative">
            <Image
              src="/images/hero-banner-pc-hd.png"
              alt="Gift Town - A Little World of Extraordinary Gifts"
              width={1024}
              height={506}
              priority
              quality={100}
              unoptimized
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
              className="object-contain block drop-shadow-xs"
            />
          </div>

          {/* ── Interactive Floating "Scroll to Unbox" Boutique Pill ── */}
          <div
            className={`absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ${
              progress > 0.6 ? "opacity-0 pointer-events-none translate-y-3" : "opacity-100 translate-y-0"
            }`}
          >
            <button
              onClick={handleScrollDown}
              className="group inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/90 hover:bg-white text-maroon backdrop-blur-md border border-rose/30 shadow-[0_8px_24px_rgba(107,21,53,0.12)] hover:shadow-[0_12px_32px_rgba(226,64,92,0.22)] transition-all duration-300 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose animate-spin-slow" />
              <span className="font-body font-bold text-xs uppercase tracking-wider text-maroon group-hover:text-rose transition-colors">
                Scroll to Unbox
              </span>
              <ChevronDown className="w-4 h-4 text-rose animate-bounce" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
