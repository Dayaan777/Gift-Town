import React from "react";
import { Gift, Sparkles, Flower2, Heart, Moon, Package, Cake } from "lucide-react";

interface ImagePlaceholderProps {
  aspectRatio?: "1/1" | "4/5" | "16/9" | "3/4" | "4/3" | "2/1";
  shape?: "rounded" | "arch" | "circle" | "blob";
  label: string;
  sublabel?: string;
  icon?: "gift" | "flower" | "sparkles" | "heart" | "moon" | "package" | "cake";
  tint?: "rose" | "cream" | "plum" | "blush" | "mint";
  className?: string;
}

export default function ImagePlaceholder({
  aspectRatio = "4/5",
  shape = "rounded",
  label,
  sublabel,
  icon = "gift",
  tint = "blush",
  className = "",
}: ImagePlaceholderProps) {
  // Map shape to border-radius / clipping
  const shapeClasses = {
    rounded: "rounded-3xl",
    arch: "rounded-t-[100px] rounded-b-3xl sm:rounded-t-[140px]",
    circle: "rounded-full aspect-square",
    blob: "rounded-[40%_60%_70%_30%/40%_50%_60%_55%]",
  }[shape];

  // Map aspect ratio
  const ratioClasses = {
    "1/1": "aspect-square",
    "4/5": "aspect-[4/5]",
    "16/9": "aspect-video",
    "3/4": "aspect-[3/4]",
    "4/3": "aspect-[4/3]",
    "2/1": "aspect-[2/1]",
  }[aspectRatio];

  // Map tints for boutique pastel color blocking
  const tintStyles = {
    blush: "bg-gradient-to-br from-[#fdf2f4] via-[#fce7eb] to-[#f8d7de] border-[#e28597]/40 text-[#9d4b5d]",
    cream: "bg-gradient-to-br from-[#fffdf9] via-[#fef6ec] to-[#faedd9] border-[#e8c99b]/50 text-[#8c6239]",
    rose: "bg-gradient-to-br from-[#f8d7de] via-[#f3bec9] to-[#ea9fb0] border-[#d46f83]/50 text-[#5c1d2e]",
    plum: "bg-gradient-to-br from-[#381420] via-[#4a1829] to-[#250b14] border-[#d46f83]/40 text-[#f7cad0]",
    mint: "bg-gradient-to-br from-[#f0f9f5] via-[#e2f3ea] to-[#cbebd9] border-[#88cbb0]/50 text-[#245e45]",
  }[tint];

  // Pick matching icon
  const renderIcon = () => {
    const iconClass = "w-7 h-7 sm:w-8 sm:h-8 mb-2 opacity-80 stroke-[1.75]";
    switch (icon) {
      case "flower":
        return <Flower2 className={iconClass} />;
      case "sparkles":
        return <Sparkles className={iconClass} />;
      case "heart":
        return <Heart className={iconClass} />;
      case "moon":
        return <Moon className={iconClass} />;
      case "package":
        return <Package className={iconClass} />;
      case "cake":
        return <Cake className={iconClass} />;
      case "gift":
      default:
        return <Gift className={iconClass} />;
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center p-4 text-center border-2 border-dashed transition-all duration-300 select-none shadow-xs group-hover:shadow-md ${ratioClasses} ${shapeClasses} ${tintStyles} ${className}`}
    >
      {/* Decorative inner pattern ring */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),transparent_70%)] pointer-events-none" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-[85%]">
        <div className="p-2.5 rounded-2xl bg-white/50 backdrop-blur-xs shadow-xs mb-2 text-current flex items-center justify-center">
          {renderIcon()}
        </div>
        <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-xs shadow-xs border border-current/15 mb-1 leading-tight">
          {label}
        </span>
        {sublabel && (
          <span className="text-[11px] sm:text-xs opacity-75 mt-0.5 line-clamp-1 font-medium">
            {sublabel}
          </span>
        )}
      </div>

      {/* Corner badge indicating interchangeable component */}
      <div className="absolute bottom-2 right-2 opacity-40 text-[9px] uppercase tracking-wider font-mono">
        Placeholder
      </div>
    </div>
  );
}
