import React from "react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import StickerBadge from "@/components/StickerBadge";
import Decor from "./home/Decor";
import { Sparkles, Flower2, Banknote, ShoppingBag, Gift } from "lucide-react";

export default function SpecialtiesSection() {
  const specialties = [
    {
      name: "Fresh Flower Arrangements",
      desc: "Imported & local garden roses, baby's breath, and bespoke wrapping aesthetics.",
      badge: "Signature Craft",
      badgeVariant: "rose" as const,
      icon: "flower" as const,
      tint: "blush" as const,
      circleBg: "bg-gradient-to-tr from-[#fde8ed] to-[#faedf0]",
    },
    {
      name: "Luxury Money Bouquets",
      desc: "Artfully folded fresh currency arrangements paired with florals and satin ribbons.",
      badge: "Most Popular",
      badgeVariant: "gold" as const,
      icon: "sparkles" as const,
      tint: "cream" as const,
      circleBg: "bg-gradient-to-tr from-[#fef3c7]/60 to-[#fffbeb]",
    },
    {
      name: "Customized Gift Hampers",
      desc: "Personalized keep-safe wooden & acrylic boxes filled with perfume, watches & favors.",
      badge: "Bespoke",
      badgeVariant: "plum" as const,
      icon: "gift" as const,
      tint: "rose" as const,
      circleBg: "bg-gradient-to-tr from-[#f9d7df] to-[#fcecee]",
    },
    {
      name: "Gourmet Chocolate Baskets",
      desc: "Layered Ferrero Rocher, Dairy Milk, imported confectionery and edible arrangements.",
      badge: "Sweetest Surprise",
      badgeVariant: "cream" as const,
      icon: "package" as const,
      tint: "mint" as const,
      circleBg: "bg-gradient-to-tr from-[#e2f3ea]/70 to-[#f0f9f5]",
    },
  ];

  return (
    <section id="specialties" className="relative py-16 sm:py-24 bg-[#faedf0]/60 overflow-hidden">
      {/* Scattered rose petals, hearts & gold dots motif */}
      <Decor />

      {/* Background radial accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#fdecee] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <StickerBadge variant="plum" rotate="1" size="sm">
            <span>Handcrafted In-House</span>
          </StickerBadge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#22252a] tracking-tight">
            Our <span className="italic text-[#7a233c] font-normal">Specialties</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Every arrangement is tailored with precision and love. Explore our staple creations beloved across Thatta, Makli, and nationwide.
          </p>
        </div>

        {/* 4 Circular Cutout Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {specialties.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center text-center p-6 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#f5d5db] shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Circular Cutout Container */}
              <div className="relative mb-5 flex items-center justify-center">
                {/* Pastel Circle Backdrop */}
                <div
                  className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full ${item.circleBg} border-2 border-white shadow-inner flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-105`}
                >
                  <ImagePlaceholder
                    shape="circle"
                    aspectRatio="1/1"
                    label={item.name.split(" ")[0]}
                    sublabel="Cutout 1:1"
                    icon={item.icon}
                    tint={item.tint}
                    className="w-full h-full border-none shadow-none"
                  />
                </div>

                {/* Sticker Badge over circle */}
                <div className="absolute -bottom-2 z-10">
                  <StickerBadge variant={item.badgeVariant} rotate={idx % 2 === 0 ? "-2" : "2"} size="sm">
                    <span>{item.badge}</span>
                  </StickerBadge>
                </div>
              </div>

              {/* Title & Description */}
              <h3 className="font-serif font-bold text-lg sm:text-xl text-neutral-900 group-hover:text-[#7a233c] transition-colors mb-2">
                {item.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xs">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
