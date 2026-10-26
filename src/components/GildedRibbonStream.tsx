"use client";

import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Gift, Moon } from "lucide-react";

/* ═════════════════════════════════════════════════════════════════════
   HIGH-FIDELITY VECTOR SILK GIFT BOWS
   Inspired by luxury gift box packaging (tied satin loops, soft knot core,
   graceful ribbon tails with notched ends & realistic silk highlights)
   ═════════════════════════════════════════════════════════════════════ */

interface BowProps {
  className?: string;
  size?: number;
  rotation?: number;
  variant?: "rose-satin" | "blush-silk" | "gold-champagne";
}

/**
 * Symmetrical Luxury Tied Gift Bow
 * Perfect for corner framing, milestone knots, and section headers
 */
export function SatinGiftBow({
  className = "",
  size = 120,
  rotation = 0,
  variant = "rose-satin",
}: BowProps) {
  // Gradients based on variant
  const isGold = variant === "gold-champagne";
  const isBlush = variant === "blush-silk";

  // Gradient IDs
  const loopGradId = `loopGrad-${variant}`;
  const knotGradId = `knotGrad-${variant}`;
  const tailGradId = `tailGrad-${variant}`;
  const shadowFilterId = `bowShadow-${variant}`;

  return (
    <div
      className={`inline-block select-none pointer-events-none ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        filter: "drop-shadow(0 10px 18px rgba(107, 21, 53, 0.16))",
      }}
    >
      <svg
        width={size}
        height={size * 0.82}
        viewBox="0 0 200 164"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Rose Satin Loop Gradient */}
          <linearGradient id={`loopGrad-rose-satin`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2F5" />
            <stop offset="25%" stopColor="#FAABC0" />
            <stop offset="60%" stopColor="#E2405C" />
            <stop offset="100%" stopColor="#961C3E" />
          </linearGradient>

          {/* Blush Silk Loop Gradient */}
          <linearGradient id={`loopGrad-blush-silk`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#FCD5DE" />
            <stop offset="70%" stopColor="#EC7086" />
            <stop offset="100%" stopColor="#B32845" />
          </linearGradient>

          {/* Gold Champagne Loop Gradient */}
          <linearGradient id={`loopGrad-gold-champagne`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF5" />
            <stop offset="30%" stopColor="#FCE39E" />
            <stop offset="70%" stopColor="#E59828" />
            <stop offset="100%" stopColor="#A86208" />
          </linearGradient>

          {/* Knot Core Gradients */}
          <radialGradient
            id={`knotGrad-rose-satin`}
            cx="40%"
            cy="35%"
            r="65%"
            fx="40%"
            fy="35%"
          >
            <stop offset="0%" stopColor="#FFE0E7" />
            <stop offset="45%" stopColor="#E2405C" />
            <stop offset="100%" stopColor="#6B1535" />
          </radialGradient>

          <radialGradient
            id={`knotGrad-blush-silk`}
            cx="40%"
            cy="35%"
            r="65%"
            fx="40%"
            fy="35%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#EC7086" />
            <stop offset="100%" stopColor="#7A152E" />
          </radialGradient>

          <radialGradient
            id={`knotGrad-gold-champagne`}
            cx="40%"
            cy="35%"
            r="65%"
            fx="40%"
            fy="35%"
          >
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="45%" stopColor="#F5C058" />
            <stop offset="100%" stopColor="#8C4F00" />
          </radialGradient>

          {/* Tails Gradient */}
          <linearGradient id={`tailGrad-rose-satin`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C92A47" />
            <stop offset="40%" stopColor="#E2405C" />
            <stop offset="85%" stopColor="#D43751" />
            <stop offset="100%" stopColor="#961C3E" />
          </linearGradient>

          <linearGradient id={`tailGrad-blush-silk`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BA2743" />
            <stop offset="40%" stopColor="#EC7086" />
            <stop offset="85%" stopColor="#E2405C" />
            <stop offset="100%" stopColor="#8C172E" />
          </linearGradient>

          <linearGradient id={`tailGrad-gold-champagne`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#BD7915" />
            <stop offset="40%" stopColor="#F5C058" />
            <stop offset="85%" stopColor="#E59828" />
            <stop offset="100%" stopColor="#874703" />
          </linearGradient>
        </defs>

        {/* ── BACK TAILS (Draping ribbon streamers with decorative notched ends) ── */}
        <g opacity="0.95">
          {/* Left Ribbon Tail */}
          <path
            d="M 92 68 C 80 88 56 118 42 152 L 62 142 L 78 156 C 88 126 98 94 100 70 Z"
            fill={`url(#${tailGradId})`}
          />
          {/* Left Tail Satin Crease Highlight */}
          <path
            d="M 94 72 C 84 96 66 122 55 145"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.45"
          />

          {/* Right Ribbon Tail */}
          <path
            d="M 108 68 C 120 88 144 118 158 152 L 138 142 L 122 156 C 112 126 102 94 100 70 Z"
            fill={`url(#${tailGradId})`}
          />
          {/* Right Tail Satin Crease Highlight */}
          <path
            d="M 106 72 C 116 96 134 122 145 145"
            stroke="#FFFFFF"
            strokeWidth="1.75"
            strokeLinecap="round"
            opacity="0.45"
          />
        </g>

        {/* ── BACK SHADOWS UNDER THE MAIN LOOPS ── */}
        <path
          d="M 96 60 C 65 42 28 48 18 64 C 8 80 40 86 92 68 Z"
          fill="#4A0D1F"
          opacity="0.25"
        />
        <path
          d="M 104 60 C 135 42 172 48 182 64 C 192 80 160 86 108 68 Z"
          fill="#4A0D1F"
          opacity="0.25"
        />

        {/* ── LEFT PUFFED SATIN LOOP ── */}
        <path
          d="M 98 56 C 60 22 14 30 18 58 C 22 84 68 76 96 64 Z"
          fill={`url(#${loopGradId})`}
        />
        {/* Left Loop Inner Fold Shadow */}
        <path
          d="M 38 48 C 26 54 28 68 46 64 C 64 60 84 62 94 62 C 78 54 52 44 38 48 Z"
          fill="#6B1535"
          opacity="0.32"
        />
        {/* Left Loop Upper Silk Gleam */}
        <path
          d="M 88 42 C 58 24 24 32 24 50"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* ── RIGHT PUFFED SATIN LOOP ── */}
        <path
          d="M 102 56 C 140 22 186 30 182 58 C 178 84 132 76 104 64 Z"
          fill={`url(#${loopGradId})`}
        />
        {/* Right Loop Inner Fold Shadow */}
        <path
          d="M 162 48 C 174 54 172 68 154 64 C 136 60 116 62 106 62 C 122 54 148 44 162 48 Z"
          fill="#6B1535"
          opacity="0.32"
        />
        {/* Right Loop Upper Silk Gleam */}
        <path
          d="M 112 42 C 142 24 176 32 176 50"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* ── CENTER SATIN KNOT (Rich spherical knot with natural fabric folds) ── */}
        {/* Knot Outer Ring Fold */}
        <ellipse
          cx="100"
          cy="60"
          rx="17"
          ry="15"
          fill={`url(#${knotGradId})`}
        />
        {/* Knot Central Wrap Crease Line */}
        <path
          d="M 94 48 C 98 56 98 64 96 72"
          stroke="#520D22"
          strokeWidth="1.5"
          opacity="0.35"
        />
        <path
          d="M 104 48 C 102 56 102 64 104 72"
          stroke="#520D22"
          strokeWidth="1.5"
          opacity="0.35"
        />
        {/* Knot Top Soft Reflection Highlight */}
        <ellipse
          cx="98"
          cy="54"
          rx="8"
          ry="5"
          fill="#FFFFFF"
          opacity="0.55"
        />
      </svg>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
   MAIN COMPONENT: GILDED RIBBON STREAM & CONNECTED GIFT WRAPPING
   Connects edge ribbons with central flowing gilded stream across
   "Featured Bestsellers" and "Pack Your Own Custom Hamper"
   ═════════════════════════════════════════════════════════════════════ */

export default function GildedRibbonStream() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseOffset({ x: relX, y: relY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* ── 1. Top Ribbon Band (Removed duplicate here; now handled by unified RibbonSectionDivider) ── */}
      <svg
        viewBox="0 0 1440 2000"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs />
      </svg>

      {/* ═════════════════════════════════════════════════════════════
          2. ANCHORED LUXURY SILK BOWS AT EDGES & CORNERS
          Clean, creative perimeter anchors defining the gift wrapping
          ═════════════════════════════════════════════════════════════ */}

      {/* ── BOW 2: Left Section Transition Knot (Between Bestsellers & Custom Hamper Studio) ── */}
      <div
        className="absolute top-[49%] left-[1.5%] sm:left-[3%] pointer-events-none transition-transform duration-500 ease-out z-10"
        style={{
          transform: `translate3d(${mouseOffset.x * -10}px, ${mouseOffset.y * 10}px, 0)`,
        }}
      >
        <SatinGiftBow
          size={135}
          rotation={16}
          variant="blush-silk"
        />
      </div>

      {/* ── BOW 3: Bottom-Right Accent Bow Finish (Grounding near bottom wave transition) ── */}
      <div
        className="absolute bottom-[3%] right-[3%] sm:right-[6%] pointer-events-none transition-transform duration-500 ease-out z-10"
        style={{
          transform: `translate3d(${mouseOffset.x * 6}px, ${mouseOffset.y * 6}px, 0)`,
        }}
      >
        <SatinGiftBow
          size={120}
          rotation={-12}
          variant="gold-champagne"
        />
      </div>

      {/* ── 3. Subtle Ribbon Flourish Accents along Outer Margins ── */}
      {/* Upper-Left subtle framing ribbon tie */}
      <div
        className="absolute top-[14%] left-[2%] sm:left-[4%] pointer-events-none opacity-85 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * -6}px, ${mouseOffset.y * -6}px, 0)`,
        }}
      >
        <SatinGiftBow
          size={85}
          rotation={-25}
          variant="blush-silk"
        />
      </div>

      {/* Lower-Left subtle framing ribbon tie near the hamper workbench */}
      <div
        className="absolute bottom-[24%] left-[2%] sm:left-[3.5%] pointer-events-none opacity-80 transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x * -7}px, ${mouseOffset.y * 7}px, 0)`,
        }}
      >
        <SatinGiftBow
          size={90}
          rotation={22}
          variant="rose-satin"
        />
      </div>
    </div>
  );
}
