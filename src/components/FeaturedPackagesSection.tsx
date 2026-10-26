"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Sparkles,
  Star,
  MessageCircle,
  Eye,
  Check,
  Flame,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import StickerBadge from "@/components/StickerBadge";
import { supabase } from "@/lib/supabase";

export interface BestsellerProduct {
  id: string;
  name: string;
  categoryTag: string;
  category: "midnight" | "bouquets" | "romantic" | "bridal" | "hampers";
  badge: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewsCount: number;
  highlight: string;
  inclusions: string[];
  itemsIncluded: string[];
  image: string;
  whatsappMessage: string;
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

const DEFAULT_PRODUCTS: BestsellerProduct[] = [
  {
    id: "prod-1",
    name: "Heart-Shaped Money & Lights Bouquet",
    categoryTag: "Currency & Floral Bouquet",
    category: "bouquets",
    badge: "Most Loved",
    price: "6,500",
    originalPrice: "7,800",
    rating: 5.0,
    reviewsCount: 58,
    highlight: "100+ artfully folded currency cones with warm micro fairy lights and fresh white roses.",
    inclusions: ["100+ Cash Cones", "Fairy Lights", "White Rose Halo"],
    itemsIncluded: [
      "Signature Heart-Shaped Cascade of Real Folded Currency Cones",
      "Center Halo of Pure White Rose Blooms with Warm Micro Fairy Lights",
      "Deluxe Deep Crimson Wrap with Satin Bow & Calligraphy Card",
      "Custom Currency Denominations Available on Advance Order",
    ],
    image: "/images/products/heart-money-lights-bouquet.png",
    whatsappMessage:
      "Hi Gift Town! I want to order the 'Heart-Shaped Money & Lights Bouquet'. Please guide me with cash customization.",
  },
  {
    id: "prod-2",
    name: "Candy Pillow Box & Treats Favor",
    categoryTag: "Boutique Treat Box",
    category: "hampers",
    badge: "Trending",
    price: "3,800",
    originalPrice: "4,500",
    rating: 4.9,
    reviewsCount: 42,
    highlight: "Clear acetate candy pillow box with flared ribbon wings, Ferrero Rocher & movie snacks.",
    inclusions: ["Ferrero Rocher", "Imported Candies", "Silk Ribbon Wings"],
    itemsIncluded: [
      "Custom Clear Acetate Candy Pillow Box with Flared Pink Ribbon Wings",
      "Ferrero Rocher Gold Bonbons, Imported Movie Theatre Chocolates & Candies",
      "Artisan Nachos & Snack Packs with Handwritten Wish Tag",
      "Perfect Favor for Birthdays, Graduations & Sweet Surprises",
    ],
    image: "/images/products/candy-pillow-treats.png",
    whatsappMessage:
      "Hi Gift Town! I want to order the 'Candy Pillow Box & Treats Favor'.",
  },
  {
    id: "prod-3",
    name: "Snack & Love Apology Bouquet",
    categoryTag: "Snack & Love Bouquet",
    category: "bouquets",
    badge: "Bestseller",
    price: "5,200",
    originalPrice: "6,000",
    rating: 5.0,
    reviewsCount: 64,
    highlight: "Deluxe black wrapper with handwritten love notes, assorted chocolates and collectible toys.",
    inclusions: ["Dairy Milk & Snacks", "Apology Notes", "Hot Wheels & Toys"],
    itemsIncluded: [
      "Signature Black Luxury Satin Wrapper Cone with Red Bow",
      "Assorted Imported Chocolates (Cadbury Dairy Milk, Munch, Kurkure)",
      "Pepsi, Coca Cola & Pringles Cans with Sweet Love & Apology Notes",
      "Hot Wheels Cars, Grip Trainer, Mini Sports Balls & Rose Keepsake",
    ],
    image: "/images/products/snack-love-bouquet.png",
    whatsappMessage:
      "Hi Gift Town! I want to order the 'Snack & Love Apology Bouquet' with personalized love notes.",
  },
  {
    id: "prod-4",
    name: "Grand Gourmet Chocolate Wicker Basket",
    categoryTag: "Luxury Chocolate Basket",
    category: "hampers",
    badge: "Signature Craft",
    price: "6,800",
    originalPrice: "7,800",
    rating: 5.0,
    reviewsCount: 51,
    highlight: "Handwoven white wicker basket brimming with Cadbury Wholenut, Galaxy, Mars, Twix & KitKat.",
    inclusions: ["Wicker Basket", "Cadbury & Galaxy", "Mars & KitKat"],
    itemsIncluded: [
      "Handcrafted Natural White Woven Wicker Basket with Sturdy Handle",
      "Overloaded Assortment: Cadbury Dairy Milk Wholenut, Galaxy Hazelnut & Mars",
      "KitKat 4-Finger Clusters, Twix Bars, Bounty & Maxbar Gold Caramels",
      "Signature Gift Town Greeting Card with Golden Satin Bow Finish",
    ],
    image: "/images/products/gourmet-chocolate-basket.png",
    whatsappMessage:
      "Hi Gift Town! I want to book the 'Grand Gourmet Chocolate Wicker Basket'.",
  },
  {
    id: "prod-5",
    name: "Grand Birthday Celebration Hamper",
    categoryTag: "Celebration Hamper",
    category: "hampers",
    badge: "Festive Favorite",
    price: "5,800",
    originalPrice: "6,600",
    rating: 5.0,
    reviewsCount: 47,
    highlight: "Celebration mini cake with pearl frosting, plush teddy bear mascot and wrapped fresh rose bouquet.",
    inclusions: ["Plush Teddy Bear", "Mini Birthday Cake", "Fresh Rose Bouquet"],
    itemsIncluded: [
      "Hand-Woven Keepsake Gift Basket with Black & Gold Ribbon Trim",
      "Plush Soft Teddy Bear Mascot with Greeting Card",
      "Window Display Mini Birthday Celebration Cake with Pearl Topping",
      "Wrapped Red Rose Bloom Bouquet & Cadbury Dairy Milk Chocolates",
    ],
    image: "/images/products/grand-birthday-hamper.png",
    whatsappMessage:
      "Hi Gift Town! I want to book the 'Grand Birthday Celebration Hamper' with cake, teddy bear and florals.",
  },
];

export default function FeaturedPackagesSection() {
  const [products, setProducts] = useState<BestsellerProduct[]>(DEFAULT_PRODUCTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [previewItem, setPreviewItem] = useState<BestsellerProduct | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Sync with live Supabase table
  useEffect(() => {
    async function fetchBestsellers() {
      try {
        const { data, error } = await supabase
          .from("featured_bestsellers")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: BestsellerProduct[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            categoryTag: d.category_tag || "Signature Gift",
            category: d.category || "hampers",
            badge: d.badge || "Featured",
            price: d.price,
            originalPrice: d.original_price || undefined,
            rating: Number(d.rating) || 5.0,
            reviewsCount: Number(d.reviews_count) || 45,
            highlight: d.highlight || "",
            inclusions: Array.isArray(d.inclusions) ? d.inclusions : [],
            itemsIncluded: Array.isArray(d.items_included) ? d.items_included : [],
            image: d.image,
            whatsappMessage:
              d.whatsapp_message ||
              `Hi Gift Town! I want to order the '${d.name}'.`,
            image_scale: Number(d.image_scale) || 100,
            image_position: d.image_position || "center",
            image_offset_y: Number(d.image_offset_y) || 0,
            image_offset_x: Number(d.image_offset_x) || 0,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Using default bestsellers:", err);
      }
    }
    fetchBestsellers();

    // Realtime subscription: updates apply to website immediately
    const channel = supabase
      .channel("realtime-featured-bestsellers")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "featured_bestsellers" },
        () => {
          fetchBestsellers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const total = products.length;

  // Touch gesture tracking for mobile swipe
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const handlePrev = () => {
    if (isAnimating || total === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating || total === 0) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Trigger swipe only if horizontal movement is dominant and > 40px
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const jumpToSlide = (idx: number) => {
    if (isAnimating || idx === currentIndex || total === 0) return;
    setIsAnimating(true);
    setCurrentIndex(idx);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (total === 0) return null;

  return (
    <section
      id="packages"
      className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 bg-transparent z-10"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        
        {/* ── Section Header (Exact same typography, font, and color styling as GIFTS BY SENTIMENTS) ── */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center mb-4">
            <StickerBadge variant="rose" rotate="-2" size="sm">
              <Flame className="w-3.5 h-3.5 fill-[#d46f83] text-[#d46f83]" />
              <span>Handcrafted &amp; Most In-Demand</span>
            </StickerBadge>
          </div>

          <h2 className="font-display font-black text-[clamp(44px,5.8vw,88px)] text-rose leading-[1.02] tracking-tight drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)]">
            <span className="block">FEATURED</span>
            <span className="block">BESTSELLERS</span>
          </h2>

          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            Our most celebrated curated packages — tailored with love for doorstep surprise handovers in Thatta &amp; Makli or dispatched nationwide.
          </p>

          {/* ── Category Quick Jump Tabs ── */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-8">
            {products.map((prod, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={prod.id}
                  onClick={() => jumpToSlide(idx)}
                  className={`px-4 sm:px-5 py-2 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    isActive
                      ? "bg-maroon text-[#FFF4D0] shadow-md scale-105"
                      : "bg-white/90 hover:bg-white text-maroon/80 border border-maroon/10 hover:border-maroon/30 shadow-xs"
                  }`}
                >
                  {prod.name.split(" ")[0]} {prod.name.split(" ")[1] || ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3D Spatial Multi-Card Stage (Shows 3 products simultaneously on desktop, smooth responsive) ── */}
        <div className="relative w-full max-w-[1360px] mx-auto px-2 sm:px-6">
          
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            aria-label="Previous bestseller package"
            className="absolute left-0 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-rose text-white flex items-center justify-center shadow-xl hover:bg-[#cf334e] hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-70 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            disabled={isAnimating}
            aria-label="Next bestseller package"
            className="absolute right-0 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-rose text-white flex items-center justify-center shadow-xl hover:bg-[#cf334e] hover:scale-110 active:scale-95 transition-all duration-200 disabled:opacity-70 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          {/* ── Desktop 3D Spatial Stage Container: 3 Cards Visible ── */}
          <div className="hidden md:flex relative h-[610px] lg:h-[640px] w-full items-center justify-center overflow-visible">
            {products.map((prod, idx) => {
              // Circular relative offset (-2, -1, 0, 1, 2)
              let diff = idx - currentIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const isCenter = diff === 0;
              const isLeft = diff === -1;
              const isRight = diff === 1;
              const isFarLeft = diff < -1;
              const isFarRight = diff > 1;

              let transformStyle = "";
              let opacityStyle = 1;
              let zIndexStyle = 10;
              let pointerEvents = "auto";

              if (isCenter) {
                // Center Spotlight Card
                transformStyle = "translate3d(0, 0, 0) scale(1)";
                opacityStyle = 1;
                zIndexStyle = 30;
              } else if (isLeft) {
                // Left Flanking Card
                transformStyle = "translate3d(-410px, 12px, 0) scale(0.88) rotate(-1.5deg)";
                opacityStyle = 0.88;
                zIndexStyle = 20;
              } else if (isRight) {
                // Right Flanking Card
                transformStyle = "translate3d(410px, 12px, 0) scale(0.88) rotate(1.5deg)";
                opacityStyle = 0.88;
                zIndexStyle = 20;
              } else if (isFarLeft) {
                // Hidden far left
                transformStyle = "translate3d(-780px, 25px, 0) scale(0.75)";
                opacityStyle = 0;
                zIndexStyle = 5;
                pointerEvents = "none";
              } else if (isFarRight) {
                // Hidden far right
                transformStyle = "translate3d(780px, 25px, 0) scale(0.75)";
                opacityStyle = 0;
                zIndexStyle = 5;
                pointerEvents = "none";
              }

              return (
                <div
                  key={prod.id}
                  onClick={() => {
                    if (isLeft) handlePrev();
                    if (isRight) handleNext();
                  }}
                  className="absolute w-[330px] lg:w-[370px] h-[550px] lg:h-[580px] select-none"
                  style={{
                    transform: transformStyle,
                    opacity: opacityStyle,
                    zIndex: zIndexStyle,
                    pointerEvents: pointerEvents as any,
                    cursor: isCenter ? "default" : "pointer",
                    transition:
                      "transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 450ms ease",
                  }}
                >
                  <CleanBoutiqueCard
                    product={prod}
                    isCenter={isCenter}
                    isLiked={!!likedMap[prod.id]}
                    onToggleLike={() => toggleLike(prod.id)}
                    onQuickLook={() => setPreviewItem(prod)}
                  />
                </div>
              );
            })}
          </div>

          {/* ── Mobile Touch Slider Container with native swipe gesture ── */}
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="md:hidden relative h-[560px] sm:h-[590px] w-full flex items-center justify-center overflow-visible touch-pan-y"
          >
            {products.map((prod, idx) => {
              let diff = idx - currentIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const isCenter = diff === 0;

              return (
                <div
                  key={prod.id}
                  className="absolute w-[295px] sm:w-[340px] h-[540px] sm:h-[570px]"
                  style={{
                    transform: `translate3d(${diff * 105}%, 0, 0) scale(${isCenter ? 1 : 0.86})`,
                    opacity: isCenter ? 1 : 0,
                    pointerEvents: isCenter ? "auto" : "none",
                    transition:
                      "transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 400ms ease",
                  }}
                >
                  <CleanBoutiqueCard
                    product={prod}
                    isCenter={isCenter}
                    isLiked={!!likedMap[prod.id]}
                    onToggleLike={() => toggleLike(prod.id)}
                    onQuickLook={() => setPreviewItem(prod)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Dot Navigation Indicators ── */}
        <div className="relative z-20 flex items-center justify-center gap-2.5 mt-6 sm:mt-8">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToSlide(idx)}
              aria-label={`Go to product package ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-400 cursor-pointer ${
                currentIndex === idx
                  ? "w-8 bg-rose shadow-sm"
                  : "w-2.5 bg-rose/30 hover:bg-rose/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Clean Editorial Quick Look Modal ── */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-maroon/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-rose/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-rose/15">
              <span className="text-xs font-bold uppercase tracking-wider text-rose">
                {previewItem.badge} • {previewItem.categoryTag}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-cream/70 hover:bg-cream text-maroon flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Image Showcase */}
            <div className="relative w-full h-56 rounded-2xl overflow-hidden my-4 bg-gradient-to-b from-[#fef8f9] to-[#faedf0] border border-rose/15 p-3 flex items-center justify-center">
              <div
                className="relative w-full h-full"
                style={{
                  transform: `scale(${(previewItem.image_scale ?? 100) / 100}) translate3d(${previewItem.image_offset_x ?? 0}px, ${previewItem.image_offset_y ?? 0}px, 0)`,
                }}
              >
                <Image
                  src={previewItem.image}
                  alt={previewItem.name}
                  fill
                  className="object-contain drop-shadow-md"
                  style={{ objectPosition: previewItem.image_position || "center" }}
                />
              </div>
            </div>

            <div>
              <h3 className="font-serif font-black text-2xl text-maroon mb-1">
                {previewItem.name}
              </h3>
              <p className="font-body text-xs text-maroon/70 leading-relaxed mb-3">
                {previewItem.highlight}
              </p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display font-black text-2xl text-maroon">
                  PKR {previewItem.price}
                </span>
                {previewItem.originalPrice && (
                  <span className="text-sm text-maroon/40 line-through">
                    PKR {previewItem.originalPrice}
                  </span>
                )}
                <span className="ml-auto text-xs font-semibold text-rose bg-rose/10 px-2.5 py-0.5 rounded-full">
                  ★ {previewItem.rating.toFixed(1)} ({previewItem.reviewsCount} reviews)
                </span>
              </div>
            </div>

            <div className="space-y-2.5 bg-[#fdf5f6] p-4 rounded-2xl my-5 border border-rose/15">
              <span className="font-body text-xs font-bold uppercase tracking-wider text-maroon block">
                What&apos;s Included in this package:
              </span>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-700">
                {previewItem.itemsIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(previewItem.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] text-white py-3.5 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm &amp; Book on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

{/* ── Sub-Component: CleanBoutiqueCard (Clean, Editorial, High-Converting) ── */}
function CleanBoutiqueCard({
  product,
  isCenter,
  isLiked,
  onToggleLike,
  onQuickLook,
}: {
  product: BestsellerProduct;
  isCenter: boolean;
  isLiked: boolean;
  onToggleLike: () => void;
  onQuickLook: () => void;
}) {
  return (
    <div
      className={`relative w-full h-full rounded-[32px] lg:rounded-[36px] bg-white border flex flex-col justify-between overflow-hidden transition-all duration-500 group ${
        isCenter
          ? "border-rose/30 shadow-[0_22px_55px_rgba(107,21,53,0.14)]"
          : "border-rose/15 shadow-[0_12px_32px_rgba(107,21,53,0.06)] hover:border-rose/30 hover:shadow-[0_20px_45px_rgba(107,21,53,0.1)]"
      }`}
    >
      {/* ── Upper Showcase Vitrine (Generous, Clean Photo Display Area) ── */}
      <div className="relative w-full h-[290px] lg:h-[315px] p-4 bg-gradient-to-b from-[#fef8f9] via-[#fdf4f6] to-[#faedf0] overflow-hidden flex items-center justify-center">
        
        {/* Soft studio vignette glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.7)_0%,_transparent_75%)] pointer-events-none" />

        {/* Top Badging Row: Left Tag & Right Heart Button */}
        <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md text-maroon border border-rose/15 shadow-2xs">
            <Sparkles className="w-3 h-3 text-rose" />
            <span>{product.badge}</span>
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-rose/15 flex items-center justify-center text-maroon/60 hover:text-rose hover:bg-white shadow-2xs transition-all active:scale-90 cursor-pointer"
            aria-label="Save to wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isLiked ? "fill-rose text-rose" : ""
              }`}
            />
          </button>
        </div>

        {/* Real Product Image with tactile hover lift */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <div
            className="relative w-full h-full transition-transform duration-500 ease-out group-hover:scale-106 group-hover:-translate-y-1"
            style={{
              transform: `scale(${(product.image_scale ?? 100) / 100}) translate3d(${product.image_offset_x ?? 0}px, ${product.image_offset_y ?? 0}px, 0)`,
            }}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 340px, 420px"
              className="object-contain drop-shadow-md"
              style={{
                objectPosition: product.image_position || "center",
              }}
              priority={product.id === "prod-1" || product.id === "prod-2" || product.id === "prod-3"}
            />
          </div>
        </div>

        {/* Floating Quick View Pill on Hover (Doesn't block the photo!) */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickLook();
            }}
            className="pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-maroon/90 hover:bg-maroon text-[#FFF4D0] text-[11px] font-bold tracking-wider uppercase backdrop-blur-md shadow-md active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Inspect</span>
          </button>
        </div>
      </div>

      {/* ── Lower Product Details & Inclusions ── */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Category Subhead & Rating Line */}
          <div className="flex items-center justify-between text-xs mb-1.5 font-body">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-rose">
              {product.categoryTag}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-maroon/40 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif font-bold text-lg sm:text-xl text-maroon group-hover:text-rose transition-colors duration-200 line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          {/* Description Highlight */}
          <p className="font-body text-xs text-maroon/70 leading-relaxed line-clamp-2 mb-3">
            {product.highlight}
          </p>

          {/* Clean Curated Inclusions Dots */}
          <div className="flex items-center gap-1.5 text-[11px] text-maroon/60 font-medium">
            {product.inclusions.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-rose/40 font-bold">•</span>}
                <span className="truncate">{item}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Bottom Price & Action Checkout Bar ── */}
        <div className="mt-4 pt-3 border-t border-rose/15 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-maroon/50">
              Starting At
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-lg sm:text-xl text-maroon">
                PKR {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-maroon/40 line-through font-body">
                  PKR {product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(product.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white px-4 sm:px-5 py-2.5 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 group/btn"
            aria-label={`Order ${product.name} on WhatsApp`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Order</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
