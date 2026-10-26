import React from "react";

interface StickerBadgeProps {
  children: React.ReactNode;
  variant?: "rose" | "cream" | "plum" | "gold" | "white";
  rotate?: "-3" | "-2" | "-1" | "1" | "2" | "3" | "0";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
}

export default function StickerBadge({
  children,
  variant = "rose",
  rotate = "-2",
  size = "md",
  className = "",
  icon,
}: StickerBadgeProps) {
  const rotateClasses = {
    "-3": "-rotate-3",
    "-2": "-rotate-2",
    "-1": "-rotate-1",
    "0": "rotate-0",
    "1": "rotate-1",
    "2": "rotate-2",
    "3": "rotate-3",
  }[rotate];

  const sizeClasses = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1",
    md: "text-xs px-3.5 py-1.5 gap-1.5",
    lg: "text-sm px-4 py-2 gap-2",
  }[size];

  const variantClasses = {
    rose: "bg-[#f5d5db] text-[#581c2d] border-[#e28597] shadow-[2px_3px_0px_rgba(226,133,151,0.5)]",
    cream: "bg-[#fdf6ec] text-[#78350f] border-[#fde68a] shadow-[2px_3px_0px_rgba(245,158,11,0.3)]",
    plum: "bg-[#4a1525] text-[#fce7eb] border-[#d46f83] shadow-[2px_3px_0px_rgba(212,111,131,0.5)]",
    gold: "bg-[#fef3c7] text-[#92400e] border-[#f59e0b] shadow-[2px_3px_0px_rgba(217,119,6,0.3)]",
    white: "bg-white text-[#581c2d] border-[#f5d5db] shadow-[2px_3px_0px_rgba(245,213,219,0.8)]",
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-bold tracking-wide rounded-full border transform transition-transform duration-200 hover:scale-105 select-none ${rotateClasses} ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </span>
  );
}
