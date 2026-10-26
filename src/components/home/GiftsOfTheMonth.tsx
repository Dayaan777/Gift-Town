"use client";

import React, { useState } from "react";
import TextCategoryCard, { CardItem } from "./TextCategoryCard";
import Decor from "./Decor";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARDS: CardItem[] = [
  {
    id: "eid-mubarak",
    title: "EID MUBARAK",
    subtitle: "THE FESTIVE EDIT",
    buttonText: "SHOP EID",
    theme: "eid-mubarak",
    href: "#packages",
    badge: "Eid Festive",
  },
  {
    id: "mothers-day",
    title: "MOTHER'S DAY",
    subtitle: "LOVE & APPRECIATION",
    buttonText: "SPOIL MOM",
    theme: "mothers-day",
    href: "#packages",
    badge: "Mother's Special",
  },
  {
    id: "for-her",
    title: "FOR HER",
    subtitle: "SIGNATURE BLOSSOMS",
    buttonText: "EXPLORE",
    theme: "for-her",
    href: "#packages",
    badge: "Her Favorites",
  },
  {
    id: "anniversary",
    title: "ANNIVERSARY",
    subtitle: "TIMELESS ROMANCE",
    buttonText: "CELEBRATE",
    theme: "anniversary",
    href: "#packages",
    badge: "Milestone Love",
  },
  {
    id: "wedding-nikkah",
    title: "WEDDING & NIKAH",
    subtitle: "FAVORS & DECOR",
    buttonText: "BROWSE",
    theme: "wedding-nikkah",
    href: "#packages",
    badge: "Ever After",
  },
  {
    id: "fathers-day",
    title: "FATHER'S DAY",
    subtitle: "THE GENTLEMAN'S CODE",
    buttonText: "HONOR DAD",
    theme: "fathers-day",
    href: "#packages",
    badge: "Dad's Day",
  },
  {
    id: "for-him",
    title: "FOR HIM",
    subtitle: "CLASSIC CURATIONS",
    buttonText: "EXPLORE",
    theme: "for-him",
    href: "#packages",
    badge: "For Him",
  },
  {
    id: "birthday",
    title: "BIRTHDAY",
    subtitle: "MIDNIGHT HAMPERS",
    buttonText: "DISCOVER",
    theme: "birthday",
    href: "#packages",
    badge: "Party Magic",
  },
];

export default function GiftsOfTheMonth() {
  // Start with EID MUBARAK or Mother's Day in center
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Touch gesture tracking for mobile swipe
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const total = CARDS.length;

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger swipe only if horizontal movement is dominant and > 40px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <section
      className="relative w-full bg-[#fce3e0] pt-6 sm:pt-10 pb-28 sm:pb-36 lg:pb-44 overflow-x-clip z-10"
    >
      {/* ── Scattered Decorative Elements (Petals, Hearts, Dots) ── */}
      <Decor />

      {/* ── Centered Heading: GIFTS OF / THE MONTH ── */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4 mb-10 sm:mb-14 md:mb-16">
        <h2 className="font-display font-black text-[clamp(30px,7.8vw,44px)] sm:text-[clamp(44px,5.8vw,88px)] text-rose leading-[1.02] tracking-tight drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)] px-2">
          <span className="block">GIFTS OF</span>
          <span className="block">THE MONTH</span>
        </h2>
      </div>

      {/* ── Stage Container with Navigation Arrows ── */}
      <div className="relative z-20 w-full max-w-[1540px] mx-auto px-4 sm:px-8">
        
        {/* ── Left Navigation Arrow ── */}
        <button
          onClick={handlePrev}
          disabled={isAnimating}
          aria-label="Previous gift category"
          className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-rose text-white flex items-center justify-center shadow-lg hover:bg-[#cf334e] hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-70 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* ── Desktop Stage: All Cards Persist & Smoothly Glide to New Positions ── */}
        <div className="hidden md:flex relative h-[520px] lg:h-[560px] w-full items-center justify-center">
          {CARDS.map((card, idx) => {
            // Compute offset from currentIndex
            let diff = idx - currentIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;
            const isFarLeft = diff < -1;
            const isFarRight = diff > 1;

            // Transform variables depending on slot
            let transformStyle = "";
            let opacityStyle = 1;
            let zIndexStyle = 10;
            let pointerEvents = "auto";

            if (isCenter) {
              // Center card: lower, scaled up, full opacity, z-30
              transformStyle = "translate3d(0, 75px, 0) scale(1)";
              opacityStyle = 1;
              zIndexStyle = 30;
            } else if (isLeft) {
              // Left card: shifted left, higher up, scaled slightly down, z-20
              transformStyle = "translate3d(-420px, -45px, 0) scale(0.88)";
              opacityStyle = 0.95;
              zIndexStyle = 20;
            } else if (isRight) {
              // Right card: shifted right, higher up, scaled slightly down, z-20
              transformStyle = "translate3d(420px, -45px, 0) scale(0.88)";
              opacityStyle = 0.95;
              zIndexStyle = 20;
            } else if (isFarLeft) {
              // Far left hidden card: glides in/out smoothly from behind left
              transformStyle = "translate3d(-780px, -45px, 0) scale(0.75)";
              opacityStyle = 0;
              zIndexStyle = 5;
              pointerEvents = "none";
            } else if (isFarRight) {
              // Far right hidden card: glides in/out smoothly from behind right
              transformStyle = "translate3d(780px, -45px, 0) scale(0.75)";
              opacityStyle = 0;
              zIndexStyle = 5;
              pointerEvents = "none";
            }

            return (
              <div
                key={card.id}
                onClick={() => {
                  if (isLeft) handlePrev();
                  if (isRight) handleNext();
                }}
                className="absolute w-[360px] h-[380px] sm:w-[390px] sm:h-[410px] lg:w-[420px] lg:h-[440px] cursor-pointer"
                style={{
                  transform: transformStyle,
                  opacity: opacityStyle,
                  zIndex: zIndexStyle,
                  pointerEvents: pointerEvents as any,
                  transition: "transform 600ms cubic-bezier(0.34, 1.3, 0.64, 1), opacity 500ms ease, box-shadow 500ms ease",
                  willChange: "transform, opacity",
                }}
              >
                <TextCategoryCard item={card} isCenter={isCenter} />
              </div>
            );
          })}
        </div>

        {/* ── Mobile View (< md): Focused Active Card with Touch Swipe ── */}
        <div
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="flex md:hidden relative h-[380px] w-full items-center justify-center overflow-hidden touch-pan-y"
        >
          {CARDS.map((card, idx) => {
            let diff = idx - currentIndex;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;

            return (
              <div
                key={card.id}
                className="absolute w-[290px] h-[320px] sm:w-[330px] sm:h-[350px]"
                style={{
                  transform: `translate3d(${diff * 105}%, 0, 0) scale(${isCenter ? 1 : 0.85})`,
                  opacity: isCenter ? 1 : 0,
                  pointerEvents: isCenter ? "auto" : "none",
                  transition: "transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 400ms ease",
                }}
              >
                <TextCategoryCard item={card} isCenter={isCenter} />
              </div>
            );
          })}
        </div>

        {/* ── Right Navigation Arrow ── */}
        <button
          onClick={handleNext}
          disabled={isAnimating}
          aria-label="Next gift category"
          className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-rose text-white flex items-center justify-center shadow-lg hover:bg-[#cf334e] hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-70 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

      </div>

      {/* ── Carousel Dot Indicators ── */}
      <div className="relative z-20 flex items-center justify-center gap-2 mt-8 sm:mt-12 md:mt-14">
        {CARDS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentIndex(idx);
                setTimeout(() => setIsAnimating(false), 500);
              }
            }}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2.5 rounded-full transition-all duration-400 cursor-pointer ${
              currentIndex === idx
                ? "w-8 bg-rose shadow-sm"
                : "w-2.5 bg-rose/30 hover:bg-rose/60"
            }`}
          />
        ))}
      </div>

    </section>
  );
}
