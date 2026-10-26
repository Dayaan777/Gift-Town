"use client";

import React from "react";
import { SatinGiftBow } from "./GildedRibbonStream";

interface RibbonSectionDividerProps {
  variant?: "rose-satin" | "blush-silk" | "gold-champagne";
  bowPosition?: "right" | "center" | "left";
  direction?: "down-right" | "down-left"; // Downward slope towards right or left
  bowSize?: number;
  bowRotation?: number;
  className?: string;
}

export default function RibbonSectionDivider({
  variant = "rose-satin",
  bowPosition = "right",
  direction = "down-right",
  bowSize = 150,
  bowRotation,
  className = "",
}: RibbonSectionDividerProps) {
  // Gradients per variant
  const bandStroke =
    variant === "gold-champagne"
      ? "url(#goldBandGrad)"
      : variant === "blush-silk"
      ? "url(#blushBandGrad)"
      : "url(#roseBandGrad)";

  const stitchStroke =
    variant === "gold-champagne" ? "#FFFDF5" : "#F5C058";

  // Coordinates in a generous viewBox (0 0 1440 180) to allow authentic graceful diagonal sweep
  // exactly like the Featured Bestsellers header in the reference image:
  // "down-right": starts high on left (y=25), swoops gently across and down to the right (y=135)
  // "down-left": starts high on right (y=25), swoops gently across and down to the left (y=135)
  const isDownRight = direction === "down-right";

  let pathD = "";
  let knotX = 1240;
  let knotY = 122;
  let defaultRot = 14;

  if (isDownRight) {
    if (bowPosition === "right") {
      pathD = "M 0,22 C 450,28 900,68 1240,122 L 1440,144";
      knotX = 1240;
      knotY = 122;
      defaultRot = 14;
    } else if (bowPosition === "left") {
      pathD = "M 0,28 L 220,44 C 550,78 1000,122 1440,140";
      knotX = 220;
      knotY = 44;
      defaultRot = 12;
    } else {
      // center
      pathD = "M 0,22 C 400,32 1000,118 1440,140";
      knotX = 720;
      knotY = 78;
      defaultRot = 10;
    }
  } else {
    // down-left
    if (bowPosition === "left") {
      pathD = "M 1440,22 C 990,28 540,68 200,122 L 0,144";
      knotX = 200;
      knotY = 122;
      defaultRot = -14;
    } else if (bowPosition === "right") {
      pathD = "M 1440,28 L 1220,44 C 890,78 440,122 0,140";
      knotX = 1220;
      knotY = 44;
      defaultRot = -12;
    } else {
      // center
      pathD = "M 1440,22 C 1040,32 440,118 0,140";
      knotX = 720;
      knotY = 78;
      defaultRot = -10;
    }
  }

  const activeRotation = bowRotation !== undefined ? bowRotation : defaultRot;

  // Convert knot (knotX, knotY) to percentage position
  const leftPct = (knotX / 1440) * 100;
  const topPct = (knotY / 180) * 100;

  return (
    <div
      className={`relative w-full overflow-hidden select-none pointer-events-none py-1 sm:py-2 z-20 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        className="relative block w-full h-16 sm:h-24 md:h-28 overflow-visible"
      >
        <defs>
          {/* Rose Satin Band Gradient */}
          <linearGradient id="roseBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D43751" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#E2405C" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#EC7086" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D43751" stopOpacity="0.88" />
          </linearGradient>

          {/* Blush Silk Band Gradient */}
          <linearGradient id="blushBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C92A47" stopOpacity="0.82" />
            <stop offset="50%" stopColor="#EC7086" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#D43751" stopOpacity="0.86" />
          </linearGradient>

          {/* Gold Champagne Band Gradient */}
          <linearGradient id="goldBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D97706" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#F5C058" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.85" />
          </linearGradient>

          {/* Drop Shadow Filter */}
          <filter id="ribbonBandShadow" x="-5%" y="-20%" width="110%" height="160%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor="#6B1535"
              floodOpacity="0.14"
            />
          </filter>
        </defs>

        {/* 1. Under-shadow for fabric depth */}
        <path
          d={pathD}
          fill="none"
          stroke="#6B1535"
          strokeWidth="34"
          opacity="0.1"
          filter="url(#ribbonBandShadow)"
        />

        {/* 2. Main Silky Satin Ribbon Band */}
        <path
          d={pathD}
          fill="none"
          stroke={bandStroke}
          strokeWidth="30"
          strokeLinecap="round"
        />

        {/* 3. Upper Silk Sheen Gleam */}
        <path
          d={pathD}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.45"
          transform="translate(0, -4)"
        />

        {/* 4. Fine Metallic Gold Stitching */}
        <path
          d={pathD}
          fill="none"
          stroke={stitchStroke}
          strokeWidth="2.75"
          strokeDasharray="9, 12"
          opacity="0.85"
          transform="translate(0, 6)"
        />
      </svg>

      {/* ── Tied Luxury Satin Gift Bow centered over the Ribbon Band Knot ── */}
      <div
        className="absolute pointer-events-none transition-transform duration-300"
        style={{
          left: `${leftPct}%`,
          top: `${topPct}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <SatinGiftBow
          size={bowSize}
          rotation={activeRotation}
          variant={variant}
          className="drop-shadow-[0_10px_20px_rgba(107,21,53,0.18)]"
        />
      </div>
    </div>
  );
}
