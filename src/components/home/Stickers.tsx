import React from "react";

export default function Stickers() {
  return (
    <div className="absolute top-[8%] sm:top-[9%] left-[30%] sm:left-[33%] md:left-[34%] lg:left-[35%] xl:left-[36%] z-30 flex items-center pointer-events-none select-none">
      {/* ── Sticker A: Perforated Stamp Label ────────────────────── */}
      <div
        className="relative -rotate-8 bg-rose text-white px-4 sm:px-5 py-2 sm:py-2.5 shadow-lg flex flex-col justify-center items-center text-center -mr-3 sm:-mr-4 z-10"
        style={{
          /* Perforated stamp scallop edge around rectangle */
          clipPath:
            "polygon(0% 10%, 3% 10%, 4% 0%, 14% 0%, 15% 10%, 25% 10%, 26% 0%, 36% 0%, 37% 10%, 47% 10%, 48% 0%, 58% 0%, 59% 10%, 69% 10%, 70% 0%, 80% 0%, 81% 10%, 91% 10%, 92% 0%, 97% 10%, 100% 10%, 100% 22%, 92% 23%, 92% 35%, 100% 36%, 100% 48%, 92% 49%, 92% 61%, 100% 62%, 100% 74%, 92% 75%, 92% 87%, 100% 88%, 100% 100%, 92% 100%, 91% 90%, 81% 90%, 80% 100%, 70% 100%, 69% 90%, 59% 90%, 58% 100%, 48% 100%, 47% 90%, 37% 90%, 36% 100%, 26% 100%, 25% 90%, 15% 90%, 14% 100%, 4% 100%, 3% 90%, 0% 90%, 0% 76%, 8% 75%, 8% 63%, 0% 62%, 0% 50%, 8% 49%, 8% 37%, 0% 36%, 0% 24%, 8% 23%, 8% 11%)",
        }}
      >
        <span className="font-body font-semibold text-[11px] sm:text-xs md:text-sm tracking-wide leading-tight">
          Nationwide
        </span>
        <span className="font-body font-semibold text-[11px] sm:text-xs md:text-sm tracking-wide leading-tight">
          delivery
        </span>
      </div>

      {/* ── Sticker B: 14-Point Starburst Badge in Gold ───────────── */}
      <div className="relative rotate-12 z-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center drop-shadow-md">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full fill-gold"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 14-point starburst with rounded tips */}
          <path
            d="M 50,2 
               C 52,2 54,6 57,8 
               C 61,7 64,8 67,11 
               C 70,14 71,18 74,21 
               C 77,24 81,26 83,30 
               C 85,34 85,38 88,42 
               C 90,46 93,49 93,53 
               C 92,57 89,60 88,64 
               C 86,68 85,72 82,75 
               C 79,78 77,82 73,84 
               C 69,86 65,86 61,89 
               C 57,91 54,94 50,94 
               C 46,94 43,91 39,89 
               C 35,86 31,86 27,84 
               C 23,82 21,78 18,75 
               C 15,72 14,68 12,64 
               C 11,60 8,57 7,53 
               C 7,49 10,46 12,42 
               C 15,38 15,34 17,30 
               C 19,26 23,24 26,21 
               C 29,18 30,14 33,11 
               C 36,8 39,7 43,8 
               C 46,6 48,2 50,2 Z"
            strokeLinejoin="round"
          />
        </svg>

        {/* Text inside starburst */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center leading-[0.95]">
          <span className="font-display font-extrabold text-[9px] sm:text-[10px] md:text-[11px] tracking-tight text-maroon">
            MADE
          </span>
          <span className="font-display font-extrabold text-[9px] sm:text-[10px] md:text-[11px] tracking-tight text-maroon">
            WITH
          </span>
          <span className="font-display font-extrabold text-[10px] sm:text-[11px] md:text-xs tracking-tight text-rose">
            LOVE
          </span>
        </div>
      </div>
    </div>
  );
}
