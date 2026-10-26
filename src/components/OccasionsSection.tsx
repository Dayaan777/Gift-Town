import React from "react";
import Link from "next/link";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import StickerBadge from "@/components/StickerBadge";
import { ArrowRight, Cake, Moon, Heart, Sparkles, Gift } from "lucide-react";

export default function OccasionsSection() {
  const occasions = [
    {
      title: "Birthday Magic",
      subtitle: "Custom Cakes, Balloons & Hampers",
      tag: "Top Choice",
      tagVariant: "rose" as const,
      icon: "cake" as const,
      tint: "rose" as const,
      rotate: "-rotate-1",
      link: "#packages",
    },
    {
      title: "Midnight Surprises",
      subtitle: "12:00 AM Doorstep Deliveries",
      tag: "Most Memorable",
      tagVariant: "plum" as const,
      icon: "moon" as const,
      tint: "plum" as const,
      rotate: "rotate-1",
      link: "#midnight",
    },
    {
      title: "Wedding Favors",
      subtitle: "Elegant Giveaways & Bride Boxes",
      tag: "Bulk Ordering",
      tagVariant: "cream" as const,
      icon: "heart" as const,
      tint: "cream" as const,
      rotate: "-rotate-1",
      link: "#packages",
    },
    {
      title: "Eid Celebrations",
      subtitle: "Festive Trays, Eidi & Sweets",
      tag: "Seasonal Love",
      tagVariant: "gold" as const,
      icon: "sparkles" as const,
      tint: "blush" as const,
      rotate: "rotate-2",
      link: "#packages",
    },
    {
      title: "Anniversary & Dates",
      subtitle: "Rose Bouquets & Luxury Chocolates",
      tag: "Romantic",
      tagVariant: "rose" as const,
      icon: "gift" as const,
      tint: "rose" as const,
      rotate: "-rotate-2",
      link: "#packages",
    },
  ];

  return (
    <section id="occasions" className="relative py-16 sm:py-24 bg-[#fffdfa] overflow-hidden">
      {/* Decorative oversized background watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 text-[130px] sm:text-[200px] font-serif font-black text-[#fcecee]/70 select-none pointer-events-none -z-0">
        OCCASIONS
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <StickerBadge variant="rose" rotate="-2" size="sm">
            <span>Special Moments</span>
          </StickerBadge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#22252a] tracking-tight">
            Shop by <span className="italic text-[#7a233c] font-normal">Occasion</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Every celebration deserves a tailor-made surprise. Discover curated combinations crafted specifically for your dearest memories.
          </p>
        </div>

        {/* Cards Row: Swipeable on mobile / 5-col on desktop */}
        <div className="flex md:grid md:grid-cols-5 gap-5 overflow-x-auto no-scrollbar pb-6 pt-2 px-1 snap-x snap-mandatory">
          {occasions.map((occ, idx) => (
            <div
              key={idx}
              className={`flex-none w-[240px] md:w-auto snap-center group relative rounded-3xl bg-white border border-[#f5d5db] p-4 shadow-[0_4px_20px_rgba(226,133,151,0.08)] hover:shadow-[0_12px_30px_rgba(226,133,151,0.2)] transition-all duration-300 transform hover:-translate-y-2 hover:${occ.rotate}`}
            >
              {/* Sticker Tag */}
              <div className="absolute -top-3 left-6 z-20">
                <StickerBadge variant={occ.tagVariant} rotate={idx % 2 === 0 ? "-2" : "2"} size="sm">
                  <span>{occ.tag}</span>
                </StickerBadge>
              </div>

              {/* Image Placeholder */}
              <div className="w-full mt-2 mb-4">
                <ImagePlaceholder
                  shape="rounded"
                  aspectRatio="4/5"
                  label={occ.title}
                  sublabel="Occasion Look 4:5"
                  icon={occ.icon}
                  tint={occ.tint}
                  className="rounded-2xl"
                />
              </div>

              {/* Content */}
              <div className="text-left space-y-1.5 px-1">
                <h3 className="font-serif font-bold text-lg text-neutral-900 group-hover:text-[#7a233c] transition-colors">
                  {occ.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                  {occ.subtitle}
                </p>
              </div>

              {/* Action Reveal Arrow */}
              <div className="mt-4 pt-3 border-t border-[#f5d5db]/60 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#7a233c]">Explore Gifts</span>
                <div className="w-7 h-7 rounded-full bg-[#fce7eb] text-[#7a233c] flex items-center justify-center transform group-hover:translate-x-1 group-hover:bg-[#d46f83] group-hover:text-white transition-all shadow-2xs">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <Link href={occ.link} className="absolute inset-0 z-30" aria-label={occ.title} />
            </div>
          ))}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden text-center mt-2 text-xs text-neutral-400 flex items-center justify-center gap-1">
          <span>Swipe to explore more occasions</span>
          <ArrowRight className="w-3 h-3 text-[#d46f83]" />
        </div>
      </div>
    </section>
  );
}
