"use client";

import React from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import StickerBadge from "@/components/StickerBadge";
import { Heart, MessageCircle } from "lucide-react";

const PackagesShowcase = dynamic(
  () => import("@/components/PackagesShowcase"),
  {
    ssr: false,
    loading: () => <div className="min-h-[700px] bg-[#fce3e0]" />,
  }
);

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[300px] bg-[#fff8f9]" />,
});

export default function PackagesPageClient() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fce3e0] selection:bg-rose selection:text-white">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 w-full overflow-x-clip">
        {/* Hero Header for Packages */}
        <div className="relative pt-10 sm:pt-14 pb-6 sm:pb-8 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-3">
            <StickerBadge variant="gold" rotate="-1" size="sm">
              <span>Signature Gift Packages</span>
            </StickerBadge>
          </div>

          <h1 className="font-display font-black text-[clamp(32px,6vw,56px)] text-rose leading-[1.05] tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)]">
            CELEBRATION PACKAGES
          </h1>

          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-3 max-w-2xl mx-auto leading-relaxed">
            From grand bridal engagement ceremonial suites to bespoke birthday surprises for him, husband, dad &amp; best friend. Order an all-inclusive package with 1 click.
          </p>
        </div>

        {/* The 4 Packages Showcase with Switcher */}
        <PackagesShowcase />

        {/* Assistance / Custom Request CTA Banner */}
        <section className="relative py-12 sm:py-16 bg-gradient-to-b from-[#fce3e0] via-white to-[#fff8f9]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] bg-white border border-rose/20 shadow-[0_16px_40px_rgba(107,21,53,0.08)] space-y-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose/10 text-rose">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>Need a Custom Wedding or Birthday Package?</span>
              </span>

              <h3 className="font-serif font-black text-2xl sm:text-3xl text-maroon">
                Looking for a Custom Color Scheme or Theme?
              </h3>

              <p className="font-body text-xs sm:text-sm text-maroon/75 max-w-xl mx-auto leading-relaxed">
                We craft personalized packages for Nikkah, Mayun, Mehndi, Barat, Birthdays, and Anniversaries with your specific choices of flowers, sweets, dress baskets, and gifts.
              </p>

              <div className="pt-2">
                <a
                  href="https://wa.me/?text=Hi%20Gift%20Town!%20I%20want%20to%20discuss%20a%20custom%20wedding/event%20package."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white font-body font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Discuss Custom Package on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
