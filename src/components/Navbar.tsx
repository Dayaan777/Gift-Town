"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gift,
  Sparkles,
  Search,
  Menu,
  X,
  MessageCircle,
  ChevronDown,
  Heart,
  CalendarHeart,
  Flame,
  ShoppingBag,
  PackageOpen,
  ArrowRight,
  Star,
} from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [giftsDropdownOpen, setGiftsDropdownOpen] = useState(false);
  const [mobileGiftsOpen, setMobileGiftsOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setGiftsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setGiftsDropdownOpen(false);
    }, 180);
  };

  const marqueeItems = [
    "Handcrafted Surprises in Thatta & Makli",
    "Advance Nationwide Delivery",
    "12:00 AM Midnight Doorstep Deliveries",
    "Fresh Flower Blooms & Money Bouquets",
    "Custom Keepsake Gift Hampers",
    "100% Tailored With Love",
  ];

  return (
    <>
      {/* ── Top Moving Announcement Marquee ── */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#fbe4e2] via-[#f7cfca] to-[#fbe4e2] border-b border-[#f4c6c2]/60 py-1.5 select-none z-50">
        <div className="flex items-center">
          {/* Continuous looping ticker */}
          <div className="animate-marquee-ribbon flex items-center gap-8 text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-[#7a233c] whitespace-nowrap">
            {marqueeItems.concat(marqueeItems).map((text, idx) => (
              <span key={idx} className="inline-flex items-center gap-2">
                <Gift className="w-3.5 h-3.5 text-rose" />
                <span>{text}</span>
                <span className="text-rose/50">•</span>
              </span>
            ))}
          </div>

          {/* Quick WhatsApp link on right */}
          <div className="hidden lg:flex items-center gap-1.5 absolute right-4 top-1/2 -translate-y-1/2 bg-[#fbe4e2]/90 backdrop-blur-xs pl-3 py-0.5 text-xs font-bold text-[#1e7e34]">
            <a
              href="https://wa.me/?text=Hello%20Gift%20Town!%20I%20would%20like%20to%20inquire%20about%20a%20gift%20package."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Orders</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#fce3e0]/95 backdrop-blur-md shadow-md border-b border-[#f4c6c2]"
            : "border-b border-[#f4c6c2]/30"
        }`}
        style={
          !isScrolled
            ? {
                background:
                  "linear-gradient(90deg, #fce3e0 0%, #f9d5d1 50%, #e8a7a4 100%)",
              }
            : undefined
        }
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[4.75rem] flex items-center justify-between">
          {/* Mobile hamburger button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-xl text-neutral-800 hover:bg-[#f7d8df]/70 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#581c2d]" />
            ) : (
              <Menu className="w-6 h-6 text-[#581c2d]" />
            )}
          </button>

          {/* Left Navigation: GIFTS (Creative Mega Dropdown) & BESTSELLERS */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 flex-1 justify-start">
            {/* 1. GIFTS with Creative Floating Vitrine Dropdown on Hover */}
            <div
              className="relative py-2"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-1.5 text-[14px] lg:text-[15px] font-bold transition-all relative group py-1 cursor-pointer ${
                  giftsDropdownOpen ? "text-[#7a233c]" : "text-neutral-800 hover:text-[#7a233c]"
                }`}
                aria-expanded={giftsDropdownOpen}
              >
                <Gift className="w-4 h-4 text-rose transition-transform group-hover:rotate-12" />
                <span className="tracking-wide uppercase text-xs lg:text-sm font-extrabold">GIFTS</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-rose transition-transform duration-300 ${
                    giftsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-[#d46f83] transform rounded-full transition-transform origin-left ${
                    giftsDropdownOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>

              {/* Creative Floating Showcase Dropdown Menu */}
              {giftsDropdownOpen && (
                <div
                  className="absolute left-0 top-full pt-2 z-50 w-[490px] animate-in fade-in slide-in-from-top-2 duration-250 select-none"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="relative rounded-[28px] bg-white/95 backdrop-blur-xl border border-rose/25 shadow-[0_20px_50px_rgba(107,21,53,0.18)] p-4 overflow-hidden">
                    {/* Top delicate ribbon accent line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose via-[#f5c058] to-rose" />

                    <div className="px-2 pt-1 pb-2.5 flex items-center justify-between border-b border-rose/10">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-rose">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Curated Gift Collections</span>
                      </div>
                      <span className="text-[10px] text-maroon/60 font-semibold bg-rose/10 px-2 py-0.5 rounded-full">
                        Thatta &amp; Makli Handcrafted
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3">
                      {/* Option A: Gifts By Sentiments */}
                      <Link
                        href="#sentiments"
                        onClick={() => setGiftsDropdownOpen(false)}
                        className="group relative rounded-2xl p-3 bg-gradient-to-br from-[#fef7f8] to-[#fbf0f2] border border-rose/15 hover:border-rose/40 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-8 h-8 rounded-full bg-rose/10 text-rose flex items-center justify-center group-hover:bg-rose group-hover:text-white transition-colors shadow-2xs">
                              <Heart className="w-4 h-4 fill-current" />
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-maroon/50">
                              By Emotion
                            </span>
                          </div>
                          <h4 className="font-display font-black text-sm text-maroon group-hover:text-rose transition-colors leading-snug">
                            Gifts by Sentiments
                          </h4>
                          <p className="font-body text-[11px] text-maroon/70 mt-1 leading-relaxed">
                            Thank you, Sorry, Romantic &amp; Celebration gifts tailored for what words cannot express.
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-rose/10 flex items-center gap-1 text-[11px] font-bold text-rose group-hover:translate-x-1 transition-transform">
                          <span>Explore Sentiments</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </Link>

                      {/* Option B: Gifts of The Month */}
                      <Link
                        href="#gifts-of-the-month"
                        onClick={() => setGiftsDropdownOpen(false)}
                        className="group relative rounded-2xl p-3 bg-gradient-to-br from-[#fef8f4] to-[#fcf3ea] border border-[#f5c058]/30 hover:border-[#f5c058]/60 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="w-8 h-8 rounded-full bg-[#f5c058]/20 text-[#915809] flex items-center justify-center group-hover:bg-[#f5c058] group-hover:text-white transition-colors shadow-2xs">
                              <CalendarHeart className="w-4 h-4" />
                            </span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#915809]/70 bg-[#f5c058]/15 px-1.5 py-0.5 rounded-full">
                              Limited Edition
                            </span>
                          </div>
                          <h4 className="font-display font-black text-sm text-maroon group-hover:text-rose transition-colors leading-snug">
                            Gifts of the Month
                          </h4>
                          <p className="font-body text-[11px] text-maroon/70 mt-1 leading-relaxed">
                            Seasonal monthly spotlights, fresh trend wraps, and handpicked boutique creations.
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#f5c058]/20 flex items-center gap-1 text-[11px] font-bold text-[#b46513] group-hover:translate-x-1 transition-transform">
                          <span>View Monthly Picks</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </Link>
                    </div>

                    {/* Bottom quick banner inside dropdown */}
                    <div className="mt-3 pt-2.5 border-t border-rose/10 flex items-center justify-between text-[11px] text-maroon/70 px-1">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-[#f5c058] fill-current" />
                        <span>Fresh flowers, chocolates &amp; custom ribbons</span>
                      </span>
                      <a
                        href="https://wa.me/?text=Hi%20Gift%20Town!%20I%20want%20to%20ask%20about%20gift%20customization."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-rose hover:underline"
                      >
                        Custom Request →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 2. BESTSELLERS (Separate direct link to #packages) */}
            <Link
              href="#packages"
              className="text-[14px] lg:text-[15px] font-semibold text-neutral-800 hover:text-[#7a233c] transition-colors relative group py-1 flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4 text-rose" />
              <span>Bestsellers</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#d46f83] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>

            {/* 3. ALL PRODUCTS (Separate direct link to #featured-products) */}
            <Link
              href="#featured-products"
              className="text-[14px] lg:text-[15px] font-semibold text-neutral-800 hover:text-[#7a233c] transition-colors relative group py-1 flex items-center gap-1.5"
            >
              <PackageOpen className="w-4 h-4 text-rose" />
              <span>All Products</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#d46f83] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>
          </div>

          {/* Center Brand Logo */}
          <div className="flex-shrink-0 flex items-center justify-center px-2 sm:px-4">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105 active:scale-95 duration-200"
            >
              <Image
                src="/logo.png"
                alt="Gift Town Logo"
                width={260}
                height={130}
                priority
                className="h-16 sm:h-20 md:h-[5.25rem] w-auto object-contain drop-shadow-sm transition-all py-0.5"
              />
            </Link>
          </div>

          {/* Right Navigation: Create your Own Basket & Book Surprise */}
          <div className="hidden md:flex items-center space-x-5 lg:space-x-6 flex-1 justify-end">
            {/* "Create your Own Basket" (Renamed from Hamper Studio) */}
            <Link
              href="#build-surprise"
              className="text-[14px] lg:text-[15px] font-semibold text-neutral-800 hover:text-[#7a233c] transition-colors relative group py-1 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-rose" />
              <span>Create your Own Basket</span>
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#d46f83] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </Link>

            {/* Book Surprise Primary Button */}
            <Link
              href="#build-surprise"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#e7889b] to-[#d46f83] hover:from-[#df778c] hover:to-[#c75e72] text-white text-[13px] lg:text-[14px] font-semibold px-4 lg:px-5 py-2 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Book Surprise</span>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Right Action Icon */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="#build-surprise"
              className="inline-flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-[#e7889b] to-[#d46f83] text-white shadow-xs"
              aria-label="Book Surprise"
            >
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </nav>

        {/* Mobile Slide-down Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#fffdfa] border-b border-[#f3cad2] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-250">
            <div className="flex flex-col space-y-2 font-medium text-neutral-800">
              {/* Mobile Gifts Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileGiftsOpen(!mobileGiftsOpen)}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-xl bg-[#faedf0] text-[#581c2d] font-bold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-rose" />
                    <span>GIFTS</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-rose transition-transform duration-200 ${
                      mobileGiftsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {mobileGiftsOpen && (
                  <div className="pl-4 pr-2 pt-2 pb-1 space-y-1.5 border-l-2 border-rose/30 ml-4 mt-1">
                    <Link
                      href="#sentiments"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileGiftsOpen(false);
                      }}
                      className="block py-1.5 px-3 rounded-lg hover:bg-[#faedf0] text-xs font-semibold text-neutral-800"
                    >
                      💝 Gifts by Sentiments
                    </Link>
                    <Link
                      href="#gifts-of-the-month"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileGiftsOpen(false);
                      }}
                      className="block py-1.5 px-3 rounded-lg hover:bg-[#faedf0] text-xs font-semibold text-neutral-800"
                    >
                      🌟 Gifts of the Month
                    </Link>
                  </div>
                )}
              </div>

              {/* Bestsellers */}
              <Link
                href="#packages"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#faedf0] text-neutral-800 font-semibold text-sm"
              >
                <Flame className="w-4 h-4 text-rose" />
                <span>Bestsellers</span>
              </Link>

              {/* All Products */}
              <Link
                href="#featured-products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#faedf0] text-neutral-800 font-semibold text-sm"
              >
                <PackageOpen className="w-4 h-4 text-rose" />
                <span>All Products</span>
              </Link>

              {/* Create your Own Basket */}
              <Link
                href="#build-surprise"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#faedf0] text-neutral-800 font-semibold text-sm"
              >
                <ShoppingBag className="w-4 h-4 text-rose" />
                <span>Create your Own Basket</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-[#f5d5db] flex flex-col gap-2">
              <Link
                href="#build-surprise"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#e7889b] to-[#d46f83] text-white py-2.5 rounded-full font-semibold text-sm shadow-sm"
              >
                <span>Plan A Surprise</span>
                <Sparkles className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/?text=Hi%20Gift%20Town!%20I%20want%20to%20plan%20a%20surprise."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-white border border-[#f5d5db] text-[#1e7e34] py-2 rounded-full font-semibold text-xs shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
