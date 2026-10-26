import React from "react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import StickerBadge from "@/components/StickerBadge";
import { MapPin, Truck, CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";

export default function DeliverySection() {
  return (
    <section id="delivery" className="relative py-16 sm:py-24 bg-[#fffdfa] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <StickerBadge variant="rose" rotate="-2" size="sm">
            <span>Coverage & Logistics</span>
          </StickerBadge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#22252a] tracking-tight">
            Delivery & <span className="italic text-[#7a233c] font-normal">Service Areas</span>
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Delivering smiles right to their doorstep. Check how we operate locally in Thatta & Makli, and nationwide across Pakistan.
          </p>
        </div>

        {/* 2 Big Cards: Local Thatta vs Nationwide */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Card 1: Thatta & Makli Local Coverage */}
          <div className="rounded-3xl bg-gradient-to-br from-[#fff8f9] to-[#faedf0] border-2 border-[#f5d5db] p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <StickerBadge variant="plum" rotate="-2" size="sm">
                  <MapPin className="w-3.5 h-3.5 text-[#f7cad0]" />
                  <span>Local Hub</span>
                </StickerBadge>
                <span className="text-xs font-semibold text-[#1e7e34] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Same-Day Available
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mb-2">
                  Thatta & Makli Doorstep Delivery
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Our core backyard! We offer personal handover, custom floral arrangements, fresh cakes, and signature 12:00 AM midnight surprise deliveries across all local sectors.
                </p>
              </div>

              {/* Local benefits list */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d46f83]" />
                  <span>Midnight 12:00 AM Surprise Slot availability</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d46f83]" />
                  <span>Fragile fresh flowers, helium balloons & bakery cakes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d46f83]" />
                  <span>Free doorstep coordination with recipient</span>
                </li>
              </ul>
            </div>

            {/* Stylized Local Map Placeholder */}
            <div className="mt-6 pt-6 border-t border-[#f5d5db]">
              <ImagePlaceholder
                shape="rounded"
                aspectRatio="16/9"
                label="Thatta & Makli Delivery Zone"
                sublabel="Local Map & Service Area 16:9"
                icon="gift"
                tint="blush"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* Card 2: Nationwide Delivery */}
          <div className="rounded-3xl bg-gradient-to-br from-[#fefbf6] to-[#faedd9]/50 border-2 border-[#e8c99b]/60 p-8 sm:p-10 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <StickerBadge variant="gold" rotate="2" size="sm">
                  <Truck className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Nationwide Reach</span>
                </StickerBadge>
                <span className="text-xs font-semibold text-[#8c6239] bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Advance Payment
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mb-2">
                  All-Pakistan Courier Parcels
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Send keepsakes anywhere in Pakistan! We securely pack customized gift hampers, acrylic keepsake frames, chocolate baskets, and non-perishable arrangements with premium shockproof boxing.
                </p>
              </div>

              {/* Nationwide features list */}
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d97706]" />
                  <span>Dispatched via verified express courier tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#d97706]" />
                  <span>Transit time: 2–4 business days across major cities</span>
                </li>
                <li className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#d97706]" />
                  <span>100% Advance Payment basis (Bank Transfer / JazzCash / EasyPaisa)</span>
                </li>
              </ul>
            </div>

            {/* Nationwide Graphic Placeholder */}
            <div className="mt-6 pt-6 border-t border-[#e8c99b]/50">
              <ImagePlaceholder
                shape="rounded"
                aspectRatio="16/9"
                label="Pakistan Express Parcel Dispatch"
                sublabel="Secure Courier Packaging 16:9"
                icon="package"
                tint="cream"
                className="rounded-2xl"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
