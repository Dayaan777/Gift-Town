"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Sparkles,
  Star,
  MessageCircle,
  Eye,
  Heart,
  ArrowRight,
  Filter,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import StickerBadge from "@/components/StickerBadge";
import QuickViewMediaGallery, { MediaItem } from "@/components/QuickViewMediaGallery";
import { supabase } from "@/lib/supabase";

export interface CatalogProduct {
  id: string;
  name: string;
  categoryTag: string;
  category: "all" | "bouquets" | "hampers" | "boxes" | "chocolates";
  badge?: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewsCount: number;
  highlight: string;
  image: string;
  whatsappMessage: string;
  media_gallery?: MediaItem[];
  image_scale?: number;
  image_position?: string;
  image_offset_y?: number;
  image_offset_x?: number;
}

const DEFAULT_PRODUCTS: CatalogProduct[] = [
  {
    id: "cat-1",
    name: "Heart-Shaped Money & Lights Bouquet",
    categoryTag: "Currency & Floral Bouquet",
    category: "bouquets",
    badge: "Most Loved",
    price: "6,500",
    originalPrice: "7,800",
    rating: 5.0,
    reviewsCount: 58,
    highlight: "100+ artfully folded currency cones with warm micro fairy lights and fresh white roses.",
    image: "/images/products/heart-money-lights-bouquet.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Heart-Shaped Money & Lights Bouquet'.",
  },
  {
    id: "cat-2",
    name: "Candy Pillow Box & Treats Favor",
    categoryTag: "Boutique Treat Box",
    category: "boxes",
    badge: "Trending",
    price: "3,800",
    originalPrice: "4,500",
    rating: 4.9,
    reviewsCount: 42,
    highlight: "Clear acetate candy pillow box with flared ribbon wings, Ferrero Rocher & movie snacks.",
    image: "/images/products/candy-pillow-treats.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Candy Pillow Box & Treats Favor'.",
  },
  {
    id: "cat-3",
    name: "Snack & Love Apology Bouquet",
    categoryTag: "Snack & Floral Bouquet",
    category: "bouquets",
    badge: "Bestseller",
    price: "5,200",
    originalPrice: "6,000",
    rating: 5.0,
    reviewsCount: 64,
    highlight: "Deluxe black wrapper with handwritten love notes, assorted chocolates and collectible toys.",
    image: "/images/products/snack-love-bouquet.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Snack & Love Apology Bouquet'.",
  },
  {
    id: "cat-4",
    name: "Grand Gourmet Chocolate Wicker Basket",
    categoryTag: "Luxury Chocolate Basket",
    category: "hampers",
    badge: "Signature Craft",
    price: "6,800",
    originalPrice: "7,800",
    rating: 5.0,
    reviewsCount: 51,
    highlight: "Handwoven white wicker basket brimming with Cadbury Wholenut, Galaxy, Mars, Twix & KitKat.",
    image: "/images/products/gourmet-chocolate-basket.png",
    whatsappMessage: "Hi Gift Town! I want to book the 'Grand Gourmet Chocolate Wicker Basket'.",
  },
  {
    id: "cat-5",
    name: "Grand Birthday Celebration Hamper",
    categoryTag: "Celebration Hamper",
    category: "hampers",
    badge: "Festive Favorite",
    price: "5,800",
    originalPrice: "6,600",
    rating: 5.0,
    reviewsCount: 47,
    highlight: "Celebration mini cake with pearl frosting, plush teddy bear mascot and wrapped fresh rose bouquet.",
    image: "/images/products/grand-birthday-hamper.png",
    whatsappMessage: "Hi Gift Town! I want to book the 'Grand Birthday Celebration Hamper'.",
  },
  {
    id: "cat-6",
    name: "Red Rose Heart Pedestal Box",
    categoryTag: "Floral Keepsake Box",
    category: "boxes",
    badge: "Romantic",
    price: "5,500",
    originalPrice: "6,200",
    rating: 5.0,
    reviewsCount: 39,
    highlight: "Velvet heart box packed with fragrant red roses, golden Ferrero Rocher & satin bows.",
    image: "/images/card-heart-box.jpg",
    whatsappMessage: "Hi Gift Town! I want to order the 'Red Rose Heart Pedestal Box'.",
  },
  {
    id: "cat-7",
    name: "Artisan Chocolate Treats Casket",
    categoryTag: "Confectionery Hamper",
    category: "chocolates",
    badge: "Imported Treats",
    price: "4,600",
    originalPrice: "5,400",
    rating: 4.9,
    reviewsCount: 33,
    highlight: "Deluxe confectionery tray loaded with Dairy Milk Silk, Snickers, Galaxy & KitKat Chunky bars.",
    image: "/images/card-hamper.jpg",
    whatsappMessage: "Hi Gift Town! I want to order the 'Artisan Chocolate Treats Casket'.",
  },
  {
    id: "cat-8",
    name: "Signature Fresh Floral Cascade",
    categoryTag: "Hand-Tied Bouquet",
    category: "bouquets",
    badge: "Fresh Blooms",
    price: "4,200",
    originalPrice: "4,900",
    rating: 5.0,
    reviewsCount: 45,
    highlight: "Handcrafted imported wrapping with seasonal baby's breath, pastel roses and calligraphy note.",
    image: "/images/card-bouquet.jpg",
    whatsappMessage: "Hi Gift Town! I want to order the 'Signature Fresh Floral Cascade'.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "bouquets", label: "Bouquets" },
  { id: "hampers", label: "Hampers" },
  { id: "boxes", label: "Gift Boxes" },
  { id: "chocolates", label: "Chocolates" },
];

export default function FeaturedProductsSection() {
  const [products, setProducts] = useState<CatalogProduct[]>(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [previewItem, setPreviewItem] = useState<CatalogProduct | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background page scrolling when quick-view modal is open
  useEffect(() => {
    if (previewItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [previewItem]);

  // Mobile slider state (shows 1 card at a time with swipe navigation)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  // Load from Supabase with instant realtime updates
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("featured_products")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: CatalogProduct[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            categoryTag: d.category_tag || "Boutique Gift",
            category: d.category || "bouquets",
            badge: d.badge || undefined,
            price: d.price,
            originalPrice: d.original_price || undefined,
            rating: Number(d.rating) || 5.0,
            reviewsCount: Number(d.reviews_count) || 45,
            highlight: d.highlight || "",
            image: d.image,
            media_gallery: Array.isArray(d.media_gallery) ? d.media_gallery : [],
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
        console.error("Using fallback featured products:", err);
      }
    }

    fetchProducts();

    // Realtime subscription deferred slightly so initial hydration & button events are instantaneous
    let channel: any = null;
    const subTimer = setTimeout(() => {
      channel = supabase
        .channel("realtime-featured-products")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "featured_products" },
          () => {
            fetchProducts();
          }
        )
        .subscribe();
    }, 1200);

    return () => {
      clearTimeout(subTimer);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const total = filteredProducts.length;

  // Reset index if category filter changes or total shrinks
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

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

  return (
    <section
      id="featured-products"
      className="relative pt-12 sm:pt-16 pb-16 sm:pb-24 bg-[#fce3e0] z-10"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        {/* ── Section Header (Exact same typography, font, and color styling as FEATUREDBESTSELLERS) ── */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="flex items-center justify-center mb-4">
            <StickerBadge variant="rose" rotate="-2" size="sm">
              <span>Complete Boutique Collection</span>
            </StickerBadge>
          </div>

          <h2 className="font-display font-black text-[clamp(30px,7.8vw,44px)] sm:text-[clamp(44px,5.8vw,88px)] text-rose leading-[1.02] tracking-tight drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)] px-2">
            <span className="block">FEATURED</span>
            <span className="block">PRODUCTS</span>
          </h2>

          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-4 max-w-2xl mx-auto leading-relaxed">
            Browse our full repertoire of artisanal bouquets, curated hampers, and celebration gift boxes designed to spark unforgettable moments.
          </p>

          {/* ── Category Filter Pills ── */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-8">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-rose text-white shadow-md scale-105"
                      : "bg-white/80 hover:bg-white text-maroon/70 hover:text-rose border border-rose/15 hover:shadow-xs"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Desktop & Tablet Grid: Multi-column Showcase (sm: 2-col, lg: 4-col) ── */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {filteredProducts.map((product) => {
            const isLiked = !!likedMap[product.id];
            return (
              <ProductCard
                key={product.id}
                product={product}
                isLiked={isLiked}
                onToggleLike={() => toggleLike(product.id)}
                onPreview={() => setPreviewItem(product)}
              />
            );
          })}
        </div>

        {/* ── Mobile Touch Slider (Shows 1 card at a time with swipe gesture, arrows & dots) ── */}
        <div className="sm:hidden relative w-full px-2">
          {total > 1 && (
            <>
              {/* Left Arrow Button */}
              <button
                onClick={handlePrev}
                disabled={isAnimating}
                aria-label="Previous product"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-rose text-white flex items-center justify-center shadow-xl hover:bg-[#cf334e] active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Right Arrow Button */}
              <button
                onClick={handleNext}
                disabled={isAnimating}
                aria-label="Next product"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-10 h-10 rounded-full bg-rose text-white flex items-center justify-center shadow-xl hover:bg-[#cf334e] active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Swipe Container */}
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="relative h-[530px] w-full flex items-center justify-center overflow-visible touch-pan-y"
          >
            {filteredProducts.map((product, idx) => {
              let diff = idx - currentIndex;
              if (diff > total / 2) diff -= total;
              if (diff < -total / 2) diff += total;

              const isCenter = diff === 0;
              const isLiked = !!likedMap[product.id];

              return (
                <div
                  key={product.id}
                  className="absolute w-[290px] h-[510px]"
                  style={{
                    transform: `translate3d(${diff * 105}%, 0, 0) scale(${isCenter ? 1 : 0.86})`,
                    opacity: isCenter ? 1 : 0,
                    pointerEvents: isCenter ? "auto" : "none",
                    transition:
                      "transform 500ms cubic-bezier(0.25, 1, 0.5, 1), opacity 400ms ease",
                  }}
                >
                  <ProductCard
                    product={product}
                    isLiked={isLiked}
                    onToggleLike={() => toggleLike(product.id)}
                    onPreview={() => setPreviewItem(product)}
                    priority={idx === 0}
                  />
                </div>
              );
            })}
          </div>

          {/* Dot Navigation Indicators for Mobile */}
          {total > 1 && (
            <div className="relative z-20 flex items-center justify-center gap-2 mt-4">
              {filteredProducts.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToSlide(idx)}
                  aria-label={`Go to product ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-7 bg-rose shadow-xs"
                      : "w-2 bg-rose/30 hover:bg-rose/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Quick Inspect Modal (Portalled directly to document.body) ── */}
      {mounted && previewItem && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 pt-2 pb-8 sm:p-5 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-md md:max-w-[480px] bg-white rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 shadow-2xl border border-rose/25 max-h-[86vh] sm:max-h-[88vh] -translate-y-2 sm:translate-y-0 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Category & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-rose/15 flex-shrink-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose">
                {previewItem.categoryTag}
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-rose/10 hover:bg-rose/20 text-maroon flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="overflow-y-auto flex-1 pr-1.5 -mr-1.5 my-3 space-y-3.5 overscroll-contain">
              {/* Swipable Modal Media Showcase (Cover + Secondary Images/Videos) */}
              <QuickViewMediaGallery
                coverImage={previewItem.image}
                productName={previewItem.name}
                secondaryMedia={previewItem.media_gallery}
                imageScale={previewItem.image_scale ?? 100}
                imagePosition={previewItem.image_position || "center"}
                imageOffsetX={previewItem.image_offset_x ?? 0}
                imageOffsetY={previewItem.image_offset_y ?? 0}
              />

              {/* Title & Price Header */}
              <div>
                <h3 className="font-serif font-black text-lg sm:text-xl text-maroon mb-1">
                  {previewItem.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-black text-lg sm:text-xl text-maroon">
                    PKR {previewItem.price}
                  </span>
                  {previewItem.originalPrice && (
                    <span className="text-xs sm:text-sm text-maroon/40 line-through">
                      PKR {previewItem.originalPrice}
                    </span>
                  )}
                  <span className="ml-auto text-xs font-semibold text-rose bg-rose/10 px-2.5 py-0.5 rounded-full">
                    ★ {previewItem.rating.toFixed(1)} ({previewItem.reviewsCount} reviews)
                  </span>
                </div>
              </div>

              {/* What's Included in this package: Shows admin description */}
              <div className="bg-[#fdf5f6] p-3.5 sm:p-4 rounded-2xl border border-rose/15">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-maroon block mb-2">
                  What&apos;s Included in this package:
                </span>
                {previewItem.highlight ? (
                  <div className="space-y-1.5">
                    {previewItem.highlight
                      .split(/\r?\n/)
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-700 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose flex-shrink-0 mt-1.5" />
                          <span>{line}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    Custom handcrafted arrangement with luxury wrappers and personalized wish card.
                  </p>
                )}
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="pt-3 border-t border-rose/15 flex-shrink-0">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(previewItem.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] text-white py-2.5 sm:py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat to Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}

{/* ── Subcomponent: ProductCard (Clean Editorial Lookbook Card for Photographic Backgrounds) ── */}
function ProductCard({
  product,
  isLiked,
  onToggleLike,
  onPreview,
  priority = false,
}: {
  product: CatalogProduct;
  isLiked: boolean;
  onToggleLike: () => void;
  onPreview: () => void;
  priority?: boolean;
}) {
  return (
    <div onClick={onPreview} className="group relative w-full h-full rounded-[28px] sm:rounded-[32px] bg-white border border-rose/15 shadow-[0_10px_28px_rgba(107,21,53,0.06)] hover:shadow-[0_18px_42px_rgba(107,21,53,0.12)] hover:border-rose/30 transition-all duration-400 flex flex-col justify-between overflow-hidden cursor-pointer">
      {/* ── Upper Showcase (Full-Bleed Photographic Display Window) ── */}
      <div className="relative w-full h-[250px] sm:h-[260px] overflow-hidden rounded-t-[28px] sm:rounded-t-[32px] bg-[#f8e6e8]">
        {/* Full-bleed Product Image with subtle cinematic hover zoom */}
        <div
          className="relative w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            transform: `scale(${(product.image_scale ?? 100) / 100}) translate3d(${product.image_offset_x ?? 0}px, ${product.image_offset_y ?? 0}px, 0)`,
          }}
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 290px, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            style={{
              objectPosition: product.image_position || "center",
            }}
            priority={priority}
          />
        </div>

        {/* Top Scrim Gradient (Ensures badge & heart button readability on any photo background) */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/45 via-black/15 to-transparent z-10 pointer-events-none" />

        {/* Bottom Feather Gradient (Smooth transition into pure white card body) */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white via-white/50 to-transparent z-10 pointer-events-none" />

        {/* Badge & Heart Button */}
        <div className="absolute top-3.5 inset-x-3.5 z-20 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-maroon border border-white/60 shadow-sm">
              <span>{product.badge}</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLike();
            }}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/95 backdrop-blur-md border border-white/60 flex items-center justify-center text-maroon/70 hover:text-rose hover:bg-white shadow-sm transition-all active:scale-90 cursor-pointer"
            aria-label="Save to favorites"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isLiked ? "fill-rose text-rose" : ""
              }`}
            />
          </button>
        </div>

        {/* Quick Inspect Button on Hover */}
        <div className="absolute bottom-2.5 inset-x-0 flex justify-center pointer-events-none z-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-maroon/90 hover:bg-maroon text-[#FFF4D0] text-[10px] font-bold tracking-wider uppercase backdrop-blur-md shadow-lg active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* ── Lower Product Details Card ── */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
        <div>
          {/* Rating & Tag */}
          <div className="flex items-center justify-between text-xs mb-1.5 font-body">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-rose">
              {product.categoryTag}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-current" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-maroon/40 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif font-bold text-base sm:text-lg text-maroon group-hover:text-rose transition-colors duration-200 line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          {/* Highlight Description */}
          <p className="font-body text-xs text-maroon/70 leading-relaxed line-clamp-2 mb-3">
            {product.highlight}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="mt-2 pt-3 border-t border-rose/15 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[9px] uppercase font-bold tracking-widest text-maroon/50">
              Starting At
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-base sm:text-lg text-maroon">
                PKR {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-maroon/40 line-through font-body">
                  PKR {product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <a
            href={`https://wa.me/?text=${encodeURIComponent(product.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white px-4 py-2.5 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 group/btn"
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
