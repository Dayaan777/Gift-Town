import React from "react";

interface BloomProps {
  outerColor: string;
  innerColor: string;
  className?: string;
}

export default function Bloom({ outerColor, innerColor, className = "" }: BloomProps) {
  // 10 petals arranged at 36-degree intervals
  const petals = Array.from({ length: 10 }, (_, i) => i * 36);

  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none select-none flex items-center justify-center transition-transform duration-500 group-hover:rotate-6 ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        className="w-[140%] h-[140%] -translate-x-[14%] -translate-y-[14%]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Layer 1: Outer Bloom (larger, lighter) */}
        <g fill={outerColor}>
          {petals.map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const cx = 200 + 105 * Math.cos(rad);
            const cy = 200 + 105 * Math.sin(rad);
            return <circle key={`outer-${angle}`} cx={cx} cy={cy} r="58" />;
          })}
          {/* Outer center filler */}
          <circle cx="200" cy="200" r="115" />
        </g>

        {/* Layer 2: Inner Bloom (slightly smaller, rotated half a petal = 18deg) */}
        <g fill={innerColor}>
          {petals.map((angle) => {
            const rad = ((angle + 18) * Math.PI) / 180;
            const cx = 200 + 95 * Math.cos(rad);
            const cy = 200 + 95 * Math.sin(rad);
            return <circle key={`inner-${angle}`} cx={cx} cy={cy} r="48" />;
          })}
          {/* Inner center filler */}
          <circle cx="200" cy="200" r="105" />
        </g>
      </svg>
    </div>
  );
}
