"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {
  Sparkles,
  MessageCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  Plus,
  Gift,
  ArrowRight,
  Package,
  Layers,
  Heart,
} from "lucide-react";
import StickerBadge from "@/components/StickerBadge";
import { supabase } from "@/lib/supabase";

export interface PackageItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export interface WeddingPackageData {
  id: string;
  title: string;
  category_tag: string;
  price: number;
  original_price?: number;
  badge: string;
  highlight: string;
  description: string;
  images: string[];
  items: PackageItem[];
}

const DEFAULT_PACKAGE: WeddingPackageData = {
  id: "pkg-baat-pakki",
  title: "The Engagement / Baat Pakki Package",
  category_tag: "Wedding Hampers",
  price: 75000,
  original_price: 85000,
  badge: "Signature Wedding Suite",
  highlight:
    "Grand 10-piece ceremonial bridal suite artfully crafted with luxury wooden baskets, floral accents, branded trousseau, confectionery & dry fruits.",
  description:
    "A complete, coordinated bridal engagement ceremony collection designed to spark unforgettable memories. Available as a full 10-piece suite or tailored with individual selections.",
  images: [
    "/images/packages/engagement-baat-pakki/baat-pakki-full-suite.webp",
    "/images/packages/engagement-baat-pakki/item-1-pink-rose-bouquet.webp",
    "/images/packages/engagement-baat-pakki/item-2-chocolate-cake-pvp.webp",
    "/images/packages/engagement-baat-pakki/baat-pakki-6.jpeg",
    "/images/packages/engagement-baat-pakki/baat-pakki-8.jpeg",
    "/images/packages/engagement-baat-pakki/item-5-choco-floral-heart.webp",
    "/images/packages/engagement-baat-pakki/baat-pakki-dupatta-basket.webp",
    "/images/packages/engagement-baat-pakki/saya-dresses-gajras-basket.webp",
    "/images/packages/engagement-baat-pakki/item-8-dress-watch-perfume.webp",
    "/images/packages/engagement-baat-pakki/item-9-embroidered-shawl-heels.webp",
    "/images/packages/engagement-baat-pakki/item-10-loaded-snack-basket.webp",
  ],
  items: [
    {
      id: "item-1",
      name: "Artificial Pink Flowers Bouquet",
      price: 3500,
      description:
        "Artfully arranged artificial pink rose blooms with satin ribbon wrap and delicate pearl accents.",
      image: "/images/packages/engagement-baat-pakki/item-1-pink-rose-bouquet.webp",
    },
    {
      id: "item-2",
      name: "2-Pound Chocolate Cake with Decorated PVP Box",
      price: 4500,
      description:
        "Fresh 2-pound gourmet chocolate cake presented in an illuminated transparent PVP display box with floral topper.",
      image: "/images/packages/engagement-baat-pakki/item-2-chocolate-cake-pvp.webp",
    },
    {
      id: "item-3",
      name: "Royal Dry Fruits Wooden Basket",
      price: 9500,
      description:
        "6-compartment wooden platter filled with almonds, walnuts, cashews, pistachios, roasted chickpeas, and 8x Dairy Milk Bubbly with gold Baat Pakki tag.",
      image: "/images/packages/engagement-baat-pakki/baat-pakki-6.jpeg",
    },
    {
      id: "item-4",
      name: "1kg Mithai Wooden Tray with Baat Pakki Tag",
      price: 5500,
      description:
        "1kg artisan assorted celebration mithai arranged in a handcrafted wooden tray with bespoke gold Baat Pakki Urdu acrylic tag.",
      image: "/images/packages/engagement-baat-pakki/baat-pakki-8.jpeg",
    },
    {
      id: "item-5",
      name: "Choco-Floral Heart Shape Keepsake Box",
      price: 5000,
      description:
        "Heart box filled with Ferrero Rocher golden chocolates and white scented roses with calligraphy ribbon.",
      image: "/images/packages/engagement-baat-pakki/item-5-choco-floral-heart.webp",
    },
    {
      id: "item-6",
      name: "Small Wooden Basket with Baat Pakki Dupatta",
      price: 4000,
      description:
        "Bespoke wooden basket carrying the ceremonial crimson embroidered Baat Pakki dupatta with gold trim.",
      image: "/images/packages/engagement-baat-pakki/baat-pakki-dupatta-basket.webp",
    },
    {
      id: "item-7",
      name: "Medium Decorated Wooden Basket (Saya Dresses & Gajras)",
      price: 12500,
      description:
        "Decorated wooden trousseau basket with 2 unstitched Saya designer dresses, luxury handbag, and artificial ribbon gajra pairs.",
      image: "/images/packages/engagement-baat-pakki/saya-dresses-gajras-basket.webp",
    },
    {
      id: "item-8",
      name: "Medium Decorated Wooden Basket (Branded Dress, Watch & J. Perfume)",
      price: 14500,
      description:
        "Luxury wooden basket with an unstitched branded designer dress, elegant wristwatch, purse, and authentic J. (Junaid Jamshed) Perfume.",
      image: "/images/packages/engagement-baat-pakki/item-8-dress-watch-perfume.webp",
    },
    {
      id: "item-9",
      name: "Large Wooden Decorated Basket (Embroidered Shawl & Heels)",
      price: 10500,
      description:
        "Large ceremonial wooden basket with black heavy gold-embroidered velvet shawl, designer heels, and bridal watch set.",
      image: "/images/packages/engagement-baat-pakki/item-9-embroidered-shawl-heels.webp",
    },
    {
      id: "item-10",
      name: "Grand Loaded Snack Basket with Imported Flowers",
      price: 5500,
      description:
        "Lavish celebration snack basket with Lays 4x, Noms nachos 2x, Pop Nosh popcorn, Cocomo 2x, Kurkure, wafers, Frisky, Heaven biscuits, Nestle cold coffee, Fabulous biscuits, Dairy Milk, Nestle juices, Pepsi, Danisa butter cookies & floral accents.",
      image: "/images/packages/engagement-baat-pakki/item-10-loaded-snack-basket.webp",
    },
  ],
};

export default function WeddingPackageSection() {
  const [pkg, setPkg] = useState<WeddingPackageData>(DEFAULT_PACKAGE);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"full" | "customize">("full");
  const [selectedItemIds, setSelectedItemIds] = useState<Record<string, boolean>>({});
  const [previewItem, setPreviewItem] = useState<PackageItem | null>(null);
  const [mounted, setMounted] = useState(false);

  // Gallery swipe tracking
  const galleryTouchStartX = useRef<number | null>(null);
  const galleryTouchStartY = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with Supabase table
  useEffect(() => {
    async function fetchPackage() {
      try {
        const { data, error } = await supabase
          .from("wedding_packages")
          .select("*")
          .eq("id", "pkg-baat-pakki")
          .single();

        if (!error && data) {
          const loaded: WeddingPackageData = {
            id: data.id,
            title: data.title || DEFAULT_PACKAGE.title,
            category_tag: data.category_tag || DEFAULT_PACKAGE.category_tag,
            price: Number(data.price) || DEFAULT_PACKAGE.price,
            original_price: data.original_price ? Number(data.original_price) : undefined,
            badge: data.badge || DEFAULT_PACKAGE.badge,
            highlight: data.highlight || DEFAULT_PACKAGE.highlight,
            description: data.description || DEFAULT_PACKAGE.description,
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : DEFAULT_PACKAGE.images,
            items: Array.isArray(data.items) && data.items.length > 0 ? data.items : DEFAULT_PACKAGE.items,
          };
          setPkg(loaded);
        }
      } catch (err) {
        console.error("Using default wedding package:", err);
      }
    }

    fetchPackage();

    const channel = supabase
      .channel("realtime-wedding-package")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wedding_packages" },
        () => {
          fetchPackage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Lock background scroll when quick view modal is open
  useEffect(() => {
    if (previewItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [previewItem]);

  // Gallery Navigation
  const totalImages = pkg.images.length;
  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + totalImages) % totalImages);
  };
  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % totalImages);
  };

  const onGalleryTouchStart = (e: React.TouchEvent) => {
    galleryTouchStartX.current = e.touches[0].clientX;
    galleryTouchStartY.current = e.touches[0].clientY;
  };

  const onGalleryTouchEnd = (e: React.TouchEvent) => {
    if (galleryTouchStartX.current === null || galleryTouchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - galleryTouchStartX.current;
    const deltaY = e.changedTouches[0].clientY - galleryTouchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    galleryTouchStartX.current = null;
    galleryTouchStartY.current = null;
  };

  // Item Toggle Selection
  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectAll = () => {
    const updated: Record<string, boolean> = {};
    pkg.items.forEach((it) => {
      updated[it.id] = true;
    });
    setSelectedItemIds(updated);
  };

  const clearAll = () => {
    const updated: Record<string, boolean> = {};
    pkg.items.forEach((it) => {
      updated[it.id] = false;
    });
    setSelectedItemIds(updated);
  };

  // Calculate live price based on selection
  const selectedItems = pkg.items.filter((it) => selectedItemIds[it.id]);
  const isFullSuiteSelected = selectedItems.length === pkg.items.length;
  const calculatedTotal = selectedItems.reduce((sum, it) => sum + (it.price || 0), 0);
  const finalPrice = isFullSuiteSelected ? pkg.price : calculatedTotal;

  // WhatsApp messages
  const fullPackageWhatsAppMessage = `Hi Gift Town! I want to order the complete "${pkg.title}" (${pkg.category_tag}) for PKR ${pkg.price.toLocaleString()}. Please confirm availability.`;

  const customSetWhatsAppMessage = isFullSuiteSelected
    ? fullPackageWhatsAppMessage
    : `Hi Gift Town! I want to order a custom tailored package from "${pkg.title}":\n\nSelected Items (${selectedItems.length}):\n` +
      selectedItems
        .map((it, idx) => `${idx + 1}. ${it.name} - PKR ${it.price.toLocaleString()}`)
        .join("\n") +
      `\n\nTotal Custom Amount: PKR ${finalPrice.toLocaleString()}.\nPlease confirm availability and delivery details!`;

  return (
    <section
      id="custom-hamper"
      className="relative pt-16 sm:pt-20 pb-20 sm:pb-28 bg-[#fce3e0] z-10"
    >
      <div id="build-surprise" className="absolute -top-24 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-center mb-4">
            <StickerBadge variant="rose" rotate="-2" size="sm">
              <span>{pkg.badge}</span>
            </StickerBadge>
          </div>

          <h2 className="font-display font-black text-[clamp(28px,6.5vw,48px)] sm:text-[clamp(40px,5vw,68px)] text-rose leading-[1.05] tracking-tight drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)] px-2">
            <span className="block uppercase">THE ENGAGEMENT</span>
            <span className="block uppercase">BAAT PAKKI SUITE</span>
          </h2>

          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-3 max-w-2xl mx-auto leading-relaxed">
            {pkg.highlight}
          </p>

          {/* ── 2-MODE TOGGLE PILL ── */}
          <div className="mt-8 flex items-center justify-center">
            <div className="inline-flex p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-rose/25 shadow-[0_4px_20px_rgba(226,64,92,0.1)] gap-1">
              <button
                type="button"
                onClick={() => setViewMode("full")}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                  viewMode === "full"
                    ? "bg-gradient-to-r from-rose to-[#d43751] text-white shadow-md scale-[1.02]"
                    : "text-maroon/75 hover:text-maroon hover:bg-rose/5"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Complete Suite (PKR {pkg.price.toLocaleString()})</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("customize")}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-body font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
                  viewMode === "customize"
                    ? "bg-gradient-to-r from-rose to-[#d43751] text-white shadow-md scale-[1.02]"
                    : "text-maroon/75 hover:text-maroon hover:bg-rose/5"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Pick &amp; Choose Items</span>
                {selectedItems.length > 0 && selectedItems.length < pkg.items.length && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                    {selectedItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* MODE A: FULL COMPLETE SUITE (Clean, Focused, Zero-Clutter)  */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {viewMode === "full" && (
          <div className="max-w-5xl mx-auto rounded-[32px] sm:rounded-[40px] bg-white border border-rose/20 shadow-[0_20px_50px_rgba(107,21,53,0.1)] overflow-hidden p-5 sm:p-8 lg:p-10 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Big Lookbook Gallery */}
              <div className="lg:col-span-7 space-y-4">
                <div
                  onTouchStart={onGalleryTouchStart}
                  onTouchEnd={onGalleryTouchEnd}
                  className="relative w-full h-[340px] sm:h-[420px] lg:h-[460px] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#f8e6e8] select-none touch-pan-y group"
                >
                  <Image
                    src={pkg.images[activeImageIdx] || pkg.images[0]}
                    alt={`${pkg.title} shot ${activeImageIdx + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 600px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />

                  {/* Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20 pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-maroon border border-white/60 shadow-sm">
                      <span>{pkg.category_tag}</span>
                    </span>

                    <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md shadow-sm">
                      Photo {activeImageIdx + 1} of {totalImages}
                    </span>
                  </div>

                  {/* Left / Right Arrows */}
                  {totalImages > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        aria-label="Previous photo"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-maroon flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        aria-label="Next photo"
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-maroon flex items-center justify-center shadow-lg transition-transform active:scale-90 cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail strip */}
                {totalImages > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 no-scrollbar">
                    {pkg.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          activeImageIdx === idx
                            ? "border-rose shadow-md scale-105"
                            : "border-rose/20 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Suite Details & Complete Inclusions */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-rose">
                    All-Inclusive Wedding Suite
                  </span>
                  <h3 className="font-serif font-black text-2xl sm:text-3xl text-maroon mt-1 leading-tight">
                    {pkg.title}
                  </h3>

                  <div className="flex items-baseline gap-3 mt-3">
                    <span className="font-display font-black text-3xl sm:text-4xl text-maroon">
                      PKR {pkg.price.toLocaleString()}
                    </span>
                    {pkg.original_price && (
                      <span className="text-base text-maroon/40 line-through font-body">
                        PKR {pkg.original_price.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 ml-auto">
                      Save PKR {((pkg.original_price || 85000) - pkg.price).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="font-body text-xs sm:text-sm text-maroon/75 leading-relaxed">
                  {pkg.description}
                </p>

                {/* What's Included: High-level Elegant Checklist */}
                <div className="rounded-2xl bg-[#fdf5f6] border border-rose/15 p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-rose/15">
                    <span className="font-body font-bold text-xs uppercase tracking-wider text-maroon">
                      What&apos;s Included (All 10 Pieces):
                    </span>
                    <span className="text-[11px] font-bold text-rose">10/10 Decorated</span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-[13px] text-maroon/85 font-medium max-h-[220px] overflow-y-auto pr-1">
                    {pkg.items.map((item, idx) => (
                      <div key={item.id} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose flex-shrink-0 mt-1.5" />
                        <span>
                          <strong className="text-maroon font-semibold">{idx + 1}. {item.name}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Suite Button */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(fullPackageWhatsAppMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white py-4 px-6 rounded-full font-body font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02] active:scale-95"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Book Complete Suite (PKR {pkg.price.toLocaleString()})</span>
                  </a>

                  <p className="text-center font-body text-xs text-maroon/60">
                    Need only specific baskets?{" "}
                    <button
                      type="button"
                      onClick={() => setViewMode("customize")}
                      className="text-rose font-bold underline hover:text-maroon transition-colors cursor-pointer"
                    >
                      Switch to Pick &amp; Choose →
                    </button>
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════ */}
        {/* MODE B: PICK & CHOOSE (Boutique Visual Grid with Big Images) */}
        {/* ═════════════════════════════════════════════════════════════ */}
        {viewMode === "customize" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Top Helper Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white/90 backdrop-blur-md border border-rose/15 shadow-sm">
              <div>
                <h3 className="font-serif font-black text-xl text-maroon">
                  Pick &amp; Choose Your Ceremonial Pieces
                </h3>
                <p className="font-body text-xs sm:text-sm text-maroon/70 mt-0.5">
                  Tap <span className="font-bold text-rose">+ Add</span> on any items you need. We will prepare and decorate your custom selection.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={selectAll}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-rose/10 hover:bg-rose/20 text-rose transition-colors cursor-pointer"
                >
                  Select All ({pkg.items.length})
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Big Visual Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {pkg.items.map((item, idx) => {
                const isSelected = !!selectedItemIds[item.id];

                return (
                  <div
                    key={item.id}
                    className={`relative rounded-[28px] bg-white border transition-all duration-300 overflow-hidden flex flex-col ${
                      isSelected
                        ? "border-rose shadow-[0_12px_30px_rgba(226,64,92,0.14)] ring-2 ring-rose/30"
                        : "border-rose/15 shadow-sm opacity-90 hover:opacity-100 hover:border-rose/30"
                    }`}
                  >
                    {/* Big Visual Photo with click to inspect */}
                    <div
                      onClick={() => setPreviewItem(item)}
                      className="relative w-full aspect-[4/3] bg-[#f8e6e8] cursor-pointer group overflow-hidden"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/90 backdrop-blur-md text-maroon border border-white/60 shadow-xs">
                          Piece #{idx + 1}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-maroon flex items-center justify-center shadow-sm transition-transform active:scale-90"
                        title="Zoom / Details"
                      >
                        <Eye className="w-4 h-4 text-maroon" />
                      </button>

                      {/* Floating Price on Image */}
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="font-display font-black text-xl text-white drop-shadow-md">
                          PKR {item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-maroon leading-snug">
                          {item.name}
                        </h4>
                        <p className="font-body text-xs text-maroon/70 line-clamp-2 mt-1.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Big Clear Add / Remove Button */}
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className={`w-full py-3 px-4 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-rose text-white shadow-md hover:bg-[#d43751]"
                            : "bg-[#fdf0f2] hover:bg-[#fcdde1] text-maroon border border-rose/25"
                        }`}
                      >
                        {isSelected ? (
                          <span>Added to Selection</span>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 stroke-[2.5]" />
                            <span>+ Add to Selection</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── STICKY BOTTOM CHECKOUT BAR (Only in Customize Mode) ── */}
            <div className="sticky bottom-4 z-30 p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border border-rose/25 shadow-[0_16px_36px_rgba(107,21,53,0.18)] flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose/10 text-rose">
                    <Gift className="w-3.5 h-3.5" />
                    <span>
                      {selectedItems.length} of {pkg.items.length} pieces selected
                    </span>
                  </span>
                  {isFullSuiteSelected && (
                    <span className="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      Full Package Discount Applied
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="font-display font-black text-2xl sm:text-3xl text-maroon">
                    PKR {finalPrice.toLocaleString()}
                  </span>
                  {isFullSuiteSelected && pkg.original_price && (
                    <span className="text-xs text-maroon/40 line-through font-body">
                      PKR {pkg.original_price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-auto flex items-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(customSetWhatsAppMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-body font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95 ${
                    selectedItems.length === 0
                      ? "bg-neutral-200 text-neutral-400 pointer-events-none"
                      : "bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white hover:scale-105"
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {isFullSuiteSelected
                      ? "Order Complete Suite"
                      : `Order Selection (${selectedItems.length})`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ═════════════════════════════════════════════════════════════ */}
      {/* QUICK VIEW INSPECT MODAL (Portalled to document.body)        */}
      {/* ═════════════════════════════════════════════════════════════ */}
      {mounted && previewItem && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-md md:max-w-[480px] bg-white rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl border border-rose/25 max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose/15 flex-shrink-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose">
                Ceremonial Package Piece
              </span>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full bg-rose/10 hover:bg-rose/20 text-maroon flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1 pr-1.5 -mr-1.5 my-3 space-y-4 overscroll-contain">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#f8e6e8] border border-rose/15 flex-shrink-0">
                <Image
                  src={previewItem.image}
                  alt={previewItem.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>

              <div>
                <h3 className="font-serif font-black text-xl text-maroon mb-1">
                  {previewItem.name}
                </h3>
                <span className="font-display font-black text-2xl text-maroon">
                  PKR {previewItem.price.toLocaleString()}
                </span>
              </div>

              <div className="bg-[#fdf5f6] p-4 rounded-2xl border border-rose/15">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-maroon block mb-2">
                  Piece Details &amp; Inclusions:
                </span>
                <p className="font-body text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {previewItem.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-rose/15 flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  toggleItem(previewItem.id);
                  setPreviewItem(null);
                }}
                className={`flex-1 py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedItemIds[previewItem.id]
                    ? "bg-rose text-white shadow-md hover:bg-[#d43751]"
                    : "bg-[#fdf0f2] hover:bg-[#fcdde1] text-maroon border border-rose/25"
                }`}
              >
                {selectedItemIds[previewItem.id] ? (
                  <span>Added to Selection</span>
                ) : (
                  <>
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+ Add to Selection</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
