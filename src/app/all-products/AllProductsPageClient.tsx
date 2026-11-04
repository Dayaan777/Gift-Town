"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createPortal } from "react-dom";
import Navbar from "@/components/Navbar";
import StickerBadge from "@/components/StickerBadge";
import QuickViewMediaGallery, { MediaItem } from "@/components/QuickViewMediaGallery";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Filter,
  Flame,
  Star,
  Heart,
  MessageCircle,
  ArrowRight,
  PackageOpen,
  ArrowUpDown,
  ShoppingBag,
} from "lucide-react";

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="min-h-[300px] bg-[#fff8f9]" />,
});

export interface UnifiedProduct {
  id: string;
  name: string;
  categoryTag: string;
  category: string;
  badge?: string;
  isBestseller?: boolean;
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

// Baseline products in case of initial load or fallback
const DEFAULT_COMBINED_PRODUCTS: UnifiedProduct[] = [
  {
    id: "prod-1",
    name: "Heart-Shaped Money & Lights Bouquet",
    categoryTag: "Currency & Floral Bouquet",
    category: "bouquets",
    badge: "Most Loved",
    isBestseller: true,
    price: "6,500",
    originalPrice: "7,800",
    rating: 5.0,
    reviewsCount: 58,
    highlight: "100+ artfully folded currency cones with warm micro fairy lights and fresh white roses.",
    image: "/images/products/heart-money-lights-bouquet.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Heart-Shaped Money & Lights Bouquet'.",
  },
  {
    id: "prod-2",
    name: "Candy Pillow Box & Treats Favor",
    categoryTag: "Boutique Treat Box",
    category: "boxes",
    badge: "Trending",
    isBestseller: true,
    price: "3,800",
    originalPrice: "4,500",
    rating: 4.9,
    reviewsCount: 42,
    highlight: "Clear acetate candy pillow box with flared ribbon wings, Ferrero Rocher & movie snacks.",
    image: "/images/products/candy-pillow-treats.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Candy Pillow Box & Treats Favor'.",
  },
  {
    id: "prod-3",
    name: "Snack & Love Apology Bouquet",
    categoryTag: "Snack & Floral Bouquet",
    category: "bouquets",
    badge: "Bestseller",
    isBestseller: true,
    price: "4,200",
    originalPrice: "5,000",
    rating: 4.8,
    reviewsCount: 39,
    highlight: "Savory chips, imported wafers and cheerful yellow florals wrapped in black satin.",
    image: "/images/products/snack-apology-bouquet.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Snack & Love Apology Bouquet'.",
  },
  {
    id: "prod-4",
    name: "Ferrero Rocher & Scented Rose Heart Box",
    categoryTag: "Luxury Keepsake Box",
    category: "boxes",
    badge: "Signature",
    isBestseller: true,
    price: "5,500",
    originalPrice: "6,500",
    rating: 5.0,
    reviewsCount: 64,
    highlight: "Golden Ferrero truffles paired with velvet-touch scented roses in a keepsake gift box.",
    image: "/images/products/ferrero-rose-heart-box.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Ferrero Rocher & Scented Rose Heart Box'.",
  },
  {
    id: "cat-4",
    name: "Ferrero Rocher & Red Rose Luxury Cone",
    categoryTag: "Deluxe Chocolate Cone",
    category: "chocolates",
    badge: "Romantic",
    price: "4,800",
    originalPrice: "5,500",
    rating: 4.9,
    reviewsCount: 37,
    highlight: "Golden pyramid of Ferrero Rocher crowned with fresh deep red roses and golden trailing ribbons.",
    image: "/images/products/ferrero-rose-heart-box.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Ferrero Rocher & Red Rose Luxury Cone'.",
  },
  {
    id: "cat-5",
    name: "Grand Celebration Goodies Basket",
    categoryTag: "Celebration Hamper",
    category: "hampers",
    badge: "Grand Size",
    price: "8,500",
    originalPrice: "10,000",
    rating: 5.0,
    reviewsCount: 52,
    highlight: "Hand-woven basket loaded with artisan cookies, chocolates, sparkling drinks & balloons.",
    image: "/images/products/snack-apology-bouquet.png",
    whatsappMessage: "Hi Gift Town! I want to order the 'Grand Celebration Goodies Basket'.",
  },
];

export default function AllProductsPage() {
  const [products, setProducts] = useState<UnifiedProduct[]>(DEFAULT_COMBINED_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [previewItem, setPreviewItem] = useState<UnifiedProduct | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products from Supabase (all_products table primarily, with fallback to bestsellers + featured_products)
  useEffect(() => {
    async function loadAllProducts() {
      try {
        // 1. Try to load directly from all_products table
        const { data: allProdData, error: allProdErr } = await supabase
          .from("all_products")
          .select("*")
          .order("display_order", { ascending: true });

        if (!allProdErr && Array.isArray(allProdData) && allProdData.length > 0) {
          const mapped = allProdData
            .filter((item) => item.is_active !== false)
            .map((item) => ({
              id: item.id,
              name: item.name,
              categoryTag: item.category_tag || "Boutique Creation",
              category: item.category || "bouquets",
              badge: item.badge || (item.is_bestseller ? "Bestseller" : "Featured"),
              isBestseller: !!item.is_bestseller,
              price: item.price,
              originalPrice: item.original_price || undefined,
              rating: item.rating ? Number(item.rating) : 5.0,
              reviewsCount: item.reviews_count ? Number(item.reviews_count) : 40,
              highlight: item.highlight || "",
              image: item.image,
              whatsappMessage: item.whatsapp_message || `Hi Gift Town! I want to order "${item.name}".`,
              media_gallery: item.media_gallery || [],
              image_scale: item.image_scale,
              image_position: item.image_position,
              image_offset_y: item.image_offset_y,
              image_offset_x: item.image_offset_x,
            }));

          if (mapped.length > 0) {
            setProducts(mapped);
            return;
          }
        }

        // 2. Fallback: Combine featured_bestsellers and featured_products
        const [bsRes, fpRes] = await Promise.all([
          supabase.from("featured_bestsellers").select("*").order("display_order", { ascending: true }),
          supabase.from("featured_products").select("*").order("display_order", { ascending: true }),
        ]);

        const combinedMap = new Map<string, UnifiedProduct>();

        // 1. Add bestsellers
        if (!bsRes.error && Array.isArray(bsRes.data)) {
          bsRes.data
            .filter((item) => item.is_active !== false)
            .forEach((item) => {
              combinedMap.set(item.name.toLowerCase().trim(), {
                id: item.id,
                name: item.name,
                categoryTag: item.category_tag || "Signature Gift",
                category: item.category || "bouquets",
                badge: item.badge || "Bestseller",
                isBestseller: true,
                price: item.price,
                originalPrice: item.original_price || undefined,
                rating: item.rating ? Number(item.rating) : 5.0,
                reviewsCount: item.reviews_count ? Number(item.reviews_count) : 40,
                highlight: item.highlight || "",
                image: item.image,
                whatsappMessage: item.whatsapp_message || `Hi Gift Town! I want to order "${item.name}".`,
                media_gallery: item.media_gallery || [],
                image_scale: item.image_scale,
                image_position: item.image_position,
                image_offset_y: item.image_offset_y,
                image_offset_x: item.image_offset_x,
              });
            });
        }

        // 2. Add featured catalog products (merge or add)
        if (!fpRes.error && Array.isArray(fpRes.data)) {
          fpRes.data
            .filter((item) => item.is_active !== false)
            .forEach((item) => {
              const key = item.name.toLowerCase().trim();
              if (combinedMap.has(key)) {
                const existing = combinedMap.get(key)!;
                if (!existing.media_gallery?.length && item.media_gallery?.length) {
                  existing.media_gallery = item.media_gallery;
                }
              } else {
                combinedMap.set(key, {
                  id: item.id,
                  name: item.name,
                  categoryTag: item.category_tag || "Boutique Creation",
                  category: item.category || "bouquets",
                  badge: item.badge || "Featured",
                  isBestseller: false,
                  price: item.price,
                  originalPrice: item.original_price || undefined,
                  rating: item.rating ? Number(item.rating) : 4.9,
                  reviewsCount: item.reviews_count ? Number(item.reviews_count) : 30,
                  highlight: item.highlight || "",
                  image: item.image,
                  whatsappMessage: item.whatsapp_message || `Hi Gift Town! I want to order "${item.name}".`,
                  media_gallery: item.media_gallery || [],
                  image_scale: item.image_scale,
                  image_position: item.image_position,
                  image_offset_y: item.image_offset_y,
                  image_offset_x: item.image_offset_x,
                });
              }
            });
        }

        if (combinedMap.size > 0) {
          setProducts(Array.from(combinedMap.values()));
        }
      } catch (err) {
        console.error("Using default combined products catalog:", err);
      }
    }

    loadAllProducts();

    // Setup realtime subscription so admin changes appear immediately
    const channel = supabase
      .channel("realtime-all-products-page")
      .on("postgres_changes", { event: "*", schema: "public", table: "all_products" }, () => loadAllProducts())
      .on("postgres_changes", { event: "*", schema: "public", table: "featured_bestsellers" }, () => loadAllProducts())
      .on("postgres_changes", { event: "*", schema: "public", table: "featured_products" }, () => loadAllProducts())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Lock body scroll during quick-view modal
  useEffect(() => {
    if (previewItem) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [previewItem]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory === "all") return true;
        if (selectedCategory === "bestsellers") return p.isBestseller || p.badge?.toLowerCase().includes("bestseller");
        return p.category === selectedCategory;
      })
      .filter((p) => {
        // Search query filter
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.categoryTag.toLowerCase().includes(q) ||
          p.highlight.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const cleanPriceA = Number(a.price.replace(/[^0-9]/g, "")) || 0;
        const cleanPriceB = Number(b.price.replace(/[^0-9]/g, "")) || 0;

        if (sortBy === "price-asc") return cleanPriceA - cleanPriceB;
        if (sortBy === "price-desc") return cleanPriceB - cleanPriceA;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "bestsellers", label: "Bestsellers" },
    { id: "bouquets", label: "Bouquets" },
    { id: "hampers", label: "Hampers" },
    { id: "boxes", label: "Gift Boxes" },
    { id: "chocolates", label: "Chocolates" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fce3e0] selection:bg-rose selection:text-white">
      {/* Navbar */}
      <Navbar />

      <main className="flex-1 w-full overflow-x-clip">
        {/* Header Banner */}
        <div className="relative pt-10 sm:pt-14 pb-8 sm:pb-12 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-3">
            <StickerBadge variant="rose" rotate="-2" size="sm">
              <span>Complete Boutique Catalog</span>
            </StickerBadge>
          </div>

          <h1 className="font-display font-black text-[clamp(32px,6vw,56px)] text-rose leading-[1.05] tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(226,64,92,0.1)]">
            ALL PRODUCTS &amp; GIFTS
          </h1>

          <p className="font-body font-medium text-sm sm:text-base text-maroon/80 mt-3 max-w-2xl mx-auto leading-relaxed">
            Explore our handcrafted gift collections: currency cones, fresh floral blooms, sweet hampers, keepsake boxes, and celebratory gifts. Click any card for quick details and media preview.
          </p>

          {/* Search & Sort Controls Bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-3xl mx-auto">
            {/* Search input */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-maroon/40 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bouquets, hampers, chocolates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white/95 backdrop-blur-md border border-rose/25 text-maroon font-medium text-xs sm:text-sm placeholder:text-maroon/40 focus:outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 shadow-sm"
              />
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto appearance-none pl-9 pr-8 py-3 rounded-full bg-white/95 backdrop-blur-md border border-rose/25 text-maroon font-bold text-xs uppercase tracking-wider focus:outline-none focus:border-rose shadow-sm cursor-pointer"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-maroon/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filter Pills Ribbon - Wrapped cleanly for mobile & desktop */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-2xl mx-auto px-1">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-body font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === c.id
                    ? "bg-rose text-white shadow-md scale-102"
                    : "bg-white/80 text-maroon/75 hover:bg-white hover:text-maroon border border-rose/15"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Results count tally */}
          <div className="mt-3 text-xs font-semibold text-maroon/60">
            Showing {filteredProducts.length} handcrafted products
          </div>
        </div>

        {/* Products Grid - 2 columns on mobile, 3 on md/lg, 4 on xl */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-20 sm:pb-28">
          {filteredProducts.length === 0 ? (
            <div className="bg-white/80 rounded-3xl p-12 text-center border border-rose/15 max-w-md mx-auto space-y-3">
              <PackageOpen className="w-10 h-10 text-rose/50 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-maroon">No matching products found</h3>
              <p className="font-body text-xs text-maroon/60">
                Try searching for something else or clear the filters.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-5 py-2 rounded-full bg-rose text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow-md cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => {
                const isLiked = !!likedIds[product.id];

                return (
                  <div
                    key={product.id}
                    onClick={() => setPreviewItem(product)}
                    className="group relative w-full rounded-2xl sm:rounded-[28px] bg-white border border-rose/15 shadow-[0_6px_20px_rgba(107,21,53,0.05)] hover:shadow-[0_18px_42px_rgba(107,21,53,0.12)] hover:border-rose/30 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                  >
                    {/* Upper Photo Window */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl sm:rounded-t-[28px] bg-[#f8e6e8]">
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
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover"
                          style={{
                            objectPosition: product.image_position || "center",
                          }}
                        />
                      </div>

                      {/* Scrims */}
                      <div className="absolute inset-x-0 top-0 h-12 sm:h-16 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none" />
                      <div className="absolute inset-x-0 bottom-0 h-6 sm:h-8 bg-gradient-to-t from-white/80 to-transparent z-10 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2 inset-x-2 sm:top-3 sm:inset-x-3 z-20 flex items-center justify-between pointer-events-none">
                        {product.badge ? (
                          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-white/95 backdrop-blur-md text-maroon border border-white/60 shadow-xs">
                            <span>{product.badge}</span>
                          </span>
                        ) : (
                          <span />
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(product.id);
                          }}
                          className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-md border border-white/60 flex items-center justify-center text-maroon/70 hover:text-rose hover:bg-white shadow-xs transition-all active:scale-90 cursor-pointer"
                          aria-label="Save to favorites"
                        >
                          <Heart
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
                              isLiked ? "fill-rose text-rose" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Media counter indicator if has secondary photos/videos */}
                      {product.media_gallery && product.media_gallery.length > 0 && (
                        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 z-20 pointer-events-none">
                          <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md">
                            +{product.media_gallery.length} Media
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Lower Content */}
                    <div className="p-2.5 sm:p-5 flex flex-col justify-between flex-1 space-y-2 sm:space-y-3">
                      <div>
                        {/* Rating & Tag */}
                        <div className="flex items-center justify-between text-xs mb-1 font-body">
                          <span className="font-semibold text-[9px] sm:text-[10px] uppercase tracking-wider text-rose truncate max-w-[65%]">
                            {product.categoryTag}
                          </span>
                          <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold text-[10px] sm:text-[11px]">
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                            <span>{product.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-serif font-bold text-xs sm:text-base text-maroon group-hover:text-rose transition-colors duration-200 line-clamp-1 leading-snug">
                          {product.name}
                        </h3>

                        {/* Highlight */}
                        <p className="font-body text-[11px] sm:text-xs text-maroon/70 line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
                          {product.highlight}
                        </p>
                      </div>

                      {/* Price & Direct Order Action */}
                      <div className="pt-2 sm:pt-3 border-t border-rose/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1.5 sm:gap-2">
                        <div>
                          <span className="block text-[8px] sm:text-[9px] uppercase font-bold tracking-widest text-maroon/50">
                            Price
                          </span>
                          <div className="flex items-baseline gap-1 sm:gap-1.5">
                            <span className="font-display font-black text-xs sm:text-base text-maroon whitespace-nowrap">
                              PKR {product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[10px] sm:text-xs text-maroon/40 line-through font-body whitespace-nowrap">
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
                          className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] hover:to-[#bd2841] text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-body font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-xs hover:shadow-md transition-all hover:scale-102 active:scale-95 group/btn"
                        >
                          <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>Order</span>
                          <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* ── Quick Inspect Modal (Portalled to document.body) ── */}
      {mounted && previewItem && createPortal(
        <div
          className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 pt-2 pb-8 sm:p-5 overflow-hidden animate-in fade-in duration-200"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative w-full max-w-md md:max-w-[480px] bg-white rounded-[28px] sm:rounded-[32px] p-4 sm:p-6 shadow-2xl border border-rose/25 max-h-[86vh] sm:max-h-[88vh] -translate-y-2 sm:translate-y-0 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-rose/15 flex-shrink-0">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-rose">
                {previewItem.badge} &bull; {previewItem.categoryTag}
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
            <div className="overflow-y-auto flex-1 pr-1.5 -mr-1.5 my-3 space-y-3.5 overscroll-contain">
              {/* Media Gallery (Portrait Video & Photos) */}
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

              {/* What's Included Description */}
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

            {/* Sticky Order Action Button */}
            <div className="pt-3 border-t border-rose/15 flex-shrink-0">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(previewItem.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-rose to-[#d43751] hover:from-[#d43751] text-white py-2.5 sm:py-3 rounded-full font-body font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Confirm &amp; Book on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
