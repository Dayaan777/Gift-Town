"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StickerBadge from "@/components/StickerBadge";
import Decor from "./home/Decor";
import { MessageCircle, Heart, ArrowRight, Sparkles } from "lucide-react";

interface SentimentItem {
  id: string;
  name: string;
  tagline: string;
  pairing: string;
  image: string;
  badge: string;
  whatsappMessage: string;
  accentColor: string;
}

const SENTIMENTS: SentimentItem[] = [
  {
    id: "thank-you",
    name: "THANK YOU",
    tagline: "Heartfelt Gratitude",
    pairing: "Pastel florals, sweet treats & personalized note",
    image: "/images/sentiments/thank-you.png",
    badge: "Appreciation",
    whatsappMessage: "Hi Gift Town! I want to order a thoughtful 'Thank You' gift.",
    accentColor: "#E2405C",
  },
  {
    id: "sorry",
    name: "SORRY GIFTS",
    tagline: "Mend & Reconnect",
    pairing: "Apology card, delicate blooms & chocolate basket",
    image: "/images/sentiments/sorry.png",
    badge: "Make Up",
    whatsappMessage: "Hi Gift Town! I want to plan a sweet 'I Am Sorry' surprise.",
    accentColor: "#6B1535",
  },
  {
    id: "romantic",
    name: "ROMANTIC",
    tagline: "Deep Love & Spark",
    pairing: "Red rose heart box, Ferrero Rocher & fairy lights",
    image: "/images/sentiments/romantic.png",
    badge: "Most Loved",
    whatsappMessage: "Hi Gift Town! I would like to book a Romantic surprise package.",
    accentColor: "#E2405C",
  },
  {
    id: "get-well-soon",
    name: "GET WELL SOON",
    tagline: "Comfort & Warmth",
    pairing: "Cheer-up bouquet, wellness hamper & warm wishes",
    image: "/images/sentiments/get-well-soon.png",
    badge: "Care & Health",
    whatsappMessage: "Hi Gift Town! I need a comforting 'Get Well Soon' gift.",
    accentColor: "#F7C242",
  },
  {
    id: "miss-you",
    name: "MISS YOU",
    tagline: "Across Any Distance",
    pairing: "Keepsake frame, midnight drop & long-distance flowers",
    image: "/images/sentiments/miss-you.png",
    badge: "Long Distance",
    whatsappMessage: "Hi Gift Town! I want to send an 'I Miss You' surprise parcel.",
    accentColor: "#6B1535",
  },
  {
    id: "congratulations",
    name: "CONGRATS",
    tagline: "Celebrate Success",
    pairing: "Grand money bouquet, confetti & celebration cake",
    image: "/images/sentiments/congratulations.png",
    badge: "Milestones",
    whatsappMessage: "Hi Gift Town! I'm planning a 'Congratulations' celebration gift.",
    accentColor: "#E2405C",
  },
];

export default function SentimentsSection() {
  const [activeSentiment, setActiveSentiment] = useState<string>("romantic");

  const activeItem =
    SENTIMENTS.find((s) => s.id === activeSentiment) || SENTIMENTS[0];

  return (
    <section className="relative py-16 sm:py-24 bg-[#fce3e0] overflow-hidden">
      {/* Scattered rose petals, hearts & gold dots motif */}
      <Decor />
      
      {/* ── Section Header (Exact same typography, font, and color styling as GIFTS OF THE MONTH) ── */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4 mb-10 sm:mb-14">
        <div className="flex items-center justify-center mb-4">
          <StickerBadge variant="rose" rotate="-2" size="sm">
            <Heart className="w-3.5 h-3.5 fill-[#d46f83] text-[#d46f83]" />
            <span>Express What Words Cannot</span>
          </StickerBadge>
        </div>

        <h2 className="font-display font-black text-[clamp(30px,7.8vw,44px)] sm:text-[clamp(44px,5.8vw,88px)] text-rose leading-[1.02] tracking-tight drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)] px-2">
          <span className="block">GIFTS BY</span>
          <span className="block">SENTIMENTS</span>
        </h2>
        
        <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-4 max-w-xl mx-auto leading-relaxed">
          Sometimes occasions aren&apos;t enough. Pick the emotion in your heart, and we&apos;ll curate the perfect surprise.
        </p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* ── 6 Emotion Interactive Cards Row (Swipeable on mobile, 6-col on desktop) ── */}
        <div className="flex lg:grid lg:grid-cols-6 gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-6 pt-2 px-1 snap-x snap-mandatory">
          {SENTIMENTS.map((item) => {
            const isSelected = activeSentiment === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveSentiment(item.id)}
                className={`flex-none w-[200px] lg:w-auto snap-center group relative rounded-[32px] p-5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 transform select-none ${
                  isSelected
                    ? "bg-white shadow-[0_16px_35px_rgba(107,21,53,0.16)] -translate-y-2 ring-2 ring-rose"
                    : "bg-white/80 hover:bg-white shadow-xs hover:shadow-md hover:-translate-y-1.5"
                }`}
              >
                {/* Floating Micro Badge */}
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-3 transition-colors ${
                    isSelected
                      ? "bg-rose text-white shadow-2xs"
                      : "bg-[#fcecee] text-maroon/80"
                  }`}
                >
                  {item.badge}
                </span>

                {/* Illustration with subtle bounce on hover/selected */}
                <div className="relative w-24 h-28 my-1 flex items-center justify-center">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={120}
                    className={`w-auto h-24 object-contain transition-transform duration-300 ${
                      isSelected ? "scale-110 drop-shadow-md" : "group-hover:scale-105"
                    }`}
                  />
                </div>

                {/* Title */}
                <div className="mt-3">
                  <h3 className="font-display font-black text-sm tracking-tight text-maroon leading-tight">
                    {item.name}
                  </h3>
                  <p className="font-body font-medium text-[11px] text-maroon/70 mt-1 line-clamp-1">
                    {item.tagline}
                  </p>
                </div>

                {/* Bottom select indicator */}
                <div className="mt-4 pt-3 border-t border-maroon/10 w-full flex items-center justify-center">
                  <span
                    className={`text-[11px] font-bold tracking-wide uppercase transition-colors flex items-center gap-1 ${
                      isSelected ? "text-rose" : "text-maroon/50 group-hover:text-maroon"
                    }`}
                  >
                    <span>{isSelected ? "Selected" : "Select"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Active Sentiment Preview & WhatsApp Ordering Box ── */}
        <div className="mt-8 rounded-[36px] bg-gradient-to-r from-white via-[#fff7f8] to-white border border-rose/30 p-6 sm:p-8 md:p-10 shadow-[0_12px_30px_rgba(107,21,53,0.08)] flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
          
          <div className="flex items-center gap-5 sm:gap-6 text-center sm:text-left flex-col sm:flex-row">
            <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 flex items-center justify-center p-2 rounded-2xl bg-[#fcecee] shadow-inner">
              <Image
                src={activeItem.image}
                alt={activeItem.name}
                width={80}
                height={100}
                className="w-auto h-20 object-contain drop-shadow-sm"
              />
            </div>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2">
                <span className="font-display font-black text-xl sm:text-2xl text-maroon tracking-tight">
                  {activeItem.name}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-rose bg-rose/10 px-2.5 py-0.5 rounded-full">
                  {activeItem.badge}
                </span>
              </div>
              <p className="font-body font-semibold text-sm sm:text-base text-rose">
                {activeItem.tagline}
              </p>
              <p className="font-body font-medium text-xs sm:text-sm text-neutral-600 max-w-lg">
                Recommended Gift Ideas: <span className="text-maroon font-semibold">{activeItem.pairing}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Link
              href="#packages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cream text-maroon border border-maroon/20 hover:border-maroon px-6 py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose" />
              <span>View Packages</span>
            </Link>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(activeItem.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white px-7 py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Curate on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
