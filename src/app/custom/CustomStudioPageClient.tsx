"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import StickerBadge from "@/components/StickerBadge";
import { ShoppingBag, Gift, Clock, MessageCircle, SlidersHorizontal } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

const CustomStudioSection = dynamic(
  () => import("@/components/CustomStudioSection"),
  {
    ssr: false,
    loading: () => <div className="min-h-[700px] bg-[#fce3e0]" />,
  }
);

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[300px] bg-[#fff8f9]" />,
});

export default function CustomPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fce3e0] selection:bg-rose selection:text-white">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 w-full overflow-x-clip">
        {/* Hero Header for Master Custom Studio */}
        <div className="relative pt-10 sm:pt-14 pb-6 sm:pb-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-3">
            <StickerBadge variant="rose" rotate="-2" size="sm">
              <span>Master Custom Studio &bull; Pick &amp; Choose</span>
            </StickerBadge>
          </div>

          <h1 className="font-display font-black text-[clamp(32px,6vw,56px)] text-rose leading-[1.05] tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)]">
            CUSTOM GIFT STUDIO
          </h1>

          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-3 max-w-2xl mx-auto leading-relaxed">
            Pick and choose individual artisanal items from our signature celebration packages or create your dream gift box from scratch. Filter by bouquets, cakes, treats, luxury baskets, and more.
          </p>
        </div>

        {/* Master Custom Studio Component */}
        <CustomStudioSection />

        {/* How It Works Explanatory 3-Step Grid */}
        <section className="py-12 sm:py-16 bg-white border-t border-rose/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-rose">
                The Bespoke Experience
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-maroon mt-1">
                How Pick &amp; Choose Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="p-6 rounded-3xl bg-[#fdf5f6] border border-rose/15 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose/10 text-rose font-display font-black text-xl flex items-center justify-center mx-auto shadow-2xs">
                  1
                </div>
                <h4 className="font-serif font-bold text-lg text-maroon">
                  Choose Any Piece
                </h4>
                <p className="font-body text-xs text-maroon/70 leading-relaxed">
                  Select pipe cleaner lily bouquets, gourmet cakes, designer apparel, perfume bottles, or snack baskets individually.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#fdf5f6] border border-rose/15 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose/10 text-rose font-display font-black text-xl flex items-center justify-center mx-auto shadow-2xs">
                  2
                </div>
                <h4 className="font-serif font-bold text-lg text-maroon">
                  Real-time Custom Calculation
                </h4>
                <p className="font-body text-xs text-maroon/70 leading-relaxed">
                  Add or remove items freely. Your floating summary bar updates instantly with total pricing and item count.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#fdf5f6] border border-rose/15 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose/10 text-rose font-display font-black text-xl flex items-center justify-center mx-auto shadow-2xs">
                  3
                </div>
                <h4 className="font-serif font-bold text-lg text-maroon">
                  One-Tap WhatsApp Order
                </h4>
                <p className="font-body text-xs text-maroon/70 leading-relaxed">
                  Hit order to send a pre-formatted itemized list directly to our concierge team with delivery date, personalized greeting card, and packaging choices.
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="mt-10 text-center">
              <a
                href={getWhatsAppUrl("Hi Gift Town! I have a special custom gift basket idea.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white font-body font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss Custom Hamper on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
