import React from "react";
import StickerBadge from "@/components/StickerBadge";
import { Star, Heart, MessageSquareQuote } from "lucide-react";

export default function TestimonialsSection() {
  const reviews = [
    {
      name: "Ayesha K.",
      city: "Karachi",
      occasion: "Birthday Midnight Surprise",
      text: "Gift Town made my sister's midnight birthday in Makli unforgettable! The bouquet was massive and fresh, and the delivery guy arrived at exactly 12:00 AM on the dot.",
      rating: 5,
      tilt: "-rotate-1",
      tint: "bg-[#fffdfa] border-[#f5d5db]",
    },
    {
      name: "Zainab R.",
      city: "Thatta",
      occasion: "Money Bouquet & Chocolates",
      text: "The folding on the currency notes was so neat and clean! Paired with the deep red imported roses, it was the standout gift at our family wedding event. Truly top quality work.",
      rating: 5,
      tilt: "rotate-1",
      tint: "bg-[#fff8f9] border-[#f3cad2]",
    },
    {
      name: "Bilal M.",
      city: "Hyderabad",
      occasion: "Customized Eid Hamper",
      text: "Ordered nationwide to Hyderabad with advance payment. The packaging was so safe and beautiful—bubble wrapped inside a gorgeous gift box. 10/10 recommend!",
      rating: 5,
      tilt: "-rotate-2",
      tint: "bg-[#fffdfa] border-[#e8c99b]/60",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 bg-[#faedf0]/40 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <StickerBadge variant="gold" rotate="2" size="sm">
            <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>Customer Love</span>
          </StickerBadge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#22252a] tracking-tight">
            Loved Across <span className="italic text-[#7a233c] font-normal">Sindh & Beyond</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Real heartwarming moments delivered for our happy customers and their loved ones.
          </p>
        </div>

        {/* Playful Staggered Chat-Bubble Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className={`relative rounded-3xl p-7 border shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${rev.tilt} ${rev.tint}`}
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-neutral-700 text-sm leading-relaxed mb-6 italic">
                &ldquo;{rev.text}&rdquo;
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between pt-4 border-t border-[#f5d5db]/60">
                <div>
                  <h4 className="font-serif font-bold text-base text-neutral-900">
                    {rev.name}
                  </h4>
                  <span className="text-xs text-neutral-500">
                    {rev.city} • <span className="text-[#d46f83] font-medium">{rev.occasion}</span>
                  </span>
                </div>

                <div className="w-9 h-9 rounded-full bg-[#fce7eb] text-[#7a233c] flex items-center justify-center font-bold text-xs">
                  {rev.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
