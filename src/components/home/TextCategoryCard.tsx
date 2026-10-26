import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export interface CardItem {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  theme:
    | "for-her"
    | "eid-mubarak"
    | "wedding-nikkah"
    | "for-him"
    | "birthday"
    | "mothers-day"
    | "anniversary"
    | "fathers-day";
  href: string;
  badge?: string;
}

interface TextCategoryCardProps {
  item: CardItem;
  isCenter: boolean;
}

export default function TextCategoryCard({
  item,
  isCenter,
}: TextCategoryCardProps) {
  // Theme configuration: custom curated color palettes, borders, subtle patterns, and thematic badges
  const getThemeStyles = () => {
    switch (item.theme) {
      case "mothers-day":
        return {
          bg: "bg-gradient-to-br from-[#fff2f4] via-[#fde3e8] to-[#fbc5d0]",
          titleColor: "text-[#87193b]",
          subtitleColor: "text-[#b23b5d]",
          borderColor: "border-[#f4aab8]/60",
          innerBorder: "border-[#e2405c]/20",
          btnBg: "bg-gradient-to-r from-[#e2405c] to-[#c72d47] text-white hover:from-[#c72d47] hover:to-[#a91f37]",
          badgeBg: "bg-white/80 text-[#87193b] border-[#f4aab8]",
          badgeEmoji: "🌸",
          motif: (
            <>
              <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-rose/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#fbc5d0]/50 blur-lg pointer-events-none" />
            </>
          ),
        };

      case "fathers-day":
        return {
          bg: "bg-gradient-to-br from-[#1e2a3a] via-[#16202c] to-[#0d141d]",
          titleColor: "text-[#f3f4f6]",
          subtitleColor: "text-[#93c5fd]",
          borderColor: "border-[#3b82f6]/30",
          innerBorder: "border-[#60a5fa]/20",
          btnBg: "bg-[#2563eb] text-white hover:bg-[#1d4ed8] shadow-[0_4px_16px_rgba(37,99,235,0.35)]",
          badgeBg: "bg-white/10 text-[#bfdbfe] border-blue-400/30",
          badgeEmoji: "👔",
          motif: (
            <>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-sky-400/10 blur-lg pointer-events-none" />
            </>
          ),
        };

      case "anniversary":
        return {
          bg: "bg-gradient-to-br from-[#3b0918] via-[#2a0510] to-[#1a0208]",
          titleColor: "text-[#F7C242]",
          subtitleColor: "text-[#fde68a]/90",
          borderColor: "border-[#F7C242]/40",
          innerBorder: "border-[#F7C242]/25",
          btnBg: "bg-gradient-to-r from-[#F7C242] to-[#e6ad27] text-[#330814] font-black hover:from-[#ffd666] hover:to-[#f0b933]",
          badgeBg: "bg-[#F7C242]/15 text-[#fde68a] border-[#F7C242]/30",
          badgeEmoji: "💍",
          motif: (
            <>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F7C242]/15 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-rose/15 blur-xl pointer-events-none" />
            </>
          ),
        };

      case "eid-mubarak":
        return {
          bg: "bg-gradient-to-br from-[#113527] via-[#0b241a] to-[#061710]",
          titleColor: "text-[#F7C242]",
          subtitleColor: "text-[#86efac]/90",
          borderColor: "border-[#F7C242]/35",
          innerBorder: "border-[#F7C242]/20",
          btnBg: "bg-gradient-to-r from-[#F7C242] to-[#d49d20] text-[#061710] font-black hover:from-[#ffd666]",
          badgeBg: "bg-[#F7C242]/15 text-[#F7C242] border-[#F7C242]/30",
          badgeEmoji: "🌙",
          motif: (
            <>
              <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[#F7C242]/15 blur-xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-emerald-500/15 blur-lg pointer-events-none" />
            </>
          ),
        };

      case "for-her":
        return {
          bg: "bg-gradient-to-br from-[#fdf0f2] via-[#fae0e5] to-[#f7cbcf]",
          titleColor: "text-[#6b1535]",
          subtitleColor: "text-[#a3284c]",
          borderColor: "border-[#f4aab8]/60",
          innerBorder: "border-[#e2405c]/15",
          btnBg: "bg-rose text-white hover:bg-[#cf334e] shadow-[0_4px_16px_rgba(226,64,92,0.3)]",
          badgeBg: "bg-white/90 text-[#6b1535] border-rose/25",
          badgeEmoji: "💄",
          motif: (
            <>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-rose/15 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#f7cbcf]/50 blur-lg pointer-events-none" />
            </>
          ),
        };

      case "for-him":
        return {
          bg: "bg-gradient-to-br from-[#2d2226] via-[#21181c] to-[#150e11]",
          titleColor: "text-[#f5f5f5]",
          subtitleColor: "text-[#e0a899]",
          borderColor: "border-[#e0a899]/30",
          innerBorder: "border-[#e0a899]/20",
          btnBg: "bg-[#e0a899] text-[#21181c] font-black hover:bg-[#ebd0c7]",
          badgeBg: "bg-white/10 text-[#ebd0c7] border-[#e0a899]/30",
          badgeEmoji: "⌚",
          motif: (
            <>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#e0a899]/10 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-black/40 blur-lg pointer-events-none" />
            </>
          ),
        };

      case "birthday":
        return {
          bg: "bg-gradient-to-br from-[#fff7e6] via-[#feecd0] to-[#fddcb0]",
          titleColor: "text-[#8a3b00]",
          subtitleColor: "text-[#b45309]",
          borderColor: "border-[#f59e0b]/40",
          innerBorder: "border-[#f59e0b]/20",
          btnBg: "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white hover:from-[#d97706] shadow-[0_4px_16px_rgba(245,158,11,0.35)]",
          badgeBg: "bg-white/90 text-[#8a3b00] border-amber-300",
          badgeEmoji: "🎂",
          motif: (
            <>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-amber-200/50 blur-lg pointer-events-none" />
            </>
          ),
        };

      case "wedding-nikkah":
      default:
        return {
          bg: "bg-gradient-to-br from-[#faf4ec] via-[#f5ebdc] to-[#eddcc7]",
          titleColor: "text-[#543d2b]",
          subtitleColor: "text-[#876346]",
          borderColor: "border-[#c4a482]/50",
          innerBorder: "border-[#c4a482]/25",
          btnBg: "bg-gradient-to-r from-[#876346] to-[#6e4e34] text-white hover:from-[#6e4e34] shadow-[0_4px_16px_rgba(135,99,70,0.3)]",
          badgeBg: "bg-white/90 text-[#543d2b] border-[#c4a482]/40",
          badgeEmoji: "🕊️",
          motif: (
            <>
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#c4a482]/20 blur-xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/40 blur-lg pointer-events-none" />
            </>
          ),
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      className={`relative w-full h-full rounded-[38px] sm:rounded-[46px] md:rounded-[52px] p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center text-center overflow-hidden border-2 transition-all duration-500 ${
        isCenter
          ? "shadow-[0_24px_60px_rgba(107,21,53,0.22)] scale-100"
          : "shadow-[0_12px_32px_rgba(107,21,53,0.1)] hover:shadow-lg"
      } ${theme.bg} ${theme.borderColor}`}
    >
      {/* Decorative ambient theme glow & particles */}
      {theme.motif}

      {/* Decorative inner inset border for luxury finish */}
      <div
        className={`absolute inset-3 sm:inset-4 rounded-[30px] sm:rounded-[38px] border pointer-events-none ${theme.innerBorder}`}
      />

      {/* Ambient subtle light sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

      {/* ── Occasion Emoji / Badge Tag ── */}
      <div
        className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-xs mb-3 sm:mb-4 ${theme.badgeBg}`}
      >
        <span>{theme.badgeEmoji}</span>
        <span>{item.badge || item.title}</span>
      </div>

      {/* ── Title (Large Serif) ── */}
      <h3
        className={`relative z-10 font-serif font-black text-2xl sm:text-3xl md:text-4xl lg:text-[40px] leading-[1.08] tracking-tight uppercase px-2 mb-2 sm:mb-3 drop-shadow-xs transition-colors duration-300 ${theme.titleColor}`}
      >
        {item.title}
      </h3>

      {/* ── Subtitle ── */}
      <p
        className={`relative z-10 font-body font-semibold text-xs sm:text-sm md:text-base tracking-[0.14em] uppercase mb-6 sm:mb-8 transition-colors duration-300 ${theme.subtitleColor}`}
      >
        {item.subtitle}
      </p>

      {/* ── Pill Action Button ── */}
      <Link
        href={item.href}
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 inline-flex items-center gap-1.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-105 active:scale-95 ${theme.btnBg}`}
      >
        <span>{item.buttonText}</span>
        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </Link>

      {/* ── Corner Sparkle / Arrow Badge ── */}
      <div
        className={`absolute bottom-4 left-4 sm:bottom-5 sm:left-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-md transform -rotate-12 transition-transform duration-300 hover:scale-110 ${theme.btnBg}`}
      >
        <Sparkles className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
