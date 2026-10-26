import React from "react";

export default function Decor() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {/* ── Petal Helper Component ───────────────────────────── */}
      {/* Rose petal: teardrop SVG with a darker center vein */}
      {/* Colors: #D6304E, #EC7086, #961C3E */}

      {/* Petal 1: Top Left - tucked to outer side on mobile */}
      <div
        className="absolute top-[4%] sm:top-[6%] left-[4%] sm:left-[16%] animate-float motion-reduce:animate-none"
        style={{ animationDelay: "0s" }}
      >
        <svg width="64" height="64" viewBox="0 0 60 60" className="rotate-[35deg] scale-80 sm:scale-100">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#EC7086"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#D6304E" strokeWidth="1.8" fill="none" />
        </svg>
      </div>

      {/* Petal 2: Left column floating under Left Bloom */}
      <div
        className="absolute top-[52%] left-[4%] sm:left-[8%] animate-float-slow motion-reduce:animate-none"
        style={{ animationDelay: "1.2s" }}
      >
        <svg width="68" height="68" viewBox="0 0 60 60" className="-rotate-[45deg] scale-80 sm:scale-100">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#D6304E"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#961C3E" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Petal 3: Bottom Left */}
      <div
        className="absolute bottom-[8%] left-[22%] animate-float-fast motion-reduce:animate-none"
        style={{ animationDelay: "2.4s" }}
      >
        <svg width="58" height="58" viewBox="0 0 60 60" className="rotate-[75deg]">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#961C3E"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#D6304E" strokeWidth="1.6" fill="none" />
        </svg>
      </div>

      {/* Petal 4: Center Left, near center card */}
      <div
        className="hidden md:block absolute top-[68%] left-[32%] animate-float motion-reduce:animate-none"
        style={{ animationDelay: "3.5s" }}
      >
        <svg width="72" height="72" viewBox="0 0 60 60" className="-rotate-[20deg]">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#EC7086"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#D6304E" strokeWidth="1.8" fill="none" />
        </svg>
      </div>

      {/* Petal 5: Center Right, above bottom label */}
      <div
        className="hidden md:block absolute top-[58%] right-[32%] animate-float-slow motion-reduce:animate-none"
        style={{ animationDelay: "0.8s" }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className="rotate-[50deg]">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#D6304E"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#961C3E" strokeWidth="1.8" fill="none" />
        </svg>
      </div>

      {/* Petal 6: Top Right - tucked to outer side on mobile */}
      <div
        className="absolute top-[4%] sm:top-[8%] right-[4%] sm:right-[18%] animate-float motion-reduce:animate-none"
        style={{ animationDelay: "1.8s" }}
      >
        <svg width="66" height="66" viewBox="0 0 60 60" className="-rotate-[60deg] scale-80 sm:scale-100">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#961C3E"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#EC7086" strokeWidth="1.6" fill="none" />
        </svg>
      </div>

      {/* Petal 7: Right edge, below Hamper bloom */}
      <div
        className="hidden md:block absolute top-[74%] right-[12%] animate-float-fast motion-reduce:animate-none"
        style={{ animationDelay: "2.8s" }}
      >
        <svg width="74" height="74" viewBox="0 0 60 60" className="rotate-[25deg]">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#EC7086"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#D6304E" strokeWidth="1.8" fill="none" />
        </svg>
      </div>

      {/* Petal 8: Far Right bottom corner - adjusted to not bleed into next section */}
      <div
        className="absolute bottom-[10%] right-[4%] animate-float-slow motion-reduce:animate-none"
        style={{ animationDelay: "4.1s" }}
      >
        <svg width="62" height="62" viewBox="0 0 60 60" className="-rotate-[30deg]">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#D6304E"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#961C3E" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Petal 9: Bottom Center - adjusted to not bleed into next section */}
      <div
        className="hidden md:block absolute bottom-[10%] left-[48%] animate-float motion-reduce:animate-none"
        style={{ animationDelay: "1.5s" }}
      >
        <svg width="56" height="56" viewBox="0 0 60 60" className="rotate-[110deg]">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#961C3E"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#D6304E" strokeWidth="1.6" fill="none" />
        </svg>
      </div>

      {/* Petal 10: Far Left upper edge */}
      <div
        className="hidden md:block absolute top-[28%] left-[2%] animate-float-fast motion-reduce:animate-none"
        style={{ animationDelay: "3.2s" }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60" className="-rotate-[15deg]">
          <path
            d="M 10 30 C 10 12, 35 5, 48 10 C 55 24, 45 50, 28 48 C 16 46, 10 38, 10 30 Z"
            fill="#EC7086"
          />
          <path d="M 12 30 Q 30 25, 44 14" stroke="#961C3E" strokeWidth="1.8" fill="none" />
        </svg>
      </div>

      {/* ── Hearts (rose, maroon, gold) ──────────────────────── */}
      {/* Heart 1: Left */}
      <div
        className="absolute top-[40%] left-[24%] animate-float-slow motion-reduce:animate-none"
        style={{ animationDelay: "0.5s" }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="#E2405C">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Heart 2: Gold near center bloom */}
      <div
        className="absolute top-[72%] left-[27%] animate-float motion-reduce:animate-none"
        style={{ animationDelay: "2.1s" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#F7C242">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Heart 3: Maroon near right */}
      <div
        className="absolute top-[35%] right-[25%] animate-float-fast motion-reduce:animate-none"
        style={{ animationDelay: "1.1s" }}
      >
        <svg width="38" height="38" viewBox="0 0 24 24" fill="#6B1535">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Heart 4: Rose far right */}
      <div
        className="hidden md:block absolute top-[85%] right-[24%] animate-float motion-reduce:animate-none"
        style={{ animationDelay: "3.7s" }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#E2405C">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Heart 5: Maroon bottom left */}
      <div
        className="hidden md:block absolute bottom-[14%] left-[12%] animate-float-slow motion-reduce:animate-none"
        style={{ animationDelay: "2.5s" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#6B1535">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Heart 6: Gold near bottom right */}
      <div
        className="hidden md:block absolute bottom-[18%] right-[8%] animate-float motion-reduce:animate-none"
        style={{ animationDelay: "4.2s" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#F7C242">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* ── Tiny Dots (5-6px in rose and gold) ──────────────── */}
      <div className="absolute top-[22%] left-[28%] w-1.5 h-1.5 rounded-full bg-rose" />
      <div className="absolute top-[36%] left-[19%] w-1.5 h-1.5 rounded-full bg-gold" />
      <div className="absolute top-[80%] left-[29%] w-1.5 h-1.5 rounded-full bg-gold" />
      <div className="absolute top-[28%] right-[29%] w-1.5 h-1.5 rounded-full bg-rose" />
      <div className="absolute top-[65%] right-[22%] w-1.5 h-1.5 rounded-full bg-gold" />
      <div className="hidden md:block absolute top-[48%] right-[38%] w-1.5 h-1.5 rounded-full bg-rose" />
      <div className="hidden md:block absolute bottom-[8%] left-[42%] w-1.5 h-1.5 rounded-full bg-gold" />
    </div>
  );
}
