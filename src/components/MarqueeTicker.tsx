import React from "react";
import { Sparkles, Heart, Gift, Moon, Cake, Flower2 } from "lucide-react";

interface MarqueeTickerProps {
  className?: string;
}

export default function MarqueeTicker({ className = "" }: MarqueeTickerProps) {
  const items = [
    { text: "Birthday Surprises", icon: <Cake className="w-3.5 h-3.5 text-[#e28597]" /> },
    { text: "Midnight Delivery", icon: <Moon className="w-3.5 h-3.5 text-[#d46f83]" /> },
    { text: "Money Bouquets", icon: <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> },
    { text: "Wedding Favors", icon: <Heart className="w-3.5 h-3.5 text-[#e28597]" /> },
    { text: "Fresh Flower Blooms", icon: <Flower2 className="w-3.5 h-3.5 text-[#d46f83]" /> },
    { text: "Chocolate Baskets", icon: <Gift className="w-3.5 h-3.5 text-[#9d4b5d]" /> },
    { text: "Eid Gift Hampers", icon: <Sparkles className="w-3.5 h-3.5 text-[#e28597]" /> },
    { text: "Thatta & Makli Local Setup", icon: <Heart className="w-3.5 h-3.5 text-[#d46f83]" /> },
    { text: "Advance Nationwide Booking", icon: <Gift className="w-3.5 h-3.5 text-[#581c2d]" /> },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-r from-[#fae7eb] via-[#f7d6de] to-[#fae7eb] border-y border-[#f3cad2] py-3 select-none ${className}`}
    >
      <div className="flex w-max animate-marquee space-x-6 items-center">
        {/* Render twice for continuous loop */}
        {[...items, ...items, ...items].map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-2.5 text-xs sm:text-sm font-semibold tracking-wide uppercase text-[#581c2d] whitespace-nowrap"
          >
            <span>{item.text}</span>
            <span className="inline-flex items-center justify-center p-1 rounded-full bg-white/70 shadow-xs">
              {item.icon}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
