"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Package,
  Layers,
  ArrowRight,
  Gift,
  Check,
  Flame,
  Star,
} from "lucide-react";
import StickerBadge from "@/components/StickerBadge";
import { supabase } from "@/lib/supabase";
import {
  getWhatsAppUrl,
  formatMultiItemOrder,
} from "@/lib/whatsapp";

export interface PackageItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category?: string;
}

export interface PackageData {
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
  is_active?: boolean;
}

export const DEFAULT_PACKAGES_LIST: PackageData[] = [
  {
    id: "pkg-baat-pakki",
    title: "The Engagement / Baat Pakki Package",
    category_tag: "Wedding Hampers",
    price: 75000,
    original_price: 85000,
    badge: "Signature Wedding Suite",
    highlight:
      "Grand 10-piece ceremonial bridal suite artfully crafted with luxury wooden baskets, floral accents, branded trousseau, confectionery & dry fruits.",
    description:
      "A complete, coordinated bridal engagement ceremony collection designed to spark unforgettable memories. Decorated with luxury ribbons, urdu acrylic tags, and fresh celebratory accents.",
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
        category: "bouquets",
        description: "Artfully arranged artificial pink rose blooms with satin ribbon wrap and delicate pearl accents.",
        image: "/images/packages/engagement-baat-pakki/item-1-pink-rose-bouquet.webp",
      },
      {
        id: "item-2",
        name: "2-Pound Chocolate Cake with Decorated PVP Box",
        price: 4500,
        category: "cakes",
        description: "Fresh 2-pound gourmet chocolate cake presented in an illuminated transparent PVP display box with floral topper.",
        image: "/images/packages/engagement-baat-pakki/item-2-chocolate-cake-pvp.webp",
      },
      {
        id: "item-3",
        name: "Royal Dry Fruits Wooden Basket",
        price: 9500,
        category: "chocolates",
        description: "6-compartment wooden platter filled with almonds, walnuts, cashews, pistachios, roasted chickpeas, and 8x Dairy Milk Bubbly with gold Baat Pakki tag.",
        image: "/images/packages/engagement-baat-pakki/baat-pakki-6.jpeg",
      },
      {
        id: "item-4",
        name: "1kg Mithai Wooden Tray with Baat Pakki Tag",
        price: 5500,
        category: "baskets",
        description: "1kg artisan assorted celebration mithai arranged in a handcrafted wooden tray with bespoke gold Baat Pakki Urdu acrylic tag.",
        image: "/images/packages/engagement-baat-pakki/baat-pakki-8.jpeg",
      },
      {
        id: "item-5",
        name: "Choco-Floral Heart Shape Keepsake Box",
        price: 5000,
        category: "chocolates",
        description: "Heart box filled with Ferrero Rocher golden chocolates and white scented roses with calligraphy ribbon.",
        image: "/images/packages/engagement-baat-pakki/item-5-choco-floral-heart.webp",
      },
      {
        id: "item-6",
        name: "Small Wooden Basket with Baat Pakki Dupatta",
        price: 4000,
        category: "baskets",
        description: "Bespoke wooden basket carrying the ceremonial crimson embroidered Baat Pakki dupatta with gold trim.",
        image: "/images/packages/engagement-baat-pakki/baat-pakki-dupatta-basket.webp",
      },
      {
        id: "item-7",
        name: "Medium Decorated Wooden Basket (Saya Dresses & Gajras)",
        price: 12500,
        category: "baskets",
        description: "Decorated wooden trousseau basket with 2 unstitched Saya designer dresses, luxury handbag, and artificial ribbon gajra pairs.",
        image: "/images/packages/engagement-baat-pakki/saya-dresses-gajras-basket.webp",
      },
      {
        id: "item-8",
        name: "Medium Decorated Wooden Basket (Branded Dress, Watch & J. Perfume)",
        price: 14500,
        category: "baskets",
        description: "Luxury wooden basket with an unstitched branded designer dress, elegant wristwatch, purse, and authentic J. (Junaid Jamshed) Perfume.",
        image: "/images/packages/engagement-baat-pakki/item-8-dress-watch-perfume.webp",
      },
      {
        id: "item-9",
        name: "Large Wooden Decorated Basket (Embroidered Shawl & Heels)",
        price: 10500,
        category: "baskets",
        description: "Large ceremonial wooden basket with black heavy gold-embroidered velvet shawl, designer heels, and bridal watch set.",
        image: "/images/packages/engagement-baat-pakki/item-9-embroidered-shawl-heels.webp",
      },
      {
        id: "item-10",
        name: "Grand Loaded Snack Basket with Imported Flowers",
        price: 5500,
        category: "baskets",
        description: "Lavish celebration snack basket with Lays 4x, Noms nachos 2x, Pop Nosh popcorn, Cocomo 2x, Kurkure, wafers, Frisky, Heaven biscuits, Nestle cold coffee, Fabulous biscuits, Dairy Milk, Nestle juices, Pepsi, Danisa butter cookies & floral accents.",
        image: "/images/packages/engagement-baat-pakki/item-10-loaded-snack-basket.webp",
      },
    ],
  },
  {
    id: "pkg-husband-dad",
    title: "Birthday Package for Husband & Dad",
    category_tag: "For Him",
    price: 23500,
    original_price: 26000,
    badge: "Luxury Gift Suite",
    highlight:
      "Grand men's trousseau & pampering suite in a decorated wooden basket with branded apparel, footwear, signature perfumes, illuminated moon frame & giant Bobo balloon.",
    description:
      "Specially crafted for husbands and fathers. Features a handcrafted pipe cleaner lily bouquet, 2 branded shirts & trousers in a decorated wooden basket, Luofu comfort slippers, face wash, J. Zarar body spray, Maaz Safder perfume, crystal crescent moon photo frame with 2 pictures, illuminated Bobo balloon with fairy lights, and 5 personalized wishes cards.",
    images: [
      "/images/packages/birthday-husband-dad/husband-dad-master.webp",
      "/images/packages/birthday-husband-dad/husband-dad-3.jpeg",
      "/images/packages/birthday-husband-dad/husband-dad-perfume-moon.webp",
      "/images/packages/birthday-husband-dad/husband-dad-bobo-balloon.webp",
      "/images/packages/birthday-husband-dad/husband-dad-shirts-basket.webp",
    ],
    items: [
      {
        id: "item-hd-1",
        name: "Handcrafted Pipe Cleaner Lily Flowers Bouquet",
        price: 3500,
        category: "bouquets",
        description: "Artisanal red and white lily blooms handcrafted with soft pipe cleaners, pearls, frosted newspaper-print wrap, and red satin bow.",
        image: "/images/packages/birthday-husband-dad/husband-dad-3.jpeg",
      },
      {
        id: "item-hd-2",
        name: "Decorated Wooden Basket (2 Branded Shirts & Trousers)",
        price: 8500,
        category: "baskets",
        description: "Handcrafted decorated wooden trousseau basket carrying 2 premium branded shirts and stylish trousers with fairy lights and ribbon trim.",
        image: "/images/packages/birthday-husband-dad/husband-dad-shirts-basket.webp",
      },
      {
        id: "item-hd-3",
        name: "Luofu Luxury Slippers & Men's Grooming Set",
        price: 5500,
        category: "apparel",
        description: "Authentic Luofu comfort slippers paired with revitalizing face wash, J. (Junaid Jamshed) Zarar body spray, and fragrance spray.",
        image: "/images/packages/birthday-husband-dad/husband-dad-master.webp",
      },
      {
        id: "item-hd-4",
        name: "Maaz Safder Signature Perfume & Crystal Moon Photo Frame",
        price: 4500,
        category: "apparel",
        description: "Authentic Maaz Safder luxury perfume bottle paired with an illuminated gold crystal crescent moon frame carrying 2 personalized photos.",
        image: "/images/packages/birthday-husband-dad/husband-dad-perfume-moon.webp",
      },
      {
        id: "item-hd-5",
        name: "Giant Illuminated Bobo Balloon & 5 Custom Wishes Cards",
        price: 1500,
        category: "balloons",
        description: "Clear helium Bobo balloon filled with black and gold balloons, warm micro fairy lights, Best Dad Ever card, and 5 personalized birthday wish cards.",
        image: "/images/packages/birthday-husband-dad/husband-dad-bobo-balloon.webp",
      },
    ],
  },
  {
    id: "pkg-for-him",
    title: "Birthday Package for Him",
    category_tag: "For Him",
    price: 14000,
    original_price: 16000,
    badge: "Popular Birthday Set",
    highlight:
      "Gourmet Rehmat-e-Shereen fudge cake in an illuminated PVP display box paired with an ORSGA designer watch, wallet, shirt & birthday cards.",
    description:
      "The quintessential birthday surprise for him. Features a 1-pound gourmet Rehmat-e-Shereen chocolate cake presented in a transparent display box with warm fairy lights and gold acrylic topper, paired with a deluxe black keepsake gift box containing a designer shirt, genuine leather wallet, authentic ORSGA men's wristwatch, and happy birthday bunting.",
    images: [
      "/images/packages/birthday-for-him/birthday-him-cover.webp",
      "/images/packages/birthday-for-him/birthday-him-overview.webp",
      "/images/packages/birthday-for-him/birthday-him-accessories.webp",
      "/images/packages/birthday-for-him/birthday-him-giftbox.webp",
    ],
    items: [
      {
        id: "item-fh-1",
        name: "1-Pound Rehmat-e-Shereen Cake in Decorated PVP Box",
        price: 4200,
        category: "cakes",
        description: "Rich 1-pound chocolate fudge cake from Rehmat-e-Shereen presented in an illuminated transparent PVP box with fairy lights and gold Happy Birthday topper.",
        image: "/images/packages/birthday-for-him/birthday-him-cover.webp",
      },
      {
        id: "item-fh-2",
        name: "Premium Designer Shirt in Decorated Box",
        price: 3800,
        category: "apparel",
        description: "Crisp designer dress shirt tied with crimson satin ribbon, displayed in a deluxe keepsake gift box with mini Happy Birthday banner bunting.",
        image: "/images/packages/birthday-for-him/birthday-him-accessories.webp",
      },
      {
        id: "item-fh-3",
        name: "Authentic ORSGA Men's Wristwatch with Presentation Box",
        price: 3800,
        category: "apparel",
        description: "Classic black leather-strap ORSGA men's timepiece with precision chronograph dial in its official luxury emerald presentation case with warranty card.",
        image: "/images/packages/birthday-for-him/birthday-him-accessories.webp",
      },
      {
        id: "item-fh-4",
        name: "Genuine Leather Wallet with Fairy Lights & Wish Cards",
        price: 2200,
        category: "apparel",
        description: "Sleek black textured leather bifold wallet with button clasp presented in a gift case with warm micro fairy lights and custom birthday messages.",
        image: "/images/packages/birthday-for-him/birthday-him-accessories.webp",
      },
    ],
  },
  {
    id: "pkg-midnight-bsf",
    title: "Midnight Surprise for Best Friend (BSF)",
    category_tag: "For Best Friend",
    price: 11799,
    original_price: 13500,
    badge: "Midnight Special",
    highlight:
      "Delightful celebration ensemble featuring a loaded candy bouquet, 2-pound red velvet calendar cake, fresh pink roses bouquet, trending Pop Bags hobo bag & 2 illuminated Bobo balloons.",
    description:
      "The ultimate midnight doorstep surprise for your best friend. Includes a tall confectionery bouquet packed with Lays, Cocomo, marshmallows, smile donuts, Knorr, Dairy Milk & Chilli Milli, a 2lb customized red velvet calendar cake with gold acrylic topper, a fresh pink roses bouquet wrapped in luxury white sheets, a trending Pinterest hobo bag from Pop Bags, and 2 illuminated Bobo balloons with fairy lights.",
    images: [
      "/images/packages/midnight-bsf/midnight-bsf-cover.webp",
      "/images/packages/midnight-bsf/midnight-bsf-group.webp",
      "/images/packages/midnight-bsf/midnight-bsf-candy-bouquet.webp",
      "/images/packages/midnight-bsf/midnight-bsf-roses-bouquet.webp",
      "/images/packages/midnight-bsf/midnight-bsf-calendar-cake.webp",
    ],
    items: [
      {
        id: "item-bsf-1",
        name: "Loaded Confectionery Candy Bouquet",
        price: 3200,
        category: "bouquets",
        description: "Artfully assembled giant candy bouquet packed with Lays 2x, Cocomo 2x, Marshmallows 2x, Smile Donuts 2x, Knorr Chatpatta 3x, Yums, Dairy Milk 2x, and Chilli Milli 5x with satin bow.",
        image: "/images/packages/midnight-bsf/midnight-bsf-candy-bouquet.webp",
      },
      {
        id: "item-bsf-2",
        name: "2-Pound Red Velvet Customized Calendar Cake",
        price: 3800,
        category: "cakes",
        description: "Fresh gourmet 2-pound red velvet cake adorned with calendar birthday date marker, gold spherical pearls, and an acrylic Happy Birthday topper.",
        image: "/images/packages/midnight-bsf/midnight-bsf-calendar-cake.webp",
      },
      {
        id: "item-bsf-3",
        name: "Fresh Pink Roses Bouquet with Premium White Wrap",
        price: 2400,
        category: "bouquets",
        description: "Lush bouquet of freshly plucked deep pink celebration roses enveloped in frosted white luxury florist paper and calligraphy ribbon.",
        image: "/images/packages/midnight-bsf/midnight-bsf-roses-bouquet.webp",
      },
      {
        id: "item-bsf-4",
        name: "Trending Pinterest Hobo Bag from Pop Bags",
        price: 1500,
        category: "apparel",
        description: "Chic glossy brown shoulder hobo bag from Pop Bags with round top handle and crossbody strap, presented in its brand dust bag.",
        image: "/images/packages/midnight-bsf/midnight-bsf-cover.webp",
      },
      {
        id: "item-bsf-5",
        name: "Pair of Illuminated Bobo Balloons with Fairy Lights",
        price: 899,
        category: "balloons",
        description: "Two crystal-clear Bobo balloons entwined with glowing warm micro fairy lights on presentation sticks.",
        image: "/images/packages/midnight-bsf/midnight-bsf-cover.webp",
      },
    ],
  },
];

export default function PackagesShowcase() {
  const [packages, setPackages] = useState<PackageData[]>(DEFAULT_PACKAGES_LIST);
  const [activePkgId, setActivePkgId] = useState<string>("pkg-baat-pakki");
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Gallery swipe tracking
  const galleryTouchStartX = useRef<number | null>(null);
  const galleryTouchStartY = useRef<number | null>(null);

  // Fetch all packages from Supabase
  useEffect(() => {
    async function fetchPackages() {
      try {
        const { data, error } = await supabase
          .from("wedding_packages")
          .select("*")
          .order("price", { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const loaded: PackageData[] = data.map((d) => ({
            id: d.id,
            title: d.title,
            category_tag: d.category_tag || "Celebration Suite",
            price: Number(d.price),
            original_price: d.original_price ? Number(d.original_price) : undefined,
            badge: d.badge || "Signature Package",
            highlight: d.highlight || "",
            description: d.description || "",
            images: Array.isArray(d.images) && d.images.length > 0 ? d.images : ["/images/packages/engagement-baat-pakki/baat-pakki-4.jpeg"],
            items: Array.isArray(d.items) ? d.items : [],
            is_active: d.is_active !== false,
          }));
          setPackages(loaded);
        }
      } catch (err) {
        console.error("Using default packages list:", err);
      }
    }

    fetchPackages();

    const channel = supabase
      .channel("realtime-packages-showcase")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wedding_packages" },
        () => fetchPackages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // When switching packages, reset image index to 0 and scroll down smoothly to content
  const handleSelectPackage = (id: string) => {
    setActivePkgId(id);
    setActiveImageIdx(0);

    setTimeout(() => {
      const showcaseEl = document.getElementById("active-package-showcase");
      if (showcaseEl) {
        showcaseEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  const currentPkg =
    packages.find((p) => p.id === activePkgId) || packages[0] || DEFAULT_PACKAGES_LIST[0];

  const totalImages = currentPkg.images.length;
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

  return (
    <section id="packages-showcase" className="relative pb-16 sm:pb-24 bg-[#fce3e0] z-10">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        
        {/* ── 1. PACKAGE SELECTOR TABS (4 SIGNATURE SUITES) ── */}
        <div className="mb-8 sm:mb-12 max-w-6xl mx-auto">
          <div className="text-center mb-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-maroon/60">
              Select Signature Package
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {packages.map((pkg) => {
              const isSelected = pkg.id === currentPkg.id;

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => handleSelectPackage(pkg.id)}
                  className={`group relative rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-300 cursor-pointer flex items-center gap-3.5 overflow-hidden border ${
                    isSelected
                      ? "bg-white border-rose shadow-[0_16px_36px_rgba(226,64,92,0.18)] ring-2 ring-rose/30 scale-[1.02]"
                      : "bg-white/85 hover:bg-white border-rose/15 hover:border-rose/35 shadow-xs hover:shadow-md hover:scale-[1.01]"
                  }`}
                >
                  {/* Subtle Top Gold/Rose Accent on Active Card */}
                  {isSelected && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose via-[#f5c058] to-rose" />
                  )}

                  {/* Thumbnail Image */}
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-[#fdf2f4] flex-shrink-0 border border-rose/15 group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={pkg.images[0]}
                      alt={pkg.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-rose truncate">
                        {pkg.category_tag}
                      </span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose animate-pulse flex-shrink-0" />
                      )}
                    </div>

                    <h4 className="font-serif font-bold text-xs sm:text-[13px] text-maroon truncate leading-snug group-hover:text-rose transition-colors">
                      {pkg.title}
                    </h4>

                    <div className="mt-1 flex items-baseline justify-between gap-1">
                      <span className="font-display font-black text-sm sm:text-base text-maroon">
                        PKR {pkg.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-semibold text-maroon/40 uppercase tracking-wider">
                        {pkg.items.length} pieces
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 2. ACTIVE PACKAGE GRAND HERO SHOWCASE ── */}
        <div id="active-package-showcase" className="max-w-5xl mx-auto rounded-[32px] sm:rounded-[40px] bg-white border border-rose/20 shadow-[0_20px_50px_rgba(107,21,53,0.1)] overflow-hidden p-5 sm:p-8 lg:p-10 animate-in fade-in duration-300 scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Left Column: Big Lookbook Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div
                onTouchStart={onGalleryTouchStart}
                onTouchEnd={onGalleryTouchEnd}
                className="relative w-full aspect-[4/3] rounded-[24px] sm:rounded-[32px] overflow-hidden bg-[#f8e6e8] select-none touch-pan-y group"
              >
                <Image
                  src={currentPkg.images[activeImageIdx] || currentPkg.images[0]}
                  alt={`${currentPkg.title} photo ${activeImageIdx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-maroon border border-white/60 shadow-sm">
                    <span>{currentPkg.category_tag}</span>
                  </span>

                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md shadow-sm">
                    Photo {activeImageIdx + 1} of {totalImages}
                  </span>
                </div>

                {/* Left / Right Navigation */}
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

              {/* Thumbnails strip */}
              {totalImages > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto py-2 px-1 no-scrollbar">
                  {currentPkg.images.map((imgUrl, idx) => (
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
                        alt={`Thumb ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Package Details & Inclusions */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-rose">
                  {currentPkg.badge}
                </span>
                <h3 className="font-serif font-black text-2xl sm:text-3xl text-maroon mt-1 leading-tight">
                  {currentPkg.title}
                </h3>

                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-display font-black text-3xl sm:text-4xl text-maroon">
                    PKR {currentPkg.price.toLocaleString()}
                  </span>
                  {currentPkg.original_price && (
                    <span className="text-base text-maroon/40 line-through font-body">
                      PKR {currentPkg.original_price.toLocaleString()}
                    </span>
                  )}
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 ml-auto">
                    All-Inclusive
                  </span>
                </div>
              </div>

              <p className="font-body text-xs sm:text-sm text-maroon/75 leading-relaxed">
                {currentPkg.description}
              </p>

              {/* What's Included: Clean Elegant List */}
              <div className="rounded-2xl bg-[#fdf5f6] border border-rose/15 p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-rose/15">
                  <span className="font-body font-bold text-xs uppercase tracking-wider text-maroon">
                    What&apos;s Included ({currentPkg.items.length} Pieces):
                  </span>
                  <span className="text-[11px] font-bold text-rose">Decorated &amp; Ready</span>
                </div>

                <div className="space-y-2 text-xs sm:text-[13px] text-maroon/85 font-medium max-h-[220px] overflow-y-auto pr-1">
                  {currentPkg.items.map((item, idx) => (
                    <div key={item.id} className="flex items-start gap-2.5">
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
                <button
                  type="button"
                  onClick={async () => {
                    const msg = await formatMultiItemOrder({
                      title: `Complete "${currentPkg.title}" (${currentPkg.category_tag})`,
                      items: currentPkg.items.map((it) => ({
                        id: it.id,
                        name: it.name,
                        price: it.price,
                        image: it.image,
                      })),
                      totalPrice: currentPkg.price,
                    });
                    window.open(getWhatsAppUrl(msg), "_blank");
                  }}
                  className="w-full inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white py-4 px-6 rounded-full font-body font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Book Complete Suite (PKR {currentPkg.price.toLocaleString()})</span>
                </button>

                {/* Link to Master Custom Studio */}
                <div className="text-center pt-1">
                  <Link
                    href="/custom"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose hover:text-maroon transition-colors"
                  >
                    <span>Want to pick individual items or mix &amp; match pieces?</span>
                    <span className="underline">Custom Studio &rarr;</span>
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ── 3. BOTTOM CALLOUT TO MASTER CUSTOM STUDIO ── */}
        <div className="mt-12 max-w-4xl mx-auto text-center p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-rose/15 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose">
                Need Total Freedom?
              </span>
              <h4 className="font-serif font-bold text-lg text-maroon">
                Design Your Own Bespoke Hamper in Custom Studio
              </h4>
              <p className="font-body text-xs text-maroon/70">
                Choose from all 24+ ceremonial items, chocolates, cakes, and flowers with live price tallying.
              </p>
            </div>

            <Link
              href="/custom"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <Layers className="w-4 h-4" />
              <span>Open Custom Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
