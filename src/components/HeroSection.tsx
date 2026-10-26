"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StickerBadge from "@/components/StickerBadge";
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Moon,
  Truck,
  ShieldCheck,
  Flower2,
  Gift,
  MessageCircle,
  MapPin,
  Plus,
  X,
} from "lucide-react";

/* ── Hotspot data for the 3 interactive product pins ─────────── */
const HOTSPOTS = [
  {
    id: "bouquet",
    label: "Candy & Chocolate Bouquet",
    desc: "Custom candy cones, imported chocolates, foiled wraps & satin ribbons.",
    badge: "Signature Craft",
    // position over left arrangement (chocolate bouquet)
    top: "38%",
    left: "20%",
    whatsapp:
      "Hi Gift Town! I'm interested in the Candy & Chocolate Bouquet.",
  },
  {
    id: "heart",
    label: "Heart of Roses & Ferrero",
    desc: "Fresh red roses heart-shaped pedestal arrangement with Ferrero Rocher and baby's breath.",
    badge: "Most Popular",
    // position over center heart arrangement
    top: "30%",
    left: "52%",
    whatsapp:
      "Hi Gift Town! I'm interested in the Heart of Roses & Ferrero Rocher arrangement.",
  },
  {
    id: "hamper",
    label: "Luxury Gift Hamper",
    desc: "Grand cellophane-wrapped basket with teddy bear, imported snacks, chocolates & satin bow.",
    badge: "Complete Set",
    // position over right hamper basket
    top: "32%",
    left: "80%",
    whatsapp:
      "Hi Gift Town! I'm interested in the Luxury Gift Hamper basket.",
  },
];

export default function HeroSection() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#fdf0f2] via-[#fae7eb] to-[#fff5f7]"
    >
      {/* ── LAYER 0: Soft ambient dot grid ────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#d46f83_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* ── LAYER 0b: Ambient blobs (behind everything) ────────────── */}
      <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#fddde4] rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -top-10 right-0 w-[400px] h-[400px] bg-[#fce7eb] rounded-full blur-3xl opacity-50 pointer-events-none" />

      {/* ── LAYER 1: Oversized decorative background wordmark ─────── */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      >
        <span className="text-[13vw] sm:text-[10vw] font-serif font-black tracking-[0.12em] text-[#e8c2ca]/25 whitespace-nowrap uppercase leading-none">
          GIFT TOWN
        </span>
      </div>

      {/* ── LAYER 2: Diagonal ribbon band ─────────────────────────── */}
      {/* Positioned to cross the right half where the image lives */}
      <div
        aria-hidden
        className="absolute hidden lg:flex items-center overflow-hidden whitespace-nowrap
                   left-[38%] right-0 top-[62%] h-9
                   bg-gradient-to-r from-[#581c2d] via-[#7a233c] to-[#9d4b5d]
                   -rotate-[2.5deg] origin-left z-10 shadow-md"
        style={{ width: "75%" }}
      >
        {/* Repeated marquee text inside the ribbon */}
        <span className="flex animate-marquee gap-8 text-[11px] font-bold tracking-[0.18em] uppercase text-[#fce7eb]/90 px-6">
          {[
            "Handcrafted With Love",
            "✦",
            "Midnight Surprises",
            "✦",
            "Thatta & Makli",
            "✦",
            "Nationwide Advance Delivery",
            "✦",
            "100% Customized",
            "✦",
            "Handcrafted With Love",
            "✦",
            "Midnight Surprises",
            "✦",
            "Thatta & Makli",
            "✦",
            "Nationwide Advance Delivery",
            "✦",
            "100% Customized",
            "✦",
          ].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </span>
      </div>

      {/* ── LAYER 3: Tilted serrated stamp badge (top-right area) ─── */}
      <div className="hidden lg:block absolute top-10 right-8 z-30 rotate-[8deg] origin-center">
        <div
          className="relative flex flex-col items-center justify-center text-center
                     w-[110px] h-[110px] bg-[#4a1525] text-[#fce7eb] rounded-sm
                     shadow-[0_4px_18px_rgba(74,21,37,0.5)]"
          style={{
            /* serrated/stamp edge using SVG mask */
            clipPath:
              "polygon(5% 0%, 10% 4%, 15% 0%, 20% 4%, 25% 0%, 30% 4%, 35% 0%, 40% 4%, 45% 0%, 50% 4%, 55% 0%, 60% 4%, 65% 0%, 70% 4%, 75% 0%, 80% 4%, 85% 0%, 90% 4%, 95% 0%, 100% 5%, 96% 10%, 100% 15%, 96% 20%, 100% 25%, 96% 30%, 100% 35%, 96% 40%, 100% 45%, 96% 50%, 100% 55%, 96% 60%, 100% 65%, 96% 70%, 100% 75%, 96% 80%, 100% 85%, 96% 90%, 100% 95%, 95% 100%, 90% 96%, 85% 100%, 80% 96%, 75% 100%, 70% 96%, 65% 100%, 60% 96%, 55% 100%, 50% 96%, 45% 100%, 40% 96%, 35% 100%, 30% 96%, 25% 100%, 20% 96%, 15% 100%, 10% 96%, 5% 100%, 0% 95%, 4% 90%, 0% 85%, 4% 80%, 0% 75%, 4% 70%, 0% 65%, 4% 60%, 0% 55%, 4% 50%, 0% 45%, 4% 40%, 0% 35%, 4% 30%, 0% 25%, 4% 20%, 0% 15%, 4% 10%, 0% 5%)",
          }}
        >
          <Flower2 className="w-4 h-4 mb-1 text-[#e28597]" />
          <p className="text-[10px] font-bold leading-tight px-1">
            Fresh Blooms
            <br />& Midnight
            <br />Magic
          </p>
          <p className="text-[9px] mt-1 text-[#f7cad0]/70 leading-tight">
            Curated in Makli
          </p>
        </div>
      </div>

      {/* ── LAYER 3b: Floating decorative sparkles ─────────────────── */}
      <div className="hidden md:block absolute top-14 left-[36%] animate-float pointer-events-none z-10">
        <Sparkles className="w-5 h-5 text-[#d46f83]/50" />
      </div>
      <div className="hidden md:block absolute bottom-28 left-[42%] animate-float-reverse pointer-events-none z-10">
        <Heart className="w-4 h-4 text-[#e28597]/40 fill-[#e28597]/20" />
      </div>
      <div className="hidden lg:block absolute top-1/2 left-[33%] animate-float pointer-events-none z-10" style={{ animationDelay: "1.5s" }}>
        <Sparkles className="w-3 h-3 text-[#9d4b5d]/40" />
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/*   MAIN CONTENT GRID                                         */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-0 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-end">

          {/* ── LEFT: Copy Column ─────────────────────────────────── */}
          <div className="lg:col-span-5 z-20 pb-10 lg:pb-20 space-y-5 text-center lg:text-left">

            {/* Sticker badges row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <StickerBadge variant="rose" rotate="-2" size="md">
                <Heart className="w-3.5 h-3.5 fill-[#d46f83] text-[#d46f83]" />
                <span>Custom Gifting & Surprises</span>
              </StickerBadge>
              <StickerBadge variant="cream" rotate="2" size="sm" className="hidden sm:inline-flex">
                <MapPin className="w-3 h-3 text-[#f59e0b]" />
                <span>Thatta & Makli</span>
              </StickerBadge>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-serif font-bold text-[#22252a] tracking-tight leading-[1.12]">
              A Little World of{" "}
              <span className="block italic text-[#7a233c] font-normal underline decoration-[#f5d5db] decoration-wavy decoration-2">
                Extraordinary Gifts
              </span>
            </h1>

            <p className="text-neutral-600 text-sm sm:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
              Thoughtfully prepared gift packages, crafted with love for every occasion — from midnight surprises to celebration hampers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href="#packages"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e7889b] to-[#d46f83]
                           hover:from-[#df778c] hover:to-[#c75e72] text-white px-7 py-3.5 rounded-full
                           font-semibold text-sm shadow-[0_6px_20px_rgba(212,111,131,0.35)]
                           hover:shadow-[0_8px_25px_rgba(212,111,131,0.45)] transition-all
                           transform hover:-translate-y-0.5"
              >
                <ShoppingBag className="w-4 h-4" />
                Explore Packages
              </Link>
              <a
                href="https://wa.me/?text=Hi%20Gift%20Town!%20I%20would%20like%20a%20custom%20gift%20package."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-[#f5d5db]
                           hover:border-[#e28597] hover:bg-[#fdf2f4] text-neutral-800
                           px-6 py-3.5 rounded-full font-semibold text-sm
                           transition-all shadow-xs hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4 text-[#1e7e34]" />
                WhatsApp Order
              </a>
            </div>

            {/* Trust pills */}
            <div className="pt-5 border-t border-[#f5d5db]/80 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
              {[
                { icon: <ShieldCheck className="w-3.5 h-3.5 text-[#d46f83]" />, text: "100% Customized" },
                { icon: <Moon className="w-3.5 h-3.5 text-[#d46f83]" />, text: "Midnight Surprises" },
                { icon: <Truck className="w-3.5 h-3.5 text-[#d46f83]" />, text: "Nationwide Delivery" },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs
                             px-3 py-1.5 rounded-full border border-[#f5d5db]/80
                             shadow-2xs text-xs font-medium text-neutral-700"
                >
                  {icon}
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Hero Image Composition ─────────────────────── */}
          <div className="lg:col-span-7 relative flex items-end justify-center z-20">

            {/* ── The actual hero product photograph ─────────────── */}
            <div className="relative w-full">
              <Image
                src="/hero-banner.png"
                alt="Gift Town – Extraordinary Gifts: chocolate bouquet, heart of roses and Ferrero Rocher, luxury hamper basket"
                width={1440}
                height={640}
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="w-full h-auto object-contain object-bottom
                           drop-shadow-[0_20px_50px_rgba(122,35,60,0.18)]"
              />

              {/* ── Interactive Product Hotspots ───────────────────── */}
              {HOTSPOTS.map((hs) => (
                <div
                  key={hs.id}
                  className="absolute"
                  style={{ top: hs.top, left: hs.left, transform: "translate(-50%,-50%)" }}
                >
                  {/* Pulsing ring + plus dot */}
                  <button
                    onClick={() =>
                      setActiveHotspot(activeHotspot === hs.id ? null : hs.id)
                    }
                    aria-label={`View details: ${hs.label}`}
                    className="group relative w-7 h-7 flex items-center justify-center
                               rounded-full bg-white/90 backdrop-blur-sm
                               border-2 border-[#d46f83] shadow-lg
                               hover:scale-110 transition-transform z-30"
                  >
                    {/* Animated pulse ring */}
                    <span className="absolute inset-0 rounded-full bg-[#e28597]/40 animate-ping" />
                    {activeHotspot === hs.id ? (
                      <X className="w-3.5 h-3.5 text-[#7a233c] relative z-10" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-[#7a233c] relative z-10" />
                    )}
                  </button>

                  {/* Floating info card */}
                  {activeHotspot === hs.id && (
                    <div
                      className="absolute bottom-10 left-1/2 -translate-x-1/2
                                 w-52 bg-white rounded-2xl border border-[#f5d5db]
                                 shadow-xl p-3.5 z-40 text-left
                                 animate-in fade-in slide-in-from-bottom-2 duration-200"
                    >
                      {/* Badge */}
                      <span className="inline-block text-[10px] font-bold uppercase
                                       tracking-wider text-[#7a233c] bg-[#fce7eb]
                                       px-2.5 py-0.5 rounded-full mb-2">
                        {hs.badge}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-neutral-900 leading-snug mb-1">
                        {hs.label}
                      </h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">
                        {hs.desc}
                      </p>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(hs.whatsapp)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5
                                   w-full bg-gradient-to-r from-[#e7889b] to-[#d46f83]
                                   text-white text-[11px] font-semibold py-2 rounded-xl
                                   hover:from-[#df778c] hover:to-[#c75e72] transition-all"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Inquire on WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              ))}

              {/* ── "For Someone Special" floated card (mirrors the tag in the photo) */}
              <div
                className="hidden lg:flex absolute bottom-[22%] right-[1%] z-30
                           items-center gap-2.5 bg-white/95 backdrop-blur-sm
                           border border-[#f5d5db] rounded-2xl px-3 py-2.5
                           shadow-[0_8px_24px_rgba(212,111,131,0.2)]
                           animate-float"
              >
                <div className="w-8 h-8 rounded-full bg-[#fce7eb] flex items-center justify-center text-[#d46f83]">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-neutral-900 leading-none">
                    For Someone Special
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Starting from PKR 3,500</p>
                </div>
              </div>

              {/* ── Location chip floated over image ─────────── */}
              <div
                className="hidden lg:flex absolute top-[15%] left-[4%] z-30
                           items-center gap-2 bg-[#4a1525]/90 backdrop-blur-sm
                           rounded-full px-3 py-1.5 shadow-md animate-float-reverse"
              >
                <MapPin className="w-3.5 h-3.5 text-[#f7cad0]" />
                <span className="text-[11px] font-semibold text-[#fce7eb] tracking-wide">
                  Thatta & Makli, Sindh
                </span>
              </div>

            </div>{/* /image wrapper */}
          </div>{/* /right col */}

        </div>{/* /grid */}
      </div>{/* /container */}

      {/* ── LAYER 5: Organic bottom wave melting into ticker ──────── */}
      <div className="relative -mt-2 w-full pointer-events-none z-30">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full block fill-[#fae7eb]"
        >
          <path d="M0,30 C240,65 480,5 720,38 C960,65 1200,10 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>

    </section>
  );
}
